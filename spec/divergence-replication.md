# NOMOS Divergence Replication 0.1

This format audits whether repeated live↔shadow divergence supports a systematic review-failure claim.

It does not infer reviewer blame, person truth, legal error, or a universal system defect.

## Replication unit

Rows are not automatically independent replications.

The default replication unit is a provenance-independent `cluster_id`, such as a distinct person-event-record lineage or other scientifically justified cluster.

Repeated rows from the same cluster are retained but do not multiply independent replication authority.

## Target mechanism

A systematic claim must identify one already-localized review coordinate, for example:

- visibility
- evidence_set
- rule_version
- threshold
- burden_rule
- procedure

Repeated outcome disagreement without recurring localization is insufficient.

## Replication rule

The caller declares the scope needed for the claim:

```json
{
  "replication_rule": {
    "min_independent_clusters": 4,
    "min_live_reviewers": 2,
    "min_shadow_reviewers": 2,
    "required_case_mix_strata": ["ordinary", "complex"]
  }
}
```

These numbers are claim-scoped precommitments, not universal NOMOS constants.

## Reviewer substitution

If the same localized divergence appears only with one live reviewer or one shadow reviewer, the result is reviewer-conditional.

Reviewer-conditional does not mean reviewer blame. It means the evidence does not yet support system-wide transport beyond that reviewer condition.

## Case-mix transport

A replicated mechanism can remain case-mix conditional.

Target case-mix strata must be:
- directly observed, or
- covered by an explicit transport bridge.

No observed support means no automatic systematic claim.

## Adjudicator calibration

If localization depends on a higher-order adjudicator, the adjudicator is not a truth oracle.

A load-bearing adjudicator must declare:
- calibration status;
- scope;
- provenance.

Calibration may come from seeded structural defects, replayed known failures, dual adjudication, or another fit-for-purpose benchmark.

Calibration only supports the stated localization task.

## States

- `NO_REPLICATED_LOCALIZED_DIVERGENCE`
- `CASE_SPECIFIC_OR_UNDERREPLICATED`
- `REVIEWER_CONDITIONAL_SURFACE`
- `CASE_MIX_CONDITIONAL_SURFACE`
- `SYSTEMATIC_CLAIM_HOLD_ADJUDICATOR`
- `SYSTEMATIC_CLAIM_HOLD_TRANSPORT`
- `TRANSPORTABLE_SYSTEMATIC_CANDIDATE`

The last state is still a candidate, not a universal verdict.

## Run

```bash
PYTHONPATH=src python -m nomos examples/divergence_replication_systematic.json --audit-divergence-replication
PYTHONPATH=src python -m nomos examples/divergence_replication_reviewer_conditional.json --audit-divergence-replication
PYTHONPATH=src python -m nomos examples/divergence_replication_case_mix.json --audit-divergence-replication
PYTHONPATH=src python -m nomos examples/divergence_replication_transport_hold.json --audit-divergence-replication
```
