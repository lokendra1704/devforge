# Did it work? The numbers

Three scheduling changes, no change to the answer. Here's what they bought, measured on an A100 80GB SXM4.

## Attention kernel speedups

> "FlashAttention-2 is 1.7-3.0× faster than FlashAttention, 1.3-2.5× faster than FlashAttention in Triton, and 3-10× faster than a standard attention implementation." — *Section 4*

The headline efficiency number is the one that motivated the whole paper — recall FlashAttention stalled at 25–40% of peak:

| Metric | FlashAttention | FlashAttention-2 |
|---|---|---|
| Forward pass, % of A100 peak | 30–50% | **up to 73%** |
| Backward pass, % of A100 peak | 25–35% | **up to 63%** |
| Peak measured throughput | — | **230 TFLOPs/s** |

## End-to-end training (the number that pays the bills)

Training GPT-style models on 8×A100, FlashAttention-2 reaches **up to 225 TFLOPs/s per GPU = 72% model FLOPs utilization (MFU)**. The longer the context, the bigger the win — because long context is exactly the low-occupancy regime tweak 2 was designed to rescue:

| Model | Without FlashAttention | FlashAttention | FlashAttention-2 |
|---|---|---|---|
| GPT3-1.3B, 2k context | 142 TFLOPs/s | 189 | **196** |
| GPT3-1.3B, 8k context | 72 TFLOPs/s | 170 | **220** |
| GPT3-2.7B, 8k context | 80 TFLOPs/s | 175 | **225** |

> Notice the 8k rows: without FlashAttention, going from 2k→8k context *halves* throughput (142→72). With FlashAttention-2, longer context barely costs anything (196→220, *up*). That's the practical meaning of "linear instead of quadratic."

## How the FLOPs are counted

The paper gives the exact formula for attention's forward-pass FLOPs — you'll implement it in the next step:

> "To calculate the FLOPs of the forward pass, we use: 4 · seqlen² · head dimension · number of heads. With causal mask, we divide this number by 2 ... To get the FLOPs of the backward pass, we multiply the forward pass FLOPs by 2.5." — *Section 4.1*

The backward pass is 2.5× the forward because it has **5 matmuls** (vs. 2 in the forward) due to recomputation. So total forward+backward = 3.5 × forward.

## The limits — read the fine print

- **It's a scheduling win, not a new model.** The output is identical to standard attention. It buys speed and memory, not accuracy.
- **Block sizes are hand-tuned**, only 4 sensible choices, per head dimension — auto-tuning is left to future work.
- **A100-specific.** The same code on H100 hits ~335 TFLOPs/s but *without* using new H100 features (TMA, 4th-gen Tensor Cores, FP8) — the authors expect another 1.5–2× there once those are exploited. The kernel isn't automatically optimal on new hardware.

Next: put the FLOPs formula to work and compute MFU yourself.
