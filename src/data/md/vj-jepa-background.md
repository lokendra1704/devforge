# Why JEPA Works, and Why It's Missing Something

## The architecture that predicts in representation space

JEPA's genius is asking: *what if we skip pixels and predict directly in latent space?* Instead of:

- **Autoencoders**: x → encoder → z → decoder → x (reconstruct pixels)
- **Diffusion models**: x → add noise → predict noise → x (reconstruct pixels)

JEPA does: x → context encoder → s_x → predictor → ŝ_y ← target encoder ← y

The loss is MSE between the predicted embedding ŝ_y and the actual target embedding s_y. No pixel reconstruction, no noise prediction, no likelihood. Just: *can I predict what the next view looks like in latent space?*

This works. I-JEPA learns strong image features without hand-designed data augmentations. V-JEPA captures spatiotemporal structure in video. T-JEPA handles tabular data.

## The twin problems that force ad-hoc solutions

But JEPA has two structural issues:

**1. Representational collapse.** Both encoders can trivially minimize MSE by outputting the same constant vector. The predictor never learns. Stop-gradient fixes this locally, but it's not a deep solution — it's a workaround.

**2. No uncertainty semantics.** JEPA's deterministic predictions give you a point estimate: "next frame embedding is this vector." But embeddings are high-dimensional and learned from finite data. Shouldn't you know how confident you are? Generative models like VAEs naturally quantify uncertainty via the posterior distribution. JEPA doesn't.

Because of (1), real implementations add extra regularization: EMA, variance penalties, specialized losses like SIGReg. These work, but each one adds design decisions and hyperparameters. You're essentially bolting probabilistic intuitions back onto a non-probabilistic model.

## The key insight: JEPA as a deterministic VAE

Here's the provocative reframing: what if JEPA *is* probabilistic, and we just didn't frame it that way?

Think about a coupled VAE (two VAEs with linked posteriors). You have:
- An encoder for x: q(z_x | x)
- An encoder for y: q(z_y | z_x, y)  ← depends on context
- A decoder for y from latents: p(y | z_y)
- A prior over z_y given context: p(z_y | z_x)

This is exactly what JEPA's architecture is doing, *except* JEPA has removed all the noise and probability. The coupled encoders become deterministic neural networks, the conditional prior p(z_y | z_x) becomes the deterministic predictor, and the reconstruction term is gone.

JEPA is not *non-generative*. It's a *deterministic specialization* of a generative model, where the noise and likelihood were set to zero via architectural choices rather than derived from an explicit objective.

The question Var-JEPA asks: *what if we add that objective back in?*

— Adapted from Gögl & Yau (2026)
