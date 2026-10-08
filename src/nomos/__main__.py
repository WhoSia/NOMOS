from __future__ import annotations

import argparse
import json
from pathlib import Path

from .audit import audit_case
from .correction_compaction import analyze_correction_compaction
from .correction_concurrency import analyze_correction_concurrency
from .correction_propagation import analyze_correction_propagation
from .divergence_replication import analyze_divergence_replication
from .feedback_restoration import analyze_feedback_restoration
from .historical_reopening import analyze_historical_reopening
from .recall_triage import analyze_recall_triage
from .lineage import trace_record
from .record_portability import analyze_record_portability
from .review_divergence import analyze_review_divergence
from .review_topology import analyze_review_topology
from .router import analyze_router
from .routing_learning import analyze_routing_learning
from .systemic_reopening import analyze_systemic_reopening


def main() -> int:
    parser = argparse.ArgumentParser(
        prog="nomos",
        description="Audit NOMOS research structures without producing person verdicts.",
    )
    parser.add_argument("case", type=Path, help="Path to a NOMOS JSON structure")
    parser.add_argument("--json", action="store_true", dest="as_json", help="Emit JSON findings")
    parser.add_argument("--trace", metavar="RECORD_ID", help="Trace a derived record's dependency closure")
    parser.add_argument("--calibrate-review", action="store_true")
    parser.add_argument("--audit-router", action="store_true")
    parser.add_argument("--audit-routing-learning", action="store_true")
    parser.add_argument("--plan-feedback-restoration", action="store_true")
    parser.add_argument("--audit-review-divergence", action="store_true")
    parser.add_argument(
        "--audit-divergence-replication",
        action="store_true",
        help="Audit whether localized live↔shadow divergence replicates across clusters, reviewers and case mix",
    )
    parser.add_argument(
        "--audit-systemic-reopening",
        action="store_true",
        help="Audit shared-defect propagation, cohort identification and sample-to-recall escalation",
    )
    parser.add_argument("--audit-recall-triage", action="store_true", help="Audit capacity-constrained historical recall sequencing")
    parser.add_argument(
        "--audit-historical-reopening",
        action="store_true",
        help="Audit historical-branch reopening triggers, standing, scope and reauthorization firewalls",
    )
    parser.add_argument(
        "--audit-correction-compaction",
        action="store_true",
        help="Audit correction-branch retirement, historical retention and provenance-safe snapshotting",
    )
    parser.add_argument(
        "--audit-correction-concurrency",
        action="store_true",
        help="Audit correction frontiers, supersession ordering and stale-write resurrection",
    )
    parser.add_argument(
        "--audit-correction-propagation",
        action="store_true",
        help="Audit typed correction propagation, semantic re-derivation and recipient recall",
    )
    parser.add_argument(
        "--audit-record-portability",
        action="store_true",
        help="Audit emergency-record transport into ordinary evidentiary/person-judgment use",
    )
    args = parser.parse_args()

    data = json.loads(args.case.read_text(encoding="utf-8"))

    if args.audit_systemic_reopening:
        systemic = data.get("systemic_reopening", data)
        result = analyze_systemic_reopening(systemic)
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return 1 if result["status"] == "FAIL" else 0

    if args.audit_recall_triage:
        result = analyze_recall_triage(data.get("recall_triage", data))
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return 1 if result["status"] == "FAIL" else 0

    if args.audit_historical_reopening:
        reopening = data.get("historical_reopening", data)
        result = analyze_historical_reopening(reopening)
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return 1 if result["status"] == "FAIL" else 0

    if args.audit_correction_compaction:
        compaction = data.get("correction_compaction", data)
        result = analyze_correction_compaction(compaction)
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return 1 if result["status"] == "FAIL" else 0

    if args.audit_correction_concurrency:
        concurrency = data.get("correction_concurrency", data)
        result = analyze_correction_concurrency(concurrency)
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return 1 if result["status"] == "FAIL" else 0

    if args.audit_correction_propagation:
        propagation = data.get("correction_propagation", data)
        result = analyze_correction_propagation(propagation)
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return 1 if result["status"] == "FAIL" else 0

    if args.audit_record_portability:
        portability = data.get("record_portability", data)
        result = analyze_record_portability(portability)
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return 1 if result["status"] == "FAIL" else 0

    if args.audit_divergence_replication:
        replication = data.get("divergence_replication", data)
        print(json.dumps(analyze_divergence_replication(replication), ensure_ascii=False, indent=2))
        return 0

    if args.audit_review_divergence:
        divergence = data.get("review_divergence", data)
        print(json.dumps(analyze_review_divergence(divergence), ensure_ascii=False, indent=2))
        return 0

    if args.plan_feedback_restoration:
        restoration = data.get("feedback_restoration", data)
        print(json.dumps(analyze_feedback_restoration(restoration), ensure_ascii=False, indent=2))
        return 0

    if args.audit_routing_learning:
        learning = data.get("routing_learning", data)
        print(json.dumps(analyze_routing_learning(learning), ensure_ascii=False, indent=2))
        return 0

    if args.audit_router:
        router = data.get("router", data)
        print(json.dumps(analyze_router(router), ensure_ascii=False, indent=2))
        return 0

    if args.calibrate_review:
        topology = data.get("review_topology", data)
        print(json.dumps(analyze_review_topology(topology), ensure_ascii=False, indent=2))
        return 0

    if args.trace:
        print(json.dumps(trace_record(data, args.trace), ensure_ascii=False, indent=2))
        return 0

    findings = audit_case(data)

    if args.as_json:
        print(json.dumps([f.to_dict() for f in findings], ensure_ascii=False, indent=2))
    elif findings:
        for f in findings:
            refs = f" [{', '.join(f.refs)}]" if f.refs else ""
            print(f"{f.severity} {f.code}: {f.message}{refs}")
    else:
        print("PASS: no constitutional invariant violations detected.")

    return 1 if any(f.severity == "ERROR" for f in findings) else 0


if __name__ == "__main__":
    raise SystemExit(main())
