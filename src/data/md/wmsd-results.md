# Did the student actually beat the teacher?

WMSD makes two claims that sound almost contradictory — *the student learns only from the teacher*, yet *the student surpasses the teacher*. The experiments test exactly that, on a benchmark the authors built for it.

## The benchmark: WorldTasks-Bench

200 image–task pairs, each generated video judged by a VLM on three axes:

| Metric | Question it answers |
|---|---|
| **Task Score** | Did the video complete the task? |
| **Agent Score** | Did the *intended* agent do it (not some bystander)? |
| **Realism Score** | Is the physics/motion plausible? |

The training data (WorldTasks) is 20,000 unlabeled images expanded by a VLM into **146,440 task prompts** after filtering — no human-curated task videos anywhere in the pipeline.

## Result 1 — on-policy beats off-policy

> "after approximately 60 training steps, off-policy self-distillation saturates, whereas both on-policy variants continue to improve... The full on-policy self-distillation objective... achieves the best overall performance." — *Section 4.2*

This is Proposition 1 and the "practice on your own road" argument paying off in numbers: matching the teacher on the *student's* trajectories keeps improving where off-policy flatlines.

## Result 2 — RL lets the student pass the teacher

> "combining on-policy self-distillation with RL substantially improves task-solving performance and enables the student to surpass the demonstrator... In contrast, standard RL alone... quickly plateaus and yields no further gains." — *Section 4.3*

Two takeaways: distillation + RL **beats the Demonstrator**, and RL *without* the distillation/anchor structure stalls early. Neither ingredient is sufficient alone.

## Result 3 — the head-to-head table

`WMSD` applied to two base video models, against an SFT baseline and a VLM-outsourcing baseline (Table 1, selected rows):

| Method | Task ↑ | Agent ↑ | Consist. ↑ | Avg ↑ | E2E (s) ↓ |
|---|---|---|---|---|---|
| LTX-2 (base) | 0.315 | 0.395 | 0.690 | 0.467 | 52.2 |
| LTX-2 + SFT | 0.292 | 0.389 | 0.682 | 0.454 | 52.2 |
| LTX-2 (8-step) | 0.285 | 0.391 | 0.694 | 0.455 | 10.1 |
| LTX-2 (8-step) + VLM | 0.495 | 0.572 | 0.732 | 0.598 | 10.5 |
| **LTX-2 (8-step) + WMSD** | **0.605** | **0.691** | **0.882** | **0.726** | **10.1** |
| HY1.5 (base) | 0.464 | 0.540 | 0.780 | 0.597 | 112 |
| HY1.5 + WMSD | 0.574 | 0.630 | 0.828 | 0.673 | 112 |

Two things to notice. **SFT barely moves the numbers** — and sometimes *hurts*:

> "the SFT baseline provides little to no improvement and, in some cases, degrades performance. We hypothesize that this is due to limited task diversity in the automatically annotated data: many tasks are overly simple or repetitive, such as 'walk forward'." — *Section 4.4*

And WMSD **keeps the base model's inference cost** (10.1s in, 10.1s out) — it changes the weights, not the sampler. Outsourcing to a VLM, by contrast, adds a call every time.

## Result 4 — where the gains land

Stratifying by task type, WMSD helps most where reasoning matters most (Section 4.5):

| Task type | LTX-2 → WMSD |
|---|---|
| Navigation | 31% → **76%** |
| Object interaction | 18% → **56%** |
| Perception | 41% → **69%** |
| Positioning | 27% → **50%** |
| Combat action | 27% → **36%** |

Agent grounding jumps too: first-person 42% → 86%, human characters 36% → 76%.

## Result 5 — it transfers to robots, for free

On the **DreamGen** robotics benchmark, WMSD (no robot-specific training data) is compared to zero-shot and SFT baselines:

> "despite operating in a data-free regime, WMSD achieves performance comparable to SFT-trained Cosmos, while substantially improving over the LTX-2 baseline." — *Section 4.7*

A model that never saw curated robot demonstrations lands in the same ballpark as one fine-tuned on them. That's the headline of the whole paper in one sentence.

## But know the limits

The data-free setting that makes WMSD cheap also caps it:

> "the model cannot recover accurate robot-specific dynamics without access to corresponding data. While WMSD generates plausible task solutions, it lacks detailed knowledge of the appearance and motion characteristics of a specific robotic platform beyond the initial frame." — *Section 4.8*

And when the **Demonstrator itself can't solve a task** (e.g. out-of-distribution puzzle games), the student's gains shrink — the teacher's ceiling still matters when RL has little to bootstrap from. The "alternating" training variant that tries to address this introduced instability instead (Sections 4.3, 4.8).
