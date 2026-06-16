import type { Subject } from '../types'
import bottleneckMd from './md/dta-attention-bottleneck.md?raw'
import memoryDefMd from './md/dta-memory-definition.md?raw'
import testTimeMd from './md/dta-test-time-memorization.md?raw'
import omegaMd from './md/dta-omega-rule.md?raw'
import capacityMd from './md/dta-memory-capacity.md?raw'
import deepTransformersMd from './md/dta-deeptransformers.md?raw'
import atlasMd from './md/dta-atlas-architecture.md?raw'
import comparisonMd from './md/dta-models-comparison.md?raw'
import experimentsOverviewMd from './md/dta-experiments-overview.md?raw'
import longcontextMd from './md/dta-longcontext-results.md?raw'
import ablationMd from './md/dta-ablation-insights.md?raw'

export const dta: Subject = {
  id: 'deep-transformers-atlas',
  title: 'Deep Transformers & Atlas: Optimal Memory for Long Sequences',
  tagline: 'Master context-aware memory with second-order optimization to handle longer sequences',
  icon: '💾',
  accent: '#06b6d4',
  modules: [
    {
      id: 'dta-m1',
      title: 'Memorization Foundations',
      description: 'Understand why long context matters, associative memory as a framework, and how the Omega rule shifts from online to context-aware updates.',
      lessons: [
        {
          id: 'dta-m1-l1',
          title: 'Why Memory Limits Matter',
          minutes: 10,
          xp: 50,
          steps: [
            {
              kind: 'read',
              title: 'The attention bottleneck and memory perspective',
              markdown: bottleneckMd,
            },
            {
              kind: 'quiz',
              title: 'Understanding attention complexity',
              questions: [
                {
                  prompt: 'Which of the following best explains why attention has quadratic complexity?',
                  options: [
                    'It computes pairwise dependencies between every pair of tokens in a sequence',
                    'It stores one key-value pair per token',
                    'It requires polynomial feature expansion',
                    'It uses second-order optimization',
                  ],
                  answer: 0,
                  explanation: 'Attention computes Q·K^T which is an N×N operation for a sequence of length N, creating the quadratic bottleneck.',
                },
              ],
            },
            {
              kind: 'scenario',
              title: 'Scaling to long medical documents',
              scenario: {
                intro: 'You are building a system to process 100K-token medical documents. A standard transformer with O(N²) attention would struggle.',
                stages: [
                  {
                    situation: 'Your task requires efficient long-context processing without quadratic memory costs.',
                    question: 'What property of associative memory might help solve this?',
                    options: [
                      {
                        label: 'Storing key-value mappings in fixed-size memory parameters instead of growing cache',
                        quality: 'best',
                        feedback: 'Associative memory compresses sequence information into fixed-size parameters, avoiding the quadratic scaling of attention cache.',
                      },
                      {
                        label: 'Using longer training epochs to memorize all patterns',
                        quality: 'bad',
                        feedback: 'Training epochs do not affect inference efficiency or memory scaling.',
                      },
                      {
                        label: 'Increasing batch size for better efficiency',
                        quality: 'bad',
                        feedback: 'Batch size does not change the O(N²) complexity bottleneck of attention.',
                      },
                    ],
                  },
                ],
                debrief: 'Associative memory focuses on learning compact representations of key-value mappings, enabling long-context reasoning without quadratic costs.',
              },
            },
          ],
        },
        {
          id: 'dta-m1-l2',
          title: 'Associative Memory Fundamentals',
          minutes: 12,
          xp: 60,
          steps: [
            {
              kind: 'read',
              title: 'What is associative memory?',
              markdown: memoryDefMd,
            },
            {
              kind: 'read',
              title: 'Test-time memorization vs training',
              markdown: testTimeMd,
            },
            {
              kind: 'quiz',
              title: 'Memory framework and optimization levels',
              questions: [
                {
                  prompt: 'In the associative memory framework, what does the "attentional bias" L represent?',
                  options: [
                    'A bias term added to all memory operations',
                    'The objective function that determines what the memory prioritizes learning',
                    'A penalty for long sequences',
                    'A regularization term for matrix weights',
                  ],
                  answer: 1,
                  explanation: 'The attentional bias L (Equation 3) is the internal objective that defines what and how the memory should learn the key-value associations.',
                },
              ],
            },
            {
              kind: 'scenario',
              title: 'Online vs context-window memory updates',
              scenario: {
                intro: 'A sequence model processes tokens one at a time. The memory module must decide how to update when processing context.',
                stages: [
                  {
                    situation: 'You can either (a) update memory after every single token, or (b) update after observing multiple related tokens.',
                    question: 'Which approach better captures meaningful patterns?',
                    options: [
                      {
                        label: 'After every token (online update)',
                        quality: 'bad',
                        feedback: 'Online updates optimize memory for individual tokens in isolation, missing relationships.',
                      },
                      {
                        label: 'After multiple tokens in context (context window)',
                        quality: 'best',
                        feedback: 'Context windows allow the memory to learn the broader pattern and relationship between tokens, enabling better memorization.',
                      },
                    ],
                  },
                ],
                debrief: 'This distinction between online and context-aware updates is central to understanding why the Omega rule matters.',
              },
            },
          ],
        },
        {
          id: 'dta-m1-l3',
          title: 'Beyond Online Updates — The Omega Rule',
          minutes: 11,
          xp: 55,
          steps: [
            {
              kind: 'read',
              title: 'From online to sliding window optimization',
              markdown: omegaMd,
            },
            {
              kind: 'quiz',
              title: 'Understanding the Omega rule',
              questions: [
                {
                  prompt: 'What is the key difference between the online update (Equation 6) and the Omega rule (Equation 9)?',
                  options: [
                    'Online uses gradient descent, Omega uses random updates',
                    'Online optimizes for the current token only; Omega optimizes over a sliding context window',
                    'Online stores more parameters',
                    'Omega is only for linear memory',
                  ],
                  answer: 1,
                  explanation: 'Equation 6 has only ℓ(M; k_t, v_t), optimizing for the current token. Equation 9 sums ℓ(M; k_i, v_i) over a window [t-c+1, t], enabling context-aware learning.',
                },
              ],
            },
            {
              kind: 'scenario',
              title: 'Fact recall over long sequences',
              scenario: {
                intro: 'In the BABILong task, you need to recall a fact from 50 tokens ago, embedded in millions of tokens.',
                stages: [
                  {
                    situation: 'You must choose between an online updater (c=1) that processes each token alone, or Omega rule (c=window) that considers tokens together.',
                    question: 'Which handles fact recall better?',
                    options: [
                      {
                        label: 'Online updater — faster per step',
                        quality: 'bad',
                        feedback: 'Fast processing does not help if the model forgets facts processed earlier.',
                      },
                      {
                        label: 'Omega rule — considers the fact within its context window, reinforcing the key-value relationship',
                        quality: 'best',
                        feedback: 'Omega rule optimizes memory to map all tokens in a window to their correct values, strengthening patterns that appear together.',
                      },
                    ],
                  },
                ],
                debrief: 'This is why Omega rule scales to 10M tokens where online methods fail—repeated reinforcement within a window prevents forgetting.',
              },
            },
          ],
        },
        {
          id: 'dta-m1-l4',
          title: 'Expanding Memory Capacity',
          minutes: 13,
          xp: 65,
          steps: [
            {
              kind: 'read',
              title: 'Memory capacity bounds and how to exceed them',
              markdown: capacityMd,
            },
            {
              kind: 'quiz',
              title: 'Capacity limits and solutions',
              questions: [
                {
                  prompt: 'According to Proposition 1, a matrix-valued memory with d_v × d_k parameters can store at most how many independent key-value pairs?',
                  options: [
                    'O(d_v × d_k) — one per parameter',
                    'O(d_k) — limited by key dimension',
                    'O(√(d_v × d_k))',
                    'Unlimited — depends only on optimization',
                  ],
                  answer: 1,
                  explanation: 'Matrix memory optimized with ℓ2 loss and gradient descent hits a capacity limit of O(d_k), making it sublinear in total parameters.',
                },
                {
                  prompt: 'Theorem 1 shows that a deep MLP memory can store at least O(d_k × d_v) pairs. Why does depth help capacity?',
                  options: [
                    'Deeper networks have more parameters for learning',
                    'Deeper MLPs introduce non-linearity, allowing the memory to encode more complex key-value relationships',
                    'Depth reduces training time',
                    'It prevents overfitting',
                  ],
                  answer: 1,
                  explanation: 'Deep networks can represent more expressive functions. This non-linearity allows richer encoding of multiple distinct key-value associations in the same parameter space.',
                },
              ],
            },
            {
              kind: 'scenario',
              title: 'Memorizing thousands of distinct facts',
              scenario: {
                intro: 'You have 1000 unique facts to memorize in a fixed memory module, each with a distinct key.',
                stages: [
                  {
                    situation: 'A linear memory can store O(d_k) mappings. You can use deep memory + polynomial features together to increase capacity.',
                    question: 'How would you combine these techniques?',
                    options: [
                      {
                        label: 'Deep MLP increases capacity from O(d_k) to O(d_k × d_v); polynomial features φ_p further expand effective key dimension, compounding the capacity gain',
                        quality: 'best',
                        feedback: 'Deep memory gives O(d_k × d_v) capacity, and polynomial feature mappings increase the effective dimensionality of keys further, giving O(d_k^p) scaling with degree p.',
                      },
                      {
                        label: 'They are redundant — pick one',
                        quality: 'bad',
                        feedback: 'Deep and polynomial techniques target different bottlenecks and are synergistic, not redundant.',
                      },
                      {
                        label: 'Only polynomial features matter',
                        quality: 'bad',
                        feedback: 'Depth and polynomials both contribute independently. Neither alone is sufficient for 1000+ facts.',
                      },
                    ],
                  },
                ],
                debrief: 'Combining deep memory and polynomials enables storing thousands of facts without proportional parameter growth.',
              },
            },
          ],
        },
        {
          id: 'dta-m1-l5',
          title: 'Synthesis: The Three Design Challenges',
          minutes: 8,
          xp: 40,
          steps: [
            {
              kind: 'quiz',
              title: 'Foundations checkpoint',
              questions: [
                {
                  prompt: 'Which three design limitations are we addressing with Atlas and DeepTransformers?',
                  options: [
                    'Slow training, GPU memory usage, and model size',
                    '(1) Online nature of memory update, (2) limited capacity, (3) less expressive memory management (first-order optimization)',
                    'Attention is too accurate, sequence length is too long, and keys are too big',
                    'Softmax approximation, polynomial kernels, and weight decay',
                  ],
                  answer: 1,
                  explanation: 'The three core limitations (mentioned in the Abstract and throughout the paper) drive all subsequent innovations: online updates miss context, fixed-size memory has capacity limits, and first-order gradient descent misses structure.',
                },
              ],
            },
            {
              kind: 'scenario',
              title: 'Designing for long legal documents',
              scenario: {
                intro: 'You are designing a model for legal contract analysis with 10K-token documents, requiring recall of distant facts and complex reasoning.',
                stages: [
                  {
                    situation: 'You must choose which innovations matter most: (a) Omega rule for context windows, (b) deep memory for capacity, (c) polynomial features for expressiveness.',
                    question: 'Which combination is essential?',
                    options: [
                      {
                        label: 'All three together — Omega strengthens context links, deep memory stores more facts, polynomials encode subtle differences',
                        quality: 'best',
                        feedback: 'Long-context reasoning requires: (1) Omega to learn relationships across tokens in a window; (2) capacity to store many fact associations; (3) expressiveness to distinguish similar facts. All three are synergistic.',
                      },
                      {
                        label: '(a) and (c) only',
                        quality: 'bad',
                        feedback: 'Without deep memory, capacity limits become a bottleneck for storing thousands of legal facts.',
                      },
                      {
                        label: '(b) and (c) only',
                        quality: 'bad',
                        feedback: 'Without Omega rule, the model reverts to online updates and cannot learn relationships between tokens.',
                      },
                    ],
                  },
                ],
                debrief: 'The power of Atlas comes from orchestrating all three improvements. No single one is sufficient for robust long-context understanding.',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'dta-m2',
      title: 'Architectural Solutions',
      description: 'Explore DeepTransformers as strict generalizations of attention, and Atlas as the complete system integrating all improvements with second-order optimization.',
      lessons: [
        {
          id: 'dta-m2-l1',
          title: 'DeepTransformers: Strict Generalizations',
          minutes: 10,
          xp: 50,
          steps: [
            {
              kind: 'read',
              title: 'Extending transformers with polynomial features and deep memory',
              markdown: deepTransformersMd,
            },
            {
              kind: 'quiz',
              title: 'Understanding transformer generalization',
              questions: [
                {
                  prompt: 'How does DeepTransformer generalize the standard Transformer?',
                  options: [
                    'It uses deeper attention heads',
                    'It applies polynomial feature mappings φ*(k) to keys, enabling super-linear memory capacity',
                    'It removes the softmax normalization',
                    'It adds more MLP layers',
                  ],
                  answer: 1,
                  explanation: 'DeepTransformer replaces the standard k_j in attention with φ*(k_j), where φ* is an infinite-dimensional feature mapping, generalizing the Transformer attention mechanism.',
                },
              ],
            },
          ],
        },
        {
          id: 'dta-m2-l2',
          title: 'Atlas: Second-Order Memory Optimization',
          minutes: 11,
          xp: 55,
          steps: [
            {
              kind: 'read',
              title: 'Complete system: deep memory, Omega rule, and Muon optimizer',
              markdown: atlasMd,
            },
            {
              kind: 'quiz',
              title: 'Why second-order optimization matters',
              questions: [
                {
                  prompt: 'Why does Atlas use the Muon optimizer instead of standard gradient descent?',
                  options: [
                    'It is faster',
                    'Muon approximates second-order information, allowing the memory to find better local minima and avoid spurious mappings',
                    'Gradient descent does not work with polynomial features',
                    'It reduces GPU memory usage',
                  ],
                  answer: 1,
                  explanation: 'Second-order optimizers (like Muon) use curvature information, allowing memory to escape poor local minima that first-order gradient descent converges to, improving the quality of learned key-value associations.',
                },
              ],
            },
            {
              kind: 'scenario',
              title: 'Handling ambiguous facts under noise',
              scenario: {
                intro: 'Two models both memorize 100 facts: one with first-order gradient descent, one with Muon (second-order).',
                stages: [
                  {
                    situation: 'Some facts are ambiguous and could map to multiple values. Which model handles this better?',
                    question: 'Which optimizer finds more robust memorizations?',
                    options: [
                      {
                        label: 'First-order — faster training',
                        quality: 'bad',
                        feedback: 'Speed is not helpful if the learned memory associations are spurious or unstable.',
                      },
                      {
                        label: 'Second-order (Muon) — better curvature awareness allows escaping spurious local minima and finding more robust mappings',
                        quality: 'best',
                        feedback: 'First-order methods can converge to local minima that overfit to noise. Second-order methods see the loss surface curvature, allowing smarter escapes to better solutions.',
                      },
                    ],
                  },
                ],
                debrief: 'For long contexts with thousands of facts and potential noise, second-order optimization is not just a nice-to-have—it prevents memory degradation.',
              },
            },
          ],
        },
        {
          id: 'dta-m2-l3',
          title: 'The Complete Picture: Comparing Architectures',
          minutes: 10,
          xp: 50,
          steps: [
            {
              kind: 'read',
              title: 'What drives long-context performance?',
              markdown: comparisonMd,
            },
            {
              kind: 'quiz',
              title: 'Architecture tradeoffs',
              questions: [
                {
                  prompt: 'Looking at the model family table, Atlas is the first recurrent model with all five capabilities. Which single capability is most critical for long-context understanding?',
                  options: [
                    'Dynamic decay — allows forgetting old information',
                    'Deep memory — enables complex abstractions',
                    'All four (deep memory, capacity, locally optimal, flexible context) work together; no single one is sufficient alone',
                    'Flexible context — allows pruning irrelevant information',
                  ],
                  answer: 2,
                  explanation: 'Long-context tasks require: deep networks for expressiveness, capacity for storing many facts, local optimization for quality, and context flexibility to ignore irrelevant information. Missing any one limits performance.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'dta-m3',
      title: 'Experimental Validation',
      description: 'See Atlas in action across language modeling, long-context benchmarks, and ablation studies revealing which components matter most.',
      lessons: [
        {
          id: 'dta-m3-l1',
          title: 'Language Modeling & Common-Sense Reasoning',
          minutes: 9,
          xp: 45,
          steps: [
            {
              kind: 'read',
              title: 'Validating improvements across diverse benchmarks',
              markdown: experimentsOverviewMd,
            },
            {
              kind: 'quiz',
              title: 'Why Atlas improves language modeling',
              questions: [
                {
                  prompt: 'In language modeling tasks, Atlas outperformed Transformers and Titans. What property of language does this advantage likely depend on?',
                  options: [
                    'Shorter token lengths',
                    'Stationary vocabulary',
                    'Long-range dependencies and context patterns that benefit from Omega rule and higher capacity',
                    'Lower complexity tasks',
                  ],
                  answer: 2,
                  explanation: 'Language has long-range grammatical and semantic dependencies (pronouns, topics, narratives spanning paragraphs). Omega rule captures these context patterns better than online updates.',
                },
              ],
            },
          ],
        },
        {
          id: 'dta-m3-l2',
          title: 'Long-Context Benchmarks: Scaling to Millions of Tokens',
          minutes: 12,
          xp: 60,
          steps: [
            {
              kind: 'read',
              title: 'Needle in haystack and 10M-token performance',
              markdown: longcontextMd,
            },
            {
              kind: 'scenario',
              title: 'Decoding the 10M-token breakthrough',
              scenario: {
                intro: 'In BABILong with 10M context length, Atlas achieved +80% accuracy improvement over Titans. This is a landmark result.',
                stages: [
                  {
                    situation: 'You need to explain why this gap exists. Titans uses deep memory and momentum, but still fails.',
                    question: 'What does the +80% improvement suggest about how Omega rule scales with context?',
                    options: [
                      {
                        label: 'The sliding window captures essential facts reliably even in massive context, whereas online updates accumulate noise over millions of steps',
                        quality: 'best',
                        feedback: 'Online methods (Titans) suffer from error accumulation and forgetting over long sequences. Omega rule reinforces key patterns repeatedly within each window, maintaining accuracy even at 10M tokens.',
                      },
                      {
                        label: 'Longer context is always better',
                        quality: 'bad',
                        feedback: 'Longer context is a challenge, not an advantage. The breakthrough is surviving it without collapse.',
                      },
                      {
                        label: 'Atlas has a bug in other models',
                        quality: 'bad',
                        feedback: 'Titan and other baselines were properly implemented and evaluated by the same authors.',
                      },
                    ],
                  },
                ],
                debrief: 'The 10M-token result is definitive proof that context-aware optimization (Omega) does not suffer from error accumulation the way online methods do.',
              },
            },
          ],
        },
        {
          id: 'dta-m3-l3',
          title: 'Ablation Studies & Scaling Insights',
          minutes: 11,
          xp: 55,
          steps: [
            {
              kind: 'read',
              title: 'Which components matter most?',
              markdown: ablationMd,
            },
            {
              kind: 'quiz',
              title: 'Understanding component contributions',
              questions: [
                {
                  prompt: 'If you had to remove one innovation (Omega rule, deep memory, polynomial features, or second-order optimization) with the least damage to Atlas performance, which would hurt least?',
                  options: [
                    'Omega rule — the others provide the capacity boost',
                    'Deep memory — polynomial features provide most of the capacity gain',
                    'None — ablation studies show each contributes meaningfully; the combination is essential',
                    'Second-order optimization — first-order is faster anyway',
                  ],
                  answer: 2,
                  explanation: 'Effective long-context modeling is not about one silver bullet; each innovation addresses a distinct bottleneck (online updates, capacity limits, expressiveness, optimization quality). Removing any hurts performance.',
                },
              ],
            },
            {
              kind: 'scenario',
              title: 'Allocating a compute budget for long-context scaling',
              scenario: {
                intro: 'You are scaling Atlas to 1B parameters. Experiments show Omega window matters more than deep hidden dim. You have budget for one improvement.',
                stages: [
                  {
                    situation: 'You must choose between (a) larger context windows, (b) deeper memory MLPs.',
                    question: 'Where should you invest?',
                    options: [
                      {
                        label: '(a) Larger context windows — empirically shown to matter more for long-context scaling',
                        quality: 'best',
                        feedback: 'Ablations reveal what actually matters at scale. If experiments show window size drives improvements more than depth, allocate capacity there for better ROI on parameters.',
                      },
                      {
                        label: '(b) Deeper memory MLPs — always better for capacity',
                        quality: 'bad',
                        feedback: 'Depth helps, but empirical data shows it is not the bottleneck at 1B scale. Omega window is.',
                      },
                      {
                        label: 'Both equally',
                        quality: 'bad',
                        feedback: 'Ablation studies show asymmetric importance. Window dominates depth at scale.',
                      },
                    ],
                  },
                ],
                debrief: 'In ML engineering, ablation studies reveal where to invest. Atlas scaling studies show that context window is the lever that matters most.',
              },
            },
          ],
        },
      ],
    },
  ],
}
