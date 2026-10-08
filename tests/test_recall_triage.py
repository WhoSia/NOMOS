import unittest
from nomos.recall_triage import analyze_recall_triage

def safe():
    return {"cases":[{"id":"a","recall_eligible":True,"current_consequence":"ongoing_adverse","interim_status_assessed":True,"deadline_material":True,"deadline_considered":True},{"id":"b","recall_eligible":True}],
    "plans":[{"id":"p","order":["a","b"],"capacity_per_period":1,"priority_basis":"ongoing_consequence","notice_for_all":True,"interim_protections":True,"published_policy":True,"contestable_order":True,"reason_receipts":True,"independent_review":True,"delay_impact_audit":True,"periodic_reassessment":True,"accessibility_route":True}]}
class RecallTriageTests(unittest.TestCase):
    def test_safe(self): self.assertEqual(analyze_recall_triage(safe())["status"],"PASS")
    def test_invalid_label(self):
        p=safe(); p["plans"][0]["uses_old_adverse_label_as_urgency"]=True
        self.assertIn("QT008",{f["code"] for f in analyze_recall_triage(p)["findings"]})
    def test_ongoing_harm_requires_interim_assessment(self):
        p=safe(); p["cases"][0]["interim_status_assessed"]=False
        self.assertIn("QT027",{f["code"] for f in analyze_recall_triage(p)["findings"]})
    def test_no_silent_omission(self):
        p=safe(); p["plans"][0]["order"]=["a"]
        self.assertIn("QT003",{f["code"] for f in analyze_recall_triage(p)["findings"]})
    def test_no_merits_reattribution(self):
        p=safe(); p["plans"][0]["review_order_reauthorizes_judgment"]=True
        self.assertIn("QT006",{f["code"] for f in analyze_recall_triage(p)["findings"]})
    def test_fcfs_access_bias(self):
        p=safe(); p["plans"][0]["first_come_first_served"]=True
        self.assertIn("QT018",{f["code"] for f in analyze_recall_triage(p)["findings"]})
    def test_indefinite_deferral(self):
        p=safe(); p["plans"][0]["indefinite_deferral_allowed"]=True
        self.assertIn("QT021",{f["code"] for f in analyze_recall_triage(p)["findings"]})
    def test_emergency_governance(self):
        p=safe(); p["plans"][0]["emergency_override"]=True
        self.assertIn("QT025",{f["code"] for f in analyze_recall_triage(p)["findings"]})
if __name__=="__main__": unittest.main()
