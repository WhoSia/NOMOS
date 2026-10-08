import unittest
from nomos.joint_repair import analyze_joint_repair
def good():
    return {"plans":[{"id":"joint","agencies":[{"id":"archive","capabilities":["records"]},{"id":"review","capabilities":["adjudication"]},{"id":"finance","capabilities":["payment"]}],"tasks":[{"id":"restore","required_capabilities":["records","adjudication","payment"],"responsible_agency":"review","contributors":["archive","finance"],"handoff_warrant":True,"independent_end_to_end_evidence":True,"completion_claim":"complete","budget_holder":"finance"}],"joint_protocol":True,"accountable_coordinator":"review","interinstitutional_access_warrant":True,"privacy_minimization":True,"cross_agency_provenance":True,"affected_person_notice":True,"single_accessible_challenge":True,"independent_joint_review":True,"coordination_capacity":True,"interim_continuity":True,"shared_debt_ledger":True}]}
class JointRepairTests(unittest.TestCase):
    def test_safe(self):self.assertEqual(analyze_joint_repair(good())["status"],"PASS")
    def test_vacuous(self):self.assertEqual(analyze_joint_repair({})["status"],"FAIL")
    def check(self,code,mutate):
        p=good();mutate(p);self.assertIn(code,{f["code"] for f in analyze_joint_repair(p)["findings"]})
    def test_missing_capability(self):self.check("JC025",lambda p:p["plans"][0]["tasks"][0]["contributors"].remove("finance"))
    def test_false_joint_completion(self):self.check("JC020",lambda p:p["plans"][0].update(joint_completion_claim="complete",residual_dependencies=["recipient"]))
    def test_no_merits_authority(self):self.check("JC006",lambda p:p["plans"][0].update(coordinator_has_universal_merits_power=True))
    def test_veto(self):self.check("JC018",lambda p:p["plans"][0].update(veto_without_review=True))
    def test_handoff(self):self.check("JC026",lambda p:p["plans"][0]["tasks"][0].update(handoff_warrant=False))
    def test_appeal_fragment(self):self.check("JC011",lambda p:p["plans"][0].update(single_accessible_challenge=False))
if __name__=="__main__":unittest.main()
