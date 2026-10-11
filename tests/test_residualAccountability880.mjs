import './test_crossEcologyFollowup880.mjs';
import assert from 'node:assert/strict';
import {auditResidualResponsibility880,auditLinkedFunnel880} from '../tools/residualAccountability880.mjs';
const sources=[
 {id:'law',kind:'ACT',citation:'C2026A00030, original registered statute'},
 {id:'history',kind:'HISTORICAL_OFFICIAL_RECORD',citation:'Ombudsman dated administrative notice'},
 {id:'scrutiny',kind:'SCRUTINY_REPORT',citation:'Scrutiny Digest 5 2026'},
 {id:'notice',kind:'AGENCY_NOTICE',citation:'synthetic source-distribution receipt'},
 {id:'application',kind:'APPLICATION_RECEIPT',citation:'synthetic beneficiary application'},
 {id:'decision',kind:'DECISION_RECEIPT',citation:'synthetic competent agency decision'},
 {id:'payment',kind:'INDEPENDENT_RESULT',citation:'synthetic independent bank readback'},
 {id:'effect',kind:'INDEPENDENT_RESULT',citation:'synthetic post-result external observation'}
];
const base={sources,lawSource:'law',historicalWarningSource:'history',
 scrutinySource:'scrutiny'};
let v=auditResidualResponsibility880(base);
assert.equal(v.gates.lawValid,true);
assert.equal(v.gates.historicalWarningDocumented,true);
assert.equal(v.gates.scrutinyConcernDocumented,true);
assert.equal(v.gates.paymentIndependentReadback,false);
assert.equal(v.compensationDue,'NOT_ADJUDICATED');
assert.equal(v.causalRemedyEffect,'NOT_IDENTIFIED');
v=auditResidualResponsibility880({...base,noticeReceipt:'notice-1',noticeSource:'notice'});
assert.equal(v.gates.noticeReceiptDocumented,true);
assert.equal(v.gates.applicationReceiptDocumented,false);
v=auditResidualResponsibility880({...base,noticeReceipt:'no-source'});
assert(v.errors.includes('NOTICE_NOT_EVIDENCED'));
v=auditResidualResponsibility880({...base,paymentReceipt:'assertion'});
assert(v.errors.includes('PAYMENT_WITHOUT_INDEPENDENT_READBACK_AND_DECISION'));
const asserted={...base,applicationReceipt:'request-1',applicationSource:'application',
 decisionReceipt:'order-2',decisionSource:'decision',
 paymentReceipt:'bank-receipt-3',paymentSource:'payment',
 outcomeReceipt:'independent-snapshot-4',outcomeSource:'effect'};
v=auditResidualResponsibility880(asserted);
assert.equal(v.gates.applicationReceiptDocumented,true);
assert.equal(v.gates.paymentIndependentReadback,true);
assert.equal(v.gates.downstreamIndependentReadback,true);
assert.equal(v.claimantLegalEntitlement,'NOT_ADJUDICATED');
v=auditResidualResponsibility880({...base,events:[
 {event:'AMENDMENT_ENACTED',date:'2026-04-01',sourceId:'law'},
 {event:'SCRUTINY_RESPONSE',date:'2026-04-28',sourceId:'scrutiny'}]});
assert.equal(v.errors.length,0);
v=auditResidualResponsibility880({...base,claimsScrutinyResponseWasPreEnactment:true,
 events:[{event:'AMENDMENT_ENACTED',date:'2026-04-01',sourceId:'law'},
 {event:'SCRUTINY_RESPONSE',date:'2026-04-28',sourceId:'scrutiny'}]});
assert(v.errors.includes('POST_ENACTMENT_RESPONSE_CANNOT_BE_PRE_ENACTMENT_CAUSE'));
v=auditResidualResponsibility880({...base,sources:[sources[0],sources[0]]});
assert(v.errors.includes('DUPLICATE_SOURCE_ID'));
const f=(unit='CASE',frame='cohort-x')=>[
 {stage:'POTENTIALLY_EXPOSED',count:100,receiptId:'screening',unit,frameId:frame,completeCensus:true,independentlyVerified:true},
 {stage:'FRAME_IDENTIFIED',count:90,receiptId:'enumeration',unit,frameId:frame,completeCensus:true,independentlyVerified:true},
 {stage:'NOTIFIED',count:40,receiptId:'notices',unit,frameId:frame,completeCensus:true,independentlyVerified:true},
 {stage:'APPLICATION_RECEIVED',count:9,receiptId:'applications',unit,frameId:frame,completeCensus:true,independentlyVerified:true},
 {stage:'DECISION_MADE',count:6,receiptId:'decisions',unit,frameId:frame,completeCensus:true,independentlyVerified:true},
 {stage:'PAYMENT_OBSERVED',count:3,receiptId:'payments',unit,frameId:frame,completeCensus:true,independentlyVerified:true},
 {stage:'INDEPENDENT_OUTCOME_CONFIRMED',count:2,receiptId:'readback',unit,frameId:frame,completeCensus:true,independentlyVerified:true}
].map((e,i)=>i===0?e:{...e,linkedToPreviousByStableId:true,linkageReceipt:'independent-linkage-'+i});
let y=auditLinkedFunnel880({stages:f()});
assert.equal(y.attritionIdentified,true);
assert.equal(y.attrition[0].lost,10);
assert.equal(y.attrition[5].lost,1);
assert.equal(y.individualRemedy,'NOT_ADJUDICATED');
let a=f();a[2].frameId='other';
y=auditLinkedFunnel880({stages:a});
assert.equal(y.attritionIdentified,false);
assert(y.errors.includes('FRAME_CHANGED_DO_NOT_CALCULATE_ATTRITION'));
a=f();a[2].unit='PERSON';
y=auditLinkedFunnel880({stages:a});
assert.equal(y.attritionIdentified,false);
assert(y.errors.includes('UNIT_CHANGED_DO_NOT_CALCULATE_ATTRITION'));
a=f();a[2].count=99;a[1].count=90;
assert(auditLinkedFunnel880({stages:a}).errors.includes('REPORTED_NESTED_COUNTS_INCREASE'));
a=f();a[4].count=null;
assert.equal(auditLinkedFunnel880({stages:a}).attrition,null);
a=f();a[4].receiptId='';
assert.equal(auditLinkedFunnel880({stages:a}).attritionIdentified,false);
a=f();a[4].independentlyVerified=false;
assert.equal(auditLinkedFunnel880({stages:a}).attritionIdentified,false);
a=f();a[3].linkageReceipt='';
assert.equal(auditLinkedFunnel880({stages:a}).attritionIdentified,false);
assert(auditLinkedFunnel880({stages:a}).errors.includes('SUBSET_LINK_UNPROVEN_DO_NOT_CALCULATE_ATTRITION'));
a=f();a[2].linkedToPreviousByStableId=false;
assert.equal(auditLinkedFunnel880({stages:a}).attrition,null);
a=f();a[1].stage='POTENTIALLY_EXPOSED';
assert(auditLinkedFunnel880({stages:a}).errors.includes('STAGE_ORDER_OR_DUPLICATE'));
const four=[undefined,true,false,null];let checked=0;
for (const census of four) for(const witness of four) for(const countV of [undefined,0,6]){
 let t=f();t[3].completeCensus=census;t[3].independentlyVerified=witness;t[3].count=countV;
 let z=auditLinkedFunnel880({stages:t});
 assert.equal(z.individualRemedy,'NOT_ADJUDICATED');
 assert.equal(z.disappearanceCannotBeInterpretedAsZero,true);
 checked++;
}
assert.equal(checked,48);
console.log('NOMOS-0.880 typed responsibility/funnel tests PASS (48 grid + adversarial anchors)');
