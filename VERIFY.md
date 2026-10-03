# VERIFY — NOMOS

This page is a stranger-facing verification surface. It is not a proof of the whole research program.

## Fast check

```bash
PYTHONPATH=src python -m unittest discover -s tests -v
```

Then inspect one representative surface:

```bash
PYTHONPATH=src python -m nomos examples/divergence_replication_systematic.json --audit-divergence-replication
```

Expected structural state:

```text
TRANSPORTABLE_SYSTEMATIC_CANDIDATE
```

## What this fast path verifies

- the Python package imports;
- regression fixtures execute;
- declared structural invariants behave as encoded;
- divergence replication distinguishes row repetition, independent cluster replication, reviewer-conditional surfaces, case-mix-conditional surfaces, transport holds and calibrated systematic candidates.

## What it does not verify

- that a real-world person judgment is substantively correct;
- that a legal or moral consequence is justified;
- that a fixture is representative of any institution;
- that the encoded review contract perfectly captures a real review;
- that literature-backed scientific claims are true merely because tests pass;
- that GitHub CI succeeded unless an actual run/status is separately available.

## Verification ladder

1. **unit/regression** — implementation behavior;
2. **fixture semantic replay** — encoded research-state behavior;
3. **statement-faithfulness review** — code/spec matches the intended NOMOS claim;
4. **source/provenance review** — literature and internal genealogy support the stated bounded imports;
5. **world-contact** — separate, claim-specific empirical or institutional evidence where required.

No lower layer inherits a higher layer's authority.

## Current executable surfaces

- Case Graph
- Review Topology
- Router Authority
- Routing Learning
- Feedback Support Restoration
- Review Divergence
- Divergence Replication

## Current version

**v0.8.0**

Current research head after closure: **NOMOS-0.845**.

See:
- `README.md`
- `research/current.md`
- `docs/constitution.md`
- `docs/genealogy.md`
- `spec/`

## Trust boundary

NOMOS code audits structures and provenance. It does not output person merit, moral worth, legal guilt, blame, risk, or an institutional winner.


## Automation boundary

The repository may use CI as a test runner, but CI status is not scientific proof and automation must not mint research authority or alter contributor identity. The 0.845 release did **not** modify the GitHub Actions workflow.
