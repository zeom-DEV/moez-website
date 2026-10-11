import {execFileSync} from 'node:child_process';
import {mkdirSync,readFileSync} from 'node:fs';
const base=process.env.QA_BASE_URL||'http://127.0.0.1:8765';
mkdirSync('reports',{recursive:true});
for(const [name,path] of [['offers','/#offres'],['website','/site-signature.html']]){
 for(const form of ['mobile','desktop']){
  const output='reports/lighthouse-'+name+'-'+form+'.json';
  const args=[base+path,'--chrome-flags=--headless --no-sandbox','--only-categories=performance,accessibility,best-practices,seo','--output=json','--output-path='+output,'--quiet'];
  if(form==='desktop')args.push('--preset=desktop');
  execFileSync('/tmp/node_modules/.bin/lighthouse',args,{stdio:'inherit',timeout:120000});
  const report=JSON.parse(readFileSync(output));
  if(report.runtimeError)throw Error(report.runtimeError.message);
  console.log('LIGHTHOUSE',name,form,JSON.stringify(Object.fromEntries(Object.entries(report.categories).map(([key,value])=>[key,Math.round(value.score*100)]))),JSON.stringify(Object.fromEntries(['largest-contentful-paint','cumulative-layout-shift','total-blocking-time'].map(key=>[key,report.audits[key].displayValue]))));
  const issues=Object.values(report.audits).filter(a=>a.score!==null&&a.score<1&&a.details?.items?.length).map(a=>({id:a.id,title:a.title,items:a.details.items.slice(0,3)}));
  console.log('LIGHTHOUSE_ISSUES',name,form,JSON.stringify(issues));
  if(report.categories.performance.score===null||report.categories.performance.score<.9)throw Error(name+' '+form+': performance below 90');
 }
}
