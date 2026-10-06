from __future__ import annotations

from typing import Any

TRIGGERS = {
    "integrity_provenance_defect",
    "material_new_evidence",
    "new_descendant_or_consequence",
    "activated_compaction_debt",
    "stale_resurrection_signal",
    "validated_rule_model_query_defect",
    "institutional_self_correction",
}

STANDING_TYPES = {
    "subject",
    "authorized_representative",
    "affected_third_party",
    "repair_duty_institution",
    "independent_oversight",
    "qualified_successor",
}

REOPEN_STATES = {
    "dormant_historical",
    "petition_admitted",
    "bounded_rehydration",
    "active_review",
    "current_authority_reconstitution",
    "reclosed",
}


def _requests(packet: dict[str, Any]) -> list[dict[str, Any]]:
    return [item for item in packet.get("requests", []) if item.get("id")]


def _branches(packet: dict[str, Any]) -> dict[str, dict[str, Any]]:
    return {
        str(item["id"]): item
        for item in packet.get("branches", [])
        if item.get("id")
    }


def analyze_historical_reopening(packet: dict[str, Any]) -> dict[str, Any]:
    """Audit whether historical branches are reopened without restoring old authority by default."""
    branches = _branches(packet)
    findings: list[dict[str, Any]] = []

    def add(code: str, severity: str, message: str, refs: list[str]) -> None:
        findings.append(
            {"code": code, "severity": severity, "message": message, "refs": refs}
        )

    results: list[dict[str, Any]] = []
    for req in _requests(packet):
        rid = str(req["id"])
        bid = str(req.get("branch", ""))
        before = len(findings)

        branch = branches.get(bid)
        if branch is None:
            add("RO001", "ERROR", "Reopen request references an unknown historical branch.", [rid, bid])
            results.append({"id": rid, "branch": bid, "status": "FAIL", "blocking_codes": ["RO001"]})
            continue

        if str(branch.get("state", "")) not in {"historical_reopenable", "historical_minimal"}:
            add("RO002", "ERROR", "Reopen request targets a branch that is not in a historical-retired state.", [rid, bid])

        trigger = str(req.get("trigger", ""))
        if trigger not in TRIGGERS:
            add("RO003", "ERROR", "Reopen request lacks a recognized trigger type.", [rid, trigger])

        if req.get("trigger_provenance") is not True:
            add("RO004", "ERROR", "Reopen trigger lacks accountable provenance.", [rid, bid])

        if req.get("material_link") is not True:
            add("RO005", "ERROR", "Newness or availability is used without a material link to a claim, dependency, consequence or reopen task.", [rid, bid])

        standing = str(req.get("standing", ""))
        if standing not in STANDING_TYPES:
            add("RO006", "ERROR", "Requester lacks a recognized reopening-standing type.", [rid, standing])
        if req.get("standing_fit") is not True:
            add("RO007", "ERROR", "Requester standing is not connected to the affected claim, consequence, repair duty or review mandate.", [rid, bid])

        if req.get("archive_availability_only") is True:
            add("RO008", "ERROR", "Historical availability is treated as sufficient warrant to reopen review.", [rid, bid])

        if req.get("repeat_request") is True and req.get("material_delta") is not True and req.get("prior_denial_under_challenge") is not True:
            add("RO009", "ERROR", "A repeated request is admitted without a material delta or a challenge to the prior denial itself.", [rid, bid])

        implicated = {str(x) for x in req.get("implicated_scopes", []) if x}
        opened = {str(x) for x in req.get("opened_scopes", []) if x}
        if opened and not opened.issubset(implicated) and req.get("global_defect_justified") is not True:
            add("RO010", "ERROR", "Historical reopening exceeds the trigger-linked branch scope without a justified shared defect.", [rid, bid, *sorted(opened - implicated)])

        requested_state = str(req.get("requested_state", "petition_admitted"))
        if requested_state not in REOPEN_STATES:
            add("RO011", "ERROR", "Request targets an unknown reopening state.", [rid, requested_state])

        if req.get("review_capable_path") is not True:
            add("RO012", "ERROR", "Reopening is admitted without a review path capable of changing the relevant state.", [rid, bid])

        if req.get("closure_receipt_visible") is not True:
            add("RO013", "ERROR", "Reopened review cannot inspect the prior closure reason and compaction certificate.", [rid, bid])

        if req.get("automatic_old_judgment_reauthorization") is True:
            add("RO014", "ERROR", "Opening historical review automatically restores the historical person-judgment or consequence.", [rid, bid])

        if req.get("adverse_current_authority") is True:
            if req.get("fresh_current_warrant") is not True or req.get("fresh_current_adoption") is not True:
                add("RO015", "ERROR", "Adverse current authority is restored without fresh current warrant and adoption.", [rid, bid])

        if req.get("historical_branch_count_used_as_evidence") is True:
            add("RO016", "ERROR", "Repeated historical branches or reopen events are being counted as fresh current evidence.", [rid, bid])

        if req.get("privacy_sensitive") is True:
            needed = {str(x) for x in req.get("needed_fields", []) if x}
            revealed = {str(x) for x in req.get("rehydrated_fields", []) if x}
            if revealed - needed:
                add("RO017", "ERROR", "Privacy-sensitive rehydration exposes fields beyond the admitted reopen task.", [rid, bid, *sorted(revealed - needed)])

        if req.get("institution_controls_missing_provenance") is True and req.get("denied_for_challenger_nonproduction") is True:
            add("RO018", "ERROR", "Compaction or institution-controlled provenance is used as practical finality against a challenger.", [rid, bid])

        if req.get("periodic_reactivation_default") is True:
            add("RO019", "ERROR", "Historical branches are periodically reopened without a branch-specific trigger.", [rid, bid])

        if req.get("denial") is True and req.get("reviewable_denial_reasons") is not True:
            add("RO020", "ERROR", "Reopen denial lacks reviewable reasons tied to trigger, standing, materiality or scope.", [rid, bid])

        if req.get("institution_self_initiated") is True and req.get("institution_unilateral_adverse_reactivation") is True:
            add("RO021", "ERROR", "Institutional self-correction is converted into unilateral adverse reauthorization.", [rid, bid])

        if req.get("subject_requested") is True and req.get("subject_unilateral_merits_control") is True:
            add("RO022", "ERROR", "Subject standing to reopen is converted into unilateral control of the reopened merits.", [rid, bid])

        if trigger == "activated_compaction_debt" and req.get("escalation_to_richer_provenance") is not True:
            add("RO023", "ERROR", "Activated compaction debt lacks an escalation path to richer retained provenance or an explicit HOLD.", [rid, bid])

        current_errors = [
            f["code"] for f in findings[before:] if f["severity"] == "ERROR" and rid in f["refs"]
        ]
        results.append(
            {
                "id": rid,
                "branch": bid,
                "trigger": trigger,
                "standing": standing,
                "requested_state": requested_state,
                "status": "FAIL" if current_errors else "PASS",
                "blocking_codes": current_errors,
            }
        )

    completion = str(packet.get("completion_claim", "open")).lower()
    failed = [r for r in results if r["status"] == "FAIL"]
    if completion in {"complete", "robust_complete"} and failed:
        add("RO024", "ERROR", "Reopening governance is declared complete while invalid reopen requests remain unresolved.", [r["id"] for r in failed])

    errors = [f for f in findings if f["severity"] == "ERROR"]
    warnings = [f for f in findings if f["severity"] == "WARNING"]
    return {
        "status": "FAIL" if errors else "PASS",
        "rule": (
            "HISTORICAL_ACCESS_NE_REOPEN_AUTHORITY; "
            "REOPEN_ADMISSION_NE_REAUTHORIZATION; "
            "REOPEN_SCOPE_IS_TRIGGER_RELATIVE"
        ),
        "requests": results,
        "findings": findings,
        "summary": {
            "branches": len(branches),
            "requests": len(results),
            "failed_requests": len(failed),
            "errors": len(errors),
            "warnings": len(warnings),
        },
    }
