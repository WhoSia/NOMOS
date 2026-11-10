// Thematic reading-depth guard only; DOES NOT verify article conclusions or legal authority.
const LEVELS=['metadata','abstract','fulltext'];
export function auditEvidenceContract(entry,claim){
 if(!entry?.id||!claim?.id||entry.id!==claim.source_id)throw Error('source/claim mismatch');
 if(!LEVELS.includes(entry.review_level)||!LEVELS.includes(claim.minimum_level))throw Error('unsupported review level');
 if(!entry.url||!claim.supported_topic)throw Error('source URL and claim topic required');
 if(!entry.topics.includes(claim.supported_topic))return {id:claim.id,status:'not_established',reason:'topic_not_verified_by_scoped_source'};
 if(LEVELS.indexOf(entry.review_level)<LEVELS.indexOf(claim.minimum_level))return {id:claim.id,status:'not_established',reason:'read_depth_insufficient'};
 return {id:claim.id,status:'source_description_supported',reason:'locally_curated_topic_only'};
}
export function auditCorpus(data){
 if(!Array.isArray(data?.sources)||!Array.isArray(data?.claims))throw Error('source and claim sets required');
 const sources=new Map(data.sources.map(s=>[s.id,s]));
 if(sources.size!==data.sources.length)throw Error('duplicate source');
 return data.claims.map(c=>{
  const s=sources.get(c.source_id);
  return s?auditEvidenceContract(s,c):{id:c.id,status:'not_established',reason:'missing_source'};
 });
}
