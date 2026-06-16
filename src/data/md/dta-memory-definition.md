# Associative Memory: Definition and Framework

## What Is Associative Memory?

Associative memory is the ability to map different entities or events to corresponding outputs. In neural networks, it means learning key-value associations.

**Definition (Behrouz et al., 2025):** Given a set of keys $K \subseteq \mathbb{R}^{d_k}$ and values $V \subseteq \mathbb{R}^{d_v}$, an associative memory is a mapping $M : K \to V$. Learning this mapping is based on an **attentional bias** objective $\mathcal{L}$ that determines what the memory learns and in what order:

$$M^* = \arg\min_M \mathcal{L}(M(K); V)$$

The memory parameters are updated iteratively using an optimization algorithm (e.g., gradient descent). This framework unifies:
- **Transformers** (non-parametric associative memory, quadratic scaling)
- **RNNs** (parametric associative memory, fixed-size compressed into neural parameters)
- **Linear Attention** (kernel approximation of Softmax)

## The Two Optimization Levels

When learning the associative memory, there are two nested optimization loops:

1. **Inner loop:** Parameters of the memory module $M(·)$ are optimized. If $M$ is an MLP, its weights $\boldsymbol{\theta}_M = \{W_1, W_2, \ldots, W_{L_M}, \ldots\}$ are the variables.
2. **Outer loop:** All other parameters (projections $W_Q, W_K, W_V$, other MLP layers) are frozen and treated as hyperparameters.

This meta-learning perspective explains why the memory module can adapt to learn new key-value patterns within a single sequence without changing the base model.

## Why This Matters for Long Context

The associative memory lens reveals the core problem: **existing models only use "online" updates**, optimizing the memory based on the current token alone. But memorizing individual tokens in isolation misses relationships and context. A fact might not be surprising when first encountered, but becomes critical later in a sequence.

---

**Citation:** Atlas paper, Preliminaries § 2.1, Definition 1
