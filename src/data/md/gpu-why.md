# Why GPUs exist

## Two ways to move a stadium

You need to move 80,000 people out of a stadium. Option A: four Formula 1 cars — blazing fast, two seats each. Option B: a thousand buses — each slow, but 60 seats.

The F1 car is a **CPU core**: enormous engineering (branch prediction, out-of-order execution, deep caches) making *one stream of instructions* as fast as physics allows. The bus fleet is a **GPU**: thousands of simple cores, each individually unimpressive, collectively unstoppable — *when the work is parallel*.

## The numbers that explain everything

| | High-end CPU | High-end GPU |
|---|---|---|
| Cores | ~16–64 complex | ~10,000–17,000 simple |
| Clock speed | ~4–5.5 GHz | ~1.5–2.5 GHz |
| One single-threaded task | 🏆 wins easily | embarrassingly slow |
| Same operation on 50M pixels | grinds | 🏆 wins by 10–100× |
| Design philosophy | minimize **latency** of one task | maximize **throughput** of many |

A CPU spends most of its silicon on *being clever* (caches, predictors, schedulers) so one thread never waits. A GPU spends its silicon on *arithmetic units*, and instead of avoiding waits, it **hides** them: when one group of threads stalls on memory, the scheduler instantly switches to another group. Latency is not avoided — it's drowned in parallelism.

## Why games birthed this, and AI inherited it

Rendering one 4K frame = computing color for **8.3 million pixels**, each mostly independent of its neighbors, 60 times per second. That's the bus-fleet workload in its purest form — *the same small program run on millions of data points*. GPUs were built for exactly this shape.

Then came the plot twist: neural networks are **matrix multiplications**, and a matrix multiply is… the same small program (multiply, add) run on millions of data points. The hardware built to draw exploding barrels in games turned out to be the perfect engine for deep learning. Every ChatGPT response you've ever read was computed on hardware whose ancestors rendered Quake.

## The shape test (your most important takeaway)

Work is GPU-shaped when:

1. **The same operation** applies to many data elements (thousands minimum, millions ideally)
2. Elements are **mostly independent** — pixel #4,001 doesn't need pixel #4,000's result
3. Arithmetic is heavy relative to data movement (we'll obsess over this ratio later)

GPU-shaped: image filters, matmuls, physics particles, crypto hashing, training and inference.
CPU-shaped: parsing a file (each token depends on the last), business logic full of branches, anything fundamentally sequential.

**Amdahl's law** is the fine print: if 20% of your program is sequential, infinite parallel speedup of the other 80% still caps you at 5×. The sequential part always becomes the bottleneck — which is why real systems use *both*: CPU for the plot, GPU for the crowd scenes.

## Where this track goes

From here: the GPU's internal architecture (SMs, warps, SIMT) → your first CUDA kernel and the thread-indexing math → the memory hierarchy where 90% of performance lives → the elite path: tiling, occupancy, and the road to FlashAttention. From scratch to kernel-level — let's go.
