# Current Research Head — NOMOS-0.860

**Status: OPEN / MATHEMATICAL PRESEAL / IMPLEMENTATION HOLD**

**INSTITUTIONAL NONCOMPLETABILITY ≠ GRAPH CYCLE ≠ LEGALLY WARRANTED VETO ≠ ORDINARY BACKLOG.**

NOMOS-0.855–0.859 progressed quickly through one module and 30-plus mostly declarative guards per stage. 0.860 deliberately changes the method: first audit existing self-attested checks and confront prior art, then require counterexamples and a bounded semantics, and only then implement.

**0.859 limitation:** JC025 checks only whether capabilities are declared in an agency union; JC026 trusts boolean handoff authority; JC018 trusts a declared unreviewable veto. These are NOT proofs of real lawful task executability or deadlock.

## Preseal questions

1. A circular waiting graph can contain an independently valid alternate route.
2. Acyclic action can be impossible where a legally competent bearer does not exist.
3. A refusal to disclose protected information can be legitimate and must not be overridden by a coordinator for workflow efficiency.
4. Local compliance certificates do not establish global execution or final person-merits authority.
5. An appeal channel can be formally identified but substantively self-sealing through the same generator.
6. Legal availability is time- and evidence-relative; do not mistake current HOLD for permanent impossibility.

Represent tasks as a typed AND/OR dependency hypergraph with separately warranted legal prerequisites and independently reviewable institutional refusals. Outcomes may only be **BOUNDED_BLOCKED**, **ACTIONABLE**, or **UNKNOWN**, scoped to supplied authority/evidence rather than actual judicial conclusions.

## Novelty restraint
Ansell & Gash (2008) collaborative governance, administrative accountability fragmentation and classic distributed-systems deadlock are pre-existing literatures. NOMOS must not claim the graph model or generic collaboration obstacles as new.

## Execution
`spec/joint-deadlock-preseal.md` authored. **Kernel stays v0.18.0**; no 0.860 test/CLI/CI module yet. No CLOSED claim.

## Gate before implementation
Produce legal/capability evidence receipts, three independent hard witnesses, OR-cycle counterexample, independent rival explanation, and a sound bounded blocking verdict. A larger boolean checklist is not sufficient.

## Next title
**NOT PROPOSED until 0.860 survives the preseal.**

## 0.860-P1 — Bounded Reachability Proof Object (2026-10-08)

- Independent **Node.js** prototype added, `tools/deadlock860.mjs`; case corpus `examples/deadlock860_cases.json`; test `tests/test_deadlock860.mjs`, CI wired. Kernel **still v0.18.0**. This is a deliberate exception to premature Python-only release cycles.
- For finite AND/OR hypergraph of preconditions, compute lower least fixed-point L from verified warrant edges and upper least fixed-point U from verified+unknown edges; denied edges cannot fire. Verdict ACTIONABLE iff goal in L; BOUNDED_BLOCKED iff goal absent from U; otherwise UNKNOWN. If completeness/evidence scopes not certified by packet, output UNKNOWN.
- Relative soundness: given correct warrant declarations, complete enumeration and derivational semantics, L ⊆ actual executable closure ⊆ U. Proof by induction over finite derivation depth. This is **not legal soundness for authentic jurisdictions**; completeness input is self-attested.
- Witness corpus: W1 cycle with lawful alternative; W2 acyclic denied edge; W3 lawful privacy-denied edge; pure unseeded cycle; unknown warrant; incomplete options; incomplete evidence; duplicate rule rejection.
- Remaining W4–W8 (recipient propagation, independent appeal, expiry and changing law) are NOT resolved by graph reachability. Keep stage research OPEN and evidence/CI pending. Do not label full strong closure merely because Node tests run.
