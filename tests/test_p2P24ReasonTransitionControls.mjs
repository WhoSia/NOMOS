import assert from 'node:assert/strict';
import { assessReasonTransition } from '../tools/p2P24ReasonTransition.mjs';

const scope = { caseId: 'control', authority: 'authority', question: 'one-period' };
const before = { ...scope, outcome: 'denied', reasons: [{ id: 'claim', locator: 't1', evidence: ['old'] }] };
const correction = { locator: 't2', withdrawnSources: ['old'] };

for (const citations of [['record-a', 'record-b'], ['record-b', 'record-a']]) {
  const after = { ...scope, outcome: 'denied', reasons: [{ id: 'claim', locator: 't3', evidence: citations }] };
  const scenarios = [
    [{ 'record-a': ['old'], 'record-b': [], old: [] }, ['old'], []],
    [{ 'record-a': [], 'record-b': ['old'], old: [] }, ['old'], []],
    [{ 'record-a': [], 'record-b': [], old: [] }, [], []],
    [{ 'record-a': [], old: [] }, [], ['record-b']],
  ];
  for (const [sources, withdrawnSources, unresolvedSources] of scenarios) {
    const result = assessReasonTransition({ before, after, correction, sources });
    assert.equal(result.outcome, 'same');
    assert.deepEqual(result.statedReasons.changedCitations, ['claim']);
    assert.deepEqual(result.afterProvenance.claim, { withdrawnSources, unresolvedSources });
  }
}

// A shared ancestor in an acyclic graph is not mistaken for a cycle.
const after = { ...scope, outcome: null, reasons: [{ id: 'claim', locator: 't3', evidence: ['join'] }] };
const sources = { join: ['left', 'right'], left: ['old'], right: ['old'], old: [] };
assert.deepEqual(assessReasonTransition({ before, after, correction, sources }).afterProvenance.claim, {
  withdrawnSources: ['old'], unresolvedSources: [],
});
console.log('P2-P24 source-order, missing source, and converging-ancestry controls passed');
