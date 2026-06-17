# Spectral Analysis and Hermite Polynomials

## The Transition Operator

The world's transition from z to z' (described by the OU process) induces an operator on functions, called the **transition operator T**.

For any scalar function h_i(z), define:

(T h_i)(z) = E[h_i(z') | z]

In words: "what is the expected value of h_i at the next view, given the current state z?"

This is a linear operator, and like any linear operator, it has a spectral decomposition: a set of eigenfunctions φ_k and eigenvalues λ_k such that:

T φ_k = λ_k φ_k

The eigenfunctions are ordered by eigenvalue: λ_0 = 1 > λ_1 ≥ λ_2 ≥ ... ≥ 0

**Intuition**: The eigenfunctions with the largest eigenvalues are the most predictable features. They are highly correlated between z and z' (high correlation = high eigenvalue). The eigenfunctions with small eigenvalues are noisy and unpredictable.

## Hermite Polynomials for Gaussian Variables

For Gaussian latents (our case), the eigenfunctions are known in closed form: **Hermite polynomials** {He_k}_{k ≥ 0}.

Hermite polynomials are to Gaussian variables what Fourier modes are to periodic signals: an orthonormal basis that diagonalizes the correlation structure.

**The key formula (Mehler's formula)**: The eigenvalue of the k-th Hermite polynomial under the OU transition is exactly ρ^k, where ρ is the correlation parameter.

T He_k = ρ^k He_k

This is a deep connection: the degree of the polynomial directly determines its predictability.

## Spectral Decomposition of a Learned Representation

Any learned representation h_i(z) with zero mean and unit variance can be decomposed into Hermite modes:

h_i(z) = w_1 He_1(z) + w_2 He_2(z) + w_3 He_3(z) + ...

where w_k are the "mode strengths" (variance fractions) and Σw_k = 1.

Now, what is the correlation between h_i(z) and h_i(z')?

E[h_i(z') h_i(z)] = E[(Σ_k w_k ρ^k He_k(z)) (Σ_j w_j He_j(z))]
                  = Σ_k w_k ρ^k (by orthonormality of Hermite modes)
                  = w_1 ρ + w_2 ρ² + w_3 ρ³ + ...

This is the **spectral bound**:

```mermaid
flowchart TD
    A["Decompose h_i into<br/>Hermite modes<br/>w_1 + w_2 + w_3 + ..."] -->|Correlation =| B["w_1·ρ + w_2·ρ² + w_3·ρ³ + ..."]
    B -->|Since ρ < 1| C["≤ w_1·ρ + w_2·ρ + w_3·ρ + ..."]
    C -->|= ρ·(w_1 + w_2 + w_3 + ...)| D["= ρ"]
    D -->|Equality iff| E["w_1 = 1<br/>Pure linearity"]
    style A fill:#fff3e0
    style E fill:#c8e6c9
```

## The Key Insight

**Any nonlinear distortion strictly reduces correlation between positive pairs.**

Let me rephrase this precisely:

- If h_i is **pure linearity** (w_1 = 1, all other w_k = 0), correlation = ρ.
- If h_i has **any nonlinearity** (any w_k > 0 for k ≥ 2), correlation < ρ.

The loss function penalizes distance, which is equivalent to rewarding correlation (we showed this with the whitening constraint). So the alignment loss will strictly prefer linear representations over nonlinear ones.

This is the heart of why Theorem 1 works: **alignment + Gaussianity forces linearity.**

## Why Hermite Polynomials Are Special

You might ask: are Hermite polynomials the only basis that works? Could we use a different orthogonal basis?

The answer is no. For Gaussian variables, Hermite polynomials are **the natural basis** because they diagonalize the transition operator. Any other basis would not separate the modes so cleanly, and the spectral bound would become much messier.

This is why Gaussian latents are special for identifiability — they have a clean, known spectral structure that immediately reveals the cost of nonlinearity.
