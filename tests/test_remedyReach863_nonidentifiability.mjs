import assert from "node:assert/strict";
import {assessRemedyReach863,STAGES863} from "../tools/remedyReach863.mjs";
import {canonical861,digest861} from "../tools/attest861.mjs";
const packet={caseId:"CASE-EXPERIMENT",jurisdiction:"TEST_ONLY",asOf:"2026-10-08",
 routes:[{id:"paper",channelType:"paper",reviewerId:"independent-review",
 remedyBearer:"competent-remedy-office",recipientId:"retained-copies",
 steps:Object.fromEntries(STAGES863.map(s=>[s,"paper-"+s]))}]};
const evidence={status:"GOVERNED_MODEL_BOUNDS_ONLY",
 caseId:packet.caseId,jurisdiction:packet.jurisdiction,asOf:packet.asOf,
 policyDigest:"FICTIONAL_SIGNER_POLICY",packetDigest:digest861(canonical861(packet)),
 enumeratedRouteIds:["paper"],
 claims:STAGES863.map(stage=>({id:"paper-"+stage,routeId:"paper",stage,
 caseId:packet.caseId,jurisdiction:packet.jurisdiction,asOf:packet.asOf,
 scope:"paper",status:"verified",proofRefs:["synthetic-signature-"+stage]}))};
const formal=assessRemedyReach863(packet,evidence);
assert.equal(formal.computational.remedy_reachable,"ACTIONABLE");
assert.equal(formal.computational.repair_evidenced,"ACTIONABLE");
function pair(name,positive,negative,measure){
 assert.notEqual(measure(positive),measure(negative),name+" must differ in actual world");
 const a=assessRemedyReach863(positive.visible.packet,positive.visible.evidence);
 const b=assessRemedyReach863(negative.visible.packet,negative.visible.evidence);
 assert.deepEqual(a.computational,b.computational,name+" equal observations, equal algorithm result");
 assert.equal(a.institutional,"NOT_INDEPENDENTLY_LEGALLY_CERTIFIED");
 console.log("PASS actual-world nonidentifiability",name);
}
const visible={packet,evidence};
pair("signed paper-channel listing despite inaccessible real submission",
 {visible,actual:{canSubmit:true}},{visible,actual:{canSubmit:false}},
 w=>w.actual.canSubmit);
pair("signed acknowledgement but claimant never received or could contest it",
 {visible,actual:{noticeReceived:true}},{visible,actual:{noticeReceived:false}},
 w=>w.actual.noticeReceived);
pair("nominal reviewer distinct but hidden original-decision dependence persists",
 {visible,actual:{independentReview:true}},{visible,actual:{independentReview:false}},
 w=>w.actual.independentReview);
pair("signed restoration completed but downstream adverse copy still operational",
 {visible,actual:{liveCopy:false}},{visible,actual:{liveCopy:true}},
 w=>!w.actual.liveCopy);
pair("same signed validity witness but governing exception makes standing differ",
 {visible,actual:{lawfulStanding:true}},{visible,actual:{lawfulStanding:false}},
 w=>w.actual.lawfulStanding);
console.log("PASS five indistinguishable synthetic person-remedy worlds; no actual legal outcome inferred");
