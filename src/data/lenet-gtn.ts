import type { Subject } from '../types'
import learningFromDataMd from './md/lg-learning-from-data.md?raw'
import gradientDescentMd from './md/lg-gradient-descent.md?raw'
import convPrinciplesMd from './md/lg-conv-principles.md?raw'
import lenet5ArchitectureMd from './md/lg-lenet5-architecture.md?raw'
import benchmarkResultsMd from './md/lg-benchmark-results.md?raw'
import resultsTradeoffsMd from './md/lg-results-tradeoffs.md?raw'
import multiModuleSystemsMd from './md/lg-multi-module-systems.md?raw'
import gtnConceptMd from './md/lg-gtn-concept.md?raw'
import heuristicOversegmentationMd from './md/lg-heuristic-oversegmentation.md?raw'
import discriminativeTrainingMd from './md/lg-discriminative-training.md?raw'
import sdnnMd from './md/lg-sdnn.md?raw'
import generalizedTransductionMd from './md/lg-generalized-transduction.md?raw'
import gtnVsHmmMd from './md/lg-gtn-vs-hmm.md?raw'
import onlineHandwritingMd from './md/lg-online-handwriting.md?raw'
import checkReaderMd from './md/lg-check-reader.md?raw'
import paperConclusionsMd from './md/lg-paper-conclusions.md?raw'

export const lenetGtn: Subject = {
  id: 'lenet-gtn',
  title: 'LeNet-5 & Graph Transformer Networks',
  tagline:
    'LeCun, Bottou, Bengio & Haffner, 1998 — CNNs that learn features from pixels, and Graph Transformer Networks that train whole document-recognition pipelines end to end.',
  icon: '🧾',
  accent: '#65a30d',
  modules: [
    {
      id: 'lg-m1',
      title: 'Why Learn From Data',
      description: 'The motivation for gradient-based learning, and the formalism behind it.',
      lessons: [
        {
          id: 'lg-learning-from-data',
          title: 'The hand-crafted feature bottleneck',
          minutes: 10,
          xp: 50,
          steps: [
            { kind: 'read', title: 'Stop hand-designing features, learn them', markdown: learningFromDataMd },
            {
              kind: 'quiz',
              title: 'Check: the traditional pipeline',
              questions: [
                {
                  prompt: 'In the traditional two-module pattern (Fig. 1), which part is trainable?',
                  options: [
                    'Both modules equally',
                    'Only the feature extractor',
                    'Only the classifier',
                    'Neither — both are fixed',
                  ],
                  answer: 2,
                  explanation:
                    'The feature extractor is fixed by hand and "contains most of the prior knowledge." Only the classifier module is trainable — which is exactly the bottleneck the paper attacks: recognition accuracy is capped by how good a designer\'s hand-built features are.',
                },
                {
                  prompt:
                    'According to the paper, what three factors changed by the late 1990s to make learning directly from pixels feasible?',
                  options: [
                    'Cheaper/faster machines, large labeled datasets, and learning techniques for high-dimensional input',
                    'Better cameras, more researchers, and faster internet connections',
                    'Larger feature vectors, manual labeling tools, and cheaper memory',
                    'None — hand-crafted features remained strictly necessary',
                  ],
                  answer: 0,
                  explanation:
                    'The paper names exactly these three: low-cost fast machines (favoring brute-force numerical methods over algorithmic refinements), large databases for tasks like handwriting recognition, and learning techniques that handle high-dimensional inputs directly — together they removed the old constraint that forced hand-crafted, low-dimensional features.',
                },
              ],
            },
          ],
        },
        {
          id: 'lg-gradient-descent',
          title: 'Gradient-based learning, formally',
          minutes: 12,
          xp: 60,
          steps: [
            { kind: 'read', title: 'A function with knobs, and how to turn them', markdown: gradientDescentMd },
            {
              kind: 'quiz',
              title: 'Check: capacity, generalization, backprop',
              questions: [
                {
                  prompt:
                    'E_test − E_train ≈ k·(h/P)^α. What happens to this gap if you increase model capacity h without adding more training data P?',
                  options: [
                    'The gap to test error grows',
                    'Training error always increases',
                    'Test error becomes independent of capacity',
                    'The model becomes more interpretable',
                  ],
                  answer: 0,
                  explanation:
                    'Capacity h sits in the numerator of the gap term, so more capacity without more data widens the train/test gap — the classic overfitting trade-off the paper formalizes as Structural Risk Minimization.',
                },
                {
                  prompt:
                    'Why does stochastic gradient descent (updating from one example at a time) often beat full-batch descent in practice on large, redundant datasets like handwriting or speech?',
                  options: [
                    'It always converges to a mathematically better minimum',
                    'It fluctuates around the average trajectory but converges faster because the data is redundant',
                    'It avoids backpropagation entirely',
                    'It requires no learning rate to be chosen',
                  ],
                  answer: 1,
                  explanation:
                    'The paper notes the stochastic variant "fluctuates around an average trajectory" but converges faster than full-batch descent specifically because large, redundant datasets let single-example gradients already point in roughly the right direction most of the time.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'lg-m2',
      title: 'Convolutional Neural Networks: LeNet-5',
      description: 'The architectural ideas that bake 2D shape invariance into a network, and LeNet-5 itself.',
      lessons: [
        {
          id: 'lg-conv-principles',
          title: 'Local fields, shared weights, subsampling',
          minutes: 12,
          xp: 60,
          steps: [
            { kind: 'read', title: 'Why a fully-connected net loses to a convolutional one', markdown: convPrinciplesMd },
            {
              kind: 'quiz',
              title: 'Check: the three ideas',
              questions: [
                {
                  prompt: 'What does weight sharing across a feature map guarantee?',
                  options: [
                    'Every unit learns independent features',
                    'If the input is shifted, the feature map output shifts by the same amount but is otherwise unchanged',
                    'The network becomes fully connected',
                    'Subsampling becomes unnecessary',
                  ],
                  answer: 1,
                  explanation:
                    'Because every unit in a feature map reuses the identical weights (just centered at a different location), shifting the input shifts the feature map output by the same amount — that single property is the basis of the network\'s shift robustness, and it also slashes the parameter count.',
                },
                {
                  prompt: 'Why does sub-sampling help after a convolution layer, per the paper?',
                  options: [
                    'It increases resolution',
                    'Once a feature is detected, its exact location matters less than its position relative to other features, so reducing resolution there reduces sensitivity to small shifts/distortions',
                    'It removes the need for shared weights',
                    'It exists only to reduce file size on disk',
                  ],
                  answer: 1,
                  explanation:
                    'A subsampling layer trades positional precision for robustness: once a feature is found, exactly where within a small neighborhood matters less than its relation to other features, so blurring and shrinking the map reduces sensitivity to exactly the small shifts that would otherwise confuse the network.',
                },
              ],
            },
          ],
        },
        {
          id: 'lg-lenet5-architecture',
          title: 'LeNet-5, layer by layer',
          minutes: 22,
          xp: 120,
          steps: [
            { kind: 'read', title: 'Seven layers, one digit out', markdown: lenet5ArchitectureMd },
            {
              kind: 'code',
              title: 'Compute layer output sizes',
              challenge: {
                prompt: `## Verify LeNet-5's own layer sizes

LeNet-5's architecture (Section II, Fig. 2) is fully determined once you pick kernel sizes and strides: every layer's spatial output size follows one formula.

Implement \`convOutputSize(inputSize, kernelSize, stride = 1)\` that returns the output spatial size of a convolution **or** a subsampling layer (subsampling is just a "kernel" equal to its window size, with stride equal to the window size):

\`\`\`
output = floor((inputSize - kernelSize) / stride) + 1
\`\`\`

Use it to reproduce LeNet-5's own numbers from Fig. 2:
- C1: 32×32 input, 5×5 kernel, stride 1 → 28
- S2: 28×28 input, 2×2 window, stride 2 → 14
- C3: 14×14 input, 5×5 kernel, stride 1 → 10
- C5: 5×5 input, 5×5 kernel, stride 1 → 1 (the kernel covers the whole input — this is why C5 is "convolutional" only in name at this input size, per the read step)`,
                starterCode: `function convOutputSize(inputSize, kernelSize, stride = 1) {
  // TODO: return floor((inputSize - kernelSize) / stride) + 1
}`,
                solution: `function convOutputSize(inputSize, kernelSize, stride = 1) {
  return Math.floor((inputSize - kernelSize) / stride) + 1;
}`,
                tests: `test('C1: 32x32 input, 5x5 kernel, stride 1 -> 28', () => {
  assertEqual(convOutputSize(32, 5, 1), 28);
});
test('S2: 28x28 input, 2x2 window, stride 2 -> 14', () => {
  assertEqual(convOutputSize(28, 2, 2), 14);
});
test('C3: 14x14 input, 5x5 kernel, stride 1 -> 10', () => {
  assertEqual(convOutputSize(14, 5, 1), 10);
});
test('S4: 10x10 input, 2x2 window, stride 2 -> 5', () => {
  assertEqual(convOutputSize(10, 2, 2), 5);
});
test('C5: 5x5 input, 5x5 kernel, stride 1 -> 1', () => {
  assertEqual(convOutputSize(5, 5, 1), 1);
});`,
              },
            },
          ],
        },
      ],
    },
    {
      id: 'lg-m3',
      title: 'Comparative Results on Digit Recognition',
      description: 'How LeNet-5 stacks up against K-NN, RBF nets, SVMs, and boosting on MNIST.',
      lessons: [
        {
          id: 'lg-benchmark-results',
          title: 'The MNIST leaderboard',
          minutes: 12,
          xp: 60,
          steps: [
            { kind: 'read', title: 'The benchmark: MNIST', markdown: benchmarkResultsMd },
            {
              kind: 'quiz',
              title: 'Check: a fair benchmark, a clear winner',
              questions: [
                {
                  prompt:
                    "Why did LeCun et al. split MNIST's train/test sets by writer identity rather than randomly by example?",
                  options: [
                    'To make the test set smaller',
                    "To prevent a classifier from learning a specific writer's handwriting instead of digits in general",
                    'Because writers wrote different digits',
                    'It was required by the NIST database format',
                  ],
                  answer: 1,
                  explanation:
                    'If the same writer appears in both training and test, a classifier can cheat by memorizing that writer\'s strokes. Splitting by writer identity (first 250 writers train, remaining 250 test) forces the result to reflect generalization to *new* handwriting, not new examples of familiar handwriting.',
                },
                {
                  prompt:
                    'LeNet-1 (about 2,600 parameters) beat a 1000-hidden-unit fully-connected MLP on MNIST. What does this say about parameter count versus architecture?',
                  options: [
                    'More parameters always wins',
                    "Matching the architecture's prior (local receptive fields, shared weights, subsampling) to the data's structure matters more than raw parameter count",
                    'MLPs cannot be trained with backpropagation',
                    'Convolutional networks always require fewer training examples than any other method',
                  ],
                  answer: 1,
                  explanation:
                    "Raw capacity isn't what wins: the MLP has to learn shift- and distortion-tolerance from data alone, while LeNet-1's convolutional structure builds that tolerance in — so a far smaller, better-matched architecture outperforms a far larger generic one.",
                },
              ],
            },
          ],
        },
        {
          id: 'lg-results-tradeoffs',
          title: 'Accuracy is never free',
          minutes: 15,
          xp: 80,
          steps: [
            { kind: 'read', title: '"3x more expensive" — except it isn\'t', markdown: resultsTradeoffsMd },
            {
              kind: 'scenario',
              title: 'Pick a classifier for a check-amount reader',
              scenario: {
                intro:
                  "You're deploying a digit recognizer onto a check-reading device with a tight per-check compute budget. The bank wants the best achievable accuracy without exploding average latency.",
                stages: [
                  {
                    situation:
                      'Four candidates from the paper\'s own comparison are on the table. Which is the best fit for "best accuracy, average compute kept low"?',
                    question: 'Which classifier should you ship?',
                    options: [
                      {
                        label:
                          'K-NN (Euclidean, deslanted) — 2.4% error, zero training time, but ~24MB of templates and per-query cost that scales with training set size',
                        quality: 'bad',
                        feedback:
                          'Cheap to "train," but memory-based methods scale recognition time and storage with the training set size — a real cost at production scale, and the accuracy is also the weakest of the four.',
                      },
                      {
                        label: 'Plain polynomial SVM — 1.4% error, but ~14 million multiply-adds per digit',
                        quality: 'ok',
                        feedback:
                          'Strong accuracy with zero hand-built image priors — genuinely impressive — but the compute cost per digit is steep compared to the CNN-based options, with no confidence-gating mechanism to bring the average down.',
                      },
                      {
                        label:
                          'Boosted LeNet-4 with a confidence-gated cascade — 0.7% error, and only ~1.75x the average compute of one LeNet-4 (not 3x), because low-confidence cases skip the extra nets',
                        quality: 'best',
                        feedback:
                          "Best raw accuracy in the paper's comparison, and the paper's own point about ensembles applies: worst-case cost (3 nets) and average cost (1.75x) are different numbers once you gate on confidence. This is the textbook case of buying most of an ensemble's accuracy gain for a fraction of its naive cost.",
                      },
                      {
                        label: '2-hidden-layer fully-connected MLP — 2.95% error, no convolutional structure',
                        quality: 'bad',
                        feedback:
                          "Worse accuracy than every CNN variant in the table, with no architectural prior for 2D shift/distortion invariance — it has to learn what the CNN variants get for free.",
                      },
                    ],
                  },
                ],
                debrief:
                  "The paper's own conclusion generalizes past digits: ensembles' worst-case and average-case costs differ once you gate on confidence, and accuracy-per-unit-of-compute — not accuracy alone — is usually the real constraint in a deployed system.",
              },
            },
          ],
        },
      ],
    },
    {
      id: 'lg-m4',
      title: 'Multi-Module Systems & Graph Transformer Networks',
      description: 'Generalizing backprop past fixed-size vectors — from heterogeneous modules to graphs.',
      lessons: [
        {
          id: 'lg-multi-module-systems',
          title: "Backprop doesn't care that it's a neural network",
          minutes: 12,
          xp: 60,
          steps: [
            { kind: 'read', title: 'Any arrangement of modules, as long as you have Jacobians', markdown: multiModuleSystemsMd },
            {
              kind: 'quiz',
              title: 'Check: fprop, bprop, and the multiplexer',
              questions: [
                {
                  prompt: 'What property must a module have for backpropagation to flow through it, per Section IV?',
                  options: [
                    'It must be a sigmoid neural-network layer',
                    'It must compute the product of its Jacobian by any vector',
                    'It must output probabilities',
                    'It must have no trainable parameters',
                  ],
                  answer: 1,
                  explanation:
                    'The paper\'s generalization is precise: "derivatives can be back-propagated through any arrangement of functional modules, as long as we can compute the product of the Jacobians of those modules by any vector." Nothing about being a neural-network layer is required.',
                },
                {
                  prompt:
                    'A multiplexer module switches between two inputs based on a discrete control signal. Why can a system containing it still be trained end-to-end with gradient descent?',
                  options: [
                    'Because multiplexers are secretly differentiable everywhere, including the switching input',
                    "Because it's differentiable with respect to the regular (non-switching) inputs, and the system stays differentiable overall as long as the switching input doesn't depend on the parameters",
                    'Because gradient descent does not require differentiability at all',
                    'Because the module has no effect on the loss',
                  ],
                  answer: 1,
                  explanation:
                    "The multiplexer isn't differentiable with respect to its switching input, but it is with respect to the regular inputs — and as long as the switching signal (e.g. an external input) doesn't itself depend on the trainable parameters, the whole system's gradient is still well-defined.",
                },
              ],
            },
          ],
        },
        {
          id: 'lg-gtn-concept',
          title: 'Graphs instead of vectors',
          minutes: 12,
          xp: 60,
          steps: [
            { kind: 'read', title: "What if a module's state can't fit in a fixed-size vector?", markdown: gtnConceptMd },
            {
              kind: 'quiz',
              title: 'Check: the GTN generalization',
              questions: [
                {
                  prompt: "What's the key difference between traditional layers and a Graph Transformer Network, per Fig. 15?",
                  options: [
                    'Traditional layers pass fixed-size vectors between layers; GTN modules pass graphs whose arcs carry numerical information, using the same backprop discipline',
                    'GTNs do not use backpropagation at all',
                    'GTNs cannot have trainable parameters',
                    'They are identical — only the name differs',
                  ],
                  answer: 0,
                  explanation:
                    "Fig. 15 contrasts exactly this: traditional/multi-module systems communicate fixed-size vectors between layers, while Graph Transformers operate on and produce graphs whose arcs carry numerical information — the underlying fprop/bprop discipline from the previous lesson is unchanged.",
                },
                {
                  prompt:
                    "What's required of the function that produces a Graph Transformer's output graph from its input graph, for gradient-based learning to still apply?",
                  options: [
                    "It must be differentiable with respect to the numerical data on the arcs and the module's parameters",
                    'It must output probabilities',
                    'It must be linear',
                    'It must avoid using graphs',
                  ],
                  answer: 0,
                  explanation:
                    'As long as the numerical information attached to the output graph is produced by a differentiable function of the input graph\'s numerical data and the module\'s parameters, gradients can be backpropagated through the graph transformer exactly as through any other module.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'lg-m5',
      title: 'Heuristic Segmentation & Discriminative Training',
      description: "Reading character strings without ever being handed the 'correct' segmentation.",
      lessons: [
        {
          id: 'lg-heuristic-oversegmentation',
          title: 'Segmentation graphs and the Viterbi transformer',
          minutes: 14,
          xp: 70,
          steps: [
            { kind: 'read', title: 'How do you read "342" without anyone telling you where the digits start and end?', markdown: heuristicOversegmentationMd },
            {
              kind: 'quiz',
              title: 'Check: over-segment, then let the recognizer decide',
              questions: [
                {
                  prompt: 'Why does the segmentation heuristic deliberately generate more candidate cuts than necessary?',
                  options: [
                    'To slow down the recognizer on purpose',
                    "To make sure the 'correct' set of cuts is included among the candidates, even if many others are wrong",
                    'More cuts always directly means higher accuracy',
                    "It's an unintended side-effect with no real purpose",
                  ],
                  answer: 1,
                  explanation:
                    'The cut-generation heuristic is designed to over-generate "in the hope that the \'correct\' set of cuts will be included" — the recognizer, via the graph and Viterbi search, then picks the best path among all the candidates rather than the heuristic having to be right upfront.',
                },
                {
                  prompt: 'What does the Viterbi algorithm compute over the interpretation graph?',
                  options: [
                    'A random sample of paths through the graph',
                    'The single path with the lowest cumulative penalty, via dynamic programming',
                    'The average penalty across all paths',
                    'The total number of candidate segments',
                  ],
                  answer: 1,
                  explanation:
                    'Viterbi is the classic dynamic-programming shortest-path algorithm: it finds the path through the interpretation graph with the lowest total summed penalty in one efficient pass, without enumerating every path explicitly.',
                },
              ],
            },
          ],
        },
        {
          id: 'lg-discriminative-training',
          title: 'Avoiding the collapse problem',
          minutes: 16,
          xp: 90,
          steps: [
            { kind: 'read', title: 'A recognizer that gets zero training loss... by refusing to look at the input', markdown: discriminativeTrainingMd },
            {
              kind: 'quiz',
              title: 'Check: why discriminative training is necessary',
              questions: [
                {
                  prompt: "Why does plain Viterbi training risk the 'collapse problem'?",
                  options: [
                    'The loss only ever looks at the correct-label path, never the competing wrong paths, so the network can push every output toward the same constant and trivially minimize the loss',
                    'It uses too much memory to be practical',
                    'The Viterbi algorithm itself cannot be differentiated',
                    'RBF units always collapse regardless of training procedure',
                  ],
                  answer: 0,
                  explanation:
                    "Because E_vit only ever examines the constrained graph Gc (paths consistent with the correct label), nothing in the loss penalizes the network for also assigning low penalty to wrong answers — the global minimum can be 'output the same constant for everything,' which trivially makes the correct path's penalty low too.",
                },
                {
                  prompt: 'What does discriminative Viterbi training (E_dvit = C_cvit − C_vit) add that plain Viterbi training lacks?',
                  options: [
                    'A term that explicitly compares against the best-overall path (correct or not), pushing the gradient to penalize wrong answers that beat the correct one',
                    'A larger network architecture',
                    'Complete removal of the Viterbi algorithm',
                    "A hard requirement that all penalties be valid probabilities",
                  ],
                  answer: 0,
                  explanation:
                    'E_dvit is the gap between the best correct-label path and the best path overall. Backprop on this gap sends +1 to arcs that should have won but didn\'t, and −1 to arcs that wrongly did win — explicitly correcting errors, not just rewarding the right answer in isolation.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'lg-m6',
      title: 'Space-Displacement Neural Networks',
      description: 'Eliminating segmentation entirely by sweeping a CNN across every position.',
      lessons: [
        {
          id: 'lg-sdnn',
          title: 'Sweep instead of segment',
          minutes: 12,
          xp: 60,
          steps: [
            { kind: 'read', title: 'Why segment at all?', markdown: sdnnMd },
            {
              kind: 'quiz',
              title: 'Check: why sweeping is cheap, and where it falls short',
              questions: [
                {
                  prompt: 'Why is sweeping a CNN recognizer across every position of an input NOT as expensive as it sounds?',
                  options: [
                    'Because the input is always small in practice',
                    "Because overlapping convolutional windows share most of their computation — only a thin new slice needs recomputing per shift, so it's effectively one larger convolutional pass",
                    'Because SDNN skips most positions entirely',
                    'Because the recognizer at each position has no trainable parameters',
                  ],
                  answer: 1,
                  explanation:
                    "Because the recognizer is convolutional and weight-shared, units in two overlapping windows that look at the same input locations produce identical outputs — only the thin new slice at the edge of each shifted window needs new computation, so the replicated network is, structurally, just one larger CNN.",
                },
                {
                  prompt: 'What limitation does the paper explicitly admit about SDNN (Section VII-C)?',
                  options: [
                    'It never produces usable results on any dataset',
                    'So far it has not yielded better results than Heuristic Over-Segmentation, despite being elegant and attractive',
                    'It cannot be combined with a grammar/language model',
                    'It requires no training of the underlying recognizer',
                  ],
                  answer: 1,
                  explanation:
                    'The paper is candid: "SDNN is an extremely promising and attractive technique for OCR, but so far it has not yielded better results than Heuristic Over-Segmentation" — its payoff depends entirely on how strong the underlying recognizer is, since every position must be classified correctly.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'lg-m7',
      title: 'Generalized Transduction & GTNs vs. HMMs',
      description: 'A general graph-composition algorithm, and how GTNs relate to Hidden Markov Models.',
      lessons: [
        {
          id: 'lg-generalized-transduction',
          title: 'Composition: how one graph becomes another',
          minutes: 14,
          xp: 70,
          steps: [
            { kind: 'read', title: 'You already know the GTN idea — but how does a graph actually turn into another graph?', markdown: generalizedTransductionMd },
            {
              kind: 'quiz',
              title: 'Check: check / fprop / bprop',
              questions: [
                {
                  prompt: "What's the role of the `check` method in a Composition Transformer?",
                  options: [
                    'It executes the forward numerical computation',
                    'It decides, given two input arcs, whether an arc/subgraph should exist in the output — constructing a dynamic, data-dependent computation architecture',
                    'It computes gradients during the backward pass',
                    'It exists only for debugging and has no effect on the output',
                  ],
                  answer: 1,
                  explanation:
                    '`check` decides the *structure* of the output graph on the fly, based on what\'s actually in the two input graphs. `fprop` and `bprop` then run a normal forward/backward pass through whatever architecture `check` produced.',
                },
                {
                  prompt: 'How does generalized transduction differ from classical finite-state transduction?',
                  options: [
                    'It only works with discrete, enumerable symbols',
                    'Arcs can carry arbitrary high-dimensional data (images, vectors), not just enumerable symbols, as long as check/fprop/bprop are defined for them',
                    'It removes the need for graphs entirely',
                    'It cannot be combined with a grammar',
                  ],
                  answer: 1,
                  explanation:
                    "Classical transduction assumes finite, enumerable symbols on arcs. Generalized transduction drops that assumption — arcs can carry images or vectors that can't be enumerated — as long as the Composition Transformer's check/fprop/bprop methods are defined for them.",
                },
              ],
            },
          ],
        },
        {
          id: 'lg-gtn-vs-hmm',
          title: 'GTNs as a generalization of HMMs',
          minutes: 14,
          xp: 80,
          steps: [
            { kind: 'read', title: 'Why invent a new formalism instead of just using HMMs?', markdown: gtnVsHmmMd },
            {
              kind: 'scenario',
              title: 'Reframing a speech pipeline as a GTN',
              scenario: {
                intro:
                  'You maintain a speech-recognition system built from several independently-trained HMM stages (acoustic model → pronunciation model → language model). Accuracy has plateaued, and retraining each stage separately is no longer helping.',
                stages: [
                  {
                    situation:
                      "You're deciding how to use what GTNs add over plain HMMs to break the plateau.",
                    question: 'Which change best applies the paper\'s generalization?',
                    options: [
                      {
                        label:
                          'Reframe the whole pipeline as a GTN: compose the three stages via the generalized composition operation, and train end-to-end with a discriminative loss',
                        quality: 'best',
                        feedback:
                          "This is exactly what the paper argues for: gradients flow from the final word-error objective back through every stage, solving the cross-stage credit-assignment problem the way backprop solved it within a single network — and it reuses the same composition operation Pereira et al.'s transducer framework already does for stacking HMM-like stages.",
                      },
                      {
                        label: 'Replace all the HMMs with one giant feed-forward network with no graph structure',
                        quality: 'bad',
                        feedback:
                          "This throws away exactly the structure (composability across processing levels) that made the pipeline modular and interpretable in the first place — and gives up the existing machinery for free.",
                      },
                      {
                        label: 'Keep training each HMM stage separately, but tune learning rates more carefully',
                        quality: 'bad',
                        feedback:
                          "This doesn't address the actual problem: each stage is still trained to maximize its own local likelihood, never the end-to-end objective. The credit-assignment problem across stages remains unsolved no matter how well any single stage is tuned.",
                      },
                      {
                        label:
                          "Reframe as a GTN, but skip adding a discriminative loss — since GTNs already generalize HMMs, the probabilistic safety rail isn't needed",
                        quality: 'bad',
                        feedback:
                          "This misses the paper's explicit caveat: dropping or relaxing the probabilistic normalization constraint (which HMMs enforce) reopens exactly the collapse failure mode discriminative training exists to prevent. Generalizing the topology without changing the training objective just reproduces the HMM's results with extra machinery.",
                      },
                    ],
                  },
                ],
                debrief:
                  "GTNs extend HMMs in two ways: composability (stacking processing stages, which Pereira et al. already did for transducers) and flexibility on probabilistic constraints (keep them, relax them, or drop them). Dropping the constraint without adding discriminative training is the one combination the paper warns against.",
              },
            },
          ],
        },
      ],
    },
    {
      id: 'lg-m8',
      title: 'On-line Handwriting Recognition System',
      description: 'A complete GTN, built around a CNN, for real-time pen-computer handwriting.',
      lessons: [
        {
          id: 'lg-online-handwriting',
          title: 'Reading as you write',
          minutes: 16,
          xp: 90,
          steps: [
            { kind: 'read', title: 'A recognizer that has to keep up with your pen', markdown: onlineHandwritingMd },
            {
              kind: 'quiz',
              title: 'Check: AMAP and word-level training',
              questions: [
                {
                  prompt: 'What does the AMAP representation encode per pixel, and why does that help?',
                  options: [
                    'A single grayscale value, same as a typical OCR image',
                    '5 features — 4 pen-direction orientations plus local curvature — which makes the representation independent of stroke ordering or writing speed',
                    'Just an (x, y) coordinate pair',
                    'A full RGB color triple',
                  ],
                  answer: 1,
                  explanation:
                    "AMAP encodes orientation and curvature information per pixel rather than a raw stroke trace, so it makes very few assumptions about how the pen moved — it works for capitals, lower case, cursive, and punctuation alike, and can be computed for a whole word without segmenting first.",
                },
                {
                  prompt: 'Why did word-level discriminative training reduce error more than character-level training alone, per the measured results?',
                  options: [
                    'It used a larger network architecture',
                    'Character-level training never penalizes a plausible-but-wrong segmentation of a whole word, while word-level training backpropagates a single loss through the entire segmentation + recognition + language-model pipeline',
                    'It simply added more raw training data',
                    'It removed the language model from the pipeline',
                  ],
                  answer: 1,
                  explanation:
                    "Character-level training only ever sees isolated, correctly pre-segmented characters — it has no opportunity to learn to reject a bad segmentation of a real word. Word-level training applies the discriminative-training machinery end-to-end, which is why the measured relative error drops (24-34% across the variants tested) were so large.",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'lg-m9',
      title: 'The Bank Check Reader & Conclusions',
      description: "A complete commercial GTN system, and the paper's own summary of what it solved.",
      lessons: [
        {
          id: 'lg-check-reader',
          title: 'A check reader that has to make money',
          minutes: 16,
          xp: 90,
          steps: [
            { kind: 'read', title: 'A check reader that has to make money', markdown: checkReaderMd },
            {
              kind: 'quiz',
              title: "Check: the economics and the cascade",
              questions: [
                {
                  prompt: "What does the bank's '50% correct / 49% reject / 1% error' threshold imply about the system's job?",
                  options: [
                    "It must classify, but also know when to abstain and route a check to a human, rather than just maximizing raw accuracy",
                    'It must process every check identically with no rejection option',
                    'It must reject all business checks automatically',
                    'It must read the Legal (written-words) amount instead of the Courtesy amount',
                  ],
                  answer: 0,
                  explanation:
                    "Crossing the bank's economic threshold requires a trustworthy confidence score, not just an answer — checks below a confidence threshold get rejected to a human rather than risking a costly wrong automatic answer.",
                },
                {
                  prompt: 'Why is reading the check amount framed as a cascade of graph transformers rather than five separate hand-wired programs?',
                  options: [
                    'Because hand-wired programs are not technically permitted',
                    "Because every stage stays differentiable, so the parameters of every stage — not just one — can be tuned jointly by gradient descent to reduce the system's overall error",
                    'Because graphs are simply faster to draw than code',
                    'Because grammars cannot be implemented as ordinary code',
                  ],
                  answer: 1,
                  explanation:
                    "Committing to one segmentation, one recognition pass, and one grammar check independently throws away information each stage could use from the others. Keeping every candidate alive as a path in a graph, and tuning every stage's parameters jointly against one global error measure, is exactly what lifted this system from 68% to 82% correct at the same fixed 1% error rate.",
                },
              ],
            },
          ],
        },
        {
          id: 'lg-paper-conclusions',
          title: "What the paper actually argued",
          minutes: 14,
          xp: 80,
          steps: [
            { kind: 'read', title: 'So what did this whole paper actually argue?', markdown: paperConclusionsMd },
            {
              kind: 'scenario',
              title: 'Adopt GTNs for a new document-recognition product?',
              scenario: {
                intro:
                  "You're scoping a new document-recognition product (e.g. reading invoices) and deciding between a traditional hand-integrated pipeline and a GTN-style globally-trained one.",
                stages: [
                  {
                    situation:
                      "Engineering wants to ship fast and is leaning toward reusing well-understood, independently-tuned components.",
                    question: 'Which approach best reflects the paper\'s own argument and evidence?',
                    options: [
                      {
                        label:
                          'Keep a traditional hand-integrated pipeline: tune field-finding, segmentation, recognition, and language modeling separately, each against its own local objective',
                        quality: 'bad',
                        feedback:
                          "This perpetuates the exact problem the paper's conclusion calls out: hand-truthing segmented data, hand-tuning heuristics stage by stage, and optimizing local objectives instead of the one that matters — overall system error.",
                      },
                      {
                        label:
                          'Adopt a full GTN: define every stage as a differentiable graph transformer and train the whole pipeline jointly against one discriminative, end-task loss',
                        quality: 'best',
                        feedback:
                          "This matches the check-reader's measured result directly: the GTN system scored 82% correct/1% error/17% reject versus the prior hand-wired system's 68%/1%/31% on the same test set — same error budget, far fewer rejects — specifically because every stage's parameters were tuned jointly.",
                      },
                      {
                        label:
                          'Partially adopt: keep segmentation hand-tuned, but train only the recognizer end-to-end against the final objective',
                        quality: 'ok',
                        feedback:
                          "This captures some of the gain — the recognizer's own discriminative training helps — but leaves the largest source of compounding error (irreversible early segmentation decisions) outside the trainable loop, which is exactly the failure mode Heuristic Over-Segmentation and the segmentation graph were built to avoid.",
                      },
                      {
                        label:
                          'Skip learning for the pipeline structure entirely: hand-code a rule-based grammar checker bolted onto an off-the-shelf OCR engine',
                        quality: 'bad',
                        feedback:
                          'This reproduces several of the "five generic problems" the paper\'s conclusion lists as solved by gradient-based learning and GTNs — hand-derived heuristics for combining segmentation, recognition, and language-model evidence, with no path to joint optimization.',
                      },
                    ],
                  },
                ],
                debrief:
                  "The paper's bet, validated commercially in the check reader, is that gradient-based learning generalizes the credit-assignment problem backprop already solved for fixed networks to systems whose graph structure changes per input — and that this beats hand-integrating stages, even when each stage in isolation looks reasonable.",
              },
            },
          ],
        },
      ],
    },
  ],
}
