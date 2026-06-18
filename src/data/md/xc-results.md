Same number of parameters. Same training setup (tuned for the *other* model, not even Xception). If Xception wins anyway, where could the improvement possibly come from?

> "Since the Xception architecture has the same number of parameters as Inception V3, the performance gains are not due to increased capacity but rather to a more efficient use of model parameters." — Abstract

The paper tests this on two datasets that stress different things: **ImageNet** (1000 classes, the benchmark Inception V3 was tuned for) and **JFT** (Google's internal dataset, 350M images, 17,000 classes — evaluated via an auxiliary set called FastEval14k with a metric called MAP@100). The asymmetry matters: Inception V3 had a home-field advantage on ImageNet that it never had on JFT.

## ImageNet: a close, controlled comparison

| Model | Top-1 accuracy | Top-5 accuracy |
|---|---|---|
| VGG-16 | 0.715 | 0.901 |
| ResNet-152 | 0.770 | 0.933 |
| Inception V3 | 0.782 | 0.941 |
| **Xception** | **0.790** | **0.945** |

Xception edges out Inception V3 — a modest gain, on the dataset Inception V3 was designed and tuned for.

## JFT: where the gap opens up

| Model | FastEval14k MAP@100 |
|---|---|
| Inception V3 — no FC layers | 6.36 |
| **Xception — no FC layers** | **6.70** |
| Inception V3 — with FC layers | 6.50 |
| **Xception — with FC layers** | **6.78** |

> "On JFT, Xception shows a 4.3% relative improvement on the FastEval14k MAP@100 metric." — Section 4.5.1

The paper's own explanation for why the *ImageNet* gain is small but the *JFT* gain is large: "Inception V3 was developed with a focus on ImageNet and may thus be by design over-fit to this specific task," while neither model was ever tuned for JFT. Take away Inception V3's home turf, and the more efficient parameter usage shows up more clearly.

## Same size, comparable speed

| Model | Parameter count | Steps/second |
|---|---|---|
| Inception V3 | 23,626,728 | 31 |
| Xception | 22,855,952 | 28 |

The two networks are within 3.5% of each other in parameter count — confirming the "same capacity" premise the whole comparison rests on — while Xception trains modestly slower per step. The paper attributes this gap to under-optimized depthwise convolution kernels at the time, not to anything fundamental about the operation: "We expect that engineering optimizations at the level of the depthwise convolution operations can make Xception faster than Inception V3 in the near future" (Section 4.5.2).

> **Wait — if the parameter counts are nearly identical, what's actually different?** Same total budget, spent differently. Inception V3 spends some of its parameters on the *structure* of multi-branch towers (1×1 + 3×3 + 5×5 + pooling, repeated with hand-tuned tower widths). Xception spends its budget purely on depthwise separable layers stacked uniformly. The accuracy gap is the paper's evidence that the *uniform, fully-decoupled* spending is the more efficient one.
