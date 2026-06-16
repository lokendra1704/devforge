import type { Module } from '../types'
import elementsMd from './md/rl-elements.md?raw'
import ticTacToeMd from './md/rl-tic-tac-toe.md?raw'
import historyMd from './md/rl-history.md?raw'

export const rlModule1: Module = {
  id: 'rl-m1',
  title: 'Ch.1 — The Reinforcement Learning Problem',
  description:
    'What makes RL its own paradigm (not supervised, not unsupervised), the four elements of an RL agent, the exploration-exploitation dilemma, and the tic-tac-toe value-function example that previews temporal-difference learning.',
  lessons: [
    {
      id: 'rl-elements',
      title: 'Policy, reward, value, model — and why exploration matters',
      minutes: 14,
      xp: 70,
      steps: [
        { kind: 'read', title: 'The four elements of an RL agent', markdown: elementsMd },
        {
          kind: 'quiz',
          title: 'Check your understanding',
          questions: [
            {
              prompt:
                'A friend says: "Reinforcement learning is basically unsupervised learning, since there\'s no labeled answer key." What\'s the flaw in that claim?',
              options: [
                'RL maximizes a reward signal; unsupervised learning finds hidden structure in unlabeled data. They\'re solving different objectives even though neither uses labels.',
                'RL always has labels, just hidden ones the agent has to guess.',
                'Unsupervised learning also requires an environment and actions, just like RL.',
                'There\'s no real difference — the claim is correct.',
              ],
              answer: 0,
              explanation:
                'The book is explicit that RL is "a third machine learning paradigm" precisely because its goal (maximize reward) differs from unsupervised learning\'s goal (uncover structure), even though both lack a labeled answer key.',
            },
            {
              prompt:
                'Why can a state have low immediate reward but high value?',
              options: [
                'Because value is just reward measured in different units.',
                'Because value accounts for the rewards likely to follow from that state — it can reliably lead somewhere great even if it pays nothing itself.',
                'Because the agent miscalculates value on purpose to encourage exploration.',
                'This situation is impossible in any correctly designed RL system.',
              ],
              answer: 1,
              explanation:
                'Value is a long-run prediction: "a state might always yield a low immediate reward but still have a high value because it is regularly followed by other states that yield high rewards."',
            },
            {
              prompt:
                'An agent always picks the action it currently rates highest, never anything else. What is the most likely failure mode?',
              options: [
                'It will converge faster than any other strategy, with no downside.',
                'It locks onto its current value estimates, which were built from limited experience, and never discovers if a different action is actually better — pure exploitation forgoes the exploration needed to correct wrong estimates.',
                'Nothing breaks; exploration is only needed in supervised learning.',
                'The reward signal becomes undefined.',
              ],
              answer: 1,
              explanation:
                'This is the exploration–exploitation dilemma: "neither exploration nor exploitation can be pursued exclusively without failing at the task." Pure exploitation never tests whether a non-greedy action might have been better.',
            },
          ],
        },
        {
          kind: 'scenario',
          title: 'Designing reward for a warehouse-picking robot',
          scenario: {
            intro:
              'You\'re designing the reward signal for a robot that picks items off shelves and brings them to a packing station. The robot must navigate shelves (sub-goal), grasp an item without dropping it (sub-goal), and deliver it to the station (final goal). You\'re deciding how to structure the reward signal.',
            stages: [
              {
                situation:
                  'Design option A: give reward only when the item is successfully delivered to the packing station (sparse, outcome-only reward). Design option B: give small positive reward for each sub-goal completed (reaching the shelf, grasping cleanly, delivering) in addition to the final delivery reward.',
                question: 'Which reward design is more consistent with how the chapter frames "what is good in the long run" vs. "what is good immediately"?',
                options: [
                  {
                    label:
                      'Option B — shaped sub-goal rewards, as long as they don\'t override the agent\'s incentive to actually complete the final delivery',
                    quality: 'best',
                    feedback:
                      'This matches the chapter\'s framing: the reward signal still "defines what are the good and bad events for the agent," but a long delay between action and consequence makes credit assignment hard. Sub-goal rewards give the value function more frequent, informative signal to learn from, while the final delivery reward remains the dominant term so the agent doesn\'t learn to "farm" sub-goals without ever delivering.',
                  },
                  {
                    label: 'Option A — sparse, outcome-only reward, because the reward signal should never be given for anything but the true goal',
                    quality: 'ok',
                    feedback:
                      'Defensible — the book does emphasize that the reward signal defines the *goal*, and stuffing it with proxy rewards risks misalignment. But it ignores the practical cost: with reward only at the very end of a long action sequence, the agent has very little signal to learn from per episode, and value estimation (the chapter\'s "most important component" of RL) becomes much harder.',
                  },
                  {
                    label: 'Give the robot a large one-time reward for moving fast, regardless of whether it successfully delivers the item',
                    quality: 'bad',
                    feedback:
                      'This reward doesn\'t reflect the actual goal at all. The chapter is explicit that the reward signal "defines what are the good and bad events for the agent" — rewarding speed independent of outcome will train a fast robot that doesn\'t care if it drops the item.',
                  },
                ],
              },
            ],
            debrief:
              'The chapter\'s core distinction — reward is immediate, value is long-run — explains why pure sparse rewards are hard to learn from (little signal) and why naive reward shaping is risky (it can redefine the goal by accident). Good reward design keeps the final outcome dominant while giving the value function enough signal to learn efficiently.',
          },
        },
      ],
    },
    {
      id: 'rl-tic-tac-toe',
      title: 'Worked example: learning tic-tac-toe with a value table',
      minutes: 16,
      xp: 80,
      steps: [
        { kind: 'read', title: 'Why minimax, DP, and evolution all fall short here', markdown: ticTacToeMd },
        {
          kind: 'code',
          title: 'Implement the temporal-difference value update',
          challenge: {
            prompt: `## Implement the tic-tac-toe value update

From the chapter: after a greedy move from state \`s\` to state \`s'\`, the value table is updated by

\`\`\`
V(s) ← V(s) + α[V(s') − V(s)]
\`\`\`

Write a function **\`tdUpdate(values, sequence, alpha)\`** that:
- Takes \`values\`: an object mapping state-id (string) → current value (number)
- Takes \`sequence\`: an array of state-ids visited in order during one game (the states *after* each greedy move, in the order they occurred — e.g. \`['s0', 's1', 's2']\`)
- Takes \`alpha\`: the step-size parameter (number between 0 and 1)
- Applies the TD update to every consecutive pair in the sequence — i.e. for each \`i\`, updates \`values[sequence[i]]\` toward \`values[sequence[i+1]]\`
- Returns the **updated** values object (mutating and returning the same object is fine)

Apply the updates **in the order the game was played**, from the first pair to the last — exactly like the real algorithm: state 0 is backed up against state 1's value *before* state 1 itself gets backed up against state 2. Don't pre-compute all the new values from a snapshot; mutate \`values\` as you go.

If a state-id in \`sequence\` is missing from \`values\`, treat its initial value as \`0.5\` (the book's default guess) before updating.`,
            starterCode: `function tdUpdate(values, sequence, alpha) {
  // TODO: implement V(s) <- V(s) + alpha * (V(s') - V(s))
  // applied in order across the sequence of visited states
  return values
}`,
            solution: `function tdUpdate(values, sequence, alpha) {
  for (let i = 0; i < sequence.length - 1; i++) {
    const s = sequence[i]
    const sNext = sequence[i + 1]
    if (!(s in values)) values[s] = 0.5
    if (!(sNext in values)) values[sNext] = 0.5
    values[s] = values[s] + alpha * (values[sNext] - values[s])
  }
  return values
}`,
            tests: `test('moves value toward the next state, scaled by alpha', () => {
  const values = { s0: 0.5, s1: 0.9 }
  const result = tdUpdate(values, ['s0', 's1'], 0.5)
  assertEqual(result.s0, 0.7, 's0 should move halfway from 0.5 to 0.9')
})

test('applies updates in play order along a chain of three states', () => {
  const values = { s0: 0.5, s1: 0.5, s2: 1.0 }
  const result = tdUpdate(values, ['s0', 's1', 's2'], 0.5)
  assertEqual(result.s0, 0.5, 's0 backs up against s1 before s1 itself is revised, so it uses the stale 0.5 and does not move')
  assertEqual(result.s1, 0.75, 's1 then backs up against s2 (1.0), moving halfway from 0.5 to 0.75')
})

test('defaults missing states to 0.5 before updating', () => {
  const values = { s0: 0.5 }
  const result = tdUpdate(values, ['s0', 's_unseen'], 0.5)
  assertEqual(result.s0, 0.5, 'updating toward a default 0.5 from 0.5 should not move s0')
  assertEqual(result.s_unseen, 0.5, 'unseen state should be initialized to 0.5')
})

test('a single-state sequence makes no updates', () => {
  const values = { s0: 0.5 }
  const result = tdUpdate(values, ['s0'], 0.5)
  assertEqual(result.s0, 0.5, 'no pair to update, value stays the same')
})`,
          },
        },
      ],
    },
    {
      id: 'rl-history',
      title: 'Where RL came from: three threads, one field',
      minutes: 9,
      xp: 45,
      steps: [
        { kind: 'read', title: 'Trial-and-error, optimal control, and temporal-difference learning', markdown: historyMd },
        {
          kind: 'quiz',
          title: 'Tracing the threads',
          questions: [
            {
              prompt:
                'Why did the optimal-control thread (Bellman, dynamic programming) stay separate from learning for so long?',
              options: [
                'Because dynamic programming was developed entirely in secret by a different research community.',
                'Because in its classical form, dynamic programming assumed an off-line computation with a complete, accurate model of the system — it wasn\'t designed for learning from raw, incomplete experience.',
                'Because the math behind value functions had not yet been invented.',
                'Because Bellman opposed the idea of machine learning.',
              ],
              answer: 1,
              explanation:
                'Per Section 1.7, dynamic programming was seen as "an off-line computation depending essentially on accurate system models and analytic solutions to the Bellman equation" — it didn\'t connect with learning from experience until much later work (Werbos, then Watkins\'s Q-learning in 1989).',
            },
            {
              prompt:
                'What makes temporal-difference learning distinctive compared to the other two historical threads?',
              options: [
                'It is the oldest of the three threads.',
                'It requires a complete model of the opponent or environment.',
                'It updates value estimates based on the difference between two temporally successive estimates of the same quantity, rather than a labeled target or an exact model.',
                'It only applies to two-player games.',
              ],
              answer: 2,
              explanation:
                'As described in Section 1.7 (and demonstrated by the tic-tac-toe V(s) update), TD methods are "driven by the difference between temporally successive estimates of the same quantity" — this is what is genuinely new and unique to RL.',
            },
          ],
        },
      ],
    },
  ],
}
