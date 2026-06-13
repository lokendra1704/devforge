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

Each slice file is written as <outdir>/<name>.txt with `===== PAGE N =====`
markers so you can cite exact pages while authoring.

Requires pypdf (preferred) or PyPDF2:  pip install pypdf
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


def main(argv: list[str]) -> None:
    if len(argv) < 3 or argv[1] not in {"outline", "sections", "slice"}:
        sys.exit(__doc__)
    if argv[1] == "outline":
        cmd_outline(argv[2])
    elif argv[1] == "sections":
        cmd_sections(argv[2])
    else:
        if len(argv) < 5:
            sys.exit("slice needs: <pdf> <outdir> <name:start:end> [more ...]")
        cmd_slice(argv[2], argv[3], argv[4:])


if __name__ == "__main__":
    main(sys.argv)
