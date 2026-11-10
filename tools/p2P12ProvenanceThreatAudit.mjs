// Bounded synthetic-document audit. Not a cryptographic signature checker or attack tool.
export function auditLedger(c){
 if(!c?.id||!Array.isArray(c.events))throw Error('invalid provenance case');
 const findings=[],seen=new Set();
 let lastSeq=-Infinity;
 for(const e of c.events){
  if(!e||typeof e.id!=='string'||!Number.isInteger(e.seq)||typeof e.digest!=='string')throw Error('malformed event');
  if(seen.has(e.id))findings.push('duplicate_event_id');
  seen.add(e.id);
  if(e.seq<=lastSeq)findings.push('nonmonotonic_sequence');
  lastSeq=e.seq;
  if(c.digestReference&&Object.hasOwn(c.digestReference,e.id)&&c.digestReference[e.id]!==e.digest)findings.push('asserted_digest_mismatch');
 }
 if(Array.isArray(c.expectedIds)&&c.expectedIds.some(id=>!seen.has(id)))findings.push('missing_from_declared_expected_list');
 const integrityStatus=findings.length?'documented_structural_conflict':'not_verified';
 return {id:c.id,findings:[...new Set(findings)],integrityStatus,
  independentlyAuthenticated:c.attestationVerified===true,
  completeExternalRecordVerified:false,
  note:'Fixture claims not independent evidence; attestation flag is caller-supplied'};
}
export function auditReviewCounts(r){
 if(![r?.retrieved,r?.deduplicated,r?.included,r?.reportedValidated].every(Number.isInteger))throw Error('integer counts required');
 if(!(r.retrieved>=r.deduplicated&&r.deduplicated>=r.included&&r.included>=r.reportedValidated&&r.reportedValidated>=0))throw Error('invalid review flow');
 const selectionPercent=+(r.included/r.deduplicated*100).toFixed(1);
 return {selectionPercent,denominator:r.deduplicated,validationReportedCount:r.reportedValidated,validationCertified:false};
}
