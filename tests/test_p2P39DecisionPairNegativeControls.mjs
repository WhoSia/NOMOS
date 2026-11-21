import assert from 'node:assert/strict';
import { auditDecisionRecordPair } from '../tools/p2P31DecisionRecordPair.mjs';

// All scenarios below are synthetic. Passing does NOT certify a real correction or causal effect.
const before = {
  caseId: 'fictional', authority: 'A', question: 'eligibility',
  role: 'decision', date: '2025-01-01', actId: 'old-decision',
  outcome: 'denied', locator: 'old-record',
  reasons: [{ id: 'old-basis', locator: 'old-reason', evidence: ['retracted'] }],
};
const post = {
  ...before, date: '2025-03-01', actId: 'new-decision', locator: 'new-record',
  reasons: [{ id: 'new-basis', locator: 'new-reason', evidence: ['independent'] }],
};
const correction = { locator: 'authenticated correction', withdrawnSources: ['retracted'] };

const independent = auditDecisionRecordPair({
  before, after: post, correction, sources: { independent: [], retracted: [] },
});
assert.equal(independent.status, 'separate-decisions');
assert.equal(independent.comparison.outcome, 'same');
assert.deepEqual(independent.comparison.afterProvenance['new-basis'], {
  withdrawnSources: [], unresolvedSources: [],
});
// Same outcome with independent stated evidence is NOT itself correction failure.

const derived = auditDecisionRecordPair({
  before,
  after: { ...post, reasons: [{ id: 'new-basis', locator: 'new-reason', evidence: ['derived'] }] },
  correction,
  sources: { derived: ['retracted'], retracted: [] },
});
assert.equal(derived.comparison.outcome, 'same');
assert.deepEqual(derived.comparison.afterProvenance['new-basis'].withdrawnSources, ['retracted']);
// Cited-source dependence is a provenance result, NOT proven psychological causation.

assert.deepEqual(auditDecisionRecordPair({
  before, after: { ...post, role: 'notice' },
}), { status: 'no-later-decision', comparison: null });
assert.deepEqual(auditDecisionRecordPair({
  before, after: { ...post, authority: 'B' },
}), { status: 'scope-mismatch', comparison: null });

const unknown = auditDecisionRecordPair({ before, after: { ...post, reasons: null } });
assert.equal(unknown.comparison.statedReasons, null);
assert.equal(unknown.comparison.afterProvenance, null);

// Partial disclosure does not license invented reason additions or omissions.
const partial = auditDecisionRecordPair({
  before: { ...before, reasonCoverage: 'partial' },
  after: { ...post, reasonCoverage: 'partial' },
  correction, sources: { independent: [], retracted: [] },
});
assert.equal(partial.comparison.statedReasons.added, null);
assert.equal(partial.comparison.statedReasons.omitted, null);

console.log('P2-P39: synthetic decision-pair negative controls passed');
