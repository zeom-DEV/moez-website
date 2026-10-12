import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const BASE=process.env.QA_BASE_URL || 'http://127.0.0.1:8765';
const routes=[['sav','sav-ecommerce.html'],['avis','e-reputation.html'],['prospects','televente.html'],['crm','crm-reporting.html'],['web','site-signature.html'],['automation','automatisation-workflows.html']];
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
 assert.equal(await page.locator('[data-offer-link]').count(),6,size.name+': services');
 assert.equal(await page.locator('.solutions-overview a').count(),6,size.name+': six immediately understandable solutions');
 assert.equal((await page.locator('.flagship-link').textContent()).replace('↘','').trim(),'Découvrir mes solutions',size.name+': single principal discovery CTA');
 assert.equal(await page.locator('#inversion-intro').isVisible(),true,size.name+': introductory experience');
 await page.locator('#intro-flip').click();
 await page.locator('.moez-film.is-active').waitFor({state:'visible'});
 assert(await page.locator('#site-shell').evaluate(el=>el.inert),size.name+': background blocked during film');
 await page.keyboard.press('Shift+Tab');
 assert(await page.locator('.moez-film__skip').evaluate(el=>el===document.activeElement),size.name+': film keyboard focus wraps');
 if(size.name==='desktop'){
  try{await page.waitForFunction(()=>{const v=document.querySelector('.moez-film video');return v&&!v.paused&&v.currentTime>0;});}catch(error){console.error('FILM_DIAGNOSTIC',await page.locator('.moez-film video').evaluate(v=>({paused:v.paused,time:v.currentTime,duration:v.duration,ready:v.readyState,error:v.error?.message})));throw error;}
  await page.locator('[data-film-sound]').click();
  assert.equal(await page.locator('.moez-film video').evaluate(v=>v.muted),true,'mute film');
  await page.locator('[data-film-sound]').click();
  await page.locator('[data-film-end].is-visible').waitFor({state:'visible',timeout:30000});
  await page.locator('[data-film-discover]').click();
 }else{await page.keyboard.press('Escape');}
 await page.locator('.moez-film.is-active').waitFor({state:'hidden'});
 await page.locator('#inversion-intro').waitFor({state:'hidden'});
 assert.equal(new URL(page.url()).hash,'#offres',size.name+': film lands on offer overview');
 const heroTop=await page.locator('#offers-five-title').evaluate(el=>el.getBoundingClientRect().top);
 assert(heroTop>=0&&heroTop<350,size.name+': flagship hero visible ('+heroTop+')');
 assert.equal(await page.locator('.offer-detail.is-active').getAttribute('id'),'solution-web',size.name+': flagship first');
 if(size.width<=800){
  const layout=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,innerWidth:innerWidth}));
  assert(layout.scrollWidth<=layout.innerWidth+4,size.name+': horizontal overflow '+JSON.stringify(layout));
  await page.locator('#menu-button').click();
  assert.equal(await page.locator('#menu-button').getAttribute('aria-expanded'),'true');
  await page.locator('#menu-button').click();
 }
 if(size.name==='mobile'||size.name==='desktop'){
  const overviewBottom=await page.locator('.solutions-overview').evaluate(el=>el.getBoundingClientRect().bottom);
  assert(overviewBottom<=size.height,size.name+': all six solutions visible in first screen ('+overviewBottom+')');
 }
 await page.screenshot({path:'reports/home-'+size.name+'.png'});
 // New six-card kinetic stage: actual interactions, synced copy and linked detail.
 const kinetic=page.locator('[data-kinetic-showcase]');
 assert.equal(await kinetic.locator('[data-kinetic-card]').count(),6,size.name+': six cinematic cards');
 await kinetic.scrollIntoViewIfNeeded();
 assert.equal(await kinetic.locator('[data-kinetic-title]').textContent(),'Sites internet',size.name+': flagship active first');
 await kinetic.locator('[data-kinetic-next]').click();
 await page.waitForFunction(()=>document.querySelector('[data-kinetic-title]').textContent==='Automatisation');
 assert.equal(await kinetic.locator('[data-kinetic-cta]').getAttribute('href'),'#solution-automation',size.name+': linked service CTA');
 assert.equal(await page.locator('.offer-detail.is-active').getAttribute('id'),'solution-automation',size.name+': 3D card synchronizes detail');
 await kinetic.locator('[data-kinetic-prev]').click();
 await page.waitForFunction(()=>document.querySelector('[data-kinetic-title]').textContent==='Sites internet');
 await page.waitForFunction(()=>document.querySelector('[data-kinetic-showcase]').dataset.kineticBusy==='false');
 const visiblePoint=await page.evaluate(()=>{
   const stage=document.querySelector('[data-kinetic-stage]');
   const target=stage.querySelector('[data-kinetic-card="automation"]');
   const a=stage.getBoundingClientRect(),b=target.getBoundingClientRect();
   const y=b.top+b.height*.5,hits=[];
   const left=Math.max(a.left+9,b.left+9),right=Math.min(a.right-9,b.right-9);
   for(let x=left;x<right;x+=4){
     if(document.elementFromPoint(x,y)?.closest('[data-kinetic-card]')===target)hits.push(x);
   }
   return hits.length>=6?{x:hits[Math.floor(hits.length/2)],y,width:hits[hits.length-1]-hits[0]}:null;
 });
 assert(visiblePoint&&visiblePoint.width>=20,size.name+': neighboring card needs a visible clickable edge');
 await page.mouse.click(visiblePoint.x,visiblePoint.y);
 await page.waitForFunction(()=>document.querySelector('[data-kinetic-title]').textContent==='Automatisation');
 await kinetic.locator('[data-kinetic-cta]').click();
 await page.locator('#solution-automation.is-active').waitFor({state:'visible'});
 await page.locator('[data-offer-link="web"]').click();
 await page.screenshot({path:'reports/kinetic-'+size.name+'.png'});

 for(let step=0;step<3;step++){
  await page.locator('[data-web-stage]').nth(step).click();
  assert.equal(await page.locator('[data-web-stage]').nth(step).getAttribute('aria-pressed'),'true','web creation stages');
 }
 // The reference's two distinct compositions must work with real input.
 const wheel=page.locator('[data-works-wheel]');
 const canvas=page.locator('[data-wheel-canvas]');
 await page.locator('[data-offer-link="web"]').click();
 await page.waitForFunction(()=>document.querySelector('[data-works-wheel]').dataset.wheelSettled==='true');
 if(size.name!=='small-mobile'){
  await page.locator('[data-wheel-reset]').click();
  await page.waitForFunction(()=>document.querySelector('[data-works-wheel]').dataset.wheelMode==='circle');
  const closedCard=await page.locator('[data-wheel-card="web"]').boundingBox();
  assert.equal(await page.locator('[data-wheel-card]').count(),6,'six illustrated wheel cards');
  await page.screenshot({path:'reports/wheel-circle-'+size.name+'.png'});
  if(size.name==='desktop'){
   await canvas.hover();
   await page.mouse.wheel(0,180);
   await page.mouse.wheel(0,180);
   await page.waitForFunction(()=>document.querySelector('[data-works-wheel]').dataset.wheelMode==='carousel');
   const openedCard=await page.locator('[data-wheel-card="web"]').boundingBox();
   assert(openedCard.width>closedCard.width*1.3,'wheel opens into a larger front card');
   const bounds=await canvas.boundingBox();
   await page.mouse.move(bounds.x+bounds.width/2,bounds.y+bounds.height/2+60);
   await page.mouse.down();
   await page.mouse.move(bounds.x+bounds.width/2,bounds.y+bounds.height/2-60,{steps:12});
   await page.mouse.up();
   await page.waitForFunction(()=>document.querySelector('.offer-detail.is-active').id==='solution-sav');
  }
 }
 await page.locator('[data-offer-link="automation"]').click();
 await page.waitForFunction(()=>document.querySelector('[data-works-wheel]').dataset.wheelSettled==='true');
 assert.equal(await wheel.getAttribute('data-wheel-mode'),'carousel','selected service opens the 3D drum');
 assert.equal(await page.locator('[data-wheel-title]').textContent(),'Automatisation','active wheel title');
 assert.equal(await page.locator('#brief-service').inputValue(),'Automatisation des workflows','contact form follows the service');
 await page.screenshot({path:'reports/wheel-open-'+size.name+'.png'});
 await page.locator('[data-wheel-details]').click();
 const detailTop=await page.locator('#solution-title-automation').evaluate(el=>el.getBoundingClientRect().top);
 assert(detailTop>=0&&detailTop<180,'wheel opens the readable service details');
 assert(await page.locator('#solution-title-automation').evaluate(el=>el===document.activeElement),'details receive keyboard focus');
 await page.locator('[data-offer-link="web"]').click();
 await page.waitForFunction(()=>document.querySelector('[data-works-wheel]').dataset.wheelSettled==='true');
 if(size.name==='mobile'){
  await canvas.scrollIntoViewIfNeeded();
  const rect=await canvas.boundingBox();
  const cdp=await context.newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:rect.x+rect.width/2+60,y:rect.y+rect.height/2}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:rect.x+rect.width/2-60,y:rect.y+rect.height/2}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await page.waitForFunction(()=>document.querySelector('.offer-detail.is-active').id==='solution-sav');
  await page.locator('[data-offer-link="web"]').click();
  await page.waitForFunction(()=>document.querySelector('[data-works-wheel]').dataset.wheelSettled==='true');
  await canvas.scrollIntoViewIfNeeded();
  const verticalRect=await canvas.boundingBox();
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:verticalRect.x+verticalRect.width/2,y:verticalRect.y+verticalRect.height/2+60}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:verticalRect.x+verticalRect.width/2,y:verticalRect.y+verticalRect.height/2-60}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await page.waitForFunction(()=>document.querySelector('.offer-detail.is-active').id==='solution-sav');
  const scrollBefore=await page.evaluate(()=>scrollY);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:8,y:650}]});
  for(const y of [550,450,350,250])await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:8,y}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await page.waitForFunction(before=>scrollY>before,scrollBefore);
  assert.equal(await page.locator('.offer-detail.is-active').getAttribute('id'),'solution-sav','page scroll outside the canvas preserves the selected service');
  await cdp.detach();
  await page.locator('[data-offer-link="web"]').click();
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
 assert.equal(await page.locator('.offer-detail.is-active').getAttribute('id'),'solution-automation','carousel wraps backwards');
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
 await page.locator('[data-offer-link="crm"]').click();
 const announcementBefore=await page.locator('[data-carousel-live]').textContent();
 for(const anchor of ['methode','contact']){
  if(await page.locator('#menu-button').isVisible()){
   await page.locator('#menu-button').click();
   await page.locator('#mobile-nav a[href="./#'+anchor+'"]').click();
  }else await page.locator('.desktop-nav a[href="./#'+anchor+'"]').click();
  await page.waitForFunction(id=>{const top=document.getElementById(id).getBoundingClientRect().top;return top>=0&&top<200;},anchor);
  assert.equal(await page.locator('.offer-detail.is-active').getAttribute('id'),'solution-crm','ordinary anchors retain selected service');
  assert(!(await page.locator('#solution-title-crm').evaluate(el=>el===document.activeElement)),anchor+': carousel does not steal focus');
  assert.equal(await page.locator('[data-carousel-live]').textContent(),announcementBefore,anchor+': no unrelated service announcement');
 }
 await page.locator('#brief-form').scrollIntoViewIfNeeded();
 await page.locator('#brief-service').selectOption('Automatisation des workflows');
 await page.locator('#brief-form button[type="submit"]').click();
 await page.locator('#brief-result').waitFor({state:'visible'});
 assert((await page.locator('#brief-output').inputValue()).includes('Automatisation des workflows'),'automation brief');
 await page.locator('#brief-service').selectOption('Création de sites web');
 await page.locator('#brief-form button[type="submit"]').click();
 await page.locator('#brief-result').waitFor({state:'visible'});
 assert((await page.locator('#brief-send').getAttribute('href')).startsWith('mailto:'),size.name+': contact action');
 assert((await page.locator('#brief-output').inputValue()).includes('Création de sites web'),'web brief');
 await page.locator('#brief-copy').click();
 await page.waitForFunction(()=>/Copié|Sélectionné/.test(document.getElementById('brief-copy').textContent));
 if(size.name==='landscape'){
  await page.locator('[data-offer-link="web"]').click();
  const popupPromise=page.waitForEvent('popup');
  await page.locator('#solution-web [data-book]').click();
  const popup=await popupPromise;
  await popup.waitForURL(/^https:\/\/calendly\.com\//,{waitUntil:'domcontentloaded',timeout:30000});
  assert(popup.url().startsWith('https://calendly.com/'),'landscape booking opens full calendar');
  await popup.close();
 }
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
 await page.goto(BASE+'/#services-carousel',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>document.querySelector('[data-works-wheel]').dataset.wheelSettled==='true');
 assert.equal(await page.locator('[data-works-wheel]').getAttribute('data-wheel-mode'),'carousel','shared discovery URL opens the drum');
 assert.equal(await page.locator('#inversion-intro').isVisible(),false,'shared discovery URL bypasses intro');
 await page.goto(BASE+'/#solution-web',{waitUntil:'domcontentloaded'});
 assert.equal(await page.locator('#inversion-intro').isVisible(),false,'shared offer bypasses intro');
 assert.equal(await page.locator('.offer-detail.is-active').getAttribute('id'),'solution-web','shared offer shown');
 assert.deepEqual(errors,[],size.name+': uncaught JS exceptions');
 await page.screenshot({path:'reports/'+size.name+'.png',fullPage:true});
 console.log('PASS',size.name,'6 services, 3D wheel, drag/swipe, film, keyboard, history, direct links, demos, web/automation brief and responsive layout');
 await context.close();
}
const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
const fallback=await nojs.newPage();
await fallback.goto(BASE+'/#offres');
assert.equal(await fallback.locator('.offer-detail:visible').count(),6,'all offers usable without JS');
assert.equal(await fallback.locator('.offer-detail[aria-hidden="true"]').count(),0,'no-JS accessible offers');
assert.equal(await fallback.locator('#inversion-intro').isVisible(),false,'no-JS intro bypass');
await nojs.close();
console.log('PASS no-JS fallback');
const shortcutContext=await browser.newContext({reducedMotion:'reduce'});
const shortcut=await shortcutContext.newPage();
await shortcut.goto(BASE+'/');
await shortcut.locator('#intro-flip').focus();
await shortcut.keyboard.press('Tab');
assert(await shortcut.locator('#intro-direct').evaluate(el=>el===document.activeElement),'intro shortcut reachable by keyboard');
await shortcut.keyboard.press('Tab');
assert(await shortcut.locator('#intro-flip').evaluate(el=>el===document.activeElement),'intro focus wraps');
await shortcut.locator('#intro-direct').click();
 assert.equal(await shortcut.locator('#inversion-intro').isVisible(),false,'direct film bypass dismisses the introduction');
 assert.equal(await shortcut.locator('.moez-film.is-active').count(),0,'no unwanted film after secondary shortcut');
 assert.equal(await shortcut.locator('.offer-detail.is-active').getAttribute('id'),'solution-web','direct shortcut opens flagship');
 const shortcutTop=await shortcut.locator('#offers-five-title').evaluate(el=>el.getBoundingClientRect().top);
 assert(shortcutTop>=0&&shortcutTop<350,'secondary shortcut lands on flagship overview');
 await shortcutContext.close();
console.log('PASS direct discovery and intro keyboard');
}catch(error){failed=true;console.error('BROWSER_QA_FAILURE',error.stack || error);}
finally{await browser.close();}
if(failed)process.exit(1);
