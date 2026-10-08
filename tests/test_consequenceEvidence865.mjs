import assert from "node:assert/strict";
import {assessConsequenceEvidence865} from "../tools/consequenceEvidence865.mjs";
const scope={caseId:"fiction",personKey:"pseudonym",asOf:"t1",governingCopyId:"g"};
const baseline={scope,inventory:{activeRecipients:["a","b"],observedRecipients:["a","b"],externallyCertified:true},
 semantic:{freshWarrant:true,defeatedSourceExcluded:true,generatorReplayClean:true},
 observation:{independenceCertified:true},
 consequences:[{recipient:"a",state:"CORRECTED"},{recipient:"b",state:"CORRECTED"}],
 causality:{designExternallyValidated:false}};
const f=(delta)=>assessConsequenceEvidence865({...baseline,...delta});
assert.equal(f({}).status,"CONDITIONALLY_SUPPORTED_IN_DECLARED_SYNTHETIC_SCOPE");
assert.equal(f({}).realWorldCertification,false);
assert.equal(f({inventory:{...baseline.inventory,externallyCertified:false}}).status,"UNKNOWN");
assert.deepEqual(f({inventory:{...baseline.inventory,observedRecipients:["a"]}}).missingRecipients,["b"]);
assert.equal(f({observation:{independenceCertified:false}}).status,"UNKNOWN");
assert.equal(f({semantic:{...baseline.semantic,generatorReplayClean:false}}).status,"UNKNOWN");
assert.equal(f({consequences:[baseline.consequences[0],{recipient:"b",state:"STALE"}]}).status,"OBSERVED_INCOMPLETE");
assert.equal(f({consequences:[baseline.consequences[0],{recipient:"b",state:"UNKNOWN"}]}).status,"UNKNOWN");
assert.equal(f({consequences:[{...baseline.consequences[0],historicalDebt:true},baseline.consequences[1]]}).status,"UNKNOWN");
assert.equal(f({causality:{designExternallyValidated:true}}).causalAttribution,"DESIGN_CLAIM_REQUIRES_INDEPENDENT_AUDIT");
assert.throws(()=>f({inventory:{...baseline.inventory,activeRecipients:["a","a"]}}));
assert.throws(()=>f({scope:{...scope,personKey:""}}));
console.log("NOMOS 0.865 bounded consequence evidence tests PASS");