# A2: when the signal is the agent's own output

A1 optimizes the mechanics of individual tool calls against `O_tool`. **A2**
optimizes something broader: the agent's *end-to-end output* — its reasoning
chain, final answer, or generated artifact — against `O_agent`, an evaluation of
that output. This shift from action-level to output-level feedback has two
consequences the survey is explicit about:

1. The agent can learn **strategic** behaviors — when to invoke a tool, how deeply
   to search, whether to self-correct — that an A1 signal simply cannot reward,
   because A1 never looks past the individual action.
2. **Credit assignment gets harder.** A single episode-level reward has to be
   attributed back across many internal decisions, so A2 training is typically
   less data-efficient than A1's dense, per-action signal.

Section 4.2 splits A2 into two settings depending on whether tools participate in
the evaluation loop. This lesson covers the first: **Agent Adaptation w/o Tools**
(§4.2.1) — the agent improves its intrinsic reasoning (math, coding, logical
inference) purely by optimizing against evaluations of its generated solutions. The
next lesson covers the tool-augmented case (§4.2.2).

## Three design axes for A2 without tools

The survey organizes this family along three axes:

- **Reward granularity** — from binary final-answer correctness to structured
  natural-language critique.
- **Optimization locus** — does the method update model weights (RL/SFT), or
  refine outputs at inference time with no weight changes?
- **Objective scope** — from narrow task correctness to broader goals like
  calibration or "human empowerment."

### Scalar-reward RL: the R1 paradigm

**DeepSeek-R1** (Nature 2025) is the landmark result here: RLVR using nothing but
*binary final-answer correctness* is enough to unlock strong mathematical and
coding reasoning in large models — a scalable path beyond SFT. **Kimi-1.5**
extended the same recipe to multi-modal agents with simplified policy optimization,
matching or beating DeepSeek-R1 on reasoning benchmarks. Together these established
what the survey calls the **R1 paradigm**: RL on verifiable output evaluations as
the primary driver of reasoning improvement — no tool calls in the loop at all.

Later R1-style work varies the *objective* while keeping this scalar-RL recipe:

- **EHRMind** applies RLVR to clinical (EHR) reasoning, and finds a lightweight SFT
  warm-up is necessary before RL to ground domain knowledge — a pattern the survey
  flags as recurring across specialized domains.
- **KnowRL** replaces task correctness with *self-knowledge calibration*: the agent
  is rewarded for accurately assessing its own confidence, improving reliability
  without targeting any one task.
- **Empower** goes further still, defining the objective as maximizing "human
  empowerment" rather than correctness, aligning assistive coding agents using only
  offline text data.
- **GRACE** converts contrastive-learning objectives into RL-style policy signals,
  bridging generative reasoning with representation learning.
- **Rec-R1** applies RL to product re-ranking using NDCG/Recall as reward — and the
  survey uses it to make a sharp point: Rec-R1 **straddles the A1/A2 boundary**.
  It's A1 when the reward is read off the tool's ranking output, and A2 when it
  evaluates the agent's overall recommendation quality. The A1/A2 split isn't
  always a clean binary — it depends on *where in the agent-tool pipeline the
  evaluation signal is computed*.

### Inference-time self-refinement (no weight updates)

A separate line of work adapts behavior **without retraining at all**.
**Self-Refine** (NeurIPS 2023) introduced the generate→critique→revise loop: the
same model produces an answer, critiques it, and revises based on its own
feedback — improving dialogue, math, and code outputs with no supervised data and
no auxiliary model. **SCoRe** (ICLR 2025) makes this trainable: multi-turn
on-policy RL teaches the model to iteratively refine its own responses, turning the
Self-Refine *loop* into a learned *policy*. The progression from Self-Refine to
SCoRe mirrors the SFT→RLVR progression you saw in A1: an inference-time heuristic
is replaced by a learned policy that keeps improving with scale.

### Structured linguistic feedback

**TextGrad** (Nature 2025) generalizes the scalar reward into natural-language
critiques that describe *how* to improve an output — "textual gradients" that
optimize across black-box LLM systems with no parameter access. The reported gains
are concrete: GPT-4o's zero-shot accuracy on LEETCODE-HARD rose from **26% to
36%**, and MMLU-Physics from **91.2% to 95.1%**. **metaTextGrad** applies the same
idea recursively to the optimizer itself, using validation feedback to refine the
optimizer's own prompts. TextGrad and metaTextGrad occupy a distinct niche: unlike
RL, they need no reward-function design; unlike Self-Refine, they propagate
structured credit through multi-component systems.

## Synthesis: the two-dimensional design space

> "A recurring finding across both axes is that SFT warm-up followed by RL yields
> more stable training than RL alone: SFT provides domain grounding, while RL
> refines the policy toward the evaluation objective." — Section 4.2.1

Putting the axes together: scalar final-answer correctness (DeepSeek-R1) is broadly
applicable but sparse; structured linguistic feedback (TextGrad) is
information-rich but needs a capable critic model. Weight-update methods (RL, SFT)
amortize their training cost across all future queries; inference-time methods
(Self-Refine, TextGrad) pay a per-query cost but need no training infrastructure at
all. Neither axis has a free winner — the choice depends on whether you can afford
training infrastructure and whether a reliable critic is available.
