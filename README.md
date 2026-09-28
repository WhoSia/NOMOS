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
PYTHONPATH=src python -m unittest discover -s tests -v
```

## Current head

**NOMOS-0.842 — Routing-Rule Revision, Learned Triage, Load-Adaptive Escalation & Feedback Coupling — CLOSED.**

Executable kernel: **v0.5.0** — Case Graph + Review Topology + Router Authority + Routing Learning.

Next title only: **NOMOS-0.843 — Feedback-Support Restoration, Counterfactual Review Coverage, Shadow Audit & Safe Learning...**
