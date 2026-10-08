// NOMOS-0.860 bounded AND/OR task viability. No legal authority inferred.
// Run: node tools/deadlock860.mjs examples/deadlock860_cases.json
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

export function assess860(packet) {
  const goals = packet.goals;
  const facts = new Set(packet.facts || []);
  const rules = packet.rules || [];
  if (!Array.isArray(goals) || !goals.length || !Array.isArray(rules)) throw Error("Invalid packet");
  const ids = new Set();
  for (const r of rules) {
    if (!r.id || ids.has(r.id) || !r.head || !Array.isArray(r.requires) || !["verified","denied","unknown"].includes(r.warrant)) throw Error("Invalid or duplicate rule");
    ids.add(r.id);
  }
  const nodes = new Set([...facts,...goals]);
  for (const r of rules){ nodes.add(r.head); for(const x of r.requires) nodes.add(x); }
  if (packet.alternativesComplete !== true || packet.evidenceScopeVerified !== true) {
    return { verdicts: Object.fromEntries(goals.map(g=>[g,"UNKNOWN"])), reason:"OPEN_WORLD_OR_UNVERIFIED_SCOPE" };
  }
  // Monotone least fixed point. Lower: verified rules; upper: all non-denied rules.
  function close(includeUnknown) {
    const seen=new Set(facts), steps=[];
    let changed=true;
    while (changed) {
      changed=false;
      for (const r of rules) {
        if (r.warrant==="denied" || (!includeUnknown && r.warrant!=="verified")) continue;
        if (!seen.has(r.head) && r.requires.every(x=>seen.has(x))) {
          seen.add(r.head);steps.push({rule:r.id,head:r.head,requires:r.requires});changed=true;
        }
      }
    }
    return {seen,steps};
  }
  const lower=close(false),upper=close(true);
  const verdicts={}, witnesses={};
  for(const goal of goals) {
    if(lower.seen.has(goal)) {
      verdicts[goal]="ACTIONABLE";
      witnesses[goal]={kind:"LOWER_DERIVATION",steps:lower.steps};
    } else if(!upper.seen.has(goal)) {
      verdicts[goal]="BOUNDED_BLOCKED";
      witnesses[goal]={kind:"UPPER_UNREACHABLE",upperReachable:[...upper.seen].sort(),rulesConsidered:rules.map(r=>({id:r.id,warrant:r.warrant})),completeAlternatives:true};
    } else {
      verdicts[goal]="UNKNOWN";
      witnesses[goal]={kind:"GAP_BETWEEN_BOUNDS",upperSteps:upper.steps};
    }
  }
  return {verdicts,witnesses,reason:"DECLARED_FINITE_MODEL_ONLY"};
}

if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href){
  if(!process.argv[2]){console.error("Usage: node tools/deadlock860.mjs <packet-or-case-corpus.json>");process.exitCode=2;}
  else{
    const input=JSON.parse(readFileSync(process.argv[2],"utf8"));
    if(Array.isArray(input.cases)){
      const results=input.cases.map(c=> {
        const actual=assess860(c.packet).verdicts[c.packet.goals[0]];
        return {name:c.name,expected:c.expected,actual,passed:actual===c.expected};
      });
      console.log(JSON.stringify({status:results.every(r=>r.passed)?"PASS":"FAIL",results},null,2));
      if(results.some(r=>!r.passed))process.exitCode=1;
    }else console.log(JSON.stringify(assess860(input),null,2));
  }
}
