// 0.880 P2: Published clinical aggregate evidence, with no access to individual patient records.
// Each dataset is an exact publication-level fixture; do not use as live clinical guidance.
export const PUBLISHED_880 = Object.freeze({
  SINGH_LAB_2010:Object.freeze({doi:'10.1016/j.amjmed.2009.07.027',
    design:'RETROSPECTIVE_ALERT_AUDIT',unit:'ALERT',allTests:78158,alerts:1163,
    unacknowledged:119,followupLacking:79,windowDays:30}),
  SINGH_IMAGING_2009:Object.freeze({doi:'10.1001/archinternmed.2009.263',
    design:'RETROSPECTIVE_ALERT_AUDIT',unit:'ALERT',allTests:123638,alerts:1196,
    unacknowledged:217,followupLacking:92,windowDays:28}),
  ATLAS_2023:Object.freeze({doi:'10.1001/jama.2023.18755',
    design:'CLUSTER_RCT',unit:'PERSON',participants:11980,practices:44,
    arms:Object.freeze([{n:3455,adjustedFollowupPct:31.4},{n:2569,adjustedFollowupPct:31.0},
      {n:3254,adjustedFollowupPct:22.7},{n:2702,adjustedFollowupPct:22.9}]),
    target:'FOLLOWUP_COMPLETION_120_DAYS',adjustedDifferencePctPoints:8.5}),
  CORONADO_2025:Object.freeze({doi:'10.7326/ANNALS-24-01885',
    design:'INDIVIDUAL_RCT',unit:'PERSON',primaryAnalysis:967,
    arms:Object.freeze([{n:479,adjustedFollowupPct:55.1},{n:488,adjustedFollowupPct:42.1}]),
    target:'COLONOSCOPY_COMPLETION_1_YEAR',adjustedDifferencePctPoints:13.0}),
  CORLEY_2017:Object.freeze({doi:'10.1001/jama.2017.3634',
    design:'CONDITIONAL_FOLLOWUP_COHORT',unit:'PERSON',
    allPositiveFIT:106520,eligible:81518,receivedFollowup:70124,
    target:'CANCER_STAGE_AT_DIAGNOSIS',causalInterpretation:'NOT_IDENTIFIED'})
});
const nonempty=x=>typeof x==='string'&&x.length>0;
export function auditPublishedClinical880(name,record={}){
 const ref=PUBLISHED_880[name];
 if(!ref)throw new TypeError('unknown publication');
 const errors=[];
 if(record.doi!==ref.doi)errors.push('WRONG_PUBLICATION');
 if(record.design!==ref.design)errors.push('STUDY_DESIGN_MISMATCH');
 if(record.unit!==ref.unit)errors.push('DENOMINATOR_UNIT_MISMATCH');
 if(record.claimsClinicallyRecovered===true)errors.push('FOLLOWUP_NOT_PROOF_OF_HEALTH_RECOVERY');
 if(record.claimsIndividualPatientsVerified===true)errors.push('AGGREGATE_PAPER_NOT_PERSON_RECORDS');
 if(record.claimsCourtOrCompensationOutcome===true)errors.push('CLINICAL_DATA_NOT_ADMINISTRATIVE_REMEDY');
 if(ref.design==='RETROSPECTIVE_ALERT_AUDIT'){
   if(record.alerts!==ref.alerts||record.followupLacking!==ref.followupLacking)
     errors.push('PUBLISHED_COUNT_MISMATCH');
   if(record.claimsNoFollowupEqualsUnacknowledged===true)
     errors.push('ALERT_ACKNOWLEDGEMENT_AND_ACTION_NOT_IDENTICAL');
 }else if(ref.design==='CONDITIONAL_FOLLOWUP_COHORT'){
   if(record.eligible!==ref.eligible||record.receivedFollowup!==ref.receivedFollowup)
     errors.push('ELIGIBLE_OR_FOLLOWUP_COUNT_MISMATCH');
   if(record.claimsOutcomeForAllPositiveTests===true)
     errors.push('SELECTION_CONDITIONAL_ON_FOLLOWUP');
   if(record.claimsCausalHarmFromDelay===true)
     errors.push('NONRANDOM_DELAY_ASSOCIATION_NOT_CAUSAL_PROOF');
 }else{
   if(record.participants!==(ref.participants||ref.primaryAnalysis))
     errors.push('RCT_ANALYSIS_COHORT_COUNT_MISMATCH');
   if(record.claimsPercentTimesNEqualsObservedNumber===true)
     errors.push('ADJUSTED_PERCENT_NOT_RAW_EVENT_COUNT');
   if(record.claimsLongTermHealthOutcomeEffect===true)
     errors.push('FOLLOWUP_ENDPOINT_NOT_HEALTH_OUTCOME');
   if(record.claimsPatientLevelDataReleased===true)
     errors.push('PUBLISHED_AGGREGATE_NOT_RAW_PATIENT_DATA');
 }
 return {publication:name,doi:ref.doi,design:ref.design,
   status:errors.length?'CLAIM_REJECTED':'PUBLISHED_AGGREGATE_ALIGNED',
   errors,observedEndpoint:ref.target||'TIMELY_FOLLOWUP_QUALITY',
   patientIdentityVerified:false,actualDownstreamHealthBenefit:'NOT_ESTABLISHED',
   lawOrCompensationAuthority:'NOT_TRANSFERABLE',realWorldCausalInference:
   ref.design.endsWith('RCT')?'BOUNDED_TO_RANDOMIZED_FOLLOWUP_COMPLETION':'NOT_ESTABLISHED'};
}
export function compareCrossEcology880(admin={},clinical={}){
 const barriers=[];
 if(admin.unit!==clinical.unit)barriers.push('UNIT_NOT_COMPARABLE');
 if(admin.frameId===clinical.frameId&&nonempty(admin.frameId))
   barriers.push('IDENTICAL_FRAME_ID_ACROSS_SEPARATE_ECOLOGIES_NOT_AUTHENTICATED');
 if(admin.outcome!==clinical.outcome)barriers.push('DIFFERENT_END_POINT');
 // Even when nominal labels match, distinct populations and legal powers prevent pooling.
 barriers.push('JURISDICTION_AND_AUTHORITY_NOT_TRANSPORTABLE');
 return {pooledEstimate:null,barriers,
   sharedFormalQuestion:'WHO_WAS_NOTIFIED_AND_WHAT_ACTUALLY_HAPPENED',
   administrativeRemedy:'NOT_DERIVED_FROM_MEDICAL_TRIAL',
   medicalHealthOutcome:'NOT_DERIVED_FROM_ADMINISTRATIVE_REMEDY'};
}
