# The building blocks toolbox

Seven components make up ~90% of every system design answer. Know what each one buys you, what it costs you, and one number for each.

## 1. Load Balancer
Spreads traffic across servers; health-checks and ejects dead ones.
**Decisions:** L4 (TCP, fast, dumb) vs L7 (HTTP-aware — can route `/api/video` to video servers, do TLS, sticky sessions). Algorithms: round-robin, least-connections, consistent hashing.
**Number:** a single L7 LB comfortably handles tens of thousands of req/s.

## 2. Cache (Redis / Memcached)
RAM lookups ~100× faster than DB queries. The highest-leverage component per dollar in this list.
**Decisions:** TTL vs explicit invalidation ("there are only two hard things in CS…"); cache-aside (app manages, most common) vs write-through.
**Failure modes worth naming in interviews:** *stampede* (hot key expires → 10k requests hit the DB at once → use request coalescing / jittered TTLs) and *hot key* (one celebrity's data on one cache node melts it).
**Number:** Redis does ~100k+ ops/s per node.

## 3. CDN
Caches static (and some dynamic) content in 300+ locations near users. Physics is the reason: Mumbai→Virginia is ~180ms round-trip; Mumbai→Mumbai-edge is ~5ms.
**Rule:** images, video, JS/CSS go on a CDN on day one. It's also your cheapest DDoS shield.

## 4. Relational DB (PostgreSQL/MySQL)
**ACID transactions** — money moves atomically or not at all. Joins, constraints, 50 years of tooling.
**Default to SQL.** Leave it only when you have a reason you can say out loud.
**Number:** a well-tuned Postgres handles ~10–50k simple queries/s; single-node storage gets painful past a few TB.

## 5. NoSQL (DynamoDB / Cassandra / Mongo)
Built to shard horizontally from day one: massive write throughput and effortless scale-out, in exchange for **no joins, no multi-row transactions, query patterns designed up-front**.
**Honest answer for "SQL or NoSQL?":** *"SQL until write volume or data size forces sharding; if my access pattern is simple key-value at huge scale — like sessions, or URL mappings — NoSQL fits naturally."*

## 6. Message Queue (Kafka / SQS / RabbitMQ)
Decouples producer speed from consumer speed; absorbs spikes; retries failures.
**Use when:** work is slow/optional (email, video transcode, analytics) or spiky (flash sale).
**Must-know semantics:** *at-least-once delivery* — your consumer WILL occasionally see a message twice, so handlers must be **idempotent** (e.g. dedupe by message ID). Saying this unprompted is a senior signal.
**Number:** Kafka does millions of messages/s per cluster.

## 7. Object Store (S3 / GCS)
Infinitely scalable file storage. Images, videos, backups, logs. **Files never go in the database** — store the file in S3, store the S3 URL in the DB, serve through the CDN.

---

## The numbers card (memorize these)

| Thing | Latency |
|---|---|
| RAM read | ~100 ns |
| SSD read | ~100 µs |
| Same-datacenter network hop | ~0.5 ms |
| DB query (indexed) | ~1–10 ms |
| Cross-continent round trip | ~150 ms |
| Human notices delay | ~100–200 ms |

And one capacity rule of thumb: **1M daily active users ≈ ~30 req/s average, ~100–300 req/s peak.** Most candidates overestimate by 100×. Doing this estimate out loud — "10M DAU ≈ 1–3k req/s peak, so a modest fleet behind one LB is fine; the *data* is the hard part" — instantly separates you from the crowd.

Next: use the toolbox under fire, in a real case study.
