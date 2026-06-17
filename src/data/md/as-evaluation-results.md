## Does any of this actually move the needle?

ASTRA is evaluated on three agentic multi-turn benchmarks — **BFCL-MT** (BFCL v3 Multi-Turn), **τ2-Bench**, and **ACEBench** — plus two non-agentic math benchmarks (**AIME 2024/2025**) to check the training didn't quietly damage general reasoning while specializing for tool use.

**Headline result (Table 1):** at matched parameter scale, ASTRA-trained models beat every other open-source model of comparable size, and close most of the gap to closed-source frontier models:

| Model | BFCL-MT Overall | τ2-Bench Overall | ACEBench Overall |
|---|---|---|---|
| Claude-Opus-4.5 (closed) | 68.38 | 85.79 | 82.09 |
| GLM-4.6 (open, similar scale) | 68.00 | 69.63 | 80.00 |
| Qwen3-32B (untrained base) | 49.63 | 49.70 | 59.79 |
| **Astra-32B-thinking-v1** | **64.25** | **63.70** | **71.88** |
| Qwen3-14B (untrained base) | 44.50 | 46.05 | 51.67 |
| **Astra-14B-thinking-v1** | **58.13** | **57.69** | **68.96** |

That's a roughly +14 to +17 point jump over the untrained base model at both scales — bigger than the gap between several name-brand closed models in the table.

**Where does the gain come from — SFT or RL?** Table 2 breaks it down stage by stage on the 32B model:

| Stage | BFCL-MT Overall | Δ vs. base | τ2-Bench Overall | Δ vs. base |
|---|---|---|---|---|
| Qwen3-32B (base) | 47.88 | — | 49.70 | — |
| + SFT | 52.13 | +4.25 | 52.30 | +2.60 |
| + RL | 64.25 | **+16.38** | 63.70 | **+14.00** |

> "Table 2 further indicates that both the SFT and RL stages deliver consistent gains, **with the RL stage contributing the largest improvement**." — *Section 3.3.3*

SFT alone is worth a few points — a real but modest cold-start improvement. RL on top of that cold start is worth roughly four times as much. This matches the architectural story from Module 1: SFT gives the policy fluent tool-use mechanics; RL is what actually teaches it to solve hard, multi-hop problems by exploring the verifiable environments from Module 3.

**Did it cost anything?** Table 3 shows AIME 2024/2025 scores essentially unchanged before and after ASTRA training (e.g., Qwen3-32B: 74.90 avg → ASTRA-32B: 74.85 avg) — tool-use specialization didn't trade away core mathematical reasoning.

> **Wait — wouldn't heavy RL on tool-use tasks risk catastrophic forgetting of general reasoning?** Apparently not here, and that's worth noticing: the RL signal is trajectory-level reward on *tool-use behavior specifically*, not a wholesale rewrite of the policy's reasoning style — so capabilities the reward never touches (math) stay intact.
