# Correction-Frontier Garbage Collection and Provenance-Safe Snapshotting

NOMOS-0.852 separates live governing participation from historical retention.

A branch can stop participating in current authority without being erased from institutional history.

## Branch states

- live_governing
- live_conflict
- historical_reopenable
- historical_minimal

Core rule:

RETIRING A BRANCH FROM LIVE GOVERNANCE IS NOT ERASING IT FROM INSTITUTIONAL HISTORY.

## Retention tasks

A branch can declare required future capabilities:

- explain
- contest
- reconstruct
- attribute
- resurrection
- consequence

A snapshot must support every task declared as required before retirement can pass.

PROVENANCE SUFFICIENCY IS TASK-RELATIVE, AND THE TASK FAMILY MUST BE DECLARED BEFORE COMPACTION.

## Snapshot contract

A provenance-safe snapshot can retain:

- explicit event coverage;
- provenance/ancestry continuity;
- supersession map;
- historical conflict map;
- attribution metadata;
- downstream consequence links;
- integrity/tamper-evidence witness;
- supported reopen-task list.

A snapshot that merely stores the final state is not automatically sufficient.

A SNAPSHOT WITHOUT COVERAGE AND PROVENANCE RECEIPTS IS A NEW OPAQUE ASSERTION, NOT A SAFE HISTORICAL COMPACTION.

## Open-future boundary

When the future dispute class is open, lossy compaction cannot claim universal future sufficiency.

LOSSY COMPACTION CANNOT CLAIM UNBOUNDED FUTURE CONTESTABILITY.

## Conflict compaction

A resolved conflict can leave live governance, but its compact witness must preserve that competing branches existed and relevant provenance survived.

RESOLUTION MAY CLOSE LIVE COMPETITION WITHOUT RETROACTIVELY MAKING THE LOSING BRANCH NEVER HAVE EXISTED.

## Historical retention and present retrieval

Historical retention must not itself reactivate the branch in routine current evaluation.

HISTORICAL RETENTION DOES NOT AUTHORIZE ROUTINE PRESENT-DAY REACTIVATION.

## Compaction debt

compaction_debt() returns declared reopen tasks that a proposed snapshot does not support.

For a retirement proposal, missing declared tasks are blocking errors.

## Invariant codes

GC001-GC024 cover branch-state validity, live-authority retirement, unresolved-conflict flattening, consequence orphaning, coverage/provenance loss, task loss, open-future overclaim, current-retrieval reactivation, and invalid completion claims.

## CLI

PYTHONPATH=src python -m nomos examples/correction_compaction_safe.json --audit-correction-compaction

The unit tests also exercise conflict flattening, consequence orphaning, open-future overclaim, task-relative compaction debt, and historical-retention reactivation failures.
