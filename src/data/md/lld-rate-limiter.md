# Build a rate limiter (token bucket)

**The real-life scenario:** your public API is getting hammered — one customer's buggy script retries in a tight loop, 50k requests/min, and everyone else's latency spikes. You need per-client limits: sustained rate ~10 req/s, but bursts are fine (a page load legitimately fires 20 calls at once). Blocking the burst would break the product; allowing the flood breaks the platform.

That requirement — **allow bursts, cap the sustained rate** — is exactly what the **token bucket** does, which is why it's the algorithm inside Stripe's and AWS's rate limiting and Nginx's `limit_req`.

## The algorithm

Picture a bucket per client:

- The bucket holds at most **capacity** tokens (the burst allowance).
- Tokens drip in at **refillRate** per second, up to the cap.
- Each request must take 1 token. Bucket empty → request rejected (HTTP 429).

A client that's been quiet has a full bucket → can burst `capacity` requests instantly. A client hammering nonstop drains the bucket and is then throttled to exactly `refillRate` per second. Both requirements, one mechanism, two numbers of state per client.

## The lazy-refill trick (the part interviewers probe)

Naive implementations run a timer adding tokens every 100ms — per client. Thousands of clients → thousands of timers. Nobody does that.

Instead, **refill lazily at request time**: store `tokens` and `lastRefillTime`; when a request arrives, first credit the elapsed time, then decide:

```
onRequest(now):
  elapsed = now - lastRefillTime
  tokens = min(capacity, tokens + elapsed * refillRate)
  lastRefillTime = now
  if tokens >= 1: tokens -= 1; return ALLOWED
  else:           return REJECTED
```

No timers, no background work, exact math. Keep `tokens` as a float — partial tokens accumulate between requests.

## Inject the clock

How do you test "after 2 seconds, 20 tokens have refilled" without `sleep(2000)` in your tests? **Pass the clock in:**

```js
new TokenBucket({ capacity: 10, refillRate: 5, now: () => Date.now() })
```

In tests, hand it a fake `now` you can advance instantly. This is the *inject what varies* superpower from lesson 1, and it's exactly how you'll implement the challenge next — the tests control time.

## Design talking points

- **Token bucket vs fixed window:** counting "requests this minute" allows 2× bursts at the boundary (100 at 11:59:59 + 100 at 12:00:00). The bucket has no windows, so no boundary exploit.
- **Token bucket vs leaky bucket:** leaky forces perfectly smooth output (great for shaping traffic *out*); token allows bursts (great for serving users). Interviewers love this contrast.
- **Distributed version:** per-client state in Redis, refill+take as one atomic Lua script; or local buckets per node with a divided global rate. Mention the race (two nodes reading the same bucket) and that atomicity is the fix.
