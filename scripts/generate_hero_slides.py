"""Generate premium job-portal hero slide backgrounds (WebP, each < 100KB)."""
from PIL import Image, ImageDraw, ImageFilter
import math
import os
import random

os.makedirs('images', exist_ok=True)
W, H = 1920, 1080
random.seed(42)


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def gradient_bg(c1, c2, c3=None):
    img = Image.new('RGB', (W, H), c1)
    draw = ImageDraw.Draw(img)
    for y in range(H):
        t = y / H
        if c3:
            col = lerp(lerp(c1, c2, min(t * 2, 1)), c3, max(0, (t - 0.5) * 2))
        else:
            col = lerp(c1, c2, t)
        draw.line([(0, y), (W, y)], fill=col)
    return img


def add_glow(img, cx, cy, radius, color, alpha=80):
    layer = Image.new('RGBA', img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    for r in range(radius, 0, -12):
        a = int(alpha * (1 - r / radius))
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(*color, max(0, a)))
    return Image.alpha_composite(img.convert('RGBA'), layer).convert('RGB')


def add_grid(draw, spacing=80, color=(255, 255, 255, 18)):
    for x in range(0, W, spacing):
        draw.line([(x, 0), (x, H)], fill=color, width=1)
    for y in range(0, H, spacing):
        draw.line([(0, y), (W, y)], fill=color, width=1)


def save_slide(name, img, max_kb=98):
    path = f'images/{name}'
    for q in range(88, 50, -4):
        img.save(path, 'WEBP', quality=q, method=6)
        kb = os.path.getsize(path) / 1024
        if kb <= max_kb:
            print(f'{name}: {kb:.1f}KB (q={q})')
            return
    print(f'{name}: {os.path.getsize(path)/1024:.1f}KB (lowest quality)')


# Slide 1 — Corporate skyline / office windows
img1 = gradient_bg((11, 17, 32), (30, 58, 138), (37, 99, 235))
img1 = add_glow(img1, 1400, 300, 500, (37, 99, 235), 60)
draw = ImageDraw.Draw(img1)
add_grid(draw, 100, (100, 150, 255, 12))
for row in range(6):
    for col in range(14):
        x = 200 + col * 110
        y = 400 + row * 90
        h = random.randint(40, 75)
        draw.rectangle([x, y + (90 - h), x + 70, y + 90], fill=(30, 64, 120))
        if random.random() > 0.4:
            draw.rectangle([x + 8, y + (90 - h) + 8, x + 62, y + (90 - h) + h - 8], fill=(56, 120, 220))
draw.polygon([(0, H), (W * 0.4, H * 0.7), (W, H * 0.85), (W, H)], fill=(8, 12, 24))
save_slide('hero-slide-1.webp', img1.filter(ImageFilter.GaussianBlur(radius=0.5)))

# Slide 2 — Tech / remote work (laptop + nodes)
img2 = gradient_bg((15, 23, 42), (88, 28, 135), (6, 182, 212))
img2 = add_glow(img2, 500, 500, 450, (124, 58, 237), 70)
img2 = add_glow(img2, 1500, 600, 400, (6, 182, 212), 50)
draw = ImageDraw.Draw(img2)
# Laptop silhouette
lx, ly = 900, 520
draw.rounded_rectangle([lx, ly, lx + 520, ly + 320], radius=20, fill=(20, 30, 55))
draw.rounded_rectangle([lx + 20, ly + 20, lx + 500, ly + 240], radius=8, fill=(35, 55, 95))
draw.rectangle([lx - 40, ly + 310, lx + 600, ly + 340], fill=(25, 38, 65))
# Network nodes
nodes = [(300, 350), (600, 200), (1300, 280), (1600, 450), (1100, 700), (400, 650)]
for i, (nx, ny) in enumerate(nodes):
    draw.ellipse([nx - 14, ny - 14, nx + 14, ny + 14], fill=(34, 211, 238))
    for j, (ox, oy) in enumerate(nodes):
        if i < j:
            draw.line([(nx, ny), (ox, oy)], fill=(80, 120, 200), width=2)
save_slide('hero-slide-2.webp', img2)

# Slide 3 — Interview / handshake abstract (warm professional)
img3 = gradient_bg((20, 15, 35), (79, 70, 229), (236, 72, 153))
img3 = add_glow(img3, 960, 540, 600, (124, 58, 237), 55)
draw = ImageDraw.Draw(img3)
# Table + chairs abstract
draw.ellipse([760, 620, 1160, 780], fill=(40, 35, 70))
draw.rounded_rectangle([700, 480, 1220, 620], radius=30, fill=(55, 48, 90))
draw.arc([650, 400, 850, 600], 200, 340, fill=(180, 140, 255), width=8)
draw.arc([1070, 400, 1270, 600], 200, 340, fill=(180, 140, 255), width=8)
# Document icons
for dx in [400, 1450]:
    draw.rounded_rectangle([dx, 300, dx + 120, 420], radius=8, fill=(60, 55, 90))
    draw.rectangle([dx + 15, 320, dx + 100, 330], fill=(200, 190, 255))
    draw.rectangle([dx + 15, 345, dx + 85, 355], fill=(150, 140, 200))
save_slide('hero-slide-3.webp', img3)

# Slide 4 — Growth / analytics dashboard
img4 = gradient_bg((8, 20, 30), (6, 95, 70), (37, 99, 235))
img4 = add_glow(img4, 1200, 400, 500, (16, 185, 129), 45)
draw = ImageDraw.Draw(img4)
# Chart bars
bars = [180, 260, 320, 400, 480, 550, 620, 700, 780]
heights = [120, 200, 160, 280, 220, 350, 300, 400, 380]
bx = 400
for h in heights:
    draw.rounded_rectangle([bx, 750 - h, bx + 55, 750], radius=6, fill=(34, 211, 238))
    bx += 75
# Trend line
pts = [(400, 650), (550, 580), (700, 520), (850, 480), (1000, 400), (1150, 350), (1300, 280)]
draw.line(pts, fill=(129, 140, 248), width=4)
for p in pts[-3:]:
    draw.ellipse([p[0] - 6, p[1] - 6, p[0] + 6, p[1] + 6], fill=(255, 255, 255))
# Job cards floating
for i, (cx, cy) in enumerate([(250, 350), (1550, 320), (1450, 620)]):
    draw.rounded_rectangle([cx, cy, cx + 200, cy + 100], radius=12, fill=(25, 45, 55))
    draw.rectangle([cx + 15, cy + 20, cx + 80, cy + 80], fill=(50, 90, 110))
    draw.rectangle([cx + 95, cy + 25, cx + 175, cy + 38], fill=(80, 160, 180))
    draw.rectangle([cx + 95, cy + 48, cx + 150, cy + 58], fill=(60, 120, 140))
save_slide('hero-slide-4.webp', img4)

# Slide 5 — Global careers / map dots
img5 = gradient_bg((11, 17, 32), (49, 46, 129), (14, 165, 233))
img5 = add_glow(img5, 960, 480, 700, (37, 99, 235), 50)
draw = ImageDraw.Draw(img5)
# World map dots pattern
for _ in range(120):
    x = random.randint(100, W - 100)
    y = random.randint(150, H - 200)
    s = random.randint(2, 6)
    draw.ellipse([x - s, y - s, x + s, y + s], fill=(100, 180, 255))
# Connection arcs
hubs = [(400, 500), (960, 400), (1500, 550), (700, 700), (1200, 300)]
for i, (x1, y1) in enumerate(hubs):
    for x2, y2 in hubs[i + 1:]:
        draw.line([(x1, y1), (x2, y2)], fill=(60, 100, 180), width=1)
for x, y in hubs:
    draw.ellipse([x - 20, y - 20, x + 20, y + 20], fill=(34, 211, 238))
    draw.ellipse([x - 35, y - 35, x + 35, y + 35], outline=(34, 211, 238), width=2)
# Briefcase icon center
bx, by = 860, 460
draw.rounded_rectangle([bx, by + 40, bx + 200, by + 160], radius=15, fill=(30, 50, 90))
draw.rectangle([bx + 60, by, bx + 140, by + 50], fill=(40, 65, 110))
draw.rectangle([bx + 20, by + 60, bx + 180, by + 140], fill=(50, 100, 180))
save_slide('hero-slide-5.webp', img5)

print('Done — 5 hero slides generated.')
