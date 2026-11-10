// Traces bounded synthetic identities and measurement-documentation completeness.
// Not a valid construct score, legal authority decision or actual profiling result.
export function auditScenario(x){
 if(!x?.id||!Array.isArray(x.trainingContributors)||typeof x.affectedPerson!=='string'||!x.model||!x.claim)throw Error('malformed scenario');
 if(x.claim.target!==x.affectedPerson)throw Error('target mismatch');
 const keys=['constructDefined','reliabilityEvidence','convergentEvidence','consequencesReviewed'];
 const bad=keys.filter(k=>![true,false,null].includes(x.model[k]));
 if(bad.length)throw Error('invalid measurement-evidence triage');
 const incomplete=keys.filter(k=>x.model[k]!==true);
 return {id:x.id,nonparticipant:!x.trainingContributors.includes(x.affectedPerson),
  constructEvidenceDocumented:incomplete.length===0,missingOrUnfavorable:incomplete,
  legalAuthorityVerified:false,constructValidityScientificallyEstablished:false,
  verdict:'source_bounded_triage_only'};
}
export function auditCorpus(d){if(!Array.isArray(d?.cases))throw Error('cases needed');return d.cases.map(auditScenario);}
