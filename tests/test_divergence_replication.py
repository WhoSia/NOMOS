import json
import unittest
from pathlib import Path

from nomos.divergence_replication import analyze_divergence_replication


ROOT = Path(__file__).resolve().parents[1]


def load(name):
    return json.loads((ROOT / "examples" / name).read_text(encoding="utf-8"))


class DivergenceReplicationTests(unittest.TestCase):
    def test_transportable_systematic_candidate(self):
        report = analyze_divergence_replication(load("divergence_replication_systematic.json"))
        self.assertEqual("TRANSPORTABLE_SYSTEMATIC_CANDIDATE", report["systematic_state"])
        self.assertEqual(4, report["independent_cluster_count"])
        self.assertIn("ROW_REPETITION_IS_NOT_INDEPENDENT_REPLICATION", report["findings"])
        self.assertTrue(report["reviewer_substitution_ok"])
        self.assertTrue(report["case_mix_replication_ok"])
        self.assertTrue(report["transport_ok"])
        self.assertTrue(report["adjudicator_calibration_ok"])

    def test_reviewer_conditional_surface(self):
        report = analyze_divergence_replication(load("divergence_replication_reviewer_conditional.json"))
        self.assertEqual("REVIEWER_CONDITIONAL_SURFACE", report["systematic_state"])
        self.assertFalse(report["reviewer_substitution_ok"])

    def test_case_mix_conditional_surface(self):
        report = analyze_divergence_replication(load("divergence_replication_case_mix.json"))
        self.assertEqual("CASE_MIX_CONDITIONAL_SURFACE", report["systematic_state"])
        self.assertTrue(report["reviewer_substitution_ok"])
        self.assertFalse(report["case_mix_replication_ok"])

    def test_transport_gap_holds_systematic_claim(self):
        report = analyze_divergence_replication(load("divergence_replication_transport_hold.json"))
        self.assertEqual("SYSTEMATIC_CLAIM_HOLD_TRANSPORT", report["systematic_state"])
        self.assertFalse(report["transport_ok"])

    def test_adjudicator_calibration_is_not_optional_when_load_bearing(self):
        case = load("divergence_replication_systematic.json")
        case["adjudicator_calibration"]["status"] = "UNKNOWN"
        report = analyze_divergence_replication(case)
        self.assertEqual("SYSTEMATIC_CLAIM_HOLD_ADJUDICATOR", report["systematic_state"])
        self.assertIn("ADJUDICATOR_CALIBRATION_GAP", report["findings"])


if __name__ == "__main__":
    unittest.main()
