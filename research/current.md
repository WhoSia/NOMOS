# Current Research Head — NOMOS-0.845

**Status: STRONG PASS / CLOSED**

## Primitive question

When does repeated live↔shadow disagreement become evidence of a systematic review failure rather than a collection of case-specific conflicts?

## Core theorem

A repeated disagreement is not yet a replication.

For a previously localized mechanism `m`, systematicity is indexed to a surface:

**F_m(g, l, s, t)**

where:
- `g` = case-mix stratum;
- `l` = live-reviewer condition;
- `s` = shadow-reviewer condition;
- `t` = time/policy regime.

A claim becomes broader only when the localized mechanism survives the dimensions over which the claim intends to generalize.

**REPETITION ≠ REPLICATION.**

**SYSTEMATIC ≠ GLOBAL.**

## Replication unit

The default scientific replication unit is a provenance-independent case cluster, not a row.

Repeated observations from one person/event/source lineage remain useful but do not multiply independent replication authority.

## Promotion ladder

- **CASE_SPECIFIC_OR_UNDERREPLICATED**
- **REVIEWER_CONDITIONAL_SURFACE**
- **CASE_MIX_CONDITIONAL_SURFACE**
- **SYSTEMATIC_CLAIM_HOLD_ADJUDICATOR**
- **SYSTEMATIC_CLAIM_HOLD_TRANSPORT**
- **TRANSPORTABLE_SYSTEMATIC_CANDIDATE**

The final state is still claim-scoped and mechanism-indexed.

## Reviewer conditionality

Reviewer substitution is a generalization test, not a blame test.

If a localized divergence survives only one reviewer/reviewer-pair condition, the correct claim is reviewer-conditional.

## Case-mix transport

Observed recurrence in one case family does not identify a target-wide failure rate.

Target strata require:
- direct support, or
- an explicit transport bridge.

**CASE-MIX SUPPORT IS PART OF SYSTEMATIC-FAILURE AUTHORITY.**

## Adjudicator calibration

If the label “localized failure” depends on a higher-order adjudicator, the adjudicator becomes another measurement facet.

Required:
- calibration status;
- calibration scope;
- provenance.

Calibration does not establish truth sovereignty.

## External bounded donors

- Hesselberg et al. (2026), DOI **10.1371/journal.pone.0356108**;
- Brennan (2001), DOI **10.1007/978-1-4757-3456-0**;
- Brennan (2001), DOI **10.1111/j.1745-3984.2001.tb01129.x**;
- Hayes & Murray (1995), DOI **10.1111/j.1365-2753.1995.tb00015.x**;
- Dawid & Skene (1979), DOI **10.2307/2346806**.

## Executable materialization

Repository version: **v0.8.0**

Added:
- `src/nomos/divergence_replication.py`;
- Divergence Replication 0.1 spec;
- `--audit-divergence-replication`;
- systematic / reviewer-conditional / case-mix-conditional / transport-HOLD fixtures;
- provenance-independent cluster counting;
- reviewer substitution checks;
- case-mix transport support;
- adjudicator calibration gate;
- reviewer × case-mix conditional surfaces;
- manual regression tests.

The GitHub Actions workflow was **not modified** in 0.845.

Expected frozen states:
- systematic fixture → **TRANSPORTABLE_SYSTEMATIC_CANDIDATE**;
- reviewer-only recurrence → **REVIEWER_CONDITIONAL_SURFACE**;
- complex-only recurrence → **CASE_MIX_CONDITIONAL_SURFACE**;
- unsupported target stratum → **SYSTEMATIC_CLAIM_HOLD_TRANSPORT**;
- adjudicator calibration removed → **SYSTEMATIC_CLAIM_HOLD_ADJUDICATOR**.

## Research OS runtime

Opening CI:
**CI-NOMOS-0.845-OPEN-20261004 / PASS / ONE-CLOSURE-COURT.**

Owner constraint:
**Do not create bot contributors through GitHub Actions.**
0.845 respected this by leaving the Actions workflow untouched.

## Next title only

**NOMOS-0.846 — Failure-Surface Intervention, Review-System Repair, Error Redistribution, Counterfactual Repair Evaluation & the Primitive Question of Whether a Reform That Reduces a Known Systematic Review Failure May Legitimately Be Adopted When It Also Moves Disagreement, Delay or Error into Different Cases, Reviewers or Consequence Classes**

**TITLE-LOCKED / NOT OPENED.**
