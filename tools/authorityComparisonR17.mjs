// Synthetic baseline contrast, not predictive accuracy or legal compliance assessment.
export function compareAuthority(c){
 if(!c?.id||!c.claim)throw Error('case required');
 const b0=c.documentary===true?'accepts_source':'no_source';
 const b1=c.claim==='legal_order_ended'&&c.purpose==='legal_status'?'bounded_documentary_claim':c.claim==='specific_prior_recipient_duty'&&c.statutory_trigger==='conditional_trigger_met'?'modeled_duty_only':c.claim==='specific_prior_recipient_duty'&&c.statutory_trigger==='not_triggered'?'no_modeled_duty':'not_established';
 const graph=b1; // Explicit null novelty: same decisions, while graph may aid traceability.
 return {id:c.id,provenanceOnly:b0,strongLegalAudit:b1,claimGraph:graph,addedDecisionDiscrimination:graph!==b1};
}
export function compareCases(v){if(!Array.isArray(v?.cases))throw Error('cases required');return v.cases.map(compareAuthority)}
