import type { Subject } from '../types'
import countingMd from './md/id-counting-parameters.md?raw'
import solutionSetsMd from './md/id-solution-sets-and-id.md?raw'
import subspaceMd from './md/id-random-subspace-training.md?raw'
import bridgeMd from './md/id-from-id-to-lora.md?raw'
import loraMlpMd from './md/id-lora-on-mlp.md?raw'

export const intrinsicDimension: Subject = {
  id: 'intrinsic-dimension',
  title: 'Intrinsic Dimension → LoRA',
  tagline:
    'A beginner on-ramp (Li et al. 2018, arXiv:1804.08838, taught in Sahaj’s numerically-grounded voice): count an MLP’s parameters, discover how few of them matter (intrinsic dimension), measure it with random subspace training, then watch the same idea become LoRA on a real MLP — the prerequisite to the LoRA paper subject.',
  icon: '🌀',
  accent: '#a78bfa',
  modules: [
    {
      id: 'id-m1',
      title: 'Measuring the Intrinsic Dimension of Objective Landscapes',
      description:
        'Li et al., 2018 (arXiv:1804.08838) — the paper this whole on-ramp is built on. Start where you are (a perceptron) and count any MLP’s parameters by hand; meet the surprise that a 199,210-parameter net needs only ~750 directions to learn (its d₉₀); then see how random subspace training (θ = θ₀ + P·θ_d) actually measures it. The objective landscape, the valley, and the n = s + ID decomposition.',
      lessons: [
        {
          id: 'id-foundations',
          title: 'From a perceptron to intrinsic dimension',
          minutes: 16,
          xp: 80,
          steps: [
            { kind: 'read', title: 'From a perceptron to 199,210 parameters', markdown: countingMd },
            { kind: 'read', title: 'Solution sets, the valley, and d₉₀', markdown: solutionSetsMd },
            {
              kind: 'quiz',
              title: 'Counting and the meaning of ID',
              questions: [
                {
                  prompt:
                    'A fully connected layer maps `in` neurons to `out` neurons. How many learnable parameters does it hold?',
                  options: [
                    'in·out + out  (a weight per connection, plus one bias per output neuron)',
                    'in·out  (just the weight matrix — biases are free)',
                    'in + out  (one weight and one bias per neuron)',
                    'in·out·2  (a weight and a bias for every connection)',
                  ],
                  answer: 0,
                  explanation:
                    'The weight matrix is in×out = in·out numbers, and there is exactly one bias per output neuron, adding out. So in·out + out. This is the rule that gives the 2–2–2 MLP its 12 params and MNIST its 199,210.',
                },
                {
                  prompt:
                    'Using in·out + out per layer, what is the total parameter count n for the 784–200–200–10 MNIST classifier?',
                  options: [
                    '199,210',
                    '199,000',
                    '157,000',
                    '1,000,000',
                  ],
                  answer: 0,
                  explanation:
                    '(784·200+200) + (200·200+200) + (200·10+10) = 157,000 + 40,200 + 2,010 = 199,210. That n is the dimension of the objective landscape the optimizer walks on.',
                },
                {
                  prompt:
                    'In the 3-parameter valley example, cost stays at zero as you slide along the trough but rises off it. Given n = s + ID, what are s and ID?',
                  options: [
                    's = 1 (the free trough direction), ID = 2 (the two directions that constrain the solution)',
                    's = 2, ID = 1 — two directions matter and one is free',
                    's = 0, ID = 3 — every direction matters',
                    's = 3, ID = 0 — the whole space is a solution',
                  ],
                  answer: 0,
                  explanation:
                    'One direction (the trough) leaves cost unchanged, so the solution set has dimension s = 1. The other two genuinely constrain the optimum, so ID = 2. The big lesson: with MNIST, s ≈ 198,460 directions are free — huge redundancy.',
                },
              ],
            },
            {
              kind: 'code',
              title: 'Count any MLP by hand',
              challenge: {
                prompt:
                  'Given an MLP described by its layer sizes, e.g. `[784, 200, 200, 10]`, count its total parameters.\n\nFor each consecutive pair `in → out`, a fully connected layer contributes **`in·out` weights plus `out` biases**. Sum over all layers.\n\nThe biases are the easy thing to forget — and forgetting them is exactly why a naive count comes up short.',
                starterCode:
                  'function countParams(layers) {\n  let total = 0\n  for (let i = 0; i < layers.length - 1; i++) {\n    const inDim = layers[i]\n    const outDim = layers[i + 1]\n    // TODO: weights are inDim*outDim, and don’t forget one bias per output\n    total += inDim * outDim\n  }\n  return total\n}',
                solution:
                  'function countParams(layers) {\n  let total = 0\n  for (let i = 0; i < layers.length - 1; i++) {\n    const inDim = layers[i]\n    const outDim = layers[i + 1]\n    total += inDim * outDim + outDim\n  }\n  return total\n}',
                tests:
                  "test('2–2–2 MLP has 12 parameters', () => {\n  assertEqual(countParams([2, 2, 2]), 12)\n})\n\ntest('MNIST 784–200–200–10 has 199,210 parameters', () => {\n  assertEqual(countParams([784, 200, 200, 10]), 199210)\n})\n\ntest('the 20–2000–200–2 LoRA-demo MLP has 442,602 parameters', () => {\n  assertEqual(countParams([20, 2000, 200, 2]), 442602)\n})",
              },
            },
          ],
        },
        {
          id: 'id-random-subspace',
          title: 'Training inside a random slice',
          minutes: 14,
          xp: 75,
          steps: [
            { kind: 'read', title: 'Random subspace training', markdown: subspaceMd },
            {
              kind: 'quiz',
              title: 'How the measurement works',
              questions: [
                {
                  prompt:
                    'In θ = θ₀ + P·θ_d, which quantities receive gradient updates during training?',
                  options: [
                    'Only θ_d — the d numbers in the subspace. θ₀ (the full weights) and P (the projection) are both frozen',
                    'θ₀ and θ_d, but not P',
                    'All three — θ₀, P, and θ_d',
                    'Only P — the projection is what is learned',
                  ],
                  answer: 0,
                  explanation:
                    'That is the whole point: θ₀ is the frozen base and P is a fixed random projection. Gradients flow back through P into θ_d only. You are searching a random d-dimensional slice of the full landscape.',
                },
                {
                  prompt:
                    'How is the intrinsic dimension d₉₀ found in this method?',
                  options: [
                    'Start with a small d, train only θ_d, measure accuracy, and increase d until performance first clears the 90% threshold',
                    'Run SVD on θ₀ and read off the number of nonzero singular values',
                    'Count the parameters that change the most during ordinary full training',
                    'Set d = D and prune until accuracy drops below 90%',
                  ],
                  answer: 0,
                  explanation:
                    'd₉₀ is found by sweeping d upward. The smallest subspace dimension that reaches 90% of full performance is the network’s intrinsic dimension at that bar — ≈ 750 for the MNIST FC net.',
                },
                {
                  prompt:
                    'Random subspace training is a measuring instrument, not a deployment method. What makes it impractical to use directly for fine-tuning?',
                  options: [
                    'The projection P has shape D×d (≈ 199,210 × 750 ≈ 150M entries) — far bigger than the network it adapts, so a dense random P is wasteful',
                    'It can never reach more than 90% accuracy on any task',
                    'It requires retraining θ₀ from scratch for every new task',
                    'Gradients cannot flow through a random matrix, so it does not actually train',
                  ],
                  answer: 0,
                  explanation:
                    'A dense D×d projection is enormous (~150M entries here). That cost is why the idea is a probe, not a recipe — and why LoRA replaces the dense random P with a small, learned low-rank factor B·A.',
                },
              ],
            },
            {
              kind: 'code',
              title: 'Size the subspace and its projection',
              challenge: {
                prompt:
                  'Make the random-subspace bookkeeping concrete. Implement `randomSubspace(D, d)` returning an object:\n\n- `trainable` — the number of trainable knobs (the subspace dimension)\n- `projectionEntries` — the number of entries in the D×d projection matrix P\n- `compression` — how many times smaller the trainable set is than the full model, rounded (`D / d`)\n\nThe surprise the test makes vivid: P alone dwarfs the whole network.',
                starterCode:
                  'function randomSubspace(D, d) {\n  return {\n    trainable: d,\n    // TODO: P is D×d, so it has D*d entries\n    projectionEntries: D + d,\n    // TODO: compression is D/d, rounded\n    compression: D / d,\n  }\n}',
                solution:
                  'function randomSubspace(D, d) {\n  return {\n    trainable: d,\n    projectionEntries: D * d,\n    compression: Math.round(D / d),\n  }\n}',
                tests:
                  "test('MNIST FC at d=750: 750 trainable, 266× compression', () => {\n  const r = randomSubspace(199210, 750)\n  assertEqual(r.trainable, 750)\n  assertEqual(r.compression, 266)\n})\n\ntest('the projection P really is D×d entries', () => {\n  assertEqual(randomSubspace(1000, 10).projectionEntries, 10000)\n  assertEqual(randomSubspace(199210, 750).projectionEntries, 149407500)\n})\n\ntest('a smaller subspace means more compression', () => {\n  assertEqual(randomSubspace(199210, 200).compression, 996)\n})",
              },
            },
          ],
        },
      ],
    },
    {
      id: 'id-m2',
      title: 'From intrinsic dimension to LoRA',
      description:
        'Keep the "train in a small subspace" idea but drop the giant random projection. LoRA hypothesizes the weight update ΔW is itself low-rank and learns it as B·A. Low-rank approximation, the parameter savings, and when to reach for it.',
      lessons: [
        {
          id: 'id-low-rank-bridge',
          title: 'Low-rank updates: the LoRA idea',
          minutes: 15,
          xp: 80,
          steps: [
            { kind: 'read', title: 'From intrinsic dimension to low-rank updates', markdown: bridgeMd },
            {
              kind: 'quiz',
              title: 'The low-rank reparametrization',
              questions: [
                {
                  prompt:
                    'What does LoRA hypothesize, building on the intrinsic-dimension work?',
                  options: [
                    'The weight *update* ΔW has a low intrinsic rank, so it can be captured by a thin product B·A instead of a full matrix',
                    'The pre-trained weights W₀ are exactly rank 1',
                    'Adaptation needs more parameters than pre-training, so ΔW must be high-rank',
                    'Gradients are low-rank only for vision models, not language models',
                  ],
                  answer: 0,
                  explanation:
                    'Intrinsic dimension says the learned solution lives in a tiny subspace; LoRA sharpens this to the update itself — ΔW is low intrinsic rank, so W = W₀ + B·A with a small r.',
                },
                {
                  prompt:
                    'A 2000 × 200 weight update is reparametrized at rank r = 3 as B (2000×3) and A (3×200). How many trainable numbers is that, versus the full update?',
                  options: [
                    '6,600 trainable (6,000 + 600) versus 400,000 for the full 2000×200 update',
                    '400,000 trainable — the same as the full update',
                    '2,203 trainable',
                    '1,200,000 trainable',
                  ],
                  answer: 0,
                  explanation:
                    'p·r + r·q = 2000·3 + 3·200 = 6,000 + 600 = 6,600, against p·q = 400,000. The thin waist r is what shrinks the count.',
                },
                {
                  prompt:
                    'How does LoRA obtain the factors B and A — and why does this matter?',
                  options: [
                    'It *learns* B and A by gradient descent for the specific task; it does not SVD-decompose W₀ up front',
                    'It computes the SVD of W₀ once and freezes the top-r singular vectors',
                    'It copies B and A from a lookup table of pre-computed adapters',
                    'It sets B and A by hand to match the task',
                  ],
                  answer: 0,
                  explanation:
                    'SVD would compress the base weights W₀, not the task-specific update. LoRA instead learns B and A directly for the downstream task — trading a little capacity for large efficiency.',
                },
              ],
            },
            {
              kind: 'code',
              title: 'Low-rank parameter savings',
              challenge: {
                prompt:
                  'Implement `lowRankParams(p, q, r)` for a LoRA factorization of a `p × q` weight update at rank `r`.\n\nB is `p × r` and A is `r × q`, so the trainable count is **`p·r + r·q`** — not `p·q`. The starter returns the *full* count; fix it to the low-rank one.',
                starterCode:
                  'function lowRankParams(p, q, r) {\n  // TODO: B is p×r and A is r×q, so this should be p*r + r*q\n  return p * q\n}',
                solution:
                  'function lowRankParams(p, q, r) {\n  return p * r + r * q\n}',
                tests:
                  "test('2000×200 at r=3 → 6,600', () => {\n  assertEqual(lowRankParams(2000, 200, 3), 6600)\n})\n\ntest('a 4096×4096 attention matrix at r=8 → 65,536', () => {\n  assertEqual(lowRankParams(4096, 4096, 8), 65536)\n})\n\ntest('doubling the rank doubles the parameter count', () => {\n  assertEqual(lowRankParams(2000, 200, 6), 2 * lowRankParams(2000, 200, 3))\n})",
              },
            },
            {
              kind: 'scenario',
              title: 'When to reach for LoRA',
              scenario: {
                intro:
                  'You manage fine-tuning for a team serving an 8B-parameter base model. Full fine-tuning means one whole checkpoint per task and roughly 4× the model size in training memory. Use what the read established about low-rank updates to make two calls.',
                stages: [
                  {
                    situation:
                      'Product wants 50 task-specific variants of the 8B model, but your disk and serving RAM are tight. A teammate proposes full fine-tuning each variant "because it’s simplest."',
                    question: 'What’s the strongest reason to use LoRA here instead?',
                    options: [
                      {
                        label:
                          'Each task becomes a tiny B·A adapter (megabytes, e.g. a 51 KB adapter vs a much larger base) layered on one shared frozen base — so 50 tasks cost ~one base plus 50 small adapters, not 50 full checkpoints',
                        quality: 'best',
                        feedback:
                          'Exactly the motivation: full fine-tuning stores |Φ| per task and needs ~4× memory to train. LoRA freezes W₀ once and ships small learned adapters per task — the storage/serving win that makes many-variant deployment feasible.',
                      },
                      {
                        label:
                          'Full fine-tuning is fine — 50 checkpoints of an 8B model is a manageable amount of storage',
                        quality: 'bad',
                        feedback:
                          'That’s ~50 separate multi-gigabyte checkpoints plus the ~4× training memory each time. This is precisely the cost LoRA exists to avoid.',
                      },
                      {
                        label:
                          'Use LoRA only because it always reaches higher accuracy than full fine-tuning',
                        quality: 'ok',
                        feedback:
                          'The real win here is efficiency, not a guaranteed accuracy gain. LoRA aims to *match* full fine-tuning closely while training a tiny fraction of parameters — the deployment savings are the headline.',
                      },
                    ],
                  },
                  {
                    situation:
                      'A teammate says: "If ΔW is low rank, let’s just run SVD on the pre-trained weights W₀ to get the low-rank factors and skip training."',
                    question: 'How should you respond?',
                    options: [
                      {
                        label:
                          'SVD of W₀ compresses the *base weights*, not the *task-specific update*. LoRA instead learns B and A by gradient descent for this task — that’s where the adaptation lives',
                        quality: 'best',
                        feedback:
                          'Right. The low-rank object is ΔW, the update for the new task — and it isn’t known ahead of time. LoRA learns B·A directly; an SVD of W₀ tells you nothing about the task you haven’t trained on yet.',
                      },
                      {
                        label:
                          'Good idea — SVD of W₀ gives exactly the B and A LoRA would have learned, for free',
                        quality: 'bad',
                        feedback:
                          'No: SVD factorizes the existing weights, not the future task update. You’d be compressing W₀, which is a different goal entirely from adapting to a new task.',
                      },
                      {
                        label:
                          'Run SVD on W₀ to initialize B and A, then skip all training to save compute',
                        quality: 'bad',
                        feedback:
                          'Even as an initialization this misses the point: without training on the task, the adapter encodes no task information. The whole value of LoRA is learning ΔW for the downstream objective.',
                      },
                    ],
                  },
                ],
                debrief:
                  'Two ideas to keep: (1) LoRA’s payoff is mainly *deployment* — one frozen base, tiny learned adapters per task. (2) The low-rank object is the *update* ΔW, learned by gradient descent — not a decomposition of the frozen weights. Next you’ll watch this run, weight by weight, on a real MLP.',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'id-m3',
      title: 'LoRA on an MLP, by the numbers',
      description:
        'The whole story on one concrete network: a 442,602-parameter MLP. Which layers get adapted, the zero-init trick (B = 0 so B·A starts as a no-op), the exact trainable-parameter count, the scaled forward pass, and merging back to zero added latency.',
      lessons: [
        {
          id: 'id-lora-mlp',
          title: 'LoRA on a real MLP',
          minutes: 14,
          xp: 80,
          steps: [
            { kind: 'read', title: 'LoRA on an MLP, by the numbers', markdown: loraMlpMd },
            {
              kind: 'quiz',
              title: 'Reading the implementation',
              questions: [
                {
                  prompt:
                    'LoRA initializes A with random Gaussian values but B with zeros. Why zeros for B?',
                  options: [
                    'So that B·A = 0 at the start — the update branch is a no-op, and only the frozen base model is in play for the first steps (no inductive bias from the adapter)',
                    'So the adapter immediately dominates the base model’s output',
                    'Because zeros make the matrix multiply faster',
                    'So that A and B are symmetric and the update is guaranteed full-rank',
                  ],
                  answer: 0,
                  explanation:
                    'B = 0 makes B·A = 0 initially, so training begins from exactly the pre-trained behavior and the adapter only adds signal as it learns — no random perturbation injected on step 0.',
                },
                {
                  prompt:
                    'For the seq.0 layer (20 → 2000) at rank r = 3, A is 3×20 and B is 2000×3. How many trainable LoRA parameters is that?',
                  options: [
                    '6,060  (60 + 6,000)',
                    '40,000  (the full 20×2000 weight)',
                    '6,600',
                    '2,000',
                  ],
                  answer: 0,
                  explanation:
                    'A = 3·20 = 60 and B = 2000·3 = 6,000, totaling 6,060. Doing the same for seq.2 gives 6,600, so the whole adapter is 12,660 — about a 97% cut from 442,602.',
                },
                {
                  prompt:
                    'After training, LoRA merges the update as W = W₀ + (α/r)·B·A. Why does this add zero inference latency?',
                  options: [
                    'The update folds back into the original weight matrix, so the model is the same shape with no extra layers to run — inference is identical to the un-adapted model',
                    'Because α/r is always less than 1, which speeds up the matmul',
                    'Because B and A are deleted and the model becomes smaller than the original',
                    'Because merging happens on the GPU, which has no latency',
                  ],
                  answer: 0,
                  explanation:
                    'Merging produces a single weight matrix of the original 442,602-parameter shape. There’s no separate adapter branch at inference, so latency matches the base model — unlike adapter layers that add sequential depth.',
                },
              ],
            },
            {
              kind: 'code',
              title: 'Count the MLP’s LoRA parameters',
              challenge: {
                prompt:
                  'Implement `loraLayerParams(inDim, outDim, r)` for one adapted linear layer.\n\nLoRA adds A (`r × inDim`) and B (`outDim × r`), so the count is **`r·inDim + outDim·r`**. Use it to reproduce the demo: seq.0 (20→2000) and seq.2 (2000→200) at r = 3 should total 12,660.',
                starterCode:
                  'function loraLayerParams(inDim, outDim, r) {\n  // TODO: A is r×inDim and B is outDim×r → r*inDim + outDim*r\n  return inDim * outDim\n}',
                solution:
                  'function loraLayerParams(inDim, outDim, r) {\n  return r * inDim + outDim * r\n}',
                tests:
                  "test('seq.0 (20→2000) at r=3 → 6,060', () => {\n  assertEqual(loraLayerParams(20, 2000, 3), 6060)\n})\n\ntest('seq.2 (2000→200) at r=3 → 6,600', () => {\n  assertEqual(loraLayerParams(2000, 200, 3), 6600)\n})\n\ntest('the two adapted layers total 12,660 trainable params', () => {\n  const total = loraLayerParams(20, 2000, 3) + loraLayerParams(2000, 200, 3)\n  assertEqual(total, 12660)\n})",
              },
            },
          ],
        },
      ],
    },
  ],
}
