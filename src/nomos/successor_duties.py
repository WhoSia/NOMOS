"""NOMOS 0.858: typed successor-duty continuity audit.

The checker tests supplied evidence declarations only; record custody, review
authority and restitution liability must be warranted independently.
"""
from __future__ import annotations
from typing import Any
DUTIES={"record_custody","provenance_preservation","review_access","notice","corrective_action","restitution","compensation","recipient_recall"}
def analyze_successor_duties(packet:dict[str,Any])->dict[str,Any]:
    findings=[];results=[]
    def flag(code,msg,pid,*refs):findings.append({"code":code,"severity":"ERROR","message":msg,"refs":[pid,*refs]})
    for ix,plan in enumerate(packet.get("plans",[]),1):
        pid=str(plan.get("id") or f"transfer-{ix}");start=len(findings)
        duties=plan.get("duties",[])
        if not duties:flag("SD001","No transferred or explicitly unassigned duties.",pid)
        if plan.get("defunct_institution") is not True:flag("SD002","No documented predecessor transition.",pid)
        if plan.get("transition_evidence") is not True:flag("SD003","Missing documented succession event.",pid)
        if plan.get("separate_authorities") is not True:flag("SD004","Custody, review and liability authority conflated.",pid)
        if plan.get("continuity_ledger") is not True:flag("SD005","No historical duty continuity ledger.",pid)
        if plan.get("affected_party_notice") is not True:flag("SD006","No notice of new contact and challenge route.",pid)
        if plan.get("contestable_allocation") is not True:flag("SD007","Assignment not challengeable.",pid)
        if plan.get("independent_oversight") is not True:flag("SD008","No independent oversight of institutional self-release.",pid)
        if plan.get("record_handoff_receipt") is not True:flag("SD009","Records transferred without accountable custody receipt.",pid)
        if plan.get("closure_by_abolition") is True:flag("SD010","Abolition automatically discharges residual duty.",pid)
        if plan.get("custody_implies_liability") is True:flag("SD011","Record custody treated as liability proof.",pid)
        if plan.get("software_vendor_is_liable_by_default") is True:flag("SD012","Software supply treated as automatic restitution liability.",pid)
        if plan.get("new_legal_name_erases_history") is True:flag("SD013","Rename mistaken for responsibility extinction.",pid)
        if plan.get("old_person_judgment_reauthorized") is True:flag("SD014","Historical decision reauthorized by succession.",pid)
        if plan.get("institution_controls_all_evidence") and plan.get("burden_on_claimant"):
            flag("SD015","Institution-held provenance burden shifted to claimant.",pid)
        if plan.get("unassigned_duties_hidden") is True:flag("SD016","Orphan duties hidden.",pid)
        if plan.get("automatic_universal_successor_liability") is True:flag("SD017","All duties imposed without duty-specific legal warrant.",pid)
        if plan.get("privacy_scope_reviewed") is not True:flag("SD018","Transition lacks privacy minimization.",pid)
        if plan.get("interim_consequence_continuity") is not True:flag("SD019","Interim consequence protection lost during institutional transfer.",pid)
        if plan.get("recipient_graph_continuity") is not True:flag("SD020","Dependent copies and recipients untracked.",pid)
        ids=set()
        for i,d in enumerate(duties):
            key=str(d.get("id") or f"duty-{i}")
            if key in ids:flag("SD021","Duplicate duty identity.",pid,key)
            ids.add(key)
            if d.get("type") not in DUTIES:flag("SD022","Unknown duty type.",pid,key)
            state=d.get("status")
            if state not in {"assigned","orphan_hold","legally_discharged"}:flag("SD023","Invalid successor duty state.",pid,key)
            if state=="assigned" and not (d.get("responsible_institution") and d.get("authority_evidence")):
                flag("SD024","Assignment lacks successor and legal authority evidence.",pid,key)
            if state=="orphan_hold" and not(d.get("escalation_route") and d.get("records_accessible")):
                flag("SD025","Orphan duty lacks a viable preserved appeal/escalation route.",pid,key)
            if state=="legally_discharged" and not(d.get("discharge_warrant") and d.get("independent_discharge_review")):
                flag("SD026","Discharge is not independently warranted.",pid,key)
            if d.get("record_holder") and state=="assigned" and d.get("responsible_institution")!=d.get("record_holder") and d.get("custody_only_treated_as_debt_holder"):
                flag("SD027","Custody-only organization is treated as duty bearer.",pid,key)
            if d.get("ongoing_harm") and d.get("interim_review") is not True:flag("SD028","Ongoing consequences lack interim review.",pid,key)
            if d.get("recipient_branch_unresolved") and d.get("recipient_route") is not True:
                flag("SD029","Recipient propagation lost at succession.",pid,key)
            if d.get("historical_debt") and state=="legally_discharged" and d.get("restoration_complete") is not True and d.get("lawful_partial_discharge") is not True:
                flag("SD030","Residual debt erased without bounded legal disposition.",pid,key)
        if plan.get("full_repair_complete") and any(d.get("status")!="legally_discharged" for d in duties):
            flag("SD031","Full completion declared with non-discharged duties.",pid)
        results.append({"id":pid,"status":"FAIL" if len(findings)>start else "PASS","blocking_codes":[x["code"] for x in findings[start:]]})
    if not packet.get("plans"):flag("SD032","No institutional transition plan.","packet")
    return {"status":"FAIL" if findings else "PASS","rule":"DUTY_SPECIFIC_SUCCESSION_NO_AUTOMATIC_LIABILITY","plans":results,"findings":findings,"summary":{"plans":len(results),"errors":len(findings)}}
