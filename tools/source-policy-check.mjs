#!/usr/bin/env node
/* Research citation allowlist: exact institutional hosts, no user-edited/transcribed
 * sites, and no evidence upgrade from an academic bibliography to a primary record.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
const src=fs.readFileSync(new URL("../research/source_evidence_catalog_1432_1449.csv",import.meta.url),"utf8").replace(/^\uFEFF/,"");
const allow=new Set([
 "sillok.history.go.kr","contents.history.go.kr","db.history.go.kr",
 "db.itkc.or.kr","encykorea.aks.ac.kr","kyu.snu.ac.kr",
 "nccur.lib.nccu.edu.tw","www.kci.go.kr"
]);
function csv(s){
 let records=[],row=[],field="",inQuote=false;
 for(let i=0;i<s.length;i++){
  const x=s[i];
  if(x==='"'){if(inQuote&&s[i+1]==='"'){field+='"';i++;}else inQuote=!inQuote;}
  else if(x===","&&!inQuote){row.push(field);field="";}
  else if((x==="\r"||x==="\n")&&!inQuote){
   if(x==="\r"&&s[i+1]==="\n")i++;
   row.push(field);if(row.some(Boolean))records.push(row);
   row=[];field="";
  }else field+=x;
 }
 assert.equal(inQuote,false,"unterminated CSV quote");
 if(field||row.length){row.push(field);records.push(row);}
 return records;
}
const [headers,...raw]=csv(src);
for(const h of ["record_id","source_url","claim_or_summary","verification_status","caveat"])assert.ok(headers.includes(h),h);
const data=raw.map(line=>Object.fromEntries(headers.map((h,i)=>[h,line[i]])));
assert.ok(data.length>=100,"Unexpected major deletion in evidence catalog");
assert.equal(new Set(data.map(x=>x.record_id)).size,data.length,"record_id not unique");
const banned=/ctext\.org|shidianguji\.com|wikisource\.org/i;
const academic=new Set(["nccur.lib.nccu.edu.tw","www.kci.go.kr"]);
for(const r of data){
 const host=new URL(r.source_url).hostname.toLowerCase();
 assert.ok(allow.has(host),r.record_id+": noninstitutional URL "+r.source_url);
 assert.ok(!banned.test(JSON.stringify(r)),r.record_id+": unofficial transcription embedded in CSV");
 assert.ok(r.claim_or_summary?.trim(),r.record_id+": empty claim/summary");
 assert.ok(r.caveat?.trim(),r.record_id+": missing caution note");
 if(academic.has(host) && r.internal_id==="")
   assert.notEqual(r.verification_status,"PRIMARY_DIRECT_VERIFIED",r.record_id+": academic reference mistaken for direct source");
}
console.log("Source policy passed:",data.length,"rows,",new Set(data.map(r=>r.source_url)).size,"unique institutional URLs");
