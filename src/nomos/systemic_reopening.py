from __future__ import annotations

from typing import Any

DEFECT_TYPES = {
    "model",
    "query",
    "data_pipeline",
    "generator",
    "rule",
    "provenance",
    "monitoring",
    "review_route",
}

EVIDENCE_MODES = {
    "mechanism_universal",
    "census",
    "probability_sample",
    "stratified_sample",
    "targeted_diagnostic_sample",
}


def _by_id(items: list[dict[str, Any]]) -> dict[str, dict[str, Any]]:
    return {str(item["id"]): item for item in items if item.get("id")}


def _set(item: dict[str, Any], key: str) -> set[str]:
    return {str(x) for x in item.get(key, []) if x is not None and str(x)}


def analyze_systemic_reopening(packet: dict[str, Any]) -> dict[str, Any]:
    """Audit escalation from a validated branch defect to cohort-wide historical reopening."""
    defects = _by_id(packet.get("defects", []))
    branches = _by_id(packet.get("branches", []))
    cohorts = _by_id(packet.get("cohorts", []))
    findings: list[dict[str, Any]] = []

    def add(code: str, severity: str, message: str, refs: list[str]) -> None:
        findings.append({"code": code, "severity": severity, "message": message, "refs": refs})

    results: list[dict[str, Any]] = []
    for idx, proposal in enumerate(packet.get("proposals", []), start=1):
        pid = str(proposal.get("id") or f"proposal-{idx}")
        before = len(findings)
        did = str(proposal.get("defect", ""))
        cid = str(proposal.get("cohort", ""))
        defect = defects.get(did)
        cohort = cohorts.get(cid)

        if defect is None:
            add("SR001", "ERROR", "Systemic reopening references an unknown defect.", [pid, did])
        if cohort is None:
            add("SR002", "ERROR", "Systemic reopening references an unknown cohort.", [pid, cid])
        if defect is None or cohort is None:
            results.append({"id": pid, "status": "FAIL", "blocking_codes": [f["code"] for f in findings[before:]]})
            continue

        defect_type = str(defect.get("type", ""))
        if defect_type not in DEFECT_TYPES:
            add("SR003", "ERROR", "Defect type is not recognized by the systemic-reopening audit.", [pid, did, defect_type])
        if defect.get("validated") is not True:
            add("SR004", "ERROR", "A local suspicion is escalated before the source defect is validated.", [pid, did])
        if defect.get("provenance_visible") is not True:
            add("SR005", "ERROR", "The defect lacks accountable provenance needed for cross-branch transport.", [pid, did])

        defect_components = _set(defect, "implicated_components")
        cohort_components = _set(cohort, "shared_components")
        bridge = defect_components & cohort_components
        if not bridge:
            add("SR006", "ERROR", "No defect-relevant shared component connects the source branch to the proposed cohort.", [pid, did, cid])

        if proposal.get("same_institution_only") is True:
            add("SR007", "ERROR", "Institutional identity alone is treated as a systemic-reopening bridge.", [pid, cid])
        if proposal.get("same_model_label_only") is True:
            add("SR008", "ERROR", "A model name/version label is treated as sufficient without exposure to the implicated mechanism.", [pid, cid])

        cohort_branches = _set(cohort, "branches")
        exposed = _set(cohort, "exposed_branches")
        proposed = _set(proposal, "reopen_branches")
        source_branch = str(defect.get("source_branch", ""))
        if source_branch and source_branch not in branches:
            add("SR009", "ERROR", "Validated defect names an unknown source branch.", [pid, did, source_branch])
        if proposed - cohort_branches:
            add("SR010", "ERROR", "Recall proposal includes branches outside the declared cohort frame.", [pid, *sorted(proposed - cohort_branches)])
        if proposed - exposed:
            add("SR011", "ERROR", "Recall proposal includes branches not shown to have traversed the implicated shared mechanism.", [pid, *sorted(proposed - exposed)])

        if cohort.get("frame_defined") is not True:
            add("SR012", "ERROR", "Cohort-wide reopening lacks a reconstructible inclusion/exclusion frame.", [pid, cid])
        if cohort.get("exposure_reconstructible") is not True:
            add("SR013", "ERROR", "The institution cannot reconstruct which historical branches were exposed to the shared defect route.", [pid, cid])

        mode = str(proposal.get("evidence_mode", ""))
        if mode not in EVIDENCE_MODES:
            add("SR014", "ERROR", "Systemic escalation lacks a recognized evidence mode.", [pid, mode])
        if mode in {"probability_sample", "stratified_sample"}:
            if proposal.get("sampling_frame_matches_cohort") is not True:
                add("SR015", "ERROR", "Sample-to-cohort escalation uses a sampling frame that does not match the proposed recall cohort.", [pid, cid])
            if proposal.get("selection_independent_of_outcome") is not True:
                add("SR016", "ERROR", "Sample selection depends on observed failure/outcome and cannot support ordinary cohort prevalence transport.", [pid, cid])
            if proposal.get("uncertainty_reported") is not True:
                add("SR017", "ERROR", "Probability-based cohort escalation suppresses sampling uncertainty.", [pid, cid])
        if mode == "stratified_sample" and proposal.get("material_strata_covered") is not True:
            add("SR018", "ERROR", "Stratified escalation omits a material exposure or consequence stratum.", [pid, cid])
        if mode == "targeted_diagnostic_sample" and proposal.get("claims_prevalence_estimate") is True:
            add("SR019", "ERROR", "A targeted diagnostic sample is laundered into a cohort prevalence estimate.", [pid, cid])
        if mode == "mechanism_universal" and proposal.get("universal_mechanism_bridge") is not True:
            add("SR020", "ERROR", "Universal propagation is claimed without showing that the defective mechanism deterministically or necessarily touched every recalled branch.", [pid, cid])

        if proposal.get("single_case_count_only") is True:
            add("SR021", "ERROR", "One validated case is treated as sufficient for class-wide reopening solely because it is one observed failure.", [pid, did])

        known_eligible = _set(proposal, "known_eligible_branches")
        omitted = (known_eligible & exposed) - proposed
        if defect.get("validated") is True and bridge and omitted and proposal.get("bounded_nonrecall_reason") is not True:
            add("SR022", "ERROR", "Known exposed branches sharing the validated defect route are omitted without a bounded non-recall reason.", [pid, *sorted(omitted)])

        if proposal.get("automatic_merits_reversal") is True:
            add("SR023", "ERROR", "Cohort reopening is converted into automatic reversal of individual person-judgments.", [pid, cid])
        if proposal.get("automatic_adverse_reauthorization") is True:
            add("SR024", "ERROR", "Systemic reopening automatically reauthorizes an old adverse person-judgment.", [pid, cid])
        if proposal.get("person_burden_shift") is True:
            add("SR025", "ERROR", "Institution-side shared-defect evidence is converted into a new burden on affected persons to prove their own inclusion or innocence.", [pid, cid])
        if proposal.get("notice_plan") is not True and proposed:
            add("SR026", "ERROR", "A nonempty historical recall cohort lacks a notice/standing route for affected persons or representatives.", [pid, cid])
        if proposal.get("review_capacity_plan") is not True and proposed:
            add("SR027", "ERROR", "Class-wide reopening is declared without capacity or sequencing safeguards for meaningful review.", [pid, cid])
        if proposal.get("freeze_old_consequence_authority") is not True and proposed:
            add("SR028", "ERROR", "Historical recall proceeds without freezing automatic old consequence authority pending fresh case-level review.", [pid, cid])

        if proposal.get("completion_claim") in {"complete", "robust_complete"}:
            unresolved = _set(proposal, "unresolved_exposure_cells")
            if unresolved:
                add("SR029", "ERROR", "Systemic reopening is declared complete while material exposure cells remain unresolved.", [pid, *sorted(unresolved)])

        current_errors = [f["code"] for f in findings[before:] if f["severity"] == "ERROR" and pid in f["refs"]]
        results.append({
            "id": pid,
            "defect": did,
            "cohort": cid,
            "shared_bridge": sorted(bridge),
            "evidence_mode": mode,
            "reopen_count": len(proposed),
            "status": "FAIL" if current_errors else "PASS",
            "blocking_codes": current_errors,
        })

    errors = [f for f in findings if f["severity"] == "ERROR"]
    warnings = [f for f in findings if f["severity"] == "WARNING"]
    return {
        "status": "FAIL" if errors else "PASS",
        "rule": (
            "LOCAL_DEFECT_NE_CLASS_DEFECT; "
            "SYSTEMIC_REOPENING_REQUIRES_SHARED_MECHANISM_AND_EXPOSURE_BRIDGE; "
            "COHORT_RECALL_NE_CASE_MERITS_REVERSAL"
        ),
        "proposals": results,
        "findings": findings,
        "summary": {
            "defects": len(defects),
            "branches": len(branches),
            "cohorts": len(cohorts),
            "proposals": len(results),
            "errors": len(errors),
            "warnings": len(warnings),
        },
    }
