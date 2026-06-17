# Forward Experiments: Linear Recovery from Gaussian Latents

## 2D Visualization (Figure 3)

The most direct test of Theorem 1: latents z ~ N(0, I_2), four different nonlinear mixings g, train LeJEPA encoder f.

**Results**:
- Every learned representation recovers the isotropic Gaussian structure up to rotation.
- Points are colored by their ground-truth latent angles/radii; the learned embedding shows the same color structure rotated.
- The recovery is **perfect** (R² → 1), validating Theorem 1 in the simplest case.

**Why four mixing functions?** To show the result is not an artifact of one specific g. The spiral mixing is measure-preserving (interesting edge case: the observations g(z) are already Gaussian, yet the encoder learns latents, not identity).

## Scaling to High Dimensions (Table 1)

**The question**: Does Theorem 1 hold when dimensions scale to practical values?

**Setup**: RealNVP mixing (a flexible diffeomorphism), latent dimensions N ∈ {2, 4, 8, 16, 32, 64, 128, 256, 512, 1024}.

**Three objectives tested**:
1. **SIGReg**: Sketched Isotropic Gaussian Regularization (explicit full Gaussianity).
2. **VICReg**: Variance-Invariance-Covariance Regularization (covariance constraints, weaker Gaussianity).
3. **InfoNCE**: Contrastive objective (implicit collapse prevention, no explicit Gaussianity).

**Results** (Table 1):

| Dimension | SIGReg R² | VICReg R² | InfoNCE R² |
|-----------|----------|----------|-----------|
| 2         | 0.999998 | 0.999996 | 0.950961 |
| 16        | 0.999988 | 0.999987 | 0.999880 |
| 256       | 0.999884 | 0.999889 | 0.696225 |
| 1024      | 0.999561 | 0.999582 | 0.720241 |

**Key observations**:
- **SIGReg and VICReg**: Maintain R² > 0.999 across all scales (excellent linearity even at 1024-D).
- **InfoNCE**: Matches at low dimensions but degrades at scale. Why? The contrastive kernel has fixed width σ=1. In high dimensions, kernel distances become uninformative (curse of dimensionality), so the contrastive signal weakens.

**Lesson**: Batch-statistic estimators (SIGReg, VICReg) scale better than contrastive methods for this objective, because they directly estimate and constrain statistics rather than relying on pairwise similarity.

## Hyperparameter Sweep (Appendix H.6)

**λ (weight on Gaussianity) and ρ (correlation strength)**:

The paper grid-searched over:
- λ ∈ {0.1, 0.3, 0.5, 0.7, 0.9}
- ρ ∈ {0.3, 0.5, 0.7, 0.8, 0.9, 0.95, 0.99}

**Results**:
- **Best performance**: Low λ (weak Gaussianity) + high ρ (strong correlations).
- **Worst performance**: High λ (strong Gaussianity) + low ρ (weak correlations).

**Interpretation**: 
- Too much Gaussianity (high λ) forces collapse — the model prioritizes Gaussianity over alignment, learning a weak representation.
- Low ρ (weakly correlated views) gives weaker signal for linearity, but still recovers well.
- High ρ maximizes the reward for linearity (per the spectral bound, the penalty for nonlinearity grows with ρ).

## Robustness Across Mixing Functions

Synthetic experiments used four mixing functions. All achieved near-perfect linear recovery:

1. **Spiral** (norm-dependent rotation): R² ≈ 1.0
2. **Sinusoidal shear**: R² ≈ 1.0
3. **Parabolic shear**: R² ≈ 1.0
4. **RealNVP coupling**: R² ≈ 1.0

The consistency across diverse g shows the result is fundamental to the LeJEPA objective on Gaussian worlds, not specific to one type of nonlinearity.

## Key Takeaway

**Forward experiments validate Theorem 1 empirically**: 
- Linear recovery is achieved across mixings, dimensions, and objectives.
- Theory prediction (R² → 1) matches observation.
- Scaling to realistic dimensions (1024-D) shows no degradation for SIGReg/VICReg.

This is strong evidence that LeJEPA provably learns world models for Gaussian-latent domains.
