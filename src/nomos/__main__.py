from __future__ import annotations

import argparse
import json
from pathlib import Path

from .audit import audit_case


def main() -> int:
    parser = argparse.ArgumentParser(
        prog="nomos",
        description="Validate a NOMOS Case Graph without producing person verdicts.",
    )
    parser.add_argument("case", type=Path, help="Path to a NOMOS JSON case")
    parser.add_argument("--json", action="store_true", dest="as_json", help="Emit JSON findings")
    args = parser.parse_args()

    data = json.loads(args.case.read_text(encoding="utf-8"))
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
