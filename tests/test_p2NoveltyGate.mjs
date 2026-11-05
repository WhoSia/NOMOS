import assert from 'node:assert/strict';import{readFileSync}from'node:fs';import{noveltyGate}from'../tools/p2NoveltyGate.mjs';
const f=JSON.parse(readFileSync(new URL('../examples/p2_p2_rivals.json',import.meta.url),'utf8'));const a=noveltyGate(f);
assert.equal(a.promotionReady,false);assert.equal(a.evidenceOfIncrementalValue,false);
assert.ok(a.priorCapabilities.includes('purpose_constraint'));assert.ok(a.priorCapabilities.includes('transmission_norms'));
assert.throws(()=>noveltyGate({}),/benchmark data/);
assert.equal(noveltyGate({...f,candidate:{...f.candidate,empirical_added_value:'measured_independent_gain'}}).promotionReady,false);
console.log('P2-P2 prior-art gate correctly holds unvalidated novelty');
