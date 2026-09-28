import json
import unittest
from pathlib import Path

from nomos.router import analyze_router


ROOT = Path(__file__).resolve().parents[1]


def load(name):
    return json.loads((ROOT / "examples" / name).read_text(encoding="utf-8"))


class RouterTests(unittest.TestCase):
    def test_contestable_router_candidate(self):
        report = analyze_router(load("router_contestable.json"))
        self.assertEqual("ROUTING_CONTESTABLE_CANDIDATE", report["routing_state"])
        self.assertEqual([], report["findings"])
        self.assertEqual(2, len(report["material_assignments"]))
        self.assertTrue(report["router_reviewable"])

    def test_capture_router_is_detected(self):
        report = analyze_router(load("router_capture.json"))
        self.assertEqual("META_AUTHORITY_CAPTURE_RISK", report["routing_state"])
        codes = set(report["findings"])
        self.assertIn("ROUTING_PROVENANCE_GAP", codes)
        self.assertIn("MATERIAL_ROUTING_WITHOUT_COUNTER_ROUTE", codes)
        self.assertIn("UNEXPLAINED_MATERIAL_ROUTE_EXCLUSION", codes)
        self.assertIn("OUTCOME_SENSITIVE_ROUTING_RULE", codes)
        self.assertIn("UNFROZEN_ROUTING_RULE", codes)
        self.assertIn("TRIGGER_PROVENANCE_GAP", codes)
        self.assertIn("UNREVIEWABLE_ROUTER_CONCENTRATION", codes)

    def test_material_route_effects_are_explicit(self):
        report = analyze_router(load("router_contestable.json"))
        ordinary = report["route_effects"]["ordinary_review"]
        deep = report["route_effects"]["deep_review"]
        self.assertNotEqual(ordinary["visibility"], deep["visibility"])
        self.assertNotEqual(ordinary["breaks"], deep["breaks"])
        self.assertNotEqual(ordinary["remedies"], deep["remedies"])

    def test_reviewable_router_needs_review_route(self):
        case = load("router_contestable.json")
        case["router_review_route"] = None
        report = analyze_router(case)
        self.assertIn("ROUTER_REVIEW_ROUTE_UNSPECIFIED", report["findings"])


if __name__ == "__main__":
    unittest.main()
