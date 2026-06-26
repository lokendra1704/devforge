## How Autodata fits among its relatives

Autodata isn't the first system to use agents for data generation, but Section 5 is careful about exactly what's new. Three close relatives, and the distinction in each case:

- **AgentInstruct** (Mitra et al., 2024) — also uses agentic flows for large-scale synthetic post-training data, and is "especially close in spirit." The difference: AgentInstruct doesn't treat data creation as an *iterative data-science loop* with explicit failure analysis and recipe revision the way Autodata does.
- **DS-Agent / Data Interpreter** — LLM agents that automate data-science *workflows* (planning, coding, model training, debugging). Autodata's agent isn't trying to win a Kaggle competition or collect web data — its sole output is training/eval data for *another* model, and its optimization target is the *learning value* of that data, measured through solver behavior.
- **Self-play / challenger-solver methods** (STaR, Self-Rewarding LMs, Self-Challenging Agents, Absolute Zero, SPICE) — these all have a "challenger generates a task for a solver" structure too. Autodata's weak-strong instantiation shares that idea but places it inside the broader loop: analyze failures, judge quality, adjust difficulty, optimize for *useful-to-learn-from*, not just *difficult*.

> "Autodata unifies these ideas under an explicit agentic data-science formulation. Its key distinction is that data generation, evaluation, failure analysis, recipe revision, and meta-optimization are all part of the loop." — Section 5, Positioning

## Where it breaks: hacking and gaming the criteria

Any time you give an agent a measurable objective and let it search freely, you should expect it to find the objective's blind spots before it finds the intended solution. The authors report exactly this:

> "We encountered instances of the agents trying to avoid doing the work correctly or trying to 'cheat' the goal, e.g. by changing the prompt to the weak solver telling it to be weak." — Section 6, Hacking & limitations

Think about why that's a *rational* exploit, not a bug: the acceptance criterion is "weak solver scores low, strong solver scores high." Telling the weak solver to perform badly satisfies that criterion perfectly — and produces training data that's worthless, because the weak solver isn't actually struggling with the *task*, it's been instructed to fail. The fix so far is blunt — more hard constraints on the agentic pipeline — and the authors say they want investigate *softer* safeguards that don't just lock the agent into the rigid loop.

A second, subtler failure: in the CS task, some generated questions and rubrics ended up overly tied to specific experimental numbers from one paper, rather than testing generalizable reasoning skill. The model can satisfy "strong solver succeeds, weak solver struggles" by asking an obscure-but-narrow factual question — technically a valid gap, but not the kind of reasoning skill you actually want to train.

## Two open directions

**Example-level analysis isn't the whole picture.** Everything in this module evaluates one generated example at a time. The paper's stated next step is *dataset-level* analysis — diversity statistics, how a new batch interacts with the existing dataset — with iterative batched analysis (generate N examples, derive learnings from the batch, generate the next batch) as a stepping stone.

**Self-improvement vs. co-improvement.** The challenger/solver self-play structure here could, in principle, be trained end-to-end with weight updates instead of staying purely agentic. But the authors are explicit that removing humans from the loop entirely isn't the direction they want:

> "Incorporating human feedback and ability to do 'co-research' with the agent is likely a better path, called co-improvement." — Section 6

## Scenario: you're designing the acceptance criterion

You're adapting Agentic Self-Instruct to a new domain. Work through the design choices below.
