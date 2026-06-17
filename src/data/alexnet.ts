import type { Subject } from '../types'
import motivationMd from './md/an-motivation.md?raw'
import architectureMd from './md/an-architecture.md?raw'
import overfittingMd from './md/an-overfitting.md?raw'
import trainingMd from './md/an-training.md?raw'
import resultsMd from './md/an-results.md?raw'
import critiqueMd from './md/an-critique.md?raw'

export const alexnet: Subject = {
  id: 'alexnet',
  title: 'AlexNet: ImageNet Classification with Deep CNNs',
  tagline: 'How a two-GPU, eight-layer CNN halved the error rate on ImageNet and kicked off the deep learning era.',
  icon: '🖼️',
  accent: '#F97316',
  modules: [
    {
      id: 'an-m1',
      title: 'AlexNet',
      description: 'From the data/compute gap that blocked large CNNs, through the architecture and training tricks, to the results and what the authors flagged as unfinished.',
      lessons: [
        {
          id: 'an-motivation',
          title: 'Why a Bigger Net Needed a Bigger Dataset',
          minutes: 10,
          xp: 50,
          steps: [
            { kind: 'read', title: 'Closing the data and compute gap', markdown: motivationMd },
            {
              kind: 'quiz',
              title: 'Motivation Check',
              questions: [
                {
                  prompt: 'Before ImageNet, why did small datasets like Caltech-101 limit how large a CNN you could usefully train?',
                  options: [
                    'GPUs did not exist yet, so any CNN was infeasible',
                    'A model with enough capacity to learn 1000s of object classes would overfit a dataset of only tens of thousands of images',
                    'CNNs cannot be trained on images smaller than 256x256',
                    'Small datasets only contain grayscale images',
                  ],
                  answer: 1,
                  explanation: 'The paper argues a large-capacity model needs a large dataset to avoid overfitting. Datasets of tens of thousands of images were enough for simple tasks but not for learning the variability of thousands of real-world object categories — that required ImageNet\'s millions of labeled images.',
                },
                {
                  prompt: 'Why does a CNN need fewer parameters than a fully-connected network of similar size, according to the paper?',
                  options: [
                    'CNNs use less precise floating point numbers',
                    'CNNs assume stationarity of statistics and locality of pixel dependencies, which fully-connected nets do not exploit',
                    'CNNs only process grayscale images, halving the parameter count',
                    'CNNs always have fewer layers than fully-connected networks',
                  ],
                  answer: 1,
                  explanation: 'Convolutional weight sharing and local receptive fields encode two assumptions that are true of natural images (stationarity and locality), so a CNN needs far fewer connections and parameters than an equivalently-sized fully-connected network — making it easier to train with the same amount of data.',
                },
                {
                  prompt: 'What specifically made training a network this large newly feasible in 2012, separate from the dataset size?',
                  options: [
                    'A new theoretical proof that deep networks always converge',
                    'GPUs paired with a highly-optimized 2D convolution implementation made the compute tractable',
                    'The invention of the convolution operation itself',
                    'A reduction in the number of object categories to classify',
                  ],
                  answer: 1,
                  explanation: 'CNNs of this rough shape existed for years; what changed was that current GPUs, combined with an efficient convolution implementation, made it possible to actually train a network this size in five to six days rather than an intractable amount of time.',
                },
              ],
            },
          ],
        },
        {
          id: 'an-architecture',
          title: 'Four Tricks That Made the Network Trainable',
          minutes: 14,
          xp: 70,
          steps: [
            { kind: 'read', title: 'ReLU, two-GPU split, LRN, and overlapping pooling', markdown: architectureMd },
            {
              kind: 'quiz',
              title: 'Architecture Choices',
              questions: [
                {
                  prompt: 'Why do ReLUs train faster than tanh or sigmoid neurons here?',
                  options: [
                    'ReLUs use fewer bits of memory per neuron',
                    'ReLUs do not saturate for positive inputs, so gradients do not vanish the way they do with tanh/sigmoid',
                    'ReLUs are only used in the output layer, so the rest of the network trains faster',
                    'ReLUs eliminate the need for a learning rate',
                  ],
                  answer: 1,
                  explanation: 'tanh and sigmoid flatten out (saturate) for large input magnitudes, causing vanishing gradients and slow learning. The non-saturating f(x) = max(0,x) keeps gradients flowing for positive inputs, which the paper measured as roughly 6x faster convergence on CIFAR-10.',
                },
                {
                  prompt: 'In the two-GPU split, why does Conv3 differ from Conv4 and Conv5 in connectivity?',
                  options: [
                    'Conv3 is twice as large as the other layers',
                    'Conv3 takes input from kernel maps on both GPUs, while Conv4 and Conv5 only see kernel maps on the same GPU',
                    'Conv3 runs on the CPU instead of either GPU',
                    'Conv3 has no learned weights',
                  ],
                  answer: 1,
                  explanation: 'The connectivity pattern is a deliberate, cross-validated choice: most layers stay same-GPU to limit communication overhead, but Conv3 is allowed to see both GPUs\' Conv2 outputs, giving the network one point of full cross-GPU information mixing partway through.',
                },
                {
                  prompt: 'What does Local Response Normalization (LRN) actually normalize against?',
                  options: [
                    'The mean pixel value of the input image',
                    'The summed squared activity of neighboring kernel maps at the same spatial position',
                    'The total number of parameters in the layer',
                    'The learning rate at that point in training',
                  ],
                  answer: 1,
                  explanation: 'LRN divides each neuron\'s post-ReLU activity by a function of the squared activities of nearby kernel maps at the same (x,y) position — a form of lateral inhibition. The paper notes this is "brightness normalization," not contrast normalization, since no mean is subtracted.',
                },
              ],
            },
          ],
        },
        {
          id: 'an-overfitting',
          title: '60 Million Parameters, 1.2 Million Images',
          minutes: 13,
          xp: 65,
          steps: [
            { kind: 'read', title: 'Data augmentation and dropout', markdown: overfittingMd },
            {
              kind: 'quiz',
              title: 'Reducing Overfitting',
              questions: [
                {
                  prompt: 'Why are the random-crop and color-jitter augmentations described as "computationally free"?',
                  options: [
                    'They are precomputed once and stored on disk before training starts',
                    'They are generated on the CPU while the GPU trains on the previous batch, overlapping with no added wall-clock cost',
                    'They only apply to the test set, not training',
                    'They require no extra code, just a flag in the training script',
                  ],
                  answer: 1,
                  explanation: 'Because the transformed images are produced in Python on the CPU concurrently with GPU computation on the prior batch, the augmentation adds essentially no extra training time — it overlaps with work that was already happening.',
                },
                {
                  prompt: 'What is the key idea behind why dropout reduces overfitting?',
                  options: [
                    'It permanently removes the weakest neurons from the network',
                    'By randomly zeroing neurons each forward pass, no neuron can rely on specific other neurons being present, forcing more robust, less co-adapted features',
                    'It increases the learning rate to converge faster',
                    'It doubles the size of the training set',
                  ],
                  answer: 1,
                  explanation: 'Dropout forces each neuron to be useful across many different random subsets of the rest of the network, since it cannot count on any particular co-active neuron. This discourages complex co-adaptations that would otherwise memorize training-set quirks.',
                },
                {
                  prompt: 'What would likely happen if the network were trained WITHOUT either data augmentation or dropout, given its 60M parameters and 1.2M images?',
                  options: [
                    'No difference — the dataset is already large enough',
                    'Training would simply take less time with the same final accuracy',
                    'The network would substantially overfit, as the paper reports happens when either technique is removed',
                    'The network would fail to compile',
                  ],
                  answer: 2,
                  explanation: 'The paper explicitly states that without crop/flip augmentation the network "suffers from substantial overfitting," and separately that without dropout it "exhibits substantial overfitting." With 60M parameters against 1.2M images, both regularizers are doing real work, not just marginal cleanup.',
                },
              ],
            },
          ],
        },
        {
          id: 'an-training',
          title: 'The Update Rule That Trained for Five Days Straight',
          minutes: 15,
          xp: 75,
          steps: [
            { kind: 'read', title: 'SGD with momentum and weight decay', markdown: trainingMd },
            {
              kind: 'code',
              title: 'Implement the SGD-with-momentum update',
              challenge: {
                prompt: 'Implement `sgdStep(w, v, grad, eps)` that performs one iteration of the paper\'s update rule (Section 5) and returns `{ w: number, v: number }`:\n\n  v_next = 0.9 * v - 0.0005 * eps * w - eps * grad\n  w_next = w + v_next\n\nUse momentum 0.9 and weight decay 0.0005 exactly as in the paper.',
                starterCode: 'function sgdStep(w, v, grad, eps) {\n  // TODO: implement the update rule from Section 5\n  return { w: 0, v: 0 };\n}',
                solution: 'function sgdStep(w, v, grad, eps) {\n  const vNext = 0.9 * v - 0.0005 * eps * w - eps * grad;\n  const wNext = w + vNext;\n  return { w: wNext, v: vNext };\n}',
                tests: [
                  'test("zero velocity, zero gradient still applies weight decay", () => {\n  const r = sgdStep(1.0, 0, 0, 0.01);\n  assertEqual(Math.abs(r.v - (-0.000005)) < 1e-9, true, "v should reflect weight decay term");\n});',
                  'test("matches a hand-computed step", () => {\n  const r = sgdStep(2.0, 0.5, 0.1, 0.01);\n  const expectedV = 0.9 * 0.5 - 0.0005 * 0.01 * 2.0 - 0.01 * 0.1;\n  const expectedW = 2.0 + expectedV;\n  assertEqual(Math.abs(r.v - expectedV) < 1e-9, true, "v mismatch");\n  assertEqual(Math.abs(r.w - expectedW) < 1e-9, true, "w mismatch");\n});',
                  'test("momentum carries forward across iterations", () => {\n  let state = { w: 1.0, v: 0.2 };\n  state = sgdStep(state.w, state.v, 0.05, 0.01);\n  const step2 = sgdStep(state.w, state.v, 0.05, 0.01);\n  assertEqual(Math.abs(step2.v - (0.9 * state.v - 0.0005 * 0.01 * state.w - 0.01 * 0.05)) < 1e-9, true, "second step should build on first step\'s velocity");\n});',
                  'test("positive gradient with zero velocity decreases weight", () => {\n  const r = sgdStep(5.0, 0, 1.0, 0.01);\n  assertEqual(r.w < 5.0, true, "weight should decrease when gradient is positive");\n});',
                ].join('\n'),
              },
            },
          ],
        },
        {
          id: 'an-results',
          title: 'How Much Did All of This Actually Buy?',
          minutes: 12,
          xp: 60,
          steps: [
            { kind: 'read', title: 'ILSVRC-2010 and ILSVRC-2012 results', markdown: resultsMd },
            {
              kind: 'quiz',
              title: 'Reading the Results',
              questions: [
                {
                  prompt: 'The headline 15.3% top-5 test error on ILSVRC-2012 came from which setup?',
                  options: [
                    'A single CNN trained exactly as described in Sections 3-5',
                    'An ensemble of seven CNNs, two of which were pretrained on a larger ImageNet release before fine-tuning',
                    'The same single CNN evaluated with a different test-time crop strategy',
                    'A completely different, larger architecture not described in the paper',
                  ],
                  answer: 1,
                  explanation: 'A single CNN of the described architecture reaches 18.2% top-5 error. The winning 15.3% number layers ensembling (5+ networks averaged) and pretraining on the larger Fall 2011 ImageNet release on top of that base architecture — both general techniques, not unique to this network.',
                },
                {
                  prompt: 'What evidence does the paper give that the two-GPU split shapes what the network learns, not just how fast it trains?',
                  options: [
                    'Each GPU trains a completely independent, separately-evaluated model',
                    'The kernels on GPU 1 consistently turn out color-agnostic while GPU 2\'s are color-specific, across different random initializations',
                    'GPU 1 only processes the first half of the training set',
                    'There is no such evidence; the split is purely a memory optimization',
                  ],
                  answer: 1,
                  explanation: 'Section 6.1 reports this specialization happens on every training run regardless of random initialization, which the authors attribute to the restricted Conv3-and-later connectivity pattern — the GPU split has a real effect on what features end up where, beyond just fitting in memory.',
                },
              ],
            },
          ],
        },
        {
          id: 'an-critique',
          title: 'What the Authors Themselves Flagged as Unfinished',
          minutes: 12,
          xp: 60,
          steps: [
            { kind: 'read', title: 'Depth, unsupervised pretraining, and scaling', markdown: critiqueMd },
            {
              kind: 'scenario',
              title: 'Applying AlexNet\'s lessons to a new problem',
              scenario: {
                intro: 'You are scoping a CNN for a new image classification task. Use what the paper itself flagged as a constraint or open question to judge each option.',
                stages: [
                  {
                    situation: 'Your team wants to cut training cost by removing one of the five convolutional layers, since it seems to contribute the least visually.',
                    question: 'What does this paper\'s own ablation suggest about that plan?',
                    options: [
                      {
                        label: 'Be cautious: the paper reports that removing any single convolutional layer measurably hurt accuracy, even middle layers that "contain no more than 1% of the model\'s parameters."',
                        quality: 'best',
                        feedback: 'Correct. The paper found depth load-bearing, not incidental: removing a middle conv layer cost about 2 points of top-1 accuracy even though it holds a small fraction of total parameters. Test the change empirically rather than assuming a layer is safe to drop because it looks small.',
                      },
                      {
                        label: 'Go ahead — convolutional layers near the start of the network rarely matter for final accuracy.',
                        quality: 'bad',
                        feedback: 'This isn\'t supported by the paper. The authors specifically measured that removing any convolutional layer degraded performance, not just early or late ones.',
                      },
                      {
                        label: 'It doesn\'t matter which layer you remove, since fully-connected layers hold most of the parameters anyway.',
                        quality: 'bad',
                        feedback: 'Parameter count and contribution to accuracy aren\'t the same thing here — the paper notes convolutional layers hold few parameters but their removal still hurts performance, precisely because parameter count isn\'t what depth was buying.',
                      },
                    ],
                  },
                  {
                    situation: 'You have a large pool of unlabeled images in your domain, but labeling them all is expensive. You\'re deciding whether unsupervised pretraining is worth exploring before fine-tuning on your smaller labeled set.',
                    question: 'How should you read the paper\'s silence on unsupervised pretraining?',
                    options: [
                      {
                        label: 'As an explicit open question, not a negative result — the authors skipped it "to simplify experiments" while explicitly expecting it would help, especially when labeled data is the scarcer resource.',
                        quality: 'best',
                        feedback: 'Right. The paper is upfront that it omitted unsupervised pretraining for simplicity, not because it tested poorly. Your situation — more unlabeled data than labeled data — is exactly the case they flagged as where it would likely help most.',
                      },
                      {
                        label: 'As evidence unsupervised pretraining doesn\'t work for CNNs, since the best result in the paper didn\'t use it.',
                        quality: 'bad',
                        feedback: 'The paper never tested unsupervised pretraining, so it provides no evidence either way — only a stated expectation that it would help in compute-rich, label-poor settings.',
                      },
                      {
                        label: 'Irrelevant — unsupervised pretraining only matters for datasets larger than ImageNet.',
                        quality: 'bad',
                        feedback: 'The paper frames it the opposite way: pretraining helps most when you have more compute than labeled data, which is a property of your dataset\'s labeling cost, not its raw size.',
                      },
                    ],
                  },
                  {
                    situation: 'Leadership asks whether the architecture in this paper represents close to the ceiling of what\'s achievable, or whether further scaling is likely to help.',
                    question: 'What does Section 7 itself say about this?',
                    options: [
                      {
                        label: 'The authors state results "have improved as we have made our network larger and trained it longer" and that they still have "many orders of magnitude to go" to match human visual performance — this is a checkpoint, not a ceiling.',
                        quality: 'best',
                        feedback: 'Correct — the paper explicitly frames itself as a point on an ongoing scaling trend, not a finished result, and even gestures at future work (video) beyond the current scope.',
                      },
                      {
                        label: 'The authors believe this architecture is near-optimal and unlikely to improve with more data or compute.',
                        quality: 'bad',
                        feedback: 'The opposite is stated directly: the trend of "larger and trained longer" improving results is ongoing, with orders of magnitude of headroom acknowledged by the authors.',
                      },
                      {
                        label: 'The paper takes no position on whether further scaling would help.',
                        quality: 'ok',
                        feedback: 'Not quite — the paper does take a position, just an optimistic one about further scaling, rather than staying silent on the question.',
                      },
                    ],
                  },
                ],
                debrief: 'Reading a paper\'s Discussion section for what it says about its own limits — not just its headline numbers — is how you avoid two failure modes: over-trusting a result past what was actually tested (unsupervised pretraining), and under-trusting a design choice the authors already validated (depth).',
              },
            },
          ],
        },
      ],
    },
  ],
}
