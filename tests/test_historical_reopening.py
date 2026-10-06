import unittest

from nomos.historical_reopening import analyze_historical_reopening


class HistoricalReopeningTests(unittest.TestCase):
    def test_bounded_subject_reopen_passes(self):
        packet = {
            "branches": [{"id": "b1", "state": "historical_reopenable"}],
            "requests": [{
                "id": "r1",
                "branch": "b1",
                "trigger": "material_new_evidence",
                "trigger_provenance": True,
                "material_link": True,
                "standing": "subject",
                "standing_fit": True,
                "implicated_scopes": ["factual-premise"],
                "opened_scopes": ["factual-premise"],
                "requested_state": "petition_admitted",
                "review_capable_path": True,
                "closure_receipt_visible": True,
                "automatic_old_judgment_reauthorization": False,
            }],
            "completion_claim": "complete",
        }
        self.assertEqual("PASS", analyze_historical_reopening(packet)["status"])

    def test_archive_availability_is_not_trigger(self):
        packet = {
            "branches": [{"id": "b1", "state": "historical_reopenable"}],
            "requests": [{
                "id": "r1",
                "branch": "b1",
                "trigger": "material_new_evidence",
                "trigger_provenance": True,
                "material_link": False,
                "standing": "repair_duty_institution",
                "standing_fit": True,
                "archive_availability_only": True,
                "review_capable_path": True,
                "closure_receipt_visible": True,
            }],
        }
        codes = {f["code"] for f in analyze_historical_reopening(packet)["findings"]}
        self.assertTrue({"RO005", "RO008"}.issubset(codes))

    def test_repeat_without_delta_fails(self):
        packet = {
            "branches": [{"id": "b1", "state": "historical_reopenable"}],
            "requests": [{
                "id": "r1",
                "branch": "b1",
                "trigger": "material_new_evidence",
                "trigger_provenance": True,
                "material_link": True,
                "standing": "subject",
                "standing_fit": True,
                "repeat_request": True,
                "material_delta": False,
                "review_capable_path": True,
                "closure_receipt_visible": True,
            }],
        }
        self.assertIn("RO009", {f["code"] for f in analyze_historical_reopening(packet)["findings"]})

    def test_global_cascade_fails_without_shared_defect(self):
        packet = {
            "branches": [{"id": "b1", "state": "historical_reopenable"}],
            "requests": [{
                "id": "r1",
                "branch": "b1",
                "trigger": "validated_rule_model_query_defect",
                "trigger_provenance": True,
                "material_link": True,
                "standing": "independent_oversight",
                "standing_fit": True,
                "implicated_scopes": ["query-path"],
                "opened_scopes": ["query-path", "unrelated-character-label"],
                "global_defect_justified": False,
                "review_capable_path": True,
                "closure_receipt_visible": True,
            }],
        }
        self.assertIn("RO010", {f["code"] for f in analyze_historical_reopening(packet)["findings"]})

    def test_reopen_does_not_reauthorize_old_judgment(self):
        packet = {
            "branches": [{"id": "b1", "state": "historical_reopenable"}],
            "requests": [{
                "id": "r1",
                "branch": "b1",
                "trigger": "new_descendant_or_consequence",
                "trigger_provenance": True,
                "material_link": True,
                "standing": "affected_third_party",
                "standing_fit": True,
                "review_capable_path": True,
                "closure_receipt_visible": True,
                "automatic_old_judgment_reauthorization": True,
            }],
        }
        self.assertIn("RO014", {f["code"] for f in analyze_historical_reopening(packet)["findings"]})

    def test_adverse_reauthorization_requires_fresh_warrant(self):
        packet = {
            "branches": [{"id": "b1", "state": "historical_reopenable"}],
            "requests": [{
                "id": "r1",
                "branch": "b1",
                "trigger": "institutional_self_correction",
                "trigger_provenance": True,
                "material_link": True,
                "standing": "repair_duty_institution",
                "standing_fit": True,
                "review_capable_path": True,
                "closure_receipt_visible": True,
                "adverse_current_authority": True,
                "fresh_current_warrant": False,
                "fresh_current_adoption": False,
            }],
        }
        self.assertIn("RO015", {f["code"] for f in analyze_historical_reopening(packet)["findings"]})

    def test_privacy_bounded_rehydration(self):
        packet = {
            "branches": [{"id": "b1", "state": "historical_reopenable"}],
            "requests": [{
                "id": "r1",
                "branch": "b1",
                "trigger": "integrity_provenance_defect",
                "trigger_provenance": True,
                "material_link": True,
                "standing": "independent_oversight",
                "standing_fit": True,
                "review_capable_path": True,
                "closure_receipt_visible": True,
                "privacy_sensitive": True,
                "needed_fields": ["provenance"],
                "rehydrated_fields": ["provenance", "unrelated-private-context"],
            }],
        }
        self.assertIn("RO017", {f["code"] for f in analyze_historical_reopening(packet)["findings"]})

    def test_compaction_cannot_become_practical_finality(self):
        packet = {
            "branches": [{"id": "b1", "state": "historical_minimal"}],
            "requests": [{
                "id": "r1",
                "branch": "b1",
                "trigger": "activated_compaction_debt",
                "trigger_provenance": True,
                "material_link": True,
                "standing": "subject",
                "standing_fit": True,
                "review_capable_path": True,
                "closure_receipt_visible": True,
                "institution_controls_missing_provenance": True,
                "denied_for_challenger_nonproduction": True,
                "escalation_to_richer_provenance": False,
            }],
        }
        codes = {f["code"] for f in analyze_historical_reopening(packet)["findings"]}
        self.assertTrue({"RO018", "RO023"}.issubset(codes))


if __name__ == "__main__":
    unittest.main()
