# What delegation buys, and what it costs

The headline claim: across three benchmarks and three main agents, the best
explorer-augmented run **beats direct solving every time** — higher score *and* fewer
main-agent tokens (*Section 4.2, Table 1*).

The biggest accuracy gains land on the hardest benchmark, SWE-bench Pro:

| Main agent | Direct score | + FastContext | Δ |
| --- | --- | --- | --- |
| GPT-5.4 | 46.0 | **51.5** | +5.5 |
| GLM-5.1 | 17.5 | **22.5** | +5.0 |
| Kimi-K2.6 | 31.0 | **33.5** | +2.5 |

And the token savings are large where exploration dominated. On SWE-QA the GPT-5.4
main agent uses **60.3% fewer** tokens; even the trained 4B explorers still cut ~50%.
"Every explorer-augmented setting uses fewer main-agent tokens than direct solving"
(*Section 4.2*).

## The surprising result: small + RL beats big + SFT

The 4B models are the deployment targets (exploration should be *cheap*). The question
was whether a compact explorer could compete. It can:

> "The 4B-RL explorer can outperform the larger 30B-SFT explorer. On GLM-5.1 SWE-bench
> Pro, 4B-RL reaches **22.5 versus 20.0** for 30B-SFT while using fewer tokens." —
> *Section 4.3*

And RL reliably beats its own SFT base: "Compared with 4B-SFT, 4B-RL improves or ties
the score in **all nine** end-to-end settings." That's the paper's core design payoff —
task-grounded RL gives a small explorer without an expensive 30B-RL run.

Standalone localization on SWE-bench Verified (*Table 2*) confirms *why*: trained
FastContext checkpoints reach **73.71 file-level F1** and **60.35 module-level F1**,
versus 68.57 / 50.88 for the best non-FastContext baselines.

## Is the subagent's own cost hiding the savings?

> **Fair question — the explorer burns tokens too.** The Table 1 numbers only count
> the *main-agent* trajectory, so the audit in *Appendix B / Table 3* makes the
> overhead explicit:

| GPT-5.4 on SWE-bench Multilingual | Tokens | Est. API cost |
| --- | --- | --- |
| Direct main agent | 457k / task | $282.47 |
| Main + 4B-RL | 338k / task | $208.92 |
| 4B-RL explorer (162 invocations) | 22.58M total | $4.52 |
| **Net saving** | — | **$69.03** |

Even priced through a conservative serverless tier, the explorer is just **2.1%** of
the augmented total — and in the intended deployment it runs locally, so that per-token
cost isn't even incurred. The overhead is real but marginal.
