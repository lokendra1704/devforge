import type { Subject } from '../types'
import h100Md from './md/gpu-h100-architecture.md?raw'
import clusterMd from './md/gpu-cluster-organization.md?raw'
import dpMd from './md/gpu-data-parallelism.md?raw'
import pipelineTensorMd from './md/gpu-pipeline-tensor.md?raw'
import mfuMd from './md/gpu-model-flops-utilization.md?raw'

export const gpuDistributedTraining: Subject = {
  id: 'gpu-distributed-training',
  title: 'Distributed Training at Scale',
  tagline: 'From single H100s to 16,000-GPU clusters: hardware, topology, and the algorithms that feed them.',
  icon: '🌐',
  accent: '#06b6d4',
  modules: [
    {
      id: 'gdt-m1',
      title: 'GPU Hardware Deep Dive',
      description: 'The H100, tensor cores, and why the memory hierarchy matters.',
      lessons: [
        {
          id: 'gdt-h100',
          title: 'Inside the H100',
          minutes: 18,
          xp: 90,
          steps: [
            { kind: 'read', title: 'The architecture', markdown: h100Md },
            {
              kind: 'quiz',
              title: 'Tensor core fundamentals',
              questions: [
                {
                  prompt: 'An H100 has 132 SMs, each with 4 tensor cores. Each core does a 16×4 × 4×8 matrix multiply. How many FLOPs per cycle across the entire GPU?',
                  options: ['256', '4,096', '544,896', '1,310,720'],
                  answer: 2,
                  explanation:
                    '132 SMs × 4 cores × 1,024 FLOPs per matrix multiply = 544,896 FLOPs per cycle. (Each matrix multiply is 16×4×8 = 1,024 FLOPs: 16×4×4 multiplies + 16×4 additions, but often counted as 2×1,024.)',
                },
                {
                  prompt: 'Tensor cores operate in mixed precision: 16-bit inputs, 32-bit accumulation. Your PyTorch model is in 32-bit. What happens?',
                  options: [
                    'It runs on tensor cores anyway, just slower',
                    'It runs on FP32 cores instead, ~20× slower than expected',
                    'It automatically casts to 16-bit',
                    'It errors and refuses to run',
                  ],
                  answer: 1,
                  explanation:
                    'Tensor cores ONLY accept 16-bit inputs. If your model is FP32, the hardware falls back to FP32 cores (256 FLOPs per cycle vs 544K), a catastrophic slowdown. You must call model.half() or use automatic mixed precision (AMP) to cast weights and activations.',
                },
                {
                  prompt: 'The K40 (2013) had 5 TFLOPs. The H100 (2023) has ~989 TFLOPs. What is the single biggest reason for this 200× improvement?',
                  options: [
                    'Higher clock speeds',
                    'More registers per SM',
                    'Tensor cores with matrix multiply specialization',
                    'Larger caches',
                  ],
                  answer: 2,
                  explanation:
                    'Tensor cores (introduced in V100, 2016) deliver 4,096 FLOPs per cycle per SM vs 256 from scalar cores. Successive GPUs added more cores and wider operations, but tensor cores are the breakthrough. Modern GPUs dedicate increasingly more die area to them.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'gdt-m2',
      title: 'GPU Clusters and Topology',
      description: 'How thousands of GPUs are connected and why the topology matters.',
      lessons: [
        {
          id: 'gdt-cluster',
          title: 'Building a 24,000-GPU supercomputer',
          minutes: 16,
          xp: 80,
          steps: [
            { kind: 'read', title: 'The hierarchy', markdown: clusterMd },
            {
              kind: 'quiz',
              title: 'Topology and communication',
              questions: [
                {
                  prompt: 'In the Llama-3 cluster, bandwidth between two GPUs in the same server is 900 GB/s. Between two GPUs in different pods, it is <50 GB/s. What factor worse?',
                  options: ['2×', '5×', '20×', '50×'],
                  answer: 2,
                  explanation:
                    '900 ÷ 50 = 18× (roughly 20×). This massive gap is why algorithms must be topology-aware: expensive all-reduces (weight broadcasts) should happen on fast links within servers/racks, while only coarse gradients cross slow inter-pod links.',
                },
                {
                  prompt: 'A Llama-3 pod has 192 racks with 16 GPUs each = 3,072 GPUs. Typical inference batch size per GPU is 8–16. How many seconds of padding time between batches do you expect, given that one forward pass takes ~100ms and communication within a pod is 50 GB/s?',
                  options: ['0.1s', '1s', '<10ms (communication is hidden)', '10s'],
                  answer: 2,
                  explanation:
                    'At scale, you **hide** communication behind computation. While GPU N does forward pass, GPUs in other racks all-reduce gradients. MFU drops below 50% not because of speed, but because overlapping is imperfect — synchronization gaps are unavoidable with distributed systems.',
                },
                {
                  prompt: 'Why organize GPUs into servers (8) → racks (2 servers) → pods (192 racks) instead of one flat cluster?',
                  options: [
                    'Easier to cool',
                    'Simplifies cabling',
                    'Allows topology-aware algorithms to match parallelism strategy to communication bandwidth',
                    'Reduces power consumption',
                  ],
                  answer: 2,
                  explanation:
                    'You can use expensive algorithms (FSDP with weight broadcasts) within servers, cheaper algorithms (DP) within racks, and minimal communication across pods. Matching the parallelism hierarchy to the physical topology maximizes MFU.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'gdt-m3',
      title: 'Data Parallelism and Variants',
      description: 'DP, FSDP, HSDP: how to split batches and models across GPUs.',
      lessons: [
        {
          id: 'gdt-data-parallelism',
          title: 'Data parallelism: the simplest strategy',
          minutes: 20,
          xp: 100,
          steps: [
            { kind: 'read', title: 'The algorithm and variants', markdown: dpMd },
            {
              kind: 'quiz',
              title: 'DP mechanics',
              questions: [
                {
                  prompt: 'In data parallelism, why does each GPU need an independent copy of the model? (Pick the most fundamental reason.)',
                  options: [
                    'To avoid race conditions during weight updates',
                    'Each GPU computes gradients independently on its own mini-batch, so it needs the weights to differentiate with respect to',
                    'For redundancy in case one GPU fails',
                    'To reduce communication',
                  ],
                  answer: 1,
                  explanation:
                    'Backward pass computes dL/dw, which depends on the forward-pass weights. If weights were shared/remote, backward would stall waiting for them. Independent copies let each GPU do forward+backward fully independently before syncing gradients.',
                },
                {
                  prompt: 'The all-reduce in DP must average gradients across all GPUs. How is this typically optimized in large clusters?',
                  options: [
                    'Ring all-reduce: data flows in a ring, completing in log(n) rounds',
                    'Tree all-reduce: build a tree, aggregate, then broadcast',
                    'Overlapped with backward: while computing backward for layer L, all-reduce layer L+1',
                    'All of the above, depending on topology',
                  ],
                  answer: 3,
                  explanation:
                    'Different topologies have different optimal patterns. Ring is common on homogeneous clusters; tree reduces hop count on hierarchical topologies. Overlapping with backward is the killer optimization — it hides most communication cost.',
                },
                {
                  prompt: 'A model has 10B parameters in 32-bit (4 bytes each) + gradients (4 bytes) + optimizer state (8 bytes, Adam). Each GPU keeps a copy. Memory per GPU?',
                  options: ['40 GB', '80 GB', '160 GB', 'Not calculable'],
                  answer: 0,
                  explanation:
                    '10B × 4 (params) + 10B × 4 (grad) + 10B × 8 (Adam) = 40 + 40 + 80 = 160 GB total. H100 has 80 GB, so it does NOT fit. This is why DP alone fails for large models — you must use FSDP to shard weights.',
                },
              ],
            },
            {
              kind: 'scenario',
              title: 'Choosing your parallelism strategy',
              scenario: {
                intro: 'You need to train increasingly large models on expanding GPU clusters. Each scenario presents a bottleneck; choose the parallelism strategy that solves it.',
                stages: [
                  {
                    situation: 'You are training a 7B-parameter model on 64 H100 GPUs. Model size is 7B × 16 bytes (params + grad + optimizer) = 112 GB. H100 has 80 GB memory per GPU.',
                    question: 'Which parallelism strategy allows this to fit and train efficiently?',
                    options: [
                      {
                        label: 'Use FSDP with 8-way sharding (split across 8 GPUs per shard group)',
                        quality: 'best',
                        feedback:
                          'Correct. FSDP with 8-way sharding means each GPU holds 112B ÷ 8 = 14 GB (well under 80GB), then broadcasts weights during forward. You can also use 2-way sharding, but 8-way is more aggressive and saves memory.',
                      },
                      {
                        label: 'Use DP with global batch size split across 64 GPUs (much smaller batch per GPU, but weights fit)',
                        quality: 'bad',
                        feedback:
                          'DP fails: each GPU keeps a full model copy, so all 112 GB stays on each GPU. It does not fit.',
                      },
                      {
                        label: 'Use naive DP but reduce precision to FP8 (unlikely to converge)',
                        quality: 'bad',
                        feedback:
                          'FP8 helps memory but converges poorly. FSDP with FP32 is the right approach.',
                      },
                      {
                        label: 'Use pipeline parallelism instead',
                        quality: 'ok',
                        feedback:
                          'Pipeline parallelism can help, but it introduces new overheads. FSDP is more direct for fitting larger models in GPU memory.',
                      },
                    ],
                  },
                  {
                    situation: 'You scale to 512 H100s and now FSDP communication dominates: each forward/backward requires broadcasting the model (7B × 16 = ~1.1 TB). This happens on inter-rack links at ~50 GB/s, costing 22s per step — unacceptable.',
                    question: 'How do you optimize communication without losing the memory savings?',
                    options: [
                      {
                        label: 'Use pipeline parallelism to hide the broadcast',
                        quality: 'ok',
                        feedback:
                          'Pipeline helps overlap computation and communication, but it introduces micro-batch overhead and complexity. HSDP is more direct.',
                      },
                      {
                        label: 'Use hybrid sharded DP (HSDP): FSDP within servers, DP across servers',
                        quality: 'best',
                        feedback:
                          'Perfect. Organize 512 GPUs as 64 servers × 8 GPUs each. Within each server (900 GB/s), use FSDP (broadcasts cost 1.1TB ÷ 900GB/s ≈ 1s, manageable). Across servers, use DP (only gradients all-reduce, no broadcasts). The fast link handles the expensive operation.',
                      },
                      {
                        label: 'Reduce batch size',
                        quality: 'bad',
                        feedback:
                          'Reduces iteration throughput without solving the communication bottleneck. The issue is the topology of links, not computation.',
                      },
                      {
                        label: 'Train in FP8 to reduce broadcast size',
                        quality: 'bad',
                        feedback:
                          'FP8 reduces communication by only 75% (since you still need other overhead), and convergence suffers. HSDP is the architectural fix.',
                      },
                    ],
                  },
                ],
                debrief:
                  'The pattern: match your parallelism strategy to your hardware topology. Within fast links (servers), you can afford expensive operations (FSDP broadcasts). Across slow links (inter-pod), use cheaper operations (gradient all-reduce only). This topology-aware thinking is what separates a 30% MFU cluster from a 40%+ one.',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'gdt-m4',
      title: 'Pipeline and Tensor Parallelism',
      description: 'Splitting layers and weight matrices for even larger models.',
      lessons: [
        {
          id: 'gdt-pipeline-tensor',
          title: 'Advanced parallelism strategies',
          minutes: 22,
          xp: 110,
          steps: [
            { kind: 'read', title: 'Layers and weights across GPUs', markdown: pipelineTensorMd },
            {
              kind: 'quiz',
              title: 'Pipeline and tensor mechanics',
              questions: [
                {
                  prompt: 'Naive pipeline parallelism: 4 GPUs, each has layers 1–32. GPU 1 runs forward, GPU 2 waits. GPU 2 runs forward, GPU 3 waits. What is the max theoretical MFU?',
                  options: ['25%', '50%', '75%', '100%'],
                  answer: 0,
                  explanation:
                    'Only one GPU does useful work at a time. 1 out of 4 = 25% max. This is why naive pipeline is useless at scale — you MUST use micro-batches to overlap.',
                },
                {
                  prompt: 'Tensor parallelism: split a weight matrix W (size d_in × d_out) into 4 column chunks and distribute across 4 GPUs. Each GPU computes a d_in × (d_out/4) output slice. During backward, what must happen?',
                  options: [
                    'Each GPU independently computes dW for its slice, no communication needed',
                    'All-reduce the gradients dW across GPUs, since each slice needs contributions from all input gradients',
                    'One GPU broadcasts the full dW to all others',
                    'Backward pass cannot be parallelized on split matrices',
                  ],
                  answer: 1,
                  explanation:
                    'In backward, dL/dW = dL/dY × dY/dW. dL/dY comes from the output gradient (distributed across GPUs). To compute dW for each slice, you need contributions from all input gradients — hence all-reduce.',
                },
                {
                  prompt: 'The "two-layer trick" in tensor parallelism: if you carefully align the splits of W1 (split by columns) and W2 (split by rows), you can compute Y = X×W1×W2 with only ONE all-reduce at the end. Why does this work?',
                  options: [
                    'The splits cancel out mathematically',
                    'Column chunks from W1 align with row chunks of W2, so intermediate partial sums can be summed with a single all-reduce',
                    'W1 and W2 are pre-synchronized in hardware',
                    'No all-reduce is actually needed',
                  ],
                  answer: 1,
                  explanation:
                    'Block matrix multiply: GPU i computes (X[:,i] × W1[i,:]) × W2[:,i]. The results are partial sums that need to be added. One all-reduce sums them. This is why FFNs (which are W1 → activation → W2) benefit so much from tensor parallelism.',
                },
              ],
            },
            {
              kind: 'code',
              title: 'Simulating 4D parallelism',
              challenge: {
                prompt: `## Simulate multi-dimensional parallelism

Llama-3 405B trains on 16,384 GPUs using 4D parallelism:
- **Tensor parallelism (TP)**: 8-way (split weight matrices)
- **Pipeline parallelism (PP)**: 16-way (split layers)
- **Context parallelism (CP)**: 16-way (split sequence)
- **Data parallelism (DP)**: 8-way (split batches)

Each dimension has different communication costs and overlapping strategies.

**Your task**: Implement a function that, given model parameters and a parallelism configuration, predicts:
1. **Memory per GPU**: Can it fit?
2. **Communication cost per step**: Rough estimate of cross-GPU traffic
3. **Recommended overlapping strategy**: Which operations can hide behind which?

Write three functions:

1. **\`paramSize(numParams, dtype)\`** — memory for parameters + gradients + optimizer state
   - dtype: 'fp32' (4 bytes), 'fp16' (2 bytes)
   - Return total bytes

2. **\`getMemoryPerGpu(numParams, dtype, tensorParallelism, pipelineParallelism)\`**
   - After tensor parallelism (weights split), memory per GPU
   - Assume pipeline parallelism only affects activation memory (which we ignore for this exercise)
   - Return bytes per GPU

3. **\`getCommunicationCost(numParams, seqLen, batchSize, dataParallelism, tensorParallelism, dtype)\`**
   - Tensor parallelism: all-reduce gradients (numParams × dtype)
   - Data parallelism: all-reduce gradients across DP groups
   - Return total bytes moved per step`,
                starterCode: `function paramSize(numParams, dtype) {
  // Each parameter: dtype bytes (2 or 4) + gradient (same) + optimizer (2× the param size for Adam)

}

function getMemoryPerGpu(numParams, dtype, tensorParallelism, pipelineParallelism) {
  // After tensor parallelism, each GPU holds numParams / tensorParallelism of the full parameter set

}

function getCommunicationCost(numParams, seqLen, batchSize, dataParallelism, tensorParallelism, dtype) {
  // Tensor parallelism: all-reduce gradients once per step (numParams × dtype bytes)
  // Data parallelism: all-reduce gradients across DP groups
  // Return total bytes moved

}`,
                solution: `function paramSize(numParams, dtype) {
  const bytesPerParam = dtype === 'fp32' ? 4 : 2;
  // param + gradient + optimizer state (2x for Adam momentum + variance)
  return numParams * (bytesPerParam + bytesPerParam + 2 * bytesPerParam);
}

function getMemoryPerGpu(numParams, dtype, tensorParallelism, pipelineParallelism) {
  // Tensor parallelism splits the model across GPUs
  // Each GPU holds numParams / tensorParallelism
  const paramsPerGpu = numParams / tensorParallelism;
  return paramSize(paramsPerGpu, dtype);
}

function getCommunicationCost(numParams, seqLen, batchSize, dataParallelism, tensorParallelism, dtype) {
  const bytesPerParam = dtype === 'fp32' ? 4 : 2;

  // Tensor parallelism: all-reduce gradients (numParams × dtype)
  const tpAllReduce = numParams * bytesPerParam;

  // Data parallelism: gradients are all-reduced across DP groups
  // Each GPU in a DP group sends/receives gradients
  const dpAllReduce = numParams * bytesPerParam;

  // Total: both happen, but DP all-reduce can overlap with TP
  // Simplified: return the larger (dominant) communication
  return Math.max(tpAllReduce, dpAllReduce);
}`,
                tests: `test('paramSize: 1B params, FP32', () => {
  const size = paramSize(1e9, 'fp32');
  // 1B × (4 + 4 + 8) = 16B bytes = 16 GB
  assertEqual(size, 16e9);
});
test('paramSize: 1B params, FP16', () => {
  const size = paramSize(1e9, 'fp16');
  // 1B × (2 + 2 + 4) = 8B bytes = 8 GB
  assertEqual(size, 8e9);
});
test('getMemoryPerGpu: Llama-3 405B example', () => {
  // 405B params, FP32, 8-way tensor parallelism
  const mem = getMemoryPerGpu(405e9, 'fp32', 8, 16);
  // 405B / 8 = 50.625B params per GPU
  // 50.625B × 16 bytes (param+grad+opt) = 810 GB per GPU
  // That's way over 80 GB, so this would use FP16 or lower TP degree
  assertEqual(mem, 810e9);
});
test('getMemoryPerGpu: with FP16', () => {
  const mem = getMemoryPerGpu(405e9, 'fp16', 8, 16);
  // 405B / 8 = 50.625B params
  // 50.625B × 8 bytes = 405 GB (still too much, but halved)
  assertEqual(mem, 405e9);
});
test('getCommunicationCost: 7B model, DP=8, TP=1', () => {
  // Gradients: 7B × 4 = 28 GB
  const cost = getCommunicationCost(7e9, 4096, 32, 8, 1, 'fp32');
  assertEqual(cost, 28e9);
});
test('getCommunicationCost: 7B model, DP=1, TP=8', () => {
  // Gradients: 7B × 4 = 28 GB (tensor core all-reduce)
  const cost = getCommunicationCost(7e9, 4096, 32, 1, 8, 'fp32');
  assertEqual(cost, 28e9);
});`,
              },
            },
          ],
        },
      ],
    },
    {
      id: 'gdt-m5',
      title: 'Optimizing for Model FLOPs Utilization',
      description: 'The metric that guides all parallelism decisions.',
      lessons: [
        {
          id: 'gdt-mfu',
          title: 'Model FLOPs Utilization: measuring and optimizing',
          minutes: 20,
          xp: 100,
          steps: [
            { kind: 'read', title: 'The north star metric', markdown: mfuMd },
            {
              kind: 'quiz',
              title: 'MFU mechanics and diagnosis',
              questions: [
                {
                  prompt: 'An H100 has peak 989 TFLOPs. You measure one training step at 10 TFLOPs sustained throughput. What is MFU? (Assume a single GPU.)',
                  options: ['1.01%', '10%', '98.9%', 'Cannot determine without batch size'],
                  answer: 1,
                  explanation:
                    'MFU = achieved ÷ peak = 10 TFLOPs ÷ 989 TFLOPs ≈ 1%. This is terrible — something is very wrong. Typical single-GPU training should reach 40–60%. Likely causes: slow data loading, CPU bottleneck, too-small batch size.',
                },
                {
                  prompt: 'Llama-3 achieves 37–40% MFU on 16,000 H100s (peak ~16 exaFLOPs). Why not 80%+?',
                  options: [
                    'The GPUs are not fast enough',
                    'Activation checkpointing recomputes activations, doubling backward compute cost',
                    'Communication (weight broadcasts in FSDP, gradient all-reduce) is unavoidable and does not count as model compute',
                    'All of the above',
                  ],
                  answer: 3,
                  explanation:
                    'All three are true. Communication cannot be eliminated — it\'s inherent to distributed training. Checkpointing saves memory at the cost of recomputation. And the roofline model shows that bandwidth is the bottleneck at this scale.',
                },
                {
                  prompt: 'Your training loop does 100 FLOPs for every byte moved (high arithmetic intensity, compute-bound). MFU is stuck at 20%. Which optimization is most likely to help?',
                  options: [
                    'Reduce batch size to lower memory pressure',
                    'Enable tensor cores (they are already used)',
                    'Improve data loading — CPU feeding the GPU is probably the bottleneck',
                    'Increase model size',
                  ],
                  answer: 2,
                  explanation:
                    'Arithmetic intensity is already high, so bandwidth is not the issue. Low MFU with high intensity usually means the GPU is idle: slow data loading, synchronization waits, or insufficient parallelism. Profile with Nsight to confirm.',
                },
              ],
            },
            {
              kind: 'scenario',
              title: 'Diagnosing MFU problems',
              scenario: {
                intro:
                  'MFU is your diagnostic tool. When it drops, something is wrong. These scenarios teach you how to read the signal and respond.',
                stages: [
                  {
                    situation: 'You train on 128 GPUs. Baseline MFU is 35%. You add gradient checkpointing, and MFU drops to 20%.',
                    question: 'What is happening? Is this bad?',
                    options: [
                      {
                        label: 'Gradient checkpointing is broken; do not use it',
                        quality: 'bad',
                        feedback:
                          'Wrong. Checkpointing is a well-established technique. The MFU drop is expected.',
                      },
                      {
                        label:
                          'Checkpointing trades compute for memory, recomputing activations during backward. This increases compute beyond the theoretical FLOPs of the base model, dragging MFU down.',
                        quality: 'best',
                        feedback:
                          'Correct. This is expected and acceptable. If you use the freed memory (larger batch, longer sequences, or larger model), the MFU of the new configuration may exceed the baseline despite the recomputation overhead.',
                      },
                      {
                        label: 'Synchronization overhead increased',
                        quality: 'bad',
                        feedback:
                          'Checkpointing does not change synchronization patterns. The issue is the added recomputation.',
                      },
                      {
                        label: 'Communication overhead increased',
                        quality: 'bad',
                        feedback:
                          'Checkpointing reduces communication (you can use smaller communication buckets due to lower memory pressure) but increases compute. Net MFU drop is from the extra compute.',
                      },
                    ],
                  },
                  {
                    situation:
                      'You scale from 128 to 1024 GPUs, adding FSDP 8-way sharding. Baseline MFU was 35% on 128 GPUs. On 1024 GPUs, MFU drops to 15%.',
                    question: 'What is the most likely cause?',
                    options: [
                      {
                        label: 'FSDP is too aggressive; use less sharding',
                        quality: 'ok',
                        feedback:
                          'Less sharding reduces communication but uses more GPU memory. It might help, but is not the root cause.',
                      },
                      {
                        label:
                          'Communication (weight broadcasts in FSDP) dominates. Broadcasts happen on slower inter-pod links at 1024 GPUs.',
                        quality: 'best',
                        feedback:
                          'Correct. At 128 GPUs, FSDP broadcasts happen on fast 900 GB/s server links. At 1024 GPUs across pods, they cross slower 50 GB/s inter-pod links, killing MFU. Solution: use HSDP — FSDP within servers, DP across servers.',
                      },
                      {
                        label: 'Batch size was not scaled proportionally',
                        quality: 'ok',
                        feedback:
                          'This could contribute, but the topology change (crossing pod boundaries) is the primary culprit.',
                      },
                      {
                        label: 'The GPUs are defective',
                        quality: 'bad',
                        feedback:
                          'Unlikely, and would manifest as random errors, not a consistent 2.3× MFU drop.',
                      },
                    ],
                  },
                ],
                debrief:
                  'Key lesson: MFU drops are not always bad — sometimes you trade MFU for capability (checkpointing). But a drop on scale-out (without added capabilities) signals a topology mismatch. Always ask: "What changed in hardware usage?" Then match your algorithm to the topology.',
              },
            },
          ],
        },
      ],
    },
  ],
}
