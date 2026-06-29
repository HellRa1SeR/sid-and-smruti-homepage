# Family photos

Drop any photos here — **any filename** works (e.g. `beach-day.jpg`, `birthday.png`).

Supported formats: **JPG, PNG, WebP, GIF** (convert HEIC to JPG first).

## Adding photos

1. Copy images into this folder
2. Commit and push to GitHub

A **GitHub Action** automatically regenerates `manifest.json` when gallery files change — you don’t need to run Python locally.

To update manually (optional):

```bash
python scripts/generate-gallery.py
```

Photos are shown in **alphabetical order** by filename. The caption is the **filename without the extension** (e.g. `at the florida beach!.jpg` → “at the florida beach!”).

The first four photos also appear as polaroids on the home screen.
