import assert from 'node:assert/strict';
import {PUBLISHED_880,auditPublishedClinical880,compareCrossEcology880} from '../tools/crossEcologyFollowup880.mjs';
for(const [id,r] of Object.entries(PUBLISHED_880)){
 const x=auditPublishedClinical880(id,{...r,participants:r.participants||r.primaryAnalysis});
 assert.equal(x.status,'PUBLISHED_AGGREGATE_ALIGNED');
 assert.equal(x.patientIdentityVerified,false);
 assert.equal(x.actualDownstreamHealthBenefit,'NOT_ESTABLISHED');
 assert.equal(x.lawOrCompensationAuthority,'NOT_TRANSFERABLE');
}
const lab=PUBLISHED_880.SINGH_LAB_2010;
let r=auditPublishedClinical880('SINGH_LAB_2010',{...lab,claimsNoFollowupEqualsUnacknowledged:true});
assert(r.errors.includes('ALERT_ACKNOWLEDGEMENT_AND_ACTION_NOT_IDENTICAL'));
r=auditPublishedClinical880('SINGH_LAB_2010',{...lab,unit:'PATIENT'});
assert(r.errors.includes('DENOMINATOR_UNIT_MISMATCH'));
r=auditPublishedClinical880('SINGH_LAB_2010',{...lab,followupLacking:119});
assert(r.errors.includes('PUBLISHED_COUNT_MISMATCH'));
r=auditPublishedClinical880('SINGH_IMAGING_2009',{...PUBLISHED_880.SINGH_IMAGING_2009,
 claimsClinicallyRecovered:true});
assert(r.errors.includes('FOLLOWUP_NOT_PROOF_OF_HEALTH_RECOVERY'));
const atlas=PUBLISHED_880.ATLAS_2023;
assert.equal(atlas.arms.reduce((a,v)=>a+v.n,0),11980);
r=auditPublishedClinical880('ATLAS_2023',{...atlas,claimsLongTermHealthOutcomeEffect:true});
assert(r.errors.includes('FOLLOWUP_ENDPOINT_NOT_HEALTH_OUTCOME'));
r=auditPublishedClinical880('ATLAS_2023',{...atlas,claimsPercentTimesNEqualsObservedNumber:true});
assert(r.errors.includes('ADJUSTED_PERCENT_NOT_RAW_EVENT_COUNT'));
const coro=PUBLISHED_880.CORONADO_2025;
assert.equal(coro.arms.reduce((a,v)=>a+v.n,0),967);
r=auditPublishedClinical880('CORONADO_2025',{...coro,claimsPatientLevelDataReleased:true});
assert(r.errors.includes('PUBLISHED_AGGREGATE_NOT_RAW_PATIENT_DATA'));
assert.equal(coro.adjustedDifferencePctPoints,13);
const corley=PUBLISHED_880.CORLEY_2017;
assert(corley.allPositiveFIT>corley.eligible&&corley.eligible>corley.receivedFollowup);
r=auditPublishedClinical880('CORLEY_2017',{...corley,claimsOutcomeForAllPositiveTests:true});
assert(r.errors.includes('SELECTION_CONDITIONAL_ON_FOLLOWUP'));
r=auditPublishedClinical880('CORLEY_2017',{...corley,claimsCausalHarmFromDelay:true});
assert(r.errors.includes('NONRANDOM_DELAY_ASSOCIATION_NOT_CAUSAL_PROOF'));
r=auditPublishedClinical880('CORLEY_2017',{...corley,claimsCourtOrCompensationOutcome:true});
assert(r.errors.includes('CLINICAL_DATA_NOT_ADMINISTRATIVE_REMEDY'));
assert.throws(()=>auditPublishedClinical880('NOT_A_SOURCE',{}),TypeError);
r=compareCrossEcology880({unit:'CASE',frameId:'admin-1',outcome:'COMPENSATION_PAID'},
 {unit:'PERSON',frameId:'clinical-1',outcome:'FOLLOWUP_COMPLETED'});
assert.equal(r.pooledEstimate,null);
assert(r.barriers.includes('UNIT_NOT_COMPARABLE'));
assert(r.barriers.includes('DIFFERENT_END_POINT'));
assert(r.barriers.includes('JURISDICTION_AND_AUTHORITY_NOT_TRANSPORTABLE'));
let count=0;
for(const recovered of [false,true])
 for(const patient of [false,true])
 for(const law of [false,true])
 for(const health of [false,true])
 for(const raw of [false,true]){
   const q=auditPublishedClinical880('ATLAS_2023',{...atlas,
      claimsClinicallyRecovered:recovered,claimsIndividualPatientsVerified:patient,
      claimsCourtOrCompensationOutcome:law,claimsLongTermHealthOutcomeEffect:health,
      claimsPercentTimesNEqualsObservedNumber:raw});
   assert.equal(q.patientIdentityVerified,false);
   assert.equal(q.actualDownstreamHealthBenefit,'NOT_ESTABLISHED');
   assert.equal(q.lawOrCompensationAuthority,'NOT_TRANSFERABLE');count++;
 }
assert.equal(count,32);
console.log('NOMOS-0.880 P2 clinical cross-ecology tests PASS (32 grid + published anchors)');
