import assert from "node:assert/strict";
import {generateKeyPairSync,sign} from "node:crypto";
import {evaluateGovernance862,verifyGoverned862,bytes862} from "../tools/governance862.mjs";
import {canonical861,digest861} from "../tools/attest861.mjs";
const now="2026-10-08";
const texts={status:"Synthetic credential status bulletin.",challenge:"Synthetic auditor's potentially omitted lawful route notice.",resolution:"Synthetic independent challenge disposition."};
const people={};
function person(id,group,roles){
 const {privateKey,publicKey}=generateKeyPairSync("ed25519");
 people[id]={id,group,roles,privateKey,publicKeyDerBase64:publicKey.export({format:"der",type:"spki"}).toString("base64")};
}
person("goodA","A",["status"]);person("goodA2","A",["status"]);person("goodB","B",["status"]);
person("statusRevoker","C",["status"]);person("challenger","D",["challenge"]);
person("judgeE","E",["resolution"]);person("judgeF","F",["resolution"]);
person("origin","origin",["status","resolution"]);person("other","other",["status"]);
const root={
 id:"governance-v6",epoch:6,minimumEpoch:6,jurisdiction:"TEST-ONLY",asOf:now,
 quorum:2,maxStatusAgeDays:7,subjectGroup:"origin",
 keys:Object.fromEntries(Object.values(people).map(p=>[p.id,{
  publicKeyDerBase64:p.publicKeyDerBase64,roles:p.roles,group:p.group,
  from:"2026-01-01",until:"2026-12-31"}])),
 sourcePins:Object.fromEntries(Object.entries(texts).map(([id,text])=>[id,{
   digest:digest861(text),jurisdiction:"TEST-ONLY",from:"2026-01-01",until:"2026-12-31"}]))
};
function ev(kind,issuer,sourceId,props={}){
 const claim={kind,issuer,target:"policy:governance-v6",charterId:root.id,epoch:6,
 jurisdiction:"TEST-ONLY",issuedOn:now,validUntil:"2026-12-31",sourceId,...props};
 return {id:"e-"+issuer+"-"+kind+"-"+Math.random().toString(36).slice(2),claim,
 signature:sign(null,bytes862(claim),people[issuer].privateKey).toString("base64")};
}
function packet(){return {
 target:"policy:governance-v6",charterId:root.id,epoch:6,jurisdiction:"TEST-ONLY",
 declaredRouteIds:["r1"],
 sources:Object.entries(texts).map(([id,text])=>({id,text})),
 events:[ev("status","goodA","status",{state:"good"}),ev("status","goodB","status",{state:"good"})]
};}
function run(name,fn,expected){
 const p=packet(),c=structuredClone(root);fn(p,c);
 const result=evaluateGovernance862(p,c);
 assert.equal(result.status,expected,name);
 assert.equal(result.institutional,"NOT_INDEPENDENTLY_LEGALLY_CERTIFIED");
 console.log("PASS",name,result.status,"accepted",result.accepted.length);
}
run("two independently keyed groups",()=>{},"ELIGIBLE_MODEL");
run("same controller signs twice",p=>{p.events=[ev("status","goodA","status",{state:"good"}),ev("status","goodA2","status",{state:"good"})]},"UNKNOWN");
run("no freshness (old good status)",p=>{
 p.events=[ev("status","goodA","status",{state:"good",issuedOn:"2026-09-20"}),
           ev("status","goodB","status",{state:"good",issuedOn:"2026-09-20"})];
},"FRESHNESS_HOLD");
run("revocation published, no contrary good",p=>{p.events=[ev("status","statusRevoker","status",{state:"revoked"})]},"REVOKED_ATTESTED");
run("mixed contradictory status",p=>{p.events.push(ev("status","statusRevoker","status",{state:"revoked"}))},"CHALLENGED");
run("original institution self certifies",p=>{p.events=[ev("status","origin","status",{state:"good"}),ev("status","goodB","status",{state:"good"})]},"UNKNOWN");
run("invalid policy epoch",p=>{p.epoch=5},"UNKNOWN");
run("rollback blocked by higher policy minimum",(_,c)=>{c.minimumEpoch=7},"UNKNOWN");
run("missing independent policy status",p=>{p.events=[]},"UNKNOWN");
run("tampered signature",p=>{p.events[0].claim.state="revoked"},"UNKNOWN");
run("tampered source bytes",p=>{p.sources[0].text+=" modified"},"UNKNOWN");
run("untrusted key role",(_,c)=>{c.keys.goodA.roles=["challenge"]},"UNKNOWN");
run("old key revoked by pinned policy",(_,c)=>{c.revokedKeys=["goodA"]},"UNKNOWN");
run("legitimate census challenge holds",p=>{p.events.push(ev("challenge","challenger","challenge",{reason:"omitted_route",counterRouteId:"r2"}))},"CHALLENGED");
run("malicious invalid census challenge cannot freeze",p=>{
 p.events.push(ev("challenge","challenger","challenge",{reason:"omitted_route",counterRouteId:"r1"}));
},"ELIGIBLE_MODEL");
run("challenger cannot dismiss own challenge",p=>{
 const ch=ev("challenge","challenger","challenge",{reason:"omitted_route",counterRouteId:"r2"});
 p.events.push(ch);
 p.events.push(ev("resolution","challenger","resolution",{challengeId:ch.id,decision:"dismiss"}));
},"CHALLENGED");
run("single reviewing group cannot dismiss",p=>{
 const ch=ev("challenge","challenger","challenge",{reason:"omitted_route",counterRouteId:"r2"});p.events.push(ch);
 p.events.push(ev("resolution","judgeE","resolution",{challengeId:ch.id,decision:"dismiss"}));
},"CHALLENGED");
run("independent reviewing groups can disposition a challenge",p=>{
 const ch=ev("challenge","challenger","challenge",{reason:"omitted_route",counterRouteId:"r2"});p.events.push(ch);
 p.events.push(ev("resolution","judgeE","resolution",{challengeId:ch.id,decision:"dismiss"}));
 p.events.push(ev("resolution","judgeF","resolution",{challengeId:ch.id,decision:"dismiss"}));
},"ELIGIBLE_MODEL");
run("sustained concern cannot be dismissed by another signer",p=>{
 const ch=ev("challenge","challenger","challenge",{reason:"omitted_route",counterRouteId:"r2"});p.events.push(ch);
 p.events.push(ev("resolution","judgeE","resolution",{challengeId:ch.id,decision:"sustain"}));
 p.events.push(ev("resolution","judgeF","resolution",{challengeId:ch.id,decision:"dismiss"}));
},"CHALLENGED");
run("subject cannot dismiss a challenge",p=>{
 const ch=ev("challenge","challenger","challenge",{reason:"omitted_route",counterRouteId:"r2"});p.events.push(ch);
 p.events.push(ev("resolution","origin","resolution",{challengeId:ch.id,decision:"dismiss"}));
},"CHALLENGED");
run("cross jurisdiction attempt",p=>{p.events[0].claim.jurisdiction="OTHER"},"UNKNOWN");
run("external policy root swapping",p=>{p.charterId="attacker-created"},"UNKNOWN");
run("root identity must differ from self-asserted evidence",(_,c)=>{c.subjectGroup="A"},"UNKNOWN");

// Integration: held governance must mask old 0.861 results to UNKNOWN, no matter what
// the claimant packet says about the route.
const legacyPolicy={asOf:now,jurisdiction:"TEST-ONLY",trustedKeys:{},sourcePins:{},institutionGroups:{}};
const legacyPacket={caseId:"CASE-1",model:{goals:["repaired"],facts:["repaired"],rules:[]},proofs:[],sources:[]};
const charter=structuredClone(root);
charter.legacyPolicySha256=digest861(canonical861(legacyPolicy));
const heldRoot=packet();heldRoot.events=[];
const heldCensus=packet();heldCensus.target="census:CASE-1";heldCensus.events=[];
const result=verifyGoverned862(legacyPacket,legacyPolicy,charter,heldRoot,heldCensus);
assert.equal(result.status,"GOVERNANCE_HOLD");
assert.equal(result.computational.repaired,"UNKNOWN");
console.log("PASS governance hold prevents cached or self-submitted route verdict");

assert.throws(()=>evaluateGovernance862(packet(),{...root,maxStatusAgeDays:-1}),/Malformed external/);
const duplicate=packet();duplicate.events.push({...duplicate.events[0]});
assert.throws(()=>evaluateGovernance862(duplicate,root),/Duplicate events/);
console.log("PASS invalid charter and duplicate evidence fail closed");
