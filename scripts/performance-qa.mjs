import {execFileSync} from 'node:child_process';
import {mkdirSync,readFileSync} from 'node:fs';
const base=process.env.QA_BASE_URL||'http://127.0.0.1:8765';
mkdirSync('reports',{recursive:true});
for(const [name,path] of [['intro','/'],['offers','/#offres'],['wheel','/#services-carousel'],['website','/site-signature.html'],['automation','/automatisation-workflows.html'],['sav','/sav-ecommerce.html'],['avis','/e-reputation.html'],['prospects','/televente.html'],['crm','/crm-reporting.html']]){
 for(const form of (['intro','offers','wheel','website'].includes(name)?['mobile','desktop']:['mobile'])){
  const output='reports/lighthouse-'+name+'-'+form+'.json';
  const args=[base+path,'--chrome-flags=--headless --no-sandbox','--only-categories=performance,accessibility,best-practices,seo','--output=json','--output-path='+output,'--quiet'];
  if(form==='desktop')args.push('--preset=desktop');
  execFileSync('/tmp/node_modules/.bin/lighthouse',args,{stdio:'inherit',timeout:120000});
  const report=JSON.parse(readFileSync(output));
  if(report.runtimeError)throw Error(report.runtimeError.message);
  console.log('LIGHTHOUSE',name,form,JSON.stringify(Object.fromEntries(Object.entries(report.categories).map(([key,value])=>[key,Math.round(value.score*100)]))),JSON.stringify(Object.fromEntries(['largest-contentful-paint','cumulative-layout-shift','total-blocking-time'].map(key=>[key,report.audits[key].displayValue]))));
  const issues=Object.values(report.audits).filter(a=>a.score!==null&&a.score<1&&a.details?.items?.length).map(a=>({id:a.id,title:a.title,items:a.details.items.slice(0,3)}));
  console.log('LIGHTHOUSE_ISSUES',name,form,JSON.stringify(issues.map(issue=>({id:issue.id,title:issue.title,items:issue.items.map(item=>({selector:item.node?.selector,explanation:item.node?.explanation,description:item.description,url:item.url}))}))));
  if(name!=='intro'&&report.categories.accessibility.score<1)throw Error(name+' '+form+': accessibility audit needs correction');
  if(name!=='intro'&&(report.categories.performance.score===null||report.categories.performance.score<.9))throw Error(name+' '+form+': performance below 90');
 }
}

