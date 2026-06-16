# Feedforward Networks: Nearly Convex Training Paths

The first experiments used fully-connected networks trained on MNIST with maxout activations (and later ReLU, sigmoid). Here's what they found:

## Maxout on MNIST: The Canonical Result

A maxout network with dropout achieved 94% accuracy on MNIST (only 94 mistakes out of 10,000). The linear interpolation experiment showed:

> "The 1-D subspace spanning the initial parameters and final parameters is very well-behaved, and that SGD spends most of its time exploring the flat region at the bottom of the valley."

The loss curve rises steeply near initialization (the network learning to distinguish classes), then flattens dramatically. This is the hallmark of poor conditioning:

- **Early learning (α ≈ 0 to 0.5)**: Loss drops rapidly as the network breaks symmetry and learns coarse features.
- **Late training (α ≈ 0.5 to 1.0)**: Loss decreases slowly in a flat region. SGD moves slowly here, not because of obstacles, but because the landscape is nearly flat in most directions while steep in a few.

This matches the training dynamics: "Essentially all of learning happens in the first few epochs. Thereafter, the algorithm struggles to make progress."

## Different Activation Functions: Consistent Pattern

To rule out whether Maxout's design made optimization unnaturally easy, they tested:

- **Sigmoid activations**: Still smooth, nearly convex path
- **ReLU activations**: Still smooth, nearly convex path

Even with high-resolution zooming near the start (α ∈ [0, 0.01]) and end (α ∈ [0.99, 1.0]), "increased resolution did not expose any small, difficult structures."

## Local Minima Are Rare, Not the Problem

Here's a critical observation: **local minima do exist**. When they trained two separate networks with different random seeds, both converged to different loss values. These are distinct local minima.

But here's the key: "If we interpolate between a solution and a randomly selected point we do not find evidence of barriers."

When interpolating between two SGD solutions, barriers appear (they are genuinely different local minima). But when interpolating between a solution and a *random point* in parameter space, no barriers appear. This shows local minima are rare artifacts of initialization, not a ubiquitous hazard.

## Why This Matters

The nearly-convex 1D path reveals that:

1. **Geometric obstacles are not the bottleneck** — no major saddle points or barriers block the path
2. **The real problem is information flow** — finding which direction to move first (breaking symmetry), then maintaining good convergence speed (conditioning)
3. **Direct gradient descent works** — because once you move in the right direction, the geometry is benign

The implication: schemes like unsupervised pretraining (which was proposed to help SGD escape local minima) may work, but not for the reasons originally hypothesized. If local minima aren't the problem, pretraining must be helping in other ways—perhaps by providing better initialization direction.
