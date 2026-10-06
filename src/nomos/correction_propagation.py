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

OPERATION_REQUIREMENTS = {
    "factual": {"factual_recompute"},
    "provenance": {"provenance_rebind"},
    "semantic": {"semantic_rederive"},
    "authority": {"authority_deauthorize", "historical_only", "fresh_reconstitution"},
    "temporal": {"authority_deauthorize", "historical_only", "fresh_reconstitution"},
    "regime": {"query_replay", "semantic_rederive"},
    "consequence": {"consequence_reopen"},
}


def _records(packet: dict[str, Any]) -> dict[str, dict[str, Any]]:
    return {
        str(item["id"]): item
        for item in packet.get("records", [])
        if item.get("id")
    }


def _deps(record: dict[str, Any]) -> set[str]:
    return {str(x) for x in record.get("dependencies", []) if x}


def _dim_map(record: dict[str, Any]) -> dict[str, set[str]]:
    raw = record.get("dependency_dimensions", {})
    return {
        str(parent): {str(x) for x in dims if str(x) in CORRECTION_DIMENSIONS}
        for parent, dims in raw.items()
    }


def descendant_map(packet: dict[str, Any]) -> dict[str, list[str]]:
    records = _records(packet)
    children: dict[str, set[str]] = defaultdict(set)
    for rid, record in records.items():
        for parent in _deps(record):
            if parent in records:
                children[parent].add(rid)

    out: dict[str, list[str]] = {}
    for root in records:
        seen: set[str] = set()
        queue = deque(children.get(root, set()))
        while queue:
            item = queue.popleft()
            if item in seen:
                continue
            seen.add(item)
            queue.extend(children.get(item, set()) - seen)
        out[root] = sorted(seen)
    return out


def correction_impact(packet: dict[str, Any]) -> dict[str, dict[str, Any]]:
    records = _records(packet)
    correction = packet.get("correction", {})
    source = str(correction.get("source", ""))
    changed = {str(x) for x in correction.get("dimensions", [])}
    changed &= CORRECTION_DIMENSIONS

    if source not in records:
        return {}

    propagated: dict[str, set[str]] = {source: set(changed)}
    queue = deque([source])

    children: dict[str, set[str]] = defaultdict(set)
    for rid, record in records.items():
        for parent in _deps(record):
            if parent in records:
                children[parent].add(rid)

    while queue:
        parent = queue.popleft()
        parent_dims = propagated.get(parent, set())
        for child in children.get(parent, set()):
            record = records[child]
            dim_map = _dim_map(record)
            declared = dim_map.get(parent)
            if declared is None:
                # Missing dependency semantics: all upstream correction dimensions remain unresolved.
                affected = set(parent_dims)
            else:
                affected = set(parent_dims) & declared
            if not affected:
                continue
            prior = propagated.get(child, set())
            merged = prior | affected
            if merged != prior:
                propagated[child] = merged
                queue.append(child)

    return {
        rid: {
            "affected_dimensions": sorted(dims),
            "is_source": rid == source,
        }
        for rid, dims in propagated.items()
    }


def required_operations(dimensions: set[str]) -> set[str]:
    required: set[str] = set()
    for dim in dimensions:
        required |= OPERATION_REQUIREMENTS.get(dim, set())
    return required


def analyze_correction_propagation(packet: dict[str, Any]) -> dict[str, Any]:
    """
    Audit typed correction propagation and semantic re-derivation.

    This function never decides a substantive person predicate. It audits whether
    a correction's factual/provenance/semantic/authority/temporal/regime/
    consequence dimensions are carried through descendants with an adequate
    transformation, fresh warrant, and recipient-state accounting.
    """
    records = _records(packet)
    correction = packet.get("correction", {})
    source = str(correction.get("source", ""))
    dimensions = {str(x) for x in correction.get("dimensions", [])}
    findings: list[dict[str, Any]] = []

    def add(code: str, severity: str, message: str, refs: list[str]) -> None:
        findings.append({
            "code": code,
            "severity": severity,
            "message": message,
            "refs": refs,
        })

    unknown_dims = sorted(dimensions - CORRECTION_DIMENSIONS)
    if unknown_dims:
        add(
            "CP001",
            "ERROR",
            "Correction payload contains unknown correction dimensions.",
            unknown_dims,
        )

    dimensions &= CORRECTION_DIMENSIONS

    if source not in records:
        add("CP002", "ERROR", "Correction source is missing from the record graph.", [source])

    impact = correction_impact(packet)
    descendants = descendant_map(packet)

    record_results: list[dict[str, Any]] = []
    for rid, info in impact.items():
        if info["is_source"]:
            continue

        record = records[rid]
        affected = set(info["affected_dimensions"])
        dim_map = _dim_map(record)
        missing_semantics = [
            parent for parent in _deps(record)
            if parent in impact and parent not in dim_map
        ]
        if missing_semantics:
            add(
                "CP003",
                "ERROR",
                "Impacted descendant lacks dependency-dimension semantics for an affected parent.",
                [rid, *sorted(missing_semantics)],
            )

        operations = {str(x) for x in record.get("operations", [])}
        if not operations:
            add(
                "CP004",
                "ERROR",
                "Impacted descendant has no declared correction operation.",
                [rid],
            )

        required = required_operations(affected)

        def has_any(options: set[str]) -> bool:
            return bool(operations & options)

        for dim in affected:
            acceptable = OPERATION_REQUIREMENTS.get(dim, set())
            if acceptable and not has_any(acceptable):
                add(
                    "CP005",
                    "ERROR",
                    f"Descendant operation does not address affected correction dimension: {dim}.",
                    [rid, dim],
                )

        if "semantic" in affected and "semantic_rederive" in operations:
            old_version = str(record.get("transformation_version", ""))
            new_version = str(record.get("corrected_transformation_version", ""))
            rule_changed = record.get("semantic_rule_changed") is True
            if not rule_changed and (not new_version or new_version == old_version):
                add(
                    "CP006",
                    "ERROR",
                    "Semantic correction is mechanically rerun under an unchanged interpretive transformation.",
                    [rid],
                )

        if "regime" in affected and "query_replay" in operations:
            old_query = str(record.get("query_version", ""))
            new_query = str(record.get("corrected_query_version", ""))
            selection_changed = record.get("selection_rule_changed") is True
            if not selection_changed and (not new_query or new_query == old_query):
                add(
                    "CP007",
                    "ERROR",
                    "Regime/context correction is replayed without a changed or revalidated selection/query rule.",
                    [rid],
                )

        if (
            affected & {"semantic", "regime"}
            and record.get("generator_active") is True
            and record.get("generator_corrected") is not True
        ):
            add(
                "CP008",
                "ERROR",
                "A stale active generator can regenerate the defeated semantic/regime state.",
                [rid],
            )

        if "no_action" in operations and affected:
            if not (
                record.get("independence_certified") is True
                and record.get("source_ablation_pass") is True
            ):
                add(
                    "CP009",
                    "ERROR",
                    "No-action treatment of an impacted descendant lacks independence certification and source-ablation evidence.",
                    [rid],
                )

        same_output = record.get("output_changed") is False
        governing = record.get("current_governing") is True
        if same_output and governing and affected:
            if not (
                record.get("fresh_adoption") is True
                and record.get("fresh_warrant") is True
            ):
                add(
                    "CP010",
                    "ERROR",
                    "Same post-correction output remains governing without traceable fresh adoption and fresh warrant.",
                    [rid],
                )

        if "historical_only" in operations and record.get("current_governing") is True:
            add(
                "CP011",
                "ERROR",
                "Historical-only descendant is still marked as a current governing state.",
                [rid],
            )

        if "authority_deauthorize" in operations and record.get("current_governing") is True:
            add(
                "CP012",
                "ERROR",
                "Deauthorized descendant still retains current governing status.",
                [rid],
            )

        if "consequence" in affected and "consequence_reopen" in operations:
            if not record.get("consequence_review_route"):
                add(
                    "CP013",
                    "ERROR",
                    "Consequence reopening lacks a live review route.",
                    [rid],
                )

        record_errors = [
            f["code"] for f in findings
            if f["severity"] == "ERROR" and rid in f["refs"]
        ]
        record_results.append({
            "id": rid,
            "affected_dimensions": sorted(affected),
            "required_operation_family": sorted(required),
            "declared_operations": sorted(operations),
            "status": "FAIL" if record_errors else "PASS",
            "blocking_codes": record_errors,
        })

    recipient_results: list[dict[str, Any]] = []
    open_recipient_branches = 0
    for idx, branch in enumerate(packet.get("recipient_branches", []), start=1):
        bid = str(branch.get("id") or f"recipient-{idx}")
        state = str(branch.get("state", "unknown"))
        notice = str(branch.get("notice", "unknown"))
        local_rederivation = branch.get("local_rederivation") is True
        fresh_warrant = branch.get("fresh_warrant") is True
        onward_open = branch.get("onward_transfer_open") is True

        resolved_states = {
            "updated",
            "fresh_independent",
            "historical_only",
            "deauthorized",
        }
        resolved = state in resolved_states and not onward_open

        if notice == "delivered" and state in {"unknown", "pending", "notice_only"}:
            add(
                "CP014",
                "WARNING",
                "Recipient notice is delivered but recipient correction state remains unresolved.",
                [bid],
            )

        if state == "fresh_independent" and not (local_rederivation and fresh_warrant):
            add(
                "CP015",
                "ERROR",
                "Recipient claims fresh independent continuation without local re-derivation and fresh warrant.",
                [bid],
            )

        if not resolved:
            open_recipient_branches += 1

        recipient_results.append({
            "id": bid,
            "notice": notice,
            "state": state,
            "resolved": resolved,
            "onward_transfer_open": onward_open,
        })

    completion_claim = str(packet.get("completion_claim", "open")).lower()
    impacted_records = [r for r in record_results]
    failed_records = [r for r in impacted_records if r["status"] == "FAIL"]

    if completion_claim in {"complete", "robust_complete"}:
        if failed_records or open_recipient_branches:
            add(
                "CP016",
                "ERROR",
                "Completion is claimed while impacted descendants or recipient branches remain unresolved.",
                [
                    *(r["id"] for r in failed_records),
                    *(x["id"] for x in recipient_results if not x["resolved"]),
                ],
            )

    errors = [f for f in findings if f["severity"] == "ERROR"]
    warnings = [f for f in findings if f["severity"] == "WARNING"]

    return {
        "status": "FAIL" if errors else "PASS",
        "rule": "CORRECTION_IS_TYPED_STATE_CHANGE; PROPAGATION_REQUIRES_OPERATION_SPECIFIC_REDERIVATION",
        "correction": {
            "source": source,
            "dimensions": sorted(dimensions),
        },
        "impact": impact,
        "descendants": descendants,
        "records": record_results,
        "recipient_branches": recipient_results,
        "completion_claim": completion_claim,
        "findings": findings,
        "summary": {
            "impacted_descendants": len(record_results),
            "failed_descendants": len(failed_records),
            "open_recipient_branches": open_recipient_branches,
            "errors": len(errors),
            "warnings": len(warnings),
        },
    }
