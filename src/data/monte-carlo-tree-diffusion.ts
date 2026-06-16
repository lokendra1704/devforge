import type { Subject } from '../types'
import motivationMd from './md/mctd-motivation.md?raw'
import treeRolloutMd from './md/mctd-tree-rollout.md?raw'
import guidanceMd from './md/mctd-guidance-meta-actions.md?raw'
import jumpyMd from './md/mctd-jumpy-denoising.md?raw'

export const monteCarloTreeDiffusion: Subject = {
  id: 'monte-carlo-tree-diffusion',
  title: 'Monte Carlo Tree Diffusion',
  tagline: 'Combining tree search with diffusion for scalable planning',
  icon: '🌳',
  accent: '#0ea5e9',
  modules: [
    {
      id: 'mctd-m1',
      title: 'Monte Carlo Tree Diffusion',
      description:
        'Yoon et al. (ICML 2025, arXiv:2502.07202): a framework integrating diffusion-based trajectory generation with Monte Carlo Tree Search, enabling inference-time scalability for long-horizon planning through denoising as tree rollouts, guidance levels as meta-actions, and jumpy denoising for fast simulation.',
      lessons: [
        {
          id: 'mctd-m1-l1',
          title: 'Why Diffusion-Based Planning Needs Inference-Time Scaling',
          minutes: 8,
          xp: 40,
          steps: [
            {
              kind: 'read',
              title: 'Diffusion models for planning: strengths and the scaling gap',
              markdown: motivationMd
            },
            {
              kind: 'quiz',
              title: 'The diffusion-MCTS trade-off',
              questions: [
                {
                  prompt:
                    'What is the key limitation of diffusion-based planners compared to MCTS?',
                  options: [
                    'They use more parameters',
                    'They do not show robust inference-time scalability—performance gains from more computation plateau quickly',
                    'They cannot handle long horizons',
                    'They require a forward dynamics model'
                  ],
                  answer: 1,
                  explanation:
                    'Standard diffusion shows diminishing returns with more denoising steps or samples. MCTS, by contrast, uses tree-based adaptive search to leverage extra computation, achieving robust inference-time scalability.'
                }
              ]
            }
          ]
        },
        {
          id: 'mctd-m1-l2',
          title: 'MCTS: Principles, Power, and the Continuous-Action Challenge',
          minutes: 10,
          xp: 50,
          steps: [
            {
              kind: 'read',
              title: 'What makes MCTS scale, and why it struggles with long horizons',
              markdown: `
# Monte Carlo Tree Search: Adaptive Refinement with Hidden Costs

**Monte Carlo Tree Search (MCTS)** combines tree search with stochastic simulations to effectively balance exploration and exploitation. It proceeds in four stages:

1. **Selection**: Traverse the tree from root to leaf using policies like Upper Confidence Bounds for Trees (UCT)
2. **Expansion**: Add new child nodes representing unexplored actions or plans
3. **Simulation**: Estimate the value of a newly added node by rolling out trajectories (often via forward models)
4. **Backpropagation**: Update the node's value through ancestor nodes

Over iterations, **MCTS prunes unpromising branches and refines estimates for promising subtrees**, allowing performance to improve steadily with more computation.

## The Hidden Scalability Limits

Despite its strengths in adaptive search, MCTS has severe practical limitations:

- **Deep trees**: Each node is a single state, so tree depth grows linearly with horizon → exponential search space
- **Discrete actions only**: The algorithm naturally assumes finite action sets; continuous spaces require engineering
- **Large branching**: Both tree depth and width become prohibitively expensive over long horizons
- **Forward model dependency**: MCTS relies on forward models for rollouts, which lose global trajectory consistency

**The core tension**: MCTS excels at adaptive refinement but struggles with the continuous, long-horizon planning domains where diffusion models thrive.
              `
            },
            {
              kind: 'scenario',
              title: 'Choosing between diffusion and MCTS for a long-horizon task',
              scenario: {
                intro: 'You are designing a planning system for a robot arm with a 400-step manipulation task.',
                stages: [
                  {
                    situation:
                      'The task has continuous actions and you want scalability with inference-time computation.',
                    question:
                      'Which approach faces the more fundamental scaling problem?',
                    options: [
                      {
                        label: 'MCTS with single states as nodes',
                        quality: 'best',
                        feedback:
                          'Would create a tree of depth 400, making search infeasible. Continuous actions require additional engineering to discretize or handle implicitly.'
                      },
                      {
                        label:
                          'Diffusion-based planning generates holistically',
                        quality: 'ok',
                        feedback:
                          'Generates entire trajectories in one shot, avoiding deep trees. But it lacks adaptive pruning—without tree search, extra computation shows diminishing returns.'
                      },
                      {
                        label: 'Both face equal challenges',
                        quality: 'bad',
                        feedback:
                          'They face different challenges. MCTS struggles with scalability; diffusion lacks adaptive refinement.'
                      }
                    ]
                  }
                ],
                debrief:
                  'This is exactly the motivation for MCTD: combine diffusion\'s holistic coherence with MCTS\'s adaptive search.'
              }
            }
          ]
        },
        {
          id: 'mctd-m1-l3',
          title: 'Denoising as Tree-Rollout: Operating at Subplan Level',
          minutes: 10,
          xp: 50,
          steps: [
            {
              kind: 'read',
              title:
                'Restructuring the tree: from individual states to temporally extended subplans',
              markdown: treeRolloutMd
            },
            {
              kind: 'quiz',
              title: 'Why subplan abstraction reduces tree depth',
              questions: [
                {
                  prompt:
                    'Why does partitioning a 500-step trajectory into S=5 subplans reduce tree depth?',
                  options: [
                    'Because each subplan uses fewer denoising steps',
                    'Because the tree now has 5 levels (one per subplan) instead of 500 (one per state), dramatically reducing the search space',
                    'Because denoising happens in parallel',
                    'Because it uses discrete actions instead of continuous'
                  ],
                  answer: 1,
                  explanation:
                    'In traditional MCTS, each node is a single state, so tree depth equals the horizon. MCTD moves to subplans—each node now represents ~100 steps, reducing tree depth from 500 to 5 and shrinking the search space from exponential to manageable.'
                }
              ]
            }
          ]
        },
        {
          id: 'mctd-m1-l4',
          title: 'Guidance Levels as Meta-Actions: Exploration-Exploitation Without Discrete Actions',
          minutes: 10,
          xp: 50,
          steps: [
            {
              kind: 'read',
              title: 'Using guidance to control the balance between exploration and exploitation',
              markdown: guidanceMd
            },
            {
              kind: 'quiz',
              title: 'Mapping guidance levels to search strategy',
              questions: [
                {
                  prompt:
                    'What does the NO_GUIDE meta-action correspond to in terms of exploration vs. exploitation?',
                  options: [
                    'Exploitation—it actively seeks high rewards',
                    'Exploration—it samples from the prior without reward targeting, discovering diverse options',
                    'It is neutral; neither explores nor exploits',
                    'It requires knowing the forward model'
                  ],
                  answer: 1,
                  explanation:
                    'NO_GUIDE samples from p(x) without any reward function, allowing the model to follow the learned data distribution—exploratory behavior. GUIDE, by contrast, steers toward high-reward trajectories via classifier guidance.'
                }
              ]
            },
            {
              kind: 'scenario',
              title: 'Applying guidance levels across a trajectory',
              scenario: {
                intro:
                  'You are running MCTD on a manipulation task. How should you use guidance levels across 3 subplans?',
                stages: [
                  {
                    situation:
                      'Subplan 1 (coarse skill selection): choosing a high-level manipulation strategy.',
                    question: 'Which guidance level is more valuable here?',
                    options: [
                      {
                        label: 'NO_GUIDE: explore diverse skills',
                        quality: 'best',
                        feedback:
                          'Explore diverse skills without committing to a goal early. This broadens the search space to discover alternative approaches.'
                      },
                      {
                        label: 'GUIDE: lock in the best skill immediately',
                        quality: 'bad',
                        feedback:
                          'Committing too early to one skill narrows the search prematurely and may miss better options.'
                      }
                    ]
                  },
                  {
                    situation:
                      'Subplan 3 (final refinement): polishing the chosen trajectory.',
                    question: 'Which guidance level is more valuable here?',
                    options: [
                      {
                        label: 'NO_GUIDE: keep exploring',
                        quality: 'bad',
                        feedback:
                          'At the end, you want to maximize reward given the skill choice, not explore alternatives.'
                      },
                      {
                        label:
                          'GUIDE: exploit the chosen direction to maximize reward',
                        quality: 'best',
                        feedback:
                          'Guide toward high-reward refinements. By this point, the big decisions are made; now optimize details.'
                      }
                    ]
                  }
                ],
                debrief:
                  'Guidance levels enable adaptive balancing: explore early choices broadly, exploit later refinements tightly.'
              }
            }
          ]
        },
        {
          id: 'mctd-m1-l5',
          title: 'Jumpy Denoising: Efficient Trajectory Evaluation Without Forward Models',
          minutes: 8,
          xp: 40,
          steps: [
            {
              kind: 'read',
              title: 'Fast simulation via coarse denoising',
              markdown: jumpyMd
            },
            {
              kind: 'quiz',
              title: 'The speed-accuracy trade-off in tree simulation',
              questions: [
                {
                  prompt:
                    'What is the key trade-off that jumpy denoising makes in the simulation step?',
                  options: [
                    'Accuracy for speed: coarser trajectory estimates enable rapid tree exploration',
                    'Speed for accuracy: it always returns exact rewards',
                    'It eliminates the need for a reward function',
                    'It requires a forward model'
                  ],
                  answer: 0,
                  explanation:
                    'Jumpy denoising skips steps in the diffusion process to complete trajectories quickly. This trades some accuracy for speed—a good bet because many rough estimates guide the search better than a few perfect ones.'
                }
              ]
            }
          ]
        },
        {
          id: 'mctd-m1-l6',
          title: 'The MCTD Algorithm: Four MCTS Steps in Diffusion',
          minutes: 12,
          xp: 60,
          steps: [
            {
              kind: 'read',
              title: 'How Selection, Expansion, Simulation, and Backpropagation unify search and generation',
              markdown: `
# The Four MCTS Steps, Adapted for Diffusion

MCTD brings the four traditional MCTS steps into the diffusion framework:

## 1. Selection

Traverse from root toward a leaf node, choosing promising branches via Upper Confidence Bound (UCB).

- **No denoising required**: Just tree navigation, unlike Expansion/Simulation
- **Guidance adjustment**: UCB dynamically balances exploration (NO_GUIDE) vs. exploitation (GUIDE)
- **Higher abstraction**: Nodes represent subplans, not states, enabling hierarchical reasoning

## 2. Expansion

Generate **new child nodes by extending the partially denoised trajectory**:

- Sample the next subplan from either the exploratory prior p(x_s|x_{1:s-1}) or goal-seeking p_g(x_s|x_{1:s-1})
- The meta-action g_s determines which distribution to use
- Add the new node to the tree as an extension of the current partial trajectory

## 3. Simulation

Quickly complete the trajectory via **jumpy denoising**:

$$\\tilde{x}_{s+1:S} \\sim p(x_{s+1:S} | x_{1:s}, g)$$

Evaluate with the reward function r(x̃). This trade-off (rough estimates, fast computation) is ideal for search.

## 4. Backpropagation

Propagate the reward value **up the tree**:
- Update visit counts and value estimates for all ancestor nodes
- Refine the meta-action schedule based on the reward

Over many iterations, the tree **converges toward high-reward solutions** while pruning unpromising branches.

## Why This Architecture Works

Each step serves a clear purpose:
- **Selection** narrows search adaptively
- **Expansion** explores new refinements
- **Simulation** evaluates them cheaply
- **Backpropagation** refines the tree

The result: **robust inference-time scalability**—as computation increases, MCTD continues improving solution quality, just like MCTS does, but with the global coherence and continuous-action handling of diffusion.
              `
            },
            {
              kind: 'quiz',
              title: 'Which MCTS step avoids expensive denoising?',
              questions: [
                {
                  prompt:
                    'Which MCTS step in MCTD does NOT require expensive denoising?',
                  options: [
                    'Selection—it just traverses the existing tree',
                    'Expansion—it generates new subplans',
                    'Simulation—it evaluates trajectories',
                    'Backpropagation—it updates values'
                  ],
                  answer: 0,
                  explanation:
                    'Selection traverses the tree using UCB without invoking the diffusion model. Expansion and Simulation both trigger denoising; Backpropagation only updates statistics.'
                }
              ]
            }
          ]
        },
        {
          id: 'mctd-m1-l7',
          title: 'Empirical Results: Where MCTD Wins and Trade-Offs',
          minutes: 10,
          xp: 50,
          steps: [
            {
              kind: 'read',
              title: 'Results, ablations, and when MCTD excels',
              markdown: `
# Experiments, Scaling, and Practical Trade-Offs

## Tested Domains

MCTD is evaluated on long-horizon planning tasks:

1. **Maze navigation**: Point-mass and Ant robots in complex mazes
2. **Robot arm manipulation**: Multi-step cube manipulation
3. **Visual pointmaze**: Long-horizon navigation from visual observations

## The Scaling Win

**MCTD outperforms diffusion baselines as inference-time computation increases.**

- Naive diffusion: more steps or samples yield diminishing returns
- MCTD: performance continues to improve with more tree iterations, matching MCTS behavior

This is the central result: **adaptive tree-based search unlocks the scaling property that diffusion lacked**.

## Ablations: Which Components Matter?

The paper validates all three innovations through ablations:

1. **Greedy tree search** vs. MCTD: Does tree structure beat greedy expansion?
2. **Meta-action set**: Binary guidance vs. multi-level (ZERO, LOW, MEDIUM, HIGH)?
3. **Subplan length**: How does partition size S affect scalability?
4. **Causal denoising**: Is semi-autoregressive structure necessary?

Results show that all three innovations—tree structure, guidance levels, and jumpy denoising—contribute meaningfully.

## Trade-Offs and Limitations

**When MCTD excels**:
- Long horizons (S ≪ N) where tree depth savings matter
- Inference-time computation is available for many iterations
- Reward signals are informative for evaluation

**When MCTD matters less**:
- Short horizons where diffusion already works well
- One-shot planning required (no time for iterations)
- Sparse or noisy reward functions (jumpy denoising struggles)

**Computational overhead**: Tree bookkeeping and guidance scheduling add cost.

## Broader Context

MCTD exemplifies integrating search and generation: a generative model provides fast, coherent rollouts while a search algorithm provides adaptive refinement. This hybrid pattern may become standard for hard planning tasks.
              `
            },
            {
              kind: 'scenario',
              title: 'Deciding between MCTD and standard Diffuser',
              scenario: {
                intro: 'You are designing a planning system for a real-world robotic arm.',
                stages: [
                  {
                    situation:
                      'Task: 400-step manipulation, compute available for inference, sparse reward signal.',
                    question: 'Which approach is better suited?',
                    options: [
                      {
                        label: 'Standard Diffuser: faster to deploy',
                        quality: 'ok',
                        feedback:
                          'Faster initially, but performance plateaus and does not benefit from extra computation.'
                      },
                      {
                        label:
                          'MCTD: scales with computation, maintains coherence, handles continuous control',
                        quality: 'best',
                        feedback:
                          'MCTD combines diffusion coherence with tree-based scalability. With available compute, extra iterations improve solution quality.'
                      }
                    ]
                  },
                  {
                    situation:
                      'New constraint: Must plan in <100ms; inference budget is very tight.',
                    question: 'Which approach is better suited?',
                    options: [
                      {
                        label: 'MCTD: tree iterations are cheap',
                        quality: 'bad',
                        feedback:
                          'Even efficient tree iterations add up. MCTD only wins if you have time for multiple iterations.'
                      },
                      {
                        label:
                          'Standard Diffuser: one-shot generation is faster with tight latency budgets',
                        quality: 'best',
                        feedback:
                          'With <100ms latency, one-shot generation beats iterative refinement. Use Diffuser and optimize denoising steps instead.'
                      }
                    ]
                  }
                ],
                debrief:
                  'MCTD trades latency for solution quality. Choose based on your compute-latency trade-off.'
              }
            }
          ]
        }
      ]
    }
  ]
}
