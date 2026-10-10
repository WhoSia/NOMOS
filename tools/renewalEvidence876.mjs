/** NOMOS-0.876: bounded audit of evidence-to-renewal claims. NOT a legal adjudicator. */
const receipt = x => typeof x === 'string' && x.trim().length > 0;
const yes = x => x === true;
export function assessRenewalEvidence876(p = {}) {
  const e=p.evidence??{},d=p.delivery??{},r=p.review??{},s=p.system??{},y=p.effects??{};
  const stages={
    independentEvidence:yes(e.independentlyVerified)&&receipt(e.sourceId),
    delivery:yes(d.recipientAcknowledged)&&receipt(d.receiptId),
    review:yes(r.evidenceConsidered)&&yes(r.hasCaseRemedyPower)&&receipt(r.decisionId),
    caseChange:yes(r.caseDecisionChanged)&&receipt(r.changedDecisionReadback),
    policyEscalation:yes(s.escalationAcknowledged)&&receipt(s.escalationReceipt),
    policyAuthority:yes(s.hasRuleRevisionPower),
    policyChange:yes(s.ruleChanged)&&receipt(s.ruleVersionReadback),
    effectReadback:yes(y.independentlyObserved)&&receipt(y.observationReceipt),
  };
  const warnings=[];
  if(stages.delivery&&!stages.independentEvidence)warnings.push('DELIVERY_WITHOUT_VERIFIED_EVIDENCE');
  if(stages.review&&!stages.delivery)warnings.push('REVIEW_WITHOUT_DELIVERY_RECEIPT');
  if(stages.caseChange&&!stages.review)warnings.push('CASE_CHANGE_WITHOUT_REVIEW_CONTRACT');
  if(stages.policyChange&&!stages.policyAuthority)warnings.push('POLICY_CHANGE_WITHOUT_AUTHORITY');
  if(stages.policyChange&&!stages.policyEscalation)warnings.push('POLICY_CHANGE_WITHOUT_ESCALATION_RECEIPT');
  if(stages.effectReadback&&!stages.policyChange)warnings.push('EFFECT_WITHOUT_POLICY_CHANGE_PROVENANCE');
  const firstUnwitnessed=Object.keys(stages).find(k=>!stages[k])??null;
  return {stages,firstUnwitnessed,warnings,
    routeStatus:firstUnwitnessed||warnings.length?'BOUNDED_EVIDENCE_GAP':'DECLARED_PATH_OBSERVED',
    policyCausalEffect:'NOT_IDENTIFIED_FROM_PATH_OR_BEFORE_AFTER',legalMerits:'NOT_ASSESSED'};
}
/** Two worlds can agree on an observed renewal and disagree on evidence effect. */
export function compatibleCausalWorlds876({observedWithEvidence}={}) {
  if(!['RENEW','REVISE'].includes(observedWithEvidence))
    throw new TypeError('Specify observed RENEW or REVISE decision.');
  const opposite=observedWithEvidence==='RENEW'?'REVISE':'RENEW';
  return {observedWithEvidence,
    modelNoEffect:{withoutEvidence:observedWithEvidence,withEvidence:observedWithEvidence},
    modelEvidenceMatters:{withoutEvidence:opposite,withEvidence:observedWithEvidence},
    bothMatchObservedRecord:true,evidenceEffectIdentified:false};
}
/** Synthetic frozen-context sensitivity is not the causal effect of real-world review. */
export function compareFrozenRuns876(before={},after={}) {
  const valid=receipt(before.contextDigest)&&before.contextDigest===after.contextDigest
    &&before.evidencePresent===false&&after.evidencePresent===true
    &&receipt(before.decision)&&receipt(after.decision);
  return {structuralContrast:valid?(before.decision===after.decision?'NO_DECISION_DIFFERENCE':'DECISION_DIFFERENCE'):'INVALID_OR_UNMATCHED_PAIR',
    realWorldCausalEffect:'NOT_IDENTIFIED',legalAuthority:'NOT_CERTIFIED'};
}
