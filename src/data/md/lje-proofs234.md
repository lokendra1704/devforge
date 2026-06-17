# Proofs of Theorems 2, 3, and 4 (Outlines)

## Theorem 2 Proof Sketch: Gaussian Uniqueness

**Setup**: Any latent distribution p(z) with assumptions (independence, stationarity, additive noise) and the LeJEPA objective.

**Goal**: If linear identifiability holds, then z must be Gaussian.

**Key idea**: Use Sturm-Liouville (SL) theory to characterize the slowest eigenfunction φ_1 of the transition operator. SL guarantees φ_1 is monotonic. For linear identifiability, φ_1 must be affine (linear). Demanding affinity forces the score function to be linear, which integrates to the Gaussian.

**Technical sketch**:
1. The transition operator T (from latent dynamics) has eigenvalues and eigenfunctions characterized by an SL equation with weight w(z) = p(z).
2. By SL theory, the first non-constant eigenfunction φ_1 is monotonic: φ'_1(z) does not change sign.
3. For linear identifiability, we need the slowest feature to be affine: φ_1(z) = az + b.
4. If φ is an eigenfunction, T φ = λ φ, which becomes (after differentiation) a differential equation for ∇log p.
5. Solving this ODE: ∇log p must be linear, so log p ∝ -z², giving p ∝ exp(-z²), the Gaussian.
6. Per-component argument lifts to joint distribution via independence.

**Result**: The Gaussian is the unique distribution satisfying the constraint.

Full proof uses the Sturm-Liouville formalism from Appendix F (which compares SL theory to Hermite-based approaches).

## Theorem 3 Proof Sketch: Approximate Identifiability

**Setup**: h(z) is measurable, approximately linear (alignment gap δ) and approximately Gaussian (whitening error ε).

**Goal**: Bound the recovery error E[‖h(z) - Qz‖²] in terms of δ and ε.

**Key idea**: Decompose the error into nonlinearity (captured by δ) and orthogonality (captured by ε), using Procrustes alignment and linear algebra.

**Technical sketch**:
1. Define D = δ / (2ρ(1-ρ)), measuring the "nonlinearity tax" from the alignment gap.
2. The Procrustes theorem: for any h, there exists a unique orthogonal Q minimizing ‖h(z) - Qz‖².
3. Decompose error into nonlinearity error (due to δ) and whitening error (due to ε):
   - Nonlinearity error contributes O(D)
   - Whitening error contributes O(ε²)
   - Their interaction contributes O(εD)
4. Combining: E[‖h(z) - Qz‖²] ≤ D + (ε + D)² (Theorem 3 bound).

The bound is tight in the sense that achieving δ = ε = 0 recovers Theorem 1 (error = 0).

## Theorem 4 Proof Sketch: Optimal Latent Planning

**Setup**: h(z) = Qz (linear identifiability), costs are rotation-invariant: ℓ(Rz, a) = ℓ(z, a) for R ∈ O(n).

**Goal**: The optimal value and plan in z-space equal those in h(z)-space.

**Key idea**: Rotation-invariant costs commute with orthogonal transformation. The value function V(z) transferred via Q is identical to V̂(Qz).

**Technical sketch**:
1. Write the Bellman equation in z-space:
   V*(z) = min_a [ℓ(z, a) + γ E[V*(z' | z, a)]]
2. Write the Bellman equation in ẑ-space (ẑ = h(z) = Qz):
   V̂*(ẑ) = min_a [ℓ(ẑ, a) + γ E[V̂*(ẑ' | ẑ, a)]]
3. Since ℓ(Qz, a) = ℓ(z, a) and the transition preserves under Q (h(z') = ρh(z) + noise), we have:
   V̂*(Qz) = V*(z)
4. Thus, the optimal policy is preserved: π̂*(Qz) = π*(z).

The key is that rotation-invariance of costs and orthogonality of h make the transformation transparent to the optimizer.

## Connection to Optimal Control Theory

Theorem 4 is related to classical results in **invariant control** — control systems with symmetries. If the system and costs respect a group of symmetries (here, rotations), then the optimal solution respects those symmetries.

The proof uses the **pushforward** of the dynamics: h*(p(z' | z)) = p(h(z') | h(z)), which holds because h is deterministic and invertible (orthogonal).

## Summary of Proof Structure

| Theorem | Main Proof Tool | Key Insight |
|---------|---------|----------|
| 1 (Forward) | Hermite polynomials, spectral analysis | Nonlinearity strictly costs correlation |
| 2 (Converse) | Sturm-Liouville theory, SL eigenfunctions | Affine eigenfunction forces Gaussian |
| 3 (Approximate) | Procrustes theorem, linear algebra | Error decomposes into nonlinearity + orthogonality |
| 4 (Planning) | Optimal control theory, rotation invariance | Rotation-invariant costs transfer via orthogonal map |

Together, these four proofs establish a complete characterization of when LeJEPA learns a world model: **only for Gaussian latents, with guarantees that degrade smoothly under approximation and enable optimal planning.**
