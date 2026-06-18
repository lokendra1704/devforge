# Paper workflow (research papers, surveys, technical reports)

How the book workflow's steps adapt when the source is a research paper instead
of a textbook chapter. This document replaces SKILL.md Steps 1–2 and adds rules
to Step 4; Steps 3, 5, 6 in SKILL.md are unchanged.

## 1. Detect paper vs book

Run `slice_pdf.py outline "$ARGUMENTS"` first. Signs it's a paper:
- Page count roughly 5–60 (textbooks are 100+).
- The outline is empty (`(empty outline)` / `(no embedded outline: ...)`) — papers
  rarely ship PDF bookmarks.
- The `TOTAL TEXT` estimate is small enough that the *whole paper* fits in one or
  two slices (~10–15k tokens).

If the outline is empty, run:

```bash
python .claude/skills/onboard-book/scripts/slice_pdf.py sections "$ARGUMENTS"
```

This scans for numbered headings (`3.1 Method`) and common section keywords
(Abstract, Introduction, Related Work, Method, Results, Discussion, Conclusion,
...) and prints their 1-indexed page numbers. Use those as your slice boundaries.
If nothing is detected (some PDFs extract headings as styled body text with no
distinguishing line break), fall back to fixed ~5-page chunks and skim the first
lines of each.

## 2. Subject / module / lesson mapping

- **Single-contribution paper** (most conference papers): the whole paper is
  **one module**. Derive `Subject.id` and `prefix` from the paper's
  technique/system name (e.g. a paper introducing "FlashAttention" → id
  `flash-attention`, prefix `fa`). Pick 3–6 lessons that walk the paper's own arc:

  1. **Motivation** (`read`) — from Abstract + Introduction: what problem, why
     prior approaches fall short. Quote the paper's own framing of the gap.
  2. **Background** (`read`, optional) — only if the method needs a prerequisite
     concept the reader won't already have (e.g. the standard attention mechanism
     before FlashAttention's IO-aware algorithm). Skip if the audience already
     knows it — don't pad.
  3. **Core approach** (`read` + diagrams) — the method/architecture section.
     Reproduce the paper's main figure (architecture diagram, algorithm flow, data
     flow) — either as a mermaid diagram, or, when it's a named figure where exact
     fidelity matters (a model architecture box diagram like a Transformer's
     "Figure 1"), extracted directly from the PDF. See
     [diagrams.md](diagrams.md), [figures.md](figures.md), and §4 below.
  4. **Results** (`read`, + `code` if there's a clean formula) — turn the headline
     numbers into a markdown table; add a `code` challenge only if the paper
     states a derivable relationship (e.g. memory O(N) vs O(N²), a speedup ratio,
     a latency/percentile formula).
  5. **Critique** (`scenario`) — build stages from the paper's own limitations /
     threats-to-validity / comparison-to-prior-work discussion: "you're choosing
     between X and Y for system Z — which fits, and why?"
  6. **Comprehension quiz** (`quiz`, optional) — terminology + "why does the
     mechanism work" questions, only on concepts already taught in (1)–(4).

- **Survey paper** (covers many techniques): treat each major surveyed cluster as
  its own module, with the same per-module lesson shape as above but scoped to
  that cluster. The survey's own section structure usually gives you the module
  boundaries directly.

Confirm scope with the user before authoring if the paper is dense or the mapping
is ambiguous (e.g. survey with overlapping clusters) — use `AskUserQuestion`.

## 3. Slicing

Papers are short — usually 1–3 slices covers the whole thing:

```bash
python .claude/skills/onboard-book/scripts/slice_pdf.py slice "$ARGUMENTS" ./.book-ingest \
    front:1:4 method:5:9 results:10:14
```

If the whole paper is under ~12k tokens (check the `outline`/`sections` output's
`TOTAL TEXT` estimate), one slice covering all pages is fine — `paper:1:N`.

## 4. Authoring differences from books

- **Citations**: cite `Section 3.2`, `Figure 2`, `Table 1`, `Eq. 4` — not
  chapter/page.
- **Figures → diagrams or extraction**: an architecture/system diagram you're
  redrawing for teaching clarity → `flowchart`; a request/data flow with ordering
  → `sequenceDiagram`; an algorithm's control flow → `flowchart`. See
  [diagrams.md](diagrams.md) for syntax, node-count limits, and the quality bar.
  But when the figure is the paper's own named diagram and exact fidelity matters
  more than editability (the canonical "Figure 1" architecture box diagram is the
  common case), extract it from the PDF instead of redrawing — see
  [figures.md](figures.md) for `slice_pdf.py figures`/`extract-figure` and the
  placeholder-token convention for embedding it.
- **Plots/curves → tables, not diagrams**: mermaid can't draw line/bar charts. Pull
  2–4 headline numbers from a results figure or table into a markdown table
  instead of attempting to diagram it.
- **Quote the abstract and the core-insight sentence**: a paper's abstract and the
  sentence that states its central idea are usually the tightest writing in the
  document — quote them (trimmed) rather than paraphrasing, per "Quote the source,
  don't paraphrase" in [SKILL.md](../SKILL.md).
- **Code challenges**: only add one where the paper gives a closed-form
  relationship you can compute (complexity, memory, throughput/latency math). Most
  evaluation sections are empirical curves with no formula — skip `code` for those
  rather than forcing it.

See also [subject-schema.md §"What fits which step (for a research paper)"](subject-schema.md#what-fits-which-step-for-a-research-paper)
for the step-type mapping.
