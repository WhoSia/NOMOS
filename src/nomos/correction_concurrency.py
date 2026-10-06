from __future__ import annotations

from collections import defaultdict, deque
from typing import Any

CORRECTION_DIMENSIONS = {
    "factual",
    "provenance",
    "semantic",
    "authority",
    "temporal",
    "regime",
    "consequence",
}


def _events(packet: dict[str, Any]) -> dict[str, dict[str, Any]]:
    return {
        str(item["id"]): item
        for item in packet.get("events", [])
        if item.get("id")
    }


def _parents(event: dict[str, Any]) -> set[str]:
    return {str(x) for x in event.get("parents", []) if x}


def _dimensions(event: dict[str, Any]) -> set[str]:
    return {
        str(x)
        for x in event.get("dimensions", [])
        if str(x) in CORRECTION_DIMENSIONS
    }


def _scope(event: dict[str, Any]) -> str:
    return str(event.get("scope", "default"))


def ancestry(packet: dict[str, Any]) -> dict[str, set[str]]:
    events = _events(packet)
    memo: dict[str, set[str]] = {}

    def walk(eid: str, visiting: set[str]) -> set[str]:
        if eid in memo:
            return set(memo[eid])
        if eid in visiting:
            return set()
        visiting = set(visiting)
        visiting.add(eid)
        out: set[str] = set()
        event = events.get(eid, {})
        for parent in _parents(event):
            if parent in events:
                out.add(parent)
                out |= walk(parent, visiting)
        memo[eid] = set(out)
        return out

    for eid in events:
        walk(eid, set())
    return memo


def relation(packet: dict[str, Any], left: str, right: str) -> str:
    if left == right:
        return "equal"
    anc = ancestry(packet)
    if left in anc.get(right, set()):
        return "before"
    if right in anc.get(left, set()):
        return "after"
    return "concurrent"


def active_frontier(packet: dict[str, Any]) -> list[str]:
    events = _events(packet)
    anc = ancestry(packet)
    maximal = []
    for eid in events:
        if not any(
            eid != other and eid in anc.get(other, set())
            for other in events
        ):
            maximal.append(eid)
    return sorted(maximal)


def _superseded_dimensions(
    packet: dict[str, Any],
    predecessor: str,
    successor: str,
) -> set[str]:
    events = _events(packet)
    successor_event = events.get(successor, {})
    result: set[str] = set()
    for item in successor_event.get("supersedes", []):
        if isinstance(item, str):
            if item == predecessor:
                result |= _dimensions(successor_event)
            continue
        if str(item.get("event", "")) != predecessor:
            continue
        if item.get("scope") not in (None, _scope(events.get(predecessor, {}))):
            continue
        dims = {
            str(x)
            for x in item.get("dimensions", [])
            if str(x) in CORRECTION_DIMENSIONS
        }
        result |= dims or _dimensions(successor_event)
    return result


def analyze_correction_concurrency(packet: dict[str, Any]) -> dict[str, Any]:
    """
    Audit concurrent correction events and re-derivation races.

    This surface checks causal/supersession structure only. It never decides
    whether a substantive person-level judgment is true or deserved.
    """
    events = _events(packet)
    findings: list[dict[str, Any]] = []

    def add(code: str, severity: str, message: str, refs: list[str]) -> None:
        findings.append({
            "code": code,
            "severity": severity,
            "message": message,
            "refs": refs,
        })

    # Basic event integrity.
    for eid, event in events.items():
        unknown = sorted(_parents(event) - set(events))
        if unknown:
            add(
                "CR001",
                "ERROR",
                "Correction event references unknown causal parents.",
                [eid, *unknown],
            )
        unknown_dims = sorted(
            {str(x) for x in event.get("dimensions", [])}
            - CORRECTION_DIMENSIONS
        )
        if unknown_dims:
            add(
                "CR002",
                "ERROR",
                "Correction event contains unknown correction dimensions.",
                [eid, *unknown_dims],
            )

    # Detect causal cycles.
    graph = {eid: _parents(event) & set(events) for eid, event in events.items()}
    indegree = {eid: 0 for eid in events}
    children: dict[str, set[str]] = defaultdict(set)
    for eid, parents in graph.items():
        indegree[eid] = len(parents)
        for parent in parents:
            children[parent].add(eid)
    q = deque([eid for eid, degree in indegree.items() if degree == 0])
    visited = 0
    while q:
        eid = q.popleft()
        visited += 1
        for child in children.get(eid, set()):
            indegree[child] -= 1
            if indegree[child] == 0:
                q.append(child)
    if visited != len(events):
        cyclic = sorted(eid for eid, degree in indegree.items() if degree > 0)
        add(
            "CR003",
            "ERROR",
            "Correction-event causal graph contains a cycle.",
            cyclic,
        )

    anc = ancestry(packet)
    frontier = active_frontier(packet)

    # Supersession must be causally downstream and dimension-scoped.
    for successor, event in events.items():
        for item in event.get("supersedes", []):
            predecessor = str(item if isinstance(item, str) else item.get("event", ""))
            if predecessor not in events:
                add(
                    "CR004",
                    "ERROR",
                    "Supersession references an unknown correction event.",
                    [successor, predecessor],
                )
                continue
            if predecessor not in anc.get(successor, set()):
                add(
                    "CR005",
                    "ERROR",
                    "A correction claims supersession without causal ancestry.",
                    [successor, predecessor],
                )
            if not isinstance(item, str):
                dims = {
                    str(x) for x in item.get("dimensions", [])
                    if str(x) in CORRECTION_DIMENSIONS
                }
                if not dims:
                    add(
                        "CR006",
                        "ERROR",
                        "Scoped supersession omits the dimensions it supersedes.",
                        [successor, predecessor],
                    )

    # Concurrent overlaps must not silently use last-writer-wins.
    event_ids = sorted(events)
    concurrent_pairs: list[dict[str, Any]] = []
    for i, left in enumerate(event_ids):
        for right in event_ids[i + 1:]:
            if relation(packet, left, right) != "concurrent":
                continue
            le = events[left]
            re = events[right]
            overlap = _dimensions(le) & _dimensions(re)
            same_scope = _scope(le) == _scope(re)
            if not overlap or not same_scope:
                classification = "disjoint_or_scope_separated"
            else:
                compatibility = str(
                    packet.get("concurrency_resolutions", {})
                    .get("|".join(sorted([left, right])), {})
                    .get("classification", "unresolved")
                )
                classification = compatibility
                if compatibility == "last_writer_wins":
                    add(
                        "CR007",
                        "ERROR",
                        "Concurrent overlapping corrections are resolved by arrival/last-writer order.",
                        [left, right],
                    )
                elif compatibility == "unresolved":
                    add(
                        "CR008",
                        "ERROR",
                        "Concurrent overlapping corrections lack an explicit compatibility/fork resolution.",
                        [left, right],
                    )
                elif compatibility == "merge":
                    res = (
                        packet.get("concurrency_resolutions", {})
                        .get("|".join(sorted([left, right])), {})
                    )
                    preserved = {str(x) for x in res.get("provenance", [])}
                    if not {left, right}.issubset(preserved):
                        add(
                            "CR009",
                            "ERROR",
                            "Concurrent correction merge does not preserve both correction provenances.",
                            [left, right],
                        )
            concurrent_pairs.append({
                "left": left,
                "right": right,
                "overlap_dimensions": sorted(overlap),
                "same_scope": same_scope,
                "classification": classification,
            })

    job_results: list[dict[str, Any]] = []
    for idx, job in enumerate(packet.get("jobs", []), start=1):
        jid = str(job.get("id") or f"job-{idx}")
        base = {str(x) for x in job.get("base_frontier", [])}
        commit = {str(x) for x in job.get("commit_frontier", frontier)}
        deps = {
            str(x)
            for x in job.get("dependency_dimensions", [])
            if str(x) in CORRECTION_DIMENSIONS
        }
        if not deps:
            deps = set(CORRECTION_DIMENSIONS)

        unknown_base = sorted(base - set(events))
        unknown_commit = sorted(commit - set(events))
        if unknown_base or unknown_commit:
            add(
                "CR010",
                "ERROR",
                "Re-derivation job references unknown correction-frontier events.",
                [jid, *unknown_base, *unknown_commit],
            )

        new_events = commit - base
        relevant_new: set[str] = set()
        for eid in new_events & set(events):
            ev = events[eid]
            if _scope(ev) == str(job.get("scope", "default")) and (_dimensions(ev) & deps):
                relevant_new.add(eid)

        rebased = job.get("rebased") is True
        revalidated = job.get("revalidated_against_commit_frontier") is True
        if relevant_new and not (rebased or revalidated):
            add(
                "CR011",
                "ERROR",
                "A re-derivation job attempts to commit from a stale correction frontier.",
                [jid, *sorted(relevant_new)],
            )

        if str(job.get("authority_reason", "")) == "newer_model_version":
            add(
                "CR012",
                "ERROR",
                "Model-version chronology is used as a substitute for person-authority warrant.",
                [jid],
            )

        restores = str(job.get("restores_state", ""))
        if restores:
            for eid in commit & set(events):
                event = events[eid]
                deauth = {str(x) for x in event.get("deauthorizes", [])}
                if restores not in deauth:
                    continue
                if eid not in base and not (
                    rebased
                    and job.get("fresh_warrant") is True
                    and job.get("fresh_adoption") is True
                ):
                    add(
                        "CR013",
                        "ERROR",
                        "A stale-ancestry write would resurrect a state deauthorized by a newer correction.",
                        [jid, eid, restores],
                    )

        if job.get("uses_wall_clock_as_freshness") is True:
            add(
                "CR014",
                "ERROR",
                "Wall-clock completion time is treated as correction freshness.",
                [jid],
            )

        if relevant_new and job.get("output_same_as_current") is True:
            if not (rebased or revalidated):
                add(
                    "CR015",
                    "ERROR",
                    "Same output is used to excuse stale ancestry without rebase/revalidation.",
                    [jid, *sorted(relevant_new)],
                )

        errors = [
            f["code"]
            for f in findings
            if f["severity"] == "ERROR" and jid in f["refs"]
        ]
        job_results.append({
            "id": jid,
            "base_frontier": sorted(base),
            "commit_frontier": sorted(commit),
            "new_events": sorted(new_events),
            "relevant_new_events": sorted(relevant_new),
            "status": "FAIL" if errors else "PASS",
            "blocking_codes": errors,
        })

    # A completion claim cannot hide unresolved overlapping concurrent heads.
    completion = str(packet.get("completion_claim", "open")).lower()
    unresolved_pairs = [
        pair
        for pair in concurrent_pairs
        if pair["same_scope"]
        and pair["overlap_dimensions"]
        and pair["classification"] in {"unresolved", "last_writer_wins"}
    ]
    failed_jobs = [job for job in job_results if job["status"] == "FAIL"]
    if completion in {"complete", "robust_complete"} and (unresolved_pairs or failed_jobs):
        refs = [job["id"] for job in failed_jobs]
        for pair in unresolved_pairs:
            refs.extend([pair["left"], pair["right"]])
        add(
            "CR016",
            "ERROR",
            "Correction completion is claimed while concurrency conflicts or stale-base jobs remain unresolved.",
            sorted(set(refs)),
        )

    errors = [f for f in findings if f["severity"] == "ERROR"]
    warnings = [f for f in findings if f["severity"] == "WARNING"]

    return {
        "status": "FAIL" if errors else "PASS",
        "rule": (
            "GOVERNING_STATE_IS_A_CORRECTION_FRONTIER; "
            "SUPERSESSION_IS_DIMENSION_SCOPED; "
            "STALE_BASE_WRITES_REQUIRE_REBASE"
        ),
        "frontier": frontier,
        "concurrent_pairs": concurrent_pairs,
        "jobs": job_results,
        "completion_claim": completion,
        "findings": findings,
        "summary": {
            "events": len(events),
            "frontier_heads": len(frontier),
            "concurrent_pairs": len(concurrent_pairs),
            "failed_jobs": len(failed_jobs),
            "errors": len(errors),
            "warnings": len(warnings),
        },
    }
