# TTFT, TPS, and why you obsess over P99

LLM performance lives in two headline numbers:

- **TTFT — time to first token.** With streaming output, how long until the user sees the *first* token? TTFT is set by **prefill**, the compute-bound phase that processes the input. Lower TTFT = better latency.
- **TPS — tokens per second.** After the first token, how fast do the rest arrive? TPS is set by **decode**, the bandwidth-bound phase. Higher TPS = better latency.

## The two phases behind those numbers: prefill and decode

Those two metrics map onto the two phases every autoregressive LLM request runs through:

- **Prefill** — the model processes your *entire* input prompt in one parallel pass and builds the **KV cache** (the per-token key/value tensors attention needs). It's **compute-bound** — lots of matmul over many tokens at once — and its duration sets **TTFT**.
- **Decode** — the model then emits output *one token at a time*, each step reading the whole KV cache and appending to it. It's **memory-bandwidth-bound** — the bottleneck is moving weights and the growing cache, not arithmetic — and its speed sets **TPS**.

The **KV cache** is what makes decode affordable: by storing each token's attention keys and values, the model never recomputes attention over the whole sequence from scratch — turning what would be **quadratic-time** work into roughly **linear** per-token work. (Reusing it across requests that share a prefix — *prefix caching* — is a big TTFT win we'll meet later.)

This split is why prefill and decode are optimized so differently, and why a request can be quick to *start* (good TTFT) yet slow to *stream* (poor TPS), or the reverse.

## TPS is ambiguous — say which one you mean

"TPS" gets overloaded. Be specific:

- **Perceived TPS** — tokens/second *per user* after the first token. A **latency** metric. (This is what people usually mean.)
- **Total TPS** — tokens/second across the *entire service*. A **throughput** metric.
- **Inter-token latency (ITL)** — the gap between consecutive tokens. ITL converts directly: 10 ms ITL = 100 tokens/sec/user.

TTFT and perceived TPS matter for **streamed, user-facing** output (chatbots). For non-streamed work — a tool call inside an agent — individual tokens are useless, so you measure **total response time** instead.

## Averages lie. Measure percentiles.

LLM response times are a **right-skewed distribution**: most requests cluster near a mode, but outliers run far longer (which is why the *mean* sits above the *median*). Looking at the average alone hides the pain. It's not good enough for most requests to feel snappy if **1 in 10 takes several seconds** — those outliers destroy user trust.

So engineers report latency at **percentiles**:

| Percentile | Meaning | How often it's worse |
|---|---|---|
| **P50** | median latency | 1 in 2 requests is slower |
| **P90** | 90th percentile | 1 in 10 is slower |
| **P95** | 95th percentile | 1 in 20 is slower |
| **P99** | 99th percentile | 1 in 100 is slower |

Driving down the average matters, but great performance work especially attacks **P90/P99** — the tail is where reliability is won or lost.

## Inference-only vs. end-to-end

The other axis: are you measuring **inference time** (on-GPU token generation) or **end-to-end** (including network latency and queue time)?

You want both. Inference time tells you how well your *model performance* work is going; end-to-end tells you what the *user actually experiences*. The diagnostic rule: **when inference time is fast but end-to-end is slow, the problem is infrastructure, not the model** — go look at queueing, routing, and the network, not your kernels.
