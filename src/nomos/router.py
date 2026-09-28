from __future__ import annotations

from typing import Any


def _sets(xs: list[str] | None) -> set[str]:
    return {str(x) for x in (xs or []) if x}


def _by_id(items: list[dict[str, Any]]) -> dict[str, dict[str, Any]]:
    return {str(item["id"]): item for item in items if item.get("id")}


def _route_effect(route: dict[str, Any]) -> dict[str, list[str]]:
    return {
        "visibility": sorted(_sets(route.get("visibility"))),
        "breaks": sorted(_sets(route.get("breaks"))),
        "remedies": sorted(_sets(route.get("remedies"))),
    }


def _materially_different(a: dict[str, Any], b: dict[str, Any]) -> bool:
    return any(
        _sets(a.get(key)) != _sets(b.get(key))
        for key in ("visibility", "breaks", "remedies")
    )


def _strictly_expands(a: dict[str, Any], b: dict[str, Any]) -> bool:
    """
    True when route a is at least as capable as b on every declared dimension
    and strictly broader on at least one. This is descriptive, not a policy rank.
    """
    keys = ("visibility", "breaks", "remedies")
    at_least = all(_sets(b.get(key)) <= _sets(a.get(key)) for key in keys)
    strictly = any(_sets(b.get(key)) < _sets(a.get(key)) for key in keys)
    return at_least and strictly


def analyze_router(spec: dict[str, Any]) -> dict[str, Any]:
    """
    Audit review routing as a meta-authority.

    The analyzer describes path effects, provenance and contestability.
    It never infers person merit, blame, risk, truth or legal entitlement.
    """
    routes = _by_id(spec.get("routes", []))
    rules = _by_id(spec.get("routing_rules", []))
    assignments = [a for a in spec.get("assignments", []) if a.get("id")]

    material_assignments: list[dict[str, Any]] = []
    provenance_gaps: list[str] = []
    counter_route_gaps: list[str] = []
    unexplained_exclusions: list[dict[str, Any]] = []
    invalid_refs: list[dict[str, Any]] = []
    outcome_sensitive_rules: list[str] = []

    for rid, rule in rules.items():
        if rule.get("uses_outcome_direction") is True and not rule.get("authorized_valence_basis"):
            outcome_sensitive_rules.append(rid)

    for assignment in assignments:
        aid = str(assignment["id"])
        selected = str(assignment.get("selected_route", ""))
        eligible = [str(x) for x in assignment.get("eligible_routes", []) if x]

        missing_routes = [rid for rid in [selected, *eligible] if rid and rid not in routes]
        rule_id = str(assignment.get("rule", ""))
        if missing_routes or (rule_id and rule_id not in rules):
            invalid_refs.append({
                "assignment": aid,
                "missing_routes": sorted(set(missing_routes)),
                "missing_rule": rule_id if rule_id and rule_id not in rules else None,
            })
            continue

        if not assignment.get("selection_provenance") or not rule_id:
            provenance_gaps.append(aid)

        selected_route = routes.get(selected, {})
        alternatives = [routes[rid] for rid in eligible if rid in routes and rid != selected]
        material_alternatives = [
            route for route in alternatives
            if _materially_different(route, selected_route)
        ]

        if material_alternatives:
            material_assignments.append({
                "assignment": aid,
                "selected_route": selected,
                "material_alternatives": sorted(str(route["id"]) for route in material_alternatives),
            })
            if not assignment.get("counter_route_available"):
                counter_route_gaps.append(aid)

        broader = [
            route for route in alternatives
            if _strictly_expands(route, selected_route)
        ]
        if broader and not assignment.get("exclusion_reason"):
            unexplained_exclusions.append({
                "assignment": aid,
                "selected_route": selected,
                "unexplained_broader_routes": sorted(str(route["id"]) for route in broader),
            })

    controls = {
        "assignment": bool(spec.get("router_controls_assignment")),
        "trigger": bool(spec.get("router_controls_triggers")),
        "termination": bool(spec.get("router_controls_termination")),
        "reassembly": bool(spec.get("router_controls_reassembly")),
    }
    controlled = sorted(name for name, active in controls.items() if active)
    router_reviewable = bool(spec.get("router_reviewable"))
    router_review_route = spec.get("router_review_route")
    concentrated_unreviewable = len(controlled) >= 3 and not router_reviewable

    route_effects = {
        rid: _route_effect(route)
        for rid, route in routes.items()
    }

    rule_precommit_gaps = sorted(
        rid for rid, rule in rules.items()
        if rule.get("precommitted") is not True
    )
    trigger_observability_gaps = sorted(
        rid for rid, rule in rules.items()
        if rule.get("trigger") not in (None, "default")
        and not rule.get("trigger_provenance")
    )

    findings: list[str] = []
    if invalid_refs:
        findings.append("BROKEN_ROUTING_REFERENCE")
    if provenance_gaps:
        findings.append("ROUTING_PROVENANCE_GAP")
    if counter_route_gaps:
        findings.append("MATERIAL_ROUTING_WITHOUT_COUNTER_ROUTE")
    if unexplained_exclusions:
        findings.append("UNEXPLAINED_MATERIAL_ROUTE_EXCLUSION")
    if outcome_sensitive_rules:
        findings.append("OUTCOME_SENSITIVE_ROUTING_RULE")
    if rule_precommit_gaps:
        findings.append("UNFROZEN_ROUTING_RULE")
    if trigger_observability_gaps:
        findings.append("TRIGGER_PROVENANCE_GAP")
    if concentrated_unreviewable:
        findings.append("UNREVIEWABLE_ROUTER_CONCENTRATION")
    if router_reviewable and not router_review_route:
        findings.append("ROUTER_REVIEW_ROUTE_UNSPECIFIED")

    if invalid_refs:
        state = "INVALID_ROUTING_GRAPH"
    elif concentrated_unreviewable:
        state = "META_AUTHORITY_CAPTURE_RISK"
    elif provenance_gaps or counter_route_gaps or outcome_sensitive_rules:
        state = "ROUTING_CONTESTABILITY_HOLD"
    elif unexplained_exclusions or rule_precommit_gaps or trigger_observability_gaps:
        state = "ROUTING_PROVENANCE_HOLD"
    else:
        state = "ROUTING_CONTESTABLE_CANDIDATE"

    return {
        "router_id": spec.get("router_id"),
        "route_effects": route_effects,
        "material_assignments": material_assignments,
        "routing_provenance_gaps": sorted(provenance_gaps),
        "counter_route_gaps": sorted(counter_route_gaps),
        "unexplained_material_route_exclusions": unexplained_exclusions,
        "outcome_sensitive_rules": sorted(outcome_sensitive_rules),
        "unfrozen_routing_rules": rule_precommit_gaps,
        "trigger_provenance_gaps": trigger_observability_gaps,
        "router_controls": controlled,
        "router_reviewable": router_reviewable,
        "router_review_route": router_review_route,
        "unreviewable_router_concentration": concentrated_unreviewable,
        "invalid_references": invalid_refs,
        "findings": findings,
        "routing_state": state,
    }
