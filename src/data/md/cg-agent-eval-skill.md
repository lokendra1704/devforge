# Evaluation becomes a one-line command

Earlier in this paper, ClawGUI-Eval is a pipeline: verify the environment, run inference, judge outputs, compute metrics. Normally that means someone writing and babysitting a script. ClawGUI-Agent erases that step by exposing **ClawGUI-Eval as a built-in tool skill**.

Send the agent a plain instruction — "benchmark Qwen3-VL on ScreenSpot-Pro" — and it runs the whole pipeline itself:

1. **Environment verification** — confirms the benchmark and model are ready to run.
2. **Multi-GPU parallel inference** — launches and manages the inference job.
3. **Judging** — applies the benchmark-appropriate judge to raw outputs.
4. **Metrics** — aggregates results and returns a structured report compared against official baselines.

> "...without writing a single script." — *Section 3.4.4*

The point isn't just convenience for researchers. It's the same infrastructure doing double duty: the hybrid CLI-GUI control and skill system built to put a *personal assistant* in users' hands is exactly what makes the *research tooling* accessible through one natural-language interface. Deployment and evaluation stop being separate concerns — they're the same loop, pointed at different goals.
