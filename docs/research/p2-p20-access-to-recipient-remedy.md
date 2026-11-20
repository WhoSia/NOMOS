# NOMOS-0.885 P2-P20 — From an access explanation to a verified recipient decision

2026-11-21. Builds on P2-P19's notifications and housing clocks.

## Research judgment

A strong data-access response can establish what was processed, how a particular score was produced and who the recipients were. It can make a challenge feasible. It still leaves open whether a named recipient received a particular updated report, actually relied on it, and produced a usable outcome before the relevant opportunity expired. Conversely, a recipient may reverse a decision via separate evidence or accommodation. Measure those claims separately in real case packets.

The CJEU sources strengthen the institutional rival against a generic novelty claim. [Dun & Bradstreet](p2-p20-dun-bradstreet-explanation.md) concerns an intelligible account of the actual automated procedure and principles. [Österreichische Post and CRIF](p2-p20-recipient-identity-and-record-copy.md) concern recipients and data copies. [SCHUFA](p2-p20-schufa-score-retention-boundaries.md) concerns the decisiveness of a score and, in a separate judgment, data retained from a public register. None of these rulings is offered as US housing law. [Philadelphia](p2-p20-philadelphia-denial-notice-clock.md) exemplifies a named actor's duty to produce a written reason under a clock, which has different evidentiary consequences from an issuer's retrospective explanation.

## Reproducible synthetic check

Model the same named recipient, revised version and application route. Receipt and reliance form three possible states (neither; received only; received and used). Reopening, reversal and usability form four states (none; reopened only; reversed but not usable; usable after reversal). Do not force a causal edge between revised-report use and the reversal. The Cartesian product is 12 compatible histories before direct endpoint observations. Six [constructed packets](p2-p20-recipient-evidence-fixtures.json) were evaluated with [the finite model](../../tools/p2P20RecipientEvidence.mjs).

| Packet | Compatible histories | Warrant and surviving question |
|---|---:|---|
| Source explanation, data copy, recipient identity | 12 | All recipient and remedy endpoints undetermined |
| Corrected version confirmed delivered | 8 | Receipt known, use undetermined |
| Dated decision evidence of use of corrected version | 4 | Receipt and reliance known in the model, reversal undetermined |
| Reversal confirmed, no revised version received | 2 | Reversal through a different route is compatible, usable benefit open |
| Usable result on the stated favorable-review route | 3 | Reopening and reversal follow by the route assumptions; receipt still unknown |
| Reopened with adverse result retained | 3 | Reversal false and benefit through this named reversal route false; receipt still unknown |

The numbers count logical alternatives under stated assumptions, not frequencies, outcome probabilities, or results from public cases. Explicitly contradictory observations are rejected, and uncertainty is retained when multiple histories remain. Verified with Node using `node tests/test_p2P20RecipientEvidence.mjs`. The run exercises the synthetic states and does not compare research methods on external cases.

## Return to the cases

Prior evidence shows a favorable housing decision and court-recited move in CoreLogic even though a dated new CrimSAFE version and recipient use have not been verified. P2-P19's Court and program clocks matter because the same favorable decision can produce an open offer, a closed opportunity, or eligibility without a vacancy. The next evidence target is a contemporaneous recipient record tied to version, substantive reason, date, and housing decision. If a strong legal and human-rights baseline makes the same conclusions from the same packet, the research demonstrates precise scope but no comparative advantage. [Paired review codebook](p2-p20-recipient-evidence-codebook.md)
