# The ELBO Objective and Why It Prevents Collapse

## From likelihood to a computable bound

Maximizing the marginal log-likelihood p(x, y) is ideal but intractable in high-dimensional latent spaces. So we use **variational inference**: introduce a learnable posterior q(s_x, z, s_y | x, y) that approximates the true posterior p(s_x, z, s_y | x, y).

Jensen's inequality gives us a lower bound on the likelihood:

```
log p(x, y) ≥ E_q[log p(x, y, s_x, z, s_y) - log q(s_x, z, s_y | x, y)]
               \___________ ELBO ___________/
```

Maximizing the ELBO is equivalent to:
1. Maximizing the model's ability to explain the data (likelihood term)
2. Minimizing the divergence between your learned posterior and the true posterior (via KL)

In practice, the ELBO decomposes into terms you can compute and differentiate.

## The factorized ELBO for Var-JEPA

Given the factorization:
- q(s_x | x) · q(z | s_x) · q(s_y | s_x, z, y)
- p(x, y, s_x, z, s_y) = p(s_x) · p(z) · p(x | s_x) · p(s_y | s_x, z) · p(y | s_y)

The ELBO expands to several terms. The dominant ones are:

```
ELBO ≈ E_q[log p(y | s_y)]              [reconstruction: does s_y explain y?]
     - KL(q(s_y) || p(s_y | s_x, z))    [KL divergence on target latent]
     - KL(q(s_x) || p(s_x))             [KL on context latent]
     - KL(q(z) || p(z))                 [KL on auxiliary variable]
```

The optional reconstruction term E_q[log p(x | s_x)] can be included for additional regularization, but isn't necessary for preventing collapse.

## Why this objective prevents collapse

**Scenario 1: s_x collapses to a constant.**
If s_x → c (constant), then:
- The KL(q(s_x) || p(s_x)) term explodes: the posterior is a delta function, the prior is N(0, I). This is maximally divergent.
- The ELBO drops sharply.
- Gradients push s_x away from collapse.

**Scenario 2: s_y collapses to a constant.**
If s_y → c (constant):
- The reconstruction term E_q[log p(y | s_y)] vanishes: a constant s_y has no degrees of freedom to explain variation in y.
- The KL(q(s_y) || p(s_y | s_x, z)) may also increase, since the posterior is constant while the prior is Gaussian and learned.
- The ELBO drops sharply.
- Gradients push s_y toward diversity.

**Why ad-hoc regularizers are unnecessary:**
Standard JEPA needs external variance penalties or EMA because the deterministic MSE loss doesn't care about diversity — it only cares about matching ŝ_y to s_y. Var-JEPA's ELBO inherently rewards diverse latents through the KL terms and reconstruction term. The prior p(s_y | s_x, z) acts as a learned regularizer: if the posterior diverges too far from it, the objective suffers.

## The auxiliary variable z

The auxiliary variable z captures variability in the target that the context alone cannot explain. For example:
- In video: given a frame, the next frame could move left, right, or stay still. z encodes this stochasticity.
- In tabular data: given a customer's age and income, their spending could vary within a range. z models this uncertainty.

Without z, the model is deterministic: s_y = g(s_x). With z, the model is stochastic: s_y ~ p(s_y | s_x, z). This flexibility is critical for real data.

During training, z is sampled from q(z | s_x). During inference, you can:
- Sample z ~ p(z) = N(0, I) for predictions with uncertainty
- Set z = 0 (the prior mean) for point estimates

## Uncertainty quantification as a side benefit

Once you have a posterior q(s_y | s_x, z, y), you have uncertainty estimates "for free." The variance Σ(s_x, z) of the posterior tells you: how confident is the model in the target latent given the context?

Standard JEPA offers no such measure. It outputs a point estimate with no notion of confidence.

— Adapted from Gögl & Yau (2026)
