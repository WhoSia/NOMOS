import assert from "node:assert/strict";
import {assess860} from "../tools/deadlock860.mjs";

// P4: the observable packet is not an authenticated fact about legal power.
function projection(w){return JSON.stringify(w.reported);}
function pair(label,a,b,actual){
  assert.equal(projection(a),projection(b),label+": indistinguishable observations");
  assert.notEqual(actual(a),actual(b),label+": different institutional ground truth");
  const x=assess860(a.reported),y=assess860(b.reported);
  assert.deepEqual(x.verdicts,y.verdicts,label+": checker correctly cannot see hidden difference");
  console.log("PASS non-identifiable pair:",label,"/ declared verdict:",Object.values(x.verdicts).join(","));
}

// Pair A: same self-attested verified handoff, different actual statute.
const legalPacket={goals:["release"],facts:["request"],alternativesComplete:true,evidenceScopeVerified:true,
  rules:[{id:"handoff",head:"release",requires:["request"],warrant:"verified"}]};
pair("A: unverifiable lawful authority",
  {reported:legalPacket,actualStatutoryPower:true},
  {reported:legalPacket,actualStatutoryPower:false},
  w=>w.actualStatutoryPower);

// Pair B: same filed appeal and reviewer chain, but distinct hidden epistemic dependencies.
// This is exactly why NOMOS 0.839 requires source-ablation and independence receipts.
const reviewPacket={goals:["appeal_received"],facts:["request"],alternativesComplete:true,evidenceScopeVerified:true,
  rules:[{id:"office_receives",head:"appeal_received",requires:["request"],warrant:"verified"}]};
pair("B: hidden reviewer dependence",
  {reported:reviewPacket,actualIndependentReview:true},
  {reported:reviewPacket,actualIndependentReview:false},
  w=>w.actualIndependentReview);

// Pair C: candidate-completeness claim is an assertion; hidden lawful alternative changes reality.
const routesPacket={goals:["repair"],facts:["request"],alternativesComplete:true,evidenceScopeVerified:true,
  rules:[{id:"known_denied",head:"repair",requires:["request"],warrant:"denied"}]};
pair("C: omitted lawful alternative",
  {reported:routesPacket,undisclosedIndependentPath:true},
  {reported:routesPacket,undisclosedIndependentPath:false},
  w=>w.undisclosedIndependentPath);

console.log("PASS 3 observational-equivalence countermodels: authenticated warrants and candidate census are necessary for a real-world verdict.");
