# Learning from Observation: The World Model Hypothesis

Every human learns largely by watching. A child watches someone pour water, drop an object, push a toy, and builds an internal model of physics without needing the reward structure of reinforcement learning. This internal model—what researchers call a **world model**—serves three connected functions:

1. **Understanding** — recognizing what's happening in the world
2. **Prediction** — anticipating what will happen next  
3. **Planning** — deciding what actions to take to reach a goal

Yann LeCun calls this "the big question in AI": building systems that learn world models largely from observation, rather than relying on vast amounts of labeled data or explicit rewards.

## The Problem with Current Approaches

Most prior work on world models hits a bottleneck: **data**. Models trained purely from robot interaction data are constrained by how much data you can collect—a robot can only interact in specific environments, with specific objects, at the speed of physical time.

Video generation approaches (models that imagine pixel-by-pixel what happens next) avoid this bottleneck by using internet-scale video. But they have a different problem: they waste computation on *unpredictable details*. A generative model must predict exactly which blade of grass appears where, which leaf rustles when—details that are inherently noisy and don't inform action planning.

> **What if we only predict the parts of video that matter for understanding and acting?**

## The JEPA Approach

The **Joint-Embedding Predictive Architecture (JEPA)** flips the script. Instead of predicting pixels, it predicts in a *learned representation space*—capturing structure and dynamics while ignoring unpredictable noise.

The key insight: train a self-supervised model to predict masked portions of videos in its own learned representation. Then, the representations that emerge will encode the information needed for understanding, predicting future states, and—crucially—planning actions in a latent space rather than pixel space.

With V-JEPA 2, this approach scales:
- **1 million hours** of internet video for pretraining (action-free, just observation)
- **62 hours** of robot interaction data for action-conditioning
- **Zero-shot generalization** to new objects, new environments, new robot hardware

The result: a single model that understands motion, anticipates future actions, and plans robot manipulation—all from a compact representation learned from video.
