import type { Subject } from '../types'
import motivationMd from './md/fa-motivation.md?raw'
import memoryHierarchyMd from './md/fa-memory-hierarchy.md?raw'
import algorithmMd from './md/fa-algorithm.md?raw'
import ioComplexityMd from './md/fa-io-complexity.md?raw'
import resultsMd from './md/fa-results.md?raw'

export const flashAttention: Subject = {
  id: 'flash-attention',
  title: 'FlashAttention',
  tagline: 'IO-aware exact attention: why HBM traffic — not FLOPs — sets the clock.',
  icon: '⚡️',
  accent: '#38bdf8',
  modules: [
    {
      id: 'fa-m1',
      title: 'FlashAttention: Fast & Memory-Efficient Exact Attention',
      description:
        'Dao et al. 2022 (arXiv:2205.14135). Tiling + recomputation to cut HBM traffic, with exact results — the paper that made long-context Transformers practical.',
      lessons: [
        {
          id: 'fa-motivation',
          title: 'The speedup that wasn’t',
          minutes: 12,
          xp: 60,
          steps: [
            { kind: 'read', title: 'Fewer FLOPs, same wall-clock', markdown: motivationMd },
            {
              kind: 'quiz',
              title: 'What problem is being solved?',
              questions: [
                {
                  prompt:
                    'Prior "efficient attention" methods cut FLOPs to near-linear but often showed no wall-clock speedup. Why?',
                  options: [
                    'Their math was incorrect, so results were thrown out',
                    'They optimized FLOPs, but attention is bottlenecked by memory (IO) access, not arithmetic',
                    'GPUs cannot run approximate attention at all',
                    'They used too little SRAM',
                  ],
                  answer: 1,
                  explanation:
                    'On modern GPUs compute has outpaced memory, so most attention ops are memory-bound. Cutting FLOPs you weren’t waiting on buys nothing — the missing principle is IO-awareness: counting reads/writes between HBM and SRAM.',
                },
                {
                  prompt: 'How does FlashAttention differ from approximate attention methods?',
                  options: [
                    'It approximates the softmax to save memory',
                    'It computes EXACT attention (same result) while doing fewer HBM accesses',
                    'It only works for short sequences',
                    'It reduces FLOPs below all competitors',
                  ],
                  answer: 1,
                  explanation:
                    'FlashAttention is exact — it computes softmax(QKᵀ)V identically. It even does MORE FLOPs (recomputation), yet runs up to 7.6× faster because it slashes HBM traffic. No quality trade-off.',
                },
              ],
            },
          ],
        },
        {
          id: 'fa-memory-hierarchy',
          title: 'Why the GPU waits',
          minutes: 13,
          xp: 70,
          steps: [
            { kind: 'read', title: 'SRAM, HBM, and arithmetic intensity', markdown: memoryHierarchyMd },
            {
              kind: 'quiz',
              title: 'Compute-bound or memory-bound?',
              questions: [
                {
                  prompt: 'On an A100, how do SRAM and HBM compare?',
                  options: [
                    'SRAM is bigger and slower than HBM',
                    'SRAM is ~13× faster but ~thousands of times smaller than HBM',
                    'They have identical bandwidth, only size differs',
                    'HBM is the fastest memory on the chip',
                  ],
                  answer: 1,
                  explanation:
                    'SRAM ≈ 19 TB/s but only ~20 MB total on chip; HBM ≈ 1.5 TB/s but 40 GB. Fast-but-tiny vs slow-but-big — the whole tiling strategy is about keeping work inside the tiny fast tier.',
                },
                {
                  prompt: 'Which operation is MEMORY-bound (the kind FlashAttention targets)?',
                  options: [
                    'A large matrix multiply with a big inner dimension',
                    'Softmax over the N×N attention matrix',
                    'A dense convolution with many channels',
                    'Any operation with high arithmetic intensity',
                  ],
                  answer: 1,
                  explanation:
                    'Softmax is a reduction/elementwise op with low arithmetic intensity — few ops per byte moved — so its time is set by memory traffic, not math. Big matmuls are the compute-bound case.',
                },
                {
                  prompt:
                    'Why isn’t naive kernel fusion enough to fix attention during TRAINING?',
                  options: [
                    'Fusion is too slow on GPUs',
                    'The intermediate N×N matrix still has to be written to HBM for the backward pass',
                    'Fusion changes the numerical result',
                    'Training never uses softmax',
                  ],
                  answer: 1,
                  explanation:
                    'Fusion loads once and computes, but the backward pass needs the intermediate values — so they get written to HBM anyway. FlashAttention’s recomputation trick is what lets it fuse AND avoid storing the matrix.',
                },
              ],
            },
          ],
        },
        {
          id: 'fa-algorithm',
          title: 'Tiling and recomputation',
          minutes: 16,
          xp: 90,
          steps: [
            { kind: 'read', title: 'Never write the big matrix down', markdown: algorithmMd },
            {
              kind: 'quiz',
              title: 'How the algorithm works',
              questions: [
                {
                  prompt:
                    'Softmax normalizes over a whole row. How does FlashAttention compute it in blocks without ever holding a full row?',
                  options: [
                    'It approximates softmax with a fixed normalizer',
                    'It keeps running statistics (max m and sum ℓ) per row and rescales as each new block arrives',
                    'It computes softmax on the CPU',
                    'It skips the normalization entirely',
                  ],
                  answer: 1,
                  explanation:
                    'Online/running softmax: track (m, ℓ) per row; when a new block’s max beats the old one, rescale the accumulated output by e^(m_old−m_new). The final answer is exact — softmax over the full row, assembled incrementally.',
                },
                {
                  prompt: 'Why does FlashAttention RECOMPUTE S and P in the backward pass instead of storing them?',
                  options: [
                    'Recomputing is always fewer FLOPs',
                    'Reading the stored N×N matrix from HBM is slower than recomputing it on-chip from blocks already in SRAM',
                    'The gradients don’t need S and P',
                    'It saves nothing but is simpler to code',
                  ],
                  answer: 1,
                  explanation:
                    'Recomputation adds FLOPs but those run on data already in fast SRAM, avoiding the slow HBM round-trip of reading back a stored N×N matrix. More math, less waiting — net faster, and memory stays linear in N.',
                },
              ],
            },
          ],
        },
        {
          id: 'fa-io-complexity',
          title: 'Counting the traffic',
          minutes: 15,
          xp: 90,
          steps: [
            { kind: 'read', title: 'IO complexity and the lower bound', markdown: ioComplexityMd },
            {
              kind: 'code',
              title: 'Compute HBM accesses',
              challenge: {
                prompt:
                  'Theorem 2 gives HBM accesses for standard attention as Θ(N·d + N²) and for FlashAttention as Θ(N²·d²·M⁻¹), where N = sequence length, d = head dimension, M = SRAM size (in elements). Implement the three functions so the speedup ratio (standard / flash) matches the paper’s analysis. Note flash accesses fall as SRAM M grows; when M = d², they equal N².',
                starterCode: `function standardHBM(N, d) {
  // count: inputs/outputs (N*d) + the N×N matrix (N*N)
  return 0
}

function flashHBM(N, d, M) {
  // N^2 * d^2 / M
  return 0
}

function speedup(N, d, M) {
  // standard / flash
  return 0
}
`,
                solution: `function standardHBM(N, d) {
  return N * d + N * N
}

function flashHBM(N, d, M) {
  return (N * N * d * d) / M
}

function speedup(N, d, M) {
  return standardHBM(N, d) / flashHBM(N, d, M)
}
`,
                tests: `test('standard counts inputs plus the N×N matrix', () => {
  // N=1024, d=64 -> 1024*64 + 1024*1024
  assertEqual(standardHBM(1024, 64), 1114112)
})

test('flash accesses equal N² when SRAM M = d²', () => {
  // (N^2 * d^2) / d^2 = N^2
  assertEqual(flashHBM(1024, 64, 64 * 64), 1048576)
})

test('bigger SRAM M means fewer flash HBM accesses', () => {
  const small = flashHBM(1024, 64, 50000)
  const big = flashHBM(1024, 64, 100000)
  assertEqual(big < small, true)
})

test('speedup matches paper-scale numbers (~26x)', () => {
  assertEqual(Math.round(speedup(1024, 64, 100000)), 26)
})
`,
              },
            },
          ],
        },
        {
          id: 'fa-results',
          title: 'What it buys, what it costs',
          minutes: 14,
          xp: 80,
          steps: [
            { kind: 'read', title: 'Longer context, new capabilities, real costs', markdown: resultsMd },
            {
              kind: 'scenario',
              title: 'Choosing an attention implementation',
              scenario: {
                intro:
                  'You lead inference/training infra for a team shipping Transformer models. Different projects land on your desk with different constraints. Decide which attention strategy fits each, using FlashAttention’s trade-offs from the paper.',
                stages: [
                  {
                    situation:
                      'A research team needs to train a model at 16K context on A100s. Standard attention OOMs because the N×N matrix is quadratic in memory. They need exact results to compare fairly against published baselines.',
                    question: 'What do you recommend?',
                    options: [
                      {
                        label: 'FlashAttention',
                        quality: 'best',
                        feedback:
                          'Exactly right. Its memory is linear in N (up to 20× less than exact baselines), so 16K fits, and it’s exact — so the baseline comparison is fair. This is the case it was built for.',
                      },
                      {
                        label: 'A low-rank approximate method (e.g. Linformer)',
                        quality: 'bad',
                        feedback:
                          'It saves memory but changes the result, breaking the "exact comparison to baselines" requirement — and prior approximate methods often don’t even deliver wall-clock speedup.',
                      },
                      {
                        label: 'Just buy GPUs with more HBM',
                        quality: 'ok',
                        feedback:
                          'More HBM delays the OOM but doesn’t fix the quadratic scaling or the memory-traffic bottleneck — you’ll hit the wall again at longer context, and pay for hardware instead of fixing the algorithm.',
                      },
                    ],
                  },
                  {
                    situation:
                      'A different team is at 8K context and FlashAttention already runs, but they want another 2–4× and can tolerate a small, controlled approximation in attention.',
                    question: 'What’s the right next step?',
                    options: [
                      {
                        label: 'Block-sparse FlashAttention with a fixed sparsity pattern',
                        quality: 'best',
                        feedback:
                          'Correct. It skips zero blocks, cutting HBM accesses by a factor proportional to sparsity s (Θ(Nd + N²d²M⁻¹s)) — 2–4× on top of FlashAttention, accepting the approximation they said they can tolerate.',
                      },
                      {
                        label: 'Switch back to standard attention to be safe',
                        quality: 'bad',
                        feedback:
                          'That moves backward — standard attention is slower and more memory-hungry, and gives up the gains they already have.',
                      },
                      {
                        label: 'Reduce the model to a shorter context to go faster',
                        quality: 'ok',
                        feedback:
                          'It would speed things up but sacrifices the long context that’s presumably the point. Block-sparse gets speed while keeping 8K.',
                      },
                    ],
                  },
                  {
                    situation:
                      'A platform team wants one attention implementation that runs unchanged across several GPU architectures and is easy for non-CUDA engineers to modify.',
                    question: 'How do you set expectations about FlashAttention here?',
                    options: [
                      {
                        label:
                          'Flag that FlashAttention needs a hand-written CUDA kernel per variant and may not port across GPU archs',
                        quality: 'best',
                        feedback:
                          'Right — this is the paper’s own Section 5 limitation. The big wins are paid for in low-level engineering effort and reduced portability; that’s a real cost to weigh for a platform mandate.',
                      },
                      {
                        label: 'Promise it’s plug-and-play PyTorch with no caveats',
                        quality: 'bad',
                        feedback:
                          'Not accurate. The algorithm is implemented in CUDA for fine-grained memory control; it’s lower-level than PyTorch and not guaranteed portable across architectures.',
                      },
                      {
                        label: 'Say performance is identical to standard attention so it doesn’t matter',
                        quality: 'bad',
                        feedback:
                          'Performance is much better, not identical — but that’s not the team’s concern here. The honest caveat is the engineering/portability cost, not the speed.',
                      },
                    ],
                  },
                ],
                debrief:
                  'FlashAttention’s value proposition is exact attention with linear memory and far less HBM traffic — unlocking long context and faster training with no quality loss. Block-sparse adds a tunable approximation for more speed. The cost is real: hand-written, lower-level, less-portable CUDA kernels. Match the tool to the constraint that actually binds.',
              },
            },
          ],
        },
      ],
    },
  ],
}
