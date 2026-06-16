# The DQN Architecture: From Pixels to Values

With experience replay in place, we can train deep networks. But architecture matters. The design choices reveal how to bridge pixels to game understanding.

## Preprocessing: From Raw Frames to Tensors

Raw Atari frames are 210×160 RGB images with a 128-color palette — computationally expensive. The preprocessing pipeline reduces this:

1. **Convert to grayscale** — color is often redundant for game logic (enemies are a color, but you need position more than hue)
2. **Downsample to 110×84** — shrink by ~2.5x to reduce computation
3. **Crop to 84×84** — focus on the playing area, discard menus and score display

Why square? The GPU convolution implementation expects square inputs.

A single frame still doesn't fully specify the game state (is the ball moving left or right? you need temporal context). The solution: **stack the last 4 preprocessed frames** into an 84×84×4 tensor as input to the network.

## Network Design

The key question: how to parameterize Q(s, a)?

**Option 1:** Take state s and action a as inputs, output a scalar Q-value. This requires one forward pass *per action* — if there are 18 actions, that's 18 passes.

**Option 2:** Take state s as input, output a vector of Q-values, one per action. This requires just one forward pass.

DQN uses **Option 2** because a single forward pass scales to any number of actions.

## The Layers

The exact architecture applied to all seven Atari games:

1. **Input layer** — 84×84×4 tensor (4 stacked frames)

2. **First hidden layer** — 16 convolutional filters of size 8×8 with stride 4, followed by ReLU activation. Output: 20×20×16.

3. **Second hidden layer** — 32 convolutional filters of size 4×4 with stride 2, followed by ReLU activation. Output: 9×9×32.

4. **Third hidden layer** — Fully connected with 256 ReLU units. Flattens the 9×9×32 feature maps and learns abstract representations.

5. **Output layer** — Fully connected linear layer with one output unit per valid action. No activation (Q-values are unbounded).

This is a simple architecture by modern standards, yet it outperformed decades of hand-engineered features. The convolutions extract spatial structure (local patterns) and the fully connected layers learn which patterns matter for action value.

## Why Convolutions?

Convolutional layers are inductive biases that assume spatial locality: a feature detected at position (x, y) is meaningful regardless of small shifts. This is perfect for vision — enemy detection doesn't care about pixel-level jitter. Convolutions also reduce parameters compared to fully connected layers, making training more stable.

## Why ReLU?

Rectified Linear Units (max(0, x)) are nonlinear activations that allow the network to learn nonlinear decision boundaries. They're also computationally efficient compared to older activations like sigmoids.

## Preprocessing as Representation Learning

The stacked-frame input is a form of representation learning: the network doesn't learn this preprocessing; it's designed in. But the convolutional layers learn *which* visual features matter for Q-values — detecting game objects, enemies, score changes — end-to-end. This is fundamentally different from prior methods that extracted hand-designed features before passing them to a linear learner.
