import json
import unittest
from pathlib import Path

from nomos.audit import audit_case
from nomos.lineage import trace_record


ROOT = Path(__file__).resolve().parents[1]


def load(name: str):
    return json.loads((ROOT / "examples" / name).read_text(encoding="utf-8"))


class AuditTests(unittest.TestCase):
    def test_shared_success_passes(self):
        findings = audit_case(load("shared_success.json"))
        self.assertEqual([], [f for f in findings if f.severity == "ERROR"])

    def test_invalid_person_inference_fails_core_guards(self):
        findings = audit_case(load("invalid_person_inference.json"))
        codes = {f.code for f in findings}
        self.assertTrue({"N001", "N006", "N007", "N010"}.issubset(codes))

    def test_causal_contribution_is_not_blame(self):
        case = load("shared_success.json")
        case["attributions"].append({
            "actor": "institution",
            "outcome": "success",
            "mode": "credit",
            "causal_contribution": "enabling",
        })
        codes = {f.code for f in audit_case(case)}
        self.assertIn("N002", codes)

    def test_cross_regime_transport_requires_warrant(self):
        case = load("shared_success.json")
        case["claims"].append({
            "id": "c2",
            "text": "Success persists in an unsupported regime.",
            "scope": "bounded_action",
            "regime": "unsupported",
            "target": "future_ordinary",
        })
        case["edges"].append({"source": "ev1", "target": "c2", "kind": "supports"})
        codes = {f.code for f in audit_case(case)}
        self.assertIn("N004", codes)

    def test_sealed_attribution_persistence_passes(self):
        findings = audit_case(load("derived_record_valid.json"))
        self.assertEqual([], [f for f in findings if f.severity == "ERROR"])

    def test_dependency_erasure_fails(self):
        codes = {f.code for f in audit_case(load("dependency_erasure.json"))}
        self.assertTrue({"N013", "N014", "N016"}.issubset(codes))

    def test_portable_support_dependent_record_needs_semantic_warrant(self):
        case = load("derived_record_valid.json")
        record = case["derived_records"][0]
        record["semantic_equivalence"] = False
        codes = {f.code for f in audit_case(case)}
        self.assertIn("N015", codes)

    def test_sensitive_provenance_can_remain_sealed(self):
        findings = audit_case(load("derived_record_valid.json"))
        self.assertNotIn("N017", {f.code for f in findings})

    def test_trace_record_closes_over_evidence_provenance(self):
        trace = trace_record(load("derived_record_valid.json"), "r1")
        self.assertEqual(["ev1", "event1", "s1"], trace["dependency_closure"])


if __name__ == "__main__":
    unittest.main()
