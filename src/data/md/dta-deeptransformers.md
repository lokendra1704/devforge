# DeepTransformers: Strict Generalizations of Transformers

## The Connection to Standard Attention

Standard Transformer attention can be reformulated as a solution to an $\ell_2$ regression problem using Nadaraya-Watson kernel estimation:

$$M^* = \arg\min_M \sum_{j=1}^{L} s(k_j, q_i) \|v_j - M\|_2^2 = \sum_{j=1}^{L} \frac{s(k_j, q_i)}{\sum_{\ell=1}^{L} s(k_\ell, q_i)} v_j$$

This is the standard attention mechanism. The "similarity" $s(k_j, q_i) = \exp(q_i^T k_j / \sqrt{d})$ is the softmax kernel.

## Introducing Polynomial Features to Attention

**DeepTransformer** applies polynomial feature mappings to keys:

$$\text{attention with } \phi^*(k_j) \text{ instead of } k_j$$

where $\phi^*$ is an infinite-dimensional feature mapping (the limit of high-degree polynomials).

This seemingly simple change has profound implications:

1. **Strict generalization:** Standard attention is a special case where the kernel is fixed (softmax). DeepTransformer allows learning to modulate the feature expansion, making it more expressive.

2. **Higher memory capacity:** By expanding keys into higher dimensions, each position in attention can encode more unique information without conflicting with other positions.

3. **Parallelizable training:** Unlike full RNNs, DeepTransformer maintains Transformer-style parallel training—you can compute all attention heads at once, unlike sequential RNN updates.

## Sliding Window Variants

The paper also introduces **Sliding Window Deep Transformer (SWDT)**, which combines:
- **DeepTransformer's expressive features** ($\phi^*$ mappings)
- **Local attention** (sliding window of size $c$ instead of full sequence)

This reduces complexity from $O(N^2)$ to $O(N \cdot c)$ while retaining the flexibility of deep memory.

## Why It's a Generalization

Standard Transformers + polynomial features + sliding windows = **DeepTransformers**. Each prior architecture becomes a special case:
- Window size $c = \infty$ → full global attention
- Feature mapping $\phi^* = \text{identity}$ → standard softmax attention
- No polynomial expansion → linear attention

By unifying these, the paper shows how to systematically improve Transformers without abandoning their core parallel-training strengths.

---

**Citation:** Atlas paper, § 4 "DeepTransformers: Transformers with Deep Memory", connection to sliding window attention (Eq. 17–19)
