"""Download natural job-related images from Pexels → WebP < 100KB."""
import os
import urllib.request
from io import BytesIO
from PIL import Image

os.makedirs('images', exist_ok=True)
HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

# filename: (pexels_id, width, height)
IMAGES = {
    # Featured job card covers (wide)
    'job-feature-1.webp': (3861969, 640, 360),   # developer laptop
    'job-feature-2.webp': (3178818, 640, 360),   # design workspace
    'job-feature-3.webp': (669610, 640, 360),    # data / charts
    'job-feature-4.webp': (1181244, 640, 360),   # tech office
    'job-feature-5.webp': (4386431, 640, 360),   # finance business
    'job-feature-6.webp': (263402, 640, 360),    # healthcare
    # Company avatars (square)
    'job-company-1.webp': (577585, 120, 120),
    'job-company-2.webp': (196644, 120, 120),
    'job-company-3.webp': (669619, 120, 120),
    'job-company-4.webp': (325229, 120, 120),
    'job-company-5.webp': (53621, 120, 120),
    'job-company-6.webp': (4173252, 120, 120),
    # Categories
    'cat-tech.webp': (3861969, 480, 360),
    'cat-design.webp': (196644, 480, 360),
    'cat-marketing.webp': (265667, 480, 360),
    'cat-finance.webp': (4386431, 480, 360),
    'cat-health.webp': (263402, 480, 360),
    'cat-remote.webp': (2471280, 480, 360),
    # Job list thumbnails (jobs page)
    'job-list-1.webp': (3861969, 128, 128),
    'job-list-2.webp': (3178818, 128, 128),
    'job-list-3.webp': (669610, 128, 128),
    'job-list-4.webp': (1181244, 128, 128),
    'job-list-5.webp': (4386431, 128, 128),
    'job-list-6.webp': (263402, 128, 128),
    'company-detail.webp': (3184292, 200, 200),
    # Blog card covers
    'blog-1.webp': (2471280, 480, 280),
    'blog-2.webp': (7688336, 480, 280),
    'blog-3.webp': (3184418, 480, 280),
    'blog-4.webp': (346885, 480, 280),
    'blog-5.webp': (325229, 480, 280),
    'blog-6.webp': (6476589, 480, 280),
}


def download(pid, w, h):
    url = (
        f'https://images.pexels.com/photos/{pid}/pexels-photo-{pid}.jpeg'
        f'?auto=compress&cs=tinysrgb&w={w}&h={h}&fit=crop'
    )
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=60) as r:
        return Image.open(BytesIO(r.read())).convert('RGB')


def save(img, path, max_kb=98):
    w, h = img.size
    for scale in [1.0, 0.85, 0.72]:
        im = img.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS) if scale < 1 else img
        for q in range(82, 38, -4):
            im.save(path, 'WEBP', quality=q, method=6)
            if os.path.getsize(path) / 1024 <= max_kb:
                return os.path.getsize(path) / 1024
    return os.path.getsize(path) / 1024


def main():
    for name, (pid, w, h) in IMAGES.items():
        path = f'images/{name}'
        try:
            print(f'{name}...', end=' ')
            img = download(pid, w, h).resize((w, h), Image.Resampling.LANCZOS)
            kb = save(img, path)
            status = 'OK' if kb <= 98 else 'WARN'
            print(f'{status} {kb:.1f}KB')
        except Exception as e:
            print(f'FAIL {e}')


if __name__ == '__main__':
    main()
