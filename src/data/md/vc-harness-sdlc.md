# The harness across the SDLC

The harness must be present in every phase where an agent operates:

1. **Requirements, Planning & Architecture — Configuring the Harness.** The developer writes the `AGENTS.md`, defines architectural constraints, picks the tools the agent will have access to, and sets the rules it cannot break — *before* any production code is written.
2. **Implementation — Running the Harness.** Sandboxes, execution environments, and tools are active: the model generates code inside the harness's isolated sandbox, using the tools the harness exposes.
3. **Testing & QA — The Feedback Loop.** Orchestration logic and guardrails take over: the harness runs the test, and when one fails, the orchestration logic captures the error and routes it back to the model to try again. This is what creates the automated *think → act → observe* loop.
4. **Code Review, Deployment & Maintenance — Observing the Harness.** Hooks block unsafe actions (e.g. a commit containing a hard-coded password) and observability tracks token cost, latency, and drift — letting humans audit *why* an agent made a given decision.

The vibe-coding-to-agentic-engineering transition isn't about which tool you use — the same agent can do either. It's about **how deliberately you configure and apply the harness.**

The effect is measurable: on Terminal Bench 2.0, one team moved a coding agent from outside the Top 30 to the Top 5 by changing **only the harness**, no model change. A separate LangChain study raised a coding agent's score by 13.7 points by tweaking only the system prompt, tools, and middleware around a fixed model.

> "Most agent failures, examined honestly, are configuration failures." When an agent does something wrong, the first instinct is to blame the model — more often the failure traces back to a missing tool, a vague rule, an absent guardrail, or a context window stuffed with noise.
