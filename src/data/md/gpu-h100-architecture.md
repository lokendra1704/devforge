# The H100: Inside the GPU

GPUs started for graphics but evolved into generalized parallel processors. Today's **H100** is the workhorse of large-scale deep learning training.

## The Memory Hierarchy

Inside an H100:
- **80 GB HBM memory** (high-bandwidth memory): the main buffer, ~3 TB/s bandwidth to compute cores
- **50 MB L2 cache**: much smaller, but closer to the compute elements
- **256 KB L1 cache** (per streaming multiprocessor): tiny, but much faster

The pattern repeats what you see in CPUs: larger memory farther from compute, smaller memory closer and faster. **Writing performant GPU kernels means being deeply aware of this memory hierarchy and deliberately managing data movement between levels.**

## The Compute Units: Streaming Multiprocessors (SMs)

An H100 contains **132 active streaming multiprocessors** (SMs) — think of each as a quasi-independent CPU-like core, but more parallel and lower clock speed than a traditional CPU core.

Inside each SM:
- **256 FP32 cores**: arithmetic units that perform floating-point operations like `a*x + b` (fused multiply-add) in one clock cycle
  - **128 FP32 cores × 2 operations per cycle = 256 FLOPs per SM per cycle**
- **4 tensor cores** (red boxes in the architecture): **matrix cores**, not general-purpose. Each does matrix multiply on small fixed-size chunks
  - Each tensor core computes a 16×4 × 4×8 → 16×8 matrix multiply in one cycle
  - That's **1,024 floating-point operations per tensor core per cycle**
  - **4 cores × 1,024 = 4,096 FLOPs per SM per cycle from tensor cores alone**

The ratio is stark: **4,096 vs 256**. The tensor cores are where the real throughput lives.

## Tensor Cores and Mixed Precision

Tensor cores don't just add speed — they operate in **mixed precision**:
- **Inputs are 16-bit** (lower precision, less memory, less bandwidth)
- **Accumulation is 32-bit** (higher precision for correctness)

This is crucial: if you forget to cast your PyTorch model to 16-bit precision (`model.half()`), your code runs on the FP32 cores instead — **20× slower than you expect**. It's not a theoretical detail; it's tangible performance.

## The Explosion of Compute

Let's trace the progression:

| GPU | Year | FP32 (TB/s) | Tensor/Mixed (TB/s) |
|-----|------|------------|-----------------|
| K40 | 2013 | 5 | N/A |
| V100 | 2016 | 15 | 120 (tensor cores introduced) |
| A100 | 2020 | 20 | 312 |
| H100 | 2023 | 83 | 989 |
| B200 | 2024 | 83 | 5,000 |

That's **a 1,000× improvement in just 12 years** — all within devices you can hold in your hands. This scaling is the primary engine of deep learning progress. **When anything in the world improves by 1,000× in a decade, you should pay attention.**

## Key Insight: Why Tensor Cores Matter

If you want to saturate an H100 with real work, you MUST use tensor cores. Designing for them is not optional — it's the difference between 30% utilization and 80%+. In distributed training, keeping 16,000 GPUs fed with useful tensor core work is the central challenge.
