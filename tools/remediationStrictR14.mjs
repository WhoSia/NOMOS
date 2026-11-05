// R14 stricter structural evidence checks. Not cryptographic authentication or legal judgment.
import {REQUIRED} from './remediationBridgeR12.mjs';
function validDay(s){
 if(typeof s!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(s))return false;
 const d=new Date(s+'T00:00:00Z');
 return !Number.isNaN(d.getTime())&&d.toISOString().slice(0,10)===s;
}
export function auditStrictBridge(record){
 if(!record||typeof record.case_id!=='string'||typeof record.unit_id!=='string'||!Array.isArray(record.events))throw Error('invalid case');
 const rejected=[],good=[];
 for(const e of record.events){
  const reason=!e||e.case_id!==record.case_id?'wrong-case':e.unit_id!==record.unit_id?'wrong-unit':!REQUIRED.includes(e.step)?'unknown-step':!validDay(e.time)?'invalid-calendar-date':e.auth!==true?'unverified-assertion':typeof e.source!=='string'||!e.source.trim()||typeof e.proof_ref!=='string'||!e.proof_ref.trim()?'missing-provenance':null;
  if(reason)rejected.push({step:e?.step??null,reason});else good.push(e);
 }
 const counts=new Map();
 for(const e of good)counts.set(e.step,(counts.get(e.step)??0)+1);
 const ambiguous=[...counts].filter(([,n])=>n>1).map(([s])=>s);
 const first=new Map();
 for(const e of good)if(!first.has(e.step))first.set(e.step,e);
 const chronology=[];
 const present=REQUIRED.filter(s=>first.has(s));
 for(let i=0;i<present.length;i++)for(let j=i+1;j<present.length;j++){
  if(first.get(present[i]).time>first.get(present[j]).time)chronology.push({from:present[i],to:present[j]});
 }
 return {case_id:record.case_id,unit_id:record.unit_id,present,missing:REQUIRED.filter(s=>!first.has(s)),rejected,ambiguous,chronology,structurallyComplete:REQUIRED.every(s=>first.has(s))&&ambiguous.length===0&&chronology.length===0};
}
