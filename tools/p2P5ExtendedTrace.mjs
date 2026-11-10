// Synthetic, bounded trace monitor. An extension, not the original 2006 formalism.
export const FACTS=Object.freeze(['flow_permitted','attribute_derived','actor_qualified','purpose_allowed','claim_scope_supported','contest_enabled']);
function prior(trace,type,before){return trace.slice(0,before).some(e=>e.type===type);}
export function extendedContextualTrace(trace,facts){
 if(!Array.isArray(trace)||!facts||typeof facts!=='object')throw Error('trace and facts required');
 const outcomes=[];
 for(let i=0;i<trace.length;i++)if(trace[i].type==='judge')outcomes.push([
 facts.flow_permitted===true&&prior(trace,'send',i),
 facts.attribute_derived===true&&prior(trace,'derive',i),
 facts.actor_qualified===true,facts.purpose_allowed===true,
 facts.claim_scope_supported===true,facts.contest_enabled===true
 ].every(Boolean));
 return {judgments:outcomes,fullyCompliant:outcomes.every(Boolean)};
}
export function nomosClaimContract(trace,facts){
 if(!Array.isArray(trace)||!facts||typeof facts!=='object')throw Error('trace and facts required');
 const coverage={send:false,derive:false},decisions=[];
 for(const e of trace){
  if(e.type==='send')coverage.send=true;
  if(e.type==='derive')coverage.derive=true;
  if(e.type!=='judge')continue;
  const missing=FACTS.filter(k=>facts[k]!==true);
  if(!coverage.send)missing.push('send_before_judgment');
  if(!coverage.derive)missing.push('derive_before_judgment');
  decisions.push({warranted:missing.length===0,missing});
 }
 return {judgments:decisions,fullyWarranted:decisions.every(x=>x.warranted)};
}
export function enumerateFiniteTruthTable(){
 const traces=[
 [{type:'send'},{type:'derive'},{type:'judge'}],
 [{type:'judge'},{type:'send'},{type:'derive'}],
 [{type:'send'},{type:'judge'},{type:'derive'}],
 [{type:'derive'},{type:'judge'},{type:'send'}],
 [{type:'send'},{type:'derive'},{type:'judge'},{type:'judge'}]
 ];
 const mismatches=[];let tests=0,lawful=0;
 for(let mask=0;mask<2**FACTS.length;mask++){
  const facts=Object.fromEntries(FACTS.map((k,i)=>[k,Boolean(mask&(1<<i))]));
  for(const trace of traces){
   const a=extendedContextualTrace(trace,facts),b=nomosClaimContract(trace,facts);
   tests++;if(a.fullyCompliant)lawful++;
   if(JSON.stringify(a.judgments)!==JSON.stringify(b.judgments.map(x=>x.warranted)))mismatches.push({mask,trace});
  }
 }
 return {tests,lawful,mismatches};
}
