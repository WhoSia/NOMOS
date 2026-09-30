import json
import unittest
from pathlib import Path

from nomos.review_divergence import analyze_review_divergence


ROOT = Path(__file__).resolve().parents[1]


def load(name):
    return json.loads((ROOT / "examples" / name).read_text(encoding="utf-8"))


class ReviewDivergenceTests(unittest.TestCase):
    def test_contract_mismatch_does_not_create_winner(self):
        report = analyze_review_divergence(load("review_divergence_mismatch.json"))
        self.assertEqual("DIVERGENCE_UNDERDETERMINED", report["divergence_state"])
        self.assertIn("REVIEW_CONTRACT_DIVERGENCE", report["findings"])
        self.assertIn("NO_WINNER_FROM_DISAGREEMENT_ALONE", report["findings"])
        self.assertEqual("CASE_DIAGNOSTIC_ONLY", report["policy_update_authority"])

    def test_alignment_can_localize_structural_source(self):
        report = analyze_review_divergence(load("review_divergence_localized.json"))
        self.assertEqual("STRUCTURAL_SOURCE_LOCALIZED", report["divergence_state"])
        self.assertEqual(["evidence_set", "visibility"], report["alignment_localized_coordinates"])
        self.assertEqual("POLICY_UPDATE_CANDIDATE", report["policy_update_authority"])

    def test_fully_aligned_disagreement_remains_residual(self):
        report = analyze_review_divergence(load("review_divergence_residual.json"))
        self.assertEqual("ALIGNED_RESIDUAL_DIVERGENCE", report["divergence_state"])
        self.assertEqual({}, report["contract_differences"])
        self.assertIn("RESIDUAL_JUDGMENT_DIVERGENCE", report["findings"])
        self.assertEqual("POLICY_UPDATE_HOLD", report["policy_update_authority"])

    def test_shadow_result_cannot_silently_change_live_case(self):
        case = load("review_divergence_localized.json")
        case["policy_update"]["shadow_result_directly_changes_live_case"] = True
        report = analyze_review_divergence(case)
        self.assertFalse(report["shadow_to_live_consequence_firewall"])
        self.assertIn("SHADOW_TO_LIVE_CONSEQUENCE_LEAK", report["findings"])

    def test_noncomparable_claims_are_separated(self):
        case = load("review_divergence_mismatch.json")
        case["shadow_review"]["claim"] = "future_risk_under_different_policy"
        report = analyze_review_divergence(case)
        self.assertEqual("NONCOMPARABLE_REVIEW_QUESTIONS", report["divergence_state"])
        self.assertIn("CLAIM_TARGET_MISMATCH", report["findings"])


if __name__ == "__main__":
    unittest.main()
