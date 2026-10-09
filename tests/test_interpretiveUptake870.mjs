import assert from "node:assert/strict";
import {auditInterpretiveUptake870 as a} from "../tools/interpretiveUptake870.mjs";
const x={voiceReceived:true,voiceCited:true,issueAnsweredWithReasons:true,attributionDisputed:false,
 attributionChallengeUsable:true,attributionChallengeExamined:true,independentCaseEvidence:false,
 victimStandingConsidered:true,attributionRelation:"aligned_declared"};
const t=v=>a({...x,...v});
assert.equal(t({}).status,"DECLARED_SEMANTIC_UPTAKE_CANDIDATE");
assert.equal(t({voiceReceived:false}).status,"NO_VOICE_RECEIPT");
assert.equal(t({voiceCited:false}).status,"FORMAL_HEARING_NOT_SUBSTANTIVE_REPLY");
assert.equal(t({issueAnsweredWithReasons:false}).status,"FORMAL_HEARING_NOT_SUBSTANTIVE_REPLY");
assert.equal(t({attributionDisputed:true,attributionChallengeUsable:false}).status,"INTERPRETATION_CHALLENGE_BLOCKED");
assert.equal(t({attributionDisputed:true,attributionChallengeExamined:false}).status,"INTERPRETATION_CHALLENGE_NOT_EXAMINED");
assert.equal(t({attributionRelation:"altered_declared"}).status,"ATTRIBUTION_DIVERGENCE_REMAINS");
assert.equal(t({attributionRelation:"undetermined"}).status,"ATTRIBUTION_NOT_CERTIFIED");
assert.equal(t({victimStandingConsidered:false}).victimPerspectiveCoverage,"MISSING_OR_NOT_DECLARED");
assert.equal(t({attributionDisputed:true}).attributionDisagreementReviewed,true);
assert.equal(t({independentCaseEvidence:true}).statementAloneSettlesLiability,false);
assert.equal(t({}).realWorldSemanticAccuracyCertified,false);
assert.equal(t({}).realWorldRemedialEffectCertified,false);
assert.throws(()=>t({attributionRelation:"guess"}));
assert.throws(()=>t({voiceReceived:"true"}));
console.log("NOMOS 0.870 interpretive attribution PASS");
