import { assessReasonTransition } from './p2P24ReasonTransition.mjs';

const scopeFields = ['caseId', 'question'];
const recordRoles = ['decision', 'explanation', 'notice', 'correction', 'recommendation'];

function validateRecord(record) {
  for (const field of [...scopeFields, 'locator']) {
    if (typeof record[field] !== 'string' || !record[field].trim()) {
      throw new TypeError(`Expected a nonempty ${field}`);
    }
  }
  if (record.authority !== null &&
      (typeof record.authority !== 'string' || !record.authority.trim())) {
    throw new TypeError('Expected the deciding authority or null');
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

// Authority is the deciding body, which may be different from the sender or recommender.
// Roles, authority and act IDs come from the source reader. This check does not certify legal effect.
export function auditDecisionRecordPair({ before, after, ...context }) {
  validateRecord(before);
  validateRecord(after);

  const bothAuthoritiesKnown = before.authority !== null && after.authority !== null;
  if (scopeFields.some(field => before[field] !== after[field]) ||
      (bothAuthoritiesKnown && before.authority !== after.authority)) {
    return { status: 'scope-mismatch', comparison: null };
  }
  if (after.date < before.date) return { status: 'reversed-order', comparison: null };
  if (before.role !== 'decision') return { status: 'no-earlier-decision', comparison: null };
  if (after.role !== 'decision') return { status: 'no-later-decision', comparison: null };
  if (!bothAuthoritiesKnown) return { status: 'unresolved-authority', comparison: null };
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
