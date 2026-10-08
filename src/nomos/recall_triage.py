"""NOMOS-0.855: procedural audit of capacity-constrained historical recall queues.

This audit never ranks people or recommends substantive case outcomes.
It tests whether a separately proposed repair queue carries sufficient governance.
"""
from __future__ import annotations
from typing import Any

def analyze_recall_triage(packet: dict[str, Any]) -> dict[str, Any]:
    cases = {str(c["id"]): c for c in packet.get("cases", []) if c.get("id")}
    proposals = packet.get("plans", [])
    findings: list[dict[str, Any]] = []
    results: list[dict[str, Any]] = []
    def emit(code: str, msg: str, pid: str, *refs: str) -> None:
        findings.append({"code": code, "severity": "ERROR", "message": msg, "refs": [pid, *refs]})
    for i, p in enumerate(proposals):
        pid = str(p.get("id", f"plan-{i+1}"))
        start = len(findings)
        order = [str(x) for x in p.get("order", [])]
        known = set(cases)
        if len(order) != len(set(order)): emit("QT001", "Duplicate queue entries.", pid)
        if set(order) - known: emit("QT002", "Unknown case in queue.", pid, *sorted(set(order)-known))
        if known-set(order) and not p.get("documented_deferred_cases"):
            emit("QT003", "Known recall cases silently omitted.", pid, *sorted(known-set(order)))
        capacity=p.get("capacity_per_period")
        if not isinstance(capacity,int) or capacity<1:
            emit("QT004", "Positive integer review capacity is required.", pid)
        if p.get("priority_basis") in {"person_risk", "character", "blame", "deservingness"}:
            emit("QT005", "Person merits/character used as repair scheduling basis.", pid)
        if p.get("review_order_reauthorizes_judgment") is True:
            emit("QT006", "Queue position becomes person-judgment authority.", pid)
        if p.get("review_order_reauthorizes_consequences") is True:
            emit("QT007", "Queue position becomes consequence authority.", pid)
        if p.get("uses_old_adverse_label_as_urgency") is True:
            emit("QT008", "Discredited label is reused as queue urgency.", pid)
        if p.get("notice_for_all") is not True:
            emit("QT009", "Some recalled persons lack notice/standing while awaiting review.", pid)
        if p.get("interim_protections") is not True:
            emit("QT010", "Delay occurs without an explicit interim-protection assessment.", pid)
        if p.get("published_policy") is not True:
            emit("QT011", "Ordering rule is not accountable.", pid)
        if p.get("contestable_order") is not True:
            emit("QT012", "There is no route to challenge the queue position.", pid)
        if p.get("reason_receipts") is not True:
            emit("QT013", "Queue lacks per-case or stratum-specific reason receipts.", pid)
        if p.get("independent_review") is not True:
            emit("QT014", "Queue policy has no independent review.", pid)
        if p.get("delay_impact_audit") is not True:
            emit("QT015", "Delay-induced inequality is unmeasured.", pid)
        if p.get("periodic_reassessment") is not True:
            emit("QT016", "Queue remains frozen despite changing circumstances.", pid)
        if p.get("accessibility_route") is not True:
            emit("QT017", "The queue lacks accessible petition/priority-correction routes.", pid)
        if p.get("first_come_first_served") is True and p.get("access_time_bias_audited") is not True:
            emit("QT018", "Arrival order is used without access-time bias audit.", pid)
        if p.get("automated_priority_model") is True and p.get("model_warrant_audited") is not True:
            emit("QT019", "Automated priority model lacks independent warrant audit.", pid)
        if p.get("expected_time_promise_without_capacity") is True:
            emit("QT020", "Queue promises ungrounded completion time.", pid)
        if p.get("indefinite_deferral_allowed") is True:
            emit("QT021", "Indefinite deferral is treated as a legitimate queue result.", pid)
        if p.get("harm_severity_source") == "invalidated_person_label":
            emit("QT022", "Consequence severity derived solely from invalidated person label.", pid)
        if p.get("repair_cost_only") is True:
            emit("QT023", "Cheap cases always dominate consequence-relevant delay.", pid)
        if p.get("random_lottery_without_guards") is True:
            emit("QT024", "Lottery bypasses independently required protections.", pid)
        if p.get("emergency_override") is True and not all(p.get(k) is True for k in
            ("override_authorized","override_logged","override_expires")):
            emit("QT025", "Emergency queue override lacks authority, record or expiry.", pid)
        for cid in order:
            c=cases.get(cid)
            if not c: continue
            if c.get("recall_eligible") is not True:
                emit("QT026", "Queue includes case without recalled eligibility.",pid,cid)
            if c.get("current_consequence") == "ongoing_adverse" and c.get("interim_status_assessed") is not True:
                emit("QT027", "Ongoing adverse consequence lacks interim review.",pid,cid)
            if c.get("deadline_material") is True and c.get("deadline_considered") is not True:
                emit("QT028", "Material deadline ignored.",pid,cid)
        if p.get("complete") is True and (len(findings)>start or known-set(order)):
            emit("QT029", "Completion claimed despite unresolved queue failures.",pid)
        failed=[f["code"] for f in findings[start:]]
        results.append({"id":pid,"status":"FAIL" if failed else "PASS",
                        "blocking_codes":failed,"queued":len(order)})
    return {"status":"FAIL" if findings else "PASS",
            "rule":"REPAIR_QUEUE_PRIORITY_NOT_PERSON_AUTHORITY",
            "plans":results,"findings":findings,
            "summary":{"cases":len(cases),"plans":len(proposals),"errors":len(findings)}}
