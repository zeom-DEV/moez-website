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
 assert.equal(await page.locator('.mt-orbit-showcase').count(),1,size.name+': six offers are presented in one cinematic carousel');
 assert.equal(await page.locator('.flagship-hero').count(),0,size.name+': former white hero is gone');
 assert.equal(await page.locator('.flagship-link').count(),0,size.name+': former redundant discover button is removed');
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
 const heroTop=await page.locator('#kinetic-showcase').evaluate(el=>el.getBoundingClientRect().top);
 assert(heroTop>=-10&&heroTop<350,size.name+': real carousel is now the first section ('+heroTop+')');
 assert.equal(await page.locator('.offer-detail.is-active').getAttribute('id'),'solution-web',size.name+': flagship first');
 if(size.width<=800){
  const layout=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,innerWidth:innerWidth}));
  assert(layout.scrollWidth<=layout.innerWidth+4,size.name+': horizontal overflow '+JSON.stringify(layout));
  await page.locator('#menu-button').click();
  assert.equal(await page.locator('#menu-button').getAttribute('aria-expanded'),'true');
  await page.locator('#menu-button').click();
 }
 // The primary discovery CTA exposes six photographic cards, not a second text list.
 await page.screenshot({path:'reports/home-'+size.name+'.png'});
 // The selected reference is the photographic React + framer-motion 3D carousel.
 const orbit=page.locator('.mt-orbit-showcase');
 await orbit.scrollIntoViewIfNeeded();
 await orbit.locator('.orbit-hero__card').first().waitFor({state:'visible',timeout:25000});
 assert.equal(await orbit.locator('.orbit-hero__card').count(),6,size.name+': six genuine photographic carousel cards');
 assert.equal(await orbit.locator('.mt-orbit__quicknav button').count(),6,size.name+': six direct choices');
 assert.equal(await page.locator('.works-wheel').isHidden(),true,size.name+': repeated wheel replaced');
 assert.equal(await page.locator('.solutions-overview').count(),0,size.name+': old service index removed with white hero');
 await orbit.locator('.mt-orbit__pause').click();
 await orbit.locator('.mt-orbit__quicknav button').last().click();
 await page.waitForFunction(()=>document.querySelector('.mt-orbit__current strong')?.textContent==='Automatisation');
 assert.equal(await orbit.locator('.mt-orbit__quicknav button').last().getAttribute('aria-pressed'),'true',size.name+': selecting a photo updates current service');
 assert.equal(await page.locator('.mt-signal').count(),0,size.name+': choosing an offer does not cover the carousel with a popup');
 await orbit.locator('.mt-orbit__explore').click();
 await page.locator('#solution-automation.is-active').waitFor({state:'visible'});
 assert.equal(await page.locator('.mt-signal').count(),0,size.name+': details show without covering popup');
 await page.screenshot({path:'reports/orbit-'+size.name+'.png'});
 const selectFromLink=async id=>page.evaluate(id=>document.querySelector('[data-offer-link="'+id+'"]').click(),id);
 await selectFromLink('web');

 assert.equal(await page.locator('[data-web-demo]').count(),0,size.name+': redundant three-step web mockup completely removed');
 // The original site retains the film, 3D carousel, service details and contact flow, without the redundant mockup.
 assert.equal(await page.locator('.works-wheel').isHidden(),true,size.name+': second carousel removed');
 await orbit.locator('.mt-orbit__quicknav button').last().click();
 await orbit.locator('.mt-orbit__explore').click();
 await page.locator('#solution-automation.is-active').waitFor({state:'visible'});
 await page.locator('#solution-automation [data-journey-brief]').click();
 assert.equal(await page.locator('#brief-service').inputValue(),'Automatisation des workflows',size.name+': selected service reaches the existing contact form');
 assert.equal(await page.locator('.mt-signal').count(),0,size.name+': contact CTA does not create a popup');
 await selectFromLink('web');
 const documentsBefore=await page.evaluate(()=>performance.getEntriesByType('navigation').length);
 for(const [key,file] of routes){
  await selectFromLink(key);
  await page.locator('#solution-'+key+'.is-active').waitFor({state:'visible'});
  assert.equal(await page.locator('.offer-detail.is-active').count(),1,size.name+': only selected service');
  assert(await page.locator('#solution-'+key+' .offer-detail__conversion a[href^="https://calendly.com/"]').count()>0,size.name+': CTA for '+key);
  assert.equal(await page.locator('#solution-'+key).getAttribute('aria-hidden'),'false',size.name+': chosen offer is exposed to assistive technology');
  assert(await page.locator('#solution-'+key+' h2').count()>0,size.name+': chosen offer retains its detailed heading');
  assert(await page.locator('.offer-detail:not(.is-active)').evaluateAll(els=>els.every(el=>el.inert)),size.name+': inactive offers excluded from focus');
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+4),size.name+': no overflow in '+key);
  await page.locator('#solution-'+key+' .offer-detail__back').click();
  assert.equal(await page.locator('.offer-detail.is-active').getAttribute('id'),'solution-web','web stays first');
 }
 assert.equal(await page.evaluate(()=>performance.getEntriesByType('navigation').length),documentsBefore,size.name+': no navigation when switching offers');
 await selectFromLink('web');
 await orbit.locator('.mt-orbit__quicknav button').first().click();
 await orbit.locator('.mt-orbit__nav').first().click();
 await page.waitForFunction(()=>document.querySelector('.mt-orbit__current strong')?.textContent==='Automatisation');
 assert.equal(await orbit.locator('.mt-orbit__current strong').textContent(),'Automatisation','3D carousel wraps backwards');
 await orbit.locator('.mt-orbit__nav').last().click();
 await page.waitForFunction(()=>document.querySelector('.mt-orbit__current strong')?.textContent==='Sites internet');
 assert.equal(await orbit.locator('.mt-orbit__current strong').textContent(),'Sites internet','3D carousel wraps forwards');
 await orbit.locator('.orbit-hero').focus();
 await page.keyboard.press('ArrowRight');
 await page.waitForFunction(()=>document.querySelector('.mt-orbit__current strong')?.textContent==='Service client');
 await page.keyboard.press('Home');
 await page.waitForFunction(()=>document.querySelector('.mt-orbit__current strong')?.textContent==='Sites internet');
 await orbit.locator('.mt-orbit__explore').click();
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
  await selectFromLink('web');
 }

 await page.locator('.offer-detail.is-active .offer-detail__other a[href="#solution-sav"]').click();
 assert.equal(await page.locator('.offer-detail.is-active').getAttribute('id'),'solution-sav');
 await page.goBack();
 assert.equal(await page.locator('.offer-detail.is-active').getAttribute('id'),'solution-web');
 if(await page.locator('#menu-button').isVisible()){await page.locator('#menu-button').click();await page.locator('#mobile-nav a[href="./#offres"]').click();}
 else await page.locator('.desktop-nav a[href="./#offres"]').click();
 assert.equal(await page.locator('.offer-detail.is-active').getAttribute('id'),'solution-web','navigation selects flagship');
 await selectFromLink('crm');
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
  await selectFromLink('web');
  const popupPromise=page.waitForEvent('popup');
  await page.locator('#solution-web [data-book]').click();
  const popup=await popupPromise;
  await popup.waitForURL(/^https:\/\/calendly\.com\//,{waitUntil:'domcontentloaded',timeout:30000});
  assert(popup.url().startsWith('https://calendly.com/'),'landscape booking opens full calendar');
  await popup.close();
 }
 if(size.name==='desktop'){
  await selectFromLink('web');
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
 await page.locator('#kinetic-showcase').scrollIntoViewIfNeeded();
 await page.locator('.orbit-hero__card').first().waitFor({state:'visible'});
 assert.equal(await page.locator('.works-wheel').isHidden(),true,'shared discovery URL presents the single cinematic carousel');
 assert.equal(await page.locator('#inversion-intro').isVisible(),false,'shared discovery URL bypasses intro');
 await page.goto(BASE+'/#solution-web',{waitUntil:'domcontentloaded'});
 assert.equal(await page.locator('#inversion-intro').isVisible(),false,'shared offer bypasses intro');
 assert.equal(await page.locator('.offer-detail.is-active').getAttribute('id'),'solution-web','shared offer shown');
 assert.deepEqual(errors,[],size.name+': uncaught JS exceptions');
 await page.screenshot({path:'reports/'+size.name+'.png',fullPage:true});
 console.log('PASS',size.name,'6 services, action-led 3D movement, guided contact, film, keyboard, history, direct links, demos, briefs and responsive layout');
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
