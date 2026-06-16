# How AI transforms each phase

**Requirements and planning.** Historically the widest gap between intent and implementation. AI can generate user stories, identify edge cases, produce API schemas, and build interactive prototypes from specs — collapsing the requirements-to-prototype loop to near zero. Requirements stop being a handoff document; they become a conversation that produces spec and implementation simultaneously.

**Design and architecture.** The most stubbornly human-centric phase, because architectural decisions are about trade-offs (consistency vs. availability, complexity vs. flexibility, build vs. buy) that depend on business context AI can't fully grasp. AI excels at *implementing* decisions once made — scaffolding, consistent patterns, convention conformance.

**Implementation.** Industry surveys report 25–39% productivity improvements. But it's nuanced: a METR study found experienced developers using AI assistants took **19% longer** on certain tasks, largely from verifying, debugging, and correcting AI output. AI doesn't eliminate implementation work — it transforms it from *writing* to *reviewing, guiding, verifying*.

**Testing and QA.** Requires evaluating not just what the agent produced but *how it got there*: output evaluation (does the code compile, do tests pass) vs. trajectory evaluation (the full sequence of tool calls and reasoning). A fluent output that skipped its own verification steps is more dangerous than one with a visible error. Tests and evals become the primary way to *communicate intent* to agents.

**Code review and deployment.** AI as first-pass reviewer — bugs, style, security, performance — before a human sees the code. This doesn't replace human review (design and strategic alignment still need judgment), but reduces reviewer cognitive load. Deployment pipelines become AI-aware: monitoring health, auto-rollback, risk prediction.

**Maintenance and evolution.** Perhaps the most underestimated shift. Legacy code once "too risky to touch" because only its original author understood it can now be safely read, understood, and modified with AI assistance — unlocking migrations and modernization that were previously too tedious and risky to attempt.
