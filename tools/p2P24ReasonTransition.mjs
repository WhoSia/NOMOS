const scopeFields = ['caseId', 'authority', 'question'];

function requireId(value) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new TypeError('Expected a nonempty identifier or locator');
  }
  return value;
}

function indexReasons(record) {
  if (record.reasons === null) return null;
  if (!Array.isArray(record.reasons)) throw new TypeError('Expected reasons or null');
  const index = new Map();
  for (const { id, locator, evidence } of record.reasons) {
    requireId(id);
    requireId(locator);
    if (!Array.isArray(evidence) || !evidence.length || index.has(id)) {
      throw new TypeError('Expected unique reasons with at least one cited source');
    }
    index.set(id, new Set(evidence.map(requireId)));
  }
  return index;
}

function traceSources(ids, graph, withdrawn) {
  const visited = new Set();
  const active = new Set();
  const unresolvedSources = new Set();
  const withdrawnSources = new Set();

  function visit(id) {
    if (active.has(id)) throw new RangeError(`Cyclic evidence provenance: ${id}`);
    if (visited.has(id)) return;
    visited.add(id);
    if (withdrawn.has(id)) withdrawnSources.add(id);
    if (!graph.has(id)) {
      unresolvedSources.add(id);
      return;
    }
    active.add(id);
    for (const parent of graph.get(id)) visit(parent);
    active.delete(id);
  }

  for (const id of ids) visit(id);
  return {
    withdrawnSources: [...withdrawnSources].sort(),
    unresolvedSources: [...unresolvedSources].sort(),
  };
}

export function assessReasonTransition({ before, after, correction = null, sources }) {
  for (const field of scopeFields) {
    requireId(before[field]);
    requireId(after[field]);
  }
  if (scopeFields.some(field => before[field] !== after[field])) {
    return { matched: false, outcome: 'unknown', statedReasons: null, afterProvenance: null };
  }
  for (const record of [before, after]) {
    if (record.outcome !== null) requireId(record.outcome);
  }
  const outcome = before.outcome === null || after.outcome === null ? 'unknown'
    : before.outcome === after.outcome ? 'same' : 'different';
  const earlier = indexReasons(before);
  const later = indexReasons(after);
  const statedReasons = earlier && later ? {
    added: [...later.keys()].filter(id => !earlier.has(id)),
    omitted: [...earlier.keys()].filter(id => !later.has(id)),
    changedCitations: [...later].filter(([id, ids]) => {
      const previous = earlier.get(id);
      return previous && (previous.size !== ids.size || [...ids].some(source => !previous.has(source)));
    }).map(([id]) => id),
  } : null;

  let afterProvenance = null;
  if (correction !== null && later !== null) {
    requireId(correction.locator);
    if (!Array.isArray(correction.withdrawnSources) || !correction.withdrawnSources.length) {
      throw new TypeError('Expected at least one explicitly withdrawn source');
    }
    const withdrawn = new Set(correction.withdrawnSources.map(requireId));
    const graph = new Map(Object.entries(sources).map(([id, parents]) => {
      requireId(id);
      if (!Array.isArray(parents)) throw new TypeError('Expected a list of source parents');
      return [id, parents.map(requireId)];
    }));
    afterProvenance = Object.fromEntries([...later].map(([id, refs]) => [
      id, traceSources(refs, graph, withdrawn),
    ]));
  }
  return { matched: true, outcome, statedReasons, afterProvenance };
}
