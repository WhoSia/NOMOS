// NOMOS 0.866 P4: bounded synthetic feedback ancestry court.
// A consequence caused by a label cannot validate that label by repetition.
export function auditFeedback866(x){
 if(!x||!Array.isArray(x.observations)||typeof x.labelDefeated!=="boolean")throw Error("Invalid packet");
 const ids=x.observations.map(o=>o.id);
 if(new Set(ids).size!==ids.length||x.observations.some(o=>!o.id||!["label_generated","fresh_independent","uncertain"].includes(o.origin)))throw Error("Invalid observation");
 const endogenous=x.observations.filter(o=>o.origin==="label_generated").map(o=>o.id);
 const allegedFresh=x.observations.filter(o=>o.origin==="fresh_independent").map(o=>o.id);
 const unknown=x.observations.filter(o=>o.origin==="uncertain").map(o=>o.id);
 return {endogenous,allegedFresh,unknown,
  labelCannotSelfValidate:x.labelDefeated&&endogenous.length>0,
  newEvidenceActuallyCertified:false,
  actualSocialRestorationCertified:false,
  verdict:allegedFresh.length?"INDEPENDENT_SOURCE_AUDIT_REQUIRED":unknown.length?"ANCESTRY_UNRESOLVED":endogenous.length?"ENDOGENOUS_ONLY_NO_NEW_WARRANT":"NO_NEW_OBSERVATION",
  scope:"FINITE_SYNTHETIC_ONLY"};
}
