import assert from 'node:assert/strict';import{readFileSync}from'node:fs';
import{auditCorpus,auditDependency}from'../tools/p2P13DependencyAudit.mjs';
const d=JSON.parse(readFileSync(new URL('../examples/p2_p13_dependency_worlds.json',import.meta.url),'utf8'));
const x=auditCorpus(d);assert.equal(x.rows.length,4);assert.equal(x.observationalClasses,1);assert.equal(x.underdeterminedClasses,1);
assert.deepEqual(d.worlds[0].observed,d.worlds[1].observed);assert.deepEqual(d.worlds[1].observed,d.worlds[2].observed);
assert.ok(x.rows.every(r=>r.independentlyVerifiedAuthority===false));
assert.throws(()=>auditDependency({...d.worlds[0],mechanism:'magic'}),/malformed/);
assert.throws(()=>auditCorpus({}),/worlds required/);
console.log('P2-P13 synthetic dependency ambiguity validated; no real legal authority asserted');
