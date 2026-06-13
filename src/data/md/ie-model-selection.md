# The most important optimization happens before any optimization

All else equal — same hardware, runtime, and tricks — **a smaller model is faster and cheaper than a bigger one.** So the single highest-leverage decision in model performance isn't your inference engine or your speculation algorithm. It's *which model you pick in the first place.*

The models you choose among are mostly **foundation models** — models trained on broad data to serve as a base for many downstream tasks (GPT, Claude, Llama). You either prompt them directly or adapt them (fine-tuning, below).

The rule flips with maturity:

- **Before product-market fit:** just use a powerful frontier model via a pay-per-token API (Kimi, DeepSeek, GPT, Gemini). Don't waste time or money on your own inference yet.
- **When it's time to scale:** find — or create — **the smallest, easiest-to-run model that's still smart enough** for the task. Sometimes that's still a trillion-parameter frontier model. But always check whether something smaller can do the job.

One more constraint: **architecture support.** Inference engines support popular architectures far better than exotic ones. A weird custom architecture can lock you out of the best tooling, so favor mainstream architectures.

## Evals: prove it's smart before you make it fast

**Evals** are the practice of systematically measuring model intelligence — but tailored to *your* product, domain, and hardest tasks. They're a prerequisite for inference engineering because they let you:

- **Spend time wisely** — confirm the model is actually useful before investing in speed.
- **Establish a baseline** — many optimizations (especially quantization) risk quality; you need a "before" to detect regressions.

Public intelligence benchmarks (MMLU, SWE-bench) are useful for *shortlisting* but get saturated and gamed — **Goodhart's Law**: *"when a measure becomes a target, it ceases to be a good measure."* Elo-style head-to-head win rates help, but there's no substitute for measuring performance on *your* data. Look at your data, be precise about the hardest cases, and use existing eval tooling.

## Two ways to shrink the model

**Fine-tuning** — take a pretrained model and adapt it to your domain with new data; the architecture stays the same, the weights shift. If you can fine-tune a *small* model to pass your evals, you've made your latency and cost targets dramatically easier. The classic example is text-to-SQL: SQL is constrained enough that a few-billion-parameter fine-tune can match a hundreds-of-billions general coding model on that one task.

**Distillation** — use a large *teacher* model to train a smaller *student* to emulate its behavior, learning from the teacher's full probability distributions, not just final answers. It preserves behavior (good and bad) at a fraction of the size. It's used less than fine-tuning — labs usually train small models independently to avoid inheriting big-model biases — but it shines when only a large model exists. When DeepSeek released the 671B-parameter R1, they also shipped distilled versions on top of popular Llama 3 and Qwen 2.5 architectures, so the reasoning behavior could ride existing performance tooling.
