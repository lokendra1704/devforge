# Video Question Answering with Language: VQA Alignment

## From Representation to Language

Freeze V-JEPA 2 encoder. Connect it to a large language model with a learnable projector. Train the full system to answer open-ended questions about videos.

This tests whether the visual representations can carry complex semantic meaning—not just classification, but reasoning, physics understanding, temporal awareness.

## The Key Finding

Most vision-language models (CLIP, SigLIP, Perception Encoder) are trained on billions of image-caption pairs. V-JEPA 2 has **zero language supervision** during pretraining—only mask-denoising.

Yet V-JEPA 2 **outperforms language-supervised encoders** on temporal and physics-understanding benchmarks.

**Why?** Language-supervised encoders optimize for semantic similarity to captions (appearance-biased). Motion-supervised encoders (V-JEPA 2) learn dynamics, which is more relevant for temporal reasoning and physics.

## VQA Benchmarks

Evaluated on PerceptionTest, MVP, TempCompass, TemporalBench, TOMATO, MVBench.

V-JEPA 2 dominates **temporal understanding** (TempCompass, TemporalBench, TOMATO) and **physics reasoning** (MVP).

## Scaling Data Improves Language Alignment

Initial: 18M image/video-text pairs.
Full: 88.5M pairs (4.7×).

Scaling from 18M to 88.5M:
- PerceptionTest: 82.7% → 84.0% (+1.3%)
- MVP: 39.7 → 44.5 (+4.8 points)
- TemporalBench: 28.3% → 36.7% (+8.4 points)

The bottleneck is alignment data, not the encoder.

## Why This Matters

A good representation should transfer. VQA tests compositional reasoning (objects, spatial relationships, causal chains)—different from classification. V-JEPA 2 excels at both, suggesting genuine world understanding.
