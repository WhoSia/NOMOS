// NOMOS-0.878 P2: source-bound chronological evidence audit, not legal advice.
// The 2026 child-support Act is encoded only as a source-specific test fixture.
export const ACT2026 = Object.freeze({
  citation: 'C2026A00030',
  assent: '2026-04-01',
  schedule1Commencement: '2026-04-02',
  lawUrl: 'https://www.legislation.gov.au/C2026A00030/asmade',
  item: 'Schedule 1, Part 2, items 16-17',
});
const DATE = /^\d{4}-(0[1-9]|1[0-2])-([0-2]\d|3[01])$/;
function date(x) {
  if (typeof x !== 'string' || !DATE.test(x) ||
    Number.isNaN(Date.parse(x)) || new Date(x).toISOString().slice(0, 10) !== x)
    throw new TypeError('expected real ISO date YYYY-MM-DD');
  return x;
}
function evidence(x) { return typeof x === 'string' && x.trim().length > 0; }
const decisionKinds = new Set(['assessment','objection','tribunal-review','court']);
export function auditTemporalCase878(input = {}) {
  const {caseId, decidedOn, kind, appeal, stay, law, finalCourt, caseFacts, consequences} = input;
  if (!evidence(caseId)) throw new TypeError('caseId required');
  date(decidedOn);
  if (!decisionKinds.has(kind)) throw new TypeError('unknown case kind');
  if (law?.citation && law.citation !== ACT2026.citation) throw new TypeError('different statute requires another audit');
  if (law?.effectiveOn && law.effectiveOn !== ACT2026.schedule1Commencement)
    throw new TypeError('source-locked commencement cannot be overridden');
  const effective = ACT2026.schedule1Commencement;
  const timeline = decidedOn < effective ? 'BEFORE_SCHEDULE1' : 'ON_OR_AFTER_SCHEDULE1';
  const appealFiled = Boolean(appeal?.filedOn && evidence(appeal?.filingReceipt));
  if (appeal?.filedOn) date(appeal.filedOn);
  if (appeal?.filedOn && !evidence(appeal?.filingReceipt)) throw new TypeError('appeal receipt required');
  const hasStay = Boolean(stay?.orderId && stay?.court && stay?.scope && stay?.issuedOn && stay?.orderSource);
  if (stay?.issuedOn) date(stay.issuedOn);
  if (stay?.endsOn) date(stay.endsOn);
  if (hasStay && stay.issuedOn > decidedOn) {
    // A later stay can exist but was not operative at the decision date.
  }
  const stayOnDecisionDate = hasStay && stay.issuedOn <= decidedOn &&
    (!stay.endsOn || decidedOn <= stay.endsOn) &&
    (stay.caseId === caseId || stay.relatedCaseId === caseId);
  const stayStatus = stayOnDecisionDate ? 'ORDER_EVIDENCED_DATE_MATCH_SCOPE_UNASSESSED'
    : (appealFiled ? 'APPEAL_BUT_NO_APPLICABLE_STAY_EVIDENCED' : 'NO_APPEAL_OR_STAY_EVIDENCED');
  const courtFinalBefore = finalCourt?.heardAndFinallyDetermined === true &&
    Boolean(finalCourt?.finalJudgmentSource && finalCourt?.finalOn) &&
    date(finalCourt.finalOn) < effective;
  const courtCandidate = finalCourt?.heardAndFinallyDetermined && !courtFinalBefore
    ? 'COURT_FINALITY_CLAIM_NOT_VERIFIED_IN_TIME' : null;
  if (finalCourt?.finalOn) date(finalCourt.finalOn);
  const careBasis = caseFacts?.part2Less35Basis === true && caseFacts?.basisSource;
  const decisionRelevant = caseFacts?.assessmentRelevant === true && evidence(caseFacts?.assessmentSource);
  const trace = {
    ...ACT2026, caseId, decidedOn, kind, timeline, appealFiled, stayStatus,
    courtFinalBefore, evidenceOfCareBasis: Boolean(careBasis),
    documentedAssessment: Boolean(decisionRelevant),
    historicalEffectObserved: evidence(consequences?.independentReadback),
  };
  const issues = [];
  if (!decisionRelevant) issues.push('ASSESSMENT_RELEVANCE_UNWITNESSED');
  if (!careBasis) issues.push('LESS_THAN_35_BASIS_UNWITNESSED');
  if (courtCandidate) issues.push(courtCandidate);
  if (stay?.orderId && !hasStay) issues.push('INCOMPLETE_COURT_STAY_PROVENANCE');
  if (stayOnDecisionDate) issues.push('STAY_PERSON_AND_ORDER_SCOPE_REQUIRES_LEGAL_INTERPRETATION');
  if (!trace.historicalEffectObserved) issues.push('PERSON_LEVEL_RESULT_UNOBSERVED');
  return {
    trace,
    section16: courtFinalBefore ? 'FINAL_COURT_EXCEPTION_CANDIDATE'
      : decisionRelevant && careBasis ? 'APPLICATION_REQUIRES_LEGAL_AND_CASE_REVIEW'
      : 'INSUFFICIENT_FOR_SCOPE',
    section17: courtFinalBefore ? 'FINAL_COURT_EXCEPTION_CANDIDATE'
      : careBasis ? 'RETROSPECTIVE_VALIDATION_POSSIBLY_RELEVANT'
      : 'NO_EVIDENCE_OF_SPECIFIED_VALIDATION_BASIS',
    issues,
    merits: 'NOT_DETERMINED',
    restitution: 'NOT_DETERMINED',
    counterfactualPolicyEffect: 'NOT_IDENTIFIED',
  };
}
export function auditTransitionEvents878(events = []) {
  if (!Array.isArray(events) || events.length === 0) throw new TypeError('nonempty event array required');
  const allowed = new Set(['WARNING','JUDGMENT','APPEAL','STAY_ORDER','BILL','ASSENT','COMMENCEMENT','ASSESSMENT','REVIEW','REMEDY']);
  const seen = new Set(), errors = []; let prior = '';
  for (const e of events) {
    if (!e || !allowed.has(e.type) || !e.id || seen.has(e.id)) errors.push('BAD_OR_DUPLICATE_EVENT');
    else seen.add(e.id);
    date(e.occurredOn);
    if (prior && e.occurredOn < prior) errors.push('EVENTS_OUT_OF_TIME_ORDER');
    prior = e.occurredOn;
    if (!e.sourceId || !e.sourceType) errors.push('MISSING_EVENT_SOURCE');
    if (e.type === 'BILL' && e.claimsAlreadyEnacted === true)
      errors.push('BILL_LAUNDERED_INTO_ENACTED_LAW');
    if (e.type === 'APPEAL' && e.claimsAutomaticStay === true)
      errors.push('APPEAL_LAUNDERED_INTO_STAY');
    if (e.type === 'STAY_ORDER' && (!e.scope || !e.court || !e.orderReceipt))
      errors.push('STAY_ORDER_MISSING_SCOPE_OR_RECEIPT');
    if (e.type === 'REMEDY' && !e.personEffectReadback)
      errors.push('REMEDY_WITHOUT_PERSON_EFFECT_READBACK');
  }
  return {valid:errors.length===0,errors,sourceCount:seen.size,
    lawAutomaticallyApplied:false,realWorldCausalityEstablished:false};
}
