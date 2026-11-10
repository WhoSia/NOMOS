# NOMOS-0.885 P2-P9 — Sultan (2022) Chapter 5 Constrained Policy Reproduction

Date: 2026-11-11. Stage: P2 adversarial study; no demonstrated novelty, real-case adjudication or deployment.

## Canonical and genre
Sultan (2022), *Purpose Limitation and Secondary Use Prevention in Large-Scale Video Surveillance Systems*, DTU PhD thesis (publisher PDF, 155 pp.; internal title-page 2021, DTU publication 2022). Exact original Drive ID `1_AP8Ly2tG-cKYxXjDffARDPk82v0xpFc`, canonical `11_SOURCES`. Do not mis-categorize as 2021 *Computers & Security* or *Sensors* journal paper. DOI/URL for thesis: https://orbit.dtu.dk/en/publications/purpose-limitation-and-secondary-use-prevention-in-large-scale-vi/ .

## Textual reading and bounded specification
Chapter 5, especially §§5.1–5.4, distinguishes extended AERBAC role assignment, physical/time/location contextual constraints, *event-of-interest* (EOI) matching in observer *access purpose* and resource *collection purpose*, and object-of-interest (OOI) visibility conditional on a matched event. Under permitted context a narrow allowed object is visible; otherwise sensitive objects can be masked in privacy-aware view. The thesis describes an implemented MySQL metadata database + XACML policy-decision-point and front-end, not merely a hypothetical diagram.

The source states matching EOI is necessary for revealing specified personal information; it does NOT provide a universal instruction that any incompatible data must always be released in fully blurred mode. The prototype here therefore distinguishes `DENY` (context not authorized), `PRIVACY_AWARE` (authorized context but no permitted event/object) and `FILTERED` (some permitted object IDs), with a **researcher-imposed and explicitly disclosed** privacy-aware fallback. This is a *small faithful abstraction of requirements*, not an independent XACML interpreter nor reproduction of author implementation or quantitative evaluation.

## Competing designs
B0 physical-only monitor yields whole-record exposure if role/time/location matches.
B1 narrow Sultan-inspired monitor adds EOI/OOI and collection-purpose intersection, masks other objects. G proposed NOMOS claim-authority monitor would require an independent legal claim/use rule AFTER view. B1 already handles transmission-level secondary use; no NOMOS novelty for these restrictions.

## Falsification
Create a toy record with both authorized traffic object and unauthorized bystander object. The physical-only baseline shows both; B1 returns only authorized object. This is not a novel discovery: it is a source-grounded example of what Sultan already explained. A nonmatching role/time/location is DENY, and unknown collection-purpose evidence must not be silently interpreted as permission.

## Validation boundary
Static synthetic fixtures, no actual personal footage, no network/DB/XACML runtime, no assertion of real GDPR compliance. Source includes tables/figures that require visual and policy syntax inspection before claiming an exact policy reproduction. No empirical accuracy, recall, privacy outcomes or court findings established.


### P2-P9.6 — Fidelity counterexample
The thesis §5.2 requires intersection of the observer's access-purpose EOI with the data's collection-purpose EOI. The mixed-traffic fixture would expose two objects under physical-only permissions, but only vehicle_1 under the restricted abstraction. This difference is inherited from Sultan, not produced by NOMOS.


### P2-P9.7 — Privacy-aware policy is not automatic entitlement
The dissertation describes privacy-aware masking as a possible view in authorized contexts without permitted semantic EOIs. Its precise branching depends on implementation policy and request attributes. Our fixed fallback is an authored assumption, not an assertion that all institutions must release a blurred version; the denial branch remains independent.
