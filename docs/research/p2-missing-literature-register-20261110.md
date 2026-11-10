# NOMOS-0.885 — Living Missing Literature Register
**Updated 2026-11-10 after new user uploads, fulltext checks and Drive redistribution.**

Legend: `FOUND_PDF` = exact PDF/genre verified and metadata parent read back; `SEARCH_NOT_FOUND` = no identified standalone original after connected Drive title/DOI search, **NOT proof of nonpossession**; `RELATED_THESIS_HELD` = same research appears in the thesis, but distinct publisher article/chapter file remains search-unlocated. Reading stage is explicit. No source-byte SHA-256 was computed.

## Current priority: five independent publications not found as standalone originals

| Priority | Work and publication type | Stable citation | Drive status / reading stage | Why read next |
|---|---|---|---|---|
| P0 | Chen & Huang (2026), *Inferential Privacy and the Duty of Data Loyalty* — journal article | https://doi.org/10.1093/idpl/ipag020 | SEARCH_NOT_FOUND / abstract | Direct legal theory of inference and data loyalty |
| P0 | Sultan & Jensen (2021), *Secondary Use Prevention in Large-Scale Data Lakes* — conference proceedings **book chapter**, Intelligent Computing III, 967–985 | https://doi.org/10.1007/978-3-030-80129-8_64 | RELATED_THESIS_HELD; standalone chapter SEARCH_NOT_FOUND / abstract and related thesis chapter reviewed | Exact distinct chapter of purpose inheritance, not equivalent to whole doctoral thesis |
| P1 | Sultan & Jensen (2021), *Metadata based need-to-know view in large-scale video surveillance systems* — **journal article**, Computers & Security 111, 102452 | https://doi.org/10.1016/j.cose.2021.102452 | RELATED_THESIS_HELD; standalone journal PDF SEARCH_NOT_FOUND / publisher abstract and related thesis ch.5 reviewed | Specific content-sensitive AERBAC model and video prototype as published |
| P2 | Pan, Stakhanova & Ray (2023), *Data Provenance in Security and Privacy* — ACM Computing Surveys review | https://doi.org/10.1145/3593294 | SEARCH_NOT_FOUND / abstract | Broad threat models / provenance security research |
| P2 | Gierend et al. (2024), *Provenance Information for Biomedical Data and Workflows: Scoping Review* — JMIR review 26:e51297 | https://doi.org/10.2196/51297 | SEARCH_NOT_FOUND / abstract | External provenance evidence standards and reproducibility |

## Newly acquired — removed from missing status (four verified originals)

| Work | File type and distinct version | Drive ID | Final folder | Reading state |
|---|---|---|---|---|
| Park, Nguyen & Sandhu (2012), *A Provenance-based Access Control Model* | Conference paper PST 2012 pp.137–144 | `11CUSnooMw5Ty8Kc9WN-Jxed4LRMpJUDJ` | `10_PAPERS` | Text and important formal sections/case study reviewed |
| Martin, Nissenbaum & Shmatikov (2025), *No Cookies for You!* | Georgetown Law Technology Review 9(1) journal-layout PDF distributed via SSRN 4655228 | `19k2Pj3H_DRrR_lnj-LfkS6ncYBkacVQb` | `10_PAPERS` | Full text and method/results/conclusion reviewed; source data not reanalyzed |
| Sultan (2022), *Purpose Limitation and Secondary Use Prevention in Large-Scale Video Surveillance Systems* | **PhD thesis**, DTU publisher PDF; cover internal place-year 2021, **official publication 2022** | `1_AP8Ly2tG-cKYxXjDffARDPk82v0xpFc` | `11_SOURCES` | Full extracted text and theory, prototype/implementation/limitations reviewed |
| Engelmann & Nissenbaum (2025), *Countering Privacy Nihilism* | **arXiv 2507.18253v1 preprint**; forthcoming edited-volume indication is NOT final version confirmation | `1KXUULKh0uFbQ-MWsI9IjfTXgQK8k-UJY` | `10_PAPERS` | Full extracted text and sections II–V reviewed |

All four files moved from `00_INTAKE` by metadata-only rename/move, original Drive IDs preserved and final parent folders re-read. Binary bytes not independently SHA-256 verified. [Detailed P2-P7 study and bibliography](p2-p7-four-new-primary-works.md), [custody receipt](../../examples/p2_p7_primary_custody.json).

## Previously canonical PDFs (do not re-download)
- Nissenbaum (2004), *Privacy as Contextual Integrity*: `1NZjrRWp4aooazZGeU-tj7L792agdwnqm`.
- Barth et al. (2006), *Privacy and Contextual Integrity: Framework and Applications*: `1iOiTolBFjwG96ohg9uBDGI6cAXf_09u7`.
- Sultan & Jensen (2021), *Ensuring Purpose Limitation in Large-Scale Infrastructures with Provenance-Enabled Access Control*: `1cceIx9-bU3GUru4yQrYSmlGKtIRP_BtF`.

## Update discipline
1. Check by exact title/author/DOI and document's own bibliography, not fuzzy search count; inspect source parent, genre, publication and edition.
2. Locate each independent **journal, conference, book chapter, dissertation** separately. Possession of a dissertation including related results is not automatically possession of publisher chapter/journal file.
3. Preserve file ID and check actual destination after moving. Do not duplicate canonical original.
4. Paper reading level, empirical replication and byte-level integrity are independently tracked.
5. End each NOMOS research output with this current missing-paper table, even if no new sources were acquired.
