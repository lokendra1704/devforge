# The World Model Problem

## What makes a "World Model"?

When you train a self-supervised representation on images or video, you're optimizing some alignment loss — pulling similar views together while preventing collapse. The question is: *does the resulting representation actually capture the world's latent structure?*

Say you train a model on robot camera feeds, and it learns to extract position, velocity, and color. Sounds great. But what if the learned representation scrambles velocity with color? It might score perfectly on your self-supervised loss and pass linear probes on individual downstream tasks, but fail when the task changes or distribution shifts. A representation that entangles unrelated factors is not a faithful model of the world.

> **Wait — isn't any good representation fine for downstream tasks?** Yes, if all your tasks are fixed. But a *World Model* must generalize compositionally: if you learn the position-of-object-A and position-of-object-B separately, you should be able to reason about both together without retraining. That requires clean, disentangled latent structure.

## Linear Identifiability: The Guarantee We Need

**Linear identifiability** is the mathematical property that guarantees a representation has recovered the true latent variables, up to unavoidable symmetries.

Formally: the composed map h = f ∘ g (encoder ∘ true nonlinear process) should equal Q·z, where Q is an orthogonal transformation (rotation, reflection, permutation — the symmetries of an isotropic Gaussian). Any deviation from this linear form means the representation has entangled factors.

This is not a new idea to practitioners. Every time you apply a linear probe to a representation, you're implicitly asking: "Does this representation linearly recover the latent variables?" If the answer is no, a linear classifier cannot extract them no matter how well trained it is.

Yet prior work on Joint-Embedding Predictive Architectures (JEPAs) had no identifiability results. This paper closes that gap with the first identifiability guarantee for JEPAs, and the answer is surprising: **among all world models with Gaussian latents, LeJEPA (alignment + explicit Gaussian regularization) not only achieves linear identifiability — it forces it.**

## The Paper's Contributions at a Glance

1. **Forward direction**: Under the LeJEPA objective (alignment + Gaussian regularization) on Gaussian-latent worlds, the learned representation MUST be a rotation of the true latents.

2. **Converse direction**: Among all world models satisfying reasonable assumptions (independence, stationarity, additive noise), the Gaussian is the UNIQUE latent distribution for which linear identifiability holds.

3. **Approximate identifiability**: If the objectives are only approximately satisfied, the error degrades smoothly — useful for practice.

4. **Planning guarantee**: Linear identifiability enables provably optimal planning in latent space for rotation-invariant costs.

The paper validates all four results with experiments from 2D toy examples up to 1024-dimensional latents, including pixel-based robotic control.
