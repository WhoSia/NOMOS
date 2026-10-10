# NOMOS-0.878 — Source-bound code retirement audit (2026-10-10)

## Decision
RETIREMENT HOLD / PRESERVATION FIRST. No GitHub executable code was deleted or disabled. This audit deliberately distinguishes (a) a historical archive snapshot, (b) candidate old code, and (c) actually demonstrated unused code. Only (a) is archived; categories (b) and (c) are not conflated.

## Verified Drive recovery point
NOMOS research Drive root: https://drive.google.com/drive/folders/1Cryv0uB-DK3yDxQUQRMKCNVlLA-UZA3K
Recovery candidate archive folder: https://drive.google.com/drive/folders/17EenucDzV2bho1VBfvAIVY8eiIKHSU9n
Copy: https://drive.google.com/file/d/1idOVLQKNYT_CMB4SSDWbff7c_-jC1ouw/view
Original historical NOMOS-main.zip remains in NOMOS chat-archive folder, file ID 1BzsMYNQV3Z8yhjnHSFLXnHQ_9wWynzQ4, originally uploaded 2026-10-08. Copied file retains an identical 229,017-byte size, and its new parent was re-read. Drive copy is NOT a snapshot of 2026-10-10 HEAD and is NOT evidence all current files are backed up. Byte-level SHA was not independently calculated. Do not delete current code by relying on this old ZIP.

## Current-tree static census (2026-10-10)
GitHub WhoSia/NOMOS main live namespaces: src/nomos, tools, tests, .github/workflows, examples. The 18 current tools/*.mjs modules have corresponding tests/test_*.mjs entry points and are invoked by read-only CI, directly or through test imports. The Python module family under src/nomos has matching unittest files and CLI/example routes. Historic proof machinery is a chain of regression witnesses, not dead code merely because versions 0.860-0.870 are older than current 0.878. Unsafe fixtures are negative test evidence and are not trash.

## Retirement gate for each candidate
1. Identify exact path and authoritative latest blob SHA; list all imports, test imports, CLI branches, fixture/spec and workflow references.
2. Search whole current code tree and historical proof contracts; establish no active entry points. A negative name-only search is insufficient.
3. Run preserved tests, build and end-to-end CLI with candidate removed on an isolated branch, not main. Record exact source HEAD, before/after test receipts and artifact hashes.
4. Save versioned actual bytes to Drive, verify raw hash and recoverability, and link the exact archived item with old path and blob SHA.
5. Have the contributor explicitly authorize retirement/deletion; avoid github-actions[bot] author/committer or workflow writeback; only then perform minimal authorized deletion with CAS and post-change CI.
This turn did not establish steps 2-5 for any active path; zero code files were retired.

## New functional surface
tools/temporalAuthority878.mjs; tests/test_temporalAuthority878.mjs; CI node step. The temporal checker preserves the distinction between an appeal, the scope of a court-granted stay, an enacted Schedule 1 amendment and individualized retrospective validation exceptions. It is not a substitute for legal adjudication and never certifies rights, entitlement, restitution or policy causality.

The P2 statute is Social Security and Other Legislation Amendment (Technical Changes No. 1) Act 2026 (C2026A00030), assented 1 Apr 2026, Schedule 1 commenced 2 Apr 2026; items 16(2)-(4),17(1)-(3) distinguish pre-commencement assessments, post-commencement review decisions and pre-commencement court-finalised rights. Original https://www.legislation.gov.au/C2026A00030/asmade .
