import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

const base = process.env.SITE_URL || 'http://127.0.0.1:8765';
const out = 'qa/client-presence';
await mkdir(out, { recursive: true });
const browser = await chromium.launch();
const results = [];
const paths = ['sav-ecommerce.html','televente.html','crm-reporting.html','e-reputation.html','site-signature.html','automatisation-workflows.html'];
const ids = ['sav','prospects','crm','avis','web','automation'];
let currentPage;
try {
  for (const viewport of [{width:1440,height:1000},{width:390,height:844},{width:320,height:740}]) {
    const context = await browser.newContext({viewport, reducedMotion:'reduce'});
    const page = currentPage = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('response', r => { if (r.url().startsWith(base) && r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
    await page.goto(base + '/', {waitUntil:'networkidle'});
    await page.waitForFunction(() => window.__signatureReady);
    assert.equal(await page.locator('#site').evaluate(el => el.inert), false);
    assert.equal(await page.locator('#intro').isVisible(), false);
    assert.equal(await page.locator('#signature-video').evaluate(el => el.paused), true);
    assert.equal(await page.locator('.quick-services a').count(), 6);
    assert.equal(await page.locator('h1').count(), 1);
    await page.screenshot({path:`${out}/home-${viewport.width}.png`});
    await page.getByRole('link',{name:'Découvrir mes solutions',exact:false}).first().click();
    await page.locator('#collection-stage').scrollIntoViewIfNeeded();
    await page.locator('#stage-pause').click();
    assert.equal(await page.locator('#stage-pause').getAttribute('aria-pressed'),'true');
    for (let i=0;i<6;i++) {
      if (i) await page.locator('#stage-next').click();
      assert.equal((await page.locator('#stage-count').innerText()).trim(),`0${i+1} / 06`);
      await page.locator(`.offer-card[data-index="${i}"]`).click();
      assert.equal(await page.locator('#detail').isVisible(),true);
      assert.equal(await page.locator('#detail-page').getAttribute('href'),'./'+paths[i]);
      assert.equal(await page.locator('#detail-action').getAttribute('href'),'./?mission='+ids[i]+'#contact');
      assert.equal(await page.locator('#detail-list li').count(),4);
    }
    await page.locator('#solutions').scrollIntoViewIfNeeded();
    if (viewport.width >= 390) await page.screenshot({path:`${out}/services-${viewport.width}.png`});
    for (let i=0;i<paths.length;i++) {
      await page.goto(`${base}/${paths[i]}`, {waitUntil:'networkidle'});
      assert.equal(await page.locator('h1').count(),1);
      await page.locator('[data-process-step]').last().click();
      assert.match(await page.locator('[data-process-count]').innerText(),/03 \/ 03/);
      assert.equal(await page.locator('[data-process-step][aria-pressed="true"]').count(),1);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),true,`${paths[i]} overflows at ${viewport.width}`);
      if(i===0 && viewport.width>=390){
        await page.goto(`${base}/${paths[i]}`);
        await page.screenshot({path:`${out}/sav-${viewport.width}.png`});
      }
      const contact = page.locator('.service-contact .primary-link');
      await contact.click();
      assert.equal(await page.locator('#brief-mission').inputValue(),ids[i]);
      await page.locator('#brief-message').fill('Nous cherchons un renfort pour le suivi des demandes clients.');
      const mailto = await page.locator('#brief-send').getAttribute('href');
      assert.match(mailto,/^mailto:contact@moezthabet.com\?/);
      const params = new URLSearchParams(mailto.split('?')[1]);
      assert.match(params.get('body'),/Bonjour Moez,\n\nJe vous contacte/);
      assert.match(params.get('body'),/Nous cherchons un renfort/);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),true,`contact overflows at ${viewport.width}`);
      if(i===0 && viewport.width>=390) await page.screenshot({path:`${out}/contact-${viewport.width}.png`});
    }
    await page.goto(base+'/');
    await page.locator('#signature-open').click();
    assert.equal(await page.locator('#intro').isVisible(),true);
    assert.equal(await page.locator('#site').evaluate(el => el.inert),true);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#intro').isVisible(),false);
    await page.locator('#signature-open').click();
    await page.locator('#intro-turn').click();
    await page.locator('.film.is-visible').waitFor();
    await page.locator('#film-exit').click();
    assert.equal(await page.locator('#site').evaluate(el => el.inert),false);
    await page.locator('#signature-open').click();
    assert.equal(await page.locator('#intro-turn').isVisible(),true);
    await page.locator('#intro-direct').click();
    assert.equal(await page.locator('#intro').isVisible(),false);
    assert.equal(await page.locator('#site').evaluate(el => el.inert),false);
    assert.deepEqual(errors,[]);
    results.push({viewport,services:6,contact:'passed',signature:'passed',errors});
    await context.close();
  }
  const nojs = await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const page = currentPage = await nojs.newPage();
  await page.goto(base+'/');
  assert.equal(await page.locator('.quick-services a').count(),6);
  assert.equal(await page.locator('#collection-stage').isVisible(),false);
  await page.locator('.quick-services a').first().click();
  assert.match(page.url(),/sav-ecommerce.html$/);
  assert.equal(await page.locator('.plain-contact').getAttribute('href'),'mailto:contact@moezthabet.com');
  results.push({javascriptDisabled:'passed'});
  await writeFile(`${out}/results.json`,JSON.stringify({status:'passed',results},null,2));
  console.log(JSON.stringify({status:'passed',results},null,2));
} catch (error) {
  if (currentPage) await currentPage.screenshot({path:`${out}/failure.png`,fullPage:true}).catch(()=>{});
  await writeFile(`${out}/failure.txt`,error.stack||String(error));
  throw error;
} finally { await browser.close(); }
