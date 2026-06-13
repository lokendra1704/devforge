# Every inference decision is downstream of your app

A basketball coach recruits the tallest kids; a gymnastics coach recruits the shortest. Same school, opposite picks — because the *sport* dictates the choice. Inference is identical: **the way your system will be used determines how you build it.** The more constraints you can name, the better you can optimize.

Before touching a GPU, know your:

- **Model requirements** — which model(s) must you run?
- **Application interface** — how do inputs arrive, how must outputs be formatted?
- **Latency budget** — end-to-end, how fast must you respond to a user action?
- **Unit economics** — what's sane to spend per request / per user / per month?
- **Usage patterns** — how many concurrent users, and when do they show up?

Early on, you won't know these. That's fine — **use off-the-shelf APIs until you do.**

## Shared vs. dedicated

| | Shared inference (pay-per-token API) | Dedicated deployment (rent/own GPUs) |
|---|---|---|
| Cost | Zero overhead, but scales linearly with usage | Pay per GPU-hour; cheaper at high volume |
| Availability | Always on, no cold starts | You manage cold starts and uptime |
| Control | None over latency, quality, rate limits | Full control — and full responsibility |

Most products **start shared** (great while hunting for product-market fit) and **switch to dedicated** only when there's a clear business need, driven by one of three forces: **scale** (cheaper per GPU than per token), **specialization** (custom/fine-tuned model or strict latency/uptime needs), or **orchestration** (multi-model pipelines where you must kill network hops).

## Online vs. offline — the latency/throughput fork

This is *the* primary tradeoff. Lower latency = faster app. Higher throughput = cheaper at scale (fewer GPUs per user).

- **Online** (chat, code completion, voice): an impatient human is waiting. **Optimize for latency.**
- **Offline / batch** (transcribe a back catalog, embed a document corpus): no one is watching a single request. **Optimize for throughput** — each request may be slow, but the system clears far more work per hour.

The same model can serve both — e.g. Whisper in a real-time dictation app *and* a batch transcription job. If both have volume, run **two separate deployments**, each tuned for its goal.

## Consumer vs. B2B

- **Consumer**: cost-sensitive, spiky/viral traffic. Prioritize **marginal cost and flexibility**; keep latency and availability decent.
- **B2B**: better margins, steadier load, mission-critical. Prioritize **latency and uptime**; cost and scale are secondary.

And in both, **compliance can override everything**: data sovereignty (where are your GPUs allowed to be?), user privacy, and regulatory requirements can rule out otherwise-optimal infrastructure. Work with security and legal *before* you architect.
