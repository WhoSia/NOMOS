import assert from "node:assert/strict";
import {generateKeyPairSync,sign} from "node:crypto";
import {verify861,canonical861,digest861,signedBytes861} from "../tools/attest861.mjs";
const asOf="2026-10-08",jurisdiction="TEST-JURISDICTION";
const sources=[
{id:"law",text:"Fictional statute: restoration may be considered under W-1."},
{id:"census",text:"Fictional external audit route inventory, case 001."},
{id:"review",text:"Fictional external review dependency ablation receipt."}
];
const pins=Object.fromEntries(sources.map(s=>[s.id,{digest:digest861(s.text),jurisdiction,validFrom:"2026-01-01",validUntil:"2026-12-31"}]));
function key(name,role,group){
  const {privateKey,publicKey}=generateKeyPairSync("ed25519");
  return {name,role,group,privateKey,publicKey:publicKey.export({format:"der",type:"spki"}).toString("base64")};
}
const legal=key("legalObserver","route","external-law"),
census=key("censusAuditor","census","external-inventory"),
review=key("reviewObserver","review","external-review"),
origin=key("originalAgency","route","original"),
covert=key("capturedReviewer","review","original");
const people=[legal,census,review,origin,covert];
const policy={
asOf,jurisdiction,sourcePins:pins,institutionGroups:{"agency-legacy":"original","agency-successor":"successor","independent_route_census":"external-inventory"},
trustedKeys:Object.fromEntries(people.map(k=>[k.name,{publicKeyDerBase64:k.publicKey,roles:[k.role],jurisdiction,controlGroup:k.group,validFrom:"2026-01-01",validUntil:"2026-12-31"}]))
};
function signed(kind,issuer,sourceId,extra={},keyOverride){
  const claim={kind,issuer:issuer.name,caseId:"CASE-001",jurisdiction,validFrom:"2026-09-01",validUntil:"2026-11-01",sourceId,...extra};
  const signingKey=keyOverride||issuer.privateKey;
  return {id:"receipt-"+issuer.name+"-"+kind,claim,signature:sign(null,signedBytes861(claim),signingKey).toString("base64")};
}
function specimen(){
 return {caseId:"CASE-001",originalAgency:"agency-legacy",
 sources:structuredClone(sources),
 model:{goals:["restored"],facts:["record"],rules:[{id:"route1",head:"restored",requires:["record"],subject:"agency-successor",requiresIndependentReview:true}]},
 proofs:[
 signed("route",legal,"law",{routeId:"route1",subject:"agency-successor",assertion:"verified"}),
 signed("review",review,"review",{routeId:"route1",subject:"agency-successor",assertion:"independent"}),
 signed("census",census,"census",{subject:"independent_route_census",assertion:"complete",routeIds:["route1"]})
 ]};
}
function clone(x){return structuredClone(x);}
function check(name,modify,wantVerdict,wantStatus){
 const p=specimen(),trust=clone(policy);
 modify(p,trust);
 const x=verify861(p,trust);
 assert.equal(x.computational.restored,wantVerdict,name);
 if(wantStatus)assert.equal(x.status,wantStatus,name);
 assert.equal(x.institutional.restored,"NOT_INDEPENDENTLY_LEGALLY_CERTIFIED",name+" authority boundary");
 console.log("PASS",name,x.computational.restored,"proofsRejected",x.evidence.rejected);
}
check("all independent synthetic receipts",()=>{},"ACTIONABLE","ATTESTED_MODEL_BOUNDS_ONLY");
check("altered signed assertion",p=>p.proofs[0].claim.assertion="denied","UNKNOWN");
check("corrupted signed bits",p=>p.proofs[0].signature=p.proofs[0].signature.slice(0,-3)+"AAA","UNKNOWN");
check("source content differs from independent pin",p=>p.sources[0].text+=" Omitted clause.","UNKNOWN");
check("missing source",p=>p.sources.shift(),"UNKNOWN");
check("wrong case replay",p=>p.caseId="CASE-REPLAY","UNKNOWN","EVIDENCE_HOLD");
check("unknown key from self-submission",p=>p.proofs[0].claim.issuer="unknown","UNKNOWN");
check("expired route",p=>p.proofs[0].claim.validUntil="2026-09-30","UNKNOWN");
check("cross-jurisdiction replay",p=>p.proofs[0].claim.jurisdiction="X","UNKNOWN");
check("missing independent reviewer",p=>p.proofs.splice(1,1),"UNKNOWN");
check("review signer controlled by origin",p=>{
  p.proofs[1]=signed("review",covert,"review",{routeId:"route1",subject:"agency-successor",assertion:"independent"});
},"UNKNOWN");
check("original agency signs successor route",p=>{
  p.proofs[0]=signed("route",origin,"law",{routeId:"route1",subject:"agency-successor",assertion:"verified"});
},"UNKNOWN");
check("no census",p=>p.proofs.pop(),"UNKNOWN","EVIDENCE_HOLD");
check("census forged route list",p=>p.proofs[2].claim.routeIds=["other"],"UNKNOWN","EVIDENCE_HOLD");
check("untrusted role key",(_,trust)=>trust.trustedKeys.legalObserver.roles=["census"],"UNKNOWN");
check("untrusted verifier root",(_,trust)=>trust.trustedKeys.legalObserver.publicKeyDerBase64=origin.publicKey,"UNKNOWN");
check("untrusted source pin",(_,trust)=>trust.sourcePins.law.digest="0".repeat(64),"UNKNOWN");
check("conflicting independent legal attestations",p=>{
 const conflict=signed("route",legal,"law",{routeId:"route1",subject:"agency-successor",assertion:"denied"});conflict.id="independent-contradiction";p.proofs.push(conflict);
},"UNKNOWN");
check("unsigned denial becomes unknown",p=>{
 p.proofs[0].claim.assertion="denied";
},"UNKNOWN");
check("authentic denied warrant",p=>{
 p.proofs[0]=signed("route",legal,"law",{routeId:"route1",subject:"agency-successor",assertion:"denied"});
},"BOUNDED_BLOCKED");
assert.throws(()=>verify861(specimen(),{asOf}),/separate, time-scoped trust policy/);
assert.throws(()=>verify861({...specimen(),proofs:[...specimen().proofs,specimen().proofs[0]]},policy),/Duplicate evidence identifiers/);
console.log("PASS negative policy and duplicate evidence enforcement");
