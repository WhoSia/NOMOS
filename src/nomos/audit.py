from __future__ import annotations

from dataclasses import dataclass, asdict
from typing import Any


@dataclass(frozen=True)
class Finding:
    code: str
    severity: str
    message: str
    refs: tuple[str, ...] = ()

    def to_dict(self) -> dict[str, Any]:
        out = asdict(self)
        out["refs"] = list(self.refs)
        return out


def _by_id(items: list[dict[str, Any]]) -> dict[str, dict[str, Any]]:
    return {str(item.get("id")): item for item in items if item.get("id")}


def audit_case(case: dict[str, Any]) -> list[Finding]:
    """Audit a NOMOS Case Graph without producing a person verdict."""
    findings: list[Finding] = []

    nodes = _by_id(case.get("nodes", []))
    edges = case.get("edges", [])
    claims = _by_id(case.get("claims", []))
    evidence = _by_id(case.get("evidence", []))
    supports = _by_id(case.get("supports", []))
    institutions = _by_id(case.get("institutions", []))

    valid_ids = set(nodes) | set(claims) | set(evidence) | set(supports) | set(institutions)
    for edge in edges:
        src, dst = str(edge.get("source", "")), str(edge.get("target", ""))
        if src not in valid_ids or dst not in valid_ids:
            findings.append(Finding(
                "N000", "ERROR",
                "Edge references an unknown source or target.",
                tuple(x for x in (src, dst) if x),
            ))

    for edge in edges:
        dst = claims.get(str(edge.get("target", "")))
        src = nodes.get(str(edge.get("source", ""))) or evidence.get(str(edge.get("source", "")))
        if not dst or not src:
            continue
        if dst.get("scope") == "person_predicate" and (
            str(edge.get("source", "")) in evidence or src.get("kind") == "event"
        ):
            if not edge.get("bridge"):
                findings.append(Finding(
                    "N001", "ERROR",
                    "Person-predicate support from an event/evidence item lacks an explicit conduct-to-person bridge.",
                    (str(edge.get("source")), str(edge.get("target"))),
                ))

    for attribution in case.get("attributions", []):
        mode = attribution.get("mode")
        if mode in {"blame", "credit"} and attribution.get("causal_contribution") is not None:
            if not attribution.get("normative_basis"):
                findings.append(Finding(
                    "N002", "ERROR",
                    "Causal contribution is being promoted to blame/credit without a distinct normative basis.",
                    (str(attribution.get("actor", "")), str(attribution.get("outcome", ""))),
                ))

    for allocation in case.get("allocations", []):
        if allocation.get("scheme") == "fixed_sum" and not allocation.get("justification"):
            findings.append(Finding(
                "N003", "ERROR",
                "Responsibility/credit is treated as a conserved fixed-sum quantity without justification.",
                (str(allocation.get("id", "")),),
            ))

    for edge in edges:
        src = evidence.get(str(edge.get("source", "")))
        dst = claims.get(str(edge.get("target", "")))
        if not src or not dst:
            continue
        sreg, treg = src.get("regime"), dst.get("regime")
        if sreg and treg and sreg != treg and not edge.get("transport_warrant"):
            findings.append(Finding(
                "N004", "ERROR",
                "Evidence is transported across regimes without an explicit transport warrant.",
                (str(edge.get("source")), str(edge.get("target"))),
            ))

    for edge in edges:
        src = evidence.get(str(edge.get("source", "")))
        dst = claims.get(str(edge.get("target", "")))
        if not src or not dst:
            continue
        if src.get("origin") == "recovery" and dst.get("target") in {
            "historical_untreated", "pre_intervention"
        }:
            if not edge.get("transport_warrant"):
                findings.append(Finding(
                    "N005", "ERROR",
                    "Recovery evidence is used as if it directly reconstructed an untreated historical state.",
                    (str(edge.get("source")), str(edge.get("target"))),
                ))

    target_env = case.get("target_environment", {})
    for withdrawal in case.get("withdrawals", []):
        sid = str(withdrawal.get("support", ""))
        support = supports.get(sid, {})
        used = bool(withdrawal.get("used_for_person_inference"))
        if used and not withdrawal.get("independently_authorized"):
            findings.append(Finding(
                "N006", "ERROR",
                "Support withdrawal is used for person inference without independent authority for the withdrawal.",
                (sid,),
            ))
        if used and support.get("class") == "S0" and not target_env.get("zero_support", False):
            findings.append(Finding(
                "N007", "ERROR",
                "Constitutive ordinary support is removed as a person-capacity test although zero support is not the target environment.",
                (sid,),
            ))

    for eid, item in evidence.items():
        if not item.get("provenance"):
            findings.append(Finding(
                "N008", "ERROR",
                "Evidence item has no provenance.",
                (eid,),
            ))

    if len(institutions) > 1 and case.get("consequences"):
        if not case.get("reassembly_route"):
            findings.append(Finding(
                "N009", "ERROR",
                "Distributed institutional production has consequences but no end-to-end reassembly/contest route.",
                tuple(institutions.keys()),
            ))

    withdrawal_evidence = {
        eid for eid, item in evidence.items()
        if item.get("kind") == "withdrawal_outcome" and item.get("direction") == "deterioration"
    }
    for edge in edges:
        if str(edge.get("source", "")) not in withdrawal_evidence:
            continue
        dst = claims.get(str(edge.get("target", "")))
        if dst and dst.get("scope") == "person_predicate" and not edge.get("bridge"):
            findings.append(Finding(
                "N010", "ERROR",
                "Deterioration after support withdrawal is promoted directly to a person predicate.",
                (str(edge.get("source")), str(edge.get("target"))),
            ))

    for authority in case.get("authorities", []):
        if authority.get("authority_type") == "person_predicate":
            cid = str(authority.get("claim", ""))
            claim = claims.get(cid, {})
            if claim.get("scope") != "person_predicate":
                findings.append(Finding(
                    "N011", "ERROR",
                    "Person-predicate authority is attached to a claim of a different scope.",
                    (cid,),
                ))

    return findings
