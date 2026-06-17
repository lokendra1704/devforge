import type { Subject } from '../types'
import motivationMd from './md/vj-motivation.md?raw'
import architectureMd from './md/vj-architecture.md?raw'
import scalingMd from './md/vj-scaling.md?raw'
import understandingMd from './md/vj-understanding.md?raw'
import actionConditioningMd from './md/vj-action-conditioning.md?raw'
import robotPlanningMd from './md/vj-robot-planning.md?raw'
import anticipationMd from './md/vj-anticipation.md?raw'
import vqaMd from './md/vj-vqa.md?raw'

export const vjepa2: Subject = {
  id: 'v-jepa-2',
  title: 'V-JEPA 2: Self-Supervised Video Models',
  tagline: 'Learn to understand, predict, and plan using large-scale video pretraining',
  icon: '🎥',
  accent: '#6366F1',
  modules: [
    {
      id: 'vj2-m1',
      title: 'Video Pretraining: Foundations',
      description: 'Self-supervised learning from 1M hours of internet video',
      lessons: [
        {
          id: 'vj2-m1-l1',
          title: 'Motivation: Why Learn from Video?',
          minutes: 10,
          xp: 50,
          steps: [
            { kind: 'read', title: 'The world model hypothesis', markdown: motivationMd },
            {
              kind: 'quiz',
              title: 'Understanding the motivation',
              questions: [
                {
                  prompt: 'Why does a video generation approach waste computation compared to JEPA?',
                  options: [
                    'It predicts unpredictable details like leaf rustles and grass blades',
                    'It uses pixel-space predictions which are inherently lossy',
                    'It requires more labeled data than JEPA',
                    'It cannot process long video sequences',
                  ],
                  answer: 0,
                  explanation:
                    'Generative models must predict the exact appearance of each pixel, including noise and unpredictable details that don\'t inform planning. JEPA abstracts to structure and dynamics in representation space, ignoring this noise (Section 1, Introduction).',
                },
              ],
            },
          ],
        },
        {
          id: 'vj2-m1-l2',
          title: 'Joint-Embedding Predictive Architecture',
          minutes: 12,
          xp: 60,
          steps: [
            { kind: 'read', title: 'Mask-denoising in representation space', markdown: architectureMd },
            {
              kind: 'quiz',
              title: 'JEPA mechanics',
              questions: [
                {
                  prompt: 'What is the purpose of the stop-gradient operation in the JEPA loss?',
                  options: [
                    'To prevent the model from predicting identical embeddings for all inputs',
                    'To reduce training time by skipping gradient computation',
                    'To enforce sparse representations',
                    'To increase the diversity of training data',
                  ],
                  answer: 0,
                  explanation:
                    'Without stop-gradient on the EMA-encoder targets, both the encoder and predictor could collapse to outputting the same constant vector. Stop-gradient prevents this by forcing the target encoder to evolve independently (Section 2, Eq. 1).',
                },
              ],
            },
          ],
        },
        {
          id: 'vj2-m1-l3',
          title: 'Scaling V-JEPA 2',
          minutes: 14,
          xp: 70,
          steps: [
            { kind: 'read', title: 'Four key ingredients for efficient scaling', markdown: scalingMd },
            {
              kind: 'quiz',
              title: 'Scaling ingredients',
              questions: [
                {
                  prompt: 'How much total performance improvement do the four scaling ingredients provide?',
                  options: ['+1.5 percentage points', '+4.0 percentage points', '+8.0 percentage points', '+2.3 percentage points'],
                  answer: 1,
                  explanation:
                    'Data scaling (+1.0), model scaling (+1.5), longer training (+0.8), and higher resolution (+0.7) sum to +4.0 points total (Section 2.2).',
                },
              ],
            },
          ],
        },
        {
          id: 'vj2-m1-l4',
          title: 'Understanding Task Performance',
          minutes: 11,
          xp: 60,
          steps: [
            { kind: 'read', title: 'How V-JEPA 2 excels at motion understanding', markdown: understandingMd },
            {
              kind: 'quiz',
              title: 'Performance and strengths',
              questions: [
                {
                  prompt: 'On which category of tasks does V-JEPA 2 show the largest advantage?',
                  options: [
                    'Motion understanding tasks like Something-Something v2',
                    'Appearance understanding tasks like ImageNet',
                    'Both equally',
                    'Kinetics-400 action recognition',
                  ],
                  answer: 0,
                  explanation:
                    'V-JEPA 2 achieves 75.3% on SSv2 vs. 69.7% for InternVideo2 (+5.6 points), but only 86.6% on ImageNet vs. 95.3% for specialized models. Motion understanding is its strength (Table 4, Section 5).',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'vj2-m2',
      title: 'Action-Conditioned Models and Robot Planning',
      description: 'From observation to action: building world models for robotics',
      lessons: [
        {
          id: 'vj2-m2-l1',
          title: 'From Observation to Action',
          minutes: 12,
          xp: 60,
          steps: [
            { kind: 'read', title: 'Why action-conditioning matters for planning', markdown: actionConditioningMd },
            {
              kind: 'quiz',
              title: 'Action-conditioning insights',
              questions: [
                {
                  prompt: 'Why does V-JEPA 2-AC freeze the V-JEPA 2 encoder rather than fine-tuning it?',
                  options: [
                    'To avoid overfitting with limited (62 hours) robot interaction data',
                    'Because the encoder has already converged and can\'t improve',
                    'To reduce training time',
                    'The encoder is hardware-optimized and cannot be modified',
                  ],
                  answer: 0,
                  explanation:
                    'With only 62 hours of robot data, fine-tuning a 1B-parameter encoder would overfit and lose the rich representations learned from 1M hours of internet video. Freezing enables transfer learning (Section 3, Introduction).',
                },
              ],
            },
          ],
        },
        {
          id: 'vj2-m2-l2',
          title: 'Robot Manipulation Results',
          minutes: 13,
          xp: 70,
          steps: [
            { kind: 'read', title: 'Zero-shot control on novel objects and environments', markdown: robotPlanningMd },
            {
              kind: 'quiz',
              title: 'Robot control performance',
              questions: [
                {
                  prompt: 'On which tasks does V-JEPA 2-AC show the largest advantage over Octo?',
                  options: [
                    'Object-interaction tasks like grasping and pick-and-place',
                    'Simple reaching tasks',
                    'All tasks equally',
                    'Tasks with multiple object types',
                  ],
                  answer: 0,
                  explanation:
                    'Both models achieve 100% on reaching. But V-JEPA 2-AC reaches 65–75% on object manipulation vs. Octo\'s 15–20%. V-JEPA 2-AC generalizes to novel objects because it learns physics (Table 2–3, Section 4.2).',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'vj2-m3',
      title: 'Video Understanding and Language Alignment',
      description: 'Multiple downstream tasks from a single representation',
      lessons: [
        {
          id: 'vj2-m3-l1',
          title: 'Understanding Motion and Appearance',
          minutes: 11,
          xp: 60,
          steps: [
            { kind: 'read', title: 'Probe-based classification on six downstream tasks', markdown: understandingMd },
          ],
        },
        {
          id: 'vj2-m3-l2',
          title: 'Action Anticipation from Context',
          minutes: 12,
          xp: 65,
          steps: [
            { kind: 'read', title: 'Predicting human actions 1 second in the future', markdown: anticipationMd },
            {
              kind: 'quiz',
              title: 'Anticipation and transfer learning',
              questions: [
                {
                  prompt: 'Why does V-JEPA 2, trained only on self-supervised video prediction, excel at action anticipation?',
                  options: [
                    'Predicting future video frames requires understanding motion dynamics, which directly applies to action prediction',
                    'Action anticipation is a simpler task than motion understanding',
                    'The Epic-Kitchens dataset is similar to the training data',
                    'V-JEPA 2 has explicit action labels during pretraining',
                  ],
                  answer: 0,
                  explanation:
                    'JEPA pretraining (predicting masked future frames) is fundamentally about learning motion dynamics. This transfers directly to action anticipation (Section 6, Introduction and Results).',
                },
              ],
            },
          ],
        },
        {
          id: 'vj2-m3-l3',
          title: 'Video Question Answering with Language',
          minutes: 13,
          xp: 70,
          steps: [
            { kind: 'read', title: 'Connecting visual representations to natural language understanding', markdown: vqaMd },
            {
              kind: 'quiz',
              title: 'Language alignment insights',
              questions: [
                {
                  prompt: 'Why does V-JEPA 2 (trained without language supervision) outperform language-supervised encoders on temporal understanding?',
                  options: [
                    'Language supervision biases encoders toward appearance; motion supervision optimizes for dynamics',
                    'V-JEPA 2 has more parameters than other encoders',
                    'Temporal understanding tasks are easier than appearance understanding',
                    'V-JEPA 2 has access to more training data',
                  ],
                  answer: 0,
                  explanation:
                    'Language-supervised encoders (CLIP, SigLIP) optimize for semantic similarity to captions, emphasizing static appearance. V-JEPA 2 optimizes for motion dynamics. Temporal reasoning requires understanding motion, so V-JEPA 2\'s training objective is better-aligned (Section 7.2).',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
