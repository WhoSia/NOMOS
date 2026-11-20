import assert from 'node:assert/strict';
import { auditDecisionRecordPair } from '../tools/p2P31DecisionRecordPair.mjs';

const duke = {
  caseId: 'Regents No. 18-587 et al.', authority: 'DHS', question: 'DACA rescission',
  role: 'decision', date: '2017-09-05', actId: 'Duke-2017',
  locator: 'Duke memorandum pp. 2, 4–6', outcome: 'rescission', reasons: null,
};
const nielsen = {
  ...duke, role: 'explanation', date: '2018-06-22', locator: 'Nielsen memorandum p. 1',
};
assert.deepEqual(auditDecisionRecordPair({ before: duke, after: nielsen }), {
  status: 'no-later-decision', comparison: null,
});

const lender = {
  caseId: 'Patrick 1:23-cv-04092', authority: 'Funding Resources',
  question: 'mortgage decision', role: 'decision', date: '2023-05-01',
  actId: 'reported-May-1-denial', outcome: 'denied', reasons: null,
  locator: 'ECF 81 p. 3, ECF 65-2 Ex. A, identified denial letter',
};
const bureau = {
  ...lender, authority: 'Trans Union', question: 'dispute investigation',
  role: 'notice', date: '2023-05-11', actId: null,
  locator: 'ECF 54 pp. 16–18, ECF 33-1 Ex. 2',
};
assert.deepEqual(auditDecisionRecordPair({ before: lender, after: bureau }), {
  status: 'scope-mismatch', comparison: null,
});

// Synthetic matched pair. A new act may preserve the outcome and change an evidentiary basis.
const before = { ...duke, reasons: [{ id: 'old', locator: 'p. 1', evidence: ['withdrawn'] }] };
const after = {
  ...duke, date: '2018-06-22', actId: 'new-act', locator: 'new decision',
  reasons: [{ id: 'new', locator: 'p. 4', evidence: ['derived'] }],
};
assert.deepEqual(auditDecisionRecordPair({
  before, after, correction: { locator: 'correction notice', withdrawnSources: ['withdrawn'] },
  sources: { derived: ['withdrawn'], withdrawn: [] },
}), {
  status: 'separate-decisions',
  comparison: {
    matched: true, outcome: 'same',
    statedReasons: { added: ['new'], omitted: ['old'], changedCitations: [] },
    afterProvenance: { new: { withdrawnSources: ['withdrawn'], unresolvedSources: [] } },
  },
});
for (const [changes, status] of [
  [{ actId: before.actId }, 'same-act'],
  [{ date: before.date }, 'unresolved-order'],
  [{ date: '2017-08-31' }, 'reversed-order'],
  [{ actId: null }, 'unresolved-act-identity'],
  [{ role: 'correction' }, 'no-later-decision'],
]) {
  assert.deepEqual(auditDecisionRecordPair({ before, after: { ...after, ...changes } }), {
    status, comparison: null,
  });
}
assert.throws(() => auditDecisionRecordPair({
  before, after: { ...after, date: '2018-02-30' },
}), RangeError);
assert.throws(() => auditDecisionRecordPair({
  before, after: { ...after, role: 'untyped' },
}), TypeError);
