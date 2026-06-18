# Reproducing real figures from the source (not redrawn diagrams)

[diagrams.md](diagrams.md) covers diagrams **you draw** in mermaid to make a
reasoning step visible. This file covers the opposite case: the source has a real
figure — an architecture box diagram, a system diagram, a multi-panel illustration
— that's worth reproducing **exactly**, pixel for pixel, because redrawing it would
lose fidelity or because the figure itself is what the paper is known for (e.g. the
canonical Transformer "Figure 1").

## When to extract vs. when to draw vs. when to skip

| The source has… | Do this |
|---|---|
| A named "Figure N" that's an architecture/system/model diagram | **Extract it** (this file) |
| A relationship you're explaining for teaching purposes that isn't a literal figure in the source (e.g. comparing two control-flow paths) | **Draw it** in mermaid ([diagrams.md](diagrams.md)) — editable, themed, no asset to manage |
| A plot, curve, bar chart, or scatter plot | **Skip the image.** Mermaid can't render charts and a screenshot of axes/legends rarely reads well at lesson width. Pull 2–4 headline numbers into a markdown table instead |
| A tiny logo, watermark, or decorative mark | Skip entirely |

If you're unsure whether a diagram is "the source's own figure" or "a relationship
worth visualizing," default to mermaid — it's editable, themeable, and adds no
binary asset to the repo. Reach for extraction only when fidelity to the original
genuinely matters.

## Step by step

**1. List embedded images.**

```bash
python .claude/skills/onboard-book/scripts/slice_pdf.py figures "$PDF"
```

Prints every embedded raster image ≥120×120px with its 1-indexed page and
0-indexed position on that page, e.g. `page 3  index 0  1520x2239  ~153KB`. Tiny
icons/logos are filtered out by default (`--min-size` to change the threshold).
If the figure you want isn't listed, it's probably vector-drawn rather than an
embedded raster — see the fallback note the command prints in that case.

**2. Extract the one(s) you want.**

```bash
python .claude/skills/onboard-book/scripts/slice_pdf.py extract-figure "$PDF" 3 0 \
    .book-ingest/<prefix>-fig1.png --max-colors 64
```

This composites any transparency onto white, then optionally palette-quantizes
(`--max-colors`) to shrink the file — diagrams with flat colors (the common case)
compress hard with no visible quality loss; drop the flag for photos or anything
with gradients/halftones. Output lands in the gitignored `.book-ingest/` scratch
dir first, not the final location.

**3. Eyeball it before using it.**

`Read` the extracted PNG. Confirm it's the right figure, not cropped oddly, and
not a stray sub-image (some PDFs embed a figure as 2+ separate image objects — if
the listing shows two suspiciously adjacent images, extract both and compare).

**4. Move it to its final, committed location.**

```bash
mkdir -p src/data/img
mv .book-ingest/<prefix>-fig1.png src/data/img/<prefix>-fig1.png
```

`src/data/img/` is a sibling of `src/data/md/` — real committed binary assets,
**not** scratch. Don't put figures in `.book-ingest/` permanently; that directory
is gitignored and disappears.

**5. Reference it in the read-step markdown with a placeholder, not a real path.**

```markdown
![Figure 1: The Transformer model architecture, Section 3](FIGURE:<prefix>-fig1)
```

The placeholder token is `FIGURE:<prefix>-fig<N>` — anything unique and greppable
works, but stay consistent. **Never inline a base64 data URI directly in the `.md`
file.** It works (the renderer accepts any valid `<img src>`), but a single
diagram-sized PNG encodes to 70–90k characters of base64 text, which pushes the
file past the Read tool's context limit on every future edit — you cannot reopen
that file with the Read tool again. It also can't be cached or deduped by the
browser the way a real asset URL can.

**6. Resolve the placeholder at import time, in the subject's `.ts` file.**

```ts
import topicMd from './md/<prefix>-topic.md?raw'
import fig1Url from './img/<prefix>-fig1.png'

const topicMdResolved = topicMd.replace('FIGURE:<prefix>-fig1', fig1Url)
```

Use `topicMdResolved` (not the raw import) as the `read` step's `markdown` value.
Vite's default import for a non-JS asset resolves to a real URL string —
base-path-aware (`/devforge/assets/...`) and content-hashed in production — so
this works correctly in both `npm run dev` and the production build without any
hardcoded path. Confirmed against this repo's actual `vite.config.ts` (`base:
'/devforge/'`): the import resolves to `/devforge/assets/<name>-<hash>.png` and
the file lands in `dist/assets/`.

If a lesson has multiple extracted figures, repeat the import + `.replace()` per
figure, or chain `.replace(...).replace(...)` — each placeholder token is unique
so order doesn't matter.

## Validation

- The build and `curriculum.test.ts` **do not** check markdown content, so a typo
  in the placeholder token (mismatched between the `.md` file and the `.ts`
  `.replace()` call) won't fail either — the literal placeholder text will leak
  into the rendered page instead of an image, silently.
- Same browser-render requirement as mermaid diagrams (see SKILL.md Step 6): open
  the lesson in `npm run dev` and confirm the image actually appears, not a broken
  image icon or literal `FIGURE:...` text.
- If the browser tool is unavailable, you can't grep-validate an `<img>` the way
  you can mermaid syntax — at minimum confirm the PNG itself isn't corrupted
  (`file src/data/img/<prefix>-*.png` should report `PNG image data`) and that
  every placeholder token in the `.md` file has an exact-match `.replace()` call
  in the `.ts` file (`grep -o 'FIGURE:[a-z0-9-]*' src/data/md/<prefix>-*.md` vs.
  the literals in the subject file).

## Don't forget at commit time

`src/data/img/<prefix>-*.png` are real assets — include them in Step 7's `git
add`, alongside the `.ts` and `.md` files:

```bash
git add src/data/<subject-id>.ts src/data/md/<prefix>-*.md src/data/img/<prefix>-*.png src/data/index.ts
```
