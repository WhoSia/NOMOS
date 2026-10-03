from __future__ import annotations

from collections import Counter, defaultdict
from typing import Any


def _set(xs: list[str] | None) -> set[str]:
    return {str(x) for x in (xs or []) if x is not None}


def _unique(values):
    return {v for v in values if v is not None}


def _rate(num: int, den: int) -> float | None:
    if den <= 0:
        return None
    return num / den


def analyze_divergence_replication(spec: dict[str, Any]) -> dict[str, Any]:
    """
    Audit whether repeated localized live↔shadow divergence supports a
    case-specific, reviewer-conditional, case-mix-conditional, or
    transportable systematic-failure claim.

    No person truth, reviewer blame, or policy winner is inferred.
    """
    cases = list(spec.get("cases") or [])
    claim = dict(spec.get("systematic_claim") or {})
    rule = dict(spec.get("replication_rule") or {})
    transport = dict(spec.get("transport") or {})
    adjudicator = dict(spec.get("adjudicator_calibration") or {})

    coordinate = str(claim.get("localized_coordinate") or "")
    target_strata = _set(claim.get("target_case_mix_strata"))

    qualifying = [
        c for c in cases
        if c.get("divergence") is True
        and coordinate
        and coordinate in _set(c.get("localized_coordinates"))
    ]

    independent_clusters = _unique(
        c.get("cluster_id") or c.get("case_id") for c in qualifying
    )
    live_reviewers = _unique(c.get("live_reviewer") for c in qualifying)
    shadow_reviewers = _unique(c.get("shadow_reviewer") for c in qualifying)
    observed_qualifying_strata = _unique(
        c.get("case_mix_stratum") for c in qualifying
    )
    observed_all_strata = _unique(c.get("case_mix_stratum") for c in cases)

    by_stratum: dict[str, dict[str, Any]] = {}
    strata = sorted(str(x) for x in observed_all_strata)
    for stratum in strata:
        rows = [c for c in cases if str(c.get("case_mix_stratum")) == stratum]
        localized = [
            c for c in rows
            if c.get("divergence") is True
            and coordinate in _set(c.get("localized_coordinates"))
        ]
        by_stratum[stratum] = {
            "cases": len(rows),
            "localized_divergences": len(localized),
            "localized_divergence_rate": _rate(len(localized), len(rows)),
            "independent_clusters": len(_unique(
                c.get("cluster_id") or c.get("case_id") for c in localized
            )),
            "live_reviewers": sorted(str(x) for x in _unique(
                c.get("live_reviewer") for c in localized
            )),
            "shadow_reviewers": sorted(str(x) for x in _unique(
                c.get("shadow_reviewer") for c in localized
            )),
        }

    live_reviewer_counts = Counter(
        str(c.get("live_reviewer")) for c in qualifying if c.get("live_reviewer")
    )
    shadow_reviewer_counts = Counter(
        str(c.get("shadow_reviewer")) for c in qualifying if c.get("shadow_reviewer")
    )

    by_live_reviewer: dict[str, dict[str, Any]] = {}
    for reviewer in sorted(str(x) for x in _unique(c.get("live_reviewer") for c in cases)):
        rows = [c for c in cases if str(c.get("live_reviewer")) == reviewer]
        localized = [
            c for c in rows
            if c.get("divergence") is True
            and coordinate in _set(c.get("localized_coordinates"))
        ]
        by_live_reviewer[reviewer] = {
            "cases": len(rows),
            "localized_divergences": len(localized),
            "localized_divergence_rate": _rate(len(localized), len(rows)),
            "case_mix_strata": sorted(str(x) for x in _unique(
                c.get("case_mix_stratum") for c in rows
            )),
        }

    by_shadow_reviewer: dict[str, dict[str, Any]] = {}
    for reviewer in sorted(str(x) for x in _unique(c.get("shadow_reviewer") for c in cases)):
        rows = [c for c in cases if str(c.get("shadow_reviewer")) == reviewer]
        localized = [
            c for c in rows
            if c.get("divergence") is True
            and coordinate in _set(c.get("localized_coordinates"))
        ]
        by_shadow_reviewer[reviewer] = {
            "cases": len(rows),
            "localized_divergences": len(localized),
            "localized_divergence_rate": _rate(len(localized), len(rows)),
            "case_mix_strata": sorted(str(x) for x in _unique(
                c.get("case_mix_stratum") for c in rows
            )),
        }

    reviewer_case_mix_surface: list[dict[str, Any]] = []
    cell_keys = sorted({
        (
            str(c.get("live_reviewer")),
            str(c.get("shadow_reviewer")),
            str(c.get("case_mix_stratum")),
        )
        for c in cases
        if c.get("live_reviewer") and c.get("shadow_reviewer") and c.get("case_mix_stratum")
    })
    for live_id, shadow_id, stratum in cell_keys:
        rows = [
            c for c in cases
            if str(c.get("live_reviewer")) == live_id
            and str(c.get("shadow_reviewer")) == shadow_id
            and str(c.get("case_mix_stratum")) == stratum
        ]
        localized = [
            c for c in rows
            if c.get("divergence") is True
            and coordinate in _set(c.get("localized_coordinates"))
        ]
        reviewer_case_mix_surface.append({
            "live_reviewer": live_id,
            "shadow_reviewer": shadow_id,
            "case_mix_stratum": stratum,
            "cases": len(rows),
            "localized_divergences": len(localized),
            "localized_divergence_rate": _rate(len(localized), len(rows)),
        })

    required_strata = _set(rule.get("required_case_mix_strata"))
    min_clusters = int(rule.get("min_independent_clusters", 1))
    min_live = int(rule.get("min_live_reviewers", 1))
    min_shadow = int(rule.get("min_shadow_reviewers", 1))

    replication_ok = len(independent_clusters) >= min_clusters
    reviewer_substitution_ok = (
        len(live_reviewers) >= min_live
        and len(shadow_reviewers) >= min_shadow
    )
    case_mix_replication_ok = required_strata <= {
        str(x) for x in observed_qualifying_strata
    }

    explicit_support = _set(transport.get("supported_target_strata"))
    observed_support = {str(x) for x in observed_all_strata}
    transport_support = observed_support | explicit_support
    transport_ok = target_strata <= transport_support

    localization_depends_on_adjudicator = bool(
        spec.get("localization_depends_on_adjudicator")
    )
    adjudicator_ok = (
        not localization_depends_on_adjudicator
        or (
            adjudicator.get("status") == "ADEQUATE"
            and bool(adjudicator.get("provenance"))
            and bool(adjudicator.get("scope"))
        )
    )

    cluster_multiplicity = Counter(
        str(c.get("cluster_id") or c.get("case_id")) for c in qualifying
    )
    repeated_rows_same_cluster = {
        k: v for k, v in cluster_multiplicity.items() if v > 1
    }

    findings: list[str] = []
    if qualifying:
        findings.append("REPEATED_LOCALIZED_DIVERGENCE")
    if repeated_rows_same_cluster:
        findings.append("ROW_REPETITION_IS_NOT_INDEPENDENT_REPLICATION")
    if not replication_ok:
        findings.append("INDEPENDENT_CLUSTER_REPLICATION_INSUFFICIENT")
    if replication_ok and not reviewer_substitution_ok:
        findings.append("REVIEWER_SUBSTITUTION_INSUFFICIENT")
    if replication_ok and reviewer_substitution_ok and not case_mix_replication_ok:
        findings.append("CASE_MIX_REPLICATION_INSUFFICIENT")
    if not transport_ok:
        findings.append("TARGET_CASE_MIX_SUPPORT_GAP")
    if not adjudicator_ok:
        findings.append("ADJUDICATOR_CALIBRATION_GAP")

    # Directionality is descriptive only. It does not determine correctness.
    directions = Counter(
        str(c.get("direction")) for c in qualifying if c.get("direction")
    )
    if directions and max(directions.values()) == sum(directions.values()):
        findings.append("DIRECTIONALLY_STABLE_DIVERGENCE")

    if not qualifying:
        state = "NO_REPLICATED_LOCALIZED_DIVERGENCE"
    elif not replication_ok:
        state = "CASE_SPECIFIC_OR_UNDERREPLICATED"
    elif not reviewer_substitution_ok:
        state = "REVIEWER_CONDITIONAL_SURFACE"
    elif not case_mix_replication_ok:
        state = "CASE_MIX_CONDITIONAL_SURFACE"
    elif not adjudicator_ok:
        state = "SYSTEMATIC_CLAIM_HOLD_ADJUDICATOR"
    elif not transport_ok:
        state = "SYSTEMATIC_CLAIM_HOLD_TRANSPORT"
    else:
        state = "TRANSPORTABLE_SYSTEMATIC_CANDIDATE"

    return {
        "claim_id": claim.get("id"),
        "localized_coordinate": coordinate,
        "qualifying_rows": len(qualifying),
        "independent_cluster_count": len(independent_clusters),
        "live_reviewer_count": len(live_reviewers),
        "shadow_reviewer_count": len(shadow_reviewers),
        "qualifying_case_mix_strata": sorted(
            str(x) for x in observed_qualifying_strata
        ),
        "target_case_mix_strata": sorted(target_strata),
        "transport_support": sorted(transport_support),
        "replication_ok": replication_ok,
        "reviewer_substitution_ok": reviewer_substitution_ok,
        "case_mix_replication_ok": case_mix_replication_ok,
        "transport_ok": transport_ok,
        "adjudicator_calibration_ok": adjudicator_ok,
        "by_case_mix_stratum": by_stratum,
        "by_live_reviewer": by_live_reviewer,
        "by_shadow_reviewer": by_shadow_reviewer,
        "reviewer_case_mix_surface": reviewer_case_mix_surface,
        "live_reviewer_localization_counts": dict(sorted(live_reviewer_counts.items())),
        "shadow_reviewer_localization_counts": dict(sorted(shadow_reviewer_counts.items())),
        "repeated_rows_same_cluster": repeated_rows_same_cluster,
        "direction_counts": dict(sorted(directions.items())),
        "findings": findings,
        "systematic_state": state,
    }
