import assert from 'node:assert/strict';
import { assessReasonTransition } from '../tools/p2P24ReasonTransition.mjs';

const scope = { caseId: 'case-a', authority: 'agency-a', question: 'eligibility-for-period-a' };
const reason = (id, ...evidence) => ({ id, locator: `synthetic/${id}`, evidence });
const record = (reasons, outcome = 'denied') => ({ ...scope, reasons, outcome });
const original = record([reason('original', 'old')]);
const correction = { locator: 'synthetic/correction', withdrawnSources: ['old'] };
const sources = { old: [], summary: ['old'], memo: ['summary'], independent: [] };
const run = (after, before = original) => assessReasonTransition({ before, after, correction, sources });

const derivative = run(record([reason('new-label', 'memo')]));
assert.equal(derivative.outcome, 'same');
assert.deepEqual(derivative.statedReasons, { added: ['new-label'], omitted: ['original'], changedCitations: [] });
assert.deepEqual(derivative.afterProvenance['new-label'], { withdrawnSources: ['old'], unresolvedSources: [] });

const alreadyIndependent = record([reason('original', 'old'), reason('standing', 'independent')]);
const maintained = run(record([reason('standing', 'independent')]), alreadyIndependent);
assert.equal(maintained.outcome, 'same');
assert.deepEqual(maintained.statedReasons, { added: [], omitted: ['original'], changedCitations: [] });
assert.deepEqual(maintained.afterProvenance.standing, { withdrawnSources: [], unresolvedSources: [] });

const changed = run(record([reason('original', 'independent')]));
assert.deepEqual(changed.statedReasons, { added: [], omitted: [], changedCitations: ['original'] });
assert.equal(run(record([reason('original', 'old')], 'approved')).outcome, 'different');
assert.equal(run(record(null, null)).outcome, 'unknown');
assert.equal(run(record(null)).statedReasons, null);
assert.equal(run(record([reason('new-label', 'memo')]), record(null)).statedReasons, null);

const incomplete = run(record([reason('mixed', 'independent', 'old', 'unread')]));
assert.deepEqual(incomplete.afterProvenance.mixed, { withdrawnSources: ['old'], unresolvedSources: ['unread'] });
const mismatch = run({ ...record([reason('original', 'old')]), question: 'different-period' });
assert.deepEqual(mismatch, { matched: false, outcome: 'unknown', statedReasons: null, afterProvenance: null });
assert.equal(assessReasonTransition({ before: original, after: original }).afterProvenance, null);
assert.deepEqual(run(record([])).afterProvenance, {});
assert.throws(() => run(record([reason('same', 'old'), reason('same', 'memo')])), TypeError);

assert.throws(() => assessReasonTransition({
  before: original, after: record([reason('cycle', 'a')]), correction, sources: { a: ['b'], b: ['a'] },
}), /Cyclic evidence provenance/);

console.log('P2-P24 stated reasons and provenance controls passed');
