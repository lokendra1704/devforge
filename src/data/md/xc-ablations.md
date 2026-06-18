Two design choices in Xception look optional from the outside — residual connections, and whether to add a non-linearity between the depthwise and pointwise steps. The paper tests both, and only one answer matches what you'd predict from everything covered so far.

## Residual connections: not optional

The whole architecture (Module 3) wraps every block except the first and last in a shortcut. What happens if you strip those out?

> "Residual connections are clearly essential in helping with convergence, both in terms of speed and final classification performance." — Section 4.6

This isn't a small effect — it's the same lesson ResNet taught the field in general, just confirmed again for this specific stack of depthwise separable layers. The paper is careful to scope the claim, though: this shows residuals matter *for this architecture as benchmarked*, not that depthwise separable convolutions *require* residuals to work at all — they note "excellent results with non-residual VGG-style models" built the same way, competitive with Inception V3 on JFT at equal parameter count.

## A non-linearity between depthwise and pointwise: actively harmful

Recall from the spectrum lesson: an "extreme Inception module" and a depthwise separable convolution differ in whether there's a ReLU between the two steps. Inception modules *do* have one. Standard depthwise separable convolutions, as usually implemented, *don't*. Which is right for Xception?

> "Results... show that the absence of any non-linearity leads to both faster convergence and better final performance." — Section 4.7

No non-linearity beat both ReLU and ELU as the intermediate activation. That's the surprising result — surprising enough that the paper flags it explicitly:

> "This is a remarkable observation, since Szegedy et al. report the opposite result... for Inception modules." — Section 4.7

## Why would the *same* idea (an intermediate non-linearity) help in one architecture and hurt in another?

The paper's own hypothesis ties it back to channel *depth*, not the operation itself:

> "It may be that the depth of the intermediate feature spaces on which spatial convolutions are applied is critical to the usefulness of the non-linearity: for deep feature spaces (e.g. those found in Inception modules) the non-linearity is helpful, but for shallow ones (e.g. the 1-channel deep feature spaces of depthwise separable convolutions) it becomes harmful, possibly due to a loss of information." — Section 4.7

A depthwise convolution's intermediate space is *one channel deep, by construction* — each output channel of the 1×1 only feeds a single depthwise filter. Squeezing a ReLU's "kill anything negative" rule through a 1-channel-wide pipe throws away information that a many-channel Inception tower could afford to lose. The lesson generalizes past this one paper: a design choice that's a clear win in one architecture can be a clear loss in a structurally similar one, if the thing it's interacting with — feature-space width, here — changed underneath it.

| Ablation | Result | Section |
|---|---|---|
| Remove residual connections | Worse convergence speed *and* final accuracy | 4.6 |
| Add ReLU between depthwise/pointwise | Worse convergence speed *and* final accuracy | 4.7 |
| Add ELU between depthwise/pointwise | Also worse than no non-linearity | 4.7 |
