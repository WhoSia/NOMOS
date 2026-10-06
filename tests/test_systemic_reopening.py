import unittest

from nomos.systemic_reopening import analyze_systemic_reopening


class SystemicReopeningTests(unittest.TestCase):
    def base(self):
        return {
            "defects": [{
                "id": "d1",
                "type": "query",
                "validated": True,
                "provenance_visible": True,
                "source_branch": "b1",
                "implicated_components": ["query:q7"],
            }],
            "branches": [{"id": "b1"}, {"id": "b2"}, {"id": "b3"}],
            "cohorts": [{
                "id": "c1",
                "branches": ["b1", "b2", "b3"],
                "exposed_branches": ["b1", "b2"],
                "shared_components": ["query:q7"],
                "frame_defined": True,
                "exposure_reconstructible": True,
            }],
            "proposals": [{
                "id": "p1",
                "defect": "d1",
                "cohort": "c1",
                "reopen_branches": ["b1", "b2"],
                "known_eligible_branches": ["b1", "b2"],
                "evidence_mode": "mechanism_universal",
                "universal_mechanism_bridge": True,
                "notice_plan": True,
                "review_capacity_plan": True,
                "freeze_old_consequence_authority": True,
                "completion_claim": "complete",
            }],
        }

    def test_safe_mechanism_linked_recall_passes(self):
        result = analyze_systemic_reopening(self.base())
        self.assertEqual(result["status"], "PASS")

    def test_unvalidated_local_suspicion_cannot_escalate(self):
        packet = self.base()
        packet["defects"][0]["validated"] = False
        result = analyze_systemic_reopening(packet)
        self.assertIn("SR004", {f["code"] for f in result["findings"]})

    def test_same_institution_is_not_bridge(self):
        packet = self.base()
        packet["proposals"][0]["same_institution_only"] = True
        result = analyze_systemic_reopening(packet)
        self.assertIn("SR007", {f["code"] for f in result["findings"]})

    def test_unexposed_branch_cannot_be_recalled_by_label(self):
        packet = self.base()
        packet["proposals"][0]["reopen_branches"].append("b3")
        result = analyze_systemic_reopening(packet)
        self.assertIn("SR011", {f["code"] for f in result["findings"]})

    def test_probability_sample_requires_transport_discipline(self):
        packet = self.base()
        proposal = packet["proposals"][0]
        proposal["evidence_mode"] = "probability_sample"
        proposal.pop("universal_mechanism_bridge")
        proposal["sampling_frame_matches_cohort"] = False
        proposal["selection_independent_of_outcome"] = False
        proposal["uncertainty_reported"] = False
        result = analyze_systemic_reopening(packet)
        codes = {f["code"] for f in result["findings"]}
        self.assertTrue({"SR015", "SR016", "SR017"}.issubset(codes))

    def test_targeted_diagnostic_sample_cannot_claim_prevalence(self):
        packet = self.base()
        proposal = packet["proposals"][0]
        proposal["evidence_mode"] = "targeted_diagnostic_sample"
        proposal.pop("universal_mechanism_bridge")
        proposal["claims_prevalence_estimate"] = True
        result = analyze_systemic_reopening(packet)
        self.assertIn("SR019", {f["code"] for f in result["findings"]})

    def test_known_exposed_branches_cannot_silently_drop(self):
        packet = self.base()
        packet["proposals"][0]["reopen_branches"] = ["b1"]
        result = analyze_systemic_reopening(packet)
        self.assertIn("SR022", {f["code"] for f in result["findings"]})

    def test_recall_does_not_decide_individual_merits(self):
        packet = self.base()
        proposal = packet["proposals"][0]
        proposal["automatic_merits_reversal"] = True
        proposal["automatic_adverse_reauthorization"] = True
        result = analyze_systemic_reopening(packet)
        codes = {f["code"] for f in result["findings"]}
        self.assertTrue({"SR023", "SR024"}.issubset(codes))

    def test_institution_side_defect_does_not_shift_person_burden(self):
        packet = self.base()
        packet["proposals"][0]["person_burden_shift"] = True
        result = analyze_systemic_reopening(packet)
        self.assertIn("SR025", {f["code"] for f in result["findings"]})

    def test_recall_requires_notice_capacity_and_consequence_freeze(self):
        packet = self.base()
        proposal = packet["proposals"][0]
        proposal["notice_plan"] = False
        proposal["review_capacity_plan"] = False
        proposal["freeze_old_consequence_authority"] = False
        result = analyze_systemic_reopening(packet)
        codes = {f["code"] for f in result["findings"]}
        self.assertTrue({"SR026", "SR027", "SR028"}.issubset(codes))

    def test_completion_fails_with_unresolved_exposure_cells(self):
        packet = self.base()
        packet["proposals"][0]["unresolved_exposure_cells"] = ["legacy-q7-no-lineage"]
        result = analyze_systemic_reopening(packet)
        self.assertIn("SR029", {f["code"] for f in result["findings"]})


if __name__ == "__main__":
    unittest.main()
