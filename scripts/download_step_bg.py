"""Download natural backgrounds for How It Works step cards — WebP < 100KB."""
import os
import urllib.request
from io import BytesIO
from PIL import Image

os.makedirs('images', exist_ok=True)
H = {'User-Agent': 'Mozilla/5.0'}

# pexels_id, filename, theme
STEPS = [
    (3184292, 'step-bg-1.webp', 'Create profile — team/office'),
    (3861969, 'step-bg-2.webp', 'Search jobs — laptop work'),
    (7688336, 'step-bg-3.webp', 'Apply — modern office'),
    (3184418, 'step-bg-4.webp', 'Get hired — team success'),
]

W, H_SIZE = 640, 360


def save(img, path):
    for q in range(85, 40, -5):
        img.save(path, 'WEBP', quality=q, method=6)
        if os.path.getsize(path) / 1024 <= 98:
            return os.path.getsize(path) / 1024
    return os.path.getsize(path) / 1024


for pid, name, _ in STEPS:
    url = f'https://images.pexels.com/photos/{pid}/pexels-photo-{pid}.jpeg?auto=compress&w={W}&h={H_SIZE}&fit=crop'
    print(name, end=' ')
    try:
        req = urllib.request.Request(url, headers=H)
        with urllib.request.urlopen(req, timeout=60) as r:
            img = Image.open(BytesIO(r.read())).convert('RGB').resize((W, H_SIZE), Image.Resampling.LANCZOS)
        kb = save(img, f'images/{name}')
        print(f'{kb:.1f}KB')
    except Exception as e:
        print(f'FAIL {e}')
