# Jumpy Denoising as Fast Simulation

In MCTS, evaluating a node far from a leaf node is a critical requirement. This is typically addressed by either using a fast forward dynamics model to roll out trajectories (computationally expensive) or approximating the node's value via bootstrapping (faster but less accurate).

MCTD implements simulation functionality using **fast jumpy denoising** based on the Denoising Diffusion Implicit Models (DDIM). Specifically, when the tree-rollout denoising process has progressed up to the s-th subplan, the remaining steps are denoised quickly by skipping every C step:

$$\\tilde{x}_{s+1:S} \\sim p(x_{s+1:S} | x_{1:s}, g)$$

This produces a full trajectory $$\\tilde{x} = (x_{1:s}, \\tilde{x}_{s+1:S})$$, which is then evaluated using the reward function r(x̃).

## The Trade-Off

While this fast denoising process may introduce larger approximation errors, it is **highly computationally efficient**, making it well-suited for the simulation step in MCTD. In the context of tree search, this trade-off is ideal: many rough evaluations guide the search more effectively than a few perfect evaluations.

— *Section 3.3, p. 4*
