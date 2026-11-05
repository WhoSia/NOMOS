// NOMOS R12: provenance receipts only. Not legal merits or person-level outcomes.
export const REQUIRED=['request','cra_applied','recipient_receipt','recipient_review','outcome'];
export function auditBridge(record){
  if(!record || typeof record.case_id!=='string' || typeof record.unit_id!=='string' || !Array.isArray(record.events)) throw new Error('invalid case fixture');
  const accepted=[];
  const rejected=[];
  for(const e of record.events){
    const reason=e.case_id!==record.case_id?'wrong-case':e.unit_id!==record.unit_id?'wrong-unit':e.auth!==true?'unauthenticated':!REQUIRED.includes(e.step)?'unknown-step':!/^\d{4}-\d\d-\d\d$/.test(e.time??'')?'time-invalid':null;
    if(reason)rejected.push({step:e.step,reason});else accepted.push(e);
  }
  const first=new Map();
  for(const e of accepted)if(!first.has(e.step) || e.time<first.get(e.step).time)first.set(e.step,e);
  const chronology=[];
  for(let i=1;i<REQUIRED.length;i++){
    const prior=first.get(REQUIRED[i-1]),now=first.get(REQUIRED[i]);
    if(prior&&now&&prior.time>now.time)chronology.push({from:prior.step,to:now.step});
  }
  const present=[...first.keys()];
  return {case_id:record.case_id,unit_id:record.unit_id,present,missing:REQUIRED.filter(s=>!first.has(s)),rejected,chronology,chainComplete:REQUIRED.every(s=>first.has(s))&&chronology.length===0};
}
