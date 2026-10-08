# NOMOS-0.861 — Authority Evidence Attestation and the Limits of Its Proof

**Stage:** Bounded implementation court. **NOT** certification of any real government body's legal power. 
**Canonical Notion:** https://app.notion.com/p/3f3ef561cf9281ae8e36d2c1184c4492

## Primitive obligation

NOMOS-0.860 is an exact finite-model computation under legally accurate, complete
route declarations. NOMOS-0.861 asks what can justify admitting those declarations as
evidence, while preserving institutional contestability.

**SIGNED ≠ TRUE ≠ LAWFUL ≠ INDEPENDENT ≠ COMPLETE.**

The submitted packet is *untrusted*. The anchor policy supplied as a separate
argument is a bounded *governance input*, not an objectively true law registry.

## Evidence transport

Define:
- \`B\`: untrusted packet: model graph, base-fact claims, sourced documents, signed receipts.
- \`P_j,t\`: externally supplied, time-indexed trust policy for jurisdiction j:
  trusted Ed25519 verification keys, issuer role grants and control groups,
  source SHA-256 pins + applicability intervals, key/proof revocation records.
- \`V(B,P_j,t)\`: structural/cryptographic verification. Returns accepted and rejected
  evidence receipts, and verified/denied/unknown *model* warrant assertions.
- \`G\`: 0.860 finite AND/OR fixed-point solver using only derived warrant tags and
  cryptographically attested base facts.

An unsigned, expired or otherwise unsupported base fact is represented as a
separate possible (UNKNOWN) zero-prerequisite edge. It must NEVER be injected
directly into the lower fixed point L as a known true fact.

The route census is a signed **claim** of completeness. It is not a proof that all
possible legally admissible paths have been enumerated. Thus:
\`G(V(B,P))\` is called \`ATTESTED_MODEL_BOUNDS_ONLY\`, never \`LEGAL_VERDICT\`.
The independently returned \`institutional\` field is always
\`NOT_INDEPENDENTLY_LEGALLY_CERTIFIED\`.

## Authenticated attestation is not judicial authority

For an accepted proof, the checker verifies:
1. Ed25519 signature over a domain-separated, stable canonical JSON claim;
2. signer public key supplied ONLY through independently passed policy;
3. signer permitted role (legal-route, census, base-fact or review witness);
4. signer control group distinct from the original decision-making institution
   AND distinct from the claim's institutional subject;
5. exact case ID and jurisdiction binding, valid time window and asserted issue date;
6. source text SHA-256 matches an externally pinned digest whose applicable
   jurisdiction and period include the selected snapshot;
7. review evidence, when required, declares specific Q/E/M/I/A/C dependency breaks,
   a probe for each live failure dimension, ancestry difference and usable remedy route;
8. census signer's exact rule inventory matches the candidate finite task model;
9. independently provided revocation flags for the signer or proof.

A valid signature cannot prove real-world source authorship, statutory competence,
absence of key compromise, factual accuracy, independence in incentives or the
practical usability of a reviewer pathway. A claimed issue date is NOT a trusted
timestamp. A claimed route census is NOT proof of legislative completeness.
A stale revocation list is an independently unsolved challenge.

## Conditional proposition: evidentiary attribution

Suppose P is fixed by an examiner independent from B, trust-key ownership is
correct, Ed25519 signatures are unforgeable, SHA-256 preimage/collision substitutions
are infeasible, and the relevant control groups and periods in P are correct.
Then every ACCEPTED receipt was signed under an eligible key for a scoped
statement about a source whose supplied bytes match P's pinned digest.
This is a **statement-attribution proposition** only; it is not a theorem about
the statement's legal or empirical truth.

## Impossibility: no in-band legal sovereignty

Let W+ and W- be worlds with identical packet B, policy P, signed receipts and
source bytes but different actual legal meaning (e.g. a competent court reverses
the statute's application in W-, or the assessor colluded with the original agency).
Any algorithm of (B,P) yields equal outputs for W+ and W-. It cannot make
universally correct, different legal conclusions about the two worlds.

Thus legal promotion requires a separately governed reviewer/court/agency process
that can inspect current authoritative instruments, adjudicate contradictions and
provide a usable challenge. An actor may issue factual evidence without holding
the normative authority to evaluate its own right to issue it.

## Pinned-digest / metadata receipt privacy

Output only proof IDs, issuer IDs, role, source IDs/digests, valid interval and
mapped control group. Do not emit the raw source text or case evidence in receipts.
Cryptographic proofs are not inherently privacy-preserving: signatures and hashes
can link data across systems. Future production deployment requires privacy and
retention assessment.

## Adversarial families

- Self-certification of another institution's power by the original generator.
- Attested review from a reviewer controlled by the original generator.
- Signed but incomplete Q/E/M/I/A/C material dependency breaks.
- Apparent complete route graph supplied without independent source census.
- Accepted source changes without changing the independent digest pin.
- Replay into another case, another jurisdiction or out-of-window snapshot.
- Contradictory independently signed route status.
- Untrusted issuer key or role, future claim, key/proof revocation.
- Base fact injected into the lower fixed point without signed independent witness.
- Lost or revoked source receipt and unavailable alternatives should yield UNKNOWN,
  not false legal impossibility.

## Non-novelty and external standards

- W3C PROV-O, https://www.w3.org/TR/prov-o/ : attribution/derivation.
- W3C VC Data Model 2.0, https://www.w3.org/TR/vc-data-model-2.0/ : verification is not proof of truth.
- RFC 9162, https://www.rfc-editor.org/rfc/rfc9162 : Merkle append-only and inclusion/consistency evidence.
- NOMOS-0.834: causation versus normative bearer.
- NOMOS-0.839 and 0.840: reviewer epistemic dependence and failure-mode-relative
  minimal independent reviewer cover; **reuse, don't reinvent**.
- Bovens & Zouridis (2002), DOI 10.1111/0033-3352.00168: relocation of
  administrative discretion into the system-level machinery.

## Work beyond present scope

No actual statute's evidentiary snapshot, authoritative signature registry, signer
identity governance, transparency log, trusted timestamp, legally binding route
census, authentic reviewer dependency ablation, or remedy execution has been
supplied. This stage can validate a *synthetic* model and show necessary
attestation interfaces; it cannot certify a historical person-judgment consequence.

Kernel version is unchanged (v0.18.0). Distinct Node.js runtime deliberately owns
cryptographic verification and talks through JSON to the 0.860 computational court.
