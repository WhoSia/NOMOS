# NOMOS-0.866 — Institutional Memory, Stigma and Warrantless Reinstatement
**Status: P0–P1 OPEN. User-confirmed official title.**
## Primitive
Correction of an event-level allegation does not entail the disappearance of a stable person-label, especially when the label persists as a lens for interpreting later acts. Distinguish event criticism, substantiated accountability, globally essentializing attribution, stigma, and crowd sanction.
## Inherited results / non-novelty
NOMOS 0.2–0.4 event-to-person overreach; 0.72x–0.75x person-model hysteresis; 0.849–0.851 semantic rerivation and generator replay; 0.857 past harm; 0.865 independent evidence. These are not new 0.866 discoveries.
## P1 falsifiable negative model
Given synthetic case, person, current judgment and time, model support kinds `original`, `fresh_independent`, `inherited_label`, `derived_consequence`. If original ground is defeated, label is reactivated, and no active, independently warranted new ground is even declared, classify `REINSTATEMENT_WITHOUT_FRESH_WARRANT`. If fresh evidence is merely declared, do not certify its independence. Never infer actual wrongdoing, stigma, legality or social legitimacy.
Counterworld: independent new conduct evidence may justify a new bounded judgment; removing an old stigma must not prohibit valid accountability. Second counterworld: accurate criticism may coexist with excessive sanction. Third: online copies may disappear while diffuse offline memory persists; direct system copy tracking is inadequate.
## Literature anchors
Link & Phelan (2001), Conceptualizing Stigma, DOI 10.1146/annurev.soc.27.1.363; 2022 conceptual critique, DOI 10.1111/jep.13684; Koo et al. (2024) South Korean online hate community analysis DOI 10.1371/journal.pone.0300530; Korean digital vigilantism Namgung (2017) and Kim (2025) DOI 10.25023/kapsa.22.2.202505.39; NIA 2024 Cyber Violence Survey. None establishes Korea as world leader in shaming. Korean-exceptionalism claim is a comparative HYPOTHESIS.
## P1 implemented
`tools/judgmentReinstatement866.mjs` and `tests/test_judgmentReinstatement866.mjs` added; read-only CI updated. 5 assertions PASS in isolated V8 with imports adapted, not yet official Actions run verification. Future P2 requires stronger causal and provenance semantics, distinguishing mere support-kind label from independently proved new grounds. Avoid hasty closure.

## P2 — Noncollapse Court: Criticism, Stigma, Private Sanction
**Research scope:** conceptual/structural finite synthetic model, never actual person classification.
### Definitional collision
- An evidence-grounded act-specific criticism may be legitimate even when publicly unpleasant. Verified conduct alone never licenses a global immutable trait inference.
- `STIGMA` in Link–Phelan (2001) requires labeling/stereotyping/separation/status consequences and power. Andersen, Varga & Folker (2022) challenge inclusion of status loss and emotion as necessary *defining* conditions; propose group-level target, linguistic separation and power asymmetry. A single insult, individual correction, group-level stigma and collective harassment therefore cannot be merged by one Boolean.
- Collective private sanction (boycott, exposure, exclusion, etc.) has a procedural/proportionality axis independent of the epistemic truth of the criticism. Accurate criticism plus grossly disproportionate sanction is a coherent world. Erroneous group stereotype without crowd penalty is another.
### Finite analytic triage (P2)
`tools/stigmaBoundary866.mjs` returns five independent fields: `scopedCriticismSupported`, `stigmaCandidate`, `collectiveSanctionPresent`, `sanctionProceduralConcern`, `falseExonerationRisk`. It never certifies actual stigma, lawful sanction or a person's character. `evidenceVerified`, `powerAsymmetry`, etc., are caller-declared values: not independent corroboration.
### Hard falsifiers
1. **TRUE ACT / NO STIGMA:** documented misconduct with act-specific proportional criticism, no group or fixed-person identity attribution. If the model calls stigma, it is overbroad.
2. **TRUE ACT / EXCESS SANCTION:** substantiated misconduct, but unbounded crowd sanction and no right to reply. The act's truth cannot certify sanction authority.
3. **GROUP STIGMA / NO COLLECTIVE PENALTY:** repeated negative group essentialization under asymmetric power, no explicit coordinated retaliation. Group stigma can occur without an overt 'witch hunt' event.
4. **FALSE PERSON-LABEL / SOCIAL MEMORY:** defeated source recurs through inherited person judgment, not independently warranted fresh events. This may involve reputational harm without satisfying every group-stigma definition.
5. **NEW INDEPENDENT EVENT:** a new, genuinely independently supported harmful action can warrant renewed scoped criticism even after a prior false allegation was corrected. Reopening is not automatically stigma.
6. **CAPTURED VERIFICATION:** witnesses all draw from same distorted source. Counting witnesses isn't authentication.
### Bridge to later P3
Originality prospect is *separation of epistemic entitlement to criticize from social authorization of collateral sanctions, and from memory-mediated person-model revival*; genealogy 0.2–0.4, 0.752, 0.839–0.850 and 0.857 already anticipated much. Novelty burden not discharged by this test harness. Further P3 must model transitions and independent warrant, not merely count Boolean input dimensions.
### Korea empirics ceiling
Koo et al. 2024 describes Korean online-community hate dynamics, but measures neither cross-country ordinal rank of witch hunts nor individual judgment-reinstatement transitions. 김재경 2025 analyzes 215 Korean news records, not a representative census of public attitudes. 남궁현 2017 develops digital vigilantism framework; 2024/2025 official cyberviolence surveys are different constructs. No national-exceptionalism verdict permitted from these heterogeneous evidence bases.

## P3 — Ancestry Inflation versus Correction Reach (2026-10-09)

**Non-novel donor findings:** continuing influence of misinformation, source-credibility dependence, correction-reach gaps and the effectiveness of some fact-checks are independently studied phenomena. See Walter & Tukachinsky (2020) DOI 10.1177/0093650219854600 and Porter & Wood (2024) DOI 10.1016/j.copsyc.2023.101715. The purpose is to discipline NOMOS's own person-judgment argument, not to assert discoverer priority.

Two different causal/epistemic structures must be modeled:
1. **Support ancestry:** a crowd of N repeaters may have only one original evidence root. Multiplication of statements alone never authenticates N independent witnesses. The defeat of root R under a fixed claim defeats citations depending solely on R. The presence of an allegedly independent root is a *request for examination*, not proof of its reliability or person-level relevance.
2. **Correction reception:** original publisher's correction, delivery to derived audiences, acceptance/uptake, change in operative person judgment, and changed opportunity or consequence are non-equivalent. Declared material recipients that have not received correction define a **known coverage gap**, not a global complete population census.

**Finite synthetic audit implemented:** `tools/echoCorrection866.mjs`; `tests/test_echoCorrection866.mjs`. It returns statement count, distinct *declared* roots, echoes based solely on defeated roots, sources needing independent audit and unreached recipients. Even with complete declared delivery, `actualBeliefChangeEstablished` and `actualPersonRestorationEstablished` are always false. The graph does not authenticate actual ancestry, prove a crowd's motives or detect real stigma.

### Rival world table
- One rumor echoed by three unrelated account identities → statementCount 3; sourceRootCount 1; no three-way corroboration.
- Three independently authenticated new observations → potentially three actual support roots, but this must be substantiated outside this harness.
- Correction reaches origin and one listener, misses institutional adopter → active propagation gap.
- Correction reaches all listed listeners but they continue applying the old label → transmission alone insufficient.
- Later genuine misconduct motivates lawful, proportional criticism → not label-based resurrection.
- Repeating moral disapproval without factual claims → never treat a count of condemnations as a factual evidence source.
- Correction increases initial rumor visibility in one population → coverage and exposure risks can move in opposite directions.

### Formal insufficiency
For a fixed claim q, let `ancestors(s)` denote identified ultimate evidence roots for statement s, `D(q,t)` defeated roots, and `A` the set of apparent agreeing statements. If all `ancestors(s)` are subsets of `D`, then `|A|` alone cannot restore warrant for q: no repeat introduces an undefeated independent source. This is a **conditional graph-relative negative result**, not a truth theorem about actual allegations. Conversely, a source outside D is not necessarily fresh, relevant or admissible.

For declared materially exposed recipients M and correction recipients C, `M\\C` is the declared *unreached frontier*. `M\\C = ∅` does **not** entail actual uptake, authoritative judgment correction, or restoration. Unenumerated recipients cannot be ruled out by a closed fixture.

**Status:** P3 synthetic test court implemented and connected to read-only CI. CI outcome must be verified independently at exact commit. 0.866 remains OPEN; P4 should test dynamic reputational feedback and the difference between observational echo and genuine new grounds.

## P4 — Label-Generated Outcomes and Apparent Fresh Evidence
An adverse group judgment can induce withdrawal, exclusion, denial of opportunities, and selective observation; later observers may interpret these *downstream* outcomes as corroboration of the earlier global label. This creates an endogenous evidentiary loop, not independently warranted person-level evidence. But new independently grounded actions must remain assessable: neither stigma nor prior incorrect sanction implies categorical exoneration.
**Negative conditional invariant:** If a label L was defeated and the only purportedly new observations cited to restore L are descendants generated through L itself, these descendants do not independently rehabilitate L's evidentiary warrant. This does not entail that L must always be false, nor that an authentic new event can never warrant scoped criticism. Opposing potential worlds can share a visible adverse outcome while differing in causal production.
**Typed adversaries:** W1 all observations caused by imposed exclusion; W2 genuinely new independent event; W3 mixed endogenous and allegedly independent evidence; W4 unknown parentage; W5 label not defeated; W6 no observations. A downstream observation's root type is an input assertion, not externally attested ancestry.
**P4 code:** `tools/feedback866.mjs` and `tests/test_feedback866.mjs` test the negative gate, uncertain and new-warrant states; `newEvidenceActuallyCertified:false` and `actualSocialRestorationCertified:false` always. To empirically establish endogeneity requires independent event-level provenance, exposure/counterfactual data, and honest uncertainty; a Boolean `origin` field cannot prove causal mediation.
**Scholarly/ancestral limits:** labeling theory, self-fulfilling prophecy and institutional person-model feedback predate this stage, as do NOMOS 0.72x–0.75x hysteresis, 0.830–0.836 policy-generated outcomes, 0.850 correction-generation dependence. P4 combines these into a bounded negative evidence-authority counterexample, not a new empirical discovery. Korea exceptionalism not established.
**Stage status:** P4 implemented, exact-head CI verification pending; do not close NOMOS 0.866 until verification plus collision court.
