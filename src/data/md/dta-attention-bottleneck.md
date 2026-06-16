# Why Long Context Matters: The Attention Bottleneck

Transformers revolutionized sequence modeling by learning at scale and excelling at in-context retrieval tasks. However, they have a critical bottleneck: **quadratic memory and time complexity**.

## The Attention Quadratic Wall

Standard causal attention computes output for position $i$ as:

$$y_i = \sum_{j=1}^{i} \frac{\exp(q_i^T k_j / \sqrt{d})}{\sum_{\ell=1}^{i} \exp(q_i^T k_\ell / \sqrt{d})} v_j$$

Computing this requires calculating all pairwise similarities $q_i^T k_j$ between every query and every key, creating an $N \times N$ matrix for a sequence of length $N$. This means:
- **Time complexity:** $O(N^2)$ for generation
- **Memory complexity:** $O(N^2)$ for the KV cache during generation

For a 1M-token document, this becomes prohibitively expensive. Even modern transformers with optimizations struggle beyond 100K tokens.

## Why Recurrent Models Alone Aren't Enough

Research has explored linear RNNs (RetNet, GLA, Mamba) as alternatives. They operate in $O(N)$ time by updating a fixed-size memory $M_t$ with each token:

$$M_t = A_t * M_{t-1} + v_t k_t^T$$

This avoids quadratic scaling. However, **they struggle with long-context understanding and extrapolation to longer sequences** because their fixed-size memory has limited capacity—the memory matrix cannot store as many independent key-value associations as we need.

## A New Perspective: Associative Memory

Rather than thinking of sequence models as attention or recurrence, we can view them as **associative memory modules**. An associative memory stores mappings from keys to values, like a lookup table. When we process a sequence:

1. Each token $(k_i, v_i)$ is a key-value pair to memorize
2. The memory module $M$ learns to map keys to values
3. The "surprise" of each pair (how much it affects memory) determines its weight in learning

This perspective unifies Transformers and RNNs: they differ in (1) how they measure surprise, (2) how much memory they use, and (3) which optimization algorithm updates memory.

The key insight: **the memory perspective reveals why long context is hard and suggests solutions beyond just speeding up attention.**

---

**Citation:** Atlas paper, Introduction § and Memory Perspective §
