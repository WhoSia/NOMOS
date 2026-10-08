// NOMOS 0.862: contestable trust-root/status/census governance.
// Model-relative cryptographic gate only; not constitutional or legal authority.
import {createPublicKey,verify as verifySignature} from "node:crypto";
import {readFileSync} from "node:fs";
import {pathToFileURL} from "node:url";
import {canonical861,digest861,verify861} from "./attest861.mjs";

export const bytes862 = claim => Buffer.from("NOMOS:862:governance:v1\n"+canonical861(claim),"utf8");
const dateOk = x => typeof x==="string" && /^\d{4}-\d{2}-\d{2}$/.test(x) &&
  !Number.isNaN(Date.parse(x+"T00:00:00Z")) && new Date(x+"T00:00:00Z").toISOString().slice(0,10)===x;
const elapsed = (now,then) => (Date.parse(now+"T00:00:00Z")-Date.parse(then+"T00:00:00Z"))/86400000;
const unique = xs => new Set(xs).size===xs.length;
const groups = events => new Set(events.map(e=>e._controlGroup));
const hold = (status,notes,receipts,accepted) => ({
  status,notes,receipts,accepted:accepted.map(e=>({id:e._id,role:e.kind,group:e._controlGroup,sourceId:e.sourceId,issuedOn:e.issuedOn})),
  institutional:"NOT_INDEPENDENTLY_LEGALLY_CERTIFIED"
});

export function evaluateGovernance862(packet,charter){
  if(!charter || !dateOk(charter.asOf) || !charter.id || !charter.jurisdiction ||
     !Number.isInteger(charter.epoch) || !Number.isInteger(charter.minimumEpoch) ||
     !Number.isInteger(charter.quorum) || charter.quorum<2 ||
     !Number.isInteger(charter.maxStatusAgeDays) || charter.maxStatusAgeDays<0 ||
     !charter.keys || !charter.sourcePins || !charter.subjectGroup) throw Error("Malformed external governance charter");
  if(!packet || typeof packet.target!=="string" || !Array.isArray(packet.events) ||
     !Array.isArray(packet.sources) || !Array.isArray(packet.declaredRouteIds))throw Error("Malformed governance packet");
  if(!unique(packet.events.map(e=>e.id)) || !unique(packet.sources.map(s=>s.id)) ||
     !unique(packet.declaredRouteIds)) throw Error("Duplicate events, sources or routes");
  if(packet.charterId!==charter.id || packet.jurisdiction!==charter.jurisdiction ||
     packet.epoch!==charter.epoch || charter.epoch<charter.minimumEpoch)
    return hold("UNKNOWN",["POLICY_SNAPSHOT_MISMATCH"],[],[]);
  const src=new Map(packet.sources.map(s=>[s.id,s]));
  const receipts=[],accepted=[];
  for(const event of packet.events){
    const c=event.claim,key=charter.keys?.[c?.issuer],entry=charter.sourcePins?.[c?.sourceId];
    let reason="";
    if(!c || !event.id || typeof event.signature!=="string" ||
       !["status","challenge","resolution"].includes(c.kind))reason="INVALID_EVENT";
    else if(c.charterId!==charter.id || c.epoch!==charter.epoch ||
            c.jurisdiction!==charter.jurisdiction || c.target!==packet.target ||
            c.routeSetDigest!==digest861(canonical861([...packet.declaredRouteIds].sort())))reason="SCOPE_MISMATCH";
    else if(!dateOk(c.issuedOn) || c.issuedOn>charter.asOf ||
            !dateOk(c.validUntil) || c.issuedOn>c.validUntil || c.validUntil<charter.asOf)reason="INVALID_TIME";
    else if(!key || !key.roles?.includes(c.kind) ||
            !key.group || key.group===charter.subjectGroup ||
            !dateOk(key.from) || !dateOk(key.until) ||
            !(key.from<=charter.asOf && charter.asOf<=key.until) ||
            charter.revokedKeys?.includes(c.issuer))reason="UNTRUSTED_OR_SELF_CONTROLLED_KEY";
    else if(!entry || !src.has(c.sourceId) ||
            typeof src.get(c.sourceId).text!=="string" ||
            digest861(src.get(c.sourceId).text)!==entry.digest ||
            entry.jurisdiction!==charter.jurisdiction ||
            !dateOk(entry.from) || !dateOk(entry.until) ||
            !(entry.from<=charter.asOf && charter.asOf<=entry.until))reason="UNPINNED_SOURCE";
    else if(c.kind==="status" && !["good","revoked"].includes(c.state))reason="INVALID_STATUS";
    else if(c.kind==="challenge" &&
            (!["omitted_route","root_dispute","split_view"].includes(c.reason) ||
            (c.reason==="omitted_route" && (!c.counterRouteId ||
              packet.declaredRouteIds.includes(c.counterRouteId)))))reason="INVALID_CHALLENGE";
    else if(c.kind==="resolution" &&
            (!c.challengeId || !["dismiss","sustain"].includes(c.decision)))reason="INVALID_RESOLUTION";
    if(!reason){
      try{
        const pub=createPublicKey({key:Buffer.from(key.publicKeyDerBase64,"base64"),format:"der",type:"spki"});
        if(!verifySignature(null,bytes862(c),pub,Buffer.from(event.signature,"base64")))reason="BAD_SIGNATURE";
      }catch{reason="BAD_KEY_OR_SIGNATURE";}
    }
    receipts.push({id:event.id,accepted:!reason,reason:reason||"CRYPTOGRAPHIC_ATTRIBUTION_ONLY"});
    if(!reason)accepted.push({...c,_id:event.id,_controlGroup:key.group});
  }
  const status=accepted.filter(e=>e.kind==="status");
  const challenges=accepted.filter(e=>e.kind==="challenge");
  const resolutions=accepted.filter(e=>e.kind==="resolution");
  const disputed=[];
  for(const challenge of challenges){
    const decisions=resolutions.filter(r=>r.challengeId===challenge._id &&
      r.issuedOn>=challenge.issuedOn && r._controlGroup!==challenge._controlGroup);
    const good=decisions.filter(r=>r.decision==="dismiss");
    const bad=decisions.filter(r=>r.decision==="sustain");
    if(bad.length || groups(good).size<charter.quorum) disputed.push(challenge._id);
  }
  const fresh=status.filter(s=>elapsed(charter.asOf,s.issuedOn)<=charter.maxStatusAgeDays);
  const approved=fresh.filter(s=>s.state==="good");
  const revoked=status.filter(s=>s.state==="revoked");
  let state="UNKNOWN",notes=[];
  if(disputed.length){state="CHALLENGED";notes=["UNRESOLVED_INDEPENDENT_CHALLENGE",...disputed];}
  else if(revoked.length && approved.length){state="CHALLENGED";notes=["CONTRADICTORY_STATUS_ATTESTATIONS"];}
  else if(revoked.length){state="REVOKED_ATTESTED";notes=["ATTESTED_REVOCATION_NOT_LEGAL_ADJUDICATION"];}
  else if(!fresh.length && status.length){state="FRESHNESS_HOLD";notes=["NO_FRESH_GOOD_STATUS"];}
  else if(groups(approved).size>=charter.quorum){state="ELIGIBLE_MODEL";notes=["GROUP_DIVERSE_SIGNED_CURRENT_STATUS_NOT_LEGAL_TRUTH"];}
  else {state="UNKNOWN";notes=["INSUFFICIENT_INDEPENDENT_STATUS_GROUPS"];}
  const res=hold(state,notes,receipts,accepted);
  res.distinctCurrentGoodGroups=groups(approved).size;
  res.pendingChallenges=disputed;
  res.trustEpoch=charter.epoch;
  res.policyAuthority="EXTERNAL_CHARTER_ASSUMED_NOT_PROVEN";
  return res;
}

// Crucial ordering: governance check precedes 0.861, and a hold may NOT
// silently pass previously cached bounded-blocked or actionable results.
export function verifyGoverned862(packet,policy,charter,rootRecord,censusRecord){
  const goals=packet?.model?.goals;
  if(!Array.isArray(goals) || !goals.length)throw Error("No goals");
  const expectedPolicyDigest=digest861(canonical861(policy));
  if(charter.legacyPolicySha256!==expectedPolicyDigest) {
    return {status:"GOVERNANCE_HOLD",reason:"UNPINNED_LEGACY_POLICY",
      computational:Object.fromEntries(goals.map(g=>[g,"UNKNOWN"])),
      institutional:Object.fromEntries(goals.map(g=>[g,"NOT_INDEPENDENTLY_LEGALLY_CERTIFIED"]))};
  }
  const root=evaluateGovernance862(rootRecord,charter);
  const census=evaluateGovernance862(censusRecord,charter);
  if(root.status!=="ELIGIBLE_MODEL" || census.status!=="ELIGIBLE_MODEL" ||
     rootRecord.target!=="policy:"+charter.id ||
     censusRecord.target!=="census:"+packet.caseId ||
     !unique(censusRecord.declaredRouteIds) ||
     censusRecord.declaredRouteIds.length!==packet.model.rules.length ||
     !packet.model.rules.every(r=>censusRecord.declaredRouteIds.includes(r.id))){
    return {status:"GOVERNANCE_HOLD",root,census,
      computational:Object.fromEntries(goals.map(g=>[g,"UNKNOWN"])),
      institutional:Object.fromEntries(goals.map(g=>[g,"NOT_INDEPENDENTLY_LEGALLY_CERTIFIED"]))};
  }
  const downstream=verify861(packet,policy);
  return {status:"GOVERNED_MODEL_BOUNDS_ONLY",root,census,downstream,
    computational:downstream.computational,
    institutional:downstream.institutional};
}
if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href){
 if(process.argv.length!==4){console.error("Usage: node tools/governance862.mjs <governance-packet.json> <external-charter.json>");process.exitCode=2;}
 else console.log(JSON.stringify(evaluateGovernance862(JSON.parse(readFileSync(process.argv[2],"utf8")),
                JSON.parse(readFileSync(process.argv[3],"utf8"))),null,2));
}
