import type { Subject } from '../types'
import scalingMd from './md/sdi-scaling.md?raw'
import estimationMd from './md/sdi-estimation.md?raw'
import frameworkMd from './md/sdi-framework.md?raw'
import rateLimiterMd from './md/sdi-rate-limiter.md?raw'
import consistentHashingMd from './md/sdi-consistent-hashing.md?raw'
import kvStoreMd from './md/sdi-kv-store.md?raw'
import uniqueIdMd from './md/sdi-unique-id.md?raw'

export const systemDesignInterview: Subject = {
  id: 'system-design-interview',
  title: 'Sys Design Interview',
  tagline: 'Alex Xu’s Insider’s Guide: climb the scaling ladder, estimate on a napkin, and run the 4-step framework.',
  icon: '🧭',
  accent: '#8b5cf6',
  modules: [
    {
      id: 'sdi-m1',
      title: 'Interview Foundations',
      description:
        'The three chapters every design rests on: the zero-to-millions scaling ladder, back-of-the-envelope math, and the 4-step interview framework.',
      lessons: [
        {
          id: 'sdi-scaling',
          title: 'Scale from zero to millions of users',
          minutes: 16,
          xp: 80,
          steps: [
            { kind: 'read', title: 'The scaling ladder', markdown: scalingMd },
            {
              kind: 'quiz',
              title: 'Each move fixes the last one’s flaw',
              questions: [
                {
                  prompt:
                    'You add 10 app servers behind a load balancer and users start getting randomly logged out. What broke?',
                  options: [
                    'The load balancer is corrupting cookies',
                    'Sessions live in each server’s local memory, so a request landing on a different server doesn’t recognize the user',
                    'The database ran out of connections',
                    'The CDN is serving a stale login page',
                  ],
                  answer: 1,
                  explanation:
                    'Classic stateful-tier bug: server #1 created your session in its own memory, but the LB sent your next request to server #7, which never heard of you. The fix is a stateless web tier — move session state to a shared store (Redis/NoSQL/DB) so any server can serve any request. Statelessness is the prerequisite for auto-scaling.',
                },
                {
                  prompt:
                    'In a master–slave replication setup, why do systems usually run more slave databases than masters?',
                  options: [
                    'Slaves are cheaper hardware than masters',
                    'Masters can only exist one per data center by law',
                    'Most applications read far more than they write, and slaves serve the reads',
                    'Slaves don’t need to store the full dataset',
                  ],
                  answer: 2,
                  explanation:
                    'Writes go to the master; reads are distributed across slaves. Since real workloads are read-heavy (reads ≫ writes), you scale read throughput by adding slaves — hence many slaves per master. If the master dies, a slave is promoted, though in production that promotion is messier because a slave may lag and need recovery.',
                },
                {
                  prompt:
                    'Data for Katy Perry, Justin Bieber, and Lady Gaga all hash to the same shard, and that shard is melting under read load. What is this, and a fix?',
                  options: [
                    'Resharding failure — change the hash function for all shards',
                    'The celebrity / hotspot-key problem — give hot keys their own dedicated shards',
                    'A replication lag problem — add more slaves to that shard',
                    'A cache stampede — increase the TTL',
                  ],
                  answer: 1,
                  explanation:
                    'This is the celebrity (hotspot-key) problem: a few keys attract disproportionate traffic and overwhelm one shard even though data is "evenly" distributed by count. The fix is to peel hot keys onto their own shards (possibly further partitioned). It’s distinct from resharding, which is about a shard filling up and needing the hash function changed.',
                },
                {
                  prompt: 'What does a CDN actually cache, and why does it speed things up?',
                  options: [
                    'Dynamic database query results, served from the origin region',
                    'Static content (images, CSS, JS, video) on edge servers geographically near the user',
                    'User session data, so logins survive server restarts',
                    'Write operations, batched and flushed to the master DB',
                  ],
                  answer: 1,
                  explanation:
                    'A CDN is a network of geographically dispersed edge servers caching static assets. The first request fills the edge from origin with a TTL; later nearby users are served from the edge, cutting latency (the further from the server, the slower the load). Plan for cost, sane TTLs, and a fallback to origin if the CDN fails.',
                },
              ],
            },
            {
              kind: 'scenario',
              title: 'Climbing the ladder under real load',
              scenario: {
                intro:
                  'You run the backend for TiffinBox, a meal-delivery app. It started on a single server and is now doubling users every few weeks. Each decision below is a rung on the scaling ladder — pick the move that fixes the current failure without over-engineering.',
                stages: [
                  {
                    situation:
                      'Everything (web app, DB, cache) runs on one box. Traffic is rising and you want a path to scale, but load is still modest.',
                    question: 'What’s the right first move?',
                    options: [
                      {
                        label: 'Split the web tier from the data tier onto separate servers',
                        quality: 'best',
                        feedback:
                          'Correct first rung: separating web and data tiers lets each scale independently later. It doesn’t make anything faster yet — it makes future scaling possible.',
                      },
                      {
                        label: 'Immediately shard the database across 8 servers',
                        quality: 'bad',
                        feedback:
                          'Massive over-engineering for modest load. Sharding adds resharding, hotspot, and cross-shard join headaches you don’t need yet. Over-engineering is a real interview red flag.',
                      },
                      {
                        label: 'Buy the biggest possible single server and call it done',
                        quality: 'ok',
                        feedback:
                          'Vertical scaling buys time and is simple, but it has a hard ceiling and no failover — one box, one point of failure. Fine briefly; not a foundation for growth.',
                      },
                    ],
                  },
                  {
                    situation:
                      'You now have multiple web servers behind a load balancer. Reads against the single database are the bottleneck, and a DB outage takes the whole site down.',
                    question: 'What addresses both the read load and the single point of failure?',
                    options: [
                      {
                        label: 'Add database replication: one master for writes, several slaves for reads',
                        quality: 'best',
                        feedback:
                          'Right move: slaves absorb the read-heavy traffic and provide redundancy — if the master dies a slave is promoted. It fixes throughput and the DB SPOF in one step.',
                      },
                      {
                        label: 'Put a cache in front of the database',
                        quality: 'ok',
                        feedback:
                          'A cache helps read latency and offloads the DB, but a single cache is itself a SPOF and doesn’t give the database redundancy. It’s a complementary move, not the one that solves failover.',
                      },
                      {
                        label: 'Tell clients to retry harder when the database is down',
                        quality: 'bad',
                        feedback:
                          'Retries don’t add capacity or redundancy — they amplify load on an already-down database. This addresses neither the read bottleneck nor the SPOF.',
                      },
                    ],
                  },
                  {
                    situation:
                      'You’re scaling the web tier by auto-adding servers, but sessions are pinned with sticky sessions and adding/removing servers is painful and error-prone.',
                    question: 'What unblocks clean auto-scaling?',
                    options: [
                      {
                        label: 'Move session state into a shared store so the web tier is stateless',
                        quality: 'best',
                        feedback:
                          'Exactly. A stateless web tier lets any server handle any request, so you can add and remove servers freely by traffic load. Statelessness is the prerequisite for auto-scaling.',
                      },
                      {
                        label: 'Tune the load balancer’s sticky-session timeout',
                        quality: 'bad',
                        feedback:
                          'This entrenches the problem. Sticky sessions are exactly what makes adding/removing and failing over servers hard — you want to eliminate server-local state, not tune it.',
                      },
                      {
                        label: 'Replicate each server’s session memory to every other server',
                        quality: 'ok',
                        feedback:
                          'It technically lets requests land anywhere, but full mesh session replication is costly and fragile. A single shared store (Redis/NoSQL) is simpler, more robust, and the standard answer.',
                      },
                    ],
                  },
                ],
                debrief:
                  'Each rung solved one specific failure of the rung before: split tiers → load balancer → replication → cache/CDN → stateless tier → data centers/queues → sharding. The skill isn’t reciting all eight at once — it’s naming the next move that fixes the current bottleneck without over-engineering.',
              },
            },
          ],
        },
        {
          id: 'sdi-estimation',
          title: 'Back-of-the-envelope estimation',
          minutes: 15,
          xp: 80,
          steps: [
            { kind: 'read', title: 'Numbers every engineer should know', markdown: estimationMd },
            {
              kind: 'quiz',
              title: 'Orders of magnitude',
              questions: [
                {
                  prompt:
                    'Roughly how much downtime per year does a 99.99% ("four nines") availability SLA allow?',
                  options: ['~3.65 days', '~8.77 hours', '~52.6 minutes', '~5.26 minutes'],
                  answer: 2,
                  explanation:
                    'Each extra nine cuts downtime ~10×: 99% ≈ 3.65 days, 99.9% ≈ 8.77 hours, 99.99% ≈ 52.6 minutes, 99.999% ≈ 5.26 minutes. Cloud providers typically promise 99.9% or better; knowing these by feel lets you sanity-check an SLA in seconds.',
                },
                {
                  prompt:
                    'Among these latency numbers, which ordering reflects the right orders of magnitude?',
                  options: [
                    'Disk seek < main-memory reference < L1 cache reference',
                    'L1 cache (~1 ns) < main memory (~100 ns) < disk seek (~10 ms)',
                    'Main memory < L1 cache < cross-continent round trip',
                    'They’re all within ~10× of each other',
                  ],
                  answer: 1,
                  explanation:
                    'L1 ≈ 1 ns, main memory ≈ 100 ns, a disk seek ≈ 10 ms — that’s memory being roughly 100,000× faster than a disk seek. The exact values age, but the ratios drive the real lessons: memory is fast, disk is slow (avoid seeks), and cross-region trips (~150 ms) are expensive.',
                },
                {
                  prompt:
                    'An app has 200M monthly active users, 50% active daily, each making 4 requests/day on average. What’s the approximate average QPS?',
                  code: 'DAU = 200M × 50% = 100M\nrequests/day = 100M × 4 = 400M\nQPS = 400,000,000 / 86,400',
                  options: ['~460 QPS', '~4,600 QPS', '~46,000 QPS', '~460,000 QPS'],
                  answer: 1,
                  explanation:
                    '400M requests ÷ 86,400 seconds/day ≈ 4,630 ≈ 4,600 QPS. The standard shape: population → daily-active → per-day rate → divide by 86,400 for per-second. Peak would be roughly 2× that, ~9,200 QPS. Round freely — the order of magnitude is what matters.',
                },
                {
                  prompt: 'Why is labeling units ("5 MB", not "5") singled out as a top estimation tip?',
                  options: [
                    'Interviewers deduct points for sloppy handwriting',
                    'A mislabeled or confused unit is an easy way to land an answer off by 1000× (MB vs GB vs TB)',
                    'Units are required by the SLA',
                    'It’s the only way to compute peak QPS',
                  ],
                  answer: 1,
                  explanation:
                    'Powers-of-two units climb by ~1000× per step (KB→MB→GB→TB→PB). Writing a bare "5" invites a 1000× error when you carry it forward; "5 MB" removes the ambiguity. Alongside rounding and writing down assumptions, labeling units keeps the back-of-the-envelope process honest.',
                },
              ],
            },
            {
              kind: 'code',
              title: 'Build the Twitter estimator',
              challenge: {
                prompt: `## Estimate QPS and storage like the book

Implement \`estimate(cfg)\` that reproduces the chapter’s Twitter calculation for *any* set of assumptions. \`cfg\` has:

- \`mau\` — monthly active users
- \`dailyPct\` — fraction active daily (e.g. \`0.5\`)
- \`reqPerDay\` — actions (tweets) per active user per day
- \`mediaPct\` — fraction of actions carrying media (e.g. \`0.1\`)
- \`mediaSizeMB\` — size of one media item in MB
- \`years\` — retention horizon

Return an object with:

- \`dau\` = \`mau × dailyPct\`
- \`avgQps\` = \`Math.round(dau × reqPerDay / 86400)\` (86,400 seconds/day)
- \`peakQps\` = \`2 × avgQps\`
- \`mediaPerDayTB\` = total media MB/day ÷ 1,000,000 (use decimal TB: 1 TB = 1e6 MB)
- \`mediaTotalPB\` = \`mediaPerDayTB × 365 × years ÷ 1000\` (1 PB = 1000 TB)

With the book’s Twitter inputs (300M MAU, 50% daily, 2 tweets/day, 10% media, 1 MB each, 5 years) this must yield **150M DAU, ~3,472 avg QPS, ~6,944 peak QPS, 30 TB/day, 54.75 PB**.`,
                starterCode: `function estimate(cfg) {
  // Compute dau, avgQps, peakQps, mediaPerDayTB, mediaTotalPB
  // from cfg and return them as an object.
  return {
    dau: 0,
    avgQps: 0,
    peakQps: 0,
    mediaPerDayTB: 0,
    mediaTotalPB: 0,
  };
}`,
                solution: `function estimate(cfg) {
  const dau = cfg.mau * cfg.dailyPct;
  const avgQps = Math.round((dau * cfg.reqPerDay) / 86400);
  const peakQps = 2 * avgQps;
  const mediaPerDayMB = dau * cfg.reqPerDay * cfg.mediaPct * cfg.mediaSizeMB;
  const mediaPerDayTB = mediaPerDayMB / 1e6;
  const mediaTotalPB = (mediaPerDayTB * 365 * cfg.years) / 1000;
  return { dau, avgQps, peakQps, mediaPerDayTB, mediaTotalPB };
}`,
                tests: `const twitter = { mau: 300000000, dailyPct: 0.5, reqPerDay: 2, mediaPct: 0.1, mediaSizeMB: 1, years: 5 };

test('DAU is monthly actives times daily fraction', () => {
  assertEqual(estimate(twitter).dau, 150000000);
});
test('average QPS rounds to ~3472', () => {
  assertEqual(estimate(twitter).avgQps, 3472);
});
test('peak QPS is double the average', () => {
  assertEqual(estimate(twitter).peakQps, 6944);
});
test('media per day is 30 TB', () => {
  assertEqual(estimate(twitter).mediaPerDayTB, 30);
});
test('five-year media is 54.75 PB', () => {
  assertEqual(estimate(twitter).mediaTotalPB, 54.75);
});
test('generalizes to a different app', () => {
  const r = estimate({ mau: 100000000, dailyPct: 0.2, reqPerDay: 5, mediaPct: 0.2, mediaSizeMB: 2, years: 1 });
  assertEqual(r.dau, 20000000);
  assertEqual(r.avgQps, 1157);
  assertEqual(r.mediaPerDayTB, 40);
});`,
              },
            },
          ],
        },
        {
          id: 'sdi-framework',
          title: 'A framework for system design interviews',
          minutes: 14,
          xp: 80,
          steps: [
            { kind: 'read', title: 'The 4-step process', markdown: frameworkMd },
            {
              kind: 'quiz',
              title: 'Reading the room',
              questions: [
                {
                  prompt:
                    'The book warns "Don’t be like Jimmy." What mistake does Jimmy represent in a system design interview?',
                  options: [
                    'Spending too long on back-of-the-envelope math',
                    'Blurting out a solution fast without clarifying requirements — treating it like a trivia contest',
                    'Asking the interviewer too many clarifying questions',
                    'Drawing diagrams that are too detailed',
                  ],
                  answer: 1,
                  explanation:
                    'Jimmy is the kid who answers instantly, right or wrong. Jumping to a solution without understanding requirements is a major red flag — the interview simulates collaborative problem-solving on an ambiguous problem, not a quiz. Slow down and ask questions first.',
                },
                {
                  prompt:
                    'The book calls out one "real disease of many engineers" as a top red flag. What is it?',
                  options: [
                    'Under-confidence and asking for too many hints',
                    'Over-engineering — chasing design purity and ignoring tradeoffs and cost',
                    'Writing assumptions on the whiteboard',
                    'Proposing more than one approach',
                  ],
                  answer: 1,
                  explanation:
                    'Over-engineering — delighting in design purity while ignoring tradeoffs and the compounding cost of complexity — is the headline red flag, alongside narrow-mindedness and stubbornness. The right instinct is to fit the design to the requirements, not to gold-plate it.',
                },
                {
                  prompt:
                    'Roughly how should you budget a 45-minute interview across the four steps?',
                  options: [
                    'Most of it on Step 1 understanding the problem',
                    'Scope 3–10 min, high-level design 10–15 min, deep dive 10–25 min, wrap-up 3–5 min',
                    'Split evenly, ~11 minutes each',
                    'Skip scoping and spend it all on the deep dive',
                  ],
                  answer: 1,
                  explanation:
                    'The rough guide: Step 1 (scope) 3–10 min, Step 2 (high-level design + buy-in) 10–15 min, Step 3 (deep dive) 10–25 min, Step 4 (wrap-up) 3–5 min. The deep dive gets the most time, but only after you’ve scoped and gotten buy-in — and you always reserve a few minutes to wrap up.',
                },
              ],
            },
            {
              kind: 'scenario',
              title: 'Designing a news feed, live',
              scenario: {
                intro:
                  'The interviewer says: "Design a news feed system." You have 45 minutes. Work the 4-step framework — each stage is a fork where the framework points to the right behavior.',
                stages: [
                  {
                    situation:
                      'It’s minute one. The prompt is just "design a news feed." You have an idea for a fan-out architecture already forming in your head.',
                    question: 'What do you do first?',
                    options: [
                      {
                        label:
                          'Ask clarifying questions: mobile or web, key features, sort order, friends per user, DAU, media or text',
                        quality: 'best',
                        feedback:
                          'Step 1 done right. Clarifying scope (both platforms, post + view feed, reverse-chronological, 5000 friends, 10M DAU, media allowed) is the most-watched skill and stops you from designing the wrong system.',
                      },
                      {
                        label: 'Start drawing the fan-out architecture on the whiteboard immediately',
                        quality: 'bad',
                        feedback:
                          'That’s being Jimmy — jumping to a solution before understanding requirements. You might design the wrong system entirely (wrong sort order, wrong scale) and you skip the signal interviewers most want to see.',
                      },
                      {
                        label: 'Ask only "how many users?" then proceed',
                        quality: 'ok',
                        feedback:
                          'Scale matters, but one question isn’t enough scoping. You still don’t know the features, sort order, or whether media is involved — all of which change the design.',
                      },
                    ],
                  },
                  {
                    situation:
                      'Scope is agreed. You’re proposing the high-level design and split it into feed publishing and news-feed building flows.',
                    question: 'How do you run Step 2?',
                    options: [
                      {
                        label:
                          'Draw box diagrams, do quick back-of-the-envelope math to check scale, and ask the interviewer for buy-in',
                        quality: 'best',
                        feedback:
                          'Exactly Step 2: a blueprint of boxes (clients, APIs, servers, cache, DB, queue), a sanity check against the scale, and collaboration — treat the interviewer as a teammate and get agreement before going deeper.',
                      },
                      {
                        label:
                          'Silently write out the complete database schema and every API endpoint before saying anything',
                        quality: 'bad',
                        feedback:
                          'Two problems: thinking in silence (communicate!), and diving to low-level detail before buy-in. Whether to include schema/endpoints depends on the problem — ask, don’t assume.',
                      },
                      {
                        label: 'Present the high-level design but skip any capacity math',
                        quality: 'ok',
                        feedback:
                          'A reasonable blueprint, but back-of-the-envelope math is part of validating that it fits the scale (10M DAU, 5000 friends). Skipping it leaves the design unverified.',
                      },
                    ],
                  },
                  {
                    situation:
                      'The interviewer is happy with the blueprint and there are about 8 minutes left.',
                    question: 'How do you spend the wrap-up?',
                    options: [
                      {
                        label:
                          'Identify bottlenecks and improvements, recap the design, and discuss the next scale curve (1M → 10M users)',
                        quality: 'best',
                        feedback:
                          'Textbook Step 4: never claim the design is perfect; surface bottlenecks, recap (especially if you offered options), and discuss error cases, operations, and the next scale curve. Strong final impression.',
                      },
                      {
                        label: 'Declare the design complete and perfect, and stop talking',
                        quality: 'bad',
                        feedback:
                          'Saying the design is perfect is a red flag — there’s always something to improve. And you’re not done until the interviewer says so; stopping early wastes a chance to show critical thinking.',
                      },
                      {
                        label: 'Dive deep into the exact feed-ranking algorithm internals',
                        quality: 'ok',
                        feedback:
                          'Tempting, but rat-holing on algorithm minutiae (the book’s EdgeRank warning) burns your last minutes without proving scalability skills. A brief recap and bottleneck discussion is a better use of the time.',
                      },
                    ],
                  },
                ],
                debrief:
                  'The framework is the safety net: scope before solving (don’t be Jimmy), blueprint with buy-in and quick math, deep-dive where it counts without rat-holing, and wrap up by naming bottlenecks and the next scale curve. The final design matters less than visibly running this process.',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'sdi-m2',
      title: 'Core Building Blocks',
      description:
        'The four primitives that show up inside almost every large design: a rate limiter, consistent hashing, a distributed key-value store, and a unique ID generator.',
      lessons: [
        {
          id: 'sdi-rate-limiter',
          title: 'Design a rate limiter',
          minutes: 16,
          xp: 90,
          steps: [
            { kind: 'read', title: 'Throttling requests at scale', markdown: rateLimiterMd },
            {
              kind: 'quiz',
              title: 'Algorithms and their edges',
              questions: [
                {
                  prompt:
                    'Why is a rate limiter placed server-side (in middleware or an API gateway) rather than on the client?',
                  options: [
                    'Clients can’t run timers accurately',
                    'Client code is forgeable and outside your control, so client-enforced limits can be bypassed',
                    'Browsers block the X-Ratelimit headers',
                    'It’s cheaper to compute limits on the client',
                  ],
                  answer: 1,
                  explanation:
                    'A malicious actor can forge client requests or modify client code, so a limit enforced there is no limit at all. The limiter belongs server-side — commonly as middleware in front of the API servers, or inside an API gateway that already handles SSL termination, auth, and IP allow-listing.',
                },
                {
                  prompt:
                    'With a fixed window counter allowing 5 requests/minute, how can 10 requests slip through in a single rolling minute?',
                  options: [
                    'The counter overflows past its maximum value',
                    'Five requests near the end of one window plus five at the start of the next both fall inside one rolling 60-second span',
                    'Redis EXPIRE fires twice',
                    'The window resets on every request',
                  ],
                  answer: 1,
                  explanation:
                    'Fixed windows reset on clock-aligned boundaries. Five requests at 2:00:30 and five at 2:01:00 each obey their own window, but the rolling minute 2:00:30–2:01:30 contains all ten — twice the limit. This edge-burst flaw is exactly what the sliding window log and sliding window counter algorithms fix.',
                },
                {
                  prompt:
                    'What distinguishing behavior makes the token bucket algorithm popular (used by Amazon and Stripe)?',
                  options: [
                    'It rejects all bursts to keep a perfectly smooth rate',
                    'It allows short bursts of traffic — a request passes as long as tokens remain — while staying simple and memory-efficient',
                    'It stores every request timestamp for perfect accuracy',
                    'It processes requests at a strictly fixed outflow rate',
                  ],
                  answer: 1,
                  explanation:
                    'A token bucket refills at a steady rate up to its capacity; each request spends a token. Because a full bucket can be drained quickly, it tolerates short bursts — handy for real traffic. The cost is two parameters (bucket size and refill rate) that can be fiddly to tune. The fixed-outflow behavior describes the leaking bucket instead.',
                },
                {
                  prompt:
                    'In a distributed setup, two limiter instances both read counter = 3, both compute 4, and both write 4 — but the true value should be 5. What is this, and the recommended fix?',
                  options: [
                    'A synchronization issue — solved with sticky sessions',
                    'A race condition — solved with Redis Lua scripts or sorted sets (atomic read-modify-write), not plain locks',
                    'A partition — solved by adding more limiter servers',
                    'A cache miss — solved by raising the TTL',
                  ],
                  answer: 1,
                  explanation:
                    'Concurrent read-modify-write on a shared counter is a classic race condition. Locks fix it but throttle throughput, so the standard answers are an atomic Lua script or Redis sorted sets. (The separate synchronization problem — clients hitting different limiter instances — is solved by a centralized Redis store, not sticky sessions.)',
                },
              ],
            },
            {
              kind: 'code',
              title: 'Implement a token bucket',
              challenge: {
                prompt: `## Build the token bucket

Implement \`createLimiter(capacity, refillPerSec)\` that returns an \`allow(nowMs)\` function — the heart of the algorithm Amazon and Stripe use.

Rules:
- The bucket starts **full** (\`capacity\` tokens).
- Before each decision, refill based on elapsed time since the last call: add \`elapsedSeconds × refillPerSec\` tokens, but **never exceed \`capacity\`**.
- If at least one token is available, spend one and return \`true\` (allowed). Otherwise return \`false\` (throttled).

\`nowMs\` is the current time in milliseconds; tests call \`allow\` with increasing timestamps.`,
                starterCode: `function createLimiter(capacity, refillPerSec) {
  // Return an allow(nowMs) function implementing a token bucket:
  // refill by elapsed time (capped at capacity), spend one token per allowed request.
  return function allow(nowMs) {
    return true; // TODO: actually enforce the bucket
  };
}`,
                solution: `function createLimiter(capacity, refillPerSec) {
  let tokens = capacity;
  let last = 0;
  return function allow(nowMs) {
    const elapsed = (nowMs - last) / 1000;
    tokens = Math.min(capacity, tokens + elapsed * refillPerSec);
    last = nowMs;
    if (tokens >= 1) {
      tokens -= 1;
      return true;
    }
    return false;
  };
}`,
                tests: `test('a full bucket admits the first requests', () => {
  const allow = createLimiter(2, 1);
  assertEqual(allow(0), true);
  assertEqual(allow(0), true);
});
test('an empty bucket throttles the next request', () => {
  const allow = createLimiter(2, 1);
  allow(0);
  allow(0);
  assertEqual(allow(0), false);
});
test('tokens refill over elapsed time', () => {
  const allow = createLimiter(2, 1);
  allow(0);
  allow(0);
  assertEqual(allow(1000), true);
  assertEqual(allow(1000), false);
});
test('refill never exceeds capacity', () => {
  const allow = createLimiter(2, 1);
  assertEqual(allow(100000), true);
  assertEqual(allow(100000), true);
  assertEqual(allow(100000), false);
});`,
              },
            },
            {
              kind: 'scenario',
              title: 'Choosing the right algorithm',
              scenario: {
                intro:
                  'You’re adding rate limiting to different parts of a platform. Each part has different needs — and the five algorithms (token bucket, leaking bucket, fixed window, sliding window log, sliding window counter) trade accuracy, memory, and burst tolerance differently. Pick the right one for each.',
                stages: [
                  {
                    situation:
                      'A public API is usually quiet but legitimately spikes when customers run nightly batch jobs. You want to cap the sustained rate while still letting short bursts through.',
                    question: 'Which algorithm fits best?',
                    options: [
                      {
                        label: 'Token bucket',
                        quality: 'best',
                        feedback:
                          'Right. A token bucket lets a built-up balance of tokens absorb a short burst, then enforces the refill rate over time — exactly the "allow bursts, cap the average" behavior you want.',
                      },
                      {
                        label: 'Leaking bucket',
                        quality: 'bad',
                        feedback:
                          'A leaking bucket drains at a strictly fixed rate, so it flattens bursts instead of allowing them. Legitimate batch spikes would get throttled even though you have headroom.',
                      },
                      {
                        label: 'Fixed window counter',
                        quality: 'ok',
                        feedback:
                          'It allows some bursting but suffers the edge-of-window doubling problem, so the burst behavior is accidental and inaccurate rather than controlled.',
                      },
                    ],
                  },
                  {
                    situation:
                      'A login endpoint must enforce "5 attempts per minute" with no fudge — security wants the limit exact, and the request volume is low enough that memory isn’t a concern.',
                    question: 'Which algorithm enforces the limit most accurately?',
                    options: [
                      {
                        label: 'Sliding window log',
                        quality: 'best',
                        feedback:
                          'Correct. Storing each request timestamp and dropping those outside the rolling window gives an exact count in any window — no edge bursts. Its only real cost is memory, which is fine at low volume.',
                      },
                      {
                        label: 'Fixed window counter',
                        quality: 'bad',
                        feedback:
                          'Fixed windows let up to 2× the limit through across a boundary. For a security-sensitive login cap, that edge-burst inaccuracy is exactly what you can’t accept.',
                      },
                      {
                        label: 'Sliding window counter',
                        quality: 'ok',
                        feedback:
                          'It’s memory-efficient and smooths spikes, but it’s an approximation (it assumes the previous window’s requests were evenly spread). Close, but not the exact guarantee security asked for.',
                      },
                    ],
                  },
                  {
                    situation:
                      'You scale out to many limiter instances behind a stateless load balancer. A client’s requests now land on different instances, and each instance only counts what it personally saw — so the limit isn’t enforced globally.',
                    question: 'How do you make the limit hold across instances?',
                    options: [
                      {
                        label: 'Keep all counters in a shared centralized store like Redis',
                        quality: 'best',
                        feedback:
                          'Exactly. A centralized counter every instance reads and writes makes the limit global regardless of which instance a request hits — the standard fix for the synchronization problem.',
                      },
                      {
                        label: 'Pin each client to one instance with sticky sessions',
                        quality: 'bad',
                        feedback:
                          'Sticky sessions technically co-locate a client’s counter, but they’re neither scalable nor flexible — they fight auto-scaling and fail over poorly. The book explicitly advises against them.',
                      },
                      {
                        label: 'Let each instance keep its own counter and accept the drift',
                        quality: 'ok',
                        feedback:
                          'Simple, but it means the real limit is roughly N× your intended cap with N instances — the global guarantee you wanted is gone.',
                      },
                    ],
                  },
                ],
                debrief:
                  'There’s no universally best algorithm — token bucket for controlled bursts, sliding window log for exactness, sliding/fixed window counters for cheap approximations. And scaling out turns a simple counter into two distributed problems: race conditions (fix with atomic Lua/sorted sets) and synchronization (fix with centralized Redis).',
              },
            },
          ],
        },
        {
          id: 'sdi-consistent-hashing',
          title: 'Consistent hashing',
          minutes: 15,
          xp: 90,
          steps: [
            { kind: 'read', title: 'The hash ring', markdown: consistentHashingMd },
            {
              kind: 'quiz',
              title: 'Rings and virtual nodes',
              questions: [
                {
                  prompt:
                    'With simple `hash(key) % n` distribution, why does removing one server cause a storm of cache misses?',
                  options: [
                    'The hash function stops working when n changes',
                    'n changes to n−1, so `hash(key) % n` returns a different index for almost every key — nearly all keys remap at once',
                    'The removed server’s keys are permanently lost',
                    'Modular arithmetic only works for prime numbers of servers',
                  ],
                  answer: 1,
                  explanation:
                    'The hash values don’t change, but the modulus does. Going from n to n−1 servers shifts `hash(key) % n` for the vast majority of keys, so almost every client suddenly queries the wrong server — a cache-miss storm precisely when a node is already down. Consistent hashing limits the movement to ~k/n keys.',
                },
                {
                  prompt:
                    'Consistent hashing remaps only ~k/n keys when a server is added or removed. What are k and n?',
                  options: [
                    'k = key length in bytes, n = number of nodes',
                    'k = the number of keys, n = the number of slots (servers)',
                    'k = cache hits, n = cache misses',
                    'k = virtual nodes, n = physical nodes',
                  ],
                  answer: 1,
                  explanation:
                    'k is the total number of keys and n is the number of slots/servers. Only roughly k/n keys need to move when membership changes — versus nearly all of them with plain modular hashing. That bounded movement is the whole point of consistent hashing.',
                },
                {
                  prompt:
                    'A key and four servers are placed on the hash ring. How do you determine which server stores the key?',
                  options: [
                    'Pick the server with the numerically closest hash',
                    'Walk clockwise from the key’s position until you hit the first server',
                    'Apply `hash(key) % 4`',
                    'Pick the server with the smallest hash value',
                  ],
                  answer: 1,
                  explanation:
                    'Server lookup is a clockwise walk: from the key’s point on the ring, go clockwise to the first server you encounter. This is why adding a server only steals the keys in the arc behind it, and removing one hands only its own arc to the next server clockwise.',
                },
                {
                  prompt:
                    'What problem do virtual nodes (replicas) solve in consistent hashing?',
                  options: [
                    'They encrypt the keys on the ring',
                    'They even out uneven partition sizes and lopsided key distribution by giving each server many points on the ring',
                    'They eliminate the need for a hash function',
                    'They let the ring hold more than 2^160 positions',
                  ],
                  answer: 1,
                  explanation:
                    'With one point per server, arcs end up unequal and keys can pile onto one server. Placing each physical server at many points (s0_0, s0_1, …) shrinks the standard deviation of load — ~10% at 100 vnodes, ~5% at 200 — at the cost of more metadata. It’s the standard fix for balance and for hotspot mitigation.',
                },
              ],
            },
            {
              kind: 'code',
              title: 'Clockwise server lookup',
              challenge: {
                prompt: `## Walk the ring clockwise

Implement \`lookup(ring, keyPos)\`, the core of consistent hashing’s server lookup.

- \`ring\` is an array of \`{ pos, server }\` nodes, **sorted ascending by \`pos\`** (positions on a 0–359 ring).
- Return the \`server\` of the first node at position **≥ \`keyPos\`** (walking clockwise).
- If \`keyPos\` is past the last node, **wrap around** to the first node on the ring.

This is exactly why adding or removing a node only shifts the keys in one arc — verify that in the tests.`,
                starterCode: `function lookup(ring, keyPos) {
  // Walk clockwise from keyPos to the first node with pos >= keyPos,
  // wrapping around to ring[0] if keyPos is past the last node.
  return ring[0].server; // TODO: implement the clockwise walk
}`,
                solution: `function lookup(ring, keyPos) {
  for (const node of ring) {
    if (node.pos >= keyPos) return node.server;
  }
  return ring[0].server;
}`,
                tests: `const ring = [
  { pos: 30, server: 's0' },
  { pos: 120, server: 's1' },
  { pos: 210, server: 's2' },
  { pos: 300, server: 's3' },
];

test('a key maps to the next server clockwise', () => {
  assertEqual(lookup(ring, 35), 's1');
  assertEqual(lookup(ring, 0), 's0');
});
test('a key exactly on a node maps to that node', () => {
  assertEqual(lookup(ring, 210), 's2');
});
test('a key past the last node wraps around', () => {
  assertEqual(lookup(ring, 330), 's0');
});
test('adding a node only steals one arc', () => {
  const after = [
    { pos: 30, server: 's0' },
    { pos: 75, server: 's4' },
    { pos: 120, server: 's1' },
    { pos: 210, server: 's2' },
    { pos: 300, server: 's3' },
  ];
  // key at 50 falls into the new arc (30,75] -> moves to s4
  assertEqual(lookup(ring, 50), 's1');
  assertEqual(lookup(after, 50), 's4');
  // key at 100 is outside the new arc -> unchanged
  assertEqual(lookup(ring, 100), lookup(after, 100));
});`,
              },
            },
          ],
        },
        {
          id: 'sdi-kv-store',
          title: 'Design a key-value store',
          minutes: 18,
          xp: 100,
          steps: [
            { kind: 'read', title: 'CAP, quorum, and the storage paths', markdown: kvStoreMd },
            {
              kind: 'quiz',
              title: 'Tradeoffs and mechanisms',
              questions: [
                {
                  prompt:
                    'CAP theorem lets you guarantee two of consistency, availability, and partition tolerance. Why is a CA system impossible in a real distributed system?',
                  options: [
                    'Consistency and availability are the same property',
                    'Network partitions are unavoidable, so a real system must keep P — leaving a live choice only between C and A',
                    'CA systems are too expensive to build',
                    'Availability always implies consistency',
                  ],
                  answer: 1,
                  explanation:
                    'Because networks will partition, partition tolerance isn’t optional in practice. That forces the real decision to CP (block to stay consistent, sacrifice availability) vs AP (keep serving, possibly stale, sacrifice consistency). A CA store would have to assume partitions never happen, which isn’t true in the real world.',
                },
                {
                  prompt:
                    'With N replicas and quorum sizes W (write) and R (read), what condition guarantees strong consistency?',
                  options: [
                    'W = R',
                    'W + R > N',
                    'W + R ≤ N',
                    'W = 1 and R = 1',
                  ],
                  answer: 1,
                  explanation:
                    'If W + R > N, the write set and read set must overlap on at least one node that holds the newest value, so a read always sees the latest write. A common strong-consistency setup is N = 3, W = R = 2. If W + R ≤ N there’s no guaranteed overlap and strong consistency isn’t ensured.',
                },
                {
                  prompt: 'A quorum configured as R = 1, W = N optimizes the system for what?',
                  options: [
                    'Fast writes',
                    'Fast reads',
                    'Minimum storage',
                    'Maximum partition tolerance',
                  ],
                  answer: 1,
                  explanation:
                    'With R = 1 a read returns as soon as any single replica responds — fast reads. The cost is W = N, so every write must be acknowledged by all replicas (slow writes). The mirror image, W = 1 and R = N, optimizes for fast writes instead.',
                },
                {
                  prompt:
                    'On the read path, after a memory-cache miss, what is the bloom filter used for?',
                  options: [
                    'To compress the SSTables on disk',
                    'To cheaply rule out SSTables that cannot contain the key, so you avoid scanning every file',
                    'To detect node failures via heartbeats',
                    'To resolve conflicting versions of a value',
                  ],
                  answer: 1,
                  explanation:
                    'A bloom filter answers "this SSTable definitely does NOT contain the key" cheaply, so the read path only opens the few SSTables that might hold it instead of scanning all of them on disk. (Heartbeat-based detection is the gossip protocol; conflict resolution is vector clocks — different mechanisms.)',
                },
              ],
            },
            {
              kind: 'code',
              title: 'Compare vector clocks',
              challenge: {
                prompt: `## Detect conflicts with vector clocks

A vector clock tags a value with per-server version counters, e.g. \`{ Sx: 2, Sy: 1 }\`. Implement \`compareClocks(a, b)\` returning:

- \`'equal'\` — identical counters.
- \`'ancestor'\` — \`a\` is an ancestor of \`b\`: every counter in \`a\` is ≤ the matching counter in \`b\` (missing servers count as 0), and they aren’t equal. \`b\` wins, no conflict.
- \`'descendant'\` — \`b\` is an ancestor of \`a\` (the mirror case).
- \`'conflict'\` — siblings: each has a counter strictly greater than the other’s somewhere. The client must reconcile.

Example from the book: \`{s0:1,s1:1}\` is an **ancestor** of \`{s0:1,s1:2}\`, while \`{s0:1,s1:2}\` and \`{s0:2,s1:1}\` are in **conflict**.`,
                starterCode: `function compareClocks(a, b) {
  // Compare two vector clocks (objects of server -> counter).
  // Return 'equal' | 'ancestor' | 'descendant' | 'conflict'.
  return 'equal'; // TODO: implement the comparison
}`,
                solution: `function compareClocks(a, b) {
  const servers = new Set([...Object.keys(a), ...Object.keys(b)]);
  let aLeqB = true;
  let bLeqA = true;
  let equal = true;
  for (const s of servers) {
    const av = a[s] || 0;
    const bv = b[s] || 0;
    if (av > bv) aLeqB = false;
    if (bv > av) bLeqA = false;
    if (av !== bv) equal = false;
  }
  if (equal) return 'equal';
  if (aLeqB) return 'ancestor';
  if (bLeqA) return 'descendant';
  return 'conflict';
}`,
                tests: `test('identical clocks are equal', () => {
  assertEqual(compareClocks({ s0: 1, s1: 1 }, { s0: 1, s1: 1 }), 'equal');
});
test('a strictly-smaller clock is an ancestor', () => {
  assertEqual(compareClocks({ s0: 1, s1: 1 }, { s0: 1, s1: 2 }), 'ancestor');
});
test('the mirror case is a descendant', () => {
  assertEqual(compareClocks({ s0: 2, s1: 2 }, { s0: 1, s1: 1 }), 'descendant');
});
test('crossed counters are a conflict', () => {
  assertEqual(compareClocks({ s0: 1, s1: 2 }, { s0: 2, s1: 1 }), 'conflict');
});
test('a missing server counts as zero', () => {
  // {Sx:2} vs {Sx:2, Sy:1}: Sx equal, Sy 0 < 1 -> ancestor
  assertEqual(compareClocks({ Sx: 2 }, { Sx: 2, Sy: 1 }), 'ancestor');
});`,
              },
            },
            {
              kind: 'scenario',
              title: 'Choosing CAP for the use case',
              scenario: {
                intro:
                  'You operate a distributed key-value store backing several products. A network partition is happening right now — some replicas can’t reach others. For each product, choose the behavior that fits its requirements.',
                stages: [
                  {
                    situation:
                      'A banking product reads and writes account balances. During the partition, replicas might disagree about the current balance.',
                    question: 'How should the store behave for the bank?',
                    options: [
                      {
                        label: 'Choose consistency (CP): block writes and return an error until the partition heals',
                        quality: 'best',
                        feedback:
                          'Correct. A bank can’t show or modify a stale balance, so it sacrifices availability to stay consistent — returning an error rather than risking a wrong balance is the right call.',
                      },
                      {
                        label: 'Choose availability (AP): keep accepting reads and writes, reconcile later',
                        quality: 'bad',
                        feedback:
                          'For money, serving stale balances or accepting conflicting writes during a partition can produce real financial inconsistency. Availability over consistency is the wrong tradeoff for a bank.',
                      },
                      {
                        label: 'Disable partition tolerance so the problem can’t occur',
                        quality: 'bad',
                        feedback:
                          'You can’t opt out of partitions — they’re a fact of distributed systems. A CA system can’t exist in the real world; you must choose between C and A while keeping P.',
                      },
                    ],
                  },
                  {
                    situation:
                      'A social feed shows a post’s like count. During the partition, users should still see and interact with the feed even if the count is briefly off.',
                    question: 'How should the store behave for the feed?',
                    options: [
                      {
                        label: 'Choose availability (AP): keep serving reads and writes, sync up once the partition resolves',
                        quality: 'best',
                        feedback:
                          'Right. A like count that’s momentarily stale is harmless, and users expect the feed to stay up. AP — stay available and reconcile later via eventual consistency — fits perfectly.',
                      },
                      {
                        label: 'Choose consistency (CP): block the feed until every replica agrees',
                        quality: 'bad',
                        feedback:
                          'Taking the feed down to make a like count perfectly consistent is a bad trade — it sacrifices the availability users care about for a precision they don’t need here.',
                      },
                      {
                        label: 'Return an error for every feed request during the partition',
                        quality: 'ok',
                        feedback:
                          'That’s effectively the CP behavior — technically safe but needlessly user-hostile for low-stakes data. Eventual consistency would keep the product usable.',
                      },
                    ],
                  },
                  {
                    situation:
                      'For the AP feed, one replica (s2) is temporarily unreachable. You still want writes to succeed and nothing to be lost when s2 returns.',
                    question: 'Which mechanism handles this temporary failure?',
                    options: [
                      {
                        label: 'Sloppy quorum with hinted handoff: a healthy node covers for s2 and hands the data back on recovery',
                        quality: 'best',
                        feedback:
                          'Exactly. Sloppy quorum writes to the first W healthy nodes (ignoring the down one), and hinted handoff stores the writes meant for s2 elsewhere, replaying them when s2 returns — availability preserved, no data lost.',
                      },
                      {
                        label: 'Anti-entropy with Merkle trees, run on every single write',
                        quality: 'ok',
                        feedback:
                          'Merkle-tree anti-entropy is the right tool for repairing permanent divergence efficiently, but running a full tree comparison on every write is far too heavy for a transient outage. Hinted handoff is the targeted fix here.',
                      },
                      {
                        label: 'Mark s2 permanently dead and reshard the whole ring immediately',
                        quality: 'bad',
                        feedback:
                          'A brief unreachability isn’t permanent failure. Resharding the entire ring for a transient blip is massively disruptive and exactly the over-reaction hinted handoff exists to avoid.',
                      },
                    ],
                  },
                ],
                debrief:
                  'CAP isn’t one global choice — it’s per-use-case: CP for money (consistency over uptime), AP for feeds (uptime over precision, reconciled by eventual consistency). And AP stores stay available through failures with layered mechanisms: gossip to detect, sloppy quorum + hinted handoff for temporary outages, Merkle-tree anti-entropy for permanent divergence.',
              },
            },
          ],
        },
        {
          id: 'sdi-unique-id',
          title: 'Unique ID generator',
          minutes: 14,
          xp: 90,
          steps: [
            { kind: 'read', title: 'From auto_increment to Snowflake', markdown: uniqueIdMd },
            {
              kind: 'quiz',
              title: 'Picking an ID scheme',
              questions: [
                {
                  prompt:
                    'Why doesn’t a database’s `auto_increment` primary key work as a distributed unique-ID generator?',
                  options: [
                    'auto_increment produces non-numeric IDs',
                    'A single DB server doesn’t scale, and coordinating an incrementing counter across many databases with low latency is hard',
                    'auto_increment IDs are always 128 bits',
                    'It generates IDs that decrease over time',
                  ],
                  answer: 1,
                  explanation:
                    'auto_increment relies on one server’s counter. One server is a scaling and availability bottleneck, and making several databases agree on a single increasing sequence quickly is exactly the hard part. That’s why distributed schemes (Snowflake, multi-master, ticket servers, UUID) exist.',
                },
                {
                  prompt:
                    'UUIDs can be generated independently with zero coordination between servers. Why are they still rejected for this problem?',
                  options: [
                    'UUIDs collide too often in practice',
                    'They are 128 bits (the requirement is 64), they aren’t sortable by time, and they can be non-numeric',
                    'They require a central ticket server',
                    'They can only be generated once per millisecond',
                  ],
                  answer: 1,
                  explanation:
                    'UUIDs win on coordination — none needed — but they violate three requirements: 128 bits vs the 64-bit limit, no time ordering (IDs don’t grow with time), and they may contain non-numeric characters. Those disqualify them despite the appealing independence.',
                },
                {
                  prompt:
                    'In Twitter Snowflake’s 64-bit layout, why is the 41-bit timestamp placed in the high-order bits (right after the sign bit)?',
                  options: [
                    'To leave room for the sign bit',
                    'Because the most significant field dominates numeric ordering, so timestamp-first makes the IDs sortable by time',
                    'Because the timestamp is the largest field',
                    'To make decoding faster',
                  ],
                  answer: 1,
                  explanation:
                    'Numeric ordering is dominated by the most significant bits. Putting the timestamp first means a later time always yields a larger ID regardless of datacenter, machine, or sequence — which is exactly the "ordered by date" requirement. Reorder the fields and you lose time-sortability.',
                },
                {
                  prompt:
                    'Snowflake gives the sequence field 12 bits. What does that imply about ID generation rate?',
                  options: [
                    'At most 12 IDs per second per machine',
                    'Up to 2^12 = 4096 IDs per millisecond per machine (the sequence resets each millisecond)',
                    'Exactly 4096 IDs total across the whole system',
                    'Up to 41 IDs per millisecond',
                  ],
                  answer: 1,
                  explanation:
                    '12 sequence bits give 2^12 = 4096 distinct values, incremented per ID within the same millisecond on one machine and reset to 0 each millisecond. So a single machine can mint up to 4096 IDs/ms — comfortably above the 10,000 IDs/sec requirement.',
                },
              ],
            },
            {
              kind: 'code',
              title: 'Pack and unpack a Snowflake ID',
              challenge: {
                prompt: `## Build the Snowflake codec

Compose and decode a 64-bit Snowflake ID. Use **BigInt** (\`<<\`, \`|\`, \`&\`) — the value exceeds 53-bit float precision. Layout from the most significant bits: timestamp (41) · datacenter (5) · machine (5) · sequence (12). Use custom epoch \`1288834974657\`.

Implement two functions:

- \`makeId({ timestampMs, datacenterId, machineId, sequence })\` → a BigInt:
  \`((timestampMs − epoch) << 22) | (datacenterId << 17) | (machineId << 12) | sequence\`
- \`parseId(id)\` → \`{ timestampMs, datacenterId, machineId, sequence }\` as plain numbers, inverting the packing.

The fields must round-trip, and a later timestamp must always produce a larger ID.`,
                starterCode: `function makeId(fields) {
  // Pack timestamp/datacenter/machine/sequence into one 64-bit BigInt.
  return 0n;
}

function parseId(id) {
  // Unpack the BigInt back into the four fields (as plain numbers).
  return { timestampMs: 0, datacenterId: 0, machineId: 0, sequence: 0 };
}`,
                solution: `const CUSTOM_EPOCH = 1288834974657n;
const SEQ_BITS = 12n;
const MACHINE_BITS = 5n;
const DC_BITS = 5n;

function makeId(fields) {
  const ts = BigInt(fields.timestampMs) - CUSTOM_EPOCH;
  return (
    (ts << (DC_BITS + MACHINE_BITS + SEQ_BITS)) |
    (BigInt(fields.datacenterId) << (MACHINE_BITS + SEQ_BITS)) |
    (BigInt(fields.machineId) << SEQ_BITS) |
    BigInt(fields.sequence)
  );
}

function parseId(id) {
  const seqMask = (1n << SEQ_BITS) - 1n;
  const machineMask = (1n << MACHINE_BITS) - 1n;
  const dcMask = (1n << DC_BITS) - 1n;
  return {
    timestampMs: Number((id >> (SEQ_BITS + MACHINE_BITS + DC_BITS)) + CUSTOM_EPOCH),
    datacenterId: Number((id >> (SEQ_BITS + MACHINE_BITS)) & dcMask),
    machineId: Number((id >> SEQ_BITS) & machineMask),
    sequence: Number(id & seqMask),
  };
}`,
                tests: `test('fields round-trip through pack and unpack', () => {
  const fields = { timestampMs: 1500000000000, datacenterId: 5, machineId: 12, sequence: 42 };
  assertEqual(parseId(makeId(fields)), fields);
});
test('sequence occupies the low 12 bits', () => {
  const id = makeId({ timestampMs: 1288834974657, datacenterId: 0, machineId: 0, sequence: 7 });
  assertEqual(id, 7n);
});
test('a later timestamp yields a larger ID', () => {
  const a = makeId({ timestampMs: 1500000000000, datacenterId: 0, machineId: 0, sequence: 0 });
  const b = makeId({ timestampMs: 1500000000001, datacenterId: 0, machineId: 0, sequence: 0 });
  assertEqual(b > a, true);
});
test('timestamp outranks every lower field', () => {
  const earlier = makeId({ timestampMs: 1500000000000, datacenterId: 31, machineId: 31, sequence: 4095 });
  const later = makeId({ timestampMs: 1500000000001, datacenterId: 0, machineId: 0, sequence: 0 });
  assertEqual(later > earlier, true);
});`,
              },
            },
          ],
        },
      ],
    },
  ],
}
