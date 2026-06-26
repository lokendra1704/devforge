## What would a human data scientist actually do?

Before looking at the diagram, predict it. If you were handed the job "go create a high-quality training set for legal reasoning," what would your loop look like? You'd probably: draft some examples, look at a sample of them, notice which ones are too easy or too weird, adjust how you're generating them, and draft another batch. You wouldn't write one generation script, run it once, and ship whatever comes out.

That's exactly the loop Autodata formalizes — Section 2 names three components.

**Data Creation.** The agent grounds on source material (papers, legal documents, math problems — whatever the domain needs) and uses tools, prior learnings, and inference-time compute to produce training or evaluation data.

> "Importantly, this creation step can be repeated after subsequent analysis and learnings to improve the data even further." — Section 2

**Data Analysis.** The agent inspects what it just created — at the level of a single example ("is this correct? challenging enough?") or at the dataset level ("are the samples diverse? do they actually improve a model when trained on?"). Those findings feed back into the next round of creation.

**The Overall Data Scientist Loop.** Creation and analysis alternate until a stopping criterion is met, at which point the agent emits a final dataset. The paper notes this loop needs guardrails — without them, an agent can find ways to satisfy the letter of the acceptance criteria without producing genuinely useful data (more on this in *Limitations and what's next*).

![Figure 1: The Autodata pipeline — create, analyze, iterate, and meta-optimize the agent itself](FIGURE:ad-fig1)

Look at the outer arrow in that figure labeled "Meta-optimize agent itself" — that's the third claim from the previous lesson, applied to the loop's own machinery, not just to the data it produces. We'll come back to that arrow in *Meta-optimizing the data scientist*; everything between here and there is about the inner loop only.

## Why "iterate until criteria met" is doing all the work

> **Wait — isn't this just rejection sampling with extra steps?** Not quite. Rejection sampling draws repeatedly from a *fixed* distribution and keeps what passes a filter — the generator itself never changes. Here, the *judge's feedback* is fed back into the next prompt sent to the generator, so the distribution of candidates itself shifts round over round. It's closer to a search guided by feedback than to filtering a static pool. You'll see this distinction matter concretely in the next lesson, where the "weak too easy" feedback specifically redirects what kind of question gets generated next — not just which ones get kept.

The stopping criterion ("iterate until criteria met") is the single most important design decision in the whole framework, because it defines what "good data" even means for a given task. Two different instantiations of Autodata can use the *same* loop structure with completely different acceptance criteria — and the paper's own experiments show this criterion has to be domain-specific (CS research questions and legal reasoning tasks fail in opposite directions, as you'll see in *Experiments across three domains*).

## One template, many instantiations

Section 2 is explicit that Figure 1 is a *template*, not a fixed algorithm:

> "The high-level design of Autodata is shown in Figure 1, where various instantiations can be built from this template." — Section 2

The paper's concrete instantiation — the one used in every experiment — is called **Agentic Self-Instruct**, and it's the subject of the next lesson. It specifies exactly *who* plays the "creator" and "analyzer" roles (four cooperating LLM subagents) and exactly what the acceptance criteria look like for a verifiable-vs-non-verifiable task.
