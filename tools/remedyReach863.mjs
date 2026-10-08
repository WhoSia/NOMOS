// NOMOS 0.863 — case-relative remedy-reach and actual-restoration model.
// Reuses the 0.860 AND/OR finite court. Does NOT validate actual legal standing,
// filing, independent review, timeliness, or repair execution.
// Stage warrants must be derived from separately authenticated evidence;
// they are never accepted from the contested route packet itself.
import { assess860 } from "./deadlock860.mjs";
import { canonical861, digest861 } from "./attest861.mjs";
import {readFileSync} from "node:fs";
import {pathToFileURL} from "node:url";

export const STAGES863=["channel","receipt","standing","time","review","authority","execution","recipient"];
export const MODEL_GOALS863=["remedy_reachable","repair_evidenced"];
const allowed=new Set(["verified","denied","unknown"]);
function unique(xs){return new Set(xs).size===xs.length;}
function validateRoutes863(packet){
 if(!packet||!packet.caseId||!packet.jurisdiction||!packet.asOf||
   !Array.isArray(packet.routes)||!packet.routes.length)throw Error("Invalid case-scoped remedy routes");
 if(!unique(packet.routes.map(r=>r.id)))throw Error("Duplicate route");
 for(const r of packet.routes){
   if(!r.id||!(/^[A-Za-z0-9_-]{1,64}$/).test(r.id)||!r.channelType||!["online","paper","assisted","other"].includes(r.channelType)||
     !r.reviewerId||!r.remedyBearer||!r.recipientId||
     !r.steps || STAGES863.some(s=>typeof r.steps[s]!=="string"))throw Error("Incomplete typed route");
   if(!unique(STAGES863.map(s=>r.steps[s])))throw Error("One evidence assertion cannot stand in for all stages");
 }
}
const unknownGoals = reason=>({status:"EVIDENCE_HOLD",reason,
    computational:{remedy_reachable:"UNKNOWN",repair_evidenced:"UNKNOWN"},
    institutional:"NOT_INDEPENDENTLY_LEGALLY_CERTIFIED"});

/**
 * evidence is a RESULT of the previous independently governed attestation layer
 * (or an explicitly hypothetical fixture), not raw self-attested fields.
 * evidence: {caseId,jurisdiction,asOf,policyDigest,status,claims:
 *   [{id,stage,routeId,scope,status,proofRefs:[...]}]}
 * "verified" means model-attested, not actually lawful.
 */
export function assessRemedyReach863(packet,evidence){
 validateRoutes863(packet);
 if(!evidence||evidence.status!=="GOVERNED_MODEL_BOUNDS_ONLY"||
    evidence.caseId!==packet.caseId||evidence.jurisdiction!==packet.jurisdiction||
    evidence.asOf!==packet.asOf||!evidence.policyDigest||
    !Array.isArray(evidence.claims)||!Array.isArray(evidence.enumeratedRouteIds)||
    !unique(evidence.claims.map(x=>x.id))||
    !unique(evidence.enumeratedRouteIds)||
    evidence.enumeratedRouteIds.length!==packet.routes.length||
    !packet.routes.every(r=>evidence.enumeratedRouteIds.includes(r.id))||
    evidence.packetDigest!==digest861(canonical861(packet)))return unknownGoals("UNBOUND_OR_INCOMPLETE_EXTERNAL_EVIDENCE");
 const claims=new Map(evidence.claims.map(x=>[x.id,x]));
 const rules=[],trace=[],perRoute=[];
 for(const r of packet.routes){
   let prev="__entry__";
   for(const stage of STAGES863){
     const id=r.steps[stage],claim=claims.get(id);
     let warrant="unknown";
     if(claim && claim.routeId===r.id && claim.stage===stage &&
        claim.caseId===packet.caseId && claim.jurisdiction===packet.jurisdiction &&
        claim.asOf===packet.asOf && claim.scope===r.channelType &&
        allowed.has(claim.status) && Array.isArray(claim.proofRefs) &&
        claim.proofRefs.length>0 && unique(claim.proofRefs))warrant=claim.status;
     const next="__route__"+r.id+"__"+stage;
     rules.push({id:"stage:"+r.id+":"+stage,head:next,requires:[prev],warrant});
     trace.push({route:r.id,stage,claimId:id,warrant,proofRefs:claim?.proofRefs||[]});
     prev=next;
     if(stage==="authority"){
       rules.push({id:"eligible:"+r.id,head:"__eligible__"+r.id,requires:[next],warrant:"verified"});
       rules.push({id:"eligible_or:"+r.id,head:"remedy_reachable",requires:["__eligible__"+r.id],warrant:"verified"});
     }
   }
   rules.push({id:"complete:"+r.id,head:"__completed__"+r.id,requires:[prev],warrant:"verified"});
   rules.push({id:"complete_or:"+r.id,head:"repair_evidenced",requires:["__completed__"+r.id],warrant:"verified"});
   perRoute.push({id:r.id,channelType:r.channelType,eligibleGoal:"__eligible__"+r.id,completeGoal:"__completed__"+r.id});
 }
 const result=assess860({goals:[...MODEL_GOALS863,...perRoute.flatMap(r=>[r.eligibleGoal,r.completeGoal])],facts:["__entry__"],rules,
    alternativesComplete:true,evidenceScopeVerified:true});
 return {status:"BOUNDED_REMEDY_MODEL_ONLY",
   computational:result.verdicts,
   proofTrace:trace,reachableRouteClaims:perRoute.map(r=>({
      id:r.id,channelType:r.channelType,
      caseRelativeRemedyPath:result.verdicts[r.eligibleGoal],
      modeledRestoration:result.verdicts[r.completeGoal]
   })),
   institutional:"NOT_INDEPENDENTLY_LEGALLY_CERTIFIED",
   interpretation:"Reachability is conditional on externally derived, complete finite claimant-route evidence. No live court, submission, identity verification, legal deadline, or correction is certified."};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 if(process.argv.length!==4){console.error("Usage: node tools/remedyReach863.mjs <case-routes.json> <externally-derived-evidence.json>");process.exitCode=2;}
 else console.log(JSON.stringify(assessRemedyReach863(
  JSON.parse(readFileSync(process.argv[2],"utf8")),
  JSON.parse(readFileSync(process.argv[3],"utf8"))),null,2));
}
