# The results: depth finally pays off

The cleanest experiment in the paper is a head-to-head where the **only**
difference is the shortcut connections — same depth, same width, same parameters,
identity shortcuts with zero-padding (option A, so *no* extra parameters).

> **Top-1 error (%), ImageNet validation, 10-crop** (Table 2)

| | plain | ResNet |
|---|---|---|
| 18 layers | 27.94 | 27.88 |
| 34 layers | **28.54** | **25.03** |

Read those two columns top to bottom:

- **Plain net:** going 18 → 34 layers makes error *worse* (27.94 → 28.54). The
  degradation problem, exactly as predicted.
- **ResNet:** going 18 → 34 layers makes error *better* (27.88 → 25.03).
  *"The situation is reversed with residual learning"* (Section 4.1).

Same architecture, same parameter budget. The shortcut is the entire difference,
and it flips depth from a liability into an asset.

## Deeper still

With bottleneck blocks they push to 152 layers and keep gaining:

> **Single-model top-1 / top-5 error (%), ImageNet** (Table 3–4)

| Model | top-1 err | top-5 err |
|---|---|---|
| VGG-16 | 28.07 | 9.33 |
| ResNet-34 | 24.19 | 7.40 |
| ResNet-50 | 22.85 | 6.71 |
| ResNet-101 | 21.75 | 6.05 |
| ResNet-152 | **21.43** | **5.71** |

*"We do not observe the degradation problem and thus enjoy significant accuracy
gains from considerably increased depth"* (Section 4.1). The 152-layer
single-model result (4.49% top-5 on the val set) beat all previous *ensemble*
results; an ensemble of ResNets hit **3.57%** top-5 and **won ILSVRC 2015**.

## Two pieces of evidence for *why* it works

**1. Residuals are small.** Figure 7 measures the std of each layer's response.
ResNet layers have *smaller* responses than plain layers, and **deeper** ResNets
have *even smaller* per-layer responses. This supports the Section 3.1 intuition:
each block makes a gentle correction, not a wholesale transformation. *"When
there are more layers, an individual layer of ResNets tends to modify the signal
less."*

**2. It's not just ImageNet.** On CIFAR-10 they train a **1202-layer** network
with *no optimization difficulty* — training error below 0.1%. The same trick
scales to absurd depth.

> **So deeper is always better?** No — here's the boundary. The 1202-layer net's
> *test* error (7.93%) is **worse** than the 110-layer net (6.43%), even though
> both train fine. The authors blame **overfitting**: *"The 1202-layer network
> may be unnecessarily large (19.4M) for this small dataset."* Residual learning
> fixes *optimization*; it does **not** repeal the need for enough data or
> regularization (Section 4.2).

## The transfer-learning bonus

Because the gains come from better learned *representations*, they carry over to
other tasks for free. Swapping VGG-16 for Res-Net-101 inside Faster R-CNN on
COCO: *"a 6.0% increase in COCO's standard metric ... which is a **28% relative
improvement** ... solely due to the learned representations"* (Section 4.3).
ResNet went on to win 1st place in ImageNet detection, localization, COCO
detection, and COCO segmentation in 2015 — all on the same backbone.
