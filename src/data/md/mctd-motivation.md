# Why Diffusion-Based Planning Needs Tree Search

Diffusion models have recently emerged as a powerful approach to planning. Unlike autoregressive planning methods, diffusion-based planners such as Diffuser generate entire trajectories holistically through a series of denoising steps, eliminating the need for a forward dynamics model. This approach effectively addresses key limitations of forward models, such as poor long-term dependency modeling and error accumulation, making it particularly well-suited for planning tasks with long horizons or sparse rewards.

However, a critical gap exists: diffusion-based planners lack robust **inference-time scalability**. One challenge is that performance gains from increasing denoising steps plateau quickly, and drawing additional independent samples is highly inefficient as it fails to leverage information across samples.

In contrast, Monte Carlo Tree Search (MCTS) demonstrates robust inference-time scalability. By leveraging iterative simulations, MCTS refines decisions and adapts based on exploratory feedback, making it highly effective in improving planning accuracy as more computation is allocated.

This raises a crucial question: **how can we combine the strengths of diffusion-based planning and MCTS to overcome their individual limitations and enhance inference-time scalability?**

— *Abstract and Introduction, pp. 1–2*
