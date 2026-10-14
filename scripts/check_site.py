#!/usr/bin/env python3
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import unittest
import json
R=Path(__file__).resolve().parents[1]
SERVICES=['site-signature.html','sav-ecommerce.html','e-reputation.html','televente.html','crm-reporting.html','automatisation-workflows.html']
PAGES=['index.html']+SERVICES+['confidentialite.html','experience-v5.html']
class Reader(HTMLParser):
 def __init__(self):
  super().__init__();self.ids=set();self.links=[];self.cards=0
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if a.get('id'):self.ids.add(a['id'])
  if a.get('data-offer-link'):self.cards+=1
  self.links.extend(a[k] for k in ('href','src','poster') if a.get(k))
class QA(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.pages={p:(R/p).read_text(encoding='utf-8') for p in PAGES}
  cls.html={}
  for p,t in cls.pages.items():
   q=Reader();q.feed(t);cls.html[p]=q
 def test_local_resources(self):
  for page,parsed in self.html.items():
   for url in parsed.links:
    with self.subTest(page=page,url=url):
     u=urlsplit(url)
     if u.scheme or u.netloc or url.startswith('//'):continue
     path=unquote(u.path)
     target=(R/page if not path else R/('index.html' if path=='./' else path.removeprefix('./'))).resolve()
     self.assertTrue(target.is_relative_to(R))
     self.assertTrue(target.exists())
     if target.is_dir():target=target/'index.html'
     if u.fragment and target.suffix=='.html':
      key=target.relative_to(R).as_posix()
      self.assertIn(key,self.html)
      self.assertIn(unquote(u.fragment),self.html[key].ids)
 def test_business_path(self):
  self.assertEqual(self.html['index.html'].cards,6)
  for p in SERVICES:
   self.assertIn('calendly.com/moez-thabet-881988/30min',self.pages[p])
   self.assertIn('Les 6 offres',self.pages[p])
  self.assertIn('Automatisation des workflows',self.pages['index.html'])
 def test_indexing(self):
  for p in PAGES[:-1]:
   self.assertIn('rel="canonical"',self.pages[p])
   self.assertNotIn('noindex,nofollow,noarchive',self.pages[p])
  self.assertIn('noindex',self.pages['experience-v5.html'])
  rules=json.loads((R/'vercel.json').read_text())['headers']
  self.assertTrue(any(h['key']=='X-Robots-Tag' and 'noindex' in h['value'] for rule in rules for h in rule['headers']))
 def test_clean_service_navigation(self):
  homepage=self.pages['index.html']
  self.assertNotIn('data-wheel-card=',homepage,'Old wheel must not duplicate the photo carousel')
  self.assertNotIn('class="flagship-proof"',homepage,'Avoid a repeated promo between carousel and details')
  self.assertIn('data-carousel-live',homepage)
  self.assertIn('data-offer-link="web"',homepage)
  self.assertIn('Ouvrir ma messagerie',homepage)
  self.assertIn('Copier le message',homepage)
 def test_audit_critical_contracts(self):
  homepage=self.pages['index.html']
  self.assertIn('class="intro-active"', homepage, 'The signature must invert the homepage on first entry')
  self.assertIn("else reveal();", homepage, 'The first visit must show the signature introduction')
  self.assertIn('id="intro-flip"', homepage, 'The flip action must be available')
  self.assertIn('film-experience.js?v=20261014-intro-stable1', homepage, 'The stable film player must be loaded')
  self.assertNotIn("document.body.classList.add('mt-direct-entry')",homepage,'Do not bypass the signature intro on every visit')
  self.assertNotIn('class="mt-cinema-choice"',homepage,'Redundant beige cinema strip must be removed')
  self.assertIn('id="intro-flip"',homepage,'Inverted intro keeps the original film-launch CTA')
  self.assertIn('film-experience.js',homepage,'Signature film remains connected')
  self.assertIn('id="realisations"',homepage,'Show one verifiable personal project')
  self.assertIn('réalisation pour un client',homepage,'Do not invent customer proof')
  self.assertIn('github.com/zeom-DEV/moez-website',homepage)
  self.assertEqual(homepage.count('class="mt-contact-alt"'),6,'Every service provides a direct email route')
  self.assertIn('mt-web-reference',self.pages['site-signature.html'])
  self.assertIn('0.1', (R/'scripts/performance-qa.mjs').read_text(),'CLS must be checked in performance QA')
  self.assertIn('assets/premium-system.css',homepage,'Ensure shared visual identity is loaded')

 def test_error_and_social_pages(self):
  page=(R/'404.html').read_text()
  self.assertIn('noindex,follow',page)
  self.assertIn('href="/#offres"',page)
  self.assertIn('href="/#contact"',page)
  for p in ('site-signature.html','automatisation-workflows.html'):
   self.assertIn('property="og:image"',self.pages[p])
   self.assertIn('name="twitter:card"',self.pages[p])
 def test_intro_performance_guard(self):
  script=(R/'scripts/performance-qa.mjs').read_text()
  self.assertNotIn("name!=='intro'&&report.categories.performance",script)
  self.assertNotIn("name!=='intro'&&report.categories.accessibility",script)
 def test_film(self):
  self.assertIn('preload="none"',self.pages['index.html'])
  self.assertGreater((R/'assets/moez-signature-teaser-12s.mp4').stat().st_size,100000)
  self.assertIn("skip.addEventListener('click',discover)",(R/'assets/film-experience.js').read_text())
if __name__=='__main__':unittest.main(verbosity=2)
