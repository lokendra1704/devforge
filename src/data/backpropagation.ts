import type { Subject } from '../types'
import bpMotivationMd from './md/bp-motivation.md?raw'
import bpAlgorithmMd from './md/bp-algorithm.md?raw'
import bpDynamicsMd from './md/bp-dynamics.md?raw'
import bpSimpleProblems from './md/bp-simple-problems.md?raw'
import bpRepresentationsMd from './md/bp-representations.md?raw'
import bpImplicationsMd from './md/bp-implications.md?raw'

export const backpropagation: Subject = {
  id: 'backpropagation',
  title: 'Learning Representations by Back-Propagating Errors',
  tagline: 'The algorithm that made deep learning possible',
  icon: '🔄',
  accent: '#6366f1',
  modules: [
    {
      id: 'bp-m1',
      title: 'The Backpropagation Algorithm',
      description:
        'From the perceptron to multilayer networks: how backpropagation enables learning in deep networks by efficiently computing gradients through the chain rule.',
      lessons: [
        {
          id: 'bp-motivation',
          title: 'Why Neural Networks Need Hidden Units',
          minutes: 8,
          xp: 80,
          steps: [
            { kind: 'read', title: 'The Problem with Two-Layer Networks', markdown: bpMotivationMd },
            {
              kind: 'quiz',
              title: 'Understanding Limitations',
              questions: [
                {
                  prompt: 'Why can a two-layer network (input → output, no hidden units) not solve the XOR problem?',
                  options: [
                    'It lacks enough parameters to store XOR',
                    'The input/output similarity structure is incompatible: dissimilar inputs (00 and 11) must map to the same output',
                    'Perceptrons cannot use the delta rule',
                    'The network architecture is fundamentally flawed',
                  ],
                  answer: 1,
                  explanation:
                    'The XOR problem has a fundamental mismatch: patterns 00 and 11 are very different but should both output 0, while 01 and 10 are similar but should output 1. A two-layer network maps similar inputs to similar outputs, making this impossible without an internal representation.',
                },
                {
                  prompt: 'How do hidden units solve the representational problem?',
                  options: [
                    'They increase the total number of weights',
                    'They allow the network to recode inputs into a new representation where the output mapping becomes learnable',
                    'They enable the use of nonlinear activation functions',
                    'They automatically discover features through unsupervised learning',
                  ],
                  answer: 1,
                  explanation:
                    'Hidden units create an intermediate representation of the input patterns. With enough hidden units, we can always find a recoding of the input patterns in which the similarity structure aligns with the required output mapping.',
                },
              ],
            },
          ],
        },
        {
          id: 'bp-algorithm',
          title: 'The Generalized Delta Rule',
          minutes: 12,
          xp: 120,
          steps: [
            { kind: 'read', title: 'Forward and Backward Passes', markdown: bpAlgorithmMd },
            {
              kind: 'scenario',
              title: 'Gradient Computation Strategy',
              scenario: {
                intro:
                  'You are training a three-layer network (input → hidden → output) on a new problem. An input pattern produces the wrong output.',
                stages: [
                  {
                    situation:
                      'Your output is 0.8 but the target is 0.1. You need to adjust weights. Where do you start?',
                    question: 'Which weights should you adjust first?',
                    options: [
                      {
                        label: 'Weights from input to hidden units',
                        quality: 'bad',
                        feedback:
                          'Wrong direction. You need to first figure out what error to backpropagate, which comes from the output layer.',
                      },
                      {
                        label: 'Weights feeding into the output unit',
                        quality: 'best',
                        feedback:
                          'Correct. The output error is directly computed from the difference between actual and target. This error signal propagates backward from the output unit to the hidden units.',
                      },
                      {
                        label: 'All weights simultaneously',
                        quality: 'bad',
                        feedback: 'You need a systematic order. Backpropagation works layer by layer, starting from output.',
                      },
                    ],
                  },
                  {
                    situation:
                      'You have computed the error signal for the output unit. Now you need to update hidden units.',
                    question: 'How do you compute the error signal for a hidden unit?',
                    options: [
                      {
                        label: 'Use the same formula as the output unit (target - actual output)',
                        quality: 'bad',
                        feedback:
                          'Hidden units have no target. Their error must be derived from the units they feed into.',
                      },
                      {
                        label: 'Recursively compute it from the error signals of downstream units and connection weights',
                        quality: 'best',
                        feedback:
                          'Exactly. The hidden unit error is a weighted sum of the errors it caused in the output layer. This recursive property is what makes backpropagation efficient.',
                      },
                      {
                        label: 'Assume the hidden unit error equals zero',
                        quality: 'bad',
                        feedback: 'Hidden units contribute to the output error and must be adjusted accordingly.',
                      },
                    ],
                  },
                ],
                debrief:
                  'Backpropagation works by starting at the output (where you know the error) and working backward, computing recursive error signals for each layer. This two-pass structure—forward to compute outputs, backward to compute gradients—is what makes it efficient compared to finite differences.',
              },
            },
          ],
        },
        {
          id: 'bp-dynamics',
          title: 'Learning Dynamics: Activation, Momentum, and Learning Rates',
          minutes: 10,
          xp: 100,
          steps: [
            { kind: 'read', title: 'Making Learning Stable and Fast', markdown: bpDynamicsMd },
            {
              kind: 'quiz',
              title: 'Practical Learning Challenges',
              questions: [
                {
                  prompt:
                    'Why does the perceptron\'s linear threshold activation function (output = 1 if input > 0 else 0) not work with backpropagation?',
                  options: [
                    'It is too slow to compute',
                    'It is discontinuous; backpropagation needs the derivative of the activation function',
                    'The perceptron can only solve linearly separable problems',
                    'It does not produce binary outputs',
                  ],
                  answer: 1,
                  explanation:
                    'The linear threshold function has zero derivative almost everywhere and is undefined at the threshold. Backpropagation requires ∂output/∂input to propagate errors. The logistic function o = 1/(1+e^(-x)) is smooth and has a computable derivative: o(1-o).',
                },
                {
                  prompt:
                    'In a logistic activation function o = 1/(1+e^(-x)), when is the gradient (do/dx = o(1-o)) strongest?',
                  options: [
                    'When the output is close to 0 or 1 (extreme values)',
                    'When the output is close to 0.5 (midrange)',
                    'The gradient is constant regardless of output',
                    'When the input is zero',
                  ],
                  answer: 1,
                  explanation:
                    'The derivative o(1-o) is maximized when o = 0.5, since 0.5 × 0.5 = 0.25. This means weights change most when units are undecided (midrange output) and least when they are committed to being on or off. This contributes to learning stability.',
                },
                {
                  prompt: 'What problem does the momentum term in weight updates help solve?',
                  options: [
                    'It allows nonlinear activation functions',
                    'It filters out high-frequency oscillations in weight space, enabling faster learning through narrow ravines',
                    'It ensures the network finds the global optimum',
                    'It reduces the number of weights that need to be updated',
                  ],
                  answer: 1,
                  explanation:
                    'The error surface often has long ravines (narrow valleys) with steep walls. Gradient descent bounces back and forth across the ravine. Momentum accumulates updates in a consistent direction, smoothing out oscillations and allowing larger steps along the ravine floor.',
                },
              ],
            },
          ],
        },
        {
          id: 'bp-simple-problems',
          title: 'Learning XOR and Parity',
          minutes: 11,
          xp: 110,
          steps: [
            { kind: 'read', title: 'What Networks Learn on Simple Problems', markdown: bpSimpleProblems },
            {
              kind: 'scenario',
              title: 'Debugging Learning Failures',
              scenario: {
                intro:
                  'You train a network on the XOR problem with one hidden unit and direct connections. After thousands of iterations, it converges to a local minimum: it correctly outputs 0 for patterns 00 and 10, but outputs 0.5 for both 01 and 11.',
                stages: [
                  {
                    situation:
                      'You examine the learned weights. You notice: the hidden unit is turned on when the right input is 1 (weights from both inputs are positive and large). Both weights from hidden unit to output are zero.',
                    question: 'What went wrong?',
                    options: [
                      {
                        label: 'The learning rate was too high',
                        quality: 'bad',
                        feedback: 'The network did converge, it just converged to the wrong solution.',
                      },
                      {
                        label: 'All weights started with equal values, creating symmetry that locked the network into a partial solution',
                        quality: 'best',
                        feedback:
                          'Exactly. If all weights start equal, hidden units connected to the output receive identical error signals and develop identically. Small random initialization breaks this symmetry.',
                      },
                      {
                        label: 'The network does not have enough capacity',
                        quality: 'bad',
                        feedback: 'The network has enough units to solve XOR (proven in the paper). The issue is initialization, not capacity.',
                      },
                    ],
                  },
                  {
                    situation:
                      'You add a second hidden unit. The network still gets stuck in the same local minimum 99% of the time.',
                    question: 'How do you fix this?',
                    options: [
                      {
                        label: 'Use larger weights during initialization',
                        quality: 'bad',
                        feedback:
                          'Larger random weights might help escape some minima, but the paper finds that smaller learning rates are more reliable.',
                      },
                      {
                        label: 'Use smaller random initial weights',
                        quality: 'best',
                        feedback:
                          'Smaller initial weights make it harder for the network to get stuck in symmetry-breaking failures. The paper reports that with very small initial weights, escape becomes much more likely.',
                      },
                      {
                        label: 'Add more training examples',
                        quality: 'ok',
                        feedback: 'This helps, but the primary issue is initialization symmetry, not data insufficiency.',
                      },
                    ],
                  },
                ],
                debrief:
                  'Local minima exist but are rare in practice. The bigger issue is symmetry breaking: if weights start equal, hidden units stay synchronized and cannot develop the diverse representations needed. Random initialization solves this.',
              },
            },
          ],
        },
        {
          id: 'bp-representations',
          title: 'Complex Representations: Encoding and Sequences',
          minutes: 9,
          xp: 90,
          steps: [
            { kind: 'read', title: 'From Simple Mappings to Internal Structure', markdown: bpRepresentationsMd },
            {
              kind: 'quiz',
              title: 'Understanding Learned Representations',
              questions: [
                {
                  prompt:
                    'In the encoder problem (8 input patterns, 8 output patterns, 3 hidden units), what representation does the network learn?',
                  options: [
                    'Random activations that happen to work',
                    'A binary encoding where each hidden unit pattern encodes one input',
                    'A distributed representation where each pattern activates all hidden units equally',
                    'A hierarchical encoding from bottom-up unsupervised learning',
                  ],
                  answer: 1,
                  explanation:
                    'The network learns to use the 3 hidden units as a binary code, with each of the 8 input patterns mapping to a distinct 3-bit pattern on the hidden layer. This is a remarkably efficient and interpretable representation.',
                },
                {
                  prompt:
                    'The parity problem requires at least N hidden units for N-bit input. Why is this number necessary?',
                  options: [
                    'Because parity is NP-complete',
                    'Because the network needs one hidden unit per input bit to count them',
                    'To avoid the curse of dimensionality',
                    'Because of theoretical limits on nonlinear functions',
                  ],
                  answer: 1,
                  explanation:
                    'Parity requires knowing how many input bits are on. The network learns to have each hidden unit detect "at least k bits are on." With N hidden units, it can count from 0 to N. This counting structure emerges automatically through backpropagation.',
                },
              ],
            },
          ],
        },
        {
          id: 'bp-implications',
          title: 'Implications and Future Directions',
          minutes: 8,
          xp: 80,
          steps: [
            { kind: 'read', title: 'From Theory to Practice', markdown: bpImplicationsMd },
            {
              kind: 'quiz',
              title: 'Backpropagation in Context',
              questions: [
                {
                  prompt:
                    'The paper claims backpropagation answers the challenge posed by Minsky and Papert about learning in multilayer machines. What was their core pessimism?',
                  options: [
                    'That hidden units are too expensive to compute',
                    'That there would never be a convergent learning theorem as simple as the perceptron convergence procedure',
                    'That nonlinear activations are impossible',
                    'That networks are biologically implausible',
                  ],
                  answer: 1,
                  explanation:
                    "Minsky and Papert showed the perceptron (linear networks) has fundamental limitations. They questioned whether any powerful learning theorem exists for multilayer machines. Backpropagation provides a practical answer: gradient descent via error propagation works in virtually every case they tested.",
                },
                {
                  prompt:
                    'Why is backpropagation computationally efficient compared to computing gradients by finite differences?',
                  options: [
                    'It uses analytic derivatives instead of numerical approximation',
                    'The backward pass has the same complexity as the forward pass; finite differences would require O(n) forward passes for n weights',
                    'It avoids computing some weights',
                    'It uses parallel computation',
                  ],
                  answer: 1,
                  explanation:
                    'Computing gradients by perturbing each weight and re-running the forward pass requires O(n) forward passes. Backpropagation computes all gradients in one backward pass with the same cost as the forward pass. This makes it O(n) instead of O(n²).',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
