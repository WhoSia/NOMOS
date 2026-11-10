// Synthetic observational equivalence and mechanism taxonomy. Not an authority adjudicator.
const MECHANISMS=new Set(['tie','similarity','difference']);
export function auditDependency(x){
 if(!x?.observed||!MECHANISMS.has(x.mechanism)||typeof x.basis!=='string')throw Error('malformed dependency');
 if(!['unknown','asserted_yes','asserted_no'].includes(x.authority))throw Error('invalid authority label');
 return {id:x.id,mechanism:x.mechanism,reportedAuthority:x.authority,
  independentlyVerifiedAuthority:false,mechanismIdentifiableFromObservations:false};
}
export function auditCorpus(d){
 if(!Array.isArray(d?.worlds))throw Error('worlds required');
 const out=d.worlds.map(auditDependency);
 const classMap=new Map();
 for(const w of d.worlds){const key=JSON.stringify(w.observed);if(!classMap.has(key))classMap.set(key,new Set());classMap.get(key).add(w.mechanism);}
 return {rows:out,observationalClasses:classMap.size,
  underdeterminedClasses:[...classMap.values()].filter(s=>s.size>1).length};
}
