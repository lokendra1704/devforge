# Learning XOR and Parity: What Networks Discover

The test of any learning algorithm is not that it works in principle, but that it works on real problems. The paper presents increasingly difficult benchmark tasks—starting with the notorious XOR and building up to pattern-counting (parity).

## The XOR Problem Solved

XOR requires a network to learn that the output is 1 only when inputs differ. It's "hard" not because it requires deep intuition, but because the input/output structure is misaligned for a two-layer network.

The paper ran XOR hundreds of times with various architectures:

- **Single hidden unit** with direct input-to-output connections: Works ~99% of the time. Learns in ~558 sweeps through the 4 training patterns.
- **Two hidden units** with no input-to-output connections: Works only ~2% of the time—why?

The culprit is **symmetry breaking**. If both hidden units start with identical weights (a default in many implementations), they receive identical error signals and develop identically. They become redundant, leaving no role for the second unit. The network reaches a local minimum where it solves 2 of the 4 patterns correctly.

**Solution:** Initialize weights with small random values. This breaks symmetry—the hidden units develop different roles and can escape the trap.

One failure case the paper documents:

```
Network learned:
  Correctly: (0,0)→0 and (1,0)→1
  Wrong: (0,1)→0.5 and (1,1)→0.5
```

Both wrong patterns produce output 0.5, the *default* output of an undecided logistic unit. The network got stuck: the hidden weights aligned so that the output unit receives zero net input for those patterns. This happened because the initial weights were equal.

**Key insight:** Local minima are rare in practice (~2 out of hundreds of trials). Symmetry-breaking failures are the real enemy. Small random initialization solves this.

## Parity: The Hard Problem

Parity is deceptive. For $N$-bit input, output is 1 if an odd number of bits are on. This is a simple rule—but the input patterns most similar (differing by one bit) require *opposite* outputs.

The paper trained on parity problems from 2 bits (easy, same as XOR) to 8 bits (hard). A key finding: **it requires at least $N$ hidden units to solve $N$-bit parity.**

Even more interesting: the hidden units *automatically* learn a counting structure:

- One hidden unit turns on if **any** input is on
- Another turns on if **two or more** inputs are on
- The third turns on if **three or more** inputs are on
- And so on

These units act like counters. The output then weights them: add the counts up to the final layer. The result is a learned "majority detector" structure that the network discovered without being told.

This structure is not hardcoded anywhere—it emerges from backpropagation trying to minimize error. **The algorithm finds elegant solutions.**

## Time to Convergence

For XOR with varying numbers of hidden units, learning time follows:

$$P = 280 - 33 \log_2 H$$

where $P$ is the average number of training passes and $H$ is the number of hidden units.

Doubling the hidden units from 2 to 4 reduces learning time by ~33 passes. More hidden units = faster learning (though with diminishing returns). This makes intuitive sense: redundancy helps—more candidate units means the network is more likely to find good role divisions early.

## Generalization

A network trained on all $2^N$ patterns of an $N$-bit problem learns perfectly on those patterns. But what about test patterns it's never seen?

The paper notes that on small problems, the network often *overfits*—it memorizes the training set without generalizing. But on larger problems, generalization improves dramatically. A network trained on partial data often correctly predicts novel patterns.

This hint at the generalization story became central to later deep learning: networks trained with more data and gentle regularization (like weight decay, unmentioned here but implicit) can learn robust, transferable representations rather than brittle memorization.

## The Big Picture

These experiments answer three questions:

1. **Does backpropagation find solutions?** Yes, reliably (99%+ success on XOR).
2. **Is it fast?** Yes, learning time scales logarithmically with hidden unit count.
3. **Are the solutions interpretable?** Surprisingly yes—the network learns human-like counting for parity.

The combination of reliability, speed, and interpretability convinced the field that backpropagation was a breakthrough. It wasn't just a theoretical curiosity—it actually worked.
