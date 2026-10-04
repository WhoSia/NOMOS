# Emergency Record Portability

NOMOS-0.849 separates four questions that are often collapsed:

**history ≠ evidence ≠ ordinary meaning ≠ consequence authority**

The executable surface audits whether emergency-produced history is being promoted into ordinary person-judgment without the bridges needed for that transport.

It does **not** decide whether a person is dangerous, reliable, blameworthy, cooperative, or otherwise deserving of a substantive person predicate.

## Input

A portability packet contains records and proposed uses.

```json
{
  "records": [
    {
      "id": "r0",
      "emergency_produced": true,
      "dependencies": [],
      "provenance_visible": true,
      "regime_sensitivity_assessed": true,
      "ordinary_baseline": "matched_post_restoration_cohort",
      "semantic_revalidated": true,
      "selection_feedback": false,
      "dependency_accounted": true,
      "contest_route": "ordinary_review",
      "allowed_purposes": ["eligibility_review"],
      "emergency_ancestor_refs": []
    }
  ],
  "proposed_uses": [
    {
      "id": "u1",
      "record": "r0",
      "level": "P3",
      "purpose": "eligibility_review",
      "consequence_authority": null,
      "fresh_person_model_authority": null
    }
  ]
}
```

A top-level `record_portability` wrapper is accepted by the CLI.

## Portability lattice

- `P0` — archive only
- `P1` — reconstruction or review
- `P2` — contextual evidentiary use
- `P3` — bounded ordinary inference
- `P4` — ordinary adverse consequence
- `P5` — durable person-model incorporation

Higher levels require stronger bridges. Retention at P0/P1 does not imply promotion to P2–P5.

## Descendant provenance

Emergency provenance must survive derived transformations.

If:

**emergency record → score → summary → ranking**

then the descendants must preserve explicit `emergency_ancestor_refs` for emergency-produced ancestors. A new identifier does not create an independent ordinary record.

## Invariant codes

- `RP001` — proposed use references unknown record
- `RP002` — emergency-lineage reuse lacks visible provenance
- `RP003` — contextual or stronger use lacks regime-sensitivity assessment
- `RP004` — P3+ use lacks ordinary/successor baseline
- `RP005` — P3+ use lacks semantic revalidation
- `RP006` — feedback-dependent observation lacks dependency accounting
- `RP007` — P2+ use lacks contest/review route
- `RP008` — use exceeds purpose-limited portability scope
- `RP009` — P4+ adverse consequence lacks fresh consequence authority
- `RP010` — P5 durable person-model incorporation lacks fresh person-predicate authority
- `RP011` — descendant loses emergency ancestry
- `RP012` — expired emergency label is promoted into ordinary inference

## CLI

```bash
PYTHONPATH=src python -m nomos examples/record_portability_safe.json --audit-record-portability
PYTHONPATH=src python -m nomos examples/record_portability_unsafe.json --audit-record-portability
```

The safe fixture should return `PASS`. The unsafe fixture should return `FAIL` with typed blocking codes.
