from __future__ import annotations

from itertools import combinations
from typing import Any


def _sets(xs: list[str] | None) -> set[str]:
    return {str(x) for x in (xs or []) if x}


def _methods(spec: dict[str, Any]) -> list[dict[str, Any]]:
    return [m for m in spec.get("methods", []) if m.get("id")]


def _method_admissible(method: dict[str, Any]) -> tuple[bool, list[str]]:
    reasons: list[str] = []

    if method.get("withholds_entitled_review") is True:
        reasons.append("WITHHOLDS_ENTITLED_REVIEW")

    if method.get("creates_new_person_burden") is True and not method.get("independent_action_justification"):
        reasons.append("NEW_PERSON_BURDEN_WITHOUT_INDEPENDENT_JUSTIFICATION")

    kind = str(method.get("kind", ""))

    if kind == "shadow_review":
        if method.get("changes_immediate_consequence") is True:
            reasons.append("SHADOW_REVIEW_ALTERS_IMMEDIATE_CONSEQUENCE")
        if not method.get("independent_reviewer"):
            reasons.append("SHADOW_REVIEW_NOT_INDEPENDENT")

    if kind == "off_policy":
        if not method.get("support_audited"):
            reasons.append("OFF_POLICY_SUPPORT_UNAUDITED")
        if method.get("unsupported_extrapolation") is True:
            reasons.append("OFF_POLICY_UNSUPPORTED_EXTRAPOLATION")

    if kind == "randomized_tie_break":
        if method.get("all_options_independently_acceptable") is not True:
            reasons.append("RANDOMIZATION_OUTSIDE_ACCEPTABLE_OPTION_SET")

    if kind == "natural_overlap":
        if not method.get("assignment_provenance"):
            reasons.append("NATURAL_OVERLAP_ASSIGNMENT_PROVENANCE_MISSING")

    return (not reasons, reasons)


def _covers(methods: list[dict[str, Any]], required: set[str]) -> bool:
    covered: set[str] = set()
    for method in methods:
        covered |= _sets(method.get("covers"))
    return required <= covered


def minimal_safe_restoration_sets(spec: dict[str, Any]) -> list[list[str]]:
    required = _sets(spec.get("live_defeat_regions"))
    admissible = [m for m in _methods(spec) if _method_admissible(m)[0]]

    if not required:
        return [[]]

    out: list[list[str]] = []
    for size in range(1, len(admissible) + 1):
        for combo in combinations(admissible, size):
            if not _covers(list(combo), required):
                continue
            if any(
                _covers(list(sub), required)
                for sub_size in range(1, size)
                for sub in combinations(combo, sub_size)
            ):
                continue
            out.append([str(m["id"]) for m in combo])
    return out


def analyze_feedback_restoration(spec: dict[str, Any]) -> dict[str, Any]:
    """
    Audit plans for restoring feedback support without requiring harmful exploration.

    The analyzer identifies safe coverage structure only. It does not decide
    person merit, legal entitlement, blame, risk, or substantive policy optimality.
    """
    required = _sets(spec.get("live_defeat_regions"))
    methods = _methods(spec)

    admissible: list[str] = []
    rejected: list[dict[str, Any]] = []
    coverage_by_method: dict[str, list[str]] = {}
    assumptions_by_method: dict[str, list[str]] = {}

    safe_covered: set[str] = set()

    for method in methods:
        mid = str(method["id"])
        coverage = _sets(method.get("covers")) & required
        coverage_by_method[mid] = sorted(coverage)
        assumptions_by_method[mid] = sorted(_sets(method.get("assumptions")))

        ok, reasons = _method_admissible(method)
        if ok:
            admissible.append(mid)
            safe_covered |= coverage
        else:
            rejected.append({
                "method": mid,
                "reasons": reasons,
                "would_cover": sorted(coverage),
            })

    uncovered = sorted(required - safe_covered)
    minimal_sets = minimal_safe_restoration_sets(spec)

    support_gaps: list[dict[str, Any]] = []
    for method in methods:
        mid = str(method["id"])
        kind = str(method.get("kind", ""))
        if kind == "off_policy" and method.get("support_audited") is True:
            unsupported = sorted(_sets(method.get("unsupported_regions")) & required)
            if unsupported:
                support_gaps.append({
                    "method": mid,
                    "unsupported_regions": unsupported,
                })

    shadow_methods = [
        str(m["id"])
        for m in methods
        if str(m.get("kind", "")) == "shadow_review"
        and _method_admissible(m)[0]
    ]

    independent_channels = [
        str(m["id"])
        for m in methods
        if _method_admissible(m)[0]
        and str(m.get("kind", "")) in {
            "independent_audit",
            "shadow_review",
            "natural_overlap",
            "off_policy",
            "frozen_holdout",
            "randomized_tie_break",
        }
    ]

    restoration_provenance_gaps = sorted(
        str(m["id"])
        for m in methods
        if _method_admissible(m)[0] and not m.get("provenance")
    )

    consequence_firewall_gaps = sorted(
        str(m["id"])
        for m in methods
        if str(m.get("kind", "")) == "shadow_review"
        and _method_admissible(m)[0]
        and m.get("result_can_change_live_consequence") is not False
    )

    if any("WITHHOLDS_ENTITLED_REVIEW" in x["reasons"] for x in rejected):
        findings = ["UNSAFE_RESTORATION_METHOD_PRESENT"]
    else:
        findings = []

    if uncovered:
        findings.append("LIVE_DEFEAT_REGION_UNCOVERED")
    if support_gaps:
        findings.append("OFF_POLICY_SUPPORT_GAP")
    if restoration_provenance_gaps:
        findings.append("RESTORATION_PROVENANCE_GAP")
    if consequence_firewall_gaps:
        findings.append("SHADOW_CONSEQUENCE_FIREWALL_GAP")
    if required and not independent_channels:
        findings.append("NO_INDEPENDENT_FEEDBACK_CHANNEL")

    if "UNSAFE_RESTORATION_METHOD_PRESENT" in findings and not minimal_sets:
        state = "RESTORATION_METHOD_REJECTED"
    elif uncovered:
        state = "RESTORATION_COVERAGE_HOLD"
    elif restoration_provenance_gaps or consequence_firewall_gaps or support_gaps:
        state = "RESTORATION_GOVERNANCE_HOLD"
    elif minimal_sets:
        state = "SAFE_RESTORATION_CANDIDATE"
    else:
        state = "NO_RESTORATION_REQUIRED"

    return {
        "policy_id": spec.get("policy_id"),
        "live_defeat_regions": sorted(required),
        "admissible_methods": sorted(admissible),
        "rejected_methods": rejected,
        "coverage_by_method": coverage_by_method,
        "assumptions_by_method": assumptions_by_method,
        "safe_covered_regions": sorted(safe_covered),
        "uncovered_regions": uncovered,
        "minimal_safe_restoration_sets": minimal_sets,
        "shadow_review_methods": sorted(shadow_methods),
        "independent_feedback_channels": sorted(independent_channels),
        "off_policy_support_gaps": support_gaps,
        "restoration_provenance_gaps": restoration_provenance_gaps,
        "shadow_consequence_firewall_gaps": consequence_firewall_gaps,
        "findings": findings,
        "restoration_state": state,
    }
