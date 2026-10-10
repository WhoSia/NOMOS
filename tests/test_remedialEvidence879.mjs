import assert from 'node:assert/strict';
import {auditRemedialRecord879} from '../tools/remedialEvidence879.mjs';
const sources=[
 {id:'act',kind:'STATUTE',citation:'C2026A00030 Schedule 1 Part 2'},
 {id:'digest',kind:'PARLIAMENT_BILL_DIGEST',citation:'Bills Digest 45 2025-26, Feb 2026'},
 {id:'omb',kind:'OMBUDSMAN_REPORT',citation:'Following the law is not optional, Jan 2026'},
 {id:'committee',kind:'SENATE_COMMITTEE',citation:'Report 25 March 2026'},
 {id:'agency',kind:'AGENCY_RECORD',citation:'synthetic agency review case receipt'},
 {id:'effect',kind:'INDEPENDENT_READBACK',citation:'synthetic audited person-level outcome'}
];
const base={sources,statuteSourceId:'act',compensationInformationSourceId:'omb',
 screening:{sourceId:'digest',kind:'POTENTIALLY_AFFECTED',countPeople:16600,
 countCases:10000,averageHypotheticalDebtAUD:560}};
let x=auditRemedialRecord879(base);
assert.equal(x.status,'PROVENANCE_CHECKED_NOT_LEGAL_CERTIFIED');
assert.equal(x.gates.lawConfirmed,true);
assert.equal(x.gates.screeningSource,true);
assert.equal(x.gates.actualPersonCorrection,false);
assert.equal(x.gates.paymentObserved,false);
assert.equal(x.completedPopulationRestoration,'NOT_ESTABLISHED');
assert.equal(x.gates.ombudsmanRecommendation,true);
assert.equal(x.gates.specificSchemeEnacted,false);
x=auditRemedialRecord879({...base,screening:{...base.screening,verifiedAffected:10000}});
assert(x.errors.includes('UNSUPPORTED_SCREENING_TO_VERIFIED_PROMOTION'));
x=auditRemedialRecord879({...base,screening:{...base.screening,kind:'VERIFIED_AFFECTED'}});
assert(x.errors.includes('SCREENING_CANNOT_CERTIFY_ACTUAL_CASES'));
x=auditRemedialRecord879({...base,screening:{...base.screening,countPeople:-1}});
assert(x.errors.includes('INVALID_PERSON_COUNT'));
x=auditRemedialRecord879({...base,remedy:{paymentReceipt:'claim-only'}});
assert(x.errors.includes('PAYMENT_WITHOUT_INDEPENDENT_READBACK'));
x=auditRemedialRecord879({...base,remedy:{correctionReceipt:'self-certification'}});
assert(x.errors.includes('CORRECTION_UNLINKED_FROM_REVIEW_AND_RESULT'));
x=auditRemedialRecord879({...base,schemeProposalSourceId:'committee'});
assert.equal(x.gates.schemeProposed,true);
assert.equal(x.gates.specificSchemeEnacted,false);
x=auditRemedialRecord879({...base,schemeProposalSourceId:'committee',schemeEnablingStatuteSourceId:'act'});
assert.equal(x.gates.specificSchemeEnacted,true); // source-kind only; actual specific scope not certified
x=auditRemedialRecord879({...base,remedy:{
 reviewDecisionId:'review-1',reviewSourceId:'agency',
 correctionReceipt:'readback-1',correctionSourceId:'effect',
 paymentReceipt:'payment-1',paymentSourceId:'effect'
}});
assert.equal(x.status,'PROVENANCE_CHECKED_NOT_LEGAL_CERTIFIED');
assert.equal(x.gates.actualPersonCorrection,true);
assert.equal(x.gates.paymentObserved,true);
assert.equal(x.individuallyBindingOutcome,'NOT_DETERMINED');
assert.equal(x.factualCausalEffect,'NOT_IDENTIFIED');
x=auditRemedialRecord879({...base,actualNumberRepaired:1});
assert(x.errors.includes('COHORT_REMEDY_COUNT_UNSUPPORTED_BY_AGGREGATE_SCREENING'));
x=auditRemedialRecord879({...base,sources:[...sources,sources[0]]});
assert(x.errors.includes('DUPLICATE_SOURCE_ID'));
let count=0;
for (const screeningKind of ['POTENTIALLY_AFFECTED','VERIFIED_AFFECTED']){
 for(const receipt of [undefined,'payment']){
  for(const scheme of [undefined,'committee']){
   for(const title of [undefined,'act']){
    const z=auditRemedialRecord879({...base,schemeProposalSourceId:scheme,
     schemeEnablingStatuteSourceId:title,remedy:receipt?{paymentReceipt:receipt}:undefined,
     screening:{...base.screening,kind:screeningKind}});
    assert.equal(z.individuallyBindingOutcome,'NOT_DETERMINED');
    assert.equal(z.completedPopulationRestoration,'NOT_ESTABLISHED'); count++;
   }
  }
 }
}
assert.equal(count,16);
console.log('NOMOS-0.879 P2 source-typed remedy evidence tests PASS (16-grid + adversarial anchors)');
