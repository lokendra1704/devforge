import type { Module } from '../../types'
import framingMd from '../md/cah-framing.md?raw'
import threeLayersMd from '../md/cah-three-layers.md?raw'

export const m1: Module = {
  id: 'cah-m1',
  title: 'Code as Agent Harness: The Reframe',
  description:
    'Why code is no longer just an LLM’s output — it’s the executable, inspectable, stateful medium agents use to reason, act, and verify. Plus the survey’s three-layer roadmap.',
  lessons: [
    {
      id: 'cah-framing',
      title: 'From code as output to code as harness',
      minutes: 10,
      xp: 55,
      steps: [
        { kind: 'read', title: 'The reframe', markdown: framingMd },
        {
          kind: 'quiz',
          title: 'The harness lens',
          questions: [
            {
              prompt:
                'Mid-task, an agent writes a small Python script that re-runs the test suite and reports which tests now fail, then uses that output to pick its next edit. In the survey’s three coupled elements, what is this script?',
              options: [
                'A model-internal capability',
                'System-provided harness infrastructure',
                'An agent-initiated code artifact',
                'The final deliverable handed to the user',
              ],
              answer: 2,
              explanation:
                'It is code the agent itself created, ran, and used mid-task to reason and verify — not the model’s own reasoning, not a predefined harness tool, and not the output the user asked for. That’s exactly the "agent-initiated code artifact" category the survey says is underexplored.',
            },
            {
              prompt:
                'Both "system-provided harness infrastructure" and "agent-initiated code artifacts" are code-related. Why does the survey insist on splitting them?',
              options: [
                'Infrastructure code is always slower to execute than artifact code',
                'Infrastructure is predefined and fixed by the system; artifacts are created, revised, and shared by the agent during the task — and that second category is the survey’s focus',
                'Infrastructure runs in the cloud while artifacts only run on local machines',
                'There is no real difference — the terms are interchangeable in the survey',
              ],
              answer: 1,
              explanation:
                'The split is about *who authors the code and when*. Harness infrastructure (sandboxes, validators, memory modules) is set up ahead of time by the system. Agent-initiated artifacts (a test the agent writes, a one-off script) are produced live, during execution, by the agent — and existing surveys mostly ignore this second kind.',
            },
            {
              prompt:
                '"Code as agent harness" reframes code’s role for an LLM agent. Which option best captures that reframe?',
              options: [
                'Code becomes more important than natural language for every agent task',
                'Code shifts from being only a generated output to being the executable, inspectable, stateful medium through which agents reason, act, and verify progress',
                'Harnesses make code generation unnecessary because the harness does the work',
                'The reframe means agents no longer need any external tools',
              ],
              answer: 1,
              explanation:
                'The core move is widening code’s job description: instead of "the thing the model produces at the end," code becomes the medium the agent runs *during* the task — to externalize reasoning, take actions, and check its own progress by execution.',
            },
          ],
        },
      ],
    },
    {
      id: 'cah-three-layers',
      title: 'Three layers, one survey',
      minutes: 12,
      xp: 60,
      steps: [
        { kind: 'read', title: 'The roadmap', markdown: threeLayersMd },
        {
          kind: 'quiz',
          title: 'The survey’s roadmap',
          questions: [
            {
              prompt:
                'Why does "Harness Mechanisms" (§3, planning/memory/tools/control) come AFTER "Harness Interface" (§2, code for reasoning/acting/environment) in the survey’s organization, rather than before it?',
              options: [
                'The ordering is alphabetical and carries no meaning',
                'Harness Mechanisms only matters once code is already the interface connecting the model to reasoning, acting, and the environment — it governs how that interface is used over many steps, not whether it exists',
                'Harness Interface is a special case of Harness Mechanisms, so it must be introduced first',
                'The two layers could be swapped without changing the survey’s argument',
              ],
              answer: 1,
              explanation:
                '§2 establishes that code IS the interface for reasoning, acting, and environment modeling. §3 then asks: now that code plays that role, how does an agent stay reliable across a long sequence of such steps? Mechanisms presuppose the interface — you can’t plan, remember, or control execution of something that isn’t yet the operational medium.',
            },
            {
              prompt:
                'A team builds a system where a manager agent assigns sub-tasks, a coder agent edits files, and a reviewer agent checks pull requests before merge — all operating on one shared repo. Which layer of the survey’s taxonomy primarily studies this setup?',
              options: [
                'Harness Interface (§2) — code for reasoning/acting/environment for one agent',
                'Harness Mechanisms (§3) — planning/memory/tools/control for one agent over time',
                'Scaling the Harness (§4) — multi-agent roles, interaction modes, and shared workflows over code',
                'Emerging Fields (§5) — applications only, with no taxonomy of its own',
              ],
              answer: 2,
              explanation:
                'Multiple agents with distinct roles (manager, coder, reviewer) coordinating over a shared codebase is exactly the subject of §4, Scaling the Harness — it extends the single-agent interface and mechanisms layers to teams of agents sharing repos, tests, and traces.',
            },
            {
              prompt:
                'If code for reasoning, acting, and environment modeling (§2) already lets one agent do useful work, why does the survey need a separate "Harness Mechanisms" layer (§3) at all?',
              options: [
                'It doesn’t — §3 is redundant and could be merged into §2',
                '§2 establishes code as the connection point for a single step; §3 (planning, memory, tool use, control/optimization) is what keeps that connection reliable across the *many* steps a long-horizon task requires',
                '§3 applies only to multi-agent systems, never to a single agent',
                '§3 is primarily about hardware choices, not software design',
              ],
              answer: 1,
              explanation:
                'A single well-formed "code for reasoning" step doesn’t survive 50 steps on its own — the agent needs to decide what’s next (planning), what to remember (memory), what to call (tools), and how to recover from failures (control/optimization). §3 is the layer that turns one good interaction into a sustained, self-correcting loop.',
            },
          ],
        },
      ],
    },
  ],
}
