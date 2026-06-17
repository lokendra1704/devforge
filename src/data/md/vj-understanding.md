# Understanding Motion and Appearance from Video

## Two Types of Understanding

Motion understanding: recognizing *actions* and *movements* (person gestures, water pours, object falls).
Appearance understanding: recognizing *objects, scenes, and static properties* (a cup, a kitchen, clothing).

V-JEPA 2 excels at both, especially motion.

## The Evaluation Protocol

Freeze V-JEPA 2 encoder weights, train a small **attentive probe** (4-layer transformer) on top. This measures: *how much task-relevant information is already in the frozen representation?*

We test on six tasks:

**Motion Understanding**: Something-Something v2, Diving-48, Jester
**Appearance Understanding**: Kinetics-400, COIN, ImageNet

## Results: V-JEPA 2 Dominates Motion Understanding

| Task | V-JEPA 2 1B | Other Encoders | Advantage |
|------|---|---|---|
| SSv2 (motion) | 75.3% | 69.7% (InternVideo2) | +5.6% |
| Diving-48 (motion) | 90.1% | 86.4% | +3.7% |
| Jester (motion) | 97.7% | 97.0% | +0.7% |
| Kinetics | 86.6% | 89.4% | -2.8% |
| Average | 87.5% | Best baseline 84.8% | +2.7% |

V-JEPA 2 is *motion-native*. Why? The mask-denoising objective directly incentivizes predicting future motion.
