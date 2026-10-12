import {chromium} from 'playwright';
import {mkdirSync} from 'node:fs';
const base=process.env.QA_BASE_URL||'http://127.0.0.1:8765';
mkdirSync('reports/orbit',{recursive:true});
const check=(condition,label)=>{if(!condition)throw Error('FAIL '+label);console.log('PASS '+label)};
let browser;
try{
 browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 for(const [name,opt] of [
  ['desktop',{viewport:{width:1440,height:900}}],
  ['mobile',{viewport:{width:390,height:844},isMobile:true,hasTouch:true}],
  ['small-mobile',{viewport:{width:360,height:740},isMobile:true,hasTouch:true}],
  ['landscape',{viewport:{width:844,height:390},isMobile:true,hasTouch:true}]
 ]){
  const context=await browser.newContext(opt),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/#offres',{waitUntil:'domcontentloaded'});
  await page.locator('.orbit-hero__card').first().waitFor({state:'visible',timeout:20000});
  check(await page.locator('.orbit-hero__card').count()===6,name+' uses original React six-image physics carousel');
  check(await page.locator('#solution-web').count()===1&&await page.locator('.offer-detail').count()===6,name+' original six detailed services retained');
  check(await page.locator('.mt-orbit__quicknav button').count()===6,name+' one directly usable illustrated selector');
  check(await page.locator('.works-wheel').isHidden(),name+' old repeated wheel hidden');
  check(await page.locator('.solutions-overview').isHidden(),name+' repeated service list hidden only after successful React mount');
  check(await page.locator('.web-demo').isVisible(),name+' original web creation interactive demo preserved');
  check(await page.locator('.mt-orbit__pause').count()===1,name+' visitor has actual autoplay control');
  await page.locator('.mt-orbit__pause').click();
  await page.locator('.mt-orbit__quicknav button').last().click();
  await page.locator('.mt-orbit__quicknav button').last().waitFor({state:'visible'});
  check((await page.locator('.mt-orbit__quicknav button').last().getAttribute('aria-pressed'))==='true',name+' direct selection updates actual orbit');
  await page.locator('.mt-signal.is-visible').waitFor({state:'visible'});
  check((await page.locator('[data-signal-copy]').innerText()).includes('workflow'),name+' photo selection triggers useful non-fabricated notification');
  await page.screenshot({path:'reports/orbit/'+name+'-hero.png',animations:'disabled'});
  await page.locator('[data-signal-action]').click();
  await page.locator('#solution-automation.is-active').waitFor({state:'visible'});
  check(await page.locator('#brief-service').inputValue()==='Automatisation des workflows',name+' detailed offer prefills original form');
  await page.locator('#solution-automation [data-journey-brief]').click();
  await page.locator('#brief-message').fill('Je souhaite automatiser les demandes depuis mon site.');
  await page.locator('#brief-form button[type="submit"]').click();
  await page.locator('#brief-result').waitFor({state:'visible'});
  check((await page.locator('#brief-output').inputValue()).includes('Je souhaite automatiser'),name+' real request message generated without sending');
  check(!errors.length,name+' no JavaScript exceptions '+errors.join('|'));
  const dims=await page.evaluate(()=>({w:innerWidth,scroll:document.documentElement.scrollWidth}));
  check(dims.scroll<=dims.w+3,name+' no horizontal overflow '+JSON.stringify(dims));
  await context.close();
 }
 const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'}),page=await context.newPage();
 await page.goto(base+'/#offres',{waitUntil:'domcontentloaded'});
 await page.locator('.mt-orbit__quicknav button').last().click();
 check(await page.locator('.mt-orbit__quicknav button').last().getAttribute('aria-pressed')==='true','reduced-motion carousel remains usable');
 await context.close();
 console.log('ALL INTEGRATED CINEMATIC CAROUSEL TESTS PASSED');
}catch(error){console.error(error);process.exitCode=1;}finally{await browser?.close();}
