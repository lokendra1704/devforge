# Your first CUDA kernel

Here is the complete "hello world" of GPU computing — adding two arrays of a million floats. CPU version, then GPU version:

```c
// CPU: one core grinds through a loop, one element at a time
void vectorAdd(float* a, float* b, float* out, int n) {
    for (int i = 0; i < n; i++)
        out[i] = a[i] + b[i];
}
```

```c
// GPU: the loop is GONE. You write the body for ONE element.
__global__ void vectorAdd(float* a, float* b, float* out, int n) {
    int i = blockIdx.x * blockDim.x + threadIdx.x;   // ← the famous line
    if (i < n)                                       // ← the famous guard
        out[i] = a[i] + b[i];
}

// launch: enough blocks of 256 threads to cover n = 1,000,000
int threads = 256;
int blocks = (n + threads - 1) / threads;            // ceil division → 3907
vectorAdd<<<blocks, threads>>>(a, b, out, n);
```

The mental flip: **you don't write the loop — you write one iteration, and launch a million of them.** Each thread computes which element is *mine*, handles it, done.

## The famous line, decoded

Every thread runs identical code, so each must compute its own global position from three built-in variables:

```
i = blockIdx.x * blockDim.x + threadIdx.x
    ─────────   ──────────   ───────────
    which block  block size   my seat in
    am I in      (threads     this block
                 per block)
```

It's exactly seat numbering in a stadium: **global seat = row number × seats-per-row + seat-within-row**. Block 2, thread 5, blockDim 256 → element 2×256+5 = **517**. Get this formula into your spine; every kernel you ever write starts with it (often in 2D: one formula for the row index, the same one again for the column).

## The famous guard, justified

n = 1,000,000 with 256-thread blocks needs 3,907 blocks = 1,000,192 threads — **192 more than you have elements**. Without `if (i < n)`, those 192 threads write past the end of the array, silently corrupting whatever lives there. The crash arrives later, somewhere else, unexplained. The bounds guard is *not optional*, and forgetting it is the #1 rookie CUDA bug.

## Who actually runs what

`__global__` marks a function that the **CPU launches** and the **GPU runs**. The full choreography of a CUDA program:

```
1. cudaMalloc   — allocate memory ON THE GPU
2. cudaMemcpy   — copy inputs CPU → GPU        (over PCIe — slow!)
3. kernel<<<blocks, threads>>>(...)            — compute
4. cudaMemcpy   — copy results GPU → CPU       (slow again)
```

Steps 2 and 4 cross the PCIe bus (~32–64 GB/s) while the GPU's own memory runs at ~2,000–3,000 GB/s. **Rule one of GPU performance: get data onto the card, keep it there, do lots of work, only then come back.** A kernel that does one add per transferred byte loses to the CPU on transfer cost alone — which is why nobody ships a vector-add GPU product, and why real pipelines chain dozens of kernels between copies.

## What you'll do next

First a quiz on the indexing math (everyone fumbles it once — better here than in an interview), then a challenge where you **implement the GPU's execution model yourself** in JavaScript: write the scheduler that runs a kernel function across a grid of blocks and threads. Building the machine is the fastest way to stop being confused by it.
