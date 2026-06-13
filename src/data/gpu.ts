import type { Subject } from '../types'
import whyMd from './md/gpu-why.md?raw'
import simtMd from './md/gpu-simt.md?raw'
import firstKernelMd from './md/gpu-first-kernel.md?raw'
import memoryMd from './md/gpu-memory.md?raw'
import eliteMd from './md/gpu-elite.md?raw'

export const gpu: Subject = {
  id: 'gpu',
  title: 'GPU Engineering',
  tagline: 'From “why GPUs exist” to kernel programming and the road to FlashAttention.',
  icon: '⚡',
  accent: '#f87171',
  modules: [
    {
      id: 'gpu-m1',
      title: 'From Scratch',
      description: 'The throughput machine: why it exists and how it is built.',
      lessons: [
        {
          id: 'gpu-why',
          title: 'Why GPUs exist',
          minutes: 12,
          xp: 60,
          steps: [
            { kind: 'read', title: 'F1 cars vs bus fleets', markdown: whyMd },
            {
              kind: 'quiz',
              title: 'The shape test',
              questions: [
                {
                  prompt: 'Which workload is the BEST fit for a GPU?',
                  options: [
                    'Parsing a 2GB JSON file token by token',
                    'Applying the same brightness filter to 50 million pixels',
                    'Running a single-threaded chess engine deeper',
                    'Serving HTTP requests with branching business logic',
                  ],
                  answer: 1,
                  explanation:
                    'Same small operation × millions of independent data elements = the exact shape GPUs are built for. Parsing is sequential (each token depends on the last), and branchy business logic wastes lockstep hardware. The shape test: same op, many elements, mostly independent.',
                },
                {
                  prompt:
                    'Your pipeline is 20% inherently sequential and 80% perfectly parallelizable. You buy infinite GPUs. Maximum overall speedup?',
                  options: ['Unlimited', '80×', '5×', '20×'],
                  answer: 2,
                  explanation:
                    'Amdahl’s law: with the parallel 80% reduced to ~zero time, the sequential 20% remains. 1 / 0.20 = 5×. This is why the sequential fraction — not the GPU — usually ends up being the bottleneck, and why real systems split work: CPU for the plot, GPU for the crowd scenes.',
                },
                {
                  prompt: 'A CPU core dodges memory latency with big caches and prediction. How does a GPU deal with the same ~600-cycle wait?',
                  options: [
                    'Its memory is simply faster, so waits are short',
                    'It hides latency: when one warp stalls on memory, the scheduler instantly runs another resident warp',
                    'It precomputes all memory addresses at compile time',
                    'It avoids memory entirely by keeping data in registers',
                  ],
                  answer: 1,
                  explanation:
                    'The GPU strategy is throughput, not avoidance: keep dozens of warps resident per SM and switch between them at zero cost, so memory waits are buried under other warps’ arithmetic. Consequence for you: kernels must expose ENOUGH parallelism to hide behind — a few thousand threads is not “a lot” to a GPU.',
                },
              ],
            },
          ],
        },
        {
          id: 'gpu-simt',
          title: 'Inside the machine: SMs, warps, SIMT',
          minutes: 14,
          xp: 70,
          steps: [
            { kind: 'read', title: 'The hierarchy', markdown: simtMd },
            {
              kind: 'quiz',
              title: 'Warp logic',
              questions: [
                {
                  prompt:
                    'A kernel contains: if (threadIdx.x % 2 == 0) pathA(); else pathB(); — both paths take 100 cycles. How long does one warp take through this section?',
                  options: [
                    '~100 cycles — the paths run in parallel on different lanes',
                    '~200 cycles — the warp executes both paths serially with half the lanes masked each time',
                    '~50 cycles — only half the threads do work',
                    'It deadlocks',
                  ],
                  answer: 1,
                  explanation:
                    'One program counter per warp: it runs pathA with odd lanes masked (idle), then pathB with even lanes masked. 100 + 100 = 200 cycles, half the silicon wasted throughout. This is warp divergence — and because the % 2 pattern alternates WITHIN warps, it is the worst case. Grouping by warp (e.g. % on warp index) would cost nothing.',
                },
                {
                  prompt: 'Why must CUDA blocks be independent of each other (no waiting on another block’s results)?',
                  options: [
                    'A hardware limitation that newer GPUs have fixed',
                    'Blocks are scheduled onto SMs in arbitrary order as SMs free up — a block you wait on may not have started yet, and may never start until you finish',
                    'Inter-block communication is too slow to be useful',
                    'It simplifies the compiler',
                  ],
                  answer: 1,
                  explanation:
                    'There may be 100,000 blocks and only 132 SMs; blocks run whenever an SM frees up, in no promised order. Block A waiting on block Z can deadlock the GPU if Z is queued behind A. This independence rule is also the superpower: the same binary scales from 20-SM laptops to 132-SM datacenter cards.',
                },
                {
                  prompt: 'Why does switching between warps cost zero cycles, while an OS thread context switch costs thousands?',
                  options: [
                    'GPU warps have no state to save',
                    'Every resident warp’s registers live permanently in the SM’s huge register file — nothing is saved or restored',
                    'The GPU runs the OS scheduler in hardware',
                    'Warps share a single set of registers',
                  ],
                  answer: 1,
                  explanation:
                    'An OS switch must save and reload register state through memory. The SM instead provisions a massive register file holding ALL resident warps’ registers simultaneously; “switching” is just the scheduler issuing from a different warp next cycle. That register file is the price of free latency hiding — and why register usage per thread limits occupancy (lesson 5).',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'gpu-m2',
      title: 'Kernel Programming',
      description: 'Write the kernel, own the indexing, build the execution model yourself.',
      lessons: [
        {
          id: 'gpu-first-kernel',
          title: 'Your first CUDA kernel',
          minutes: 25,
          xp: 130,
          steps: [
            { kind: 'read', title: 'The loop disappears', markdown: firstKernelMd },
            {
              kind: 'quiz',
              title: 'Indexing math (everyone fumbles this once)',
              questions: [
                {
                  prompt: 'blockDim.x = 128. Which global element does thread 17 of block 3 handle?',
                  options: ['381', '401', '17', '433'],
                  answer: 1,
                  explanation:
                    'i = blockIdx.x × blockDim.x + threadIdx.x = 3 × 128 + 17 = 384 + 17 = **401**. Stadium seating: skip 3 full rows of 128 seats (384), then walk to seat 17 in your row. If you picked 17, you used the thread index alone — the classic bug where every block overwrites block 0’s work.',
                },
                {
                  prompt: 'You launch vectorAdd for n = 1000 with 256 threads per block, so 4 blocks = 1024 threads. What happens without the if (i < n) guard?',
                  options: [
                    'Nothing — extra threads compute harmless garbage in registers',
                    'Threads 1000–1023 write past the end of the arrays, silently corrupting adjacent memory',
                    'CUDA automatically masks out-of-range threads',
                    'The kernel fails to compile',
                  ],
                  answer: 1,
                  explanation:
                    'The grid is rounded UP to whole blocks, so 24 threads compute indices beyond the array and their writes land in whatever memory follows. No error at the scene — just corrupted data and a mystery crash later. The bounds guard is mandatory in every kernel where the grid can overshoot.',
                },
                {
                  prompt:
                    'A kernel does ONE addition per element, and the data must be copied CPU→GPU and back just for this. PCIe moves ~32 GB/s; GPU memory ~2000 GB/s. Where does the time go?',
                  options: [
                    'Kernel arithmetic',
                    'The PCIe transfers dominate — the GPU computes for microseconds while transfers take tens of milliseconds',
                    'Kernel launch overhead',
                    'cudaMalloc',
                  ],
                  answer: 1,
                  explanation:
                    'One add per transferred byte is a terrible exchange rate: the copies cost ~60× more than the compute. Rule one of GPU performance: amortize transfers — move data once, run MANY kernels on it, return only results. This is why “just GPU it” fails for small or transfer-heavy jobs.',
                },
              ],
            },
            {
              kind: 'code',
              title: 'Build the execution model',
              challenge: {
                prompt: `## Simulate the GPU: build launchKernel

The fastest way to truly get CUDA's execution model is to **implement it**. You'll write the "hardware" (a launcher that runs a kernel across a grid) and a kernel for it — in JavaScript.

**1.** \`launchKernel(gridDim, blockDim, kernel, args)\` — invoke \`kernel(ctx, args)\` once per thread, for every \`blockIdx\` in \`[0, gridDim)\` and every \`threadIdx\` in \`[0, blockDim)\`, where \`ctx = { blockIdx, blockDim, threadIdx }\`.

**2.** \`blocksFor(n, threadsPerBlock)\` — ceil division: how many blocks cover n elements.

**3.** \`vectorAddKernel(ctx, { a, b, out, n })\` — the classic: compute the global index from ctx, **guard the bounds**, write \`out[i] = a[i] + b[i]\`.

The tests launch your kernel with a grid that overshoots n — exactly like real CUDA — and check that the guard held.`,
                starterCode: `function launchKernel(gridDim, blockDim, kernel, args) {
  // every block, every thread: kernel({ blockIdx, blockDim, threadIdx }, args)

}

function blocksFor(n, threadsPerBlock) {
  // ceil(n / threadsPerBlock) - the (n + t - 1) / t trick or Math.ceil

}

function vectorAddKernel(ctx, { a, b, out, n }) {
  // i = blockIdx * blockDim + threadIdx
  // guard: if (i < n)
  // out[i] = a[i] + b[i]

}`,
                solution: `function launchKernel(gridDim, blockDim, kernel, args) {
  for (let blockIdx = 0; blockIdx < gridDim; blockIdx++) {
    for (let threadIdx = 0; threadIdx < blockDim; threadIdx++) {
      kernel({ blockIdx, blockDim, threadIdx }, args);
    }
  }
}

function blocksFor(n, threadsPerBlock) {
  return Math.ceil(n / threadsPerBlock);
}

function vectorAddKernel(ctx, { a, b, out, n }) {
  const i = ctx.blockIdx * ctx.blockDim + ctx.threadIdx;
  if (i < n) {
    out[i] = a[i] + b[i];
  }
}`,
                tests: `test('blocksFor: exact fit', () => {
  assertEqual(blocksFor(1024, 256), 4);
});
test('blocksFor: rounds UP for partial blocks', () => {
  assertEqual(blocksFor(1000, 256), 4);
  assertEqual(blocksFor(1, 256), 1);
  assertEqual(blocksFor(257, 256), 2);
});
test('launchKernel visits every (block, thread) pair exactly once', () => {
  const seen = [];
  launchKernel(3, 4, (ctx) => seen.push(ctx.blockIdx + ':' + ctx.threadIdx), {});
  assertEqual(seen.length, 12);
  assertEqual(seen[0], '0:0');
  assertEqual(seen[4], '1:0');
  assertEqual(seen[11], '2:3');
});
test('vector add: full pipeline', () => {
  const n = 10;
  const a = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const b = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
  const out = new Array(n).fill(0);
  launchKernel(blocksFor(n, 4), 4, vectorAddKernel, { a, b, out, n });
  assertEqual(out, [10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);
});
test('the bounds guard: overshooting threads must NOT write', () => {
  const n = 10; // 3 blocks x 4 threads = 12 threads, 2 must be masked
  const a = new Array(n).fill(1);
  const b = new Array(n).fill(1);
  const out = new Array(12).fill(-999); // sentinels past the end
  launchKernel(3, 4, vectorAddKernel, { a, b, out, n });
  assertEqual(out[10], -999, 'thread 10 wrote out of bounds!');
  assertEqual(out[11], -999, 'thread 11 wrote out of bounds!');
});
test('your launcher is generic: a square kernel works too', () => {
  const n = 5;
  const x = [1, 2, 3, 4, 5];
  const out = new Array(n).fill(0);
  const squareKernel = (ctx, args) => {
    const i = ctx.blockIdx * ctx.blockDim + ctx.threadIdx;
    if (i < args.n) args.out[i] = args.x[i] * args.x[i];
  };
  launchKernel(blocksFor(n, 2), 2, squareKernel, { x, out, n });
  assertEqual(out, [1, 4, 9, 16, 25]);
});`,
              },
            },
          ],
        },
      ],
    },
    {
      id: 'gpu-m3',
      title: 'The Elite Path',
      description: 'Memory hierarchy, coalescing, tiling — and the road to FlashAttention.',
      lessons: [
        {
          id: 'gpu-memory',
          title: 'Memory is everything',
          minutes: 16,
          xp: 80,
          steps: [
            { kind: 'read', title: 'Feeding the beast', markdown: memoryMd },
            {
              kind: 'quiz',
              title: 'Memory instincts',
              questions: [
                {
                  prompt:
                    'A warp’s 32 threads read a[i], a[i+1], …, a[i+31] (consecutive floats). How many 128-byte memory transactions?',
                  options: ['32', '1', '4', '16'],
                  answer: 1,
                  explanation:
                    '32 consecutive floats × 4 bytes = 128 bytes = exactly one transaction. This is perfect coalescing. If the same threads instead read a[i*32] (strided), it becomes 32 transactions for the same amount of useful data — a 32× bandwidth tax. Adjacent threads should read adjacent addresses.',
                },
                {
                  prompt:
                    'Two kernels do identical math on a row-major matrix. Kernel R walks rows; kernel C walks columns. C runs 20× slower. Why?',
                  options: [
                    'Column arithmetic requires extra multiplications',
                    'Walking columns makes each warp’s accesses strided by the row length — every read is its own memory transaction',
                    'The compiler optimizes row loops better',
                    'Caches only store rows',
                  ],
                  answer: 1,
                  explanation:
                    'In row-major layout, column-neighbors are a full row apart in memory. Each thread’s read lands in a different cache line → uncoalesced → ~each float pays for 128 bytes. Fix: have warps walk rows, or stage tiles through shared memory (load coalesced, then access any pattern on-chip) — exactly how fast transpose works.',
                },
                {
                  prompt: 'What goes wrong here?\n\nif (threadIdx.x < 16) { tile[threadIdx.x] = data[i]; __syncthreads(); }',
                  options: [
                    'Nothing — only 16 threads need to sync',
                    'Threads 16–31 never reach __syncthreads(), so threads 0–15 wait at the barrier forever: deadlock',
                    'Shared memory cannot be written conditionally',
                    'It compiles to a slower instruction',
                  ],
                  answer: 1,
                  explanation:
                    '__syncthreads() is a BLOCK-wide barrier: every thread of the block must arrive. Half the block takes the branch and waits; the other half never enters it. The kernel hangs until the GPU watchdog kills it. Rule: barriers go in uniform control flow — outside the if, or restructure so all threads take the branch.',
                },
              ],
            },
          ],
        },
        {
          id: 'gpu-elite',
          title: 'Tiled matmul → occupancy → FlashAttention',
          minutes: 18,
          xp: 100,
          steps: [
            { kind: 'read', title: 'The optimization ladder', markdown: eliteMd },
            {
              kind: 'quiz',
              title: 'Think like a kernel engineer',
              questions: [
                {
                  prompt: 'Tiling speeds up matmul ~10×. What is the mechanism?',
                  options: [
                    'It reduces the number of multiply-adds performed',
                    'Each value loaded from global memory is reused ~32 times from shared memory, raising arithmetic intensity until the kernel is compute-bound instead of memory-bound',
                    'It increases the GPU clock speed',
                    'It avoids the bounds-check branch',
                  ],
                  answer: 1,
                  explanation:
                    'The math count is identical — tiling changes the BYTES, not the FLOPs. Naive matmul refetches each operand N times from slow memory; tiling fetches it once per tile and reuses it from the on-chip scratchpad. AI rises ~32×, crossing the roofline from the bandwidth-limited region to the compute-limited one.',
                },
                {
                  prompt:
                    'Nsight Compute shows your kernel at arithmetic intensity 0.1, far below the roofline ridge point. Which optimization is worth your week?',
                  options: [
                    'Enabling tensor cores for faster math',
                    'Memory-side work: coalescing, tiling/reuse, vectorized loads, kernel fusion',
                    'Increasing clock speeds',
                    'Unrolling the arithmetic loops harder',
                  ],
                  answer: 1,
                  explanation:
                    'AI 0.1 means the kernel is deep in memory-bound territory: the math units are starving, so faster math (tensor cores, unrolling) changes nothing. Every worthwhile move reduces or accelerates bytes: coalesce, reuse via tiles, fuse kernels to skip round-trips. Profile → locate on roofline → optimize the binding wall. Never guess.',
                },
                {
                  prompt: 'What is the core idea of FlashAttention?',
                  options: [
                    'A faster approximation that skips part of the attention math',
                    'Fusing all of attention into one kernel that processes tiles with an online softmax, so the N×N score matrix never exists in global memory',
                    'Running attention in FP8 precision',
                    'Caching attention scores between layers',
                  ],
                  answer: 1,
                  explanation:
                    'FlashAttention computes EXACT attention — the win is pure memory engineering: tiling + kernel fusion + a running softmax rescale keep everything in fast on-chip memory, eliminating gigabytes of HBM traffic per layer. It is the same “don’t refetch, don’t materialize” instinct as tiled matmul, applied at boss level — proof that the elite path is one idea compounding.',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
