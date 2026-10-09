# NOMOS 0.872 — Cross-Jurisdiction Evidence & Case Ontology v0.1

**Scope:** Project-native primary legal/inquiry evidence objects, not Research OS journal-paper library. Continuous ontology work; **no 0.872 closure gate**.

## Minimum schema
```yaml
record_id: NOMOS-EV-0001
jurisdiction: {country: AUS, legal_order: federal}
forum: Royal Commission into the Robodebt Scheme
instrument_type: inquiry_report
source_type: primary_government_inquiry
title: Report of the Royal Commission into the Robodebt Scheme
identifier: official_report_2023
event_date: "2023-07-07"
version_note: "Updated edition 2023-07-11; verify corrigendum against passages"
source_url: https://robodebt.royalcommission.gov.au/publications/report
original_language: en
procedural_posture: commission_of_inquiry
issue: "evidence asymmetry and social-support debt automation"
claimant_role: affected_service_recipient
institution_role: social_services_agency
affected_third_parties: unknown
evidence_individual_can_access: unknown
evidence_institution_controls: unknown
prima_facie_threshold: not_stated_in_this_record
legal_proof_burden: not_stated_in_this_record
production_duty: not_stated_in_this_record
explanation_duty: not_stated_in_this_record
finding_or_holding_type: inquiry_findings_not_judicial_holding
operative_finding: needs_paragraph_level_read
outcome: inquiry_report_and_recommendations
remedy_scope: not_established_from_cover
downstream_effect_observed: unknown
source_paragraphs: []
rival_interpretation: pending
uncertainty: METADATA_ONLY
transfer_warning: "Australian inquiry report; not binding foreign law"
```

## Typing rules
- `case_judgment`, `inquiry_report`, `expert_report`, `agency_guidance`, `dataset` cannot be silently cast to each other.
- `allegation`, `court_holding`, `commission_finding`, `expert_opinion`, `recommendation` are distinct evidence-status values.
- `unknown` ≠ `false`; metadata-only records contain no inferred merits.
- Every legal principle requires country, legal order, competent forum, date, source pinpoint and scope of applicability.
- A source URL never certifies downstream remedy or actual claimant-level relief.

## Anchors for separate case objects
- AUS: Royal Commission into Robodebt Scheme (2023) official report and corrigendum, https://robodebt.royalcommission.gov.au/publications/report.
- USA: `Goldberg v. Kelly`, 397 U.S. 254 (1970), https://www.govinfo.gov/app/details/USREPORTS-397/USREPORTS-397-254 .
- USA: `Mathews v. Eldridge`, 424 U.S. 319 (1976), https://www.govinfo.gov/app/details/USREPORTS-424/USREPORTS-424-319 .
- Council of Europe / ECtHR: `Salman v. Turkey`, App. 21986/93 (2000), court's §100 concerns custodial circumstances and factual presumptions where relevant evidence is in authorities' control. Not a universal rule for administrative social programs.

## 0.872 question
When a claimant can furnish only person-specific observations and the institution alone can inspect the cohort-generating rule, identify separate (a) individual prima facie threshold, (b) institution's production or investigation obligation, (c) case's ultimate merits, (d) remedial power. Neither data possession nor a single event is a general burden-shifting theorem.

## Cross-lab governance
Version numbers mark *movement in the primitive research question*, not artificial phase closure; engineering release gates retain their independent strict verification. Shared Notion doctrine: https://app.notion.com/p/3f4ef561cf92818da4d4d92bc949ca15 .
