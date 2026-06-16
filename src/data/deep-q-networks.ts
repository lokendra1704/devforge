import type { Subject } from '../types'
import motivationMd from './md/dqn-motivation.md?raw'
import fundamentalsMd from './md/dqn-fundamentals.md?raw'
import experienceReplayMd from './md/dqn-experience-replay.md?raw'
import architectureMd from './md/dqn-architecture.md?raw'
import resultsMd from './md/dqn-results.md?raw'
import analysisMd from './md/dqn-analysis.md?raw'

export const deepQNetworks: Subject = {
  id: 'deep-q-networks',
  title: 'Playing Atari with Deep Reinforcement Learning',
  tagline: 'Learn how neural networks master video games from raw pixels using deep Q-learning.',
  icon: '🎮',
  accent: '#3B82F6',
  modules: [
    {
      id: 'dqn-m1',
      title: 'Deep Q-Networks',
      description: 'From RL fundamentals through experience replay to mastering Atari.',
      lessons: [
        {
          id: 'dqn-motivation',
          title: 'The Challenge: Learning from Raw Pixels',
          minutes: 10,
          xp: 50,
          steps: [{ kind: 'read', title: 'Why deep RL seemed impossible', markdown: motivationMd }],
        },
        {
          id: 'dqn-fundamentals',
          title: 'RL Fundamentals: MDPs and Q-Learning',
          minutes: 14,
          xp: 70,
          steps: [
            { kind: 'read', title: 'Markov Decision Processes and Value Functions', markdown: fundamentalsMd },
            {
              kind: 'quiz',
              title: 'RL Concepts',
              questions: [
                {
                  prompt: 'In the Bellman equation Q*(s, a) = E[r + γ·max_a Q*(s\', a\') | s, a], what does γ represent?',
                  options: [
                    'The learning rate (how much we update weights)',
                    'The discount factor (how much we value future rewards)',
                    'The exploration probability (chance of random action)',
                    'The gradient magnitude (size of weight updates)',
                  ],
                  answer: 1,
                  explanation:
                    'γ (gamma) is the discount factor. It scales future rewards exponentially: rewards further in the future are multiplied by smaller powers of γ. This is why immediate rewards are preferred over distant ones. It\'s also necessary mathematically to ensure the sum of infinite rewards converges.',
                },
                {
                  prompt: 'Q-learning is said to be "off-policy." What does this mean?',
                  options: [
                    'The algorithm ignores policies and learns random behavior',
                    'We can learn about the optimal policy while following a different exploratory behavior policy',
                    'The algorithm requires knowing the true policy in advance',
                    'Off-policy means the training data is not from the environment',
                  ],
                  answer: 1,
                  explanation:
                    'Off-policy learning means we can improve our estimate of the optimal policy (which always chooses max_a Q) while following a different, exploratory policy (like ε-greedy). This flexibility is powerful: we explore (to gather diverse data) and simultaneously learn about the best policy. On-policy methods like REINFORCE must learn and follow the same policy.',
                },
                {
                  prompt: 'Why would simply applying Q-learning with a neural network to consecutive game samples likely diverge or fail?',
                  options: [
                    'Neural networks are inherently unstable',
                    'Q-learning cannot work with nonlinear function approximators',
                    'Consecutive samples are highly correlated, the data distribution is non-stationary, and targets depend on the same network being trained',
                    'Games have too many pixels for neural networks to process',
                  ],
                  answer: 2,
                  explanation:
                    'Deep networks assume i.i.d. training data and fixed distributions. Consecutive game frames are nearly identical (high correlation), the policy improves over time (non-stationary distribution), and the Q-learning target uses the network\'s own weights (moving targets). This combination can cause catastrophic divergence. Experience replay fixes this.',
                },
              ],
            },
          ],
        },
        {
          id: 'dqn-experience-replay',
          title: 'Experience Replay: Breaking Correlation',
          minutes: 12,
          xp: 60,
          steps: [
            {
              kind: 'read',
              title: 'The algorithm that stabilizes deep Q-learning',
              markdown: experienceReplayMd,
            },
            {
              kind: 'quiz',
              title: 'Experience Replay Benefits',
              questions: [
                {
                  prompt: 'What is the main problem experience replay solves?',
                  options: [
                    'It makes learning faster by reusing old experiences',
                    'It reduces correlation in training samples and smooths the learning distribution',
                    'It eliminates the need for exploration',
                    'It guarantees convergence to the optimal policy',
                  ],
                  answer: 1,
                  explanation:
                    'Experience replay stores transitions and samples them randomly, which breaks the temporal correlation between consecutive samples. It also pools experiences from many past behaviors, smoothing out the effective training distribution and preventing oscillations when the policy improves suddenly.',
                },
                {
                  prompt: 'By storing and replaying old experiences, DQN is learning off-policy. Why is this necessary?',
                  options: [
                    'Off-policy learning is always faster than on-policy',
                    'The samples come from policies that differ from the current one, so we must use an algorithm that can learn from off-policy data, like Q-learning',
                    'Off-policy learning avoids exploration',
                    'It\'s a limitation; on-policy would be better if technically feasible',
                  ],
                  answer: 1,
                  explanation:
                    'When we sample from a replay buffer of old experiences, those samples were generated by the policy as it was when those transitions occurred. The current policy is different (it\'s improved). Q-learning is off-policy: it learns the optimal policy even when following a different behavior policy. On-policy methods like policy gradient or SARSA would be biased by old data.',
                },
              ],
            },
          ],
        },
        {
          id: 'dqn-architecture',
          title: 'Network Design: From Pixels to Q-Values',
          minutes: 13,
          xp: 65,
          steps: [
            { kind: 'read', title: 'Preprocessing and the CNN architecture', markdown: architectureMd },
            {
              kind: 'quiz',
              title: 'Architecture Choices',
              questions: [
                {
                  prompt: 'Why does DQN stack the last 4 frames as input instead of using a single frame?',
                  options: [
                    'It provides more data for the network to train on',
                    'A single frame doesn\'t fully specify game state; temporal context is needed to infer velocity and direction',
                    'It increases the input size, forcing the network to be more powerful',
                    'It allows the network to ignore the current frame and only look at history',
                  ],
                  answer: 1,
                  explanation:
                    'A single screenshot can be ambiguous: you can\'t tell if a ball is moving left or right without seeing its previous position. By stacking 4 frames, the agent has temporal context and can infer motion. This is a design choice: the network doesn\'t learn this; you hand-craft it as preprocessing.',
                },
                {
                  prompt: 'DQN outputs a Q-value for each action (using a single forward pass) rather than outputting one Q-value per (state, action) pair. Why?',
                  options: [
                    'It\'s theoretically more correct',
                    'Single forward pass scales to any number of actions; the alternative would require K passes for K actions',
                    'The network cannot handle multiple outputs',
                    'It forces the network to learn better representations',
                  ],
                  answer: 1,
                  explanation:
                    'If you parameterize Q to take both state and action as input, you need K forward passes to compute Q-values for all K actions—expensive. By outputting a vector of Q-values, one forward pass gives you all of them. This is a practical design choice that scales linearly with action space size.',
                },
              ],
            },
          ],
        },
        {
          id: 'dqn-results',
          title: 'Mastering Atari: Experimental Results',
          minutes: 11,
          xp: 55,
          steps: [
            { kind: 'read', title: 'Performance on seven games', markdown: resultsMd },
            {
              kind: 'quiz',
              title: 'Results and Generalization',
              questions: [
                {
                  prompt:
                    'DQN used the SAME network architecture and hyperparameters for all seven Atari games. How many game-specific tunings were made?',
                  options: [
                    'One per game (7 total)',
                    'One minor tweak on one game (Space Invaders frame skip)',
                    'Full retraining with custom hyperparameters for each',
                    'None initially, but the paper doesn\'t mention later tuning',
                  ],
                  answer: 1,
                  explanation:
                    'This is the remarkable part: only Space Invaders required a change (frame-skip k=3 instead of k=4, because k=4 made lasers invisible). Every other detail was identical across games, proving the approach is robust and not overfitted to one task.',
                },
                {
                  prompt: 'On how many games did DQN exceed expert human performance?',
                  options: ['One (Pong)', 'Three (Breakout, Enduro, Pong)', 'Five', 'All seven'],
                  answer: 1,
                  explanation:
                    'DQN beat human expert play on Breakout (168 vs 31), Enduro (470 vs 368), and Pong (20 vs -3). On other games like Q*bert and Seaquest, humans are still much better, suggesting those games require longer-horizon planning that the trained agents hadn\'t mastered.',
                },
              ],
            },
          ],
        },
        {
          id: 'dqn-analysis',
          title: 'Understanding Deep Q-Learning: Stability and Design',
          minutes: 15,
          xp: 75,
          steps: [
            { kind: 'read', title: 'Training stability and learning dynamics', markdown: analysisMd },
            {
              kind: 'scenario',
              title: 'When to use DQN',
              scenario: {
                intro:
                  'You\'re designing a new RL system for a different domain. Understand when DQN\'s design choices apply and when they might not.',
                stages: [
                  {
                    situation:
                      'You\'re training an agent to control a robot arm with 50 continuous actions (joint angles). You have 1 million transitions in your replay buffer.',
                    question: 'Which statement best captures a challenge DQN would face here?',
                    options: [
                      {
                        label: 'DQN is designed for discrete actions; with 50 continuous actions, argmax becomes intractable.',
                        quality: 'best',
                        feedback:
                          'Exactly. DQN outputs a Q-value per action and picks the max. With continuous action spaces, you can\'t enumerate all actions. You\'d need variants like DDPG or TD3 that output continuous actions directly.',
                      },
                      {
                        label: 'Experience replay won\'t work because robot movements are deterministic.',
                        quality: 'bad',
                        feedback:
                          'Incorrect. Experience replay breaks correlation regardless of whether the environment is stochastic or deterministic. The issue isn\'t the environment; it\'s the action space.',
                      },
                      {
                        label: 'Reward clipping is perfect for robot learning.',
                        quality: 'bad',
                        feedback:
                          'Reward clipping to {-1, 0, +1} normalizes diverse reward scales (like Atari scores), but for continuous control tasks with meaningful reward magnitudes, clipping would discard important information about how good or bad an outcome is.',
                      },
                    ],
                  },
                  {
                    situation:
                      'You have 10 million frames of gameplay data. You\'re considering whether to use DQN\'s uniform experience replay (equal chance every sample is picked) or a newer method that emphasizes "surprising" or "informative" transitions (prioritized experience replay).',
                    question: 'What is the trade-off?',
                    options: [
                      {
                        label: 'Uniform replay is always better; prioritization wastes computational resources.',
                        quality: 'bad',
                        feedback:
                          'Not true. Prioritization can improve sample efficiency by learning more from high-value transitions. The trade-off is simplicity vs. efficiency, not a clear win for one side.',
                      },
                      {
                        label: 'Prioritized replay likely improves sample efficiency, but uniform replay is simpler and still works well.',
                        quality: 'best',
                        feedback:
                          'Correct. The paper notes that prioritized sweeping could improve learning but leaves it for future work. Uniform replay is simple, and with enough data, it works. Prioritization is an optimization that costs implementation complexity.',
                      },
                      {
                        label: 'Prioritized replay is only useful for very large replay buffers (>10 million frames).',
                        quality: 'ok',
                        feedback:
                          'Partially true. Larger buffers benefit from prioritization because more transitions are "stale." But prioritization can help even with modest buffers if some transitions are much more informative than others.',
                      },
                    ],
                  },
                  {
                    situation:
                      'Your agent trains stably for the first week, but on day 8 you notice a sudden spike in rewards followed by instability. You suspect the replay buffer accumulated too many transitions from an outdated policy.',
                    question: 'What is the most likely root cause?',
                    options: [
                      {
                        label: 'The network is overfitting to the replay buffer.',
                        quality: 'bad',
                        feedback:
                          'Unlikely. Overfitting to finite data would cause performance to plateau, not sudden spikes and crashes. The issue is more likely about the policy distribution.',
                      },
                      {
                        label: 'The replay buffer contains too much data from very old policies, causing a sudden distribution shift when the current policy diverges from them.',
                        quality: 'best',
                        feedback:
                          'This is the classic trade-off. A stale replay buffer is safe (smooth average distribution), but if the current policy drifts far enough, the old data becomes irrelevant, and you\'re learning from distribution shift. Clearing or decaying old data periodically can help.',
                      },
                      {
                        label: 'The exploration rate (ε) needs to be increased to re-stabilize training.',
                        quality: 'ok',
                        feedback:
                          'Possibly helpful, but it doesn\'t address the root cause. Increasing ε gathers more data, but that data is still from a stale buffer. A better fix is to refresh the buffer or use a shorter retention window.',
                      },
                    ],
                  },
                ],
                debrief:
                  'DQN is elegant but has design assumptions: discrete actions, reward clipping as normalization, uniform prioritization. Variants address these trade-offs—DDPG for continuous actions, prioritized experience replay for efficiency, longer replay windows for off-policy stability. Understanding the trade-offs is the key to adapting DQN to new domains.',
              },
            },
          ],
        },
      ],
    },
  ],
}
