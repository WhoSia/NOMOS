import assert from 'node:assert/strict';import{readFileSync}from'node:fs';import{auditWorlds}from'../tools/inferenceAuthorityP2P4.mjs';
const x=JSON.parse(readFileSync(new URL('../examples/p2_p4_inference_worlds.json',import.meta.url),'utf8'));const r=auditWorlds(x);
assert.equal(r.length,3);assert.ok(r.every(v=>v.flowAndInferenceEstablished===true));
assert.equal(r[0].authorityStatus,'synthetically_warranted');assert.equal(r[1].authorityStatus,'warrant_absent_in_synthetic_input');assert.equal(r[2].authorityStatus,'warrant_unknown');
assert.throws(()=>auditWorlds({}),/worlds required/);
console.log('P2-P4 synthetic same-flow distinct-claim statuses pass, not real legal findings');
