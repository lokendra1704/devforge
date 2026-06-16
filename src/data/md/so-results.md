# What SkillOpt Delivers

## 52 out of 52

SkillOpt is evaluated across six benchmarks × seven target models × three execution harnesses (direct chat, Codex, Claude Code) — 52 (model, benchmark, harness) cells in total. It is **best or tied-best on all 52**.

| Model | Direct-chat avg gain over no-skill |
|---|---|
| GPT-5.5 | **+23.5 pts** |
| GPT-5.4-nano (smallest) | **+26.7 pts** |
| Qwen3.5-4B | **+19.2 pts** |
| Average across 7 models | **+17.6 pts** |

Under tool-backed execution (GPT-5.5): **+24.8 pts** over no-skill on the Codex harness, **+19.1 pts** on Claude Code.

## Why procedural benchmarks gain most

> "Procedural benchmarks see the largest improvements: SpreadsheetBench 41.8 → 80.7, OfficeQA 33.1 → 72.1 [...] on GPT-5.5." — *Section 4.1*

Tasks with strict tool-use conventions and answer-format requirements expose what zero-shot frontier models lack: procedural discipline. Skills can supply exactly that. Factual QA like SearchQA (no-skill baseline already at 77.7%) gains only +9.6 pts — there's less gap for procedures to fill.

The improvement also scales *down* the model stack. A compact skill artifact supplies procedural knowledge that smaller models don't hold in their weights: GPT-5.4-nano nearly doubles on DocVQA and triples on ALFWorld.

## Skills transfer across three axes

Optimizing once yields a reusable artifact:

| Transfer axis | Example | Gain |
|---|---|---|
| Cross-model | GPT-5.4 SpreadsheetBench skill → GPT-5.4-mini | +9.4 pts (82% of in-domain gain) |
| Cross-harness | Codex SpreadsheetBench skill → Claude Code | +59.7 pts (exceeds in-domain) |
| Cross-benchmark | OlympiadBench skill → Omni-MATH | +3.7 pts (GPT-5.4) |

The cross-harness result stands out: a skill trained inside Codex transfers to Claude Code with gains that *exceed* in-domain Claude Code optimization. The learned rules encode workbook semantics (structure-first inspection, static-value materialization, formula verification) — not harness-specific command syntax.

## Edit economy: big gains from tiny artifacts

| Benchmark | Accepted edits | Test-set gain |
|---|---|---|
| LiveMathematicianBench | **1** edit | +29.3 pts |
| OfficeQA | **1** edit | +39.0 pts |
| DocVQA | 3 edits | +12.4 pts |
| SpreadsheetBench | 4 edits | +38.9 pts |

Final `best_skill.md` sizes: **379–1,995 tokens** — readable in minutes. A single accepted edit on OfficeQA produced a +39 pt gain:

> *"Treat oracle parsed pages as primary evidence, lock table/date/unit context, and output exactly the requested rounded value without extra labels."* — *Figure 4*

The optimizer proposes many edits per epoch; the validation gate discards all but the handful that pass the held-out check. The deployed skill is the residue of that filter — compact because most proposals didn't survive.

## Training cost is paid once

| Benchmark | Total training tokens | Tokens per test-point gained |
|---|---|---|
| SpreadsheetBench | 21.4M | 0.6M / pt |
| OfficeQA | 20.8M | 1.1M / pt |
| LiveMath | 23.2M | 3.6M / pt |
| SearchQA | 213.8M | 37.9M / pt |

Short, cheap rollouts cost 0.6–3.6M tokens per gained test-set point. Longer trajectories with richer multimodal context cost an order of magnitude more. All costs are paid once during offline skill training — after export, `best_skill.md` adds no optimizer calls and no weight changes to the deployed agent.
