// P2-P9: bounded, source-grounded toy abstraction. Not actual thesis XACML code or legal advice.
function unique(values){return [...new Set(values)];}
export function auditView(s){
 const r=s?.request, f=s?.record;
 if(!r||!f||!Array.isArray(r.accessEvents)||!Array.isArray(f.events))throw Error('malformed case');
 if(r.contextOk===false)return {mode:'DENY',visible:[],masked:unique(f.events.flatMap(e=>e.objects??[]))};
 if(r.contextOk!==true)return {mode:'UNKNOWN_CONTEXT',visible:[],masked:unique(f.events.flatMap(e=>e.objects??[]))};
 if(!Array.isArray(f.collectionEvents))return {mode:'UNKNOWN_PURPOSE',visible:[],masked:unique(f.events.flatMap(e=>e.objects??[]))};
 const allowedEvents=new Set(r.accessEvents.filter(e=>f.collectionEvents.includes(e)));
 const allObjects=unique(f.events.flatMap(e=>e.objects??[]));
 const visible=unique(f.events.filter(e=>allowedEvents.has(e.kind)).flatMap(e=>e.objects??[]));
 const masked=allObjects.filter(x=>!visible.includes(x));
 return {mode:visible.length?'FILTERED':'PRIVACY_AWARE',visible,masked};
}
export function physicalOnly(s){
 if(s?.request?.contextOk!==true)return {mode:'DENY_OR_UNKNOWN',visible:[]};
 return {mode:'FULL_VIEW',visible:unique((s.record?.events??[]).flatMap(e=>e.objects??[]))};
}
