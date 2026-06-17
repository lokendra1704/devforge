## Two design choices the paper proves were load-bearing

I-JEPA has two non-obvious design decisions: predicting in *representation*
space (not pixels), and the specific *multi-block masking* strategy. Section 9
isolates each one to show it's actually doing work, not just an arbitrary choice
that happened to ship.

**Ablation 1 — representation space vs. pixel space (Table 7).** Keep everything
else fixed, swap only the loss target:

| Target | Arch | Epochs | Top-1 (1% ImageNet) |
|---|---|---|---|
| Target-encoder output (representation) | ViT-L/16 | 500 | **66.9** |
| Raw pixels | ViT-L/16 | 800 | 40.7 |

Same architecture, *more* epochs for the pixel version, and it still loses by 26
points. This is the paper's strongest single piece of evidence that "predict in
representation space" isn't a minor tweak — it's the mechanism the entire result
depends on.

**Ablation 2 — masking strategy (Table 6).** Multi-block masking (4 small
semantic-scale targets + one large, spatially-distributed context) is compared
against three alternatives:

| Strategy | Targets | Context | Top-1 |
|---|---|---|---|
| **Multi-block (proposed)** | 4 small blocks (scale 0.15–0.2) | 1 large block minus overlap | **54.2** |
| Rasterized | 3 quadrants | 1 quadrant | 15.5 |
| Block | 1 large block (scale 0.6) | image complement | 20.2 |
| Random | random scattered patches | image complement | 17.6 |

The gap is enormous — 54.2 vs. the next-best 20.2. Random and block masking give
the context encoder an *easy* job: predict from a context that's basically a
mirror image of the target. Multi-block masking forces a genuinely hard,
information-poor prediction — and that difficulty is what pushes the model
toward semantic, rather than copy-paste, representations.

> **Wait — isn't a harder task always better?** Not necessarily. Rasterized
> masking is also "hard" (predict 3/4 of the image from 1/4) but scores *worst*
> of all four — because the context block is small and spatially concentrated in
> one corner, not informative about the rest of the image. The lesson isn't
> "harder is better," it's "harder *and informative* is better." Multi-block
> masking is the only strategy that is both.

**Predictor visualization (Section 8, Figure 6).** To check *what* the predictor
actually learned, the authors freeze it and train a separate decoder (the RCDM
framework) to turn its average-pooled output back into pixels — purely a
diagnostic, not part of pretraining. Across different random seeds, the
*common* features in the decoded samples are what the predictor's
representation actually encodes; what *varies* across seeds is what it discarded.
Result: the predictor reliably reconstructs object pose and high-level parts
(the back of a bird, the top of a car) but discards exact texture and background
— direct visual evidence that the representation is semantic, not pixel-precise.
