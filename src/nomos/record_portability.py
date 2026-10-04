from __future__ import annotations

from collections import defaultdict, deque
from typing import Any

PORTABILITY_LEVELS = {
    "P0": 0,
    "P1": 1,
    "P2": 2,
    "P3": 3,
    "P4": 4,
    "P5": 5,
}


def _level(value: Any) -> int:
    if isinstance(value, int):
        if 0 <= value <= 5:
            return value
        raise ValueError("portability level integer must be between 0 and 5")
    key = str(value or "P0").upper()
    if key not in PORTABILITY_LEVELS:
        raise ValueError(f"unknown portability level: {value}")
    return PORTABILITY_LEVELS[key]


def _records_by_id(packet: dict[str, Any]) -> dict[str, dict[str, Any]]:
    return {
        str(item["id"]): item
        for item in packet.get("records", [])
        if item.get("id")
    }


def _dependencies(record: dict[str, Any]) -> set[str]:
    return {
        str(x)
        for x in record.get("dependencies", record.get("parents", []))
        if x
    }


def emergency_ancestors(packet: dict[str, Any], record_id: str) -> list[str]:
    """Return emergency-produced ancestors, including the record itself when applicable."""
    records = _records_by_id(packet)
    record_id = str(record_id)
    if record_id not in records:
        return []

    seen: set[str] = set()
    emergency: set[str] = set()
    stack = [record_id]
    while stack:
        current = stack.pop()
        if current in seen or current not in records:
            continue
        seen.add(current)
        record = records[current]
        if record.get("emergency_produced") is True:
            emergency.add(current)
        stack.extend(_dependencies(record) - seen)
    return sorted(emergency)


def descendant_map(packet: dict[str, Any]) -> dict[str, list[str]]:
    """Return transitive descendants for every known record."""
    records = _records_by_id(packet)
    children: dict[str, set[str]] = defaultdict(set)
    for rid, record in records.items():
        for parent in _dependencies(record):
            if parent in records:
                children[parent].add(rid)

    out: dict[str, list[str]] = {}
    for root in records:
        seen: set[str] = set()
        q = deque(children.get(root, set()))
        while q:
            child = q.popleft()
            if child in seen:
                continue
            seen.add(child)
            q.extend(children.get(child, set()) - seen)
        out[root] = sorted(seen)
    return out


def analyze_record_portability(packet: dict[str, Any]) -> dict[str, Any]:
    """
    Audit emergency-record transport into ordinary use.

    This audits provenance and authority structure only. It never decides whether
    a person is risky, reliable, blameworthy, or deserving of another substantive
    person predicate.
    """
    records = _records_by_id(packet)
    findings: list[dict[str, Any]] = []

    def add(code: str, severity: str, message: str, refs: list[str] | tuple[str, ...]) -> None:
        findings.append({
            "code": code,
            "severity": severity,
            "message": message,
            "refs": list(refs),
        })

    # Descendant-provenance integrity: emergency ancestry must remain inspectable
    # even when an intermediate score/summary/ranking receives a new identifier.
    for rid, record in records.items():
        ancestors = emergency_ancestors(packet, rid)
        if not ancestors:
            continue
        if rid not in ancestors:
            visible = set(str(x) for x in record.get("emergency_ancestor_refs", []) if x)
            missing = sorted(set(ancestors) - visible)
            if missing:
                add(
                    "RP011",
                    "ERROR",
                    "Descendant of emergency-produced history loses one or more emergency-ancestry references.",
                    [rid, *missing],
                )

    use_results: list[dict[str, Any]] = []
    for idx, use in enumerate(packet.get("proposed_uses", []), start=1):
        use_id = str(use.get("id") or f"use-{idx}")
        rid = str(use.get("record", ""))
        if rid not in records:
            add("RP001", "ERROR", "Proposed use references an unknown record.", [use_id, rid])
            use_results.append({"id": use_id, "record": rid, "status": "FAIL"})
            continue

        record = records[rid]
        level = _level(use.get("level", "P0"))
        ancestors = emergency_ancestors(packet, rid)
        is_emergency_lineage = bool(ancestors)
        before = len(findings)

        if is_emergency_lineage and not record.get("provenance_visible"):
            add(
                "RP002",
                "ERROR",
                "Emergency-lineage record is proposed for reuse without visible provenance.",
                [use_id, rid],
            )

        if is_emergency_lineage and level >= 2 and record.get("regime_sensitivity_assessed") is not True:
            add(
                "RP003",
                "ERROR",
                "Contextual or stronger ordinary use lacks a regime-sensitivity assessment.",
                [use_id, rid],
            )

        if is_emergency_lineage and level >= 3 and not record.get("ordinary_baseline"):
            add(
                "RP004",
                "ERROR",
                "Bounded ordinary inference or stronger use lacks an ordinary/successor baseline.",
                [use_id, rid],
            )

        if is_emergency_lineage and level >= 3 and record.get("semantic_revalidated") is not True:
            add(
                "RP005",
                "ERROR",
                "Emergency-era meaning is transported into ordinary inference without semantic revalidation.",
                [use_id, rid],
            )

        if (
            is_emergency_lineage
            and level >= 3
            and record.get("selection_feedback")
            and not record.get("dependency_accounted")
        ):
            add(
                "RP006",
                "ERROR",
                "Later observation may depend on an earlier emergency person-model, but dependency is not accounted for.",
                [use_id, rid],
            )

        if is_emergency_lineage and level >= 2 and not record.get("contest_route"):
            add(
                "RP007",
                "ERROR",
                "Ordinary evidentiary reuse lacks a live contest/review route.",
                [use_id, rid],
            )

        allowed_purposes = {str(x) for x in record.get("allowed_purposes", []) if x}
        proposed_purpose = str(use.get("purpose", ""))
        if level >= 2 and allowed_purposes and proposed_purpose not in allowed_purposes:
            add(
                "RP008",
                "ERROR",
                "Record is reused outside its purpose-limited portability scope.",
                [use_id, rid, proposed_purpose],
            )

        if level >= 4 and not use.get("consequence_authority"):
            add(
                "RP009",
                "ERROR",
                "Adverse ordinary consequence lacks a fresh consequence-authority source.",
                [use_id, rid],
            )

        if level >= 5 and not use.get("fresh_person_model_authority"):
            add(
                "RP010",
                "ERROR",
                "Durable person-model incorporation lacks fresh person-predicate authority.",
                [use_id, rid],
            )

        if is_emergency_lineage and record.get("emergency_label_expired") and level >= 3:
            add(
                "RP012",
                "ERROR",
                "Expired emergency person label is being promoted into ordinary inference.",
                [use_id, rid],
            )

        current_errors = [
            f for f in findings[before:]
            if f["severity"] == "ERROR" and use_id in f["refs"]
        ]
        use_results.append({
            "id": use_id,
            "record": rid,
            "level": f"P{level}",
            "purpose": proposed_purpose,
            "emergency_ancestors": ancestors,
            "status": "FAIL" if current_errors else "PASS",
            "blocking_codes": [f["code"] for f in current_errors],
        })

    errors = [f for f in findings if f["severity"] == "ERROR"]
    warnings = [f for f in findings if f["severity"] == "WARNING"]

    return {
        "status": "FAIL" if errors else "PASS",
        "rule": "HISTORY != EVIDENCE != ORDINARY_MEANING != CONSEQUENCE_AUTHORITY",
        "portability_levels": {
            "P0": "archive_only",
            "P1": "reconstruction_or_review",
            "P2": "contextual_evidentiary_use",
            "P3": "bounded_ordinary_inference",
            "P4": "ordinary_adverse_consequence",
            "P5": "durable_person_model_incorporation",
        },
        "uses": use_results,
        "descendants": descendant_map(packet),
        "findings": findings,
        "summary": {
            "records": len(records),
            "proposed_uses": len(use_results),
            "errors": len(errors),
            "warnings": len(warnings),
        },
    }
