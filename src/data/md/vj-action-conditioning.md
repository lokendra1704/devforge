# From Observation to Action: V-JEPA 2-AC

## The Gap Between Understanding and Planning

V-JEPA 2 pretrains on action-free video. To enable planning, we need an **action-conditioned world model**: given current state and proposed action, predict the next state.

## The Two-Stage Approach

**Stage 1 (Pretraining)**: V-JEPA 2 learns from 1M hours of action-free internet video.
**Stage 2 (Post-training)**: Freeze V-JEPA 2 encoder. Train a new **action-conditioned predictor** on 62 hours of unlabeled robot video (Droid dataset).

The Droid dataset has raw video, end-effector states (position + orientation + gripper), and action sequences. No reward labels, no task metadata.

## V-JEPA 2-AC Architecture

~300M-parameter transformer with **block-causal attention**.

**Inputs** (interleaved): frame representation, action (7D), end-effector state (7D)

**Attention pattern** (block-causal): Each patch at timestep *t* attends to past and present, not future.

**Loss**: Teacher-forcing (1-step) + Rollout (multi-step) to avoid error accumulation.

## Why Freeze the Encoder?

The V-JEPA 2 encoder already learned rich representations from 1M hours. With only 62 hours of robot data, fine-tuning would overfit. Freezing enables transfer learning.

## Planning Loop

Given goal image + current state:
1. Encode current state and goal → z_k, z_goal
2. Minimize L1(Predictor(a_1:T; s_k, z_k) - z_goal) via CEM
3. Execute first action, re-plan

Takes ~16 seconds per action (vs. 4 minutes for diffusion models).
