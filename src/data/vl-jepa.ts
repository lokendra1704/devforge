import type { Subject } from '../types'
import motivationMd from './md/vlj-motivation.md?raw'
import architectureMd from './md/vlj-architecture.md?raw'
import trainingMd from './md/vlj-training.md?raw'
import multitaskMd from './md/vlj-multitask.md?raw'
import resultsMd from './md/vlj-results.md?raw'

const vlJepa: Subject = {
  id: 'vl-jepa',
  title: 'Vision-Language JEPA',
  tagline:
    'Chen, Shukor, Moutakanni et al., Meta/FAIR, 2025 — predict continuous embeddings of text instead of tokens for efficient, low-latency vision-language understanding.',
  icon: '👁️🔗',
  accent: '#6366f1',
  modules: [
    {
      id: 'vlj-m1',
      title: 'VL-JEPA: Non-Generative Vision-Language Understanding',
      description:
        'Why predicting embeddings instead of tokens makes vision-language models more efficient, enables selective decoding for real-time video, and unifies classification, retrieval, and generation in a single architecture.',
      lessons: [
        {
          id: 'vlj-l1',
          title: 'Why Embedding Prediction?',
          minutes: 12,
          xp: 60,
          steps: [
            {
              kind: 'read',
              title: 'The problem with classical VLMs and how embedding space solves it',
              markdown: motivationMd,
            },
          ],
        },
        {
          id: 'vlj-l2',
          title: 'Architecture & Design',
          minutes: 14,
          xp: 70,
          steps: [
            {
              kind: 'read',
              title: 'Four focused components: X-Encoder, Predictor, Y-Encoder, Y-Decoder',
              markdown: architectureMd,
            },
          ],
        },
        {
          id: 'vlj-l3',
          title: 'Training & Loss Functions',
          minutes: 13,
          xp: 65,
          steps: [
            {
              kind: 'read',
              title: 'InfoNCE loss in embedding space and two-stage training',
              markdown: trainingMd,
            },
          ],
        },
        {
          id: 'vlj-l4',
          title: 'Multi-task Capabilities',
          minutes: 15,
          xp: 75,
          steps: [
            {
              kind: 'read',
              title: 'One architecture handles generation, classification, retrieval, and selective decoding',
              markdown: multitaskMd,
            },
          ],
        },
        {
          id: 'vlj-l5',
          title: 'Results & Design Trade-offs',
          minutes: 18,
          xp: 90,
          steps: [
            {
              kind: 'read',
              title: 'Empirical validation: embedding prediction beats token prediction on sample efficiency',
              markdown: resultsMd,
            },
            {
              kind: 'scenario',
              title: 'Choosing Between Architectures',
              scenario: {
                intro:
                  'VL-JEPA shows that embedding prediction is more efficient than token generation, but each approach has trade-offs. When should you choose one over the other?',
                stages: [
                  {
                    situation:
                      "You're building a live action-tracking system for smart glasses that must respond to scene changes with <50ms latency. The system needs to continuously monitor a video stream and emit semantic descriptions only when significant changes occur.",
                    question: 'Which architecture is best for this workload?',
                    options: [
                      {
                        label: 'Classical autoregressive VLM — it\'s proven and well-tested',
                        quality: 'bad',
                        feedback:
                          'Autoregressive models must generate tokens sequentially, adding latency for every token. In a continuous monitoring scenario with frequent updates, each token generation becomes a bottleneck. VL-JEPA\'s non-autoregressive design with selective decoding is purpose-built for this workload.',
                      },
                      {
                        label: 'VL-JEPA with selective decoding — monitor continuously but decode only on significant semantic shifts',
                        quality: 'best',
                        feedback:
                          'Exactly right. VL-JEPA\'s embedding space allows continuous monitoring of the semantic stream with a single forward pass, then decodes to text only when variance exceeds a threshold. This achieves ~2.85× fewer decoding operations while maintaining quality.',
                      },
                      {
                        label: 'CLIP-style classifier — fast but can\'t generate descriptions',
                        quality: 'ok',
                        feedback:
                          'CLIP is efficient for classification but doesn\'t handle generation tasks like captioning. You\'d need two separate models for different tasks, losing the unified architecture advantage.',
                      },
                    ],
                  },
                  {
                    situation:
                      'You need a single model to handle zero-shot classification, open-vocabulary retrieval, discriminative VQA, and captioning — all with minimal parameters and no task-specific fine-tuning.',
                    question: 'How should you architect the model?',
                    options: [
                      {
                        label: 'Build separate specialist models for each task',
                        quality: 'bad',
                        feedback:
                          'Possible, but multiplies model size and maintenance burden. VL-JEPA demonstrates that a unified embedding space handles all four task types without architectural modification.',
                      },
                      {
                        label: 'Use VL-JEPA\'s unified architecture — embedding space handles both generative and discriminative tasks',
                        quality: 'best',
                        feedback:
                          'Correct. By learning in an abstract embedding space instead of raw token space, VL-JEPA supports classification, retrieval, and generation all from the same representation. The paper shows this unified approach is comparable to specialist models.',
                      },
                      {
                        label: 'Use a foundation model with prompting to route tasks dynamically',
                        quality: 'ok',
                        feedback:
                          'Foundation models are flexible but expensive and unreliable for routing. VL-JEPA\'s architecture naturally supports all task types without prompting tricks.',
                      },
                    ],
                  },
                  {
                    situation:
                      'You\'re training on limited captioned video data. Both the embedding-space and token-space approaches use the same encoder, data, batch size, and compute budget. After seeing 5M training samples, which predicts performance better?',
                    question: 'Which target space is more sample-efficient?',
                    options: [
                      {
                        label: 'Token space should win — it\'s a more expressive target',
                        quality: 'bad',
                        feedback:
                          'Actually the opposite: more expressive doesn\'t mean faster learning. In token space, multiple valid answers ("the lamp is off" vs. "room will go dark") appear orthogonal because they share no tokens. Embedding space maps them to nearby points, simplifying the learning problem. The paper shows VL-JEPA reaches 14.7 CIDEr vs. VLM\'s 7.1 after 5M samples.',
                      },
                      {
                        label: 'Embedding space should win — it unifies multiple valid targets into a coherent region',
                        quality: 'best',
                        feedback:
                          'Correct. For inherently ill-posed tasks with multiple plausible answers, embedding space is fundamentally more efficient. The paper\'s controlled comparison shows VL-JEPA\'s performance rises much faster than the token baseline, even with a smaller predictor (0.5B vs 1B parameters).',
                      },
                      {
                        label: 'They should be roughly equal — the architecture doesn\'t matter much',
                        quality: 'bad',
                        feedback:
                          'The paper\'s strict controlled comparison (same encoder, data, batch size) shows architecture choices do matter: VL-JEPA demonstrates both higher sample efficiency and stronger absolute performance.',
                      },
                    ],
                  },
                ],
                debrief:
                  'VL-JEPA\'s embedding-space approach shines when (1) you need real-time, selective inference, (2) you want a unified model for diverse tasks, and (3) sample efficiency matters. Token-space VLMs remain competitive for pure generation quality and have broader tooling support, but they don\'t decouple prediction from generation the way VL-JEPA does.',
              },
            },
          ],
        },
      ],
    },
  ],
}

export default vlJepa
