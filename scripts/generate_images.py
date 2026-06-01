from PIL import Image, ImageDraw
import os

os.makedirs('images', exist_ok=True)

def save_webp(name, size, color1, color2=None, text=None):
    img = Image.new('RGB', size, color1)
    draw = ImageDraw.Draw(img)
    if color2:
        for y in range(size[1]):
            r = int(color1[0] + (color2[0]-color1[0])*y/size[1])
            g = int(color1[1] + (color2[1]-color1[1])*y/size[1])
            b = int(color1[2] + (color2[2]-color1[2])*y/size[1])
            draw.line([(0,y),(size[0],y)], fill=(r,g,b))
    if text:
        draw.text((max(8, size[0]//2-15), size[1]//2-8), text, fill=(255,255,255))
    path = f'images/{name}'
    img.save(path, 'WEBP', quality=82, method=6)
    kb = os.path.getsize(path)/1024
    print(f'{name}: {kb:.1f}KB')

save_webp('hero-bg.webp', (1920, 1080), (11,17,32), (37,99,235))
companies = ['google','microsoft','amazon','meta','apple','netflix','spotify','uber','airbnb','stripe']
colors = [(66,133,244),(0,120,215),(255,153,0),(24,119,242),(50,50,50),(229,9,20),(30,215,96),(0,0,0),(255,90,95),(99,91,255)]
for c, col in zip(companies, colors):
    save_webp(f'logo-{c}.webp', (120, 120), col, text=c[:2].upper())
jobs = ['techflow','designhub','datacore','cloudnine','fintech','healthplus']
for j in jobs:
    save_webp(f'company-{j}.webp', (80, 80), (37,99,235), (124,58,237), text=j[:2].upper())
for i in range(1, 5):
    save_webp(f'avatar-{i}.webp', (100, 100), (6,182,212), (34,211,238))
cats = ['tech','design','marketing','finance','health','remote']
for cat in cats:
    save_webp(f'cat-{cat}.webp', (400, 300), (37,99,235), (124,58,237))
save_webp('cta-bg.webp', (1920, 600), (124,58,237), (37,99,235))
save_webp('company-detail.webp', (200, 200), (37,99,235), (6,182,212), text='TF')
