# The RL Challenge: Learning from Raw Sensory Input

Reinforcement learning has long promised to enable agents to learn directly from their environment. Yet for decades, this vision remained limited to toy problems with carefully hand-crafted features. The core challenge: **how can an agent learn to control itself from high-dimensional sensory inputs like video, without human feature engineering?**

## Why Deep Learning and RL Haven't Mixed

The disconnect between deep learning and RL stems from fundamental differences in the learning signals they operate on:

**Deep learning assumes:**
- Large amounts of labeled data (thousands or millions of examples)
- Independent, identically distributed samples
- Fixed training distribution — the data you train on is the data you test on

**Reinforcement learning confronts:**
- Sparse, delayed rewards (feedback arrives thousands of timesteps after an action)
- Highly correlated states (consecutive frames in a game differ only slightly)
- Non-stationary distribution (the agent's behavior changes, so the data distribution shifts)
- Learning from a scalar reward signal, not hand-labeled ground truth

These constraints seemed incompatible with deep neural networks, which rely on stable, i.i.d. data and direct supervision.

## The Atari Problem

Video games offered an ideal testbed: agents see high-dimensional visual input (210×160 RGB frames at 60Hz), must respond to a diverse set of game mechanics, and receive a clear scalar reward (game score). No hand-crafted features. No access to emulator internals. Just pixels and rewards — the same signal a human player receives.

The question became concrete: can a single neural network, with fixed architecture and hyperparameters, learn to play *multiple* Atari 2600 games from scratch?

Prior work using hand-engineered features and linear value functions had succeeded only on the simplest games. The gap between "learning from hand-designed features" and "learning from raw pixels" felt unbridgeable.

This paper demonstrates it isn't.
