# NOMOS-0.882 — Code Retirement Audit (2026-10-17)

## Inventory and exact audit boundary
At pre-write audit main tree SHA: 004fe90bc934bcf551886fc2d99b9069e870cda9. 179 blob files across 191 Git tree entries: src/ 21, tools/ 23, tests/ 47, examples/ 41, spec/ 39, docs/ 4, research/ 2, and root/workflow. This is a path census, not proof of unused-code status.

## Old Drive snapshot does not authorize deletion
The 2026-10-10 audit docs/code-retirement-878.md reports a 2026-10-08 historical NOMOS-main.zip original at Drive file 1BzsMYNQV3Z8yhjnHSFLXnHQ_9wWynzQ4 and a copied historical ZIP at 1idOVLQKNYT_CMB4SSDWbff7c_-jC1ouw. These are not proven to match the later October 17 HEAD. A new archive retrieval via local container failed due inability to resolve github.com; Drive upload tool requires a source file_uri, not a raw local path. No fresh, byte-verified Drive snapshot has been created this turn.

## Decisions
| Family | Count | Disposition |
|---|---:|---|
| src/ | 21 | Keep; Python research kernel and CLI; import graph not proved empty |
| tools/ | 23 | Keep; historical synthetic verifier tools called from tests |
| tests/ | 47 | Keep; runnable counterexample and CI witnesses |
| examples/ | 41 | Keep; fixtures and negative cases |
| spec/ | 39 | Keep; dated scientific history, not disposable executables |

## Prerequisites for safe removal
1. For each candidate audit the exact latest SHA, imports, CI, CLI, fixtures and documentation references.
2. Preserve a current-HEAD full archive and per-file SHA-256 manifest in the specified Drive retirement area; re-fetch archive and verify byte fidelity and recoverability.
3. Test on an isolated branch both before and after the selected removal. Maintain negative counterexamples and adjust CI only after verified replacement.
4. Delete only genuinely retired paths, with non-bot WhoSia author AND committer, and verify post-change main CI. Never erase prior negative claims or reports.

**This stage: zero code deletions, zero current-HEAD byte-verified Drive archives, zero replacement CI runs. Retirement is HOLD, not complete.** README and research/current are promoted to 0.882. Do not confuse documentation update with code retirement.