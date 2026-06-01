"""Generate visible company brand logos as WebP < 100KB."""
from PIL import Image, ImageDraw, ImageFont
import os

os.makedirs('images', exist_ok=True)
W, H = 200, 64

BRANDS = [
    ('brand-google.webp', 'Google', (66, 133, 244)),
    ('brand-microsoft.webp', 'Microsoft', (0, 120, 215)),
    ('brand-amazon.webp', 'Amazon', (255, 153, 0)),
    ('brand-meta.webp', 'Meta', (24, 119, 242)),
    ('brand-apple.webp', 'Apple', (30, 30, 35)),
    ('brand-netflix.webp', 'Netflix', (229, 9, 20)),
    ('brand-spotify.webp', 'Spotify', (30, 215, 96)),
    ('brand-uber.webp', 'Uber', (0, 0, 0)),
    ('brand-airbnb.webp', 'Airbnb', (255, 90, 95)),
    ('brand-stripe.webp', 'Stripe', (99, 91, 255)),
]

for name, label, color in BRANDS:
    img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle([2, 2, W - 2, H - 2], radius=12, fill=(*color, 255))
    # Simple icon circle left
    draw.ellipse([12, 14, 44, 46], fill=(255, 255, 255, 40))
    draw.text((22, 20), label[0], fill=(255, 255, 255))
    draw.text((52, 20), label, fill=(255, 255, 255))
    path = f'images/{name}'
    img.convert('RGB').save(path, 'WEBP', quality=90, method=6)
    print(f'{name}: {os.path.getsize(path)/1024:.1f}KB')
