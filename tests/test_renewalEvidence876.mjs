import assert from 'node:assert/strict';
import {assessRenewalEvidence876,compatibleCausalWorlds876,compareFrozenRuns876} from '../tools/renewalEvidence876.mjs';
const good={
 evidence:{independentlyVerified:true,sourceId:'source-1'},
 delivery:{recipientAcknowledged:true,receiptId:'delivery-2'},
 review:{evidenceConsidered:true,decisionId:'case-review-3',hasCaseRemedyPower:true,
   caseDecisionChanged:true,changedDecisionReadback:'case-4'},
 system:{escalationAcknowledged:true,escalationReceipt:'system-5',hasRuleRevisionPower:true,
   ruleChanged:true,ruleVersionReadback:'policy-6'},
 effects:{independentlyObserved:true,observationReceipt:'effects-7'}
};
const clone=x=>structuredClone(x);
assert.equal(assessRenewalEvidence876(good).routeStatus,'DECLARED_PATH_OBSERVED');
assert.equal(assessRenewalEvidence876(good).policyCausalEffect,'NOT_IDENTIFIED_FROM_PATH_OR_BEFORE_AFTER');
let p=clone(good);p.delivery.receiptId='';
assert.equal(assessRenewalEvidence876(p).firstUnwitnessed,'delivery');
assert(assessRenewalEvidence876(p).warnings.includes('REVIEW_WITHOUT_DELIVERY_RECEIPT'));
p=clone(good);p.review.hasCaseRemedyPower=false;
assert.equal(assessRenewalEvidence876(p).firstUnwitnessed,null);
assert(assessRenewalEvidence876(p).warnings.includes('CASE_CHANGE_WITHOUT_CASE_REMEDY_AUTHORITY'));
p=clone(good);p.review.caseDecisionChanged=false;
assert.equal(assessRenewalEvidence876(p).routeStatus,'DECLARED_PATH_OBSERVED');
p=clone(good);p.system.escalationReceipt=null;
assert.equal(assessRenewalEvidence876(p).firstUnwitnessed,'policyEscalation');
p=clone(good);p.system.hasRuleRevisionPower=false;
assert(assessRenewalEvidence876(p).warnings.includes('POLICY_CHANGE_WITHOUT_AUTHORITY'));
p=clone(good);p.system.ruleChanged=false;
assert.equal(assessRenewalEvidence876(p).firstUnwitnessed,'policyChange');
assert(assessRenewalEvidence876(p).warnings.includes('EFFECT_WITHOUT_POLICY_CHANGE_PROVENANCE'));
p=clone(good);p.effects.independentlyObserved=false;
assert.equal(assessRenewalEvidence876(p).firstUnwitnessed,'effectReadback');
for(const result of ['RENEW','REVISE']){
 const worlds=compatibleCausalWorlds876({observedWithEvidence:result});
 assert(worlds.bothMatchObservedRecord&&!worlds.evidenceEffectIdentified);
 assert.notEqual(worlds.modelNoEffect.withoutEvidence,worlds.modelEvidenceMatters.withoutEvidence);
}
const matched=compareFrozenRuns876(
 {contextDigest:'snapshot-1',evidencePresent:false,decision:'RENEW'},
 {contextDigest:'snapshot-1',evidencePresent:true,decision:'REVISE'});
assert.equal(matched.structuralContrast,'DECISION_DIFFERENCE');
assert.equal(matched.realWorldCausalEffect,'NOT_IDENTIFIED');
assert.equal(compareFrozenRuns876(
 {contextDigest:'a',evidencePresent:false,decision:'RENEW'},
 {contextDigest:'b',evidencePresent:true,decision:'REVISE'}).structuralContrast,'INVALID_OR_UNMATCHED_PAIR');
assert.throws(()=>compatibleCausalWorlds876({observedWithEvidence:'UNKNOWN'}),TypeError);
console.log('NOMOS-0.876 evidence-to-renewal synthetic tests PASS');
