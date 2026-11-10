// Inspect author-reported aggregate figures, not a statistical replication.
export function auditAggregates(data){
 const c=data?.contrast,d=data?.design;
 if(!c||!d)throw Error('design/contrast required');
 const {survey_1_mean:a,survey_2_mean:b,reported_t_magnitude:t}=c;
 if(![a,b,t].every(Number.isFinite))throw Error('invalid numeric aggregate');
 if(!(Number.isInteger(d.conditions)&&Number.isInteger(d.vignettes_per_respondent)))throw Error('invalid study design');
 const difference=Math.round((b-a)*100)/100;
 const pString=c.reported_p_threshold_text??'';
 const m=pString.match(/^p\s*<\s*([0-9]*\.?[0-9]+)$/);
 const bound=m?Number(m[1]):null;
 const pValueStatus=m&&bound>0&&bound<=1?'reporting_syntactically_valid':'source_pvalue_not_validated';
 return {difference,groupMeans:{raw:a,inference:b},reported_t:t,
    pValueStatus,pValueVerified:false,respondentDataVerified:false,
    regressionReplicated:false,respondentClusteringVerified:false,
    label:'author_reported_and_arithmetic_only'};
}
