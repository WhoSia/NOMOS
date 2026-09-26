# NOMOS

**Normative Ontology, Meursault, and Ontological Singularity**  
한국어 연구명: **특이점의 형이상학**

NOMOS studies a recurring transformation:

**situated event → interpretation → person attribution → authority → consequence → correction**

The project began from a social-physics intuition: material/sensory constraints and normative/social constraints seemed to act like two coupled fields around the same person and event. NOMOS did **not** preserve that literal physics. The early program destroyed its strongest metaphors: no literal normative force, no universal absurdity score, no fixed threshold, no single social translation function.

What survived is a stricter research program in **relational person-judgment and institutional epistemic authority**.

## What this repository is

NOMOS is **not** a moral scoring engine and **not** an automated judge.

It is a typed research kernel for studying when evidence, causal claims, person predicates, supports, provenance, review paths and institutional authority are being illegitimately collapsed.

The executable layer audits structures. It never outputs a verdict about a person.

## Active kernel

- dual explanatory layers, not dual physical universes
- event-to-person bridge burden
- causal contribution ≠ blame ≠ person authority
- provenance persists through transformation
- recovered visibility ≠ recovered baseline
- ordinary regime ≠ zero-support regime
- support dependence ≠ person failure
- responsibility is not a conserved scalar
- derived record ≠ person property
- visible thinness may coexist with sealed, reopenable provenance
- record provenance ≠ selection provenance
- explanation ≠ contestability
- different reviewer ≠ different epistemic path
- more review ≠ more independence
- redundancy earns value through diversity or remedy, not count
- review independence is calibrated to live failure topology

## Executable research surfaces

### Case Graph

Audits person-judgment structure, provenance, transport and derived-record overreach.

### Review Topology

Audits review architecture over the typed dependence dimensions:

- `Q` query / selection
- `E` evidence access
- `M` model / relevance
- `I` incentives
- `A` authority / remedy
- `C` override cost

It can identify:

- inclusion-minimal dependency-break sets;
- coverage redundancy;
- equivalent duplicated safeguards;
- resilience redundancy candidates;
- common-mode exposure;
- capture-cut candidates;
- escalation cycles;
- authority-changing reachability;
- fragmentation without reassembly.

These are **architecture diagnostics**, never person scores.

## Repository map

- `docs/origin.md` — social-physics origin and deliberate self-destruction.
- `docs/constitution.md` — current research constitution.
- `docs/genealogy.md` — compressed active genealogy.
- `spec/case-format.md` — Case Graph specification.
- `spec/review-topology.md` — Review Topology specification.
- `src/nomos/` — executable research kernel.
- `examples/` — synthetic research fixtures.
- `tests/` — regression tests.
- `research/current.md` — current conceptual head.

## Design rule

The repository encodes **constraints on warranted inference**, not a universal scalar of truth, blame, risk, morality, personhood, or institutional quality.

Whenever a result would require collapsing heterogeneous questions into one number, NOMOS prefers typed structure, explicit bridges, provenance, or HOLD.

## Run

```bash
PYTHONPATH=src python -m nomos examples/shared_success.json
PYTHONPATH=src python -m nomos examples/derived_record_valid.json --trace r1
PYTHONPATH=src python -m nomos examples/review_topology_calibration.json --calibrate-review
PYTHONPATH=src python -m unittest discover -s tests -v
```

## Current head

**NOMOS-0.840 — Review-Independence Calibration, Minimal Dependency Breaks, Redundant Safeguards & Escalation Topologies — CLOSED.**

Executable kernel: **v0.3.0** — Case Graph 0.2 + derived-record lineage + Review Topology 0.1.

Next title only: **NOMOS-0.841 — Review-Router Authority, Case Assignment, Escalation Trigger Selection, Meta-Reviewer Capture...**
