import type { Subject } from '../types'
import pcMotivationMd from './md/pc-motivation.md?raw'
import pcArchitectureMd from './md/pc-architecture.md?raw'
import pcLearningMd from './md/pc-learning.md?raw'
import pcResultsMd from './md/pc-results.md?raw'
import pcLimitationsMd from './md/pc-limitations.md?raw'

export const perceptron: Subject = {
  id: 'perceptron',
  title: 'The Perceptron',
  tagline: 'Foundational model of learning in random networks',
  icon: '🧠',
  accent: '#9C27B0',
  modules: [
    {
      id: 'pc-m1',
      title: 'The Perceptron: A Learning System',
      description: 'Rosenblatt\'s 1958 theory of how randomly connected neural networks learn to recognize patterns and generalize from experience through local learning rules.',
      lessons: [
        {
          id: 'pc-l1',
          title: 'Why We Need Artificial Learning Systems',
          minutes: 8,
          xp: 100,
          steps: [
            {
              kind: 'read',
              title: 'Why We Need Artificial Learning Systems',
              markdown: pcMotivationMd
            }
          ]
        },
        {
          id: 'pc-l2',
          title: 'Architecture: The Three Layers',
          minutes: 10,
          xp: 120,
          steps: [
            {
              kind: 'read',
              title: 'Architecture: The Three Layers',
              markdown: pcArchitectureMd
            }
          ]
        },
        {
          id: 'pc-l3',
          title: 'How Learning Rules Shape Behavior',
          minutes: 9,
          xp: 110,
          steps: [
            {
              kind: 'read',
              title: 'How Learning Rules Shape Behavior',
              markdown: pcLearningMd
            }
          ]
        },
        {
          id: 'pc-l4',
          title: 'Implement the Perceptron Learning Rule',
          minutes: 25,
          xp: 300,
          steps: [
            {
              kind: 'code',
              title: 'Implement the Perceptron Learning Rule',
              challenge: {
                prompt: 'Implement a perceptron that learns binary classifications. When a pattern activates association units (features) and produces a response, update the value (strength) of active units based on whether the response was correct. Use the gamma-system rule: active units gain value proportional to their activity, while inactive units in the same source-set lose value, keeping total source-set value constant.',
                starterCode: `function createPerceptron(numFeatures: number, numResponses: number = 2) {
  const value: number[][] = [];
  for (let i = 0; i < numFeatures; i++) {
    value[i] = [];
    for (let r = 0; r < numResponses; r++) {
      value[i][r] = Math.random() - 0.5;
    }
  }

  function predict(activeFeatures: number[]): number {
    const activation = new Array(numResponses).fill(0);
    for (const f of activeFeatures) {
      for (let r = 0; r < numResponses; r++) {
        activation[r] += value[f][r];
      }
    }
    return activation.reduce((max, a, i) => a > activation[max] ? i : max, 0);
  }

  function learn(activeFeatures: number[], correctResponse: number, learningRate: number = 0.1) {
    const predicted = predict(activeFeatures);
    // TODO: Implement gamma-system learning
    // For each active feature:
    //   value[f][correctResponse] += learningRate
    //   if (predicted !== correctResponse) value[f][predicted] -= learningRate
  }

  function getWeights() {
    return value;
  }

  return { predict, learn, getWeights };
}`,
                solution: `function createPerceptron(numFeatures: number, numResponses: number = 2) {
  const value: number[][] = [];
  for (let i = 0; i < numFeatures; i++) {
    value[i] = [];
    for (let r = 0; r < numResponses; r++) {
      value[i][r] = Math.random() - 0.5;
    }
  }

  function predict(activeFeatures: number[]): number {
    const activation = new Array(numResponses).fill(0);
    for (const f of activeFeatures) {
      for (let r = 0; r < numResponses; r++) {
        activation[r] += value[f][r];
      }
    }
    return activation.reduce((max, a, i) => a > activation[max] ? i : max, 0);
  }

  function learn(activeFeatures: number[], correctResponse: number, learningRate: number = 0.1) {
    const predicted = predict(activeFeatures);
    for (const f of activeFeatures) {
      value[f][correctResponse] += learningRate;
      if (predicted !== correctResponse) {
        value[f][predicted] -= learningRate;
      }
    }
  }

  function getWeights() {
    return value;
  }

  return { predict, learn, getWeights };
}`,
                tests: `test('Perceptron learns binary classification', () => {
  const p = createPerceptron(4, 2);
  const examples = [
    { activeFeatures: [0, 1], label: 0 },
    { activeFeatures: [2, 3], label: 1 },
    { activeFeatures: [0, 2], label: 0 },
    { activeFeatures: [1, 3], label: 1 }
  ];

  for (let epoch = 0; epoch < 50; epoch++) {
    for (const ex of examples) {
      p.learn(ex.activeFeatures, ex.label, 0.1);
    }
  }

  let correct = 0;
  for (const ex of examples) {
    const pred = p.predict(ex.activeFeatures);
    if (pred === ex.label) correct++;
  }

  assertEqual(correct >= 3, true, 'At least 75% accuracy');
});

test('Predictions change after learning', () => {
  const p = createPerceptron(2, 2);
  for (let i = 0; i < 20; i++) {
    p.learn([0], 1, 0.2);
  }
  const pred = p.predict([0]);
  assertEqual(pred, 1, 'Feature 0 should predict response 1');
});`
              }
            }
          ]
        },
        {
          id: 'pc-l5',
          title: 'Experimental Results: Ideal and Structured Worlds',
          minutes: 11,
          xp: 130,
          steps: [
            {
              kind: 'read',
              title: 'Experimental Results: Ideal and Structured Worlds',
              markdown: pcResultsMd
            }
          ]
        },
        {
          id: 'pc-l6',
          title: 'Limits of Statistical Separability',
          minutes: 9,
          xp: 110,
          steps: [
            {
              kind: 'read',
              title: 'Limits of Statistical Separability',
              markdown: pcLimitationsMd
            }
          ]
        },
        {
          id: 'pc-l7',
          title: 'When Should You Use a Perceptron?',
          minutes: 12,
          xp: 200,
          steps: [
            {
              kind: 'scenario',
              title: 'When Should You Use a Perceptron?',
              scenario: {
                intro: 'Understand the perceptron\'s capabilities and limitations across different learning problems. Rosenblatt\'s work reveals fundamental boundaries between what statistical separability can and cannot do.',
                stages: [
                  {
                    situation: 'You\'re building a handwritten digit classifier. Digits 0-9 form distinct, visually separable classes. You have thousands of labeled examples.',
                    question: 'Which approach works best?',
                    options: [
                      {
                        label: 'Use a perceptron with many association units and structured (localized) connections',
                        quality: 'best',
                        feedback: 'Correct. This is an ideal domain: digits are concrete visual patterns in a differentiated environment. A perceptron with enough association units can learn to recognize each digit and generalize to new examples. The structured connections help detect visual features.'
                      },
                      {
                        label: 'Use a perceptron with fully random connections everywhere',
                        quality: 'ok',
                        feedback: 'Suboptimal. While random connections can work for simple problems, structured locality helps. The projection area in Rosenblatt\'s design (with clustered connections) performs better because it discovers feature detectors—exactly what you need for digits.'
                      },
                      {
                        label: 'A perceptron cannot solve this problem at all',
                        quality: 'bad',
                        feedback: 'Incorrect. Rosenblatt proved perceptrons can classify visual patterns, and digits are exactly the kind of differentiated environment where perceptrons succeed.'
                      }
                    ]
                  },
                  {
                    situation: 'You need to classify relationships: "object A is to the left of object B" vs. "object B is to the left of object A." The relationship is the same pair of objects in different spatial order.',
                    question: 'Can a perceptron solve this?',
                    options: [
                      {
                        label: 'A perceptron can learn this with enough association units',
                        quality: 'bad',
                        feedback: 'Incorrect. This is a relationship classification problem, not a stimulus classification. The perceptron\'s statistical separability principle fails because the two classes don\'t differ in feature activation—they differ in the relationship between features. Rosenblatt explicitly noted this as the perceptron\'s fundamental limit.'
                      },
                      {
                        label: 'A perceptron cannot solve this—it requires symbolic reasoning about spatial relationships',
                        quality: 'best',
                        feedback: 'Correct. This exceeds the perceptron\'s capabilities. The perceptron excels at learning concrete stimulus patterns but breaks down on abstract relationships. You would need a system that can explicitly represent and reason about spatial relationships.'
                      },
                      {
                        label: 'Use a bivalent perceptron with trial-and-error learning',
                        quality: 'ok',
                        feedback: 'Suboptimal. Bivalent reinforcement helps with trial-and-error learning, but it doesn\'t solve the fundamental problem: the perceptron can\'t reason about spatial relationships because such reasoning requires thinking about connections between patterns, not just pattern classification.'
                      }
                    ]
                  },
                  {
                    situation: 'Your data is completely random: each input is a random collection of features, and you arbitrarily assign half to class A and half to class B. There are no natural clusters or similarity patterns.',
                    question: 'How will a perceptron perform?',
                    options: [
                      {
                        label: 'A perceptron will learn perfectly on training data but cannot generalize',
                        quality: 'best',
                        feedback: 'Correct. This is the "ideal environment" from the paper. A perceptron can memorize arbitrary stimulus-response associations but generalization fails because there\'s no underlying structure. Without natural similarity patterns, the perceptron has nothing to learn about class membership—only about individual stimuli.'
                      },
                      {
                        label: 'A perceptron will generalize poorly but can be improved with more association units',
                        quality: 'ok',
                        feedback: 'Partially correct. More units don\'t help much here because the problem is not network capacity—it\'s the absence of structure in the data. No amount of association units will create structure where none exists.'
                      },
                      {
                        label: 'A perceptron is ideal for learning random patterns',
                        quality: 'bad',
                        feedback: 'Incorrect. Random patterns are the worst case for the perceptron. Generalization requires exploitable structure, which random data lacks.'
                      }
                    ]
                  },
                  {
                    situation: 'You\'re designing a robot that must learn from positive and negative reinforcement (reward and punishment) with no human guidance on the "correct" answer.',
                    question: 'Which learning system fits?',
                    options: [
                      {
                        label: 'Use a bivalent perceptron system that applies positive/negative value changes based on reward/punishment',
                        quality: 'best',
                        feedback: 'Correct. This is exactly what bivalent systems were designed for. By allowing active units to gain or lose value based on reinforcement outcomes, the perceptron can do trial-and-error learning. It will gradually strengthen associations that lead to reward and weaken those that lead to punishment.'
                      },
                      {
                        label: 'Use a monovalent perceptron and force correct responses when the robot makes mistakes',
                        quality: 'ok',
                        feedback: 'Suboptimal. Monovalent systems require forced responses (supervised training), which means you must know the right answer and impose it. For true trial-and-error learning with only reward/punishment signals, you need bivalent systems.'
                      },
                      {
                        label: 'A perceptron cannot learn from reward/punishment at all',
                        quality: 'bad',
                        feedback: 'Incorrect. Rosenblatt designed bivalent systems specifically for this purpose. They enable genuine trial-and-error learning using reinforcement signals rather than forced correct responses.'
                      }
                    ]
                  }
                ],
                debrief: 'The perceptron\'s power and limitations flow directly from its core principle: statistical separability. When stimuli naturally cluster by class, the perceptron discovers and exploits that structure. But when the problem requires reasoning about relationships between stimuli, or when there is no structure to exploit, the perceptron reaches its boundary. Rosenblatt was clear: "Some system, more advanced in principle than the perceptron, seems to be required." That boundary would shape machine learning for decades.'
              }
            }
          ]
        },
        {
          id: 'pc-l8',
          title: 'Key Concepts',
          minutes: 10,
          xp: 150,
          steps: [
            {
              kind: 'quiz',
              title: 'Key Concepts',
              questions: [
                {
                  prompt: 'Why did Rosenblatt use probability theory instead of Boolean algebra to analyze the perceptron?',
                  options: [
                    'Boolean algebra cannot represent learning',
                    'Probability theory allows analysis of systems where only gross organization is known, not precise structure',
                    'Probability theory is more biologically realistic than logic',
                    'Boolean algebra didn\'t exist in 1958'
                  ],
                  answer: 1,
                  explanation: 'Rosenblatt\'s insight was using probability theory as a mathematical language for systems where you know the parameters but not the complete wiring diagram—which describes both the brain and practical learning systems.'
                },
                {
                  prompt: 'In the gamma-system learning rule, why does keeping total source-set value constant improve performance?',
                  options: [
                    'It prevents the system from "forgetting" old associations',
                    'It prevents value imbalances from amplifying small statistical fluctuations and creating instability',
                    'It makes the system\'s computations faster',
                    'It forces all features to have equal importance'
                  ],
                  answer: 1,
                  explanation: 'The paper shows mathematically that unbounded growth creates statistical problems. The gamma-system\'s constraint avoids these by keeping value magnitudes stable relative to activation patterns.'
                },
                {
                  prompt: 'What is the fundamental difference between learning in an "ideal environment" (random stimuli) vs. a "differentiated environment" (stimulus classes)?',
                  options: [
                    'Differentiated environments have more training examples',
                    'In ideal environments, the perceptron can only memorize specific stimuli; in differentiated environments, it can extract and generalize class patterns',
                    'Differentiated environments don\'t require learning at all',
                    'The perceptron uses different learning rules in each case'
                  ],
                  answer: 1,
                  explanation: 'This is the paper\'s key insight: the perceptron\'s learning rule is universal, but its success depends entirely on whether the data has exploitable structure. No structure means no generalization, regardless of network size.'
                },
                {
                  prompt: 'Why can a perceptron learn "name the color if the stimulus is on the left" but not "name the object to the left of the square"?',
                  options: [
                    'The first is too simple for perceptrons to handle',
                    'The first depends on concrete stimulus features; the second requires reasoning about spatial relationships between two objects',
                    'Modern perceptrons can do both; only Rosenblatt\'s 1958 version couldn\'t',
                    'The second requires more training data'
                  ],
                  answer: 1,
                  explanation: 'Rosenblatt explicitly identified this boundary. The perceptron works via statistical separability of stimulus classes. Relationships require symbolic reasoning—the perceptron\'s fundamental limit.'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
