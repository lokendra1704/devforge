# Memory Capacity: Why Size Limits Matter

A fixed-size memory can only store a finite number of independent key-value associations. Understanding capacity limits reveals where bottlenecks arise and how to overcome them.

## Capacity of Linear Matrix Memory

**Proposition 1:** A matrix-valued memory $M \in \mathbb{R}^{d_v \times d_k}$ optimized with $\ell_2$ loss and gradient descent can store at most **$O(d_k)$** independent key-value pairs—one for each key dimension.

This is **sublinear** in total parameters $d_v \times d_k$. For a 1024×1024 memory matrix (1M parameters), you can store only ~1024 facts, not 1M. This is the core bottleneck of linear RNNs.

## Increasing Capacity with Depth

**Theorem 1:** An MLP memory with $L_M \geq 2$ layers, input dimension $d_k$, and hidden dimension $d_h$, can store at least $O(d_k d_v)$ and at most $O\left(\frac{d_k d_v}{\sum_{i=1}^{L_M} \min_j d_h^{(j)}} \right)$ independent pairs.

**Key insight:** Deeper networks unlock more capacity. A 2-layer MLP with modest hidden dimensions can store an order of magnitude more facts than a linear matrix. The non-linearity in each hidden layer creates new "subspaces" for encoding different key-value associations.

## Polynomial Feature Expansion

But even deep networks hit limits if $d_k$ is fixed. The solution: **increase the effective dimensionality of keys using polynomial feature mappings**.

**Proposition 2:** Using a polynomial feature mapping $\phi_p(x) = [x^\beta]_{|\beta| \leq p}$ (all monomials of degree $\leq p$), a matrix memory can store at most $O(d_k^p)$ independent pairs.

**Example:** A degree-3 polynomial on a 10-dimensional key gives $\binom{10+3}{3} \approx 286$ expanded features, quadrupling effective capacity without additional input projection parameters.

## Why Polynomial Features Work

Polynomials expand keys from $d_k$ dimensions to $\binom{d_k+p}{p}$ dimensions. Two perspectives:

1. **Softmax approximation:** The exponential kernel in Transformers can be approximated by its Taylor series:
   $$\exp(q_i^T k_j) \approx \phi_p(q_i)^T \phi_p(k_j)$$
   Polynomial kernels are a learnable approximation of this, gaining expressiveness without computing softmax's quadratic cost.

2. **Feature gating:** The learned coefficients $a_i$ in the polynomial act as gates, allowing the model to selectively enable or disable different polynomial terms for encoding different types of facts.

## Combining Depth and Polynomials

The capacity gains **multiply**:
- **Linear memory + no polynomial:** $O(d_k)$ capacity
- **Deep MLP + no polynomial:** $O(d_k d_v)$ capacity
- **Deep MLP + polynomial degree $p$:** $O((d_k^p) d_v)$ capacity for higher expressiveness

For tasks with thousands of facts (long context), this compounding effect is essential.

---

**Citation:** Atlas paper, § 3.1 "Associative Memory with Super Linear Capacity", Propositions 1–2, Theorem 1
