// Source-type and prior-art sanity validation; no automatic peer-review conclusion.
export function auditCloseReading(data){
 if(!Array.isArray(data?.sources)||data.sources.length!==3)throw Error('exactly three source rows required');
 const ids=new Set();const capabilities=new Set();
 for(const s of data.sources){
  if(!s.id||!s.drive_id||!Array.isArray(s.sections)||s.sections.length===0||!Array.isArray(s.confirmed_capabilities)||!Array.isArray(s.unsupported_extrapolations))throw Error('malformed source row');
  if(ids.has(s.drive_id))throw Error('duplicate primary file');ids.add(s.drive_id);
  s.confirmed_capabilities.forEach(x=>capabilities.add(x));
 }
 return {sourceCount:ids.size,priorArtCapabilities:[...capabilities].sort(),externalNoveltyCertified:false};
}
