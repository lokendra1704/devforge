# Pipeline and Tensor Parallelism: Splitting the Model Itself

As models grow beyond hundreds of billions of parameters and sequences grow to 100k+ tokens, data parallelism alone isn't enough. You need to **split the model structure itself** across GPUs.

## Pipeline Parallelism: Layers Across GPUs

The straightforward idea: divide the layers of a transformer across GPUs.

```
GPU 0: Layers 1–32
GPU 1: Layers 33–64
GPU 2: Layers 65–96
GPU 3: Layers 97–128
```

**The naive way is terrible**: GPU 0 runs forward (passes activations to GPU 1), then waits. GPU 1 runs forward (passes to GPU 2), then waits. GPU 3 finishes, then backward propagates back. **GPUs are idle 75% of the time.**

With 4 GPUs naively: maximum MFU ≈ 25% (only one GPU does useful work at any moment).

## The Fix: Micro-batches and Overlapping

Instead of one large batch, use multiple small **micro-batches** in flight simultaneously:

```
GPU 0 forward on micro-batch 1 (pass to GPU 1)
GPU 0 forward on micro-batch 2 (while GPU 1 does forward on batch 1)
GPU 0 forward on micro-batch 3 (while GPU 1 does batch 2, GPU 2 does batch 1)
...
[backward phase, same overlapping pattern]
```

With clever scheduling and enough micro-batches, you can achieve ~50–60% MFU (vs 25% naively).

**Tradeoff**: More micro-batches means more activations to store in memory. Solution: **activation checkpointing** (recompute activations during backward instead of storing them).

## Tensor Parallelism: Splitting Weight Matrices

A transformer layer repeatedly does `Y = XW` (matrix multiply). Instead of computing the full output, split W across GPUs:

```
W = [W1  W2  W3  W4]   (split by columns)

Y = XW = [X*W1  X*W2  X*W3  X*W4]

Each GPU computes a slice of the output.
```

**No global synchronization during forward** — each GPU computes its piece independently.

## The Two-Layer Trick (Most Powerful)

The magic happens when you have **two consecutive layers** (common in transformer FFN blocks):

```
Layer 1: Y = X * W1 (split W1 by columns)
Layer 2: Z = Y * W2 (split W2 by rows)
```

If you align the splits carefully:
- GPU 0 computes the (0,0) block: (X's first part) * (W1's columns 0–n) * (W2's rows 0–n)
- GPU 1 computes the (0,1) block: (X's first part) * (W1's columns n–2n) * (W2's rows n–2n)
- ...all in parallel

The final output is just the sum of these partial results. **You can compute two full transformer layers with only one all-reduce at the end.**

This is why tensor parallelism is often used on the FFN (which is two layers: linear → ReLU → linear).

## The Scaling Landscape: Real Numbers from Llama-3

Meta's Llama-3 405B (405 billion parameters) uses **4D parallelism simultaneously**:

- **8-way tensor parallelism**: split weight matrices
- **16-way pipeline parallelism**: split layers  
- **16-way context parallelism**: split sequence dimension
- **8-way data parallelism**: split batches

**Total GPUs**: 8 × 16 × 16 × 8 = 16,384 GPUs

Each axis tackles a different bottleneck:
- Tensor parallelism → fits model weights in GPU memory
- Pipeline parallelism → hides forward/backward latency
- Context parallelism → handles long sequences (130k tokens)
- Data parallelism → feeds all the layers with different batches

## When to Add Each Axis

1. **Start with DP**: up to 128 GPUs, works well
2. **Add FSDP** (weight sharding): model doesn't fit in GPU memory
3. **Add pipeline parallelism**: forward/backward communication is a bottleneck
4. **Add tensor parallelism**: weight matrices themselves are huge
5. **Add context parallelism**: sequence length is massive (>100k tokens)

The order matters. Adding every axis at once breaks things. Add one, profile MFU, then add the next.

## The Central Principle

All of these strategies boil down to one idea: **Keep the tensor cores busy by overlapping computation and communication, while managing the memory hierarchy carefully.**

The 1,000× GPU speedup is only useful if you can feed 16,000+ devices useful work, hide communication latency behind compute, and keep everything in synchronization without deadlock. That's the puzzle these strategies solve.
