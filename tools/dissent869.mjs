// NOMOS 0.869: finite synthetic challenge-response court.
// Response behavior alone cannot settle an independently contested claim.
export function assessDissent869({claim, responses, independentEvidence, challengeReviewed}) {
 if(typeof claim!=="string" || !Array.isArray(responses) || !["verified","defeated","unresolved"].includes(independentEvidence) || typeof challengeReviewed!=="boolean") throw Error("Invalid packet");
 const allowed=new Set(["deny","silence","apologize","request_review"]);
 if(responses.some(r=>!allowed.has(r))) throw Error("Unknown response");
 const claimedSignals=responses.map(response=>({response,adverseCharacterWarrant:false}));
 return {claim,claimedSignals,evidenceState:independentEvidence,
  processGap:responses.includes("request_review")&&!challengeReviewed,
  responseAloneDeterminesGuilt:false,
  verdict:independentEvidence==="verified"?"ACT_SPECIFIC_EVIDENCE_PRESENT":independentEvidence==="defeated"?"ORIGINAL_SUPPORT_DEFEATED":"UNDERDETERMINED",
  personCharacterCertified:false,lawfulSanctionCertified:false,scope:"DECLARED_SYNTHETIC_ONLY"};
}
