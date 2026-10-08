import assert from "node:assert/strict";
import {assessRemedyReach863,STAGES863} from "../tools/remedyReach863.mjs";
import {canonical861,digest861} from "../tools/attest861.mjs";
const packet={caseId:"EXHAUSTIVE-SYNTHETIC",jurisdiction:"MODEL_ONLY",asOf:"2026-10-08",
 routes:[{id:"paper",channelType:"paper",reviewerId:"external-review",
  remedyBearer:"remedial-institution",recipientId:"downstream-custodian",
  steps:Object.fromEntries(STAGES863.map(s=>[s,"paper-"+s]))}]};
const base={status:"GOVERNED_MODEL_BOUNDS_ONLY",caseId:packet.caseId,jurisdiction:packet.jurisdiction,
 asOf:packet.asOf,policyDigest:"HYPOTHETICAL_EXTERNAL_POLICY",
 packetDigest:digest861(canonical861(packet)),enumeratedRouteIds:["paper"]};
const options=["verified","unknown","denied"];
function expected(states){
 return states.every(x=>x==="verified")?"ACTIONABLE":
   states.some(x=>x==="denied")?"BOUNDED_BLOCKED":"UNKNOWN";
}
let checked=0;
for(let number=0;number<3**STAGES863.length;number++){
 let code=number;
 const statuses=STAGES863.map(()=>{const v=options[code%3];code=Math.floor(code/3);return v;});
 const claims=STAGES863.map((stage,i)=>({id:"paper-"+stage,routeId:"paper",stage,caseId:packet.caseId,
  jurisdiction:packet.jurisdiction,asOf:packet.asOf,scope:"paper",
  status:statuses[i],proofRefs:["FICTIONAL_PROOF_"+stage]}));
 const result=assessRemedyReach863(packet,{...base,claims});
 assert.equal(result.computational.remedy_reachable,expected(statuses.slice(0,6)),String(number)+" reach");
 assert.equal(result.computational.repair_evidenced,expected(statuses),String(number)+" repair");
 assert.notEqual(result.institutional,"LEGAL_VERDICT");
 assert.equal(result.status,"HYPOTHETICAL_REMEDY_MODEL_ONLY");
 if(result.computational.repair_evidenced==="ACTIONABLE")
   assert.equal(result.computational.remedy_reachable,"ACTIONABLE");
 if(result.computational.remedy_reachable==="BOUNDED_BLOCKED")
   assert.equal(result.computational.repair_evidenced,"BOUNDED_BLOCKED");
 checked++;
}
console.log("PASS exact finite remedy path classification:",checked,
 "stage-warrant configurations, reachable-prefix and full-remedy goal invariants");
