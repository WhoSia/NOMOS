# Current Research Head — NOMOS-0.843

**Status: STRONG PASS / CLOSED**

## Primitive question

How may an institution learn whether its routing policy misses correctable cases when routed-away cases do not reveal what deeper review would have found?

## Core theorem

Let `D(C)` be the live defeat regions for routing-policy claim `C`.
Each restoration method `m` has:
- a declared coverage set `K(m) ⊆ D(C)`;
- an admissibility status `A(m)`.

A restoration portfolio is sufficient when the union of admissible method coverage spans `D(C)`.

NOMOS seeks **inclusion-minimal safe covers**, not one universal audit score or maximal review volume.

**COUNTERFACTUAL REVIEW COVERAGE ≠ MAXIMAL REVIEW.**

## Required separations

- routed-away case ≠ research review entitlement;
- quality-assurance review ≠ individual appeal;
- shadow review ≠ hidden second adjudication;
- disagreement ≠ ground truth;
- defeat coverage ≠ population representativeness;
- random sample ≠ targeted sample;
- natural overlap ≠ randomization;
- off-policy uncertainty ≠ support;
- information value ≠ action authority.

## Shadow review

A valid shadow lane is diagnostic by default:
- independent enough to break the target dependency;
- explicit about context/blinding;
- unable to change the live consequence without a separately governed escalation path;
- provenance-preserving.

**SHADOW REVIEW IS A SENSOR, NOT A SECRET COURT.**

## Sampling constitution

- random: broad monitoring / prevalence-compatible under a valid frame;
- stratified random: stronger rare-region coverage with design-aware aggregation;
- targeted: high diagnostic yield for known failures, weak population-prevalence authority;
- hybrid: may separate discovery from prevalence, without becoming universally optimal.

## Safe restoration ladder

Existing evidence → natural overlap → independent audit → shadow review → supported off-policy evaluation → random tie-break among independently acceptable routes → independently justified staged restoration.

No step receives action authority from information value alone.

## Cross-Lab bounded re-entry

- NOMOS-0.831: ethical recovery ladder and no-harm probe constitution;
- EvoNOMOS DIP-12: counterfactual coverage must target decision-relevant uncertainty;
- EPISTEME-P6/P9: off-path loss and restoration-sufficient provenance remain novelty pressure, not wholesale import.

## Executable materialization

Repository version: **v0.6.0**

Added:
- `src/nomos/feedback_restoration.py`;
- Feedback Support Restoration 0.1;
- `--plan-feedback-restoration`;
- safe / coverage-HOLD / unsafe fixtures;
- inclusion-minimal safe restoration sets;
- shadow-review independence and consequence firewall;
- off-policy support audit;
- natural-overlap assignment provenance;
- acceptable-option randomization guard;
- harmful-exploration rejection;
- uncovered live-defeat-region detection;
- regression and CI integration.

Frozen structural replay:
- safe fixture → **two inclusion-minimal safe covers**;
- hold fixture → **RESTORATION_COVERAGE_HOLD** with `routed_away_complex` uncovered;
- unsafe fixture → **RESTORATION_METHOD_REJECTED**.

## External bounded donors

- Lakkaraju et al. (2017), DOI **10.1145/3097983.3098066**;
- Gao & Zha, DOI **10.1287/opre.2022.2382**;
- ACUS (2021), **Quality Assurance Systems in Agency Adjudication**;
- Jia, Ben-Michael & Imai (2026), DOI **10.1093/jrsssa/qnaf122**.

## Next title only

**NOMOS-0.844 — Shadow-Audit Disagreement, Adjudication of Review Divergence, Error-Source Localization, Policy-Update Authority & the Primitive Question of What an Institution May Infer When Live Review and Restored Counterfactual Review Disagree about the Same Person-Judgment**

**TITLE-LOCKED / NOT OPENED.**
