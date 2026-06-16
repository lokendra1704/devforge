import type { Module } from '../types'
import policyEvaluationMd from './md/rl-policy-evaluation.md?raw'
import policyImprovementMd from './md/rl-policy-improvement.md?raw'
import policyIterationMd from './md/rl-policy-iteration.md?raw'
import valueIterationMd from './md/rl-value-iteration.md?raw'
import asyncDpMd from './md/rl-async-dp.md?raw'
import gpiMd from './md/rl-gpi.md?raw'
import dpEfficiencyMd from './md/rl-dp-efficiency.md?raw'

export const rlModule4: Module = {
  id: 'rl-m4',
  title: 'Ch.4 — Dynamic Programming',
  description:
    'Computing optimal policies given a complete model of the environment: iterative policy evaluation, the policy improvement theorem, policy iteration, value iteration, asynchronous DP, and the generalized policy iteration (GPI) pattern that frames the rest of the book.',
  lessons: [
    {
      id: 'rl-policy-evaluation-improvement',
      title: 'Policy evaluation & policy improvement',
      minutes: 14,
      xp: 70,
      steps: [
        { kind: 'read', title: 'Policy evaluation: grading a fixed policy', markdown: policyEvaluationMd },
        { kind: 'read', title: 'Policy improvement: can you beat it?', markdown: policyImprovementMd },
        {
          kind: 'quiz',
          title: 'Evaluation vs. improvement',
          questions: [
            {
              prompt:
                'Iterative policy evaluation updates V(s) using a "full backup." What makes a backup "full" rather than "sample"?',
              options: [
                'It uses every possible next state and reward, weighted by p(s’,r|s,a), rather than one sampled outcome',
                'It updates every state in the MDP during a single backup call',
                'It always uses two arrays instead of updating in place',
                'It only applies to terminal states',
              ],
              answer: 0,
              explanation:
                'A full backup sums over the entire distribution of possible next states and rewards for an action, using the model p(s’,r|s,a) directly — as opposed to a sample backup, which uses just one actually-observed transition (the basis of Monte Carlo and TD methods in later chapters).',
            },
            {
              prompt:
                'You compute v_π for policy π. For one state s, you find q_π(s,a) > v_π(s) for some action a ≠ π(s). What does the policy improvement theorem guarantee if you switch to a only at s?',
              options: [
                'Nothing is guaranteed without re-evaluating the whole policy from scratch',
                'The new policy is guaranteed to be at least as good as π everywhere, with strict improvement at s',
                'The new policy is guaranteed to be optimal',
                'The new policy will only be better if a is also greedy at every other state',
              ],
              answer: 1,
              explanation:
                'The policy improvement theorem only requires q_π(s, π’(s)) ≥ v_π(s) for all s (trivially true elsewhere, since π’ = π there) to guarantee v_π’(s) ≥ v_π(s) everywhere — and strictly so wherever the inequality was strict. It says nothing about optimality, only "no worse, and better somewhere."',
            },
            {
              prompt:
                'What breaks if you try to skip policy evaluation entirely and jump straight from an arbitrary V(s) (not yet equal to v_π) to "go greedy w.r.t. V"?',
              options: [
                'Nothing breaks — greedy improvement works on any value function',
                'The policy improvement theorem’s guarantee no longer applies, because it assumes V is actually v_π for the policy being improved',
                'It only breaks for stochastic policies',
                'It only breaks if γ = 1',
              ],
              answer: 1,
              explanation:
                'The improvement theorem’s proof chains q_π(s,π’(s)) ≥ v_π(s) forward using the Bellman equation for v_π specifically. If V isn’t actually the value function of the policy you’re comparing against, that chain doesn’t hold, and greedy-with-respect-to-an-arbitrary-V has no such guarantee. (This is exactly why value iteration’s correctness argument is different — see the next lesson.)',
            },
          ],
        },
      ],
    },
    {
      id: 'rl-policy-value-iteration',
      title: 'Policy iteration & value iteration',
      minutes: 16,
      xp: 80,
      steps: [
        { kind: 'read', title: 'Policy iteration: alternate evaluate and improve', markdown: policyIterationMd },
        { kind: 'read', title: 'Value iteration: truncate evaluation to one sweep', markdown: valueIterationMd },
        {
          kind: 'code',
          title: 'Implement a value-iteration sweep',
          challenge: {
            prompt: `## Implement \`valueIterationSweep(V, model, gamma)\`

A tiny MDP is described as a **model**: each state name maps to an object of available actions. Each action maps to \`{ next, reward }\` — the (deterministic) next state and the reward for taking that action. A state with **no actions** (an empty object) is terminal and its value stays 0.

Implement the value-iteration backup from the lesson:

\`v_k+1(s) = max_a [ r + γ v_k(s') ]\`

Rules:
- For a terminal state (no actions), the new value is always \`0\`.
- For a non-terminal state, compute \`reward + gamma * V[next]\` for every available action and take the **max**.
- This is a **synchronous** sweep: every state's new value must be computed from the **old** \`V\` passed in, never from values you've already written into the result this sweep.
- Return a brand-new object; don't mutate the input \`V\`.`,
            starterCode: `function valueIterationSweep(V, model, gamma) {
  // For each state in model:
  //   - no actions => stays 0 (terminal)
  //   - otherwise => max over actions of (reward + gamma * V[next]), using the OLD V
  return V
}`,
            solution: `function valueIterationSweep(V, model, gamma) {
  const newV = {}
  for (const s in model) {
    const actions = model[s]
    const actionKeys = Object.keys(actions)
    if (actionKeys.length === 0) {
      newV[s] = 0
      continue
    }
    let best = -Infinity
    for (const a of actionKeys) {
      const { next, reward } = actions[a]
      const successorValue = V[next] !== undefined ? V[next] : 0
      const candidate = reward + gamma * successorValue
      if (candidate > best) best = candidate
    }
    newV[s] = best
  }
  return newV
}`,
            tests: `test('terminal state keeps value 0', () => {
  const model = { C: {} }
  const result = valueIterationSweep({ C: 5 }, model, 0.9)
  assertEqual(result.C, 0)
})

test('single-action state applies one Bellman backup', () => {
  const model = { A: { right: { next: 'B', reward: -1 } }, B: {} }
  const V = { A: 0, B: 5 }
  const result = valueIterationSweep(V, model, 0.9)
  assertEqual(result.A, -1 + 0.9 * 5)
})

test('multi-action state takes the max over actions', () => {
  const model = {
    A: {
      left: { next: 'A', reward: -2 },
      right: { next: 'B', reward: -1 },
    },
    B: {},
  }
  const V = { A: 0, B: 10 }
  const result = valueIterationSweep(V, model, 0.9)
  // left: -2 + 0.9*0 = -2 ; right: -1 + 0.9*10 = 8
  assertEqual(result.A, 8)
})

test('sweep is synchronous: every state updates from the OLD V', () => {
  const model = {
    A: { right: { next: 'B', reward: 0 } },
    B: { right: { next: 'A', reward: 0 } },
  }
  const V = { A: 1, B: 2 }
  const result = valueIterationSweep(V, model, 1)
  assertEqual(result.A, 2)
  assertEqual(result.B, 1)
})`,
          },
        },
      ],
    },
    {
      id: 'rl-async-gpi',
      title: 'Asynchronous DP & generalized policy iteration',
      minutes: 14,
      xp: 70,
      steps: [
        { kind: 'read', title: 'Asynchronous DP: sweeps are optional', markdown: asyncDpMd },
        { kind: 'read', title: 'Generalized policy iteration: the pattern behind the book', markdown: gpiMd },
        {
          kind: 'quiz',
          title: 'GPI and bootstrapping',
          questions: [
            {
              prompt:
                'Backgammon has over 10^20 states, making one full synchronous sweep computationally infeasible. What does asynchronous DP change to address this?',
              options: [
                'It changes the Bellman backup equation itself to require fewer computations per state',
                'It drops the requirement that every state be updated once before any state is updated twice — states can be backed up in any order, any number of times, as long as every state keeps getting visited eventually',
                'It approximates the value function with a neural network instead of a table',
                'It restricts the algorithm to only the states reachable in one step from the start state',
              ],
              answer: 1,
              explanation:
                'Asynchronous DP keeps the exact same backup equation — it just removes the "complete sweep" scheduling constraint. Convergence still holds as long as every state continues to be backed up infinitely often; it does not need fewer states or a different update rule.',
            },
            {
              prompt:
                'Policy iteration, value iteration, and asynchronous DP all look different on the page. What single idea does the chapter say unifies them as GPI?',
              options: [
                'They all use the same programming language constructs',
                'Each is "policy evaluation and policy improvement interacting," differing only in how finely the two processes are interleaved',
                'They all require a complete model of the environment, which is what GPI means',
                'They all converge in exactly the same number of iterations',
              ],
              answer: 1,
              explanation:
                'GPI is explicitly about granularity of interleaving: policy iteration alternates complete evaluation and complete improvement; value iteration interleaves one sweep of each; asynchronous DP interleaves at the level of a single state. The mechanism (evaluate, then improve, repeat) is identical across all three.',
            },
            {
              prompt:
                'What does it mean to say that DP "bootstraps," and why does this matter for the next two chapters?',
              options: [
                'It means DP methods initialize V(s) to nonzero values for faster convergence',
                'It means DP updates an estimate of a state’s value using other estimates (of successor states), rather than ground truth — a property Monte Carlo (next chapter) will lack and TD (the chapter after) will keep',
                'It means DP requires bootstrapping a neural network before training',
                'It means DP methods cannot be parallelized',
              ],
              answer: 1,
              explanation:
                'Bootstrapping is building estimates from other estimates — value iteration’s backup uses v_k(s’), which is itself just an approximation, not the true value. The chapter flags this explicitly as a property that separates DP and TD (both bootstrap) from Monte Carlo methods (which do not).',
            },
          ],
        },
      ],
    },
    {
      id: 'rl-dp-efficiency',
      title: 'Efficiency of DP and where it breaks',
      minutes: 12,
      xp: 60,
      steps: [
        { kind: 'read', title: 'Is DP actually impractical?', markdown: dpEfficiencyMd },
        {
          kind: 'scenario',
          title: 'When is DP worth it?',
          scenario: {
            intro:
              'You’re scoping a planning system. In each case you’re told the size of the state space and whether you have a complete transition model. Decide whether classical DP (policy/value iteration) is the right tool.',
            stages: [
              {
                situation:
                  'A warehouse robot has a state space of about 200,000 states (shelf positions × inventory counts), and you have the exact transition probabilities and reward function from the simulator that generates the warehouse layout.',
                question: 'Is DP a reasonable choice here?',
                options: [
                  {
                    label: 'Yes — 200,000 states is well within what DP handles on ordinary hardware, and you have the complete model DP requires',
                    quality: 'best',
                    feedback:
                      'Correct. The chapter notes DP methods solve MDPs with millions of states in practice, and the binding requirement — a complete, accurate model — is satisfied here since the simulator gives you exact transition probabilities.',
                  },
                  {
                    label: 'No — 200,000 states will trigger the curse of dimensionality and DP will not scale',
                    quality: 'bad',
                    feedback:
                      'The curse of dimensionality is about the state space itself being expensive to represent/search, not specifically about DP’s computational cost — DP is comparatively well-suited to large state spaces (better than direct search or linear programming) and 200,000 states is far below the millions DP handles routinely.',
                  },
                  {
                    label: 'No — use Monte Carlo methods instead, since they are always preferable to DP',
                    quality: 'bad',
                    feedback:
                      'Monte Carlo’s advantage is not requiring a model — but here you have an exact model, which is exactly the case DP is designed for and where its polynomial-time guarantee applies. Switching away from DP would throw away information you have for no benefit.',
                  },
                ],
              },
              {
                situation:
                  'A self-driving car’s planning module needs to handle continuous sensor readings (position, velocity, surrounding traffic) and the transition dynamics depend on other drivers’ unknown behavior — there is no explicit p(s’,r|s,a) available.',
                question: 'Is classical DP a reasonable choice here?',
                options: [
                  {
                    label: 'No — DP requires a complete and accurate model of p(s’,r|s,a), which does not exist for unknown driver behavior, and the state space is continuous rather than tabular',
                    quality: 'best',
                    feedback:
                      'Correct on both counts: DP’s backup is literally a sum over p(s’,r|s,a), so without that distribution it cannot even start, and DP as presented in this chapter assumes a finite, tabular state space. This is exactly the gap the next chapters (model-free Monte Carlo/TD) and Chapter 9 (function approximation) are built to close.',
                  },
                  {
                    label: 'Yes — just discretize the continuous variables finely enough and run value iteration',
                    quality: 'ok',
                    feedback:
                      'Discretization is mentioned as a real workaround for continuous spaces, but it does not solve the deeper problem here: you still have no model of other drivers’ transition probabilities, so the DP backup has nothing to sum over regardless of discretization.',
                  },
                  {
                    label: 'Yes — DP is exponentially faster than direct policy search, so it is always the right default',
                    quality: 'bad',
                    feedback:
                      'DP’s polynomial-time advantage over direct search assumes you have the model to run the backup at all. Being theoretically efficient on the problems it can solve does not make it applicable to problems where its core requirement — a known transition model — is missing.',
                  },
                ],
              },
            ],
            debrief:
              'The deciding factor for DP is never raw state-space size alone — it’s whether you have a complete, accurate model AND a state space you can represent (even approximately) as a table. When the model is missing, you need Monte Carlo or TD (Chapters 5–6). When the state space won’t fit in a table, you need function approximation (Chapter 9). DP can survive a large state space; it cannot survive a missing model.',
          },
        },
      ],
    },
  ],
}
