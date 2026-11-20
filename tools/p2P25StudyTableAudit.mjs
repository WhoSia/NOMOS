function requireInteger(value, minimum, label) {
  if (!Number.isSafeInteger(value) || value < minimum) {
    throw new TypeError(`Expected an integer ≥ ${minimum} for ${label}`);
  }
}

const moments = ['initialMean', 'initialSd', 'finalMean', 'finalSd'];

// The degrees of freedom check applies to a saturated, one-factor group model.
export function auditStudyTable({ methodN, tableN, residualDf, groups }) {
  requireInteger(methodN, 1, 'the methods count');
  requireInteger(tableN, 1, 'the table count');
  requireInteger(residualDf, 0, 'the residual degrees of freedom');
  if (!Array.isArray(groups) || groups.length < 2) {
    throw new TypeError('Expected at least two groups');
  }

  const rows = new Map();
  let summedN = 0;
  for (const group of groups) {
    const { id, n } = group;
    if (typeof id !== 'string' || !id.trim() || rows.has(id)) {
      throw new TypeError('Expected unique nonempty group IDs');
    }
    requireInteger(n, 1, `group ${id}`);
    if (moments.some(key => !Number.isFinite(group[key])) ||
        group.initialSd < 0 || group.finalSd < 0) {
      throw new TypeError(`Expected finite moments and nonnegative deviations for ${id}`);
    }
    rows.set(id, [n, ...moments.map(key => group[key])]);
    summedN += n;
  }
  requireInteger(summedN, 1, 'the group total');
  return {
    rows,
    summedN,
    tableCountMatches: summedN === tableN,
    methodsCountMatches: summedN === methodN,
    residualDfMatches: residualDf === summedN - rows.size,
  };
}

// Matching rounded aggregates signal a cross-report check, never participant identity.
export function compareStudyTables(first, second) {
  const earlier = auditStudyTable(first);
  const later = auditStudyTable(second);
  const matchingGroups = [...earlier.rows].filter(([id, values]) => {
    const candidate = later.rows.get(id);
    return candidate?.every((value, index) => value === values[index]);
  }).map(([id]) => id);
  return {
    matchingGroups,
    allDisplayedGroupsMatch: matchingGroups.length === earlier.rows.size &&
      matchingGroups.length === later.rows.size,
  };
}
