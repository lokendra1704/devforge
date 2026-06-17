# Experimental Design and Setup

## Overview

The paper validates all four theorems with experiments ranging from toy 2D examples to 1024-dimensional latents. The experiments test:

1. **Forward (Theorem 1)**: Do Gaussian worlds with LeJEPA force linear recovery?
2. **Converse (Theorem 2)**: Do non-Gaussian latents break linear recovery?
3. **Approximation (Theorem 3)**: Do errors degrade smoothly with δ and ε?
4. **Planning (Theorem 4)**: Does linear identifiability enable optimal planning?

## Experimental Domains

### 2D Synthetic Experiments
- **Setup**: Latent z ~ N(0, I_2). Four different nonlinear mixing functions: norm-dependent rotation (spiral), sinusoidal shear, parabolic shear, RealNVP coupling layer.
- **Why**: Test whether linearity emerges across diverse mixing functions, not just one specific case.
- **Result**: Linear recovery (R²) consistent with Theorem 1 prediction across all four functions.

### Scaling Experiments (2D → 1024D)
- **Setup**: RealNVP mixing function, varying latent dimension N ∈ {2, 4, 8, ..., 1024}.
- **Why**: Validate that theory holds at realistic scales (DINOv3 embeddings are 768-D).
- **Objectives tested**: SIGReg, VICReg, InfoNCE — three different Gaussianity-enforcing mechanisms.
- **Result** (Table 1): SIGReg and VICReg maintain R² > 0.999 up to 1024-D; InfoNCE degrades at scale due to fixed kernel width.

### Distribution Sweep (Theorem 2 Validation)
- **Setup**: Latent distribution sweeps through generalized normal family: α ∈ {0.1, 0.5, 1, 1.5, 2, 3, 5, ∞}.
  - α → 0: heavy-tailed
  - α = 2: Gaussian (target)
  - α → ∞: uniform
- **Why**: Show that linear recovery peaks at Gaussian and degrades for alternatives.
- **Result** (Figure 4b): Sharp peak at α=2, confirming Theorem 2.

### Pixel-Based RL: Gaussian vs. Real Trajectories (Theorem 2)
- **Setup**: DMC Reacher robot (2D joint angles). Two conditions:
  1. **OU (synthetic Gaussian pairs)**: Clean Gaussian latents with OU transitions.
  2. **Trajectory (real RL policy)**: Joint angle pairs from 10k RL episodes.
- **Why**: Test whether real-world data (non-Gaussian) breaks identifiability as Theorem 2 predicts.
- **Result** (Table 2): OU pairs give R² ≈ 0.95; trajectory pairs give R² ≈ 0.5–0.6. Theory predicts this breakdown.

## Training Details

### Encoder Architecture
- MLP: 4 layers, ReLU activations. For high dimensions, matched to mixing function to ensure capacity is not the bottleneck.
- CNN: For pixel-based experiments, with matched receptive fields.

### Optimization
- Optimizer: Adam, learning rate 1e-3
- Training time: ~5000 steps for synthetic experiments
- Batch size: 256

### Loss Weight λ
- Grid search over λ ∈ {0.1, 0.3, 0.5, 0.7, 0.9} (weight on SIGReg vs. alignment)
- Correlation strength ρ ∈ {0.3, 0.5, 0.7, 0.8, 0.9, 0.95, 0.99}
- Results: Best linear recovery at low λ (low Gaussianity weight) and high ρ, as theory predicts.

## Evaluation Metrics

### Linear Identifiability R²
R²(h → z) = 1 - E[‖h(z) - Qz‖²] / E[‖z‖²]

where Q is the optimal rotation found via Procrustes alignment. R² = 1 is perfect linearity, R² = 0 means the representation is independent of latents.

### Alignment Gap δ
δ = L(h) - 2(1-ρ)tr(Cov(h(z)))

Measures how far the actual loss is from optimal.

### Whitening Error ε
ε = ‖Cov(h(z)) - I_n‖_F

Frobenius norm of the deviation from identity covariance.

### Approximation Bound Verification
For each run, compute δ, ε, D, the bound B = D + (ε+D)², and actual recovery error E[‖h(z) - Qz‖²]. Plot actual vs. bound to verify Theorem 3.

## Statistical Rigor

- **Multiple seeds**: Most experiments use 3–5 independent seeds with different initializations.
- **Error bars**: Mean ± std reported in tables.
- **Significance**: Results are robust across seeds, indicating the effects are real, not noise.

## Implementation Notes

The paper provides:
- Code for all experiments at https://github.com/klindtlab/lejepa-identifiability
- Lean 4 formalization of main theorems
- Demo visualizations for 2D experiments

Reproducibility is emphasized: all hyperparameters, architectures, and training details are in Appendix H.
