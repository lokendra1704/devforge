# Training & Loss Functions

## The Embedding-Space Loss

Classical VLMs optimize a loss in *token space*:
$$\mathcal{L}_{\text{VLM}} = D(\hat{Y}, Y)$$

where $\hat{Y}$ is predicted tokens and $Y$ is ground truth tokens, compared word-by-word.

VL-JEPA optimizes a loss in *embedding space*:
$$\mathcal{L}_{\text{VL-JEPA}} = D(\hat{S}_Y, S_Y)$$

where $\hat{S}_Y$ is the predicted embedding and $S_Y$ is the target embedding (computed by the Y-Encoder).

The distance function $D$ is part of the InfoNCE loss — more on that below.

> **Why not minimize embedding distance and nothing else?** Because embeddings can collapse. Both the predictor and the target can learn to output the same embedding regardless of input. You need a regularization term to prevent this.

## InfoNCE Loss: Alignment + Uniformity

JEPA models typically optimize two objectives jointly:
1. **Alignment**: Predicted and target embeddings should be close
2. **Uniformity**: Embeddings across a batch should spread apart (avoid collapse)

The InfoNCE loss from CLIP handles both:

$$\mathcal{L}_{\text{InfoNCE}} = \text{Alignment} + \text{Uniformity}$$

Think of it this way:
- **Alignment term**: Minimizes the distance between the normalized predicted embedding and the normalized target embedding
- **Uniformity term**: Pushes embeddings in a batch apart from each other (via contrastive losses)

The paper trains the Predictor and Y-Encoder *jointly* with **bi-directional InfoNCE loss** — each can learn from the other in the shared embedding space.

## Why Embedding Space Simplifies Learning

Let's work through a concrete example. Say you ask "What will happen if I open this door?" about a video of a person standing in front of a closed door.

Valid answers in embedding space:
- "A person will walk through"
- "It will open"
- "The room beyond will be visible"

**In token space (VLM):**
```
Token 1: ["A", "It", "The"]      (orthogonal — share no tokens)
Token 2: ["person", "will", "room"]
Token 3: ["will", "be", "beyond"]
...
```

These sequences are spread across the token space with minimal overlap. The model must fit multiple disjoint peaks in a sparse, high-dimensional space.

**In embedding space (VL-JEPA):**
All three answers map to nearby points in a continuous space because they share semantics (an opening action that reveals something). The model fits a single coherent cluster instead of multiple peaks.

**Result**: Simpler learning problem → faster convergence → better sample efficiency.

## Two-Stage Training

VL-JEPA uses a two-stage strategy to build robust representations:

### Stage 1: Query-Free Pretraining (Large Scale)

Establish vision-language alignment using massive caption data.

**Data:**
- Datacomp + YFCC-100M (image-text pairs)
- Action100M (video-text pairs from HowTo100M)

**Training schedule:**
- 100k iterations on single frames (batch size 24k) → sees 2B samples
- 60k iterations on 8-frame video clips
- 10k iterations on 32-frame clips
- Total: 170k iterations over 4 weeks using 24 nodes with 8 H200 GPUs each

**Learning rate:** 5×10⁻⁵ (constant, not annealed)

**Goal:** Build a frozen X-Encoder that learns robust visual features. The model produces **VL-JEPA-Base**, evaluated on zero-shot classification and retrieval.

### Stage 2: Query-Conditioned Supervised Fine-tuning

Empower the model with VQA capabilities while maintaining pretrained alignment.

**Data mixture:**
- 25M VQA samples (questions + answers)
- 2.8M captioning samples
- 1.8M classification samples
- Downsampled pretraining data (avoid catastrophic forgetting)

**Training:**
- 83k steps with batch size 3,072
- Cosine learning rate annealing
- Total: ~2.5 days on 24 nodes

**Goal:** Adapt the model to *conditional* prediction (given a query, predict the answer). Produces **VL-JEPA-SFT**, evaluated on VQA benchmarks.

> **Why downsampling of pretraining data in stage 2?** Catastrophic forgetting — without seeing some of the original alignment data, the model can lose generalization on classification/retrieval tasks it learned in stage 1.

## Key Training Choices

### Frozen X-Encoder

The vision encoder stays frozen throughout both stages. Why?

- V-JEPA 2 already learned excellent visual features via self-supervised learning
- You're not trying to teach it new vision concepts
- Keeping it frozen reduces memory and compute
- Reduces the number of learnable parameters to 490M + 300M = 790M

### Lower Learning Rate for Y-Encoder

The Y-Encoder uses a ×0.05 learning rate multiplier (one-twentieth of the predictor's rate).

Why? Early in training, the Y-Encoder might produce poor embeddings. If it learns too fast, it can drag the predictor in the wrong direction. A slower learning rate keeps it stable while the predictor learns the prediction task.

### Bi-directional Loss

Both components learn from each other:
- Predictor learns to match the Y-Encoder's embeddings
- Y-Encoder learns what embeddings are predictable from vision

This mutual learning drives both to converge to good representations.

## The Efficiency Gains in Training

Compared to the token-space VLM baseline trained on identical data:
- **Sample efficiency**: VL-JEPA reaches higher performance much faster (14.7 vs 7.1 CIDEr after 5M samples)
- **Model parameters**: 0.5B predictor vs 1B LLM, total 1.6B vs larger VLMs
- **Inference decoupling**: Can skip the decoder entirely for classification/retrieval
