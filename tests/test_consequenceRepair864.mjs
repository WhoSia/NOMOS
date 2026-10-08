import assert from "node:assert/strict";
import {assessConsequenceRepair864,compatibleHiddenWorlds864,compareConsequenceOutcomes864} from "../tools/consequenceRepair864.mjs";
const packet={caseId:"fictional-case",asOf:"2026-10-08",snapshotId:"s1",nodes:[
{id:"primary",operatorId:"agency",previousValue:"J0",correctedValue:"J1",dependsOn:[]},
{id:"recipient",operatorId:"downstream",previousValue:"J0",correctedValue:"J1",dependsOn:["primary"]}]};
const observation=(id,value)=>({nodeId:id,caseId:packet.caseId,asOf:packet.asOf,snapshotId:packet.snapshotId,kind:"independent_readback",observerId:"external-observer",receiptId:"read-"+id,provenanceDigest:"synthetic-digest",freshness:"current",value});
const positive=[observation("primary","J1"),observation("recipient","J1")];
assert.equal(assessConsequenceRepair864(packet,positive).status,"OBSERVED_CORRECTED_WITHIN_DECLARED_CENSUS");
assert.equal(assessConsequenceRepair864(packet,[positive[0]]).status,"UNKNOWN");
assert.equal(assessConsequenceRepair864(packet,[positive[0],observation("recipient","J0")]).status,"OBSERVED_INCOMPLETE");
assert.equal(assessConsequenceRepair864(packet,[positive[0],{...positive[1],freshness:"stale"}]).status,"UNKNOWN");
assert.equal(assessConsequenceRepair864(packet,[positive[0],{...positive[1],observerId:"downstream"}]).status,"UNKNOWN");
assert.equal(assessConsequenceRepair864(packet,[positive[0],{...positive[1],caseId:"different"}]).status,"UNKNOWN");
assert.equal(assessConsequenceRepair864(packet,[positive[0],positive[1],positive[1]]).status,"UNKNOWN");
const pair=compatibleHiddenWorlds864(packet,[positive[0]],
  {primary:"J1",recipient:"J1"},{primary:"J1",recipient:"J0"});
assert.equal(pair.actualCompletionNotIdentified,true);
assert.equal(pair.verdict,"UNKNOWN");
assert.equal(compareConsequenceOutcomes864({before:4,after:1}).observedDifference,-3);
assert.equal(compareConsequenceOutcomes864({before:4,after:1,hasIdentifyingDesign:true}).causalEffect,"NOT_IDENTIFIED");
for(let a of ["J0","J1",null])for(let b of ["J0","J1",null]){
 const reads=[a===null?null:observation("primary",a),b===null?null:observation("recipient",b)].filter(Boolean);
 const v=assessConsequenceRepair864(packet,reads);
 const expected=a==="J0"||b==="J0"?"OBSERVED_INCOMPLETE":a==="J1"&&b==="J1"?"OBSERVED_CORRECTED_WITHIN_DECLARED_CENSUS":"UNKNOWN";
 assert.equal(v.status,expected);
}
console.log("NOMOS 0.864 synthetic consequence checks PASS (9 ternary census cases + countermodels)");
