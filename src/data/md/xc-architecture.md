If a whole network is built from one operation — depthwise separable convolutions, stacked — how complicated does the resulting architecture actually look?

> "In short, the Xception architecture is a linear stack of depthwise separable convolution layers with residual connections. This makes the architecture very easy to define and modify; it takes only 30 to 40 lines of code using a high-level library such as Keras or TensorFlow-Slim... rather unlike architectures such as Inception V2 or V3 which are far more complex to define." — Section 3

That's the payoff of pushing the Inception hypothesis to its extreme: you trade a hand-tuned multi-branch module (figure 1, four towers, three kernel sizes, a pooling path) for one repeated building block. The architecture has **36 convolutional layers**, organized into **14 modules**, and — borrowing the technique that made very deep networks trainable in the first place — every module except the first and last is wrapped in a residual (shortcut) connection.

## Three flows, one repeated middle

![Figure 5: The Xception architecture, Section 3](FIGURE:xc-fig5)

*Figure 5 (paper) — entry flow → middle flow (repeated 8×) → exit flow. Every Conv/SeparableConv layer is followed by batch normalization (omitted from the diagram for clarity).*

Read it the way you'd read a funnel:

- **Entry flow** takes a 299×299×3 image down to a 19×19×728 feature map, through a handful of regular `Conv` layers (only at the very start) and then `SeparableConv` blocks, each pair followed by `MaxPooling` with a parallel 1×1 `Conv` shortcut to match dimensions.
- **Middle flow** is the workhorse: three `SeparableConv 728, 3×3` layers wrapped in a residual connection, repeated **8 times** — no pooling, no resizing, just depth.
- **Exit flow** widens the channels (728 → 1024 → 1536 → 2048) while shrinking spatially, ends in `GlobalAveragePooling`, and hands off a 2048-dimensional vector to an optional fully-connected layer and a logistic regression head.

> **Why does only the middle flow repeat?** The entry and exit flows are doing structural work — changing spatial resolution and channel count, which needs the occasional `MaxPooling` / strided `Conv`. The middle flow's job is just to refine features at a fixed resolution, so the *same* block can repeat without modification. This separation of "resize/reshape" from "refine" is itself a kind of decoupling, in the same spirit as the channel/space split that motivated the whole architecture.

## What's *not* in the diagram

Every `SeparableConv` in the figure uses a **depth multiplier of 1** — no expansion of channels inside the depthwise step itself, all the channel-count change happens in the pointwise (1×1) part. And per the caption, every `Conv`/`SeparableConv` is followed by batch normalization, even though the boxes don't show it — Xception is, under the hood, a thoroughly modern-2016 network: BN everywhere, residual connections everywhere, depthwise separable convolutions instead of regular ones.

The architecture itself doesn't introduce a new training trick. It only changes *what operation* fills each box — and the question the rest of the paper answers is whether that swap, alone, is worth anything.
