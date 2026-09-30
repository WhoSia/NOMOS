# NOMOS Review Divergence 0.1

This format analyzes disagreement between a live review and a restored/shadow review of the same person-related judgment.

It does not decide which reviewer is "right" merely from disagreement.

## Review contract

Each review may declare:

- `claim`
- `evidence_set`
- `provenance_window`
- `visibility`
- `rule_version`
- `model`
- `threshold`
- `burden_rule`
- `procedure`
- `timepoint`
- `outcome`

These fields form the review contract.

Two different outcomes are not meaningfully comparable until the relevant contract dimensions are aligned or their differences are explicitly treated as the source of divergence.

## Divergence states

- `OUTCOME_CONVERGENCE`
- `NONCOMPARABLE_REVIEW_QUESTIONS`
- `VALIDATED_ERROR_SOURCE_PRESENT`
- `STRUCTURAL_SOURCE_LOCALIZED`
- `ALIGNED_RESIDUAL_DIVERGENCE`
- `DIVERGENCE_UNDERDETERMINED`

## Structural localization

The analyzer can use declared alignment tests such as:

- `OUTCOME_CONVERGED_AFTER_ALIGNMENT`
- `OUTCOME_FLIPPED_AFTER_SWAP`

These localize a coordinate only when the comparison was actually performed.

A plain contract difference is not itself causal proof.

## Validated defects

A review may declare externally validated defects, for example:

```json
{
  "validated_defects": [
    {
      "code": "STALE_RULE_VERSION",
      "validated": true,
      "source": "rule-version audit",
      "scope": "live review only"
    }
  ]
}
```

Only validated defects enter `validated_error_sources`.

## Policy-update authority

A single disagreement is normally diagnostic only.

`POLICY_UPDATE_CANDIDATE` requires:
- a localized source or validated defect;
- systemic replication;
- a link to the routing/review mechanism being revised.

This is a candidate authority state, not an automatic policy change.

## Shadow consequence firewall

A shadow result does not silently overwrite the live individual case.

If `shadow_result_directly_changes_live_case` is true, the analyzer reports `SHADOW_TO_LIVE_CONSEQUENCE_LEAK`.

## Run

```bash
PYTHONPATH=src python -m nomos examples/review_divergence_mismatch.json --audit-review-divergence
PYTHONPATH=src python -m nomos examples/review_divergence_localized.json --audit-review-divergence
PYTHONPATH=src python -m nomos examples/review_divergence_residual.json --audit-review-divergence
```
