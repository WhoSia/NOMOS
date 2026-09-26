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
        self.assertEqual(
            [
                ["query_review_primary", "evidence_model_review", "remedy_panel"],
                ["evidence_model_review", "remedy_panel", "query_review_duplicate"],
            ],
            result,
        )

    def test_common_mode_duplicate_is_detected(self):
        report = analyze_review_topology(load_topology())
        kinds = {
            (x["dimension"], x["kind"])
            for x in report["common_mode_exposures"]
        }
        self.assertIn(("Q", "single_controller"), kinds)
        self.assertIn(("Q", "shared_dependency"), kinds)
        self.assertEqual(
            "COVERED_WITH_COMMON_MODE_EXPOSURE",
            report["calibration_state"],
        )

    def test_authority_changer_is_reachable(self):
        report = analyze_review_topology(load_topology())
        self.assertEqual(["remedy_panel"], report["reachable_authority_changers"])
        self.assertFalse(report["fragmentation_risk"])

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


if __name__ == "__main__":
    unittest.main()
