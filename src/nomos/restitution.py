"""NOMOS-0.857: audit restitution and residual repair-debt closure.

This structural gate audits declared receipts; it cannot decide legal entitlement.
"""
from __future__ import annotations
from typing import Any

def analyze_restitution(packet:dict[str,Any])->dict[str,Any]:
    findings=[];results=[]
    def fail(code,msg,pid,*refs):
        findings.append({"code":code,"severity":"ERROR","message":msg,"refs":[pid,*refs]})
    cases={str(c["id"]):c for c in packet.get("cases",[]) if c.get("id")}
    for ix,plan in enumerate(packet.get("plans",[]),1):
        pid=str(plan.get("id") or f"plan-{ix}");start=len(findings)
        ids=[str(x) for x in plan.get("cases",[])]
        if not ids:fail("RD001","Empty restoration scope.",pid)
        if len(ids)!=len(set(ids)):fail("RD002","Duplicate case scope.",pid)
        if set(ids)-set(cases):fail("RD003","Unknown restoration cases.",pid,*sorted(set(ids)-set(cases)))
        if plan.get("independent_closure_authority") is not True:fail("RD004","Closure lacks separate authority.",pid)
        if plan.get("written_closure_reasons") is not True:fail("RD005","Missing scoped closure reasons.",pid)
        if plan.get("contestable_closure") is not True:fail("RD006","Closure cannot be challenged.",pid)
        if plan.get("individual_notice") is not True:fail("RD007","Affected persons lack closure notice.",pid)
        if plan.get("downstream_recipient_audit") is not True:fail("RD008","Downstream judgment copies were not audited.",pid)
        if plan.get("treats_review_as_restitution") is True:fail("RD009","Review completion substituted for restitution.",pid)
        if plan.get("treats_money_as_total_repair") is True:fail("RD010","Payment substituted for complete rectification.",pid)
        if plan.get("treats_apology_as_total_repair") is True:fail("RD011","Apology substituted for all repair dimensions.",pid)
        if plan.get("treats_expiry_as_debt_release") is True:fail("RD012","Interim expiration silently releases institutional debt.",pid)
        if plan.get("automatically_revives_old_consequence") is True:fail("RD013","Defeated adverse authority revived at closure.",pid)
        if plan.get("burden_shift_to_affected_person") is True:fail("RD014","Institution-controlled restoration proof shifted to person.",pid)
        if plan.get("third_party_interests_assessed") is not True:fail("RD015","Third-party legitimate reliance ignored.",pid)
        if plan.get("reliance_proves_old_judgment") is True:fail("RD016","Reliance laundered into proof of old judgment.",pid)
        if plan.get("restoration_scope_defined") is not True:fail("RD017","Restoration task family undefined.",pid)
        if plan.get("uncertainty_receipt") is not True:fail("RD018","Repair uncertainty suppressed.",pid)
        if plan.get("independent_debt_ledger") is not True:fail("RD019","Residual tasks not tracked.",pid)
        if plan.get("completion_claim")=="complete" and plan.get("remainder_exists") is True:
            fail("RD020","Complete repair claimed with known residual duties.",pid)
        if plan.get("lost_opportunities_are_assumed_reversible") is True:
            fail("RD021","Irrecoverable opportunity loss declared reversible by assumption.",pid)
        if plan.get("retrospective_correction_changes_past_exposure") is True:
            fail("RD022","Retroactive record change mistaken for changing historic exposure.",pid)
        for cid in ids:
            c=cases.get(cid)
            if c is None:continue
            if c.get("historical_recall_valid") is not True:fail("RD023","Case lacks valid prior recall.",pid,cid)
            if c.get("review_complete") is not True and c.get("case_claim")=="closed":
                fail("RD024","Individual case closed without review.",pid,cid)
            if c.get("unrecovered_opportunity") is True and c.get("opportunity_receipt") is not True:
                fail("RD025","Unrecoverable opportunity omitted.",pid,cid)
            if c.get("remaining_harm") is True and c.get("harm_receipt") is not True:
                fail("RD026","Residual harm hidden.",pid,cid)
            if c.get("third_party_reliance") is True and c.get("reliance_disposition") is not True:
                fail("RD027","Reliance conflict unresolved.",pid,cid)
            if c.get("compensation_paid") is True and c.get("compensation_sufficiency_assessed") is not True:
                fail("RD028","Payment treated as sufficient without assessment.",pid,cid)
            if c.get("downstream_copy_live") is True and c.get("downstream_correction") is not True:
                fail("RD029","Live copy continues defeated person authority.",pid,cid)
            if c.get("interim_expired") is True and c.get("post_expiry_effect_reviewed") is not True:
                fail("RD030","Interim expiry consequences unreviewed.",pid,cid)
            if c.get("debt_claim")=="discharged" and c.get("unresolved_tasks"):
                fail("RD031","Debt discharged with unresolved typed tasks.",pid,cid)
            if c.get("case_claim")=="closed" and c.get("remaining_harm") is True and c.get("residual_status") not in {"acknowledged","compensated_as_far_as_possible","independent_disposition"}:
                fail("RD032","Case closure erases residual harm.",pid,cid)
        codes=[f["code"] for f in findings[start:]]
        results.append({"id":pid,"status":"FAIL" if codes else "PASS","blocking_codes":codes})
    if not packet.get("plans"):fail("RD033","No restoration plan submitted for audit.","packet")
    return {"status":"FAIL" if findings else "PASS","rule":"REVIEW_COMPLETION_NOT_REPAIR_DISCHARGE","plans":results,"findings":findings,"summary":{"cases":len(cases),"plans":len(results),"errors":len(findings)}}
