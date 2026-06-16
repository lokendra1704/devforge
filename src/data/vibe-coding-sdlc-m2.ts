import type { Module } from '../types'
import sdlcPressureMd from './md/vc-sdlc-pressure.md?raw'
import sdlcPhasesMd from './md/vc-sdlc-phases.md?raw'
import factoryModelMd from './md/vc-factory-model.md?raw'
import harnessDefinedMd from './md/vc-harness-defined.md?raw'
import harnessSdlcMd from './md/vc-harness-sdlc.md?raw'
import conductorOrchestratorMd from './md/vc-conductor-orchestrator.md?raw'
import eightyPercentMd from './md/vc-80-percent-problem.md?raw'

export const vcM2: Module = {
  id: 'vc-m2',
  title: 'The New SDLC & Harness Engineering',
  description:
    'How AI reshapes every phase of the software development life cycle, and the harness — everything surrounding the model — that turns a raw model into an agent that finishes things.',
  lessons: [
    {
      id: 'vc-sdlc-phases',
      title: 'How AI Transforms the SDLC',
      minutes: 14,
      xp: 70,
      steps: [
        { kind: 'read', title: 'The traditional SDLC under pressure', markdown: sdlcPressureMd },
        { kind: 'read', title: 'Phase by phase', markdown: sdlcPhasesMd },
        {
          kind: 'quiz',
          title: 'Where the bottleneck actually moved',
          questions: [
            {
              prompt: 'Why does design and architecture remain the most human-centric SDLC phase, even as implementation gets automated?',
              options: [
                'AI models are not yet capable of generating any architectural code',
                'Architectural decisions are trade-offs (consistency vs. availability, build vs. buy) that depend on business context and long-term strategy AI cannot fully grasp',
                'Architecture documents are too long for an AI context window',
                'Regulations forbid AI involvement in system design',
              ],
              answer: 1,
              explanation:
                'AI excels at implementing a decision once it is made (scaffolding, consistent patterns), but the trade-off itself depends on business context, organizational constraints, and strategy — judgment calls that stay with the human, which is why architecture compresses far less than implementation.',
            },
            {
              prompt: 'A METR study found experienced developers using AI assistants took 19% LONGER on certain tasks. What does this actually imply?',
              options: [
                'AI coding assistants are net negative and should be avoided',
                'The bottleneck has shifted from writing code to verifying, debugging, and correcting AI output — implementation time fell but review time grew',
                'The study measured junior developers, who slow down using any new tool',
                'Productivity gains only appear in greenfield projects',
              ],
              answer: 1,
              explanation:
                'AI does not eliminate implementation work so much as transform it from writing to reviewing, guiding, and verifying. For some tasks, that verification overhead outweighs the typing time saved — proof that the 25-39% productivity gains reported elsewhere are not universal or free.',
            },
            {
              prompt: 'In testing & QA, what is the difference between "output evaluation" and "trajectory evaluation," and why do you need both?',
              options: [
                'Output evaluation is for unit tests, trajectory evaluation is for integration tests — they cover different code paths',
                'Output evaluation checks the final artifact (does it compile, do tests pass); trajectory evaluation checks the sequence of tool calls and reasoning — a fluent output that skipped its own verification steps is a more dangerous failure than one with a visible error',
                'Trajectory evaluation is deprecated in favor of output evaluation',
                'They are the same check run at different points in the pipeline',
              ],
              answer: 1,
              explanation:
                'A correct-looking final answer can hide a process that got there by luck or by skipping a verification step it should have run. Checking only the output misses that risk — trajectory evaluation is what catches it.',
            },
          ],
        },
      ],
    },
    {
      id: 'vc-factory-harness',
      title: 'The Factory Model & the Harness',
      minutes: 13,
      xp: 70,
      steps: [
        { kind: 'read', title: 'The factory model', markdown: factoryModelMd },
        { kind: 'read', title: 'Harness engineering', markdown: harnessDefinedMd },
        {
          kind: 'quiz',
          title: 'Model vs. harness',
          questions: [
            {
              prompt: "In the factory model, what becomes the developer's primary output?",
              options: [
                'Hand-written production code, just written faster with AI assistance',
                'The system that produces code: specifications, agents, tests/quality gates, feedback loops, and guardrails',
                'A larger volume of pull requests per sprint',
                'Documentation describing what the AI generated',
              ],
              answer: 1,
              explanation:
                'Like a factory manager who designs the assembly line rather than assembling every widget by hand, the developer designs the system — specs, agents, tests, feedback loops, guardrails — and ensures its output meets the bar, rather than writing every line themselves.',
            },
            {
              prompt: 'Why is "agent = model + harness" rather than just "agent = model"?',
              options: [
                "The harness is just a marketing term for the model's settings panel",
                'A raw model is not an agent — it becomes one only once a harness gives it state, tool execution, feedback loops, and enforceable constraints',
                'Harnesses are only needed for open-source models, not frontier ones',
                'The harness replaces the need for a model entirely in production systems',
              ],
              answer: 1,
              explanation:
                'Treating the model as "the system" leads to the wrong investments: when behavior is good or bad, the model alone is not the explanation. The prompts, tools, context policies, hooks, sandboxes, and observability around it — the harness — dominate what developers actually experience.',
            },
            {
              prompt: 'Which of these is NOT one of the concrete components of a harness?',
              options: [
                'Instructions and rule files (AGENTS.md, CLAUDE.md, skill files)',
                'Sandboxes and execution environments',
                'Observability: logs, traces, evals, cost/latency metering',
                "The size of the model's parameter count",
              ],
              answer: 3,
              explanation:
                "Parameter count is a property of the model, not the harness. The harness is everything wrapped AROUND the model: instructions/rules, tools, sandboxes, orchestration logic, guardrails/hooks, and observability — and it's the team's surface area to own, not the model provider's.",
            },
          ],
        },
      ],
    },
    {
      id: 'vc-harness-sdlc',
      title: 'The Harness Across the SDLC',
      minutes: 15,
      xp: 80,
      steps: [
        { kind: 'read', title: 'Configuring, running, observing the harness', markdown: harnessSdlcMd },
        {
          kind: 'quiz',
          title: 'Mapping harness components to phases',
          questions: [
            {
              prompt: 'During Testing & QA, which harness components create the automated "think → act → observe" loop when a test fails?',
              options: [
                'Instructions and rule files alone',
                'Orchestration logic and guardrails — the harness runs the test, and orchestration logic captures the failure and routes it back to the model to try again',
                'Observability dashboards reviewed by a human the next morning',
                'The deployment pipeline',
              ],
              answer: 1,
              explanation:
                'Orchestration logic is what closes the loop automatically: it captures the error output from the execution environment and routes it back to the model, asking it to try again — no human in the loop for each retry.',
            },
            {
              prompt: 'On Terminal Bench 2.0, a team moved a coding agent from outside the Top 30 to the Top 5 by changing only the harness, with no model change. What does this prove?',
              options: [
                'Benchmarks are unreliable measures of agent quality',
                'The harness has a measurable, often larger effect on agent performance than the underlying model, which is why most agent failures are configuration failures, not model failures',
                'Terminal Bench 2.0 only tests harness configuration, not model capability',
                'Smaller models always outperform larger ones when given a good harness',
              ],
              answer: 1,
              explanation:
                'This is the central claim of harness engineering: when an agent does something wrong, the first instinct is to blame the model, but more often the failure traces back to a missing tool, a vague rule, an absent guardrail, or a noisy context window — all harness, not model, problems.',
            },
          ],
        },
        {
          kind: 'scenario',
          title: 'Diagnose the failure: model or harness?',
          scenario: {
            intro:
              "You're the on-call engineer when a coding agent does something wrong in production. Your instinct — and everyone else's — is to blame the model. The paper's central claim says otherwise: most agent failures, examined honestly, are configuration failures. Each stage below gives you a failure and asks you to find the real root cause.",
            stages: [
              {
                situation:
                  "An agent's pull request imports a package that doesn't exist — a hallucinated dependency. The team's first reaction is to request a newer, smarter model.",
                question: 'What is the more productive next step?',
                options: [
                  {
                    label: 'Swap in the newest frontier model and hope hallucination drops',
                    quality: 'bad',
                    feedback:
                      "Model swaps rarely fix this class of error reliably, and you've spent a migration cycle without addressing the actual gap: there was no guardrail catching unverified imports before they shipped.",
                  },
                  {
                    label: 'Add a hook that verifies every imported package exists in the registry before a commit is allowed',
                    quality: 'best',
                    feedback:
                      'This is a harness fix: a deterministic guardrail at a lifecycle point (before commit) that catches exactly this failure mode every time, regardless of which model is generating the code.',
                  },
                  {
                    label: 'Tell the agent in the next prompt to "please double check your imports"',
                    quality: 'ok',
                    feedback:
                      'A one-off instruction might help this one time, but it is not durable — without it becoming a standing rule or hook, the same failure recurs the next time someone forgets to ask.',
                  },
                ],
              },
              {
                situation:
                  'A different agent keeps making the same mistake across sessions — re-introducing a pattern the team rejected weeks ago. Memory between sessions seems to reset every time.',
                question: 'What is the most likely root cause, and the fix?',
                options: [
                  {
                    label: 'The model has a fundamental memory limitation that cannot be fixed',
                    quality: 'bad',
                    feedback:
                      'This blames the model for what is almost certainly a harness gap: nothing was persisted. Memory is a harness component (rule files, long-term state) — if it is missing, the agent has nothing to recall, no matter how capable the model is.',
                  },
                  {
                    label: 'Add the rejected pattern as a standing rule in the project\'s AGENTS.md / CLAUDE.md so it loads as static context every session',
                    quality: 'best',
                    feedback:
                      "This closes the actual gap: a missing rule file. Once the constraint is written into static context, every session starts knowing the boundary, regardless of which session or which model handles it.",
                  },
                  {
                    label: 'Manually revert the pattern each time it reappears',
                    quality: 'ok',
                    feedback:
                      'This treats the symptom, not the cause — it works, but it costs a human review cycle every single time instead of fixing the harness once.',
                  },
                ],
              },
            ],
            debrief:
              "Two different surface symptoms — hallucinated imports, repeated mistakes — and in both cases the durable fix was a harness change (a hook, a rule file), not a model swap. This is the practical meaning of 'most agent failures are configuration failures': before reaching for a different model, check for a missing tool, a vague rule, an absent guardrail, or a context window stuffed with noise.",
          },
        },
      ],
    },
    {
      id: 'vc-conductor-orchestrator',
      title: 'Conductor and Orchestrator',
      minutes: 14,
      xp: 75,
      steps: [
        { kind: 'read', title: 'Two modes of working with agents', markdown: conductorOrchestratorMd },
        { kind: 'read', title: 'The 80% problem', markdown: eightyPercentMd },
        {
          kind: 'scenario',
          title: 'Pick the mode for the task',
          scenario: {
            intro:
              "It's a normal day with three very different tasks on your plate. The paper frames two modes developers move between: conductor (real-time, hands-on, in the IDE) and orchestrator (async, defines goals, reviews results later). For each task, decide which mode actually fits — not which one feels more impressive.",
            stages: [
              {
                situation:
                  "There's a race condition in an unfamiliar service that only reproduces intermittently in production. You don't yet understand the code's concurrency model.",
                question: 'Conductor or orchestrator?',
                options: [
                  {
                    label: 'Orchestrator — describe the bug in a paragraph and let a background agent investigate for hours',
                    quality: 'bad',
                    feedback:
                      "This is exactly the kind of task the paper warns orchestrator mode is NOT suited for: it needs real-time, in-depth understanding as each change is made, in an unfamiliar codebase. A background agent with no human watching each step is the wrong tool here.",
                  },
                  {
                    label: 'Conductor — work in the IDE with an AI pair-programmer, watching each hypothesis and change as it happens',
                    quality: 'best',
                    feedback:
                      "Tricky debugging in an unfamiliar codebase is the textbook conductor case: the developer needs to understand each change as it's made, maintaining fine-grained control rather than handing off blindly.",
                  },
                  {
                    label: 'Split the work: assign random files to five parallel background agents',
                    quality: 'bad',
                    feedback:
                      'Race conditions are not decomposable this way — understanding the failure requires a coherent, real-time investigation, not parallel uncoordinated guesses across files.',
                  },
                ],
              },
              {
                situation: 'You need to migrate 200 files off a deprecated API to its replacement — a mechanical, well-understood transformation repeated across the codebase.',
                question: 'Conductor or orchestrator?',
                options: [
                  {
                    label: 'Conductor — personally review and approve every single file change as it happens',
                    quality: 'ok',
                    feedback:
                      'This works but caps your throughput at the rate you can personally watch — for a repeatable mechanical transformation across 200 files, that is exactly the bottleneck the paper warns conductor mode can become.',
                  },
                  {
                    label: 'Orchestrator — hand the migration to an agent with the pattern specified, let it run, review the resulting diff/PR',
                    quality: 'best',
                    feedback:
                      'This is the textbook orchestrator case: well-defined, repeatable, walk-away-able. Define the goal precisely, let the agent execute across files, review the result — exactly what tools like background agents and Claude Code are built for.',
                  },
                  {
                    label: 'Do it manually without any AI assistance to avoid review overhead entirely',
                    quality: 'bad',
                    feedback:
                      "This forgoes the entire productivity gain available for exactly this kind of task — mechanical, well-specified work is precisely where agents add the most value with the least risk.",
                  },
                ],
              },
            ],
            debrief:
              "The line between conductor and orchestrator tracks the line in the 80% problem: tasks inside the 80% AI nails — well-specified, pattern-following, mechanical — fit orchestrator mode, where you define goals and review later. Tasks that live in the remaining 20% — ambiguous, novel, requiring deep contextual understanding as you go — need conductor mode, where you stay hands-on. Picking the wrong mode either wastes your time (over-conducting routine work) or ships unverified mistakes (over-orchestrating ambiguous work).",
          },
        },
      ],
    },
  ],
}
