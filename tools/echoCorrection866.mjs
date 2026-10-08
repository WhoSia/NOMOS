// NOMOS 0.866 P3 — finite synthetic lineage and correction reach.
// No inference about real individuals.
export function assessEchoCorrection866(data) {
  if (!data || !Array.isArray(data.statements) || !Array.isArray(data.materialRecipients) || !Array.isArray(data.correctedRecipients) || !Array.isArray(data.defeatedRoots)) throw Error("Invalid audit packet");
  const ids = data.statements.map(s => s.id);
  if (new Set(ids).size !== ids.length || data.statements.some(s=>!s.id || !Array.isArray(s.roots) || s.roots.length===0)) throw Error("Invalid statements");
  const defeated = new Set(data.defeatedRoots);
  const repeated = data.statements.filter(s=>s.roots.every(r=>defeated.has(r))).map(s=>s.id);
  const unverifiedFresh = data.statements.filter(s=>s.roots.some(r=>!defeated.has(r))).map(s=>s.id);
  const corrected = new Set(data.correctedRecipients);
  return {statementCount:data.statements.length, sourceRootCount:new Set(data.statements.flatMap(s=>s.roots)).size,
    unsupportedRepetitions:repeated, purportedFreshSourcesNeedAudit:unverifiedFresh,
    unreachedRecipients:[...new Set(data.materialRecipients.filter(r=>!corrected.has(r)))],
    actualBeliefChangeEstablished:false, actualPersonRestorationEstablished:false,
    freshSourceAuthenticated:false, evidenceScope:"DECLARED_SYNTHETIC_GRAPH_ONLY"};
}
