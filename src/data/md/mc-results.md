## Does any of this actually move the needle?

The paper tests on **MetaClaw-Bench** — 934 questions across 44 simulated
workdays of real CLI tasks (file editing, JSON structuring, shell scripting),
split into Part I (346 Q, execution-heavy) and Part II (588 Q, rule-compliance
heavy) — plus a transfer test on **AutoResearchClaw**, a 23-stage autonomous
research pipeline.

Three conditions are compared: **Baseline** (no adaptation), **MetaClaw
(Skills)** (skill-driven adaptation only), and **MetaClaw (Full)** (skills +
RL, Kimi-K2.5 only — it needs a cloud LoRA endpoint).

### Table 1 — MetaClaw-Bench

| Model | Condition | Part I Acc. | Part I Compl. | Part II Acc. | Part II Compl. |
|---|---|---|---|---|---|
| GPT-5.2 | Baseline | 41.1% | 14.7% | 44.9% | 58.4% |
| GPT-5.2 | MetaClaw (Skills) | 44.0% | 17.1% | 49.1% | 67.5% |
| Kimi-K2.5 | Baseline | 21.4% | 2.0% | 21.1% | 18.2% |
| Kimi-K2.5 | MetaClaw (Skills) | 28.3% | 2.0% | 26.9% | 33.8% |
| Kimi-K2.5 | MetaClaw (Full) | **40.6%** | **16.5%** | **39.6%** | **51.9%** |

Two patterns jump out:

**Weaker models gain more.** GPT-5.2 starts from a higher baseline (41.1% vs
21.4%), leaving less headroom; Kimi-K2.5 lacks the implicit procedural
knowledge skills make explicit, so it gains +32.2% relative accuracy from
skills alone. MetaClaw (Full) on Kimi-K2.5 (40.6%) nearly closes the gap with
GPT-5.2's *baseline* (41.1%) — adaptation substituting for raw capability.

**Skills sharpen reasoning; only the full pipeline unlocks execution.** Look
at Part I completion for Kimi-K2.5: skills alone leave it flat at 2.0% — the
policy still can't reliably produce a zero-defect output even when it "knows"
the rule. MetaClaw (Full) jumps it to 16.5%, an **8.25× multiplier**. Skills
edit the prompt; only weight updates touch execution reliability itself.

### Table 2 — AutoResearchClaw (skills-only, no RL)

| Metric | Baseline | +MetaClaw (Skills) | Relative change |
|---|---|---|---|
| Stage retry rate (↓) | 10.5% | 7.9% | −24.8% |
| Refine cycle count (↓) | 2.0 | 1.2 | −40.0% |
| Pipeline stage completion (↑) | 18/19 | 19/19 | +5.3% |
| Composite robustness score (↑) | 0.714 | 0.845 | **+18.3%** |

Same skill evolver, *no domain-specific tuning*, transferred from CLI tasks to
a completely different workload (research-paper generation) — and it still
works. That's the cross-domain transfer claim: skills distilled from one kind
of failure ("citation formatting errors") generalize because they're
expressed in natural language, not task-specific code.

### The two-phase RL signature

Part II's per-day completion curve for MetaClaw (Full) on Kimi-K2.5 shows a
clean inflection at day 8: ~9% on days 1–4, climbing through 27–64% on days
5–10, reaching 100% by day 12. Skill-driven gains show up immediately;
RL-driven gains only kick in once the query buffer has accumulated enough
post-adaptation trajectories to give a stable gradient — exactly the
"adaptation happens in seconds, policy improvement happens in
minutes-to-hours" split from the first lesson, now visible in a learning
curve.
