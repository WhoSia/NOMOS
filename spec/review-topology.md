# NOMOS Review Topology 0.1

This format describes a **review architecture**, not a person.

Its purpose is to study whether a contested institutional judgment has enough structurally distinct routes to correction without assuming that more reviewers are always better.

## Failure dimensions

`required_breaks` is a claim-relative subset of:

- `Q` — query / selection dependence
- `E` — evidence-access dependence
- `M` — model / relevance dependence
- `I` — incentive dependence
- `A` — authority / remedy dependence
- `C` — override-cost dependence

No architecture is required to break all six dimensions universally.

## Safeguards

Each safeguard declares the dependency dimensions it materially breaks.

```json
{
  "id": "review_unit",
  "breaks": ["Q", "E"],
  "controller": "review_team_b",
  "common_dependencies": ["shared_source_archive"],
  "can_change_authority": false
}
```

The analyzer never interprets these fields as person scores.

## Routing and escalation

```json
{
  "entrypoints": ["review_unit"],
  "routing_authority": "appeal_router",
  "escalations": [
    {"source": "review_unit", "target": "remedy_panel"}
  ],
  "reassembly_authority": "remedy_panel"
}
```

The graph audit asks:

- which authority-changing nodes are reachable;
- whether escalation cycles exist;
- whether multiple terminal authorities lack reassembly;
- which actor controls routing/reassembly.

## Inclusion-minimal break sets

A safeguard set is returned by `minimal_break_sets` when:

1. its declared breaks cover all `required_breaks`; and
2. no proper subset still covers them.

This is a structural explanation object, not an automatic institutional recommendation.

## Redundancy classes

The analyzer separates:

- `coverage_redundant_safeguards` — safeguards with no unique live failure-mode coverage in the full architecture;
- `equivalent_redundancy_groups` — safeguards with the same breaks, controller, declared common dependencies and authority-changing status;
- `resilience_redundancy_candidates` — coverage-redundant safeguards that nevertheless provide a structurally different controller/dependency route.

Thus **coverage redundancy is not the same as uselessness**.

## Common-mode exposure

`common_mode_exposures` records dimensions for which duplicated safeguards share one controller or one declared common dependency.

`capture_cut_candidates` identifies a controller or declared common dependency whose safeguards collectively span every live failure dimension.

These are structural warnings, not probabilities.

## Calibration states

- `UNDERSEPARATED` — a required break is missing or no authority-changing node is reachable.
- `COVERED_WITH_COMMON_MODE_EXPOSURE` — coverage exists but a declared common-mode/capture-cut warning remains.
- `FRAGMENTATION_RISK` — multiple authority-changing terminal branches exist without a reassembly authority.
- `CALIBRATED_CANDIDATE` — declared live failure modes are covered, an authority-changing path is reachable, and no declared common-mode/fragmentation warning is detected.

`CALIBRATED_CANDIDATE` is not a moral, legal, person, or institutional-quality verdict. It is a structural status for the submitted topology.

## Run

```bash
PYTHONPATH=src python -m nomos examples/review_topology_calibration.json --calibrate-review
```
