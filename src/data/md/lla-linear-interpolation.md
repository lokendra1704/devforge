# Linear Interpolation: A Simple Visualization Technique

The core method is deceptively simple. During training, we start with random initialization θ_i and SGD produces a final solution θ_f. Instead of analyzing the full high-dimensional trajectory, sample the loss at a series of points along the straight line connecting them:

θ(α) = (1 − α)θ_i + αθ_f

for α ∈ [0, 1]. This sweeps out a 1D curve in parameter space. By plotting J(θ(α)) for all α, we see a cross-section of the loss surface.

Why this works:

- **Simple to compute**: Just interpolate, evaluate the loss, plot.
- **Informative**: Local minima would appear as valleys in the curve. Barriers would appear as bumps. A smooth, convex curve means no obstacles.
- **Practical scale**: The linear path from θ_i to θ_f captures roughly 2/3 of the variation in parameters during learning, so it's representative.

The method reveals what the trajectory actually encounters, not what *could* be in the full landscape:

```mermaid
flowchart LR
    A["Random initialization<br/>θ_i"] -->|"α = 0"| B["(1-α)θ_i + αθ_f<br/>Interpolated point"]
    B -->|"Evaluate J(θ)"| C["Loss value<br/>J(θ)"]
    C -->|"Repeat for α ∈ [0,1]"| D["Curve: J vs α<br/>Loss surface slice"]
    D -->|"Smooth? Convex?"| E["Reveal obstacles<br/>or lack thereof"]
    E -->|"α = 1"| F["Final solution<br/>θ_f"]
```

**What different curve shapes reveal**:

- **Smooth, nearly convex** = few or no obstacles; poor conditioning likely the bottleneck
- **Dips (valleys)** = local minima encountered along the path
- **Bumps (peaks)** = saddle points or barriers SGD must cross
- **Wide plateau at bottom** = large region of low error; training converges slowly despite smooth geometry (classic conditioning problem)

Two key observations from Goodfellow & Vinyals:

1. "When we set θ_0 = θ_i and θ_1 = θ_f, we find that the objective function has a simple, approximately convex shape along this cross-section. In other words, **if we knew the correct direction, a single coarse line search could do a good job of training a neural network.**"

2. When zooming into high resolution plots near initialization and final solution, even fine structure disappears. Bumps at coarse resolution were artifacts of dropout noise, not actual obstacles.

This technique has become foundational for understanding neural network optimization and loss landscape visualization.
