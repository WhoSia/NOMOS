// NOMOS 0.863 — case-relative remedy-reach and actual-restoration model.
// Reuses the 0.860 AND/OR finite court. Does NOT validate actual legal standing,
// filing, independent review, timeliness, or repair execution.
// Stage warrants must be derived from separately authenticated evidence;
// they are never accepted from the contested route packet itself.
import { assess860 } from "./deadlock860.mjs";
import { canonical861, digest861 } from "./attest861.mjs";
import { verifyGoverned862 } from "./governance862.mjs";
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

/**
 * Authenticate modeled path inputs by EXECUTING prior verifier layers.
 * Every step corresponds to a 0.861 route, covered by 0.862 signed census.
 * Never treats signed assertions as actual laws or completed remedies.
 */
export function assessGovernedRemedyReach863(
  caseRoutes,legacyPacket,legacyPolicy,charter,rootRecord,censusRecord
){
 validateRoutes863(caseRoutes);
 const needed=caseRoutes.routes.flatMap(r=>STAGES863.map(st=>r.steps[st]));
 if(!unique(needed))return unknownGoals("STEP_EVIDENCE_REUSED_ACROSS_PATHS");
 if(legacyPacket?.caseId!==caseRoutes.caseId ||
   legacyPolicy?.jurisdiction!==caseRoutes.jurisdiction ||
   legacyPolicy?.asOf!==caseRoutes.asOf ||
   !Array.isArray(legacyPacket?.model?.rules)||
   !Array.isArray(censusRecord?.declaredRouteIds))return unknownGoals("BOUNDARY_CASE_OR_SNAPSHOT_MISMATCH");
 const upstreamRuleIds=legacyPacket.model.rules.map(x=>x.id);
 const censusIds=censusRecord.declaredRouteIds;
 if(!unique(upstreamRuleIds)||!unique(censusIds)||
    upstreamRuleIds.length!==needed.length||
    !needed.every(x=>upstreamRuleIds.includes(x))||
    censusIds.length!==needed.length||
    !needed.every(x=>censusIds.includes(x)))return unknownGoals("MISSING_EXACT_SIGNED_ROUTE_CENSUS");
 const governed=verifyGoverned862(
   legacyPacket,legacyPolicy,charter,rootRecord,censusRecord);
 if(governed.status!=="GOVERNED_MODEL_BOUNDS_ONLY" ||
    governed.downstream?.status!=="ATTESTED_MODEL_BOUNDS_ONLY"){
   return {...unknownGoals("UPSTREAM_GOVERNANCE_OR_ATTESTATION_HOLD"),
     upstream:governed.status};
 }
 const warrants=governed.downstream.modeledRuleWarrants;
 const receipts=governed.downstream.evidence?.acceptedReceipts||[];
 const witness=new Map();
 for(const receipt of receipts){
   if(receipt.role!=="route"||!needed.includes(receipt.routeId))continue;
   if(!witness.has(receipt.routeId))witness.set(receipt.routeId,[]);
   witness.get(receipt.routeId).push(receipt.proofId);
 }
 const claims=caseRoutes.routes.flatMap(r=>STAGES863.map(stage=>{
   const id=r.steps[stage];
   const proofs=witness.get(id)||[];
   const proposed=warrants[id];
   const status=proofs.length&&["verified","denied"].includes(proposed)?
     proposed:"unknown";
   return {id,routeId:r.id,stage,caseId:caseRoutes.caseId,
     jurisdiction:caseRoutes.jurisdiction,asOf:caseRoutes.asOf,
     scope:r.channelType,status,proofRefs:proofs};
 }));
 const evidence={status:"GOVERNED_MODEL_BOUNDS_ONLY",
   caseId:caseRoutes.caseId,jurisdiction:caseRoutes.jurisdiction,
   asOf:caseRoutes.asOf,policyDigest:digest861(canonical861(legacyPolicy)),
   packetDigest:digest861(canonical861(caseRoutes)),
   enumeratedRouteIds:caseRoutes.routes.map(r=>r.id),claims};
 const modeled=assessRemedyReach863(caseRoutes,evidence);
 return {...modeled,upstream:"GOVERNED_ATTESTED_MODEL_ONLY",
   evidenceReceiptCount:receipts.length,
   proofCeiling:"PROVEN SIGNER ATTRIBUTION AND DECLARED PATH MODEL; NOT REAL LEGAL ENTITLEMENT"};
}

if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 if(process.argv.length!==4){console.error("Usage: node tools/remedyReach863.mjs <case-routes.json> <externally-derived-evidence.json>");process.exitCode=2;}
 else console.log(JSON.stringify(assessRemedyReach863(
  JSON.parse(readFileSync(process.argv[2],"utf8")),
  JSON.parse(readFileSync(process.argv[3],"utf8"))),null,2));
}
