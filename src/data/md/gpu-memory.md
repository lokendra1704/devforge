# Memory is everything: the hierarchy, coalescing, and shared memory

Here's the dirty secret of GPU programming: **most slow kernels are not compute-bound — they're memory-bound.** An H100 can do ~67 trillion FP32 operations/sec but read "only" ~3.35 TB/sec. Divide: the hardware can do **~80 math operations in the time it takes to fetch one float**. If your kernel does 2 operations per float fetched, the arithmetic units idle 97% of the time, and no amount of clever math fixes it. Elite GPU programming is mostly the art of feeding the beast.

## The hierarchy (speeds approximate, shapes eternal)

| Memory | Scope | Latency | Size |
|---|---|---|---|
| **Registers** | per thread | 1 cycle | ~255 per thread |
| **Shared memory** | per block (on the SM) | ~20–30 cycles | ~48–228 KB per SM |
| **L2 cache** | whole GPU | ~200 cycles | ~40–50 MB |
| **Global memory (HBM)** | whole GPU | ~400–800 cycles | 24–80 GB |
| CPU RAM, over PCIe | host | ~thousands | huge |

Two orders of magnitude separate registers from global memory. The whole game: **do your repeated work in the fast layers; touch the slow layer once.**

## Coalescing: the rule that makes or breaks kernels

Global memory is read in **128-byte transactions** — the hardware cannot fetch one lonely float; it fetches a cache line. So when a warp's 32 threads each read a float, the question is: *how many 128-byte transactions does it take to satisfy all 32?*

- **Coalesced (the good case):** threads 0..31 read consecutive addresses `a[i]`, `a[i+1]`, … `a[i+31]` → 32 floats × 4 bytes = exactly **one 128-byte transaction**. Full bandwidth.
- **Strided (the disaster):** threads read `a[i*32]` — each float lands in a different cache line → **32 transactions**, 31 of them mostly wasted. You just paid 32× for the same data. Your "3 TB/s" GPU delivers 100 GB/s.

The classic real-world case: a matrix stored row-major, accessed **by column** → every access strided by the row length → kernel runs ~10–30× slower than its twin that walks rows. Same math, same thread count; the only difference is *which thread reads which address*. **Adjacent threads should read adjacent addresses** — tattoo it somewhere.

## Shared memory: the programmable cache

When data must be reused or accessed in awkward patterns, blocks get a superpower: a scratchpad **on the SM itself**, ~20× faster than global memory, visible to all threads in the block:

```c
__shared__ float tile[32][32];               // on-chip scratchpad
tile[ty][tx] = matrix[row * N + col];        // each thread loads ONE element, coalesced
__syncthreads();                             // barrier: wait for the whole block
// ...now every thread reads tile[][] freely - any pattern, ~zero cost
```

The pattern is always the same three beats: **load a tile cooperatively (coalesced) → syncthreads → compute out of the fast tile.** This is how matrix transpose goes from strided disaster to full speed: read rows coalesced into the tile, write columns coalesced *from* the tile — the awkward access pattern happens in fast memory where strides don't matter.

`__syncthreads()` is the block-wide barrier, and it carries a deadly rule: **every thread in the block must reach it.** Put it inside an `if` that only some threads enter, and the rest wait forever — the kernel hangs, the GPU times out.

## The metric that predicts everything: arithmetic intensity

```
AI = FLOPs performed / bytes moved from global memory
```

- Vector add: 1 add per 12 bytes → AI ≈ 0.08 → hopelessly memory-bound, bandwidth is destiny
- Naive matmul: ~0.25 → memory-bound (every operand refetched)
- **Tiled** matmul: each loaded tile reused 32× → AI jumps ~32× → finally compute-bound

That's the entire reason tiling exists, and it's the bridge to the elite lesson: the **roofline model**, where you compute a kernel's AI, place it on a chart, and know *before optimizing* whether to chase bandwidth or FLOPs. Next.
