from __future__ import annotations

from typing import Any

FindingTuple = tuple[str, str, str, tuple[str, ...]]


def _by_id(items: list[dict[str, Any]]) -> dict[str, dict[str, Any]]:
    return {str(item.get("id")): item for item in items if item.get("id")}


def direct_dependencies(case: dict[str, Any]) -> dict[str, set[str]]:
    """Build direct dependency links for evidence and derived records."""
    out: dict[str, set[str]] = {}
    for item in case.get("evidence", []):
        iid = str(item.get("id", ""))
        if iid:
            out[iid] = {str(x) for x in item.get("provenance", []) if x}
    for item in case.get("derived_records", []):
        iid = str(item.get("id", ""))
        if iid:
            out[iid] = {str(x) for x in item.get("dependencies", []) if x}
    return out


def dependency_closure(case: dict[str, Any], item_id: str) -> list[str]:
    """Return the transitive dependency closure of an evidence/derived item."""
    graph = direct_dependencies(case)
    seen: set[str] = set()
    stack = list(graph.get(str(item_id), set()))
    while stack:
        current = stack.pop()
        if current in seen:
            continue
        seen.add(current)
        stack.extend(graph.get(current, set()) - seen)
    return sorted(seen)


def impacted_derived_records(case: dict[str, Any], source_id: str) -> list[str]:
    """Return derived records transitively dependent on source_id."""
    source_id = str(source_id)
    impacted: list[str] = []
    for record in case.get("derived_records", []):
        rid = str(record.get("id", ""))
        if rid and source_id in dependency_closure(case, rid):
            impacted.append(rid)
    return sorted(impacted)


def trace_record(case: dict[str, Any], record_id: str) -> dict[str, Any]:
    records = _by_id(case.get("derived_records", []))
    record_id = str(record_id)
    if record_id not in records:
        raise KeyError(f"unknown derived record: {record_id}")
    return {"record": records[record_id], "dependency_closure": dependency_closure(case, record_id)}


def derived_record_findings(case: dict[str, Any]) -> list[FindingTuple]:
    """0.835 guards for attribution persistence through derived records."""
    findings: list[FindingTuple] = []
    supports = _by_id(case.get("supports", []))
    institutions = _by_id(case.get("institutions", []))
    claims = _by_id(case.get("claims", []))
    derived = _by_id(case.get("derived_records", []))

    by_outcome: dict[str, set[str]] = {}
    for attribution in case.get("attributions", []):
        outcome = str(attribution.get("outcome", ""))
        actor = str(attribution.get("actor", ""))
        if outcome and actor:
            by_outcome.setdefault(outcome, set()).add(actor)

    for rid, record in derived.items():
        deps = {str(x) for x in record.get("dependencies", []) if x}
        if not deps:
            findings.append(("N012", "ERROR", "Derived record has no dependency manifest.", (rid,)))

        source_outcome = str(record.get("source_outcome", ""))
        contributors = by_outcome.get(source_outcome, set())
        subject = str(record.get("subject", ""))
        non_subject = {x for x in contributors if x != subject}
        if record.get("person_only", False) and non_subject:
            closure = set(dependency_closure(case, rid))
            missing = sorted(x for x in non_subject if x not in closure)
            if missing:
                findings.append((
                    "N013", "ERROR",
                    "Jointly produced outcome is compressed into a person-only record while contributor dependencies disappear.",
                    tuple([rid, *missing]),
                ))

        if record.get("provenance_visibility") == "sealed":
            if not record.get("reopenable") or not record.get("provenance_ref"):
                findings.append(("N014", "ERROR", "Sealed provenance is not paired with a live reopening route.", (rid,)))

        closure = set(dependency_closure(case, rid))
        has_support_dependency = any(x in supports for x in closure)
        if record.get("portable") and has_support_dependency:
            if record.get("semantic_equivalence") is not True and not record.get("interpretation_limit"):
                findings.append((
                    "N015", "ERROR",
                    "Portable derived record depends on support but lacks semantic-equivalence evidence or an explicit interpretation limit.",
                    (rid,),
                ))

        public_metadata = {str(x) for x in record.get("public_metadata", [])}
        sensitive_exposed = sorted(
            x for x in public_metadata
            if supports.get(x, {}).get("sensitive") or institutions.get(x, {}).get("sensitive")
        )
        if sensitive_exposed and not record.get("disclosure_basis"):
            findings.append((
                "N017", "WARNING",
                "Visible record exposes sensitive dependency metadata without a stated disclosure basis; provenance persistence need not mean public exposure.",
                tuple([rid, *sensitive_exposed]),
            ))

    for edge in case.get("edges", []):
        src_id = str(edge.get("source", ""))
        if src_id not in derived:
            continue
        dst = claims.get(str(edge.get("target", "")))
        if not dst:
            continue
        allowed = set(derived[src_id].get("validated_scopes", []))
        if allowed and dst.get("scope") not in allowed and not edge.get("bridge"):
            findings.append((
                "N016", "ERROR",
                "Derived record is used beyond its validated claim scope without a fresh bridge.",
                (src_id, str(edge.get("target"))),
            ))
    return findings
