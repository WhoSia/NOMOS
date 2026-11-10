// Conservative synthetic four-dimensional verifier. NOT a legal adjudicator.
export const STATES=Object.freeze(['yes','no','unknown']);
export const KEYS=Object.freeze(['evidence','construct','authority','outcome']);
export function meet(values){
  if(values.some(x=>x==='no'))return 'no';
  if(values.some(x=>x==='unknown'))return 'unknown';
  return 'yes';
}
export function auditClaimAxes(facts){
 if(!facts || typeof facts!=='object')throw Error('facts object required');
 for(const key of KEYS)if(!STATES.includes(facts[key]))throw Error('invalid '+key);
 return {
  provenanceSupported:facts.evidence,
  constructValidity:facts.construct,
  claimUseAuthority:meet([facts.evidence,facts.construct,facts.authority]),
  downstreamOutcomeIndependentlyObserved:facts.outcome,
  completeWarrantAndOutcome:meet(KEYS.map(k=>facts[k]))
 };
}
export function enumerateAxes(){
 const records=[];
 for(let i=0;i<81;i++){
  let x=i;const f={};
  for(const k of KEYS){f[k]=STATES[x%3];x=Math.floor(x/3);}
  records.push({facts:f,result:auditClaimAxes(f)});
 }
 return records;
}
