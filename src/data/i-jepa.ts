import type { Subject } from '../types'
import motivationMd from './md/ij-motivation.md?raw'
import backgroundEbmMd from './md/ij-background-ebm.md?raw'
import methodArchitectureMd from './md/ij-method-architecture.md?raw'
import resultsScalabilityMd from './md/ij-results-scalability.md?raw'
import ablationsMd from './md/ij-ablations.md?raw'

export const iJepa: Subject = {
  id: 'i-jepa',
  title: 'I-JEPA: Image-based Joint-Embedding Predictive Architecture',
  tagline:
    'Assran, Duval, Misra, Bojanowski, Vincent, Rabbat, LeCun & Ballas, 2023 — self-supervised image representations by predicting masked patch embeddings, not pixels.',
  icon: '🧩',
  accent: '#ec4899',
  modules: [
    {
      id: 'ij-m1',
      title: 'I-JEPA: Predict Representations, Not Pixels',
      description:
        'Why neither augmentation-based nor pixel-reconstruction self-supervised learning was enough, and how predicting masked embeddings gets both semantic quality and efficiency.',
      lessons: [
        {
          id: 'ij-motivation',
          title: 'The gap between two families of self-supervised learning',
          minutes: 10,
          xp: 50,
          steps: [
            { kind: 'read', title: 'Augmentations vs. pixel reconstruction — pick your poison', markdown: motivationMd },
            {
              kind: 'quiz',
              title: 'Check: why neither approach was enough',
              questions: [
                {
                  prompt: 'Why can hand-crafted view augmentations (crop, color-jitter) hurt some downstream tasks?',
                  options: [
                    'They are too computationally expensive to apply at scale',
                    'They encode invariances appropriate for some tasks (e.g. classification) but wrong for others (e.g. depth prediction), and don\'t generalize beyond images',
                    'They only work with convolutional networks, not Vision Transformers',
                    'They require labeled data to construct',
                  ],
                  answer: 1,
                  explanation:
                    'The paper notes image classification and instance segmentation "do not require the same invariances" — augmentations bake in assumptions about what should and shouldn\'t matter, and those assumptions are both task-specific and image-specific (they don\'t generalize to audio or text).',
                },
                {
                  prompt: 'Masked Autoencoders (MAE) avoid hand-crafted augmentations by reconstructing masked patches. What is their main weakness, per the paper?',
                  options: [
                    'They cannot be trained on ImageNet-scale data',
                    'They require negative examples like contrastive methods',
                    'Reconstructing in pixel space wastes capacity on low-level detail, yielding lower-semantic representations that need heavy fine-tuning',
                    'They are slower per training step than every other method',
                  ],
                  answer: 2,
                  explanation:
                    'The paper states reconstruction methods "typically [produce representations] of a lower semantic level and underperform invariance-based pretraining in off-the-shelf evaluations" — because pixel-level reconstruction forces the model to model irrelevant low-level detail.',
                },
              ],
            },
          ],
        },
        {
          id: 'ij-background-ebm',
          title: 'Three architectures, one energy-based framing',
          minutes: 10,
          xp: 50,
          steps: [
            { kind: 'read', title: 'Joint-Embedding vs. Generative vs. Joint-Embedding Predictive', markdown: backgroundEbmMd },
            {
              kind: 'quiz',
              title: 'Check: where does JEPA sit?',
              questions: [
                {
                  prompt: 'What distinguishes a Joint-Embedding Predictive Architecture (JEPA) from a plain Generative Architecture?',
                  options: [
                    'JEPA uses no decoder or predictor at all',
                    'JEPA applies its loss in embedding space (predicting representations), while Generative Architectures reconstruct in input/pixel space',
                    'JEPA never conditions on any latent variable z',
                    'JEPA only works with contrastive losses',
                  ],
                  answer: 1,
                  explanation:
                    'Per Section 2: "a key difference is that the loss function is applied in embedding space, not input space" — JEPAs predict embeddings of y from x via a predictor conditioned on z, rather than reconstructing y\'s raw signal.',
                },
                {
                  prompt: 'Why is representation collapse a concern for JEPA but not for a Generative Architecture?',
                  options: [
                    'JEPA uses more parameters, which always causes collapse',
                    'JEPA\'s loss lives in embedding space (like Joint-Embedding Architectures), so a trivial constant-output encoder can satisfy the loss; a Generative Architecture\'s decoder must reconstruct the actual signal, which a constant output cannot do',
                    'Generative Architectures don\'t use neural networks',
                    'Collapse only happens with Vision Transformers',
                  ],
                  answer: 1,
                  explanation:
                    'Generative Architectures are safe from collapse "as long as the informational capacity of z is low compared to the signal y" — the decoder still has to produce the real signal. JEPA, predicting in embedding space, can trivially satisfy a naive loss by collapsing to a constant, just like Joint-Embedding Architectures.',
                },
              ],
            },
          ],
        },
        {
          id: 'ij-method-architecture',
          title: 'Context encoder, target encoder, predictor',
          minutes: 14,
          xp: 60,
          steps: [
            { kind: 'read', title: 'Inside I-JEPA: masking, prediction, and the EMA target', markdown: methodArchitectureMd },
            {
              kind: 'quiz',
              title: 'Check: the I-JEPA mechanics',
              questions: [
                {
                  prompt: 'Why does I-JEPA mask the target encoder\'s OUTPUT rather than masking the input image before encoding it?',
                  options: [
                    'Masking the output is computationally cheaper',
                    'Masking the input would give the target encoder only partial image context, producing lower-semantic target representations — masking the output lets it see the whole image first',
                    'It has no effect either way — the paper just picked one arbitrarily',
                    'Output masking is required by the Vision Transformer architecture',
                  ],
                  answer: 1,
                  explanation:
                    'The paper calls this "crucial to ensure target representations of a high semantic level" — the target encoder processes the full, unmasked image and only the resulting representations are split into target blocks afterward.',
                },
                {
                  prompt: 'How does I-JEPA prevent representation collapse?',
                  options: [
                    'By using a large batch size with hard negative mining',
                    'By updating the target encoder only via an exponential moving average of the context encoder weights, never directly via gradient descent — an asymmetric architecture',
                    'By adding a contrastive loss term between context and target',
                    'By never sharing any weights between the context and target encoders',
                  ],
                  answer: 1,
                  explanation:
                    'The target encoder θ̄ is updated via EMA of the context encoder θ, while only the predictor and context encoder receive gradients. This asymmetry — the same family of trick used by BYOL and DINO — makes the trivial constant-output solution unreachable by gradient descent.',
                },
                {
                  prompt: 'Why does the context block have overlapping target regions removed before being fed to the context encoder?',
                  options: [
                    'To reduce GPU memory usage',
                    'To prevent the model from solving the prediction task by simply copying visible pixels that overlap the target — keeping the task genuinely predictive',
                    'Because Vision Transformers cannot process overlapping patches',
                    'It has no functional purpose, just simplifies masking code',
                  ],
                  answer: 1,
                  explanation:
                    'If target blocks overlapped the context, the model could "predict" the target representation by trivially passing through visible information rather than learning to predict missing content — removing overlap forces real generalization.',
                },
              ],
            },
          ],
        },
        {
          id: 'ij-results-scalability',
          title: 'Results: semantic quality and compute efficiency',
          minutes: 14,
          xp: 60,
          steps: [
            { kind: 'read', title: 'Beating MAE on quality and on compute', markdown: resultsScalabilityMd },
            {
              kind: 'code',
              title: 'Compute the total compute ratio',
              challenge: {
                prompt: `## Why a slower-per-step method can still win on total compute

Section 7 explains I-JEPA's efficiency advantage over MAE with two numbers:
I-JEPA is about **7% slower per training iteration** (computing targets in
representation space costs extra), but converges in roughly **5× fewer
iterations**.

Write a function that, given a per-step slowdown fraction and an iteration
speedup factor (relative to a baseline method), returns the **total compute
ratio** relative to that baseline (less than 1.0 means I-JEPA-style method uses
less total compute):

\`totalComputeRatio = (1 + perStepSlowdownFraction) / iterationSpeedupFactor\`

Also write \`percentComputeSaved(ratio)\` that converts a ratio into a percentage
of compute saved versus the baseline (e.g. a ratio of 0.5 means 50% saved).`,
                starterCode: `function totalComputeRatio(perStepSlowdownFraction, iterationSpeedupFactor) {
  // ratio = (1 + slowdown) / speedup

}

function percentComputeSaved(ratio) {
  // 1.0 ratio = 0% saved, 0.5 ratio = 50% saved

}`,
                solution: `function totalComputeRatio(perStepSlowdownFraction, iterationSpeedupFactor) {
  return (1 + perStepSlowdownFraction) / iterationSpeedupFactor;
}

function percentComputeSaved(ratio) {
  return (1 - ratio) * 100;
}`,
                tests: `test('totalComputeRatio: I-JEPA vs MAE (7% slower, 5x fewer iterations)', () => {
  const ratio = totalComputeRatio(0.07, 5);
  assertEqual(Math.round(ratio * 1000) / 1000, 0.214);
});
test('totalComputeRatio: no change baseline (0% slowdown, 1x iterations)', () => {
  const ratio = totalComputeRatio(0, 1);
  assertEqual(ratio, 1);
});
test('totalComputeRatio: 50% slower per step but 2x fewer iterations is a wash', () => {
  const ratio = totalComputeRatio(0.5, 2);
  assertEqual(ratio, 0.75);
});
test('percentComputeSaved: ratio of 0.214 means ~78.6% saved', () => {
  const saved = percentComputeSaved(0.214);
  assertEqual(Math.round(saved * 10) / 10, 78.6);
});
test('percentComputeSaved: ratio of 1.0 means 0% saved', () => {
  assertEqual(percentComputeSaved(1), 0);
});`,
              },
            },
          ],
        },
        {
          id: 'ij-ablations',
          title: 'Ablations: which design choices actually matter',
          minutes: 12,
          xp: 55,
          steps: [
            { kind: 'read', title: 'Proving representation-space prediction and multi-block masking earn their keep', markdown: ablationsMd },
            {
              kind: 'quiz',
              title: 'Check: reading the ablations',
              questions: [
                {
                  prompt: 'In Table 7, predicting in pixel space instead of representation space (same architecture) drops 1% ImageNet linear-probe accuracy from 66.9 to 40.7, despite MORE training epochs. What does this show?',
                  options: [
                    'Pixel-space prediction is simply a slower-converging equivalent — given enough epochs it would match',
                    'The representation-space target is not a minor tweak but the core mechanism the result depends on — extra epochs cannot compensate for it',
                    'The architecture used for pixel prediction was misconfigured',
                    'This ablation is inconclusive because the epoch counts differ',
                  ],
                  answer: 1,
                  explanation:
                    'Despite 300 more epochs (800 vs 500), pixel-space prediction loses by 26 points — strong evidence that predicting in representation space, not just "predicting something," is what produces semantic representations.',
                },
                {
                  prompt: 'Rasterized masking (predict 3 quadrants from 1 quadrant) is a "hard" prediction task, yet it scores worst of all four masking strategies in Table 6 (15.5 vs. 54.2 for multi-block). Why?',
                  options: [
                    'Rasterized masking uses fewer target patches than multi-block masking',
                    'The single quadrant context is spatially concentrated in one corner and not informative about the rest of the image — task difficulty alone doesn\'t help if the context lacks the right information',
                    'Quadrants are a different shape (square) than blocks, which Vision Transformers cannot process',
                    'The model needs negative examples to learn from rasterized masking, which it doesn\'t get',
                  ],
                  answer: 1,
                  explanation:
                    'Multi-block masking pairs a genuinely hard task with a spatially-distributed, informative context. Rasterized masking is hard but the context is concentrated and uninformative about distant image regions — both difficulty AND context informativeness are needed.',
                },
              ],
            },
          ],
        },
        {
          id: 'ij-critique-scenario',
          title: 'Choosing a self-supervised method for your constraints',
          minutes: 12,
          xp: 60,
          steps: [
            {
              kind: 'scenario',
              title: 'Pick the right pretraining approach',
              scenario: {
                intro:
                  'You\'re leading pretraining for a new vision system. Different teams keep proposing different self-supervised methods. Use what the I-JEPA paper showed about each family\'s strengths and weaknesses to make the call.',
                stages: [
                  {
                    situation:
                      'Your compute budget is fixed: at most 1,200 GPU hours for pretraining a model in the ViT-Huge class, and the downstream task is standard ImageNet-style classification.',
                    question: 'Which approach best fits this budget?',
                    options: [
                      {
                        label: 'I-JEPA — the paper reports ViT-H/14 pretraining under 1,200 GPU hours with strong linear-probe accuracy',
                        quality: 'best',
                        feedback:
                          'Correct. Section 7 reports exactly this: a ViT-H/14 trained with I-JEPA fits this budget and is "over 10x more efficient" than MAE at comparable scale, while beating MAE\'s linear-probe accuracy (Table 1).',
                      },
                      {
                        label: 'MAE at ViT-H/14, since it is conceptually simpler to implement',
                        quality: 'bad',
                        feedback:
                          'MAE needs roughly 10x more compute than I-JEPA for a comparable ViT-H/14 result (Section 7) — it would blow well past the 1,200 GPU-hour budget.',
                      },
                      {
                        label: 'iBOT at ViT-Small, since smaller models are always cheaper',
                        quality: 'ok',
                        feedback:
                          'Smaller models do cost less, but the paper shows a huge I-JEPA model still needs less compute than a small iBOT model, and you would also sacrifice representation quality and model capacity by going small. Not the best use of the budget given the data point you have.',
                      },
                    ],
                  },
                  {
                    situation:
                      'Your actual downstream task is dense, low-level: object counting and depth estimation from a single frame, not classification.',
                    question:
                      'A colleague suggests DINO or iBOT because they are the strongest classifiers in Table 1. What should you point out?',
                    options: [
                      {
                        label:
                          'View-invariance methods like DINO/iBOT bake in invariance to color and viewpoint changes — exactly the signal low-level tasks like counting and depth need; I-JEPA, with no such bias, outperformed them on Clevr/Count and Clevr/Dist (Table 4)',
                        quality: 'best',
                        feedback:
                          'Right — strongest classifier on Table 1 is not the same axis as best for low-level dense prediction. The paper explicitly shows the augmentation invariance that helps classification can hurt tasks where that exact information (color, viewpoint, depth cues) is the signal.',
                      },
                      {
                        label: 'Classification accuracy on ImageNet always predicts performance on every downstream task',
                        quality: 'bad',
                        feedback:
                          'The paper directly refutes this — DINO and iBOT, despite leading on ImageNet classification, lose to I-JEPA on object counting and depth prediction (Table 4).',
                      },
                      {
                        label: 'Just fine-tune DINO end-to-end on the low-level task and hope the invariances wash out',
                        quality: 'ok',
                        feedback:
                          'Fine-tuning can partially correct for a bad inductive bias, but it is a workaround for a known weakness rather than picking the method whose pretraining objective already matches the task. I-JEPA needed no such correction in the paper\'s results.',
                      },
                    ],
                  },
                  {
                    situation:
                      'Someone proposes skipping the target encoder\'s exponential-moving-average update to simplify the training loop, training all three networks (context encoder, predictor, target encoder) by ordinary backprop end-to-end.',
                    question: 'What is the risk?',
                    options: [
                      {
                        label:
                          'Representation collapse — without the asymmetry between a gradient-trained context encoder and an EMA-updated target encoder, the trivial solution of outputting a constant embedding for everything can satisfy the L2 loss',
                        quality: 'best',
                        feedback:
                          'Correct. The paper notes collapse is a concern for JEPAs just as it is for Joint-Embedding Architectures, and relies on the asymmetric EMA target-encoder design (the same family of fix used by BYOL and DINO) specifically to avoid it.',
                      },
                      {
                        label: 'Training would simply run slower with no change in final quality',
                        quality: 'bad',
                        feedback:
                          'It is not just a speed concern — removing the EMA asymmetry removes the primary defense against representation collapse described in Section 2/3, which would degrade or destroy the learned representations.',
                      },
                      {
                        label: 'It would only matter for very large models, not smaller ones',
                        quality: 'bad',
                        feedback:
                          'Collapse risk in Joint-Embedding-style objectives is a structural property of the loss, not a scale-dependent issue — the paper applies the EMA defense regardless of model size.',
                      },
                    ],
                  },
                ],
                debrief:
                  'I-JEPA\'s wins are conditional, not universal: it is the best choice when you want strong semantic representations without augmentation bias under a tight compute budget, and it specifically shines on low-level/dense tasks where view-invariance hurts. But its collapse-avoidance design (asymmetric EMA target encoder) is load-bearing — remove it and you lose the entire approach\'s safety net.',
              },
            },
          ],
        },
      ],
    },
  ],
}
