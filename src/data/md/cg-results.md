# Does the infrastructure actually buy you anything, or is it just plumbing?

You've now seen the whole pipeline: parallel environments, GiGPO with dense step-level rewards, a reproducibility-pinned eval harness. It's a lot of engineering. But engineering for its own sake is worthless in a paper — the only question that matters is: **did any of it move the number?**

The authors trained **ClawGUI-2B** from the **MAI-UI-2B** base model, using 64 parallel virtual environments across 8×A6000 GPUs, with GiGPO (rollout group size 8, lr 1e-6, 3 epochs). They evaluated on **MobileWorld GUI-Only** — 117 real mobile tasks solved purely through screen taps, no programmatic shortcuts, capped at 50 steps per episode, scored by Success Rate (SR).

## Finding 1: infrastructure drives policy quality

ClawGUI-2B and MAI-UI-2B start from **identical base weights**. The only difference is what happens during training — ClawGUI-RL's environment management and reward design. That alone took SR from 11.1% to 17.1%.

| Model | Base weights | MobileWorld SR |
|---|---|---|
| MAI-UI-2B | shared | 11.1% |
| ClawGUI-2B | shared (RL-trained) | 17.1% |

That's **+6.0 absolute points**, a **~54% relative gain** — entirely attributable to training infrastructure, not architecture.

## Finding 2: small, well-trained beats large and untrained

| Model | Size | MobileWorld SR |
|---|---|---|
| Qwen3-VL-32B | 32B | 11.9% |
| UI-Venus-72B | 72B | 16.4% |
| **ClawGUI-2B** | **2B** | **17.1%** |

A 2B model, trained with real environment interaction, beats a 72B model that never saw an RL signal. Scale alone isn't the lever here — *online interaction with real consequences* is.

## Finding 3: agentic frameworks are a different game

| Model | MobileWorld SR |
|---|---|
| Gemini-3-Pro + UI-Ins-7B | 55.6% |
| GPT-5 + UI-Ins-7B | 54.0% |
| **ClawGUI-2B** (end-to-end) | **17.1%** |

These numbers look devastating until you read the fine print: they pair a closed-source frontier *planner* with a small open *grounding* module. You can't retrain the planner, can't optimize it end-to-end, and can't deploy it without an API key to a model you don't control. It's a different regime — complementary, not competing — being compared apples-to-oranges if you stop at the raw percentage. (Table 1, §4.2)

## The reward ablation: density beats coarseness

Section 4.3 isolates *why* the infrastructure helps: dense, step-level reward.

| Method | Reward type | SR |
|---|---|---|
| GRPO | binary, episode-level | 14.5% |
| GiGPO | dense, episode- + step-level | 17.1% |

Swapping the reward signal alone — same model, same environments — is worth **+2.6 absolute points**, a **~17.9% relative gain**. A misclick three steps in shouldn't get the same credit as the move that actually finished the task; GiGPO's anchor-state grouping is what lets the optimizer tell the difference. (Table 2, §4.3)

## Can you trust any of these numbers?

Section 4.4 turns the question on the field itself: GUI benchmarks are famously hard to reproduce — prompt format, coordinate conventions, image resolution, and sampling temperature all quietly shift reported numbers. ClawGUI-Eval pins every evaluation choice and reproduces **46 of 48 cells (95.8%)** against officially published baselines across 6 benchmarks and 11+ models. The two misses both involve models whose official eval configuration was never disclosed — meaning the irreproducibility was a transparency problem, not a fundamental limit. (Table 3, §4.4)
