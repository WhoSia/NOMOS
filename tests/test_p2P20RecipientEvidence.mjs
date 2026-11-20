import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { assessRecipientEvidence } from "../tools/p2P20RecipientEvidence.mjs";
const fixtures = JSON.parse(readFileSync(
  new URL("../docs/research/p2-p20-recipient-evidence-fixtures.json", import.meta.url),
  "utf8",
));
const results = fixtures.map(({ packet, observations }) => ({
  packet, ...assessRecipientEvidence(observations),
}));
assert.deepEqual(results.map((r) => r.compatibleCount), [12, 8, 4, 2, 3, 3]);
assert.deepEqual(results[0].verdicts, Object.fromEntries(
  ["received", "relied", "reopened", "reversed", "usable"].map((key) => [key, "unknown"]),
));
assert.equal(results[1].verdicts.relied, "unknown");
assert.equal(results[2].verdicts.reversed, "unknown");
assert.equal(results[3].verdicts.relied, false);
assert.equal(results[4].verdicts.received, "unknown");
assert.equal(results[5].verdicts.usable, false);
assert.throws(() => assessRecipientEvidence({ received: false, relied: true }), RangeError);
assert.throws(() => assessRecipientEvidence({ unsupported: true }), TypeError);
assert.throws(() => assessRecipientEvidence({ received: "unknown" }), TypeError);
console.log(JSON.stringify(results, null, 2));
