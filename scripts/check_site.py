#!/usr/bin/env python3
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import unittest
import json
R=Path(__file__).resolve().parents[1]
PAGES=['index.html','sav-ecommerce.html','e-reputation.html','televente.html','crm-reporting.html','site-signature.html','confidentialite.html','experience-v5.html']
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
  self.assertEqual(self.html['index.html'].cards,5)
  for p in PAGES[1:6]:
   self.assertIn('calendly.com/moez-thabet-881988/30min',self.pages[p])
 def test_indexing(self):
  for p in PAGES[:7]:
   self.assertIn('rel="canonical"',self.pages[p])
   self.assertNotIn('noindex,nofollow,noarchive',self.pages[p])
  self.assertIn('noindex',self.pages['experience-v5.html'])
  rules=json.loads((R/'vercel.json').read_text())['headers']
  self.assertTrue(any(h['key']=='X-Robots-Tag' and 'noindex' in h['value'] for rule in rules for h in rule['headers']))
 def test_film(self):
  self.assertIn('preload="none"',self.pages['index.html'])
  self.assertGreater((R/'assets/moez-signature-teaser-12s.mp4').stat().st_size,100000)
  self.assertIn("skip.addEventListener('click',discover)",(R/'assets/film-experience.js').read_text())
if __name__=='__main__':unittest.main(verbosity=2)
