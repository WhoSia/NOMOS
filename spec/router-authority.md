# NOMOS Router Authority 0.1

This format describes the **meta-authority that selects among review paths**.

It does not rank persons, reviewers, or institutions.

## Core idea

Routing becomes epistemically material when eligible routes differ in what they can:

- see;
- challenge;
- break as a dependency;
- or remedy.

A routing decision is therefore represented separately from the review result.

## Routes

Each route declares a structural effect profile.

```json
{
  "id": "deep_review",
  "visibility": ["decision_record", "sealed_lineage", "corrections"],
  "breaks": ["Q", "E", "M", "C"],
  "remedies": ["affirm", "narrow", "remand", "reverse"]
}
```

Two routes are **materially different** when they differ on at least one of:

- `visibility`
- `breaks`
- `remedies`

## Routing rules

```json
{
  "id": "high_consequence_rule",
  "trigger": "high_consequence",
  "precommitted": true,
  "trigger_provenance": "consequence-class ledger"
}
```

Rules may be dynamic, but changes should be provenance-preserving.

If a rule explicitly uses decision outcome direction, the specification expects an `authorized_valence_basis`; otherwise the analyzer reports `OUTCOME_SENSITIVE_ROUTING_RULE`.

## Assignments

```json
{
  "id": "case_b",
  "eligible_routes": ["ordinary_review", "deep_review"],
  "selected_route": "deep_review",
  "rule": "high_consequence_rule",
  "selection_provenance": "routing receipt case_b",
  "counter_route_available": true
}
```

The analyzer checks whether:

- the selected route and eligible routes exist;
- the routing rule exists;
- a material route choice has a counter-routing route;
- a strictly broader eligible route is excluded without a reason;
- the routing decision retains selection provenance.

A broader route is not automatically better. The diagnostic only records unexplained material exclusion.

## Router controls

A router may control:

- assignment;
- trigger recognition;
- termination;
- reassembly.

If one router controls at least three of these and is itself unreviewable, the analyzer reports `UNREVIEWABLE_ROUTER_CONCENTRATION`.

A reviewable router should name its `router_review_route`.

## States

- `INVALID_ROUTING_GRAPH`
- `META_AUTHORITY_CAPTURE_RISK`
- `ROUTING_CONTESTABILITY_HOLD`
- `ROUTING_PROVENANCE_HOLD`
- `ROUTING_CONTESTABLE_CANDIDATE`

These are structural research states, not moral or legal verdicts.

## Run

```bash
PYTHONPATH=src python -m nomos examples/router_contestable.json --audit-router
PYTHONPATH=src python -m nomos examples/router_capture.json --audit-router
```
