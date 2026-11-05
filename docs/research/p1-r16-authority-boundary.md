# NOMOS-0.885 P1-R16 — Legal Trigger versus Documentary Support
Date: 2026-11-05. P1 exploratory, P2 HOLD.
## Question
Can claim-scoped evidence be documentarily available while the legal conditions for a different institutional use remain unestablished? Does a rule-conditioned audit offer anything beyond an expert reading 15 USC 1681i(d)?
## Scope
The statute governs a CRA's request-triggered notification to specifically designated prior recipients whose earlier report containing the disputed/deleted information was received within 2 years for employment or 6 months for another purpose. A legal duty can arise with these conditions, but the duty's fulfillment is a separate empirical event. Citation: https://uscode.house.gov/us/usc/119-124/t15/s1681i/
## Method
Build conservative, three-valued logical checks for a hypothetical fact pattern: SATISFIED, NOT_ESTABLISHED and NOT_TRIGGERED_BY_SUPPLIED_FACTS. They are not judicial findings or complete legal interpretations. Test use-purpose and time-window differences, no designation, no consumer request, no qualifying event, and presence of an upstream correction with no actual receipt.
## Strong countermodel
A public termination order can document legally ended enforcement without satisfying any claim that a CRA had a historical recipient notice duty in a particular person's case. This distinction is already legal doctrine and earlier NOMOS work, not new normative invention.
## Prior art
NOMOS 0.261, 0.822, 0.850, 0.865, 0.881; 15 USC 1681i; W3C PROV-O. R16's contribution is testable software hygiene. Independent empirical benefit not yet established.


### R16.6 unknown is not disproven
A missing consumer request record is neither an affirmative request nor proof that no request occurred. Software returns unknown when one or more required facts remain null/undefined and none are affirmatively false. Explicit false is a modeled exclusion for this one statutory route only; other statutes or remedies not adjudicated.
