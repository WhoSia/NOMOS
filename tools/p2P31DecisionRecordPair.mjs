import { assessReasonTransition } from './p2P24ReasonTransition.mjs';

const scopeFields = ['caseId', 'authority', 'question'];
const recordRoles = ['decision', 'explanation', 'notice', 'correction'];

function validateRecord(record) {
  for (const field of [...scopeFields, 'locator']) {
    if (typeof record[field] !== 'string' || !record[field].trim()) {
      throw new TypeError(`Expected a nonempty ${field}`);
    }
  }
  if (!recordRoles.includes(record.role)) throw new TypeError('Unknown record role');
  if (record.actId !== null &&
      (typeof record.actId !== 'string' || !record.actId.trim())) {
    throw new TypeError('Expected an act ID or null');
  }
  const { date } = record;
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new TypeError('Expected a date in YYYY-MM-DD form');
  }
  const parsed = new Date(date);
  if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) {
    throw new RangeError('Expected a valid calendar date');
  }
}

// Document roles and act IDs are supplied by the source reader. Titles and stated outcomes
// cannot establish them. This check compares decisions and does not certify their legal effect.
export function auditDecisionRecordPair({ before, after, ...context }) {
  validateRecord(before);
  validateRecord(after);

  if (scopeFields.some(field => before[field] !== after[field])) {
    return { status: 'scope-mismatch', comparison: null };
  }
  if (after.date < before.date) return { status: 'reversed-order', comparison: null };
  if (before.role !== 'decision') return { status: 'no-earlier-decision', comparison: null };
  if (after.role !== 'decision') return { status: 'no-later-decision', comparison: null };
  if (before.actId === null || after.actId === null) {
    return { status: 'unresolved-act-identity', comparison: null };
  }
  if (before.actId === after.actId) return { status: 'same-act', comparison: null };
  if (before.date === after.date) return { status: 'unresolved-order', comparison: null };

  return {
    status: 'separate-decisions',
    comparison: assessReasonTransition({ before, after, ...context }),
  };
}
