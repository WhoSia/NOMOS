import json
import unittest
from pathlib import Path

from nomos.review_topology import analyze_review_topology, minimal_break_sets


ROOT = Path(__file__).resolve().parents[1]


def load_topology():
    return json.loads(
        (ROOT / "examples" / "review_topology_calibration.json").read_text(encoding="utf-8")
    )


class ReviewTopologyTests(unittest.TestCase):
    def test_minimal_break_sets_are_inclusion_minimal(self):
        result = minimal_break_sets(load_topology())
        self.assertEqual(3, len(result))
        for group in result:
            self.assertIn("evidence_model_review", group)
            self.assertIn("remedy_panel", group)
            self.assertEqual(3, len(group))

    def test_diverse_query_route_avoids_global_common_mode_warning(self):
        report = analyze_review_topology(load_topology())
        kinds = {
            (x["dimension"], x["kind"])
            for x in report["common_mode_exposures"]
        }
        self.assertNotIn(("Q", "single_controller"), kinds)
        self.assertEqual("CALIBRATED_CANDIDATE", report["calibration_state"])

    def test_duplicate_and_diverse_redundancy_are_distinguished(self):
        report = analyze_review_topology(load_topology())
        groups = [set(group) for group in report["equivalent_redundancy_groups"]]
        self.assertIn(
            {"query_review_primary", "query_review_duplicate"},
            groups,
        )
        resilience = {
            item["safeguard"]
            for item in report["resilience_redundancy_candidates"]
        }
        self.assertIn("query_review_diverse", resilience)

    def test_authority_changer_is_reachable(self):
        report = analyze_review_topology(load_topology())
        self.assertEqual(["remedy_panel"], report["reachable_authority_changers"])
        self.assertFalse(report["fragmentation_risk"])
        self.assertEqual("appeal_router", report["routing_authority"])

    def test_undercoverage_is_not_calibrated(self):
        topology = load_topology()
        topology["required_breaks"].append("I")
        report = analyze_review_topology(topology)
        self.assertEqual(["I"], report["missing_breaks"])
        self.assertEqual("UNDERSEPARATED", report["calibration_state"])

    def test_fragmented_terminals_need_reassembly(self):
        topology = {
            "required_breaks": ["Q"],
            "entrypoints": ["start"],
            "safeguards": [
                {"id": "start", "breaks": ["Q"], "controller": "a", "can_change_authority": False},
                {"id": "left", "breaks": [], "controller": "b", "can_change_authority": True},
                {"id": "right", "breaks": [], "controller": "c", "can_change_authority": True}
            ],
            "escalations": [
                {"source": "start", "target": "left"},
                {"source": "start", "target": "right"}
            ]
        }
        report = analyze_review_topology(topology)
        self.assertTrue(report["fragmentation_risk"])
        self.assertEqual("FRAGMENTATION_RISK", report["calibration_state"])

    def test_single_controller_can_form_capture_cut(self):
        topology = {
            "required_breaks": ["Q", "E"],
            "entrypoints": ["one"],
            "safeguards": [
                {
                    "id": "one",
                    "breaks": ["Q"],
                    "controller": "router",
                    "common_dependencies": ["shared_core"],
                    "can_change_authority": False
                },
                {
                    "id": "two",
                    "breaks": ["E"],
                    "controller": "router",
                    "common_dependencies": ["shared_core"],
                    "can_change_authority": True
                }
            ],
            "escalations": [{"source": "one", "target": "two"}]
        }
        report = analyze_review_topology(topology)
        cuts = {(x["kind"], x["id"]) for x in report["capture_cut_candidates"]}
        self.assertIn(("controller", "router"), cuts)
        self.assertIn(("common_dependency", "shared_core"), cuts)
        self.assertEqual(
            "COVERED_WITH_COMMON_MODE_EXPOSURE",
            report["calibration_state"],
        )


if __name__ == "__main__":
    unittest.main()
