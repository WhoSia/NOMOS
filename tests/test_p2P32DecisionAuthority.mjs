import assert from 'node:assert/strict';
import { auditDecisionRecordPair } from '../tools/p2P31DecisionRecordPair.mjs';

const order = {
  caseId: 'Fikre 3:13-cv-00899', question: 'No Fly listing',
  authority: 'TSA', role: 'decision', actId: '2015-final-order',
  date: '2015-03-09', locator: 'No. 22-1178 App. G pp. 119a–121a',
  reasons: null, outcome: 'maintained',
};
const notice = {
  ...order, authority: null, role: 'notice', actId: null, date: '2016-05-06',
  locator: 'No. 22-1178 App. F paragraph 4 and 601 U.S. 234',
  outcome: 'removed',
};

assert.deepEqual(auditDecisionRecordPair({ before: order, after: notice }), {
  status: 'no-later-decision', comparison: null,
});

// Even if an operative decision were found, a recipient or messenger would not identify its issuer.
const unassigned = { ...notice, role: 'decision', actId: 'candidate-order' };
assert.deepEqual(auditDecisionRecordPair({ before: order, after: unassigned }), {
  status: 'unresolved-authority', comparison: null,
});
assert.deepEqual(auditDecisionRecordPair({
  before: { ...order, authority: null }, after: unassigned,
}), { status: 'unresolved-authority', comparison: null });
assert.deepEqual(auditDecisionRecordPair({
  before: order, after: {
    ...unassigned, authority: 'TSA', role: 'recommendation',
  },
}), { status: 'no-later-decision', comparison: null });
assert.deepEqual(auditDecisionRecordPair({
  before: order, after: { ...unassigned, authority: 'TSC' },
}), { status: 'scope-mismatch', comparison: null });
assert.equal(auditDecisionRecordPair({
  before: order, after: { ...unassigned, authority: 'TSA' },
}).comparison.outcome, 'different');
assert.throws(() => auditDecisionRecordPair({
  before: order, after: { ...unassigned, authority: undefined },
}), TypeError);
