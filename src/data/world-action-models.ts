import type { Subject } from '../types'
import foundationsMd from './md/wam-foundations.md?raw'
import philosophiesMd from './md/wam-philosophies.md?raw'
import substrateMd from './md/wam-substrate.md?raw'
import couplingMd from './md/wam-coupling.md?raw'
import backboneMd from './md/wam-backbone.md?raw'
import deploymentMd from './md/wam-deployment.md?raw'
import propertiesMd from './md/wam-properties.md?raw'
import dataEvalMd from './md/wam-data-eval.md?raw'
import challengesMd from './md/wam-challenges.md?raw'

export const worldActionModels: Subject = {
  id: 'world-action-models',
  title: 'World Action Models',
  tagline: 'Dream Less, Act More — a survey of embodied predictive-action models (arXiv:2606.20781).',
  icon: '🤖',
  accent: '#fb7185',
  modules: [
    {
      id: 'wam-m1',
      title: 'From World Models to World Action Models',
      description: 'What a WAM is, the action-facing-future contract that separates it from a VLA or a world model, and the three design philosophies the field splits into.',
      lessons: [
        {
          id: 'wam-foundations',
          title: 'What Is a World Action Model?',
          minutes: 12,
          xp: 70,
          steps: [
            { kind: 'read', title: 'The action-facing future', markdown: foundationsMd },
            {
              kind: 'quiz',
              title: 'VLA vs. world model vs. WAM',
              questions: [
                {
                  prompt: 'What is the precise distinguishing feature of a World Action Model (WAM) compared to a plain Vision-Language-Action (VLA) policy?',
                  options: [
                    'A WAM uses a larger transformer backbone than a VLA',
                    'A WAM makes a forecast of the future available to the action, while a VLA maps observation and instruction straight to an action without considering what happens after',
                    'A WAM only works on simulated robots, while VLAs work on real hardware',
                    'A WAM is trained with reinforcement learning, while a VLA is trained with imitation learning',
                  ],
                  answer: 1,
                  explanation: 'The core definition is that WAMs are "embodied predictive-action models that make a forecast of the future available to action." A VLA computes p(a | o, l) — it reasons from the present alone and never requires predicting what it will observe after acting.',
                },
                {
                  prompt: 'According to the survey, what mathematically separates a World Model from a WAM, even though both involve predicting a future observation o′?',
                  options: [
                    'A World Model predicts o′ at higher resolution than a WAM',
                    'A World Model computes p(o′ | o, a, l) — predicting the next observation given an action — but does not necessarily choose that action; a WAM computes p(o′, a | o, l), predicting and acting jointly',
                    'A World Model is only used for video generation, never for robotics',
                    'A World Model requires language instructions l, while a WAM does not',
                  ],
                  answer: 1,
                  explanation: 'A World Model takes an action as given input and forecasts the resulting observation — it is a predictor, not a decision-maker. A WAM closes the loop by jointly modeling p(o′, a | o, l), linking prediction and control.',
                },
                {
                  prompt: 'A robotics paper trains a VLA with an extra auxiliary loss that predicts the next frame, but discards that future-prediction head entirely at inference when choosing actions. Per the survey\'s boundary test, is this a WAM?',
                  options: [
                    'Yes, because the model was trained to predict the future at all',
                    'No, because the predicted future never produces, scores, verifies, or trains the action that is actually executed — the future never reaches the action',
                    'Yes, because any auxiliary loss involving o′ qualifies the model as a world model',
                    'No, because WAMs require a separate inverse-dynamics module',
                  ],
                  answer: 1,
                  explanation: 'The boundary test is: "The predicted future must produce, score, verify, or train the action." An auxiliary future loss discarded before acting fails this test — it is explicitly a near-miss, not a WAM.',
                },
                {
                  prompt: 'GR-1/GR-2, PAD, and WorldVLA are cited as examples of which of the three ways a WAM links future and action?',
                  options: [
                    'Predict then act, because they use a separate inverse-dynamics module',
                    'Score actions, because they evaluate multiple candidate actions before selecting one',
                    'Joint prediction, because one shared backbone predicts the future observation and the action together in a single model',
                    'None of the three — they are classified as World Models, not WAMs',
                  ],
                  answer: 2,
                  explanation: 'These models implement joint prediction: GR-1/GR-2 learn future image tokens and action tokens together in one autoregressive stream, while PAD and WorldVLA do so via diffusion — one backbone outputs both o′ and a.',
                },
                {
                  prompt: 'The survey\'s subtitle thesis is "Dream Less, Act More." What design trade-off does this summarize?',
                  options: [
                    'WAMs should abandon future prediction entirely and revert to pure VLA behavior',
                    'Every WAM design choice trades predictive richness against compute, memory, and latency in a control loop, and the strongest WAMs minimize how much future they generate while still acting on what they need',
                    'Acting more frequently always produces better robot performance regardless of prediction quality',
                    'Dreaming should happen only during offline training, never at inference',
                  ],
                  answer: 1,
                  explanation: 'Richer future prediction costs compute, memory, and latency in a control loop, so the most effective WAMs are economical: they generate only as much future as is needed to inform the action.',
                },
              ],
            },
          ],
        },
        {
          id: 'wam-philosophies',
          title: 'Three Design Philosophies',
          minutes: 14,
          xp: 80,
          steps: [
            { kind: 'read', title: 'How far do you carry the dream?', markdown: philosophiesMd },
            {
              kind: 'quiz',
              title: 'Render, latent, or video-free',
              questions: [
                {
                  prompt: 'What single question determines which of the three design philosophies a WAM belongs to?',
                  options: [
                    'How far along the inference path the prediction is carried before an action is decoded',
                    'Whether prediction and action are arranged in a cascaded or joint architecture',
                    'Whether the model was trained on real-world or simulated video',
                    'How many camera viewpoints the model conditions on',
                  ],
                  answer: 0,
                  explanation: 'The philosophy split is defined by where along the inference path the prediction is grounded before decoding an action — all the way to pixels, stopping at a latent, or never entering video space.',
                },
                {
                  prompt: 'Why does the survey insist the philosophy split is distinct from the cascaded-vs-joint split?',
                  options: [
                    'Because cascaded-vs-joint only applies to Video-Generation-Free models',
                    'Because the philosophy split asks where prediction is grounded along the inference path, while cascaded-vs-joint asks how prediction and action are arranged inside the model — they are independent axes',
                    'Because cascaded-vs-joint is an outdated distinction the philosophy split replaced',
                    'Because they always coincide in practice',
                  ],
                  answer: 1,
                  explanation: 'The two distinctions are separable: a Latent-Only WAM can be cascaded or joint, and so can a Render-and-Decode one — the axes are independent, which is why you need both.',
                },
                {
                  prompt: 'What is the defining limitation of the Render-and-Decode philosophy?',
                  options: [
                    'It cannot be inspected or visualized by humans',
                    'It requires a frozen teacher model for supervision',
                    'Each prediction step pays the full cost of denoising or autoregression to produce pixels, even though the actor rarely consumes the entire rendered output',
                    'It cannot incorporate instruction conditioning',
                  ],
                  answer: 2,
                  explanation: 'Render-and-Decode pays the full video-generation schedule at every prediction step to produce a complete rendered future, even though action decoding typically needs only a fraction of it.',
                },
                {
                  prompt: 'In the Latent-Only philosophy, what is skipped and what is kept?',
                  options: [
                    'The entire video-trained representation is skipped, but pixel rendering is kept',
                    'The instruction conditioning is skipped, but the video backbone is kept',
                    'The final pixel-decoding step is skipped, but the video-shaped dynamic prior (latent, denoising feature, flow field, mask, or value map) is kept',
                    'The action head is skipped, but the renderer is kept for inspection',
                  ],
                  answer: 2,
                  explanation: 'Latent-Only stops before pixel decoding but keeps the video-shaped dynamic prior, decoding the action from a cheaper intermediate. UWM collapses its visual branch at inference; Genie Envisioner decodes from a one-step denoised latent cache.',
                },
                {
                  prompt: 'Which pairing correctly matches a Video-Generation-Free model with its future representation?',
                  options: [
                    'FLARE predicts 3D point flow; PointWorld aligns policy tokens to frozen-teacher embeddings',
                    'FLARE aligns policy tokens to future-observation embeddings from a frozen teacher; PointWorld predicts action-conditioned 3D point flow and plans with MPPI',
                    'DUST predicts affordance maps; PALM uses a dual-stream diffusion head',
                    'PointWorld uses a VLM with dual-stream diffusion; FLARE plans with MPPI',
                  ],
                  answer: 1,
                  explanation: 'FLARE replaces pixel prediction with feature prediction against a frozen teacher; PointWorld predicts 3D point flow and plans over that compact future. The future stays in the inference path; only the representation is cheaper than video.',
                },
              ],
            },
            {
              kind: 'scenario',
              title: 'Pick a philosophy for the robot',
              scenario: {
                intro: 'You lead a team deploying a single-arm manipulator that must run closed-loop at a high control rate on modest onboard hardware. You have a strong pretrained video-diffusion backbone available.',
                stages: [
                  {
                    situation: 'A teammate proposes running the full video backbone all the way to rendered pixels every control step, then decoding the action from the rendered future — the Render-and-Decode approach — because "the rendered future is inspectable and uses the full visual prior."',
                    question: 'Given the latency and hardware constraints, is Render-and-Decode at every step the right call?',
                    options: [
                      { label: 'No — keep the video prior but stop before pixel decoding (Latent-Only), decoding action from a latent/feature so you skip the renderer in the control loop', quality: 'best', feedback: 'Exactly the survey\'s point: Render-and-Decode pays the full denoising/autoregression schedule per step, which the actor rarely needs in full. Latent-Only (UWM, Genie Envisioner) preserves the video-trained prior while bypassing the renderer to reach real-time control.' },
                      { label: 'Yes — rendered pixels are the most accurate future, so task success will be highest', quality: 'bad', feedback: 'Visual-quality metrics only weakly predict task success, and producing pixels every step blows the latency budget on modest hardware. A gorgeous rendered future can still yield a useless action.' },
                      { label: 'Drop all prediction and ship a plain VLA', quality: 'bad', feedback: 'That throws away the value of the predictive component entirely — the whole reason to build a WAM is to let an anticipated future shape the action. Latent-Only keeps that benefit at a feasible cost.' },
                    ],
                  },
                  {
                    situation: 'Later you consider an even cheaper design that drops the video-generation backbone entirely and predicts the future in a compact non-pixel space.',
                    question: 'What must remain true for that Video-Generation-Free design to still count as a WAM?',
                    options: [
                      { label: 'A future substrate (e.g. predicted feature tokens, point flow, or affordance maps) must still be produced and used in the action path', quality: 'best', feedback: 'Correct — Video-Generation-Free removes only the pixel-level video backbone, not prediction. FLARE, PointWorld, and DUST all keep a future object in the inference path; that is what keeps them WAMs rather than VLAs.' },
                      { label: 'It must still render at least one RGB frame per chunk for inspection', quality: 'bad', feedback: 'Video-Generation-Free explicitly forgoes the pixel backbone; rendering a frame is not required. What is required is that some predicted future still shapes the action.' },
                      { label: 'Nothing — without a video generator it is automatically just a VLA', quality: 'bad', feedback: 'Not so: a model can predict a future in embedding, token, flow, or affordance space and still satisfy the action-facing-future contract. The future need not be rendered video.' },
                    ],
                  },
                ],
                debrief: 'The three philosophies are a dial on how far you carry the prediction before decoding an action. Latency-constrained closed-loop control pushes you down the dial — toward latent or video-generation-free futures — which is exactly the field\'s "Dream Less, Act More" trajectory.',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'wam-m2',
      title: 'The Four-Ingredient Anatomy',
      description: 'Every WAM is one mathematical object pinned down by four separable choices: predictive substrate, action coupling, architectural backbone, and deployment regime.',
      lessons: [
        {
          id: 'wam-substrate',
          title: 'Ingredient 1 — Predictive Substrate',
          minutes: 13,
          xp: 80,
          steps: [
            { kind: 'read', title: 'What future do you predict?', markdown: substrateMd },
            {
              kind: 'quiz',
              title: 'Where the future lives',
              questions: [
                {
                  prompt: 'Equation 8 defines a WAM as pΘ(s, a | c). What is the key conceptual move this equation makes?',
                  options: [
                    'It treats prediction of future states and prediction of actions as a single joint distribution, not two separate problems',
                    'It proves all WAMs must use pixel-grounded substrates',
                    'It shows the context c must always include a natural-language instruction',
                    'It defines the substrate S as always being a video latent space',
                  ],
                  answer: 0,
                  explanation: 'Equation 8 frames every WAM as one joint distribution over a future trajectory and an action chunk, both conditioned on context c — the unifying move that lets wildly different architectures be compared.',
                },
                {
                  prompt: 'A video-diffusion WAM denoises a VAE latent grid and skips pixel decoding entirely during control. Per the lesson\'s rule, what substrate is it?',
                  options: [
                    'Feature substrate, because no decoding actually happens during control',
                    'Affordance substrate, because the latent acts as a score map',
                    'Pixel-grounded, because a fixed decoder could map that latent back to video even though it isn\'t invoked at runtime',
                    'Geometric, because VAE latents are coordinate tensors',
                  ],
                  answer: 2,
                  explanation: 'Substrate is defined by where the future lives — whether a fixed decoder could recover an observation from it — not by which tensor the action head touches at runtime.',
                },
                {
                  prompt: 'A policy reads an intermediate hidden state from a video trunk, but that state has no fixed observation decoder. What substrate is this?',
                  options: [
                    'Pixel-grounded, since it originates from a video model',
                    'Feature substrate, because the deciding test is the existence of a fixed decoder back to an observation, which is absent here',
                    'Geometric, because intermediate states are always coordinate-like',
                    'Affordance, because intermediate states are task scores by default',
                  ],
                  answer: 1,
                  explanation: 'Origin in a video model does not matter; the deciding factor is whether a fixed decoder could recover an observation. With none, it is a feature substrate — compact but lacking a visual-fidelity check.',
                },
                {
                  prompt: 'Which trade-off is explicitly described for the geometric substrate (optical flow, point tracks, depth, pose)?',
                  options: [
                    'It is the most data-hungry substrate but offers the richest visual fidelity',
                    'It requires no fixed decoder and is therefore unfalsifiable',
                    'It is far smaller than a pixel tensor and trainable on less data, but only reliable when motion/contact carries the task',
                    'It is compact and task-specific but the labels must be defined per task',
                  ],
                  answer: 2,
                  explanation: 'Geometric substrates are much lighter than pixel tensors and need less data, but only capture what matters when the task is fundamentally about motion or contact — they discard appearance some tasks need.',
                },
                {
                  prompt: 'What does the "∧" notation mean when a WAM like DriveDreamer-Policy is described as "Pixel ∧ Geometric"?',
                  options: [
                    'The model alternates between substrates across training epochs',
                    'The model predicts two substrates jointly in a single forward pass — a joint cell spanning both categories',
                    'The model uses pixel for training and geometric only at deployment',
                    'It is a typo convention meaning the model committed to neither',
                  ],
                  answer: 1,
                  explanation: 'Joint cells (∧) mark WAMs that predict two substrates simultaneously in one forward pass — DriveDreamer-Policy is Pixel ∧ Geometric, JOPAT is Feature ∧ Geometric.',
                },
              ],
            },
          ],
        },
        {
          id: 'wam-coupling',
          title: 'Ingredient 2 — Action Coupling',
          minutes: 13,
          xp: 80,
          steps: [
            { kind: 'read', title: 'How action enters and leaves', markdown: couplingMd },
            {
              kind: 'quiz',
              title: 'Rollout, joint, or post-head',
              questions: [
                {
                  prompt: 'According to the lesson, what specifically distinguishes a WAM from a plain predictive world model?',
                  options: [
                    'A WAM uses a larger backbone',
                    'Action coupling — the structural decision for how action enters as conditioning or leaves as a decoded result',
                    'A WAM is trained only on robot data, not video',
                    'A WAM always predicts pixels instead of latents',
                  ],
                  answer: 1,
                  explanation: 'Action coupling is "the structural decision that turns a predictive world model into a WAM." A model that only predicts the future, with no way for action to enter or exit, isn\'t a WAM.',
                },
                {
                  prompt: 'In action-conditioned rollout, what role does the world model play with respect to the actions it receives?',
                  options: [
                    'It produces the actions itself, then predicts their consequences',
                    'It scores or corrects proposed actions rather than producing them — enabling counterfactual control',
                    'It ignores the actions and predicts the future unconditionally',
                    'It discards the actions after the first rollout step',
                  ],
                  answer: 1,
                  explanation: 'The world model scores or corrects actions supplied by an external source (planner, policy, search), letting candidates shape the future before selection — the counterfactual-control property.',
                },
                {
                  prompt: 'What is the key trade-off between chunk-level and step-wise action-conditioned rollout?',
                  options: [
                    'Chunk-level is more accurate but step-wise is cheaper to train',
                    'Chunk-level evaluates many candidates in parallel but can\'t react mid-window; step-wise can react each step but loses that parallelism',
                    'Chunk-level only works with discrete actions, step-wise only with continuous actions',
                    'Step-wise requires a frozen backbone while chunk-level does not',
                  ],
                  answer: 1,
                  explanation: 'Chunk-level proposes a whole sequence up front (parallel candidate scoring, e.g. PointWorld\'s MPPI) but can\'t adapt mid-window; step-wise alternates action and prediction, reacting inside the trajectory at the cost of parallelism.',
                },
                {
                  prompt: 'Joint generation produces future and action from a single sampled trajectory. What is the stated benefit, and its corresponding cost?',
                  options: [
                    'Benefit: lower compute. Cost: requires two separate backbones',
                    'Benefit: mutual consistency between predicted world and chosen action. Cost: training instability from the generation and action losses pulling the shared representation apart',
                    'Benefit: embodiment-swappable action heads. Cost: the substrate must preserve action-relevant information',
                    'Benefit: reactive step-wise control. Cost: cannot evaluate candidates in parallel',
                  ],
                  answer: 1,
                  explanation: 'One sample carries both, so they are mutually consistent by construction, but training L_gen(s) + λ·L_act(a) on a shared backbone can be unstable — fixed by pretraining the substrate head on video, then adding the action head with a careful λ schedule.',
                },
                {
                  prompt: 'In the post-prediction head factorization, why is θ (the future predictor) frozen in many implementations while qψ (the action expert) trains?',
                  options: [
                    'Because freezing θ is required for joint diffusion to converge',
                    'Because it lets a pretrained predictor stay fixed while the action head changes across embodiments',
                    'Because θ is too large to fine-tune on robot data',
                    'Because qψ must be trained before θ is initialized',
                  ],
                  answer: 1,
                  explanation: 'This arrangement "lets a pretrained predictor stay fixed while the action head changes across embodiments" — swap the cheap action expert per robot rather than retraining the whole substrate model.',
                },
                {
                  prompt: 'Per the chunk-size trade-off, what pushes real-robot closed-loop control toward smaller action chunks?',
                  options: [
                    'Smaller chunks always improve prediction accuracy',
                    'A long chunk amortizes backbone cost but can\'t react mid-chunk, so closed-loop control needs smaller chunks or cheaper backbones to stay reactive',
                    'Larger chunks are incompatible with continuous action representations',
                    'Smaller chunks eliminate the need for an action source entirely',
                  ],
                  answer: 1,
                  explanation: 'One action per pass means low latency but full-backbone invocation at control frequency; a long chunk spreads cost but can\'t react during it. Real hardware pushes toward smaller chunks or cheaper backbones.',
                },
              ],
            },
          ],
        },
        {
          id: 'wam-backbone',
          title: 'Ingredient 3 — Architectural Backbone',
          minutes: 14,
          xp: 80,
          steps: [
            { kind: 'read', title: 'Five families that produce the prediction', markdown: backboneMd },
            {
              kind: 'quiz',
              title: 'The five backbone families',
              questions: [
                {
                  prompt: 'Why does the survey reject treating flow matching as a sixth backbone family?',
                  options: [
                    'Because flow matching only swaps the noise-predictor for a velocity-field predictor, but still fits the same iterative-reverse-chain parameterization as diffusion',
                    'Because flow matching is too rarely used to warrant its own category',
                    'Because flow matching cannot be applied to video substrates',
                    'Because flow matching is a coupling choice, not a backbone choice',
                  ],
                  answer: 0,
                  explanation: 'Flow matching changes the score parameterization (velocity field vθ instead of noise εθ) but keeps the same Equation 21 reverse-chain structure — "a different choice of the score parameterization," not a new family.',
                },
                {
                  prompt: 'The survey makes a "loud correction" about autoregressive backbones. What is it?',
                  options: [
                    'Autoregression always requires a key-value cache to be tractable',
                    'Autoregression implies the model must jointly predict frame and action tokens',
                    'Autoregression does not imply joint action prediction — the backbone and the coupling are independent',
                    'Autoregressive backbones cannot support action-conditioned rollout',
                  ],
                  answer: 2,
                  explanation: 'An autoregressive stream might predict only the future substrate or jointly emit frame and action tokens — the serialization (backbone) is orthogonal to whether action prediction is coupled in.',
                },
                {
                  prompt: 'Why is JEPA described as realizing pθ(s | c) as "a Dirac at a deterministic predictor" rather than a stochastic density?',
                  options: [
                    'Because it samples from a learned Gaussian over embeddings at inference',
                    'Because the predictor outputs a single point in embedding space — there is no sampling or distributional spread over possible futures',
                    'Because it uses a deterministic random seed for reproducibility',
                    'Because it always predicts the same embedding regardless of context',
                  ],
                  answer: 1,
                  explanation: 'JEPA\'s predictor maps context features to a single predicted target-feature point — no stochastic sampling step. The density over s collapses to a point estimate.',
                },
                {
                  prompt: 'What makes JEPA\'s inference loop cheap, and what is the corresponding cost?',
                  options: [
                    'It uses fewer parameters, but suffers slow KV-cache lookups',
                    'The backbone never inverts the target encoder back to pixel space, but the embedding space has no intrinsic visual-quality measure, so only downstream-task accuracy can validate it',
                    'It skips the context encoder, but loses the ability to condition on past observations',
                    'It avoids gradient computation, but cannot be trained end-to-end',
                  ],
                  answer: 1,
                  explanation: 'No inversion of E_tgt means JEPA avoids the expensive generative step, but you never produce an interpretable output, so the only validation is downstream-task accuracy.',
                },
                {
                  prompt: 'How does the hybrid family support every coupling family, unlike the other backbones?',
                  options: [
                    'It trains two fully independent networks with no shared computation',
                    'It uses much larger capacity to brute-force all coupling patterns',
                    'A single shared trunk feeds both a substrate head and an action head, and the ordering of the heads around the trunk determines which coupling appears',
                    'It alternates between diffusion and autoregressive sampling at each step',
                  ],
                  answer: 2,
                  explanation: 'Because the trunk feeds both heads, you realize any coupling by arrangement: both heads jointly (joint generation), substrate-then-action (post-prediction head), or wrap with a planner (action-conditioned rollout).',
                },
                {
                  prompt: 'What distinguishes an LLM/VLM-backbone WAM from a plain VLA policy, per the gate in Section 4.4.5?',
                  options: [
                    'The backbone must use a frozen pretrained checkpoint',
                    'A future substrate (future tokens, subgoal images, motion representations, affordance maps) must be present in the inference-time control context; a VLM mapping observations straight to action tokens without one is just a VLA',
                    'A WAM must output continuous actions, a VLA only discrete tokens',
                    'A WAM in this family must use a video-generation trunk',
                  ],
                  answer: 1,
                  explanation: 'The gate is whether a future substrate is consumed or predicted in the inference-time control loop. A VLM mapping observations directly to action tokens without one "falls outside this family."',
                },
              ],
            },
          ],
        },
        {
          id: 'wam-deployment',
          title: 'Ingredient 4 — Deployment Regime & the 4-Tuple',
          minutes: 14,
          xp: 90,
          steps: [
            { kind: 'read', title: 'When is the model invoked?', markdown: deploymentMd },
            {
              kind: 'quiz',
              title: 'Open, chunked, single, interactive',
              questions: [
                {
                  prompt: 'In the chunked closed-loop regime, what condition determines whether the deployment is even feasible?',
                  options: [
                    'N_fwd(K)/K must be less than 1/f_ctrl, so the next chunk is ready before the current one finishes executing',
                    'N_fwd(K) must equal N_fwd(1) multiplied by K exactly',
                    'The chunk length K must be greater than the task length T',
                    'The KV-cache size M(t) must stay constant across chunks',
                  ],
                  answer: 0,
                  explanation: 'Chunked closed-loop is feasible only while N_fwd(K)/K < 1/f_ctrl — the per-step amortized cost must fit within the control period, or the actor runs out of actions before the next chunk arrives.',
                },
                {
                  prompt: 'What is the core limitation of chunked closed-loop that motivates adaptive variants like FFDC-WAM and WALL-WM?',
                  options: [
                    'Staleness — a long chunk cannot see the world change mid-execution, so methods add early-replan triggers or event-aligned chunk windows',
                    'The cost grows quadratically in task length T',
                    'It cannot be used with autoregressive backbones',
                    'It requires a persistent KV-cache that grows without bound',
                  ],
                  answer: 0,
                  explanation: 'The chunk is generated once and executed blindly for K steps, so the model can\'t react if the world deviates mid-chunk. FFDC-WAM\'s verifier triggers early replanning; WALL-WM ties chunk length to semantic events.',
                },
                {
                  prompt: 'Why does single-step closed-loop deployment require a sparse substrate rather than a decoded pixel render?',
                  options: [
                    'Sparse substrates are more accurate at predicting future frames',
                    'Pixel substrates cannot be used with autoregressive backbones',
                    'Single-step requires N_fwd(1) to fit inside the control period; a full pixel render is too expensive per step to meet that budget',
                    'Sparse substrates allow open-loop rollout instead of closed-loop',
                  ],
                  answer: 2,
                  explanation: 'Single-step invokes the model every tick with H=1, so each forward pass must finish within one control period. Only a cheap substrate — feature, geometric, affordance, or pixel-decodable latent — can hit that budget.',
                },
                {
                  prompt: 'In the interactive simulator regime, why is cumulative cost quadratic in t even though each step\'s cached forward pass is linear in M(t)?',
                  options: [
                    'Because M(t) grows with t, so summing a linearly-growing per-step cost over t steps yields a quadratic total',
                    'Because the backbone must be re-trained at every step',
                    'Because the substrate switches from feature to pixel-grounded as t increases',
                    'Because f_ctrl decreases as the task progresses',
                  ],
                  answer: 0,
                  explanation: 'Each step costs proportional to the current cache size M(t), which grows with t. Summing a quantity that grows linearly with t over t steps gives a quadratic total — the pressure lands on memory.',
                },
                {
                  prompt: 'Why isn\'t a plain video model like Wan or CogVideoX considered a WAM on its own?',
                  options: [
                    'Because it lacks a diffusion backbone',
                    'Because it only fixes Φ (substrate) and B (backbone); it becomes a WAM only once F (coupling) and D (deployment) are added, e.g. via a wrapper like CosmosPolicy or VidMan',
                    'Because video models cannot generate pixel-grounded outputs',
                    'Because it has no training-time component at all',
                  ],
                  answer: 1,
                  explanation: 'A video model fixes only substrate and backbone. It needs a coupling mechanism and a deployment regime before it qualifies — the wrapper-around-a-frozen-backbone pattern.',
                },
                {
                  prompt: 'Φ and B are "training-time" choices while F and D are "flexible at inference." What is "the expensive corner" of the design space few methods use directly?',
                  options: [
                    'Open-loop deployment with a feature substrate',
                    'A decoded pixel-grounded substrate, joint generation, a diffusion backbone, and single-step closed-loop deployment combined',
                    'A geometric substrate with an LLM/VLM backbone',
                    'Interactive deployment with a JEPA backbone',
                  ],
                  answer: 1,
                  explanation: 'The expensive corner combines maximal per-step cost with maximal substrate fidelity: decoded pixels + joint generation + diffusion + single-step. Methods that appear to use it usually trade one coordinate away.',
                },
              ],
            },
            {
              kind: 'scenario',
              title: 'Specify the 4-tuple',
              scenario: {
                intro: 'You are designing a WAM for a contact-rich dexterous manipulation task that must run closed-loop on a real robot, replanning every few control steps. You want to reason about it as a 4-tuple (Φ, F, B, D).',
                stages: [
                  {
                    situation: 'A colleague drafts the tuple as (decoded pixel-grounded, joint generation, diffusion, single-step) — rendering a full RGB future every control tick and jointly denoising action with it.',
                    question: 'What does the survey say about this combination?',
                    options: [
                      { label: 'It is "the expensive corner" — maximal per-step cost and substrate fidelity at once; few methods can use it directly in production', quality: 'best', feedback: 'Right. The survey names exactly this combination as the expensive corner. Decoded pixels at single-step cadence rarely fit a real control budget, so designs trade one coordinate away — a sparser substrate, a chunked regime, or a cheaper inference-time model.' },
                      { label: 'It is the recommended default because it maximizes prediction quality', quality: 'bad', feedback: 'Prediction quality isn\'t the objective in a control loop — feasibility is. Rendering decoded pixels every tick blows the latency budget, and visual fidelity only weakly predicts task success.' },
                      { label: 'It is invalid because diffusion cannot do joint generation', quality: 'bad', feedback: 'Diffusion supports joint generation (e.g. PAD, UWM denoise the (s,a) variable jointly). The problem is cost at single-step cadence, not validity.' },
                    ],
                  },
                  {
                    situation: 'You need to fit the real-robot control rate. You can only cheaply change the inference-time coordinates.',
                    question: 'Which coordinates are the survey\'s "flexible at inference" levers to pull first?',
                    options: [
                      { label: 'The coupling F and deployment regime D — e.g. move to a chunked regime and an adaptive trigger, since Φ and B are largely fixed at training time', quality: 'best', feedback: 'Correct. Φ (substrate) and B (backbone) are training-time decisions; F and D are where recent mechanisms (adaptive-K chunking, event-triggered invocation, slow-fast loops) live. Switching to chunked closed-loop amortizes the backbone over several ticks.' },
                      { label: 'Swap the substrate Φ and backbone B at inference, leaving F and D fixed', quality: 'bad', feedback: 'Backwards: substrate and backbone are fixed by training (changing them usually means retraining or an added head). Deployment and some coupling wrappers are the adjustable-at-inference coordinates.' },
                      { label: 'None — the tuple is immutable once chosen', quality: 'bad', feedback: 'The survey stresses the opposite asymmetry: F and D are flexible at inference, which is exactly where much recent work concentrates.' },
                    ],
                  },
                ],
                debrief: 'The 4-tuple (Φ, F, B, D) turns "which WAM is this?" into four separable answers. Two are training-time (substrate, backbone) and two are inference-flexible (coupling, deployment) — and the expensive corner where all four are maximally costly is one almost nobody affords directly.',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'wam-m3',
      title: 'Core Properties of a Running WAM',
      description: 'Once a WAM is placed in a control loop, five properties must hold — interactability, causality, persistence, physical plausibility, generalization — and they trade off against each other.',
      lessons: [
        {
          id: 'wam-properties',
          title: 'Five Things a WAM Must Get Right',
          minutes: 16,
          xp: 95,
          steps: [
            { kind: 'read', title: 'Interactable, causal, persistent, plausible, general', markdown: propertiesMd },
            {
              kind: 'quiz',
              title: 'The five properties as trade-offs',
              questions: [
                {
                  prompt: 'The survey says the five WAM properties "are not independent." What does this mean for design practice?',
                  options: [
                    'Improving one property typically shifts cost, latency, memory, or error into another, so design is a set of trade-offs rather than a checklist',
                    'All five must be implemented in a fixed sequence',
                    'Only one property can be present in a working WAM at a time',
                    'The five properties are redundant restatements of the same requirement',
                  ],
                  answer: 0,
                  explanation: 'The properties fight each other — a fix for persistence raises cost, a fix for causality sacrifices refinement. There is no single best setting; engineers tune dials per task.',
                },
                {
                  prompt: 'On the interactability "dial" from post-prediction to earliest binding, what is the actual trade-off as binding moves earlier?',
                  options: [
                    'Earlier binding always improves both cost and controllability',
                    'Earlier binding makes the model strictly less accurate but cheaper to train',
                    'Later binding is cheaper and more modular; earlier binding makes the predicted future more genuinely shaped by the action, at the cost of modularity',
                    'Binding point has no effect on cost',
                  ],
                  answer: 2,
                  explanation: 'It is a dial, not a ladder: later binding is cheaper and more modular; earlier binding means the predicted future is genuinely shaped by the act. Neither end is universally better.',
                },
                {
                  prompt: 'The survey describes a failure where a model "can grasp flawlessly inside its own rollout and then close on empty air at inference." What causes this, and which property does it violate?',
                  options: [
                    'A persistence failure: the model forgets the object\'s location after a long rollout',
                    'A causality violation: future frames leaked into the action decision, so the action relied on a cue never available in real time',
                    'A generalization failure: the object was never seen during training',
                    'A physical plausibility failure: the gripper passed through the object geometrically',
                  ],
                  answer: 1,
                  explanation: 'Joint denoising lets future frames influence the current action during simulated rollout, but at real inference that future doesn\'t exist yet, so the grasp cue disappears — the canonical causality failure.',
                },
                {
                  prompt: 'How does causality function as a "latency property" rather than purely a correctness constraint?',
                  options: [
                    'Causal masking always slows inference because it prevents KV-cache reuse',
                    'It does not affect latency at all',
                    'Because the controller needs the next action more than a fully refined future video, causal structure enables early-exiting the denoising tail — UD-VLA reports ~4x faster inference this way',
                    'Causality only matters for training speed',
                  ],
                  answer: 2,
                  explanation: 'Once the next action token is stable, remaining denoising steps mostly refine distant future pixels the controller doesn\'t need yet, so they can be skipped — ~4x speedup in UD-VLA.',
                },
                {
                  prompt: 'What is "re-grounding" (observation replacement), and what result does DreamZero achieve using it?',
                  options: [
                    'Re-grounding retrains the model after every rollout; DreamZero does this once per episode',
                    'Re-grounding sparsifies attention over distal frames; DreamZero achieves 4x faster inference',
                    'Re-grounding replaces imagined observations with measured ones in the cache after each executed chunk; DreamZero achieves 7 Hz closed-loop control with a 14B autoregressive video-diffusion model',
                    'Re-grounding adds a force-prediction branch; DreamZero achieves contact-state improvements',
                  ],
                  answer: 2,
                  explanation: 'After each chunk executes, real measurements overwrite the imagined ones in the KV-cache, preventing drift from compounding. DreamZero uses this to hit 7 Hz with a large 14B model.',
                },
                {
                  prompt: 'The survey states physical plausibility means "realizable beats photorealistic." What is the logic of moving down the abstraction ladder from RGB toward latents?',
                  options: [
                    'Lower rungs are always easier to train regardless of task',
                    'Each rung down trades away appearance the controller never needed, forcing capacity toward geometry, contact, and dynamics — at the cost of a future that is harder to inspect',
                    'Lower rungs guarantee photorealistic rendering at lower compute',
                    'The ladder exists only to support tactile prediction, not visual prediction',
                  ],
                  answer: 1,
                  explanation: 'Moving from RGB toward flow, masks, or latents discards photometric detail the controller doesn\'t act on, redirecting capacity to the geometry/contact/dynamics that decide success — losing a human-inspectable output.',
                },
              ],
            },
            {
              kind: 'scenario',
              title: 'Debug a contact-rich WAM',
              scenario: {
                intro: 'Your team\'s WAM grasps perfectly in its own imagined rollouts but frequently closes on empty air on the real robot, and on push tasks the object stops short of the goal. You investigate property by property.',
                stages: [
                  {
                    situation: 'In offline rollouts the grasp succeeds; on hardware it misses. A teammate suspects the action head is attending to future-frame tokens during training that don\'t exist at real-time inference.',
                    question: 'Which property is being violated, and what is the fix?',
                    options: [
                      { label: 'Causality — enforce a leakage-free mask so action tokens cannot attend to future-pixel or later-action tokens', quality: 'best', feedback: 'Exactly the WorldVLA pattern. A model that quietly leans on a future cue grasps flawlessly in its own rollout and closes on empty air at inference. The mask removes the leak (and, as a bonus, the expensive attention).' },
                      { label: 'Generalization — collect more training objects', quality: 'bad', feedback: 'The object isn\'t novel; the failure is the train/inference mismatch from future information leaking into the action. More data won\'t fix a causal leak.' },
                      { label: 'Persistence — add a longer KV-cache', quality: 'bad', feedback: 'This isn\'t drift over a long horizon; it\'s a causal leak where the action depended on a cue unavailable in real time. A bigger cache doesn\'t address it.' },
                    ],
                  },
                  {
                    situation: 'Separately, on push tasks the predicted future looks visually plausible, but the object stops as soon as contact ends instead of continuing to slide.',
                    question: 'What is the underlying physical-plausibility problem?',
                    options: [
                      { label: 'A flow-based future conditioned on a single frame cannot encode object velocity, so it doesn\'t predict the object continuing after contact ends', quality: 'best', feedback: 'Correct — the survey\'s exact example. A future can look plausible yet fail the embodiment\'s physics: one-frame flow has no momentum/velocity, so push tasks fail. The fix is a substrate or loss that captures dynamics (velocity, force, contact), not just appearance.' },
                      { label: 'The renderer resolution is too low to show the slide', quality: 'bad', feedback: 'Resolution isn\'t the issue — visual quality is fine. The future is missing a physical variable (velocity/momentum), which photorealism doesn\'t supply.' },
                      { label: 'The action chunk is too short', quality: 'bad', feedback: 'Chunk length governs reactivity, not whether the world model represents momentum. The model simply can\'t encode velocity from one frame.' },
                    ],
                  },
                ],
                debrief: 'Two different failures, two different properties: a train/inference cue mismatch is causality (fix with a leakage-free mask), while a plausible-looking future that violates physics is physical plausibility (fix by predicting the dynamics variable, not the appearance). "How useful the future is for the action predicts task success better than how good it looks."',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'wam-m4',
      title: 'Data, Evaluation & Open Challenges',
      description: 'Where WAM training data comes from, how the field evaluates a contract between prediction and control, and the seven coupled open problems the four-axis anatomy brings into view.',
      lessons: [
        {
          id: 'wam-data-eval',
          title: 'Data and Evaluation',
          minutes: 13,
          xp: 80,
          steps: [
            { kind: 'read', title: 'You can only test what you expose', markdown: dataEvalMd },
            {
              kind: 'quiz',
              title: 'Sources and evaluation tiers',
              questions: [
                {
                  prompt: 'Why is internet egocentric video (Ego4D, EPIC-KITCHENS) not simply the best WAM training source despite its massive scale?',
                  options: [
                    'It has no action channel, so its scale only becomes usable once an inverse-dynamics or latent-action model recovers a control proxy',
                    'It is too low-resolution to teach object dynamics',
                    'It only shows third-person views, mismatching robot embodiment',
                    'It is more expensive to collect than robot teleoperation',
                  ],
                  answer: 0,
                  explanation: '"Internet video is a scale source only after the action-label problem has been made explicit" — it teaches appearance and dynamics but never recorded actions, so it needs a bolted-on model or serves as video-backbone pretraining.',
                },
                {
                  prompt: 'What is the core trade-off that robot teleoperation data avoids, and what does it cost in exchange?',
                  options: [
                    'It avoids the embodiment gap and the missing-action problem, at the cost of consuming robot and/or operator time for every hour of data',
                    'It avoids the sim-to-real gap, at the cost of inheriting a generator\'s failure modes',
                    'It avoids low visual fidelity, at the cost of being unusable for closed-loop evaluation',
                    'It avoids simulation licenses, at the cost of lower action-label precision',
                  ],
                  answer: 0,
                  explanation: 'Teleoperation gives the cleanest action-conditioned trajectories since a human drives the robot directly, but every hour consumes real robot time or operator time — the opposite of internet video\'s cheap-but-actionless scale.',
                },
                {
                  prompt: 'Synthetic data generated by a WAM acting as its own "data engine" (DreamGen, IRASim) carries which specific risk the other four sources don\'t share?',
                  options: [
                    'It inherits the generator\'s own failure modes, compounding errors rather than introducing an independent gap',
                    'It cannot be combined with any other data source during training',
                    'It has no action channel, just like internet video',
                    'It is the most expensive of the five sources per hour',
                  ],
                  answer: 0,
                  explanation: 'Because synthetic data is produced by another WAM, whatever systematic errors that generator makes get baked into the dataset — a distinct failure mode from embodiment or sim-to-real gaps.',
                },
                {
                  prompt: 'Why does the survey insist visual-fidelity metrics (FVD, FID, LPIPS, SSIM) alone are insufficient to evaluate a WAM?',
                  options: [
                    'They reward realism of the predicted future, not whether it is useful for completing a task — a crisp rollout can be useless and a sparse one can drive success',
                    'They are too computationally expensive to run at scale',
                    'They can only be computed in simulation',
                    'They require closed-loop robot trials to compute',
                  ],
                  answer: 0,
                  explanation: 'Visual fidelity asks if the future looks plausible, not whether it leads to success — Fast-WAM and GigaWorld-Policy drop the rendered forecast and keep control, showing realism and action utility can diverge.',
                },
                {
                  prompt: 'What cost-vs-predictiveness ordering does the survey draw across the three evaluation tiers?',
                  options: [
                    'Visual fidelity is cheap but weakly tied to success; closed-loop simulation is more predictive but consumes task-time rollouts; real-robot arenas are valid but expensive to repeat',
                    'Real-robot arenas are cheapest; visual fidelity is most expensive',
                    'All three tiers cost roughly the same',
                    'Closed-loop simulation is the most expensive tier, exceeding real-robot arenas',
                  ],
                  answer: 0,
                  explanation: 'The tiers are ordered by cost and predictiveness: cheap-but-weak visual fidelity, moderately expensive but predictive closed-loop sim, and expensive-but-valid real-robot arenas.',
                },
                {
                  prompt: 'What two-stage protocol is the field converging on, and what open question remains within it?',
                  options: [
                    'Cheap visual/representation screens first, then selective closed-loop tests under explicit compute/memory/latency budgets — with the conversion factor between the cheap screen and expensive test the central open question',
                    'Simulation-only testing followed by mandatory real-robot deployment, with cost the only open question',
                    'A single visual-fidelity benchmark run twice for reproducibility',
                    'Closed-loop testing first, then visual-fidelity checks only on failure',
                  ],
                  answer: 0,
                  explanation: 'The field uses cheap screening before selective, budget-constrained closed-loop testing — and the unresolved "conversion factor" between what a cheap screen predicts and what the expensive test confirms is the central open question.',
                },
              ],
            },
          ],
        },
        {
          id: 'wam-challenges',
          title: 'Open Challenges & the Thesis',
          minutes: 14,
          xp: 90,
          steps: [
            { kind: 'read', title: 'Where the four axes point next', markdown: challengesMd },
            {
              kind: 'quiz',
              title: 'The seven coupled challenges',
              questions: [
                {
                  prompt: 'The survey closes Section 7 with a warning about how the seven challenges relate. What is it?',
                  options: [
                    'Progress on one challenge changes the practical trade-offs of the others, so a WAM must be advanced as one coupled design space',
                    'Each challenge can be solved independently because they map to separate axes',
                    'Only the fidelity-latency challenge matters; the others are downstream of it',
                    'The challenges should be tackled in numerical order',
                  ],
                  answer: 0,
                  explanation: 'The seven challenges are entangled: solving one shifts the trade-offs available to the others, so the field must treat the WAM stack as one coupled design space.',
                },
                {
                  prompt: '"Dream more or act more?" is framed as a knob. What does the survey say the open problem actually is?',
                  options: [
                    'To make every model as small as possible regardless of task',
                    'To expose a controllable fidelity-latency curve so a WAM can choose how much future information the action actually needs',
                    'To replace all imagination-heavy methods with action-only models',
                    'To fix a single latency budget all WAMs should target',
                  ],
                  answer: 1,
                  explanation: '"The open problem is not simply to make every model smaller. It is to expose a controllable fidelity-latency curve" — a runtime-tunable choice, not a once-at-design-time decision.',
                },
                {
                  prompt: 'The data challenge names the "sharpest bottleneck" stage. Which is it, and why does action-free data not eliminate it?',
                  options: [
                    'Pretraining, because mismatched egocentric video always hurts performance',
                    'Alignment, because scene diversity can never substitute for volume',
                    'Final action, because every abstract action still needs a decoder, an inverse-dynamics model, or a robot-specific calibration step',
                    'Final action, because action-free recipes require even more labeled control data',
                  ],
                  answer: 2,
                  explanation: 'The final action stage is the sharpest bottleneck. Action-free recipes (LAPA, DUST, ALAM, LDA-1B) reduce labeled-control needs but never remove them — abstract actions still need a decoder or calibration to become real control.',
                },
                {
                  prompt: 'For the persistence/memory challenge, what is the real demand on memory cost, distinct from simply lengthening the horizon?',
                  options: [
                    'Memory cost should grow with scene complexity rather than with episode length',
                    'Memory cost should shrink as episode length increases',
                    'Memory cost should be fixed regardless of scene complexity or episode length',
                    'Memory cost should scale only with the number of objects in contact',
                  ],
                  answer: 0,
                  explanation: 'Memory cost "should grow with scene complexity rather than with episode length." Extending the context window as episodes get longer is solving the wrong scaling problem.',
                },
                {
                  prompt: 'The generalization challenge insists scale alone cannot make a WAM generalizable. What must happen first?',
                  options: [
                    'The model architecture must be frozen first',
                    'The target shift has to be named first, because appearance, dynamics, morphology, action space, camera, and contact stress different parts of the model',
                    'The action space must be discretized first',
                    'The dataset must be deduplicated first',
                  ],
                  answer: 1,
                  explanation: '"The target shift has to be named first." Future prediction helps only when the predicted substrate matches the specific shift the action path must absorb — design for a declared shift, then test across it.',
                },
                {
                  prompt: 'The "when is a future physical?" section gives a concrete example of a future that "looks plausible while failing the embodiment." What is it?',
                  options: [
                    'A point-cloud substrate that omits friction, overestimating contact duration',
                    'A flow-based world model conditioned on one frame, which can\'t encode object velocity, so push tasks fail when the object keeps moving after contact ends',
                    'A tactile force proxy that is overcalibrated, predicting contact too early',
                    'An executability reward that scores contact directly but ignores joint limits',
                  ],
                  answer: 1,
                  explanation: 'A flow-based world model conditioned on a single frame can\'t encode object velocity, so it can\'t predict a pushed object continuing after contact ends — the video looks plausible but the physics fail.',
                },
              ],
            },
            {
              kind: 'scenario',
              title: 'Report a WAM honestly',
              scenario: {
                intro: 'You are reviewing two WAM submissions for a robotics venue. Both report high average task-success numbers on the same benchmark. You apply the survey\'s "What should evaluation report?" lens.',
                stages: [
                  {
                    situation: 'Submission A reports a single averaged success rate across all task phases. Submission B reports success broken out by phase and notes its schedule is good at transit but weaker at precise interaction.',
                    question: 'What does the survey say about relying on Submission A\'s single averaged number?',
                    options: [
                      { label: 'A single success number can hide opposite regimes — averaging the phases removes exactly the failure mode (e.g. precise interaction) the evaluation should expose', quality: 'best', feedback: 'Right — the survey uses HarmoWAM to make this point: a schedule useful for transit can fail at precise interaction, and averaging erases that. Submission B\'s phase breakdown is the more honest report.' },
                      { label: 'The single number is fine because higher average success is always better', quality: 'bad', feedback: 'Averaging can mask a contact-sensitive failure entirely. Two systems with the same mean can behave oppositely across phases — the average hides the regime that matters most.' },
                      { label: 'Neither report is useful without FVD scores', quality: 'bad', feedback: 'Visual-fidelity metrics reward realism, not action utility, and are only weakly tied to success. The issue with A isn\'t a missing fidelity metric — it\'s that the average hides a failure regime.' },
                    ],
                  },
                  {
                    situation: 'Both submissions report success but neither reports latency, sustained horizon, or peak memory; one mentions latency on different hardware in a separate table.',
                    question: 'What "missing protocol" does the survey argue evaluation should adopt?',
                    options: [
                      { label: 'Accuracy-at-budget — put success, latency, sustained horizon, peak memory, and contact-sensitive failure tags on the same axis', quality: 'best', feedback: 'Exactly. A WAM that succeeds slowly is not equivalent to one that acts at the control rate, and one that succeeds over a short horizon is not equivalent to one that holds state over a long task. Success must be reported together with its compute, memory, and latency budget.' },
                      { label: 'Just report the single best success number to keep comparisons simple', quality: 'bad', feedback: 'That is precisely what the survey warns against — success without budget is not comparable across methods, and decoupling latency from accuracy on different hardware makes it worse.' },
                      { label: 'Report only world-model quality scores, since they proxy policy utility', quality: 'bad', feedback: 'World-model quality is not yet a reliable proxy for policy utility — MotuBrain finds only weak correlation. Accuracy-at-budget on the real task is what is needed.' },
                    ],
                  },
                ],
                debrief: 'A WAM is a contract between prediction and control, and evaluating that contract means reporting capability together with compute, memory, and latency — accuracy-at-budget — and refusing to let an average hide a contact-sensitive failure. That discipline is what turns "Dream Less, Act More" from a slogan into a measurable claim.',
              },
            },
          ],
        },
      ],
    },
  ],
}
