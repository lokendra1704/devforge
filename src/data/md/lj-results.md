# Empirical Validation: When JEPA Meets LLMs

The hypothesis is clear: combining generative and embedding-space objectives should improve LLM reasoning and generalization. But does it work in practice?

## Fine-tuning across datasets and models

The paper tests LLM-JEPA on four datasets with natural two-view structures:

| Dataset | Task | Baseline Accuracy | LLM-JEPA | Improvement |
|---------|------|------------------|----------|-------------|
| NL-RX-SYNTH | NL → Regex | 57.3% | 71.5% | +14.2pp |
| NL-RX-TURK | NL → Regex (human) | 22.5% | 30.9% | +8.4pp |
| GSM8K | Math reasoning | 32.4% | 36.4% | +4.0pp |
| Spider | NL → SQL | 47.5% | 50.6% | +3.1pp |

Notice the pattern: LLM-JEPA wins across the board, even on diverse tasks—from regex generation to SQL parsing to mathematical reasoning.

More remarkably, **these gains hold across multiple model families**: Llama 3.2, Gemma 2, OpenELM, and OLMo. This consistency suggests the approach is general, not brittle.

## Extending beyond text-code pairs

A skeptical reader might ask: this works because these datasets have clean two-view structures. What about datasets without that?

The paper then tests on QA benchmarks where views are more abstract:

- **NQ-Open**: The "Text" is a question, "Code" is the answer span. They're different lengths and different meanings—not a code/description pair.
- **HellaSwag**: The "Text" is a context, "Code" is the correct continuation. They're part of the same task, not separate domains.

Even here, LLM-JEPA achieves statistically significant improvements (~1-1.5 percentage points). This suggests the approach generalizes beyond the canonical text-code setup.

## Reasoning models

The paper also evaluates on strong reasoning models (Qwen3, DeepSeek-R1) with GSM8K (grade-school math):

| Model | Loss | Accuracy | p-value |
|-------|------|----------|---------|
| Qwen3-1.7B | Standard | 44.3% | 0.0115 |
| Qwen3-1.7B | LLM-JEPA | 45.0% | ✓ |
| DeepSeek-R1-Distill | Standard | 13.9% | 0.0396 |
| DeepSeek-R1-Distill | LLM-JEPA | 15.0% | ✓ |

All p-values < 0.05 indicate statistical significance. LLM-JEPA's benefits extend to reasoning-focused models, not just generative ones.

## Pretraining: preliminary but promising

The paper also runs pretraining experiments. On a paraphrase dataset where all five paraphrases of a sentence are treated as views:

| Downstream Task | Standard Pretraining | LLM-JEPA Pretraining | Improvement |
|-----------------|-------------------|-------------------|-------------|
| Rotten Tomatoes | 56.6% | 57.8% | +1.2pp |
| Yelp | 26.5% | 27.2% | +0.7pp |

The improvements are smaller than fine-tuning (because pretraining benefits are often subtle), but statistically significant. Notably, fine-tuning *doesn't* use the JEPA term—the benefits are purely from pretraining, suggesting the method creates better learned representations.

## Resistance to overfitting

Here's something subtle but powerful: **LLM-JEPA resists overfitting** across training epochs. Standard fine-tuning peaks and then degrades; LLM-JEPA continues improving or plateaus at a higher level. This regularization effect is consistent across epochs and across LoRA fine-tuning setups.

This hints at a deeper benefit: JEPA isn't just improving accuracy; it's creating smoother, more robust learned representations that generalize better.
