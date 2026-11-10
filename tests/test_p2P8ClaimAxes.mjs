import assert from 'node:assert/strict';
import {auditClaimAxes,enumerateAxes} from '../tools/p2P8ClaimAxes.mjs';
const all=enumerateAxes();
assert.equal(all.length,81);
for(const {facts,result} of all){
 if(result.claimUseAuthority==='yes')assert.deepEqual([facts.evidence,facts.construct,facts.authority],['yes','yes','yes']);
 if(result.completeWarrantAndOutcome==='yes')assert.deepEqual(Object.values(facts),['yes','yes','yes','yes']);
 if(facts.outcome==='unknown')assert.equal(result.downstreamOutcomeIndependentlyObserved,'unknown');
}
assert.equal(auditClaimAxes({evidence:'yes',construct:'yes',authority:'yes',outcome:'unknown'}).claimUseAuthority,'yes');
assert.equal(auditClaimAxes({evidence:'yes',construct:'yes',authority:'yes',outcome:'unknown'}).completeWarrantAndOutcome,'unknown');
assert.equal(auditClaimAxes({evidence:'yes',construct:'no',authority:'unknown',outcome:'yes'}).claimUseAuthority,'no');
assert.throws(()=>auditClaimAxes({}),/invalid/);
console.log('P2-P8 complete 81-case three-valued predicate lattice passed, synthetic only');
