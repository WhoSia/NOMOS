// NOMOS-0.865 P1: synthetic observer-root collision audit.
// Negative evidence court only; cannot authenticate observers or real systems.
const assert=(v,m)=>{if(!v)throw Error(m)};
const token=x=>typeof x==="string"&&x.trim().length>0;
export function assessObservationAuthority865({scope,readbacks,untrustedControllingRoots=[]}){
 assert(scope&&["caseId","nodeId","asOf","governingCopyId"].every(k=>token(scope[k])),"Invalid scoped claim");
 assert(Array.isArray(readbacks)&&readbacks.length>=2,"At least two alleged readbacks required");
 assert(Array.isArray(untrustedControllingRoots)&&untrustedControllingRoots.every(token),"Invalid controller roots");
 const keyset=new Set(), paths=[];
 for(const r of readbacks){
  assert(r&&token(r.observerId)&&Array.isArray(r.provenanceRoots)&&
   r.provenanceRoots.length>0&&r.provenanceRoots.every(token),"Invalid observer provenance");
  assert(["caseId","nodeId","asOf","governingCopyId"].every(k=>r[k]===scope[k]),"Out-of-scope readback");
  assert(!keyset.has(r.observerId),"Duplicate observer identity");
  keyset.add(r.observerId);paths.push(new Set(r.provenanceRoots));
 }
 const common=[...paths[0]].filter(x=>paths.every(p=>p.has(x)));
 const compromised=common.filter(x=>untrustedControllingRoots.includes(x));
 return {verdict:compromised.length?"INDEPENDENCE_REFUTED_BY_SHARED_CONTROLLER":"INDEPENDENCE_NOT_ESTABLISHED",
 sharedRoots:common,sharedUntrustedControllers:compromised,
 observerIdsDistinct:true,independenceCertified:false,
 meaning:"No result establishes actual independent observation; empty collision is not independent attestation.",
 actuality:"SYNTHETIC_ONLY"};
}
