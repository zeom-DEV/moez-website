import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const BASE=process.env.QA_BASE_URL || 'http://127.0.0.1:8765';
const routes=[['sav','sav-ecommerce.html'],['avis','e-reputation.html'],['prospects','televente.html'],['crm','crm-reporting.html'],['web','site-signature.html']];
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
let failed=false;
try{
for(const size of [{name:'mobile',width:390,height:844},{name:'small-mobile',width:320,height:568},{name:'landscape',width:844,height:390},{name:'desktop',width:1365,height:900}]){
 const context=await browser.newContext({viewport:{width:size.width,height:size.height},isMobile:size.name!=='desktop',hasTouch:size.name!=='desktop',reducedMotion:size.name==='small-mobile'?'reduce':'no-preference',serviceWorkers:'block'});
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
 assert(await page.locator('#site-shell').evaluate(el=>el.inert),size.name+': background blocked during film');
 await page.keyboard.press('Shift+Tab');
 assert(await page.locator('.moez-film__skip').evaluate(el=>el===document.activeElement),size.name+': film keyboard focus wraps');
 if(size.name==='desktop'){
  await page.waitForFunction(()=>{const v=document.querySelector('.moez-film video');return v&&!v.paused&&v.currentTime>0;});
  assert.equal(await page.locator('.moez-film video').evaluate(v=>v.muted),false,'film sound enabled after click');
  await page.locator('[data-film-sound]').click();
  assert.equal(await page.locator('.moez-film video').evaluate(v=>v.muted),true,'mute film');
  await page.locator('[data-film-sound]').click();
  await page.locator('[data-film-end].is-visible').waitFor({state:'visible',timeout:30000});
  await page.locator('[data-film-discover]').click();
 }else{await page.keyboard.press('Escape');}
 await page.locator('.moez-film.is-active').waitFor({state:'hidden'});
 assert.equal(await page.locator('#inversion-intro').isVisible(),false,size.name+': intro dismissed');
 await page.locator('#offers-five-title').waitFor({state:'visible'});
 if(size.width<=800){
  const layout=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,innerWidth:innerWidth}));
  assert(layout.scrollWidth <= layout.innerWidth+4,size.name+': horizontal overflow '+JSON.stringify(layout));
  await page.locator('#menu-button').click();
  assert.equal(await page.locator('#menu-button').getAttribute('aria-expanded'),'true');
  await page.locator('#menu-button').click();
 }
 const documentsBefore=await page.evaluate(()=>performance.getEntriesByType('navigation').length);
 for(const [key,file] of routes){
  await page.locator('[data-offer-link="'+key+'"]').click();
  await page.locator('#solution-'+key+'.is-active').waitFor({state:'visible'});
  assert.equal(await page.locator('.offer-detail.is-active').count(),1,size.name+': only selected service');
  assert(await page.locator('#solution-'+key+' .offer-detail__conversion a[href^="https://calendly.com/"]').count()>0,size.name+': CTA for '+key);
  const position=await page.locator('#solution-'+key).evaluate(el=>el.getBoundingClientRect().top);
  assert(position>=0&&position<180,size.name+': selected offer immediately in view '+position);
  await page.locator('#solution-'+key+' .offer-detail__back').click();
  await page.locator('#solution-'+key+'.is-active').waitFor({state:'hidden'});
 }
 assert.equal(await page.evaluate(()=>performance.getEntriesByType('navigation').length),documentsBefore,size.name+': no navigation when switching offers');
 await page.locator('[data-offer-link="web"]').click();
 await page.locator('.offer-detail.is-active .offer-detail__other a[href="#solution-sav"]').click();
 assert.equal(await page.locator('.offer-detail.is-active').getAttribute('id'),'solution-sav');
 await page.goBack();
 assert.equal(await page.locator('.offer-detail.is-active').getAttribute('id'),'solution-web');
 if(await page.locator('#menu-button').isVisible()){await page.locator('#menu-button').click();await page.locator('#mobile-nav a[href="./#offres"]').click();}
 else await page.locator('.desktop-nav a[href="./#offres"]').click();
 assert.equal(await page.locator('.offer-detail.is-active').count(),0,'navigation closes offer');
 await page.locator('#brief-form').scrollIntoViewIfNeeded();
 await page.locator('#brief-service').selectOption('Création de sites web');
 await page.locator('#brief-form button[type="submit"]').click();
 await page.locator('#brief-result').waitFor({state:'visible'});
 assert((await page.locator('#brief-send').getAttribute('href')).startsWith('mailto:'),size.name+': contact action');
 assert((await page.locator('#brief-output').inputValue()).includes('Création de sites web'),'web brief');
 await page.locator('#brief-copy').click();
 await page.waitForFunction(()=>/Copié|Sélectionné/.test(document.getElementById('brief-copy').textContent));
 for(const [key,file] of routes){
  await page.goto(BASE+'/'+file,{waitUntil:'domcontentloaded'});
  assert.equal(await page.locator('h1').count(),1,size.name+': heading '+file);
  assert(await page.locator('a[href^="https://calendly.com/"]').count()>0,size.name+': booking '+file);
  assert(await page.locator('a[href="./#offres"]').count()>0,size.name+': offers return '+file);
  assert(await page.locator('a[href^="https://calendly.com/"]').count()>0,size.name+': booking call to action '+file);
  for(let step=0;step<3;step++){
   await page.locator('[data-demo-step]').nth(step).click();
   assert.equal(await page.locator('[data-demo-step]').nth(step).getAttribute('aria-pressed'),'true',file+': interactive step');
  }
  if(size.width<=800){
   const layout=await page.evaluate(()=>({w:document.documentElement.scrollWidth,v:innerWidth}));
   assert(layout.w<=layout.v+4,file+': horizontal scroll '+layout.w+' > '+layout.v);
  }
  await page.locator('.breadcrumbs a[href="./#offres"]').click();
  await page.waitForURL(BASE+'/#offres',{waitUntil:'domcontentloaded'});
  await page.locator('#inversion-intro').waitFor({state:'hidden'});
 }
 await page.goto(BASE+'/#solution-web',{waitUntil:'domcontentloaded'});
 assert.equal(await page.locator('#inversion-intro').isVisible(),false,'shared offer bypasses intro');
 assert.equal(await page.locator('.offer-detail.is-active').getAttribute('id'),'solution-web','shared offer shown');
 assert.deepEqual(errors,[],size.name+': uncaught JS exceptions');
 console.log('PASS',size.name,'5 services, film, keyboard, history, direct links, demos, web brief/copy, responsive layout and scripts');
 await context.close();
}
}catch(error){failed=true;console.error('BROWSER_QA_FAILURE',error.stack || error);}
finally{await browser.close();}
if(failed)process.exit(1);
