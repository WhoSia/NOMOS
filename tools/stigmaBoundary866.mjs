// NOMOS-0.866 P2: independent axes, synthetic descriptions only.
// Distinguishes warranted criticism, group stigma and private sanction.
const valid=(x,m)=>{if(!x)throw Error(m)};
export function classifyResponse866(x){
 valid(x&&typeof x==="object","Packet required");
 const keys=["evidenceVerified","claimScopedToAct","personTraitGeneralized","groupBoundaryInvoked","powerAsymmetry","collectivePenalty","proportionate","reviewAvailable"];
 valid(keys.every(k=>typeof x[k]==="boolean"),"Explicit boolean dimensions required");
 const criticism=x.evidenceVerified&&x.claimScopedToAct;
 const stigmaCandidate=x.personTraitGeneralized&&x.groupBoundaryInvoked&&x.powerAsymmetry;
 const sanction=x.collectivePenalty;
 const dueProcessConcern=sanction&&(!x.proportionate||!x.reviewAvailable);
 const falseExonerationRisk=x.evidenceVerified&&x.claimScopedToAct;
 return {scopedCriticismSupported:criticism,stigmaCandidate,collectiveSanctionPresent:sanction,
  sanctionProceduralConcern:dueProcessConcern,falseExonerationRisk,
  stigmaCertified:false,lawfulnessCertified:false,identityJudgmentAuthorized:false,
  limitations:"Analytic axes, not ground truth. Power, evidence and fairness values are caller assertions. Stigma may not require all features; scholarly definitions contested."};
}
