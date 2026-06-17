import type { Subject } from '../types'
import motivationMd from './md/lj-motivation.md?raw'
import approachMd from './md/lj-approach.md?raw'
import resultsMd from './md/lj-results.md?raw'
import representationsMd from './md/lj-representations.md?raw'
import efficiencyMd from './md/lj-efficiency.md?raw'

export const llmJepa: Subject = {
  id: 'llm-jepa',
  title: 'LLM-JEPA: Joint-Embedding Predictive Architectures for Language Models',
  tagline:
    'Huang, LeCun & Balestriero, 2025 — combining embedding-space JEPA objectives with LLM generative training to improve reasoning and generalization.',
  icon: '🧠',
  accent: '#7c3aed',
  modules: [
    {
      id: 'llmjepa-m1',
      title: 'LLM-JEPA: Learning from Vision',
      description:
        'Why embedding-space training objectives beat input-space reconstruction in vision, and how to adapt them to LLMs without sacrificing generation.',
      lessons: [
        {
          id: 'llmjepa-motivation',
          title: "Why next-token prediction isn't enough",
          minutes: 11,
          xp: 60,
          steps: [
            { kind: 'read', title: 'The vision-language gap', markdown: motivationMd },
            {
              kind: 'quiz',
              title: 'Understanding the gap',
              questions: [
                {
                  prompt: 'Why have vision models adopted embedding-space objectives like JEPAs over input-space reconstruction?',
                  options: [
                    'They\'re easier to implement',
                    'They directly reconstruct pixels',
                    'Empirical results show they learn better representations and generalize more robustly',
                    'They eliminate the need for labeled data',
                  ],
                  answer: 2,
                  explanation:
                    'Vision research found that predicting in embedding space, rather than reconstructing inputs, leads to superior performance on perception and reasoning tasks.',
                },
                {
                  prompt: 'What is the fundamental tension between LLM training objectives and vision objectives?',
                  options: [
                    'Vision models are always bigger than language models',
                    'Vision models can abandon input-space reconstruction because they don\'t need generative capabilities, but LLMs need to generate text while also benefiting from embedding-space training',
                    'Language data is inherently different from image data',
                    'JEPAs only work for vision, not language',
                  ],
                  answer: 1,
                  explanation:
                    'LLMs are judged on generation quality, so they can\'t simply replace next-token prediction. They need to combine both objectives.',
                },
              ],
            },
          ],
        },
        {
          id: 'llmjepa-approach',
          title: 'The LLM-JEPA method',
          minutes: 12,
          xp: 70,
          steps: [
            { kind: 'read', title: 'Combining generative and predictive losses', markdown: approachMd },
            {
              kind: 'quiz',
              title: 'Understanding the hybrid objective',
              questions: [
                {
                  prompt: 'In the LLM-JEPA loss function, what role does the λ hyperparameter play?',
                  options: [
                    'It controls the learning rate for the next-token prediction loss',
                    'It weights the importance of the JEPA objective relative to the standard LLM loss',
                    'It determines the number of predictor tokens to append',
                    'It prevents overfitting automatically',
                  ],
                  answer: 1,
                  explanation:
                    'Higher λ means the JEPA term contributes more to the gradient. Setting λ=0 recovers standard training.',
                },
                {
                  prompt: 'Why does using a custom two-block attention mask allow the computation of Enc(Text) and Enc(Code) without interference?',
                  options: [
                    'It uses separate transformer models for each view',
                    'It prevents Text tokens from attending to Code tokens and vice versa, so each view\'s encoding depends only on its own context',
                    'It requires only one forward pass instead of two',
                    'It reduces the vocabulary size',
                  ],
                  answer: 1,
                  explanation:
                    'The mask creates two independent causal triangles, making Text and Code encodings independent even though weights are shared.',
                },
              ],
            },
          ],
        },
        {
          id: 'llmjepa-results',
          title: 'Empirical validation and scaling',
          minutes: 13,
          xp: 75,
          steps: [
            { kind: 'read', title: 'Fine-tuning, pretraining, and reasoning models', markdown: resultsMd },
            {
              kind: 'scenario',
              title: 'Choosing an objective for code generation',
              scenario: {
                intro:
                  'You\'re training a model for code generation. You have a dataset with paired natural language descriptions and code snippets. Your compute budget is limited.',
                stages: [
                  {
                    situation:
                      'Which training objective should you use?',
                    question: 'What is the best choice given your dataset structure?',
                    options: [
                      {
                        label: 'Standard next-token prediction only',
                        quality: 'ok',
                        feedback:
                          'This is the safe baseline and works well, but you\'re not leveraging the two-view structure of your dataset. The paper shows 14.2pp improvements on similar tasks — you\'re likely leaving accuracy on the table.',
                      },
                      {
                        label: 'LLM-JEPA (L_LLM + JEPA term)',
                        quality: 'best',
                        feedback:
                          'Correct. Your dataset has natural two-view structure (description ↔ code), which is exactly what LLM-JEPA is designed for. The paper shows consistent 3–14pp gains. You\'ll need 2× compute for training, but the accuracy gains are substantial.',
                      },
                      {
                        label: 'Pure JEPA (no next-token prediction)',
                        quality: 'bad',
                        feedback:
                          'This abandons generative capability. LLMs are evaluated on their ability to generate code. LLM-JEPA\'s contribution is that you can have both.',
                      },
                    ],
                  },
                  {
                    situation:
                      'You chose LLM-JEPA. Now you\'re concerned about the 2× training cost. How would you mitigate this?',
                    question: 'Which approach best balances cost and accuracy?',
                    options: [
                      {
                        label: 'Use loss dropout (e.g., LD=0.5) and scale up λ accordingly',
                        quality: 'best',
                        feedback:
                          'Exactly right. With LD=0.5, you drop cost to ~1.5×, and by increasing λ when the JEPA term is active, you maintain or improve accuracy relative to non-dropout LLM-JEPA.',
                      },
                      {
                        label: 'Reduce the model size to keep total training time constant',
                        quality: 'ok',
                        feedback:
                          'This works but is crude — you sacrifice model capacity. Loss dropout is smarter.',
                      },
                      {
                        label: 'Use only the standard LLM loss and hope the next-token objective implicitly minimizes JEPA',
                        quality: 'bad',
                        feedback:
                          'The paper disproves this directly. Figure 3 shows that minimizing L_LLM does NOT implicitly minimize the JEPA loss.',
                      },
                    ],
                  },
                ],
                debrief:
                  'LLM-JEPA shines when you have natural dataset structure (two views). Loss dropout lets you reap most benefits with manageable overhead.',
              },
            },
          ],
        },
        {
          id: 'llmjepa-representations',
          title: 'How JEPA restructures embeddings',
          minutes: 11,
          xp: 65,
          steps: [
            { kind: 'read', title: 'Linear structure and low-rank geometry', markdown: representationsMd },
            {
              kind: 'quiz',
              title: 'Understanding structured representations',
              questions: [
                {
                  prompt: 'According to Section 4.2, what does the low rank of Enc(Text)−Enc(Code) (when trained with LLM-JEPA) imply?',
                  options: [
                    'The transformation from Text to Code is approximately linear and confined to a low-dimensional subspace',
                    'Text and Code embeddings are completely orthogonal',
                    'The model is overfitting to the training data',
                    'The JEPA loss has failed to structure the embedding space',
                  ],
                  answer: 0,
                  explanation:
                    'The singular values drop from ~300 to ~7, meaning the transformation is highly constrained. This low-rank structure is both theoretically interesting and practically important for generalization.',
                },
                {
                  prompt: 'Why does standard fine-tuning (with NTP loss alone) actually disrupt the pre-trained alignment between Text and Code, while LLM-JEPA restores it?',
                  options: [
                    'Standard fine-tuning uses a higher learning rate',
                    'NTP loss only cares about token-level prediction accuracy, which doesn\'t require alignment in embedding space. LLM-JEPA explicitly constrains embeddings to be aligned',
                    'The base model\'s alignment is random; only LLM-JEPA adds meaningful structure',
                    'Standard fine-tuning has a bug',
                  ],
                  answer: 1,
                  explanation:
                    'NTP can achieve high token accuracy without any particular structure in embedding space. LLM-JEPA adds an explicit constraint that preserves and sharpens the structure.',
                },
              ],
            },
          ],
        },
        {
          id: 'llmjepa-efficiency',
          title: 'Efficiency and computational trade-offs',
          minutes: 12,
          xp: 70,
          steps: [
            { kind: 'read', title: 'Loss dropout and design choices', markdown: efficiencyMd },
            {
              kind: 'scenario',
              title: 'Scaling LLM-JEPA to pretraining',
              scenario: {
                intro: 'You\'re scaling LLM-JEPA to a large pretraining run. You want to match or exceed baseline performance while keeping compute overhead reasonable.',
                stages: [
                  {
                    situation:
                      'You need to choose a loss dropout rate and tune λ. Which strategy is most efficient?',
                    question: 'How do you balance accuracy and compute?',
                    options: [
                      {
                        label: 'Set LD=0 (never drop); maximize accuracy, accept 2× cost',
                        quality: 'ok',
                        feedback:
                          'This gives maximum accuracy but doubles training time. If you have unlimited compute, this works. But it\'s inefficient.',
                      },
                      {
                        label: 'Set LD=0.75 (drop 75% of the time); reduce cost to ~1.25× while tuning λ to stay effective',
                        quality: 'best',
                        feedback:
                          'Excellent trade-off. Table 6 shows that with LD=0.75 and λ=2–4, you achieve competitive accuracy (70%+) at only 1.25× baseline cost.',
                      },
                      {
                        label: 'Set LD=0.99 (drop almost always); accept minimal accuracy gain',
                        quality: 'bad',
                        feedback:
                          'This defeats the purpose. If you drop the JEPA term 99% of the time, you\'re back to standard training without benefits.',
                      },
                    ],
                  },
                  {
                    situation:
                      'You\'re implementing LLM-JEPA and need to pick design choices. Which is most critical?',
                    question: 'Which design decision has the biggest performance impact?',
                    options: [
                      {
                        label: 'Using cosine similarity (not L2 or MSE) for the distance metric',
                        quality: 'best',
                        feedback:
                          'Table 3 shows cosine similarity (71.5%) significantly outperforms alternatives (L2: 70.6%, MSE: 2.2%). This is the single biggest design lever.',
                      },
                      {
                        label: 'Appending the [PRED] token (not prepending)',
                        quality: 'ok',
                        feedback:
                          'This does matter (71.5% vs. 68.1%), but the effect is smaller than metric choice.',
                      },
                      {
                        label: 'Predicting Text→Code (not Code→Text)',
                        quality: 'ok',
                        feedback:
                          'Table 3 shows this asymmetry (71.5% vs. 65.7%). It matters, but less than metric choice.',
                      },
                    ],
                  },
                ],
                debrief:
                  'Loss dropout plus co-tuned λ lets you scale LLM-JEPA efficiently. Cosine similarity is the highest-leverage design choice.',
              },
            },
          ],
        },
        {
          id: 'llmjepa-comprehension',
          title: 'Key concepts recap',
          minutes: 10,
          xp: 55,
          steps: [
            {
              kind: 'quiz',
              title: 'Core insights',
              questions: [
                {
                  prompt: 'What is the primary insight of LLM-JEPA compared to standard LLM training?',
                  options: [
                    'Add embedding-space regularization without sacrificing generative capability by combining two loss terms: next-token prediction (generative) and JEPA (representation alignment)',
                    'Replace next-token prediction with a pure embedding-space objective',
                    'Use attention masks to reduce training cost',
                    'Prove that JEPAs always outperform reconstruction-based losses',
                  ],
                  answer: 0,
                  explanation:
                    'This is the core contribution. The genius is that you don\'t need to choose between generation and representation quality; you can have both.',
                },
                {
                  prompt: 'Across all experiments in the paper, which dataset type showed the largest gains from LLM-JEPA?',
                  options: [
                    'Text-to-SQL (Spider dataset, ~3pp improvement)',
                    'Natural language to regex (NL-RX-SYNTH, ~14pp improvement)',
                    'Question-answering (NQ-Open, ~1.5pp improvement)',
                    'Sentiment classification (Rotten Tomatoes, ~1.2pp improvement)',
                  ],
                  answer: 1,
                  explanation:
                    'The NL-RX dataset has the clearest two-view structure and showed the most dramatic improvements.',
                },
                {
                  prompt: 'What does the paper identify as the main practical limitation of LLM-JEPA?',
                  options: [
                    'It requires datasets with explicit two-view structure',
                    'The 2× training cost during fine-tuning, though loss dropout can reduce this to ~1.25× with minimal accuracy loss',
                    'It introduces too many hyperparameters (λ, k, LD)',
                    'It doesn\'t work for pretraining, only fine-tuning',
                  ],
                  answer: 1,
                  explanation:
                    'Section 6 identifies this as the primary bottleneck. Loss dropout is proposed as a mitigation, but the overhead is real.',
                },
                {
                  prompt: 'Why is the finding that "a good next-token predictor is not a good JEPA" (Section 3.3) important?',
                  options: [
                    'It proves that next-token prediction is inferior to JEPA',
                    'It justifies adding the JEPA term to the loss; one objective doesn\'t implicitly minimize the other',
                    'It shows that all LLM training methods are equivalent',
                    'It demonstrates that JEPA is unnecessary overhead',
                  ],
                  answer: 1,
                  explanation:
                    'Figure 3 shows that L_LLM is high when JEPA loss is high, and vice versa. This validates the two-term design.',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
