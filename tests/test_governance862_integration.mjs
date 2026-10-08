import assert from "node:assert/strict";
import {generateKeyPairSync,sign} from "node:crypto";
import {verifyGoverned862,bytes862} from "../tools/governance862.mjs";
import {signedBytes861,canonical861,digest861} from "../tools/attest861.mjs";
const day="2026-10-08",jurisdiction="FICTIONAL-JURISDICTION",caseId="CASE-DEMO";
const keys={};function person(id,group,roles){
 const {privateKey,publicKey}=generateKeyPairSync("ed25519");
 keys[id]={privateKey,publicKeyDerBase64:publicKey.export({format:"der",type:"spki"}).toString("base64"),group,roles};
}
for(const [id,group,roles] of [
 ["routeWitness","legal-witness",["route"]],["factWitness","record-witness",["fact"]],
 ["censusWitness","inventory-witness",["census"]],
 ["governorA","external-A",["status"]],["governorB","external-B",["status"]],
 ["challenger","external-challenge",["challenge"]]
])person(id,group,roles);
const src861=[
 {id:"law",text:"Fictional law permitting action."},
 {id:"fact",text:"Fictional independent verification of a record."},
 {id:"census",text:"Fictional inventory of candidate routes."}
];
const policy861={asOf:day,jurisdiction,
 sourcePins:Object.fromEntries(src861.map(s=>[s.id,{
 digest:digest861(s.text),jurisdiction,validFrom:"2026-01-01",validUntil:"2026-12-31"}])),
 trustedKeys:Object.fromEntries(["routeWitness","factWitness","censusWitness"].map(id=>[id,{
 publicKeyDerBase64:keys[id].publicKeyDerBase64,roles:keys[id].roles,
 jurisdiction,controlGroup:keys[id].group,validFrom:"2026-01-01",validUntil:"2026-12-31"}])),
 institutionGroups:{"original":"original","successor":"successor"}
};
let seq=0;
function proof(kind,issuer,sourceId,extra){
 const claim={kind,issuer,caseId,jurisdiction,sourceId,issuedOn:day,
 validFrom:"2026-09-01",validUntil:"2026-11-01",...extra};
 return {id:"p-"+(++seq),claim,
 signature:sign(null,signedBytes861(claim),keys[issuer].privateKey).toString("base64")};
}
function packet861(routeState){
 return {caseId,originalAgency:"original",sources:structuredClone(src861),
 model:{goals:["restored"],facts:["record"],rules:[{
  id:"r1",head:"restored",requires:["record"],subject:"successor"}]},
 proofs:[
  proof("route","routeWitness","law",{routeId:"r1",subject:"successor",assertion:routeState}),
  proof("fact","factWitness","fact",{subject:"successor",factId:"record",assertion:"observed"}),
  proof("census","censusWitness","census",{subject:"original",assertion:"complete",routeIds:["r1"]})
 ]};
}
const src862=[
{id:"status",text:"Fictional signed governance status."},
{id:"challenge",text:"Fictional omitted route challenge."}];
const govCharter={id:"GOV-FICTION",epoch:6,minimumEpoch:6,jurisdiction,asOf:day,
 quorum:2,maxStatusAgeDays:7,subjectGroup:"original",
 legacyPolicySha256:digest861(canonical861(policy861)),
 keys:Object.fromEntries(["governorA","governorB","challenger"].map(id=>[id,{
  publicKeyDerBase64:keys[id].publicKeyDerBase64,roles:keys[id].roles,group:keys[id].group,
  from:"2026-01-01",until:"2026-12-31"}])),
 sourcePins:Object.fromEntries(src862.map(s=>[s.id,{
  digest:digest861(s.text),jurisdiction,from:"2026-01-01",until:"2026-12-31"}]))
};
function event(kind,issuer,target,extra={}){
 const claim={kind,issuer,target,charterId:govCharter.id,epoch:6,jurisdiction,
  issuedOn:day,validUntil:"2026-12-31",sourceId:kind==="challenge"?"challenge":"status",
  routeSetDigest:digest861(canonical861(["r1"])),...extra};
 return {id:"ge-"+(++seq),claim,
  signature:sign(null,bytes862(claim),keys[issuer].privateKey).toString("base64")};
}
function record(target){
 return {target,charterId:govCharter.id,epoch:6,jurisdiction,
 sources:structuredClone(src862),declaredRouteIds:["r1"],
 events:[
  event("status","governorA",target,{state:"good"}),
  event("status","governorB",target,{state:"good"})
 ]};
}
function test(name,mutate,routeState,expectStatus,expectVerdict){
 const legacy=packet861(routeState);
 const charter=structuredClone(govCharter);
 const root=record("policy:"+charter.id),census=record("census:"+caseId);
 mutate({legacy,charter,root,census});
 const result=verifyGoverned862(legacy,policy861,charter,root,census);
 assert.equal(result.status,expectStatus,name+" overall");
 assert.equal(result.computational.restored,expectVerdict,name+" model");
 assert.equal(result.institutional.restored,"NOT_INDEPENDENTLY_LEGALLY_CERTIFIED",name+" institutional");
 console.log("PASS",name,expectStatus,expectVerdict);
}
test("full synthetic model, positive",()=>{},"verified","GOVERNED_MODEL_BOUNDS_ONLY","ACTIONABLE");
test("full synthetic model, negative",()=>{},"denied","GOVERNED_MODEL_BOUNDS_ONLY","BOUNDED_BLOCKED");
test("revoked trusted root masks positive",({root})=>{root.events.push(event("status","governorA",root.target,{state:"revoked"}));},"verified","GOVERNANCE_HOLD","UNKNOWN");
test("revoked trusted root masks negative",({root})=>{root.events.push(event("status","governorA",root.target,{state:"revoked"}));},"denied","GOVERNANCE_HOLD","UNKNOWN");
test("census challenge blocks positive",({census})=>{census.events.push(event("challenge","challenger",census.target,{reason:"omitted_route",counterRouteId:"r2"}));},"verified","GOVERNANCE_HOLD","UNKNOWN");
test("changed route inventory blocks reuse",({census})=>{census.declaredRouteIds.push("r2");},"verified","GOVERNANCE_HOLD","UNKNOWN");
test("external charter no longer pins 0.861 trust policy",({charter})=>{charter.legacyPolicySha256="0".repeat(64);},"verified","GOVERNANCE_HOLD","UNKNOWN");
test("case replay lacks matching census root",({legacy})=>{legacy.caseId="CASE-REPLAY";},"verified","GOVERNANCE_HOLD","UNKNOWN");
test("policy epoch rollback blocked",({root})=>{root.epoch=5;},"verified","GOVERNANCE_HOLD","UNKNOWN");
console.log("PASS 0.861/0.862 boundary: governance hold forbids either outer model verdict");
