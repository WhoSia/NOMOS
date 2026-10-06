import unittest

from nomos.correction_compaction import (
    analyze_correction_compaction,
    compaction_debt,
)


class CorrectionCompactionTests(unittest.TestCase):
    def test_safe_sealed_historical_retirement_passes(self):
        packet = {
            "branches": [
                {
                    "id": "b1",
                    "state": "live_governing",
                    "events": ["e1", "e2"],
                    "current_governing": False,
                    "unresolved_conflict": False,
                    "has_supersession_history": True,
                    "had_conflict": True,
                    "privacy_sensitive": True,
                    "required_tasks": ["explain", "contest", "attribute"],
                }
            ],
            "snapshots": [
                {
                    "id": "s1",
                    "covers": ["e1", "e2"],
                    "supported_tasks": ["explain", "contest", "attribute"],
                    "lossy": True,
                    "preserved": {
                        "coverage": True,
                        "provenance": True,
                        "supersession_map": True,
                        "conflict_map": True,
                        "attribution": True,
                        "integrity_witness": True,
                    },
                }
            ],
            "proposals": [
                {
                    "id": "p1",
                    "branch": "b1",
                    "snapshot": "s1",
                    "action": "compact_to_snapshot",
                    "target_state": "historical_reopenable",
                    "retention_visibility": "sealed",
                }
            ],
            "completion_claim": "complete",
        }
        result = analyze_correction_compaction(packet)
        self.assertEqual("PASS", result["status"])
        self.assertEqual([], result["proposals"][0]["compaction_debt"])

    def test_conflict_flattening_fails(self):
        packet = {
            "branches": [
                {
                    "id": "b1",
                    "state": "live_conflict",
                    "events": ["e1", "e2"],
                    "current_governing": False,
                    "unresolved_conflict": False,
                    "had_conflict": True,
                    "required_tasks": ["explain", "contest"],
                }
            ],
            "snapshots": [
                {
                    "id": "s1",
                    "covers": ["e1", "e2"],
                    "supported_tasks": ["explain", "contest"],
                    "preserved": {
                        "coverage": True,
                        "provenance": True,
                        "conflict_map": False,
                        "integrity_witness": True,
                    },
                }
            ],
            "proposals": [
                {
                    "id": "p1",
                    "branch": "b1",
                    "snapshot": "s1",
                    "target_state": "historical_reopenable",
                }
            ],
        }
        result = analyze_correction_compaction(packet)
        self.assertIn("GC014", {f["code"] for f in result["findings"]})

    def test_open_consequence_cannot_be_orphaned(self):
        packet = {
            "branches": [
                {
                    "id": "b1",
                    "state": "live_governing",
                    "events": ["e1"],
                    "current_governing": False,
                    "open_consequence": True,
                    "required_tasks": ["consequence"],
                }
            ],
            "snapshots": [
                {
                    "id": "s1",
                    "covers": ["e1"],
                    "supported_tasks": ["consequence"],
                    "preserved": {
                        "coverage": True,
                        "provenance": True,
                        "consequence_links": True,
                        "integrity_witness": True,
                    },
                }
            ],
            "proposals": [
                {
                    "id": "p1",
                    "branch": "b1",
                    "snapshot": "s1",
                    "target_state": "historical_reopenable",
                }
            ],
        }
        result = analyze_correction_compaction(packet)
        self.assertIn("GC007", {f["code"] for f in result["findings"]})

    def test_compaction_debt_is_task_relative(self):
        packet = {
            "branches": [
                {
                    "id": "b1",
                    "state": "historical_reopenable",
                    "required_tasks": ["explain", "contest", "reconstruct"],
                }
            ],
            "snapshots": [
                {
                    "id": "s1",
                    "supported_tasks": ["explain"],
                }
            ],
        }
        self.assertEqual(
            ["contest", "reconstruct"],
            compaction_debt(packet, "b1", "s1"),
        )

    def test_open_future_lossy_universal_claim_fails(self):
        packet = {
            "branches": [
                {
                    "id": "b1",
                    "state": "live_governing",
                    "events": ["e1"],
                    "current_governing": False,
                    "future_dispute_class": "open",
                    "required_tasks": ["explain"],
                }
            ],
            "snapshots": [
                {
                    "id": "s1",
                    "covers": ["e1"],
                    "supported_tasks": ["explain"],
                    "lossy": True,
                    "universal_sufficiency_claim": True,
                    "preserved": {
                        "coverage": True,
                        "provenance": True,
                        "integrity_witness": True,
                    },
                }
            ],
            "proposals": [
                {
                    "id": "p1",
                    "branch": "b1",
                    "snapshot": "s1",
                    "target_state": "historical_reopenable",
                }
            ],
        }
        result = analyze_correction_compaction(packet)
        self.assertIn("GC019", {f["code"] for f in result["findings"]})

    def test_historical_retention_cannot_be_routine_current_retrieval(self):
        packet = {
            "branches": [
                {
                    "id": "b1",
                    "state": "live_governing",
                    "events": ["e1"],
                    "current_governing": False,
                    "required_tasks": ["explain"],
                }
            ],
            "snapshots": [
                {
                    "id": "s1",
                    "covers": ["e1"],
                    "supported_tasks": ["explain"],
                    "preserved": {
                        "coverage": True,
                        "provenance": True,
                        "integrity_witness": True,
                    },
                }
            ],
            "proposals": [
                {
                    "id": "p1",
                    "branch": "b1",
                    "snapshot": "s1",
                    "target_state": "historical_reopenable",
                    "routine_current_retrieval": True,
                }
            ],
        }
        result = analyze_correction_compaction(packet)
        self.assertIn("GC022", {f["code"] for f in result["findings"]})


if __name__ == "__main__":
    unittest.main()
