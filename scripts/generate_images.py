"""Creates the SVG placeholder images in /public/images (run once, already done).
Every image is a coloured gradient with a big food emoji, so the project works offline."""
import os

FOODS = {
 'r1-1':('🍕','#ff9a44'),'r1-2':('🍕','#7bc67b'),'r1-3':('🍕','#e0533d'),'r1-4':('🥖','#f2c14e'),'r1-5':('🍝','#f6d6a8'),'r1-6':('🍮','#c9a27a'),
 'r2-1':('🍔','#8fd36b'),'r2-2':('🍔','#f4a259'),'r2-3':('🍔','#d9534f'),'r2-4':('🍟','#f7d154'),'r2-5':('🍗','#e8a24d'),'r2-6':('🥤','#a0765a'),
 'r3-1':('🍛','#f0a030'),'r3-2':('🍛','#d4682c'),'r3-3':('🍛','#86b84a'),'r3-4':('🍗','#e0523a'),'r3-5':('🍢','#f08a3c'),'r3-6':('🍮','#d9a35c'),
 'r4-1':('🍜','#f4b942'),'r4-2':('🍚','#e9a23b'),'r4-3':('🥡','#c8553d'),'r4-4':('🌶️','#d9382b'),'r4-5':('🌯','#e6b04a'),'r4-6':('🍲','#e07a3c'),
 'r5-1':('🥞','#f2b84b'),'r5-2':('🥞','#e59a2f'),'r5-3':('🍘','#f3e3c3'),'r5-4':('🍩','#d9a15c'),'r5-5':('🍚','#f0d9a0'),'r5-6':('☕','#a8744f'),
 'r6-1':('🍫','#8a5a44'),'r6-2':('🍰','#d94f5c'),'r6-3':('🍡','#e9a03b'),'r6-4':('🍨','#f4d9e3'),'r6-5':('🥭','#f7b733'),'r6-6':('☕','#b07d62'),
 'r7-1':('🥗','#7cc47c'),'r7-2':('🍗','#8fbf5a'),'r7-3':('🥙','#a6cf6a'),'r7-4':('🍓','#e8627c'),'r7-5':('🥑','#9ccc65'),'r7-6':('🥬','#66bb6a'),
 'r8-1':('🍛','#e8833a'),'r8-2':('🧀','#f0a030'),'r8-3':('🫓','#e6c27a'),'r8-4':('🍗','#d9532b'),'r8-5':('🥘','#8d5b3c'),'r8-6':('🍚','#f1dfae'),
}
RESTAURANTS = {'r1':('🍕','#ff8a3d'),'r2':('🍔','#f4a259'),'r3':('🍛','#e67e22'),'r4':('🥡','#d9534f'),
               'r5':('🥞','#f2b84b'),'r6':('🍰','#e8627c'),'r7':('🥗','#66bb6a'),'r8':('🍲','#c0623a')}
BANNERS = {'b1':('🎉','#fc8019','#ff5e62'),'b2':('💸','#6a11cb','#2575fc'),'b3':('🛵','#11998e','#38ef7d')}

def svg(w, h, c1, c2, emoji, size):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{c1}"/><stop offset="1" stop-color="{c2}"/></linearGradient></defs>
<rect width="{w}" height="{h}" fill="url(#g)"/>
<circle cx="{w*0.85}" cy="{h*0.15}" r="{h*0.35}" fill="#ffffff" opacity="0.12"/>
<circle cx="{w*0.1}" cy="{h*0.95}" r="{h*0.3}" fill="#ffffff" opacity="0.12"/>
<text x="50%" y="54%" font-size="{size}" text-anchor="middle" dominant-baseline="middle" font-family="Segoe UI Emoji, Apple Color Emoji, Noto Color Emoji, sans-serif">{emoji}</text>
</svg>'''

def shade(hex_color):
    r, g, b = (int(hex_color[i:i+2], 16) for i in (1, 3, 5))
    return '#%02x%02x%02x' % (int(r*0.75), int(g*0.75), int(b*0.75))

for k, (e, c) in FOODS.items():
    open(f'public/images/foods/{k}.svg', 'w', encoding='utf-8').write(svg(600, 400, c, shade(c), e, 190))
for k, (e, c) in RESTAURANTS.items():
    open(f'public/images/restaurants/{k}.svg', 'w', encoding='utf-8').write(svg(1000, 500, c, shade(c), e, 260))
for k, (e, c1, c2) in BANNERS.items():
    open(f'public/images/banners/{k}.svg', 'w', encoding='utf-8').write(svg(1200, 400, c1, c2, e, 200).replace('x="50%" y="54%"', 'x="82%" y="54%"'))

open('public/images/logo.svg', 'w', encoding='utf-8').write('''<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
<circle cx="32" cy="32" r="30" fill="#fc8019"/>
<text x="50%" y="54%" font-size="34" text-anchor="middle" dominant-baseline="middle" font-family="Segoe UI Emoji, Apple Color Emoji, Noto Color Emoji, sans-serif">🍔</text></svg>''')
print('done')
