# NOMOS-0.885 P2-P3 — Three-Primary-Text Close Reading and Novelty Boundary
Date: 2026-11-05. Original user-supplied Drive PDFs read as texts. P2 stage OPEN; empirical validity / novelty HOLD.

## Verified Drive primary files
1. Nissenbaum, Helen (2004), Privacy as Contextual Integrity, Washington Law Review 79:119. Drive file ID `1NZjrRWp4aooazZGeU-tj7L792agdwnqm` (original name: Privacy as Contextual Integrity.pdf). Original publisher: https://digitalcommons.law.uw.edu/wlr/vol79/iss1/10/.
2. Barth, Adam; Datta, Anupam; Mitchell, John C.; Nissenbaum, Helen (2006), Privacy and Contextual Integrity: Framework and Applications. Drive ID `1iOiTolBFjwG96ohg9uBDGI6cAXf_09u7` (original name: barth-datta-mitchell-nissenbaum-2006.pdf). Author original: https://crypto.stanford.edu/~jcm/papers/barth-datta-mitchell-nissenbaum-2006.pdf.
3. Sultan, Shizra; Jensen, Christian D. (2021), Ensuring Purpose Limitation in Large-Scale Infrastructures with Provenance-Enabled Access Control, Sensors 21(9), 3041, DOI:10.3390/s21093041. Drive ID `1cceIx9-bU3GUru4yQrYSmlGKtIRP_BtF` (original name sensors-21-03041-with-cover.pdf). https://doi.org/10.3390/s21093041.
All three original PDFs now locate in Drive. No duplicate upload or rename performed. Text extraction does not prove visually verified figures or source-byte SHA.

## I. Nissenbaum 2004 — reconstructive reading
Part II attacks three reductionist dichotomies: governmental intrusion, sensitive versus nonsensitive personal data, and private versus public locations. Part III contextual integrity demands both (A) appropriateness of information TYPE to the role/context, and (B) governing transmission / distribution norms. Merely public or nonsensitive information may still require contextual privacy. Walzerian separate spheres and cross-sphere allocation are central, not incidental. Thus NOMOS may NOT credit itself with inventing cross-institution information limits, context-sensitive appropriateness, or inferential role-based relevance. Key text: III (contextual integrity), III.A (appropriateness), III.B (distribution).

## II. Barth et al. 2006 — formal reconstruction
Sections 3.1-3.2: Agents P, attributes T, knowledge state κ ⊆ P×P×T, computation rules I that infer attribute t from set T, messages, contextual roles with partial-order specialization, and traces of communications. This is **already a model of inference/knowledge derived from inputs**, not 'mere forwarding of messages'. Sections 3.3-3.4: many-sorted first-order LTL temporal norms (positive/negative; past and future operators), source, recipient, data subject and information type. Section 4: consistency with purpose α, entailment of one policy by another, weak local compliance and satisfiable strong future compliance. Explicit stated theoretical results: consistency and entailment decidable in PSPACE (Theorems 1-2); weak compliance and future requirements polynomial (Theorem 3); strong compliance PSPACE (Theorem 4); deciding weak⇒strong compliance EXPSPACE (Theorem 5). These are claims in their model under stated finiteness/representation assumptions; do not import their complexities to NOMOS or real legal compliance. Section 5 models HIPAA, COPPA and GLBA; Section 6 compares RBAC, XACML, EPAL, P3P. **NOMOS must not falsely claim Barth omitted inferred information**. Its explicit immediate-action model does concentrate on communication; broader downstream adjudicative legitimacy is not separately established as a solved domain in this paper.

## III. Sultan & Jensen 2021 — mechanism reconstruction
Section 2 SC-TMS smart city: traffic surveillance, transit data and vehicle registration collected for heterogeneous legitimate purposes. Section 3 provenance annotates collection purpose and legal basis across transformations; §3.2 aggregated-resource provenance must retain parent purposes. Section 4 adapts attribute-enhanced role-based access control (AERBAC): user, resource and environmental attributes, assigned roles, access purpose vs inherited collection purposes, permitting or denying secondary use. Section 5 surveys competitors; Section 6 concludes. The work describes framework/design and example reasoning; the extracted full text does **not** reveal an independently measured controlled accuracy/causal outcome evaluation. Do not invent benchmarks, deployment metrics or person-level outcomes.

## IV. Prior-art defeat matrix
- Roles / context / appropriateness -> Nissenbaum 2004.
- Derived attributes, subject/sender/recipient and temporal norms -> Barth 2006.
- Formal policy satisfiability / implication and compliance -> Barth 2006.
- Immutably recording and propagating collection purpose through derived resource lineage -> Sultan/Jensen 2021.
- Authorized purpose-based access checks -> Sultan/Jensen 2021, plus older PBAC/RBAC/ABAC.
- No paper alone is demonstrated to provide an independent legal authority certificate for EVERY person-classification claim. But this is a cautious scope statement, not proof that they cannot be extended to do so.

## V. Revised open research gap
Distinguish semantic derivability `κ ⊢ attribute` from authorization for an institution to assert a person-level proposition `Authority(actor, person, claim, purpose, institution, time)`; incorporate source-contestability, defeasibility, due process and actual decision effects only with grounded rule sources. **A permissioned transmission and a computable attribute do not automatically license all normative institutional uses.** This non-entailment is an existing philosophical/legal intuition, not yet a distinctive NOMOS theorem. Formal novelty survives only if a new falsifiable case/condition is shown beyond contextual integrity, formal transmission norms, access purpose control, and expert case-law reading.

## VI. Falsification protocol
Adversary explicitly builds a Barth-style rule extension and contextual integrity flow norm over the SAME synthetic example. If that extension reproduces NOMOS without additional institutional facts, abandon alleged novelty. Compare against expert normative audit and source-validated legal predicates. The study has no independently adjudicated new individuals, no real outcomes and no runtime proof of benefits.

## VII. Follow-on
P2-P4: distinguish assertion legitimacy from simply knowing and transmitting an inferred attribute; use a paired-world counterexample where communication traces are identical but institutional classification actions differ. Clearly state this is a modeling demonstration, not an impossibility or novelty theorem.
