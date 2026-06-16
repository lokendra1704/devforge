# Denoising as Tree-Rollout: From States to Subplans

Traditional MCTS operates on individual states, leading to deep search trees and significant scalability challenges. Because each node represents a single state, the depth of the tree increases linearly with the planning horizon, resulting in an exponential growth of the search space.

To address this, MCTD introduces **Denoising as Tree-Rollout** by leveraging semi-autoregressive denoising. The full trajectory is partitioned into S subplans:

$$x = (x_1, x_2, \\ldots, x_S)$$

Unlike standard diffusion where all subplans share the same global denoising schedule, this approach allows assigning independent denoising schedules to each subplan. By applying faster denoising to earlier subplans and slower denoising to later subplans, the process becomes causal and semi-autoregressive:

$$p(x) \\approx \\prod_{s=1}^{S} p(x_s | x_{1:s-1})$$

Although this formulation appears autoregressive, it is still executed as a single denoising process by controlling noise levels across subplans.

## The Scalability Win

Each subplan xs, which represents a temporally extended state, is treated as a node in the search tree, rather than using individual states as nodes. This allows the tree to operate at a higher level of abstraction, improving efficiency and scalability.

Because S ≪ N (e.g., S = 5 and N = 500), **the tree depth becomes much smaller than in traditional MCTS**, dramatically reducing computational demands.

— *Section 3.1, p. 2*
