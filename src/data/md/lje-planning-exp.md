# Latent Planning Validation and Practical Implications

## Goal-Reaching Experiment (Figures 4c, 4d, Figure 5)

**The question**: If h(z) = Qz (linear identifiability), can we plan optimally in learned latent space?

**Setup**: DMC Reacher robot (2D joint angles). The task is goal-reaching: given a start configuration and a goal configuration, find the shortest path.

Three encoders are compared:
1. **Oracle**: Ground-truth latents (z directly, no learning).
2. **Gaussian encoder**: Trained on OU (Gaussian) pairs, achieves R² ≈ 0.95.
3. **Trajectory encoder**: Trained on RL policy pairs, achieves R² ≈ 0.5.

**Planning method**: For each encoder, use simple straight-line planning in latent space: interpolate from ẑ_start to ẑ_goal, then decode the trajectory back to joint space via nearest-neighbor retrieval (since we have a discrete set of observed (z, x) pairs).

## Results

**Figure 4c (Control Cost)**:

Mean control cost to reach goal (lower is better):

| Encoder | Mean Cost |
|---------|-----------|
| Oracle | 1.0 (reference) |
| Gaussian (OU) | 1.02 ± 0.03 |
| Trajectory (RL) | 1.35 ± 0.08 |

The Gaussian encoder is **statistically indistinguishable from oracle** (within error bars). The Trajectory encoder incurs 35% higher cost.

**Figure 4d (Cost vs. R²)**:

Plot control cost (y-axis) vs. linear identifiability R² (x-axis) across all experimental runs and conditions.

The correlation is **strong and monotonic**: higher R² → lower cost. There's no threshold; the relationship is continuous degradation.

## Trajectory Visualization (Figure 5)

**What the paths look like**:

- **Oracle (ground truth)**: Straight line in joint space from start to goal. Optimal.
- **Gaussian encoder**: Straight line in learned latent space, which decodes to a nearly straight path in joint space. Near-optimal because of linear identifiability.
- **Trajectory encoder**: Curved path in learned latent space, which decodes to a longer, curved path in joint space. Suboptimal.

The visualization makes Theorem 4 concrete: when the encoder is linear, planning transfers perfectly. When nonlinear, the plan is distorted.

## Robustness: 30 Random Start-Goal Pairs

Experiment is repeated across K=30 different random start and goal configurations (with constraint that path length ≥ 1).

**Results**:
- Gaussian encoder: Cost ≈ oracle across all 30 pairs.
- Trajectory encoder: Cost elevated across all 30 pairs.

Consistency across diverse goals shows the effect is robust, not cherry-picked.

## Connection to Theorem 4

Theorem 4 required **rotation-invariant costs**. Goal-reaching cost ‖z - z_goal‖² satisfies this:

For any orthogonal Q:
‖Qz - Qz_goal‖² = ‖Q(z - z_goal)‖² = ‖z - z_goal‖²

Since the Gaussian encoder achieves h(z) = Qz (rotation), the cost transfers perfectly to latent space, and the optimal plan transfers.

The Trajectory encoder, with R² ≈ 0.5 (significant nonlinearity), does NOT satisfy h = Qz, so the cost does not transfer, and the plan is suboptimal.

## Practical Implications

1. **Pretraining matters**: If you train a representation on biased data (RL trajectories), you lose the ability to plan optimally in latent space. The encoder is learned with the wrong assumptions.

2. **Data regime is crucial**: The paper's recommendation: use **isotropic random walk data for pretraining** to satisfy theory assumptions. Then adapt for downstream tasks.

3. **Validation in the wild**: The gap between Gaussian (R² ≈ 0.95) and Trajectory (R² ≈ 0.5) encoders on the Reacher task is large enough to be practically significant. A 35% increase in control cost is real.

4. **Loss as a proxy**: The paper notes (Section 6.3, Appendix H.9) that **training loss is a reliable proxy for planning performance.** You don't need to run full planning experiments; monitor loss during training, and you can predict identifiability and planning quality.

## Open Question: What About Action-Conditioned Dynamics?

Theorem 4 addresses the state transition p(z' | z). For full control, you also need p(z' | z, a) — how actions affect the latent state.

The paper focuses on the observation side (Theorems 1-3) and leaves action-conditioned extensions to future work. This is an important direction: interventional causal representation learning could extend identifiability guarantees to action-dependent regimes.

For now, Theorem 4 applies to domains where you can assume stateless actions (or actions that don't fundamentally alter the latent structure), which is true for many robotic tasks with low-dimensional control.
