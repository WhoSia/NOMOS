# Concurrent Correction Events and Stale-Write Resurrection

NOMOS-0.851 extends the v0.9.0 typed correction surface into concurrent and causally ordered repair.

The stage is not a generic distributed-systems layer. Its object is the **authority state of person-judgment corrections** when re-derivation is still in flight.

## Core distinction

A write can finish later while being based on an earlier correction frontier.

Therefore:

**WALL-CLOCK LATENESS DOES NOT ESTABLISH CORRECTION FRESHNESS.**

## Correction frontier

The active correction state is represented by the maximal non-dominated correction events relevant to a claim.

The frontier can contain more than one head when corrections are concurrent.

**THE GOVERNING CORRECTION STATE IS A FRONTIER, NOT NECESSARILY A SINGLE LATEST VERSION.**

## Dimension-scoped supersession

Supersession applies only to the correction dimensions and scope actually replaced.

A later consequence-authority correction does not erase an earlier factual correction merely by being later.

**SUPERSESSION IS CLAIM- AND DIMENSION-SCOPED, NOT WHOLE-RECORD LAST-WRITER-WINS.**

## Re-derivation jobs

Each job declares:
- `base_frontier`;
- `commit_frontier`;
- `dependency_dimensions`;
- scope;
- whether it was rebased/revalidated;
- optional restoration target;
- fresh warrant/adoption when restoring a previously deauthorized state.

If a newly arrived correction affects a dimension the job depends on, the job must rebase or explicitly revalidate before governing.

## Stale-write resurrection

A stale-write resurrection occurs when:
1. a newer correction deauthorizes or changes state;
2. an older job began without that correction;
3. the old job finishes later;
4. it restores the defeated state or consequence;
5. no fresh post-correction warrant/adoption exists.

This differs from v0.9.0 generator resurrection:
- generator resurrection = an unchanged active generator recreates a defeated state;
- stale-write resurrection = an old in-flight derivation commits after the correction frontier advanced.

## Concurrent corrections

Concurrent events can be:
- disjoint/scope-separated;
- explicit merge with both provenances;
- explicit fork/hold;
- otherwise unresolved.

The kernel rejects `last_writer_wins` for overlapping concurrent correction dimensions.

**CONCURRENCY IS NOT DISAGREEMENT, AND DISAGREEMENT IS NOT RESOLVED BY ARRIVAL ORDER.**

## Deauthorization guard

A prior correction that withdraws authority cannot be undone by stale ancestry.

A later fresh correction may restore the same outcome if it is causally downstream and carries fresh warrant/adoption.

**DEAUTHORIZATION IS MONOTONIC AGAINST STALE ANCESTRY, NOT AGAINST FUTURE FRESH WARRANT.**

## Invariant codes

- `CR001` unknown causal parent
- `CR002` unknown correction dimension
- `CR003` causal cycle
- `CR004` unknown supersession target
- `CR005` supersession without causal ancestry
- `CR006` scoped supersession without dimensions
- `CR007` overlapping concurrent corrections resolved by last-writer/arrival order
- `CR008` overlapping concurrent corrections unresolved
- `CR009` merge loses one correction provenance
- `CR010` job references unknown frontier event
- `CR011` stale-base commit without rebase/revalidation
- `CR012` model-version chronology used as authority
- `CR013` stale-ancestry resurrection after deauthorization
- `CR014` wall-clock time used as freshness
- `CR015` same output used to excuse stale ancestry
- `CR016` completion claimed with unresolved concurrency/stale jobs

## CLI

```bash
PYTHONPATH=src python -m nomos examples/correction_concurrency_safe.json --audit-correction-concurrency
PYTHONPATH=src python -m nomos examples/correction_concurrency_unsafe.json --audit-correction-concurrency
```

The first fixture passes. The second is intentionally unsafe.
