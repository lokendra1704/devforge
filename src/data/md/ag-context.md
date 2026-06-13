# Context engineering, memory & evals

Three topics separate weekend-project agents from production agents. None of them is "better prompts".

## 1. Context engineering

The context window is the agent's entire working memory, and it's both **finite** and **expensive** — every token costs money and latency, *and* models genuinely attend less reliably to the middle of huge contexts (the "lost in the middle" effect). So treat context like RAM, not like a landfill:

- **Retrieve, don't preload.** Don't stuff all 400 help-center articles into the prompt; give the agent a `search_docs` tool and let it pull the 2 it needs. Tools turn a context problem into a retrieval problem.
- **Summarize the past.** A 50-turn conversation doesn't need all 50 turns verbatim — compress older turns into a running summary, keep recent turns raw.
- **Prune tool results.** A database tool returning 2,000 rows should return 20 + "1,980 more matching rows" — the agent can ask for more. Token discipline in tool design is the highest-leverage optimization most teams miss.

A useful mental model: **the system prompt is the agent's firmware, the context is its RAM, tools are its I/O.** You're designing a tiny computer.

## 2. Memory

The LLM forgets everything between sessions. Anything "remembered" is *engineered*:

- **Short-term:** the conversation itself, plus the running summary trick above.
- **Long-term:** an actual store. Simplest version that works: a notes file or table the agent reads at session start and writes via a `save_memory` tool ("user prefers morning flights", "user's plan: enterprise"). Fancier: embeddings + vector search to recall relevant facts by similarity.
- **The hard part is *what* to save.** Save everything → retrieval noise drowns the signal. Good agents save *durable preferences and facts*, not chit-chat. (Notice this very platform's design: progress is in localStorage, not re-derived every visit. Memory is state management.)

## 3. Evals — the part that makes it engineering

You changed the system prompt. Did the agent get better or worse? **Without evals, you genuinely do not know** — LLMs are non-deterministic, and improving one behavior silently breaks another. Vibes don't scale.

An eval is a test suite for behavior:

1. Collect 50–200 real scenarios ("user wants a refund for order #123", "user asks something off-topic")
2. Define checkable outcomes per scenario — *called the refund tool with the right order ID*, *did NOT promise a discount*, *escalated when policy required*
3. Run every prompt/model/tool change against the suite. Track the score like you track CI.

Two eval styles to know: **assertion-based** (deterministic checks on tool calls and outputs — start here, they're cheap and trustworthy) and **LLM-as-judge** (a second model grades tone/helpfulness — scalable but needs calibrating against human labels).

> Teams that ship reliable agents and teams that demo cool agents are separated by exactly one artifact: the eval suite.

## The production checklist

- [ ] Step budget + cost ceiling per task (runaway loops burn real money)
- [ ] Irreversible actions (payments, emails, deletes) gated behind confirmation
- [ ] Malformed/nonexistent tool calls handled with corrective feedback, not crashes
- [ ] Context: retrieval over preloading; summaries over transcripts; pruned tool outputs
- [ ] Eval suite running on every change, with a tracked score
- [ ] Logging every step — you cannot debug what you didn't record

Internalize this page and you're ahead of most people currently shipping agents.
