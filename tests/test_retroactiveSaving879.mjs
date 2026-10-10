import assert from 'node:assert/strict';
import {AU879,NZ879,auditAU879,auditNZ879} from '../tools/retroactiveSaving879.mjs';
const base={jurisdiction:'AU-Cth',assessmentOn:'2026-03-01',
 assessmentReceipt:'source-A',underSections35or37:true,careBelow35:true,
 otherParentRatePositive:true,nilRateBecauseOtherParentLowCare:false};
let x=auditAU879(base);
assert.equal(x.checks.positiveException,true);
assert.equal(x.checks.reviewedAfter,false);
assert.equal(x.checks.courtProtection,false);
assert.equal(x.individualRemedy,'NOT_ESTABLISHED');
const after={...base,review:{kind:'ART',decidedOn:'2026-04-03',
 decisionReceipt:'tribunal-order',relatesToAssessment:true}};
assert.equal(auditAU879(after).checks.reviewedAfter,true);
const before={...base,review:{kind:'ART',decidedOn:'2026-04-01',
 decisionReceipt:'tribunal-order',relatesToAssessment:true}};
assert.equal(auditAU879(before).checks.reviewedAfter,false);
const nil={...base,otherParentRatePositive:false,nilRateBecauseOtherParentLowCare:true};
assert.equal(auditAU879(nil).checks.validation,true);
assert.equal(auditAU879(nil).checks.positiveException,false);
const older=auditAU879({...nil,assessmentOn:'2007-10-01'});
assert.equal(older.checks.historical,false);
assert.equal(older.checks.validation,true); // item 17 has distinct wording; candidate only
assert(older.errors.includes('PRE_JULY_2008_SCHEME_SCOPE_REQUIRES_SEPARATE_CHECK'));
assert(auditAU879({...nil,otherParentRatePositive:true})
 .errors.includes('CONFLICTING_RATE_CLASSIFICATION'));

const court={heardAndFinallyDetermined:true,finalOn:'2026-04-01',
 judgmentReceipt:'signed court judgment',rightsLiabilitiesBetweenParties:true,
 materialConnectionToAssessment:true,materialConnectionToNilGround:true};
assert.equal(auditAU879({...nil,court}).checks.validationCourtSaving,true);
assert.equal(auditAU879({...nil,court:{...court,finalOn:'2026-04-02'}}).checks.courtProtection,false);
assert.equal(auditAU879({...nil,court:{...court,materialConnectionToAssessment:false}})
 .checks.courtProtection,false);
assert.equal(auditAU879({...nil,court:{...court,materialConnectionToNilGround:false}})
 .checks.validationCourtSaving,false);
assert.equal(auditAU879({...nil,court:{...court,rightsLiabilitiesBetweenParties:null}})
 .checks.courtProtection,null);
assert.equal(auditAU879({...nil,court:{...court,judgmentReceipt:''}})
 .checks.courtProtection,false);
assert.equal(auditAU879({...nil,court:{...court,heardAndFinallyDetermined:false}})
 .checks.courtProtection,false);
assert.equal(auditAU879({...nil,independentDefect:true}).errors.includes('OTHER_DEFECT_MUST_BE_EVALUATED_SEPARATELY'),true);
assert.equal(auditAU879({...base,underSections35or37:null}).checks.positiveException,null);
assert(auditAU879({...base,jurisdiction:'NZ'}).errors.includes('WRONG_JURISDICTION'));
assert.throws(()=>auditAU879({...base,assessmentOn:'2026-02-30'}),TypeError);
assert.equal(AU879.commencement,'2026-04-02');
const nz={forum:'COURT',proceedingsStartedLocal:'2026-02-17T13:59',sourceReceipt:'NZ-court docket'};
assert.equal(auditNZ879(nz).clause108SavingCandidate,true);
assert.equal(auditNZ879({...nz,proceedingsStartedLocal:'2026-02-17T14:00'}).clause108SavingCandidate,false);
assert.equal(auditNZ879({...nz,forum:'BENEFITS_REVIEW_COMMITTEE'}).clause108SavingCandidate,true);
assert.equal(auditNZ879({...nz,forum:'ART'}).clause108SavingCandidate,false);
assert.equal(auditNZ879({...nz,sourceReceipt:''}).clause108SavingCandidate,false);
assert.throws(()=>auditNZ879({...nz,proceedingsStartedLocal:'2026-02-17T25:00'}),TypeError);
assert.equal(NZ879.timeZone,'Pacific/Auckland');
let combinations=0;
for(const positive of [true,false,null]){
 for(const nilRate of [true,false,null]){
  for(const finalOn of ['2026-04-01','2026-04-02',undefined]){
   for(const relates of [true,false,null]){
    const court=finalOn?{...courtStub(),finalOn,materialConnectionToAssessment:relates}:undefined;
    const result=auditAU879({...base,otherParentRatePositive:positive,
      nilRateBecauseOtherParentLowCare:nilRate,court});
    assert.equal(result.individualRemedy,'NOT_ESTABLISHED');
    assert.equal(result.individualStanding,'NOT_ESTABLISHED');
    combinations++;
   }
  }
 }
}
function courtStub(){return {...court};}
assert.equal(combinations,81);
console.log('NOMOS-0.879 typed statutory savings regressions PASS (81-case grid + anchors)');
