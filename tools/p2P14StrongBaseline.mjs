// Conservative preregistration comparison, not actual classifier or empirical performance.
export function auditResearchContract(d){
 if(!Array.isArray(d?.baselines)||!Array.isArray(d?.cases))throw Error('bad benchmark');
 const strong=d.baselines.find(x=>x.id==='R1');
 const augmented=d.baselines.find(x=>x.id==='G');
 if(!strong||!augmented)throw Error('strong rival and augmented model needed');
 const needed=['mechanism','horizontal_population_relation','vertical_institutional_relation','governance_legitimacy','expert_law_scope','purpose','context'];
 const missingStrong=needed.filter(f=>!strong.features.includes(f));
 const extra=augmented.features.filter(f=>!strong.features.includes(f));
 return {caseCount:d.cases.length,missingStrong,extra,
   independentTruthLabels:d.cases.filter(c=>c.independentAdjudication===true).length,
   empiricalIncrementEstablished:false,
   verdict:'test_design_only'};
}
