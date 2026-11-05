# NOMOS-0.885 P1-R12 — Missing-Edge Identification and Adversarial Transport

Date: 2026-11-05. Research status: P1, P2 HOLD. Independent unit after R11.

## Question
Which smallest *source-authenticated, same-unit* edge receipts reduce the set of compatible remediation states, and under what mismatched units, purposes or times do they fail to do so?

## Scope
The Toyota CFPB 2023 consent order gives a 27,507-account defined credit-reporting frame; the 2025 termination order ends the consent order but does not itself verify every account update. The Toyota/Kroll FAQ asserts CRA update requests and mailings of redress checks with possible reissue. These are distinct record units, operations and actor-specific statements. Synchrony CFPB termination states at least $259m redress fulfilled, but provides aggregate regulator language and additional policy reasons, not an individually linked Toyota-style credit record outcome.

## Identification contract
Evidence is accepted only with typed case, object unit, path segment, timestamp, source actor and authenticated source pointer. An unknown or other case's record cannot fill a missing target edge. A pure provenance graph cannot infer underlying person-level welfare or legal compliance.

## Suggested observable ladder
(1) source correction REQUEST; (2) CRA acknowledgement/application; (3) historical recipient notice dispatch; (4) verified receipt; (5) authenticated review record; (6) independently documented decision/outcome. Requirements differ by legal theory and event; this is a research verification checklist, not an all-purpose legal statute.

## Research novelty ceiling
Reusing NOMOS 0.822, 0.850, 0.865, 0.881 is mandatory; source matching and missing-labels are established outside literatures. Our potential contribution must appear as a novel falsifiable discriminator with fresh comparative data, not a new label for established principles.

## Toyota FAQ: dated operator assertions versus independent receipts

The operator's FAQ says that prior to the 2023 consent order TMCC submitted requests to credit-reporting agencies to update affected accounts; its FAQ also states that some redress checks were or would be mailed, and mailed checks may be reissued following the May 2025 termination. This is more concrete than a generalized plan, but it remains the respondent/administrator's source statement. It is not a CRA-level acceptance response, item-level post-update report or individual bank deposit confirmation. Source: https://www.tmccremediation.com/faq , items 1, 2, 4 and 15. FAQ's last-publication date not independently established; do not infer the statements were all known before May 2025.

## Same-case, same-unit and timing guards

The R12 executable witness has five artificial cases: complete logical scaffold, mismatched case, mismatched unit, self-asserted unauthenticated recipient receipt, and inverted source/correction time ordering. The mismatches must not fill missing links. Real account IDs or consumer records are not used. A synthetic fixture's `auth=true` is a test input, NOT an authentic cryptographic signature or proof of provenance. A false positive under a new adversarial fixture is a defect to correct rather than evidence about real-world compliance.

## Synchrony comparator and confounding

On 2025-05-12 CFPB terminated Toyota and Synchrony consent orders. The public Synchrony enforcement summary expressly states at least $259m redress delivered and also supplies policy-alignment grounds for termination. Toyota's termination order says termination and waiver of alleged noncompliance without enumerating each beneficiary outcome. This source-text contrast falsifies the rule 'same closure label entails the same publicly stated evidentiary basis', but does NOT show that Toyota complied less than Synchrony or that either event caused person-level recovery. Regulatory history, remedy type, original order duration and policy are confounders. Sources: https://www.consumerfinance.gov/enforcement/actions/synchrony-bank-fka-ge-capital-retail-bank/ and https://files.consumerfinance.gov/f/documents/cfpb_toyota-motor-credit-corp_order-terminating-consent-order_2025-05.pdf .

## Prospective test and external rivals

Preregister the claim: in a fresh enforcement cohort, formal termination documents will not uniformly identify recipient-level remedy completion. Outcome: whether an independently sourced event chain identifies correction application and downstream consequence, stratified by remedy and statutory pathway. Compare a null baseline that codes only termination label, a strong legal/administrative baseline that separately codes order paragraphs and regulators' compliance assertions, and a proposed typed graph with source actors, dates, object units and missing-edge coverage. Test on holdout cases before writing conclusions. The proposal must demonstrate incremental predictive or auditing utility over legal doctrine, missing-data analysis and existing NOMOS 0.822/0.850/0.865/0.881. No out-of-sample performance is yet measured.

## P1-R12 closure and P2 verdict

R12 completes research artifacts and code tests for typed event-identity validation; empirical E1–E5 completion remains unknown. Three ways to lose novelty: (i) source-linked provenance ledger already captures everything in standard audits, (ii) adding graph edges changes labels but does not alter an actual review decision, or (iii) unobserved personal outcomes cannot be retrieved, making claims unidentifiable. P2 remains HOLD pending a prospectively sealed independent cohort with accessible documents, stronger baselines and demonstrated decision-useful increment. Exact HEAD CI, full Drive snapshot, code/contributor audit and Notion sync must be verified separately. Existing code is preserved.
