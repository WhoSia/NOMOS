# NOMOS

**Normative Ontology, Meursault, and Ontological Singularity**  
한국어 연구명: **특이점의 형이상학**

NOMOS studies a recurring transformation:

**situated event → interpretation → person attribution → authority → consequence → correction**

The project began from a social-physics intuition: material/sensory constraints and normative/social constraints seemed to act like two coupled fields around the same person and event. NOMOS did **not** preserve that literal physics. The early program destroyed its strongest metaphors: no literal normative force, no universal absurdity score, no fixed threshold, no single social translation function.

What survived is a stricter research program in **relational person-judgment and institutional epistemic authority**.

## What this repository is

NOMOS is **not** a moral scoring engine and **not** an automated judge.

It is a typed research kernel for studying when evidence, causal claims, person predicates, supports, provenance, review paths, routing decisions and institutional authority are being illegitimately collapsed.

The executable layer audits structures. It never outputs a verdict about a person.

## Executable research surfaces

### Case Graph
Audits person-judgment structure, provenance, transport and derived-record overreach.

### Review Topology
Audits Q/E/M/I/A/C dependency breaks, redundancy, common-mode exposure, escalation and reassembly.

### Router Authority
Audits the meta-authority that decides which review path is entered.

A routing choice is material when eligible routes differ in:
- visibility;
- dependency breaks;
- remedy reach.

The router analyzer detects:
- material route assignment;
- routing-provenance gaps;
- missing counter-routing;
- unexplained exclusion of materially broader routes;
- outcome-sensitive routing rules;
- unfrozen trigger rules;
- trigger-provenance gaps;
- unreviewable concentration of assignment/trigger/termination/reassembly authority.

These are architecture diagnostics, never person scores.

## Design rule

The repository encodes **constraints on warranted inference**, not a universal scalar of truth, blame, risk, morality, personhood, or institutional quality.

**PATH PLURALITY ≠ ACCESS PLURALITY.**

Many independent review branches do not create meaningful plurality if one unreviewable router controls which branch a contested judgment may enter.

## Run

```bash
PYTHONPATH=src python -m nomos examples/shared_success.json
PYTHONPATH=src python -m nomos examples/review_topology_calibration.json --calibrate-review
PYTHONPATH=src python -m nomos examples/router_contestable.json --audit-router
PYTHONPATH=src python -m nomos examples/router_capture.json --audit-router
PYTHONPATH=src python -m unittest discover -s tests -v
```

## Current head

**NOMOS-0.841 — Review-Router Authority, Case Assignment, Escalation Trigger Selection & Meta-Reviewer Capture — CLOSED.**

Executable kernel: **v0.4.0** — Case Graph + Review Topology + Router Authority.

Next title only: **NOMOS-0.842 — Routing-Rule Revision, Learned Triage, Load-Adaptive Escalation, Feedback Coupling...**
