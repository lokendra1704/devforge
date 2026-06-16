# The spectrum: vibe coding to agentic engineering

| Dimension | Vibe Coding | Agentic Engineering |
|---|---|---|
| Intent specification | Casual natural-language prompts | Formal specs, architecture docs, memory files |
| Verification | "Does it seem to work?" | Automated test suites, CI/CD gates, LM judges |
| Codebase understanding | Minimal; may not read generated code | Comprehensive review of architecture |
| Error handling | Copy-paste error back to the AI | Agents self-diagnose within defined bounds |
| Appropriate scope | Prototypes, scripts, hackathons | Production systems, team-scale development |
| Risk profile | High; acceptable for disposable code | Low; systematic verification at every stage |

The single biggest differentiator is **how outputs get verified**. Two mechanisms work together in agentic engineering:

- **Tests** verify the deterministic parts — a function given this input produces that output. Checked by code.
- **Evals** verify the parts that aren't deterministic — did the agent take the right trajectory, choose the right tools, produce a response that meets the quality bar. Checked by labelled datasets, scoring rubrics, and LM judges.

Without both, the practice is always vibe coding, no matter how sophisticated the prompts are.
