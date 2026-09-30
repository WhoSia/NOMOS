# NOMOS Feedback Support Restoration 0.1

This format describes how an institution can restore evidence about routed-away cases **without treating people as experimental substrate**.

It does not decide person merit, blame, risk, legal entitlement, or substantive policy optimality.

## Core object

Let `live_defeat_regions` be the case classes or routing regions in which a live rival predicts that the current routing policy may miss a materially correctable case.

Restoration asks:

> Which ethically admissible evidence channels are sufficient to cover those live defeat regions?

The goal is not maximal data collection. The goal is **claim-relevant counterfactual review coverage**.

## Restoration methods

Each method declares:

- `kind`
- `covers`
- provenance
- assumptions
- any person burden
- whether it withholds an already-entitled review
- method-specific admissibility fields

Supported structural kinds include:

- `independent_audit`
- `shadow_review`
- `natural_overlap`
- `off_policy`
- `frozen_holdout`
- `randomized_tie_break`
- other explicitly described methods

## Shadow review

A shadow review is diagnostic, not a hidden second judgment.

For a method with `kind: shadow_review`:

- `independent_reviewer` must be present;
- `changes_immediate_consequence` must be false;
- `result_can_change_live_consequence` must be explicitly false unless a separate governed escalation route is declared outside this diagnostic surface.

This keeps the shadow lane from becoming an ungoverned second adjudication.

## Off-policy support

An off-policy method requires:

- `support_audited: true`;
- no unsupported extrapolation;
- explicit unsupported regions where relevant.

Support failure is not silently imputed away.

## Randomization

`randomized_tie_break` is admissible only when:

`all_options_independently_acceptable: true`.

Randomization may choose among already permissible routes. It does not make an otherwise impermissible route acceptable.

## Natural overlap

Natural overlap requires assignment provenance.

Observed heterogeneity is not treated as randomization by default.

## Harm firewall

A method is structurally inadmissible when it:

- withholds an already-entitled review; or
- creates new person burden solely for learning without an independent action justification.

The analyzer does not trade these harms against information gain.

## Coverage

`minimal_safe_restoration_sets` returns inclusion-minimal sets of admissible methods whose declared coverage spans all `live_defeat_regions`.

This is a coverage object, not a ranked recommendation.

## States

- `RESTORATION_METHOD_REJECTED`
- `RESTORATION_COVERAGE_HOLD`
- `RESTORATION_GOVERNANCE_HOLD`
- `SAFE_RESTORATION_CANDIDATE`
- `NO_RESTORATION_REQUIRED`

`SAFE_RESTORATION_CANDIDATE` means only that the declared live defeat regions have at least one admissible coverage set under the submitted assumptions.

## Run

```bash
PYTHONPATH=src python -m nomos examples/feedback_restoration_safe.json --plan-feedback-restoration
PYTHONPATH=src python -m nomos examples/feedback_restoration_hold.json --plan-feedback-restoration
PYTHONPATH=src python -m nomos examples/feedback_restoration_unsafe.json --plan-feedback-restoration
```
