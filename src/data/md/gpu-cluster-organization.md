# GPU Clusters: Stacking Hardware into a Supercomputer

A single H100 is powerful, but training Llama-3 or GPT-4 scale models requires **tens of thousands of GPUs working together**. The architecture of these clusters matters deeply for distributed training algorithms.

## The Hierarchy of Communication Speed

As you move away from a single device, memory bandwidth drops dramatically:

| Level | Bandwidth | Devices |
|-------|-----------|---------|
| **Within one GPU** | 3 TB/s | 1 |
| **Between GPUs in one server** | ~900 GB/s | 8 (typical server) |
| **Between servers in one rack** | ~50 GB/s | 16 per rack |
| **Across racks in a pod** | ~50 GB/s | 3,072 (typical pod) |
| **Between pods** | <50 GB/s | 24,576+ (full cluster) |

Each jump introduces a **20–60× drop in bandwidth**. This hierarchy is not accidental — it's the primary constraint that shapes distributed training algorithms.

## The Llama-3 Cluster Layout (a Real Example)

Meta's Llama-3 training cluster gives us concrete numbers:

```
Cluster (24,576 GPUs)
├─ Pod 1 (3,072 GPUs)
│  ├─ Rack 1
│  │  ├─ Server 1 (8 H100s)
│  │  └─ Server 2 (8 H100s)
│  ├─ Rack 2 (8 GPUs)
│  └─ ... (192 racks total per pod)
├─ Pod 2 (3,072 GPUs)
└─ ... (8 pods total)
```

**Key observations:**
- **One server** = 8 GPUs with high interconnect (900 GB/s between any pair)
- **One rack** = 2 servers = 16 GPUs, connected with decent bandwidth (50 GB/s from any GPU to any GPU)
- **One pod** = 192 racks = 3,072 GPUs, still connected with reasonable bandwidth
- **Full cluster** = 8 pods = 24,576 GPUs

## Physical Reality

These aren't abstract — they're **physical atoms** in data centers:
- A server rack is ~6–8 feet tall, about the size of a person
- 192 racks in a pod = imagine 192 tall refrigerators filling a huge room
- 8 pods = an entire warehouse

Cooling alone is serious: a single gaming GPU heats a room; 24,000 of them require specialized liquid cooling systems.

## Communication Topology

The **topology of communication** shapes every distributed training algorithm:

1. **Fast communication (3 TB/s within GPU, 900 GB/s within server)** → use for frequent, fine-grained operations
2. **Medium communication (50 GB/s within pod)** → use for moderate-frequency, larger operations (gradients, weights)
3. **Slow communication (<50 GB/s between pods)** → minimize; use only for coarse synchronization

Clever training algorithms exploit this hierarchy. You don't treat all communication equally; you match your parallelism strategy to the topology.

## MFU as the North Star

Designing distributed training systems is fundamentally about answering: **"What keeps the 24,000 tensor cores fed with useful work?"**

With 24 exaFLOPs of peak theoretical throughput, the question isn't raw compute — it's:
- How fast can we move data between levels?
- How do we hide communication latency behind computation?
- What's the **Model FLOPs Utilization** — the fraction of peak we actually achieve?

This topology-aware thinking is the bridge between hardware and algorithms.
