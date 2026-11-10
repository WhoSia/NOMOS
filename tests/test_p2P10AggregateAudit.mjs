import assert from 'node:assert/strict';import{readFileSync}from'node:fs';
import{auditAggregates}from'../tools/p2P10AggregateAudit.mjs';
const d=JSON.parse(readFileSync(new URL('../examples/p2_p10_reported_aggregates.json',import.meta.url),'utf8'));
const a=auditAggregates(d);assert.equal(a.difference,-7.47);assert.equal(a.pValueStatus,'source_pvalue_not_validated');
assert.equal(a.pValueVerified,false);assert.equal(a.regressionReplicated,false);assert.equal(a.reported_t,10.22);
const valid=auditAggregates({...d,contrast:{...d.contrast,reported_p_threshold_text:'p < 0.05'}});
assert.equal(valid.pValueStatus,'reporting_syntactically_valid');assert.equal(valid.pValueVerified,false);
assert.throws(()=>auditAggregates({}),/design\/contrast/);
console.log('P2-P10 aggregate arithmetic and invalid p-report flag passed; no regression replication');
