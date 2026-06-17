## Beating MAE without touching a pixel

I-JEPA's headline claim splits into two parts, and they're not the same claim:
"better than reconstruction methods" and "scalable/efficient." Check both.

**Semantic quality (Table 1, ImageNet-1K linear probing — frozen encoder, train
only a linear head):**

| Method | Augmentations? | Arch | Epochs | Top-1 |
|---|---|---|---|---|
| MAE | No | ViT-H/14 | 1600 | 77.2 |
| CAE | No | ViT-L/16 | 1600 | 78.1 |
| data2vec | No | ViT-L/16 | 1600 | 77.3 |
| **I-JEPA** | **No** | **ViT-H/14** | **300** | **79.3** |
| **I-JEPA** | **No** | **ViT-H/16@448** | **300** | **81.1** |
| iBOT | Yes (views) | ViT-L/16 | 250 | 81.0 |
| DINO | Yes (views) | ViT-B/8 | 300 | 80.1 |

Beats every augmentation-free method, in **far fewer epochs**, and at large scale
matches view-invariance methods that *do* use hand-crafted augmentations. The
gap I-JEPA was built to close — augmentation-free methods lagging behind
invariance-based ones — is closed.

**Efficiency (Section 7, Figure 5):** here's the number that matters for anyone
who has to actually pay for the GPUs:

> "Pretraining a ViT-H/14 on ImageNet requires less than 1200 GPU hours, which is
> over 2.5× faster than a ViT-S/16 pretrained with iBOT and over 10× more
> efficient than a ViT-H/14 pretrained with MAE." — *Section 1*

A **huge** I-JEPA model needs less compute than a **small** iBOT model. Where
does that come from, given I-JEPA's forward pass is *slower* per step than MAE's?

> "I-JEPA introduces extra overhead by computing targets in representation space
> (about 7% slower time per iteration). However, since I-JEPA converges in
> roughly 5× fewer iterations, we still see significant compute savings in
> practice." — *Section 7*

```mermaid
flowchart LR
    A["I-JEPA: +7% slower per step"] --> B["but converges in ~5x fewer steps"]
    B --> C["net: 10x+ less total compute than MAE"]
```

Per-step cost is the wrong unit to compare on. The representation-space target
gives a cleaner learning signal — less wasted capacity reconstructing pixel
noise — so the model needs far fewer passes over the data to reach the same
quality.

**Beyond classification (Table 4):** view-invariance methods like DINO and iBOT
are trained to be invariant to viewpoint and color changes — which is exactly the
information object counting and depth estimation need. I-JEPA, with no such
invariance baked in, beats both of them at object counting (Clevr/Count) and
depth prediction (Clevr/Dist). Dropping the augmentation bias didn't just avoid a
weakness — it unlocked tasks where that bias actively hurt.

**Scaling (Table 5):** more pretraining data (IN1K → IN22K) and a bigger model
(ViT-H/14 → ViT-G/16) both help on semantic tasks — but the bigger model's larger
input patches *hurt* the low-level tasks. Scale isn't a uniform win; it trades off
against the granularity the task needs.
