import type { Subject } from '../types'
import motivationMd from './md/fa2-motivation.md?raw'
import backgroundMd from './md/fa2-background.md?raw'
import algorithmMd from './md/fa2-algorithm.md?raw'
import parallelismMd from './md/fa2-parallelism.md?raw'
import resultsMd from './md/fa2-results.md?raw'

export const flashAttention2: Subject = {
  id: 'flash-attention-2',
  title: 'FlashAttention-2',
  tagline: 'Faster exact attention through better GPU parallelism and work partitioning.',
  icon: '💨',
  accent: '#22d3ee',
  modules: [
    {
      id: 'fa2-m1',
      title: 'FlashAttention-2: Faster Exact Attention',
      description:
        'Tri Dao (2023). Why FlashAttention left 60% of the GPU on the table, and the three scheduling tweaks that doubled it — without touching the answer.',
      lessons: [
        {
          id: 'fa2-motivation',
          title: 'The gap FlashAttention left behind',
          minutes: 11,
          xp: 60,
          steps: [
            { kind: 'read', title: 'The 75% left on the table', markdown: motivationMd },
            {
              kind: 'quiz',
              title: 'Why bother with a v2?',
              questions: [
                {
                  prompt:
                    'Attention is built from matrix multiplies, and optimized GEMM hits 80–90% of an A100’s peak. Yet FlashAttention’s forward pass reaches only 30–50%. According to the paper, why?',
                  options: [
                    'Attention needs more FLOPs than a plain matrix multiply',
                    'Suboptimal work partitioning across thread blocks and warps — causing low occupancy and unnecessary shared-memory traffic',
                    'The softmax is mathematically slower than multiplication',
                    'FlashAttention uses an approximation that must be corrected',
                  ],
                  answer: 1,
                  explanation:
                    'The arithmetic was already minimal and the result is exact. The waste was in scheduling: too few blocks to fill the GPU (low occupancy) and warps swapping partial results through slow shared memory. FlashAttention-2 fixes where/how work runs, not the math.',
                },
                {
                  prompt:
                    'On an A100, FP16 matmul peaks at 312 TFLOPs/s but non-matmul FP32 at only 19.5 TFLOPs/s. What does the paper conclude from this ~16× ratio?',
                  options: [
                    'Non-matmul FLOPs are negligible and can be ignored',
                    'Each non-matmul FLOP costs ~16× a matmul FLOP in wall-clock time, so it pays to minimize non-matmul work (like softmax rescaling)',
                    'You should convert all matmuls to FP32 for accuracy',
                    'Tensor Cores should be disabled for attention',
                  ],
                  answer: 1,
                  explanation:
                    'Even though non-matmul FLOPs are a small fraction of the total count, they are ~16× more expensive each. So minimizing them — e.g. rescaling the output once instead of every block — is worth real effort. This motivates Tweak 1.',
                },
                {
                  prompt: 'What does FlashAttention-2 change about the *output* of attention compared to FlashAttention?',
                  options: [
                    'It introduces a small approximation to gain speed',
                    'It produces a lower-precision result',
                    'Nothing — the output is identical and exact; only the parallelism and work partitioning change',
                    'It changes the softmax to a faster approximation',
                  ],
                  answer: 2,
                  explanation:
                    'This is the key framing of the whole paper: it is a pure scheduling/partitioning win. The result equals standard attention exactly. You gain ~2× speed and linear memory, not a different model.',
                },
              ],
            },
          ],
        },
        {
          id: 'fa2-background',
          title: 'The memory hierarchy and tiled attention',
          minutes: 13,
          xp: 70,
          steps: [
            { kind: 'read', title: 'HBM, SRAM, warps, and online softmax', markdown: backgroundMd },
            {
              kind: 'quiz',
              title: 'Foundations',
              questions: [
                {
                  prompt:
                    'Standard attention materializes S = QK⊤ and P = softmax(S) to HBM. Why is that the performance problem FlashAttention attacks?',
                  options: [
                    'Those matrices are N×N, costing O(N²) memory and a flood of slow HBM reads/writes',
                    'The matrices are computed in the wrong numeric format',
                    'softmax cannot be computed on a GPU',
                    'QK⊤ requires more FLOPs than PV',
                  ],
                  answer: 0,
                  explanation:
                    'With N from 1k–8k, the N×N intermediates dominate both memory (O(N²)) and time (each must be written to and read back from slow HBM). FlashAttention’s whole idea is to never write S or P to HBM.',
                },
                {
                  prompt:
                    'Tiling means you only ever have one block of the attention matrix in SRAM. Why does softmax make that hard, and what solves it?',
                  options: [
                    'softmax needs the max and sum over a whole row, but you only have one block; online softmax keeps a running max/sum and rescales the partial output',
                    'softmax cannot be split, so FlashAttention approximates it',
                    'softmax requires the full V matrix in SRAM at once',
                    'Tiling is impossible for attention; FlashAttention avoids softmax',
                  ],
                  answer: 0,
                  explanation:
                    'softmax couples an entire row. Online softmax tracks a running max m and normalizer ℓ across blocks and rescales the accumulated output as each new block arrives — giving the exact result with no full row ever materialized.',
                },
                {
                  prompt:
                    'In the GPU thread hierarchy, which communication is essentially free?',
                  options: [
                    'Between different thread blocks',
                    'Between warps in the same block (via shared memory)',
                    'Between threads within the same warp (via shuffle instructions)',
                    'Between SMs over HBM',
                  ],
                  answer: 2,
                  explanation:
                    'Threads in a warp share fast shuffle instructions. Warps in a block must go through slow shared memory; separate blocks don’t communicate at all. FlashAttention-2’s tweaks each push work toward a cheaper rung of this ladder.',
                },
              ],
            },
          ],
        },
        {
          id: 'fa2-algorithm',
          title: 'Algorithm tweaks: fewer non-matmul FLOPs',
          minutes: 12,
          xp: 70,
          steps: [
            { kind: 'read', title: 'Defer the rescale, store the logsumexp', markdown: algorithmMd },
            {
              kind: 'quiz',
              title: 'The two edits',
              questions: [
                {
                  prompt:
                    'FlashAttention-2 keeps an "un-scaled" running output Õ and divides by the normalizer ℓ only once, at the end of the loop. What does this save, and why is the answer still exact?',
                  options: [
                    'It saves matmul FLOPs; the answer changes slightly',
                    'It saves repeated non-matmul division work each block; one final rescale yields the identical output',
                    'It saves memory by dropping V; the answer is approximate',
                    'It saves HBM writes only; the answer is unchanged because of FP32',
                  ],
                  answer: 1,
                  explanation:
                    'The per-block division by diag(ℓ)⁻¹ is non-matmul work repeated every inner step. Deferring it to a single final rescale removes those divisions while producing the exact same O — a textbook "move the invariant work out of the loop" optimization.',
                },
                {
                  prompt:
                    'Instead of saving both the row-max m and the row-sum-of-exponentials ℓ for the backward pass, FlashAttention-2 stores a single value. What is it?',
                  options: [
                    'The raw scores S',
                    'The probability matrix P',
                    'The logsumexp L = m + log(ℓ)',
                    'The output O only',
                  ],
                  answer: 2,
                  explanation:
                    'Storing the combined logsumexp L = m + log(ℓ) halves the per-row bookkeeping; the backward pass recomputes P from L directly. Less to store, same gradients.',
                },
                {
                  prompt:
                    'With a causal mask, how does FlashAttention-2 exploit the block structure to gain ~1.7–1.8× speedup?',
                  options: [
                    'It applies the mask element-by-element to every block',
                    'It skips entire blocks that are fully in the future (column indices all greater than row indices), and masks only the one diagonal block per row',
                    'It converts the causal mask to a dense mask first',
                    'It disables tiling when a mask is present',
                  ],
                  answer: 1,
                  explanation:
                    'Roughly half the blocks lie entirely above the causal boundary and can be skipped outright. Only the single diagonal block straddling the boundary needs the element-wise mask; blocks fully below it need none.',
                },
              ],
            },
          ],
        },
        {
          id: 'fa2-parallelism',
          title: 'Parallelism & warp partitioning',
          minutes: 14,
          xp: 80,
          steps: [
            { kind: 'read', title: 'Fill the chip, then quiet the chatter', markdown: parallelismMd },
            {
              kind: 'scenario',
              title: 'Tuning attention for a long-context model',
              scenario: {
                intro:
                  'You own the attention kernel for a team training a long-context language model on A100s (108 SMs each). You keep hitting low GPU utilization. Apply FlashAttention-2’s reasoning to each decision — optimize for occupancy and minimal shared-memory traffic, not for what sounds clever.',
                stages: [
                  {
                    situation:
                      'Your model trains at 64k context. To fit memory you can only use batch size 2 with 8 heads. The original FlashAttention launches one thread block per (batch × head) = 16 blocks. The GPU has 108 SMs.',
                    question: 'Why is the GPU underutilized, and what do you do?',
                    options: [
                      {
                        label: 'Also parallelize over the sequence-length dimension to launch many more independent blocks',
                        quality: 'best',
                        feedback:
                          'Exactly Tweak 2. With only 16 blocks for 108 SMs, ~85% of the chip is idle (low occupancy). The outer loop over Q row-blocks is embarrassingly parallel, so each row-block becomes its own thread block — filling the SMs in the long-context / small-batch regime.',
                      },
                      {
                        label: 'Increase the batch size to 64 to create more blocks',
                        quality: 'bad',
                        feedback:
                          'You can’t — memory is exactly why the batch is small at 64k context. The whole point of Tweak 2 is to rescue occupancy *without* needing a large batch.',
                      },
                      {
                        label: 'Accept it — 16 blocks is enough work for any GPU',
                        quality: 'bad',
                        feedback:
                          'With 108 SMs, 16 blocks leaves the vast majority idle. This low-occupancy regime is precisely the problem FlashAttention-2 was built to fix.',
                      },
                    ],
                  },
                  {
                    situation:
                      'Inside each thread block, 4 warps must cooperate on a block of attention. The original scheme splits K and V across warps (Q shared) — the "split-K" scheme.',
                    question: 'You profile and see heavy shared-memory traffic. What partitioning do you switch to?',
                    options: [
                      {
                        label: 'Split Q across the warps and keep K, V shared (split-Q)',
                        quality: 'best',
                        feedback:
                          'Tweak 3. With split-Q each warp owns whole output rows: after computing its QK⊤ slice it multiplies by the shared V to get its output slice — no inter-warp reduction. The shared-memory write/sync/add round-trips of split-K disappear.',
                      },
                      {
                        label: 'Keep split-K but add more synchronization barriers',
                        quality: 'bad',
                        feedback:
                          'More barriers is the opposite of the fix. split-K’s problem *is* the write-to-shared-memory, sync, and reduce cycle. Adding sync makes the chatter worse.',
                      },
                      {
                        label: 'Reduce to 1 warp per block to avoid all warp communication',
                        quality: 'ok',
                        feedback:
                          'It does remove inter-warp communication, but a single warp can’t exploit the block’s parallelism and tanks throughput. split-Q keeps all 4 warps busy AND eliminates the communication — strictly better.',
                      },
                    ],
                  },
                  {
                    situation:
                      'You try cranking block sizes way up to {256}×{256} to cut shared-memory loads further.',
                    question: 'What’s the risk the paper warns about?',
                    options: [
                      {
                        label: 'Past a point, register spilling slows it down — or required SRAM exceeds the GPU and the kernel won’t launch',
                        quality: 'best',
                        feedback:
                          'Right. Bigger blocks cut loads/stores but cost more registers and SRAM. Too far and you get register spilling (slowdown) or exceed available shared memory (kernel fails). The paper sticks to {64,128}×{64,128}, hand-tuned per head dimension.',
                      },
                      {
                        label: 'Nothing — bigger blocks are always faster',
                        quality: 'bad',
                        feedback:
                          'There is a hard ceiling. Beyond it you hit register spilling or run out of SRAM entirely; the kernel may not even launch.',
                      },
                      {
                        label: 'The output becomes approximate at large block sizes',
                        quality: 'bad',
                        feedback:
                          'Block size never affects correctness — the result stays exact. It only trades shared-memory traffic against register/SRAM pressure.',
                      },
                    ],
                  },
                ],
                debrief:
                  'FlashAttention-2’s two scheduling tweaks: (2) parallelize over sequence length to fill SMs when batch×heads is small, and (3) use split-Q so warps need no shared-memory reduction. Block size is a register/SRAM balancing act — bigger isn’t free, and never changes the answer.',
              },
            },
          ],
        },
        {
          id: 'fa2-results',
          title: 'Results: FLOPs, throughput, and MFU',
          minutes: 14,
          xp: 80,
          steps: [
            { kind: 'read', title: 'Did it work? The numbers', markdown: resultsMd },
            {
              kind: 'code',
              title: 'Compute attention FLOPs and MFU',
              challenge: {
                prompt: `## Reproduce the paper's FLOP accounting

Section 4.1 gives the exact formulas the authors use to turn a benchmark run into a TFLOPs/s and an MFU number. Implement them.

**1.** \`attentionFlops(seqlen, headDim, numHeads, causal)\` — total **forward + backward** FLOPs:
- Forward FLOPs = \`4 * seqlen^2 * headDim * numHeads\`.
- If \`causal\` is true, **halve** the forward FLOPs (only ~half the entries are computed).
- Backward FLOPs = \`2.5 *\` forward (5 matmuls vs 2, due to recomputation).
- Return forward + backward (i.e. \`3.5 *\` forward).

**2.** \`mfu(achievedTFLOPs, peakTFLOPs)\` — model FLOPs utilization as a fraction, **rounded to 2 decimals**. E.g. 225 achieved on a 312 peak → \`0.72\`.

The tests check the paper's own numbers: a non-causal forward+backward at seqlen 512, the causal half, and the 72% MFU headline.`,
                starterCode: `function attentionFlops(seqlen, headDim, numHeads, causal) {
  // forward = 4 * seqlen^2 * headDim * numHeads, halved if causal
  // total = forward + 2.5 * forward
  return 0;
}

function mfu(achievedTFLOPs, peakTFLOPs) {
  // fraction, rounded to 2 decimals
  return 0;
}`,
                solution: `function attentionFlops(seqlen, headDim, numHeads, causal) {
  let forward = 4 * Math.pow(seqlen, 2) * headDim * numHeads;
  if (causal) forward = forward / 2;
  const backward = 2.5 * forward;
  return forward + backward;
}

function mfu(achievedTFLOPs, peakTFLOPs) {
  return Math.round((achievedTFLOPs / peakTFLOPs) * 100) / 100;
}`,
                tests: `test('non-causal forward+backward FLOPs (seqlen 512, d=64, 32 heads)', () => {
  // forward = 4 * 512^2 * 64 * 32 = 2147483648; total = 3.5x
  assertEqual(attentionFlops(512, 64, 32, false), 7516192768);
});
test('causal halves the forward term', () => {
  assertEqual(attentionFlops(512, 64, 32, true), 3758096384);
});
test('scales quadratically in sequence length', () => {
  // forward = 4 * 1024^2 * 128 * 16 = 8589934592; total = 3.5x
  assertEqual(attentionFlops(1024, 128, 16, false), 30064771072);
});
test('MFU matches the paper headline (225 of 312 peak -> 0.72)', () => {
  assertEqual(mfu(225, 312), 0.72);
});
test('MFU rounds to 2 decimals', () => {
  assertEqual(mfu(196, 312), 0.63);
});`,
              },
            },
          ],
        },
      ],
    },
  ],
}
