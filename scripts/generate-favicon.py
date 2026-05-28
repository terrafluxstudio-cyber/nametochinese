#!/usr/bin/env python3
"""Generate tab-optimized bold seal favicons (high fill, 16px-readable)."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
APP_ICON = ROOT / "app" / "icon.png"

SIZE = 512
# Site brand blue (NavBar / buttons)
BLUE = (44, 95, 138, 255)  # #2C5F8A
WHITE = (255, 255, 255, 255)

FONT_CANDIDATES = [
    "/System/Library/Fonts/STHeiti Medium.ttc",
    "/System/Library/Fonts/Hiragino Sans GB.ttc",
    "/System/Library/Fonts/Supplemental/Songti.ttc",
    "/Library/Fonts/Arial Unicode.ttf",
]


def load_font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    for path in FONT_CANDIDATES:
        p = Path(path)
        if p.exists():
            try:
                return ImageFont.truetype(str(p), size=size, index=0)
            except OSError:
                continue
    return ImageFont.load_default()


def draw_bold_glyph(draw: ImageDraw.ImageDraw, xy: tuple[int, int], char: str, font) -> None:
    x, y = xy
    # Synthetic bold: tight offsets keep counters open at 16px
    offsets = [
        (0, 0),
        (1, 0),
        (-1, 0),
        (0, 1),
        (0, -1),
        (2, 0),
        (-2, 0),
        (0, 2),
        (0, -2),
        (1, 1),
        (-1, -1),
        (1, -1),
        (-1, 1),
    ]
    for dx, dy in offsets:
        draw.text((x + dx, y + dy), char, font=font, fill=WHITE)


def create_master() -> Image.Image:
    img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # ~96% seal footprint — minimal outer margin for tab "pop"
    margin = max(2, int(SIZE * 0.02))
    radius = int(SIZE * 0.14)
    draw.rounded_rectangle(
        (margin, margin, SIZE - margin - 1, SIZE - margin - 1),
        radius=radius,
        fill=BLUE,
    )

    char = "译"
    font_size = 430
    font = load_font(font_size)

    bbox = draw.textbbox((0, 0), char, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    x = (SIZE - tw) // 2 - bbox[0]
    y = (SIZE - th) // 2 - bbox[1] - int(SIZE * 0.03)

    draw_bold_glyph(draw, (x, y), char, font)
    return img


def save_ico(img: Image.Image, path: Path) -> None:
    sizes = [16, 32, 48]
    frames = [img.resize((s, s), Image.Resampling.LANCZOS) for s in sizes]
    frames[0].save(
        path,
        format="ICO",
        sizes=[(s, s) for s in sizes],
        append_images=frames[1:],
    )


def occupancy_ratio(img: Image.Image) -> float:
    """Share of pixels that are non-transparent and not near-white background."""
    px = img.convert("RGBA").load()
    filled = 0
    total = img.size[0] * img.size[1]
    for y in range(img.size[1]):
        for x in range(img.size[0]):
            r, g, b, a = px[x, y]
            if a > 16:
                filled += 1
    return filled / total


def main() -> None:
    master = create_master()
    occ = occupancy_ratio(master)
    print(f"Master visual occupancy (opaque pixels): {occ * 100:.1f}%")
    if occ < 0.9:
        print("WARNING: occupancy below 90% target")

    PUBLIC.mkdir(parents=True, exist_ok=True)

    master_path = PUBLIC / "favicon-master-512.png"
    master.save(master_path, format="PNG", optimize=True)

    exports: list[tuple[str, int]] = [
        ("favicon-16x16.png", 16),
        ("favicon-32x32.png", 32),
        ("apple-touch-icon.png", 180),
        ("android-chrome-192x192.png", 192),
        ("android-chrome-512x512.png", 512),
    ]

    for name, px in exports:
        out = master.resize((px, px), Image.Resampling.LANCZOS)
        out.save(PUBLIC / name, format="PNG", optimize=True)

    save_ico(master, PUBLIC / "favicon.ico")

    # Keep Next.js app/icon in sync (auto metadata)
    master.resize((512, 512), Image.Resampling.LANCZOS).save(APP_ICON, format="PNG", optimize=True)

    print("Wrote:")
    for p in [master_path, PUBLIC / "favicon.ico", APP_ICON, *[PUBLIC / n for n, _ in exports]]:
        print(f"  {p}")


if __name__ == "__main__":
    main()
