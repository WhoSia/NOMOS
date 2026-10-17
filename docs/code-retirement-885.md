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
