import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { auditStudyTable, compareStudyTables } from '../tools/p2P25StudyTableAudit.mjs';

const { dissertation, article } = JSON.parse(readFileSync(
  new URL('../docs/research/p2-p25-ko-study-1-tables.json', import.meta.url), 'utf8',
));

for (const report of [dissertation, article]) {
  const audit = auditStudyTable(report);
  assert.equal(audit.summedN, 124);
  assert.equal(audit.tableCountMatches, true);
  assert.equal(audit.methodsCountMatches, false);
  assert.equal(audit.residualDfMatches, true);
  assert.equal(report.groups.filter(({ id }) => id !== 'neutral')
    .reduce((total, { n }) => total + n, 0), report.methodN);
}
assert.deepEqual(compareStudyTables(dissertation, article), {
  matchingGroups: ['negative', 'positive', 'actual', 'neutral'],
  allDisplayedGroupsMatch: true,
});

const readOnlyControl = structuredClone(article);
Object.assign(readOnlyControl.groups[3], { initialMean: 56.25, finalMean: 57.06 });
assert.deepEqual(compareStudyTables(dissertation, readOnlyControl), {
  matchingGroups: ['negative', 'positive', 'actual'],
  allDisplayedGroupsMatch: false,
});

const additionalGroup = structuredClone(article);
additionalGroup.groups.push({ ...article.groups[3], id: 'additional' });
assert.equal(compareStudyTables(dissertation, additionalGroup).allDisplayedGroupsMatch, false);
assert.equal(auditStudyTable(additionalGroup).tableCountMatches, false);
assert.equal(auditStudyTable(additionalGroup).residualDfMatches, false);
assert.throws(() => auditStudyTable({ ...article, methodN: '92' }), TypeError);
assert.throws(() => auditStudyTable({
  ...article, groups: [...article.groups, article.groups[0]],
}), TypeError);
assert.throws(() => auditStudyTable({
  ...article, groups: [{ ...article.groups[0], finalSd: -1 }, ...article.groups.slice(1)],
}), TypeError);
