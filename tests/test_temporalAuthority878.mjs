import assert from 'node:assert/strict';
import {ACT2026,auditTemporalCase878,auditTransitionEvents878} from '../tools/temporalAuthority878.mjs';
assert.equal(ACT2026.schedule1Commencement,'2026-04-02');
const base={
 caseId:'synthetic-cs-1', decidedOn:'2026-03-01',kind:'assessment',
 appeal:{filedOn:'2026-03-05',filingReceipt:'appeal receipt'},
 law:{citation:'C2026A00030'},
 caseFacts:{part2Less35Basis:true,basisSource:'assessment document',
  assessmentRelevant:true,assessmentSource:'assessment receipt'},
 consequences:{independentReadback:'post-decision recorded result'}
};
let r=auditTemporalCase878(base);
assert.equal(r.trace.timeline,'BEFORE_SCHEDULE1');
assert.equal(r.trace.stayStatus,'APPEAL_BUT_NO_APPLICABLE_STAY_EVIDENCED');
assert.equal(r.section16,'APPLICATION_REQUIRES_LEGAL_AND_CASE_REVIEW');
assert.equal(r.section17,'RETROSPECTIVE_VALIDATION_POSSIBLY_RELEVANT');
assert.equal(r.restitution,'NOT_DETERMINED');
let q=structuredClone(base);
q.finalCourt={heardAndFinallyDetermined:true,finalOn:'2026-03-15',finalJudgmentSource:'court record'};
r=auditTemporalCase878(q);
assert.equal(r.section17,'FINAL_COURT_EXCEPTION_CANDIDATE');
assert.equal(r.section16,'FINAL_COURT_EXCEPTION_CANDIDATE');
q=structuredClone(base);
q.finalCourt={heardAndFinallyDetermined:true,finalOn:'2026-04-03',finalJudgmentSource:'court record'};
r=auditTemporalCase878(q);assert(r.issues.includes('COURT_FINALITY_CLAIM_NOT_VERIFIED_IN_TIME'));
q=structuredClone(base);q.decidedOn='2026-04-02';q.appeal=undefined;
r=auditTemporalCase878(q);assert.equal(r.trace.timeline,'ON_OR_AFTER_SCHEDULE1');
assert.equal(r.trace.stayStatus,'NO_APPEAL_OR_STAY_EVIDENCED');
q=structuredClone(base);q.stay={issuedOn:'2026-02-01',orderId:'court order',
 court:'Federal Court',scope:'specified clauses and dates',
 orderSource:'original order',caseId:'synthetic-cs-1',endsOn:'2026-04-01'};
r=auditTemporalCase878(q);assert.equal(r.trace.stayStatus,'ORDER_EVIDENCED_DATE_MATCH_SCOPE_UNASSESSED');
q=structuredClone(base);q.stay={issuedOn:'2026-03-03',orderId:'court order',
 court:'Federal Court',scope:'specified',orderSource:'original order',caseId:'synthetic-cs-1'};
r=auditTemporalCase878(q);assert.notEqual(r.trace.stayStatus,'ORDER_EVIDENCED_DATE_MATCH_SCOPE_UNASSESSED');
q=structuredClone(base);q.caseFacts.part2Less35Basis=false;q.caseFacts.basisSource=null;
r=auditTemporalCase878(q);assert.equal(r.section17,'NO_EVIDENCE_OF_SPECIFIED_VALIDATION_BASIS');
q=structuredClone(base);q.appeal.filingReceipt=null;assert.throws(()=>auditTemporalCase878(q),/appeal receipt/);
q=structuredClone(base);q.decidedOn='2026-02-30';assert.throws(()=>auditTemporalCase878(q),/real ISO/);
q=structuredClone(base);q.kind='judgment-from-AI';assert.throws(()=>auditTemporalCase878(q),/case kind/);
q=structuredClone(base);q.law.citation='other';assert.throws(()=>auditTemporalCase878(q),/different statute/);
q=structuredClone(base);q.law.effectiveOn='2026-04-03';assert.throws(()=>auditTemporalCase878(q),/source-locked commencement/);
const events=[
 {type:'WARNING',id:'e1',occurredOn:'2025-11-01',sourceId:'notice',sourceType:'agency'},
 {type:'BILL',id:'e2',occurredOn:'2026-02-05',sourceId:'bill',sourceType:'parliament'},
 {type:'ASSENT',id:'e3',occurredOn:'2026-04-01',sourceId:'act',sourceType:'register'},
 {type:'COMMENCEMENT',id:'e4',occurredOn:'2026-04-02',sourceId:'table',sourceType:'statute'},
 {type:'REMEDY',id:'e5',occurredOn:'2026-04-11',sourceId:'readback',sourceType:'independent',
 personEffectReadback:'effect receipt'},
];
assert.equal(auditTransitionEvents878(events).valid,true);
let z=structuredClone(events);z[1].claimsAlreadyEnacted=true;
assert(auditTransitionEvents878(z).errors.includes('BILL_LAUNDERED_INTO_ENACTED_LAW'));
z=structuredClone(events);z[1].type='APPEAL';z[1].claimsAutomaticStay=true;
assert(auditTransitionEvents878(z).errors.includes('APPEAL_LAUNDERED_INTO_STAY'));
z=structuredClone(events);z[2].type='STAY_ORDER';
assert(auditTransitionEvents878(z).errors.includes('STAY_ORDER_MISSING_SCOPE_OR_RECEIPT'));
z=structuredClone(events);z[4].personEffectReadback='';
assert(auditTransitionEvents878(z).errors.includes('REMEDY_WITHOUT_PERSON_EFFECT_READBACK'));
z=structuredClone(events);z[2].occurredOn='2024-01-01';
assert(auditTransitionEvents878(z).errors.includes('EVENTS_OUT_OF_TIME_ORDER'));
z=structuredClone(events);z[2].id='e1';
assert(auditTransitionEvents878(z).errors.includes('BAD_OR_DUPLICATE_EVENT'));
console.log('NOMOS-0.878 synthetic time/authority tests PASS');
