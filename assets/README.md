# Unicrew Socials — Image Slots

Drop image files into the folders below using the exact filenames listed.
Missing images fall back to cinematic gradients automatically — the site
never breaks.

## /assets/reel/  — Standard section reel (auto-cycling, 9:12 portrait)

| File          | Caption shown                | Recommended crop / mood         |
| ------------- | ---------------------------- | ------------------------------- |
| reel-01.jpg   | CINEMATIC · LIGHTING         | Hero portrait, low-key light    |
| reel-02.jpg   | MACRO · DETAIL               | Tight macro / texture frame     |
| reel-03.jpg   | EDITORIAL · DESIGN           | Editorial layout / typography   |
| reel-04.jpg   | BILINGUAL · STORY            | Lifestyle / story-driven still  |

- Aspect: portrait, ideally **1080×1440** (9:12) or taller.
- Format: `.jpg` preferred (lighter); `.png` also works if you keep filename.
- Each slide auto-zooms slightly on enter — clean centred subjects work best.

## /assets/work/  — Selected Work grid (8 tiles, mixed sizes)

| File          | Tile size in grid    | Default caption shown            |
| ------------- | -------------------- | -------------------------------- |
| work-01.jpg   | Large (7×2) hero     | Hospitality — "Cinematic plating, low-key light." |
| work-02.jpg   | Wide (5×1)           | Luxury Retail — "Macro craft on every finish." |
| work-03.jpg   | Wide (5×1)           | Real Estate — "Cinematic property storytelling." |
| work-04.jpg   | Square (4×1)         | Wellness — "Trust, finished with restraint." |
| work-05.jpg   | Tall (4×2)           | Founder Brand — "Authority, on camera." |
| work-06.jpg   | Square (4×1)         | F&B — "A menu, made to scroll-stop." |
| work-07.jpg   | Wide (5×1)           | Emerging Premium — "A new brand, built on craft." |
| work-08.jpg   | Small (3×1)          | Lifestyle — "Editorial, not templated." |

- Aspect: any — images are `object-fit: cover` cropped to fit each tile.
- Recommended source: **≥ 1600px on the long edge** for retina sharpness.
- Format: `.jpg` preferred. Keep individual files **under ~600 KB** if possible.

## Optional renaming / re-captioning

The captions and categories sit in `index.html` inside the
`<section class="section work">` block — search for `data-cat=` to find
each tile. Update text in `.work-cat` and `.work-brand` as needed.

## Quick check

After dropping files, hard-refresh the page (Cmd/Ctrl + Shift + R).
If a tile still shows a gradient, the file isn't being served — check
the filename casing matches **exactly** (case-sensitive on most servers).
