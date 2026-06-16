import type { Module } from '../types'
import syntaxToIntentMd from './md/vc-syntax-to-intent.md?raw'
import agentLoopMd from './md/vc-agent-loop.md?raw'
import vibeCodingDefinedMd from './md/vc-vibe-coding-defined.md?raw'
import spectrumMd from './md/vc-spectrum.md?raw'
import contextTypesMd from './md/vc-context-types.md?raw'
import staticDynamicContextMd from './md/vc-static-dynamic-context.md?raw'

export const vcM1: Module = {
  id: 'vc-m1',
  title: 'From Syntax to Intent',
  description:
    'The shift from writing code to expressing intent, what an AI agent actually is, and the spectrum from casual vibe coding to disciplined agentic engineering.',
  lessons: [
    {
      id: 'vc-intro-shift',
      title: 'The Shift from Syntax to Intent',
      minutes: 12,
      xp: 60,
      steps: [
        { kind: 'read', title: 'From syntax to intent', markdown: syntaxToIntentMd },
        { kind: 'read', title: 'AI agents: a quick refresher', markdown: agentLoopMd },
        {
          kind: 'quiz',
          title: 'Agents vs. chatbots',
          questions: [
            {
              prompt: 'What fundamentally distinguishes an AI agent from a chatbot?',
              options: [
                'Agents use a larger model than chatbots',
                'An agent runs its own loop — it plans, acts through tools, observes results, and iterates toward a goal without waiting for the next prompt',
                'Agents can only run in a terminal, not in chat UIs',
                'Chatbots cannot use any tools at all',
              ],
              answer: 1,
              explanation:
                'A chatbot produces a response and waits for the next prompt. An agent is given a goal and runs perceive → plan → act → observe → iterate on its own, deciding what to do next at each step until the goal is met or it hits a stopping condition.',
            },
            {
              prompt: 'Which of these is NOT one of the five parts every AI agent is built from?',
              options: ['Model', 'Memory', 'A graphical user interface', 'Orchestration'],
              answer: 2,
              explanation:
                'The five parts are model (reasoning engine), tools (connect to the world), memory (state across turns/sessions), orchestration (runs the loop), and deployment (turns the prototype into a service). A GUI is not one of them — agents can run entirely from a terminal or in the background.',
            },
            {
              prompt:
                'A developer tells their CTO "we vibe code our payment system" versus "we practice agentic engineering on our payment system." Why does the paper say this distinction matters?',
              options: [
                'It is purely a marketing distinction with no technical difference',
                'Vibe coding implies casual prompt-and-accept with little verification, while agentic engineering implies AI implementing under human-designed constraints with test/eval coverage ensuring correctness — a real difference in risk for production systems',
                'Agentic engineering means no AI is involved at all',
                'The two terms are interchangeable synonyms used by different generations of engineers',
              ],
              answer: 1,
              explanation:
                'The key differentiator across the spectrum is how much structure, verification, and human judgment surrounds the AI output — not whether AI is used at all. For a payment system, that distinction is the difference between an alarming claim and a credible one.',
            },
          ],
        },
      ],
    },
    {
      id: 'vc-vibe-spectrum',
      title: 'The Vibe Coding to Agentic Engineering Spectrum',
      minutes: 14,
      xp: 70,
      steps: [
        { kind: 'read', title: 'What is vibe coding?', markdown: vibeCodingDefinedMd },
        { kind: 'read', title: 'The spectrum', markdown: spectrumMd },
        {
          kind: 'quiz',
          title: 'Tests, evals, and the spectrum',
          questions: [
            {
              prompt: 'Along the vibe-coding-to-agentic-engineering spectrum, what is the single biggest differentiator?',
              options: [
                'Which programming language is used',
                'How outputs get verified — from "does it seem to work?" to automated test suites, CI/CD gates, and LM judges',
                'How many developers are on the team',
                'Whether the code is open source',
              ],
              answer: 1,
              explanation:
                'The spectrum table tracks intent specification, verification, codebase understanding, error handling, scope, and risk — but the paper calls out verification as the single biggest differentiator between the two ends.',
            },
            {
              prompt: 'What is the difference between a "test" and an "eval" in agentic engineering?',
              options: [
                'They are the same thing, just different names',
                'Tests verify deterministic parts (input → expected output), checked by code; evals verify non-deterministic parts (did the agent take the right trajectory, choose the right tools), checked by labelled datasets, rubrics, and LM judges',
                'Tests are for humans, evals are only for AI agents',
                'Evals replace tests entirely once you reach agentic engineering',
              ],
              answer: 1,
              explanation:
                'Without both tests and evals working together, the practice is always vibe coding, regardless of how sophisticated the prompts are — that is how the paper draws the line.',
            },
          ],
        },
        {
          kind: 'scenario',
          title: 'Shipping a payment feature under pressure',
          scenario: {
            intro:
              'Your team has been asked to ship a new payment-processing feature in two days because a partner integration deadline moved up. Leadership wants speed; the system handles real money. You have to decide how to position your team on the vibe-coding-to-agentic-engineering spectrum for this specific task.',
            stages: [
              {
                situation:
                  'A senior engineer suggests: "Let\'s just prompt the coding agent, accept what it gives us, and fix anything that breaks in testing — we don\'t have time for formal specs." The deadline is real, but so is the fact that this code moves money.',
                question: 'What is the best response, based on the paper\'s framing of "where you draw the line"?',
                options: [
                  {
                    label:
                      'Push back: the right position on the spectrum depends on the stakes, not the deadline — a production API handling financial transactions demands agentic engineering (specs, tests, and evals), even under time pressure',
                    quality: 'best',
                    feedback:
                      'This matches the paper\'s applied tip directly: stakes, not time pressure, determine where you draw the line. A weekend prototype can be pure vibe coding; a financial production API cannot, no matter the deadline.',
                  },
                  {
                    label: 'Agree — ship fast now, and write tests retroactively next sprint once things calm down',
                    quality: 'bad',
                    feedback:
                      'This is exactly the pattern the paper warns against: verification deferred is verification skipped, and "it seems to work" is not the same as "it works correctly under all conditions" — especially for money movement.',
                  },
                  {
                    label: 'Compromise: skip formal specs but ask the agent to write a few manual smoke tests before merging',
                    quality: 'ok',
                    feedback:
                      'Better than nothing, but manual spot-checking is still closer to the vibe-coding end of the spectrum than the automated test suites and evals the paper says agentic engineering requires for this risk profile.',
                  },
                ],
              },
              {
                situation:
                  'The team agrees to write tests and evals first. Now someone asks: "How do we communicate exactly what this payment feature needs to do, to the agent, precisely enough that it doesn\'t guess wrong on edge cases?"',
                question: 'What is the best mechanism, per the paper?',
                options: [
                  {
                    label:
                      'A well-written test and eval suite — the paper states this communicates intent more precisely than any natural-language prompt, and turns the work from vibe coding into agentic engineering',
                    quality: 'best',
                    feedback:
                      'Tests and evals are described as "the contract with the AI" — they communicate intent more precisely than prose, and writing them before generating code is exactly what shifts the work toward agentic engineering.',
                  },
                  {
                    label: 'A longer, more detailed natural-language prompt with extra adjectives describing correctness',
                    quality: 'bad',
                    feedback:
                      'The paper is explicit that prompt cleverness is not the lever — context and verification are. A longer prompt with no test/eval coverage stays on the vibe-coding end of the spectrum.',
                  },
                  {
                    label: 'A verbal walkthrough with the agent in a chat session',
                    quality: 'ok',
                    feedback:
                      'A conversation can clarify intent in the moment, but it leaves nothing automated to catch regressions later — it lacks the durable, checkable contract that tests and evals provide.',
                  },
                ],
              },
            ],
            debrief:
              'The applied tip from the read step generalizes here: "the skill is knowing where to draw the line for each task." For a payment feature, the line sits firmly on the agentic-engineering end — formal specs, automated tests for the deterministic logic, and evals for agent behavior — regardless of how tight the deadline is.',
          },
        },
      ],
    },
    {
      id: 'vc-context-engineering',
      title: 'Context Engineering: The Real Skill',
      minutes: 13,
      xp: 65,
      steps: [
        { kind: 'read', title: 'Context engineering: the real skill', markdown: contextTypesMd },
        { kind: 'read', title: 'Static vs. dynamic context', markdown: staticDynamicContextMd },
        {
          kind: 'quiz',
          title: 'Six types of context',
          questions: [
            {
              prompt: 'Which of these is one of the six primary types of context an agent needs, per the paper?',
              options: [
                'Bandwidth',
                'Guardrails — hard constraints, formatting rules, and safety validations',
                'Compiler version',
                'GPU temperature',
              ],
              answer: 1,
              explanation:
                'The six types are instructions, knowledge, memory, examples, tools, and guardrails. Guardrails specifically cover hard constraints, formatting rules, and safety validations.',
            },
            {
              prompt: 'Why is static context described as "expensive" compared to dynamic context?',
              options: [
                'Static context requires a paid subscription',
                'Static context is always loaded into every interaction regardless of relevance, so every token in it is paid for every single time, while dynamic context is loaded only when needed',
                'Static context cannot be edited once written',
                'Static context can only be written in English',
              ],
              answer: 1,
              explanation:
                'Static context (system instructions, rule files, global memory, persona) is present in every interaction whether or not it is relevant to the current task — that constant token cost is what makes it expensive relative to on-demand dynamic context.',
            },
            {
              prompt: 'What is the purpose of "progressive disclosure" in Agent Skills?',
              options: [
                'It hides skills from the agent permanently after first use',
                'The agent sees only lightweight metadata at startup, loads full instructions only when a task matches, and pulls deep reference material only when explicitly needed — so it can carry dozens of capabilities while paying token cost for only the one in use',
                'It discloses the agent\'s internal reasoning to the end user',
                'It is a security feature that encrypts skill files',
              ],
              answer: 1,
              explanation:
                'Progressive disclosure is precisely how Agent Skills solve the static-vs-dynamic tradeoff: a lightweight generalist agent flexes into a specialist on demand without paying the full token cost upfront for every skill it might ever need.',
            },
          ],
        },
      ],
    },
  ],
}
