import unittest

from nomos.correction_propagation import (
    analyze_correction_propagation,
    correction_impact,
)


class CorrectionPropagationTests(unittest.TestCase):
    def test_semantic_same_output_can_pass_with_fresh_warrant(self):
        packet = {
            "correction": {
                "source": "source",
                "dimensions": ["semantic", "authority"],
            },
            "records": [
                {"id": "source"},
                {
                    "id": "summary",
                    "dependencies": ["source"],
                    "dependency_dimensions": {
                        "source": ["semantic", "authority"],
                    },
                    "operations": ["semantic_rederive", "fresh_reconstitution"],
                    "transformation_version": "sem-v1",
                    "corrected_transformation_version": "sem-v2",
                    "semantic_rule_changed": True,
                    "generator_active": True,
                    "generator_corrected": True,
                    "output_changed": False,
                    "current_governing": True,
                    "fresh_adoption": True,
                    "fresh_warrant": True,
                },
            ],
            "completion_claim": "complete",
        }
        result = analyze_correction_propagation(packet)
        self.assertEqual("PASS", result["status"])
        self.assertEqual(["authority", "semantic"], result["records"][0]["affected_dimensions"])

    def test_stale_semantic_rerun_fails(self):
        packet = {
            "correction": {
                "source": "source",
                "dimensions": ["semantic"],
            },
            "records": [
                {"id": "source"},
                {
                    "id": "summary",
                    "dependencies": ["source"],
                    "dependency_dimensions": {"source": ["semantic"]},
                    "operations": ["semantic_rederive"],
                    "transformation_version": "sem-v1",
                    "corrected_transformation_version": "sem-v1",
                    "generator_active": True,
                    "generator_corrected": False,
                    "output_changed": False,
                    "current_governing": True,
                },
            ],
        }
        result = analyze_correction_propagation(packet)
        codes = {f["code"] for f in result["findings"]}
        self.assertTrue({"CP006", "CP008", "CP010"}.issubset(codes))

    def test_factual_recompute_passes(self):
        packet = {
            "correction": {
                "source": "source",
                "dimensions": ["factual"],
            },
            "records": [
                {"id": "source"},
                {
                    "id": "score",
                    "dependencies": ["source"],
                    "dependency_dimensions": {"source": ["factual"]},
                    "operations": ["factual_recompute"],
                    "output_changed": True,
                    "current_governing": True,
                },
            ],
            "completion_claim": "complete",
        }
        result = analyze_correction_propagation(packet)
        self.assertEqual("PASS", result["status"])

    def test_dependency_dimension_limits_propagation(self):
        packet = {
            "correction": {
                "source": "source",
                "dimensions": ["semantic"],
            },
            "records": [
                {"id": "source"},
                {
                    "id": "audit_copy",
                    "dependencies": ["source"],
                    "dependency_dimensions": {"source": ["factual"]},
                },
            ],
        }
        impact = correction_impact(packet)
        self.assertNotIn("audit_copy", impact)

    def test_notice_only_does_not_support_complete_claim(self):
        packet = {
            "correction": {
                "source": "source",
                "dimensions": ["authority"],
            },
            "records": [{"id": "source"}],
            "recipient_branches": [
                {
                    "id": "recipient-a",
                    "notice": "delivered",
                    "state": "notice_only",
                }
            ],
            "completion_claim": "complete",
        }
        result = analyze_correction_propagation(packet)
        codes = {f["code"] for f in result["findings"]}
        self.assertIn("CP016", codes)

    def test_fresh_independent_recipient_requires_local_rederivation(self):
        packet = {
            "correction": {
                "source": "source",
                "dimensions": ["authority"],
            },
            "records": [{"id": "source"}],
            "recipient_branches": [
                {
                    "id": "recipient-a",
                    "notice": "delivered",
                    "state": "fresh_independent",
                    "local_rederivation": False,
                    "fresh_warrant": True,
                }
            ],
        }
        result = analyze_correction_propagation(packet)
        self.assertIn("CP015", {f["code"] for f in result["findings"]})


if __name__ == "__main__":
    unittest.main()
