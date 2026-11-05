# NOMOS-0.885 P1-R11 — Identifiability of Remediation Completion

Date: 2026-11-05. Status: P1 research, P2 HOLD. This is a forward research unit after P1-R10; it does not close earlier debts.

## Target
Can publicly observed order termination, remedial outreach and reported aggregate redress identify whether each original affected account was corrected and whether downstream recipients revised their decisions?

Formally, define latent state Z=(source_corrected, CRA_applied, check_received, downstream_reviewed, downstream_changed), and observed document projection O. Completion is identified only if every permissible latent state consistent with O agrees on the completion predicate.

## Primary source corpus
- Toyota November 20, 2023 consent order, docket 2023-CFPB-0015, paragraph 6(b)(v): 27,507 consumer accounts identified as needing credit-reporting remediation. **Accounts are not interchangeable with unique persons, successfully corrected accounts, or actual downstream remedies.** https://files.consumerfinance.gov/f/documents/cfpb_toyota-motor-credit-corporation-consent-order_2023-11.pdf
- Toyota May 12, 2025 two-page termination order: terminates the consent order and waives alleged noncompliance; no consumer-by-consumer completion finding therein. https://files.consumerfinance.gov/f/documents/cfpb_toyota-motor-credit-corp_order-terminating-consent-order_2025-05.pdf
- Toyota redress administrator FAQ, question 1, 2, 4, 15: company says correction requests were sent to CRAs before consent order, checks were/will be sent, some mailed checks are honored/reissued after termination. These are company-authored claims, not independently verified individual receipt. https://www.tmccremediation.com/faq
- Synchrony official CFPB enforcement record: May 12, 2025 termination describes at least $259 million redress obligations fulfilled and cites additional policy alignment rationale. It does not independently verify each individual's downstream consequences. https://www.consumerfinance.gov/enforcement/actions/synchrony-bank-fka-ge-capital-retail-bank/

## Inference ceiling
The existence of a remediation website, a credit correction **request**, an executed redress plan or a formal closure order does not alone establish CRA application, individual check encashment or later credit decisions. Conversely absence of public proof does not entail noncompliance.

## Epistemic novelty
NOMOS 0.822 (descendants), 0.850 (recipient operations), 0.865 (real outcomes) and 0.881 (partial institutional closure) are prior internal results. Identification using set-valued compatible states may be a useful implementation, but theory novelty is OPEN and must be challenged against partial-identification and missing-data literature.

## Partial-identification witness (synthetic)

Let O be the public tuple (terminated order, reported CRA correction requests, some checks mailed). Let Z_A indicate all targeted records were actually corrected at CRAs and Z_B indicate they were not all corrected. Two logically possible worlds share O but differ on Z. The mapping O -> Z is therefore non-injective on the currently permitted model class. This proves only non-identification *relative to this public observation set and model class*, not any Toyota failure. Executable witness: tools/remediationIdentifiabilityR11.mjs and tests/test_remediationIdentifiabilityR11.mjs.

Falsifier: locate a reliable, same-cohort CRA acknowledgement register with verified before/after item status; it could eliminate some competing worlds, subject to coverage and timing.

## Unit mismatch and selection

The Toyota order's 27,507 figure concerns accounts identified for a particular credit-reporting remediation population, not all affected customers across every add-on redress category. A dollar amount refers to money, not people or accounts. A mailed check is not a cashed check. Do not join across these units using text similarity or aggregate amounts. A future ledger requires an irreversible, privacy-preserving stable unit identifier and proof of lawful access; never reconstruct personal consumer identities from public records.
