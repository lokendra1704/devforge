# Where to start

> "The shift from syntax to intent is not a future state. It is the work in front of us today... AI amplifies the engineering culture it lands in."

**For individual developers**

1. Set up an `AGENTS.md` (or equivalent). Start with ten lines: stack, conventions, hard rules, workflow. Add a rule every time the agent does something it shouldn't do again.
2. Install a set of skills for your coding agent (like Agents CLI) to build, evaluate, deploy, and optimize agents.
3. Pick one repetitive workflow and make it your first agent — prototype with a coding agent, graduate to production when it earns its keep.
4. Write tests and evals **before** generating code. Together they're the contract with the AI — and what turns vibe coding into agentic engineering.
5. Review every line that's going to ship. Be skeptical of anything that looks clever. Check imports, verify error handling covers real failure modes.
6. Maintain your developer skills. AI handles the routine so you can focus on the challenging — that only works if your foundational debugging and design intuition stays sharp.

**For engineering leaders**

1. Make context engineering a first-class practice — `AGENTS.md`, system prompts, eval suites, and skill libraries reviewed in PRs, versioned, owned by named engineers.
2. Set the bar at the **eval, not the demo** — a demo proves an agent can succeed once; a passing eval suite with an explicit rubric proves it succeeds reliably.
3. Re-shape code review for AI-generated code — extra attention to hallucinated dependencies, inadequate error handling, subtle correctness gaps that look right at a glance.
4. Make the prototyping-vs-production boundary explicit in team norms — which projects, branches, and environments warrant which mode of working.
5. Invest in harness components as shared team infrastructure — reusable system prompts, skill libraries, MCP connections, evaluation harnesses, documented and maintained.

**For organizations**

1. Treat AI-assisted development as an engineering investment, not a productivity feature — pair tooling with eval coverage, observability, and architectural standards.
2. Invest in the production substrate before scale — trajectory/final-response evals in CI, traces of every run, scoped permissions, security review tuned to AI failure modes.
3. Adopt open standards (MCP, A2A) to keep the option to mix vendors and frameworks open.
4. Plan for hybrid teams of humans and agents — code review, on-call, and team structure need to reflect that agents are participants, not just tools.
5. Reframe hiring and skill development around judgment, not just implementation.
