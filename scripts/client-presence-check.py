#!/usr/bin/env python3
"""Check the public journey's documents and locally hosted dependencies."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import json
import importlib.util

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('offers', ROOT / 'scripts/build_client_presence.py')
offers = importlib.util.module_from_spec(spec)
spec.loader.exec_module(offers)
PAGES = ['index.html'] + [s['path'] for s in offers.SERVICES] + ['confidentialite.html', '404.html', 'experience-v5.html']

class Page(HTMLParser):
    def __init__(self, text):
        super().__init__(convert_charrefs=True)
        self.ids, self.links, self.headings, self.meta, self.visible = [], [], [], {}, []
        self.skip = False
        self.feed(text)
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag in ['script', 'style']: self.skip = True
        if a.get('id'): self.ids.append(a['id'])
        for attr in ['href', 'src']:
            if a.get(attr): self.links.append(a[attr])
        if a.get('srcset'): self.links.extend(s.strip().split()[0] for s in a['srcset'].split(','))
        if tag == 'h1': self.headings.append(a)
        if tag == 'meta': self.meta[a.get('name', a.get('property', ''))] = a.get('content', '')
    def handle_endtag(self, tag):
        if tag in ['script', 'style']: self.skip = False
    def handle_data(self, text):
        if not self.skip: self.visible.append(text)

parsed = {name: Page((ROOT / name).read_text()) for name in PAGES}
checked = 0
for name, page in parsed.items():
    assert len(page.ids) == len(set(page.ids)), f'{name}: duplicate IDs'
    if name not in ['404.html', 'experience-v5.html']:
        assert len(page.headings) == 1, f'{name}: expected one h1'
        assert page.meta.get('description'), f'{name}: description missing'
        assert page.meta.get('og:image') == 'https://moezthabet.com/assets/brand/moez-share-card.png'
    for href in page.links:
        url = urlsplit(href)
        if url.scheme or url.netloc: continue
        path = unquote(url.path)
        target = (ROOT / path.lstrip('/')) if path.startswith('/') else (ROOT / name).parent / path
        if not path or target.is_dir(): target = target / 'index.html' if path else ROOT / name
        target = target.resolve()
        assert target.is_relative_to(ROOT), f'{name}: outside root {href}'
        assert target.is_file(), f'{name}: missing local link {href}'
        if url.fragment and target.suffix == '.html':
            destination = parsed.get(target.name) or Page(target.read_text())
            assert url.fragment in destination.ids, f'{name}: missing anchor {href}'
        checked += 1
    if name != 'experience-v5.html':
        text = (ROOT / name).read_text()
        assert 'gmail.com' not in text, f'{name}: personal email'
        assert not __import__('re').search(r'\bTHABET\b', ' '.join(page.visible), __import__('re').I), f'{name}: surname in visible public copy'

home = (ROOT / 'index.html').read_text()
assert 'class="is-intro"' not in home
assert '<video id="signature-video" preload="none"' in home
assert len(offers.SERVICES) == 6
for service in offers.SERVICES:
    assert (ROOT / 'assets/orbit-photos' / (service['id'] + '-mobile.webp')).is_file()
    assert (ROOT / 'assets/orbit-photos' / (service['id'] + '-desktop.webp')).is_file()
assert 'moezthabet.com' in (ROOT / 'CNAME').read_text()
print(json.dumps({'pages': len(PAGES), 'local_links_and_assets': checked, 'services': 6, 'status': 'passed'}))
