#!/usr/bin/env python3
"""Ensure all raster images are WebP and <= 100 KB."""
from __future__ import annotations

import io
import sys
from pathlib import Path

from PIL import Image

MAX_BYTES = 100 * 1024
RASTER_EXT = {".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"}
ROOT = Path(__file__).resolve().parents[1]
SKIP_DIRS = {".git", "node_modules", ".cursor", "__pycache__"}


def iter_images(root: Path):
    for path in root.rglob("*"):
        if not path.is_file():
            continue
        if any(part in SKIP_DIRS for part in path.parts):
            continue
        if path.suffix.lower() in RASTER_EXT:
            yield path


def save_webp(img: Image.Image, quality: int) -> bytes:
    buf = io.BytesIO()
    img.save(buf, format="WEBP", quality=quality, method=4)
    return buf.getvalue()


def compress_to_limit(img: Image.Image) -> tuple[bytes, int, tuple[int, int]]:
    work = img
    if work.mode not in ("RGB", "RGBA"):
        work = work.convert("RGBA" if "A" in work.getbands() else "RGB")

    for quality in (82, 72, 62, 52, 42, 32):
        data = save_webp(work, quality)
        if len(data) <= MAX_BYTES:
            return data, quality, work.size

    # Resize down if quality alone is not enough
    w, h = work.size
    for scale in (0.9, 0.8, 0.7, 0.6, 0.5):
        nw = max(1, int(w * scale))
        nh = max(1, int(h * scale))
        resized = work.resize((nw, nh), Image.Resampling.LANCZOS)
        for quality in (72, 62, 52, 42):
            data = save_webp(resized, quality)
            if len(data) <= MAX_BYTES:
                return data, quality, resized.size

    data = save_webp(work.resize((max(1, w // 2), max(1, h // 2)), Image.Resampling.LANCZOS), 40)
    return data, 40, (max(1, w // 2), max(1, h // 2))


def process(path: Path) -> str | None:
    before = path.stat().st_size
    if path.suffix.lower() == ".webp" and before <= MAX_BYTES:
        return None

    img = Image.open(path)
    data, quality, size = compress_to_limit(img)

    out = path.with_suffix(".webp")
    out.write_bytes(data)
    if out != path and path.exists():
        path.unlink()

    after = out.stat().st_size
    if after > MAX_BYTES:
        return f"FAIL {out.relative_to(ROOT)} still {after / 1024:.1f} KB"

    if before > MAX_BYTES or path.suffix.lower() != ".webp" or out != path:
        return (
            f"OK {out.relative_to(ROOT)}: {before / 1024:.1f} KB -> {after / 1024:.1f} KB "
            f"(q={quality}, {size[0]}x{size[1]})"
        )
    return None


def main() -> int:
    changed = []
    failures = []
    for path in sorted(iter_images(ROOT)):
        try:
            msg = process(path)
            if msg:
                if msg.startswith("FAIL"):
                    failures.append(msg)
                else:
                    changed.append(msg)
        except Exception as exc:
            failures.append(f"ERROR {path.relative_to(ROOT)}: {exc}")

    print(f"Processed {len(list(iter_images(ROOT)))} images")
    for line in changed:
        print(line)
    for line in failures:
        print(line, file=sys.stderr)

    over = [
        p for p in iter_images(ROOT)
        if p.stat().st_size > MAX_BYTES
    ]
    if over:
        print(f"\nStill over 100 KB: {len(over)}", file=sys.stderr)
        for p in over:
            print(f"  {p.relative_to(ROOT)}: {p.stat().st_size / 1024:.1f} KB", file=sys.stderr)
        return 1

    print("\nAll images are WebP and <= 100 KB.")
    return 0 if not failures else 1


if __name__ == "__main__":
    raise SystemExit(main())
