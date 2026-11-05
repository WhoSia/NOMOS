# NOMOS-0.885 P1-R17 — Claim-relative authority transfer and strong rival test

Date: 2026-11-05. Final P1 adversarial examination, not a validated field result.

## Research proposition
Authenticated provenance does not by itself grant an institution authority to make *every* claim or to reuse it for every purpose. For a triple (source, claim, receiving-use), inspect source assertion, factual trigger, source scope, legal actor and receiving institutional role independently.

## Primary authorities and non-transfer
15 USC 1681i(d) describes conditional prior-recipient notice by a consumer reporting agency. Its statutory existence is not a case-specific duty finding or proof of dispatch. https://uscode.house.gov/us/usc/119-124/t15/s1681i/
CFPB's 2025 Toyota administrative termination establishes termination and waiver; it does not establish all downstream individual recovery. https://www.consumerfinance.gov/enforcement/actions/toyota-motor-credit-corporation-2023/
Federal Rules of Evidence 401 and 105 explicitly distinguish relevance to a particular fact and restricted admissible uses, but govern court evidence, not automatically CFPB administrative acts or CRA reporting. https://www.law.cornell.edu/rules/fre/rule_401 ; https://www.law.cornell.edu/rules/fre/rule_105
W3C PROV-O already formalizes attributed entities, activities, derivations, agents and provenance, so graph nodes and edges are inherited technology. https://www.w3.org/TR/prov-o/

## Rival baselines
B0 provenance-only: source exists and chain structurally complete. B1 expert legal audit: applicable rule + factual predicates + party + purpose + time + evidentiary scope. G claim-oriented rule checker: curated facts passed to an explicit three-valued conditional rule. B1 can already avoid all of G's intended mistakes; do not claim G is more accurate without independent blinded external evaluation.

## Outcomes and limitations
The experiment's expected result is *documentation of non-entailment* with synthetic conditions, not a real consumer case. A model unable to exceed B1's performance must be demoted to transparent tooling or folded into existing NOMOS lineage. Proposed P2 admission is a decision about opening a falsifiable research stage, never novelty or real-world remediation completion.


### R17.6 — Court evidence analogy firewall
Federal Rules of Evidence 401 and 105 provide a clear *court-specific* example of claim-relative relevance and limited purpose use. Their applicability cannot simply be transported to consumer reporting agency duties or CFPB enforcement proceedings. A well-typed analogy preserves recipient institution and source-of-law scope.


### R17.7 — Distinguish legal duty and discharge
In 15 USC 1681i(d), once the relevant facts and consumer request conditions hold the CRA can have a prior-recipient notification duty. Whether the CRA actually sends notice, whether it arrives, and whether a decision-maker revisits earlier action are separate observations. A consent-order termination does not substitute for them.


### R17.8 — Strong baseline equality is a negative result
The R17 synthetic program intentionally sets claimGraph equal to strongLegalAudit: 'addedDecisionDiscrimination=false' by construction. That is a control against fabricated performance. This neither proves broader equivalence in real practice nor constitutes empirical comparative superiority. Truly independent labels and blinded audit are needed.
