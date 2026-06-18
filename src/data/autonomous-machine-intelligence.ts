import type { Subject } from '../types'
import amiWhyNotEnough from './md/ami-why-not-enough.md?raw'
import amiCommonSenseWorldModels from './md/ami-common-sense-world-models.md?raw'
import amiArchitectureOverview from './md/ami-architecture-overview.md?raw'
import amiMode1Mode2 from './md/ami-mode1-mode2.md?raw'
import amiCostAndCritic from './md/ami-cost-and-critic.md?raw'
import amiSelfSupervisedLearning from './md/ami-self-supervised-learning.md?raw'
import amiLatentVariables from './md/ami-latent-variables.md?raw'
import amiEnergyBasedModels from './md/ami-energy-based-models.md?raw'
import amiJepa from './md/ami-jepa.md?raw'
import amiVicreg from './md/ami-vicreg.md?raw'
import amiHierarchicalJepa from './md/ami-hierarchical-jepa.md?raw'
import amiActor from './md/ami-actor.md?raw'
import amiConfigurator from './md/ami-configurator.md?raw'
import amiRelatedWork from './md/ami-related-work.md?raw'
import amiLimitations from './md/ami-limitations.md?raw'
import amiBroaderRelevance from './md/ami-broader-relevance.md?raw'
import amiScalingAndReward from './md/ami-scaling-and-reward.md?raw'

export const autonomousMachineIntelligence: Subject = {
  id: 'autonomous-machine-intelligence',
  title: 'Autonomous Machine Intelligence',
  tagline: "LeCun's blueprint for a modular, world-model-driven path to human-level AI.",
  icon: '🧭',
  accent: '#34d399',
  modules: [
    {
      id: 'ami-m1',
      title: 'Why We Need a New Architecture',
      description:
        'What current AI is missing, and the human/animal evidence for learning hierarchical world models from observation.',
      lessons: [
        {
          id: 'ami-why-not-enough',
          title: "Why Can't Machines Learn Like a Teenager Learns to Drive?",
          minutes: 12,
          xp: 20,
          steps: [
            { kind: 'read', title: "Why Can't Machines Learn Like a Teenager Learns to Drive?", markdown: amiWhyNotEnough },
            {
              kind: 'quiz',
              title: 'Check Your Understanding: The Gap and the Three Challenges',
              questions: [
                {
                  prompt:
                    'A teenager learns to drive in about 20 hours, while the best self-driving systems need enormous supervised datasets, millions of RL trials, and hundreds of hand-coded behaviors and still fall short. What does the paper argue this gap is really evidence of?',
                  options: [
                    'Current AI systems are simply under-trained and need more data and compute',
                    'Humans and animals possess a different kind of knowledge — general-purpose learned world models — not just more practice',
                    'Self-driving cars are fundamentally a harder problem than any task humans learn quickly',
                    'Reinforcement learning is an inferior training paradigm compared to supervised learning',
                  ],
                  answer: 1,
                  explanation:
                    'The paper explicitly rejects the "just needs more data" framing: the gap isn\'t under-training, it\'s the absence of a general-purpose internal model of how the world works, which lets humans skip almost all the trial-and-error that current ML systems require.',
                },
                {
                  prompt:
                    'Why does the paper emphasize that learning must happen "largely by observation" rather than through direct interaction?',
                  options: [
                    'Observation-only learning is computationally cheaper to implement on GPUs',
                    "Real-world interactions are expensive and dangerous, so an agent can't learn safely by trial-and-error at the scale current methods require",
                    'Observation produces more labeled data than interaction does',
                    'Animals cannot interact with their environment, so observation is their only option',
                  ],
                  answer: 1,
                  explanation:
                    'The challenge exists because interacting with the real world to generate training signal — like crashing a car thousands of times to learn to drive — is costly and unsafe. Learning by observation lets an agent build a world model without paying that price.',
                },
                {
                  prompt:
                    'The third challenge calls for representing percepts and actions "hierarchically, at multiple levels of abstraction and timescales." What is the stated motivation for this?',
                  options: [
                    'Hierarchical representations are easier to visualize for human researchers',
                    'Long-term planning requires decomposing a complex action into a sequence of simpler ones',
                    'Hierarchies reduce the total number of parameters needed in a neural network',
                    'Multiple timescales are required only for processing video, not other modalities',
                  ],
                  answer: 1,
                  explanation:
                    "Hierarchy is motivated by planning over long horizons: a complex, long-term goal has to be broken down into simpler sub-actions at different levels of abstraction and timescales, which a single flat representation can't support.",
                },
                {
                  prompt:
                    'Which of these is explicitly listed among the paper\'s headline proposed contributions?',
                  options: [
                    'A purely generative adversarial approach to world modeling',
                    'JEPA and Hierarchical JEPA as a non-generative way to build predictive world models',
                    'A reinforcement learning algorithm that eliminates the need for any world model',
                    'A symbolic logic engine bolted onto a neural network for reasoning',
                  ],
                  answer: 1,
                  explanation:
                    'JEPA (Joint Embedding Predictive Architecture) and its hierarchical extension are presented as a non-generative method for building predictive world models at multiple levels of representation — distinct from generative or purely symbolic approaches.',
                },
              ],
            },
          ],
        },
        {
          id: 'ami-common-sense-world-models',
          title: 'What Is "Common Sense," Really?',
          minutes: 14,
          xp: 25,
          steps: [
            { kind: 'read', title: 'What Is "Common Sense," Really?', markdown: amiCommonSenseWorldModels },
            {
              kind: 'quiz',
              title: 'Check Your Understanding: Common Sense and the World Model Engine',
              questions: [
                {
                  prompt:
                    'Why does the paper insist that "common sense" is more than a synonym for "knowledge"?',
                  options: [
                    'Because common sense is specifically predictive — it fills in missing spatial/temporal information and flags mismatched expectations',
                    'Because common sense only applies to physical objects, while knowledge applies to abstract concepts',
                    'Because common sense is innate and never learned, while knowledge must be taught explicitly',
                    'Because common sense requires language, while knowledge can be purely sensorimotor',
                  ],
                  answer: 0,
                  explanation:
                    "The text draws the distinction explicitly: common sense is predictive knowledge, used to fill gaps (spatially or temporally) and to flag percepts that violate expectation as worth extra attention. Plain \"knowledge\" doesn't carry that predictive, gap-filling, expectation-violation-detecting function.",
                },
                {
                  prompt:
                    'The self-driving car example (needing thousands of RL trials to learn that speeding into a turn is bad) is used to illustrate what point?',
                  options: [
                    'That reinforcement learning is fundamentally incapable of learning physical concepts',
                    'That self-driving systems should be trained exclusively on simulated data',
                    'That task-independent intuitive physics lets humans avoid dangerous mistakes in novel situations without needing many trials',
                    'That common sense is only useful for social and linguistic reasoning, not physical tasks',
                  ],
                  answer: 2,
                  explanation:
                    'The contrast shows the payoff of pre-existing, task-independent world knowledge: humans can predict the bad outcome from general physics understanding without ever experiencing that exact turn, whereas an RL agent without such priors must learn it the hard way through many trials.',
                },
                {
                  prompt:
                    'The paper hypothesizes a single, dynamically reconfigurable world model engine rather than many separate stored models. What is the key functional benefit of this design?',
                  options: [
                    'It eliminates the need for a configurator or task-selection mechanism entirely',
                    'It guarantees perfect predictions regardless of task, since one model covers all cases identically',
                    'It enables reasoning by analogy — knowledge configured for one situation can be redeployed to a different situation',
                    "It reduces the brain's prefrontal cortex to a single fixed circuit with no flexibility",
                  ],
                  answer: 2,
                  explanation:
                    'The paper proposes this single-engine, reconfigurable design as the mechanism behind reasoning by analogy: the engine configured for situation A can be repurposed for situation B, letting knowledge transfer across contexts rather than requiring a separate model per situation.',
                },
                {
                  prompt:
                    "In the previewed system architecture (Perception, World Model, Cost/Critic, Actor, configurator), what is the Actor's role?",
                  options: [
                    'It directly perceives the current state of the world from sensory input',
                    'It proposes candidate action sequences and selects the one that minimizes predicted future cost',
                    'It permanently fixes the cost function so it cannot be retrained',
                    'It stores long-term memories of past world states',
                  ],
                  answer: 1,
                  explanation:
                    'The Actor proposes action sequences and picks the one minimizing predicted future cost, as scored by the Cost/Critic module after the World Model predicts outcomes — it is the decision-making component, not the perception or memory component.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'ami-m2',
      title: 'A Modular Architecture for Intelligence',
      description:
        'The named modules (Perception, World Model, Cost, Actor, Critic, Configurator) and the Mode-1/Mode-2 split between fast reaction and deliberate planning.',
      lessons: [
        {
          id: 'ami-architecture-overview',
          title: 'Seven Modules, One Agent',
          minutes: 14,
          xp: 25,
          steps: [
            { kind: 'read', title: 'Seven Modules, One Agent', markdown: amiArchitectureOverview },
            {
              kind: 'quiz',
              title: 'Check Your Understanding: The Modular Wiring',
              questions: [
                {
                  prompt: 'Why does LeCun choose several specialized modules instead of one large end-to-end neural network?',
                  options: [
                    'A single network would be too slow at inference time for real-world robotics',
                    'Splitting into modules lets the same Perception, World Model, and Actor be reused across goals by having the Configurator retune them, rather than retraining everything for each new task',
                    'Modular systems are always more accurate than monolithic networks on benchmark tasks',
                    'Seven modules map directly onto seven brain regions, so the architecture is biologically required',
                  ],
                  answer: 1,
                  explanation:
                    'The architectural payoff is reusability — the Configurator re-primes the same modules for new goals instead of the system needing a wholesale rebuild. The biological analogy is offered as a loose comparison, not a justification for the module count.',
                },
                {
                  prompt: 'What does the World Model do, beyond just extrapolating the next video frame?',
                  options: [
                    'Nothing more — it is just a next-frame predictor',
                    'It additionally estimates missing information Perception could not observe directly, and represents multiple plausible futures rather than committing to one',
                    'It only predicts the past, not the future',
                    'It has no connection to uncertainty at all',
                  ],
                  answer: 1,
                  explanation:
                    'The World Model does state estimation (filling in what Perception missed) in addition to predicting plausible future states — and it must represent several possible futures, not a single deterministic guess.',
                },
                {
                  prompt: 'Why must the World Model represent multiple plausible futures rather than a single predicted future state?',
                  options: [
                    'Because the Configurator requires several candidate states to choose which one to attend to',
                    'Because storing multiple futures is computationally cheaper than storing one detailed future',
                    'Because the world is not fully predictable — other agents may be adversarial, and dynamics can be chaotic or only partially observable — so committing to one guess would be unreliable',
                    'Because the Actor can only compute gradients when given more than one candidate future state',
                  ],
                  answer: 2,
                  explanation:
                    'Given real-world unpredictability — adversarial agents, chaotic or partially observable dynamics — committing to a single forecast would be unreliable. Representing multiple plausible futures is one of the World Model\'s core open problems.',
                },
                {
                  prompt: "The agent's overall objective, as stated in the paper, reduces to which single sentence?",
                  options: [
                    "Maximize the accuracy of the World Model's future-state predictions",
                    'Take actions so as to remain in states that minimize the average energy',
                    "Maximize the trainable Critic's predicted reward over the longest possible time horizon",
                    'Configure all modules so that Perception error is minimized at every timestep',
                  ],
                  answer: 1,
                  explanation:
                    'The paper\'s stated objective is exactly this: take actions to remain in states that minimize average energy. Everything else — World Model accuracy, Critic predictions, Configurator tuning — exists in service of minimizing it, not as the objective itself.',
                },
              ],
            },
          ],
        },
        {
          id: 'ami-mode1-mode2',
          title: 'Two Speeds of Thought: React or Plan',
          minutes: 14,
          xp: 25,
          steps: [
            { kind: 'read', title: 'Two Speeds of Thought: React or Plan', markdown: amiMode1Mode2 },
            {
              kind: 'quiz',
              title: 'Check Your Understanding: Mode-1 vs Mode-2',
              questions: [
                {
                  prompt: 'What is the key structural difference between Mode-1 and Mode-2, according to the paper — not just a difference in speed?',
                  options: [
                    'Mode-1 produces an action directly from perception without consulting the World Model or Cost module at all, while Mode-2 routes through both',
                    'Mode-1 uses a simplified, low-resolution version of the same World Model that Mode-2 uses in full detail',
                    'Mode-1 only works for physical actions while Mode-2 only works for abstract reasoning tasks',
                    'Mode-1 and Mode-2 use the same policy module, but Mode-2 runs it multiple times',
                  ],
                  answer: 0,
                  explanation:
                    'Mode-1 is not a cheaper version of Mode-2 — it is a different loop entirely. The paper states "this reactive process does not make use of the world model nor of the cost."',
                },
                {
                  prompt: 'The paper explicitly compares the Mode-2 loop to Model-Predictive Control (MPC) from classical optimal control. What is the stated difference?',
                  options: [
                    'Classical MPC uses a receding horizon, while this architecture plans over a fixed, single-shot horizon',
                    'In this architecture, the world model and cost function are learned, rather than hand-specified as in classical optimal control',
                    'Classical MPC cannot use gradient descent, so this architecture replaces it with tree search exclusively',
                    'This architecture does not use a horizon at all, only a single proposed action at a time',
                  ],
                  answer: 1,
                  explanation:
                    'The control-loop structure is the same as classical MPC with receding horizon; what changes is that both the world model and the cost function are learned from data instead of engineered.',
                },
                {
                  prompt: 'The paper redefines "reasoning" in a way that differs from how a logic textbook would use the term. What is that redefinition?',
                  options: [
                    'Reasoning means applying a fixed set of symbolic inference rules to propositions stored in memory',
                    'Reasoning means constraint satisfaction, or energy minimization — running the World Model under proposed actions and descending on the resulting energy',
                    'Reasoning means querying a large pretrained language model for the most probable next token',
                    'Reasoning is identical to Mode-1 policy execution, just performed more slowly',
                  ],
                  answer: 1,
                  explanation:
                    'The paper states it uses "reasoning" broadly to mean constraint satisfaction (or energy minimization) — reframing deliberate thought as optimization over a learned energy landscape rather than symbolic manipulation.',
                },
                {
                  prompt: 'How does distillation turn a Mode-2 plan into a Mode-1 skill, mechanically?',
                  options: [
                    'The Mode-2 world model is copied wholesale into the Mode-1 policy module',
                    "Mode-2 produces an optimal action sequence, and the policy module's parameters are adjusted to minimize the divergence between that optimal action and the policy module's own output, yielding amortized inference",
                    'The agent runs Mode-1 and Mode-2 in parallel forever, averaging their outputs at each timestep',
                    'Mode-1 is retrained from scratch on raw sensor data with no reference to anything Mode-2 produced',
                  ],
                  answer: 1,
                  explanation:
                    "Distillation trains the policy module to minimize divergence against the optimal actions Mode-2 already worked out, so the policy module learns to reproduce Mode-2's output directly — amortized inference.",
                },
              ],
            },
          ],
        },
        {
          id: 'ami-cost-and-critic',
          title: 'What Drives Behavior: Cost and the Critic',
          minutes: 14,
          xp: 25,
          steps: [
            { kind: 'read', title: 'What Drives Behavior: Cost and the Critic', markdown: amiCostAndCritic },
            {
              kind: 'quiz',
              title: 'Check Your Understanding: Intrinsic Cost vs Trainable Critic',
              questions: [
                {
                  prompt: 'Why does the paper insist the Intrinsic Cost (IC) module must remain immutable, never updated by learning?',
                  options: [
                    'To prevent the agent from drifting toward bad behaviors by learning to feel good about dangerous actions',
                    'Because immutable modules are computationally cheaper to evaluate than trainable ones',
                    'Because the World Model needs a fixed reference signal to compute prediction error',
                    'To keep the Configurator from being able to assign weights to it at all',
                  ],
                  answer: 0,
                  explanation:
                    'This is a safety argument: if the cost defining "good" and "bad" could itself be learned, the agent could drift toward optimizing a corrupted objective. Keeping IC fixed anchors the agent\'s core drives so learning elsewhere cannot corrupt them.',
                },
                {
                  prompt: 'What is the key functional difference between the Intrinsic Cost (IC) and the Trainable Critic (TC)?',
                  options: [
                    'IC reports immediate, hard-wired pain/pleasure signals; TC learns to anticipate future cost cheaply without running the World Model',
                    'IC operates only in Mode-1 while TC operates only in Mode-2',
                    'IC is a single scalar while TC is always a vector of subgoals',
                    'IC is trained via supervised imitation while TC is trained via reinforcement learning rewards',
                  ],
                  answer: 0,
                  explanation:
                    'IC gives the agent\'s fixed sense of "this hurts right now." TC is a learned shortcut that predicts what IC will say later, without expensively simulating forward through the World Model.',
                },
                {
                  prompt: "What objective does the Critic minimize during its training episodes?",
                  options: [
                    'A divergence (e.g. squared error) between the predicted cost TC(s) and the intrinsic energy actually observed later, IC(s+δ)',
                    "The difference between the Critic's output and the Configurator's target subgoal vector",
                    "The reconstruction error of the World Model's predicted next state",
                    'A divergence between two different IC submodules\' outputs at the same timestep',
                  ],
                  answer: 0,
                  explanation:
                    'The Critic retrieves a past state and the intrinsic energy that actually followed it, then adjusts to minimize the squared error between observed later energy and its own earlier prediction — training it to predict future cost from a current state.',
                },
                {
                  prompt: 'If the Intrinsic Cost module were removed entirely and the agent relied only on the Trainable Critic, what core problem would this introduce?',
                  options: [
                    'The agent would have no fixed, learning-proof anchor for "good" and "bad," so the entire cost signal could drift or be corrupted through training, risking behavioral collapse',
                    'The agent would no longer be able to plan using the World Model at all',
                    'The Critic would become computationally more expensive than running full Mode-2 simulation',
                    'The Configurator would lose the ability to modulate any weights',
                  ],
                  answer: 0,
                  explanation:
                    "The whole safety rationale for IC is providing a fixed reference learning cannot touch. Without it, every part of the cost signal would be subject to optimization pressure and could drift toward degenerate or unsafe behavior.",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'ami-m3',
      title: 'Self-Supervised Learning and Energy-Based Models',
      description:
        'How world models get trained without labels, and the energy-based framework that scores compatible vs incompatible pairs.',
      lessons: [
        {
          id: 'ami-self-supervised-learning',
          title: 'Pattern Completion: Learning Without Labels',
          minutes: 14,
          xp: 25,
          steps: [
            { kind: 'read', title: 'Pattern Completion: Learning Without Labels', markdown: amiSelfSupervisedLearning },
            {
              kind: 'quiz',
              title: 'Check Your Understanding: SSL and the Concept Hierarchy',
              questions: [
                {
                  prompt: 'LeCun frames training a world model as a "prototypical example" of which learning paradigm?',
                  options: [
                    'Supervised learning with human-labeled future frames',
                    'Self-supervised learning, whose basic idea is pattern completion',
                    'Reinforcement learning driven by a reward signal',
                    'Unsupervised clustering of video frames',
                  ],
                  answer: 1,
                  explanation:
                    'World-model training is "a prototypical example of Self-Supervised Learning (SSL), whose basic idea is pattern completion" — the system checks consistency between parts of its own input rather than learning from external labels or rewards.',
                },
                {
                  prompt: 'Why does the paper explicitly avoid forcing the model to predict y directly from x?',
                  options: [
                    'Direct prediction is computationally cheaper but less accurate',
                    'There are infinitely many plausible y for a given x, so generating "the" correct one is intractable',
                    'Predicting y directly would require labeled data, defeating the purpose of SSL',
                    'Direct prediction only works for image data, not video or text',
                  ],
                  answer: 1,
                  explanation:
                    'For video, infinitely many continuations are plausible. Trying to generate one true future is intractable, so the system instead scores whether a proposed y is compatible with x.',
                },
                {
                  prompt: 'What is the two-part trade-off the SSL representation-learning principle is built to balance?',
                  options: [
                    'Speed of training versus accuracy of the final compatibility score',
                    'Representations being maximally informative about x and y, versus sy being easily predictable from sx',
                    'Using labeled data versus using unlabeled data',
                    'Model size versus inference latency',
                  ],
                  answer: 1,
                  explanation:
                    'Throwing away information makes prediction trivially easy but the representation useless; keeping everything makes prediction collapse — the tension SSL must balance.',
                },
                {
                  prompt: 'How does the paper distinguish animate from inanimate objects within its hypothesized concept hierarchy?',
                  options: [
                    'Animate objects are labeled by humans during a supervised fine-tuning stage',
                    'Inanimate objects are those whose trajectories are easily predictable; animacy follows from harder-to-predict trajectories',
                    'Animate objects are detected via a separate object-classification network',
                    'The distinction is hard-coded into the architecture before training begins',
                  ],
                  answer: 1,
                  explanation:
                    '"Inanimate object are those whose trajectories are easily predictable" — the animate/inanimate distinction is hypothesized to fall out of the same prediction objective rather than being separately engineered or labeled.',
                },
              ],
            },
          ],
        },
        {
          id: 'ami-latent-variables',
          title: 'Why Predictions Go Blurry — and How Latents Fix It',
          minutes: 14,
          xp: 25,
          steps: [
            { kind: 'read', title: 'Why Predictions Go Blurry — and How Latents Fix It', markdown: amiLatentVariables },
            {
              kind: 'quiz',
              title: 'Check Your Understanding: Latent Variables and Uncertainty',
              questions: [
                {
                  prompt: 'In the Energy-Based Model formulation F(x,y), what does a LOW energy value indicate?',
                  options: [
                    'y is a plausible, compatible continuation/match for x',
                    'The model is uncertain about whether y matches x',
                    'y is rare in the training data regardless of compatibility with x',
                    'The latent variable z has not yet been inferred',
                  ],
                  answer: 0,
                  explanation:
                    'F(x,y) is defined to produce low energy when x and y are compatible and higher energy when they are not — a compatibility score, not a probability or rarity measure.',
                },
                {
                  prompt: 'A deterministic network trained to minimize average pixel error, given several genuinely different plausible futures, produces what?',
                  options: [
                    'A blurry, washed-out average of the plausible outcomes that does not actually resemble any single one of them',
                    'It randomly samples one plausible outcome each time it is queried',
                    'It correctly outputs the single most frequent outcome from training',
                    'It fails to converge and outputs noise',
                  ],
                  answer: 0,
                  explanation:
                    'Minimizing average error under multiple valid targets drives the network toward the mean of those targets, which for images manifests as blur — the failure mode latent variables are introduced to fix.',
                },
                {
                  prompt: 'What role does a latent variable z play in a latent-variable EBM?',
                  options: [
                    'It represents information about y that is not extractable from x — once inferred, it selects/parameterizes which specific compatible outcome is being explained',
                    'It is random noise injected to regularize training and prevent overfitting',
                    'It replaces x as the primary input to the energy function',
                    'It stores the ground-truth label so the energy function can compute loss directly',
                  ],
                  answer: 0,
                  explanation:
                    'Unlike noise, a latent variable is inferred to mean something specific (e.g., camera displacement, turn direction), which is what lets the model explain one particular y instead of blurring across all of them.',
                },
                {
                  prompt: 'In the fork-in-the-road example (a car may turn left or right), what does the latent variable z concretely correspond to?',
                  options: [
                    'A binary variable encoding which branch the car took',
                    "The exact GPS coordinates of the car at every timestep",
                    "The model's confidence score in its own prediction",
                    'The pixel-level difference between the two frames',
                  ],
                  answer: 0,
                  explanation:
                    'The compatibility between x (car approaching the fork) and y (car later on one branch) depends on a binary latent variable: did the car turn left or right.',
                },
              ],
            },
          ],
        },
        {
          id: 'ami-energy-based-models',
          title: 'Energy-Based Models: Scoring Compatibility',
          minutes: 14,
          xp: 25,
          steps: [
            { kind: 'read', title: 'Energy-Based Models: Scoring Compatibility', markdown: amiEnergyBasedModels },
            {
              kind: 'quiz',
              title: 'Check Your Understanding: Collapse and Contrastive vs Regularized Training',
              questions: [
                {
                  prompt: 'A well-trained EBM loss must accomplish two things. Why does the paper call only one of them "trivial"?',
                  options: [
                    'Because lowering energy on training pairs is easy (any increasing function of a bounded-below energy works), while raising energy on all other y is hard since nothing automatically pushes wrong answers up',
                    'Because raising energy on wrong answers is easy with cross-entropy, while lowering energy on correct answers requires careful tuning',
                    'Both halves are equally difficult; the paper does not distinguish between them',
                    'Because the trivial half only matters for generative models, not regression',
                  ],
                  answer: 0,
                  explanation:
                    'Pushing down the energy of the correct (x,y) is trivial; the hard part is ensuring energy is higher for all other y — there is no built-in force doing this, which is exactly why collapse is the central training challenge for EBMs.',
                },
                {
                  prompt: 'What single underlying condition does the paper identify as the common cause of collapse across latent-variable models, auto-encoders, and joint embedding architectures?',
                  options: [
                    'Using too small a batch size during training',
                    'Excess information capacity (in the latent variable, the representation, or constant/input-ignoring encoders) that lets the model make everything look compatible',
                    'Using a non-differentiable energy function',
                    'Training for too few epochs before evaluating energy shape',
                  ],
                  answer: 1,
                  explanation:
                    'Across all three architecture types, collapse traces back to the model having too much freedom — a latent that can encode arbitrary information, or encoders that produce constant, input-ignoring codes.',
                },
                {
                  prompt: 'What is the "main reason" the paper gives for arguing against contrastive methods in the long run?',
                  options: [
                    'They cannot be implemented with Siamese network architectures',
                    'They are incompatible with regularized methods and cannot be combined',
                    'The number of contrastive samples needed to cover all unoccupied dimensions can grow exponentially with the dimension of y, due to the curse of dimensionality',
                    'They require labeled data, unlike regularized methods',
                  ],
                  answer: 2,
                  explanation:
                    'When y is high-dimensional, ensuring higher energy in every direction away from the data manifold may require exponentially many contrastive samples — the curse of dimensionality.',
                },
                {
                  prompt: 'How do regularized methods avoid the curse of dimensionality that afflicts contrastive methods?',
                  options: [
                    'They eliminate the need to push down energy on training samples entirely',
                    'They add a regularization term that directly minimizes the volume of y-space assigned low energy, rather than relying on sampled negative points to carve out high-energy regions',
                    'They replace the energy function with a probability distribution, which is automatically normalized',
                    'They use a much larger batch size to approximate exponentially many contrastive samples',
                  ],
                  answer: 1,
                  explanation:
                    'A regularizer term directly shrinks the volume of y-space that can have low energy, causing low-energy regions to "shrink-wrap" the true data density — without needing to enumerate or sample negative points across a high-dimensional space.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'ami-m4',
      title: 'JEPA and Hierarchical Planning',
      description:
        'Predicting in representation space, the VICReg regularizer that prevents collapse, and stacking JEPAs to plan over long horizons.',
      lessons: [
        {
          id: 'ami-jepa',
          title: 'JEPA: Predicting Representations, Not Pixels',
          minutes: 14,
          xp: 25,
          steps: [
            { kind: 'read', title: 'JEPA: Predicting Representations, Not Pixels', markdown: amiJepa },
            {
              kind: 'quiz',
              title: 'Check Your Understanding: The JEPA Architecture',
              questions: [
                {
                  prompt: 'According to the paper, why is JEPA described as "non-generative"?',
                  options: [
                    'It predicts the representation of y from the representation of x, rather than generating y itself',
                    'It cannot be trained with gradient descent like generative models can',
                    'It only works on discrete data and cannot handle continuous signals like video',
                    'It requires labeled data and cannot learn in a self-supervised way',
                  ],
                  answer: 0,
                  explanation:
                    'JEPA computes an energy from D(sy, Pred(sx,z)) — comparing predicted and actual representations of y, never reconstructing y\'s raw pixels/values.',
                },
                {
                  prompt: 'Why does the paper consider it advantageous that the y-encoder is allowed to "forget" details?',
                  options: [
                    'Forgetting details makes the encoder train faster on any hardware regardless of input type',
                    'It guarantees the predictor will always produce a unique, deterministic output',
                    'Many details (e.g. carpet texture, leaves in wind, ripples on a pond) are unpredictable anyway, so discarding them avoids wasting capacity trying to predict the unpredictable',
                    'It removes the need for a predictor module entirely',
                  ],
                  answer: 2,
                  explanation:
                    "Predicting every pixel of future frames is essentially impossible for fine, chaotic details. JEPA's advantage is the y-encoder can produce an abstract representation that has already eliminated those unpredictable details.",
                },
                {
                  prompt: 'In the car-at-a-fork-in-the-road example, what role does the latent variable z play?',
                  options: [
                    'It encodes irrelevant background details like tree and sidewalk textures',
                    'It selects among a set of plausible predicted representations (e.g. left-branch vs. right-branch outcomes)',
                    'It measures the prediction error between sx and sy',
                    'It determines which encoder architecture is used for x versus y',
                  ],
                  answer: 1,
                  explanation:
                    'Varying z over a set produces a corresponding set of plausible predictions. In the fork example z is binary: it selects between the predicted left-branch and right-branch representations.',
                },
                {
                  prompt: 'What capability does JEPA explicitly give up in exchange for representing multi-modal futures well?',
                  options: [
                    'The ability to be trained without labeled data',
                    'The ability to use two separate encoders for x and y',
                    'The ability to generate outputs (i.e., produce explicit y predictions, such as actual pixels)',
                    'The ability to handle inputs of different modalities like video and audio',
                  ],
                  answer: 2,
                  explanation:
                    'JEPA sacrifices generative capability — the ability to produce explicit pixel predictions — in exchange for a clean way to represent multi-modal dependencies between inputs and outputs.',
                },
              ],
            },
          ],
        },
        {
          id: 'ami-vicreg',
          title: 'VICReg: Preventing Collapse Without Negatives',
          minutes: 14,
          xp: 25,
          steps: [
            { kind: 'read', title: 'VICReg: Preventing Collapse Without Negatives', markdown: amiVicreg },
            {
              kind: 'quiz',
              title: 'Check Your Understanding: Variance, Invariance, Covariance',
              questions: [
                {
                  prompt: 'Why does naively training a JEPA to make sy predictable from sx risk collapse?',
                  options: [
                    'The encoders can make both representations constant, which is trivially predictable and yields zero energy everywhere',
                    'The predictor network runs out of capacity before convergence',
                    'The energy function becomes undefined when sx and sy have different dimensions',
                    'Gradient descent cannot optimize non-contrastive losses without negative samples',
                  ],
                  answer: 0,
                  explanation:
                    'If the only objective is "make sy predictable from sx," the network can collapse both representations to a constant — trivially predictable, but learning nothing useful.',
                },
                {
                  prompt: 'What does the VICReg variance loss specifically enforce?',
                  options: [
                    'A hinge loss keeping the standard deviation of each component of vy (and sy) above a threshold over a batch',
                    'That the mean of each component of vy equals zero',
                    'That all components of vy have exactly equal variance',
                    'That the covariance between vx and vy is maximized',
                  ],
                  answer: 0,
                  explanation:
                    "The variance term is a hinge loss that keeps each component's standard deviation above a threshold across the batch — directly preventing any single component from collapsing to a constant value.",
                },
                {
                  prompt: 'How does the VICReg covariance loss contribute to maximizing the information content of a representation?',
                  options: [
                    'It pushes covariances between different component pairs of vy toward zero, decorrelating components so each carries somewhat independent information',
                    'It increases the correlation between components of vy and vx to align the two views',
                    'It penalizes large magnitude values in vy to control over-fitting',
                    'It forces all components of vy to have variance equal to one',
                  ],
                  answer: 0,
                  explanation:
                    'By pushing pairwise covariances toward zero, the covariance loss decorrelates the components of vy. Decorrelated components are less redundant, so together they carry more total information.',
                },
                {
                  prompt: 'The paper distinguishes VICReg as "contrastive over components" rather than "contrastive over vectors." What does this distinction mean?',
                  options: [
                    'VICReg pushes different components of a representation (over a batch) to be different/decorrelated, whereas traditional contrastive methods push representations of different inputs apart, which requires many negative samples',
                    'VICReg compares vectors from different batches while traditional contrastive methods compare components within a single vector',
                    'VICReg uses the same number of negative samples as contrastive methods, just structured differently',
                    'VICReg is identical to contrastive learning but renamed for marketing purposes',
                  ],
                  answer: 0,
                  explanation:
                    'Traditional contrastive learning needs many sampled "different inputs" to contrast against (contrastive over vectors). VICReg instead decorrelates and spreads out the components of representations within a batch, achieving a similar anti-collapse effect without negative pairs.',
                },
              ],
            },
          ],
        },
        {
          id: 'ami-hierarchical-jepa',
          title: 'H-JEPA: Stacking Levels for Long-Horizon Planning',
          minutes: 16,
          xp: 30,
          steps: [
            { kind: 'read', title: 'H-JEPA: Stacking Levels for Long-Horizon Planning', markdown: amiHierarchicalJepa },
            {
              kind: 'quiz',
              title: 'Check Your Understanding: Hierarchy and Decomposition',
              questions: [
                {
                  prompt: 'Why does training a JEPA with a non-contrastive criterion like VICReg make stacking multiple JEPAs possible?',
                  options: [
                    'It forces the encoder to compress all inputs to the same fixed dimension, making levels interchangeable',
                    'It lets the encoder discard unpredictable details and learn abstract representations, so higher levels can build longer-term predictions on top of lower-level abstractions',
                    'It eliminates the need for a predictor module, so each level only needs an encoder',
                    'It guarantees zero reconstruction error, so no information is ever lost between levels',
                  ],
                  answer: 1,
                  explanation:
                    'VICReg-style training lets the encoder eliminate irrelevant, unpredictable details — exactly what makes it possible to feed a low-level representation into a higher-level JEPA that predicts further into the future at a coarser grain.',
                },
                {
                  prompt: 'In the driving example, what specifically survives at the long-term (e.g. ten-minute) prediction horizon, and what gets dropped?',
                  options: [
                    'Everything survives — long-term prediction just adds noise to the same trajectory',
                    'The millisecond-by-millisecond trajectory and exact interactions with other cars are dropped; the approximate route/destination and rough arrival time survive',
                    'The exact steering and pedal actions survive, but the destination becomes uncertain',
                    'All spatial information is dropped; only the elapsed time survives',
                  ],
                  answer: 1,
                  explanation:
                    'The driver cannot predict exact trajectory details over a long horizon, but at a higher level of abstraction, the approximate route and a predictable arrival time frame remain.',
                },
                {
                  prompt: 'According to the paper, why does multi-level abstraction matter beyond just making longer-term prediction possible?',
                  options: [
                    'It has no further purpose — it exists purely to save computation during inference',
                    'It is claimed to be essential to intelligent behavior because it enables a complex task to be decomposed into successively more detailed sub-tasks across levels of abstraction',
                    'It is only useful for compressing storage of past observations, not for any forward-looking behavior',
                    'It primarily helps with labeling training data more cheaply',
                  ],
                  answer: 1,
                  explanation:
                    'The paper explicitly claims that representing world states at multiple levels of abstraction is essential to intelligent behavior because it allows hierarchical planning.',
                },
                {
                  prompt: 'In the "commuting to work" decomposition example, what is the bottom of the hierarchy, and when do those actions get executed?',
                  options: [
                    'The bottom level is "catching a train," and it executes as soon as the plan is created',
                    'The bottom level is millisecond-by-millisecond muscle control, and these are only instantiated when the relevant environmental conditions are perceived',
                    'The bottom level is "driving to the train station," and it executes on a fixed timer',
                    'There is no bottom level — the decomposition is described as infinite and never terminates',
                  ],
                  answer: 1,
                  explanation:
                    'The decomposition descends to millisecond muscle controls, which are only instantiated when the relevant environmental conditions are actually perceived — planning at the top does not fix low-level execution in advance.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'ami-m5',
      title: 'The Actor, the Configurator, and Where This Fits',
      description:
        "How the Actor searches for good actions, how the Configurator retasks the rest of the system, and how the paper positions itself against prior work.",
      lessons: [
        {
          id: 'ami-actor',
          title: 'The Actor: Optimizer and Explorer',
          minutes: 14,
          xp: 25,
          steps: [
            { kind: 'read', title: 'The Actor: Optimizer and Explorer', markdown: amiActor },
            {
              kind: 'quiz',
              title: 'Check Your Understanding: Searching for Good Actions',
              questions: [
                {
                  prompt: 'The paper says there is "no conceptual difference between an action and a latent variable." What is the actual distinction between exploring action configurations and exploring latent configurations?',
                  options: [
                    'Actions are explored to minimize cost, while latent configurations are explored to represent plausible uncertainty (or maximize cost in adversarial settings)',
                    'Actions are continuous while latent variables are always discrete',
                    'Actions are optimized by the Actor while latent variables are optimized by the World Model',
                    'Actions require gradients while latent variables never do',
                  ],
                  answer: 0,
                  explanation:
                    'Both are configurations explored by the Actor — what differs is the objective: action sequences are searched to minimize predicted cost, while latent variables are searched to find plausible configurations of unobserved world state.',
                },
                {
                  prompt: 'What does it mean for the World Model to be "unfolded" during gradient-based action search?',
                  options: [
                    'The World Model is run forward step-by-step over the entire proposed action sequence, so one backward pass can assign credit/blame to every action in the sequence at once',
                    "The World Model's latent variables are converted into observable actions before backpropagation",
                    'The World Model is split into separate networks, one per timestep, each trained independently',
                    'The World Model discards its recurrent structure and predicts the final state directly from the initial state',
                  ],
                  answer: 0,
                  explanation:
                    'Unfolding means applying the World Model repeatedly across the proposed sequence (like unrolling an RNN), so a single backward pass assigns credit/blame to every action at once.',
                },
                {
                  prompt: 'According to the lesson, when should the Actor fall back to gradient-free methods like beam search, dynamic programming, or Monte-Carlo tree search instead of gradient-based optimization?',
                  options: [
                    'When the World Model or Cost are not well-behaved (e.g., not smooth/differentiable), making gradient-based search unreliable',
                    'Whenever the action space is continuous rather than discrete',
                    'Whenever multiple policy networks have already been trained for the task',
                    'Only when latent variables are involved, never for action sequences',
                  ],
                  answer: 0,
                  explanation:
                    'When the World Model or Cost are not well-behaved, gradients can be misleading or unavailable, so the Actor switches to classical search/planning methods.',
                },
                {
                  prompt: 'Once the Actor finds an optimal action sequence through planning, what are the two distinct uses for training a policy network on that result?',
                  options: [
                    'The policy network can replace planning entirely for time-critical situations, or initialize the action sequence near a good answer to speed up future planning',
                    "The policy network can only be used to verify the World Model's predictions, never to act",
                    'The policy network replaces the Cost module so future evaluations are faster',
                    'The policy network is used solely to generate new latent variable configurations',
                  ],
                  answer: 0,
                  explanation:
                    'Training a policy network on planning outputs gives a fast reflex that bypasses slow optimization, or warm-starts the optimization by initializing the search near a good solution.',
                },
              ],
            },
          ],
        },
        {
          id: 'ami-configurator',
          title: 'The Configurator: Retasking the Whole System',
          minutes: 16,
          xp: 30,
          steps: [
            { kind: 'read', title: 'The Configurator: Retasking the Whole System', markdown: amiConfigurator },
            {
              kind: 'quiz',
              title: 'Check Your Understanding: Modulation, Not Data',
              questions: [
                {
                  prompt: 'What is the core distinction between a normal input token and a Configurator-generated token feeding into the same transformer block?',
                  options: [
                    'A Configurator token carries instructions that reshape how the network processes inputs, while a normal token carries content to be processed',
                    'A Configurator token is processed first and discarded before the normal tokens arrive',
                    'A Configurator token always has higher numerical magnitude so the network weights it more heavily',
                    'There is no real distinction — the paper treats them as functionally identical extra inputs',
                  ],
                  answer: 0,
                  explanation:
                    'A normal input token says "here\'s what I currently see," while a Configurator token says "here\'s how to process what you see" — one supplies data, the other modulates the function computed over that data.',
                },
                {
                  prompt: 'The paper gives two justifications for having a Configurator module at all. What are they?',
                  options: [
                    'Hardware reuse and knowledge sharing',
                    'Energy efficiency and interpretability',
                    'Safety guardrails and faster training convergence',
                    'Modularity and parallelism across tasks',
                  ],
                  answer: 0,
                  explanation:
                    'The Configurator is "necessary for two reasons: hardware reuse, and knowledge sharing" — one circuit reused across tasks, and one generic World Model lightly modulated for many tasks.',
                },
                {
                  prompt: "The paper describes the Configurator's access to the Intrinsic Cost submodule and the Trainable Critic submodule as deliberately asymmetric. What is the reasoning?",
                  options: [
                    'Allowing complex modulation of the Intrinsic Cost could make the basic drives and safety guardrails difficult to control, so it is kept on a short leash; the Trainable Critic can be modulated more freely',
                    'The Intrinsic Cost is computationally cheaper to modulate, so it is modulated more aggressively than the Critic',
                    'The Trainable Critic cannot be modulated at all because it is frozen after pretraining',
                    'Both submodules are modulated identically — the paper does not distinguish between them',
                  ],
                  answer: 0,
                  explanation:
                    'The asymmetry is safety-motivated: the Intrinsic Cost encodes hard-wired drives and safety guardrails, so letting the Configurator freely reshape it would undermine that guarantee.',
                },
                {
                  prompt: 'What open question does LeCun explicitly leave unresolved regarding the Configurator?',
                  options: [
                    'How the Configurator learns to decompose a complex task into a sequence of subgoals the agent can individually accomplish',
                    'Whether the Configurator should be implemented as a transformer or a convolutional network',
                    'How many parameters the Configurator module should have relative to the other modules',
                    'Whether the Configurator is necessary at all, or could be replaced by hard-coded task switching',
                  ],
                  answer: 0,
                  explanation:
                    'The paper explains what the Configurator should do once given a subgoal, but leaves open how it learns to invent the right sequence of subgoals — automatic task decomposition is left as future work.',
                },
              ],
            },
          ],
        },
        {
          id: 'ami-related-work',
          title: 'Where Does This Idea Actually Come From?',
          minutes: 14,
          xp: 25,
          steps: [
            { kind: 'read', title: 'Where Does This Idea Actually Come From?', markdown: amiRelatedWork },
            {
              kind: 'quiz',
              title: 'Check Your Understanding: Positioning Against Prior Work',
              questions: [
                {
                  prompt: 'The paper states that "most of the ideas presented" are not new. What does it claim as the actual contribution?',
                  options: [
                    'A brand-new mathematical theory of energy-based learning never seen before',
                    'The synthesis of existing pieces (model-based control, hierarchical planning, joint embeddings) into one differentiable, end-to-end cognitive architecture',
                    'The first-ever use of neural networks to model the world',
                    'A proof that consciousness can be fully explained by configurator modules',
                  ],
                  answer: 1,
                  explanation:
                    'Individual components have decades of prior history. The claimed originality is in the architecture-level synthesis — how these pieces fit together end-to-end and differentiably.',
                },
                {
                  prompt: 'GANs, VAEs, and VQ-VAE are cited as prior attempts to solve the blurry-prediction problem. How does JEPA diverge from all three?',
                  options: [
                    'JEPA is also generative, but uses a more powerful decoder network',
                    'JEPA avoids the generative route entirely, predicting in representation space rather than reconstructing pixels',
                    'JEPA eliminates the need for any uncertainty representation by making all predictions deterministic and exact',
                    'JEPA is identical to VAEs but swaps the encoder for a transformer',
                  ],
                  answer: 1,
                  explanation:
                    'GANs/VAEs/VQ-VAE all remain generative, leaving open how to represent uncertainty in the prediction. JEPA sidesteps this by predicting abstract representations instead of reconstructing raw input.',
                },
                {
                  prompt: "What is the key structural distinction between contrastive and non-contrastive joint-embedding methods, per the paper's framing?",
                  options: [
                    'Contrastive methods use convolutional networks while non-contrastive methods use transformers',
                    'Contrastive methods prevent collapse by pushing negative pairs apart, while non-contrastive methods prevent collapse by maximizing the information content of the embeddings themselves',
                    'Contrastive methods require no negative examples at all, while non-contrastive methods require millions of them',
                    'Non-contrastive methods are strictly older, dating to the 1960s, while contrastive methods are a 2020s invention',
                  ],
                  answer: 1,
                  explanation:
                    'Contrastive JEA needs negative pairs to avoid collapse. Non-contrastive methods instead use information-maximizing regularizers directly on the embeddings, avoiding the need for negatives.',
                },
                {
                  prompt: 'How does the paper use cognitive science findings about children and human planners (e.g., "people construct simplified representations of the world for planning")?',
                  options: [
                    "As a direct algorithmic blueprint — the architecture's abstraction modules are copied line-for-line from neuroscience models",
                    'As motivating evidence that abstraction is how biological planners actually operate, not as a source of specific mechanisms to implement',
                    "As proof that consciousness has already been fully modeled by the configurator module",
                    'As evidence against using abstraction, since children plan without abstracting',
                  ],
                  answer: 1,
                  explanation:
                    'Cognitive science is used as borrowed evidence, not borrowed mechanisms — the human planning-abstraction finding supports the H-JEPA design choice conceptually, without the architecture being derived from a neuroscience algorithm.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'ami-m6',
      title: 'Limits, Critiques, and Open Questions',
      description:
        "The paper's own honest gaps, its speculative reach toward animal cognition and machine common sense, and its critique of scaling, reward, and symbols as shortcuts to intelligence.",
      lessons: [
        {
          id: 'ami-limitations',
          title: 'What the Paper Admits It Doesn\'t Know',
          minutes: 14,
          xp: 25,
          steps: [
            { kind: 'read', title: "What the Paper Admits It Doesn't Know", markdown: amiLimitations },
            {
              kind: 'quiz',
              title: 'Check Your Understanding: Naming the Open Questions',
              questions: [
                {
                  prompt: 'Regarding H-JEPA trained from video, what specifically does the paper say is unverified?',
                  options: [
                    'Whether the architecture can learn the abstract concept hierarchy described earlier — nobody has demonstrated it',
                    'Whether video data is large enough in volume to train any neural network',
                    'Whether JEPA-style training works at all, even on static images',
                    'Whether hierarchical predictors are computationally feasible on current hardware',
                  ],
                  answer: 0,
                  explanation:
                    'The paper poses it as an open question — could H-JEPA learn the abstract concept hierarchy — not a claim about data volume or hardware feasibility.',
                },
                {
                  prompt: 'On regularizing the latent variable, the paper lists discrete, low-dimensional, sparse, and stochastic as proposed approaches. What is its stance on which one is correct?',
                  options: [
                    'It explicitly declines to pick one, stating it is not clear which approach will ultimately be the best',
                    'It recommends sparse regularization as the clear winner based on prior JEPA experiments',
                    'It claims all four are mathematically equivalent, so the choice does not matter',
                    'It rules out stochastic regularization as incompatible with the rest of the architecture',
                  ],
                  answer: 0,
                  explanation:
                    'The paper lists four candidate approaches but explicitly says it is not clear which will ultimately be best — an open design choice, not a solved problem.',
                },
                {
                  prompt: 'The paper uses the Necker cube as an example when discussing an unresolved aspect of Mode-2 reasoning. What capability does this illustrate that the architecture cannot yet explain?',
                  options: [
                    'The human ability to spontaneously cycle through alternative interpretations of an ambiguous percept',
                    "The brain's ability to compress visual input into a low-dimensional latent code",
                    'The capacity to learn object permanence from video alone',
                    'The tendency of perception to degrade under high cognitive load',
                  ],
                  answer: 0,
                  explanation:
                    'The Necker cube illustrates that humans can spontaneously cycle through alternative interpretations of a percept, but "no such mechanism is described" for how Mode-2 reasoning would do this.',
                },
                {
                  prompt: 'Why does the lesson call out a tension between the Configurator being "the most mysterious" module and its role in Mode-2 reasoning?',
                  options: [
                    'Because Mode-2 reasoning depends on the Configurator to set subgoals, so an unspecified Configurator leaves a core piece of deliberate reasoning unspecified too',
                    "Because the Configurator is responsible for training the world model, so its absence would break Mode-1 reasoning as well",
                    'Because the paper claims the Configurator is fully specified elsewhere, contradicting itself',
                    'Because the Configurator is the only module the paper claims is biologically implausible',
                  ],
                  answer: 0,
                  explanation:
                    "Mode-2 relies on the Configurator to set subgoals and reconfigure other modules. Since the paper admits it hasn't specified how the Configurator does this, that gap propagates upward into Mode-2 reasoning itself.",
                },
              ],
            },
          ],
        },
        {
          id: 'ami-broader-relevance',
          title: 'Does Your Brain Already Have a Configurator?',
          minutes: 16,
          xp: 30,
          steps: [
            { kind: 'read', title: 'Does Your Brain Already Have a Configurator?', markdown: amiBroaderRelevance },
            {
              kind: 'quiz',
              title: 'Check Your Understanding: Brain Parallels and Common Sense',
              questions: [
                {
                  prompt: 'The paper explicitly frames its module-to-brain-region mapping as which kind of claim?',
                  options: [
                    'A speculative structural parallel worth studying side by side, not an experimentally-backed neuroscience finding',
                    'A literal claim that the brain implements this exact algorithm in silicon-equivalent form',
                    'A peer-reviewed neuroscience result the architecture was designed to replicate',
                    'An incidental footnote with no bearing on the rest of the architecture',
                  ],
                  answer: 0,
                  explanation:
                    'The paper opens this section by calling the parallels "somewhat speculative" — a structural hypothesis worth testing, not a finding being cited.',
                },
                {
                  prompt: 'What is the paper\'s speculative explanation for why consciousness "feels singular" — like you\'re only ever doing one conscious thing at a time?',
                  options: [
                    'The brain has many independent world models running in parallel, and consciousness samples one at random each moment',
                    'A single, shared, configurable world-model engine forces serialization of tasks, and that serialization is experienced as the feeling of singular focus',
                    'Consciousness is a separate module entirely, unrelated to the world model or Configurator',
                    'The Intrinsic Cost module suppresses awareness of all but one task to conserve energy',
                  ],
                  answer: 1,
                  explanation:
                    "Because there's only one shared, reconfigurable engine to go around, tasks must be handled one at a time — and that forced serialization is what shows up subjectively as the feeling of singular focus.",
                },
                {
                  prompt: 'On this model, what is the key architectural distinction between "instantaneous" emotions (pain, hunger) and "anticipatory" emotions (fear, elation)?',
                  options: [
                    'Instantaneous emotions are conscious while anticipatory emotions are unconscious',
                    'Instantaneous emotions map to the hard-wired Intrinsic Cost module; anticipatory emotions map to the learned Trainable Critic',
                    'There is no meaningful distinction — both map to the same module',
                    'Instantaneous emotions come from the Configurator; anticipatory emotions come from Perception',
                  ],
                  answer: 1,
                  explanation:
                    "Immediate feelings like pain map to the hard-wired Intrinsic Cost. Anticipatory feelings like fear of a specific thing map to the Trainable Critic, which learns to predict outcomes from experience.",
                },
                {
                  prompt: 'According to the paper, why do today\'s large language models exhibit only "shallow" common sense despite vast textual knowledge?',
                  options: [
                    'LLMs have not been trained on enough text yet to develop common sense',
                    'Common sense requires symbolic logic, which transformer architectures cannot represent',
                    'Text is a lossy, second-hand summary of physical reality filtered through what people chose to write down, so LLMs never get direct experience of physical consistency',
                    'LLMs lack a Trainable Critic, which is the only module capable of producing common sense',
                  ],
                  answer: 2,
                  explanation:
                    'Most human common sense comes from direct interaction with the physical world, rarely written down. LLMs only have text — a lossy, filtered proxy for reality.',
                },
              ],
            },
          ],
        },
        {
          id: 'ami-scaling-and-reward',
          title: 'Three Popular Shortcuts to Intelligence',
          minutes: 16,
          xp: 30,
          steps: [
            { kind: 'read', title: 'Three Popular Shortcuts to Intelligence', markdown: amiScalingAndReward },
            {
              kind: 'quiz',
              title: 'Check Your Understanding: Scaling, Reward, and Symbols',
              questions: [
                {
                  prompt: 'According to the paper, why does scaling up transformer-based language models fail to solve continuous, high-dimensional perception (e.g., video)?',
                  options: [
                    'Because tokenized, generative architectures are the wrong representation for continuous signals, which instead need an encoder that strips irrelevant detail, as in JEPA',
                    'Because transformers cannot be trained on more than a few billion parameters without running out of memory',
                    'Because reinforcement learning, not prediction, is required to handle continuous signals',
                    'Because video data is too rare on the internet to provide enough training examples',
                  ],
                  answer: 0,
                  explanation:
                    "Tokenized, generative models work for text because text is already discrete, but continuous signals like video need an encoder that eliminates irrelevant information — not just more parameters and data.",
                },
                {
                  prompt: 'Which position paper does the paper directly name and push back against on the "reward is enough" question?',
                  options: [
                    'Silver et al. 2021, "Reward is Enough"',
                    'Sutton, "The Bitter Lesson"',
                    'Bengio et al., "System 2 Deep Learning"',
                    'Schmidhuber, "Formal Theory of Creativity"',
                  ],
                  answer: 0,
                  explanation:
                    'The paper explicitly names Silver et al. (2021), "Reward is Enough," and states that contrary to that title, reward plays a relatively minor role in the proposed architecture.',
                },
                {
                  prompt: 'In the model-free RL vs. this paper\'s approach comparison, what is described as the main weakness of scalar reward as a learning signal?',
                  options: [
                    'It provides low-information, sparse feedback, requiring very large numbers of trials to learn a skill',
                    'It cannot be computed for continuous action spaces',
                    'It is too computationally expensive to calculate during training',
                    'It only works for discrete, turn-based games like Go and chess',
                  ],
                  answer: 0,
                  explanation:
                    'Scalar rewards are low-information feedback — a single number at the end of an episode tells the learner very little compared to dense, constant prediction of world states.',
                },
                {
                  prompt: 'In the self-driving car example ("turn left or right at the fork" vs. a sequence of wheel angles), what determines whether a decision looks "discrete/symbolic" versus "continuous"?',
                  options: [
                    'The level of abstraction at which the decision is made, not whether symbols were hard-wired into the system',
                    'Whether the decision was made by a human engineer or learned automatically',
                    'Whether the car is using a rule-based or neural controller',
                    'The number of training examples available for that specific maneuver',
                  ],
                  answer: 0,
                  explanation:
                    'High-level decisions feel discrete and symbolic because they occur at a high level of abstraction — but they are still regions of a learned, continuous abstraction space, not hard-coded symbols.',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
