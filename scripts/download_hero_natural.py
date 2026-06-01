"""Download natural office & abroad photos (Pexels), save as WebP < 100KB."""
import os
import urllib.request
from io import BytesIO
from PIL import Image

os.makedirs('images', exist_ok=True)

# Pexels photo IDs — office & international / travel
PHOTOS = {
    # Background 1920x1080
    'hero-slide-1.webp': (325229, 'bg'),       # office workspace
    'hero-slide-2.webp': (3184292, 'bg'),      # team meeting office
    'hero-slide-3.webp': (7688336, 'bg'),     # modern office interior
    'hero-slide-4.webp': (4662438, 'bg'),     # city buildings abroad
    'hero-slide-5.webp': (346885, 'bg'),       # london / city skyline
    'hero-slide-6.webp': (2387876, 'bg'),     # airport travel abroad
    # Right panel 720x900
    'hero-right-1.webp': (3184418, 'right'),   # people in office
    'hero-right-2.webp': (1181405, 'right'),   # laptop office desk
    'hero-right-3.webp': (2908870, 'right'),  # travel / city abroad
    'hero-right-4.webp': (1024248, 'right'),  # urban skyline
    'hero-right-5.webp': (6476589, 'right'),  # coworking office
    'hero-right-6.webp': (3464632, 'right'),  # airplane window travel
}

SIZES = {'bg': (1920, 1080), 'right': (720, 900)}


def pexels_url(photo_id, w, h):
    return (
        f'https://images.pexels.com/photos/{photo_id}/pexels-photo-{photo_id}.jpeg'
        f'?auto=compress&cs=tinysrgb&w={w}&h={h}&fit=crop'
    )


def save_webp(img, path, max_kb=98):
    w, h = img.size
    for scale in [1.0, 0.88, 0.75]:
        im = img.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS) if scale < 1 else img
        for q in range(82, 38, -4):
            im.save(path, 'WEBP', quality=q, method=6)
            kb = os.path.getsize(path) / 1024
            if kb <= max_kb:
                return kb
    return os.path.getsize(path) / 1024


def main():
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
    for filename, (pid, kind) in PHOTOS.items():
        w, h = SIZES[kind]
        url = pexels_url(pid, w, h)
        path = f'images/{filename}'
        print(f'{filename} (pexels {pid})...')
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=60) as resp:
                img = Image.open(BytesIO(resp.read())).convert('RGB')
            img = img.resize((w, h), Image.Resampling.LANCZOS)
            kb = save_webp(img, path)
            print(f'  Saved {kb:.1f}KB')
        except Exception as e:
            print(f'  ERROR: {e}')


if __name__ == '__main__':
    main()
