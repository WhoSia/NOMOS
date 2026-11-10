# NOMOS-0.885 P2-P10 — Martin, Nissenbaum & Shmatikov (2025) Vignette Evidence Audit

Date: 2026-11-11. Source: *No Cookies for You!*, Georgetown Law Technology Review 9(1), January 2025, original Drive PDF ID `19k2Pj3H_DRrR_lnj-LfkS6ncYBkacVQb` (SSRN-distributed journal-layout copy). Publisher metadata https://georgetownlawtechreview.org/no-cookies-for-you-evaluating-the-promises-of-big-techs-privacy-enhancing-techniques/GLTR-01-2025/ .

## Sections read
§II.A–B factorial vignette design: actor, data type, inference type and use purposes varied. Prolific recruitment in March/April 2023; **six survey conditions**, **30 vignettes per participant**; distinct respondents across conditions. §III comparison of raw vs inferred data use; §§IV–V first-/third-party and device-location conditions; §VI principal findings.

## Narrow numerical reproduction
Paper-reported Survey 1 (raw data) average rating `-23.41`; Survey 2 (inference) `-30.88`, and a t-statistic numerically given as `10.22` (paper uses a positive t although difference Survey2 minus Survey1 is negative). Pure arithmetic difference Survey2−Survey1 is `-7.47`. This is an **aggregate transformation**, NOT a rerun of the paper's regression, sample-standard-error estimate, independent test or causal explanation.

The accessible extracted PDF text literally states `p < 0.00`; this is not a valid probability threshold (p>=0), hence record the string as **SOURCE_PVALUE_FORMAT_ANOMALY** instead of asserting a corrected threshold. Inspect typeset original table/figure and underlying code before treating significance notation as verified; no invented p value.

## Identification and limits
Published results compare ratings of specified hypothetical vignettes; **not court adjudication, actual legal wrongfulness, an experimentally observed downstream consumer harm, nor representative national views**. Thirty ratings per person are nested repeated observations; individual respondent independence is not the same as vignette-level independence. Group sample sizes, response variance, vignette randomization, model coefficients and standard errors are not recoverable from two group means alone. The reported t cannot be validated from these summary values without additional assumptions.

## New inferential competitors and prior art
Jacobs & Wallach (2021), *Measurement and Fairness*, ACM FAccT pp. 375–385, DOI 10.1145/3442188.3445901: latent-construct validity and operationalization are established concerns (publisher abstract reviewed).
Selbst, boyd, Friedler, Venkatasubramanian & Vertesi (2019), *Fairness and Abstraction in Sociotechnical Systems*, FAT* 2019 pp.59–68, DOI 10.1145/3287560.3287598: social context and abstraction pitfalls are existing critiques (abstract reviewed).
Solow-Niederman (2022), *Information Privacy and the Inference Economy*, Northwestern University Law Review 117:357: organizational relations and inference implications already treated (publisher abstract reviewed).
These further defeat a general claim to discover multi-party inference accountability via a four-axis checklist. None of these newly found items has been fully read in this unit; assign SEARCH_NOT_FOUND only after Drive title/DOI/file search.

## Replication protocol gate
Before labeling a research replication: obtain respondent-level survey instrument and anonymized response data, clarify scale and model, reconstruct design matrix with cluster by respondent if appropriate, predeclare statistical contrast and variance assumptions, run code and validate group counts plus original tables. Otherwise use labels `SOURCE_REPORTED` and `ARITHMETIC_CHECKED`, never `REPLICATED`.

## P2 verdict
Martin et al. provide a real reported experiment beyond our toy Boolean fixtures. NOMOS has NOT independently replicated it, and its institutional claim-authority model has no demonstrated accuracy or scientific novelty over this study and existing social-science measurement approaches. P2 remains research stage OPEN with empirical improvement HOLD.


### P2-P10.6 — Aggregate difference only
Published Survey 1 raw mean -23.41 and Survey 2 inference mean -30.88 imply arithmetic difference -7.47. This is the only recomputation supported by those two aggregate values; without counts, standard errors and within-person repeated-vignette structure, a valid independent hypothesis test cannot be derived. The reported t magnitude 10.22 remains author-reported.
