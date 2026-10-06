# Current Research Head — NOMOS-0.850

**Status: STRONG PASS / CLOSED**

## Primitive question

Can a person-judgment be meaningfully corrected when the source is reclassified but its scores, summaries, rankings, recipient copies and generators continue to act?

## Anti-reinvention boundary

0.850 does not rediscover generic correction propagation.

Recovered predecessors:
- **0.229A** — correct the dependency, not the past;
- **0.731** — semantic revision ≠ factual revision;
- **0.798–0.799** — historical truth, current warrant and consequence repair;
- **0.822–0.827** — graph propagation, hidden descendants, bounded completion, external recipients, fresh-warrant reconstitution and provenance forks;
- **0.835–0.838** — derivative ancestry, rehydration and selection-route contestability;
- **0.849** — record portability and descendant emergency provenance.

Drive chats **NOMOS 1–7** were reread before 0.850 was opened.

## Typed correction constitution

A correction may change:
- factual state;
- provenance;
- semantic interpretation;
- authority;
- temporal scope;
- regime/context;
- consequence authority.

**CORRECTION IS A TYPED STATE CHANGE, NOT A SINGLE BOOLEAN FLAG.**

Each descendant declares which dimensions of each parent materially affect it.

**PROPAGATION SCOPE IS DETERMINED BY DEPENDENCY SEMANTICS, NOT BY GRAPH REACHABILITY ALONE.**

## Re-derivation

A factual change may require recomputation.

A provenance change may require rebinding.

A semantic change can require a new or explicitly revalidated event→meaning / record→person transformation.

A regime change can require query/context replay.

An authority change can leave history intact while deauthorizing current governance.

**RECOMPUTATION UNDER A DEFEATED INTERPRETIVE RULE IS NOT RE-DERIVATION.**

## Generator resurrection

Correcting stored outputs is insufficient where an active semantic mapper, selection query, context filter or ranking rule can recreate the defeated state on the next refresh.

**OUTPUT REPAIR WITHOUT GENERATOR REPAIR IS INCOMPLETE WHEN THE GENERATOR CAN RECREATE THE DEFEATED STATE.**

## Same-output rule

Correction need not force a different result.

The same result may survive if it is traceably re-derived and freshly warranted.

**SAME OUTPUT ≠ SAME WARRANT.**

## Recipient recall

Recipient recall is a state graph, not a message-delivery event.

Track notice, mapping, local re-derivation, fresh warrant, onward transfer, current consequence and unresolved branch.

**RECIPIENT RECALL TRACKS CORRECTION STATE, NOT MERE MESSAGE DELIVERY.**

## Development

Executable kernel: **v0.9.0**

New:
- `src/nomos/correction_propagation.py`;
- `tests/test_correction_propagation.py`;
- `spec/correction-propagation.md`;
- safe/unsafe fixtures;
- CLI `--audit-correction-propagation`.

The executable surface checks typed dependency propagation, stale semantic/query replay, generator resurrection, same-output fresh warrant, consequence reopening and recipient branch state.

CI:
- v0.9.0 correction gate **#139: SUCCESS**;
- workflow permissions: **contents: read**;
- Actions repository writeback: **not authorized**.

## Historical reread

Drive chats NOMOS 1–7 exposed the forgotten 0.229A and 0.822–0.827 correction lineage before 0.850 was opened. This prevented correction propagation from being reinvented under a new name.

## Next title only

**NOMOS-0.851 — Concurrent Correction Events, Supersession Ordering, Re-Derivation Races, Stale-Write Resurrection & the Primitive Question of Which Person-Judgment State May Govern When New Evidence, New Models or Multiple Corrections Arrive before an Earlier Descendant-Graph Repair Has Finished Propagating**

**TITLE-LOCKED / NOT OPENED.**
