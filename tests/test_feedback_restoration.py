import json
import unittest
from pathlib import Path

from nomos.feedback_restoration import (
    analyze_feedback_restoration,
    minimal_safe_restoration_sets,
)


ROOT = Path(__file__).resolve().parents[1]


def load(name):
    return json.loads((ROOT / "examples" / name).read_text(encoding="utf-8"))


class FeedbackRestorationTests(unittest.TestCase):
    def test_safe_fixture_has_minimal_cover(self):
        report = analyze_feedback_restoration(load("feedback_restoration_safe.json"))
        self.assertEqual("SAFE_RESTORATION_CANDIDATE", report["restoration_state"])
        self.assertEqual([], report["uncovered_regions"])
        self.assertTrue(report["minimal_safe_restoration_sets"])

    def test_minimal_sets_are_inclusion_minimal(self):
        case = load("feedback_restoration_safe.json")
        sets = minimal_safe_restoration_sets(case)
        for group in sets:
            self.assertIn("shadow_complex", group)
            self.assertIn("natural_overlap_missed", group)
            self.assertEqual(3, len(group))

    def test_uncovered_live_region_is_hold(self):
        report = analyze_feedback_restoration(load("feedback_restoration_hold.json"))
        self.assertEqual("RESTORATION_COVERAGE_HOLD", report["restoration_state"])
        self.assertIn("routed_away_complex", report["uncovered_regions"])
        self.assertIn("LIVE_DEFEAT_REGION_UNCOVERED", report["findings"])

    def test_harmful_exploration_is_rejected(self):
        report = analyze_feedback_restoration(load("feedback_restoration_unsafe.json"))
        self.assertEqual("RESTORATION_METHOD_REJECTED", report["restoration_state"])
        self.assertIn("UNSAFE_RESTORATION_METHOD_PRESENT", report["findings"])
        reasons = {
            reason
            for item in report["rejected_methods"]
            for reason in item["reasons"]
        }
        self.assertIn("WITHHOLDS_ENTITLED_REVIEW", reasons)

    def test_shadow_review_requires_consequence_firewall(self):
        case = load("feedback_restoration_safe.json")
        for method in case["methods"]:
            if method["id"] == "shadow_complex":
                method["result_can_change_live_consequence"] = None
        report = analyze_feedback_restoration(case)
        self.assertEqual("RESTORATION_GOVERNANCE_HOLD", report["restoration_state"])
        self.assertIn("SHADOW_CONSEQUENCE_FIREWALL_GAP", report["findings"])

    def test_randomization_only_among_acceptable_options(self):
        case = load("feedback_restoration_safe.json")
        for method in case["methods"]:
            if method["id"] == "randomized_tie_break_optional":
                method["all_options_independently_acceptable"] = False
        report = analyze_feedback_restoration(case)
        rejected = {x["method"] for x in report["rejected_methods"]}
        self.assertIn("randomized_tie_break_optional", rejected)


if __name__ == "__main__":
    unittest.main()
