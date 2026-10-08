"""NOMOS-0.859 distributed remedial coordination: negative structural audit.

This does not confer statutory jurisdiction or infer person merits.
"""
from __future__ import annotations

def analyze_joint_repair(packet):
    findings=[];out=[]
    def err(c,m,p,*refs):findings.append({"code":c,"severity":"ERROR","message":m,"refs":[p,*refs]})
    for ix,p in enumerate(packet.get("plans",[]),1):
        pid=str(p.get("id") or f"joint-{ix}");start=len(findings)
        agencies={a.get("id"):a for a in p.get("agencies",[]) if a.get("id")}
        tasks=p.get("tasks",[])
        if not agencies:err("JC001","No identified collaborating authorities.",pid)
        if not tasks:err("JC002","No actual repair tasks.",pid)
        if len(agencies)!=len(p.get("agencies",[])):err("JC003","Duplicate or unidentified agencies.",pid)
        if p.get("joint_protocol") is not True:err("JC004","No shared execution protocol.",pid)
        if p.get("accountable_coordinator") not in agencies:err("JC005","No identified coordinator.",pid)
        if p.get("coordinator_has_universal_merits_power") is True:err("JC006","Coordination laundered into merits authority.",pid)
        if p.get("interinstitutional_access_warrant") is not True:err("JC007","Cross-institution access lacks warrant.",pid)
        if p.get("privacy_minimization") is not True:err("JC008","No privacy bound on joint data.",pid)
        if p.get("cross_agency_provenance") is not True:err("JC009","Missing joined lineage reconstruction.",pid)
        if p.get("affected_person_notice") is not True:err("JC010","No consolidated notice route.",pid)
        if p.get("single_accessible_challenge") is not True:err("JC011","Appeal fragmented between bodies.",pid)
        if p.get("independent_joint_review") is not True:err("JC012","No independent joint audit.",pid)
        if p.get("coordination_capacity") is not True:err("JC013","No capacity committed to joint execution.",pid)
        if p.get("interim_continuity") is not True:err("JC014","Interim protection lost in handoff.",pid)
        if p.get("shared_debt_ledger") is not True:err("JC015","Residual duties cannot be tracked end-to-end.",pid)
        if p.get("all_locally_complete_implies_joint_complete") is True:err("JC016","Local compliance falsely certifies joint repair.",pid)
        if p.get("automatic_joint_liability") is True:err("JC017","Coordination presumed to create universal liability.",pid)
        if p.get("veto_without_review") is True:err("JC018","Unreviewable interinstitutional veto.",pid)
        if p.get("silent_orphan_transfer") is True:err("JC019","Orphaned task silently disappeared.",pid)
        if p.get("joint_completion_claim")=="complete" and p.get("residual_dependencies"):
            err("JC020","Joint completion asserted despite unresolved dependencies.",pid)
        seen=set()
        for i,t in enumerate(tasks):
            tid=str(t.get("id") or f"task-{i}")
            if tid in seen:err("JC021","Duplicate task.",pid,tid)
            seen.add(tid)
            required=set(t.get("required_capabilities",[]))
            if not required:err("JC022","Task dependencies undefined.",pid,tid)
            responsible=t.get("responsible_agency")
            if responsible not in agencies:err("JC023","Task has no responsible agency.",pid,tid)
            contributors=set(t.get("contributors",[]))
            if contributors-set(agencies):err("JC024","Unknown contributing agency.",pid,tid)
            available=set()
            for aid in contributors|({responsible} if responsible in agencies else set()):
                available.update(agencies[aid].get("capabilities",[]))
            if required-available:err("JC025","Joint task lacks required capability.",pid,tid)
            if t.get("handoff_warrant") is not True:err("JC026","Unwarranted cross-institution handoff.",pid,tid)
            if t.get("completion_claim")=="complete" and t.get("independent_end_to_end_evidence") is not True:
                err("JC027","Task completion lacks end-to-end evidence.",pid,tid)
            if t.get("person_label_reused") is True:err("JC028","Defeated person inference reused.",pid,tid)
            if t.get("unresolved_recipient") is True and not t.get("recipient_escalation"):
                err("JC029","Recipient obligation unassigned.",pid,tid)
            if t.get("budget_holder") and t.get("budget_holder") not in agencies:
                err("JC030","Unknown budget holder.",pid,tid)
        out.append({"id":pid,"status":"FAIL" if len(findings)>start else "PASS","blocking_codes":[v["code"] for v in findings[start:]]})
    if not packet.get("plans"):err("JC031","No submitted joint repair plan.","packet")
    return {"status":"FAIL" if findings else "PASS","rule":"LOCAL_COMPLIANCE_NOT_JOINT_COMPLETION","plans":out,"findings":findings}
