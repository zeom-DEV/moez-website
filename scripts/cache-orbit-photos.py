#!/usr/bin/env python3
"""Cache the six existing licensed Unsplash carousel photos as responsive WebP files."""
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from time import sleep
from urllib.request import Request, urlopen

PHOTO_IDS = {
    "web": "photo-1778146476147-5f8d4bd03c79",
    "sav": "photo-1712159018726-4564d92f3ec2",
    "avis": "photo-1633613286991-611fe299c4be",
    "prospects": "photo-1758876204242-787309002a8f",
    "crm": "photo-1770681381576-f1fdceb2ea01",
    "automation": "photo-1773966071293-bea3d7646fd1",
}
SIZES = {
    "mobile": (540, 760, 72),
    "desktop": (720, 1000, 76),
}
DESTINATION = Path("assets/orbit-photos")


def fetch_one(item):
    name, photo, variant, dimensions = item
    width, height, quality = dimensions
    url = (f"https://images.unsplash.com/{photo}"
           f"?fit=crop&w={width}&h={height}&q={quality}&fm=webp")
    destination = DESTINATION / f"{name}-{variant}.webp"
    request = Request(url, headers={
        "User-Agent": "Mozilla/5.0 (compatible; MoezWebsiteImageCache/1.0)",
        "Accept": "image/webp",
    })
    for attempt in range(4):
        try:
            with urlopen(request, timeout=50) as response:
                data = response.read()
            if not (len(data) > 1000 and data[:4] == b"RIFF" and data[8:12] == b"WEBP"):
                raise ValueError(f"Not a valid WebP: {name} {variant}, {len(data)} bytes")
            destination.write_bytes(data)
            return f"OK {destination} {len(data)} bytes"
        except Exception:
            if attempt == 3:
                raise
            sleep(2 ** attempt)


if __name__ == "__main__":
    DESTINATION.mkdir(parents=True, exist_ok=True)
    jobs = [(name, photo, variant, dims)
            for name, photo in PHOTO_IDS.items()
            for variant, dims in SIZES.items()]
    with ThreadPoolExecutor(max_workers=3) as executor:
        results = [executor.submit(fetch_one, job) for job in jobs]
        for result in as_completed(results):
            print(result.result(), flush=True)
    assert len(list(DESTINATION.glob("*.webp"))) == 12
