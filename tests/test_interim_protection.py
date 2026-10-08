import unittest
from nomos.interim_protection import analyze_interim_protection
def valid():
    return {"cases":[{"id":"a","recall_eligible":True,"interim_measure":"suspend_adverse","ongoing_consequence":True,"ongoing_harm_assessed":True,"irreversible_delay":True,"irreversibility_response":True,"protection_granted":True,"effective_protection":True,"unreviewed_delay":True,"debt_recorded":True},{"id":"b","recall_eligible":True,"interim_measure":"no_change","reasoned_nonintervention":True}],
            "plans":[{"id":"p","cases":["a","b"],"institutional_authority":True,"written_reasons":True,"review_route":True,"notice_route":True,"review_date":"2026-11-01","sunset_or_renewal":True,"delay_debt_ledger":True,"counterparty_impact_assessed":True,"nonretroactivity_or_reversibility_assessed":True,"safe_nonidentification_allowed":True,"periodic_reassessment":True}]}
class InterimProtectionTests(unittest.TestCase):
    def test_safe(self): self.assertEqual(analyze_interim_protection(valid())["status"],"PASS")
    def check(self,code,modifier):
        p=valid();modifier(p);self.assertIn(code,[x["code"] for x in analyze_interim_protection(p)["findings"]])
    def test_dormant_harm(self): self.check("IP026",lambda p:p["cases"][0].update(ongoing_harm_assessed=False))
    def test_paper_protection(self): self.check("IP029",lambda p:p["cases"][0].update(effective_protection=False))
    def test_no_merits_revival(self): self.check("IP010",lambda p:p["plans"][0].update(automatic_merits_reversal=True))
    def test_no_adverse_revival(self): self.check("IP020",lambda p:p["plans"][0].update(expiry_silently_restores_adversity=True))
    def test_no_unreasoned_inaction(self): self.check("IP028",lambda p:p["cases"][1].update(reasoned_nonintervention=False))
    def test_debt_survival(self): self.check("IP030",lambda p:p["cases"][0].update(debt_recorded=False))
    def test_third_party(self): self.check("IP015",lambda p:p["plans"][0].update(counterparty_impact_assessed=False))
    def test_unbounded_interim(self): self.check("IP009",lambda p:p["plans"][0].update(sunset_or_renewal=False))
    def test_not_complete_by_queue(self): self.check("IP013",lambda p:p["plans"][0].update(queue_entry_counts_as_repair=True))
if __name__=="__main__":unittest.main()
