// NOMOS-0.880: bounded evidence-path diagnostic, not a legal or welfare decision engine.
const allowedKinds=new Set(['ACT','HISTORICAL_OFFICIAL_RECORD','SCRUTINY_REPORT',
'AGENCY_NOTICE','APPLICATION_RECEIPT','DECISION_RECEIPT','INDEPENDENT_RESULT','OMBUDSMAN']);
const nonempty=s=>typeof s==='string'&&s.trim().length>0;
const count=n=>Number.isSafeInteger(n)&&n>=0;
const stages=['POTENTIALLY_EXPOSED','FRAME_IDENTIFIED','NOTIFIED','APPLICATION_RECEIVED',
'DECISION_MADE','PAYMENT_OBSERVED','INDEPENDENT_OUTCOME_CONFIRMED'];
const asMap=sources=>{
 const m=new Map(),errors=[];
 for(const x of sources){
  if(!x||!nonempty(x.id)||!nonempty(x.citation)||!allowedKinds.has(x.kind))
   {errors.push('MISSING_SOURCE_TYPE_OR_CITATION');continue}
  if(m.has(x.id))errors.push('DUPLICATE_SOURCE_ID');
  m.set(x.id,x);
 }
 return {m,errors};
};
const has=(m,id,kind)=>nonempty(id)&&m.get(id)?.kind===kind;
export function auditResidualResponsibility880(x={}){
 if(!Array.isArray(x.sources||[]))throw new TypeError('sources array required');
 const {m,errors}=asMap(x.sources||[]);
 const lawValid=has(m,x.lawSource,'ACT');
 const history=has(m,x.historicalWarningSource,'HISTORICAL_OFFICIAL_RECORD');
 const scrutiny=has(m,x.scrutinySource,'SCRUTINY_REPORT');
 const notice=has(m,x.noticeSource,'AGENCY_NOTICE')&&nonempty(x.noticeReceipt);
 const application=has(m,x.applicationSource,'APPLICATION_RECEIPT')&&nonempty(x.applicationReceipt);
 const decision=application&&has(m,x.decisionSource,'DECISION_RECEIPT')&&nonempty(x.decisionReceipt);
 const payment=decision&&has(m,x.paymentSource,'INDEPENDENT_RESULT')&&nonempty(x.paymentReceipt);
 const outcome=payment&&has(m,x.outcomeSource,'INDEPENDENT_RESULT')&&nonempty(x.outcomeReceipt);
 if(x.noticeReceipt&&!notice)errors.push('NOTICE_NOT_EVIDENCED');
 if(x.applicationReceipt&&!application)errors.push('APPLICATION_NOT_EVIDENCED');
 if(x.decisionReceipt&&!decision)errors.push('DECISION_WITHOUT_PRIOR_APPLICATION_AND_SOURCE');
 if(x.paymentReceipt&&!payment)errors.push('PAYMENT_WITHOUT_INDEPENDENT_READBACK_AND_DECISION');
 if(x.outcomeReceipt&&!outcome)errors.push('OUTCOME_WITHOUT_INDEPENDENT_PAYMENT_CHAIN');
 const at=(x.events||[]);
 if(!Array.isArray(at))throw new TypeError('events array required');
 const times={};
 for(const e of at){
  if(!e||!nonempty(e.event)||!/^\d{4}-\d\d-\d\d$/.test(e.date||'')||
   !Number.isFinite(Date.parse(e.date))||new Date(e.date).toISOString().slice(0,10)!==e.date||
   !m.has(e.sourceId))errors.push('UNVERIFIABLE_DATED_EVENT');
  else times[e.event]=e.date;
 }
 if(x.claimsScrutinyResponseWasPreEnactment===true&&times.AMENDMENT_ENACTED&&
  times.SCRUTINY_RESPONSE&&times.SCRUTINY_RESPONSE>times.AMENDMENT_ENACTED)
  errors.push('POST_ENACTMENT_RESPONSE_CANNOT_BE_PRE_ENACTMENT_CAUSE');
 return {gates:{lawValid,historicalWarningDocumented:history,scrutinyConcernDocumented:scrutiny,
  noticeReceiptDocumented:notice,applicationReceiptDocumented:application,
  decisionReceiptDocumented:decision,paymentIndependentReadback:payment,
  downstreamIndependentReadback:outcome},
  errors,sourceEvidenceOnly:errors.length===0,
  retroactiveLawDoesNotProvePriorCompliance:true,
  claimantLegalEntitlement:'NOT_ADJUDICATED',
  institutionalLegalDuty:'NOT_ADJUDICATED',
  compensationDue:'NOT_ADJUDICATED',
  causalRemedyEffect:'NOT_IDENTIFIED'};
}
export function auditLinkedFunnel880(x={}){
 const entries=x.stages;
 if(!Array.isArray(entries)||entries.length===0)throw new TypeError('stages required');
 const errors=[],o=[];
 let last=-1,prior=null;
 for(const v of entries){
  const index=stages.indexOf(v.stage);
  if(index<0||index<=last)errors.push('STAGE_ORDER_OR_DUPLICATE');
  last=index;
  if(v.count!==null&&v.count!==undefined&&!count(v.count))errors.push('BAD_COUNT');
  if(!nonempty(v.receiptId))errors.push('NO_STAGE_RECEIPT');
  if(!nonempty(v.frameId)||!['CASE','PERSON'].includes(v.unit))errors.push('NO_TYPED_FRAME');
  if(prior&&prior.unit===v.unit&&prior.frameId===v.frameId&&
   count(prior.count)&&count(v.count)&&prior.completeCensus===true&&v.completeCensus===true&&
   v.count>prior.count) errors.push('REPORTED_NESTED_COUNTS_INCREASE');
  if(prior&&prior.frameId!==v.frameId)errors.push('FRAME_CHANGED_DO_NOT_CALCULATE_ATTRITION');
  if(prior&&prior.unit!==v.unit)errors.push('UNIT_CHANGED_DO_NOT_CALCULATE_ATTRITION');
  o.push({stage:v.stage,kind:v.kind||'NOT_SPECIFIED',count:count(v.count)?v.count:null,unit:v.unit,
    independentlyVerified:v.independentlyVerified===true});
  prior=v;
 }
 const comparable=errors.length===0&&entries.every(v=>v.completeCensus===true&&
    nonempty(v.frameId)&&v.frameId===entries[0].frameId&&v.unit===entries[0].unit&&
    count(v.count)&&nonempty(v.receiptId)&&v.independentlyVerified===true);
 const attrition=comparable?entries.slice(1).map((v,i)=>({
   from:entries[i].stage,to:v.stage,lost:entries[i].count-v.count,
   base:entries[i].count,rate:entries[i].count===0?null:(entries[i].count-v.count)/entries[i].count
 })):null;
 return {stages:o,errors,attrition,
   attritionIdentified:comparable,disappearanceCannotBeInterpretedAsZero:true,
   potentialExposureNotVerifiedHarm:true,individualRemedy:'NOT_ADJUDICATED'};
}
