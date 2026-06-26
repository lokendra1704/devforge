## Optimizing the optimizer

Everything so far used a *fixed* Agentic Self-Instruct harness — the Challenger/Weak/Strong/Judge prompts were hand-written once and never touched again. Section 4 asks the obvious next question: if the inner loop can tell good data from bad data, can that same signal be used to improve the *agent that generates the data*?

> "We thus apply meta-optimization to the data scientist agent itself, using the same evaluation criteria from the inner loop to guide optimization of the outer loop—the agent's prompt and strategy." — Section 4

This is the outer arrow you saw back in Figure 1 ("meta-optimize agent itself") — now made concrete. The method: treat the agent's prompts as **code to be evolved**, with an evolutionary search over a population of prompt variants.

![Figure 6: Meta-optimization of the data scientist agent — evaluate, analyze failures, implement a prompt diff, re-evaluate, accept or reject](FIGURE:ad-fig6)

## The six-step evolution cycle

Each iteration of the outer loop does this:

1. **Select** a parent prompt from the population, via Boltzmann (softmax) sampling weighted by validation score — favors strong candidates while still exploring.
2. **Evaluate** the parent's prompt on a minibatch of training papers, collecting full agent trajectories and weak/strong solver scores.
3. **Analyze** those trajectories with an LLM that diagnoses *why* generations failed (e.g. "context leaks the answer").
4. **Implement** a prompt modification — a code-editing agent reads the diagnosis and produces an improved diff.
5. **Re-evaluate** both the parent and the new mutant on held-out validation papers.
6. **Accept or reject** — the mutant only joins the population if its validation score *strictly exceeds* its parent's.

> **Wait — why does step 1 use a *softmax* over scores instead of just always picking the best candidate?** Because always picking the single best parent collapses the search to one lineage — any dead end in that lineage's local optimum stalls progress entirely. Weighting by `exp(score / T)` keeps weaker-but-still-decent candidates in the mix some of the time, so the population doesn't lose diversity. Lower `T` sharpens the bias toward the best scores; higher `T` flattens it toward uniform random selection.

## What the optimizer actually discovered

Run on the CS research-paper task, starting from a baseline prompt at 62.1% validation pass rate, 233 total iterations, 126 accepted:

| | Validation pass rate |
|---|---|
| Baseline prompt | 62.1% |
| Iter 124 (best found) | **79.6%** |

The discovered fixes are concrete and somewhat counter-intuitive, which is exactly why an automated search found them and a human prompt-writer might not have:

- **Paper-specific insight enforcement** — added a self-test to the Challenger's instructions: *"If a solver could answer correctly without reading this specific paper, the question is too easy."*
- **Context leak prevention** — added: *"Could someone answer the question by rephrasing sentences from the context? If yes, rewrite."*
- **Positive-only rubric weights, capped at 7** — the optimizer found that *negative*-weight rubric criteria, which sound like they should help (penalize wrong answers more), actually misfired and tanked strong-model scores without improving discrimination. It removed them entirely.
- **Structured JSON rubric format** — eliminated parsing failures from string weights like `"+8"` instead of the integer `8`.

That third bullet is worth sitting with: a design choice that seems obviously correct in theory ("penalizing errors should help discrimination") turned out to hurt in practice, and the only reason it got caught and fixed is that the optimizer measures the *actual outcome*, not the plausibility of the idea.

## Try it: implement the selection probability

The Boltzmann/softmax selection rule from step 1 says candidate $c$ is chosen with probability proportional to $e^{\text{score}_c / T}$. Implement it below — you'll need to normalize across the whole population so the probabilities sum to 1.
