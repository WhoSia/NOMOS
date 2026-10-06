# Historical-Branch Reopening and Reauthorization Firewalls

NOMOS-0.853 governs movement from retained history back into active review.

It does not treat historical accessibility, reopen admission, present judgment authority and present consequence authority as interchangeable.

## Core authority separation

- historical access authority;
- reopening admission authority;
- current person-judgment authority;
- current consequence authority.

**AUTHORITY TO OPEN HISTORY IS NOT AUTHORITY TO GOVERN FROM HISTORY.**

## Reopening state machine

- dormant_historical
- petition_admitted
- bounded_rehydration
- active_review
- current_authority_reconstitution
- reclosed

Opening a historical branch never directly restores its old person predicate, score, rank or consequence.

**REOPENING HISTORY DOES NOT REAUTHORIZE THE HISTORICAL JUDGMENT.**

## Trigger family

Recognized trigger classes:

- integrity_provenance_defect
- material_new_evidence
- new_descendant_or_consequence
- activated_compaction_debt
- stale_resurrection_signal
- validated_rule_model_query_defect
- institutional_self_correction

Newness is necessary in some cases but never sufficient by itself. The trigger must be materially linked to a claim, dependency, consequence or declared reopen task.

## Standing

Recognized standing types:

- subject
- authorized_representative
- affected_third_party
- repair_duty_institution
- independent_oversight
- qualified_successor

Standing authorizes a request for reopening. It does not decide the reopened merits.

**STANDING TO ASK FOR REOPENING IS NOT STANDING TO WIN THE REOPENED QUESTION.**

## Admission gate

A valid reopen request requires:

1. branch identity;
2. accountable trigger provenance;
3. material linkage;
4. material delta for repeat requests unless the prior denial is itself challenged;
5. standing fit;
6. trigger-relative scope;
7. a review-capable path;
8. a firewall against automatic historical reauthorization;
9. visibility of the prior closure receipt and compaction certificate.

## Threshold asymmetry

Evidence that is sufficient to justify looking again need not be sufficient to justify a renewed adverse decision.

**THE THRESHOLD FOR REVIEW MAY BE LOWER THAN THE THRESHOLD FOR REAUTHORIZATION.**

Adverse current authority requires fresh current warrant and fresh current adoption.

## Anti-dormancy

Compaction must not become practical finality merely because the challenger lacks internal provenance controlled by the institution.

An activated compaction debt requires an escalation path to richer retained provenance or an explicit HOLD.

## Anti-reactivation

Historical retention must not become a recurring surveillance or person-model persistence mechanism.

The audit rejects:

- archive-availability-only reopening;
- repeat-without-delta;
- branch-count-as-current-evidence;
- periodic reactivation defaults;
- global cascade reopening without a shared defect;
- institution-only or subject-only merits sovereignty.

## Locality

A trigger normally opens only the implicated branch dimensions and dependencies. Global reopening requires a separately established shared generator, query, provenance or consequence defect.

## Privacy-bounded rehydration

When history is privacy-sensitive, rehydration exposes only fields needed for the admitted reopen task.

Historical accessibility is not a license for routine present-day visibility.

## Invariant codes

- RO001 unknown branch
- RO002 target not historically retired
- RO003 unknown/missing trigger
- RO004 trigger provenance gap
- RO005 newness without material linkage
- RO006 unknown standing type
- RO007 standing-fit gap
- RO008 archive availability laundering
- RO009 repeat without material delta
- RO010 global cascade reopening
- RO011 unknown reopen state
- RO012 reopening without review-capable path
- RO013 prior closure receipt hidden
- RO014 reopen-to-reauthorization collapse
- RO015 adverse authority without fresh current warrant/adoption
- RO016 historical branch count used as fresh evidence
- RO017 privacy-scope overrehydration
- RO018 compaction used as practical finality
- RO019 periodic reactivation default
- RO020 denial without reviewable reasons
- RO021 institutional self-correction converted to unilateral adverse authority
- RO022 subject reopen standing converted to unilateral merits control
- RO023 activated compaction debt without provenance escalation/HOLD
- RO024 completion claimed with invalid reopening requests

## CLI

```bash
PYTHONPATH=src python -m nomos examples/historical_reopening_safe.json --audit-historical-reopening
```

The unsafe fixture must fail.
