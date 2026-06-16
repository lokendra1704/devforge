import gapMd from './md/mco-gap.md?raw';
import foundationsMd from './md/mco-foundations.md?raw';
import algorithmMd from './md/mco-algorithm.md?raw';
import learningMd from './md/mco-learning.md?raw';
import resultsMd from './md/mco-results.md?raw';
import type { Subject } from '../types';

export const mctsOptions: Subject = {
  id: 'mcts-options',
  title: 'Monte Carlo Tree Search with Options',
  tagline: 'Hierarchical planning in general video game AI',
  icon: '🎮',
  accent: '#4A90E2',
  modules: [
    {
      id: 'mco-m1',
      title: 'Option-based Planning',
      description:
        'Learn how options enable hierarchical planning in MCTS, allowing agents to think in terms of subgoals rather than individual actions.',
      lessons: [
        {
          id: 'mco-gap',
          title: 'The Search Depth Problem',
          minutes: 8,
          xp: 120,
          steps: [
            {
              kind: 'read',
              title: 'Why MCTS Struggles with Subgoals',
              markdown: gapMd,
            },
            {
              kind: 'quiz',
              title: 'Understanding the Gap',
              questions: [
                {
                  prompt:
                    'Why does standard MCTS struggle with games requiring sequential subgoals (like collecting a key before opening a door)?',
                  options: [
                    'It looks too deep and gets lost in the search tree',
                    'It only plans a few actions ahead due to time constraints, missing long-term opportunities',
                    'It requires explicit knowledge of all game rules upfront',
                    'It focuses only on maximizing immediate score',
                  ],
                  answer: 1,
                  explanation:
                    'MCTS has a shallow lookahead (typically 10 moves in 40ms). Games with sequential subgoals require recognizing that action A (get key) enables action B (open door) steps later. MCTS cannot see this connection. Human players, by contrast, think hierarchically: "first I need the key" — a higher-level plan.',
                },
                {
                  prompt:
                    'What is the core insight of human hierarchical planning that MCTS lacks?',
                  options: [
                    'Humans memorize all game rules before playing',
                    'Humans define and pursue intermediate subgoals before committing to a full action sequence',
                    'Humans can plan infinitely far ahead',
                    'Humans use random action selection like MCTS rollouts',
                  ],
                  answer: 1,
                  explanation:
                    'Humans break complex goals into smaller chunks (subgoals). When playing Zelda, a human player thinks "I need to get the key first, then go to the door." This abstraction lets them ignore irrelevant low-level details and focus on what matters. MCTS treats all actions equally and has no such abstraction layer.',
                },
              ],
            },
          ],
        },
        {
          id: 'mco-foundations',
          title: 'MDPs, MCTS, and Options',
          minutes: 12,
          xp: 200,
          steps: [
            {
              kind: 'read',
              title: 'Foundations for Hierarchical Planning',
              markdown: foundationsMd,
            },
            {
              kind: 'quiz',
              title: 'Core Concepts',
              questions: [
                {
                  prompt:
                    'In the UCT (Upper Confidence bounds applied to Trees) formula, what does the term √(ln n_s / n_s′) represent?',
                  options: [
                    'The average reward from child s′',
                    'An exploration bonus that favors poorly explored actions',
                    'The probability of reaching child s′',
                    'The discount factor for future rewards',
                  ],
                  answer: 1,
                  explanation:
                    'The √(ln n_s / n_s′) term is the exploration bonus. It grows as n_s (visits to current node) increases and shrinks as n_s′ (visits to child) increases. Actions visited fewer times get a higher bonus, encouraging exploration of less-visited branches. This balances exploration (trying new things) with exploitation (doing what works).',
                },
                {
                  prompt: 'What are the two key components of an option?',
                  options: [
                    'A policy (how to act) and a termination condition (when to stop)',
                    'A state space and an action space',
                    'A reward function and a transition function',
                    'An initiation set and a discount factor',
                  ],
                  answer: 0,
                  explanation:
                    'An option ⟨I, π, β⟩ includes a policy π (the rule for choosing actions) and a termination condition β (when the subgoal is reached). The initiation set I determines where the option can start. The policy + termination together define a reusable action sequence—e.g., "move toward the key until you pick it up."',
                },
              ],
            },
          ],
        },
        {
          id: 'mco-algorithm',
          title: 'O-MCTS: The Core Innovation',
          minutes: 14,
          xp: 250,
          steps: [
            {
              kind: 'read',
              title: 'How Options Transform the Search Tree',
              markdown: algorithmMd,
            },
            {
              kind: 'quiz',
              title: 'Understanding O-MCTS',
              questions: [
                {
                  prompt:
                    'Why does O-MCTS reach deeper into the search tree than standard MCTS in the same time budget?',
                  options: [
                    'Because it uses a faster computer',
                    'It branches only when an option terminates, not at every action, lowering branching factor and allowing deeper trees',
                    'It explores fewer games, so each gets more time',
                    'It eliminates the rollout phase of MCTS',
                  ],
                  answer: 1,
                  explanation:
                    'Standard MCTS has one choice point per action, creating a high branching factor. O-MCTS has one choice point per *option* — since each option executes multiple actions internally, the tree expands more slowly. This lets O-MCTS build deeper trees (more moves ahead) in the same 40ms time window.',
                },
                {
                  prompt:
                    'In O-MCTS, when does the search tree branch (i.e., create a new choice point)?',
                  options: [
                    'After every action, like in standard MCTS',
                    'Only when an option finishes and its termination condition is met',
                    'Randomly, to ensure exploration',
                    'Only in the rollout phase',
                  ],
                  answer: 1,
                  explanation:
                    'The key insight: O-MCTS only branches when an option *finishes* (its subgoal is reached, e.g., the key is picked up). While an option is active, it controls action selection and the tree does not branch. This is why the branching factor is lower — fewer choice points per decision depth.',
                },
                {
                  prompt:
                    'Why is O-MCTS effective on games like Zelda (get key → unlock door → reach exit)?',
                  options: [
                    'It memorizes the optimal solution',
                    'By abstracting over subgoals, it can recognize that achieving one subgoal (getting the key) enables the next (unlocking the door)',
                    'It uses a different algorithm entirely',
                    'Zelda is a random game, so any algorithm works',
                  ],
                  answer: 1,
                  explanation:
                    'A **GoToKey option** lets O-MCTS commit to pursuing the key without re-exploring random actions at each step. Once the key is collected (option terminates), the algorithm can try **GoToDoor**. The option abstraction makes the sequential structure visible, whereas MCTS would treat "move toward key" and "move toward door" as independent actions in a flat tree.',
                },
              ],
            },
          ],
        },
        {
          id: 'mco-learning',
          title: 'OL-MCTS: Learning Option Values',
          minutes: 11,
          xp: 200,
          steps: [
            {
              kind: 'read',
              title: 'Scaling Option Selection with Learning',
              markdown: learningMd,
            },
            {
              kind: 'quiz',
              title: 'Option Learning and Transfer',
              questions: [
                {
                  prompt:
                    'What problem does OL-MCTS address that O-MCTS has?',
                  options: [
                    'Slower rollouts',
                    'Requires more memory',
                    'The option set grows too large, and exploring all options becomes computationally expensive',
                    'It crashes on certain games',
                  ],
                  answer: 2,
                  explanation:
                    'As games generate more sprites, the number of options grows (GoToSprite_1, GoToSprite_2, …). O-MCTS explores every option at least once, which becomes a bottleneck. OL-MCTS solves this by learning which options are valuable and focusing exploration on the promising ones, reducing wasted time on poor options.',
                },
                {
                  prompt:
                    'How does OL-MCTS transfer knowledge from one game to the next?',
                  options: [
                    'It resets everything and starts fresh',
                    'It memorizes the exact winning strategy',
                    'It carries forward the learned option values (μ and σ) so that good options from game 1 get higher priority in game 5',
                    'It is not designed for transfer learning',
                  ],
                  answer: 2,
                  explanation:
                    'OL-MCTS records the mean return (μ) and variance (σ) for each option type. Option types generalize across levels (a "go near movable" option works similarly in level 1 and level 5). By transferring these values, OL-MCTS avoids re-exploring poor options — it enters game 5 knowing which options worked in game 1.',
                },
              ],
            },
          ],
        },
        {
          id: 'mco-results',
          title: 'Empirical Evaluation',
          minutes: 10,
          xp: 180,
          steps: [
            {
              kind: 'read',
              title: 'Results Across 28 Games',
              markdown: resultsMd,
            },
            {
              kind: 'scenario',
              title: 'Choosing Between MCTS and O-MCTS',
              scenario: {
                intro:
                  'You are designing an AI player for a new game in the general video game competition. The competition gives each algorithm 40ms per action. You must choose: standard MCTS or O-MCTS with a predefined set of options.',
                stages: [
                  {
                    situation:
                      'Your game has a clear subgoal structure: you must collect three items in order (A, then B, then C) before you can reach the goal. Once you collect A, B becomes available. Once you have B, C appears. There are fewer than 5 sprites on screen at any time.',
                    question:
                      'Which algorithm is better suited, and why?',
                    options: [
                      {
                        label: 'MCTS',
                        quality: 'bad',
                        feedback:
                          'With only 40ms, MCTS cannot look far enough ahead to discover the A→B→C dependency. Its 10-move lookahead falls short. O-MCTS, with options like GoToItemA → GoToItemB → GoToItemC, can abstract over the subgoal structure and plan at the right level.',
                      },
                      {
                        label: 'O-MCTS',
                        quality: 'best',
                        feedback:
                          'O-MCTS excels here. The subgoal structure (A→B→C) aligns perfectly with option abstraction. Fewer sprites mean a manageable option set (no computational overhead). O-MCTS can look 3 options deep (each spanning multiple actions) in the same time standard MCTS looks 10 actions deep.',
                      },
                    ],
                  },
                  {
                    situation:
                      'Your game is fast-paced: the avatar avoids 12 enemies, each spawning its own AvoidEnemy option, plus 8 collectible objects, each spawning GoToObject options. The game has no clear sequential structure — just raw survival/scoring. You have options defined for all sprites.',
                    question:
                      'Which algorithm is better suited, and why?',
                    options: [
                      {
                        label: 'MCTS',
                        quality: 'best',
                        feedback:
                          'MCTS is better here. With 20+ options in the set, O-MCTS spends too much time constructing and exploring options, leaving little time for deep rollouts. Standard MCTS does not incur this overhead and can build a faster, shallower tree. For a non-hierarchical game, the lower branching factor of O-MCTS is not worth the option-set management cost.',
                      },
                      {
                        label: 'O-MCTS',
                        quality: 'bad',
                        feedback:
                          "O-MCTS underperforms when there are many options and no clear subgoals. The algorithm spends time maintaining the large option set (12 enemy avoidance + 8 object pursuit options) rather than exploring. This overhead leaves less time for deep planning, eroding O-MCTS's advantage.",
                      },
                    ],
                  },
                  {
                    situation:
                      'Your game is similar to the second scenario (12 enemies, 8 objects), but the competition rules allow you to *play the same 5 levels multiple times* before advancing. You can train on levels 1–5, then compete on a fresh set of levels.',
                    question:
                      'Which algorithm is better for the competition phase?',
                    options: [
                      {
                        label: 'MCTS (standard)',
                        quality: 'ok',
                        feedback:
                          'MCTS remains a safe choice, as the game is still non-hierarchical. But you miss the opportunity to leverage learning.',
                      },
                      {
                        label: 'OL-MCTS trained on levels 1-5',
                        quality: 'best',
                        feedback:
                          'OL-MCTS shines here. After playing levels 1–5, it has learned which of the 20+ options are worthless (e.g., "avoid enemy 7" never helps) and which are valuable. Entering the competition with these learned values (μ and σ), it applies the crazy stone algorithm to skip the bad options and focus on the good ones. The overhead becomes an asset.',
                      },
                    ],
                  },
                ],
                debrief:
                  'The key tradeoff: O-MCTS wins when the *subgoal structure* matches the option set, or when transfer learning can amortize the option-exploration cost. It loses when the option set is large and sparse (many options, few useful ones) or when the game is flat (no clear subgoals). Understanding your game structure is crucial for algorithm selection.',
              },
            },
            {
              kind: 'quiz',
              title: 'Recap: Results and Lessons',
              questions: [
                {
                  prompt:
                    'On which class of games did O-MCTS significantly outperform MCTS?',
                  options: [
                    'Games with many sprites and no subgoal structure',
                    'Games requiring sequential planning and subgoal reasoning',
                    'Games with random rewards',
                    'Games with very simple rules',
                  ],
                  answer: 1,
                  explanation:
                    'O-MCTS dominated on games like Zelda and Camel Race, where sequential planning (get key → unlock door) or long horizons (80 steps to the goal) were critical. Standard MCTS, limited to 10-step lookahead, could not see these patterns. O-MCTS, leveraging options, could plan at the right abstraction level.',
                },
                {
                  prompt:
                    'When did O-MCTS underperform compared to MCTS?',
                  options: [
                    'On all games',
                    'On games with many sprites and no clear subgoals, where managing the large option set became a bottleneck',
                    'On games with reward',
                    'It never underperformed',
                  ],
                  answer: 1,
                  explanation:
                    'Games like Pac-Man (many sprites, no subgoal structure) led O-MCTS to underperform. The algorithm spent time constructing large option sets (GoToSprite_1, GoToSprite_2, …) instead of exploring the tree. Interestingly, giving O-MCTS more time (120ms instead of 40ms) recovered performance, showing the issue was computational, not algorithmic.',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
