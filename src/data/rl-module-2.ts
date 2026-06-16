import type { Module } from '../types'
import banditProblemMd from './md/rl-bandit-problem.md?raw'
import incrementalUpdateMd from './md/rl-incremental-update.md?raw'
import optimisticUcbMd from './md/rl-optimistic-ucb.md?raw'
import gradientAssociativeMd from './md/rl-gradient-associative.md?raw'

export const rlModule2: Module = {
  id: 'rl-m2',
  title: 'Ch.2 — Multi-arm Bandits',
  description:
    'Balancing exploration and exploitation in the simplest possible setting: ε-greedy, incremental updates, optimistic initialization, UCB, and gradient bandits — the toolbox the rest of the book builds on.',
  lessons: [
    {
      id: 'rl-bandit-exploration',
      title: 'The n-armed bandit & ε-greedy methods',
      minutes: 12,
      xp: 60,
      steps: [
        { kind: 'read', title: 'The slot machine with a brain', markdown: banditProblemMd },
        {
          kind: 'quiz',
          title: 'Exploit vs. explore',
          questions: [
            {
              prompt:
                'On the 10-armed testbed, pure greedy (ε=0) found the optimal action in only about one-third of the 2,000 tasks. Why does it get stuck so often?',
              options: [
                'Because greedy is mathematically incapable of converging to any action value',
                'Because one disappointing early sample of the truly-best action can make greedy abandon it forever, since it never tries a non-greedy action again',
                'Because greedy requires more compute per step than ε-greedy',
                'Because the testbed rewards are deterministic, so greedy has no information to act on',
              ],
              answer: 1,
              explanation:
                'Greedy never explores by design — if its first few samples of the optimal action happen to be low, its estimate stays low and it permanently switches to exploiting a worse action, with no mechanism to revisit its mistake.',
            },
            {
              prompt:
                'Which scenario makes ε-greedy exploration LESS valuable relative to plain greedy?',
              options: [
                'The bandit is nonstationary — true action values drift over time',
                'Reward noise (variance) is very high',
                'The task is stationary AND rewards are deterministic (zero variance)',
                'There are many actions to choose from (large n)',
              ],
              answer: 2,
              explanation:
                'With zero variance, greedy learns the true value of an action after trying it just once — so it quickly finds the optimum and exploring further only costs reward with no informational benefit. Exploration earns its keep specifically when there is uncertainty to resolve.',
            },
          ],
        },
      ],
    },
    {
      id: 'rl-incremental-nonstationary',
      title: 'Incremental updates & tracking nonstationary problems',
      minutes: 15,
      xp: 70,
      steps: [
        { kind: 'read', title: "Don't store the history — update the average", markdown: incrementalUpdateMd },
        {
          kind: 'code',
          title: 'Implement the incremental update rule',
          challenge: {
            prompt: `## The incremental average update

Section 2.3 derives the incremental form of a sample average:

\`\`\`
Q_{k+1} = Q_k + (1/k)[R_k − Q_k]
\`\`\`

And Section 2.4 generalizes it to a constant step size for nonstationary problems:

\`\`\`
Q_{k+1} = Q_k + α[R_k − Q_k]
\`\`\`

Implement both, plus a small driver that tracks an action's estimate across a stream of rewards.

1. **\`incrementalUpdate(oldEstimate, target, stepSize)\`** — applies the general update rule \`NewEstimate = OldEstimate + stepSize * (target - OldEstimate)\` and returns the new estimate.

2. **\`sampleAverageEstimate(rewards)\`** — given an array of rewards received in order for one action, returns the final estimate using the sample-average method (step size = 1/k on the k-th reward, starting from an initial estimate of 0). Must use \`incrementalUpdate\` internally, not just \`reduce\` to a mean directly.

3. **\`constantStepEstimate(rewards, alpha, initialEstimate)\`** — same idea, but with a constant step size \`alpha\` instead of \`1/k\`, starting from \`initialEstimate\`.`,
            starterCode: `function incrementalUpdate(oldEstimate, target, stepSize) {
  // TODO: NewEstimate = OldEstimate + stepSize * (target - OldEstimate)
  return 0
}

function sampleAverageEstimate(rewards) {
  // TODO: walk through rewards, using incrementalUpdate with stepSize = 1/k
  // where k is the 1-indexed count of rewards seen so far (including this one)
  return 0
}

function constantStepEstimate(rewards, alpha, initialEstimate) {
  // TODO: same as above but stepSize is always alpha, starting from initialEstimate
  return 0
}`,
            solution: `function incrementalUpdate(oldEstimate, target, stepSize) {
  return oldEstimate + stepSize * (target - oldEstimate)
}

function sampleAverageEstimate(rewards) {
  let estimate = 0
  for (let k = 1; k <= rewards.length; k++) {
    estimate = incrementalUpdate(estimate, rewards[k - 1], 1 / k)
  }
  return estimate
}

function constantStepEstimate(rewards, alpha, initialEstimate) {
  let estimate = initialEstimate
  for (const reward of rewards) {
    estimate = incrementalUpdate(estimate, reward, alpha)
  }
  return estimate
}`,
            tests: `test('incrementalUpdate moves toward target by stepSize fraction', () => {
  assertEqual(incrementalUpdate(0, 10, 0.5), 5)
  assertEqual(incrementalUpdate(4, 4, 0.3), 4)
})

test('sampleAverageEstimate matches the plain mean of all rewards', () => {
  const rewards = [2, 4, 6, 8]
  assertEqual(sampleAverageEstimate(rewards), 5)
})

test('sampleAverageEstimate handles a single reward (Q2 = R1)', () => {
  assertEqual(sampleAverageEstimate([7]), 7)
})

test('constantStepEstimate weights recent rewards more heavily than the sample average', () => {
  // A late big jump in reward should pull a constant-alpha estimate higher
  // than a sample-average estimate, since alpha doesn't shrink over time.
  const rewards = [0, 0, 0, 0, 10]
  const constant = constantStepEstimate(rewards, 0.5, 0)
  const sampleAvg = sampleAverageEstimate(rewards)
  if (!(constant > sampleAvg)) {
    throw new Error('expected constant-step estimate to react more strongly to the recent reward')
  }
})`,
          },
        },
      ],
    },
    {
      id: 'rl-optimistic-ucb',
      title: 'Optimistic initial values & UCB action selection',
      minutes: 12,
      xp: 60,
      steps: [
        { kind: 'read', title: 'Two ways to make exploration smarter', markdown: optimisticUcbMd },
        {
          kind: 'quiz',
          title: 'Smarter exploration',
          questions: [
            {
              prompt:
                'Why does optimistic initialization (e.g. Q1(a) = +5) fail to help on a nonstationary bandit, even though it works well on a stationary one?',
              options: [
                'It causes a division-by-zero error when action values change',
                'The exploration boost is a one-time effect from the initial estimates — once it wears off, nothing brings exploration back if the environment changes later',
                'Optimistic initialization only works with UCB, not with greedy action selection',
                'It requires knowing the true action values in advance',
              ],
              answer: 1,
              explanation:
                'Optimistic initialization spends its exploration budget once, near the start, as the inflated estimates get corrected down to reality. It has no mechanism to re-trigger exploration if the task changes later — only the very beginning of time gets special treatment.',
            },
            {
              prompt:
                'In the UCB formula A_t = argmax_a [Q_t(a) + c√(ln t / N_t(a))], what happens to the bonus term for an action that has NOT been selected in a while, as t increases?',
              options: [
                'It shrinks toward zero because N_t(a) is unaffected by other actions being taken',
                'It grows, because ln t (the numerator) increases every time step regardless of which action is taken, while N_t(a) (the denominator) stays fixed',
                'It stays exactly constant since the action itself hasn\'t changed',
                'It becomes undefined once N_t(a) exceeds t',
              ],
              answer: 1,
              explanation:
                'The numerator ln t grows with every time step no matter what action is taken, while an unselected action\'s N_t(a) stays the same — so its uncertainty bonus keeps climbing the longer it is neglected, eventually forcing UCB to try it again.',
            },
          ],
        },
      ],
    },
    {
      id: 'rl-gradient-associative',
      title: 'Gradient bandits & the road to associative search',
      minutes: 14,
      xp: 65,
      steps: [
        { kind: 'read', title: 'Forget values — learn a preference instead', markdown: gradientAssociativeMd },
        {
          kind: 'scenario',
          title: 'Choosing an exploration strategy',
          scenario: {
            intro:
              'You are designing the action-selection logic for two very different systems, and must pick a bandit strategy from this chapter for each one.',
            stages: [
              {
                situation:
                  'System A: a brand-new feature rollout. You have 5 candidate UI variants, each with a roughly stationary (but completely unknown) conversion rate. You will run this experiment for a fixed, fairly short window before locking in a winner.',
                question: 'Which strategy fits best, and why?',
                options: [
                  {
                    label: 'UCB — it targets uncertainty directly and converges fastest on a stationary testbed',
                    quality: 'best',
                    feedback:
                      'Correct. The task is stationary and you have a fixed, limited window — exactly where UCB\'s evidence shows the best results (Section 2.9), because it concentrates exploration on the variants you genuinely know the least about, rather than wasting trials uniformly like ε-greedy.',
                  },
                  {
                    label: 'ε-greedy with a high, constant ε — simple and guarantees coverage of all variants',
                    quality: 'ok',
                    feedback:
                      'It would work and is simple to implement, but it explores indiscriminately — burning trials on variants you already have strong evidence are bad, which is wasteful in a short, fixed window where every trial counts.',
                  },
                  {
                    label: 'Greedy with sample averages, no exploration at all',
                    quality: 'bad',
                    feedback:
                      'Risky: as the chapter showed, plain greedy found the optimal action only about a third of the time on the 10-armed testbed, because one unlucky early sample can permanently mislead it with no recovery mechanism.',
                  },
                ],
              },
              {
                situation:
                  'System B: an ad-serving bandit where click-through rates for each ad genuinely drift over weeks as creative fatigue sets in and audiences shift. There is no fixed end date — it runs indefinitely.',
                question: 'Which strategy fits best, and why?',
                options: [
                  {
                    label: 'Optimistic initialization with sample averages — simple and effective long-term',
                    quality: 'bad',
                    feedback:
                      'This is the textbook failure case: "any method that focuses on the initial state in any special way is unlikely to help with the general nonstationary case" (Section 2.5) — the exploration boost is spent early and never returns when ad performance later drifts.',
                  },
                  {
                    label: 'ε-greedy with a constant step-size (α) average instead of a sample average',
                    quality: 'best',
                    feedback:
                      'Correct combination: ε-greedy keeps exploring forever (unlike optimistic init), and a constant-α update is an exponential recency-weighted average that tracks drifting true values instead of treating all historical clicks equally (Section 2.4).',
                  },
                  {
                    label: 'UCB with the standard sample-average value estimates',
                    quality: 'ok',
                    feedback:
                      'UCB\'s exploration bonus alone doesn\'t fix nonstationarity — its value estimates still need a recency-weighted update; the book notes UCB needs "something more complex than the methods presented in Section 2.4" to handle drifting values well (Section 2.6).',
                  },
                ],
              },
            ],
            debrief:
              'There is no universally best bandit strategy — UCB wins on the stationary testbed by squeezing the most information out of a fixed exploration budget, while ε-greedy with a constant step size is the one strategy in this chapter built to keep working when the ground keeps shifting. Matching the strategy to whether the task is stationary is the real skill, not memorizing which algorithm "wins."',
          },
        },
      ],
    },
  ],
}
