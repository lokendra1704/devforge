import type { Subject } from '../types'
import motivationMd from './md/lora-motivation.md?raw'
import methodMd from './md/lora-method.md?raw'
import resultsMd from './md/lora-results.md?raw'
import understandingMd from './md/lora-understanding.md?raw'
import tradeoffsMd from './md/lora-tradeoffs.md?raw'

export const lora: Subject = {
  id: 'lora',
  title: 'LoRA',
  tagline:
    'ICLR ’22 (Hu et al., Microsoft) — adapt a frozen 175B model by training two tiny rank-r matrices per layer: 10,000× fewer trainable parameters, 3× less VRAM, and zero added inference latency.',
  icon: '🪡',
  accent: '#f472b6',
  modules: [
    {
      id: 'lora-m1',
      title: 'LoRA: Low-Rank Adaptation of Large Language Models',
      description:
        'Hu et al., 2021: freeze the pre-trained weights and learn a low-rank update ∆W = BA per layer. Why full fine-tuning doesn’t scale, how the reparametrization works, what it buys you, and why a rank as low as 1 is enough.',
      lessons: [
        {
          id: 'lora-motivation',
          title: 'Why full fine-tuning doesn’t scale',
          minutes: 12,
          xp: 60,
          steps: [
            { kind: 'read', title: 'One base, many tasks — and the prior fixes', markdown: motivationMd },
            {
              kind: 'quiz',
              title: 'The adaptation problem',
              questions: [
                {
                  prompt:
                    'Why does full fine-tuning become a "critical deployment challenge" specifically at GPT-3 scale rather than at RoBERTa/GPT-2 scale?',
                  options: [
                    'Each downstream task produces its own checkpoint with |∆Φ| = |Φ₀| ≈ 175B parameters, so storing/serving many task instances becomes infeasible',
                    'GPT-3 cannot be fine-tuned at all — only prompted',
                    'GPT-3 has a smaller intrinsic rank, so fine-tuning overfits',
                    'Fine-tuning GPT-3 changes the model architecture, breaking inference',
                  ],
                  answer: 0,
                  explanation:
                    'Section 2 makes this the core pain: the per-task update ∆Φ has the same dimension as the full model, so every task needs a separate 175B checkpoint. At GPT-2/RoBERTa size that’s an inconvenience; at 175B it’s a wall for storage and deployment.',
                },
                {
                  prompt:
                    'The paper rejects vanilla adapter layers for latency-sensitive production. What is the precise mechanism that makes adapters add inference latency, even when they have <1% of the parameters?',
                  options: [
                    'Adapter layers must be processed sequentially (extra depth), so they can’t exploit hardware parallelism — costly at batch size 1 where there’s little else to overlap',
                    'Adapters double the number of trainable parameters, so each forward pass is twice as slow',
                    'Adapters require recomputing the frozen weights on every token',
                    'Adapters only run on CPU, so they can’t use the GPU',
                  ],
                  answer: 0,
                  explanation:
                    'Section 3: the FLOPs are tiny, but the added layers run sequentially. Large models hide latency through parallelism; the extra sequential depth can’t be parallelized away, and it bites most in the online, batch-size-1 setting.',
                },
                {
                  prompt:
                    'What is the central hypothesis (from intrinsic-dimension work) that motivates representing the weight update as low-rank?',
                  options: [
                    'The change in weights during adaptation (∆W) has a low "intrinsic rank", so it can be captured by a thin factorization rather than a full matrix',
                    'The pre-trained weights W₀ are exactly rank-1, so any update must be too',
                    'Downstream tasks need more parameters than pre-training, so updates must be high-rank',
                    'Gradients are always low-rank regardless of the task',
                  ],
                  answer: 0,
                  explanation:
                    'Section 2 takes inspiration from Li et al. (2018a)/Aghajanyan et al. (2020): over-parametrized models live on a low intrinsic dimension, so LoRA hypothesizes the *adaptation update* ∆W is itself low intrinsic rank — learnable as a small product BA.',
                },
              ],
            },
          ],
        },
        {
          id: 'lora-method',
          title: 'The low-rank reparametrization',
          minutes: 14,
          xp: 70,
          steps: [
            { kind: 'read', title: 'W₀ + BA, scaling, and merging', markdown: methodMd },
            {
              kind: 'quiz',
              title: 'How the reparametrization works',
              questions: [
                {
                  prompt:
                    'For a frozen W₀ ∈ ℝ^{d×k}, LoRA writes the update as ∆W = BA. What are the shapes of B and A, and what makes this cheap?',
                  options: [
                    'B ∈ ℝ^{d×r}, A ∈ ℝ^{r×k} with r ≪ min(d,k) — only 2·d·r·… trainable values instead of d×k',
                    'B ∈ ℝ^{d×k}, A ∈ ℝ^{d×k} — two full-size matrices summed',
                    'B and A are both scalars that rescale W₀',
                    'B ∈ ℝ^{k×r}, A ∈ ℝ^{r×d}, with r = min(d,k) (full rank)',
                  ],
                  answer: 0,
                  explanation:
                    'Section 4.1: B is d×r, A is r×k, and r ≪ min(d,k). The product BA has the same shape as W₀ but is parameterized by only the thin factors — that’s the parameter saving.',
                },
                {
                  prompt:
                    'LoRA initializes A to random Gaussian and B to zero. Why is the B = 0 initialization important?',
                  options: [
                    'It makes ∆W = BA = 0 at the start, so the adapted model begins identical to the pre-trained model and adaptation only adds signal',
                    'It makes the model untrainable until A warms up, acting as regularization',
                    'It guarantees the rank stays exactly 1 throughout training',
                    'It removes the need for the frozen W₀ entirely',
                  ],
                  answer: 0,
                  explanation:
                    'Section 4.1: with B = 0, BA = 0 initially, so h = W₀x exactly — training starts from the pre-trained model and the low-rank branch contributes nothing until it learns to.',
                },
                {
                  prompt:
                    'How does LoRA achieve "no additional inference latency by construction," and what does task-switching then cost?',
                  options: [
                    'Compute W = W₀ + BA once and serve normally; switch tasks by subtracting BA and adding a different B′A′ — a quick weight-arithmetic op',
                    'It caches the first token’s activations and reuses them for all tasks',
                    'It runs B and A on a separate GPU in parallel with W₀',
                    'It prunes W₀ down to rank r so the forward pass is faster',
                  ],
                  answer: 0,
                  explanation:
                    'Section 4.1: because BA has the same shape as W₀, you fold it in (W = W₀ + BA) and inference is identical to a fine-tuned model. Switching tasks is W₀ recovered by −BA then +B′A′ — cheap and low-memory.',
                },
                {
                  prompt:
                    'The paper calls LoRA "a generalization of full fine-tuning." In what sense, and how does that contrast with adapters/prefix methods as you add capacity?',
                  options: [
                    'Raising r toward the rank of W recovers full fine-tuning’s expressiveness; adapters instead converge to an MLP and prefix methods to a model that can’t take long sequences',
                    'LoRA always exactly equals full fine-tuning regardless of r',
                    'LoRA generalizes prefix tuning, not fine-tuning, by learning prefix tokens',
                    'Full fine-tuning is a special case only when r = 0',
                  ],
                  answer: 0,
                  explanation:
                    'Section 4.1: as trainable params grow, LoRA "roughly converges to training the original model," because a full-rank ∆W is reachable. Adapter and prefix families converge to structurally different models, not to the original.',
                },
              ],
            },
          ],
        },
        {
          id: 'lora-results',
          title: 'What LoRA buys you',
          minutes: 15,
          xp: 80,
          steps: [
            { kind: 'read', title: 'GPT-3 results, deployment savings, adapter latency', markdown: resultsMd },
            {
              kind: 'quiz',
              title: 'Reading the evaluation',
              questions: [
                {
                  prompt:
                    'On GPT-3 175B (Table 4), LoRA uses 4.7M trainable parameters vs full fine-tuning’s 175,255.8M. What is the headline result?',
                  options: [
                    'LoRA matches or exceeds full fine-tuning on all three datasets despite ~37,000× fewer trainable parameters',
                    'LoRA is within 5 points of full fine-tuning but never beats it',
                    'LoRA beats full fine-tuning only because it uses more parameters',
                    'LoRA only works on the smaller RoBERTa models, not GPT-3',
                  ],
                  answer: 0,
                  explanation:
                    'Table 4 / Section 5.5: LoRA at 4.7M params matches or exceeds full fine-tuning on WikiSQL, MNLI-m, and SAMSum — equal-or-better quality at a tiny fraction of the trainable parameters.',
                },
                {
                  prompt:
                    'The adapter latency table (Table 1) shows the penalty is worst at batch 1 / sequence 128 (+20.7% to +30.3%) and small at batch 32 / sequence 512 (+2–3%). Why does the gap widen in the online setting?',
                  options: [
                    'At batch size 1 there’s little other work to overlap the adapters’ sequential compute with, so the extra depth dominates; large batches/sequences amortize it',
                    'Short sequences make the frozen weights larger',
                    'Adapters add more parameters at small batch sizes',
                    'The GPU clock throttles at small batch sizes',
                  ],
                  answer: 0,
                  explanation:
                    'Section 3 / Table 1: adapters add sequential depth that can’t be parallelized. With a big batch there’s plenty of parallel work to hide it behind; at batch 1, short sequence (online serving) it’s exposed — exactly the regime LoRA avoids by merging.',
                },
                {
                  prompt:
                    'Why can a hundred LoRA-adapted GPT-3 models be hosted in ~354GB while a hundred fully fine-tuned ones need ~35TB?',
                  options: [
                    'All LoRA models share one 350GB frozen base; each task adds only a ~35MB B/A checkpoint, whereas full fine-tuning stores a separate 350GB copy per task',
                    'LoRA compresses the base model to 3.5GB per task',
                    'LoRA stores tasks on disk and full fine-tuning in VRAM',
                    'LoRA models are quantized to int4 and full models are not',
                  ],
                  answer: 0,
                  explanation:
                    'Section 4.2: 350GB base + 100×35MB ≈ 354GB vs 100×350GB ≈ 35TB. The base is shared and only the tiny low-rank deltas are per-task — that’s the storage/task-switching win.',
                },
              ],
            },
            {
              kind: 'code',
              title: 'Count LoRA’s trainable parameters',
              challenge: {
                prompt:
                  'Section 5.1 gives the trainable-parameter count for LoRA:\n\n> |Θ| = 2 × L̂_LoRA × d_model × r\n\nEach adapted weight matrix contributes B (d×r) **plus** A (r×d) = `2·d_model·r` parameters, and `L̂_LoRA` is how many matrices you adapt across the whole model.\n\nImplement `loraTrainableParams(numAdaptedMatrices, dModel, r)`. The factor of **2** (one for B, one for A) is the easy thing to miss.',
                starterCode:
                  'function loraTrainableParams(numAdaptedMatrices, dModel, r) {\n  // TODO: |Θ| = 2 × numAdaptedMatrices × dModel × r\n  // (each matrix needs BOTH a B and an A factor)\n  return numAdaptedMatrices * dModel * r\n}',
                solution:
                  'function loraTrainableParams(numAdaptedMatrices, dModel, r) {\n  return 2 * numAdaptedMatrices * dModel * r\n}',
                tests:
                  "test('GPT-3: W_q & W_v across 96 layers (192 matrices) at r=4 ≈ 18M', () => {\n  // matches the 18M budget used throughout Section 7\n  assertEqual(loraTrainableParams(192, 12288, 4), 18874368)\n})\n\ntest('one attention type across 96 layers at r=8 lands at the SAME ~18M budget', () => {\n  // Table 5: r=8 one type == r=4 two types, by design\n  assertEqual(loraTrainableParams(96, 12288, 8), 18874368)\n})\n\ntest('reduction vs full fine-tuning of those 192 d×d matrices is ~1536× at r=4', () => {\n  const lora = loraTrainableParams(192, 12288, 4)\n  const fullFT = 192 * 12288 * 12288\n  assertEqual(Math.round(fullFT / lora), 1536)\n})\n\ntest('doubling r doubles the parameter count', () => {\n  assertEqual(loraTrainableParams(192, 12288, 8), 2 * loraTrainableParams(192, 12288, 4))\n})",
              },
            },
          ],
        },
        {
          id: 'lora-understanding',
          title: 'Understanding the low-rank updates',
          minutes: 14,
          xp: 75,
          steps: [
            { kind: 'read', title: 'Which matrices, what rank, and what ∆W does', markdown: understandingMd },
            {
              kind: 'quiz',
              title: 'Why low rank is enough',
              questions: [
                {
                  prompt:
                    'Under a fixed 18M-parameter budget (Table 5), what does the paper conclude about *where* to spend it across attention matrices?',
                  options: [
                    'Adapting both W_q and W_v (at lower rank) beats concentrating the budget on a single matrix at higher rank — spread thin beats pile deep',
                    'Concentrating all budget on W_q at high rank is best',
                    'Adapting W_k alone is the strongest single choice',
                    'It makes no measurable difference which matrices you adapt',
                  ],
                  answer: 0,
                  explanation:
                    'Section 7.1: putting everything into ∆W_q or ∆W_k underperforms, while {W_q, W_v} is best. Even r=4 captures enough of ∆W that adapting *more matrices* at lower rank beats *one matrix* at higher rank.',
                },
                {
                  prompt:
                    'The subspace-similarity analysis (Eq. 4, comparing A_{r=8} and A_{r=64}) is used to explain which surprising result?',
                  options: [
                    'That a rank as small as 1 works well — only the top singular direction overlaps between r=8 and r=64; the rest is mostly noise, so ∆W really is rank-deficient',
                    'That r=64 is always strictly better than r=8',
                    'That ∆W and W are statistically independent',
                    'That different random seeds learn completely different top directions',
                  ],
                  answer: 0,
                  explanation:
                    'Section 7.2: the top singular vectors of A_{r=8} and A_{r=64} overlap strongly (similarity > 0.5 for a dimension-1 subspace), while higher directions don’t. Increasing r doesn’t add meaningful subspace — which is why r=1 already performs well.',
                },
                {
                  prompt:
                    'Table 7 reports an amplification factor of ≈ 21.5× for r=4. What does the relationship between ∆W and W actually reveal?',
                  options: [
                    '∆W amplifies directions that are present in W but NOT emphasized — turning up features the base model already learned but kept quiet, rather than repeating W’s top directions or inventing random ones',
                    '∆W simply re-scales W’s most dominant directions by 21.5×',
                    '∆W is uncorrelated with W, behaving like a random matrix',
                    '∆W cancels out W’s top directions to suppress pre-training behavior',
                  ],
                  answer: 0,
                  explanation:
                    'Section 7.3: ∆W correlates with W more than a random matrix would, but it does *not* repeat W’s top singular directions — it amplifies under-emphasized ones (~21.5×). Adaptation surfaces latent, task-relevant features rather than creating new ones.',
                },
              ],
            },
          ],
        },
        {
          id: 'lora-tradeoffs',
          title: 'Adopting LoRA: design calls',
          minutes: 15,
          xp: 80,
          steps: [
            { kind: 'read', title: 'Positioning and the honest limitations', markdown: tradeoffsMd },
            {
              kind: 'scenario',
              title: 'Four LoRA adoption decisions',
              scenario: {
                intro:
                  'LoRA is precise about what it claims. The read above covered its positioning against adapters and prefix tuning, and its stated limitations (the batching catch, the heuristic weight selection). Work through four decisions a team adopting LoRA might face.',
                stages: [
                  {
                    situation:
                      'You’re serving many fine-tuned variants of one base model behind a low-latency API (batch size often 1). A teammate proposes adapter layers because "they’re a well-established bottleneck design with few parameters."',
                    question: 'What’s the strongest reason to prefer LoRA here?',
                    options: [
                      {
                        label:
                          'LoRA merges into W₀ (W = W₀ + BA), so it adds zero inference latency by construction — while adapters add sequential depth that bites hardest exactly in the batch-size-1 online setting',
                        quality: 'best',
                        feedback:
                          'Exactly Section 3/4.1: adapters’ extra layers run sequentially and can’t be parallelized, costing +20–30% at batch 1 / short sequence (Table 1). LoRA folds the update into the weights, so its latency equals a fully fine-tuned model’s.',
                      },
                      {
                        label:
                          'Adapters are fine — their parameter count is under 1% of the model, so latency can’t be a problem',
                        quality: 'bad',
                        feedback:
                          'Section 3 directly refutes this: the FLOPs are tiny but irrelevant — the sequential depth is what adds latency, and it shows up precisely in the low-batch online regime you’re describing.',
                      },
                      {
                        label:
                          'Prefer prefix tuning instead — it has no latency cost and no downsides',
                        quality: 'bad',
                        feedback:
                          'Prefix/prompt tuning consumes usable sequence length and is "difficult to optimize" (Sections 3, 6). It’s not a free win, and it isn’t LoRA’s zero-latency-by-construction property.',
                      },
                    ],
                  },
                  {
                    situation:
                      'You have a fixed parameter budget for adapting GPT-3 and must decide how to spend it across attention matrices: all of it on W_q at a high rank, or split it across W_q and W_v at a lower rank.',
                    question: 'Based on Section 7.1’s findings, which allocation should you choose?',
                    options: [
                      {
                        label:
                          'Split it across W_q and W_v at the lower rank — Table 5 shows adapting two matrices at r=4 beats one matrix at r=8 under the same 18M budget; even a small rank captures enough of ∆W',
                        quality: 'best',
                        feedback:
                          'Section 7.1: concentrating budget in ∆W_q (or ∆W_k) underperforms; {W_q, W_v} is best. Coverage across matrices matters more than rank per matrix, because r=4 already captures the useful update.',
                      },
                      {
                        label:
                          'Put all of it on W_q at the highest possible rank — one matrix at high rank always dominates',
                        quality: 'bad',
                        feedback:
                          'Table 5 shows the opposite: piling the whole budget onto a single weight type gives "significantly lower performance" than spreading it across W_q and W_v.',
                      },
                      {
                        label:
                          'It doesn’t matter — pick whichever is simplest to implement',
                        quality: 'ok',
                        feedback:
                          'It’s true the differences are modest on these datasets, and {W_q, W_v} is also the simple default the paper uses — but Section 7.1 does measure a real, consistent gap, so "spread across two" is the informed call, not a coin flip.',
                      },
                    ],
                  },
                  {
                    situation:
                      'Your latency-critical service merges B and A into W₀ to get zero overhead. Now product wants a single batched forward pass that mixes requests for *different* task adapters together.',
                    question: 'How do you handle this, given LoRA’s limitations?',
                    options: [
                      {
                        label:
                          'Recognize the tension: once you absorb A,B into W you can’t cheaply batch different tasks. Keep weights unmerged and select per-sample LoRA modules in the batch — accepting that you give back the zero-latency property',
                        quality: 'best',
                        feedback:
                          'Section 4.2 states exactly this trade-off: merging makes cross-task batching not straightforward; you *can* leave weights unmerged and choose modules dynamically per sample, "for scenarios where latency is not critical." You can’t have both at once.',
                      },
                      {
                        label:
                          'Keep everything merged and just batch the different tasks together anyway — merged LoRA supports mixed-task batches for free',
                        quality: 'bad',
                        feedback:
                          'This is the specific case Section 4.2 calls out as not straightforward: a merged W is one task’s weights, so a single merged forward pass can’t serve different A,B per sample.',
                      },
                      {
                        label:
                          'Abandon LoRA — this limitation makes it unusable in production',
                        quality: 'bad',
                        feedback:
                          'Overcorrection. The limitation is narrow (mixed-task batching under a merged deployment). Single-task low-latency serving and unmerged dynamic selection both work; you pick per use case.',
                      },
                    ],
                  },
                  {
                    situation:
                      'A colleague argues LoRA and prefix tuning are competitors, so you must commit to exactly one adaptation strategy for the whole org.',
                    question: 'Is that framing right?',
                    options: [
                      {
                        label:
                          'No — the paper states LoRA is orthogonal to many prior methods and can be combined with them (e.g. prefix tuning, Appendix E); it’s not strictly either/or',
                        quality: 'best',
                        feedback:
                          'Section 1/6: "LoRA is orthogonal to many prior methods and can be combined with many of them, such as prefix-tuning." Treating it as a forced exclusive choice ignores that they compose.',
                      },
                      {
                        label:
                          'Yes — adaptation methods are mutually exclusive, so the org must standardize on one',
                        quality: 'bad',
                        feedback:
                          'The paper explicitly demonstrates combining LoRA with prefix tuning (Appendix E). They aren’t mutually exclusive, so a forced single choice is a false constraint.',
                      },
                      {
                        label:
                          'It doesn’t matter because all adaptation methods perform identically',
                        quality: 'bad',
                        feedback:
                          'They don’t — the experiments show clear quality and latency differences. The point isn’t that they’re equal; it’s that LoRA can be layered *with* some of them rather than only chosen instead.',
                      },
                    ],
                  },
                ],
                debrief:
                  'LoRA’s claim is tight and falsifiable: a low-rank update ∆W = BA, merged into W₀, gives quality on par with full fine-tuning at a tiny fraction of trainable parameters and zero added inference latency. Its limits are stated just as plainly — merged deployment makes mixed-task batching awkward, and weight-matrix selection remains heuristic. Spread the budget across W_q and W_v, keep r small, merge when latency matters, and remember it composes with other methods rather than replacing all of them.',
              },
            },
          ],
        },
      ],
    },
  ],
}
