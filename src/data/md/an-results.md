# How Much Did All of This Actually Buy?

Architecture choices and training tricks are only worth discussing if they move the needle. Section 6 lays out exactly how far.

## ILSVRC-2010: a clean head-to-head

ILSVRC-2010 is the only ILSVRC year with public test labels, so it's the cleanest comparison the paper has:

| Model | Top-1 error | Top-5 error |
|---|---|---|
| Sparse coding (best 2010 entry) | 47.1% | 28.2% |
| SIFT + Fisher Vectors | 45.7% | 25.7% |
| **This CNN** | **37.5%** | **17.0%** |

That's roughly a 9–10 point absolute drop in top-5 error against the best prior approaches — a margin large enough that the paper calls it "considerably better than the previous state-of-the-art" right in the abstract. Note (Section 6, footnote): without the ten-patch test-time averaging from Section 4.1, the same network alone scores 39.0%/18.3% — so test-time augmentation itself is worth roughly 1.3 points of top-5 error.

## ILSVRC-2012: the competition entry

Test labels weren't public for 2012, so most rows below are validation error (which the paper notes tracked test error within 0.1%):

| Model | Top-1 (val) | Top-5 (val) | Top-5 (test) |
|---|---|---|---|
| SIFT + FVs (2nd place) | — | — | 26.2% |
| 1 CNN | 40.7% | 18.2% | — |
| 5 CNNs (averaged) | 38.1% | 16.4% | 16.4% |
| 1 CNN, pretrained on full ImageNet Fall 2011 | 39.0% | 16.6% | — |
| 7 CNNs (5 + 2 pretrained, averaged) | 36.7% | 15.4% | **15.3%** |

The winning entry — 15.3% top-5 test error against a 26.2% runner-up — wasn't a single network. It was an ensemble of seven CNNs, two of which had first been pretrained on the much larger (15M image, 22K category) ImageNet Fall 2011 release before fine-tuning on the 1,000-class ILSVRC subset.

> **Wait — so is the "winning" result really just one network from Sections 3–5?** Partly. A single CNN of the architecture described gets you to 18.2% top-5. The headline 15.3% number layers two more techniques on top: model averaging (five-network ensembling cuts error from 18.2% to 16.4%) and pretraining on a larger, related dataset before fine-tuning. Both are general-purpose tricks, not specific to this architecture — useful to know when reading "X% error" claims in any paper: check whether it's one model or an ensemble.

## What the kernels actually learned

Section 6.1 reports the first convolutional layer learns "a variety of frequency- and orientation-selective kernels, as well as various colored blobs" — and a consistent split emerges between the two GPUs: kernels on GPU 1 are largely color-agnostic, GPU 2's are largely color-specific. This specialization happens on every training run, regardless of random initialization, which the authors attribute to the restricted layer-3 connectivity pattern from Section 3.5 — the GPU split isn't just a memory hack, it shapes what each half of the network ends up representing.

A second qualitative check: compare images by their last-hidden-layer (4096-dim) feature vectors rather than by raw pixels. Images close in that feature space were "generally not close in L2" at the pixel level — e.g., retrieved dogs and elephants in a variety of poses — evidence the network had learned something closer to semantic similarity than to pixel-pattern matching.
