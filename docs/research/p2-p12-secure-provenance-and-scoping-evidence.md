# NOMOS-0.885 P2-P12 — Secure Provenance Threats, Review Denominators, and Validation Evidence
Date: 2026-11-11. Source-based security/provenance review and synthetic attack lab; no real infrastructure intrusion.

## New original published PDFs
1. Bofeng Pan, Natalia Stakhanova, Suprio Ray (2023), *Data Provenance in Security and Privacy*, ACM Computing Surveys 55(14s), Article 323, 35 pp., DOI 10.1145/3593294. Canonical original file ID `1EqjrTKSu_sn8WabMIr9fJ0oNoHd7-wN4`, `10_PAPERS`.
2. Kerstin Gierend et al. (2024), *Provenance Information for Biomedical Data and Workflows: Scoping Review*, Journal of Medical Internet Research 26:e51297, DOI 10.2196/51297. Canonical original file ID `162KT_4lw9VlJEbt68XXcHmMh2aUyuU3r`, `10_PAPERS`.

## Pan et al. close-reading
§2 provenance entities/activities/agents; §3 distinguishes security properties, collection and flow, and attack categories; §3.3 explicitly covers **forged/appended records, modified/corrupted records, shuffled chronological order and dropped records/chains**; §4 cryptography-based secure provenance, signatures, chains and their limitations, blockchain-based approaches; §5 threat provenance (attack detection, forensic tracing); §6 trust of collectors, overhead, privacy and scalability.
Important: A valid signature authenticates a key holder or assertion under trust assumptions, NOT correctness of every causal edge, provenance completeness or institutional legal authority. A chain can be internally consistent despite an omitted/false event. These threat classes already predate NOMOS. Avoid procedural attack replication instructions or dangerous operational detail.

## Gierend et al. close-reading and methodological controls
JMIR 2024 scoping review follows Arksey/O'Malley framework, PubMed and Web of Science English-language 2006–2022, independent screening. **764 original search hits; 624 after deduplication; 66 included**, with 66/624≈10.58% (the paper rounds to **10.6%**). The paper reports **52 of the included papers** described successful validation of their provenance solution, which includes use cases, proofs of concept or competency question evaluations; not all are independently audited field accuracy. Stakeholder subgroups have denominators different from 66 (e.g. researchers n=64) and must never be replaced by a global denominator without verifying table definitions. Provenance-SFL roadmap separates requirements, design, implementation and validation but does not certify every individual paper's completeness or legal correctness.

## Threat model and bounded tests
A structured synthetic ledger can check: (a) repeated ID, (b) invalid strictly monotone sequence index, (c) confirmed digest inconsistency against independently given reference, (d) missing IDs in an explicitly declared contiguous completeness interval, and (e) absent evidence of external attestation. Presence/absence assertions are **fixtures**, not actual cryptographic verification. A missing complete external registry => provenance completeness UNKNOWN rather than failure.
When actual independent ground truth is not provided, return `not_verified`. Never infer no manipulation just because the ledger is self-consistent.

## Novelty defeat
Cryptographic signature, tamper-evident event chain, provenance provenance graph and real audit-roadmap principles are prior art. NOMOS must not claim to have invented these features. Remaining niche is a domain-specific correct institutional claim-use adjudication shown against expert reviewers, not this synthetic structural integrity analyzer.

## Integrity and evaluation limits
No external archive SHA was computed in this session; only Drive MIME/filename/parent read-back. Toy checks are string comparisons, not a cryptographic signer or secure provenance implementation. This unit is a bounded read-only conceptual test with fake records, no actual sensitive data and no real-world security claim.
