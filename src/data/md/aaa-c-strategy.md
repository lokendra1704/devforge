# Strategic recommendations: which paradigm, and when

You now have the full comparison: A1 vs A2 split on *signal source* (causal vs
holistic), T1 vs T2 split on *whether a frozen agent supervises the tool*, and
A2 vs T2 split on *where the learning burden goes* (170k examples vs. 2.4k).
Section 6.5 turns all of that into a decision procedure — given your
constraints, which paradigm should you reach for?

## A1: when you need precise, local mastery of a verifiable tool

A1 is the right call for **local, mechanistic mastery of verifiable tools in
stable domains** — retrieval, code execution, SQL generation, and similar
settings where "did this action work?" has a clean, checkable answer.

Optimizing directly on executable outcomes gives A1 strong low-level
competence and causal grounding — practitioners get precise control over *how*
the tool is used, tightly aligned to a verifiable signal. The price is high:
every training run needs substantial compute, and the resulting specialization
often transfers poorly to other tasks or other tool interfaces. You're buying
depth on one tool, not breadth.

**Reach for A1 when:** you can fine-tune the agent (open weights), you have
(or can build) a verifiable execution signal for the tool in question, and the
domain is narrow and stable enough that overfitting to it is acceptable — even
desirable.

## A2: when one agent must orchestrate many tools holistically

A2 fits when **a single agent has to orchestrate multiple tools and reason
about the whole task holistically** — deciding when, how, and why to invoke
each tool as part of one integrated, end-to-end policy. This is the paradigm
for complex multi-step workflows where the *strategy* — not any single tool
call — is the thing that needs to improve.

The price of that integration is the same one you saw in §6.2.2 and again in
§6.4: expensive monolithic retraining, and susceptibility to catastrophic
forgetting every time you adapt the policy again. A2 buys you the richest
single-model flexibility of the four paradigms, but every change to that
flexibility costs a full retraining pass over a billion-parameter model.

**Reach for A2 when:** you can fine-tune the agent, the task genuinely
requires cross-tool strategic reasoning (not just better execution of one
tool), and you can afford — and tolerate the forgetting risk of — retraining
the whole policy when requirements change.

## T1 and T2: when the agent is frozen, or modularity is the priority

Both A1 and A2 assume you can retrain the core agent. Section 6.3's framing
gives the natural complement for when you *can't* — or *shouldn't*:

**Reach for T1 when** the agent is closed-source (you cannot fine-tune it at
all), or when you want a capability that's reusable across many different
agents and pipelines. T1 tools are agent-agnostic and plug-and-play — the cost
of adding a capability scales with the tool's size, not the backbone's, and
swapping one tool (a retriever, say) never touches the agent. The "graduated
agent" pattern from the last lesson is a special case of this: if you already
have an A1/A2-trained specialist that has reached expert performance, freezing
it and exposing it as a T1 tool lets *other* agents benefit from that training
investment without retraining anything.

**Reach for T2 when** you have a frozen agent (open or closed) that already
reasons and knows the domain well, but its weak point is a specific procedural
skill — searching, writing memory, planning tool use — and you have only a
modest amount of training signal derived from that frozen agent's own
feedback. §6.4's headline number is the case for T2 in one line: where A2
needed ~170k examples to co-adapt knowledge, reasoning, and tool use together,
a T2 subagent reached comparable performance on ~2.4k samples by learning only
the one skill the frozen backbone couldn't already do. T2 also wins on
modularity: subagents (a better planner, a new memory module) can be
hot-swapped later without retraining the host, so the system keeps evolving
without the forgetting risk that haunts A2.

## The decision in one pass

Three questions, in order, get you most of the way there:

1. **Can you fine-tune the agent?** No → T1 or T2. Yes → consider A1/A2, but
   keep reading — T1/T2 may still be cheaper and more modular even when A1/A2
   is *possible*.
2. **Is there a clean, verifiable per-action signal** (a test suite, a
   retrieval metric, an executable check)? If the bottleneck is *one*
   mechanistic skill and that signal exists, A1 (agent open) or T2 (agent
   frozen) — "narrow target, narrow training" is the throughline from §6.4.
3. **Does the task need holistic, cross-tool strategy**, where no single
   action's correctness predicts overall success? That's A2's territory (agent
   open) — accept the retraining cost because the thing being learned
   genuinely spans the whole trajectory.

Underneath all three: modularity is often the deciding factor *in practice*,
even when it isn't the deciding factor on a benchmark. A T1/T2 system you can
evolve piece by piece, without retraining risk, frequently beats a marginally
stronger A1/A2 system that locks you into expensive, forgetting-prone
retraining every time requirements shift.
