# NOMOS-0.870 — Procedural Voice, Consequential Uptake, Remedial Reachability & the Primitive Question of When Being Heard Actually Gives a Person the Power to Change an Institutional Judgment

**User-authorized title; OPEN — bounded synthetic court, 2026-10-09.**
Notion canonical: https://app.notion.com/p/3f4ef561cf928152985acc439532333f
Camus-based cross-source Harvest: https://app.notion.com/p/3f4ef561cf9281f8897dd6a373b1f737

## Original primitive
When does a person's procedurally acknowledged statement become a consequential input into the judgment's reasons and remedy chain? The right to a fair hearing does not guarantee a favorable outcome. Neither a revised decision nor an issued correction automatically certifies practical relief; incomplete real-world evidence must remain unknown rather than fabricated.

## Restricted novelty relative to the existing 0.86x
- 0.863 established access, standing, legally valid filing and end-to-end reachability as distinct prerequisites.
- 0.864 established that nominal correction differs from downstream recipient correction.
- 0.865 established observer-independence and causal-effect constraints.
- 0.866 established persistence of a person-label after evidence correction.
- 0.867 drew a specific Camus trial distinction between culturally judged affect and act-specific culpability.
- 0.868 split collective agreement, evidence strength and decision authority.
- 0.869 split response behavior, genuinely heard challenge, change and relief.
0.870 contributes only an **inspectable source-to-decision-to-remedy handoff trace** tying this work together. It is not a new claim about real court behavior or an unanticipated general theorem.

## Foundational document hearing
The French text of Camus's *L'Étranger* (1942), Part II trial scenes, depicts a defendant whose future is narrated as being decided without his meaningful participation in assigning meaning to evidence. An advocate being present is not identical to independently warranted uptake. Yet narrator interiority and literary narrative structure must not be mistaken for a verified transcript of an actual hearing. 
Le Hir (1971), DOI 10.3406/retra.1971.934, diagnoses prosecutorial recontextualization of funeral evidence and erasure of the victim's independent standing. Girard (1964), DOI 10.2307/461137, contests the innocent defendant/evil judge polarity. Bryja (2019), DOI 10.14746/prt2019.4.11, and 박치완 (2025), DOI 10.33078/COWOL93.08, foreground the unnamed victim and re-narration through Daoud. This is a four-paper contested interpretive synthesis, not an acquittal theory. 
Hirschman's *Exit, Voice and Loyalty* (1970) and Goodin & Spiekermann's *An Epistemic Theory of Democracy* (2018) provide already-acquired analogies for effective voice and non-identical information roots. No new outside paper acquisition needed.

## Declared synthetic test court
Files: `tools/uptake870.mjs`, `tests/test_uptake870.mjs`; Node 22 GitHub Actions read-only CI.
Typed declared stages: voice usable → challenge submitted → case issue considered → reasons communicated → judgment revised OR reasoned no-change → remedy authorized → remedy dispatched → downstream readback → person-relief claim recorded.
Crucial negative cases:
1. Challenge submitted but not considered.
2. Reasoned no-change can be valid if warranted; a claimant does not automatically win.
3. Judgment revised but no remedy authority.
4. Remedy dispatched but no downstream readback.
5. Downstream readback without a person's independently established real-world consequence.
6. Fully declared chain without authentic observer independence or causal relief verification.
7. Correct handling of the accused's challenge still leaves victim perspective a separate standing question.
Outputs are labels for fictional boolean inputs ONLY. Model never certifies a real-world decision, observer, remedy, law or person.
**Stop rule:** retain actual-world epistemic and causal HOLD until independent institutional evidence, a relevant comparator and properly scoped rights are established. Do not conflate a form response with an outcome.

## P1 — new source-root audit and source-to-reason attribution court (2026-10-09)
Seven newly introduced PDFs were inspected and classified: six genuine complete volumes to Drive 11_BOOKS; Bookey's chapter-level digest of Kamel Daoud's *Meursault, contre-enquête* to 20_NON_PAPER_SOURCES with explicit NOT-ORIGINAL-BOOK label. The older Camus *L'Étranger* was corrected from 10_PAPERS to 11_BOOKS, retaining its ID. Daoud's original complete text remains unconfirmed. Independent source/book audit and chapter excerpts, along with reconstruction of Camus/Girard/Le Hir/Bryja/박치완 debates, are at:
https://app.notion.com/p/3f4ef561cf9281bdb6a8c10e469a1198

**New books used:** Camus (1942) *Le Mythe de Sisyphe* (philosophical starting point, not an automatic acquittal doctrine); Camus (1947) *La Peste* (witness quality and communal action); Camus (1951) *L'Homme révolté* (the protester's 'no' asserts a limit but does not override others' rights); Camus (1956) *La Chute* (judge-penitent and asymmetrical listener interpretation); Alice Kaplan (2016), *Looking for The Stranger*, DOI 10.7208/chicago/9780226241708.001.0001 (reports courtroom journalism and the Hodent case; a defender's intervention framed by an opposing advocate as incriminating, according to Kaplan; her book's history has not been independently checked against original newspaper files); Sherman & Goguen (eds.) (2019), *Overcoming Epistemic Injustice*, esp. Audrey Yap chapter 3 *Conceptualizing Consent*, where interpretive resources may exist in a marginalized community yet fail to receive uptake from a powerful audience.

**Distinct primitive (within older 0.864, 0.865, 0.869 limits):** The tribunal or institution may reproduce and cite the person's words while altering their attributed meaning. Verbatim inclusion is not by itself acknowledgment of the proposition under contest. Counterworlds with identical case file appearance can diverge in whether a semantic-reframing challenge is usable and addressed. Reviewer paraphrase and fresh case evidence must be separated; a valid reasoned no-change remains possible. Separate accused and victim narrative standing, and outcome-independent care for affected others.

**Implementation:** `tools/interpretiveUptake870.mjs` and `tests/test_interpretiveUptake870.mjs`. A declared limited status court: presence of voice, citation, issue-specific reasons, attribution objection access and actual review, declared alignment/alteration/unknown, separately noted victim standing. The enum is input metadata, not language-level proof of equivalence. No real judiciary validity, real person's innocence, remedy, or causal relief certified. CI exact-head success must be verified separately after commit.

**Boundary of claimed advance:** 0.864 already separated corrected documents from consequences and 0.869 already separated formal hearing from effective change; 0.870's incremental difference is case-specific **semantic attribution contestability**: the actual statement-to-reasons edge, not another blanket rule that 'more listening is always better'. Do not count the full narrative as actual-world evidence. Status OPEN for bounded P1 assessment, not a new universal theorem.

### Adversarial correction to the implementation: no mandatory literal quotation
A tribunal or reason-giver can substantively respond to the **actual issue** without reciting the speaker's exact words. Conversely, verbatim quotation with no proposition-specific answer is not substantive uptake. The final regression distinguishes these two counterworlds: `voiceCited=false, issueAnsweredWithReasons=true` can still be a declared uptake candidate; `voiceCited=true, issueAnsweredWithReasons=false` is `ISSUE_NOT_ANSWERED_WITH_REASONS`. A contested interpretation may also be legitimately rejected after reasons and independent case evidence; unaligned evaluation is **not proof of injustice**, only a prompt for attribution scrutiny. This avoids speaker-sovereignty over objective fact-finding.

**P1 current ruling:** Source-to-issue accountability and challenge of attributed meanings matter more than ceremonial quotation or automatic favorable outcomes. Neither a single auditor nor the code identifies actual case meaning: the relation enum is explicitly declared. Keep OPEN for bounded interpretive comparison and actual-world HOLD.

## P2 — observed-hearing metadata cannot identify substantive uptake
Let the observed metadata vector `O=(voice-received,voice-cited,decision-issued,remedy-receipt)`. Construct synthetic worlds W1 and W2 sharing O. In W1 the deciding authority accurately characterizes a relevant claim, invites an objection to its characterization, examines independent evidence and gives a justified no-change answer. In W2 the same metadata are issued while the claim is transformed into an unrelated adverse interpretation, the attributed meaning cannot be challenged and the purported remedy's result cannot be independently established. The substantive-uptake property differs despite identical O; **therefore no estimator using O alone can identify actual uptake in both worlds**. This is observational nonidentifiability, not a statistical estimate or empirical frequency claim.

### Avoided overreach
- A reasonable institution may summarize without verbatim quotation, and may reject the preferred interpretation or outcome on independent evidence.
- A source transcript can be cited without the author's actual proposition having been considered.
- Listening to the accused is a distinct evidentiary/rights question from giving the harmed person an independent narrative role.
- Even source-faithful reason-giving does not prove real-world restoration (0.864/0.865).
- Do not conflate Daoud's original book with an uploaded Bookey commercial digest. Its filename initially obscured that it is a secondary summary; relocated to `20_NON_PAPER_SOURCES` and labeled NOT ORIGINAL. Daoud original remains unavailable.
- Human interpretive contestability cannot be inferred just from booleans; tool stores **declared** claim-alignment and challenge flags. No real-world moral classifier authorized.

**Code correction:** `tests/test_interpretiveUptake870.mjs` explicitly verifies (1) issues can be substantially answered without literal quotation, and (2) literal quotation with no reasons fails. Previously transient mismatch between code and tests was repaired. GitHub Actions for predecessor head `160af89f47e1d1470070df5d624efcc063dcf125` completed SUCCESS, run https://github.com/WhoSia/NOMOS/actions/runs/37918033327. Recheck exact final spec head separately. Detailed P2 Harvest and all source IDs: https://app.notion.com/p/3f4ef561cf9281bdb6a8c10e469a1198.
