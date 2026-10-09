/**
 * NOMOS-0.870 — interpretive uptake is not mere quotation.
 * Synthetic provenance declarations ONLY. Never a semantic judge of real testimony.
 */
export function auditInterpretiveUptake870(p) {
 if(!p || typeof p!=="object" || Array.isArray(p)) throw Error("packet object required");
 const required=["voiceReceived","voiceCited","issueAnsweredWithReasons","attributionDisputed",
  "attributionChallengeUsable","attributionChallengeExamined","independentCaseEvidence","victimStandingConsidered"];
 for(const x of required) if(typeof p[x]!=="boolean") throw Error("expected boolean "+x);
 if(!["aligned_declared","altered_declared","undetermined"].includes(p.attributionRelation)) throw Error("bad relation");
 let status;
 if(!p.voiceReceived)status="NO_VOICE_RECEIPT";
 else if(!p.issueAnsweredWithReasons)status="ISSUE_NOT_ANSWERED_WITH_REASONS";
 else if(p.attributionDisputed&&!p.attributionChallengeUsable)status="INTERPRETATION_CHALLENGE_BLOCKED";
 else if(p.attributionDisputed&&!p.attributionChallengeExamined)status="INTERPRETATION_CHALLENGE_NOT_EXAMINED";
 else if(p.attributionRelation==="altered_declared")status="ATTRIBUTION_DIVERGENCE_REMAINS";
 else if(p.attributionRelation==="undetermined")status="ATTRIBUTION_NOT_CERTIFIED";
 else status="DECLARED_SEMANTIC_UPTAKE_CANDIDATE";
 return {
  status,
  victimPerspectiveCoverage:p.victimStandingConsidered?"DECLARED_CONSIDERED":"MISSING_OR_NOT_DECLARED",
  actEvidenceDeclaredIndependent:p.independentCaseEvidence,
  attributionDisagreementReviewed:p.attributionDisputed&&p.attributionChallengeExamined,
  statementLiterallyCited:p.voiceCited, // not a required condition for reasoned uptake
  statementAloneSettlesLiability:false,
  legitimateNoChangeStillPossible:true,
  realWorldSemanticAccuracyCertified:false,
  realWorldRemedialEffectCertified:false,
  synthetic:true
 };
}
