import json
import unittest
from pathlib import Path

from nomos.routing_learning import analyze_routing_learning


ROOT = Path(__file__).resolve().parents[1]


def load(name):
    return json.loads((ROOT / "examples" / name).read_text(encoding="utf-8"))


class RoutingLearningTests(unittest.TestCase):
    def test_self_sealing_revision_is_held(self):
        report = analyze_routing_learning(load("routing_learning_self_sealing.json"))
        self.assertEqual("REVISION_IDENTIFIABILITY_HOLD", report["revision_state"])
        codes = set(report["findings"])
        self.assertIn("SELECTIVE_ROUTING_FEEDBACK", codes)
        self.assertIn("RAW_COUNT_SELF_CONFIRMATION", codes)
        self.assertIn("ON_POLICY_SELF_EVALUATION_GAP", codes)
        self.assertEqual(2, len(report["raw_count_self_confirmation"]))

    def test_raw_count_decline_does_not_imply_rate_improvement(self):
        report = analyze_routing_learning(load("routing_learning_self_sealing.json"))
        rows = report["epochs"]
        self.assertEqual(0.5, rows[0]["correction_rates"]["deep_review"])
        self.assertEqual(0.5, rows[1]["correction_rates"]["deep_review"])
        self.assertEqual(0.5, rows[2]["correction_rates"]["deep_review"])

    def test_independent_channels_can_support_revision_candidate(self):
        report = analyze_routing_learning(load("routing_learning_audited.json"))
        self.assertEqual("REVISION_IDENTIFIABILITY_CANDIDATE", report["revision_state"])
        self.assertIn("independent_audit", report["independent_learning_channels"])
        self.assertIn("shadow_review", report["independent_learning_channels"])
        self.assertFalse(report["on_policy_self_evaluation_gap"])

    def test_withholding_entitled_review_for_exploration_is_rejected(self):
        case = load("routing_learning_audited.json")
        case["exploration_requires_withholding_entitled_review"] = True
        report = analyze_routing_learning(case)
        self.assertEqual("REVISION_METHOD_REJECTED", report["revision_state"])
        self.assertIn("UNSAFE_EXPLORATION_PROPOSAL", report["findings"])

    def test_revision_provenance_gap_is_governance_hold(self):
        case = load("routing_learning_audited.json")
        case["epochs"][0]["revision"]["provenance"] = None
        report = analyze_routing_learning(case)
        self.assertEqual("REVISION_GOVERNANCE_HOLD", report["revision_state"])
        self.assertIn("REVISION_PROVENANCE_GAP", report["findings"])


if __name__ == "__main__":
    unittest.main()
