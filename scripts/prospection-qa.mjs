import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const origin='http://127.0.0.1:8765';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const services=['site-signature.html','sav-ecommerce.html','e-reputation.html','televente.html','crm-reporting.html','automatisation-workflows.html'];
try{
 for(const screen of [{name:'mobile',width:390,height:844},{name:'small-mobile',width:320,height:640},{name:'desktop',width:1440,height:900}]){
  const ctx=await browser.newContext({viewport:screen,isMobile:screen.name!=='desktop',hasTouch:screen.name!=='desktop'});
  const page=await ctx.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(origin+'/#solutions',{waitUntil:'load'});
  await page.waitForFunction(()=>!document.body.classList.contains('is-intro'));
  assert.equal(await page.locator('.quick-services a').count(),6,'six links '+screen.name);
  assert.equal(await page.locator('#cards .offer-card').count(),6,'six animated cards '+screen.name);
  assert(await page.locator('.quick-services a').first().isVisible(),'direct service link visible');
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
  assert(overflow<=4,'horizontal overflow '+screen.name+': '+overflow);
  for(const p of services){const response=await page.request.get(origin+'/'+p);assert.equal(response.status(),200,p);}
  await page.goto(origin+'/#solution-automation');
  await page.waitForFunction(()=>!document.body.classList.contains('is-intro'));
  assert.equal(await page.locator('#detail').isVisible(),true,'deep link detail '+screen.name);
  assert((await page.locator('#detail-action').getAttribute('href')).startsWith('https://calendly.com/'),'booking CTA');
  await page.goto(origin+'/');
  await page.locator('#intro-direct').click();
  assert.equal(await page.locator('body.is-intro').count(),0,'skips intro '+screen.name);
  assert.equal(await page.locator('#site').evaluate(el=>el.inert),false,'site unlocked');
  await page.goto(origin+'/');
  await page.locator('#intro-turn').click();
  await page.locator('#film-exit').click();
  assert.equal(await page.locator('body.is-film').count(),0,'film can be skipped');
  assert.equal(await page.locator('#site').evaluate(el=>el.inert),false,'site accessible after film');
  assert.deepEqual(errors,[],'JS errors '+screen.name);
  console.log('PASS',screen.name);
  await ctx.close();
 }
 console.log('PROSPECTION QA PASSED');
}finally{await browser.close();}
