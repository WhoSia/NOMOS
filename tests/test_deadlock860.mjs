import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {assess860} from "../tools/deadlock860.mjs";
const data=JSON.parse(readFileSync(new URL("../examples/deadlock860_cases.json", import.meta.url),"utf8"));
for(const t of data.cases){const actual=assess860(t.packet).verdicts[t.packet.goals[0]];assert.equal(actual,t.expected,t.name);console.log("PASS",t.name,actual);}
assert.throws(()=>assess860({goals:["x"],alternativesComplete:true,evidenceScopeVerified:true,rules:[{id:"r",head:"x",requires:[],warrant:"verified"},{id:"r",head:"x",requires:[],warrant:"verified"}]}));
console.log("PASS duplicate rule rejection");
