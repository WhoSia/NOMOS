// NOMOS-0.865 P2–P4: bounded synthetic consequence-evidence court.
// Positive real-world authority is never manufactured from caller-supplied labels.
const fail=(m)=>{throw Error(m)};
const tok=x=>typeof x==="string"&&x.length>0;
export function assessConsequenceEvidence865({scope,inventory,semantic,observation,consequences,causality}){
 if(!scope||!["caseId","personKey","asOf","governingCopyId"].every(k=>tok(scope[k])))fail("Invalid person-relative scope");
 if(!inventory||!Array.isArray(inventory.activeRecipients)||!Array.isArray(inventory.observedRecipients))fail("Invalid recipient census");
 const active=inventory.activeRecipients, seen=inventory.observedRecipients;
 if(new Set(active).size!==active.length||new Set(seen).size!==seen.length||!active.every(tok)||!seen.every(tok))fail("Invalid recipient identities");
 const missing=active.filter(x=>!seen.includes(x)),extra=seen.filter(x=>!active.includes(x));
 const flags=[];
 if(inventory.externallyCertified!==true)flags.push("RECIPIENT_UNIVERSE_UNCERTIFIED");
 if(missing.length||extra.length)flags.push("RECIPIENT_CENSUS_MISMATCH");
 if(!observation||observation.independenceCertified!==true)flags.push("OBSERVATION_AUTHORITY_UNCERTIFIED");
 if(!semantic||semantic.freshWarrant!==true||semantic.defeatedSourceExcluded!==true||semantic.generatorReplayClean!==true)flags.push("SEMANTIC_REPAIR_UNESTABLISHED");
 const outcomes=Array.isArray(consequences)?consequences:[];
 if(!Array.isArray(consequences)||outcomes.some(x=>!x||!tok(x.recipient)||!["CORRECTED","STALE","UNKNOWN"].includes(x.state)))fail("Invalid consequence reports");
 const stale=outcomes.filter(x=>x.state==="STALE").map(x=>x.recipient);
 if(stale.length)flags.push("ACTIVE_STALE_RECIPIENT");
 const uncovered=active.filter(x=>!outcomes.some(c=>c.recipient===x&&c.state==="CORRECTED"));
 if(uncovered.length)flags.push("UNSUPPORTED_ACTIVE_OUTCOME");
 const historicalDebt=outcomes.some(x=>x.historicalDebt===true);
 if(historicalDebt)flags.push("UNREPAIRED_HISTORICAL_DEBT");
 const causal=causality?.designExternallyValidated===true?"DESIGN_CLAIM_REQUIRES_INDEPENDENT_AUDIT":"NOT_IDENTIFIED";
 // Even perfect declared inputs do not supply external authentication.
 const status=stale.length?"OBSERVED_INCOMPLETE":flags.length?"UNKNOWN":"CONDITIONALLY_SUPPORTED_IN_DECLARED_SYNTHETIC_SCOPE";
 return {status,flags,missingRecipients:missing,unexpectedRecipients:extra,uncoveredRecipients:uncovered,
 historicalDebt,causalAttribution:causal,realWorldCertification:false,
 scope,interpretation:"Positive synthetic completeness is conditional on independently certified inventory, independence, fresh warrant and all scoped outcomes; boolean inputs do not constitute real certification."};
}
