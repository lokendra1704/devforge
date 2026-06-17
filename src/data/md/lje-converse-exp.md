# Converse Experiments: Non-Gaussian Latents Break Linearity

## Latent Distribution Sweep (Figure 4b)

**The question**: Is Gaussian truly unique for linear identifiability, or would any isotropic distribution work?

**Setup**: Latent distribution is varied through the generalized normal family (GenNorm), parameterized by shape α:

p(z_i) = (α·β / 2·Γ(1/α)) · exp(-(|z_i| / β)^α)

- α → 0: heavy-tailed (extreme outliers)
- α = 1: Laplace (exponential tails)
- α = 2: **Gaussian** (the target)
- α → ∞: Uniform (bounded support)

All distributions are normalized to have zero mean and unit variance.

**Results** (Figure 4b):

Linear identifiability R² is plotted for each α, across three objectives:
- **SIGReg** (explicit Gaussianity): Plateaus at R² ≈ 0.999 near α=2, drops for both heavy-tailed and uniform.
- **VICReg** (covariance only): Similar pattern but slightly lower plateau.
- **InfoNCE** (implicit): More sensitive to non-Gaussianity, but still peaks at α=2.

**Key insight**: All three methods **peak sharply at α=2 (Gaussian)**, exactly as Theorem 2 predicts.

The peak is not a local maximum — it's a global optimum. Nearby distributions show degraded performance, ruling out the possibility that many distributions could work equally well.

## Why Does SIGReg's Plateau Widen for Heavy Tails?

One nuance: Figure 4b shows that **SIGReg maintains a wider plateau around α=2** than VICReg for heavy-tailed distributions.

Why? SIGReg **directly enforces Gaussianity of h(z)** via explicit sampling and moment matching. Even if the latents z are non-Gaussian, SIGReg tries to "Gaussianize" the embedding, partially counteracting the non-Gaussianity of the inputs.

VICReg only constrains second moments (covariance), so it is more sensitive to higher moments that deviate from Gaussian.

**Practical lesson**: If your true latent distribution is slightly non-Gaussian but you want to apply LeJEPA, SIGReg is more robust.

## Pixel-Based RL: Gaussian vs. Real Trajectories (Table 2)

**The most realistic test**: What happens when theory assumptions are violated in real data?

**Setup**: DMC Reacher robot (2D joint angles θ_0, θ_1). Two data conditions:

1. **OU (Synthetic Gaussian)**: Clean z ~ N(0, I_2), transitions via Ornstein-Uhlenbeck (Equation 1). Theory assumptions are perfectly satisfied.

2. **Trajectory (Real RL Policy)**: Joint angle pairs (z_t, z_{t+δ}) from 10k RL episodes. The policy keeps joints in a narrow range to accomplish its task, so marginals are non-Gaussian.

**Results** (Table 2):

| ρ | OU R²(h→z) | Trajectory R²(h→z_0) | Trajectory R²(h→z_1) |
|---|-----------|------------------|------------------|
| 0.5 | 0.86 ± 0.01 | -0.47 ± 0.05 | 0.01 ± 0.02 |
| 0.8 | 0.94 ± 0.0003 | 0.50 ± 0.02 | 0.78 ± 0.06 |
| 0.99 | 0.95 ± 0.0004 | 0.44 ± 0.04 | 0.77 ± 0.01 |

**Observations**:
- **OU pairs**: Clean, consistent performance across ρ values (R² ≈ 0.95).
- **Trajectory pairs**: Highly variable per dimension (R²(h→z_0) ≈ 0.44–0.50, R²(h→z_1) ≈ 0.77–0.87) and consistently lower overall.

**Why the breakdown?** Real RL trajectories violate multiple assumptions:
1. **Non-Gaussian marginals**: Policy keeps joints in a narrow, high-entropy region, collapsing marginals into a low-variance subspace.
2. **Anisotropic transitions** (ρ_0 ≠ ρ_1): Different joint dimensions have different correlations; the OU model assumes isotropic ρ.
3. **Joint angle wrapping** (z_i ∈ [0, 2π]): Circular geometry doesn't respect Euclidean assumptions.

**Theorem 2 prediction validated**: When assumptions break, linear identifiability breaks. This is not a failure of implementation — it's a structural consequence of violating the theoretical assumptions.

## Lessons for Practice

This experiment reveals a crucial gap between theory and real-world application:

- **Theory assumes**: Gaussian-distributed, isotropically correlated, Euclidean latent spaces.
- **Real RL data**: Policy-driven, anisotropic, often circular or constrained.

**How to close this gap?** The paper recommends (Discussion, Section 8):

> "For self-supervised pretraining, exploration approximating an isotropic random walk keeps the data in the regime our theory covers."

In other words: **decouple pretraining from downstream tasks.** Use isotropic random exploration (or near-random data) for pretraining, where Gaussian assumptions hold. Then fine-tune or adapt for specific downstream RL tasks.

This hybrid approach gets the best of both worlds:
- Provably identifiable representations from clean pretraining data.
- Practical applicability to downstream policy learning.
