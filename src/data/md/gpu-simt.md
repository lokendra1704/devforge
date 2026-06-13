# Inside the machine: SMs, warps, and SIMT

Time to open the hood. Four levels of hierarchy explain almost everything about GPU behavior — and almost every performance mystery you'll ever debug.

## The hardware hierarchy

```
GPU
└── ~100–140 SMs (Streaming Multiprocessors) — the real "cores"
    └── warps of 32 threads — the unit the hardware actually schedules
        └── threads — what YOU program
```

- **SM (Streaming Multiprocessor):** a self-contained factory with its own arithmetic units, registers, fast on-chip memory, and warp schedulers. An H100 has 132 of them. "10,000 cores" marketing = SMs × lanes per SM.
- **Warp:** 32 threads that execute **in lockstep** — one instruction decoder drives 32 execution lanes. This is the single most important fact in GPU programming.
- **Thread:** your code's view. You write a program for *one* thread; the hardware launches millions of copies.

## SIMT: one instruction, 32 lanes

NVIDIA calls the model **SIMT** — Single Instruction, Multiple Threads. The warp has *one* program counter. When the warp executes `a[i] = b[i] * 2`, all 32 threads do that multiply *in the same clock cycle*, each on its own data.

The catch — and the classic interview question — is **warp divergence**. What if your kernel branches?

```c
if (threadIdx.x % 2 == 0)  doA();   // even-numbered threads
else                        doB();   // odd-numbered threads
```

One program counter can't be in two places. The warp runs **both paths serially**: first `doA()` with odd threads masked off (lanes idle, doing nothing), then `doB()` with even threads masked. Your "parallel" code just ran at half speed. A 32-way switch statement could run at 1/32 speed.

Divergence is only about threads **within the same warp** — different warps taking different paths costs nothing. Pros arrange data so whole warps branch together.

## Latency hiding: the actual magic trick

A read from GPU main memory takes **~400–800 cycles**. A CPU would deploy giant caches and prediction to dodge that wait. The GPU does something simpler and more brutal:

> Each SM holds **dozens of warps** resident at once. The moment warp 3 issues a memory load, the scheduler switches to warp 7 — *next cycle, zero cost*. Warp 3's data arrives hundreds of cycles later; nobody noticed it was gone.

Zero-cost switching is possible because every warp's registers stay permanently on the SM (no save/restore like an OS context switch — the register file is huge for exactly this reason). The lesson burned into every GPU programmer: **the GPU doesn't avoid latency, it hides latency under other warps' work — so you must give it enough warps to hide behind.** That ratio (resident warps vs. maximum) is called **occupancy**; we'll tune it in lesson 5.

## The software view: grids and blocks

CUDA mirrors the hardware with a 3-level launch hierarchy:

```
Grid  =  all the blocks for one kernel launch
Block =  up to 1024 threads that run on ONE SM and can cooperate
          (shared memory + barrier sync within the block only)
Warp  =  hardware slices each block into groups of 32
```

You launch `vectorAdd<<<4096, 256>>>(...)` = a grid of 4,096 blocks × 256 threads. Blocks are scheduled onto SMs as they free up — which is why blocks **must not depend on each other**: the hardware promises no ordering. This independence is what lets the same code scale from a laptop GPU (20 SMs) to a datacenter card (132 SMs) untouched.

Next lesson: you write the kernel and own the indexing math.
