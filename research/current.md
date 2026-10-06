# Current Research Head — NOMOS-0.851

**Status: STRONG PASS / CLOSED**

## Primitive question

Which person-judgment state may govern when new evidence, new models or multiple corrections arrive before an earlier descendant-graph repair has finished propagating?

## Anti-reinvention boundary

0.851 does not rediscover stale replicas or generic distributed concurrency.

Recovered predecessors:
- **0.179** — temporal sequence is not explanatory force by itself;
- **0.229 / 0.229A** — stale replicas, dependency-bound correction, supersession without erasure;
- **0.798** — current warrant and historical warrant are distinct;
- **0.827** — unresolved institutional disagreement is a typed provenance fork;
- **0.850** — typed correction payloads and operation-specific re-derivation;
- **PEA-H3** — supersession-aware retrieval as a retired cross-lab donor, not NOMOS authority.

## Correction frontier

A correction event records causal parents, correction dimensions, scope, transformation state and adoption provenance.

At any moment the governing correction state may have multiple maximal heads.

**THE GOVERNING CORRECTION STATE IS A FRONTIER, NOT NECESSARILY A SINGLE LATEST VERSION.**

A scalar timestamp cannot represent all concurrent correction relations.

## Causal freshness

A re-derivation job records:
- base frontier;
- commit frontier;
- dependency dimensions;
- scope;
- rebase/revalidation state;
- fresh warrant/adoption where required.

**WALL-CLOCK LATENESS DOES NOT ESTABLISH CORRECTION FRESHNESS.**

A job may finish later while having started from an older authority state.

## Dimension-scoped supersession

A later correction supersedes only the dimensions and scope it actually reopens.

**SUPERSESSION IS CLAIM- AND DIMENSION-SCOPED, NOT WHOLE-RECORD LAST-WRITER-WINS.**

Thus a later consequence-authority change does not erase an earlier factual correction merely because it arrived later.

## Stale-base commit

If a newly arrived event changes a dimension that the in-flight job actually depends on, the job must:
- rebase;
- revalidate against the new frontier;
- or remain non-governing.

If the new event is irrelevant to the job's dependency signature, a late commit may remain valid.

## Stale-write resurrection

A stale-write resurrection occurs when an old in-flight result commits after a newer correction has withdrawn or changed authority and thereby restores the defeated state without fresh post-correction warrant.

This is distinct from 0.850 generator resurrection.

**A WRITE MAY BE CHRONOLOGICALLY NEW YET EPISTEMICALLY STALE.**

## Concurrent corrections

Concurrent events are not automatically contradictory.

They may be:
- disjoint and commuting;
- overlapping but mergeable with both provenances preserved;
- transformation-dependent and requiring rebase;
- semantically conflicting and requiring a provenance fork/HOLD;
- consequence-conflicting and requiring explicit consequence-authority review.

**CONCURRENCY IS NOT DISAGREEMENT, AND DISAGREEMENT IS NOT RESOLVED BY ARRIVAL ORDER.**

## Deauthorization guard

A stale descendant cannot restore a state explicitly deauthorized by a newer correction.

A genuinely fresh later correction may restore the same result if it is causally downstream and has fresh warrant/adoption.

**DEAUTHORIZATION IS MONOTONIC AGAINST STALE ANCESTRY, NOT AGAINST FUTURE FRESH WARRANT.**

## Model chronology firewall

A newer model version is not automatically a newer person-authority state.

**MODEL VERSION ORDER IS NOT PERSON-AUTHORITY ORDER.**

## Development

Executable kernel: **v0.10.0**

New:
- `src/nomos/correction_concurrency.py`;
- `tests/test_correction_concurrency.py`;
- `spec/correction-concurrency.md`;
- safe/unsafe concurrency fixtures;
- CLI `--audit-correction-concurrency`.

Invariant family: **CR001–CR016**.

The executable surface tests causal integrity, scoped supersession, concurrent overlap resolution, dual-provenance merge, stale-base commit, wall-clock freshness laundering, model-version authority laundering, stale-write resurrection and completion over unresolved branches.

CI:
- v0.10.0 correction-concurrency gate **#150: SUCCESS**;
- workflow permissions: **contents: read**;
- Actions repository writeback: **not authorized**.

## External donor ceiling

Version vectors, logical clocks and optimistic concurrency are bounded technical donors. They show why concurrent state and stale-base writes need explicit causal/version structure, but none of them determines substantive person-judgment authority.

## Next title only

**NOMOS-0.852 — Correction-Frontier Garbage Collection, Historical Branch Retention, Conflict Compaction, Provenance-Safe Snapshotting & the Primitive Question of When Superseded Person-Judgment Branches May Stop Participating in Live Governance without Being Erased from the History Needed to Explain, Contest or Reconstruct the Present State**

**TITLE-LOCKED / NOT OPENED.**
