# Context engineering: the real skill

As the field matured, a key insight emerged: the quality of AI-generated code depends less on the cleverness of your prompts and more on **the quality of the context provided**. This is context engineering — providing AI agents with rich, structured information about your codebase, architecture, conventions, and intent.

Six primary types of context every agent needs:

- **Instructions** — the agent's core role, goals, operational boundaries.
- **Knowledge** — retrieved documents, architectural diagrams, domain-specific data.
- **Memory** — short-term session logs (what just happened) and long-term persistent state (what the project is).
- **Examples** — few-shot behavioral demonstrations and codebase reference patterns.
- **Tools** — precise definitions of the APIs, scripts, services the agent can invoke.
- **Guardrails** — hard constraints, formatting rules, safety validations.

> "The question isn't 'how do I trick the AI into writing good code?' It's 'what would a new team member need to know to contribute effectively, and how do I encode that knowledge in a form the AI can use?'"

Context engineering is the bridge between vibe coding and agentic engineering — the more deliberately you supply these six types, the further toward the disciplined end of the spectrum you move.
