# CPU & GPU parallelism: the full map

Final lesson of the track: zoom out and see every level of parallelism in a modern machine — because they stack, and elite performance work is choosing the right level (or several) for the job.

## The five levels

**1. Instruction-level (free, invisible).** Each CPU core is itself parallel: pipelined, superscalar (4–6 instructions/cycle), out-of-order. You don't program it, but you *feel* it — e.g. an unpredictable branch in a hot loop stalls the pipeline, which is why sorting data before a branchy loop can make it 5× faster. (Same moral as GPU warp divergence, one level down.)

**2. SIMD — data parallelism inside one core.** Special wide registers (AVX-512 = 512 bits) apply one instruction to **16 floats at once**:

```
regular add:  a[0]+b[0]                      1 float / instruction
SIMD add:     a[0..15] + b[0..15]            16 floats / instruction
```

This is the CPU's mini-GPU, and it's how NumPy, video codecs, and JSON parsers (simdjson) get their speed. Usually compilers auto-vectorize simple loops; the SIMD-friendly data layout is on you (contiguous arrays of plain numbers — another reason `Float64Array` beats `Array<Object>`).

**3. Multi-core — task parallelism.** 8–64 fully independent cores: real threads, real simultaneity, and everything from the races lesson. Sweet spot: a handful of coarse, independent chunks of work (one image per core, one request per worker).

**4. GPU — massive data parallelism.** The same SIMD idea scaled to tens of thousands of lanes, with the latency-hiding warp machinery from the GPU track. Sweet spot: *millions* of uniform, independent operations.

**5. Distributed — many machines.** When one box isn't enough: MapReduce, Spark, multi-GPU LLM training. New costs: the network is slow and *partially fails* — which is the System Design track's department.

## One problem, every level

Summing 1 billion numbers:

| Level | Strategy | Rough time |
|---|---|---|
| 1 thread, scalar | the for-loop | ~1.0 s |
| + SIMD | 16 adds/instruction | ~0.1 s |
| + 8 cores | 8 chunks, partial sums, combine | ~15 ms |
| GPU | parallel reduction (tree of partial sums) | ~5 ms |
| 100 machines | each sums 10M, combine | network cost dominates — *worse* unless data already lives there |

Two morals. First, **levels multiply**: SIMD × cores gave ~64× before any GPU appeared. Second, **the last row**: parallelism has overhead (transfer, coordination, combination), and *scaling past the problem size makes things slower*. Knowing when to stop is part of the skill.

## The pattern that appeared at every level: reduction

Summing in parallel requires the same trick everywhere — split, compute partial results independently, **combine in a tree**: 1B → 8 partial sums → 1. The GPU version (each block reduces in shared memory, then blocks' results reduce again) is one of the canonical kernels every GPU engineer writes in week one. Map-then-reduce is also literally MapReduce — the same shape at datacenter scale. Patterns transfer; that's the whole thesis of this platform.

## The decision tree (suitable for framing)

```
Is it slow because of WAITING (I/O)?
 └─ yes → async/event loop. One thread is plenty. Done.
Is it CPU-bound?
 ├─ same op on millions of uniform elements?
 │   └─ SIMD if it fits in a core; GPU if it's huge
 ├─ a handful of independent chunky tasks?
 │   └─ multi-core (threads/processes)
 └─ sequential, dependent steps?
     └─ no parallelism will save you - better algorithm (DSA track!)
```

You now have the complete map: async for waits, cores for tasks, SIMD/GPU for data, distribution for scale — and the judgment about which bottleneck you actually have. That judgment *is* the skill.
