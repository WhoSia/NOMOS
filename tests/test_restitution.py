import unittest
from nomos.restitution import analyze_restitution
def fixture():
    return {"cases":[{"id":"a","historical_recall_valid":True,"review_complete":True,"case_claim":"review_complete","unrecovered_opportunity":True,"opportunity_receipt":True,"remaining_harm":True,"harm_receipt":True,"residual_status":"acknowledged","third_party_reliance":True,"reliance_disposition":True,"interim_expired":True,"post_expiry_effect_reviewed":True}],
    "plans":[{"id":"p","cases":["a"],"independent_closure_authority":True,"written_closure_reasons":True,"contestable_closure":True,"individual_notice":True,"downstream_recipient_audit":True,"third_party_interests_assessed":True,"restoration_scope_defined":True,"uncertainty_receipt":True,"independent_debt_ledger":True,"completion_claim":"bounded_review_complete","remainder_exists":True}]}
class RestitutionTests(unittest.TestCase):
    def test_safe(self):self.assertEqual(analyze_restitution(fixture())["status"],"PASS")
    def test_no_plans(self):self.assertEqual(analyze_restitution({})["status"],"FAIL")
    def check(self,code,field,value,case=False):
        p=fixture();(p["cases"][0] if case else p["plans"][0])[field]=value
        self.assertIn(code,{f["code"] for f in analyze_restitution(p)["findings"]})
    def test_review_not_repair(self):self.check("RD009","treats_review_as_restitution",True)
    def test_payment_not_total(self):self.check("RD010","treats_money_as_total_repair",True)
    def test_interim_expiry(self):self.check("RD030","post_expiry_effect_reviewed",False,True)
    def test_lost_opportunity(self):self.check("RD025","opportunity_receipt",False,True)
    def test_reliance(self):self.check("RD027","reliance_disposition",False,True)
    def test_discharge(self):p=fixture();p["cases"][0]["unresolved_tasks"]=["compensate"];p["cases"][0]["debt_claim"]="discharged";self.assertIn("RD031",{f["code"] for f in analyze_restitution(p)["findings"]})
    def test_false_completion(self):self.check("RD020","completion_claim","complete")
    def test_live_copy(self):self.check("RD029","downstream_copy_live",True,True)
if __name__=="__main__":unittest.main()
