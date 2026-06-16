# Two families of metrics: verifiable execution vs. holistic utility

Once you know which paradigm a benchmark targets, the next question is *what
the number actually measures*. Section 7.2 groups every adaptation metric into
two families, aligned with the same signal-source axis that defines A1/A2 and
T1/T2: metrics computed **directly from a tool's execution** versus metrics
computed on the **agent's final output**.

## 7.2.1 Verifiable execution metrics (A1 & T1)

These metrics come from an environment or tool with fixed semantics — the
signal doesn't depend on how the agent *internally* represents the task.

**Execution-based code evaluation** is the cleanest example: generated code
runs against a test suite, and pass@k or test-suite pass rate gives a binary,
unambiguous verdict (HumanEval, MBPP, SWE-Bench, LiveCodeBench). This density
of signal is what makes A1-style RL tractable — RLEF shows multi-turn execution
feedback supports stable PPO training; Code-R1 shows that *clean, verified*
test suites matter more than raw data volume; R1-Code-Interpreter finds that
mixing heterogeneous coding tasks produces sparse, unstable rewards unless a
curriculum schedules the difficulty.

**Retrieval and information-access metrics** — Recall@K, nDCG, MAP against
gold relevance judgments — serve the same role for retrieval-style A1: 
DeepRetrieval uses Recall@K, Rec-R1 uses NDCG/Recall for recommendation,
SQL-R1 uses execution accuracy for database querying. These decompose
per-query, so you can diagnose *which* query types or SQL patterns fail. But
BGM shows a catch: high retrieval recall doesn't guarantee high downstream
utility — there's a "preference gap" between what retrievers optimize
(surface relevance) and what the LLM actually finds useful (contextual
coherence, inferential support).

**Formal verification** (theorem proving, program synthesis against a spec) is
the strongest possible execution signal — a proof type-checks or it doesn't,
with zero evaluation noise, and it eases long-horizon credit assignment versus
sparse unit tests. AlphaProof and DeepSeek-Prover-V2 train multi-step proof
search on exactly this signal. The catch is availability: formal verification
only applies where tasks reduce to type-checkable propositions, which excludes
most real-world, specification-free agentic work.

**Strengths and limits.** Verifiable execution metrics are dense, reliable,
and reproducible — ideal for sharpening A1 tool-use mechanics. But they're
*local*: a passing test doesn't certify that the agent's overall reasoning is
sound, and an agent can learn to game the metric (e.g., generating trivially
passing self-written tests) without improving real task-solving. The Holistic
Agent Leaderboard has documented agents that score high by searching for
benchmark answers online — a gaming behavior totally invisible to execution
metrics.

## 7.2.2 Holistic utility metrics (A2 & T2)

These metrics evaluate the agent's *final output* — integrating reasoning, tool
use, and synthesis into one judgment.

**Answer-correctness metrics** — exact match (EM) or F1 on the final answer —
are the simplest holistic metric (multi-hop QA benchmarks). For math, newer
verification tools like Math-Verify check mathematical *equivalence* rather
than string identity, cutting false negatives. The subtlety: EM conflates
reasoning quality with answer *formatting* — an agent can reason correctly but
format wrong, or reach the right answer through flawed (shortcut) reasoning.

**LLM-as-judge** fills the gap where ground truth doesn't exist — Arena-Hard
and MT-Bench use strong models for pairwise comparison or scoring. It's
scalable but carries systematic biases: verbosity preference, position bias,
self-enhancement bias, and sycophancy. For agentic tasks specifically, these
interact with tool use in non-obvious ways — a verbose trace with many tool
calls can get an inflated score even if the tool use itself was redundant.
Ensemble judging (multiple judges, aggregated) partially mitigates this.

**Task-completion / functional assessment** bridges the two families: the
*metric* is holistic (did the agent achieve the goal?) but the *assessment
mechanism* is verifiable — WebArena checks final page state, OSWorld uses
screenshot + system-state checks, AgencyBench combines Docker-sandboxed
functional checks with user-simulation agents for iterative feedback.

**Strengths and limits.** Holistic metrics measure what users actually care
about — did the system solve the problem — making them the natural fit for A2
and T2. But they suffer **credit-assignment opacity**: when the final answer is
wrong, you can't tell whether reasoning, tool selection, tool execution, or
synthesis was at fault. This is especially costly for T2, where the whole point
is isolating one tool's *marginal* contribution. Holistic metrics are also
typically *sparse* — one signal per episode — which has a real training cost:
Search-R1 needs roughly 170k examples under sparse holistic rewards, while
ReTool shows that adding dense, real-time execution feedback (an A1 signal)
into RL rollouts substantially speeds convergence versus relying on
end-to-end, final-answer-only rewards. Dense signals accelerate learning —
consistently, across domains.

## At a glance

| Paradigm | Metric family | Signal source | Example metric |
|---|---|---|---|
| A1 | Verifiable execution | Tool/environment execution | pass@k, Recall@K, nDCG |
| T1 | Verifiable execution | Tool's intrinsic output | Retrieval precision, segmentation IoU |
| A2 | Holistic utility | Agent's final answer | EM/F1, LLM-as-judge, task completion |
| T2 | Holistic utility | Frozen agent's score with vs. without the tool | Counterfactual task-success delta |

The split isn't a value judgment — A1/T1 metrics are *dense but local*, A2/T2
metrics are *holistic but sparse and credit-opaque*. A complete evaluation
needs both: one tells you the mechanics are sound, the other tells you whether
that soundness actually paid off.
