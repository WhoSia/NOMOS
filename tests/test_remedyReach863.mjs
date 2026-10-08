import assert from "node:assert/strict";
import {assessRemedyReach863,STAGES863} from "../tools/remedyReach863.mjs";
import {canonical861,digest861} from "../tools/attest861.mjs";
const stamp="2026-10-08",caseId="CASE-SYNTH-863",jurisdiction="SYNTHETIC-ONLY";
function route(id,channelType){
 return {id,channelType,reviewerId:"REVIEWER-"+id,remedyBearer:"AGENCY-"+id,recipientId:"DOWNSTREAM-"+id,
  steps:Object.fromEntries(STAGES863.map(stage=>[stage,id+"-"+stage]))};
}
function basePacket(){
 return {caseId,jurisdiction,asOf:stamp,routes:[route("online","online"),route("paper","paper")]};
}
function evidenceFor(packet,defaultState="verified"){
 return {status:"GOVERNED_MODEL_BOUNDS_ONLY",caseId,jurisdiction,asOf:stamp,policyDigest:"PINNED_POLICY_SYNTH",
   packetDigest:digest861(canonical861(packet)),enumeratedRouteIds:packet.routes.map(r=>r.id),
   claims:packet.routes.flatMap(r=>STAGES863.map(stage=>({
      id:r.steps[stage],routeId:r.id,stage,caseId,jurisdiction,asOf:stamp,scope:r.channelType,
      status:defaultState,proofRefs:["SYNTHETIC_ATTESTATION_"+r.steps[stage]]
   })))};
}
function verdict(name,modify,wantReach,wantRepair,perRoute=null){
 const packet=basePacket(),evidence=evidenceFor(packet);
 modify(packet,evidence);
 const actual=assessRemedyReach863(packet,evidence);
 assert.deepEqual(actual.computational,{remedy_reachable:wantReach,repair_evidenced:wantRepair},name);
 assert.equal(actual.institutional,"NOT_INDEPENDENTLY_LEGALLY_CERTIFIED");
 if(perRoute){
  const x=actual.reachableRouteClaims.find(x=>x.id===perRoute.id);
  assert.equal(x.caseRelativeRemedyPath,perRoute.reach);
  if(perRoute.repair)assert.equal(x.modeledRestoration,perRoute.repair);
 }
 console.log("PASS",name,wantReach,wantRepair);
}
const all="ACTIONABLE",blocked="BOUNDED_BLOCKED",unknown="UNKNOWN";
verdict("two complete fictional routes",()=>{},all,all);
verdict("online credentials blocked, offline paper is available",(_,e)=>{
 e.claims.find(c=>c.id==="online-channel").status="denied";
},all,all,{id:"online",reach:blocked,repair:blocked});
verdict("both online and paper blocked by channel evidence",(_,e)=>{
 e.claims.filter(c=>c.stage==="channel").forEach(c=>c.status="denied");
},blocked,blocked);
verdict("received paperwork but no independent review route",(_,e)=>{
 e.claims.filter(c=>c.stage==="review").forEach(c=>c.status="denied");
},blocked,blocked);
verdict("reachable tribunal but no remedy-changing authority",(_,e)=>{
 e.claims.filter(c=>c.stage==="authority").forEach(c=>c.status="denied");
},blocked,blocked);
verdict("remedy capable but no execution yet",(_,e)=>{
 e.claims.filter(c=>c.stage==="execution").forEach(c=>c.status="unknown");
},all,unknown);
verdict("claim succeeds but downstream recipient still uncorrected",(_,e)=>{
 e.claims.filter(c=>c.stage==="recipient").forEach(c=>c.status="denied");
},all,blocked);
verdict("standing is disputed not automatically denied",(_,e)=>{
 e.claims.filter(c=>c.stage==="standing").forEach(c=>c.status="unknown");
},unknown,unknown);
verdict("deadline exception unresolved is not globally time barred",(_,e)=>{
 e.claims.filter(c=>c.stage==="time").forEach(c=>c.status="unknown");
},unknown,unknown);
verdict("alternative paper path after online receipt mismatch",(_,e)=>{
 e.claims.find(c=>c.id==="online-receipt").status="denied";
},all,all,{id:"online",reach:blocked});
verdict("one route gets a lawful adverse ruling, other route still open",(_,e)=>{
 e.claims.find(c=>c.id==="online-standing").status="denied";
},all,all);
verdict("no verified receipt for either route",(_,e)=>{
 e.claims.filter(c=>c.stage==="receipt").forEach(c=>c.proofRefs=[]);
},unknown,unknown);
const blockedResult=assessRemedyReach863(basePacket(),{...evidenceFor(basePacket()),status:"GOVERNANCE_HOLD"});
assert.deepEqual(blockedResult.computational,{remedy_reachable:unknown,repair_evidenced:unknown});
assert.equal(blockedResult.status,"EVIDENCE_HOLD");console.log("PASS held governance cannot authorize model reach");
const packet=basePacket();
for(const mutate of [
 e=>{e.packetDigest="FORGED";},
 e=>{e.enumeratedRouteIds=["online"];},
 e=>{e.caseId="OTHER";},
 e=>{e.asOf="2026-09-01";},
 e=>{e.claims.find(c=>c.stage==="receipt").scope="foreign";},
 e=>{e.claims[0].proofRefs=[];},
 e=>{e.claims[0].status="self-assessed";},
]){
 const e=evidenceFor(packet);mutate(e);
 const out=assessRemedyReach863(packet,e);
 assert.notEqual(out.institutional,"LEGAL_REMEDY_CERTIFIED");
 if(e.packetDigest==="FORGED"||e.caseId==="OTHER"||e.asOf!=="2026-10-08"||e.enumeratedRouteIds.length!==2)
  assert.equal(out.status,"EVIDENCE_HOLD");
}
assert.throws(()=>assessRemedyReach863({...packet,routes:[packet.routes[0],packet.routes[0]]},evidenceFor(packet)),/Duplicate route/);
const aliasPacket=basePacket();aliasPacket.routes[0].steps.review=aliasPacket.routes[0].steps.channel;
assert.throws(()=>assessRemedyReach863(aliasPacket,evidenceFor(packet)),/One evidence assertion/);
console.log("PASS malformed/bad-scope/duplicate claims are not a legal conclusion");
