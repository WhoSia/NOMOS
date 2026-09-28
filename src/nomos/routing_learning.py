from __future__ import annotations

from typing import Any


def _num(x: Any) -> float:
    try:
        return float(x)
    except (TypeError, ValueError):
        return 0.0


def _bool(x: Any) -> bool:
    return x is True


def _rate(count: float, exposure: float) -> float | None:
    if exposure <= 0:
        return None
    return count / exposure


def analyze_routing_learning(spec: dict[str, Any]) -> dict[str, Any]:
    """
    Audit adaptive routing-policy revision under policy-selected feedback.

    The analyzer evaluates evidential structure of policy learning only.
    It never infers person merit, blame, risk, truth, or legal entitlement.
    """
    epochs = [e for e in spec.get("epochs", []) if e.get("id")]
    feedback = spec.get("feedback", {})
    correction_signal = str(feedback.get("correction_signal", "corrections"))
    correction_routes = {
        str(x) for x in feedback.get("observable_on_routes", []) if x
    }

    epoch_rows: list[dict[str, Any]] = []
    exposure_changes: list[dict[str, Any]] = []
    raw_count_self_confirmation: list[dict[str, Any]] = []
    load_count_confounding: list[str] = []
    revision_provenance_gaps: list[str] = []
    outcome_blind_revisions: list[str] = []
    on_policy_revisions: list[str] = []

    prior_by_route: dict[str, tuple[str, float, float, float | None, float]] = {}

    for epoch in epochs:
        eid = str(epoch["id"])
        route_exposure = {
            str(k): _num(v) for k, v in (epoch.get("route_exposure") or {}).items()
        }
        observed = {
            str(k): _num(v) for k, v in (epoch.get("observed_corrections") or {}).items()
        }
        total_cases = _num(epoch.get("case_volume"))
        load = _num(epoch.get("load"))

        rates: dict[str, float | None] = {}
        shares: dict[str, float | None] = {}
        for route in sorted(set(route_exposure) | set(observed)):
            exposure = route_exposure.get(route, 0.0)
            count = observed.get(route, 0.0)
            rates[route] = _rate(count, exposure)
            shares[route] = _rate(exposure, total_cases)

            if route in prior_by_route:
                prev_eid, prev_exposure, prev_count, prev_rate, prev_load = prior_by_route[route]
                if exposure != prev_exposure:
                    exposure_changes.append({
                        "route": route,
                        "from_epoch": prev_eid,
                        "to_epoch": eid,
                        "exposure_from": prev_exposure,
                        "exposure_to": exposure,
                        "corrections_from": prev_count,
                        "corrections_to": count,
                        "rate_from": prev_rate,
                        "rate_to": rates[route],
                    })

                    if (
                        exposure < prev_exposure
                        and count < prev_count
                        and prev_rate is not None
                        and rates[route] is not None
                        and rates[route] >= prev_rate * 0.9
                    ):
                        raw_count_self_confirmation.append({
                            "route": route,
                            "from_epoch": prev_eid,
                            "to_epoch": eid,
                            "pattern": "raw_corrections_fell_with_exposure_while_rate_did_not_materially_improve",
                            "exposure_ratio": exposure / prev_exposure if prev_exposure else None,
                            "count_ratio": count / prev_count if prev_count else None,
                            "rate_ratio": rates[route] / prev_rate if prev_rate else None,
                        })

                    if load != prev_load and count != prev_count:
                        revision = epoch.get("revision") or {}
                        if "raw_correction_count" in revision.get("uses_signals", []) and not _bool(
                            revision.get("load_adjusted")
                        ):
                            load_count_confounding.append(eid)

            prior_by_route[route] = (eid, exposure, count, rates[route], load)

        revision = epoch.get("revision") or {}
        if revision:
            if not revision.get("rule_version") or not revision.get("provenance"):
                revision_provenance_gaps.append(eid)

            uses = {str(x) for x in revision.get("uses_signals", []) if x}
            if uses and uses <= {
                "case_volume",
                "load",
                "queue_delay",
                "staff_capacity",
                "pre_outcome_case_features",
            }:
                outcome_blind_revisions.append(eid)

            if correction_signal in uses or "raw_correction_count" in uses or "correction_rate" in uses:
                on_policy_revisions.append(eid)

        epoch_rows.append({
            "epoch": eid,
            "policy_version": epoch.get("policy_version"),
            "case_volume": total_cases,
            "load": load,
            "route_exposure": route_exposure,
            "observed_corrections": observed,
            "correction_rates": rates,
            "route_shares": shares,
        })

    selective_feedback = bool(correction_routes) and _bool(
        feedback.get("unobserved_outside_routes", True)
    )

    independent_channels = {
        "independent_audit": _bool(spec.get("independent_audit")),
        "shadow_review": _bool(spec.get("shadow_review")),
        "natural_overlap": _bool(spec.get("natural_overlap")),
        "off_policy_evaluation": _bool(spec.get("off_policy_evaluation")),
        "frozen_holdout": _bool(spec.get("frozen_holdout")),
    }
    active_independent_channels = sorted(
        key for key, active in independent_channels.items() if active
    )

    unsafe_exploration = _bool(spec.get("exploration_requires_withholding_entitled_review"))

    self_evaluation_gap = bool(on_policy_revisions) and selective_feedback and not active_independent_channels

    revision_rule = spec.get("revision_rule") or {}
    outcome_conditioned_rule = _bool(revision_rule.get("uses_post_review_outcomes"))
    frozen_before_outcomes = _bool(revision_rule.get("frozen_before_outcomes"))
    revision_rule_gap = outcome_conditioned_rule and not frozen_before_outcomes and not revision_rule.get(
        "change_provenance"
    )

    findings: list[str] = []
    if selective_feedback:
        findings.append("SELECTIVE_ROUTING_FEEDBACK")
    if raw_count_self_confirmation:
        findings.append("RAW_COUNT_SELF_CONFIRMATION")
    if load_count_confounding:
        findings.append("LOAD_CORRECTION_CONFOUNDING")
    if revision_provenance_gaps:
        findings.append("REVISION_PROVENANCE_GAP")
    if self_evaluation_gap:
        findings.append("ON_POLICY_SELF_EVALUATION_GAP")
    if revision_rule_gap:
        findings.append("OUTCOME_CONDITIONED_REVISION_RULE")
    if unsafe_exploration:
        findings.append("UNSAFE_EXPLORATION_PROPOSAL")

    if unsafe_exploration:
        state = "REVISION_METHOD_REJECTED"
    elif revision_provenance_gaps or revision_rule_gap:
        state = "REVISION_GOVERNANCE_HOLD"
    elif self_evaluation_gap or raw_count_self_confirmation or load_count_confounding:
        state = "REVISION_IDENTIFIABILITY_HOLD"
    elif selective_feedback and not active_independent_channels:
        state = "REVISION_IDENTIFIABILITY_HOLD"
    else:
        state = "REVISION_IDENTIFIABILITY_CANDIDATE"

    return {
        "policy_id": spec.get("policy_id"),
        "feedback_signal": correction_signal,
        "selective_feedback": selective_feedback,
        "feedback_observable_on_routes": sorted(correction_routes),
        "epochs": epoch_rows,
        "exposure_changes": exposure_changes,
        "raw_count_self_confirmation": raw_count_self_confirmation,
        "load_correction_confounding_epochs": sorted(set(load_count_confounding)),
        "revision_provenance_gaps": sorted(set(revision_provenance_gaps)),
        "outcome_blind_revision_epochs": sorted(set(outcome_blind_revisions)),
        "on_policy_revision_epochs": sorted(set(on_policy_revisions)),
        "independent_learning_channels": active_independent_channels,
        "on_policy_self_evaluation_gap": self_evaluation_gap,
        "revision_rule_outcome_conditioned": outcome_conditioned_rule,
        "revision_rule_frozen_before_outcomes": frozen_before_outcomes,
        "unsafe_exploration_proposal": unsafe_exploration,
        "findings": findings,
        "revision_state": state,
    }
