from __future__ import annotations

from typing import Any

CONTRACT_FIELDS = (
    "claim",
    "evidence_set",
    "provenance_window",
    "visibility",
    "rule_version",
    "model",
    "threshold",
    "burden_rule",
    "procedure",
    "timepoint",
)


def _norm(value: Any) -> Any:
    if isinstance(value, list):
        return sorted(value)
    if isinstance(value, dict):
        return {k: _norm(v) for k, v in sorted(value.items())}
    return value


def _same(a: Any, b: Any) -> bool:
    return _norm(a) == _norm(b)


def contract_diff(live: dict[str, Any], shadow: dict[str, Any]) -> dict[str, dict[str, Any]]:
    out: dict[str, dict[str, Any]] = {}
    for field in CONTRACT_FIELDS:
        lv = live.get(field)
        sv = shadow.get(field)
        if not _same(lv, sv):
            out[field] = {"live": lv, "shadow": sv}
    return out


def _validated_defects(review: dict[str, Any]) -> list[dict[str, Any]]:
    defects = []
    for item in review.get("validated_defects", []) or []:
        if item.get("validated") is True and item.get("code"):
            defects.append({
                "code": str(item["code"]),
                "source": item.get("source"),
                "scope": item.get("scope"),
            })
    return defects


def analyze_review_divergence(spec: dict[str, Any]) -> dict[str, Any]:
    """
    Analyze disagreement between live and restored/shadow review.

    Structural output only: no person truth, blame, legal entitlement, or
    institutional winner is inferred.
    """
    live = spec.get("live_review") or {}
    shadow = spec.get("shadow_review") or {}

    live_outcome = live.get("outcome")
    shadow_outcome = shadow.get("outcome")
    outcome_divergence = not _same(live_outcome, shadow_outcome)

    diffs = contract_diff(live, shadow)
    comparable_claim = _same(live.get("claim"), shadow.get("claim"))

    live_defects = _validated_defects(live)
    shadow_defects = _validated_defects(shadow)

    externally_localized = []
    for side, defects in (("live", live_defects), ("shadow", shadow_defects)):
        for defect in defects:
            externally_localized.append({"side": side, **defect})

    alignment_tests = [
        t for t in (spec.get("alignment_tests") or [])
        if t.get("coordinate") and t.get("result")
    ]
    localized_coordinates = sorted({
        str(t["coordinate"])
        for t in alignment_tests
        if t.get("result") in {
            "OUTCOME_CONVERGED_AFTER_ALIGNMENT",
            "OUTCOME_FLIPPED_AFTER_SWAP",
        }
    })

    residual_after_alignment = bool(
        spec.get("residual_divergence_after_full_alignment")
    )

    same_contract = not diffs

    if not outcome_divergence:
        divergence_state = "OUTCOME_CONVERGENCE"
    elif not comparable_claim:
        divergence_state = "NONCOMPARABLE_REVIEW_QUESTIONS"
    elif externally_localized:
        divergence_state = "VALIDATED_ERROR_SOURCE_PRESENT"
    elif localized_coordinates:
        divergence_state = "STRUCTURAL_SOURCE_LOCALIZED"
    elif same_contract and residual_after_alignment:
        divergence_state = "ALIGNED_RESIDUAL_DIVERGENCE"
    else:
        divergence_state = "DIVERGENCE_UNDERDETERMINED"

    policy_update = spec.get("policy_update") or {}
    systemic_evidence = bool(policy_update.get("systemic_replication"))
    route_link = bool(policy_update.get("routing_mechanism_link"))
    case_only = bool(policy_update.get("single_case_only"))
    person_consequence_firewall = policy_update.get(
        "shadow_result_directly_changes_live_case"
    ) is not True

    if not outcome_divergence:
        policy_authority = "NO_DIVERGENCE_UPDATE_NEEDED"
    elif case_only and not systemic_evidence:
        policy_authority = "CASE_DIAGNOSTIC_ONLY"
    elif externally_localized and systemic_evidence and route_link:
        policy_authority = "POLICY_UPDATE_CANDIDATE"
    elif localized_coordinates and systemic_evidence and route_link:
        policy_authority = "POLICY_UPDATE_CANDIDATE"
    else:
        policy_authority = "POLICY_UPDATE_HOLD"

    findings: list[str] = []
    if outcome_divergence:
        findings.append("REVIEW_OUTCOME_DIVERGENCE")
    if diffs:
        findings.append("REVIEW_CONTRACT_DIVERGENCE")
    if not comparable_claim:
        findings.append("CLAIM_TARGET_MISMATCH")
    if externally_localized:
        findings.append("VALIDATED_DEFECT_PRESENT")
    if localized_coordinates:
        findings.append("ALIGNMENT_LOCALIZES_DIVERGENCE")
    if same_contract and residual_after_alignment:
        findings.append("RESIDUAL_JUDGMENT_DIVERGENCE")
    if not person_consequence_firewall:
        findings.append("SHADOW_TO_LIVE_CONSEQUENCE_LEAK")
    if outcome_divergence and not externally_localized and not localized_coordinates:
        findings.append("NO_WINNER_FROM_DISAGREEMENT_ALONE")

    return {
        "case_id": spec.get("case_id"),
        "outcome_divergence": outcome_divergence,
        "live_outcome": live_outcome,
        "shadow_outcome": shadow_outcome,
        "comparable_claim": comparable_claim,
        "contract_differences": diffs,
        "validated_error_sources": externally_localized,
        "alignment_localized_coordinates": localized_coordinates,
        "residual_divergence_after_full_alignment": residual_after_alignment,
        "divergence_state": divergence_state,
        "policy_update_authority": policy_authority,
        "shadow_to_live_consequence_firewall": person_consequence_firewall,
        "findings": findings,
    }
