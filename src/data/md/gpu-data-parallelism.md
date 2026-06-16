# Data Parallelism: Splitting Batches Across GPUs

The simplest and most common form of distributed training is **data parallelism (DP)**: each GPU gets its own mini-batch of data, computes gradients independently, and then synchronizes.

## Why It Works: Gradients Are Linear

Training neural networks involves:
1. Forward pass on a mini-batch → compute loss
2. Backward pass → compute gradients (average of per-sample gradients)
3. Weight update using the gradient

The key insight: **gradients are linear in the loss**. If you compute loss as an average:

```
L = (1/m) * Σ L_i(x_i, w)
dL/dw = (1/m) * Σ dL_i/dw
```

You can rearrange this to:
```
dL/dw = (1/m) * [ (1/n) * Σ_batch1 dL_i/dw + (1/n) * Σ_batch2 dL_i/dw + ... ]
```

This is **mathematically identical** to training on the full batch on one GPU. No approximation — pure algebra.

## The Algorithm

With m GPUs and a mini-batch size of n per GPU:

1. **Load**: Each GPU loads a different mini-batch of n samples
2. **Forward + Backward**: Each GPU independently computes loss and gradients for its mini-batch
   - No communication needed — each GPU has a full copy of the model
3. **All-reduce**: All GPUs send their gradients to each other; each GPU receives the average
   - Each GPU now has identical, globally-averaged gradients
4. **Weight update**: Each GPU updates its local copy of weights using the averaged gradient
   - Since they all started with the same weights and applied the same gradient, they stay in sync

## The Communication Puzzle: Hiding All-reduce Behind Compute

The all-reduce (gradient averaging) is the bottleneck. But here's the trick: **it happens during the backward pass, not after**.

While computing backward for layer L, GPUs can simultaneously all-reduce the gradients of layer L+1. By the time the backward pass finishes, all-reduce is done — "free" (hidden).

This requires careful software orchestration (PyTorch does it via `DistributedDataParallel`), but it's the key to making DP scale.

## The Memory Bottleneck

Each GPU keeps its own copy of:
- Model parameters: 1 byte per parameter (FP8) or more (FP32)
- Gradients: same size as parameters
- Optimizer state (Adam): 2× parameters (momentum + variance)

For a 1 billion parameter model with 32-bit precision:
```
1 billion × 4 bytes (param) + 4 bytes (grad) + 8 bytes (optimizer) = 16 GB per GPU
```

H100 has 80 GB — so you can train ~5 billion parameters, max. **Larger models won't fit.**

## Solution: Fully Sharded Data Parallelism (FSDP)

Instead of each GPU keeping a full model copy, **split the weights across GPUs**. Each GPU owns a slice of parameters and is responsible for its own gradients and optimizer state.

During forward pass:
- GPU 0 broadcasts its weight slice → all GPUs have it
- All GPUs compute forward, then GPU 0 discards the weight (frees memory)
- GPU 1 broadcasts its weight slice → all GPUs compute, then discard
- Repeat for all layers

During backward pass:
- Same broadcast + discard pattern, but now each GPU aggregates gradients for "its" weights
- Only the owning GPU keeps the gradient and performs the weight update

**Memory savings**: Instead of 16 GB per GPU, you use 16 GB ÷ m (divided by number of GPUs).

**Tradeoff**: More communication (broadcasting weights) but much lower memory per GPU. You can now train much larger models.

## Hybrid Sharded Data Parallelism (HSDP)

FSDP works well within a server (8 GPUs, 900 GB/s bandwidth) but becomes expensive across racks (50 GB/s). **HSDP uses two axes of parallelism at once**:

- **Within a server**: FSDP (split model, high communication cost, but bandwidth is fast)
- **Across servers**: Standard DP (each server has a full model copy, only gradients are all-reduced)

This way:
- Expensive FSDP communication (weight broadcasts) stays within the fast 900 GB/s server link
- Only gradient all-reduce crosses the slower inter-server network

Real systems often use this 2D parallelism on a 3D grid of GPUs (servers, racks, pods).

## When to Use Each

| Strategy | Model Size | # GPUs | Best For |
|----------|-----------|--------|----------|
| **DP** | <10B params | <128 | Small models on modest hardware |
| **FSDP** | 10B–100B | 128–512 | Medium-to-large models, within pod |
| **HSDP** | >50B | 512+ | Very large models, multi-pod clusters |

The key metric: keep **Model FLOPs Utilization (MFU) as high as possible** while fitting in GPU memory.
