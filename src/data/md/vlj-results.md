# Results & Design Trade-offs

## The Controlled Comparison: Embedding vs. Token Prediction

The paper's most important result comes from a strictly controlled experiment. Both VL-JEPA (embedding prediction) and a token-space VLM baseline trained on identical:
- Vision encoder (frozen ViT-L from Perception Encoder)
- Training data
- Batch size (128)
- Learning rate schedule
- Number of iterations

The *only* difference: VL-JEPA predicts embeddings; the baseline generates tokens.

### Sample Efficiency

```
Samples seen: 500K → 5M → 15M

Video Captioning (CIDEr Score):
- 500K: VL-JEPA 1.23 vs VLM 1.35 (baseline leads slightly)
- 5M:   VL-JEPA 14.7 vs VLM 7.1  (VL-JEPA 2.1x ahead)
- 15M:  VL-JEPA 14.8 vs VLM 7.1  (gap holds)

Video Classification (Top-5 Accuracy):
- 500K: VL-JEPA 14.9% vs VLM 14.0%
- 5M:   VL-JEPA 35.3% vs VLM 25.4%
- 15M:  VL-JEPA 41.0% vs VLM 27.2%
```

**Key insight:** VL-JEPA's learning curve is *sharper* — it uses samples more efficiently. After 5M samples, it's already ahead and stays ahead even with less total training.

### Why the Difference?

Token space forces the model to fit multiple plausible targets as separate peaks. Embedding space unifies them. When training on caption data where multiple valid descriptions exist (e.g., "chef dices onions" vs. "chef cuts vegetables"), embedding space groups these as nearby points, making the learning problem easier.

### Parameter Efficiency

- VL-JEPA uses a **0.5B predictor**
- VLM baseline uses a **1B LLM**
- Total: VL-JEPA achieves *better* results with *smaller* decoder

This is doubly important for inference: VL-JEPA can optionally skip the decoder for classification/retrieval entirely, making it even faster.

## Benchmark Results

### Classification & Retrieval (Zero-shot)

| Task | VL-JEPA-Base | Best Baseline (PE-Core-G) | Margin |
|------|---|---|---|
| Video Classification (8 datasets) | 52.5% | 44.7% | +7.8% |
| Text-to-Video Retrieval (8 datasets) | 63.7% | 58.1% | +5.6% |

VL-JEPA-Base excels on motion-centric benchmarks (SSv2, EK-100, EgoExo4D) where dynamic understanding matters.

After supervised fine-tuning (VL-JEPA-SFT), performance jumps:
- Classification: 75.4% average (approaching specialist models at 77.5%)
- Retrieval: Improves across all datasets

### Visual Question Answering

VL-JEPA-SFT (1.6B parameters) competes with much larger models:

| Dataset | VL-JEPA | Strong Baseline | Model Size |
|---|---|---|---|
| GQA (compositional) | 61.5% | InstructBLIP: 49.5% | 1.6B |
| TallyQA (counting) | 69.9% | InstructBLIP: 68.0% | 1.6B |
| POPE (hallucination) | 85.7% | LLaVA-1.5-13B: 86.3% | 1.6B |
| POPEv2 | 86.3% | Qwen2-VL-7B: 87.0% | 1.6B |

Remarkable: VL-JEPA at 1.6B is competitive with 13B–72B parameter models on these tasks.

### Specialized Tasks

**World Prediction (action-state matching):**
- VL-JEPA-SFT: 65.7% (new state-of-the-art)
- Surpasses GPT-4o, Claude-3.5-sonnet, Gemini-2.0
- Single unified model (not an ensemble)

**Action Anticipation (EPIC-KITCHENS-100):**
- Outperforms V-JEPA 2 (vision-only baseline)
- At 1-second anticipation: 34.2% recall@5 vs 32.7%

**Next-Step Forecasting (COIN):**
- VL-JEPA: 56.2% (state-of-the-art)
- VideoLLM-MoD (8B): 49.7%
- ProVideLLM (8B+): 53.6%

## Selective Decoding Results

On EgoExo4D (6-minute procedural videos):

| Strategy | Decoding Operations | Quality (CIDEr) | Efficiency |
|---|---|---|---|
| Uniform (every frame) | ~1,080 | Baseline | 1.0x |
| Uniform (every 10 frames) | ~108 | Degraded | ~2x |
| Selective (variance-triggered) | ~380 | Baseline | **2.85x** |

Selective decoding is a *Pareto improvement*: same output quality, ~2.85× fewer decoder runs. This is only possible because VL-JEPA decouples prediction from generation.

## Trade-offs: Embedding vs. Token Space

### When to Use VL-JEPA

✅ **Streaming/online video** — selective decoding is native
✅ **Multi-task model** — classification, retrieval, generation all in one
✅ **Parameter budget tight** — 1.6B competes with 13B+ models
✅ **Sample efficiency matters** — sharper learning curve
✅ **Low-latency inference needed** — prediction is non-autoregressive

### When Token-Space VLMs Might Win

❌ **Pure generation quality** — specialized generative models may edge ahead on captioning alone
❌ **Extreme long-context** — token-space is more studied for very long sequences
❌ **Existing tooling** — token-space VLMs have broader ecosystem support

## The Deeper Insight

VL-JEPA demonstrates that **predicting abstract representations is often simpler and more efficient than predicting raw data.**

The same principle drives JEPA in vision (V-JEPA): instead of autoregressively predicting future *pixels*, predict future *embeddings*. Pixels are surface-level detail; embeddings capture semantics. Predicting semantics is an easier learning problem.

Extended to vision-language: instead of predicting target *tokens*, predict target *embeddings*. The embedding space is where task-relevant information lives. The token space is just the medium for communicating it.

This suggests a broader direction for multimodal learning: **learn in the representation space, then transduce to your desired output modality only when needed.**
