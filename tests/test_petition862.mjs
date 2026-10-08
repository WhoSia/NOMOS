import assert from "node:assert/strict";
import {generateKeyPairSync,sign} from "node:crypto";
import {evaluatePetitionIntake862,screenBytes862} from "../tools/petition862.mjs";
import {canonical861,digest861} from "../tools/attest861.mjs";
const asOf="2026-10-08",jurisdiction="FICTIONAL";
let seq=0;
const keys={};
function key(id,group,roles){
  const {privateKey,publicKey}=generateKeyPairSync("ed25519");
  keys[id]={privateKey,group,roles,publicKeyDerBase64:publicKey.export({format:"der",type:"spki"}).toString("base64")};
}
key("outside","external",["screen"]);key("captured","original",["screen"]);key("untrusted","untrusted",[]);
const sources=[{id:"evidence",text:"Fictional independently pinned review memorandum."}];
const baseCharter={id:"TEST-GOV",asOf,jurisdiction,epoch:6,subjectGroup:"original",maxIntakeAgeDays:10,
 keys:Object.fromEntries(Object.entries(keys).map(([id,x])=>[id,{
   roles:x.roles,group:x.group,publicKeyDerBase64:x.publicKeyDerBase64,
   from:"2026-01-01",until:"2026-12-31"}])),
 sourcePins:{evidence:{digest:digest861(sources[0].text),jurisdiction,from:"2026-01-01",until:"2026-12-31"}}
};
function docket(){return {id:"DOCKET-1",caseId:"CASE-001",target:"census:CASE-001",
 charterId:"TEST-GOV",epoch:6,jurisdiction,receivedOn:"2026-10-06",
 complaintKind:"omitted_route",counterRouteId:"r2",claimantChannel:"open-no-attestor-key"};}
function assessed(d,decision="material",issuer="outside"){
 const claim={kind:"screen",issuer,decision,docketId:d.id,docketSha256:digest861(canonical861(d)),
   caseId:d.caseId,target:d.target,charterId:d.charterId,epoch:d.epoch,jurisdiction:d.jurisdiction,
   sourceId:"evidence",evidenceDigest:baseCharter.sourcePins.evidence.digest,
   issuedOn:"2026-10-08",validUntil:"2026-12-31"};
 return {id:"screen-"+(++seq),claim,signature:sign(null,screenBytes862(claim),keys[issuer].privateKey).toString("base64")};
}
function test(name,change,expected){
 const d=docket(),c=structuredClone(baseCharter),proofs=[],provided=structuredClone(sources);
 change({d,c,proofs,provided});
 const result=evaluatePetitionIntake862(d,proofs,c,provided);
 assert.equal(result.status,expected,name);assert.equal(result.automaticallySuspendsAuthority,false);
 assert.equal(result.petitionRequiresApprovedAttestorKey,false);
 console.log("PASS",name,expected);
}
test("anyone may enter a modeled docket without approved signer",()=>{},"SCREENING_PENDING");
test("signed materiality screening enters governance review",({d,proofs})=>proofs.push(assessed(d)),"MATERIAL_FOR_GOVERNANCE_CHALLENGE");
test("signed non-materiality finding requires independent source",({d,proofs})=>proofs.push(assessed(d,"nonmaterial")),"SCREENED_NONMATERIAL");
test("conflicting signed screens require review",({d,proofs})=>{
 proofs.push(assessed(d,"material"),assessed(d,"nonmaterial"));
},"SCREENING_DISPUTED");
test("aged unscreened petition escalates without blocking",({d})=>{d.receivedOn="2026-09-20";},"SCREENING_ESCALATION_DUE");
test("notional case ID changed after signature",({d,proofs})=>{
 proofs.push(assessed(d));d.caseId="CASE-OTHER";
},"SCREENING_PENDING");
test("docket counter-route changed after review",({d,proofs})=>{
 proofs.push(assessed(d));d.counterRouteId="r3";
},"SCREENING_PENDING");
test("original operator cannot sign screening",({d,proofs})=>proofs.push(assessed(d,"material","captured")),"SCREENING_PENDING");
test("unauthorized signing role cannot rule",({d,proofs})=>proofs.push(assessed(d,"material","untrusted")),"SCREENING_PENDING");
test("source bytes modified after signature",({d,proofs,provided})=>{
 proofs.push(assessed(d));provided[0].text="changed document";
},"SCREENING_PENDING");
test("source pin independently altered",({d,proofs,c})=>{
 proofs.push(assessed(d));c.sourcePins.evidence.digest="0".repeat(64);
},"SCREENING_PENDING");
test("signed conclusion changed after signature",({d,proofs})=>{
 const p=assessed(d);p.claim.decision="nonmaterial";proofs.push(p);
},"SCREENING_PENDING");
test("not retrospectively in epoch",({d,c})=>{c.epoch=7;},"INTAKE_SCOPE_HOLD");
test("future receipt should be inadmissible",({d})=>{d.receivedOn="2026-11-01";},"INTAKE_SCOPE_HOLD");
assert.throws(()=>evaluatePetitionIntake862(docket(),[],{...baseCharter,maxIntakeAgeDays:-1},sources));
console.log("PASS open intake is distinct from power to suspend or grant a legal remedy");
