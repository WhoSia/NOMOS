/**
 * NOMOS-0.870: DECLARED synthetic voice-to-uptake trace.
 * All fields are assertions in a toy world; this cannot verify any real person's entitlement,
 * independence of review, correctness of a judgment, causation, or a real remedy.
 */
const stages=["voiceUsable","challengeSubmitted","issueConsidered","reasonsCommunicated",
 "judgmentRevised","remedyAuthorized","remedyDispatched","downstreamReadback","reliefClaimRecorded"];
export function assessUptake870(packet) {
 if(!packet||typeof packet!=="object"||Array.isArray(packet)) throw Error("invalid packet");
 for(const s of stages) if(typeof packet[s]!=="boolean") throw Error("boolean required: "+s);
 if(packet.reasonedNoChange!==undefined&&typeof packet.reasonedNoChange!=="boolean") throw Error("invalid no-change reason");
 if(packet.reasonedNoChange&&packet.judgmentRevised) throw Error("contradictory decision path");
 const issue=stages.find(s=>packet[s]!==true);
 const heard=packet.voiceUsable&&packet.challengeSubmitted&&packet.issueConsidered&&packet.reasonsCommunicated;
 const noChange=heard&&!packet.judgmentRevised&&packet.reasonedNoChange===true;
 const declaredEndToEnd=stages.every(s=>packet[s]);
 let status;
 if(!packet.voiceUsable)status="VOICE_NOT_USABLE";
 else if(!packet.challengeSubmitted)status="VOICE_ONLY";
 else if(!packet.issueConsidered)status="SUBMITTED_NOT_CONSIDERED";
 else if(!packet.reasonsCommunicated)status="CONSIDERED_NO_REASONS";
 else if(!packet.judgmentRevised)status=noChange?"REASONED_NO_CHANGE":"NO_DECLARED_REVISION";
 else if(!packet.remedyAuthorized)status="REVISION_WITHOUT_REMEDY_AUTHORITY";
 else if(!packet.remedyDispatched)status="REMEDY_ORDERED_NOT_DISPATCHED";
 else if(!packet.downstreamReadback)status="DISPATCH_WITHOUT_READBACK";
 else if(!packet.reliefClaimRecorded)status="READBACK_WITHOUT_PERSON_RELIEF";
 else status="DECLARED_CHAIN_COMPLETE";
 return {
  status, heard, reasonedNoChange:noChange,
  declaredEndToEnd, firstMissingDeclaredStage:issue||null,
  authenticatedObserverIndependence:false,
  independentlyVerifiedCausalRelief:false,
  realWorldLegitimacyCertified:false,
  note:"Synthetic declared-state classification; no empirical/legal certification"
 };
}
