// Read-only legal claim metadata validation; NOT automated court reasoning.
export const REQUIRED_CASE_KEYS=['id','case','year','context','actor','issue','primary','claimed_rule','does_not_show'];
export function validateCaseCorpus(x){
 if(!Array.isArray(x?.cases)||x.cases.length===0) throw Error('nonempty cases required');
 const ids=new Set();
 return x.cases.map(c=>{
   for(const k of REQUIRED_CASE_KEYS)if(c[k]===undefined||c[k]===null||c[k]==='')throw Error('missing '+k);
   if(ids.has(c.id))throw Error('duplicate case');
   ids.add(c.id);
   if(typeof c.primary!=='string'||!c.primary.startsWith('https://'))throw Error('primary URL required');
   if(!Array.isArray(c.does_not_show)||!c.does_not_show.length)throw Error('negative scope needed');
   return {id:c.id,scopeGuardCount:c.does_not_show.length,independentlyAdjudicated:false};
 });
}
