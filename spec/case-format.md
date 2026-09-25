# NOMOS Case Graph 0.1

The Case Graph is a JSON representation for research and audit.

It is intentionally not a prediction format.

## Top-level fields

```json
{
  "case_id": "string",
  "title": "string",
  "target_environment": {},
  "nodes": [],
  "supports": [],
  "evidence": [],
  "claims": [],
  "edges": [],
  "attributions": [],
  "allocations": [],
  "withdrawals": [],
  "institutions": [],
  "consequences": [],
  "reassembly_route": {}
}
```

The validator accepts extensions. Research cases may add domain-specific fields so long as they do not overwrite core meanings.

## Claims

Important `scope` values:

- `event_fact`
- `causal`
- `bounded_action`
- `prediction`
- `person_predicate`
- `moral`
- `historical`

Important `target` values:

- `current`
- `future_ordinary`
- `historical_untreated`
- `pre_intervention`

## Edges

```json
{
  "source": "ev1",
  "target": "claim1",
  "kind": "supports",
  "bridge": "explicit conduct-to-person bridge",
  "transport_warrant": "explicit cross-regime justification"
}
```

A direct event/evidence → person-predicate edge should normally fail validation.

## Supports

Support classes follow NOMOS-0.833:

- `S0` — constitutive ordinary support
- `S1` — transitional scaffold
- `S2` — protective/safety support
- `S3` — epistemic/monitoring support
- `S4` — artificial probe support

## Attributions

Attributions are typed. They do not represent one scalar responsibility share.

```json
{
  "actor": "person1",
  "outcome": "event1",
  "mode": "credit",
  "causal_contribution": "performance",
  "normative_basis": [
    "skilled participation",
    "effort under available conditions"
  ]
}
```

If credit or blame is asserted from causal contribution, a distinct `normative_basis` is required.

## Allocations

NOMOS prefers `typed_vector`.

A `fixed_sum` scheme requires explicit justification and remains domain-local. It must not become a universal blame function.

## Withdrawals

A support withdrawal is represented as an intervention.

If zero-support functioning is not the actual target environment, removal of `S0` support as a person-capacity test is a constitutional error.

## Distributed institutional chains

When several institutions jointly produce a consequential judgment, provide a `reassembly_route` capable of reconstructing:

**source → transformation → adoption/ratification → consequence → challenge/correction**

## Current invariant codes

- `N000` — broken reference
- `N001` — person predicate lacks event-to-person bridge
- `N002` — causal contribution promoted to credit/blame without normative basis
- `N003` — unjustified fixed-sum responsibility allocation
- `N004` — cross-regime transport without warrant
- `N005` — recovery evidence silently reconstructs untreated history
- `N006` — withdrawal used for person inference without independent authority
- `N007` — ordinary support stripped although zero support is not the target
- `N008` — evidence provenance missing
- `N009` — distributed consequential chain lacks reassembly route
- `N010` — post-withdrawal deterioration promoted directly to person predicate
- `N011` — person-predicate authority attached to a differently scoped claim

These are research guards, not legal rules.
