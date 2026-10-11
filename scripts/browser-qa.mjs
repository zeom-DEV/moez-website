import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const BASE='http://127.0.0.1:8765';
const routes=[['sav','sav-ecommerce.html'],['avis','e-reputation.html'],['prospects','televente.html'],['crm','crm-reporting.html'],['web','site-signature.html']];
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
let failed=false;
try{
for(const size of [{name:'mobile',width:390,height:844},{name:'desktop',width:1365,height:900}]){
 const context=await browser.newContext({viewport:{width:size.width,height:size.height},isMobile:size.name==='mobile',hasTouch:size.name==='mobile',reducedMotion:'reduce',serviceWorkers:'block'});
 await context.route(/fonts\.googleapis\.com|fonts\.gstatic\.com/,r=>r.abort());
 const page=await context.newPage();
 const errors=[];
 page.on('pageerror',err=>errors.push(err.message));
 page.setDefaultTimeout(15000);
 await page.goto(BASE+'/',{waitUntil:'domcontentloaded'});
 assert.equal(await page.locator('[data-offer-link]').count(),5,size.name+': services');
 assert.equal(await page.locator('#inversion-intro').isVisible(),true,size.name+': introductory experience');
 await page.locator('#intro-flip').click();
 await page.locator('.moez-film.is-active').waitFor({state:'visible'});
 await page.locator('.moez-film__skip').click();
 await page.locator('.moez-film.is-active').waitFor({state:'hidden'});
 assert.equal(await page.locator('#inversion-intro').isVisible(),false,size.name+': intro dismissed');
 await page.locator('#offers-five-title').waitFor({state:'visible'});
 if(size.name==='mobile'){
  const layout=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,innerWidth:innerWidth}));
  assert(layout.scrollWidth <= layout.innerWidth+4,size.name+': horizontal overflow '+JSON.stringify(layout));
  await page.locator('#menu-button').click();
  assert.equal(await page.locator('#menu-button').getAttribute('aria-expanded'),'true');
  await page.locator('#menu-button').click();
 }
 for(const [key,file] of routes){
  await page.locator('[data-offer-link="'+key+'"]').click();
  await page.locator('#solution-'+key+'.is-active').waitFor({state:'visible'});
  assert.equal(await page.locator('.offer-detail.is-active').count(),1,size.name+': only selected service');
  assert(await page.locator('#solution-'+key+' .offer-detail__conversion a[href^="https://calendly.com/"]').count()>0,size.name+': CTA for '+key);
  await page.locator('#solution-'+key+' .offer-detail__back').click();
  await page.locator('#solution-'+key+'.is-active').waitFor({state:'hidden'});
 }
 await page.locator('#brief-form').scrollIntoViewIfNeeded();
 await page.locator('#brief-form button[type="submit"]').click();
 await page.locator('#brief-result').waitFor({state:'visible'});
 assert((await page.locator('#brief-send').getAttribute('href')).startsWith('mailto:'),size.name+': contact action');
 for(const [key,file] of routes){
  await page.goto(BASE+'/'+file,{waitUntil:'domcontentloaded'});
  assert.equal(await page.locator('h1').count(),1,size.name+': heading '+file);
  assert(await page.locator('a[href^="https://calendly.com/"]').count()>0,size.name+': booking '+file);
  assert(await page.locator('a[href="./#offres"]').count()>0,size.name+': offers return '+file);
  assert(await page.locator('a[href^="https://calendly.com/"]').count()>0,size.name+': booking call to action '+file);
  if(size.name==='mobile'){
   const layout=await page.evaluate(()=>({w:document.documentElement.scrollWidth,v:innerWidth}));
   assert(layout.w<=layout.v+4,file+': horizontal scroll '+layout.w+' > '+layout.v);
  }
 }
 assert.deepEqual(errors,[],size.name+': uncaught JS exceptions');
 console.log('PASS',size.name,'5 services, film skip, navigation, booking links, form, responsiveness and scripts');
 await context.close();
}
}catch(error){failed=true;console.error('BROWSER_QA_FAILURE',error.stack || error);}
finally{await browser.close();}
if(failed)process.exit(1);
