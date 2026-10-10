// NOMOS-0.879 P1: source-typed *candidate* gates for statutory saving clauses.
// Do not use to decide legal entitlements, personal remedies or litigation.
export const AU879 = Object.freeze({
  source:'C2026A00030 Schedule 1 Part 2 items 16-17',
  commencement:'2026-04-02',
  retrospectiveFrom:'2008-07-01',
  jurisdiction:'AU-Cth'
});
export const NZ879 = Object.freeze({
  source:'NZ 2026 No 6, inserted Schedule 1 Part 11 clauses 104-108',
  changeover:'2026-02-17T14:00',
  jurisdiction:'NZ',
  timeZone:'Pacific/Auckland'
});
function nonempty(v){return typeof v==='string'&&v.trim().length>0;}
function validDay(s){
 if(typeof s!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(s)||
    Number.isNaN(Date.parse(s))||new Date(s).toISOString().slice(0,10)!==s)
    throw new TypeError('valid date YYYY-MM-DD required');
 return s;
}
function validMinute(s){
 if(!/^\d{4}-\d{2}-\d{2}T([01]\d|2[0-3]):[0-5]\d$/.test(s||''))
   throw new TypeError('local datetime YYYY-MM-DDTHH:mm required');
 validDay(s.slice(0,10));return s;
}
// null means the record is insufficient, not absence of the legal condition.
const known = v => v===true || v===false ? v:null;
const all = (...args) => args.includes(false)?false:args.includes(null)?null:true;
const before = (v,t) => v<t;
const afterOrOn = (v,t) => v>=t;
export function auditAU879(input={}){
 const d=validDay(input.assessmentOn);
 const effectiveAssessment=input.amendedOn?validDay(input.amendedOn):d;
 const historical=afterOrOn(effectiveAssessment,AU879.retrospectiveFrom);
 const previous=before(effectiveAssessment,AU879.commencement);
 const evidence=nonempty(input.assessmentReceipt);
 const based=known(input.underSections35or37);
 const lowCare=known(input.careBelow35);
 const positive=known(input.otherParentRatePositive);
 const nil=known(input.nilRateBecauseOtherParentLowCare);
 const positiveException=all(previous,based,lowCare,positive,evidence);
 const review=input.review||null;
 if(review?.decidedOn)validDay(review.decidedOn);
 const reviewType=review?(['OBJECTION','ART'].includes(review.kind)?true:false):false;
 const reviewReceipt=review?nonempty(review.decisionReceipt):false;
 const reviewedAfter=review?all(reviewType,reviewReceipt,
   Boolean(review.decidedOn),review.decidedOn?afterOrOn(review.decidedOn,AU879.commencement):false,
   positiveException,known(review.relatesToAssessment)):false;
 const court=input.court||null;
 if(court?.finalOn)validDay(court.finalOn);
 const courtProtection=court?all(
   known(court.heardAndFinallyDetermined),
   Boolean(court.finalOn&&before(court.finalOn,AU879.commencement)),
   nonempty(court.judgmentReceipt),
   known(court.rightsLiabilitiesBetweenParties),
   known(court.materialConnectionToAssessment)
 ):false;
 // Item 17 is framed as a pre-validation-time nil-rate ground, not item 16(1)'s 1 July 2008 assessment gate.
 const validation=all(previous,nil,evidence);
 const validationCourtSaving=court?all(courtProtection,
   known(court.materialConnectionToNilGround)):false;
 const errors=[];
 if(input.amendedOn&&input.amendedOn<d)errors.push('AMENDMENT_BEFORE_ASSESSMENT');
 if(review?.decidedOn&&review.decidedOn<d)errors.push('REVIEW_BEFORE_ASSESSMENT');
 if(court?.finalOn&&court.finalOn<d)errors.push('COURT_FINALITY_PRECEDES_ASSESSMENT');
 if(input.jurisdiction&&input.jurisdiction!==AU879.jurisdiction)errors.push('WRONG_JURISDICTION');
 if(!evidence)errors.push('ASSESSMENT_SOURCE_UNVERIFIED');
 if(!historical)errors.push('PRE_JULY_2008_SCHEME_SCOPE_REQUIRES_SEPARATE_CHECK');
 if(positive===true&&nil===true)errors.push('CONFLICTING_RATE_CLASSIFICATION');
 if(input.independentDefect===true)errors.push('OTHER_DEFECT_MUST_BE_EVALUATED_SEPARATELY');
 return {law:AU879,
  checks:{historical,positiveException,reviewedAfter,courtProtection,validation,validationCourtSaving},
  assessmentInterpretation:'SOURCE_DEPENDENT_CANDIDATES_ONLY',
  individualStanding:'NOT_ESTABLISHED',
  individualRemedy:'NOT_ESTABLISHED',
  effectReadback:nonempty(input.effectReadback)?'RECEIPT_REPORTED_NOT_CAUSALLY_ATTRIBUTED':'UNOBSERVED',
  errors};
}
export function auditNZ879(input={}){
 const started=validMinute(input.proceedingsStartedLocal);
 const validForum=['BENEFITS_REVIEW_COMMITTEE','APPEAL_AUTHORITY','COURT'].includes(input.forum);
 const prior=before(started,NZ879.changeover);
 return {law:NZ879,forumWithinClause108:validForum,
  clause108SavingCandidate:prior&&validForum&&nonempty(input.sourceReceipt),
  proceedingsFinalityNotRequired:true,
  materialLegalEffect:'NOT_ESTABLISHED',individualRemedy:'NOT_ESTABLISHED',
  errors:[...(!validForum?['OUTSIDE_ENUMERATED_FORUM']:[]),
    ...(!nonempty(input.sourceReceipt)?['PROCEEDINGS_SOURCE_UNVERIFIED']:[])]};
}
