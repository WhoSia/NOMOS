// Toy model of claim-use warrant visibility. No legal or moral judgments about people.
export function auditInferenceWorld(w){
 if(!w?.flow||!w?.knowledge||!w?.decision)throw Error('world requires flow knowledge decision');
 const {flow,decision:d}=w;
 if(flow.authorized!==true||w.knowledge.recipient_knows_derived_attribute!==true)return {id:w.id,flowAndInferenceEstablished:false,authorityStatus:'not_established'};
 const matches=flow.purpose===d.use && d.scope==='case_X' && d.claim==='case_fact_observed';
 const status= d.warrant_present===false?'warrant_absent_in_synthetic_input':
 d.warrant_present!==true?'warrant_unknown':
 matches && d.contestability_specified===true?'synthetically_warranted':'warrant_scope_not_established';
 return {id:w.id,flowAndInferenceEstablished:true,authorityStatus:status};
}
export function auditWorlds(x){if(!Array.isArray(x?.worlds))throw Error('worlds required');return x.worlds.map(auditInferenceWorld);}
