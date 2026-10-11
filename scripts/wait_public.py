"""Wait for GitHub Pages to serve this exact validated homepage before public QA."""
import hashlib
import os
from pathlib import Path
import time
import urllib.request
expected = hashlib.sha256(Path('index.html').read_bytes()).hexdigest()
url = 'https://moezthabet.com/?qa=' + os.environ.get('GITHUB_SHA', 'verification')
for attempt in range(40):
    try:
        with urllib.request.urlopen(url, timeout=15) as response:
            actual = hashlib.sha256(response.read()).hexdigest()
        if actual == expected:
            print('PASS public homepage matches the validated commit')
            break
    except OSError as error:
        print('Waiting for public deployment:', type(error).__name__)
    time.sleep(15)
else:
    raise SystemExit('Public deployment does not match this commit after 10 minutes')
