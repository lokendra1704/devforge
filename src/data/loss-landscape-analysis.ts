import type { Subject } from '../types'
import puzzleMd from './md/lla-optimization-puzzle.md?raw'
import interpolationMd from './md/lla-linear-interpolation.md?raw'
import feedforwardMd from './md/lla-feedforward-results.md?raw'
import advancedMd from './md/lla-advanced-networks.md?raw'

export const lossLandscapeAnalysis: Subject = {
  id: 'loss-landscape-analysis',
  title: 'Loss Landscape Analysis: Visualizing Neural Network Optimization',
  tagline:
    'Goodfellow & Vinyals, ICLR 2015 — using linear interpolation to show that neural network loss surfaces are approximately convex along the learning path, and poor conditioning, not local minima, is the bottleneck.',
  icon: '🏔️',
  accent: '#8B6BB1',
  modules: [
    {
      id: 'lla-m1',
      title: 'Linear Path Analysis of Loss Landscapes',
      description: 'Investigating neural network optimization via linear interpolation between random initialization and trained solutions.',
      lessons: [
        {
          id: 'lla-m1-l1',
          title: 'The Optimization Puzzle',
          minutes: 8,
          xp: 40,
          steps: [
            { kind: 'read', title: 'Why neural networks succeed on hard problems', markdown: puzzleMd },
          ],
        },
        {
          id: 'lla-m1-l2',
          title: 'Linear Interpolation Technique',
          minutes: 10,
          xp: 50,
          steps: [
            { kind: 'read', title: 'Slicing the loss surface with a line', markdown: interpolationMd },
          ],
        },
        {
          id: 'lla-m1-l3',
          title: 'Feedforward Networks: Nearly Convex Paths',
          minutes: 12,
          xp: 60,
          steps: [
            { kind: 'read', title: 'MNIST experiments: smooth loss from init to solution', markdown: feedforwardMd },
          ],
        },
        {
          id: 'lla-m1-l4',
          title: 'Advanced Architectures: Convnets and RNNs',
          minutes: 10,
          xp: 50,
          steps: [
            { kind: 'read', title: 'Does this pattern generalize?', markdown: advancedMd },
          ],
        },
        {
          id: 'lla-m1-l5',
          title: 'What Makes Neural Networks Trainable?',
          minutes: 6,
          xp: 40,
          steps: [
            {
              kind: 'quiz',
              title: 'Understanding the loss landscape findings',
              questions: [
                {
                  prompt:
                    'Based on linear interpolation experiments, what appears to be the primary difficulty in training neural networks?',
                  options: [
                    'Escaping local minima along the optimization path',
                    'Poor conditioning of the Hessian (slow progress along flat plateaus)',
                    'Navigating saddle points and ridges in the loss surface',
                    'Avoiding mode connectivity barriers between different solutions',
                  ],
                  answer: 1,
                  explanation:
                    'The paper finds that local minima are rare or non-existent along the linear path. The loss surface is well-behaved and approximately convex. However, SGD still struggles because it must find the correct search direction, and once found, descent is slow due to poor conditioning—most directions are flat, so increasing learning rate causes divergence in steep directions.',
                },
                {
                  prompt:
                    'The linear interpolation path shows a smooth, approximately convex curve with a wide plateau at the bottom. What does the plateau reveal about the training process?',
                  options: [
                    'The network has reached a local minimum and cannot improve further',
                    'The loss surface near the solution is nearly flat in most directions, so SGD makes slow progress despite no geometric obstacles',
                    'The training data is too simple and the network is not learning useful features',
                    'The learning rate is too small and needs to be increased',
                  ],
                  answer: 1,
                  explanation:
                    '"SGD spends most of its time exploring the flat region at the bottom of the valley." This is the signature of poor conditioning. The geometry is benign—no obstacles block the path—but numerical factors prevent fast descent.',
                },
                {
                  prompt:
                    'When local SGD solutions are found through different random seeds, interpolating between them reveals a barrier (a valley between two peaks). But this barrier does NOT prevent successful training. Why?',
                  options: [
                    'The barrier is too wide to affect optimization significantly',
                    'SGD can reduce the barrier by adjusting hyperparameters',
                    'SGD leaves the linear subspace and finds a path around the barrier via high-dimensional neighborhood',
                    'The barrier only appears when using old activation functions like sigmoid',
                  ],
                  answer: 2,
                  explanation:
                    'The actual SGD trajectory stays off the linear path. When you visualize the full trajectory (not just the interpolation), SGD naturally navigates around obstacles by exploiting the high-dimensional space. The linear path reveals what *could* be in the way; the actual trajectory finds a way around it.',
                },
              ],
            },
          ],
        },
        {
          id: 'lla-m1-l6',
          title: 'Designing a Loss Surface Visualization',
          minutes: 12,
          xp: 60,
          steps: [
            {
              kind: 'scenario',
              title: 'Debugging optimization problems with interpolation',
              scenario: {
                intro:
                  'You are debugging a new neural network architecture that trains poorly—loss decreases initially, then plateaus for most of training. You want to understand whether the problem is (a) an abundance of local minima, (b) poor conditioning, or (c) a bug in initialization or data.',
                stages: [
                  {
                    situation: 'Your first step is to diagnose the issue systematically.',
                    question: 'Which approach directly answers whether the loss landscape has geometric obstacles?',
                    options: [
                      {
                        label: 'Train with different seeds and compare final losses',
                        quality: 'ok',
                        feedback:
                          'This tells you about variation in final loss, but not why progress slows. It does not directly reveal landscape geometry.',
                      },
                      {
                        label: 'Use linear interpolation: plot J(θ_i + α(θ_f - θ_i)) for α ∈ [0, 1]',
                        quality: 'best',
                        feedback:
                          'This directly visualizes the loss surface along the learning path. A smooth, convex curve rules out geometric obstacles. If there are bumps, they reveal barriers.',
                      },
                      {
                        label: 'Compute the Hessian eigenspectrum at the final solution',
                        quality: 'ok',
                        feedback:
                          'This analyzes conditioning at the final point, but does not reveal the full optimization path or whether obstacles exist en route.',
                      },
                      {
                        label: 'Monitor gradient norms and step sizes during training',
                        quality: 'bad',
                        feedback:
                          'Indirect evidence only. Does not isolate geometric problems from numerical issues.',
                      },
                    ],
                  },
                  {
                    situation:
                      'You run the interpolation experiment. The plot shows a smooth, nearly convex curve with no local minima, but a wide flat plateau at the bottom. Training still plateaus.',
                    question: 'What does this tell you about why training is slow?',
                    options: [
                      {
                        label: 'There is a bug in gradient computation or initialization',
                        quality: 'bad',
                        feedback:
                          'A smooth, convex path is actually a good sign—it rules out geometric obstacles. If training is slow with good geometry, the problem is numerical, not algorithmic.',
                      },
                      {
                        label: 'Poor conditioning is the bottleneck, not local minima',
                        quality: 'best',
                        feedback:
                          'Exactly. The linear path shows that geometry is not the problem. SGD is slow because the Hessian is ill-conditioned—most directions are flat, so increasing learning rate causes divergence in steep directions.',
                      },
                      {
                        label: 'The network is over-regularized and needs higher learning rate',
                        quality: 'bad',
                        feedback:
                          'Poor conditioning is not the same as weak gradients. Increasing the learning rate in an ill-conditioned region just causes divergence.',
                      },
                      {
                        label: 'Linear interpolation is irrelevant because SGD is nonlinear',
                        quality: 'bad',
                        feedback:
                          'True that SGD does not follow the linear path, but the interpolation curve reveals local geometry. A convex curve proves no obstacles block the main learning direction.',
                      },
                    ],
                  },
                  {
                    situation:
                      'Now you understand the problem: poor conditioning, not geometry. You want to improve convergence speed.',
                    question: "Which strategy aligns with the paper's findings?",
                    options: [
                      {
                        label: 'Use momentum or adaptive learning rates to handle flat regions better',
                        quality: 'best',
                        feedback:
                          'The paper shows that once you find the right direction, descent is smooth. Momentum and adaptive methods (Adam, RMSprop) adapt learning rates per-dimension to handle uneven curvature.',
                      },
                      {
                        label: 'Add more layers to avoid local minima',
                        quality: 'bad',
                        feedback:
                          'Local minima are not the problem. The paper found them to be rare and not the bottleneck. Adding depth does not fix conditioning issues.',
                      },
                      {
                        label: 'Use unsupervised pretraining to escape local minima',
                        quality: 'ok',
                        feedback:
                          'Pretraining might help by providing a better initialization direction, but it does not directly address conditioning. The paper implies pretraining works for reasons other than escaping minima.',
                      },
                      {
                        label: 'Reduce the batch size to add noise and escape plateaus',
                        quality: 'bad',
                        feedback:
                          'Smaller batches add gradient noise, which can help with certain problems, but they do not fix fundamental ill-conditioning.',
                      },
                    ],
                  },
                ],
                debrief:
                  'The loss landscape analysis teaches us that **local minima are not the primary enemy**. The real challenge is **finding the right search direction** and **handling poor curvature** once you find it. Modern optimizers (Adam, momentum) succeed by adapting to this uneven terrain, not by escaping nonexistent obstacles.',
              },
            },
          ],
        },
      ],
    },
  ],
}
