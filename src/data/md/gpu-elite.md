# The elite path: tiled matmul → occupancy → FlashAttention

This lesson is the map from "I can write a kernel" to "I optimize kernels for a living" — the skill currently commanding some of the highest compensation in software. It's one long case study: **matrix multiplication**, the operation that *is* deep learning, taken through the same optimization stages every elite kernel goes through.

## Stage 0: naive matmul (the baseline)

One thread per output element; each walks a row of A and a column of B:

```c
__global__ void matmul(float* A, float* B, float* C, int N) {
    int row = blockIdx.y * blockDim.y + threadIdx.y;
    int col = blockIdx.x * blockDim.x + threadIdx.x;
    if (row < N && col < N) {
        float sum = 0;
        for (int k = 0; k < N; k++)
            sum += A[row * N + k] * B[k * N + col];
        C[row * N + col] = sum;
    }
}
```

Correct, clean — and ~2% of the hardware's potential. Every element of A is fetched from global memory **N times** (once per output column). Arithmetic intensity ~0.25; the memory bus melts while the math units sleep.

## Stage 1: tiling (the 10× move)

The shared-memory pattern from last lesson, at full power. Each block computes a 32×32 patch of C by marching through A and B in 32×32 tiles: load tile cooperatively (coalesced) → `__syncthreads()` → 32 multiply-adds per thread *out of shared memory* → next tile.

Each loaded value is now reused **32 times** from fast memory instead of refetched from slow memory. Arithmetic intensity jumps ~32×; the kernel crosses from memory-bound to compute-bound. **Typical speedup: ~10×, from ~80 lines of code.** This single technique is the most important optimization in GPU history.

## Stage 2: the roofline model (know which wall you're hitting)

Before optimizing further, elite engineers plot the kernel on the **roofline**:

```
attainable FLOP/s = min(peak FLOP/s,  arithmetic intensity × peak bandwidth)
```

Two regimes: under the slanted roof (memory-bound — chase bytes: coalescing, tiling, vectorized loads, fusion) or under the flat roof (compute-bound — chase math: tensor cores, instruction mix, occupancy). **Profile, place, then optimize the right thing.** Nsight Compute literally draws this chart for your kernel; guessing instead of profiling is the #1 amateur tell.

## Stage 3: occupancy & register pressure (the dark art)

Latency hiding needs many resident warps, but SM resources are finite: each thread's registers and each block's shared memory come from fixed pools. Use 200 registers per thread and the SM fits fewer warps → less latency hiding → stalls. *Sometimes* the right move is even counterintuitive: **lower** occupancy but more work per thread (each thread computes a 4×4 patch of outputs, holding them in registers) wins because registers beat even shared memory. cuBLAS kernels run this way. The lesson: occupancy is a means (hide latency), not a score to maximize.

## Stage 4: tensor cores & mixed precision

Modern SMs contain **tensor cores** — units that multiply small matrix fragments (e.g. 16×16 FP16) in hardware, ~8–16× faster than doing the same with scalar FMAs. This is why ML runs FP16/BF16/FP8 with FP32 accumulation. You reach them via libraries (cuBLAS/cuDNN), via `wmma`/CUTLASS in your own kernels, or via compilers like Triton (write Python-ish tile code, get near-cuBLAS kernels — the fastest-growing path into this field, and how much of PyTorch 2 is implemented).

## Stage 5: kernel fusion → FlashAttention (the boss level)

Chains like `matmul → add bias → softmax` written naively are three kernels = three round-trips of the *entire tensor* to global memory. **Fusion** computes the chain in one kernel while data sits in registers/shared memory — eliminating whole tensors' worth of traffic.

**FlashAttention is this idea, weaponized.** Transformer attention naively materializes an N×N score matrix in global memory (N = sequence length; at N=8192 that's gigabytes of traffic). FlashAttention fuses the entire attention computation — both matmuls *and* the softmax, using an online softmax that processes tiles incrementally — so the N×N matrix **never exists in global memory at all**. Result: 2–4× faster training, ~10× longer feasible contexts, and arguably the single most impactful kernel of the LLM era. And conceptually? It's tiling + fusion + a clever running rescale. Stages 1 and 5 are the same idea at different altitudes: **don't refetch — reuse; don't materialize — stream.**

## Your roadmap to elite

1. **Foundations** — this track, plus the CUDA C Programming Guide (the canon)
2. **Project: matmul ladder** — write naive → coalesced → tiled → register-blocked yourself; profile each in Nsight Compute; explain every gap. (This exact exercise is a hiring filter at GPU shops.)
3. **Learn Triton** — modern tile-based kernel programming, gentler than raw CUDA, used in production everywhere
4. **Read real kernels** — CUTLASS and the FlashAttention source are open and annotated
5. **Specialize** — inference serving (vLLM-style paged attention), training systems, or kernels-for-hire; all three are starved for people

Patterns recap, because they transfer to every kernel you'll ever touch: *coalesce, tile, fuse, profile, respect the roofline.* That's the whole religion.
