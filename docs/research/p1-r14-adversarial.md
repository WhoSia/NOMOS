# NOMOS P1-R14 — Adversarial validation and novelty-breaker
Date 2026-11-05. Status: P1; P2 HOLD.

## Defect classes investigated
R12's simple validator uses a regex that accepts impossible dates (e.g., 2024-02-30), checks chronology only between adjacent steps when both exist, reduces multiple same-step events to one earliest event, and trusts caller-supplied auth=true. These are algorithmic weaknesses, not evidence of real-world institutional misconduct.

R14 introduces separate stricter research validator with calendar validation, all-present-step temporal inversion tests, ambiguous duplicate-step rejection and nonempty source-pointer checks. Synthetic proof_ref fields are placeholders, never independently authenticated receipts. Maintain R12 unchanged as a historically reproducible negative baseline; add a new code path with CI tests.

## Research hypothesis
A naive graph of asserted correction events is insufficient: unless relation identity, event validity, provenance and strong external baselines are handled, graph size can increase without identification. Compare output on preregistered synthetic failure modes. No prospective real accuracy claims.

## Sources and continuity
R13 official four-case ledger and source rules remain unchanged. This unit is an engineering validity exercise; external state of each consumer is unknown. No new P2 theory until external validation beats a strong law-and-documents audit.
