from __future__ import annotations

from itertools import combinations
from typing import Any

DIMENSIONS = ("Q", "E", "M", "I", "A", "C")


def _sets(xs: list[str] | None) -> set[str]:
    return {str(x) for x in (xs or []) if x}


def _safeguards(topology: dict[str, Any]) -> list[dict[str, Any]]:
    return [x for x in topology.get("safeguards", []) if x.get("id")]


def _covers(safeguards: list[dict[str, Any]], required: set[str]) -> bool:
    covered: set[str] = set()
    for safeguard in safeguards:
        covered |= _sets(safeguard.get("breaks"))
    return required <= covered


def minimal_break_sets(topology: dict[str, Any]) -> list[list[str]]:
    """Return inclusion-minimal safeguard sets covering declared live failure modes."""
    safeguards = _safeguards(topology)
    required = _sets(topology.get("required_breaks"))
    if not required:
        return [[]]

    out: list[list[str]] = []
    for size in range(1, len(safeguards) + 1):
        for combo in combinations(safeguards, size):
            if not _covers(list(combo), required):
                continue
            if any(
                _covers(list(sub), required)
                for sub_size in range(1, size)
                for sub in combinations(combo, sub_size)
            ):
                continue
            out.append([str(x["id"]) for x in combo])
    return out


def _cycles(edges: list[tuple[str, str]]) -> list[list[str]]:
    graph: dict[str, list[str]] = {}
    for source, target in edges:
        graph.setdefault(source, []).append(target)

    cycles: set[tuple[str, ...]] = set()

    def dfs(node: str, path: list[str], active: set[str]) -> None:
        if node in active:
            start = path.index(node)
            body = path[start:]
            rotations = [tuple(body[i:] + body[:i]) for i in range(len(body))]
            cycles.add(min(rotations))
            return
        active.add(node)
        path.append(node)
        for nxt in graph.get(node, []):
            dfs(nxt, path, active)
        path.pop()
        active.remove(node)

    for node in graph:
        dfs(node, [], set())
    return [list(cycle) for cycle in sorted(cycles)]


def _reachable(entrypoints: list[str], edges: list[tuple[str, str]]) -> set[str]:
    graph: dict[str, set[str]] = {}
    for source, target in edges:
        graph.setdefault(source, set()).add(target)

    seen: set[str] = set()
    stack = list(entrypoints)
    while stack:
        node = stack.pop()
        if node in seen:
            continue
        seen.add(node)
        stack.extend(graph.get(node, set()) - seen)
    return seen


def analyze_review_topology(topology: dict[str, Any]) -> dict[str, Any]:
    """Analyze review architecture; never infer person merit, blame, risk or truth."""
    safeguards = _safeguards(topology)
    required = _sets(topology.get("required_breaks"))

    covered: set[str] = set()
    by_dimension: dict[str, list[dict[str, Any]]] = {dimension: [] for dimension in DIMENSIONS}
    for safeguard in safeguards:
        breaks = _sets(safeguard.get("breaks"))
        covered |= breaks
        for dimension in breaks:
            by_dimension.setdefault(dimension, []).append(safeguard)

    missing = sorted(required - covered)
    minimal = minimal_break_sets(topology)
    in_any_minimal = {sid for group in minimal for sid in group}
    coverage_redundant = sorted(
        str(safeguard["id"])
        for safeguard in safeguards
        if str(safeguard["id"]) not in in_any_minimal
    )

    unique_breaks: dict[str, list[str]] = {}
    for safeguard in safeguards:
        sid = str(safeguard["id"])
        other_breaks: set[str] = set()
        for other in safeguards:
            if other is not safeguard:
                other_breaks |= _sets(other.get("breaks"))
        unique_breaks[sid] = sorted(_sets(safeguard.get("breaks")) - other_breaks)

    common_mode: list[dict[str, Any]] = []
    for dimension in sorted(required & covered):
        guards = by_dimension.get(dimension, [])
        if not guards:
            continue

        controllers = {
            str(guard.get("controller", ""))
            for guard in guards
            if guard.get("controller")
        }
        dependency_sets = [_sets(guard.get("common_dependencies")) for guard in guards]
        shared_dependencies = (
            set.intersection(*dependency_sets)
            if dependency_sets and all(dependency_sets)
            else set()
        )

        if len(guards) > 1 and len(controllers) == 1:
            common_mode.append({
                "dimension": dimension,
                "kind": "single_controller",
                "controller": next(iter(controllers)),
                "safeguards": sorted(str(guard["id"]) for guard in guards),
            })

        if len(guards) > 1 and shared_dependencies:
            common_mode.append({
                "dimension": dimension,
                "kind": "shared_dependency",
                "dependencies": sorted(shared_dependencies),
                "safeguards": sorted(str(guard["id"]) for guard in guards),
            })

    edges = [
        (str(edge.get("source")), str(edge.get("target")))
        for edge in topology.get("escalations", [])
        if edge.get("source") and edge.get("target")
    ]
    entrypoints = [str(x) for x in topology.get("entrypoints", []) if x]
    reachable = _reachable(entrypoints, edges)

    authority_nodes = {
        str(safeguard["id"])
        for safeguard in safeguards
        if safeguard.get("can_change_authority") is True
    }
    reachable_authority = sorted(reachable & authority_nodes)

    outgoing = {source for source, _ in edges}
    reachable_terminals = sorted(node for node in reachable if node not in outgoing)
    authority_terminals = sorted(
        node for node in reachable_terminals if node in authority_nodes
    )

    reassembly = topology.get("reassembly_authority")
    fragmentation_risk = len(authority_terminals) > 1 and not reassembly

    if missing or not reachable_authority:
        calibration = "UNDERSEPARATED"
    elif fragmentation_risk:
        calibration = "FRAGMENTATION_RISK"
    elif common_mode:
        calibration = "COVERED_WITH_COMMON_MODE_EXPOSURE"
    else:
        calibration = "CALIBRATED_CANDIDATE"

    return {
        "required_breaks": sorted(required),
        "covered_breaks": sorted(required & covered),
        "missing_breaks": missing,
        "minimal_break_sets": minimal,
        "coverage_redundant_safeguards": coverage_redundant,
        "unique_breaks": unique_breaks,
        "common_mode_exposures": common_mode,
        "escalation_cycles": _cycles(edges),
        "reachable_authority_changers": reachable_authority,
        "reachable_authority_terminals": authority_terminals,
        "reassembly_authority": reassembly,
        "fragmentation_risk": fragmentation_risk,
        "calibration_state": calibration,
    }
