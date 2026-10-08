// NOMOS-0.864: synthetic, claimant-relative downstream effect observation.
// A computational certificate is never evidence of a real person's repaired record.
export const OBSERVATION_VERDICTS864 = Object.freeze(["OBSERVED_CORRECTED","OBSERVED_STALE","UNKNOWN"]);
const has = (x,k)=>Object.prototype.hasOwnProperty.call(x,k);
function assert(condition,message){if(!condition)throw Error(message);}
function distinct(xs){return new Set(xs).size===xs.length;}
function stateFor(node,observations,scope){
  const matches=observations.filter(o=>o.nodeId===node.id);
  if(!matches.length)return {status:"UNKNOWN",reason:"NO_INDEPENDENT_READBACK"};
  if(matches.length!==1)return {status:"UNKNOWN",reason:"AMBIGUOUS_READBACK"};
  const o=matches[0];
  if(o.caseId!==scope.caseId||o.asOf!==scope.asOf||o.snapshotId!==scope.snapshotId||
     o.kind!=="independent_readback"||o.observerId===node.operatorId||
     !o.observerId||!o.receiptId||!o.provenanceDigest||
     o.freshness!=="current"||o.value===undefined)
     return {status:"UNKNOWN",reason:"READBACK_SCOPE_OR_INDEPENDENCE_UNVERIFIED"};
  if(o.value===node.correctedValue)return {status:"OBSERVED_CORRECTED",receiptId:o.receiptId};
  if(o.value===node.previousValue)return {status:"OBSERVED_STALE",receiptId:o.receiptId};
  return {status:"UNKNOWN",reason:"UNCLASSIFIED_OR_CONFLICTING_VALUE"};
}
export function assessConsequenceRepair864(packet,observations){
 assert(packet && typeof packet.caseId==="string"&&packet.caseId&&
  typeof packet.asOf==="string"&&packet.asOf&&
  typeof packet.snapshotId==="string"&&packet.snapshotId&&
  Array.isArray(packet.nodes)&&packet.nodes.length>0,"Invalid case-relative consequence packet");
 assert(Array.isArray(observations),"Observations must be an array");
 const nodes=packet.nodes;
 assert(nodes.every(n=>n&&typeof n.id==="string"&&n.id&&
  typeof n.operatorId==="string"&&n.operatorId&&
  has(n,"previousValue")&&has(n,"correctedValue")&&
  n.previousValue!==n.correctedValue&&Array.isArray(n.dependsOn))&&
  distinct(nodes.map(n=>n.id)),"Invalid or duplicate consequence node");
 const ids=new Set(nodes.map(n=>n.id));
 assert(nodes.every(n=>distinct(n.dependsOn)&&n.dependsOn.every(x=>ids.has(x)&&x!==n.id)),"Invalid dependency");
 assert(observations.every(o=>o&&typeof o.nodeId==="string"),"Invalid observation");
 const results=nodes.map(n=>({nodeId:n.id,...stateFor(n,observations,packet)}));
 const stale=results.filter(r=>r.status==="OBSERVED_STALE");
 const unknown=results.filter(r=>r.status==="UNKNOWN");
 const status=stale.length?"OBSERVED_INCOMPLETE":unknown.length?"UNKNOWN":"OBSERVED_CORRECTED_WITHIN_DECLARED_CENSUS";
 return {status,perNode:results,
  censusCompleteAsDeclared:true,
  independentCensusCertified:false,
  causalEffect:"NOT_IDENTIFIED_BY_BEFORE_AFTER_OR_READBACK",
  actuality:"SYNTHETIC_MODEL_ONLY",
  interpretation:"A declared complete finite census and current independently attributed readbacks are conditional inputs, not certification of a real complete system inventory."};
}
// Observational indistinguishability: worlds with identical admitted observations
// are required to give the same verdict even if their hidden node states differ.
export function compatibleHiddenWorlds864(packet,observations,worldA,worldB){
 const a=assessConsequenceRepair864(packet,observations);
 const keys=packet.nodes.map(x=>x.id);
 assert(keys.every(k=>has(worldA,k)&&has(worldB,k)),"Incomplete counterworld");
 const hiddenDifference=keys.some(k=>worldA[k]!==worldB[k]);
 return {observationallyIndistinguishable:true,hiddenDifference,
  verdict:a.status,actualCompletionNotIdentified:hiddenDifference,
  realWorldCompletion:"NOT_CERTIFIED"};
}
export function compareConsequenceOutcomes864({before,after,hasIdentifyingDesign=false}){
 assert(Number.isFinite(before)&&Number.isFinite(after),"Numeric observed outcomes required");
 // A design flag alone is never a validated identification proof.
 return {observedDifference:after-before,
  causalEffect:"NOT_IDENTIFIED",
  identificationClaim:hasIdentifyingDesign?"DESIGN_REQUIRES_EXTERNAL_VALIDATION":"NO_IDENTIFYING_DESIGN",
  actuality:"OBSERVATIONAL_ONLY"};
}

// Both worlds exhibit identical observed outcomes, but have distinct potential
// untreated outcomes. This establishes non-identification for the synthetic pair.
export function causalCounterworldPair864({observedBefore,observedAfter,untreatedAfterA,untreatedAfterB}){
 const xs=[observedBefore,observedAfter,untreatedAfterA,untreatedAfterB];
 assert(xs.every(Number.isFinite),"Numeric synthetic counterworld values required");
 return {observationsIdentical:true,
  causalEffectA:observedAfter-untreatedAfterA,
  causalEffectB:observedAfter-untreatedAfterB,
  causalEffectIdentified:untreatedAfterA===untreatedAfterB,
  interpretation:"Existence of a pair with distinct effects refutes identification from observed before/after alone; constructed counterfactuals are not actual person data."};
}
