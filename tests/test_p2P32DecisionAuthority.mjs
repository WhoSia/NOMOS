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

// The visa refusal is a distinct decision. Neither the January court order
// nor the April FBI status letter is a visa decision by the receiving actor.
const visaRefusal = {
  caseId: 'Ibrahim 3:06-cv-00545-WHA', question: 'visa eligibility',
  authority: 'Department of State', role: 'decision', actId: '2014-04-14-refusal',
  date: '2014-04-14', locator: 'ECF 737-6 Ex. A', reasons: null, outcome: 'refused',
};
const courtOrder = {
  ...visaRefusal, question: 'correction of erroneous designations',
  authority: 'District Court', actId: '2014-01-14-merits-order',
  date: '2014-01-14', locator: 'ECF 701-1 conclusion A', outcome: 'correction ordered',
};
const statusLetter = {
  ...visaRefusal, question: 'No Fly List status',
  authority: 'FBI', role: 'notice', actId: null,
  date: '2014-04-15', locator: 'ECF 737-8', outcome: 'status reported',
};
for (const pair of [
  { before: courtOrder, after: visaRefusal },
  { before: visaRefusal, after: statusLetter },
]) {
  assert.deepEqual(auditDecisionRecordPair(pair), {
    status: 'scope-mismatch', comparison: null,
  });
}
