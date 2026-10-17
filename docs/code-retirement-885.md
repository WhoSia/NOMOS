# NOMOS-0.885 — Main-Only Code Retirement Audit

Date: 2026-10-17. Scope: repository WhoSia/NOMOS `main`, baseline HEAD 3cb6a5aaac17fe315c50ade82042c28a66ce6242. User authorizes removal of *genuinely unused* code, with Drive preservation first. No branches permitted.

## What was inspected
- Recursive complete git tree: `https://api.github.com/repos/WhoSia/NOMOS/git/trees/main?recursive=1`, not truncated.
- `.github/workflows/ci.yml`, `pyproject.toml`, `src/nomos/__main__.py`, `src/nomos/__init__.py`, historical `docs/code-retirement-882.md`.
- Python `src/nomos` analyzers are imported by the CLI and/or public package; Python unittest discovery and dedicated fixture CLI commands run in CI.
- Historical Node `tools/*.mjs` modules each have corresponding versioned `tests/*.mjs` witnesses; CI explicitly invokes many Node tests and other tests are still project evidence even if not explicitly in CI.
- `examples/*.json` contain safe and unsafe fixtures and thus are not mere disposable assets; some are invoked directly by CI and others by tests.

## Decision
**DELETE: 0 code paths**. No candidate met all necessary gates (verified absence of imports, execution paths, tests, documentation consumers, and recoverable equivalent; pre- and post-delete validation). An older version suffix is NOT evidence of disuse. The user-requested archival removal remains HOLD rather than being falsely reported complete. This is a bounded dependency audit, not a claim that every string reference in every file has been exhaustively traced.

## Custody
The 0.885 P0-R5 exact-source artifact corresponding to baseline commit 3cb6a5aaac17fe315c50ade82042c28a66ce6242 is already stored and byte-count re-fetched in Drive: https://drive.google.com/file/d/1t40IrkII9ywZjfmK3xKKBmln7no99Ku2/view . The previous existence and size check do not establish internal per-file SHA-256 verification. For any later approved deletion, first store the exact original code and a file-level SHA-256 manifest in Drive, verify recoverability, then delete on `main` only and recheck all tests/CI. Do not modify CI just to hide removed tests or allow github-actions[bot] contributor attribution.

## Next elimination work
Build a full static+runtime reference manifest across all text blobs; identify a concrete *unreferenced, reproducibly redundant* path, prove replacement or non-use, attach per-file hash and Drive custody proof, then request the actual deletion as part of main-only transaction. Until then retain functional code, historic negative witnesses, and source provenance.


## P0-R7 — Stronger actual-reference sample
At current main tree d8dabeb34fc37330e0fae0a80286a155369556e6, the recursive tree enumerates 23 Node `tools/*.mjs` sources and 47 test files. Each Node filename has a correspondingly named versioned test in the tree; checked exact imports for `adjudicationBoundary870`, `dissent869` and `crossEcologyFollowup880`. Thus absence of a direct path literal in `.github/workflows/ci.yml` is NOT proof of a Node tool being unused: its test imports that path. Conversely having a matching test filename alone does NOT prove that the CI invokes the test. The existing CI explicitly executes only some Node tests; a complete per-file import and runtime execution audit remains OPEN. **No code deletions justified.** The user asked removal of genuine dead code, not destruction of historical negative witnesses; archive-first rule remains in force.


## P0-R8 — Sampled direct import/CI reconciliation (2026-10-18)
Five selected Node tests were inspected by reading source imports and comparing exact command paths with `.github/workflows/ci.yml`. Four tests (remedialEvidence879, retroactiveSaving879, residualAccountability880, crossEcologyFollowup880) import their same-family tools but were absent as direct CI commands; uptake870 was present. This is not a complete repository-wide reachability census. Decision: restore automated regression coverage rather than delete live historical witnesses. Added four `node tests/...` steps to CI on main commit bc827933b9b9ed8ee915cde1f0488222ed7283b5. Successful CI is required before declaring the change verified. Deletions: ZERO, branches: ZERO. Status: unreferenced-source deletion candidates not demonstrated.


## P0-R9 — Exhaustive explicit Node test command census (2026-10-18)
At `main` pre-write tree d0d7269a5d5711e7ae016825d78b3b3b0b374caa, `tests/*.mjs` contains 29 tests and `.github/workflows/ci.yml` contains a direct `node tests/<filename>` invocation for all 29: omission count **zero**. This proves named command coverage, not complete code-path coverage, and not that every module is semantically nonredundant. Baseline CI succeeded after P0-R8. No safe, proven redundant executable discovered; deletion count zero. Next gate: import-reference mapping, documentation consumers, byte-verified file-level custody and replaceability, without new branches.


## P0-R10 — Python CLI direct-import census (2026-10-18)
Full current recursive Git tree: `src/nomos/` comprises 21 Python files. Nineteen non-entrypoint implementation modules (`audit`, `correction_compaction`, `correction_concurrency`, `correction_propagation`, `divergence_replication`, `feedback_restoration`, `historical_reopening`, `interim_protection`, `joint_repair`, `lineage`, `recall_triage`, `record_portability`, `restitution`, `review_divergence`, `review_topology`, `router`, `routing_learning`, `successor_duties`, `systemic_reopening`) are *all directly imported* in `src/nomos/__main__.py`. The other two, `__main__.py` and `__init__.py`, are entrypoint and package initializer, not dead modules. The project specifies `nomos=nomos.__main__:main` in `pyproject.toml`. No module qualifies for deletion on a 'no apparent references' criterion. Direct imports alone do not prove every function is semantically needed, so functional equivalence and consumer evidence remain future gates. No code deletion, no branch.


## P0-R11 — Function-level retirement guard (2026-10-18)
Preliminary function-level analysis: `src/nomos/__main__.py` directly imports all 19 implementation modules; `pyproject.toml` identifies its CLI entrypoint, and `src/nomos/__init__.py` exports research APIs. A module import census is insufficient to mark individual helper functions unreachable because helpers may be called from analyses, imported by tests, or exposed through public API. No validated redundant function or implementation was established. Decision: ZERO code deletions and no new branches. Required next proof is a complete symbol-level call/reference graph and equivalence-tested replacement, then exact per-file hash and Drive recoverability before any deletion.
