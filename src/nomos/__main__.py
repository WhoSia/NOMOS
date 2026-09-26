from __future__ import annotations

import argparse
import json
from pathlib import Path

from .audit import audit_case
from .lineage import trace_record
from .review_topology import analyze_review_topology


def main() -> int:
    parser = argparse.ArgumentParser(
        prog="nomos",
        description="Audit NOMOS research structures without producing person verdicts.",
    )
    parser.add_argument("case", type=Path, help="Path to a NOMOS JSON case or review topology")
    parser.add_argument("--json", action="store_true", dest="as_json", help="Emit JSON findings")
    parser.add_argument("--trace", metavar="RECORD_ID", help="Trace a derived record's dependency closure")
    parser.add_argument(
        "--calibrate-review",
        action="store_true",
        help="Analyze review-topology dependency breaks, redundancy and escalation structure",
    )
    args = parser.parse_args()

    data = json.loads(args.case.read_text(encoding="utf-8"))

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
