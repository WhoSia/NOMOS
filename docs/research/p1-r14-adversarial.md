# NOMOS P1-R14 — Adversarial validation and novelty-breaker
Date 2026-11-05. Status: P1; P2 HOLD.

## Defect classes investigated
R12's simple validator uses a regex that accepts impossible dates (e.g., 2024-02-30), checks chronology only between adjacent steps when both exist, reduces multiple same-step events to one earliest event, and trusts caller-supplied auth=true. These are algorithmic weaknesses, not evidence of real-world institutional misconduct.

R14 introduces separate stricter research validator with calendar validation, all-present-step temporal inversion tests, ambiguous duplicate-step rejection and nonempty source-pointer checks. Synthetic proof_ref fields are placeholders, never independently authenticated receipts. Maintain R12 unchanged as a historically reproducible negative baseline; add a new code path with CI tests.

## Research hypothesis
A naive graph of asserted correction events is insufficient: unless relation identity, event validity, provenance and strong external baselines are handled, graph size can increase without identification. Compare output on preregistered synthetic failure modes. No prospective real accuracy claims.

## Sources and continuity
R13 official four-case ledger and source rules remain unchanged. This unit is an engineering validity exercise; external state of each consumer is unknown. No new P2 theory until external validation beats a strong law-and-documents audit.

### R14.7 — Temporal partial-order defect
## All-present-step temporal verification
Earlier R12 checked only adjacent required steps when both are present, so it could miss request occurring after a later recipient receipt if CRA application were unobserved. R14 checks every pair among present ordered stage labels. This is a *conservative assumed order*, not universal process law; parallel or repeated events can legitimately violate a naive stage ordering. Such cases must enter a richer event model rather than be declared legal violations. Synthetic fixture 'nonadjacent-inversion' exposes the original software gap.


### R14.8 — Calendar and multiplicity defects
## Calendar and duplicate observations
A regular expression matching YYYY-MM-DD does not validate an actual calendar day. The R14 validator parses the day and round-trips ISO format. Multiple authenticated-looking events for the same stage are marked ambiguous instead of choosing the earliest and silently discarding the rest. This deliberately sacrifices completeness when repeated corrections are legitimate. Future adjudication requires event IDs and operation versions.


### R14.9 — Authentication and scope limits
## False authority prevention
The auth=true flag and a nonempty proof_ref string in R14 tests are fixture *assertions*, not actual signature verification, source integrity, legal admissibility, respondent compliance or independent evidence. The checker is a structural sanity filter. Public documents can support certain institutional assertions without revealing private consumer identities. No private beneficiary reidentification, public-data record linkage, or unsupported individual welfare inference is authorized.

