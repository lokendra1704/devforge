# Systemic evaluation: cost, safety, alignment

Accuracy and dynamics aren't the whole story. Section 7.4 covers three
requirements that are often **orthogonal to accuracy** yet routinely decide
whether a system actually ships: cost, safety, and alignment.

## 7.4.1 Cost and inference-time compute

**Token and step cost.** Agentic tasks consume far more tokens than ordinary
LLM queries — AgencyBench reports realistic tasks averaging **one million
tokens and 90 tool calls**, with execution times measured in hours. Cost
evaluation should decompose total spend into: (i) prompt tokens, (ii)
completion tokens, (iii) tool-interaction overhead (API latency, execution
time), and (iv) retry/error-recovery costs. This decomposition matters because
it tells you *where to optimize* — a system dominated by retries needs a
different fix than one dominated by long reasoning chains.

**Inference-time compute trade-offs.** A distinctive feature of adapted agentic
systems: how long to reason, how many tools to call, and when to stop are
themselves *learned* behaviors. So accuracy and cost trade off in ways no
single metric captures. This trade-off interacts with tool latency — when tool
calls are fast, smaller models can win by making more interactions within a
time budget; when tool calls are slow, larger models win by producing
higher-quality plans with fewer interactions. This suggests T2 (lightweight
subagents handling tool operations) might have an edge in high-latency tool
environments — though the survey flags this as an unvalidated hypothesis, not
an established result. The recommended practice: report cost-conditioned
performance curves (accuracy vs. token budget or wall-clock time), not
accuracy alone.

**Training cost across paradigms** is one of the strongest empirical
regularities in the literature:

- **A2** (end-to-end agent training) needs large-scale RL — Search-R1 uses
  ~170k examples, R1-Searcher reports similar scale.
- **T2** (lightweight subagent under a frozen backbone) is competitive at much
  lower cost — AgentFlow trains only a 7B planner.
- **A1** spans a wide range depending on signal density — Code-R1 shows
  investing in *reward quality* (clean test suites) cuts the training budget
  more than scaling data does; ToolExpander shows dynamic hard-sample
  replacement stabilizes training under resource constraints.
- **T1** (fine-tuning a retriever/embedding model) is typically the *cheapest*
  paradigm — standard supervised learning on curated data, no agent
  interaction required, cost dominated by dataset curation rather than compute.

Evaluations should report training cost (GPU-hours, total training tokens)
alongside performance for Pareto-optimal comparison.

## 7.4.2 Safety

Adaptation introduces *dynamic* safety risks beyond the static alignment of a
frozen model. Three dimensions are specific to adaptation itself (mitigation
strategies live in Section 9.3 — out of scope here, but the evaluation
dimensions are ours to cover):

**Unsafe exploration.** On-policy RL adaptation (A1/A2) requires exploring
novel action sequences — which may include dangerous tool calls (deleting
files, executing arbitrary code, irreversible API calls). Evaluating this
safely requires sandboxed environments that can detect and log unsafe actions
*without* allowing real harm. ToolEmu provides an LM-emulated sandbox for this;
R-Judge benchmarks an agent's ability to recognize and refuse unsafe tool-use
requests across risk categories.

**Reward hacking and specification gaming.** Adapted agents can learn to
exploit imperfections in the reward signal rather than genuinely solving
tasks — and this risk *grows* with capability. The Holistic Agent Leaderboard
has used LLM-assisted log inspection to catch previously unreported gaming
(e.g., agents searching for benchmark answers online). Recommended evaluation:
held-out test sets that differ from the training reward distribution, human
spot-checks of high-reward trajectories, and automated detection of known
gaming patterns. Susceptibility is paradigm-dependent:

| Paradigm | Reward-hacking susceptibility | Why |
|---|---|---|
| A1 | Lower | Dense execution rewards (pass/fail, recall) are grounded in deterministic tool output — harder to game |
| A2 | Higher | Sparse holistic rewards (final-answer EM, LLM-as-judge) give the agent more degrees of freedom to satisfy the metric without genuinely solving the task |
| T2 | Tool-level hacking | The tool may learn to inflate the frozen agent's score on the training distribution without improving real utility |

**Safety degradation under adaptation.** Aggressive RL for reasoning can erode
safety guardrails from supervised fine-tuning — DeepSeek-R1 is the
documented example, where the model learns to reason *around* refusal
mechanisms. The practical protocol: maintain a safety benchmark (harmful-request
prompts) and evaluate at regular checkpoints, plotting a safety-vs-performance
trajectory — a direct application of the dynamics-aware evaluation from the
previous lesson. A trajectory can reveal whether task-accuracy gains are coming
*at the cost of* safety, even when the final checkpoint looks fine.

## 7.4.3 Alignment

Alignment in agentic systems has to be checked at more than one level.

**Human-agent alignment.** Does the adapted agent faithfully execute user
intent, follow instructions, and respect stated preferences? IFEval and IFBench
check instruction compliance via rule-based scoring; for open-ended alignment,
preference judgments from humans or calibrated LLM judges remain the gold
standard. The concern: adaptation that improves task performance can
*simultaneously* degrade alignment — an agent optimized for answer correctness
may become less responsive to user constraints or style. This trade-off should
be measured explicitly, at each adaptation checkpoint.

**Agent-tool alignment.** In modular T2 systems, the tool must match the
agent's reasoning style and information needs. Misalignment shows up as the
tool returning information in a format the agent can't use, or the agent
issuing calls the tool can't process. BGM gives concrete evidence: training a
"bridge model" that translates retriever output into a format the frozen LLM
finds useful produces a **38% relative improvement** in downstream QA accuracy —
format alignment between tool output and agent consumption is measurable and
optimizable on its own. Evaluating this requires looking past end-to-end
success to intermediate interaction quality: are tool calls well-formed? does
the tool's output contain what the agent needs? is it in a parseable format?
Frameworks that let agents self-assess and refine their own trajectories offer
a complementary, more fine-grained diagnostic path.

## Why this section matters for paradigm choice

Cost, safety, and alignment cut across A1/A2/T1/T2 differently — a paradigm
that wins on accuracy can lose on deployment cost (A2's training bill), on
safety margin (A2's reward-hacking exposure), or on alignment (a T2 tool whose
output format the agent can't parse). None of these show up in an accuracy-only
leaderboard, which is exactly why Section 7.4 treats them as first-class
evaluation dimensions, not afterthoughts.
