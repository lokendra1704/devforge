# Going deeper: inside a transformer block

Optional, but this is where the bottlenecks come from. In the journey, "prefill" and
"decode" were single boxes. Open them up.

## The Lego bricks: matmul + a nonlinearity

The fundamental operation in a neural network is a **matmul** — multiply an input vector by a
weight matrix and add a bias (`y = Wx + b`). That's a **linear layer**. But stacking linear
layers is pointless: two matmuls in a row collapse into one (the product of the matrices).
So networks insert a nonlinear **activation function** (ReLU, SiLU, SwiGLU — roughly "zero
out negatives, keep positives") between layers. That broken linearity is what lets depth
actually add capacity.

## The shape of an LLM

```
tokens → [embedding layer] → [transformer block] × dozens–hundreds → [LM head] → logits
```

The **embedding layer** turns token IDs into vectors. The **LM head** (output layer) turns
the final hidden state into a logit per vocabulary token. Everything interesting happens in
the stack of **transformer blocks** in between.

## Inside one transformer block

Each block has three kinds of sublayer:

| Sublayer | What it does | Share of weights |
|---|---|---|
| **Feed-forward (FFN)** | A small MLP applied to each position | **Most** of the model's weights |
| **Attention** | Relates each token to the others | Second-largest; the *expensive* op |
| **Normalization** | Keeps activations well-scaled | A rounding error |

So the FFN holds the most *parameters*, but **attention** is the costly *operation* for
inference — which is why almost all inference optimization targets it.

## Attention: scaled dot-product, Q/K/V

Attention lets a token look at other tokens. In *"I wrote a book because I thought it would
be easy, but it was hard"*, attention is how the model knows "it" refers to writing a book.
It takes three inputs:
- **Q (query)** — the token being generated/updated.
- **K (keys)** — representations of all prior tokens.
- **V (values)** — the values pulled from those prior tokens.

The token's query is compared against every key, the scores are softmaxed into weights, and
those weights mix the values. Attention is **multi-head** — several of these run in parallel
per block, each learning a different kind of relationship (subject–verb, co-reference, …).
LLMs use **self-attention** with a **causal mask** so a token can only see tokens *before*
it — it can't peek at the future it's trying to predict.

Because each token attends to **every previous token**, attention is **quadratic** in
sequence length. The **KV cache** rescues decode: by storing each token's K and V the first
time, later steps *look them up* instead of recomputing — turning per-step work from
quadratic back to roughly **linear**. The cache is **built during prefill, read and appended
during decode, and lives in GPU VRAM**. (Optimizing it — FlashAttention to cut memory
traffic, PagedAttention to page it like virtual memory — is a whole later topic.)

## Mixture of Experts (MoE): sparsity

Instead of one giant FFN matrix, an **MoE** model has many smaller **expert** matrices, and a
tiny **router** activates only a few per layer per token. Qwen3-235B-A22B has **235B total
parameters but activates ~22B per token** (the router picks 8 of 128 experts at each of 94
layers). Great for single-request local inference — but in **batched** production serving,
different requests wake different experts, so expect nearly all parameters to be active at
once.

## Why the bottleneck flips: prefill vs. decode

This is the payoff. A GPU has two resources: **compute** (FLOPS) and **memory bandwidth**
(bytes/sec). An operation is limited by whichever it exhausts first, measured by **arithmetic
intensity** = operations ÷ bytes moved, compared against the GPU's **ops:byte ratio** (an
H100 in FP16 is ~295 ops/byte).

- **Prefill** processes the whole prompt at once: weights are loaded **once**, then huge
  matrix-matrix multiplies run over many tokens. Lots of compute per byte → **high
  arithmetic intensity → compute-bound** → sets TTFT.
- **Decode** generates **one token per pass**: the *entire* model's weights must be reloaded
  to produce a single token via cheap vector-matrix multiplies. Few ops per byte → **low
  arithmetic intensity → memory-bound** → sets TPS.

That's the mechanical reason prefill and decode are optimized differently — and why
**batching** is the key decode lever: running many requests' tokens together does more
compute for the same weight-loading, dragging memory-bound decode back toward the compute
ceiling.

**Takeaway:** prefill = compute-bound matmul over the whole prompt (TTFT); decode =
memory-bound, weight-reloading, one-token-at-a-time loop (TPS); attention is the expensive
operation in both, and the KV cache is what keeps it tractable.
