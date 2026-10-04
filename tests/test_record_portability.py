import unittest

from nomos.record_portability import (
    analyze_record_portability,
    descendant_map,
    emergency_ancestors,
)


class RecordPortabilityTests(unittest.TestCase):
    def test_safe_bounded_use_passes(self):
        packet = {
            "records": [
                {
                    "id": "r0",
                    "emergency_produced": True,
                    "provenance_visible": True,
                    "regime_sensitivity_assessed": True,
                    "ordinary_baseline": "matched post-restoration cohort",
                    "semantic_revalidated": True,
                    "contest_route": "review:ordinary",
                    "allowed_purposes": ["eligibility_review"],
                }
            ],
            "proposed_uses": [
                {
                    "id": "u1",
                    "record": "r0",
                    "level": "P3",
                    "purpose": "eligibility_review",
                }
            ],
        }
        result = analyze_record_portability(packet)
        self.assertEqual("PASS", result["status"])
        self.assertEqual("PASS", result["uses"][0]["status"])

    def test_emergency_behavior_cannot_jump_to_adverse_consequence(self):
        packet = {
            "records": [
                {
                    "id": "r0",
                    "emergency_produced": True,
                    "provenance_visible": False,
                    "selection_feedback": True,
                    "emergency_label_expired": True,
                }
            ],
            "proposed_uses": [
                {
                    "id": "u1",
                    "record": "r0",
                    "level": "P4",
                    "purpose": "ordinary_risk_scoring",
                }
            ],
        }
        result = analyze_record_portability(packet)
        codes = {f["code"] for f in result["findings"]}
        self.assertTrue(
            {"RP002", "RP003", "RP004", "RP005", "RP006", "RP007", "RP009", "RP012"}.issubset(codes)
        )

    def test_descendant_must_preserve_emergency_ancestry(self):
        packet = {
            "records": [
                {"id": "raw", "emergency_produced": True, "provenance_visible": True},
                {"id": "score", "dependencies": ["raw"], "provenance_visible": True},
            ],
            "proposed_uses": [],
        }
        result = analyze_record_portability(packet)
        self.assertIn("RP011", {f["code"] for f in result["findings"]})

    def test_descendant_with_explicit_ancestry_passes_lineage_guard(self):
        packet = {
            "records": [
                {"id": "raw", "emergency_produced": True, "provenance_visible": True},
                {
                    "id": "score",
                    "dependencies": ["raw"],
                    "provenance_visible": True,
                    "emergency_ancestor_refs": ["raw"],
                },
            ],
            "proposed_uses": [],
        }
        result = analyze_record_portability(packet)
        self.assertNotIn("RP011", {f["code"] for f in result["findings"]})
        self.assertEqual(["raw"], emergency_ancestors(packet, "score"))
        self.assertEqual(["score"], descendant_map(packet)["raw"])


if __name__ == "__main__":
    unittest.main()
