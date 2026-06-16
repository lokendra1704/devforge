import type { Module } from '../types'
import agentEnvMd from './md/rl-agent-env-interface.md?raw'
import returnsMd from './md/rl-returns.md?raw'
import markovMd from './md/rl-markov-property.md?raw'
import valueFunctionsMd from './md/rl-value-functions.md?raw'
import optimalValueFunctionsMd from './md/rl-optimal-value-functions.md?raw'

export const rlModule3: Module = {
  id: 'rl-m3',
  title: 'Ch.3 — Finite Markov Decision Processes',
  description:
    'The problem the rest of the book solves: the agent-environment loop, returns and discounting, the Markov property, value functions, and the Bellman (optimality) equations.',
  lessons: [
    {
      id: 'rl-agent-env-interface',
      title: 'The agent-environment interface & the reward hypothesis',
      minutes: 12,
      xp: 60,
      steps: [
        { kind: 'read', title: 'Three signals: state, action, reward', markdown: agentEnvMd },
        {
          kind: 'quiz',
          title: 'Drawing the boundary, choosing the reward',
          questions: [
            {
              prompt:
                'You are designing a chess-playing agent. Which reward scheme best follows the "reward signal communicates what, not how" principle from Section 3.2?',
              options: [
                '+1 for winning, -1 for losing, 0 for draws and all nonterminal positions',
                '+0.1 for every opponent piece captured, +0.05 for controlling center squares',
                'A weighted combination of material advantage and king safety, updated every move',
                '+1 for every move that does not lose material',
              ],
              answer: 0,
              explanation:
                'Rewarding subgoals like captures or center control gives the agent a way to score well without winning the game — it can learn to chase the proxy reward at the expense of the real goal. Only the win/loss/draw signal can\'t be gamed without actually winning.',
            },
            {
              prompt:
                'A robot\'s motors and mechanical linkages are physically part of the robot. Per the agent-environment boundary rule in Section 3.1, are they part of the agent or the environment?',
              options: [
                'Environment — the agent cannot arbitrarily change how the motors convert signals to force, only what signal it sends',
                'Agent — anything physically attached to the robot is part of the agent',
                'Neither — physical hardware is outside the framework entirely',
                'It depends only on which company manufactured the robot',
              ],
              answer: 0,
              explanation:
                'The rule is about control, not physical boundary: "anything that cannot be changed arbitrarily by the agent is considered to be outside of it." The agent picks an action (e.g. a target voltage); how that voltage becomes torque is environment dynamics it does not control.',
            },
          ],
        },
      ],
    },
    {
      id: 'rl-returns',
      title: 'Returns, discounting, and unifying episodic/continuing tasks',
      minutes: 14,
      xp: 70,
      steps: [
        { kind: 'read', title: 'Why infinite sums need a discount', markdown: returnsMd },
        {
          kind: 'code',
          title: 'Compute the discounted return',
          challenge: {
            prompt: `## Discounted return

Given a sequence of future rewards \`[R_t+1, R_t+2, ..., R_T]\` and a discount rate \`gamma\` (0 ≤ gamma ≤ 1), compute the discounted return:

\`\`\`
G_t = R_t+1 + gamma*R_t+2 + gamma^2*R_t+3 + ...
\`\`\`

Write \`discountedReturn(rewards, gamma)\` that returns this sum (a number).

Also write \`isMyopic(gamma)\` that returns \`true\` if \`gamma === 0\` (the agent only cares about the immediate reward) and \`false\` otherwise.`,
            starterCode: `function discountedReturn(rewards, gamma) {
  // sum rewards[k] * gamma^k for k = 0..rewards.length-1
  return 0
}

function isMyopic(gamma) {
  return false
}`,
            solution: `function discountedReturn(rewards, gamma) {
  let g = 0
  for (let k = 0; k < rewards.length; k++) {
    g += Math.pow(gamma, k) * rewards[k]
  }
  return g
}

function isMyopic(gamma) {
  return gamma === 0
}`,
            tests: `test('undiscounted sum when gamma=1', () => {
  assertEqual(discountedReturn([1, 1, 1], 1), 3)
})

test('discounts future rewards', () => {
  const g = discountedReturn([1, 1, 1], 0.5)
  assertEqual(Math.round(g * 100) / 100, 1.75) // 1 + 0.5 + 0.25
})

test('myopic agent only weighs the immediate reward', () => {
  assertEqual(discountedReturn([5, 100, 100], 0), 5)
  assertEqual(isMyopic(0), true)
  assertEqual(isMyopic(0.9), false)
})

test('empty reward sequence returns 0', () => {
  assertEqual(discountedReturn([], 0.9), 0)
})`,
          },
        },
        {
          kind: 'quiz',
          title: 'Episodic vs. continuing',
          questions: [
            {
              prompt:
                'A robot with no shutdown date runs forever, receiving a small reward each step. Why does the book use discounting (gamma < 1) here instead of the plain undiscounted sum from Equation 3.1?',
              options: [
                'Because the undiscounted sum over an infinite continuing task can diverge to infinity, making it impossible to compare policies',
                'Because discounting makes the math harder, which is more rigorous',
                'Because continuing tasks have no rewards at all',
                'Because gamma must always equal exactly 0.9 by convention',
              ],
              answer: 0,
              explanation:
                'If T = ∞ and rewards do not shrink, the plain sum can be infinite for many policies, making them impossible to rank against each other. Discounting with gamma < 1 keeps the sum finite whenever rewards are bounded.',
            },
          ],
        },
      ],
    },
    {
      id: 'rl-markov-property-mdps',
      title: 'The Markov property & Markov decision processes',
      minutes: 12,
      xp: 60,
      steps: [
        { kind: 'read', title: 'What the state owes you (and what it doesn\'t)', markdown: markovMd },
        {
          kind: 'quiz',
          title: 'Markov or not?',
          questions: [
            {
              prompt:
                'A self-driving car\'s state includes its current position and velocity, but it once saw a pedestrian step behind a parked truck and then "forgot" that fact entirely from its state. Is this state Markov?',
              options: [
                'No — it observed information relevant to predicting the future (a pedestrian present) and then discarded it from the state',
                'Yes — position and velocity are always sufficient for a Markov state',
                'Yes — the car cannot be blamed for what it cannot currently sense',
                'It depends only on the make of the sensor',
              ],
              answer: 0,
              explanation:
                'The Markov property is violated specifically by forgetting something once known and relevant — "we don\'t fault an agent for not knowing something that matters, but only for having known something and then forgotten it." Never having seen the pedestrian would be fine; seeing then discarding is the violation.',
            },
            {
              prompt:
                'Why does the book say finite MDPs are "all you need to understand 90% of modern reinforcement learning" even though almost no real-world state is perfectly Markov?',
              options: [
                'Because treating the state as an approximation to Markov still lets the same theory and algorithms apply, with performance degrading gracefully as the approximation gets worse',
                'Because real-world problems are always secretly finite and Markov underneath',
                'Because the Markov property is not actually required for any RL algorithm to work',
                'Because finite MDPs were the first historical formulation, so newer methods abandoned the assumption',
              ],
              answer: 0,
              explanation:
                'The book treats Markov-ness as a spectrum: "it is still appropriate to think of the state in reinforcement learning as an approximation to a Markov state." The closer you get, the better the theory\'s guarantees apply — but algorithms tolerate non-Markov states reasonably well in practice.',
            },
          ],
        },
      ],
    },
    {
      id: 'rl-value-functions-bellman',
      title: 'Value functions and the Bellman equation',
      minutes: 16,
      xp: 80,
      steps: [
        { kind: 'read', title: 'How good is this state, really?', markdown: valueFunctionsMd },
        {
          kind: 'code',
          title: 'One-step Bellman backup on a tiny gridworld',
          challenge: {
            prompt: `## Bellman backup for v_π

You have a 1D "hallway" of 3 non-terminal states \`[0, 1, 2]\` plus a terminal state. The policy always moves +1 (deterministically) until falling off the end into the terminal state, with reward -1 per step (and the terminal state has value 0).

Given a previous value estimate array \`v\` (length 3, one entry per non-terminal state) and discount \`gamma\`, write \`bellmanBackup(v, gamma)\` that returns a NEW array where each state's value is updated via the one-step Bellman equation for this deterministic policy:

\`\`\`
v_new[s] = reward + gamma * v_next
\`\`\`

where \`reward = -1\` always, and \`v_next\` is \`v[s+1]\` if \`s+1\` is still a non-terminal state (s+1 <= 2), otherwise \`0\` (the terminal state's value).`,
            starterCode: `function bellmanBackup(v, gamma) {
  // return a new array, one entry per state in v
  return v
}`,
            solution: `function bellmanBackup(v, gamma) {
  return v.map((_, s) => {
    const sNext = s + 1
    const vNext = sNext <= 2 ? v[sNext] : 0
    return -1 + gamma * vNext
  })
}`,
            tests: `test('terminal-adjacent state only sees the immediate reward and terminal value 0', () => {
  const result = bellmanBackup([0, 0, 0], 1)
  assertEqual(result[2], -1)
})

test('propagates value backward by one step', () => {
  const result = bellmanBackup([0, 0, -5], 1)
  assertEqual(result[1], -6) // -1 + 1*(-5)
})

test('discounting shrinks the propagated value', () => {
  const result = bellmanBackup([0, 0, -10], 0.5)
  assertEqual(result[1], -6) // -1 + 0.5*(-10)
})

test('returns a new array of the same length', () => {
  const v = [0, 0, 0]
  const result = bellmanBackup(v, 0.9)
  assertEqual(result.length, 3)
})`,
          },
        },
      ],
    },
    {
      id: 'rl-optimal-value-optimality-approximation',
      title: 'Optimal value functions, and why exact optimality rarely happens',
      minutes: 14,
      xp: 70,
      steps: [
        { kind: 'read', title: 'v*, q*, and the budget for approximation', markdown: optimalValueFunctionsMd },
        {
          kind: 'scenario',
          title: 'Choosing how to solve an MDP',
          scenario: {
            intro:
              'You are building an RL agent for a warehouse-robot routing task. The state space has about 50,000 discrete states, you have a reasonably accurate transition model, and you have a modest compute budget (a few CPU-hours, not a cluster).',
            stages: [
              {
                situation:
                  'Your manager asks: "Can we just solve the Bellman optimality equation exactly and deploy v*?" You know the state space is 50,000 states (not 10^20 like backgammon), and you have an accurate model.',
                question: 'What is the most defensible answer, given Section 3.9\'s three assumptions for exact optimality?',
                options: [
                  {
                    label:
                      'Yes, likely feasible here: with an accurate model and a state space small enough for tabular methods, solving the system of 50,000 equations is within reach of modest compute — unlike backgammon\'s 10^20 states',
                    quality: 'best',
                    feedback:
                      'Correct. The three blockers are (1) an accurate model, (2) enough compute, (3) the Markov property. With an accurate model and a state space this size, tabular methods can plausibly solve the Bellman optimality equation directly — the warehouse problem does not have backgammon\'s combinatorial explosion.',
                  },
                  {
                    label: 'No — exact optimality is only a theoretical ideal and is never computable for any real task, regardless of state space size',
                    quality: 'bad',
                    feedback:
                      'Too pessimistic. The book is explicit that exact solutions ARE achievable in the tabular case with a small enough state space and an accurate model — that is exactly what dynamic programming (Chapter 4) does. The infeasibility is about scale (e.g. 10^20 states), not a blanket impossibility.',
                  },
                  {
                    label: 'It does not matter — just use whatever policy comes first, since all policies converge to the same reward eventually',
                    quality: 'bad',
                    feedback:
                      'This ignores the entire point of optimal value functions: policies are partially ordered by their value functions, and they do not all converge to the same return. The whole reason v* matters is that policies differ in how much reward they achieve.',
                  },
                ],
              },
              {
                situation:
                  'Six months later, the warehouse adds dynamic obstacles (other robots, shifting shelf layouts), and the state space balloons toward 50 million states with a model that is only approximately accurate.',
                question: 'What is now the right move?',
                options: [
                  {
                    label:
                      'Switch to approximate methods (function approximation, learning from experience) since two of the three assumptions for exact optimality — accurate model and tractable compute — are now violated',
                    quality: 'best',
                    feedback:
                      'Right. This mirrors the book\'s own framing: once the model is no longer accurate and the state space is too large for tabular methods, you settle for approximations — exactly the motivation for Chapters 5 onward (Monte Carlo, TD learning) and Chapter 9 (function approximation).',
                  },
                  {
                    label: 'Keep solving exactly, just give the computation more time',
                    quality: 'bad',
                    feedback:
                      'More time does not fix an inaccurate model, and 50 million states pushes well past what tabular methods can hold in memory or process in reasonable time — this is a qualitative shift, not just a slower version of the same plan.',
                  },
                  {
                    label: 'Ignore the new obstacles in the state representation to keep the state space small',
                    quality: 'ok',
                    feedback:
                      'This can work if done carefully (it is a form of approximation), but dropping relevant information from the state risks violating the Markov property in exactly the way that degrades performance — better to use a principled approximation method than to silently discard signal.',
                  },
                ],
              },
            ],
            debrief:
              'Exact optimality is a north star, not a default plan: it is achievable on small, well-modeled tabular problems (Chapter 4\'s dynamic programming), but the moment the state space or the model accuracy gets out of reach, every other method in this book — Monte Carlo, TD learning, function approximation — is a deliberate trade of exactness for tractability, guided by the same Bellman structure underneath.',
          },
        },
      ],
    },
  ],
}
