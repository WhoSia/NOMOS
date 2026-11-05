# NOMOS-0.885 P1-R15 — Claim-Relative Evidence Sufficiency
Date: 2026-11-05. P1 study, P2 HOLD.
## Research question
For one underlying legal and documentary record, which *specific propositions* are warranted by the available official text? Distinguish (a) a source asserting a proposition, (b) the proposition being independently true, and (c) a receiving institution holding legal authority to rely on it.
## Primary authority
- CFPB Toyota 2023 official enforcement page: November 20 2023 consent order; ordered $48m consumer redress, $12m penalty and correction/compliance obligations. https://www.consumerfinance.gov/enforcement/actions/toyota-motor-credit-corporation-2023/
- CFPB Toyota docket: May 12 2025 termination order, docket 2023-CFPB-0015; termination/waiver, NOT independent all-account correction or recipient outcome certificate. https://www.consumerfinance.gov/administrative-adjudication-proceedings/administrative-adjudication-docket/toyota-motor-credit-corporation-2023/
- Federal statute: 15 USC 1681i(d) conditional prior-recipient notification upon specified request and designated recipient within the two-year employment/six-month other-purpose windows. https://uscode.house.gov/us/usc/119-124/t15/s1681i/
## Bounded claim family
C1 = 'Toyota 2023 order terminated on 2025-05-12' is supported by regulator dated termination. C2 = 'all affected accounts updated at CRAs' is NOT certified by that termination text. C3 = 'a named historical creditor received notice' is NOT certified by public termination text. C4 = 'statutory prior-recipient duty arises in this synthetic fact pattern' requires concrete factual predicates; knowledge of statute alone is insufficient.
## Baselines
B0 counts number of official documents as evidence; B1 performs claim-specific paragraph reading (strong, manual). The proposed machine check only detects some support/absence errors from manually curated claim tags. It has no demonstrated advantage over B1 and does not independently authenticate sources.
## Falsifier
An authenticated, same-case, same-account CRA update registry or named recipient readback may warrant additional claims; revise ledger when sourced. Do not treat not-public as false.


### R15.5 — Assertion versus event
The generated status documentarily_asserted means merely that a human-curated source label matches a target claim. It does not certify legal effect, source validity, occurrence of any event, or case-level causation. Explicitly distinguish signed official acts from respondent self-report and case-specific receipt records.


### R15.6 — Claim specific nonmonotonic revision
A claim may be textually asserted and later defeated by corrected court or agency evidence. Preserve dated legal validity, source version, withdrawn guidance and contrary source as independent fields. The score is not monotone in raw source count; one newer superseding source can change authority.


### R15.7 — Recipient conditions
15 USC 1681i(d) is conditional on qualifying deletion or disputed notation, the consumer's request, a specifically designated prior recipient and receiving-purpose windows. A general statutory source alone cannot establish satisfaction of those factual predicates for Toyota or another real person.


### R15.8 — Negative evidence boundary
The termination order does not certify all CRA entries corrected; it also does not prove they were not corrected. Non-observation in the scoped public file is neither a population-level failure rate nor proof of individual noncompliance.


### R15.9 — Counterclaim competition
Competing claims can hold simultaneously: (i) the enforcement order is legally terminated, (ii) some remediation may have been executed, and (iii) downstream consumer-specific welfare is not independently known. Therefore a binary 'case resolved' score is an invalid compression without a claim-relative scope.
