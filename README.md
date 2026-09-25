# NOMOS

**Normative Ontology, Meursault, and Ontological Singularity**  
한국어 연구명: **특이점의 형이상학**

NOMOS studies a recurring transformation:

**situated event → interpretation → person attribution → authority → consequence → correction**

The project began from a social-physics intuition: material/sensory constraints and normative/social constraints seemed to act like two coupled fields around the same person and event. NOMOS did **not** preserve that literal physics. The early program destroyed its strongest metaphors: no literal normative force, no universal absurdity score, no fixed threshold, no single social translation function.

What survived is a stricter research program in **relational person-judgment and institutional epistemic authority**.

## What this repository is

NOMOS is **not** a moral scoring engine and **not** an automated judge.

It is a typed case-description and audit kernel for studying when evidence, causal claims, person predicates, institutional authority, supports, provenance, and consequences are being illegitimately collapsed.

The executable layer validates research representations and detects structural overreach; it does not output a verdict about a person.

## Active kernel

- dual explanatory layers, not dual physical universes
- event-to-person bridge burden
- causal contribution ≠ blame ≠ person authority
- action authority ≠ thick person-predicate authority
- provenance persists through transformation
- policy-conditioned evidence stays policy-conditioned
- recovered visibility ≠ recovered baseline
- ordinary regime ≠ zero-support regime
- support dependence ≠ person failure
- withdrawal is an intervention
- distributed production requires reassemblable accountability
- uncertainty may legitimately terminate in nonidentification
- responsibility is not a conserved scalar
- assistance does not cancel authorship
- derived record ≠ person property
- compression validity is use-relative
- visible thinness may coexist with sealed, reopenable provenance

## Repository map

- `docs/origin.md` — the social-physics origin and what NOMOS deliberately destroyed.
- `docs/constitution.md` — current research constitution and anti-overreach rules.
- `docs/genealogy.md` — compressed active genealogy.
- `spec/case-format.md` — NOMOS Case Graph specification.
- `src/nomos/` — executable validator and audit kernel.
- `examples/` — synthetic cases.
- `tests/` — regression tests for constitutional invariants.
- `research/current.md` — current conceptual head in compact research form.

## Design rule

The repository encodes **constraints on warranted inference**, not a universal scalar of truth, blame, risk, morality, or personhood.

Whenever a result would require collapsing heterogeneous normative questions into one number, the kernel should prefer a typed vector, explicit bridge, or HOLD.

## Run

```bash
PYTHONPATH=src python -m nomos examples/shared_success.json
PYTHONPATH=src python -m nomos examples/derived_record_valid.json --trace r1
PYTHONPATH=src python -m unittest discover -s tests -v
```

## Current head

**NOMOS-0.835 — Attribution Persistence, Success Appropriation, Failure Externalization, Dependency Erasure — CLOSED.**

Executable kernel: **v0.2.0** — derived-record dependency manifests, sealed provenance, validated-scope portability, lineage tracing, and attribution-compression guards.

Next title only: **NOMOS-0.836 — Provenance Rehydration at Use-Time, Context-On-Demand, Derived-Record Portability, Sealed Dependency Disclosure...**
