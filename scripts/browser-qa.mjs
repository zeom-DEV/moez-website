import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const BASE=process.env.QA_BASE_URL || 'http://127.0.0.1:8765';
const routes=[['sav','sav-ecommerce.html'],['avis','e-reputation.html'],['prospects','televente.html'],['crm','crm-reporting.html'],['web','site-signature.html']];
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox']});
let failed=false;
await (await import('node:fs/promises')).mkdir('reports',{recursive:true});
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
  try{await page.waitForFunction(()=>{const v=document.querySelector('.moez-film video');return v&&!v.paused&&v.currentTime>0;});}catch(error){console.error('FILM_DIAGNOSTIC',await page.locator('.moez-film video').evaluate(v=>({paused:v.paused,time:v.currentTime,duration:v.duration,ready:v.readyState,error:v.error?.message,codec:v.canPlayType('video/mp4; codecs="avc1.42E01E"')})));throw error;}
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
 await page.screenshot({path:'reports/home-'+size.name+'.png'});
 for(let step=0;step<3;step++){
  await page.locator('[data-web-stage]').nth(step).click();
  assert.equal(await page.locator('[data-web-stage]').nth(step).getAttribute('aria-pressed'),'true','web creation stages');
 }
 const documentsBefore=await page.evaluate(()=>performance.getEntriesByType('navigation').length);
 for(const [key,file] of routes){
  await page.locator('[data-offer-link="'+key+'"]').click();
  await page.locator('#solution-'+key+'.is-active').waitFor({state:'visible'});
  assert.equal(await page.locator('.offer-detail.is-active').count(),1,size.name+': only selected service');
  assert(await page.locator('#solution-'+key+' .offer-detail__conversion a[href^="https://calendly.com/"]').count()>0,size.name+': CTA for '+key);
  const position=await page.locator('#services-carousel').evaluate(el=>el.getBoundingClientRect().top);
  assert(position>=0&&position<180,size.name+': selected offer immediately in view '+position);
  assert(await page.locator('.offer-detail:not(.is-active)').evaluateAll(els=>els.every(el=>el.inert)),size.name+': inactive offers excluded from focus');
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+4),size.name+': no overflow in '+key);
  await page.locator('#solution-'+key+' .offer-detail__back').click();
  assert.equal(await page.locator('.offer-detail.is-active').getAttribute('id'),'solution-web','web stays first');
 }
 assert.equal(await page.evaluate(()=>performance.getEntriesByType('navigation').length),documentsBefore,size.name+': no navigation when switching offers');
 await page.locator('[data-offer-link="web"]').click();
 await page.locator('[data-carousel-prev]').click();
 assert.equal(await page.locator('.offer-detail.is-active').getAttribute('id'),'solution-crm','carousel wraps backwards');
 await page.locator('[data-carousel-next]').click();
 assert.equal(await page.locator('.offer-detail.is-active').getAttribute('id'),'solution-web','carousel wraps forwards');
 await page.locator('[data-offer-link="web"]').focus();
 await page.keyboard.press('ArrowRight');
 assert.equal(await page.locator('.offer-detail.is-active').getAttribute('id'),'solution-sav','keyboard selection');
 await page.keyboard.press('Home');
 assert.equal(await page.locator('.offer-detail.is-active').getAttribute('id'),'solution-web','keyboard Home');
 if(size.name==='mobile'){
  const graphic=page.locator('#solution-web .offer-graphic');
  await graphic.scrollIntoViewIfNeeded();
  const rect=await graphic.boundingBox();
  const cdp=await context.newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:rect.x+rect.width-25,y:rect.y+50}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:rect.x+25,y:rect.y+50}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  assert.equal(await page.locator('.offer-detail.is-active').getAttribute('id'),'solution-sav','real mobile swipe');
  await cdp.detach();
  await page.locator('[data-offer-link="web"]').click();
 }

 await page.locator('.offer-detail.is-active .offer-detail__other a[href="#solution-sav"]').click();
 assert.equal(await page.locator('.offer-detail.is-active').getAttribute('id'),'solution-sav');
 await page.goBack();
 assert.equal(await page.locator('.offer-detail.is-active').getAttribute('id'),'solution-web');
 if(await page.locator('#menu-button').isVisible()){await page.locator('#menu-button').click();await page.locator('#mobile-nav a[href="./#offres"]').click();}
 else await page.locator('.desktop-nav a[href="./#offres"]').click();
 assert.equal(await page.locator('.offer-detail.is-active').getAttribute('id'),'solution-web','navigation selects flagship');
 await page.locator('#brief-form').scrollIntoViewIfNeeded();
 await page.locator('#brief-service').selectOption('Création de sites web');
 await page.locator('#brief-form button[type="submit"]').click();
 await page.locator('#brief-result').waitFor({state:'visible'});
 assert((await page.locator('#brief-send').getAttribute('href')).startsWith('mailto:'),size.name+': contact action');
 assert((await page.locator('#brief-output').inputValue()).includes('Création de sites web'),'web brief');
 await page.locator('#brief-copy').click();
 await page.waitForFunction(()=>/Copié|Sélectionné/.test(document.getElementById('brief-copy').textContent));
 if(size.name==='desktop'){
  await page.locator('[data-offer-link="web"]').click();
  const book=page.locator('#solution-web [data-book]');
  await book.click();
  await page.locator('#booking-dialog').waitFor({state:'visible'});
  await page.keyboard.press('Escape');
  assert(await book.evaluate(el=>el===document.activeElement),'booking focus restored');
 }
 for(const [key,file] of routes){
  await page.goto(BASE+'/'+file,{waitUntil:'domcontentloaded'});
  assert.equal(await page.locator('h1').count(),1,size.name+': heading '+file);
  await page.screenshot({path:'reports/'+key+'-'+size.name+'.png'});
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
 await page.screenshot({path:'reports/'+size.name+'.png',fullPage:true});
 console.log('PASS',size.name,'5 services, film, keyboard, history, direct links, demos, web brief/copy, responsive layout and scripts');
 await context.close();
}
const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
const fallback=await nojs.newPage();
await fallback.goto(BASE+'/#offres');
assert.equal(await fallback.locator('.offer-detail:visible').count(),5,'all offers usable without JS');
assert.equal(await fallback.locator('.offer-detail[aria-hidden="true"]').count(),0,'no-JS accessible offers');
assert.equal(await fallback.locator('#inversion-intro').isVisible(),false,'no-JS intro bypass');
await nojs.close();
console.log('PASS no-JS fallback');
}catch(error){failed=true;console.error('BROWSER_QA_FAILURE',error.stack || error);}
finally{await browser.close();}
if(failed)process.exit(1);
