# NOMOS-0.864 — Consequence-Sensitive Judgment Repair and Independent Effect Observation

Canonical Notion: https://app.notion.com/p/3f3ef561cf9281a4b4a5f977b0d1e5c3

State: OPEN / EXECUTABLE SYNTHETIC MODEL COMMITTED / EXACT-HEAD CI AND REALITY CERTIFICATION PENDING.

## Problem and antecedents

A formally executable remedy is not equivalent to correction of the original person judgment, and neither entails change in live derivative judgments or restoration of the person's consequences. Reuse NOMOS-0.860–0.863, in particular the separate concepts of reachability, attribution and completion. Do not silently expand this new model into a universal real-world correction verifier.

## Synthetic observability model

For a fictional case, freeze case ID, observation date, snapshot ID, finite declared node census, each node's operator, dependencies and old/target states. A submitted readback is a synthetic *hypothesis* of an independent observer only if its labels identify an observer distinct from the node operator and a current case/snapshot-aligned receipt. No signature-verification bridge has yet authenticated the observer; values are not externally verified facts.

For each node:
- OBSERVED_CORRECTED: one admissible observation reports the declared target value.
- OBSERVED_STALE: one admissible observation reports the old value.
- UNKNOWN: absent, conflicting, stale or insufficiently scoped observation.

Overall:
- OBSERVED_INCOMPLETE when at least one known old value survives;
- UNKNOWN when no old value is reported but any node is unknown;
- OBSERVED_CORRECTED_WITHIN_DECLARED_CENSUS only if all declared nodes have supported synthetic target matches.

These statuses apply only to an explicitly declared synthetic census. They are not legal, actual-world, or full-system proofs.

## Finite completeness proposition

Fix a **genuinely complete** finite census C of recipients, a unique trustworthy contemporaneous independent observation for every n in C, a correct target criterion T(n), and no state mutation between observation and adjudication. Then all tested node states satisfy T if and only if each observation satisfies T(n). Proof: elementary universal-quantifier elimination over finite C. If census completeness or readback soundness fails, the conclusion cannot be promoted to actual full correction. This does not establish the causal effect of the correction on person's outcomes.

## Nonidentifiability construction

Two worlds can have the same observed signed-looking primary record but different hidden live recipient values. Any function of the identical observations returns identical outputs, although actual downstream completeness differs; thus no universally reliable real-world completeness verdict is identifiable from those observations. A separate pair can share the same before/after outcome series while differing on the unobserved potential outcome under no correction; their causal effects differ. Mere time ordering, signature and observation do not identify the causal effect.

## Prior-art ceiling

- De Toni et al., `Time Can Invalidate Algorithmic Recourse` (FAccT 2025), DOI 10.1145/3715275.3732008: causal recourse validity may fail under nonstationarity. Never claim discovery of temporal invalidation.
- Anton Abramov, `When Recalculation Is Not a Remedy` (2026), SSRN 7339678: shared decision component systemic corrective duties. Never claim discovery of systemic repair.
- Wever & Ybema, procedural justice in administrative objection processes; Greiner et al., randomized court accessibility evidence. Both procedural existence and realized access are pre-existing research objects.
- NOMOS-0.822 already defines correction as a dependency-sensitive graph operation, with source-ablation and propagated repair receipts.
- NOMOS-0.850 already distinguishes notice from recipient correction, requires semantic re-derivation (not merely copying a new scalar), and audits generator-resurrection under refresh.
- NOMOS-0.857 already separates record correction, ongoing consequences, compensation, opportunity expiry and residual repair debt.
- Therefore 0.864 DOES NOT introduce downstream propagation, re-derivation, post-correction consequences or restitution. Its narrower possible result is a falsifiable observational-support limit for verifying those pre-existing obligations. It must not replace 0.850 dependency semantics with a superficial value-equality test.
- Historical correction and causal restitution remain downstream legal/institutional obligations; the new finite node test measures only declared target-value agreement.

## Code and test surfaces

- `tools/consequenceRepair864.mjs`
- `tests/test_consequenceRepair864.mjs`
- `.github/workflows/ci.yml`: read-only Node 22 test gate

Test precommit includes stale derivative, missing recipient, stale/falsely independent/wrong-scope/duplicate readback, two hidden worlds with same observations, and observational outcome improvement with no identifying causal design.

## Closure conditions

Do not seal until exact-head CI SUCCESS is independently checked, human-only author/committer provenance is audited, and the source-to-claim comparison is documented. Actual claimant-relative correction, trusted live census, independent signatures, legal powers, and causal identification remain explicit external HOLDs.

No product/service accepts actual identity or legal petitions.

## P4 preseal extension — explicit 0.850 semantic mismatch gate

The earlier `assessConsequenceRepair864` is a surface readback classifier, not a NOMOS-0.850 semantic re-derivation proof. `assessSemanticRepair864` is an explicitly *synthetic negative gate*:
1. Target-value readback alone is insufficient.
2. Source defeat, fresh warrant, changed mapper, and fresh re-derivation are separate model assumptions.
3. Active generator replay must be tested; a resurrected defeated judgment produces OBSERVED_INCOMPLETE; missing replay evidence produces UNKNOWN.
4. Even a passing synthetic gate returns SEMANTICALLY_SUPPORTED_IN_SYNTHETIC_MODEL_ONLY, not a trusted real-world repair certificate.

At source HEAD `73b456e08da05c2b5e40e826c8ad43b88a11a63d`, the live GitHub source/test blobs were re-fetched. The exact regression body with host imports adapted to an isolated V8 JS evaluator passed **28 assertions**, including these four semantic gates. This is NOT a GitHub Actions exact-head success nor Node.js 22 full-suite execution.

**Verdict remains PRESEAL / EXACT-HEAD CI HOLD.** 0.865 is not authorized by a PRESEAL result. Publication authority remains strictly synthetic and declared-model-relative.
