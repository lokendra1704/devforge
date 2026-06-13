# What an agent actually is

Strip away the hype and an AI agent is one sentence:

> **An LLM calling tools in a loop until a goal is met.**

That's it. Everything else — memory, planning, multi-agent systems — is engineering around that loop.

## Chatbot vs agent: the concrete difference

Ask a **chatbot**: "What's the cheapest flight to Delhi on Friday?" → it generates text. Maybe a plausible-sounding price. It *acted on nothing*.

Ask an **agent** the same thing:

1. LLM thinks: *I need flight data* → emits a **tool call**: `search_flights(to: "DEL", date: "friday")`
2. Your code (not the LLM!) runs the real search → returns JSON
3. LLM reads results, thinks: *user prefers mornings (memory says so)* → maybe calls another tool
4. LLM produces the final answer — grounded in real data it just fetched

The loop continues — think → act → observe — until the model decides it's done. The difference is **actions against the real world**, with the LLM as the decision-maker and your code as the hands.

## The anatomy (learn these five words)

```
┌─────────────────────────────────────────────┐
│  SYSTEM PROMPT   who am I, what are my rules │
│  CONTEXT         conversation + retrieved info│
│  TOOLS           what I'm allowed to do       │
│        ↓                                      │
│  LLM decides: respond OR call a tool          │
│        ↓ tool call                            │
│  RUNTIME executes, appends result to context  │
│        ↺ loop back to the LLM                 │
└─────────────────────────────────────────────┘
```

- **System prompt** — the agent's job description and guardrails
- **Tools** — typed functions you expose (search, database, email…). The LLM only *requests* them; your runtime executes and decides what's allowed
- **Context window** — the agent's working memory; everything it knows right now
- **The loop** — the runtime that ferries messages between LLM and tools
- **Stop condition** — done, max-steps reached, or human handoff

## Why engineers (not just researchers) own this

The LLM is a vendor API call. **Everything around it is software engineering**: designing tool schemas, handling the LLM requesting nonexistent tools or malformed arguments, retry budgets and step limits (an agent stuck in a loop burns real money), deciding which actions need human confirmation (reading data: fine; sending money: confirm!), and evals to know whether yesterday's prompt change broke checkout-handling.

This is why "agentic engineering" is a job title now: it's distributed-systems thinking applied to a probabilistic component.

## The one safety rule to never forget

> The LLM **requests**; the runtime **decides**.

An agent that can execute whatever the model emits, unchecked, is a remote-code-execution vulnerability with a friendly personality. Validation, allowlists, and confirmation gates live in *your* code, on the runtime side of the line. Hold that line and you can build agents that touch production; lose it and you're one prompt injection away from the news.

Next: you'll build that loop with your own hands — mock LLM, real loop logic.
