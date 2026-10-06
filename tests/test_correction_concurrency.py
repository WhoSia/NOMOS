import unittest

from nomos.correction_concurrency import (
    active_frontier,
    analyze_correction_concurrency,
    relation,
)


class CorrectionConcurrencyTests(unittest.TestCase):
    def test_causal_order_and_frontier(self):
        packet = {
            "events": [
                {"id": "e1", "dimensions": ["semantic"]},
                {"id": "e2", "parents": ["e1"], "dimensions": ["semantic"]},
            ]
        }
        self.assertEqual("before", relation(packet, "e1", "e2"))
        self.assertEqual(["e2"], active_frontier(packet))

    def test_disjoint_new_correction_does_not_stale_job(self):
        packet = {
            "events": [
                {"id": "e1", "dimensions": ["factual"], "scope": "person-a"},
                {
                    "id": "e2",
                    "parents": ["e1"],
                    "dimensions": ["semantic"],
                    "scope": "person-a",
                },
            ],
            "jobs": [
                {
                    "id": "score-job",
                    "scope": "person-a",
                    "base_frontier": ["e1"],
                    "commit_frontier": ["e2"],
                    "dependency_dimensions": ["factual"],
                }
            ],
        }
        result = analyze_correction_concurrency(packet)
        self.assertEqual("PASS", result["status"])

    def test_relevant_new_correction_requires_rebase(self):
        packet = {
            "events": [
                {"id": "e1", "dimensions": ["semantic"], "scope": "person-a"},
                {
                    "id": "e2",
                    "parents": ["e1"],
                    "dimensions": ["semantic"],
                    "scope": "person-a",
                },
            ],
            "jobs": [
                {
                    "id": "summary-job",
                    "scope": "person-a",
                    "base_frontier": ["e1"],
                    "commit_frontier": ["e2"],
                    "dependency_dimensions": ["semantic"],
                }
            ],
        }
        result = analyze_correction_concurrency(packet)
        self.assertIn("CR011", {f["code"] for f in result["findings"]})

    def test_stale_write_resurrection_fails(self):
        packet = {
            "events": [
                {"id": "e1", "dimensions": ["semantic"], "scope": "person-a"},
                {
                    "id": "e2",
                    "parents": ["e1"],
                    "dimensions": ["authority"],
                    "scope": "person-a",
                    "deauthorizes": ["adverse-label"],
                },
            ],
            "jobs": [
                {
                    "id": "late-ranking",
                    "scope": "person-a",
                    "base_frontier": ["e1"],
                    "commit_frontier": ["e2"],
                    "dependency_dimensions": ["authority"],
                    "restores_state": "adverse-label",
                }
            ],
        }
        result = analyze_correction_concurrency(packet)
        codes = {f["code"] for f in result["findings"]}
        self.assertTrue({"CR011", "CR013"}.issubset(codes))

    def test_fresh_post_deauthorization_restoration_can_pass(self):
        packet = {
            "events": [
                {"id": "e1", "dimensions": ["authority"], "scope": "person-a"},
                {
                    "id": "e2",
                    "parents": ["e1"],
                    "dimensions": ["authority"],
                    "scope": "person-a",
                    "deauthorizes": ["adverse-label"],
                },
                {
                    "id": "e3",
                    "parents": ["e2"],
                    "dimensions": ["authority"],
                    "scope": "person-a",
                },
            ],
            "jobs": [
                {
                    "id": "fresh-restoration",
                    "scope": "person-a",
                    "base_frontier": ["e2"],
                    "commit_frontier": ["e3"],
                    "dependency_dimensions": ["authority"],
                    "restores_state": "adverse-label",
                    "rebased": True,
                    "fresh_warrant": True,
                    "fresh_adoption": True,
                }
            ],
        }
        result = analyze_correction_concurrency(packet)
        self.assertEqual("PASS", result["status"])

    def test_concurrent_overlap_needs_explicit_resolution(self):
        packet = {
            "events": [
                {"id": "e1", "dimensions": ["semantic"], "scope": "person-a"},
                {"id": "e2", "dimensions": ["semantic"], "scope": "person-a"},
            ]
        }
        result = analyze_correction_concurrency(packet)
        self.assertIn("CR008", {f["code"] for f in result["findings"]})

    def test_concurrent_merge_preserves_both_provenances(self):
        packet = {
            "events": [
                {"id": "e1", "dimensions": ["semantic"], "scope": "person-a"},
                {"id": "e2", "dimensions": ["semantic"], "scope": "person-a"},
            ],
            "concurrency_resolutions": {
                "e1|e2": {
                    "classification": "merge",
                    "provenance": ["e1", "e2"],
                }
            },
        }
        result = analyze_correction_concurrency(packet)
        self.assertEqual("PASS", result["status"])

    def test_last_writer_wins_is_rejected(self):
        packet = {
            "events": [
                {"id": "e1", "dimensions": ["semantic"], "scope": "person-a"},
                {"id": "e2", "dimensions": ["semantic"], "scope": "person-a"},
            ],
            "concurrency_resolutions": {
                "e1|e2": {"classification": "last_writer_wins"}
            },
        }
        result = analyze_correction_concurrency(packet)
        self.assertIn("CR007", {f["code"] for f in result["findings"]})


if __name__ == "__main__":
    unittest.main()
