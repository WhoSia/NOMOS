// R15: source-assertion matching only, not admissibility, authenticity or truth.
export function auditClaims(data){
 if(!Array.isArray(data?.sources)||!Array.isArray(data?.claims))throw Error('sources and claims required');
 const ids=new Set(); for(const s of data.sources){if(!s?.id||ids.has(s.id)||!Array.isArray(s.asserts))throw Error('duplicate or malformed source');ids.add(s.id);}
 return data.claims.map(c=>{
  if(!c?.id||!c.proposition||!c.case)throw Error('malformed claim');
  const supporting=data.sources.filter(s=>(s.case===c.case||s.case==='general')&&s.asserts.includes(c.proposition));
  const scope=supporting.map(s=>({source_id:s.id,source_kind:s.kind}));
  return {claim_id:c.id,proposition:c.proposition,supportingSources:scope,status:supporting.length?'documentarily_asserted':'not_established_by_supplied_sources'};
 });
}
