# Typed Correction Propagation and Semantic Re-Derivation

NOMOS-0.850 does not redefine generic correction propagation.

Earlier NOMOS already established:

- correction is a graph operation;
- descendants can require recomputation, invalidation, reopening, independence certification or historical-only status;
- hidden descendants create bounded residual repair debt;
- recipient notification and recipient correction are distinct;
- same outcomes may survive only through fresh warrant.

0.850 adds the missing layer:

**correction type → descendant dependency semantics → operation-specific re-derivation**

## Correction dimensions

A correction payload can change any subset of:

- `factual`
- `provenance`
- `semantic`
- `authority`
- `temporal`
- `regime`
- `consequence`

Corrections are therefore typed state changes, not one boolean flag.

## Dependency dimensions

Each descendant declares which correction dimensions from each parent materially affect it.

```json
{
  "id": "summary",
  "dependencies": ["source_record"],
  "dependency_dimensions": {
    "source_record": ["semantic", "authority"]
  }
}
```

This prevents both over-repair and under-repair.

A graph edge alone does not show which property of the parent the child inherited.

## Operations

The executable surface recognizes:

- `no_action`
- `factual_recompute`
- `provenance_rebind`
- `semantic_rederive`
- `query_replay`
- `authority_deauthorize`
- `consequence_reopen`
- `quarantine`
- `historical_only`
- `fresh_reconstitution`

### Semantic re-derivation

A semantic correction cannot be satisfied merely by rerunning the same defeated mapper.

If the facts are unchanged but the event→meaning or record→person bridge changed, the transformation or semantic rule must itself be revalidated/versioned.

Core rule:

**RECOMPUTATION UNDER A DEFEATED INTERPRETIVE RULE IS NOT RE-DERIVATION.**

### Generator resurrection

Where a semantic or regime correction affects an active generator, the generator must be updated or explicitly disabled.

Otherwise corrected outputs can be recreated incorrectly on the next refresh.

### Same-output fresh warrant

A corrected pipeline may legitimately produce the same output.

For a governing state, same-output survival requires both:

- `fresh_adoption: true`
- `fresh_warrant: true`

The point is not to force a different conclusion. It is to distinguish inertia from re-earned authority.

## Recipient branch states

Recipient recall tracks correction state, not message delivery.

Typical states:

- `updated`
- `fresh_independent`
- `historical_only`
- `deauthorized`
- `notice_only`
- `pending`
- `unknown`

A recipient claiming `fresh_independent` must record local re-derivation and fresh warrant.

## Invariant codes

- `CP001` — unknown correction dimension
- `CP002` — missing correction source
- `CP003` — impacted descendant lacks dependency-dimension semantics
- `CP004` — impacted descendant has no correction operation
- `CP005` — declared operation does not address an affected correction dimension
- `CP006` — semantic correction reruns unchanged interpretive transformation
- `CP007` — regime correction replays unchanged/unrevalidated selection rule
- `CP008` — stale active generator can regenerate defeated state
- `CP009` — no-action treatment lacks independence/source-ablation evidence
- `CP010` — same governing output lacks fresh adoption/warrant
- `CP011` — historical-only record remains governing
- `CP012` — deauthorized record remains governing
- `CP013` — consequence reopening lacks review route
- `CP014` — warning: notice delivered but recipient state unresolved
- `CP015` — recipient fresh-independence claim lacks local re-derivation/fresh warrant
- `CP016` — completion claimed while descendants or recipient branches remain unresolved

## CLI

```bash
PYTHONPATH=src python -m nomos examples/correction_propagation_safe.json --audit-correction-propagation
PYTHONPATH=src python -m nomos examples/correction_propagation_unsafe.json --audit-correction-propagation
```

The safe fixture should pass.

The unsafe fixture intentionally preserves the same output under stale semantic/query rules, leaves a stale generator active, lacks consequence review, and treats notice-only external propagation as compatible with completion.
