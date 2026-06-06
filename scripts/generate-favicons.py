#!/usr/bin/env python3
"""Tight-crop existing logo and export standard favicon sizes."""

from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "app" / "icon.png"
PUBLIC = ROOT / "public"
APP = ROOT / "app"

SIZES = {
    "favicon-16x16.png": 16,
    "favicon-32x32.png": 32,
    "apple-touch-icon.png": 180,
    "android-chrome-192x192.png": 192,
    "android-chrome-512x512.png": 512,
}

ICO_SIZES = (16, 32, 48)


def content_bbox(im: Image.Image, threshold: int = 30) -> tuple[int, int, int, int]:
    rgba = im.convert("RGBA")
    pixels = rgba.load()
    w, h = rgba.size

    def corner_avg(x0: int, y0: int, x1: int, y1: int) -> tuple[int, int, int, int]:
        total = [0, 0, 0, 0]
        count = 0
        for y in range(y0, y1):
            for x in range(x0, x1):
                total[0] += pixels[x, y][0]
                total[1] += pixels[x, y][1]
                total[2] += pixels[x, y][2]
                total[3] += pixels[x, y][3]
                count += 1
        return tuple(v // count for v in total)

    pad = max(4, min(w, h) // 64)
    bg = corner_avg(0, 0, pad, pad)
    xs: list[int] = []
    ys: list[int] = []
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if a < 16:
                continue
            diff = abs(r - bg[0]) + abs(g - bg[1]) + abs(b - bg[2])
            if diff > threshold:
                xs.append(x)
                ys.append(y)

    if not xs:
        return (0, 0, w, h)

    return (min(xs), min(ys), max(xs) + 1, max(ys) + 1)


def square_crop(im: Image.Image, bbox: tuple[int, int, int, int]) -> Image.Image:
    left, top, right, bottom = bbox
    w = right - left
    h = bottom - top
    side = max(w, h)
    cx = (left + right) // 2
    cy = (top + bottom) // 2
    half = side // 2
    left = max(0, cx - half)
    top = max(0, cy - half)
    right = min(im.width, left + side)
    bottom = min(im.height, top + side)
    # re-center if clamped
    if right - left < side:
        left = max(0, right - side)
    if bottom - top < side:
        top = max(0, bottom - side)
    return im.crop((left, top, left + side, top + side))


def resize_icon(im: Image.Image, size: int) -> Image.Image:
    return im.resize((size, size), Image.Resampling.LANCZOS)


def main() -> None:
    if not SOURCE.exists():
        raise SystemExit(f"Missing source: {SOURCE}")

    src = Image.open(SOURCE).convert("RGBA")
    bbox = content_bbox(src)
    cropped = square_crop(src, bbox)
    print(f"Source {SOURCE.name}: {src.size} -> crop bbox {bbox} -> {cropped.size}")

    PUBLIC.mkdir(parents=True, exist_ok=True)

    master = cropped
    for name, size in SIZES.items():
        out = PUBLIC / name
        resize_icon(master, size).save(out, format="PNG", optimize=True)
        print(f"  wrote {out.relative_to(ROOT)} ({size}x{size})")

    # Multi-size ICO for legacy browsers
    ico_images = [resize_icon(master, s) for s in ICO_SIZES]
    ico_path = PUBLIC / "favicon.ico"
    ico_images[0].save(
        ico_path,
        format="ICO",
        sizes=[(s, s) for s in ICO_SIZES],
        append_images=ico_images[1:],
    )
    print(f"  wrote {ico_path.relative_to(ROOT)}")

    # Keep Next.js file-based metadata in sync
    resize_icon(master, 512).save(APP / "icon.png", format="PNG", optimize=True)
    resize_icon(master, 32).save(APP / "favicon.png", format="PNG", optimize=True)
    print(f"  updated app/icon.png and app/favicon.png")


if __name__ == "__main__":
    main()
