import type { Subject } from '../types'
import motivationMd from './md/lw-motivation.md?raw'
import architectureMd from './md/lw-architecture.md?raw'
import planningMd from './md/lw-planning.md?raw'
import physicsMd from './md/lw-physics.md?raw'

export const leWorldModel: Subject = {
  id: 'le-world-model',
  title: 'LeWorldModel: Learning World Models from Pixels',
  icon: '🎬',
  accent: '#4B90E2',
  tagline: 'Stable joint-embedding predictive architecture for visual planning',
  modules: [
    {
      id: 'lw-m1',
      title: 'LeWorldModel: Stable World Models from Pixels',
      description:
        'Maes, Le Lidec, Scieur, LeCun & Balestriero, 2026 — the first JEPA that trains stably end-to-end from raw pixels using only two loss terms. SIGReg regularization prevents representation collapse without heuristics. Plans 48× faster than foundation models while remaining competitive on diverse control tasks.',
      lessons: [
        {
          id: 'lw-motivation',
          title: 'Why JEPA Methods Collapse (and Why It Matters)',
          minutes: 11,
          xp: 55,
          steps: [
            { kind: 'read', title: 'Representation collapse: the core problem', markdown: motivationMd },
            {
              kind: 'quiz',
              title: 'Check: understanding the collapse trap',
              questions: [
                {
                  prompt: 'What is the core reason JEPAs suffer from representation collapse?',
                  options: [
                    'The encoder architecture is too simple to learn diverse features',
                    'The prediction loss alone does not penalize mapping all inputs to the same embedding',
                    'Predicting in latent space inherently loses structural information',
                    'The gradient signal becomes too weak in high-dimensional embeddings',
                  ],
                  answer: 1,
                  explanation:
                    'A constant embedding has zero prediction error on itself (constant → constant), so it trivially satisfies the prediction loss. The loss objective needs an additional term to enforce diversity.',
                },
                {
                  prompt: 'Why do existing JEPA methods rely on exponential moving averages (EMA) or stop-gradient operations?',
                  options: [
                    'They reduce the computational cost of training',
                    'They are required by the JEPA framework theoretically',
                    'They prevent collapse by making a trivial constant solution unreachable by gradient descent, but they are heuristic (not optimizing a well-defined objective)',
                    'They improve convergence speed without any downside',
                  ],
                  answer: 2,
                  explanation:
                    'EMA and stop-gradient help empirically but are not principled — they do not optimize any well-defined loss. LeWM instead uses SIGReg, which directly targets the Gaussian assumption via a statistical test.',
                },
              ],
            },
          ],
        },
        {
          id: 'lw-architecture',
          title: 'Architecture: Two Components, Two Loss Terms',
          minutes: 14,
          xp: 70,
          steps: [
            { kind: 'read', title: 'The encoder, predictor, and SIGReg regularization', markdown: architectureMd },
            {
              kind: 'quiz',
              title: 'Check: the LeWM design',
              questions: [
                {
                  prompt: 'The paper mentions using the Cramér–Wold theorem in SIGReg. What does it enable?',
                  options: [
                    'Directly computing the full multivariate Gaussian test statistic in high dimensions',
                    'Testing whether a high-dimensional distribution is Gaussian by testing 1D projections instead',
                    'Reducing the number of random projections needed without loss of coverage',
                    'Guaranteeing that SIGReg will not collapse even with a single projection',
                  ],
                  answer: 1,
                  explanation:
                    'If all 1D marginals of a distribution are Gaussian, then the full distribution is Gaussian (in the limit). This lets SIGReg use fast univariate tests via the Epps–Pulley statistic instead of expensive high-dimensional normality tests.',
                },
                {
                  prompt: 'LeWM reduces tunable hyperparameters from 6+ (PLDM) to 1 (λ). Why is this significant for practical use?',
                  options: [
                    'One hyperparameter always performs as well as many',
                    'A single hyperparameter can be tuned efficiently (binary search, O(log n)) and training is simpler and more stable',
                    'Multiple hyperparameters are inherently worse by design',
                    'It has no practical significance; both are equally good',
                  ],
                  answer: 1,
                  explanation:
                    'PLDM requires polynomial-time grid search O(n⁶). LeWM\'s two-term loss is smooth and well-behaved, so λ can be tuned via bisection. Fewer hyperparameters also means fewer ways training can become unstable.',
                },
              ],
            },
          ],
        },
        {
          id: 'lw-planning',
          title: 'Planning and Performance: Speed vs. Accuracy',
          minutes: 12,
          xp: 65,
          steps: [
            { kind: 'read', title: 'Latent space planning via MPC and results across tasks', markdown: planningMd },
            {
              kind: 'scenario',
              title: 'Choosing a world model for your constraints',
              scenario: {
                intro:
                  'You\'re building a real-time control system. Different world models trade off planning speed against accuracy and data efficiency. Use the LeWM results to make the call.',
                stages: [
                  {
                    situation:
                      'You need < 1 second per planning cycle for interactive control, and your task is complex 3D manipulation (OGBench-Cube like). LeWM does 0.98s; DINO-WM does 47s.',
                    question: 'Which should you choose?',
                    options: [
                      {
                        label: 'LeWM — 48× speedup is non-negotiable for interactive control',
                        quality: 'ok',
                        feedback:
                          'Speedup matters, but check the accuracy gap: DINO-WM achieves 86% on OGBench-Cube vs LeWM\'s 74%. If that 12-point gap is unacceptable for your application, LeWM alone won\'t work.',
                      },
                      {
                        label: 'DINO-WM — the 12-point accuracy gap on 3D tasks is worth the planning slowdown',
                        quality: 'bad',
                        feedback:
                          '47 seconds per plan is incompatible with interactive control. You\'d plan once every minute. Real-time control is impossible.',
                      },
                      {
                        label: 'Try LeWM first with less aggressive planning horizons; only switch to DINO-WM if accuracy is still insufficient',
                        quality: 'best',
                        feedback:
                          'Practical and empirical. Shorter horizons speed up LeWM further while reducing error accumulation. If 74% accuracy is enough for your task, you keep interactive control and end-to-end training. Only switch if the accuracy gap is critical.',
                      },
                    ],
                  },
                  {
                    situation:
                      'Now you also learn that your task\'s environment is very simple (like Two-Room: a 2D grid navigation). The paper shows LeWM scores 87% there vs. PLDM\'s 100%.',
                    question: 'What does this suggest about LeWM\'s suitability?',
                    options: [
                      {
                        label: 'LeWM is broken; switch to PLDM immediately',
                        quality: 'bad',
                        feedback:
                          'Two-Room is a pathological case with very low intrinsic dimensionality. LeWM still wins on most practical tasks (Push-T: 96%, Reacher: 86%). This is a boundary condition, not a sign the method is broken.',
                      },
                      {
                        label: 'SIGReg enforces a 192D Gaussian, but the true dynamics live in a much lower-dim subspace. The regularizer may force the encoder to use directions that hurt accuracy.',
                        quality: 'best',
                        feedback:
                          'Correct insight. This is the likely cause. For ultra-simple environments, consider lower λ values or switching to PLDM. But for typical robotic tasks with higher intrinsic dimensionality, LeWM is stable.',
                      },
                      {
                        label: 'The result is just noise; all methods perform equally on simple environments',
                        quality: 'bad',
                        feedback:
                          'PLDM\'s 100% vs LeWM\'s 87% on Two-Room is a real 13-point gap. It is worth understanding why — and the answer relates to the Gaussian prior in high dimensions.',
                      },
                    ],
                  },
                ],
                debrief:
                  'LeWM excels at the speed-accuracy trade-off for typical robotic tasks. The key insight: it assumes environments with sufficient intrinsic dimensionality. On very low-complexity environments, consider alternatives or shorter planning horizons.',
              },
            },
          ],
        },
        {
          id: 'lw-physics',
          title: 'What Physics Emerges Without Explicit Supervision',
          minutes: 11,
          xp: 60,
          steps: [
            { kind: 'read', title: 'Probing latent structure: positions, angles, physics violations', markdown: physicsMd },
            {
              kind: 'quiz',
              title: 'Check: physical understanding',
              questions: [
                {
                  prompt:
                    'The paper shows linear probes recover block position from LeWM embeddings with correlation > 0.98. LeWM was trained on prediction loss alone, never given position labels. Why does this spatial structure emerge?',
                  options: [
                    'Vision Transformers inherently learn spatial positions regardless of the task',
                    'Preserving spatial structure helps the predictor forecast dynamics accurately, so the encoder learns it as an instrumental goal',
                    'The authors added spatial biases during training',
                    'It is a coincidence with no practical implications',
                  ],
                  answer: 1,
                  explanation:
                    'The predictor needs to forecast where objects move next. To do that accurately, the encoder learns to encode spatial information. Spatial structure emerges as instrumental for good prediction.',
                },
                {
                  prompt:
                    'In the violation-of-expectation experiment, the model shows much higher prediction error when an object teleports (12 MSE) vs. when its color changes (5 MSE). What does this tell you?',
                  options: [
                    'The model memorizes pixel values instead of learning dynamics',
                    'Color changes are actually harder to predict, contradicting the paper',
                    'The model has learned a notion of physical plausibility — physics violations cause surprise, visual changes do not',
                    'The experiment is flawed because color and position are different types of changes',
                  ],
                  answer: 2,
                  explanation:
                    'High error on teleportation (physics violation) but not on color change (appearance change) suggests the model learned implicit physics priors. Teleportation breaks its learned dynamics model.',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

export default leWorldModel
