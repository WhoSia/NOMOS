import unittest
from nomos.successor_duties import analyze_successor_duties
def good():
    return {"plans":[{"id":"migration","defunct_institution":True,"transition_evidence":True,"separate_authorities":True,"continuity_ledger":True,"affected_party_notice":True,"contestable_allocation":True,"independent_oversight":True,"record_handoff_receipt":True,"privacy_scope_reviewed":True,"interim_consequence_continuity":True,"recipient_graph_continuity":True,"duties":[{"id":"records","type":"record_custody","status":"assigned","responsible_institution":"archive","authority_evidence":True},{"id":"restitution","type":"restitution","status":"orphan_hold","escalation_route":"independent_review","records_accessible":True}]}]}
class SuccessionTests(unittest.TestCase):
    def test_safe(self):self.assertEqual(analyze_successor_duties(good())["status"],"PASS")
    def test_empty(self):self.assertEqual(analyze_successor_duties({})["status"],"FAIL")
    def check(self,code,mutate):
        p=good();mutate(p);self.assertIn(code,[f["code"] for f in analyze_successor_duties(p)["findings"]])
    def test_custody_liability(self):self.check("SD011",lambda p:p["plans"][0].update(custody_implies_liability=True))
    def test_automatic_liability(self):self.check("SD017",lambda p:p["plans"][0].update(automatic_universal_successor_liability=True))
    def test_orphan_unrouted(self):self.check("SD025",lambda p:p["plans"][0]["duties"][1].update(escalation_route=None))
    def test_unsupported_assignment(self):self.check("SD024",lambda p:p["plans"][0]["duties"][0].update(authority_evidence=False))
    def test_abolition_release(self):self.check("SD010",lambda p:p["plans"][0].update(closure_by_abolition=True))
    def test_false_completion(self):self.check("SD031",lambda p:p["plans"][0].update(full_repair_complete=True))
    def test_lost_notice(self):self.check("SD006",lambda p:p["plans"][0].update(affected_party_notice=False))
if __name__=="__main__":unittest.main()
