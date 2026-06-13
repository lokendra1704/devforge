# What happens when you send a message to an LLM?

The classic systems question is *"what happens when you type a URL and hit enter?"* Here's
the inference version. You type **"Explain attention like I'm five"**, hit send, and a few
hundred milliseconds later words start streaming back. Here's every stop on that journey.

## Stop 0 — Your client fires a request

Your message leaves the browser/app as an HTTP (or WebSocket/gRPC) request: the text, plus
**inference arguments** like `temperature`, `top_p`, and `max_tokens`. It travels the
network to the inference service. Nothing model-related has happened yet — but this network
hop is already part of your **end-to-end latency**.

## Stop 1 — The infrastructure layer catches it

Before any GPU sees your request, the **infrastructure layer** routes it: a load balancer
picks a region and a replica, and the request may wait briefly in a **queue** if every
replica is busy. The router prefers a replica that can serve you fast (e.g. one that already
holds a matching prefix in cache). Then your request is handed to a model server and woven
into a **batch** — your tokens are processed alongside other users' tokens on the same GPU,
which is how throughput stays high. *(You are never alone on the GPU.)*

## Stop 2 — Tokenization (step zero)

The server applies the model's **chat template** (roles, separators, special tokens) to turn
your message into one flat string, then the **tokenizer** converts that string into a list
of integer **token IDs**. A token is ~¾ of a word; most models have a **vocabulary** of
100,000+ tokens. Crucially, **tokenization is not a neural network** — it's a deterministic
lookup between strings and IDs. Your input, any reasoning, and the output all share the
model's **context window**; `max_tokens` caps how long the answer can run.

## Stop 3 — Embedding

The first layer of the network, the **embedding layer**, maps each token ID to a vector of
hundreds–thousands of numbers. Text becomes geometry: meaning encoded as direction and
distance in a high-dimensional space. These vectors are what the model actually computes on.

## Stop 4 — Prefill: read the whole prompt at once → first token

Now the real work. Your entire prompt flows **in parallel** through the model's stack of
dozens-to-hundreds of **transformer blocks**. As it does, the model computes attention for
every input token and stores the results in the **KV cache**. This phase is **prefill**:
- It processes all input tokens together → it is **compute-bound**.
- Its duration is your **TTFT** (time to first token).
- It ends by producing the logits for the **first** output token.

*(How a transformer block actually works is the next step — here it's one box.)*

## Stop 5 — Sampling: turn numbers into a token

The model's output layer (the **LM head**) emits a **logit** for *every* token in the
vocabulary — a 100,000-long vector of raw scores. Normalize those to probabilities, then
**sample** one token:
- **Temperature** scales the logits (higher = more random, lower = safer).
- **Top-k** keeps the k most likely tokens; **top-p** keeps the smallest set summing to p.
- `temperature = 0` (or `top_k = 1`) makes it **deterministic** — always the top token.

That sampled token is **detokenized** back to text and **streamed** to you. That's your
first visible word.

## Stop 6 — Decode: one token at a time

To get the second token, the model does another forward pass — but now it only needs to
process the *one* token it just produced, reading the KV cache for all the history and
appending its own K/V. Repeat: generate, append to cache, stream. This loop is **decode**:
- It generates **one token per forward pass** → it is **memory-bandwidth-bound**.
- Its speed is your **TPS** (tokens per second) / inter-token latency.

This is why a reply can be quick to *start* (good TTFT, fast prefill) yet *trickle* out
afterward (poor TPS, slow decode) — they're two different phases with two different
bottlenecks.

## Stop 7 — Knowing when to stop

The loop continues until the model samples a special **stop token** (end-of-sequence) — or
until it hits the **context window** or `max_tokens` limit, whichever comes first.

## Stop 8 — Back to you

The streamed tokens assemble into the answer on your screen. Your **end-to-end latency** was:

```
network out  +  queue  +  prefill (TTFT)  +  decode (N tokens × per-token time)  +  network back
```

Notice how much of it is **not** the model: routing, queueing, batching, and the network are
the infrastructure layer's job. That split — runtime vs. infrastructure — is exactly why
"make the model faster" and "make the product faster" are different problems.

**One-line map:** `send → route/queue/batch → tokenize → embed → prefill (TTFT) → sample →
decode loop (TPS) → stop → stream back`. Next: open up that prefill/decode box and see what a
transformer block is actually doing.
