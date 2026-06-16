# A1 in practice: tool execution as ground truth

The A1/A2 framework you've already seen is an objective, not a recipe. Section 4
turns it into systems. A1 says the agent is optimized against `O_tool` — some
function of what happened when its action `a` actually ran against a tool or
environment. Section 4.1 opens by naming why this signal is attractive *and* where
it falls short:

> "When the signal comes from tool execution (A1), the agent receives dense,
> causally grounded feedback tied to specific actions—but this signal is blind to
> whether the agent's overall reasoning strategy is sound." — Section 4

Tool outcomes are verifiable and reproducible — a compiler either accepts the code
or doesn't, a retriever either returns the right document or doesn't — so A1 signal
is cheap to generate at scale and dense enough for both supervised and
reinforcement learning. The cost is scope: `O_tool` scores **individual actions**,
so it can miss failures that only show up when several correct-looking actions
compose into a wrong overall trajectory.

## The earlier playbook: SFT and off-policy methods (§4.1.1)

Before RLVR (Section 4.1.2) became the default, A1-style adaptation meant training
on a fixed corpus of tool-execution trajectories with supervised fine-tuning (SFT)
or DPO. The survey calls these methods **off-policy**: the agent learns from
trajectories *it did not generate*, so there's always a gap between the
distribution it trained on and the distribution it meets at deployment.

What differs across these methods is the answer to one question — **what counts as
"correct" enough to learn from?** The survey traces three progressively stronger
notions of correctness.

### Golden-answer alignment

The earliest and loosest standard: a tool-augmented trajectory is "correct" if it
reaches a known right answer or matches an expert trajectory. **Toolformer**
(NeurIPS 2023) sits even before this — it's self-supervised, keeping a candidate
API call only if it measurably reduces the model's own perplexity on the
continuation. That tells the model *when* a tool call helps, but says nothing about
*how well* the call itself was constructed, since there's no external correctness
check at all.

Methods that adopted golden-answer alignment diverge on **how they use failures**.
**ToolAlpaca** runs a closed generate→execute→evaluate→fine-tune loop and trains
only on the trajectories that worked — failed calls are simply discarded.
**TRICE** (NAACL 2024) adds a ranking loss that compares execution outcomes against
ground truth, teaching the model to call a tool only when doing so actually helps
accuracy. **TP-LLaMA** (NeurIPS 2024) goes further still: at each decision point in
a successful trajectory it pairs the expert's correct next step (preferred) against
a failed branch (dispreferred) and runs DPO on these pairs — converting a discarded
failure into a contrastive training signal. The progression from ToolAlpaca to
TP-LLaMA illustrates a recurring A1 theme: **the more a method exploits negative
feedback, the more data-efficient it becomes.**

### Golden-format alignment

A complementary, structural notion of correctness: a tool call is "correct" if it's
syntactically and logically valid — regardless of whether the final answer turns
out right. This is useful exactly when ground-truth answers are expensive but a
canonical call format exists (e.g., a known API signature).

**Gorilla** (NeurIPS 2024) fine-tunes a retrieval-augmented LLaMA on a large set of
ML APIs and checks correctness via **AST subtree matching** — more forgiving than
string matching because it tolerates reordered or optional arguments. **ToolFlow**
(NAACL 2025) complements this by improving training-data *quality*: it builds a
tool graph from parameter/return-value similarity to select coherent tool subsets,
then plans multi-turn requests for logical consistency. Together these show
format-level supervision scales to huge, evolving API surfaces — but format
correctness doesn't guarantee functional correctness, so models trained this way
can still produce well-formed calls that do the wrong thing.

### Direct-execution alignment

The strongest A1 supervision: actually run the tool, and let its real output —
success, failure, returned values — be the training signal. No pre-labeled answers
or canonical formats required, but you now need execution environments that are
safe, reproducible, and informative.

Two design patterns emerged here. The first generates **executable code as the
action representation** itself: **CodeAct** (ICML 2024) replaces textual/JSON tool
commands with sandboxed code actions, so execution feedback grounds the model
directly in tool causality, and **NExT** (ICML 2024) applies an iterative
Sample-Filter-Train loop to program repair — only fixes that pass unit tests
advance to the next fine-tuning round. The second pattern targets **autonomous tool
discovery**: **ToolLLM** and **AutoTools** have the model parse raw API
documentation into callable functions and compose multi-function programs, with
execution outcomes driving iterative self-improvement.

A third pattern applies execution-grounded *preference learning* to retrieval.
**LeReT** (ICLR 2025) generates diverse search queries, scores the retrieved
documents with a reward function, and fine-tunes the query generator via Identity
Policy Optimization — a DPO-like objective where the reward comes from actually
running the retriever, not from labeled answers. **RetPO** (NAACL 2025) follows the
same logic more cheaply: GPT-4 proposes query rewrites, an off-the-shelf retriever
like BM25 scores them, and a smaller open-source model is DPO-trained toward the
higher-scoring rewrites.

## The arc, and its ceiling

The three alignment stages — golden-answer, golden-format, direct-execution — trace
a steady tightening of the loop between what the model optimizes and what
determines success at inference time. But every method in this family shares one
structural ceiling: because they all train on **pre-collected** trajectories, none
of them can explore tool-use strategies that weren't already present in that
training data. Closing that gap — letting the agent generate its *own* trajectories
on-line and learn from verifiable execution outcomes in real time — is exactly what
RLVR-based A1 methods (§4.1.2, next lesson) are built to do.
