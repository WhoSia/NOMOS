"""0.856: structural audit of interim protection during capacity-limited historical recall.

No automatic person finding or legal relief is produced. Input declarations are
audited for missing institutional authority, protection and debt accounting.
"""
from __future__ import annotations
from typing import Any

PROTECTIONS = {"maintain_status_quo","suspend_adverse","temporary_access",
               "escrow","notice_only","no_change"}

def analyze_interim_protection(packet: dict[str, Any]) -> dict[str, Any]:
    cases={str(x["id"]):x for x in packet.get("cases",[]) if x.get("id")}
    findings=[]
    plans=[]
    def err(code: str, msg: str, pid: str, *refs: str) -> None:
        findings.append({"code":code,"severity":"ERROR","message":msg,"refs":[pid,*refs]})
    for i,proposal in enumerate(packet.get("plans",[]),1):
        pid=str(proposal.get("id") or f"plan-{i}")
        start=len(findings)
        selected=[str(x) for x in proposal.get("cases",[])]
        if not selected: err("IP001","Interim plan has no identified recalled cases.",pid)
        if len(set(selected))!=len(selected):err("IP002","Duplicate case assignment.",pid)
        if set(selected)-set(cases):err("IP003","Unknown case.",pid,*sorted(set(selected)-set(cases)))
        if proposal.get("institutional_authority") is not True:
            err("IP004","Interim measure lacks accountable authority.",pid)
        if proposal.get("written_reasons") is not True:
            err("IP005","Interim action lacks written reasons.",pid)
        if proposal.get("review_route") is not True:
            err("IP006","Interim action or refusal lacks contestable review.",pid)
        if proposal.get("notice_route") is not True:
            err("IP007","Affected people have no notice route.",pid)
        if proposal.get("review_date") is None:
            err("IP008","Interim action has no recheck point.",pid)
        if proposal.get("sunset_or_renewal") is not True:
            err("IP009","Interim measure can silently become permanent.",pid)
        if proposal.get("automatic_merits_reversal") is True:
            err("IP010","Interim protection is laundered into merits reversal.",pid)
        if proposal.get("automatic_adverse_reauthorization") is True:
            err("IP011","Interim process reauthorizes historical adverse judgment.",pid)
        if proposal.get("person_bears_provenance_burden") is True:
            err("IP012","Institution-controlled provenance debt is shifted to person.",pid)
        if proposal.get("queue_entry_counts_as_repair") is True:
            err("IP013","Queue enrollment is falsely treated as completed restoration.",pid)
        if proposal.get("delay_debt_ledger") is not True:
            err("IP014","Delay-generated repair debt lacks accounting.",pid)
        if proposal.get("counterparty_impact_assessed") is not True:
            err("IP015","Protection has not assessed third-party/counterparty impact.",pid)
        if proposal.get("nonretroactivity_or_reversibility_assessed") is not True:
            err("IP016","Reversibility and retroactivity were ignored.",pid)
        if proposal.get("uniform_protection_regardless_context") is True:
            err("IP017","Universal suspension is inferred solely from recall.",pid)
        if proposal.get("delay_justifies_existing_adversity") is True:
            err("IP018","Institutional delay launders the old adverse judgment.",pid)
        if proposal.get("secret_capacity_exception") is True:
            err("IP019","Capacity limits invoke an unreviewable emergency exception.",pid)
        if proposal.get("expiry_silently_restores_adversity") is True:
            err("IP020","Interim expiry silently revives invalidated authority.",pid)
        if proposal.get("protection_cohort_independent_of_recall") is True:
            err("IP021","Interim protection scope is disconnected from valid recall/exposure.",pid)
        if proposal.get("safe_nonidentification_allowed") is not True:
            err("IP022","Uncertainty is forced into an unsupported substantive judgment.",pid)
        if proposal.get("periodic_reassessment") is not True:
            err("IP023","Evolving waiting-time harms receive no reassessment.",pid)
        for cid in selected:
            case=cases.get(cid)
            if not case: continue
            if case.get("recall_eligible") is not True:
                err("IP024","Interim measure invokes an unvalidated recall case.",pid,cid)
            measure=case.get("interim_measure")
            if measure not in PROTECTIONS:
                err("IP025","Missing or unrecognized interim measure.",pid,cid)
            if case.get("ongoing_consequence") is True and case.get("ongoing_harm_assessed") is not True:
                err("IP026","Existing continuing adverse consequence was not assessed.",pid,cid)
            if case.get("irreversible_delay") is True and case.get("irreversibility_response") is not True:
                err("IP027","Irreversible delay lacks a protection or refusal reason.",pid,cid)
            if measure=="no_change" and case.get("reasoned_nonintervention") is not True:
                err("IP028","Doing nothing lacks an independent explanation.",pid,cid)
            if case.get("protection_granted") is True and case.get("effective_protection") is not True:
                err("IP029","Paper protection lacks operational effect.",pid,cid)
            if case.get("unreviewed_delay") is True and case.get("debt_recorded") is not True:
                err("IP030","Unreviewed delay debt is erased.",pid,cid)
            if case.get("outcome_inferred_from_measure") is True:
                err("IP031","Interim measure treated as evidence of person merits.",pid,cid)
        if proposal.get("completion_claim")=="complete" and (
            len(findings)>start or any(cases.get(cid,{}).get("unreviewed_delay") for cid in selected)):
            err("IP032","Restoration declared complete with unresolved delay or defects.",pid)
        failures=[f["code"] for f in findings[start:]]
        plans.append({"id":pid,"status":"FAIL" if failures else "PASS","blocking_codes":failures})
    return {"status":"FAIL" if findings else "PASS","rule":"INTERIM_PROTECTION_NOT_MERITS",
            "plans":plans,"findings":findings,
            "summary":{"case_count":len(cases),"plan_count":len(plans),"errors":len(findings)}}
