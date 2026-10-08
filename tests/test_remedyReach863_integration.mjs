import assert from "node:assert/strict";
import {generateKeyPairSync,sign} from "node:crypto";
import {assessGovernedRemedyReach863,STAGES863} from "../tools/remedyReach863.mjs";
import {canonical861,digest861,signedBytes861} from "../tools/attest861.mjs";
import {bytes862} from "../tools/governance862.mjs";
const asOf="2026-10-08", jurisdiction="FICTIONAL-863", caseId="CASE-INTEGRATION";
const keyring={};for(const [name,group,roles] of [
 ["routeObserver","external-law",["route"]],
 ["reviewObserver","external-review",["review"]],
 ["censusObserver","external-census",["census"]],
 ["governorA","external-gov-A",["status"]],
 ["governorB","external-gov-B",["status"]],
 ["challenger","external-challenge",["challenge"]]
]){
 const kp=generateKeyPairSync("ed25519");
 keyring[name]={group,roles,privateKey:kp.privateKey,publicKeyDerBase64:kp.publicKey.export({type:"spki",format:"der"}).toString("base64")};
}
let serial=0;
const caseRoutes={caseId,jurisdiction,asOf,routes:[{
 id:"paper",channelType:"paper",reviewerId:"review-council",
 remedyBearer:"remedial-authority",recipientId:"record-holder",
 steps:Object.fromEntries(STAGES863.map(s=>[s,"paper-"+s]))
}]};
const stageIds=STAGES863.map(s=>"paper-"+s);
const source861=[{id:"source",text:"Fictional stage-specific external witness record."},
 {id:"inventory",text:"Fictional enumerated evidence-route inventory."},
 {id:"review",text:"Fictional independently witnessed E/A reviewer-dependency ablation."}];
const policy861={asOf,jurisdiction,institutionGroups:{original:"original",successor:"successor"},
 trustedKeys:Object.fromEntries(["routeObserver","reviewObserver","censusObserver"].map(id=>[id,{
  publicKeyDerBase64:keyring[id].publicKeyDerBase64,roles:keyring[id].roles,
  jurisdiction,controlGroup:keyring[id].group,validFrom:"2026-01-01",validUntil:"2026-12-31"}])),
 sourcePins:Object.fromEntries(source861.map(s=>[s.id,{
  digest:digest861(s.text),jurisdiction,validFrom:"2026-01-01",validUntil:"2026-12-31"}]))};
function sign861(kind,issuer,sourceId,extra){
 const claim={kind,issuer,sourceId,caseId,jurisdiction,issuedOn:asOf,
  validFrom:"2026-01-01",validUntil:"2026-12-31",...extra};
 return {id:"attest-"+(++serial),claim,
 signature:sign(null,signedBytes861(claim),keyring[issuer].privateKey).toString("base64")};
}
function legacyPacket(){
 return {caseId,originalAgency:"original",sources:structuredClone(source861),
  model:{facts:[],goals:["paper-recipient"],rules:stageIds.map(id=>({
    id,head:id,requires:[],subject:"successor",
    ...(id==="paper-review"?{requiresIndependentReview:true,liveFailureModes:["E","A"],remedyPath:"independent-appeal"}:{})}))},
  proofs:[...stageIds.map(id=>sign861("route","routeObserver","source",{
    routeId:id,subject:"successor",assertion:"verified"})),
    sign861("review","reviewObserver","review",{
      routeId:"paper-review",subject:"successor",assertion:"independent",
      remedyPath:"independent-appeal",
      dependencyBreaks:[
        {mode:"E",originalSource:"legacy-evidence",reviewSource:"independent-evidence",probeId:"source-ablation-e",evidenceSourceId:"review"},
        {mode:"A",originalSource:"original-authority",reviewSource:"separate-review-power",probeId:"authority-ablation-a",evidenceSourceId:"review"}
      ]}),
    sign861("census","censusObserver","inventory",{
     subject:"original",assertion:"complete",routeIds:stageIds})]};
}
const govSources=[{id:"status",text:"Fictional current root/census status."},
 {id:"challenge",text:"Fictional material route-census challenge."}];
const charter={id:"GOV-SYNTH-863",epoch:8,minimumEpoch:8,jurisdiction,asOf,
 quorum:2,maxStatusAgeDays:7,maxChallengeAgeDays:14,subjectGroup:"original",
 legacyPolicySha256:digest861(canonical861(policy861)),
 keys:Object.fromEntries(["governorA","governorB","challenger"].map(id=>[id,{
 publicKeyDerBase64:keyring[id].publicKeyDerBase64,roles:keyring[id].roles,
 group:keyring[id].group,from:"2026-01-01",until:"2026-12-31"}])),
 sourcePins:Object.fromEntries(govSources.map(s=>[s.id,{
 digest:digest861(s.text),jurisdiction,from:"2026-01-01",until:"2026-12-31"}]))};
function sign862(kind,issuer,target,options={}){
 const claim={kind,issuer,target,charterId:charter.id,epoch:charter.epoch,jurisdiction,
 issuedOn:asOf,validUntil:"2026-12-31",sourceId:kind==="challenge"?"challenge":"status",
 routeSetDigest:digest861(canonical861([...stageIds].sort())),...options};
 return {id:"gov-"+(++serial),claim,signature:sign(null,bytes862(claim),keyring[issuer].privateKey).toString("base64")};
}
function statusRecord(target){
 return {target,charterId:charter.id,epoch:charter.epoch,jurisdiction,
 declaredRouteIds:[...stageIds],sources:structuredClone(govSources),
 events:[sign862("status","governorA",target,{state:"good"}),
         sign862("status","governorB",target,{state:"good"})]};
}
function run(name,modify,reach,repair,upstream){
 const lp=legacyPacket(),root=statusRecord("policy:"+charter.id),
  census=statusRecord("census:"+caseId);
 const selected=structuredClone(charter);
 modify({lp,root,census,selected});
 const x=assessGovernedRemedyReach863(caseRoutes,lp,policy861,selected,root,census);
 assert.equal(x.computational.remedy_reachable,reach,name+" reach");
 assert.equal(x.computational.repair_evidenced,repair,name+" repair");
 assert.equal(x.institutional,"NOT_INDEPENDENTLY_LEGALLY_CERTIFIED",name+" authority ceiling");
 if(upstream)assert.equal(x.upstream,upstream,name+" root");
 console.log("PASS",name,reach,repair);
}
run("fresh independent policy + full signed eight-stage proof",
 ()=>{},"ACTIONABLE","ACTIONABLE","GOVERNED_ATTESTED_MODEL_ONLY");
run("real receipt claimed but downstream record explicitly uncorrected",
 ({lp})=>{lp.proofs.find(p=>p.claim.routeId==="paper-recipient").claim.assertion="denied";
  const q=lp.proofs.find(p=>p.claim.routeId==="paper-recipient");
  q.signature=sign(null,signedBytes861(q.claim),keyring.routeObserver.privateKey).toString("base64");
 },"ACTIONABLE","BOUNDED_BLOCKED","GOVERNED_ATTESTED_MODEL_ONLY");
run("signed review route without independent dependency break remains UNKNOWN",
 ({lp})=>{lp.proofs=lp.proofs.filter(p=>p.claim.kind!=="review");},
 "UNKNOWN","UNKNOWN","GOVERNED_ATTESTED_MODEL_ONLY");
run("captured assertion editing cannot forge review independence",
 ({lp})=>{lp.proofs.find(p=>p.claim.kind==="review").claim.dependencyBreaks=[];},
 "UNKNOWN","UNKNOWN","GOVERNED_ATTESTED_MODEL_ONLY");
run("missing route evidence remains unknown not denied",
 ({lp})=>{lp.proofs=lp.proofs.filter(p=>p.claim.routeId!=="paper-standing");},
 "UNKNOWN","UNKNOWN","GOVERNED_ATTESTED_MODEL_ONLY");
run("tampered signed authority must remain unknown",
 ({lp})=>{lp.proofs.find(p=>p.claim.routeId==="paper-authority").claim.assertion="denied";},
 "UNKNOWN","UNKNOWN","GOVERNED_ATTESTED_MODEL_ONLY");
run("revoked root masks prior fully signed route",
 ({root})=>{root.events.push(sign862("status","governorA",root.target,{state:"revoked"}));},
 "UNKNOWN","UNKNOWN", "GOVERNANCE_HOLD");
run("independent census challenge blocks even signed remedial chain",
 ({census})=>{census.events.push(sign862("challenge","challenger",census.target,{
   reason:"omitted_route",counterRouteId:"another-independent-channel"}));},
 "UNKNOWN","UNKNOWN","GOVERNANCE_HOLD");
run("missing one enumerated stage defeats universe",
 ({census})=>{census.declaredRouteIds.pop();},
 "UNKNOWN","UNKNOWN");
run("policy changed out of band",
 ({selected})=>{selected.legacyPolicySha256="0".repeat(64);},
 "UNKNOWN","UNKNOWN","GOVERNANCE_HOLD");
console.log("PASS all genuine 0.860–0.863 synthetic signed-evidence transition gates");
