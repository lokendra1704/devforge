# Model FLOPs Utilization: The North Star Metric

You have 16,000 GPUs, each capable of 989 TFLOPs. That's **16 exaFLOPs** of peak theoretical throughput. But in practice, you're probably achieving **30–45% of that**.

**Model FLOPs Utilization (MFU)** is the fraction of this peak you actually achieve. It's the single most important metric for diagnosing and optimizing distributed training.

## Hardware FLOPs Utilization vs Model FLOPs Utilization

**Hardware FLOPs Utilization (HFU)**: How well a single kernel uses a single GPU's tensor cores.
- Depends on matrix sizes, coalescing, cache hits
- You can achieve ~80% HFU on well-written matmul kernels
- Irrelevant if you're only running 10% of the time

**Model FLOPs Utilization (MFU)**: What fraction of peak throughput the *entire training loop* achieves, including:
- Forward/backward compute on the model
- Data loading and preprocessing
- Communication (all-reduce, weight broadcasts)
- Activation checkpointing and recomputation
- Synchronization overhead

MFU is what actually matters. A 999 TFLOPs kernel doesn't help if it runs 1 second per hour.

## Computing MFU

**Step 1**: Calculate theoretical peak throughput
- H100: 989 TFLOPs mixed precision
- 16,000 GPUs: 16 exaFLOPs

**Step 2**: Compute the FLOPs for one forward/backward pass
- Model architecture → FLOPs per forward pass
- Double it for backward pass (roughly, accounting for gradient computation)
- Multiply by batch size

**Step 3**: Measure wall-clock time for one training step
- Run your training loop, time one iteration

**Step 4**: Divide theory by reality
```
MFU = (FLOPs in forward+backward) / (Time per step × Peak throughput)
```

## Real Numbers: Llama-3

From the Llama-3 paper:

- **16,384 GPUs training simultaneously**
- **Peak throughput**: 16 × 989 TFLOPs ≈ 16 exaFLOPs
- **Achieved MFU**: **37–40%** across different training phases

This is considered **state-of-the-art**. Why isn't it 80+%?

1. **Communication is unavoidable**: Weight broadcasts in FSDP, gradient all-reduce in DP. These don't count as "model compute," so they drag MFU down.
2. **Synchronization**: 16,000 GPUs must stay in lockstep. If one is even 1% slower, all wait.
3. **Activation checkpointing**: Saves memory but recomputes activations, doubling backward compute (without doubling the parameter updates).
4. **Sequential layers in backward**: Not every layer can overlap its backward with forward of the next (depends on dependency graph).

## The Roofline Heuristic

Plot achieved throughput vs arithmetic intensity (FLOPs per byte moved):

```
Throughput
    ↑
    │   /─────── Compute-bound (compute is bottleneck)
    │  /
    │ /─ Memory-bound (bandwidth is bottleneck)
    │/
    └────────────→ Arithmetic Intensity (FLOPs/byte)
```

Your kernel lands somewhere on this line:
- **Far left** (low intensity): You're bandwidth-limited — optimization should reduce bytes moved, not compute faster
- **Far right** (high intensity): You're compute-limited — optimization should increase math, not reduce memory traffic

**Most distributed training at scale is bandwidth-limited** across the cluster. Optimizations that hide communication (overlapping compute+communication, compression, topology-aware algorithms) beat optimizations that add compute.

## Benchmarking MFU

In PyTorch:

```python
import time
start = time.time()
for step in range(100):
    loss = model(batch)
    loss.backward()
    optimizer.step()
end = time.time()

time_per_step = (end - start) / 100
flops_per_step = compute_flops(model, batch)  # FLOPs in forward+backward
peak_flops = 989e12 * num_gpus  # H100s, mixed precision
mfu = (flops_per_step / time_per_step) / peak_flops
print(f"MFU: {mfu:.1%}")
```

If MFU < 30%, something is seriously wrong. >40% is excellent.

## Tuning for MFU

When you're drowning in parallelism knobs (tensor parallelism degree, pipeline depth, micro-batch count, activation checkpointing), **always optimize for MFU**:

1. Measure MFU with a baseline configuration
2. Change one knob at a time
3. Re-measure MFU
4. Keep the change if MFU improved
5. Repeat until you hit memory limits or no further improvement

MFU gives you a single, interpretable signal: "This change helped" or "This change hurt." It's the best diagnostic tool for large-scale training.

## Why It's So Hard to Exceed 50% MFU

The iron law: **GPUs got 1,000× faster; bandwidth only got ~10× faster.** The gap means:

- Modern GPUs can compute faster than they can move data
- Every KB moved must be amortized over thousands of FLOPs
- Communication is increasingly the bottleneck, not compute

At 16,000 GPUs, communication is unavoidable and expensive. You'll never achieve 80% MFU because of synchronization alone. Aiming for 35–45% is realistic and excellent.
