export function auditNotice(f) {
  if (!f || typeof f !== "object") throw Error("facts object required");
  const keys = ["qualifying_deletion_or_dispute_notation", "consumer_requested", "recipient_specifically_designated", "recipient_received_report_containing_item"];
  if (f.purpose === "employment") keys.push("within_2y");
  else if (f.purpose === "other") keys.push("within_6m");
  else return {trigger:"unknown",reason:"purpose missing or not modeled"};
  const v=keys.map(k => f[k]);
  if (v.some(x=>x!==null&&x!==undefined&&typeof x!=="boolean")) throw Error("invalid predicate");
  return {trigger:v.includes(false)?"not_triggered":v.every(x=>x===true)?"conditional_trigger_met":"unknown",
    note:"Synthetic trigger only; does not establish actual dispatch or receipt"};
}
