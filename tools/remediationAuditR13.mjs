// Read-only documentation completeness, never compliance or causal-outcome scoring.
export function auditCase(c){
 if(!c||!c.id||!Array.isArray(c.observations)||!Array.isArray(c.not_observed))throw Error('invalid case');
 const obs=new Set(c.observations),abs=new Set(c.not_observed);
 const contradictory=[...obs].filter(x=>abs.has(x));
 const legalClosure=c.order_status==='terminated_2025-05-12';
 const b0={legalClosure};
 const b1={legalClosure,orderFiled:obs.has('order_filed'),regulatorAggregateFulfillment:obs.has('regulator_reports_at_least_259m_redress_fulfillment'),publicIndividualOutcomeEstablished:obs.has('specific_individual_downstream_outcome')};
 const proposal={...b1,remedyTypes:c.remedy_type??[],unknownScopes:[...abs],contradictory};
 return {id:c.id,baselineClosureOnly:b0,strongSourceBaseline:b1,typedLedger:proposal,verdict:'individual_outcome_not_established_by_ledger'};
}
export function auditCases(data){if(!Array.isArray(data?.cases))throw Error('cases required');return data.cases.map(auditCase);}
