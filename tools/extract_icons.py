"""Lift Austin's hand-drawn icons off the lined paper into img/icons/*.png (pale ink on transparency).

Run from the project root:  python tools/extract_icons.py
Input: handdrawn_icons.jpeg (a phone photo of the page; EXIF orientation is honoured).
To add or redo an icon, adjust its crop box below (pixels in the upright 3024x4032 photo).
Needs Pillow and numpy.
"""
import numpy as np
from PIL import Image, ImageOps, ImageFilter

PHOTO = 'handdrawn_icons.jpeg'
SIZE = 256                                   # output icons are square, this many pixels
INK = (232, 224, 219)                        # the site's paper colour; the png is this colour with an alpha mask
BOXES = {                                    # left, top, right, bottom in the upright photo
    'tea':    (340, 200, 1000, 780),
    'jelly':  (1680, 260, 2120, 900),
    'soup':   (400, 860, 900, 1440),
    'ticket': (1560, 1060, 2220, 1580),
    'carrot': (1380, 1600, 2280, 2620),
}

im = ImageOps.exif_transpose(Image.open(PHOTO)).convert('RGB')
for name, box in BOXES.items():
    crop = im.crop(box)
    L = np.asarray(crop.convert('L')).astype(float)
    # the local paper brightness, so a shadow across the page does not read as ink
    paper = np.asarray(Image.fromarray(L.astype('uint8')).filter(ImageFilter.GaussianBlur(45))).astype(float)
    # ruled lines sit 10-25 levels under the paper, pen strokes 50 or more: keep only the pen
    ink = np.clip((paper - L - 38) / 64.0, 0, 1)
    ink = np.asarray(Image.fromarray((ink * 255).astype('uint8')).filter(ImageFilter.GaussianBlur(0.8))).astype(float) / 255
    ink[ink < 0.14] = 0
    ys, xs = np.where(ink > 0.3)
    pad = 22
    y0, y1 = max(0, ys.min() - pad), min(ink.shape[0], ys.max() + pad)
    x0, x1 = max(0, xs.min() - pad), min(ink.shape[1], xs.max() + pad)
    a = ink[y0:y1, x0:x1]
    h, w = a.shape; s = max(h, w)
    square = np.zeros((s, s)); square[(s - h) // 2:(s - h) // 2 + h, (s - w) // 2:(s - w) // 2 + w] = a
    alpha = Image.fromarray((square * 255).astype('uint8')).resize((SIZE, SIZE), Image.LANCZOS)
    out = Image.new('RGBA', (SIZE, SIZE), INK + (0,)); out.putalpha(alpha)
    out.save('img/icons/%s.png' % name, optimize=True)
    print(name, 'ok')
