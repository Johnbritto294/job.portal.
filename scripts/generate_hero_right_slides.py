"""Unique job-portal hero RIGHT panel slides — portrait WebP, each < 100KB."""
from PIL import Image, ImageDraw, ImageFilter
import math
import os
import random

os.makedirs('images', exist_ok=True)
W, H = 720, 900
random.seed(99)


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def radial_gradient(c1, c2, cx=0.5, cy=0.3):
    img = Image.new('RGB', (W, H), c1)
    for y in range(H):
        for x in range(0, W, 4):
            dx, dy = (x / W - cx), (y / H - cy)
            t = min(1.0, math.sqrt(dx * dx + dy * dy) * 1.4)
            col = lerp(c1, c2, t)
            ImageDraw.Draw(img).point([(x, y), (x + 1, y), (x + 2, y), (x + 3, y)], fill=col)
    return img


def save(name, img, max_kb=98):
    path = f'images/{name}'
    for q in range(90, 52, -3):
        img.save(path, 'WEBP', quality=q, method=6)
        if os.path.getsize(path) / 1024 <= max_kb:
            print(f'{name}: {os.path.getsize(path)/1024:.1f}KB q={q}')
            return
    print(f'{name}: {os.path.getsize(path)/1024:.1f}KB')


# 1 — Mobile job search app UI
img = radial_gradient((8, 15, 35), (30, 64, 120))
draw = ImageDraw.Draw(img)
# Phone frame
px, py = 200, 120
draw.rounded_rectangle([px, py, px + 320, py + 620], radius=36, fill=(18, 28, 48), outline=(80, 140, 220), width=4)
draw.rounded_rectangle([px + 16, py + 50, px + 304, py + 580], radius=20, fill=(12, 20, 38))
draw.rectangle([px + 120, py + 20, px + 200, py + 38], fill=(40, 60, 90))
# App header
draw.rectangle([px + 30, py + 70, px + 290, py + 120], fill=(37, 99, 235))
draw.text((px + 40, py + 85), "Find Jobs", fill=(255, 255, 255))
# Job cards in app
for i, (title, col) in enumerate([("Sr. Developer", (50, 90, 140)), ("UX Lead", (55, 85, 130)), ("Data Analyst", (48, 88, 135))]):
    cy = py + 150 + i * 130
    draw.rounded_rectangle([px + 30, cy, px + 290, cy + 110], radius=14, fill=col)
    draw.ellipse([px + 45, cy + 25, px + 95, cy + 75], fill=(70, 130, 200))
    draw.rectangle([px + 110, cy + 30, px + 240, cy + 42], fill=(180, 210, 255))
    draw.rectangle([px + 110, cy + 52, px + 190, cy + 62], fill=(120, 160, 210))
    draw.rounded_rectangle([px + 200, cy + 70, px + 270, cy + 95], radius=20, fill=(6, 182, 212))
save('hero-right-1.webp', img)

# 2 — Video interview frame
img = radial_gradient((25, 12, 45), (88, 40, 120))
draw = ImageDraw.Draw(img)
# Monitor
draw.rounded_rectangle([80, 100, 640, 520], radius=24, fill=(20, 18, 40), outline=(140, 100, 200), width=5)
draw.rectangle([100, 130, 620, 460], fill=(35, 30, 60))
# Face silhouette + waveforms
draw.ellipse([280, 200, 440, 380], fill=(60, 55, 95))
draw.ellipse([310, 240, 410, 340], fill=(90, 80, 130))
for i in range(12):
    h = 20 + (i % 4) * 25
    draw.rectangle([120 + i * 38, 400 - h, 128 + i * 38, 400], fill=(34, 211, 238))
draw.rectangle([300, 520, 420, 540], fill=(50, 45, 80))
draw.rectangle([250, 540, 470, 560], fill=(40, 38, 70))
# LIVE badge
draw.rounded_rectangle([520, 150, 600, 190], radius=8, fill=(239, 68, 68))
draw.text((538, 158), "LIVE", fill=(255, 255, 255))
save('hero-right-2.webp', img)

# 3 — Hired / offer celebration
img = radial_gradient((10, 30, 25), (6, 95, 70))
draw = ImageDraw.Draw(img)
# Confetti
colors = [(34, 211, 238), (250, 204, 21), (244, 114, 182), (129, 140, 248), (52, 211, 153)]
for _ in range(80):
    x, y = random.randint(0, W), random.randint(0, H // 2)
    draw.rectangle([x, y, x + 8, y + 14], fill=random.choice(colors))
# Large badge
draw.ellipse([180, 220, 540, 580], fill=(16, 120, 90), outline=(52, 211, 153), width=6)
draw.ellipse([220, 260, 500, 540], fill=(20, 80, 65))
# Checkmark
draw.polygon([(300, 420), (360, 480), (480, 340)], fill=(167, 243, 208))
draw.text((240, 600), "You're Hired!", fill=(220, 255, 240))
draw.rounded_rectangle([200, 680, 520, 760], radius=30, fill=(37, 99, 235))
draw.text((280, 705), "View Offer", fill=(255, 255, 255))
save('hero-right-3.webp', img)

# 4 — Resume + skills tags
img = radial_gradient((15, 18, 42), (49, 46, 129))
draw = ImageDraw.Draw(img)
# Paper
draw.rounded_rectangle([140, 80, 580, 780], radius=16, fill=(248, 250, 252))
draw.rectangle([180, 130, 400, 150], fill=(37, 99, 235))
draw.rectangle([180, 170, 520, 185], fill=(200, 210, 230))
draw.rectangle([180, 200, 480, 212], fill=(220, 225, 240))
draw.rectangle([180, 230, 500, 242], fill=(220, 225, 240))
# Photo box
draw.rectangle([180, 280, 280, 400], fill=(180, 195, 220))
draw.ellipse([200, 310, 260, 370], fill=(100, 130, 180))
# Skill pills
skills = ["React", "Leadership", "Agile", "SQL", "Figma", "Python"]
for i, sk in enumerate(skills):
    row, col = i // 2, i % 2
    x = 320 + col * 120
    y = 300 + row * 50
    draw.rounded_rectangle([x, y, x + 100, y + 36], radius=18, fill=(224, 231, 255))
    draw.text((x + 12, y + 8), sk, fill=(37, 99, 235))
# Star rating
for i in range(5):
    draw.polygon([(320 + i * 28, 520), (328 + i * 28, 540), (348 + i * 28, 540), (332 + i * 28, 552), (338 + i * 28, 572), (320 + i * 28, 558), (302 + i * 28, 572), (308 + i * 28, 552), (292 + i * 28, 540), (312 + i * 28, 540)], fill=(250, 204, 21))
save('hero-right-4.webp', img)

# 5 — Coworking / open office desks
img = radial_gradient((20, 25, 40), (14, 116, 144))
draw = ImageDraw.Draw(img)
# Perspective desks
for row in range(4):
    for col in range(3):
        x = 100 + col * 200 + row * 15
        y = 200 + row * 140
        draw.polygon([(x, y + 60), (x + 140, y + 60), (x + 160, y), (x + 20, y)], fill=(40 + row * 8, 70 + row * 5, 100 + row * 10))
        draw.rectangle([x + 30, y - 50, x + 50, y + 10], fill=(60, 100, 140))
        if random.random() > 0.5:
            draw.ellipse([x + 50, y - 30, x + 90, y + 10], fill=(180, 140, 100))
# Laptop screens glow
for lx, ly in [(180, 280), (380, 420), (500, 320)]:
    draw.rectangle([lx, ly, lx + 80, ly + 50], fill=(50, 120, 180))
    draw.rectangle([lx + 5, ly + 5, lx + 75, ly + 40], fill=(80, 180, 220))
draw.rectangle([0, 700, W, H], fill=(12, 18, 32))
save('hero-right-5.webp', img)

# 6 — AI job matching / neural match
img = radial_gradient((18, 10, 38), (124, 58, 237))
draw = ImageDraw.Draw(img)
cx, cy = W // 2, H // 2 - 40
# Central profile
draw.ellipse([cx - 70, cy - 70, cx + 70, cy + 70], fill=(60, 50, 110), outline=(167, 139, 250), width=4)
draw.ellipse([cx - 40, cy - 50, cx + 40, cy + 10], fill=(90, 75, 140))
# Orbiting job icons
positions = [(cx, cy - 200), (cx + 180, cy - 80), (cx + 160, cy + 120), (cx - 160, cy + 100), (cx - 190, cy - 60)]
for i, (ox, oy) in enumerate(positions):
    draw.line([(cx, cy), (ox, oy)], fill=(120, 100, 200), width=2)
    draw.ellipse([ox - 45, oy - 45, ox + 45, oy + 45], fill=(40, 35, 80), outline=(34, 211, 238), width=3)
    draw.rectangle([ox - 20, oy - 15, ox + 20, oy + 5], fill=(100, 180, 220))
# Match %
draw.rounded_rectangle([220, 720, 500, 820], radius=40, fill=(37, 99, 235))
draw.text((270, 755), "98% Match", fill=(255, 255, 255))
save('hero-right-6.webp', img.filter(ImageFilter.SHARPEN))

print('Generated 6 unique hero-right slides.')
