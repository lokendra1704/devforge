# Training is the recipe, inference is the meal

Every generative AI model lives a two-act life:

- **Training** — learning the model weights from data. Done once (per version), on giant clusters, measured in GPU-months and dollars.
- **Inference** — *serving* those frozen weights in production, one request at a time, forever. This is where your users actually live, and where the bill never stops.

You can train the smartest model on earth and still ship a terrible product if inference is slow, flaky, or ruinously expensive. Inference is the part the user feels.

## Classic ML inference was easy. Generative AI inference is not.

For a decade, "inference" meant running an XGBoost model on a cheap CPU and returning a number. Simple. Generative AI broke that. You can't just grab the weights, rent a GPU, and expect fast, reliable, large-scale serving. Doing it well takes **three layers that must work together**:

| Layer | Question it answers | Examples |
|---|---|---|
| **Runtime** | How fast can *one* model run on *one* GPU instance? | CUDA, PyTorch, vLLM / SGLang / TensorRT-LLM, FlashAttention |
| **Infrastructure** | How do I scale across clusters, regions, and clouds without silos or downtime? | Autoscaling, multi-cloud capacity, routing |
| **Tooling** | What abstraction do my engineers get — control vs. productivity? | APIs, observability, deploy workflows |

A blazing-fast runtime is necessary but **never sufficient**: no matter how good a single server is, it will eventually get more traffic than it can handle. That's not a CUDA problem — it's a *systems* problem solved at the infrastructure layer.

## The runtime toolbox (a preview of the whole book)

Most of inference engineering is applying a handful of performance techniques to the unique shape of generative models:

- **Batching** — weave many requests together token-by-token to lift throughput.
- **Caching** — reuse the KV cache (attention's saved work) across requests that share a prefix.
- **Quantization** — drop precision on parts of the model to unlock compute and cut memory pressure.
- **Speculation** — draft several tokens and validate them, producing more than one token per forward pass.
- **Parallelism** — spread a big model across multiple GPUs without creating new bottlenecks.
- **Disaggregation** — split inference's two phases (prefill and decode) onto independently scaling workers.

These apply to *all* modalities — not just LLMs, but vision-language, embeddings, speech, image, and video models too.

## Where this track goes

We start before the GPUs: defining your use case, budgeting latency and cost, and choosing which model to even optimize. Then we descend through models and bottlenecks → hardware → software → the techniques above → other modalities → running it all in production. First, the prerequisite mindset: **optimization is about tradeoffs, not maximizing one number.**
