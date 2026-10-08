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
