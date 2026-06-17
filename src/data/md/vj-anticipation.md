# Predicting Human Action: Anticipation from Context

## The Anticipation Task

Given context video, predict the action that starts 1 second in the future.

Why is this hard? Multiple futures are plausible. Subtle context clues matter.

## Epic-Kitchens Dataset (EK100)

100 hours of egocentric cooking videos.
3,568 unique action labels (verb + noun): "wash sink", "cut tomato", etc.
97 verb categories, 300 noun categories.
Metric: mean-class recall-at-5.

## V-JEPA 2 Results

| Model | Verb | Noun | Action |
|-------|------|------|--------|
| PlausiVL (8B) | 55.6 | 54.2 | 27.6 |
| V-JEPA 2 ViT-L (300M) | 57.8 | 53.8 | 32.7 |
| V-JEPA 2 ViT-H (600M) | 59.2 | 54.6 | 36.5 |
| V-JEPA 2 ViT-g (1B) | 61.2 | 55.7 | 38.0 |
| V-JEPA 2 ViT-g384 (1B, higher res) | 63.6 | 57.1 | **39.7** |

**44% relative improvement** over prior SOTA, even with 8× fewer parameters.

## Why Motion Understanding Transfers

Action anticipation is solved by understanding motion. A model that learns motion dynamics can extrapolate what's likely next.

V-JEPA 2 pretraining (predicting future frames) directly optimizes for motion → action anticipation transfers naturally.

## Limitations

1. **Fixed time horizon**: 1-second anticipation; longer horizons degrade.
2. **Closed vocabulary**: EK100 is kitchen-only.
3. **Object confusion**: Sometimes confuses similar objects.
