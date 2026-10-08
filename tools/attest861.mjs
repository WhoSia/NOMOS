// NOMOS 0.861 - authenticated evidence-to-finite-model bridge.
// This implementation NEVER certifies real legal authority or reviewer independence.
// Trust anchors and source pins MUST be passed independently of the claimant packet.
import {createHash, createPublicKey, verify as verifySignature} from "node:crypto";
import {readFileSync} from "node:fs";
import {pathToFileURL} from "node:url";
import {assess860} from "./deadlock860.mjs";

export function canonical861(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return "["+value.map(canonical861).join(",")+"]";
  return "{"+Object.keys(value).sort().map(k=>JSON.stringify(k)+":"+canonical861(value[k])).join(",")+"}";
}
export const digest861 = text => createHash("sha256").update(text,"utf8").digest("hex");
export const signedBytes861 = claim => Buffer.from("NOMOS:861:attestation:v1\n"+canonical861(claim),"utf8");
const day = s => typeof s==="string" && /^\d{4}-\d{2}-\d{2}$/.test(s) &&
  !Number.isNaN(Date.parse(s+"T00:00:00Z")) && new Date(s+"T00:00:00Z").toISOString().slice(0,10)===s;
function active(on,from,to){return day(on)&&day(from)&&day(to)&&from<=on&&on<=to;}
function unique(a){return new Set(a).size===a.length;}

export function verify861(packet, policy) {
  // No fallback to trust material embedded in packet.
  if(!policy || !policy.trustedKeys || !policy.sourcePins || !policy.institutionGroups || !day(policy.asOf)) throw Error("A separate, time-scoped trust policy is required");
  if(!packet || !packet.model || !Array.isArray(packet.model.rules) || !Array.isArray(packet.model.goals) || !Array.isArray(packet.proofs) || !Array.isArray(packet.sources)) throw Error("Invalid evidence packet");
  if(typeof packet.caseId!=="string" || typeof policy.jurisdiction!=="string" || !packet.caseId) throw Error("Case scope required");
  const errors=[],details=[];
  const rules=packet.model.rules;
  if(!unique(rules.map(x=>x.id)) || rules.some(x=>!x.id || !x.head || !Array.isArray(x.requires) || !x.subject || !["boolean","undefined"].includes(typeof x.requiresIndependentReview)))throw Error("Malformed or duplicate rule");
  if(!unique(packet.proofs.map(x=>x.id)) || !unique(packet.sources.map(x=>x.id)))throw Error("Duplicate evidence identifiers");
  const sourceById=new Map(packet.sources.map(x=>[x.id,x]));
  const pinnedSources=new Set();
  for (const [id,pin] of Object.entries(policy.sourcePins)){
    const src=sourceById.get(id);
    if(src && typeof src.text==="string" && typeof pin.digest==="string" &&
       digest861(src.text)===pin.digest && pin.jurisdiction===policy.jurisdiction &&
       active(policy.asOf,pin.validFrom,pin.validUntil))pinnedSources.add(id);
  }
  const accepted=[];
  for(const proof of packet.proofs) {
    const c=proof.claim, sig=proof.signature;
    const issuer=c?.issuer, key=policy.trustedKeys[issuer];
    let why="";
    if(!c || typeof proof.id!=="string" || typeof sig!=="string" || !["route","review","census"].includes(c.kind))why="MALFORMED_PROOF";
    else if(c.caseId!==packet.caseId || c.jurisdiction!==policy.jurisdiction)why="SCOPE_MISMATCH";
    else if(!active(policy.asOf,c.validFrom,c.validUntil))why="STALE_OR_FUTURE";
    else if(!key || !key.roles?.includes(c.kind) || key.jurisdiction!==policy.jurisdiction ||
            !active(policy.asOf,key.validFrom,key.validUntil))why="UNTRUSTED_ISSUER_OR_ROLE";
    else if(!pinnedSources.has(c.sourceId))why="UNPINNED_OR_STALE_SOURCE";
    else if(!key.controlGroup || !policy.institutionGroups[packet.originalAgency] || (c.subject && !policy.institutionGroups[c.subject]))why="UNMAPPED_CONTROL_GROUP";
    else if(key.controlGroup===policy.institutionGroups[packet.originalAgency] || (c.subject && policy.institutionGroups[c.subject]===key.controlGroup))why="SELF_ATTESTATION";
    else if(c.kind==="review" && policy.institutionGroups[packet.originalAgency]===key.controlGroup)why="DEPENDENT_REVIEW_CONTROL";
    else if(c.kind==="census" && (c.subject!==packet.originalAgency || c.assertion!=="complete" || !Array.isArray(c.routeIds) ||
             !unique(c.routeIds) || c.routeIds.length!==rules.length ||
             !rules.every(r=>c.routeIds.includes(r.id))))why="INVALID_ROUTE_CENSUS";
    else if(c.kind==="route" && (!rules.some(r=>r.id===c.routeId && r.subject===c.subject) ||
             !["verified","denied"].includes(c.assertion)))why="INVALID_ROUTE_ASSERTION";
    else if(c.kind==="review" && (!rules.some(r=>r.id===c.routeId && r.subject===c.subject) ||
             c.assertion!=="independent"))why="INVALID_REVIEW_ASSERTION";
    if(!why){
      try{
        const publicKey=createPublicKey({key:Buffer.from(key.publicKeyDerBase64,"base64"),format:"der",type:"spki"});
        if(!verifySignature(null,signedBytes861(c),publicKey,Buffer.from(sig,"base64")))why="BAD_SIGNATURE";
      }catch{why="BAD_KEY_OR_SIGNATURE";}
    }
    details.push({id:proof.id,kind:c?.kind||"unknown",accepted:!why,reason:why||"SIGNED_AND_PINNED_NOT_LEGALLY_CERTIFIED"});
    if(why)errors.push({proofId:proof.id,reason:why});else accepted.push(c);
  }
  // Conflicting accepted attestations are neither verified nor denied.
  function assertions(kind,routeId){
    return accepted.filter(c=>c.kind===kind && (routeId===undefined || c.routeId===routeId));
  }
  const censusClaims=assertions("census").filter(c=>c.subject===packet.originalAgency);
  const censusValid=censusClaims.length>0 && censusClaims.every(c=>c.assertion==="complete");
  const modeledRules=rules.map(r=>{
    const claims=assertions("route",r.id);
    const states=new Set(claims.map(c=>c.assertion));
    let warrant="unknown";
    if(states.size===1){
      const w=[...states][0];
      const independent=!r.requiresIndependentReview ||
         assertions("review",r.id).some(c=>c.assertion==="independent" &&
           policy.institutionGroups[c.issuer]!==policy.institutionGroups[packet.originalAgency]);
      if(w==="denied" || independent)warrant=w;
    }
    return {id:r.id,head:r.head,requires:r.requires,warrant};
  });
  // An unsigned census cannot turn an absent edge into a definite blocked claim.
  // A signed complete census is still only a claim in the *pinned trust-policy model*.
  const gate=assess860({goals:packet.model.goals,facts:packet.model.facts||[],
      rules:modeledRules,alternativesComplete:censusValid,evidenceScopeVerified:censusValid});
  const institutionalVerdicts=Object.fromEntries(packet.model.goals.map(g=>[g,"NOT_INDEPENDENTLY_LEGALLY_CERTIFIED"]));
  return {status:censusValid?"ATTESTED_MODEL_BOUNDS_ONLY":"EVIDENCE_HOLD",
    modeledRuleWarrants:Object.fromEntries(modeledRules.map(r=>[r.id,r.warrant])),
    computational:gate.verdicts, institutional:institutionalVerdicts,
    evidence:{accepted:accepted.length,rejected:errors.length,proofs:details,
      pinnedSources:[...pinnedSources].sort(),signedCensusClaim:censusValid,
      independentPolicyMaterial:"EXTERNALLY_SUPPLIED_NOT_INFERRED_FROM_PACKET"},
    caveat:"Signature and source pin verify integrity, NOT truth, jurisdictional competence, reviewer epistemic independence or legal completeness."};
}

if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href){
  if(process.argv.length!==4){console.error("Usage: node tools/attest861.mjs <packet.json> <independently-pinned-policy.json>");process.exitCode=2;}
  else{
    const packet=JSON.parse(readFileSync(process.argv[2],"utf8"));
    const policy=JSON.parse(readFileSync(process.argv[3],"utf8"));
    console.log(JSON.stringify(verify861(packet,policy),null,2));
  }
}
