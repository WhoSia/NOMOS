import assert from 'node:assert/strict';import{readFileSync}from'node:fs';import{verifyCustody}from'../tools/p2P7GenreScopeAudit.mjs';
const manifest=JSON.parse(readFileSync(new URL('../examples/p2_p7_primary_custody.json',import.meta.url),'utf8'));
const a=verifyCustody(manifest);
assert.equal(a.files,4);assert.deepEqual(a.problems,[]);assert.equal(a.verifiedMetadata,true);assert.equal(a.verifiedByteHash,false);
const wrong={...manifest,items:manifest.items.map(x=>x.kind==='phd_thesis'?{...x,final_parent:manifest.targets.papers.id}:x)};
assert.ok(verifyCustody(wrong).problems.some(x=>x.issue==='genre_wrong_folder'));
const badYear={...manifest,items:manifest.items.map(x=>x.kind==='phd_thesis'?{...x,publication_year:2021}:x)};
assert.ok(verifyCustody(badYear).problems.some(x=>x.issue==='thesis_year_mismatch'));
console.log('P2-P7 genre and metadata custody checks pass; binary hashes remain unverified');
