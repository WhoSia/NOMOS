// Structural bibliography quality control: no PDF byte, legal merit, or statistical validation.
export function verifyCustody(manifest){
 if(!Array.isArray(manifest?.items)||!manifest?.targets)throw Error('manifest required');
 const ids=new Set(), problems=[];
 for(const item of manifest.items){
  if(ids.has(item.id))problems.push({ref:item.ref,issue:'duplicate_file_id'});
  ids.add(item.id);
  if(!item.id||!item.kind)problems.push({ref:item.ref,issue:'missing_metadata'});
  const expected=item.kind==='phd_thesis'?manifest.targets.sources.id:manifest.targets.papers.id;
  if(item.final_parent!==expected)problems.push({ref:item.ref,issue:'genre_wrong_folder'});
  if(item.kind==='phd_thesis' && item.publication_year!==2022)problems.push({ref:item.ref,issue:'thesis_year_mismatch'});
 }
 return {files:manifest.items.length,problems,verifiedMetadata:manifest.move_verified_by_connector_parent_readback===true,verifiedByteHash:manifest.source_byte_sha256_verified===true};
}
