import type { Module } from '../types'
import agentsInDayMd from './md/vc-agents-in-day.md?raw'
import productionAgentsMd from './md/vc-production-agents.md?raw'
import economicsFramingMd from './md/vc-economics-framing.md?raw'
import financialLeverMd from './md/vc-financial-lever.md?raw'
import whereToStartMd from './md/vc-where-to-start.md?raw'
import conclusionMd from './md/vc-conclusion.md?raw'

export const vcM3: Module = {
  id: 'vc-m3',
  title: 'Practice & Economics',
  description:
    'Where coding agents actually fit in a developer\'s day, and what agentic engineering really costs versus vibe coding once you account for token burn, maintenance, and security debt.',
  lessons: [
    {
      id: 'vc-agents-in-practice',
      title: 'Coding Agents in Practice',
      minutes: 12,
      xp: 60,
      steps: [
        { kind: 'read', title: "Where coding agents fit in the developer's day", markdown: agentsInDayMd },
        { kind: 'read', title: 'Vibe coding production-ready agents', markdown: productionAgentsMd },
        {
          kind: 'quiz',
          title: 'Picking the right mode',
          questions: [
            {
              prompt:
                'A developer needs to migrate a deprecated API across 40 files. The task can be described in a single paragraph, and the developer plans to walk away and check back later. Which agent mode fits best?',
              options: ['Editor agent', 'Terminal agent', 'Background agent', 'No agent — do it by hand'],
              answer: 2,
              explanation:
                'Background agents fit well-specified tasks you can describe in a paragraph and walk away from — migrations, known bug fixes, test generation — producing a PR for later review.',
            },
            {
              prompt:
                'A team building a customer-support bot that will serve real users finds that a coding agent in the terminal can produce a working prototype in an afternoon. Why isn\'t that prototype itself the production agent?',
              options: [
                'Coding agents cannot write conversational code at all',
                'A production agent needs its own persistent memory, scoped tool permissions, eval coverage, and observability — substrate a one-off terminal session does not provide',
                'Production agents must be written in a different programming language',
                'Terminal agents are not allowed to call external APIs',
              ],
              answer: 1,
              explanation:
                'The paper draws a sharp line: for one-off scripts the agent is the destination, but an agent serving real users at scale needs persistent memory, scoped permissions, eval coverage, and observability underneath it — the substrate, not just the prototype.',
            },
          ],
        },
      ],
    },
    {
      id: 'vc-economics',
      title: 'The Economics of AI Development',
      minutes: 14,
      xp: 80,
      steps: [
        { kind: 'read', title: 'The economics of AI development', markdown: economicsFramingMd },
        { kind: 'read', title: 'Context engineering as a financial lever', markdown: financialLeverMd },
        {
          kind: 'code',
          title: 'Find the break-even month',
          challenge: {
            prompt:
              'Vibe coding has a low upfront cost but a high recurring monthly cost (token burn rate + maintenance tax). Agentic engineering has a high upfront cost (schemas, test suites, context structuring) but a low recurring monthly cost.\n\n' +
              'Implement `breakEvenMonth(vibeUpfront, vibeMonthly, agenticUpfront, agenticMonthly)` that returns the smallest integer month `n >= 1` at which the agentic engineering\'s cumulative TCO (`agenticUpfront + agenticMonthly * n`) first becomes less than or equal to vibe coding\'s cumulative TCO (`vibeUpfront + vibeMonthly * n`). If agentic engineering never catches up (its monthly cost is not strictly lower than vibe coding\'s), return `-1`.',
            starterCode: `function breakEvenMonth(vibeUpfront, vibeMonthly, agenticUpfront, agenticMonthly) {
  throw new Error('not implemented')
}`,
            solution: `function breakEvenMonth(vibeUpfront, vibeMonthly, agenticUpfront, agenticMonthly) {
  const rate = vibeMonthly - agenticMonthly
  if (rate <= 0) return -1
  const diff = agenticUpfront - vibeUpfront
  const n = Math.ceil(diff / rate)
  return n < 1 ? 1 : n
}`,
            tests: `test('catches up at exactly month 5', () => {
  assertEqual(breakEvenMonth(0, 5000, 20000, 1000), 5)
})
test('rounds up to the next whole month', () => {
  assertEqual(breakEvenMonth(2000, 3000, 10000, 500), 4)
})
test('never catches up when agentic monthly cost is not lower', () => {
  assertEqual(breakEvenMonth(0, 100, 5000, 200), -1)
})`,
          },
        },
        {
          kind: 'quiz',
          title: 'CapEx, OpEx, and model routing',
          questions: [
            {
              prompt:
                'Vibe coding has near-zero CapEx — a subscription and a few prompts. Why does the paper still call its TCO a "hidden debt"?',
              options: [
                'Because subscriptions always raise prices over time',
                'Because the low upfront cost is offset by a high recurring OpEx: token burn from unstructured prompting loops, a maintenance tax on unstructured code, and security remediation',
                'Because vibe coding requires buying dedicated GPU hardware',
                'Because agentic engineering is always cheaper in every scenario',
              ],
              answer: 1,
              explanation:
                'The low CapEx of vibe coding hides a compounding OpEx: token burn rate, maintenance tax, and security remediation costs that exceed what agentic engineering\'s upfront investment would have cost.',
            },
            {
              prompt: 'What problem does intelligent model routing solve in the factory model?',
              options: [
                'It guarantees 100% test coverage automatically',
                'It avoids paying premium frontier-model token prices for deterministic, low-complexity tasks by routing those to smaller, cheaper models while reserving large models for complex work',
                'It replaces the need for an AGENTS.md file',
                'It eliminates the need for human code review entirely',
              ],
              answer: 1,
              explanation:
                'Model routing sends complex work (requirements, architecture, initial implementation) to large frontier models, and deterministic work (test generation, code review, CI/CD monitoring) to smaller, cheaper models — maintaining quality while driving down token cost.',
            },
          ],
        },
      ],
    },
    {
      id: 'vc-where-to-start',
      title: 'Where to Start',
      minutes: 10,
      xp: 60,
      steps: [
        { kind: 'read', title: 'Where to start', markdown: whereToStartMd },
        { kind: 'read', title: 'Conclusion: intent as the new interface', markdown: conclusionMd },
        {
          kind: 'scenario',
          title: 'Rolling out AI coding agents to a 20-person team',
          scenario: {
            intro:
              'You lead a 20-person engineering team. Several developers have started using AI coding agents on their own, with mixed results. You\'ve been asked to set team-wide norms for adopting them safely.',
            stages: [
              {
                situation:
                  'In a team meeting, an engineer demos an agent that built a working feature end-to-end in five minutes. The room is impressed and someone suggests merging it into the production branch today.',
                question: 'What do you do next?',
                options: [
                  {
                    label: 'Merge it — the demo worked, and shipping fast is the whole point of these tools',
                    quality: 'bad',
                    feedback:
                      'A working demo proves the agent can succeed once. It says nothing about edge cases, error handling, or whether it\'ll keep working under different inputs — exactly the gap the paper warns "production outages... live" in.',
                  },
                  {
                    label: 'Have one senior engineer skim the diff before merging',
                    quality: 'ok',
                    feedback:
                      'Better than nothing, but a single skim is a manual spot-check, not systematic verification — it catches obvious problems, not subtle conceptual ones.',
                  },
                  {
                    label: 'Require a passing eval suite with an explicit rubric before the feature is allowed into production',
                    quality: 'best',
                    feedback:
                      'This is the paper\'s core advice for leaders: "set the bar at the eval, not the demo." A demo proves it can work once; an eval suite with a defined rubric proves it works reliably.',
                  },
                ],
              },
              {
                situation:
                  'Three months later, agent-generated pull requests have tripled the team\'s weekly PR volume. Reviewers are overwhelmed and starting to rubber-stamp anything that passes CI.',
                question: 'How do you respond?',
                options: [
                  {
                    label: 'Leave the review process exactly as it was for human-written code',
                    quality: 'bad',
                    feedback:
                      'AI-generated code needs the same or greater scrutiny, with attention to failure modes — hallucinated dependencies, inadequate error handling — that human-written code rarely has. Treating it identically misses those patterns.',
                  },
                  {
                    label: 'Re-shape review checklists specifically for AI failure modes, and train reviewers on what to look for',
                    quality: 'best',
                    feedback:
                      'Exactly the paper\'s recommendation: re-shape code review for AI-generated code, training reviewers on its specific failure modes rather than relying on the same checklist used for human-written PRs.',
                  },
                  {
                    label: 'Skip review for any PR where CI passes, to keep up with volume',
                    quality: 'bad',
                    feedback:
                      'Passing tests check the deterministic surface, not architectural fit or subtle correctness gaps that "look right at a glance" — the paper specifically warns these gaps are harder to catch in AI output.',
                  },
                ],
              },
            ],
            debrief:
              'Both decisions trace back to the same three durable principles: structure scales but vibes don\'t (an eval beats a demo), AI amplifies whatever engineering culture it lands in (a sloppy review process gets more sloppy, not less), and the human role shifts from writing code to exercising judgment over what the agent produced.',
          },
        },
      ],
    },
  ],
}
