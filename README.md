# NOMOS

**Normative Ontology, Meursault, and Ontological Singularity**  
한국어 연구명: **특이점의 형이상학**

NOMOS studies a recurring transformation:

**situated event → interpretation → person attribution → authority → consequence → correction → institutional learning**

The project began from a social-physics intuition: material/sensory constraints and normative/social constraints seemed to act like two coupled fields around the same person and event. NOMOS did **not** preserve literal normative physics. What survived is a stricter program in **relational person-judgment and institutional epistemic authority**.

## What this repository is

NOMOS is **not** a moral scoring engine, automated judge, or policy optimizer.

It is a typed research kernel for studying when evidence, causal claims, person predicates, supports, provenance, review paths, routing decisions and feedback-based institutional learning are being illegitimately collapsed.

The executable layer audits structures. It never outputs a verdict about a person.

## Executable research surfaces

### Case Graph
Audits person-judgment structure, provenance, transport and derived-record overreach.

### Review Topology
Audits Q/E/M/I/A/C dependency breaks, redundancy, common-mode exposure, escalation and reassembly.

### Router Authority
Audits the meta-authority that selects among materially different review paths.

### Routing Learning
Audits policy revision when reversal, remand or correction signals are observed only under routes selected by the current router.

It separates:
- route exposure;
- raw correction count;
- exposure-normalized correction rate;
- load/capacity change;
- revision-rule provenance;
- on-policy versus independent learning channels.

It can identify:
- selective routing feedback;
- raw-count self-confirmation;
- load/correction confounding;
- revision provenance gaps;
- on-policy self-evaluation;
- outcome-conditioned rule revision;
- unsafe exploration that would require withholding an already-entitled review.

### Feedback Support Restoration
Audits whether routed-away live defeat regions can be re-opened through ethically admissible evidence channels.

It can:
- enumerate inclusion-minimal safe restoration covers;
- distinguish random, stratified, targeted, natural-overlap, shadow and off-policy channels;
- reject entitlement-withholding exploration;
- enforce a diagnostic consequence firewall for shadow review;
- expose unsupported off-policy regions;
- preserve safe nonidentification when no admissible cover exists.

### Review Divergence
Audits disagreement between live and restored/shadow review without treating disagreement as automatic error.

It can:
- diff review contracts across claim/evidence/provenance/visibility/rule/model/threshold/burden/procedure/time;
- separate noncomparable review questions;
- localize validated defects;
- localize structural sources through declared alignment/swap tests;
- preserve aligned residual disagreement;
- separate case diagnostics from policy-update authority.

### Divergence Replication
Audits whether the **same localized divergence mechanism** survives independent replication.

It separates:
- row count from provenance-independent cluster replication;
- reviewer-conditional surfaces from system-level claims;
- case-mix-conditional surfaces from transportable claims;
- observed support from unsupported target strata;
- localization evidence from adjudicator calibration;
- directional recurrence from correctness.

It also exposes reviewer × case-mix conditional surfaces rather than collapsing everything into one disagreement rate.

### Repair Evaluation
NOMOS-0.846 adds a theory-level repair surface: target repair efficacy is kept separate from adoption authority, and changes in secondary failure, delay, workload, visibility and consequence class remain explicit rather than being collapsed into one headline improvement score.

### Distributional Repair Governance
NOMOS-0.847 separates intervention effect, burden incidence, compensability, guardrail authority, adoption authority and reopening authority.

Core boundary:
**potential compensation ≠ actual compensation ≠ consent or permission.**

### Emergency Override / Restoration Debt
NOMOS-0.848 allows bounded emergency departure without granting the exception authority to redefine normality. It separates formal sunset from functional restoration, tracks typed restoration debt, and requires fresh ordinary or successor authority before exceptional arrangements become ordinary governance.

The stage also explicitly rejoins the 2025 71-page founding report: literal normative physics is retired, while the surviving problem is the institutional production of person-level meaning and self-confirming normality.

### Emergency Record Portability
NOMOS-0.849 adds an executable audit for transporting emergency-produced history into ordinary evidentiary and person-judgment use.

Core separation:

**history ≠ evidence ≠ ordinary meaning ≠ consequence authority**

The surface:
- tracks a P0–P5 portability lattice from archive-only retention to durable person-model incorporation;
- requires visible or reconstructible emergency provenance;
- requires regime-sensitivity and successor-baseline analysis for stronger ordinary use;
- checks semantic revalidation, contestability and purpose limitation;
- requires fresh consequence authority before adverse ordinary action;
- propagates emergency ancestry through descendant score/summary/ranking records;
- rejects the idea that a new identifier, recipient, model version or timestamp resets regime provenance.

Core rules:

**RETENTION DOES NOT ENTAIL PROMOTION.**

**DERIVATION DOES NOT RESET REGIME PROVENANCE.**

**CORRECTING THE SOURCE WITHOUT PROPAGATING THE CORRECTION THROUGH ITS LIVE DESCENDANTS IS NOT COMPLETE RESTORATION.**

### Typed Correction Propagation / Semantic Re-Derivation
NOMOS-0.850 reopens the older correction-propagation lineage (0.229A and 0.822–0.827) without duplicating it.

The new executable distinction is:

**correction type → descendant dependency semantics → operation-specific re-derivation**

Correction dimensions are typed across factual, provenance, semantic, authority, temporal, regime and consequence changes.

The surface can detect:
- semantic correction mechanically rerun through an unchanged interpretive mapper;
- regime/context correction replayed through an unchanged selection/query rule;
- stale generators capable of recreating a defeated state after visible outputs were repaired;
- same governing outputs preserved without fresh adoption and fresh warrant;
- notice-only recipient branches falsely presented as corrected;
- completion claims while material descendant or recipient branches remain unresolved.

Core rules:

**CORRECTION IS A TYPED STATE CHANGE, NOT A SINGLE BOOLEAN FLAG.**

**PROPAGATION SCOPE IS DETERMINED BY DEPENDENCY SEMANTICS, NOT BY GRAPH REACHABILITY ALONE.**

**RECOMPUTATION UNDER A DEFEATED INTERPRETIVE RULE IS NOT RE-DERIVATION.**

**OUTPUT REPAIR WITHOUT GENERATOR REPAIR IS INCOMPLETE WHEN THE GENERATOR CAN RECREATE THE DEFEATED STATE.**

**RECIPIENT RECALL TRACKS CORRECTION STATE, NOT MERE MESSAGE DELIVERY.**

The historical Drive chat reread of NOMOS 1–7 also recovered an anti-reinvention chain:
**0.229A → 0.731 → 0.798–0.799 → 0.822–0.827 → 0.835–0.838 → 0.849 → 0.850.**

## Design rules

**POLICY-SELECTED FEEDBACK ≠ POLICY-INDEPENDENT VALIDATION.**

**FEWER OBSERVED CORRECTIONS ≠ FEWER CORRECTABLE ERRORS WHEN CORRECTION OPPORTUNITIES ALSO FELL.**

**OPERATIONAL ADAPTATION ≠ EPISTEMIC VALIDATION.**

**LEARNING VALUE DOES NOT AUTHORIZE HARMFUL EXPLORATION.**

Whenever a result would require collapsing heterogeneous questions into one number, NOMOS prefers typed structure, explicit bridges, provenance, HOLD, or nonidentification.

## Run

```bash
PYTHONPATH=src python -m nomos examples/shared_success.json
PYTHONPATH=src python -m nomos examples/review_topology_calibration.json --calibrate-review
PYTHONPATH=src python -m nomos examples/router_contestable.json --audit-router
PYTHONPATH=src python -m nomos examples/routing_learning_self_sealing.json --audit-routing-learning
PYTHONPATH=src python -m nomos examples/routing_learning_audited.json --audit-routing-learning
PYTHONPATH=src python -m nomos examples/feedback_restoration_safe.json --plan-feedback-restoration
PYTHONPATH=src python -m nomos examples/review_divergence_localized.json --audit-review-divergence
PYTHONPATH=src python -m nomos examples/divergence_replication_systematic.json --audit-divergence-replication
PYTHONPATH=src python -m nomos examples/record_portability_safe.json --audit-record-portability
PYTHONPATH=src python -m nomos examples/correction_propagation_safe.json --audit-correction-propagation
PYTHONPATH=src python -m unittest discover -s tests -v
```

## Current head

**NOMOS-0.850 — Descendant-Record Correction Propagation, Recipient-Graph Recall, Semantic Re-Derivation & Residual Copy Authority — CLOSED.**

Executable kernel is **v0.9.0**.

The kernel now includes typed correction propagation and semantic re-derivation auditing in addition to record portability. The 0.850 stage was opened only after rereading Drive chats NOMOS 1–7 and recovering the older 0.229A / 0.822–0.827 correction lineage, preventing the new surface from merely reinventing graph propagation.

GitHub Actions remain constrained to **`contents: read`** and do not author or write back repository history.

External verification boundary: see **VERIFY.md**.

Next title only: **NOMOS-0.851 — Concurrent Correction Events, Supersession Ordering, Re-Derivation Races, Stale-Write Resurrection & the Primitive Question of Which Person-Judgment State May Govern When New Evidence, New Models or Multiple Corrections Arrive before an Earlier Descendant-Graph Repair Has Finished Propagating**
