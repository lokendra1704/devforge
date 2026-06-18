#!/usr/bin/env python3
"""Token-aware PDF inspector + slicer for onboarding a book or research paper as
a new subject.

The whole point: never load a large PDF into the model's context. This script
does the heavy reading on disk and emits only (a) a compact outline/heading list
you can plan from, and (b) per-chunk plaintext slices small enough to author one
at a time.

Usage:
  # 1. Inspect — page count + nested outline + per-chapter size estimates.
  #    Read THIS output to design the chapter -> module mapping. Do NOT read the PDF body.
  python slice_pdf.py outline "/path/to/Book.pdf"

  # 1b. For documents with no embedded outline (typical for research papers):
  #    best-effort detection of numbered/keyword section headings + page numbers.
  python slice_pdf.py sections "/path/to/Paper.pdf"

  # 2. Slice — extract only the page ranges you chose, one text file per chunk.
  #    Page numbers are 1-indexed and inclusive, matching what `outline`/`sections` print.
  python slice_pdf.py slice "/path/to/Book.pdf" ./.book-ingest \
      ch1:16:39 ch2:40:71 glossary:210:231

  # 3. Figures — list embedded raster images (real "Figure N" diagrams, not
  #    decorative icons) so you can decide which ones are worth reproducing
  #    exactly rather than redrawing in mermaid.
  python slice_pdf.py figures "/path/to/Paper.pdf"

  # 4. Extract-figure — pull one image out by its page + index (from `figures`
  #    above), flatten it onto a white background, optionally palette-quantize
  #    to shrink it, and write a PNG to disk.
  python slice_pdf.py extract-figure "/path/to/Paper.pdf" 3 0 ./.book-ingest/fig1.png --max-colors 64

Each slice file is written as <outdir>/<name>.txt with `===== PAGE N =====`
markers so you can cite exact pages while authoring.

Requires pypdf (preferred) or PyPDF2:  pip install pypdf
Figure extraction additionally requires Pillow:  pip install pillow
"""
import re
import sys
from pathlib import Path

try:
    from pypdf import PdfReader
except Exception:  # pragma: no cover - fallback for older envs
    try:
        from PyPDF2 import PdfReader  # type: ignore
    except Exception:
        sys.exit("Missing dependency: pip install pypdf")


def _reader(pdf_path: str) -> "PdfReader":
    p = Path(pdf_path).expanduser()
    if not p.exists():
        sys.exit(f"PDF not found: {p}")
    return PdfReader(str(p))


def cmd_outline(pdf_path: str) -> None:
    r = _reader(pdf_path)
    n = len(r.pages)
    total = sum(len(r.pages[i].extract_text() or "") for i in range(n))
    print(f"PAGES: {n}")
    print(f"TOTAL TEXT: {total} chars (~{total // 4} tokens)")
    print("=== OUTLINE (title -> 1-indexed page) ===")
    rows = []
    try:
        def walk(items, depth=0):
            for it in items:
                if isinstance(it, list):
                    walk(it, depth + 1)
                else:
                    try:
                        pg = r.get_destination_page_number(it) + 1  # -> 1-indexed
                    except Exception:
                        pg = "?"
                    rows.append(f"{'  ' * depth}- {it.title}  (p{pg})")
        walk(r.outline)
    except Exception as e:  # no outline embedded
        rows.append(f"(no embedded outline: {e})")
    print("\n".join(rows) if rows else "(empty outline)")
    print(
        "\nTIP: pick chapter boundaries from the outline above, then run `slice` "
        "with name:start:end args. Aim for chunks under ~12k tokens each."
    )


_NUMBERED_HEADING = re.compile(
    r"^(\d{1,2}(\.\d{1,2}){0,2})[\.\)]?\s+[A-Z][\w\s\-:,&]{1,60}$"
)
_SECTION_KEYWORDS = re.compile(
    r"^(abstract|introduction|background|preliminaries|related work|"
    r"motivation|problem statement|"
    r"method(ology)?|approach|system design|architecture|design|"
    r"implementation|algorithm|"
    r"experiments?|evaluation|setup|"
    r"results?|analysis|discussion|"
    r"limitations?|threats to validity|"
    r"conclusions?|future work|"
    r"acknowledg(e)?ments?|references|bibliography|appendix\w*)\s*$",
    re.IGNORECASE,
)


def cmd_sections(pdf_path: str) -> None:
    r = _reader(pdf_path)
    n = len(r.pages)
    total = sum(len(r.pages[i].extract_text() or "") for i in range(n))
    print(f"PAGES: {n}")
    print(f"TOTAL TEXT: {total} chars (~{total // 4} tokens)")
    print("=== DETECTED HEADINGS (best-effort; verify against the PDF) ===")

    found = []
    for i in range(n):
        text = r.pages[i].extract_text() or ""
        for line in text.splitlines():
            s = line.strip()
            if not s or len(s) > 80:
                continue
            if _NUMBERED_HEADING.match(s) or _SECTION_KEYWORDS.match(s):
                found.append((i + 1, s))

    if not found:
        print("(no heading-like lines found)")
    else:
        for pg, s in found:
            print(f"  p{pg}: {s}")

    print(
        "\nTIP: use these page numbers as slice boundaries. A typical paper is "
        "under ~15k tokens total (see TOTAL TEXT above) and can be sliced in "
        "1-3 chunks; see references/paper-workflow.md for the module/lesson "
        "mapping."
    )


def cmd_slice(pdf_path: str, outdir: str, specs: list[str]) -> None:
    r = _reader(pdf_path)
    n = len(r.pages)
    out = Path(outdir).expanduser()
    out.mkdir(parents=True, exist_ok=True)
    for spec in specs:
        try:
            name, start_s, end_s = spec.split(":")
            start, end = int(start_s), int(end_s)
        except ValueError:
            sys.exit(f"Bad spec '{spec}'. Expected name:start:end (1-indexed, inclusive).")
        parts = []
        for page_no in range(start, min(end, n) + 1):  # 1-indexed inclusive
            text = r.pages[page_no - 1].extract_text() or ""
            parts.append(f"\n\n===== PAGE {page_no} =====\n{text}")
        dest = out / f"{name}.txt"
        dest.write_text("".join(parts), encoding="utf-8")
        chars = sum(len(p) for p in parts)
        print(f"{dest}  pages {start}-{end}: {chars} chars (~{chars // 4} tokens)")


def cmd_figures(pdf_path: str, min_size: int = 120) -> None:
    """List embedded raster images per page: page, index, dimensions, approx KB.

    Filters out anything smaller than `min_size` px on either side by default —
    that's almost always a logo, icon, or letterhead mark, not a real figure.
    Use the (page, index) pair as the args to `extract-figure`.
    """
    r = _reader(pdf_path)
    print(f"=== EMBEDDED IMAGES >= {min_size}x{min_size}px ===")
    found = False
    for i, page in enumerate(r.pages):
        try:
            images = list(page.images)
        except Exception:
            images = []
        for idx, img in enumerate(images):
            try:
                w, h = img.image.size
            except Exception:
                continue
            if w < min_size or h < min_size:
                continue
            kb = len(img.data) // 1024 if getattr(img, "data", None) else 0
            print(f"  page {i + 1}  index {idx}  {w}x{h}  ~{kb}KB  ({img.name})")
            found = True
    if not found:
        print(
            "(none found at this size — the figure may be vector-drawn, not an "
            "embedded raster image. Fall back to rasterizing the whole page with "
            "`pdftoppm -png -r 300 -f N -l N in.pdf out` if available, then crop "
            "the figure region manually.)"
        )
    print(
        "\nTIP: only extract figures worth reproducing exactly — a real "
        "architecture/system diagram the source calls out as 'Figure N'. Don't "
        "extract plots/curves (turn those into a markdown table instead) or "
        "decorative images."
    )


def cmd_extract_figure(
    pdf_path: str, page_no: int, index: int, outfile: str, max_colors: int | None = None
) -> None:
    """Extract one embedded image (by 1-indexed page + 0-indexed `figures` index),
    flatten any transparency onto white, optionally palette-quantize to shrink
    the file, and save as a PNG."""
    try:
        from PIL import Image
    except Exception:
        sys.exit("Missing dependency: pip install pillow")

    r = _reader(pdf_path)
    if page_no < 1 or page_no > len(r.pages):
        sys.exit(f"Page {page_no} out of range (PDF has {len(r.pages)} pages).")
    images = list(r.pages[page_no - 1].images)
    if index < 0 or index >= len(images):
        sys.exit(f"Index {index} out of range (page {page_no} has {len(images)} image(s)).")

    img = images[index].image
    if img.mode in ("RGBA", "LA", "PA"):
        bg = Image.new("RGB", img.size, (255, 255, 255))
        bg.paste(img, mask=img.split()[-1])
        img = bg
    else:
        img = img.convert("RGB")

    if max_colors:
        img = img.convert("P", palette=Image.ADAPTIVE, colors=max_colors)

    out = Path(outfile).expanduser()
    out.parent.mkdir(parents=True, exist_ok=True)
    img.save(out, optimize=True)
    size_kb = out.stat().st_size // 1024
    print(f"{out}  {img.size[0]}x{img.size[1]}  {size_kb}KB")
    print(
        "\nNext: Read this PNG with the Read tool to eyeball it before using it "
        "— a figure with a confusingly cropped edge or wrong page is a wasted "
        "round trip otherwise."
    )


def main(argv: list[str]) -> None:
    commands = {"outline", "sections", "slice", "figures", "extract-figure"}
    if len(argv) < 3 or argv[1] not in commands:
        sys.exit(__doc__)
    if argv[1] == "outline":
        cmd_outline(argv[2])
    elif argv[1] == "sections":
        cmd_sections(argv[2])
    elif argv[1] == "slice":
        if len(argv) < 5:
            sys.exit("slice needs: <pdf> <outdir> <name:start:end> [more ...]")
        cmd_slice(argv[2], argv[3], argv[4:])
    elif argv[1] == "figures":
        min_size = int(argv[3]) if len(argv) > 3 else 120
        cmd_figures(argv[2], min_size)
    else:  # extract-figure
        # argv: [script, cmd, pdf, page, index, outfile, (--max-colors N)?]
        if len(argv) < 6:
            sys.exit("extract-figure needs: <pdf> <page> <index> <outfile.png> [--max-colors N]")
        max_colors = None
        if len(argv) > 7 and argv[6] == "--max-colors":
            max_colors = int(argv[7])
        cmd_extract_figure(argv[2], int(argv[3]), int(argv[4]), argv[5], max_colors)


if __name__ == "__main__":
    main(sys.argv)
