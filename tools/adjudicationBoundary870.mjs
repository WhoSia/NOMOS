/**
 * NOMOS-0.870 P3: interpretive challenge and act-specific merits are orthogonal.
 * Inputs are assertions about synthetic worlds, NOT authenticated case findings.
 */
export function adjudicationBoundary870({meaning,merits,victimStanding,processMode,utteranceRelevance}) {
 if (!meaning||!merits||typeof meaning!=="object"||typeof merits!=="object") throw Error("meaning/merits objects required");
 const bool=["challengeRaised","routeUsable","examined","reasonsGiven"];
 for(const k of bool) if(typeof meaning[k]!=="boolean") throw Error("meaning."+k+" must be boolean");
 if(!["accepted","rejected","unresolved","not_applicable"].includes(meaning.disposition)) throw Error("bad meaning disposition");
 if(!["support","counterevidence","insufficient"].includes(merits.firstOrder)) throw Error("bad first order");
 if(!["independent_declared","shared_root","unexamined"].includes(merits.provenance)) throw Error("bad provenance");
 if(!["none","raised_unexamined","examined"].includes(merits.higherOrderChallenge)) throw Error("bad higher-order state");
 if(!["considered_declared","not_declared"].includes(victimStanding)) throw Error("bad victim standing");
 if(!["adjudicative","consultative"].includes(processMode)) throw Error("bad process mode");
 if(!["speech_constitutive","speech_evidentiary","speech_incidental"].includes(utteranceRelevance)) throw Error("bad utterance relevance");
 if(!meaning.challengeRaised&&meaning.disposition!=="not_applicable") throw Error("no challenge disposition mismatch");
 if(meaning.challengeRaised&&meaning.disposition==="not_applicable") throw Error("challenge disposition missing");
 let meaningStatus;
 if(!meaning.challengeRaised)meaningStatus="NO_OBJECTION_RAISED";
 else if(!meaning.routeUsable)meaningStatus="OBJECTION_ROUTE_BLOCKED";
 else if(!meaning.examined)meaningStatus="OBJECTION_NOT_EXAMINED";
 else if(!meaning.reasonsGiven)meaningStatus="OBJECTION_NO_REASONS";
 else if(meaning.disposition==="accepted")meaningStatus="ATTRIBUTION_REVISED_DECLARED";
 else if(meaning.disposition==="rejected")meaningStatus="ATTRIBUTION_DISAGREEMENT_REASONED_DECLARED";
 else meaningStatus="ATTRIBUTION_UNRESOLVED";
 let factStatus;
 if(merits.provenance==="shared_root")factStatus="DEPENDENCE_DEFEATER";
 else if(merits.provenance==="unexamined")factStatus="PROVENANCE_UNEXAMINED";
 else if(merits.higherOrderChallenge==="raised_unexamined")factStatus="CREDIBILITY_DEFEATER_UNEXAMINED";
 else if(merits.firstOrder==="support")factStatus="ACT_SUPPORT_DECLARED_NOT_AUTHENTICATED";
 else if(merits.firstOrder==="counterevidence")factStatus="ACT_COUNTEREVIDENCE_DECLARED_NOT_AUTHENTICATED";
 else factStatus="ACT_EVIDENCE_INSUFFICIENT";
 return Object.freeze({
  meaningStatus,factStatus,
  victimStanding,
  processModeDeclared:processMode,
  adjudicativeResponsivenessClaimed:processMode==="adjudicative",
  legallyBindingResponsivenessDutyCertified:false,
  semanticRevisionMayRequireMeritsReassessment:meaning.challengeRaised&&meaning.disposition==="accepted"&&utteranceRelevance!=="speech_incidental",
  utteranceRelevanceDeclared:utteranceRelevance,
  semanticRevisionAutomaticallySettlesMerits:false,
  meaningRejectionCertifiesMisconduct:false,
  absenceOfQuotationDefeatsUptake:false,
  authenticatedProvenance:false,
  actualJustificationCertified:false,
  lawfulConsequenceCertified:false,
  realWorldReliefCertified:false,
  scope:"SYNTHETIC_DECLARATIONS_ONLY"
 });
}
