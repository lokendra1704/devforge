import type { Subject } from '../types'
import degradationMd from './md/rn-degradation.md?raw'
import residualMd from './md/rn-residual.md?raw'
import shortcutsMd from './md/rn-shortcuts.md?raw'
import architectureMd from './md/rn-architecture.md?raw'
import resultsMd from './md/rn-results.md?raw'

export const deepResidualLearning: Subject = {
  id: 'deep-residual-learning',
  title: 'Deep Residual Learning (ResNet)',
  tagline: 'How skip connections let networks go 8× deeper — and win ILSVRC 2015',
  icon: '🔗',
  accent: '#0EA5E9',
  modules: [
    {
      id: 'rn-m1',
      title: 'Residual Networks',
      description:
        'He et al. (2015): the degradation problem, the residual reformulation, shortcut connections, bottleneck blocks, and the ImageNet results',
      lessons: [
        {
          id: 'rn-m1-l1',
          title: 'The Degradation Problem',
          minutes: 10,
          xp: 50,
          steps: [
            { kind: 'read', title: 'The deeper network that learned worse', markdown: degradationMd },
            {
              kind: 'quiz',
              title: 'Diagnosing degradation',
              questions: [
                {
                  prompt:
                    'A 56-layer plain net has higher TRAINING error than a 20-layer plain net. Why is this NOT overfitting?',
                  options: [
                    'Overfitting means low training error with high test error; here training error itself is worse',
                    'Overfitting only happens with small datasets like CIFAR-10',
                    'The networks use batch normalization, which prevents overfitting entirely',
                    'It is overfitting — the paper mislabels it as degradation',
                  ],
                  answer: 0,
                  explanation:
                    'Overfitting is when a model fits the training data well but generalizes poorly (low train error, high test error). The degradation problem is the opposite symptom: the deeper net is worse even on the training set it is being optimized on (Section 1).',
                },
                {
                  prompt:
                    'The authors argue degradation is NOT caused by vanishing gradients. What is their evidence?',
                  options: [
                    'The plain nets use batch normalization, so forward variances and backward gradient norms are both healthy',
                    'They switched to a different activation function',
                    'Gradients cannot vanish in convolutional networks',
                    'They added shortcut connections, which fixed the gradients',
                  ],
                  answer: 0,
                  explanation:
                    'With BN, the authors verified that neither forward-propagated signals nor backward-propagated gradients vanish. So the issue is an optimization difficulty, not a dead signal (Section 4.1).',
                },
                {
                  prompt:
                    'Why does a "constructed solution" prove a deeper net should do no WORSE than a shallow one?',
                  options: [
                    'Copy the shallow net and make the extra layers identity mappings — same function, same error',
                    'Deeper nets always have more parameters, so they fit better',
                    'Adding layers averages out the errors of earlier layers',
                    'Because batch normalization guarantees monotonic improvement',
                  ],
                  answer: 0,
                  explanation:
                    'If the added layers are identity mappings and the rest are copied from the trained shallow net, the deeper net computes the identical function — so its training error must be equal, not higher. The degradation problem is that SGD cannot find this solution (Section 1).',
                },
              ],
            },
          ],
        },
        {
          id: 'rn-m1-l2',
          title: 'Residual Learning',
          minutes: 12,
          xp: 60,
          steps: [
            { kind: 'read', title: 'Learn the change, not the whole function', markdown: residualMd },
            {
              kind: 'quiz',
              title: 'The reformulation',
              questions: [
                {
                  prompt:
                    'Instead of learning the target mapping H(x) directly, what do the stacked layers in a residual block learn?',
                  options: [
                    'The residual F(x) = H(x) − x; the output is recast as F(x) + x',
                    'The inverse mapping H⁻¹(x)',
                    'The gradient of H(x) with respect to the weights',
                    'A gated combination of H(x) and x',
                  ],
                  answer: 0,
                  explanation:
                    'The layers fit F(x) := H(x) − x, and the shortcut adds x back, so the block computes F(x) + x. The layers learn the difference from the input rather than the full mapping (Section 3.1).',
                },
                {
                  prompt:
                    'Why is residual learning easier when the optimal mapping is close to the identity?',
                  options: [
                    'The solver just drives the weights toward zero (F(x) → 0), which SGD does naturally',
                    'Identity mappings require no weights at all',
                    'The shortcut removes the need for nonlinearities',
                    'Batch normalization forces F(x) to equal x',
                  ],
                  answer: 0,
                  explanation:
                    'If identity is optimal, the residual block only needs F(x) = 0 — pushing weights toward zero. That is far easier for SGD than sculpting a stack of nonlinear layers into an exact identity (Sections 1 and 3.1).',
                },
                {
                  prompt:
                    'How much extra parameter and compute cost does an identity shortcut connection add?',
                  options: [
                    'Essentially none — it is a single element-wise addition with no parameters',
                    'It doubles the parameters of the block',
                    'It adds one extra weight matrix per block',
                    'It adds a small gating network with learned parameters',
                  ],
                  answer: 0,
                  explanation:
                    'Identity shortcuts add neither extra parameters nor computational complexity — just an element-wise add. This lets plain and residual nets be compared at identical parameter budgets (Section 1, 3.2).',
                },
              ],
            },
          ],
        },
        {
          id: 'rn-m1-l3',
          title: 'Shortcuts and Bottleneck Blocks',
          minutes: 14,
          xp: 75,
          steps: [
            { kind: 'read', title: 'Shortcuts when the dimensions don\'t line up', markdown: shortcutsMd },
            {
              kind: 'quiz',
              title: 'Identity vs projection',
              questions: [
                {
                  prompt:
                    'When the number of channels increases across a block, the identity shortcut can\'t add x to F(x) directly. What do the authors prefer as the default fix?',
                  options: [
                    'Use identity (zero-padding) shortcuts everywhere possible; spend a projection only where dimensions actually increase',
                    'Use projection shortcuts on every block for consistency',
                    'Remove the shortcut at dimension-change boundaries',
                    'Always use a square learned matrix Wₛ on every shortcut',
                  ],
                  answer: 0,
                  explanation:
                    'Experiments (Table 3) show options A/B/C are all close, so projections are not essential. The economical choice is identity shortcuts everywhere, using a projection only to match dimensions when channels increase (Section 3.2).',
                },
                {
                  prompt:
                    'In a bottleneck block (1×1 → 3×3 → 1×1), what is the role of the two 1×1 convolutions?',
                  options: [
                    'Reduce channels before the 3×3 conv and restore them after, so the 3×3 runs on a smaller tensor',
                    'Add nonlinearity that the 3×3 conv lacks',
                    'Replace the shortcut connection',
                    'Perform the spatial downsampling',
                  ],
                  answer: 0,
                  explanation:
                    'The first 1×1 reduces dimensions, the 3×3 does the spatial work on the squeezed tensor (the "bottleneck"), and the last 1×1 restores dimensions. This keeps a deep block at similar cost to a 2-layer block (Section 4.1).',
                },
                {
                  prompt:
                    'Why are parameter-free identity shortcuts ESPECIALLY important in bottleneck blocks?',
                  options: [
                    'The shortcut connects the two high-dimensional ends, so a projection there would roughly double time and model size',
                    'Bottleneck blocks have no other shortcuts',
                    'Projections break the 1×1 convolutions',
                    'Identity shortcuts add nonlinearity the bottleneck needs',
                  ],
                  answer: 0,
                  explanation:
                    'A bottleneck shortcut spans the high-dimensional (e.g. 256-d) ends. Replacing identity with a 256→256 projection costs about as much as the whole block, roughly doubling time complexity and model size (Section 4.1).',
                },
              ],
            },
            {
              kind: 'code',
              title: 'Count the bottleneck parameters',
              challenge: {
                prompt:
                  'Verify the paper\'s claim that adding a projection shortcut to a bottleneck block roughly DOUBLES its size.\n\n' +
                  'A convolution with a k×k kernel, `cin` input channels and `cout` output channels has k·k·cin·cout weights (ignore biases).\n\n' +
                  'Implement:\n' +
                  '• `convParams(k, cin, cout)` — weights in one conv layer.\n' +
                  '• `bottleneckParams(cin, mid)` — a bottleneck block: 1×1 (cin→mid) + 3×3 (mid→mid) + 1×1 (mid→cin).\n' +
                  '• `projectionShortcutParams(cin)` — a 1×1 conv (cin→cin) used as a projection shortcut.\n\n' +
                  'For the ResNet bottleneck with cin=256, mid=64, the block has 69632 weights and the projection shortcut adds 65536 — nearly doubling it.',
                starterCode:
                  'function convParams(k, cin, cout) {\n' +
                  '  // TODO: weights in a k×k conv from cin to cout channels\n' +
                  '  return 0\n' +
                  '}\n\n' +
                  'function bottleneckParams(cin, mid) {\n' +
                  '  // TODO: 1×1 (cin→mid) + 3×3 (mid→mid) + 1×1 (mid→cin)\n' +
                  '  return 0\n' +
                  '}\n\n' +
                  'function projectionShortcutParams(cin) {\n' +
                  '  // TODO: a 1×1 conv from cin to cin channels\n' +
                  '  return 0\n' +
                  '}\n',
                solution:
                  'function convParams(k, cin, cout) {\n' +
                  '  return k * k * cin * cout\n' +
                  '}\n\n' +
                  'function bottleneckParams(cin, mid) {\n' +
                  '  return convParams(1, cin, mid) + convParams(3, mid, mid) + convParams(1, mid, cin)\n' +
                  '}\n\n' +
                  'function projectionShortcutParams(cin) {\n' +
                  '  return convParams(1, cin, cin)\n' +
                  '}\n',
                tests:
                  'test("a single 3x3, 64->64 conv has 36864 weights", () => {\n' +
                  '  assertEqual(convParams(3, 64, 64), 36864)\n' +
                  '})\n' +
                  'test("1x1 convs count correctly", () => {\n' +
                  '  assertEqual(convParams(1, 256, 64), 16384)\n' +
                  '  assertEqual(convParams(1, 64, 256), 16384)\n' +
                  '})\n' +
                  'test("the 256/64 bottleneck block has 69632 weights", () => {\n' +
                  '  assertEqual(bottleneckParams(256, 64), 69632)\n' +
                  '})\n' +
                  'test("a 256->256 projection shortcut adds 65536 weights", () => {\n' +
                  '  assertEqual(projectionShortcutParams(256), 65536)\n' +
                  '})\n' +
                  'test("adding the projection shortcut roughly doubles the block", () => {\n' +
                  '  const block = bottleneckParams(256, 64)\n' +
                  '  const withProj = block + projectionShortcutParams(256)\n' +
                  '  const ratio = withProj / block\n' +
                  '  assertEqual(ratio > 1.9 && ratio < 2.0, true)\n' +
                  '})\n',
              },
            },
          ],
        },
        {
          id: 'rn-m1-l4',
          title: 'The Architecture',
          minutes: 11,
          xp: 60,
          steps: [
            { kind: 'read', title: 'Deeper and cheaper', markdown: architectureMd },
            {
              kind: 'quiz',
              title: 'Design rules and complexity',
              questions: [
                {
                  prompt:
                    'When a ResNet halves the feature-map size at a stage boundary, what does it do to the number of filters, and why?',
                  options: [
                    'Doubles them, to preserve roughly constant compute per layer',
                    'Halves them, to reduce memory',
                    'Keeps them the same, for simplicity',
                    'Quadruples them, to maximize capacity',
                  ],
                  answer: 0,
                  explanation:
                    'Following the VGG philosophy: when the feature map is halved, the filter count is doubled so the time complexity per layer stays roughly constant (Section 3.3).',
                },
                {
                  prompt:
                    'How does the 152-layer ResNet compare in FLOPs to VGG-16/19?',
                  options: [
                    'It has LOWER complexity (11.3B FLOPs) than VGG-16 (15.3B) and VGG-19 (19.6B), despite being far deeper',
                    'It has roughly 10× the FLOPs of VGG-19',
                    'It matches VGG-19 exactly',
                    'It cannot be compared because they use different operations',
                  ],
                  answer: 0,
                  explanation:
                    'The 152-layer ResNet uses 11.3B FLOPs, still below VGG-16 (15.3B) and VGG-19 (19.6B). Depth and compute are decoupled: global average pooling, smaller widths, and bottleneck blocks keep ResNet cheap (Sections 1, 4.1).',
                },
              ],
            },
          ],
        },
        {
          id: 'rn-m1-l5',
          title: 'Results and Analysis',
          minutes: 12,
          xp: 65,
          steps: [
            { kind: 'read', title: 'Depth finally pays off', markdown: resultsMd },
            {
              kind: 'quiz',
              title: 'Reading the numbers',
              questions: [
                {
                  prompt:
                    'In the controlled 18-vs-34 layer comparison (Table 2), what happens to error as depth increases, for plain nets vs ResNets?',
                  options: [
                    'Plain net error gets WORSE (27.94→28.54); ResNet error gets BETTER (27.88→25.03)',
                    'Both improve equally with depth',
                    'Both get worse with depth',
                    'ResNet gets worse while plain net improves',
                  ],
                  answer: 0,
                  explanation:
                    'With identical depth, width, and parameters, the only difference is the shortcuts. Plain nets degrade with depth; ResNets improve. The shortcut flips depth from liability to asset (Section 4.1, Table 2).',
                },
                {
                  prompt:
                    'The 1202-layer CIFAR net trains to <0.1% error but has WORSE test error than the 110-layer net. What do the authors blame?',
                  options: [
                    'Overfitting — the 1202-layer net is unnecessarily large for the small dataset',
                    'The degradation problem returning at extreme depth',
                    'Vanishing gradients',
                    'A bug in the shortcut connections',
                  ],
                  answer: 0,
                  explanation:
                    'Both nets train fine, so it is not degradation. The 19.4M-parameter model overfits the small CIFAR-10 set. Residual learning fixes optimization, not the need for enough data/regularization (Section 4.2).',
                },
                {
                  prompt:
                    'Figure 7 shows ResNet layer responses are small, and SMALLER for deeper nets. Why does this support the residual-learning hypothesis?',
                  options: [
                    'Small residuals mean each block makes a gentle correction to its input, consistent with identity being a good reference',
                    'Small responses prove the layers are not learning anything',
                    'It shows the gradients are vanishing as intended',
                    'It proves projection shortcuts are necessary',
                  ],
                  answer: 0,
                  explanation:
                    'If identity is a good baseline and F is a small correction, residual functions should have small magnitudes — exactly what Figure 7 shows. Deeper nets spread the work across more blocks, so each modifies the signal even less (Section 4.2).',
                },
              ],
            },
          ],
        },
        {
          id: 'rn-m1-l6',
          title: 'Design Decisions',
          minutes: 12,
          xp: 70,
          steps: [
            {
              kind: 'scenario',
              title: 'Designing a deep residual network',
              scenario: {
                intro:
                  'You are designing a deep convolutional network for image classification, using residual blocks. Several design choices come up — apply what ResNet learned.',
                stages: [
                  {
                    situation:
                      'Inside a stage, a block takes a 64-channel feature map and outputs a 64-channel map of the same spatial size. You need to pick the shortcut.',
                    question: 'Which shortcut connection should you use here?',
                    options: [
                      {
                        label: 'A plain identity shortcut (just add x)',
                        quality: 'best',
                        feedback:
                          'Correct. Dimensions already match, so an identity shortcut adds zero parameters and zero compute. The paper shows projections are not essential when identity works.',
                      },
                      {
                        label: 'A 1×1 projection shortcut (learned 64→64 matrix)',
                        quality: 'ok',
                        feedback:
                          'It works (option C in Table 3 is marginally best), but it spends parameters for a negligible gain. Not worth it when identity already matches.',
                      },
                      {
                        label: 'No shortcut — just stack the layers',
                        quality: 'bad',
                        feedback:
                          'That is a plain net, which reintroduces the degradation problem. The whole point is to keep the residual path.',
                      },
                    ],
                  },
                  {
                    situation:
                      'At a stage boundary, the block doubles channels (128→256) and halves the spatial size. Now x (128-d) and F(x) (256-d) cannot be added directly.',
                    question: 'How do you handle the shortcut across this dimension change?',
                    options: [
                      {
                        label: 'Use a projection (or zero-padding) shortcut with stride 2 to match the new dimensions',
                        quality: 'best',
                        feedback:
                          'Right. This is exactly where the paper spends a projection (option B) or zero-pads (option A): only at dimension-increasing boundaries, with stride 2 to match the halved size.',
                      },
                      {
                        label: 'Add x and F(x) anyway and let broadcasting handle it',
                        quality: 'bad',
                        feedback:
                          'The shapes (128-d vs 256-d, different spatial size) do not align; element-wise addition is undefined. You must match dimensions first.',
                      },
                      {
                        label: 'Drop the downsampling so dimensions always match',
                        quality: 'bad',
                        feedback:
                          'Removing downsampling explodes compute and memory and breaks the VGG-style design that keeps per-layer cost constant.',
                      },
                    ],
                  },
                  {
                    situation:
                      'You want to grow the network from 50 to 152 layers without the FLOPs and parameter count exploding.',
                    question: 'What block design lets you add depth most economically?',
                    options: [
                      {
                        label: 'Bottleneck (1×1 → 3×3 → 1×1) blocks with parameter-free identity shortcuts',
                        quality: 'best',
                        feedback:
                          'Correct. The 1×1 convs squeeze channels around the 3×3, and identity shortcuts keep the high-dimensional ends free — this is how ResNet-152 stays cheaper than VGG-16.',
                      },
                      {
                        label: 'Keep stacking basic 2-layer (3×3 → 3×3) blocks',
                        quality: 'ok',
                        feedback:
                          'They still gain accuracy with depth, but the paper notes they are "not as economical" as bottlenecks — the 3×3 convs run on full-width tensors.',
                      },
                      {
                        label: 'Use projection shortcuts on every block to be safe',
                        quality: 'bad',
                        feedback:
                          'In bottleneck blocks a projection spans the high-dimensional ends and roughly doubles time and model size. That is precisely what you are trying to avoid.',
                      },
                    ],
                  },
                  {
                    situation:
                      'Your 1000-layer net trains to near-zero training error on a small dataset, but its TEST error is worse than a 100-layer version.',
                    question: 'What is the most likely cause, and the right response?',
                    options: [
                      {
                        label: 'Overfitting — the model is too large for the data; add regularization or shrink it',
                        quality: 'best',
                        feedback:
                          'Correct. Both nets train fine, so this is not degradation. Like the 1202-layer CIFAR net, the giant model overfits the small dataset; the fix is regularization or fewer parameters.',
                      },
                      {
                        label: 'Degradation has returned — add even more layers to fix it',
                        quality: 'bad',
                        feedback:
                          'Degradation shows up as higher TRAINING error, which is not happening here. Adding more layers would worsen the overfitting.',
                      },
                      {
                        label: 'Residual learning has failed — go back to a plain network',
                        quality: 'bad',
                        feedback:
                          'Residual learning is doing its job (optimization is fine — near-zero training error). The problem is generalization, which residual learning was never meant to solve.',
                      },
                    ],
                  },
                ],
                debrief:
                  'Identity shortcuts wherever dimensions match; a projection only at dimension-increasing boundaries; bottleneck blocks to buy depth cheaply; and remember residual learning fixes OPTIMIZATION, not overfitting — generalization still needs enough data and regularization.',
              },
            },
          ],
        },
      ],
    },
  ],
}
