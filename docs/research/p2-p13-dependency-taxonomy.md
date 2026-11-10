# NOMOS-0.885 P2-P13 — Privacy Dependencies, Relational Data Governance, and a No-Novelty Challenge

Review date: 2026-11-11. Primary PDF originals reviewed as full extracted text and focus passages, not independent page-image, data or causal validation.

## Original sources and exact genres
- Solon Barocas & Karen Levy (2020), *Privacy Dependencies*, Washington Law Review 95(2):555–616, **journal article**. Original PDF `1iZXULrIbMucPspDg1lx5C_qkwh-Bb6Ku`, canonically moved to `10_PAPERS`. https://digitalcommons.law.uw.edu/wlr/vol95/iss2/4/
- Salomé Viljoen (2021), *A Relational Theory of Data Governance*, Yale Law Journal 131:573–654, **law-review feature**, NOT thesis or monograph. Original PDF `1NxsGWDrKF3L13gdmrT1ZVTLJ8XXuKTLV`, moved to `10_PAPERS`. https://yalelawjournal.org/article/a-relational-theory-of-data-governance

## Barocas/Levy: mechanism-level reading
§II: Alice discloses/gets observed; observer learns about Bob even if Bob never furnished data. Three dependency *mechanisms*: **tie** (relationships: passthrough, bycatch, identification and justified observation); **similarity** (inference by resemblance and membership in socially salient or nonsalient groups); **difference** (process of elimination, anomaly detection, adverse inference). §III applies all three to genetic scenarios and distinguishes legal responses under different mechanisms (not a universal prohibition). §IV warns that individual notice/choice cannot address every interpersonal dependence; solidarity solutions vary by mechanism.

## Viljoen: normative reading
§II.B–D: vertical subject–collector relation and horizontal population relations among subjects/affected others. §III critiques individualistic/propertarian/dignitarian models where collective data effects and structural inequality evade individual-choice remedies. §IV.A–D asks how institutions can be democratically legitimate in population-level data production; illustrative Watercorp vs Waterorg emphasizes meaningful joint decision authority rather than mere per-person exit/payment. Existing positive proposals involve **democratic data governance** and socially beneficial data, not blanket bans on collective data analysis.

## Scientific novelty correction
Barocas/Levy already separate different third-party privacy inference mechanisms. Viljoen already theorizes institutional authority/legitimacy and population-level governance, *not just information flows*. Combined with Nissenbaum 2004, Barth et al. 2006, Jacobs/Wallach 2021 and Solow-Niederman 2022, the broad NOMOS 'new theory of institutions classifying people using others' data' is not novel as stated. P2 must either expose a narrow legally grounded event/claim that strong predecessors and experts miss or merge as a tool/application.

## Bounded synthetic comparator
Construct fictional cases showing the **same downstream claim and absence of Bob's direct data contribution** arising via (i) relationship, (ii) shared attributes, or (iii) elimination/difference. Any evaluator seeing only downstream claim and contribution status must abstain on identifying mechanism. Add a separate authority flag to represent *claimed* institutional permission, but do not infer it from mechanism or data permission. This is elementary observational underdetermination, not a new privacy theorem.

## Prospective P2 gate
Require independent legal rule + source evidence + actor/recipient case identity and an independently reviewable expert comparator. No such real-world incremental result is presented in this unit. No human subject records, no assertion of privacy violation or actual outcome. Code and CI configuration are not successful remote CI receipts.


### P2-P13.6 — Tie mechanism has multiple subroutes
Barocas/Levy §II.A distinguishes passthrough (revealing a relationship), bycatch (unintended third-party data), identification and tie-justified observation. These are *distinct* evidence-generating processes with different risks and potentially different legal responses. A one-bit 'noncontributor' field cannot tell them apart.


### P2-P13.7 — Similarity does not require an interpersonal connection
Barocas/Levy §II.B explains statistical similarity-based dependencies may be socially salient or non-salient. Even with no known social relationship or user-provided records, observer inference may concern Bob. Legal and epistemic grounds therefore cannot be decided from social ties alone.


### P2-P13.8 — Difference and comparison classes
Barocas/Levy §II.C catalogs process-of-elimination, anomaly-detection and adverse-inference dependencies. These rely on a relevant comparison set and response/selection rule. An institution's assertion about Bob can vary when the reference set changes even if Bob's direct source data do not.


### P2-P13.9 — Viljoen institutional legitimacy is a direct defeater
Viljoen §IV's Watercorp/Waterorg example distinguishes an individual's exit/payment rights from meaningful participation in governing collective data production. This is already a theory of legitimate institutional power, not merely a data-flow privacy principle. NOMOS must NOT present collective governance legitimacy as its own discovery.


### P2-P13.10 — Negative conclusion and next phase
The four scenarios are synthetic and fixed to equal observables, so the inability to identify the dependency mechanism is by construction. This is not a formal impossibility result for enriched existing models. Next research should compare doctrinally grounded institutional remedies for different dependency mechanisms using independent real records, not merely add labels.
