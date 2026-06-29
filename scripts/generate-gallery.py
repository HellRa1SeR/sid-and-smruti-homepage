#!/usr/bin/env python3
"""Scan images/gallery/ and write manifest.json for the website."""

import json
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
GALLERY_DIR = ROOT / "images" / "gallery"
EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
SKIP = {"manifest.json"}


def caption_from_filename(filename: str) -> str:
    """Use the filename without extension, exactly as named."""
    return Path(filename).stem.strip() or "Photo"


def main() -> None:
    images = []
    for path in sorted(GALLERY_DIR.iterdir()):
        if not path.is_file():
            continue
        if path.name.lower() in SKIP or path.name.startswith("."):
            continue
        if path.suffix.lower() not in EXTENSIONS:
            continue
        images.append({
            "file": path.name,
            "src": f"images/gallery/{path.name}",
            "caption": caption_from_filename(path.name),
        })

    manifest = {
        "generated": datetime.now(timezone.utc).isoformat(),
        "images": images,
    }
    out = GALLERY_DIR / "manifest.json"
    out.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(images)} image(s) to {out.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
