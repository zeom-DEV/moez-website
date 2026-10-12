import {chromium} from 'playwright';
import {mkdirSync} from 'node:fs';

const base=process.env.QA_BASE_URL||'http://127.0.0.1:8765';
mkdirSync('reports/journey',{recursive:true});
let browser;
const assert=(ok,name)=>{if(!ok)throw Error('FAIL '+name);console.log('PASS '+name);};
const sleep=(ms)=>new Promise(resolve=>setTimeout(resolve,ms));
async function ready(){
  for(let i=0;i<55;i++){try{const r=await fetch(base);if(r.ok)return;}catch{}await sleep(300);}
  throw Error('Preview server not ready');
}
try{
  await ready();
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  for(const [name,options] of [
    ['desktop',{viewport:{width:1440,height:900},deviceScaleFactor:1}],
    ['mobile',{viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true}],
    ['small-mobile',{viewport:{width:360,height:740},deviceScaleFactor:1,isMobile:true,hasTouch:true}]
  ]){
    const context=await browser.newContext(options),page=await context.newPage(),errors=[];
    page.on('pageerror',e=>errors.push(String(e)));
    const res=await page.goto(base+'/#offres',{waitUntil:'domcontentloaded'});
    await page.locator('.mt-journey-rail').waitFor({state:'visible'});
    assert(res.status()===200,name+' served existing homepage');
    assert(await page.locator('[data-kinetic-card]').count()===6,name+' six 3D offers remain');
    assert(await page.locator('.offer-detail').count()===6,name+' six original detail sections remain');
    assert(await page.locator('.works-wheel__canvas').isHidden(),name+' redundant second animation hidden');
    assert(await page.locator('[data-journey-rail] [data-journey-progress]').count()===3,name+' visible 3 step journey');
    if(name==='desktop'){
      const before=await page.locator('[data-kinetic-title]').innerText();
      await sleep(4600);
      assert(await page.locator('[data-kinetic-title]').innerText()===before,name+' cards do not autoplay without purpose');
    }
    await page.locator('[data-kinetic-next]').scrollIntoViewIfNeeded();
    await page.locator('[data-kinetic-next]').click();
    await page.locator('[data-kinetic-title]').getByText('Automatisation').waitFor();
    const headingLines=await page.locator('[data-kinetic-title]').evaluate(el=>{const style=getComputedStyle(el);return {height:el.getBoundingClientRect().height,lineHeight:parseFloat(style.lineHeight)}});
    assert(headingLines.height<=headingLines.lineHeight*1.3,name+' long service title stays on one intentional line '+JSON.stringify(headingLines));
    assert(await page.locator('.mt-signal').isVisible(),name+' contextual notification from real selection');
    assert((await page.locator('.mt-signal [data-signal-copy]').innerText()).includes('workflow'),name+' signal contains service-specific tangible result');
    await page.screenshot({path:'reports/journey/'+name+'-chosen.png',animations:'disabled',timeout:15000});
    await page.locator('.mt-signal [data-signal-action]').click();
    assert(await page.locator('#solution-automation').isVisible(),name+' selected service details shown');
    assert(await page.locator('[data-journey-rail]').getAttribute('data-step')==='2',name+' progress advances to explanation');
    assert(await page.locator('#solution-automation [data-journey-brief]').count()===1,name+' relevant CTA added to existing offer');
    await page.locator('#solution-automation [data-journey-brief]').click();
    assert(await page.locator('#brief-service').inputValue()==='Automatisation des workflows',name+' offer carries into real contact form');
    assert(await page.locator('[data-journey-rail]').getAttribute('data-step')==='3',name+' progress advances to contact');
    assert(await page.locator('#contact').isVisible(),name+' contact remains in original site');
    await page.locator('#brief-message').fill('Je veux automatiser le suivi des demandes après une prise de contact.');
    await page.locator('#brief-form button[type=submit]').click();
    assert(await page.locator('#brief-result').isVisible(),name+' prepared email visible');
    assert((await page.locator('#brief-output').inputValue()).includes('Je veux automatiser'),name+' real requested text retained');
    assert((await page.locator('.mt-signal [data-signal-title]').innerText()).includes('pas envoyé'),name+' confirmation never pretends to send email');
    const overflow=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
    assert(overflow.scroll<=overflow.width+3,name+' no horizontal viewport overflow '+JSON.stringify(overflow));
    assert(!errors.length,name+' no JavaScript errors '+errors.join(' | '));
    await page.screenshot({path:'reports/journey/'+name+'-contact.png',animations:'disabled',timeout:15000});
    await context.close();
  }
  const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
  const page=await context.newPage();
  await page.goto(base+'/#offres',{waitUntil:'domcontentloaded'});
  await page.locator('[data-kinetic-next]').click();
  assert(await page.locator('[data-kinetic-title]').innerText()==='Automatisation','reduced motion keeps service selection functional');
  await context.close();
  console.log('ALL REAL-SITE JOURNEY CHECKS PASSED');
}catch(error){console.error(error);process.exitCode=1;}finally{await browser?.close();}
