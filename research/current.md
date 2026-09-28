# Current Research Head — NOMOS-0.842

**Status: STRONG PASS / CLOSED**

## Primitive question

When may a review router legitimately revise its own case-assignment policy after observing reversals, remands or escalations generated under that very policy?

## Core theorem

Let:
- `N_t` = case volume,
- `p_t` = exposure to a route capable of generating a correction signal,
- `q_t` = correction rate conditional on that route.

Under a simple exposure model:

**E[K_t] ≈ N_t × p_t × q_t**

where `K_t` is the observed correction count.

Therefore a decline in `K_t` does not identify a decline in `q_t` when `p_t` also changes.

**FEWER OBSERVED CORRECTIONS ≠ FEWER CORRECTABLE ERRORS WHEN CORRECTION OPPORTUNITIES ALSO FELL.**

## New object

0.842 is not generic performativity or generic adaptive governance.

Its object is the **authority to revise routing policy from correction feedback whose observability is itself routing-dependent**.

Policy loop:

**routing policy → review exposure → observable correction signal → routing-policy revision → future review exposure**

## Required separations

- case volume ≠ correction opportunity;
- correction count ≠ correction prevalence;
- load adaptation ≠ epistemic improvement;
- on-policy feedback ≠ independent validation;
- rule revision ≠ authority expansion;
- exploration value ≠ permission to withhold an entitled review.

## Learning channels

Potentially useful, claim-bounded channels include:
- independent audit;
- non-consequential shadow review;
- natural overlap / reviewer heterogeneity;
- off-policy evaluation with support;
- frozen holdout;
- randomization only among already acceptable routes.

## Cross-Lab re-entry

Boundedly absorbed:
- RITHM observation-schedule bias → routing exposure provenance;
- RITHM outcome-blind adaptation → operational adaptation lane;
- MQR unvisited-world debt → unvisited-review-path debt;
- EPISTEME self-sealing diagnosability → novelty breaker;
- EvoNOMOS intervention–observation entanglement → routing/evidence entanglement guard.

## Executable materialization

Repository version: **v0.5.0**

Added:
- `src/nomos/routing_learning.py`;
- Routing Learning 0.1 spec;
- `--audit-routing-learning` CLI;
- self-sealing and audited learning fixtures;
- exposure-normalized correction-rate computation;
- raw-count self-confirmation detection;
- load/correction confounding detection;
- on-policy self-evaluation audit;
- revision provenance audit;
- independent learning-channel declaration;
- unsafe-exploration rejection;
- regression and CI integration.

Frozen semantic replay:
- self-sealing fixture: exposure **40→20→10**, corrections **20→10→5**, rate **0.5→0.5→0.5** → **REVISION_IDENTIFIABILITY_HOLD**;
- audited fixture: independent audit + shadow review, rate-aware revision → **REVISION_IDENTIFIABILITY_CANDIDATE**.

## Literature

Bounded external donors:
- Lakkaraju et al. (2017), DOI **10.1145/3097983.3098066**;
- Perdomo et al. (2020), **Performative Prediction**;
- Ensign et al. (2018), **Runaway Feedback Loops in Predictive Policing**;
- Dudík et al., **Doubly Robust Policy Evaluation and Optimization**;
- adaptive-experiment inference literature.

## Next title only

**NOMOS-0.843 — Feedback-Support Restoration, Counterfactual Review Coverage, Shadow Audit, Safe Exploration & the Primitive Question of How an Institution May Learn Whether Its Routing Policy Misses Correctable Cases When the Very Cases It Routes Away from Deep Review Do Not Reveal What Deep Review Would Have Found**

**TITLE-LOCKED / NOT OPENED.**
