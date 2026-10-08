# NOMOS-0.860 — Joint-Repair Deadlock: Mathematical Preseal

Status: **OPEN / PRESEAL / NO EXECUTABLE INVARIANT ADMITTED YET**.

## Critical correction to 0.859

The existing JC025 checks union-of-declared agency capabilities. It does not establish executable cooperation; `handoff_warrant: true` is unauthenticated; `veto_without_review` is a self-reported boolean, not evidence of a legally valid or invalid veto. It is consequently false to call the current checker a deadlock detector.

## Explanandum lock

An institutionally blocked repair is not identical to an ordinary unfinished task or to machine deadlock. Distinguish:

- **Physical/technical infeasibility:** no usable records, funds, software, or valid operation exists.
- **Legal impossibility:** no authorized institution or permissible transformation route exists, under the currently governing law.
- **Contingent refusal:** an institution with discretion refuses a requested handoff; refusal may be authorized and reviewable.
- **Circular conditional dependency:** A will release only on B's authorization, while B will authorize only after A's release. A cycle is a *candidate for blocking*, not a proof where disjunctive lawful pathways exist.
- **Capacity-induced delay:** work remains possible but processing is slow.
- **Strategic obstruction:** an actor uses a claimed veto without a justified purpose or review.
- **Unresolved authority:** no competent forum has been identified to decide a genuine conflict of legal interpretations.

## Model

Let `T` be typed repair tasks and `A` the institutions. Each task has:
1. required inputs and capability,
2. a task-specific legal warrant,
3. one or more admissible institution/operation alternatives,
4. procedural and substantive prerequisites,
5. independently reviewable refusal events,
6. consequence-sensitive deadline/interim protection.

A hyperedge `S -> t` denotes a **jointly required** prerequisite set `S`; distinct hyperedges for `t` denote alternative sufficient pathways. A directed graph of waits may be a projection of this hypergraph but can lose OR-path information.

Define `Feasible(t; L, R, E)` only relative to a declared set of legal constraints L, available resources R, and evidence E. Do not infer universal impossibility from failing to find a path under bounded search.

## Falsifiers

W1. A waits for B and B waits for A, but an independently lawful alternative C can release the task. An ordinary cycle detector yields a false positive.

W2. There is no cycle, but every path requires a power that no institution legally possesses. The task is blocked, not cyclically deadlocked.

W3. Institution B makes a legally required privacy refusal. Forcing B to surrender protected records is not a legitimate deadlock remedy.

W4. All participants certify local compliance and a coordinator certifies completion, but the original adverse record remains live in a recipient's system.

W5. Escalation authority exists in law, but that authority is the same generator implicated in the disputed historical defect. Formal availability is not independent review.

W6. A temporary protection expires while interinstitutional disagreement persists; neither the lapse nor the dispute restores the validity of the adverse person claim.

W7. New statute or judicial order later adds an admissible path. Earlier HOLD was epistemically bounded, not a permanent theorem of noncompletability.

W8. A claimant's procedural route is nominally single-door, but every door forwards back to the same unreviewable refusal. Interface consolidation is not appellate power.

## Non-novelty boundaries

- Ansell & Gash (2008), DOI 10.1093/jopart/mum032: collaborative governance and structural/power constraints are existing research, not NOMOS inventions.
- Computer science Coffman deadlock and wait-for graphs: useful technical donor, **not** a direct legal-institutional analogy.
- Administrative accountability displacement studies: cross-organizational fragmentation already studied.

## Decisions withheld

Do **not** write `analyze_joint_deadlock` using a growing checklist of declared `true/false` fields.
First deliver three independent witnesses with explicit task/authority data and at least one OR-path countermodel. Next establish soundness of a *bounded blocking witness* (not general legal impossibility). Only then implement in the language appropriate to graph reasoning, with polyglot consideration.
No claim of executable PASS, STRONG PASS, or CLOSED.

## Predecessor limitation

0.859 at v0.18.0 is an **assertion consistency filter**, not a verified end-to-end repair executor, and its final exact-head CI must be checked before any retrospective success claim.


## 0.860-P1 — Finite-model three-valued semantics

Implemented as independent Node.js tool: `tools/deadlock860.mjs`; regression witnesses in `examples/deadlock860_cases.json`, `tests/test_deadlock860.mjs`. **Kernel stays v0.18.0.**

Fix a **finite** task set T, verified base facts F, and a set R of candidate AND/OR rules. Each rule `(S → t, w)` has conjunctive prerequisites `S ⊆ T`, conclusion `t`, and a declared warrant `w ∈ {verified, denied, unknown}`. Different rules for the same conclusion express alternatives. The packet must assert complete enumeration of admissible candidates and its evidentiary scope. These assertions are NOT verified by the tool.

Let `Cl(R')` denote the **least fixed point** reached by repeatedly firing enabled rules whose prerequisites have already been reached, starting from F.

- Lower closure: `L = Cl({r ∈ R : warrant(r)=verified})`.
- Upper closure: `U = Cl({r ∈ R : warrant(r)≠denied})`.

Given the model-completeness and evidence-scope assumptions:
- `t ∈ L` → **ACTIONABLE** with a finite derivation witness.
- `t ∉ U` → **BOUNDED_BLOCKED** relative to current candidate law/evidence/resource model, with a finite saturation certificate.
- Otherwise → **UNKNOWN**.
- If candidate alternatives or evidence scope are incomplete, force **UNKNOWN** regardless of calculated reachability.

### Proposition (monotone soundness under packet assumptions)

Assume all known-verified warrants are correct, all denied warrants are in fact inadmissible, all candidate paths are enumerated, and every executable action is representable as a finite acyclic derivation grounded in F. Then `L ⊆ ActualReachable ⊆ U`. Proof: induction on derivation height for the left inclusion. For the right inclusion, every actual derivation uses non-denied rules and its prerequisites have shorter derivations; induct on height. Thus both outer verdicts are sound **only under these assumptions**.

Unknown warrants can change `U` and even `L` when corroborated, so no eternal legal impossibility is inferred. The algorithm says **nothing** about legal truth if packet warrants or completeness claims are false. In particular, its upper-unreachability certificate is not an authentic court finding.

### Countermodel receipts

- W1 genuine A↔B cycle + independently verified C route: **ACTIONABLE**, disproves naïve cycle => impossibility.
- W2 acyclic but denied only route: **BOUNDED_BLOCKED**, disproves no-cycle => possibility.
- W3 privacy-denied release: **BOUNDED_BLOCKED**, but only if the legal refusal itself has been independently established.
- Pure cycle with no initial seed: **BOUNDED_BLOCKED** for finite derivation semantics, not proof of indefinite real-world deadlock.
- Unadjudicated legal warrant: **UNKNOWN**; no false definitive assignment.
- Incomplete alternatives/evidence: **UNKNOWN**.
- Duplicate rule identities: rejected.

### What remains open

W4–W8 are *constitutional and domain* witnesses rather than covered by this reachability abstraction: recipient-copy repair, appeal independence, interim expiry, future legal changes, and self-sealing nominal review need typed domain receipts and cannot be deemed verified from graph reachability.

**No overall 0.860 CLOSED until exact-head CI passes and the domain-witness limit is explicitly adjudicated.**

## 0.860-P2 — Exhaustive Finite-World Test and Stronger Theorem

A new regression file `tests/test_deadlock860_exhaustive.mjs` independently enumerates five finite candidate rules, each with one of three warrants (verified/denied/unknown), over five seed configurations. This yields **1,215 packet models**, whose unresolved-warrant choices generate **5,120 total completed worlds**. Each world is checked for three goals. A separate local Node 22 reconstruction passed this test on 2026-10-08; exact-head GitHub Actions still requires separate validation.

Let Ω be all assignments of every **unknown** candidate warrant to verified or denied, and let R_ω be the reachable fixed point for an assignment ω. For a fixed *complete finite* candidate set and known true seed facts:

**L = ⋂_{ω∈Ω} R_ω** and **U = ⋃_{ω∈Ω} R_ω**.

Proof: by monotonicity of least fixed-point reachability in enabled rules, the completion denying every unknown yields the minimum reachable set L, and the completion approving every unknown yields the maximum U; both extreme assignments are members of Ω. Hence the intersection and union are attained by these extremes.

Thus, relative to the declared finite model, three-valued verdicts are **both sound and complete for unanimous completion-world status**:
- `ACTIONABLE`: reachable in every world;
- `BOUNDED_BLOCKED`: unreachable in every world;
- `UNKNOWN`: reachable in at least one world and unreachable in another.

**Do not lift this completeness claim to real statutes or agencies.** It requires complete candidate enumeration, true seed facts, legal-warrant correctness for verified/denied candidates, monotone rule semantics and no unmodeled time-dependent changes. Each is an independent input assumption, not a tested empirical fact.

The previously defective CLI invocation on a `{cases:[...]}` corpus was corrected: it now checks expected outcomes and fails on mismatch. CI now includes the original witness tests, exhaustive proof checks and corpus CLI.

## 0.860-P3 — NOMOS Genealogy and Institutional Evidence Gate

A second collision audit found that the institution-level problem is **not novel in the abstract**:
- NOMOS-0.834 already separates causal contribution, normative responsibility, repair obligation and person-predicate authority. Causal dependencies do not generate liability allocations.
- NOMOS-0.839 already defines reviewer independence by **dependency-sensitive epistemic breaks**, not reviewer count or distinct job titles; Q/E/M/I/A/C, source ablation, appeal loops and override friction are prior NOMOS machinery.
- NOMOS-0.840 already develops inclusion-minimal dependency-break covers and distinguishes accessible escalation from independent convergence.
- Ansell & Gash (2008), *Collaborative Governance in Theory and Practice*, DOI 10.1093/jopart/mum032, analyzes 137 collaborative governance cases and conditions including power/resource asymmetry and design.
- Bovens & Zouridis (2002), *From Street-Level to System-Level Bureaucracies*, DOI 10.1111/0033-3352.00168, examines system-level discretion and due-process implications.
- Coffman, Elphick & Shoshani (1971), *System Deadlocks*, DOI 10.1145/356586.356588, is a foundational technical ancestor of the deadlock metaphor.

**Domain witness adjudication** (all conditional hypothetical models, not real-case legal findings):
- W4: local archival/review/budget certificates plus an uncorrected live recipient => joint repair not complete. A graph rule can represent this *only after* externally corroborated recipient evidence.
- W5: an appeal routed through the original generator fails the 0.839 dependency-independence criterion even if a graph path exists; a reachability path cannot prove independence.
- W6: interim expiry is not a new merits warrant. This requires legal and consequence records, not mere graph topology.
- W7: a later statute or order changes the rule universe. Compare **separate snapshots**; no timeless noncompletability conclusion is licensed.
- W8: single-door appeals can refer back to the same gatekeeper. Check whether a practically effective dependency-break route exists per 0.839–0.840, not whether the reception interface is unified.

### Scope and stopping decision

**P1 and P2 mathematical court: CLOSED relative to explicitly finite premises and local exhaustive validation; GitHub exact-head CI still pending.**

**P3 institutional legal-authority court: HOLD.** There are no authenticated case-specific legal authorities, reviewer-dependency break receipts, or downstream recipient records in these synthetic fixtures. It would be false to mark all 0.860 institutionally CLOSED.

No standalone P1/P2/P3 Notion page is created; sections belong inside the **single 0.860 canonical document**. No new NOMOS-0.861 title until the domain evidence gate has been faced.


## 0.860-P4 — Institutional Observational-Equivalence Impossibility

### Definitions

An institutional world W includes not just a task graph and participants, but its **actual legally admissible powers**, independently assessable reviewer dependence, available alternative lawful routes and applicable time-scoped law. Let π(W) be the observable declarations available to the current NOMOS 0.859–0.860 input: task/capability graph, self-declared `verified/denied` warrants, claimed completeness and nominal referral topology.

Let J(W,g) be a real-world yes/no proposition that goal g can be legally and institutionally carried out within the relevant scope.

### Theorem (non-identifiability of legal actionability from self-attested graph data)

If there exist worlds W+ and W− for which π(W+)=π(W−) but J(W+,g)≠J(W−,g), then no function f of π alone that always returns ACTIONABLE or BOUNDED_BLOCKED can be sound for both worlds.

**Proof:** since π(W+)=π(W−), f produces the same classification for both. Their ground-truth classifications disagree. At least one claim is false. To remain universally conservative over the indistinguishability class, f must abstain, seek external evidence, or return UNKNOWN. QED.

### Three witnesses

- **P4-A — legal warrant misattestation.** Both worlds assert a verified handoff route. In W+ the law in fact permits it; in W− it does not. The declared graph yields ACTIONABLE in both, while actual authority differs.
- **P4-B — appeal dependence.** Both worlds have the same appeal-received graph. In W+ the reviewing process is epistemically independent; in W− it reproduces the generator's decision-sensitive sources. The graph can confirm receipt, never 0.839 independence.
- **P4-C — incomplete route census.** Both worlds assert full alternative coverage and have a known denied route. In W+ a lawful alternative is omitted; in W− it genuinely does not exist. The declared graph yields BOUNDED_BLOCKED in both but actual feasibility differs.

These are **constructed proof-by-counterexample worlds**, not claims about any real named agency. Test script: `tests/test_deadlock860_nonidentifiability.mjs` (Node.js, three asserted observational-equivalence pairs), incorporated in read-only CI. Locally reconstructed Node.js 22 execution of the three witnesses passed; GitHub exact-head CI remains a separate gate.

### Interaction with the P2 theorem

P2 does **not** contradict P4. P2 proves conditional soundness and completeness over the *declared completed-world set Ω* while presupposing that the candidate set and warrant classifications correspond correctly to reality. P4 demonstrates that the correspondence cannot be inferred from the graph declarations themselves.

**Required logical typing:**
1. `COMPUTATIONAL_CERTIFICATE`: P2 verdict in finite declared model;
2. `EVIDENCE_ATTESTATION`: independently anchored warrant, legal and records/candidate census proofs, not generated by same authority under review;
3. `INSTITUTIONAL_CONCLUSION`: legally scoped result, only when (2) warrants mapping to actual world.

No direct rule `COMPUTATIONAL_CERTIFICATE → INSTITUTIONAL_CONCLUSION` is valid without (2).

### Bounded stage stopping

- **P1–P2:** mathematical AND/OR reachability semantics closed relative to explicitly stated assumptions; strengthened exhaustive test checks **exact three-valued classification**, not only outer-soundness.
- **P3:** W4–W8 carried as synthetic domain configurations; their domain premises remain unverified, and 0.834/0.839/0.840 are indispensable earlier theory.
- **P4:** formal negative identifiability result closed by explicit indistinguishable-world construction.
- **0.860 theoretical court:** **BOUNDED THEORY SEALED**; no claim of real institution's noncompletability, no legal award, no causal/person merits verdict.
- **0.860 executable gate:** **CI HOLD** until exact GitHub head completes SUCCESS. Do not use the theoretical seal to launder missing CI.

### Next-stage candidate, title-only

**NOMOS-0.861 — Authority-Evidence Attestation, Jurisdictional Warrant Provenance, Reviewer-Dependency Authentication, Temporal Legal-Route Reconstruction & the Primitive Question of What Evidence Can Convert a Bounded Repair-Graph Verdict into an Institutionally Justified Claim of Actionability or Noncompletability without Letting the Attesting Institution Certify Its Own Authority**

**TITLE PROPOSED / NOT OPENED.**
