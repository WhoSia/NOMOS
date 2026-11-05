# NOMOS P1-R13 — Independent case ledger and strong-baseline audit
Date 2026-11-05. Status: research, not empirical validation. P2 HOLD.

Pre-declared case cohort: Toyota 2023, Synchrony 2014, Hyundai 2022, TD Bank 2024. Units vary; do not pool or treat them as independent random samples of enforcement practice. Primary sources are official CFPB action pages and dockets, with links in JSON. Toyota and Synchrony are two closure cases with different remediation narratives; Hyundai and TD Bank are order-issuance comparators whose current status is NOT independently verified. Selection was judgmental and may favor visible cases.

Strong baseline B1 reads actual order text, regulatory findings, termination rationale and actor-specific statements. Minimal baseline B0 reads only closure flag. Graph proposal G adds a typed same-case, same-unit event-link ledger. Success must be decision-useful incremental detection over B1, not mere extra fields versus B0. No ground truth for consumer-level outcomes; empirical accuracy, sensitivity and superiority MUST NOT be reported.


### R13.6 — Four-case source controls
## Source-controlled cases
Official CFPB action pages confirm: Toyota 2023 ($48m ordered redress; 2025 terminated); Synchrony 2014 (2025 termination explicitly cites at least $259m redress fulfilled plus policy reason); Hyundai 2022 ($13.2m ordered redress); TD Bank 2024 ($7.76m ordered redress). Hyundai/TD status today is not inferred from old issuance pages. Compare on reported source type, never as homogeneous random sample.
Sources: https://www.consumerfinance.gov/enforcement/actions/toyota-motor-credit-corporation-2023/ ; https://www.consumerfinance.gov/enforcement/actions/synchrony-bank-fka-ge-capital-retail-bank/ ; https://www.consumerfinance.gov/enforcement/actions/hyundai-capital-america/ ; https://www.consumerfinance.gov/enforcement/actions/td-bank-na-furnishing-2024/ .


### R13.7 — Closure baseline discrimination
## Baseline B0 falsifier
Toyota and Synchrony both have a public 2025 termination, yet the Synchrony page says specific aggregate redress obligations were fulfilled and the Toyota page does not establish equivalent claim-specific aggregate fulfillment. Thus B0 (a termination-only bit) loses publicly documented assertion distinctions. This is *not* evidence that Toyota failed, nor independent confirmation of Synchrony individual outcomes.


### R13.8 — Strong-baseline non-superiority
## Strong B1 audit competition
B1 extracts actual legal and administrative content, including remedy scope, dated finding, redress claimed or ordered, and gaps. Our current G ledger adds fields and missingness display but does NOT establish greater factual accuracy, causal identification or auditing utility than B1. Do not present stronger descriptions as higher statistical performance without independent labels.
