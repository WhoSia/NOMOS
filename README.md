# NOMOS

**Normative Ontology, Meursault, and Ontological Singularity**  
한국어 연구명: **특이점의 형이상학**

NOMOS is a research program about a recurring failure of judgment:

> how a situated event becomes an interpretation, how an interpretation becomes a claim about a person, and how that person-claim acquires institutional consequences.

The project began from a social-physics intuition: material/sensory constraints and normative/social constraints appeared to act like two coupled fields around the same person and event. NOMOS did **not** preserve that literal physics. The early program destroyed its own strongest metaphors: no literal normative force, no universal absurdity score, no fixed threshold, no single social translation function.

What survived is a stricter research object:

**situated event → interpretation → person attribution → authority → consequence → correction**

This repository turns that mature program into an inspectable research artifact.

## What this repository is

NOMOS is **not** a moral scoring engine and **not** an automated judge.

It is a typed case-description and audit kernel for studying when evidence, causal claims, person predicates, institutional authority, supports, provenance, and consequences are being illegitimately collapsed.

The executable layer is deliberately modest. It validates research representations and detects structural overreach; it does not output a verdict about a person.

## Active kernel

The first executable kernel preserves only concepts that survived repeated internal attack:

- **dual explanatory layers, not dual physical universes**
- **event-to-person bridge burden**
- **causal contribution ≠ blame ≠ person authority**
- **action authority ≠ thick person-predicate authority**
- **provenance persists through transformation**
- **policy-conditioned evidence stays policy-conditioned**
- **recovered visibility ≠ recovered baseline**
- **ordinary regime ≠ zero-support regime**
- **support dependence ≠ person failure**
- **withdrawal is an intervention**
- **distributed production requires reassemblable accountability**
- **uncertainty may legitimately terminate in nonidentification**

## Repository map

- `docs/origin.md` — the social-physics origin and what NOMOS deliberately destroyed.
- `docs/constitution.md` — current research constitution and anti-overreach rules.
- `docs/genealogy.md` — compressed active genealogy from 0.1 to the current primitive layer.
- `spec/case-format.md` — human-readable NOMOS Case Graph specification.
- `src/nomos/` — executable validator and audit kernel.
- `examples/` — synthetic cases used to test NOMOS invariants.
- `tests/` — regression tests for constitutional rules.

## Design rule

The repository encodes **constraints on warranted inference**, not a universal scalar of truth, blame, risk, morality, or personhood.

Whenever a result would require collapsing heterogeneous normative questions into one number, the kernel should prefer a typed vector, explicit bridge, or HOLD.

## Current research head

Current conceptual head at repository initialization: **NOMOS-0.834 — Support Attribution, Shared Causation, Accommodation Counterfactuals, Credit–Responsibility Allocation**.

The Notion research archive remains the full laboratory notebook. GitHub contains the active research kernel, formalized invariants, reproducible examples, and only the history needed to understand why those invariants exist.
