import assert from 'node:assert/strict';
import { assessReasonTransition } from '../tools/p2P24ReasonTransition.mjs';

const scope = { caseId: 'D.Or. 3:13-cv-00899', authority: 'TSA', question: 'No Fly listing' };
const decision = { ...scope, outcome: 'maintained', reasons: null, reasonCoverage: 'partial' };
const notice = { ...scope, authority: 'TSC', outcome: 'removed', reasons: null };
assert.deepEqual(assessReasonTransition({ before: decision, after: notice }), {
  matched: false, outcome: 'unknown', statedReasons: null, afterProvenance: null,
});

// Constructed same-authority controls, separate from the actual records above.
const before = { ...decision, reasons: [
  { id: 'shared', locator: 'p. 1', evidence: ['old'] },
  { id: 'earlier-disclosed', locator: 'p. 2', evidence: ['old'] },
] };
const after = { ...scope, outcome: 'maintained', reasonCoverage: 'partial', reasons: [
  { id: 'shared', locator: 'p. 3', evidence: ['new'] },
  { id: 'later-disclosed', locator: 'p. 4', evidence: ['new'] },
] };

assert.deepEqual(assessReasonTransition({ before, after }).statedReasons, {
  added: null, omitted: null, changedCitations: ['shared'],
});
assert.deepEqual(assessReasonTransition({
  before: { ...before, reasonCoverage: 'complete' }, after,
}).statedReasons, {
  added: ['later-disclosed'], omitted: null, changedCitations: ['shared'],
});
assert.deepEqual(assessReasonTransition({
  before, after: { ...after, reasonCoverage: 'complete' },
}).statedReasons, {
  added: null, omitted: ['earlier-disclosed'], changedCitations: ['shared'],
});
assert.throws(() => assessReasonTransition({
  before: { ...before, reasonCoverage: 'assumed' }, after,
}), TypeError);
