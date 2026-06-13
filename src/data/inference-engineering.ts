import type { Subject } from '../types'
import whatIsInferenceMd from './md/ie-what-is-inference.md?raw'
import appShapeMd from './md/ie-app-shape.md?raw'
import modelSelectionMd from './md/ie-model-selection.md?raw'
import latencyThroughputMd from './md/ie-latency-throughput.md?raw'
import llmJourneyMd from './md/ie-llm-journey.md?raw'
import llmJourneyDeepMd from './md/ie-llm-journey-deep.md?raw'

export const inferenceEngineering: Subject = {
  id: 'inference-engineering',
  title: 'Inference Engineering',
  tagline:
    'What LLM inference actually costs — latency, throughput, and the judgment calls before you ever touch a GPU.',
  icon: '📈',
  accent: '#38bdf8',
  modules: [
    {
      id: 'ie-m1',
      title: 'Foundations: What Inference Really Costs',
      description:
        'Before any kernel or GPU: training vs. serving, shaping inference to your app, picking the right model, and measuring latency the way it actually hurts.',
      lessons: [
        {
          id: 'ie-what-is-inference',
          title: 'Training is the recipe, inference is the meal',
          minutes: 11,
          xp: 60,
          steps: [
            { kind: 'read', title: 'The three layers', markdown: whatIsInferenceMd },
            {
              kind: 'quiz',
              title: 'Lifecycle & layers',
              questions: [
                {
                  prompt:
                    'A teammate says “our model is great, we just trained it to SOTA accuracy — the product is basically done.” What is the most accurate pushback?',
                  options: [
                    'Accuracy is all that matters; inference is a solved CPU problem',
                    'Inference is a separate, harder phase — fast, reliable, affordable serving is what the user actually experiences, and it isn’t free',
                    'You should retrain on more data before worrying about anything else',
                    'Generative inference is just like XGBoost inference, so it’s trivial',
                  ],
                  answer: 1,
                  explanation:
                    'Training learns the weights once; inference serves them forever, one request at a time. Generative inference is complex (unlike classic ML on CPUs) and is where latency, reliability, and cost are decided — i.e. where the user lives. A great model with bad inference still ships a bad product.',
                },
                {
                  prompt:
                    'Your single vLLM server is beautifully optimized but still falls over under a traffic spike. Which layer owns this problem?',
                  options: [
                    'Runtime — write a faster CUDA kernel',
                    'Tooling — improve the developer API',
                    'Infrastructure — autoscaling, routing, and multi-cloud capacity',
                    'It’s a training problem — the model is too big',
                  ],
                  answer: 2,
                  explanation:
                    'A perfect single instance is necessary but never sufficient: it will eventually get more traffic than it can handle. That’s a systems problem solved at the infrastructure layer (autoscaling/routing/capacity), not by making one server marginally faster.',
                },
                {
                  prompt:
                    'Which runtime technique reuses the cached results of attention across requests that share a prefix?',
                  options: ['Quantization', 'Speculation', 'Caching (KV cache reuse)', 'Disaggregation'],
                  answer: 2,
                  explanation:
                    'Caching reuses the KV cache — attention’s saved K/V work — across requests with a shared prefix, skipping redundant prefill. Quantization drops precision, speculation drafts multiple tokens per pass, and disaggregation splits prefill from decode.',
                },
              ],
            },
          ],
        },
        {
          id: 'ie-app-shape',
          title: 'Shaping inference to your app',
          minutes: 14,
          xp: 80,
          steps: [
            { kind: 'read', title: 'Constraints are your friend', markdown: appShapeMd },
            {
              kind: 'scenario',
              title: 'You are the first inference hire',
              scenario: {
                intro:
                  'You just joined a startup as employee #8 to own AI. There is no inference infrastructure yet. Three decisions land on your desk over the next year. Optimize for the *business*, not for résumé-driven engineering.',
                stages: [
                  {
                    situation:
                      'Week one. The product is a brand-new AI feature with zero users and no product-market fit. Leadership wants it live this sprint.',
                    question: 'How do you serve the model?',
                    options: [
                      {
                        label: 'Rent GPUs and stand up a dedicated deployment now',
                        quality: 'bad',
                        feedback:
                          'Premature. Dedicated serving raises your monthly floor and adds engineering surface area before you even know your latency, cost, or usage requirements. You’d be optimizing a product that may not survive.',
                      },
                      {
                        label: 'Call a pay-per-token API for a strong frontier model',
                        quality: 'best',
                        feedback:
                          'Right call pre-PMF: zero overhead, no cold starts, pay only for what you use. You learn your real requirements cheaply, and switch to dedicated later when there’s a clear business need.',
                      },
                      {
                        label: 'Train your own model so you control everything',
                        quality: 'bad',
                        feedback:
                          'Wildly premature — training is GPU-months and dollars before you have a single happy user. Buy intelligence off the shelf until the product is proven.',
                      },
                    ],
                  },
                  {
                    situation:
                      'A year in, you have PMF. You now need (a) a real-time dictation feature and (b) an overnight job transcribing a 100k-episode podcast back-catalog. Both use the same Whisper model, and both have serious volume.',
                    question: 'How do you deploy Whisper?',
                    options: [
                      {
                        label: 'One deployment, tuned for low latency, serving both',
                        quality: 'bad',
                        feedback:
                          'The latency-tuned config wastes money on the batch job, which has no human waiting and should be packed for throughput. You’d burn GPUs to make a background job “fast” for no one.',
                      },
                      {
                        label: 'Two deployments: one latency-tuned for dictation, one throughput-tuned for the batch job',
                        quality: 'best',
                        feedback:
                          'Exactly. Same weights, opposite goals. Online dictation optimizes for latency (a human is waiting); the offline batch job optimizes for throughput (clear the most work per hour, per dollar). With volume on both, two deployments win.',
                      },
                      {
                        label: 'One deployment, tuned for throughput, serving both',
                        quality: 'bad',
                        feedback:
                          'Now dictation feels sluggish — an impatient user is waiting on every word. Throughput tuning is right for the batch job and wrong for the real-time one.',
                      },
                    ],
                  },
                  {
                    situation:
                      'You scale into B2B healthcare customers. Contracts mention uptime SLAs and rules about where patient data may be processed.',
                    question: 'What dominates your inference priorities now?',
                    options: [
                      {
                        label: 'Minimize marginal cost per request above all else',
                        quality: 'ok',
                        feedback:
                          'Cost always matters, but for mission-critical B2B it’s a secondary concern. Leading with cost while missing an SLA or a data-residency rule loses the customer entirely.',
                      },
                      {
                        label: 'Latency, uptime, and compliance — including data sovereignty',
                        quality: 'best',
                        feedback:
                          'Correct for B2B: better margins but high standards. Favor consistent low latency and high availability, and treat compliance (data sovereignty, privacy, regulation) as a hard constraint that can override otherwise-optimal infra.',
                      },
                      {
                        label: 'Deploy to the cheapest region available, wherever it is',
                        quality: 'bad',
                        feedback:
                          'Data sovereignty can make this illegal. In regulated industries, where your GPUs physically run is a compliance question, not a cost question — work with security and legal before architecting.',
                      },
                    ],
                  },
                ],
                debrief:
                  'The thread through all three: inference decisions are downstream of the use case. Pre-PMF, buy off the shelf. Match deployment to the online/offline split (latency vs. throughput), even for the same model. And for B2B/regulated work, latency + uptime + compliance outrank raw cost. The more constraints you can name, the better you can optimize.',
              },
            },
          ],
        },
        {
          id: 'ie-model-selection',
          title: 'Pick the smallest model that’s smart enough',
          minutes: 12,
          xp: 70,
          steps: [
            { kind: 'read', title: 'Evals, fine-tuning, distillation', markdown: modelSelectionMd },
            {
              kind: 'quiz',
              title: 'Choosing & shrinking models',
              questions: [
                {
                  prompt:
                    'You’re scaling a feature that only ever needs to translate English into SQL. Which choice best follows the model-selection principle?',
                  options: [
                    'Always use the largest frontier coding model — bigger is safer',
                    'Find or fine-tune the smallest model that still passes your evals for this narrow task',
                    'Pick whichever model has the best MMLU score',
                    'Use a rare experimental architecture for maximum quality',
                  ],
                  answer: 1,
                  explanation:
                    'All else equal, smaller = faster and cheaper, so the highest-leverage move is picking the smallest model that’s smart enough. SQL is constrained enough that a few-billion-parameter fine-tune can match a giant general model — and mainstream architectures get the best tooling support.',
                },
                {
                  prompt:
                    'A vendor brags their model tops the MMLU and SWE-bench leaderboards. Why is that, by itself, weak evidence it’s right for your product?',
                  options: [
                    'Benchmarks are always faked',
                    'Goodhart’s Law: public benchmarks get saturated and gamed, and they don’t measure your specific tasks — you need product-tailored evals',
                    'MMLU only measures speed, not intelligence',
                    'Leaderboard models can’t be fine-tuned',
                  ],
                  answer: 1,
                  explanation:
                    '“When a measure becomes a target, it ceases to be a good measure.” Labs are heavily incentivized to top benchmarks, which saturate. Benchmarks help shortlist, but there’s no substitute for evals tailored to your data and hardest cases.',
                },
                {
                  prompt:
                    'What distinguishes distillation from ordinary fine-tuning on synthetic data?',
                  options: [
                    'Distillation changes the architecture; fine-tuning does not',
                    'Distillation trains the student on the teacher’s full probability distributions, not just final input/output pairs',
                    'Distillation requires no teacher model',
                    'Fine-tuning always produces a smaller model than distillation',
                  ],
                  answer: 1,
                  explanation:
                    'Distillation has a large teacher train a smaller student to emulate its behavior using the teacher’s probability distributions (not just final answers), preserving behavior at fewer parameters. Fine-tuning adapts a model to a domain via new data while keeping the same architecture.',
                },
              ],
            },
          ],
        },
        {
          id: 'ie-latency-throughput',
          title: 'TTFT, TPS, and why you measure P99',
          minutes: 15,
          xp: 90,
          steps: [
            { kind: 'read', title: 'The metrics that matter', markdown: latencyThroughputMd },
            {
              kind: 'code',
              title: 'Compute the percentiles',
              challenge: {
                prompt:
                  'Averages hide the painful tail. Implement `percentile(samples, p)` using the **nearest-rank** method:\n\n1. Sort `samples` ascending (don’t mutate the input).\n2. Compute rank = `ceil((p / 100) * n)` where `n` is the count.\n3. Return the sample at position `rank` (1-indexed), clamped into range.\n\nSo for 10 sorted latencies, `p99` rounds up to the slowest sample — the 1-in-100 worst case you actually care about.',
                starterCode:
                  'function percentile(samples, p) {\n  // TODO: sort a copy ascending, then return the nearest-rank value for p.\n  return 0\n}',
                solution:
                  'function percentile(samples, p) {\n  const sorted = [...samples].sort((a, b) => a - b)\n  const rank = Math.ceil((p / 100) * sorted.length)\n  const idx = Math.min(Math.max(rank - 1, 0), sorted.length - 1)\n  return sorted[idx]\n}',
                tests:
                  "const lat = [50, 20, 90, 10, 40, 100, 30, 80, 60, 70]\n\ntest('p50 lands on the median-ish nearest rank', () => {\n  assertEqual(percentile(lat, 50), 50)\n})\n\ntest('p90 catches the slow tail', () => {\n  assertEqual(percentile(lat, 90), 90)\n})\n\ntest('p99 on 10 samples rounds up to the worst case', () => {\n  assertEqual(percentile(lat, 99), 100)\n})\n\ntest('does not depend on input being pre-sorted', () => {\n  assertEqual(percentile([3, 1, 2], 100), 3)\n})\n\ntest('p50 of a single sample is that sample', () => {\n  assertEqual(percentile([42], 50), 42)\n})",
              },
            },
            {
              kind: 'quiz',
              title: 'Reading the numbers right',
              questions: [
                {
                  prompt:
                    'A user complains the chatbot “takes forever to start replying,” though once it starts, text flows fast. Which metric is bad, and which phase causes it?',
                  options: [
                    'TPS is bad; caused by decode',
                    'TTFT is bad; caused by the compute-bound prefill phase',
                    'ITL is bad; caused by the network only',
                    'Total TPS is bad; caused by training',
                  ],
                  answer: 1,
                  explanation:
                    'Time to first token (TTFT) is the wait before the first token appears, set by prefill (compute-bound processing of the input). “Text flows fast after” means decode/perceived TPS is fine. The complaint is purely a TTFT problem.',
                },
                {
                  prompt:
                    'Your dashboard reports “TPS: 5,000.” Why is that number ambiguous, and what likely distinction is missing?',
                  options: [
                    'TPS always means tokens per session',
                    'TPS could be perceived TPS (per-user latency) or total TPS (whole-service throughput) — 5,000 is almost certainly total TPS, not per user',
                    'TPS is the same as TTFT',
                    'TPS only applies to image models',
                  ],
                  answer: 1,
                  explanation:
                    'TPS is overloaded: perceived TPS is a per-user latency metric (tokens/sec one user sees), while total TPS is a throughput metric for the whole service. 5,000 tokens/sec is service-wide throughput, not what a single user perceives.',
                },
                {
                  prompt:
                    'Why do inference engineers report P90/P99 latency instead of just the mean?',
                  options: [
                    'The mean is impossible to compute for latency',
                    'Response times are right-skewed; the mean hides outliers, but the tail (1-in-10, 1-in-100 slow requests) is what erodes user trust',
                    'Percentiles are always lower than the mean, so they look better',
                    'P99 measures throughput, not latency',
                  ],
                  answer: 1,
                  explanation:
                    'LLM latency is right-skewed, so the mean sits above the median and still hides the slow tail. It’s not enough for most requests to feel snappy if 1 in 10 takes seconds — P90/P99 expose and let you attack that worst-case experience.',
                },
                {
                  prompt:
                    'Inference-only latency looks great on the GPU, but end-to-end latency is slow. Where should you look first?',
                  options: [
                    'The model — quantize it harder',
                    'Infrastructure — network latency and queue time, not model performance',
                    'The tokenizer vocabulary size',
                    'Buy newer GPUs immediately',
                  ],
                  answer: 1,
                  explanation:
                    'When on-GPU inference time is fast but end-to-end (network + queue) is slow, the bottleneck is infrastructure, not the model. Turn to queueing, routing, and the network rather than more model-performance optimization.',
                },
              ],
            },
          ],
        },
        {
          id: 'ie-llm-journey',
          title: 'What happens when you send a message to an LLM?',
          minutes: 18,
          xp: 110,
          steps: [
            { kind: 'read', title: 'The journey, end to end', markdown: llmJourneyMd },
            { kind: 'read', title: 'Going deeper: inside a transformer block', markdown: llmJourneyDeepMd },
            {
              kind: 'quiz',
              title: 'Trace the request',
              questions: [
                {
                  prompt:
                    'You send a long prompt. Which statement about the tokenization step is correct?',
                  options: [
                    'The tokenizer is a small neural network that runs on the GPU before prefill',
                    'Tokenization is a deterministic string↔ID lookup against the model’s vocabulary — no neural network involved',
                    'Each word always maps to exactly one token',
                    'Tokenization happens only after the first output token is generated',
                  ],
                  answer: 1,
                  explanation:
                    'Converting text to token IDs (and back) is a plain deterministic mapping defined by the model’s vocabulary — it requires no neural network. A token is roughly ¾ of a word; common words are one token, rarer ones split into several.',
                },
                {
                  prompt:
                    'Replies take a noticeable beat to *start*, but once they begin the text streams at a normal rate. Which phase is the suspect, and what bottleneck is it?',
                  options: [
                    'Decode — it is compute-bound',
                    'Prefill — it is compute-bound and sets TTFT (time to first token)',
                    'Sampling — temperature is too high',
                    'Detokenization — converting tokens to text is slow',
                  ],
                  answer: 1,
                  explanation:
                    'A slow *start* with normal streaming afterward points at prefill, the compute-bound phase that processes the whole prompt and produces the first token. Its duration is TTFT. The normal streaming rate shows decode/TPS is fine.',
                },
                {
                  prompt:
                    'Attention is described as quadratic, yet decode runs in roughly linear time per token. What reconciles this?',
                  options: [
                    'Decode skips attention entirely',
                    'Attention compares each token to every prior token (quadratic), but the KV cache stores prior keys/values so each decode step looks them up instead of recomputing — making per-step work roughly linear',
                    'The GPU runs attention on CPU during decode',
                    'Quantization removes the quadratic term',
                  ],
                  answer: 1,
                  explanation:
                    'Attention relates the current token to all previous tokens, which is quadratic in sequence length. The KV cache — built during prefill, read and appended during decode — stores each token’s K/V once so later steps reuse them, turning per-step decode work back to roughly linear.',
                },
                {
                  prompt: 'Setting temperature to 0 (or top_k to 1) does what to token selection?',
                  options: [
                    'Makes it deterministic — always pick the highest-probability token',
                    'Makes it maximally random',
                    'Disables the KV cache',
                    'Skips the prefill phase',
                  ],
                  answer: 0,
                  explanation:
                    'Sampling picks a token from the normalized logits. Lower temperature/top-k/top-p constrain the model to likely tokens; temperature 0 or top_k 1 collapses that to always choosing the single most probable token — fully deterministic output.',
                },
                {
                  prompt:
                    'Why is decode memory-bandwidth-bound while prefill is compute-bound?',
                  options: [
                    'Decode runs on more GPU cores than prefill',
                    'Prefill loads all weights once and runs big matmuls over the whole prompt (high ops-per-byte); decode reloads the full model’s weights to emit a single token via cheap vector-matrix mults (low ops-per-byte)',
                    'Prefill skips attention, so it has nothing to load',
                    'Decode writes tokens to disk between steps',
                  ],
                  answer: 1,
                  explanation:
                    'Arithmetic intensity = ops ÷ bytes moved. Prefill amortizes one weight load across many tokens of matmul → high intensity → compute-bound. Decode moves the entire weight set to produce one token → low intensity → memory-bound. Batching raises decode’s intensity by sharing each weight load across requests.',
                },
                {
                  prompt:
                    'An MoE model like Qwen3-235B-A22B has 235B total parameters. Roughly how many are active for a single token, and why?',
                  options: [
                    'All 235B — every parameter runs on every token',
                    '~22B — a router activates only a few experts per layer (MoE sparsity)',
                    'Exactly 8B — MoE caps active parameters at 8B',
                    '235B during prefill, 0 during decode',
                  ],
                  answer: 1,
                  explanation:
                    'MoE replaces one giant FFN with many expert matrices; a small router activates a few per layer per token (here 8 of 128 experts across 94 layers ≈ 22B active). Note: under batched serving, different requests wake different experts, so nearly all parameters end up active across the batch.',
                },
              ],
            },
            {
              kind: 'scenario',
              title: 'Where’s the bottleneck?',
              scenario: {
                intro:
                  'You run a streaming chat product. Three separate on-call pages come in. For each, trace the request’s journey and point at the stage actually at fault — the fix depends entirely on getting this right.',
                stages: [
                  {
                    situation:
                      'P99 time-to-first-token has spiked this week. Prompts have gotten much longer (users paste big documents now). Once generation starts, tokens stream at the usual rate.',
                    question: 'Where is the bottleneck?',
                    options: [
                      {
                        label: 'Prefill — compute-bound and scales with prompt length',
                        quality: 'best',
                        feedback:
                          'Right. Prefill processes the whole input in parallel and is compute-bound; longer prompts mean more first-token compute, so TTFT climbs. The normal streaming rate confirms decode is fine.',
                      },
                      {
                        label: 'Decode — tokens are generated too slowly',
                        quality: 'bad',
                        feedback:
                          'Decode/TPS is the *streaming* rate, which you said is normal. The pain is the wait *before* the first token — that’s prefill, not decode.',
                      },
                      {
                        label: 'The network is dropping packets',
                        quality: 'bad',
                        feedback:
                          'A network fault wouldn’t correlate with prompt length. The symptom tracks input size, which points squarely at compute-bound prefill.',
                      },
                    ],
                  },
                  {
                    situation:
                      'TTFT is fine, but under heavy load everyone’s tokens-per-second drops, and the GPUs report memory bandwidth saturated while compute sits partly idle.',
                    question: 'What’s the best lever?',
                    options: [
                      {
                        label: 'Increase batching so requests share each weight load',
                        quality: 'best',
                        feedback:
                          'Exactly. Decode is memory-bound: each token reloads the weights. Batching does more compute per byte moved, pulling decode back toward the compute ceiling and lifting total TPS.',
                      },
                      {
                        label: 'Turn on prefix caching',
                        quality: 'ok',
                        feedback:
                          'Prefix caching skips prefill for shared prefixes — it helps TTFT, not the per-token bandwidth limit that’s throttling decode here.',
                      },
                      {
                        label: 'Buy a faster network link',
                        quality: 'bad',
                        feedback:
                          'The saturated resource is on-GPU memory bandwidth during decode, not the network. A faster link changes nothing here.',
                      },
                    ],
                  },
                  {
                    situation:
                      'On-GPU metrics look great — both prefill and decode times are low — yet users in another region report multi-second total response times.',
                    question: 'Where do you look first?',
                    options: [
                      {
                        label: 'Infrastructure — routing, queueing, and geo/network latency',
                        quality: 'best',
                        feedback:
                          'Correct. Inference-only time is fast but end-to-end is slow → the gap is the infrastructure layer: queue time, routing, and the network between the user and the GPUs. Run inference closer to those users.',
                      },
                      {
                        label: 'Rewrite the attention kernel for speed',
                        quality: 'bad',
                        feedback:
                          'On-GPU time is already low — the model runtime isn’t the problem. Optimizing kernels won’t touch network/queue latency.',
                      },
                      {
                        label: 'Quantize the model to shrink it',
                        quality: 'bad',
                        feedback:
                          'Quantization speeds up inference, which is already fast here. It does nothing for the end-to-end latency added outside the GPU.',
                      },
                    ],
                  },
                ],
                debrief:
                  'Same map every time: send → route/queue/batch → tokenize → embed → prefill (TTFT) → sample → decode (TPS) → stream back. Slow first token → prefill (compute). Slow streaming → decode (memory; reach for batching). Fast on-GPU but slow for the user → infrastructure, not the model. Naming the stage tells you which lever to pull.',
              },
            },
          ],
        },
        {
          id: 'ie-foundations-glossary',
          title: 'Key terms: a foundations vocabulary check',
          minutes: 8,
          xp: 50,
          steps: [
            {
              kind: 'quiz',
              title: 'Definition drill',
              questions: [
                {
                  prompt: 'Inference, in one line, is:',
                  options: [
                    'Learning model weights from data',
                    'Serving AI models in production',
                    'Compressing a model with quantization',
                    'Measuring a model on MMLU',
                  ],
                  answer: 1,
                  explanation:
                    'Inference is serving AI models in production — the second phase of the lifecycle. Learning weights from data is training.',
                },
                {
                  prompt: '“Throughput” refers to:',
                  options: [
                    'How long a single user waits for the first token',
                    'Total work per unit time, e.g. total tokens per second across the service',
                    'The number of parameters in the model',
                    'The time between two consecutive tokens for one user',
                  ],
                  answer: 1,
                  explanation:
                    'Throughput is total work per unit time (e.g. total TPS for the whole service). Per-user wait is latency; the gap between tokens is inter-token latency.',
                },
                {
                  prompt: 'Which best describes the prefill phase of LLM inference?',
                  options: [
                    'The memory-bound phase that emits one token per forward pass',
                    'The compute-bound phase that processes the input sequence and builds the KV cache',
                    'The phase where weights are learned',
                    'The phase that compresses the KV cache',
                  ],
                  answer: 1,
                  explanation:
                    'Prefill is compute-bound: it processes the input and builds the KV cache, and it sets TTFT. Decode is the memory-bound loop that emits one token per forward pass.',
                },
                {
                  prompt: 'Inter-token latency (ITL) of 10 ms corresponds to roughly what perceived TPS?',
                  options: ['10 tokens/sec', '50 tokens/sec', '100 tokens/sec', '1,000 tokens/sec'],
                  answer: 2,
                  explanation:
                    'ITL is the time between generated tokens, so perceived TPS = 1000 ms / 10 ms = 100 tokens/sec per user.',
                },
                {
                  prompt: '“Online inference” is best optimized for ____, while “offline inference” is best optimized for ____.',
                  options: [
                    'throughput; latency',
                    'latency; throughput',
                    'cost; quality',
                    'quality; cost',
                  ],
                  answer: 1,
                  explanation:
                    'Online (real-time, a user waiting) optimizes for latency. Offline/batch jobs optimize for throughput — clearing the most work per hour and dollar.',
                },
                {
                  prompt: 'The KV cache exists primarily to:',
                  options: [
                    'Store model weights on disk',
                    'Avoid recomputing attention by caching K/V tensors, turning attention from quadratic- to linear-time across the generation',
                    'Hold the tokenizer vocabulary',
                    'Replace the need for a GPU',
                  ],
                  answer: 1,
                  explanation:
                    'The KV cache stores per-token K/V tensors so attention isn’t recomputed each step, turning the generation loop’s attention cost from quadratic toward linear. Reusing it across shared prefixes (prefix caching) cuts TTFT.',
                },
                {
                  prompt: 'A “foundation model” is:',
                  options: [
                    'A model trained on broad data that serves as a base for many downstream tasks (e.g. GPT, Claude, Llama)',
                    'A model that can only run on CPUs',
                    'A model produced exclusively by distillation',
                    'Any model under one billion parameters',
                  ],
                  answer: 0,
                  explanation:
                    'Foundation models are broadly-trained bases (GPT, Claude, Llama) typically fine-tuned or used directly via prompting for downstream tasks.',
                },
                {
                  prompt: 'Latency percentiles (P50/P90/P95/P99) are used because:',
                  options: [
                    'They are easier to compute than the mean',
                    'They reveal both typical and worst-case experience, since inference times are right-skewed and the mean hides outliers',
                    'They measure model intelligence',
                    'They only matter for offline batch jobs',
                  ],
                  answer: 1,
                  explanation:
                    'Percentiles expose the skewed tail: P99 means 1 in 100 requests is slower. The mean alone hides those outliers that disproportionately hurt user trust.',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
