# Family photos

Drop any photos here — **any filename** works (e.g. `beach-day.jpg`, `birthday.png`).

Supported formats: **JPG, PNG, WebP, GIF** (convert HEIC to JPG first).

## After adding or removing photos

Run this from the project folder:

```bash
python scripts/generate-gallery.py
```

That updates `manifest.json`, which the website reads to build the carousel and landing-page polaroids.

Photos are shown in **alphabetical order** by filename. Captions are generated from the filename (e.g. `beach-day.jpg` → “Beach Day”).

The first four photos also appear as polaroids on the home screen.
