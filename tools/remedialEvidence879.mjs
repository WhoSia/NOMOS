// NOMOS-0.879 P2: evidence-stage ledger. Not an administrative rights or remedy adjudicator.
// Input reports are claims with source-kind provenance, not true by default.
const sourceKinds = new Set(['STATUTE','PARLIAMENT_BILL_DIGEST','SENATE_COMMITTEE','OMBUDSMAN_REPORT','AGENCY_RECORD','COURT_ORDER','INDEPENDENT_READBACK','SUBMISSION']);
const nonempty = x => typeof x === 'string' && x.trim().length > 0;
const integer = x => Number.isSafeInteger(x) && x >= 0;
export function auditRemedialRecord879(record = {}) {
 const errors = [];
 const entries = record.sources || [];
 if (!Array.isArray(entries)) throw new TypeError('sources must be array');
 const ids = new Set();
 for (const s of entries) {
  if (!s || !sourceKinds.has(s.kind) || !nonempty(s.id) || !nonempty(s.citation))
   errors.push('SOURCE_TYPE_OR_CITATION_MISSING');
  else if (ids.has(s.id)) errors.push('DUPLICATE_SOURCE_ID');
  else ids.add(s.id);
 }
 const snapshot = record.screening || {};
 if (snapshot.countCases != null && !integer(snapshot.countCases)) errors.push('INVALID_CASE_COUNT');
 if (snapshot.countPeople != null && !integer(snapshot.countPeople)) errors.push('INVALID_PERSON_COUNT');
 if (snapshot.averageHypotheticalDebtAUD != null && !(Number.isFinite(snapshot.averageHypotheticalDebtAUD) && snapshot.averageHypotheticalDebtAUD>=0))
  errors.push('INVALID_HYPOTHETICAL_AMOUNT');
 const screeningSource = entries.some(s=>s.id===snapshot.sourceId &&
   ['PARLIAMENT_BILL_DIGEST','OMBUDSMAN_REPORT','AGENCY_RECORD'].includes(s.kind));
 if ((snapshot.countCases!=null || snapshot.countPeople!=null) &&
     (!screeningSource || snapshot.kind!=='POTENTIALLY_AFFECTED'))
  errors.push('SCREENING_CANNOT_CERTIFY_ACTUAL_CASES');
 if (snapshot.verifiedAffected!=null && snapshot.verifiedAffected!==false)
  errors.push('UNSUPPORTED_SCREENING_TO_VERIFIED_PROMOTION');
 const remedy = record.remedy || {};
 const evidenceSource = (id,kind) => entries.some(s=>s.id===id && s.kind===kind);
 const administrativeReviewObserved = nonempty(remedy.reviewDecisionId)&&
   evidenceSource(remedy.reviewSourceId,'AGENCY_RECORD');
 const actualPersonCorrection = administrativeReviewObserved &&
   nonempty(remedy.correctionReceipt)&&
   evidenceSource(remedy.correctionSourceId,'INDEPENDENT_READBACK');
 const paymentObserved = nonempty(remedy.paymentReceipt)&&
   evidenceSource(remedy.paymentSourceId,'INDEPENDENT_READBACK');
 const lawConfirmed = nonempty(record.statuteSourceId)&&
   evidenceSource(record.statuteSourceId,'STATUTE');
 const ombudsmanRecommendation = nonempty(record.compensationInformationSourceId) &&
   evidenceSource(record.compensationInformationSourceId,'OMBUDSMAN_REPORT');
 const schemeProposed = nonempty(record.schemeProposalSourceId)&&
   entries.some(s=>s.id===record.schemeProposalSourceId && ['PARLIAMENT_BILL_DIGEST','SENATE_COMMITTEE','SUBMISSION'].includes(s.kind));
 const specificSchemeEnacted = nonempty(record.schemeEnablingStatuteSourceId)&&
   evidenceSource(record.schemeEnablingStatuteSourceId,'STATUTE')&&
   nonempty(record.schemeEnablingProvision)&&nonempty(record.schemeBeneficiaryScopeReceipt);
 if (record.schemeEnablingStatuteSourceId && !specificSchemeEnacted)
   errors.push('ENACTED_SCHEME_REQUIRES_SPECIFIC_PROVISION_AND_SCOPE_EVIDENCE');
 if (remedy.paymentReceipt && !paymentObserved) errors.push('PAYMENT_WITHOUT_INDEPENDENT_READBACK');
 if (remedy.correctionReceipt && !actualPersonCorrection) errors.push('CORRECTION_UNLINKED_FROM_REVIEW_AND_RESULT');
 if (record.actualNumberRepaired != null) errors.push('COHORT_REMEDY_COUNT_UNSUPPORTED_BY_AGGREGATE_SCREENING');
 return {
  gates: {lawConfirmed,screeningSource,administrativeReviewObserved,actualPersonCorrection,
    paymentObserved,ombudsmanRecommendation,schemeProposed,specificSchemeEnacted},
  status: errors.length?'PROVENANCE_HOLD':'PROVENANCE_CHECKED_NOT_LEGAL_CERTIFIED',
  errors,
  preservedDistinctions:['POTENTIAL_EXPOSURE_NOT_ACTUAL_VERIFIED_IMPACT',
   'LEGAL_VALIDATION_NOT_ADMINISTRATIVE_ACCOUNTABILITY',
   'COMPENSATION_OPTION_NOT_PAYMENT','POLICY_PROPOSAL_NOT_ENACTED_SCHEME',
   'INDEPENDENT_PERSON_EFFECT_REQUIRES_PERSON_LINKED_RECEIPT'],
  individuallyBindingOutcome:'NOT_DETERMINED',
  factualCausalEffect:'NOT_IDENTIFIED',
  completedPopulationRestoration:'NOT_ESTABLISHED'
 };
}
