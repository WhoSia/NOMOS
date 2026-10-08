# NOMOS-0.862 — Contestable Attestor Governance and Credential-State Freshness

**Canonical Notion:** https://app.notion.com/p/3f3ef561cf928158855dfbfdce37e364

**Research verdict:** Conditional finite-snapshot cryptographic governance constraints only. No real authority, official registration or legal adjudication certified.

## Explanandum lock

A registrar or reviewer cannot create its own legitimate competence by issuing a correctly
signed credential to itself. At the same time, a supposed challenge right is not a
remedy if a captured administrator can silently dismiss it, and a malicious valid
challenger should not obtain an automatic indefinite power to decide the merits.

**VALID SIGNATURE ≠ LEGITIMATE TRUST ROOT.**

**INDEPENDENT SIGNER KEYS ≠ INDEPENDENT INSTITUTIONAL CONTROL.**

**ABSENCE OF OBSERVED REVOCATION ≠ FRESH PROOF OF VALID CREDENTIAL STATE.**

**A REPORTED LEGAL ALTERNATIVE ≠ A PROVEN LEGALLY AVAILABLE ROUTE.**

## P1 — Policy snapshot and formal model

For each target x (trust policy root or route census), define a fixed externally
supplied charter G=(id,j,t,e,e_min,K,Groups,Pins,q,delta_s,delta_c), where:
- id = policy ID, j = jurisdiction, t = as-of date;
- e = governing epoch, e_min = externally fixed minimum acceptable epoch;
- K = issuer public keys, signature-role grants and group memberships;
- Groups = externally determined control-group identities, including challenged group;
- Pins = externally fixed content digests and date ranges of evidentiary documents;
- q >= 2 = number of distinct independently listed groups required to accept
  current "good" status or dismiss a challenge;
- delta_s = freshness budget for signer-claimed status dates;
- delta_c = maximum pending challenge duration before escalation is required.

A separate packet includes declared routes, source text and signed events. Every
event is bound to charter/jurisdiction/epoch/target, route-list digest and source ID,
signed with domain-separated Ed25519 bytes.

### Finite state verdicts

ELIGIBLE_MODEL — >=q distinct *listed* control groups have signed status="good"
within delta_s, no accepted revoked status and no unresolved verified challenge.
It is NOT a true legal-authority finding.

UNKNOWN — epoch/scope mismatch, malformed/missing root endorsement, or insufficient
distinct trusted groups.

FRESHNESS_HOLD — observed prior status statements exist, but no fresh current
statement is available. No default healthy status.

REVOKED_ATTESTED — accepted signed revocation exists without contradictory
good-status evidence. Neither irreversibility nor a legal ruling is inferred.

CHALLENGED — an independently signed unresolved challenge exists or accepted
status attestations conflict. A potential omitted legal route triggers review, not
automatic recognition as lawful.

ESCALATION_REQUIRED — unresolved independently signed challenge exceeds delta_c.
The code does NOT auto-dismiss, silently re-enable the trust root, or pretend that
a proposed escalation office has binding judicial authority.

### Pending challenge and independent resolution

For a candidate challenge to be considered, its signer must be authorized under
the external charter, be outside the challenged control group, present an
externally pinned source and sign the challenge. For an omitted legal route, the
signed claim must identify a candidate outside the declared route set. The
checker does not know if that candidate is legally valid.

A challenge may be dismissed only when >=q *distinct* authorized resolution
groups, each distinct from the challenger and the challenged institution,
attest dismissal with a date at or after the challenged event. An accepted
"sustain" attestation keeps it challenged; a single signer cannot erase it.

**This is a procedural simulation**, not a legal hearing. A dishonest challenger
who controls an independently listed key can still cause a temporary hold; after
delta_c, escalation is required, not self-executed.

## P2 — Code and test surface

- tools/governance862.mjs: pure Node.js verifier and 0.861 composition gate.
- tests/test_governance862.mjs: synthetic key-generation and adversarial
  status, challenge, self-control, quorum, freshness and roster tests.
- tests/test_governance862_integration.mjs: positive and negative 0.861
  computational outcomes; root/census governance HOLD masks either outcome
  to UNKNOWN before giving downstream permission.
- .github/workflows/ci.yml: Node 22 regression steps in read-only CI.
- Existing tools/attest861.mjs and tools/deadlock860.mjs are reused rather than
  copied or superseded. Python package stays v0.18.0.

### Conditional safety theorem

If the externally supplied charter accurately represents signer identities,
control groups, allowed scopes, source pins, revocation updates and the relevant
legal snapshot; signature/hash assumptions hold; and the event packet includes
all admissible material challenges relevant to x, then ELIGIBLE_MODEL entails
that q *declared* independent groups have attested current good state and no
accepted unresolved adverse evidence is in the packet. It does not entail a
legal power to adjudicate, revoke, compel or compensate.

For verifyGoverned862, a simple branch invariant additionally holds:
if root or census governance is not ELIGIBLE_MODEL, or the supplied 0.861 policy
hash fails to match the separately pinned digest, every computed goal is
UNKNOWN, regardless of whether the otherwise admitted 0.861 model could derive
ACTIONABLE or BOUNDED_BLOCKED.

Proof of the branch invariant: the gate returns before invoking verify861
whenever any listed blocking predicate is true. It enumerates all goals and
returns UNKNOWN on that branch. Tests exercise both positive and negative
downstream model verdicts under a governance hold.

## P3 — Red-team and non-identifiability

Attack families:
- Controller Sybil: A and A2 have distinct public keys but same control group.
- Compromised or revoked key.
- Old signed good status (freshness hold).
- Conflicting good and revoked statuses (challenge).
- Honest authorized revocation (no fresh restoration by default).
- Malformed/out-of-epoch endorsement or route-list substitution.
- Original agency signs its own policy validity.
- Signed independent omitted-route claim.
- Invalid counter-route claim already present in the census.
- Registrars who purport to dismiss their own challenge.
- One review group masquerading as a multi-group quorum.
- Pending aged review -> ESCALATION_REQUIRED, without automatic approval.
- Missing/incorrect independent prior 0.861 policy pin.
- A governance hold on top of an already actionable or blocked finite model.
- Unrecognized/disallowed signature cannot deny service by itself.

### Strong negative theorem

Let pi_G(W) be the charter, pinned sources, valid-looking signer group map and
signed events observed by this verifier. Worlds W+ and W- can share exactly
pi_G(W) while differing in actual constitutional competence, hidden common
control, unreported legal alternatives, stale upstream revocation evidence or
collusion. A deterministic function of pi_G(W) returns the same label for both
worlds. Thus ELIGIBLE_MODEL can never be automatically promoted to a true
legal-authority verdict without additional competent, contestable human/legal
interpretation. An indefinitely recursive chain of signature issuers does not
resolve that observational underdetermination.

## P4 — Pre-existing science / novelty ceiling

- W3C Verifiable Credentials 2.0 distinguishes verification from truth:
  https://www.w3.org/TR/vc-data-model-2.0/
- W3C Bitstring Status List 1.0 supplies credential suspension/revocation
  facilities and explicitly allows credential issuer and status issuer to differ:
  https://www.w3.org/TR/vc-bitstring-status-list/
- RFC 9162 provides certificate transparency Merkle inclusion and consistency,
  and describes split-view misbehaviour and independent monitoring:
  https://www.rfc-editor.org/rfc/rfc9162
- NIST SP 800-63C-4 already has pre-established federation trust agreements:
  https://pages.nist.gov/800-63-4/sp800-63c.html
- SLSA v1.1 / in-toto already stresses policy-aware verifier attribution:
  https://slsa.dev/spec/v1.1/verification_summary
- NOMOS 0.834 (attribution), 0.839 (Q/E/M/I/A/C), 0.840 (independence
  topology), 0.860 (finite reachability), 0.861 (signed provenance).

**NOMOS has NOT invented multisignature quorums, revocation, freshness, logs,
provenance, credential trust or appeals.** Its still-contestable novelty candidate
is a typed evidence-boundary for historical person-judgment restoration that
explicitly refuses to launder signed root status into renewed power over a person.

## Explicit nonclaims and implementation limitations

- No trusted wall clock or timestamp authority; issuedOn is signed by its issuer
  but can be backdated by a malicious issuer. Measured "freshness" is conditional.
- No real official trust registry or independently verified control-group graph.
  Separate key identifiers or group strings are not empirical independence.
- No actual legal route census; a signed counter-route is grounds for review,
  not proof of route lawfulness.
- No Merkle log, inclusion/consistency proof, gossip or authenticated split-view
  witness verification. The "split_view" challenge is a signed allegation.
- The event list itself is not cryptographically shown complete; omitted
  challenges may hide in other custodians or inaccessible records.
- No executable legal challenge resolution, jurisdictional court decision,
  case-specific restitution or person-merits authority.
- Governance snapshots and epoch minima depend on an out-of-band policy provider
  who may be compromised or illegitimate; that is the remaining normative root.
- Disclosure of stable source digests and issuer/group IDs can create linkability;
  privacy needs separate review.

**Stopping rule:** seal only the *bounded conditional computational/verifier
result* after exact-head CI SUCCESS. Any claim of a universally legitimate
trust root, independently complete appeal mechanism, or real public-law
competence remains NOT CERTIFIED.


## P5 — Signed Intake Receipts and Independent Materiality Screening

The P0–P4 policy root only accepts challenges signed by a policy-approved
attestor. That cannot establish an affected person's effective opportunity to
enter review if their situation prevents obtaining a privileged attestor key.
The right solution is NOT to give unsigned dockets unilateral revocation power,
nor to pretend unverified submitted bytes are an agency-issued receipt.

### Evidence states

1. \`SUBMISSION_UNACKNOWLEDGED\`: a person claims to have filed a docket, but
   no authorized *intake office* has signed receipt of those exact bytes.
   The person is not required to hold a privileged auditor's Ed25519 key;
   any legally required personal identity/standing verification remains
   a separate requirement NOT bypassed by this software.
2. \`SCREENING_PENDING\`: receipt signed by separately enrolled *intake* role,
   without an independently signed materiality screen.
3. \`SCREENING_ESCALATION_DUE\`: signed intake acknowledgement exists but
   still no qualified screen after the selected time budget. This is an
   accountable delay marker, not automatic legal suspension.
4. \`SCREENED_NONMATERIAL\`: signed, source-pinned screen declares no
   material root/census dispute, which may remain contestable.
5. \`MATERIAL_FOR_GOVERNANCE_CHALLENGE\`: receipt plus signed external
   screening, with the screened evidence bytes matching an independently
   pinned digest and exact SHA-256 binding to the acknowledged docket.
6. \`SCREENING_DISPUTED\`: conflicting independently signed screens; do not
   silently pick the institution's preferred result.
7. \`INTAKE_SCOPE_HOLD\`/ \`UNRELATED_PETITION\`: mismatched case, charter,
   epoch or time does not acquire a veto over any other repair case.

The submitted docket hash is \`submissionDigest\`, **never an institutional
receipt**. An intake acknowledgement is independently signed with a
domain-separated Ed25519 key registered for the intake role, bound to
docket digest, case, jurisdiction, policy, epoch, received-on date and target.
An intake signer can establish a claimed receipt under its role, but cannot
by that act decide the petition's merits or validate the trust root.

### Cross-layer invariants

\`verifyGovernedWithPetitions862\`:
- unacknowledged and merely pending petitions cannot independently force a
  previously viable 0.861/0.860 model result to UNKNOWN;
- an acknowledged, externally screened material claim (or conflicting
  qualified screens) causes a temporary \`INDEPENDENT_CONTEST_REVIEW_HOLD\`
  and both ACTIONABLE and BOUNDED_BLOCKED are masked to UNKNOWN;
- an unrelated case's docket cannot veto another person's claim;
- expired screening creates an escalation reason without automatically
  dismissing the petition or manufacturing a new legal sovereign.

A material screening **is still an attestor statement** and does not itself
prove legal standing, material truth, source independence, actual court
jurisdiction, or an effective remedy. Actual governmental authentication and
reparative power remain outside this prototype.

### P5 executable evidence

- \`tools/petition862.mjs\` — separate intake and reviewer signature domains
  on exact canonical docket and pinned source, with full scoped conditions.
- \`tests/test_petition862.mjs\` — positive and negative acknowledgement,
  modified docket, false signature, captured reviewer, source substitution,
  unrelated case and delayed-screen regressions.
- \`tests/test_governance862_integration.mjs\` — verifies positive and
  negative downstream outcomes are blocked **only** following qualified
  material screening, not by every submitted complaint.
- Actions #301: **SUCCESS**, exact head at code-test convergence
  \`4eebf26ee0ed3cef5925eaf90c154bdbe97dbb22\`.
  Intermediate #299/#300 failures reflect temporarily inconsistent schema
  and fixtures; they were repaired before the reported success.

## P6 — Bounded Court Closure and External Institutional Proof Debt

### Conditional propositions

**Non-veto:** with independently accurate intake-role keys and secure signature
verification, unsigned docket bytes alone do not trigger an authoritative
material screening or change modeled eligibility.

**Bounded contestability:** if an intake role signs acknowledgement of exact
docket bytes, and a separately trusted external screening role signs a
source-verified material concern about the same case, then the derived model
remains reviewable instead of silently promoting either a positive or
negative finite-model disposition.

**Non-identifiability:** two worlds may have the same signed intake and screen
but differ in real claimant standing, actual document provenance, procedural
accessibility, independence of reviewers or legal powers to change an outcome.
No purely internal algorithm can establish a correct legal verdict in both.
An externally competent and accountable court or remedial institution must
determine that separate question.

### Explicit closing verdict

**NOMOS-0.862's finite-model governance and synthetic implementation
court is BOUNDED-CLOSED once final exact-head CI succeeds.** The general
legal-world claim "these institutions legitimately govern these persons'
rights" was NEVER admitted as a result, and remains NOT CERTIFIED.

Theoretical and synthetic closure is a valid stopping point; more ungrounded
checkboxes would confuse tested mechanism properties with legal truth.

**Remaining live field obligations:**
- authentic official legal/regulatory delegation of signer powers;
- verified fresh revocation and trusted timestamps;
- genuinely independent controller and auditor ownership;
- a real complainant-accessible, lawfully identity-verified intake path
  with acknowledged submission and practicable route to remedy;
- observed downstream person-judgment repair and explicit irreversible harm.

These are the next *empirical institutional research domain*, not excuses
to declare the bounded finite model incomplete.

### Next proposed research topic, not opened

**NOMOS-0.863 — Effective Contestation Access, Independent Petition Acknowledgement,
Claimant Standing without Privileged Attestor Credentials, Remedy-Reach
Verification & the Primitive Question of When a Formally Contestable
Institutional Trust Regime Actually Gives an Affected Person a Usable
Path to Correction.**

Existing law, NIST federation redress requirements, administrative appeal
procedures and NOMOS-0.19/0.839–0.841 remain required donors; an electronic
filing UI is not automatically a legal remedy.

**P0–P6 all live inside one NOMOS-0.862 Notion canonical.**
