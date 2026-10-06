from __future__ import annotations

from typing import Any

TASKS = {
    "explain",
    "contest",
    "reconstruct",
    "attribute",
    "resurrection",
    "consequence",
}

BRANCH_STATES = {
    "live_governing",
    "live_conflict",
    "historical_reopenable",
    "historical_minimal",
}


def _branches(packet: dict[str, Any]) -> dict[str, dict[str, Any]]:
    return {
        str(item["id"]): item
        for item in packet.get("branches", [])
        if item.get("id")
    }


def _snapshots(packet: dict[str, Any]) -> dict[str, dict[str, Any]]:
    return {
        str(item["id"]): item
        for item in packet.get("snapshots", [])
        if item.get("id")
    }


def _required_tasks(branch: dict[str, Any]) -> set[str]:
    return {
        str(x)
        for x in branch.get("required_tasks", [])
        if str(x) in TASKS
    }


def _supported_tasks(snapshot: dict[str, Any]) -> set[str]:
    return {
        str(x)
        for x in snapshot.get("supported_tasks", [])
        if str(x) in TASKS
    }


def compaction_debt(
    packet: dict[str, Any],
    branch_id: str,
    snapshot_id: str,
) -> list[str]:
    branches = _branches(packet)
    snapshots = _snapshots(packet)
    branch = branches.get(str(branch_id), {})
    snapshot = snapshots.get(str(snapshot_id), {})
    return sorted(_required_tasks(branch) - _supported_tasks(snapshot))


def analyze_correction_compaction(packet: dict[str, Any]) -> dict[str, Any]:
    """
    Audit branch retirement, historical retention and provenance-safe snapshots.

    This surface never decides whether a person-level judgment is substantively
    correct. It checks whether removing correction history from live governance
    preserves the declared explanation/contest/reconstruction capabilities.
    """
    branches = _branches(packet)
    snapshots = _snapshots(packet)
    findings: list[dict[str, Any]] = []

    def add(code: str, severity: str, message: str, refs: list[str]) -> None:
        findings.append({
            "code": code,
            "severity": severity,
            "message": message,
            "refs": refs,
        })

    # Basic declaration integrity.
    for bid, branch in branches.items():
        state = str(branch.get("state", ""))
        if state not in BRANCH_STATES:
            add(
                "GC001",
                "ERROR",
                "Branch declares an unknown retention/governance state.",
                [bid, state],
            )
        unknown_tasks = sorted(
            {str(x) for x in branch.get("required_tasks", [])} - TASKS
        )
        if unknown_tasks:
            add(
                "GC002",
                "ERROR",
                "Branch declares unknown reopening/retention tasks.",
                [bid, *unknown_tasks],
            )

    proposal_results: list[dict[str, Any]] = []
    for idx, proposal in enumerate(packet.get("proposals", []), start=1):
        pid = str(proposal.get("id") or f"proposal-{idx}")
        bid = str(proposal.get("branch", ""))
        sid = str(proposal.get("snapshot", ""))
        action = str(proposal.get("action", "compact_to_snapshot"))
        target_state = str(proposal.get("target_state", "historical_reopenable"))

        before = len(findings)

        if bid not in branches:
            add(
                "GC003",
                "ERROR",
                "Compaction proposal references an unknown branch.",
                [pid, bid],
            )
            proposal_results.append({
                "id": pid,
                "branch": bid,
                "status": "FAIL",
                "blocking_codes": ["GC003"],
            })
            continue

        branch = branches[bid]
        required = _required_tasks(branch)

        if target_state not in BRANCH_STATES:
            add(
                "GC004",
                "ERROR",
                "Compaction proposal targets an unknown branch state.",
                [pid, bid, target_state],
            )

        # Live-authority and unresolved-conflict gates.
        if target_state in {"historical_reopenable", "historical_minimal"}:
            if branch.get("current_governing") is True:
                add(
                    "GC005",
                    "ERROR",
                    "A currently governing branch cannot be garbage-collected out of live governance.",
                    [pid, bid],
                )
            if branch.get("unresolved_conflict") is True:
                add(
                    "GC006",
                    "ERROR",
                    "An unresolved live conflict cannot be compacted out of the active frontier.",
                    [pid, bid],
                )

        # Consequence obligations must be carried or remain reopenable.
        if branch.get("open_consequence") is True:
            carried = proposal.get("consequence_dependency_carried_forward") is True
            if not carried:
                add(
                    "GC007",
                    "ERROR",
                    "Branch retirement would orphan a live downstream consequence dependency.",
                    [pid, bid],
                )

        if action == "delete":
            if required or branch.get("historical_required") is True:
                add(
                    "GC008",
                    "ERROR",
                    "Deletion would destroy a branch that still has declared historical/reopening obligations.",
                    [pid, bid],
                )

        snapshot = snapshots.get(sid) if sid else None
        debt: list[str] = []

        if action in {"compact_to_snapshot", "retire_live"}:
            if snapshot is None:
                add(
                    "GC009",
                    "ERROR",
                    "Historical compaction/retirement lacks a declared snapshot or retained witness.",
                    [pid, bid, sid],
                )
            else:
                branch_events = {str(x) for x in branch.get("events", []) if x}
                covered = {str(x) for x in snapshot.get("covers", []) if x}
                missing_coverage = sorted(branch_events - covered)
                if missing_coverage:
                    add(
                        "GC010",
                        "ERROR",
                        "Snapshot does not cover all declared events in the compacted branch.",
                        [pid, bid, *missing_coverage],
                    )

                preserved = snapshot.get("preserved", {})
                if preserved.get("coverage") is not True:
                    add(
                        "GC011",
                        "ERROR",
                        "Snapshot lacks an explicit coverage receipt.",
                        [pid, bid, sid],
                    )
                if preserved.get("provenance") is not True:
                    add(
                        "GC012",
                        "ERROR",
                        "Snapshot loses branch provenance/ancestry continuity.",
                        [pid, bid, sid],
                    )
                if branch.get("has_supersession_history") is True and (
                    preserved.get("supersession_map") is not True
                ):
                    add(
                        "GC013",
                        "ERROR",
                        "Snapshot erases material supersession history.",
                        [pid, bid, sid],
                    )
                if branch.get("had_conflict") is True and (
                    preserved.get("conflict_map") is not True
                ):
                    add(
                        "GC014",
                        "ERROR",
                        "Resolved conflict is flattened without preserving competing-branch history.",
                        [pid, bid, sid],
                    )
                if "attribute" in required and (
                    preserved.get("attribution") is not True
                ):
                    add(
                        "GC015",
                        "ERROR",
                        "Snapshot cannot support required attribution of institution/model/query responsibility.",
                        [pid, bid, sid],
                    )
                if "consequence" in required and (
                    preserved.get("consequence_links") is not True
                ):
                    add(
                        "GC016",
                        "ERROR",
                        "Snapshot cannot reopen required downstream consequence dependencies.",
                        [pid, bid, sid],
                    )
                if preserved.get("integrity_witness") is not True:
                    add(
                        "GC017",
                        "ERROR",
                        "Snapshot lacks an integrity/tamper-evidence witness.",
                        [pid, bid, sid],
                    )

                debt = sorted(required - _supported_tasks(snapshot))
                if debt:
                    add(
                        "GC018",
                        "ERROR",
                        "Compaction loses one or more declared reopen-task capabilities.",
                        [pid, bid, *debt],
                    )

                open_future = branch.get("future_dispute_class") == "open"
                lossy = snapshot.get("lossy") is True
                universal_claim = snapshot.get("universal_sufficiency_claim") is True
                if open_future and lossy and universal_claim:
                    add(
                        "GC019",
                        "ERROR",
                        "Lossy compaction claims unbounded future contest/reconstruction sufficiency.",
                        [pid, bid, sid],
                    )

                if target_state == "historical_minimal":
                    if proposal.get("claims_full_history_retained") is True:
                        add(
                            "GC020",
                            "ERROR",
                            "Historical-minimal compaction is misrepresented as full history retention.",
                            [pid, bid],
                        )
                    if "reconstruct" in required and "reconstruct" not in _supported_tasks(snapshot):
                        add(
                            "GC021",
                            "ERROR",
                            "Historical-minimal target destroys a reconstruction capability that remains required.",
                            [pid, bid, sid],
                        )

        # Historical retention should not automatically become routine current retrieval.
        if target_state in {"historical_reopenable", "historical_minimal"}:
            if proposal.get("routine_current_retrieval") is True:
                add(
                    "GC022",
                    "ERROR",
                    "Historical retention is being laundered into routine present-day person evaluation.",
                    [pid, bid],
                )

        if (
            branch.get("privacy_sensitive") is True
            and proposal.get("retention_visibility") == "public"
            and target_state in {"historical_reopenable", "historical_minimal"}
        ):
            add(
                "GC023",
                "WARNING",
                "Historical retention is public despite a declared privacy-sensitive branch; review visibility scope.",
                [pid, bid],
            )

        current_errors = [
            f["code"]
            for f in findings[before:]
            if f["severity"] == "ERROR" and pid in f["refs"]
        ]
        proposal_results.append({
            "id": pid,
            "branch": bid,
            "action": action,
            "target_state": target_state,
            "required_tasks": sorted(required),
            "compaction_debt": debt,
            "status": "FAIL" if current_errors else "PASS",
            "blocking_codes": current_errors,
        })

    completion = str(packet.get("completion_claim", "open")).lower()
    failed = [p for p in proposal_results if p["status"] == "FAIL"]
    if completion in {"complete", "robust_complete"} and failed:
        add(
            "GC024",
            "ERROR",
            "Compaction completion is claimed while one or more retirement proposals remain invalid.",
            [p["id"] for p in failed],
        )

    errors = [f for f in findings if f["severity"] == "ERROR"]
    warnings = [f for f in findings if f["severity"] == "WARNING"]

    return {
        "status": "FAIL" if errors else "PASS",
        "rule": (
            "LIVE_RETIREMENT_NE_HISTORY_ERASURE; "
            "PROVENANCE_SUFFICIENCY_IS_TASK_RELATIVE; "
            "LOSSY_COMPACTION_HAS_BOUNDED_REOPEN_AUTHORITY"
        ),
        "proposals": proposal_results,
        "findings": findings,
        "summary": {
            "branches": len(branches),
            "snapshots": len(snapshots),
            "proposals": len(proposal_results),
            "failed_proposals": len(failed),
            "errors": len(errors),
            "warnings": len(warnings),
        },
    }
