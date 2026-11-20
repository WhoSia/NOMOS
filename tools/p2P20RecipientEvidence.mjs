// Constructed evidence check. It does not classify empirical or legal outcomes.
const claims = ["received", "relied", "reopened", "reversed", "usable"];
const receiptAndUse = [[false, false], [true, false], [true, true]];
const reviewAndRelief = [
  [false, false, false],
  [true, false, false],
  [true, true, false],
  [true, true, true],
];

const worlds = receiptAndUse.flatMap(([received, relied]) =>
  reviewAndRelief.map(([reopened, reversed, usable]) => ({
    received, relied, reopened, reversed, usable,
  })),
);

export function assessRecipientEvidence(observations) {
  if (!observations || typeof observations !== "object" || Array.isArray(observations)) {
    throw new TypeError("Expected a record of endpoint-specific observations");
  }
  const entries = Object.entries(observations);
  for (const [claim, value] of entries) {
    if (!claims.includes(claim) || typeof value !== "boolean") {
      throw new TypeError("Each observation needs a known claim and a Boolean value");
    }
  }
  const compatible = worlds.filter((world) =>
    entries.every(([claim, value]) => world[claim] === value),
  );
  if (compatible.length === 0) {
    throw new RangeError("Observations contradict the assumptions of this route");
  }
  const verdicts = Object.fromEntries(claims.map((claim) => {
    const states = new Set(compatible.map((world) => world[claim]));
    return [claim, states.size === 1 ? compatible[0][claim] : "unknown"];
  }));
  return { compatibleCount: compatible.length, verdicts };
}
