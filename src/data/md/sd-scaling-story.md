# From dorm room to 10 million users: a scaling story

Meet **TiffinBox**, a food-delivery startup. We'll scale it from a laptop to 10M users, hitting every wall in the exact order real companies hit them. Every system design interview is secretly this story.

## Chapter 1: One server (0 → 1k users)

One VM runs everything: Node.js app + PostgreSQL + images on disk. **This is correct engineering**, not laziness — at this scale, any more architecture is waste.

> **Interview signal #1:** Starting with microservices for 1k users is a *negative* signal. Senior engineers scale when the pain arrives, not before.

## Chapter 2: The database is on fire (1k → 50k)

Lunch hour. CPU 100%. Restaurant pages take 9 seconds. Profiling shows the same query 2,000×/min: *fetch menu for restaurant X* — and menus change maybe once a week.

**Fix: a cache.** Put Redis in front of Postgres:

```
read: cache hit? return it : (read DB → store in cache with 60s TTL → return)
```

One box of RAM absorbs ~95% of reads. Database breathes again. Cost: a new failure mode — **stale data**. A restaurant marks paneer tikka sold out; users still order it for up to 60s. You'll choose TTLs vs invalidation forever after this day.

## Chapter 3: One app server isn't enough (50k → 500k)

The app process itself maxes out. Buy bigger servers (**vertical scaling**) — works twice, then prices go exponential and there's a ceiling.

**Fix: horizontal scaling.** 10 identical app servers behind a **load balancer**. But there's a catch: server #3 holds your login session in memory, and the LB might send your next request to server #7 — logged out.

**The fix behind the fix: stateless app servers.** Sessions move to Redis (or signed tokens/JWT). Any server can handle any request. *Statelessness is what makes horizontal scaling possible* — this single idea is the backbone of every large system.

## Chapter 4: Now the database really is the bottleneck (500k → 5M)

Writes can't be cached. Two moves, in order:

1. **Read replicas.** Postgres streams its write-ahead log to copies; reads go to replicas, writes to the primary. But replication lags ~50ms: a user updates their address, the read replica hasn't heard yet, the order confirmation shows the *old* address. Welcome to **eventual consistency** — read-your-own-writes is now a feature you must engineer.
2. **Sharding** (when even the primary can't take the writes). Split data across DBs by a **shard key** — e.g. orders sharded by `city_id`: Mumbai on shard 1, Delhi on shard 2. Each shard handles a slice. Costs: cross-shard queries hurt ("top restaurants nationwide" now fans out to all shards), and a bad key (everything in one hot city) gives you one melting shard and nine idle ones.

## Chapter 5: Decoupling with queues (5M → 10M)

Order placement does: charge card → notify restaurant → SMS user → update analytics → loyalty points. Sequentially: 3+ seconds, and if the SMS provider is down, **orders fail**. Madness — SMS isn't essential to taking the order.

**Fix: a message queue** (Kafka/SQS). The order service does the *essential* work, publishes `OrderPlaced`, responds in 200ms. Notification, analytics, and loyalty services consume the event independently. If SMS is down, messages wait in the queue and drain later. **Slow/optional work goes behind a queue.**

## The pattern you just learned

```
Find the bottleneck → cheapest fix that removes it → accept its new trade-off → repeat
```

Cache → stateless + LB → replicas → shard → queues. That ladder, with trade-offs stated at each rung, **is** the system design interview. Next lesson: each building block in detail.
