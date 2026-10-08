# NOMOS-0.863 — Effective Contestation and End-to-End Remedy Reach Court

Canonical: https://app.notion.com/p/3f3ef561cf9281febbf2c826ac35eab1

Status: BOUNDED FORMAL / SYNTHETIC PROGRAM PROOFS ONLY; no real legal standing or successful person-remedy claim.

## Explanandum and prior art

Formal appeal availability, claimant accessibility, signed institutional receipt, lawful standing, independent merits review, actual power to change consequences, execution, and downstream copy repair are eight different predicates. A signed or displayed filing route is not proof of a usable remedy.

Authoritative Korean Online Administrative Appeals guidance states that online filing requires authenticated login, while lawful written filing is separately described through physical delivery or post. That is a distinction between legal channels, NOT advice to evade mandatory identity verification: https://simpan.go.kr/eas/aa/ac/100/admjdgmTrgt.do?cmnMenuCd=E03020100

Standing, filing periods, and recognized exceptions remain case-specific legal questions, not unrestricted date arithmetic: https://simpan.go.kr/eas/aa/ac/100/admjdgmInst.do?cmnMenuCd=E03040100&subMenuIdx=01

NIST SP 800-63C-4 Section 3.5.3 addresses accessible multi-party redress in identity federation, not all legal proceedings: https://pages.nist.gov/800-63-4/sp800-63c.html

OECD AI Principle 1.3 already expects adequate information to enable adversely affected people to challenge AI outcomes: https://oecd.ai/en/dashboards/ai-principles/P7

Internal NOMOS predecessors: 0.19 bounded anti-capture and challenge rights, 0.839–0.840 decision-relevant Q/E/M/I/A/C dependency breaks, 0.841 meta-router capture, 0.860 finite AND/OR fixed-point theory, 0.861 independent signed-evidence attribution, and 0.862 trust governance and independently acknowledged petitions. Do not claim novelty for appeal law, alternative channels, fixed points or accessibility.

## P1 — Eight-step AND/OR claimant pathway

A finite case packet fixes the case ID, jurisdiction, as-of date and alternative candidate route hypotheses. Each route includes eight distinct ordered evidence atoms:

1. CHANNEL: this claimant can use this legally described channel under its own official requirements.
2. RECEIPT: a genuine institutionally acknowledged submission, not a self-made hash.
3. STANDING: required legal interest/representation is supported in that case.
4. TIME: a timely filing or a legally recognized exception is supported.
5. REVIEW: decision-relevant independent examination under 0.839–0.840.
6. AUTHORITY: a competent body can actually order the relevant correction.
7. EXECUTION: the permitted correction has been carried out.
8. RECIPIENT: dependent recipient systems and live copies have been corrected.

Within a route the prerequisites are conjunctive; across routes they are disjunctive. Reuse 0.860 assess860 rather than inventing another reachability solver. A route can be unavailable online while a genuinely lawful written alternative remains potentially usable.

Two noninterchangeable goals:
- remedy_reachable: one complete route through AUTHORITY.
- repair_evidenced: one complete route through EXECUTION and RECIPIENT.

All statuses are mathematical ACTIONABLE / BOUNDED_BLOCKED / UNKNOWN over a finite declared model. The software never adjudicates actual standing or declares an individual's real remedy completed.

## P2 — Authenticated evidence composition

The direct assessRemedyReach863 function is explicitly HYPOTHETICAL_REMEDY_MODEL_ONLY. Caller-supplied source labels have no legal authority.

The governed assessor assessGovernedRemedyReach863 checks exact correspondence of every distinct stage evidence ID to the model rules and the independently governance-checked 0.862 census, then invokes verifyGoverned862, which invokes verify861. Accepted signed and source-pinned route evidence is mapped to stages and then to the unchanged 0.860 fixed-point algorithm.

A review stage requires a 0.861 decision-sensitive Q/E/M/I/A/C dependency-break receipt and a specified outcome-changing remedy path. A mere signature asserting an independent reviewing agency is insufficient. An incomplete signed census, unrecognized signer, policy challenge, changed case or scope, invalid signature, missing review break or source uncertainty returns UNKNOWN rather than manufacturing permission or a negative legal ruling.

All signing keys, government-like bodies, law and documents used in regression are explicitly fictional. Governed result status is GOVERNED_ATTRIBUTED_MODEL_ONLY and the institutional verdict remains NOT_INDEPENDENTLY_LEGALLY_CERTIFIED. This means authenticated signer attribution, NOT validated legal truth.

## P3 — Exact finite prefix theorem

Consider eight stage warrants for a given route, each V (verified in the declared model), D (denied in the declared model) or U (unknown). For a conjunctive chain, the result is ACTIONABLE exactly if all prerequisites are V, BOUNDED_BLOCKED exactly if any is D, and UNKNOWN otherwise. For disjunctive alternatives the overall goal is ACTIONABLE if any complete route is V, BOUNDED_BLOCKED only if every route contains D, and UNKNOWN otherwise.

This follows directly from 0.860 lower/upper least fixed points under correct warrant declarations and a complete candidate-route census.

Because all eight stages include the first six stages, the following hold under any frozen complete model:
- Repair evidenced ACTIONABLE implies remedy reachable ACTIONABLE.
- Remedy reachable BOUNDED_BLOCKED implies repair evidenced BOUNDED_BLOCKED.

Proof: prefix containment of complete route derivations; a route satisfying eight prerequisites satisfies the first six, and a prefix unavailable in every route cannot be part of any eight-stage successful path. This is not a theorem about real legal standing.

The exhaustive test test_remedyReach863_exhaustive.mjs checks all 3^8 = 6,561 single-route warrant assignments against an independent exact ternary formula, as well as both prefix implications. The two-route alternatives, scope substitutions, recipient nonrepair and signed governance composition are tested separately.

## P4 — Claimant-relative observational-equivalence limit

Construct worlds with identical signed-looking channel/receipt/review/decision/repair inputs, but with distinct real facts:
- legal channel exists but practical person-relative access differs;
- acknowledgement exists but claimant notification was not received;
- reviewer appears organizationally separate but secretly depends on original decision sources;
- signed repair declaration exists while a downstream adverse copy remains operational;
- governing standing exception or legal interest differs despite same submitted ledger.

No deterministic function of identical observations can identify the true institutional outcome in both worlds. The five constructed pairs in test_remedyReach863_nonidentifiability.mjs demonstrate this nonidentifiability. Even cryptographically correct attribution cannot fill in evidence about unnoticed live systems, effective rights or facts absent from the ledger.

## Executable surfaces

- tools/remedyReach863.mjs: typed eight-stage case-relative path compiler, guarded signed-evidence composition, 0.860 reuse;
- tests/test_remedyReach863.mjs: two claimant-route alternatives and negative/unknown stage cases;
- tests/test_remedyReach863_integration.mjs: end-to-end synthetic Ed25519 0.861/0.862 signed attestation and reviewer dependency break;
- tests/test_remedyReach863_nonidentifiability.mjs: five indistinguishable-world pairs;
- tests/test_remedyReach863_exhaustive.mjs: 6,561 exhaustive stage-warrant configurations;
- .github/workflows/ci.yml: read-only Node.js tests plus existing Python suite. Kernel remains v0.18.0.

This synthetic execution does not authenticate any real person's identity or standing, official submissions, court authority, actual remedy execution, or recipient data states. A correct legal channel retains every legally required identity, timing, filing and standing condition.

## Stopping rule

Bounded computational and signature-attribution research can be sealed only after exact-head CI SUCCESS, an audited human-commit chain, and P0–P4 inside the single 0.863 canonical. Institutional remedy implementation remains an explicit external empirical and legal proof obligation. Do not treat this experimental software as an operating administrative petition service or dispense with lawful identity checks.
