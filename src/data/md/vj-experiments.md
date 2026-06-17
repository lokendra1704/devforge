# Empirical Results: Tabular Data

## Why tabular data?

The paper focuses on tabular (heterogeneous, feature-level) data, instantiating the framework as **Var-T-JEPA**. This is a natural fit: tabular data has:
- Mixed modalities (numeric, categorical, missing values)
- Causal structure (some features predict others)
- Interpretable features (unlike pixel space)

T-JEPA (Thimonier et al., 2025) already showed JEPA could work on tabular data with feature-level masking and transformer tokenization. Var-T-JEPA builds on this with the variational framework.

## Experimental setup

**Datasets:**
- Simulation study: synthetic data where ground truth is known
- Downstream evaluation: 6 real tabular datasets (UCI, Kaggle)

**Baselines:**
- T-JEPA: the standard deterministic version (with EMA and other regularizers)
- LeJEPA: T-JEPA + SIGReg (isotropic Gaussian regularization)
- Raw-feature baselines: simple models trained on raw features only

**Metrics:**
- Linear evaluation: freeze learned representations, train a linear probe
- Downstream classification: use representations for downstream tasks

## Results summary

| Setting | T-JEPA | Var-T-JEPA | Improvement |
|---------|--------|-----------|-------------|
| Simulation (linear eval) | 85.2% | 88.7% | +3.5pp |
| Downstream (avg. acc.) | 76.4% | 78.9% | +2.5pp |
| Downstream (vs. raw features) | -2.1pp | +1.3pp | +3.4pp |

**Key findings:**
1. **Var-T-JEPA consistently outperforms T-JEPA** across all datasets, with gains ranging from 1–5%.
2. **Collapse is genuinely solved**: posterior variance remains high throughout training, without ad-hoc regularizers. Standard T-JEPA requires EMA + auxiliary losses; Var-T-JEPA needs only the ELBO.
3. **Uncertainty estimates are meaningful**: the learned posterior variance correlates with downstream prediction error, making it useful for downstream uncertainty quantification.

## Why does Var-T-JEPA win?

The ELBO objective provides three advantages over deterministic JEPA:

**1. Better regularization without hyperparameters:**
Standard JEPA's stop-gradient and EMA are architectural heuristics. Var-T-JEPA's KL divergence terms are part of the objective itself. This removes design choices and makes the method more robust.

**2. Learned prior (the predictor) is more informative:**
In JEPA, the predictor g(s_x) is trained only to match s_y — it's a point estimate with no notion of the *distribution* over plausible s_y values. In Var-T-JEPA, g(s_x, z) defines a learned prior p(s_y | s_x, z), which captures the conditional distribution of targets. This prior is richer and acts as a natural regularizer.

**3. Posterior serves as a regularizer for the target encoder:**
The factorization q(s_y | s_x, z, y) allows the target encoder to see y during training, but the KL divergence ensures it doesn't overfit to raw observations — it must match the learned prior's distribution. This is a form of distillation: the target encoder learns to compress y into s_y while staying coherent with the predictor's expectations.

## Practical implications

For practitioners building tabular representation learners:
- **Use Var-T-JEPA if you want fewer hyperparameters** (no EMA decay schedule, no variance penalty weights).
- **Use Var-T-JEPA if you need uncertainty estimates** (the posterior gives you confidence intervals on latents).
- **Use Var-T-JEPA if collapse is a practical concern** in your domain (high-dimensional features, small datasets).

For vision or video, the benefits may differ. JEPA is mature in those domains; Var-JEPA is a competitive alternative that trades some speed (sampling via reparameterization) for principled regularization.

— Adapted from Gögl & Yau (2026)
