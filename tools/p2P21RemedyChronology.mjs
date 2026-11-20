import { assessRecipientEvidence } from './p2P20RecipientEvidence.mjs';

function checkDate(date) {
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new TypeError('Expected a date in YYYY-MM-DD format');
  }
  const timestamp = Date.parse(date);
  if (!Number.isFinite(timestamp) || new Date(timestamp).toISOString().slice(0, 10) !== date) {
    throw new RangeError('Expected a real calendar date');
  }
}

// One already matched case, decision and recipient. Date order alone does not prove causation.
export function assessRemedyChronology({ observations, decisionDate, instrumentSignatureDate }) {
  checkDate(decisionDate);
  checkDate(instrumentSignatureDate);

  return {
    ...assessRecipientEvidence(observations),
    signedInstrumentCanPrecedeDecision: instrumentSignatureDate === decisionDate
      ? 'unknown'
      : instrumentSignatureDate < decisionDate,
  };
}
