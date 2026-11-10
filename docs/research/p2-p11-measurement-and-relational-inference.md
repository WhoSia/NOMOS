# NOMOS-0.885 P2-P11 — Measurement Validity and the Relational Inference Economy
Date 2026-11-11. Status: source-grounded competitor audit, not new theorem.

## New original documents and custody
- Abigail Z. Jacobs & Hanna Wallach (2021), *Measurement and Fairness*, FAccT 2021, pp.375–385, DOI 10.1145/3442188.3445901. ACM conference paper; original Drive ID `1COybDrFJUN_7rep8d9jREK-qaQQCancV`, canonical `10_PAPERS`.
- Alicia Solow-Niederman (2022), *Information Privacy and the Inference Economy*, Northwestern University Law Review 117(2), pp.357–424. Journal law-review article; original Drive ID `1DvFVJWrewCTkuSOU1g2tQ5LN9gmOSCy0`, canonical `10_PAPERS`, https://scholarlycommons.law.northwestern.edu/nulr/vol117/iss2/1/.

## Jacobs & Wallach reading
§2 operationalization cases (height, socioeconomic status, teacher effectiveness, recidivism, patient benefit), §3 reliability versus construct validity, §3.1 temporal test–retest, §3.2 face/content, convergent, discriminant, predictive, hypothesis and consequential dimensions, §4 fairness as essentially contested construct. They explicitly state *construct validity is not a yes/no box*, but requires contextual critical reasoning and evidence across dimensions. Predictive validity is distinct from mere out-of-sample prediction. NOMOS P2-P8's K∈{yes,no,unknown} is consequently too coarse **if construed as an actual validity metric**; it remains useful only as documentary audit triage (documented, contested, or not established), NOT a scientific binary verdict.

## Solow-Niederman reading
Parts I–III critique individual-control/identifiability-centric privacy regulation where models trained on other people's data can infer traits about a nonparticipant. Part IV.A 'Recognizing Inferential Power' and IV.B 'Triangulating Information Privacy in the Inference Economy' distinguish data subjects/affected third parties, data collectors and information processors, reveal institutional dependency and power distribution, and propose governance focused on collector–processor relationships and their incentives. No NOMOS novelty can be claimed for the **triangular collector/processor/affected subject relationship** or the observation that source data subjects may differ from people later classified.

## Bounded claims and prior-art defeat
Hypothesis "private data → ML model → inferred personal trait without consent of person being scored" is already known and discussed by the 2022 article. 'K is a simple Boolean correctness predicate' contradicts Jacobs/Wallach's multi-dimensional account. Distinguish *construct evidence quality*, *institutional legal permission*, *record observation*, *actual outcome* and *identity of training-set contributors*.

## Reproducible diagnostic
Create explicitly fictional three-role inference scenarios (training data provider, collector, processor, target person), with evidence fields for construct definition, tests and person-target scope. Label whether model has construct measurement documentation and whether affected subject is absent from source data, without deciding actual fairness or legality. Include a strong baseline that can make the same observations; null added-value claim.

## Stop condition
If the extended contextual-integrity and standard law audit can represent the full collector/processor/affected-person triangle and multi-dimensional measurement evidence, withdraw a claimed NOMOS theoretical discovery. This phase demonstrates the need to correct overbroad claims, not a real-world legal violation.
