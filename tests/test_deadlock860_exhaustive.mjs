import assert from "node:assert/strict";
import {assess860} from "../tools/deadlock860.mjs";

const template=[
  {id:"seedA",head:"a",requires:[]},
  {id:"AfromB",head:"a",requires:["b"]},
  {id:"BfromA",head:"b",requires:["a"]},
  {id:"goalAB",head:"goal",requires:["a","b"]},
  {id:"goalC",head:"goal",requires:["c"]}
];
const labels=["verified","denied","unknown"];
function directClosure(facts,rules){
  const reached=new Set(facts);let changed=true;
  while(changed){changed=false;for(const r of rules){
    if(r.warrant==="verified"&&!reached.has(r.head)&&r.requires.every(x=>reached.has(x))){
      reached.add(r.head);changed=true;
    }
  }}
  return reached;
}
let cases=0,worlds=0;
for(const facts of [[],["a"],["b"],["c"],["a","c"]]){
  for(let encoding=0;encoding<3**template.length;encoding++){
    let x=encoding;
    const rules=template.map(t=>{const warrant=labels[x%3];x=Math.floor(x/3);return {...t,warrant};});
    const packet={goals:["goal","a","b"],facts,alternativesComplete:true,evidenceScopeVerified:true,rules};
    const result=assess860(packet);
    const unknown=rules.filter(r=>r.warrant==="unknown");
    const ever=new Map(packet.goals.map(g=>[g,false]));
    const always=new Map(packet.goals.map(g=>[g,true]));
    for(let mask=0;mask<2**unknown.length;mask++){
      const decided=rules.map(r=>r.warrant==="unknown"?{...r,warrant:(mask&(1<<unknown.indexOf(r)))?"verified":"denied"}:r);
      const actual=directClosure(facts,decided);worlds++;
      for(const goal of packet.goals){
        const reached=actual.has(goal);
        ever.set(goal,ever.get(goal)||reached);
        always.set(goal,always.get(goal)&&reached);
      }
    }
    for(const goal of packet.goals){
      const wanted=always.get(goal)?"ACTIONABLE":ever.get(goal)?"UNKNOWN":"BOUNDED_BLOCKED";
      assert.equal(result.verdicts[goal],wanted,`Three-valued verdict not exact: ${encoding}, ${goal}`);
    }
    cases++;
  }
}
assert.equal(assess860({goals:["goal"],facts:[],rules:[],alternativesComplete:false,evidenceScopeVerified:true}).verdicts.goal,"UNKNOWN");
assert.equal(assess860({goals:["goal"],facts:[],rules:[],alternativesComplete:true,evidenceScopeVerified:false}).verdicts.goal,"UNKNOWN");
console.log(`PASS exhaustive finite-world sandwich: ${cases} source models, ${worlds} completed worlds, 3 queried goals, exact three-valued classification`);
