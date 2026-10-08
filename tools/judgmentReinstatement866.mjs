// NOMOS-0.866: bounded synthetic stigma and warrantless reinstatement audit.
// This is not a classifier of actual people, speech or legal responsibility.
const require866=(x,m)=>{if(!x)throw Error(m)};
const nonempty=x=>typeof x==="string"&&x.length>0;
export function assessJudgmentReinstatement866(packet){
 require866(packet&&["caseId","personKey","judgmentId","asOf"].every(k=>nonempty(packet[k])),"Invalid scope");
 require866(Array.isArray(packet.supports)&&packet.supports.length>0,"Missing supports");
 const supports=packet.supports;
 require866(supports.every(s=>s&&nonempty(s.id)&&["original","fresh_independent","inherited_label","derived_consequence"].includes(s.kind)&&typeof s.active==="boolean"),"Invalid support");
 require866(new Set(supports.map(s=>s.id)).size===supports.length,"Duplicate support ID");
 require866(typeof packet.originalDefeated==="boolean"&&typeof packet.judgmentReactivated==="boolean","Missing judgment state");
 const liveIndependent=supports.some(s=>s.active&&s.kind==="fresh_independent");
 const circular=supports.filter(s=>s.active&&(s.kind==="inherited_label"||s.kind==="derived_consequence")).map(s=>s.id);
 const originalStillCited=supports.some(s=>s.active&&s.kind==="original");
 const unsupported=packet.originalDefeated&&packet.judgmentReactivated&&!liveIndependent;
 const state=!packet.judgmentReactivated?"NO_REINSTATEMENT_OBSERVED":
   unsupported?"REINSTATEMENT_WITHOUT_FRESH_WARRANT":
   liveIndependent?"FRESH_WARRANT_REQUIRES_INDEPENDENT_VALIDATION":"UNKNOWN";
 return {state,originalStillCited,circularSupportIds:circular,
  independentEvidenceCertified:false,realWorldStigmaDetermination:false,
  sanctionAuthority:"NOT_ASSESSED",
  explanation:"Conditional synthetic state only; a declared fresh evidence kind is not proof of genuine independence. No claim about an actual person."};
}
