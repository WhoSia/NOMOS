import assert from 'node:assert/strict';
import { assessRemedyChronology } from '../tools/p2P21RemedyChronology.mjs';

const independentApproval = {
  observations: { reversed: true },
  decisionDate: '2017-06-23',
  instrumentSignatureDate: '2017-08-09',
};
const recovered = assessRemedyChronology(independentApproval);
assert.equal(recovered.signedInstrumentCanPrecedeDecision, false);
assert.equal(recovered.verdicts.received, 'unknown');
assert.equal(recovered.verdicts.relied, 'unknown');
assert.equal(recovered.verdicts.usable, 'unknown');
assert.equal(recovered.compatibleCount, 6);

const priorSignature = assessRemedyChronology({
  ...independentApproval,
  instrumentSignatureDate: '2017-06-22',
});
assert.equal(priorSignature.signedInstrumentCanPrecedeDecision, true);
assert.deepEqual(priorSignature.verdicts, recovered.verdicts);

const sameDay = assessRemedyChronology({
  ...independentApproval,
  instrumentSignatureDate: independentApproval.decisionDate,
});
assert.equal(sameDay.signedInstrumentCanPrecedeDecision, 'unknown');

assert.throws(() => assessRemedyChronology({
  ...independentApproval,
  decisionDate: '2017-02-30',
}), RangeError);
assert.throws(() => assessRemedyChronology({
  ...independentApproval,
  observations: { received: false, relied: true },
}), RangeError);
console.log('P2-P21 remedy chronology cases passed');
