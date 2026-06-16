# Guidance Levels as Meta-Actions

Constructing and searching a tree in traditional MCTS becomes computationally expensive in large action spaces and is fundamentally impractical for continuous action spaces. To resolve this issue, MCTD redefines the exploration-exploitation trade-off in terms of **meta-actions**: discrete decisions that control the exploration-exploitation balance.

The framework implements meta-actions as **guidance levels** applied during denoising:

## Two Guidance Levels

- **NO GUIDE**: Sampling from the prior distribution p(x) uses the standard diffusion sampler, which does not attempt to achieve any goal but only imitates the prior behavior in the offline data. This represents **exploratory behavior**.

- **GUIDE**: Sampling from a goal-directed distribution through classifier-guided diffusion steers the sampling toward achieving specific goals defined by a reward function. This represents **exploitative behavior**.

## Guidance Schedule

By dynamically adjusting the guidance schedule g = (g₁, ..., gₛ), which assigns a guidance meta-action gₛ ∈ {GUIDE, NO GUIDE} to each corresponding subplan xₛ, MCTD enables the **exploration-exploitation balancing at the level of subplans within a single denoising process**:

$$p(x|g) \\approx \\prod_{s=1}^{S} p(x_s | x_{1:s-1}, g_s)$$

This approach enables efficient and scalable planning, even in complex or continuous action spaces.

## Generalization

The framework generalizes beyond binary choices. Guidance levels can be extended to multiple levels such as {ZERO, LOW, MEDIUM, HIGH}, offering finer control over the balance between exploration and exploitation during the expansion process.

— *Section 3.2, pp. 3–4*
