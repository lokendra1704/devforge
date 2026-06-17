# Proof Techniques: Hermite Polynomials and Spectral Decomposition

## Why These Tools?

The paper uses two classical mathematical frameworks to prove the theorems:

1. **Hermite polynomials and Mehler's formula** — for the forward direction (Theorem 1).
2. **Sturm-Liouville theory** — for the converse direction (Theorem 2).

These are not arbitrary choices. They arise naturally from the structure of the problem.

## Hermite Polynomials: Eigenbasis for Gaussians

**What are Hermite polynomials?**

Hermite polynomials {He_k(z)}_{k=0}^∞ are orthogonal polynomials with respect to the Gaussian weight function e^{-z²/2}.

Explicit forms:
- He_0(z) = 1
- He_1(z) = z
- He_2(z) = z² - 1
- He_3(z) = z³ - 3z
- ...

In general, He_k(z) is a polynomial of degree k, and they are orthonormal under the Gaussian measure:

∫ He_k(z) He_j(z) exp(-z²/2) dz = δ_{kj}

**Why Gaussian variables?**

For any Gaussian random variable z ~ N(0, 1), the set {He_k(z)} forms an **orthonormal basis** for functions of z. This means any function h(z) can be decomposed uniquely:

h(z) = Σ_{k=0}^∞ c_k He_k(z)

This is analogous to Fourier decomposition, but for Gaussian variables instead of periodic signals.

## Mehler's Formula

**The key formula connecting Hermite polynomials to the transition operator**:

For z, z' ~ N(0, 1) with correlation E[zz'] = ρ:

E[He_k(z) He_k(z')] = ρ^k

This is **Mehler's formula** — a classical result in orthogonal polynomial theory.

**Why is this formula crucial?**

The transition operator T is defined as T h(z) = E[h(z') | z]. When decomposed in the Hermite basis:

T He_k = E[He_k(z') | z] = ρ^k He_k(z)

So **the k-th Hermite polynomial is an eigenfunction with eigenvalue ρ^k.**

This immediately reveals the spectral structure: higher-degree (more nonlinear) components have smaller eigenvalues. This is what makes linearity optimal.

## Spectral Bounds and Optimization

Once you know the spectral decomposition, the optimization problem becomes simple:

- Maximize correlation: maximize Σ_i E[h_i(z') h_i(z)].
- Decompose h_i = Σ_k w_k He_k (uniqueness via orthonormality).
- Correlation = Σ_k w_k ρ^k.
- Constraint: Σ_k w_k = 1 (variance conservation).

Subject to these constraints, maximize Σ_k w_k ρ^k. Since ρ < 1, the optimal solution is w_1 = 1, all others = 0 (pure linearity).

This is elementary linear algebra once the basis is known. **The Hermite basis does all the heavy lifting.**

## Sturm-Liouville Theory for Converse Direction

For the converse (Theorem 2), you need to characterize the eigenfunction structure for **general (non-Gaussian) latent distributions.**

**Sturm-Liouville theory** is a classical tool for analyzing eigenvalue problems of the form:

d/dz [p(z) dφ/dz] + λ w(z) φ(z) = 0

with boundary conditions and a weight function w(z).

**Key results from SL theory:**
- The first non-constant eigenfunction φ_1 is **always monotonic**.
- The n-th eigenfunction has exactly n-1 zeros.
- Eigenfunctions are orthogonal with respect to a weighted inner product.

For a latent distribution p(z) with additive-noise transitions, the eigenfunction equation can be cast as an SL problem with weight w(z) = p(z).

**The proof strategy for Theorem 2:**

1. The slowest (most predictable) eigenfunction is φ_1, always monotonic under SL theory.
2. For linear identifiability, we need φ_1 to be **affine** (linear + constant).
3. Demanding φ_1 affine forces the score function ∇log p to be linear.
4. Solving ∇log p = linear gives p(z) ∝ exp(-z²), the Gaussian.

**Why is affinity special?** An affine function is the boundary between monotonic (curved) and linear (straight). The SL theory guarantees monotonicity, but linear identifiability demands linearity. Only the Gaussian lifts monotonicity to linearity.

## The Two Proofs Compared

| Aspect | Forward (Thm 1) | Converse (Thm 2) |
|--------|---------|----------|
| Tool | Hermite polynomials | Sturm-Liouville theory |
| What's given? | Gaussian latents | General latent distribution |
| What to prove? | Linearity is optimal | Gaussian is necessary |
| Key insight | Spectral bound ρ^k penalizes degree k | Score function must be linear |
| Technique | Optimization (maximize correlation) | Differential equations (eigenfunction structure) |

Both approaches are tight and elegant. Together, they establish necessity and sufficiency.

## Lean Formalization

The main theorems are verified in Lean 4 to ensure logical rigor. The formalization covers:
- The spectral bound (Equation 4)
- The equivalence between distance minimization and correlation maximization (after whitening)
- The Procrustes theorem (finding optimal Q)
- The SL eigenfunction characterization
- The connection from affine eigenfunctions to Gaussian distributions

Background lemmas (Mehler's formula, SL existence, standard linear algebra) are axiomatized, as they are deep classical results already proven in textbooks.

This balance — verifying the **novel logical chain** while axiomatizing **known classical results** — is the right level of rigor for a mathematics paper.
