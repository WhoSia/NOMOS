import assert from 'node:assert/strict';import{readFileSync}from'node:fs';
import{auditView,physicalOnly}from'../tools/p2P9SultanPolicy.mjs';
const cases=JSON.parse(readFileSync(new URL('../examples/p2_p9_sultan_scenarios.json',import.meta.url),'utf8')).scenarios;
assert.equal(cases.length,6);
for(const c of cases){const r=auditView(c);assert.equal(r.mode,c.expected,c.id);assert.deepEqual(r.visible,c.visible,c.id);assert.equal(r.visible.filter(x=>r.masked.includes(x)).length,0);}
const mixed=cases[0];assert.deepEqual(physicalOnly(mixed).visible,['vehicle_1','bystander_2']);assert.deepEqual(auditView(mixed).visible,['vehicle_1']);
assert.deepEqual(auditView(cases[3]).visible,[]);
assert.throws(()=>auditView({}),/malformed/);
console.log('P2-P9 six synthetic scenarios pass; no XACML implementation certification');
