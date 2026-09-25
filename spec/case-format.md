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
  "derived_records": [],
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


## Derived records — 0.2

A derived record is a score, credential, summary, flag, profile feature or other token produced from earlier evidence.

```json
{
  "id": "r1",
  "kind": "score",
  "subject": "person1",
  "person_only": true,
  "source_outcome": "event1",
  "dependencies": ["ev1", "support1"],
  "provenance_visibility": "sealed",
  "reopenable": true,
  "provenance_ref": "lineage:r1",
  "portable": true,
  "semantic_equivalence": true,
  "validated_scopes": ["bounded_action"],
  "public_metadata": []
}
```

Rules:

- `dependencies` preserve inputs and causal/support relations material to interpretation.
- `provenance_visibility: sealed` is allowed; provenance persistence does not require public flagging.
- sealed provenance requires both `reopenable: true` and a live `provenance_ref`.
- `portable: true` for a support-dependent record requires either `semantic_equivalence: true` or an explicit `interpretation_limit`.
- `validated_scopes` bounds the claim types a derivative may support without a fresh bridge.
- public exposure of sensitive support/institution metadata should carry a `disclosure_basis`.

### 0.835 invariant codes

- `N012` — derived record has no dependency manifest
- `N013` — jointly produced outcome compressed into person-only record while contributor dependencies disappear
- `N014` — sealed provenance has no live reopening route
- `N015` — portable support-dependent record lacks semantic-equivalence evidence or interpretation limit
- `N016` — derived record used beyond validated claim scope without fresh bridge
- `N017` — warning: public record exposes sensitive dependency metadata without stated disclosure basis

### Trace command

```bash
PYTHONPATH=src python -m nomos examples/derived_record_valid.json --trace r1
```

The trace operation returns the transitive dependency closure of a derived record. It is a provenance aid, not a person inference.
