"""Draws the app icons into ../icons. Run: python3 tools/make-icons.py (needs Pillow)."""
from pathlib import Path
from PIL import Image, ImageDraw

OUT = Path(__file__).resolve().parent.parent / "icons"
BG = (21, 19, 16)          # dark brown page background
ACCENT = (255, 148, 51)    # the app's orange
CREAM = (240, 235, 227)


def draw(size: int) -> Image.Image:
    s = 1024  # draw large, then shrink for smooth edges
    img = Image.new("RGB", (s, s), BG)
    d = ImageDraw.Draw(img)
    # A hand drum seen from the side, with sound bursting off the top.
    d.polygon([(330, 470), (694, 470), (636, 800), (388, 800)], fill=ACCENT)
    d.rectangle([352, 590, 672, 618], fill=BG)
    d.rectangle([370, 690, 654, 714], fill=BG)
    d.ellipse([318, 410, 706, 530], fill=CREAM)
    for x0, y0, x1, y1 in [(512, 210, 512, 340), (330, 260, 400, 360), (694, 260, 624, 360)]:
        d.line([(x0, y0), (x1, y1)], fill=CREAM, width=44)
        d.ellipse([x0 - 22, y0 - 22, x0 + 22, y0 + 22], fill=CREAM)
        d.ellipse([x1 - 22, y1 - 22, x1 + 22, y1 + 22], fill=CREAM)
    return img.resize((size, size), Image.LANCZOS)


OUT.mkdir(exist_ok=True)
for name, size in [("icon-192.png", 192), ("icon-512.png", 512), ("apple-touch-icon.png", 180)]:
    draw(size).save(OUT / name, optimize=True)
    print("wrote", OUT / name)
