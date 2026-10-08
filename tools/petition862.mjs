// NOMOS-0.862 P5: open petition intake != authenticated governance challenge.
// Synthetic institutional procedure only. No real entitlement or identity proof.
import {createPublicKey,verify as cryptoVerify} from "node:crypto";
import {canonical861,digest861} from "./attest861.mjs";
import {verifyGoverned862} from "./governance862.mjs";
const dayOk=x=>typeof x==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(x)&&!Number.isNaN(Date.parse(x+"T00:00:00Z"))&&new Date(x+"T00:00:00Z").toISOString().slice(0,10)===x;
const age=(a,b)=>(Date.parse(a+"T00:00:00Z")-Date.parse(b+"T00:00:00Z"))/86400000;
export const screenBytes862 = c => Buffer.from("NOMOS:862:PETITION-SCREEN:v1\n"+canonical861(c),"utf8");
export const intakeAckBytes862 = c => Buffer.from("NOMOS:862:INTAKE-ACK:v1\n"+canonical861(c),"utf8");
function distinct(a){return new Set(a).size===a.length;}
export function evaluatePetitionIntake862(docket,assessments,charter,evidenceSources=[],acknowledgement=null) {
 if(!charter || !dayOk(charter.asOf)||!charter.id||!charter.jurisdiction ||
   !Number.isInteger(charter.epoch)||!Number.isInteger(charter.maxIntakeAgeDays)||charter.maxIntakeAgeDays<0||
   !charter.keys||!charter.sourcePins||!charter.subjectGroup)throw Error("External intake charter malformed");
 if(!docket||!docket.id||!docket.caseId||!docket.target||!Array.isArray(assessments)||
   !dayOk(docket.receivedOn)||!distinct(assessments.map(x=>x.id))||!Array.isArray(evidenceSources)||
   !distinct(evidenceSources.map(x=>x.id)))throw Error("Docket or assessments malformed");
 const notes=[], accepted=[];
 const sourceById=new Map(evidenceSources.map(s=>[s.id,s]));
 const live=docket.receivedOn<=charter.asOf&&docket.jurisdiction===charter.jurisdiction&&
   docket.charterId===charter.id&&docket.epoch===charter.epoch;
 const base={id:docket.id,caseId:docket.caseId,submissionDigest:digest861(canonical861(docket)),
    institutional:"NOT_INDEPENDENTLY_LEGALLY_CERTIFIED",
    petitionRequiresApprovedAttestorKey:false, automaticallySuspendsAuthority:false};
 if(!live)return {...base,status:"INTAKE_SCOPE_HOLD",screenReceipts:[]};
 // A user-created submissionDigest does not prove delivery or institutional
 // acceptance. A distinct signer with *intake* role must acknowledge it.
 const ac=acknowledgement?.claim,ak=charter.keys?.[ac?.issuer];
 let ackAccepted=false;
 if(ac && typeof acknowledgement.signature==="string" && ac.kind==="intake_ack" &&
    ak?.roles?.includes("intake") && !charter.revokedKeys?.includes(ac.issuer) &&
    ac.docketSha256===digest861(canonical861(docket)) &&
    ac.caseId===docket.caseId && ac.target===docket.target &&
    ac.charterId===charter.id && ac.epoch===charter.epoch &&
    ac.jurisdiction===charter.jurisdiction &&
    ac.receivedOn===docket.receivedOn &&
    dayOk(ac.issuedOn) && ac.issuedOn>=docket.receivedOn && ac.issuedOn<=charter.asOf &&
    dayOk(ac.validUntil) && ac.validUntil>=charter.asOf &&
    dayOk(ak.from) && dayOk(ak.until) &&
    ak.from<=charter.asOf && ak.until>=charter.asOf) {
   try{
     const pub=createPublicKey({key:Buffer.from(ak.publicKeyDerBase64,"base64"),format:"der",type:"spki"});
     ackAccepted=cryptoVerify(null,intakeAckBytes862(ac),pub,Buffer.from(acknowledgement.signature,"base64"));
   }catch{ackAccepted=false;}
 }
 if(!ackAccepted)return {...base,status:"SUBMISSION_UNACKNOWLEDGED",
   acknowledgement:"NOT_INDEPENDENTLY_CONFIRMED",screenReceipts:[]};

 // No signature is needed to *lodge* the petition, but this does not validate
 // identity, standing, materiality, or any legal route.
 for(const item of assessments){
   const c=item.claim,key=charter.keys[c?.issuer],pin=charter.sourcePins[c?.sourceId];
   let err="";
   if(!c||!item.id||typeof item.signature!=="string"||c.kind!=="screen"||
      !["material","nonmaterial"].includes(c.decision))err="INVALID_ASSESSMENT";
   else if(c.docketId!==docket.id||c.caseId!==docket.caseId||c.target!==docket.target||
      c.charterId!==charter.id||c.epoch!==charter.epoch||
      c.docketSha256!==digest861(canonical861(docket))||
      c.jurisdiction!==charter.jurisdiction)err="SCOPE_MISMATCH";
   else if(!dayOk(c.issuedOn)||!dayOk(c.validUntil)||
      c.issuedOn<docket.receivedOn||c.issuedOn>charter.asOf||c.validUntil<charter.asOf)err="INVALID_REVIEW_TIME";
   else if(!key||!key.roles?.includes("screen")||!key.group||
      key.group===charter.subjectGroup||charter.revokedKeys?.includes(c.issuer)||
      !dayOk(key.from)||!dayOk(key.until)||key.from>charter.asOf||key.until<charter.asOf)
      err="CAPTURED_OR_UNAUTHORIZED_SCREENER";
   else if(!pin||pin.jurisdiction!==charter.jurisdiction||
      !dayOk(pin.from)||!dayOk(pin.until)||pin.from>charter.asOf||pin.until<charter.asOf||
      c.evidenceDigest!==pin.digest||
      typeof sourceById.get(c.sourceId)?.text!=="string"||
      digest861(sourceById.get(c.sourceId).text)!==pin.digest)err="UNPINNED_SCREEN_SOURCE";
   if(!err){
     try {
       const pub=createPublicKey({key:Buffer.from(key.publicKeyDerBase64,"base64"),format:"der",type:"spki"});
       if(!cryptoVerify(null,screenBytes862(c),pub,Buffer.from(item.signature,"base64")))err="INVALID_SIGNATURE";
     } catch {err="INVALID_SIGNATURE_OR_KEY";}
   }
   notes.push({id:item.id,accepted:!err,reason:err||"SIGNED_SCREEN_ONLY_NOT_LEGAL_DECISION"});
   if(!err)accepted.push({...c,group:key.group});
 }
 const states=new Set(accepted.map(c=>c.decision));
 const status=states.size>1?"SCREENING_DISPUTED":states.has("material")?
   "MATERIAL_FOR_GOVERNANCE_CHALLENGE":states.has("nonmaterial")?
   "SCREENED_NONMATERIAL":age(charter.asOf,docket.receivedOn)>charter.maxIntakeAgeDays?
   "SCREENING_ESCALATION_DUE":"SCREENING_PENDING";
 return {...base,status,acknowledgement:"SIGNED_INTAKE_RECEIPT_ONLY",screenReceipts:notes,
    acceptedGroups:[...new Set(accepted.map(c=>c.group))].sort(),
    provenanceCeiling:"UNSIGNED_INTAKE_AND_SIGNED_SCREEN_ARE_NOT_IDENTITY_STANDING_OR_LEGAL_TRUTH"};
}

// Only independently screened MATERIAL entries can block downstream bounded
// claims. Mere receipt of an unkeyed docket never gives a veto.
export function verifyGovernedWithPetitions862(
 legacyPacket,legacyPolicy,charter,rootRecord,censusRecord,docketsWithScreens){
 if(!Array.isArray(docketsWithScreens))throw Error("Docket array required");
 const ordinary=verifyGoverned862(legacyPacket,legacyPolicy,charter,rootRecord,censusRecord);
 const intake=docketsWithScreens.map(x=>{
   if(x?.docket?.caseId!==legacyPacket.caseId ||
      !["census:"+legacyPacket.caseId,"policy:"+charter.id].includes(x?.docket?.target))
      return {status:"UNRELATED_PETITION",id:x?.docket?.id||null,
        institutional:"NOT_INDEPENDENTLY_LEGALLY_CERTIFIED"};
   return evaluatePetitionIntake862(x.docket,x.assessments,charter,x.evidenceSources||[],x.acknowledgement||null);
 });
 const material=intake.some(x=>x.status==="MATERIAL_FOR_GOVERNANCE_CHALLENGE"||
                                    x.status==="SCREENING_DISPUTED");
 if(material){
   const goals=legacyPacket.model.goals;
   return {...ordinary,status:"INDEPENDENT_CONTEST_REVIEW_HOLD",
     computational:Object.fromEntries(goals.map(g=>[g,"UNKNOWN"])),
     institutional:Object.fromEntries(goals.map(g=>[g,"NOT_INDEPENDENTLY_LEGALLY_CERTIFIED"])),
     petitionDockets:intake};
 }
 return {...ordinary,petitionDockets:intake,
   intakeNotice:intake.some(x=>x.status==="SCREENING_PENDING"||
                               x.status==="SCREENING_ESCALATION_DUE")?
       "PETITION_PROCESS_PENDING_DOES_NOT_CERTIFY_PERSON_OR_LEGAL_OUTCOME":null};
}
