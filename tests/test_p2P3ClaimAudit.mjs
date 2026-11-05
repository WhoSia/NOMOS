import assert from 'node:assert/strict';import{readFileSync}from'node:fs';import{auditCloseReading}from'../tools/p2P3ClaimAudit.mjs';
const x=JSON.parse(readFileSync(new URL('../examples/p2_p3_primary_claims.json',import.meta.url),'utf8'));const a=auditCloseReading(x);
assert.equal(a.sourceCount,3);assert.ok(a.priorArtCapabilities.includes('derived_attribute_rules'));assert.ok(a.priorArtCapabilities.includes('aggregated_purpose_propagation'));assert.equal(a.externalNoveltyCertified,false);
assert.throws(()=>auditCloseReading({}),/exactly/);assert.throws(()=>auditCloseReading({...x,sources:[x.sources[0],x.sources[0],x.sources[2]]}),/duplicate/);
console.log('P2-P3 primary text source-ledger integrity passed');
