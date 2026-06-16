# Advanced Architectures: Convnets, Generative Models, and RNNs

The feedforward results might seem architecture-specific. To generalize, the authors tested:

## Convolutional Networks on CIFAR-10

> "In the case of convolutional networks, we find that there is a single barrier in the objective function, near where the network is initialized. This may simply correspond to the network being initialized with too large of random weights. This barrier is reasonably wide but not very tall."

Unlike feedforward networks, convnets show one modest obstacle *near the start*. Once SGD passes this initial barrier, the loss surface is smooth again. This is likely an initialization artifact: convolutional filters initialized too large produce loud gradients. After a few iterations, initialization adjusts, and then descent proceeds smoothly.

The key point: **even this barrier does not prevent successful training**. SGD navigates it naturally. It's not a fundamental obstruction to optimization, just a consequence of starting in a loud regime.

## Generative Models (MP-DBM)

Generative models are traditionally harder to train (no clear labels, different objective). Testing an MP-DBM (a restricted Boltzmann machine variant useful as both generative model and classifier):

> "Here we find a secondary local minimum with high error, but a visualization of the SGD trajectory reveals that SGD passed far enough around the anomaly to avoid having it affect learning."

**Crucial**: The linear interpolation path *between the initialization and final solution* shows a secondary minimum. But when you plot the *actual SGD trajectory* in 2D (two principal components of the parameters over time), the trajectory avoids this barrier. SGD stays off the linear path, naturally skirting obstacles.

This is a subtle but profound point: **Linear interpolation reveals what *could* be in the way. But the actual trajectory finds a path around obstacles.** The landscape is bad, but SGD's stochasticity and high dimensionality help it escape.

## LSTMs on Penn Treebank

Recurrent networks are even more complex: long sequences, vanishing/exploding gradients, many timesteps. Testing an LSTM:

> "This experiment did not find any difficult structures, showing that the exotic features of non-convex optimization do not appear to cause difficulty even for recurrent models of sequences."

The loss surface along the linear path is smooth and convex, even for LSTMs. Despite their added complexity, the same pattern holds: the *direction* from initialization to solution is geometrically benign.

## Synthesis: Generality Across Architectures

Across feedforward (fully-connected, ReLU, sigmoid, maxout), convolutional, generative, and recurrent networks, the pattern is consistent:

1. **Well-behaved linear paths** — most architectures show no obstacles or only trivial ones
2. **Stochasticity helps** — where barriers do exist, SGD's noise and high dimensionality help navigate around them
3. **Conditioning dominates** — slowness during training is not due to geometric barriers, but to poor curvature
4. **Initialization matters** — the one barrier commonly seen (convnets near α=0) is an initialization artifact, not fundamental

This suggests the "difficulty" of non-convex optimization is overstated. The real challenges are *information-theoretic* (breaking symmetry) and *numerical* (conditioning), not geometric.
