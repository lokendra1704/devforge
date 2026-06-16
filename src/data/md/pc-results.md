# Experimental Results: Learning Curves and Performance

## Two Testing Environments

### Ideal Environment (Random Stimuli)

In the "ideal environment," stimuli are purely random collections of illuminated points with **no intrinsic classes**. The experimenter arbitrarily assigns half the stimuli to response R₁ and half to R₂.

**Key Finding**: In this random environment, the perceptron can learn perfect discrimination of stimuli within its training set (Pr → 1.0). However, **it cannot generalize to new stimuli** (Pg → 0.5, random chance). 

Why? Without natural structure or similarity patterns among stimuli, there is no basis for the perceptron to discover what makes stimuli "similar" in a meaningful way.

### Differentiated Environment (Stimulus Classes)

In the "differentiated environment," stimuli are organized into **distinct classes**—such as squares, circles, and triangles. Each response is associated with one stimulus class.

**Critical Finding**: In differentiated environments, both recall and generalization improve dramatically:
- **Pr** (probability of correctly recalling a previously seen stimulus) → high asymptote
- **Pg** (probability of correctly classifying a NEW stimulus) → **same asymptote**

This is remarkable: **in structured environments, the perceptron generalizes as well as it memorizes**. It cannot distinguish between a stimulus it has seen before and a novel example of the same class.

## Learning Curve Equations

For a given system type and environment, the probability of correct response follows:

$$P = P(N_{ar} > 0) \cdot \Phi(Z)$$

where:
- $P(N_{ar} > 0)$ = probability that at least one effective association unit is activated
- $\Phi(Z)$ = the normal curve integral (cumulative Gaussian)
- $Z$ encodes the difference between source-sets for the two responses being discriminated

The coefficients in the equation depend on:
- Physical parameters: threshold θ, excitatory/inhibitory connection counts
- Environmental structure: stimulus overlap, class similarity
- Learning parameters: number of training stimuli, number of responses

## Performance Across System Types

| Factor | α-System | β-System | γ-System |
|--------|----------|----------|----------|
| Learning speed | Moderate | Slow | Best |
| Variable stimulus distribution | Poor | Worst | Excellent |
| Total value | Grows unbounded | Grows linearly | Constant |
| Scalability | Limited | Limited | Scales well |

The **γ-system consistently outperforms** the others because it avoids runaway value growth that creates statistical instability.

## The Role of System Parameters

Six basic physical parameters determine perceptron performance:

1. **x** — number of excitatory connections per A-unit
2. **y** — number of inhibitory connections per A-unit  
3. **θ** — threshold for A-unit firing
4. **ω** — proportion of response units each A-unit connects to
5. **N_A** — total number of association units
6. **N_R** — total number of response units

Remarkably, **these six measurable physical variables** are sufficient to predict learning curves and generalization performance. No additional behavioral parameters are needed.

## The Similarity Principle

The perceptron's ability to generalize depends on **statistical separability**: the overlap between stimuli of the same class must be higher than the overlap between stimuli of different classes.

Mathematically, if $P_c^{11}$ is the probability an A-unit responds to both stimuli from class 1, and $P_c^{12}$ is the probability it responds to stimuli from different classes, then learning succeeds only if:

$$P_c^{11} > P_a > P_c^{12}$$

This inequality must hold for most geometrical forms that humans intuitively recognize as "similar."
