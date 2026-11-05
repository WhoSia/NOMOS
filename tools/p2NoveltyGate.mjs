// Audit claimed novelty against strong listed rivals; heuristic warnings, no scientific novelty verdict.
export function noveltyGate(f){
 if(!Array.isArray(f?.rivals)||!f?.candidate) throw Error('benchmark data required');
 const rivals=new Set(f.rivals.flatMap(r=>r.capabilities??[]));
 const proposed=f.candidate.claims??[];
 if(!Array.isArray(proposed)) throw Error('candidate claims required');
 return {priorCapabilities:[...rivals].sort(),candidateClaims:proposed,
  evidenceOfIncrementalValue:f.candidate.empirical_added_value==='measured_independent_gain',
  promotionReady:f.candidate.empirical_added_value==='measured_independent_gain'&&f.candidate.independent_adjudication===true,
  verdict:'research_hypothesis_only'};
}
