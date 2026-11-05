import assert from 'node:assert/strict';import{readFileSync}from'node:fs';import{validateCaseCorpus}from'../tools/p2CaseClaims.mjs';
const fixture=JSON.parse(readFileSync(new URL('../examples/p2_p1_case_ledger.json',import.meta.url),'utf8'));const result=validateCaseCorpus(fixture);
assert.equal(result.length,3);assert.equal(result.reduce((s,c)=>s+c.scopeGuardCount,0),6);assert.ok(result.every(x=>x.independentlyAdjudicated===false));
assert.throws(()=>validateCaseCorpus({cases:[]}),/nonempty/);assert.throws(()=>validateCaseCorpus({cases:[fixture.cases[0],fixture.cases[0]]}),/duplicate/);
console.log('P2-P1 fixture integrity passes (not legal adjudication)');
