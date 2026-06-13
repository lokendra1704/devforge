import type { Subject } from '../types'
import scalingStoryMd from './md/sd-scaling-story.md?raw'
import buildingBlocksMd from './md/sd-building-blocks.md?raw'
import feedMd from './md/sd-feed.md?raw'

export const sysdesign: Subject = {
  id: 'sysdesign',
  title: 'System Design',
  tagline: 'Real case studies where your architecture decisions have consequences.',
  icon: '🏗️',
  accent: '#38bdf8',
  modules: [
    {
      id: 'sd-m1',
      title: 'Foundations',
      description: 'The scaling ladder and the seven building blocks, learned through a story.',
      lessons: [
        {
          id: 'sd-scaling-story',
          title: 'From dorm room to 10M users: a scaling story',
          minutes: 15,
          xp: 70,
          steps: [
            { kind: 'read', title: 'The TiffinBox story', markdown: scalingStoryMd },
            {
              kind: 'quiz',
              title: 'Did you internalize the ladder?',
              questions: [
                {
                  prompt:
                    'TiffinBox added 10 app servers behind a load balancer, and suddenly users get randomly logged out. What happened?',
                  options: [
                    'The load balancer is dropping cookies',
                    'Sessions live in each server’s memory, and requests land on different servers',
                    'Redis is evicting sessions under memory pressure',
                    'The database cannot handle 10 connection pools',
                  ],
                  answer: 1,
                  explanation:
                    'Classic stateful-server bug: server #3 knows you, server #7 has never heard of you. The fix is making app servers **stateless** — move session state to Redis or into signed tokens. Statelessness is the prerequisite for horizontal scaling.',
                },
                {
                  prompt:
                    'After adding read replicas, a user changes their delivery address, and the very next page still shows the old one. Why?',
                  options: [
                    'The cache TTL has not expired yet',
                    'The write failed silently',
                    'Replication lag — the read hit a replica that hadn’t received the update yet',
                    'The load balancer routed the write to a replica',
                  ],
                  answer: 2,
                  explanation:
                    'Replicas receive changes asynchronously, typically tens of milliseconds behind. The standard fix is **read-your-own-writes**: route a user’s reads to the primary briefly after they write, or pin by session. Naming this unprompted is a strong interview signal.',
                },
                {
                  prompt:
                    'Order placement calls: charge card, notify restaurant, send SMS, update analytics, award loyalty points — sequentially. Which work belongs behind a message queue?',
                  options: [
                    'All five steps — queue everything',
                    'Charging the card, since payments are slow',
                    'SMS, analytics, and loyalty points — non-essential to accepting the order',
                    'None — queues add unacceptable complexity here',
                  ],
                  answer: 2,
                  explanation:
                    'The split is **essential vs. eventual**. The charge must succeed synchronously (you can’t accept an unpaid order). Notification, analytics, and loyalty are valuable but tolerate seconds of delay — publish an OrderPlaced event and let consumers handle them. The API drops from 3s to ~200ms.',
                },
              ],
            },
          ],
        },
        {
          id: 'sd-building-blocks',
          title: 'The building blocks toolbox',
          minutes: 15,
          xp: 70,
          steps: [
            { kind: 'read', title: 'Seven components, with numbers', markdown: buildingBlocksMd },
            {
              kind: 'quiz',
              title: 'Back-of-envelope instincts',
              questions: [
                {
                  prompt:
                    'Your product has 10M daily active users. Roughly what peak request rate should you design the API tier for?',
                  options: [
                    '~1 million requests/sec',
                    '~100,000 requests/sec',
                    '~1,000–3,000 requests/sec',
                    '~10 requests/sec',
                  ],
                  answer: 2,
                  explanation:
                    'Rule of thumb: 1M DAU ≈ 30 req/s average, ~100–300 req/s peak → 10M DAU ≈ 1–3k req/s peak. Most candidates overestimate by 100× and design absurd fleets. Realistic numbers signal production experience.',
                },
                {
                  prompt:
                    'A flash sale starts and one product page gets 200k requests in 10 seconds. The product data is cached with a 5-minute TTL, which expires mid-sale. What is the danger?',
                  options: [
                    'The CDN will rate-limit your origin',
                    'Cache stampede — thousands of concurrent misses all hammer the database at once',
                    'Redis will run out of memory',
                    'Nothing — the next request simply repopulates the cache',
                  ],
                  answer: 1,
                  explanation:
                    'When a hot key expires, every in-flight request misses simultaneously and they all charge the DB — which may then fall over, causing more retries. Mitigations: request coalescing (one flight refreshes, rest wait), jittered TTLs, or refreshing hot keys ahead of expiry.',
                },
                {
                  prompt:
                    'Your queue consumer charges customers based on messages. The queue guarantees at-least-once delivery. What must be true of your consumer?',
                  options: [
                    'It must process messages in strict order',
                    'It must be idempotent — seeing the same message twice must not double-charge',
                    'It must acknowledge messages before processing them',
                    'Nothing special — at-least-once means exactly-once in practice',
                  ],
                  answer: 1,
                  explanation:
                    'At-least-once means duplicates WILL happen (e.g., consumer crashes after processing but before acking). Idempotency — dedupe by payment/message ID before acting — is mandatory for anything with side effects. This is a favorite senior-level probe.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'sd-m2',
      title: 'Case Studies Under Fire',
      description: 'You are the architect. Each decision has consequences.',
      lessons: [
        {
          id: 'sd-url-shortener',
          title: 'Case study: design a URL shortener',
          minutes: 20,
          xp: 110,
          steps: [
            {
              kind: 'scenario',
              title: 'You are the architect',
              scenario: {
                intro: `You have joined **lnk.ly** as the founding backend engineer. The product: paste a long URL, get back a short one like **lnk.ly/x7Kp2a**; visiting it redirects to the original.

Targets from the CEO: **100M new links/month** (~40 writes/sec) and **10B redirects/month** (~4,000 reads/sec, peaks 3×). Redirects must feel instant worldwide.

Note the shape before you start: reads outnumber writes **100:1**. Keep that ratio in mind for every decision.`,
                stages: [
                  {
                    situation: `First whiteboard session: how do you generate the short code for each URL?`,
                    question: 'Pick a short-code generation strategy.',
                    options: [
                      {
                        label: 'Hash the long URL with MD5 and take the first 7 characters',
                        quality: 'bad',
                        feedback: `Truncating a hash invites **collisions**: two different URLs land on the same 7 characters, and user B's short link silently redirects to user A's site. Now you need collision detection with retry loops on every write, and two users shortening the same URL get the same code — which breaks per-user analytics later. Hashing feels clever; it fights you forever.`,
                      },
                      {
                        label: 'Auto-increment DB counter, base62-encode the number',
                        quality: 'best',
                        feedback: `Clean and collision-free by construction. Counter 125,031,290 base62-encodes to a tidy 6-char code (62⁷ ≈ 3.5 **trillion** codes — decades of headroom). Guessable sequential IDs are fine for public links (add a random salt or use a randomized block if privacy matters). At higher write rates, hand out **ranges** of IDs to each app server (server A gets 1M–2M, server B gets 2M–3M) so the counter is not a bottleneck — this is exactly how production shorteners work.`,
                      },
                      {
                        label: 'Generate a random 7-char string, retry if it exists',
                        quality: 'ok',
                        feedback: `Workable — at 3.5T possibilities collisions are rare, so the retry loop seldom fires. Costs: every write needs an existence check, and codes are not compact. A fine answer; the counter+base62 approach gets you uniqueness for free with no check at all.`,
                      },
                    ],
                  },
                  {
                    situation: `Storage time. The schema is one tiny mapping — **short_code → long_url, owner, created_at** — but you need to hold billions of rows and serve 4k+ lookups/sec by exact key.`,
                    question: 'What is your primary datastore?',
                    options: [
                      {
                        label: 'PostgreSQL, single primary, and revisit when scale demands',
                        quality: 'ok',
                        feedback: `Defensible start — Postgres with an index on short_code easily serves thousands of point lookups/sec, and you ship this week. You will outgrow single-node storage at billions of rows, so plan the migration. In an interview, pair this with: "and because the access pattern is pure key-value with no joins or transactions, I'd move to a horizontally sharded KV store when growth demands."`,
                      },
                      {
                        label: 'A key-value NoSQL store (DynamoDB/Cassandra) keyed by short_code',
                        quality: 'best',
                        feedback: `This is the textbook case where NoSQL is *actually right* — and interviewers love hearing **why**: the access pattern is a single-key GET, there are no joins, no transactions, no complex queries, and the dataset grows unboundedly. You give up nothing you need and gain effortless horizontal scale. (Contrast with picking NoSQL for an e-commerce order system, where you'd be giving up ACID you genuinely need.)`,
                      },
                      {
                        label: 'Keep everything in Redis — RAM is fast and the records are small',
                        quality: 'bad',
                        feedback: `Redis as the *only* store means your entire dataset must fit in RAM forever (billions of rows × ~500B = terabytes of RAM — brutal money), and durability is a config-dependent afterthought. A power event can eat customer data. Redis is the cache layer here, not the system of record.`,
                      },
                    ],
                  },
                  {
                    situation: `Launch went well. Redirect latency is p50 18ms but **p99 280ms**, and the on-call channel notes the DB working hard during traffic peaks. Remember: 100 reads per write, and a tiny fraction of links (viral tweets) get a huge fraction of clicks.`,
                    question: 'How do you fix redirect latency?',
                    options: [
                      {
                        label: 'Cache-aside Redis layer for code→URL lookups with TTL',
                        quality: 'best',
                        feedback: `The 100:1 read ratio plus power-law access makes this the highest-leverage move on the board: a cache holding the top 1% of links absorbs the vast majority of reads. Mappings are immutable-ish (edits are rare), so long TTLs are safe and invalidation is easy. DB load collapses; p99 drops to single-digit ms. Bonus points for mentioning negative caching of "code does not exist" to blunt scrapers guessing codes.`,
                      },
                      {
                        label: 'Add read replicas and route lookups across them',
                        quality: 'ok',
                        feedback: `Works — spreads the read load — but it is the expensive version of the answer. Each replica is a full copy of a growing dataset, and you still pay a disk-bound query per lookup (~ms) instead of a RAM hit (~100µs). Replicas shine when queries are complex; for hot key-value reads, cache first, replicas later.`,
                      },
                      {
                        label: 'Shard the database now to spread the read load',
                        quality: 'bad',
                        feedback: `Sharding is the most invasive tool in the toolbox — operational complexity, resharding pain, cross-shard query loss — and you are reaching for it to solve a **read** problem that a $50/month cache solves outright. Shard when *write* volume or data size demands it, never as a first response to read latency.`,
                      },
                    ],
                  },
                  {
                    situation: `Growth team's new requirement: per-link analytics — clicks, country, referrer — shown on a dashboard. Redirects MUST stay fast; the CEO personally watches the latency graph.`,
                    question: 'Where does analytics recording happen?',
                    options: [
                      {
                        label: 'INSERT a click row synchronously inside the redirect handler',
                        quality: 'bad',
                        feedback: `You just put a write on the hottest read path in the company. Redirect latency jumps from ~5ms to ~25ms, and at 4k redirects/sec you've created a 4k **writes**/sec firehose into your main DB — recreating the load problem the cache just solved, but for writes. When the analytics DB hiccups, *redirects fail*. Never let optional work block essential work.`,
                      },
                      {
                        label: 'Fire-and-forget: redirect first, publish a click event to Kafka, aggregate downstream',
                        quality: 'best',
                        feedback: `Exactly. The redirect path does one cache read plus one async publish (microseconds, non-blocking) and responds. Consumers batch clicks into an analytics store (ClickHouse and friends are built for this). If analytics lags five minutes, nobody is hurt — **dashboards are allowed to be eventually consistent; redirects are not**. This essential/eventual split is the single most reusable system design instinct.`,
                      },
                      {
                        label: 'Write clicks to a separate analytics DB synchronously, so the main DB is safe',
                        quality: 'ok',
                        feedback: `You protected the main DB, but the redirect still *waits* on a synchronous write — latency and a new hard dependency remain on the hot path. The insight you are circling is that the click record does not need to exist before the redirect happens. Make it async and the problem dissolves.`,
                      },
                    ],
                  },
                  {
                    situation: `Final stage: lnk.ly is global now. Users in India complain redirects take ~350ms; your entire stack runs in a single US-East region. Physics is the enemy: India→Virginia round trip is ~200ms before your server does anything.`,
                    question: 'How do you serve global users fast?',
                    options: [
                      {
                        label: 'Run redirect servers + regional caches in multiple regions; keep writes centralized',
                        quality: 'best',
                        feedback: `The pro move, exploiting your workload's asymmetry one more time. Redirects (the 100×) are served region-locally: edge/redirect nodes in Mumbai hit a Mumbai Redis, ~20ms total. Writes (the 1×) still go to a single primary region — slightly slower link *creation* for some users, which nobody notices. Read-heavy + immutable data is the perfect candidate for geo-replication, since there is almost nothing to keep consistent.`,
                      },
                      {
                        label: 'Full multi-region active-active: every region accepts writes, data syncs both ways',
                        quality: 'ok',
                        feedback: `This works, and at extreme scale it is where you end up — but you signed up for the hardest problem in distributed systems (multi-master conflict resolution) to speed up a write path that is 1% of traffic and already acceptably fast. Senior engineers reach for the *minimum* architecture that meets the requirement. Mention this as the someday-evolution, not the move.`,
                      },
                      {
                        label: 'Bigger servers and more replicas in US-East',
                        quality: 'bad',
                        feedback: `No amount of compute in Virginia changes the speed of light. The 200ms is on the wire before your code runs. Latency from distance is solved by **moving data closer to users** — regional presence or edge caching — never by vertical scaling at the origin.`,
                      },
                    ],
                  },
                ],
                debrief: `**What you just practiced** — the five judgments that decide most system design interviews:

1. **Workload shape first.** Read:write was 100:1; nearly every right answer followed from that single number.
2. **Uniqueness by construction beats collision handling** (counter + base62 over truncated hashes).
3. **Match the datastore to the access pattern**, and justify NoSQL with the actual reason (key-value, no joins, unbounded growth).
4. **Essential vs. eventual.** Redirects are essential; analytics, dashboards, even cross-region write speed are eventual. Queues and caches are how you draw that line in infrastructure.
5. **Escalate proportionally.** Cache before replicas, replicas before shards, regional reads before active-active. The candidate who solves a read problem with a $50 cache beats the one who solves it with a six-month resharding project.

Say these five out loud in your next mock interview and watch the interviewer relax.`,
              },
            },
          ],
        },
        {
          id: 'sd-chat',
          title: 'Case study: WhatsApp-scale chat',
          minutes: 20,
          xp: 110,
          steps: [
            {
              kind: 'scenario',
              title: 'Design the messenger',
              scenario: {
                intro: `You are designing **PingMe**, a mobile messenger aiming for WhatsApp territory: 1-on-1 chats, group chats, delivery ticks (✓ sent, ✓✓ delivered, blue ✓✓ read), and "last seen".

Scale targets: **500M users, 100B messages/day** (~1.2M messages/sec average). Messages must arrive in real time when the recipient is online, and must never be lost when they are not.

The defining constraint of chat: unlike a web app, the **server must push data to clients** the instant it arrives.`,
                stages: [
                  {
                    situation: `First decision: how does a message physically reach Bob's phone the moment Alice hits send?`,
                    question: 'Pick the client-server transport.',
                    options: [
                      {
                        label: 'Clients poll an HTTP endpoint every 2 seconds for new messages',
                        quality: 'bad',
                        feedback: `500M users polling every 2s = **250M requests/sec**, ~99.9% of them returning empty — you built the world's most expensive no-op machine, plus up to 2s of message latency and constant radio wake-ups murdering phone batteries. Polling is fine for a dashboard; it is disqualifying for chat at scale.`,
                      },
                      {
                        label: 'Persistent WebSocket connection per online device',
                        quality: 'best',
                        feedback: `The industry answer. One long-lived TCP connection per online device; the server pushes messages down it instantly — millisecond delivery, near-zero idle cost (a tuned server holds **hundreds of thousands to ~1M** idle connections; WhatsApp famously ran ~1–2M per box). New problem you have accepted: connections are *state*. A "chat server" knows who is connected to it, which makes deploys and failover interesting — stage 2's problem.`,
                      },
                      {
                        label: 'HTTP long-polling: hold each request open until a message arrives',
                        quality: 'ok',
                        feedback: `The respectable 2010 answer and still a sane WebSocket fallback for hostile networks/proxies. It approximates push, but reconnect churn (every message or timeout tears down and re-establishes a request) costs throughput and battery versus a true persistent socket. Fine as plan B; not the primary at this scale.`,
                      },
                    ],
                  },
                  {
                    situation: `You chose WebSockets. Alice's socket terminates on **gateway-7**; Bob's socket lives on **gateway-42**. Alice sends "see you at 6" — somehow it must traverse from her gateway to his.`,
                    question: 'How does the message get from gateway-7 to gateway-42?',
                    options: [
                      {
                        label: 'A session registry (user → gateway) + direct gateway-to-gateway delivery, with persistence first',
                        quality: 'best',
                        feedback: `Yes — this is the canonical architecture. Flow: gateway-7 → **persist the message durably first** (it must survive even if everything else fails) → look up Bob in the session registry (a Redis map of user→gateway, updated on connect/disconnect) → forward to gateway-42 → push down Bob's socket → Bob's device acks → flip to delivered. Persist-then-deliver, never the reverse: an ack for an unpersisted message is a lie that becomes a lost message in a crash.`,
                      },
                      {
                        label: 'Broadcast every message to all gateways; each delivers to whoever it holds',
                        quality: 'bad',
                        feedback: `1.2M msg/sec × hundreds of gateways = every box drinking the entire firehose to deliver a sliver of it. Broadcast fan-out is O(servers) work per message and caps your scale at whatever one box can filter. Routing must be targeted; that is exactly what the session registry buys you.`,
                      },
                      {
                        label: 'Both gateways talk to a shared DB; recipients poll it for new rows',
                        quality: 'ok',
                        feedback: `Durable, simple, and it reinvents polling one layer down — you paid the WebSocket complexity to get push, then made delivery pull-based, adding latency and a colossal DB read load. The DB belongs in the flow (persist first!), but delivery should ride the sockets via the registry.`,
                      },
                    ],
                  },
                  {
                    situation: `Bob's phone is dead for 14 hours (airplane, no charger). During that time he receives 240 messages across 12 chats. When he reconnects, everything must arrive — in order, exactly once from his point of view.`,
                    question: 'How do offline messages work?',
                    options: [
                      {
                        label: 'Per-user persistent inbox: store messages keyed by recipient; on reconnect, client sends its last-seen sequence number and the server replays everything after it',
                        quality: 'best',
                        feedback: `This is the mechanism under every serious messenger. Each message gets a **per-conversation monotonic sequence number**; the client tracks the highest it has applied; reconnect = "give me everything after seq N" — which makes sync resumable, ordered, and idempotent (replaying twice is harmless; the client skips what it has). Push notifications meanwhile go through APNs/FCM so the human knows; the *data* flows through your inbox replay, not the notification.`,
                      },
                      {
                        label: 'Keep undelivered messages in an in-memory queue on the gateway until he returns',
                        quality: 'bad',
                        feedback: `Gateways restart on every deploy — and there goes Bob's queue, 240 messages gone, silently. Worse: when Bob reconnects he will land on a *different* gateway anyway. Messages must live in durable storage the moment they are accepted; gateway RAM is for sockets, not for data anyone cares about.`,
                      },
                      {
                        label: 'Rely on push notifications to carry the message content; the app stores whatever arrives',
                        quality: 'ok',
                        feedback: `Tempting — APNs/FCM are right there — but they are **best-effort**: notifications get throttled, collapsed, and dropped (iOS aggressively coalesces), and payloads are tiny. Production messengers use push to *wake the app*, which then syncs from the server inbox. Notification = doorbell, inbox replay = the actual delivery.`,
                      },
                    ],
                  },
                  {
                    situation: `Now groups. A class group has 200 members; a "city announcements" group has 200,000. When someone posts, every member must receive it — the fan-out question returns, wearing a chat costume.`,
                    question: 'How do you deliver group messages?',
                    options: [
                      {
                        label: 'Write one copy per recipient into each member’s inbox (fan-out on write), with a separate pull model for mega-groups',
                        quality: 'best',
                        feedback: `The hybrid again — same shape as the Instagram celebrity problem, and interviewers absolutely notice when you connect them. Normal groups (≤ a few hundred): write to each member's inbox; delivery reuses the entire 1-on-1 machinery unchanged. Mega-groups/channels: storing 200k copies per message is wasteful — store the message **once per channel**, have members' clients read from the shared channel log with their own cursors (fan-out on read). One pattern, two regimes, switched by group size.`,
                      },
                      {
                        label: 'Store one copy per group; on send, look up all online members and push to each',
                        quality: 'ok',
                        feedback: `Storage-efficient, and push-to-online works — but you have quietly dropped the offline path: members offline during the send need the message in *something* they can replay on reconnect, which drags you back to per-user inboxes or per-channel cursors anyway. The storage model and the delivery model must both handle offline; this option only solved delivery.`,
                      },
                      {
                        label: 'The sender’s client sends the message individually to each of the 200,000 members',
                        quality: 'bad',
                        feedback: `Client-side fan-out means one phone on hotel Wi-Fi uploading 200k messages — minutes of battery-melting upload for one "hello", and it leaks the member list to every client. Fan-out is server work, always. (Fun fact: early Signal group chats actually worked this way, and it capped group sizes hard.)`,
                      },
                    ],
                  },
                ],
                debrief: `**The chat-system cheat sheet you just built:**

1. **Push needs persistent connections** — WebSockets, with long-polling as fallback. Accept that connections make gateways stateful; manage that with a session registry.
2. **Persist before you confirm.** The ✓ tick is a promise; only durable storage can keep it.
3. **Sync by sequence number, not by notification.** Reconnect-and-replay from a per-user inbox gives ordering, resumability, and idempotency in one mechanism.
4. **Fan-out is a spectrum**, and group size picks the point: write-side for small groups, read-side (shared log + cursors) for huge ones — the exact same hybrid as celebrity feeds.

Notice how stages 3 and 4 of every case study start rhyming. That is not laziness in the curriculum — that is the actual secret: **there are about a dozen moves, and "design X" is choosing which six apply.**`,
              },
            },
          ],
        },
        {
          id: 'sd-feed',
          title: 'Case study: Instagram feed & the celebrity problem',
          minutes: 14,
          xp: 70,
          steps: [
            { kind: 'read', title: 'Fan-out economics', markdown: feedMd },
            {
              kind: 'quiz',
              title: 'Fan-out instincts',
              questions: [
                {
                  prompt:
                    'Why is fan-out on write the right default for a feed system, given typical social-app behavior?',
                  options: [
                    'Writes are cheaper than reads at the infrastructure level',
                    'Users read feeds far more often than they post, so doing the heavy work once at write time amortizes it across many cheap reads',
                    'It guarantees strong consistency of the feed',
                    'It avoids needing a cache',
                  ],
                  answer: 1,
                  explanation:
                    'Move the expensive work to the rarer operation. A user posts maybe once a day but opens the feed a dozen times — precomputing at write time turns each open into a single Redis read. The moment that asymmetry flips (or fan-out explodes), the answer changes — hence the celebrity carve-out.',
                },
                {
                  prompt:
                    'Your notification system handles "X liked your post" fine, but when a post goes viral with 2M likes the like-notification pipeline backs up for hours. Which lesson from this case study applies?',
                  options: [
                    'Add more queue partitions until it keeps up',
                    'This is the celebrity/skew problem: uniform pipelines break on power-law events — viral posts need a special path (e.g., aggregate "2M people liked your post" instead of 2M events)',
                    'Switch notifications from push to email',
                    'Store notifications in a relational database for reliability',
                  ],
                  answer: 1,
                  explanation:
                    'Same skew, different costume. Power-law distributions guarantee outliers that uniform designs cannot absorb; the senior move is detection + a degraded-but-sane special path (aggregation, sampling, or read-time merge). Recognizing the *pattern* across products is exactly what interviewers reward.',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
