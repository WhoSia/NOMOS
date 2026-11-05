// NOMOS R11 — logical countermodel analysis only; no person-level verdicts.
import { readFileSync } from 'node:fs';

export function completionIdentified(worlds, predicate = w => Boolean(w.latent?.CRA_applied_all)) {
  if (!Array.isArray(worlds) || worlds.length === 0) throw new Error('nonempty possible-world set required');
  const byObservation = new Map();
  for (const w of worlds) {
    if (!w || typeof w.observation !== 'string') throw new Error('observation id required');
    const key = JSON.stringify([w.observation,w.legal_order_terminated,w.requested_CRA_correction,w.checks_mailed_some]);
    const arr = byObservation.get(key) ?? [];
    arr.push(w);
    byObservation.set(key, arr);
  }
  return [...byObservation.entries()].map(([observation, ws]) => ({
    observation,
    possibleWorldCount: ws.length,
    identified: new Set(ws.map(w => predicate(w))).size === 1,
    admissibleValues: [...new Set(ws.map(w => predicate(w)))].sort()
  }));
}

if (process.argv[1]?.endsWith('remediationIdentifiabilityR11.mjs')) {
  const path = process.argv[2];
  if (!path) throw new Error('JSON fixture path required');
  const data = JSON.parse(readFileSync(path,'utf8'));
  process.stdout.write(JSON.stringify(completionIdentified(data.cases),null,2)+'\n');
}
