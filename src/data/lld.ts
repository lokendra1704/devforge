import type { Subject } from '../types'
import mindsetMd from './md/lld-mindset.md?raw'
import lruMd from './md/lld-lru.md?raw'
import rateLimiterMd from './md/lld-rate-limiter.md?raw'
import parkingLotMd from './md/lld-parking-lot.md?raw'

export const lld: Subject = {
  id: 'lld',
  title: 'Low Level Coding',
  tagline: 'Machine coding rounds: LRU caches, rate limiters, and OOD that survives extensions.',
  icon: '🔧',
  accent: '#fbbf24',
  modules: [
    {
      id: 'lld-m1',
      title: 'The Machine Coding Mindset',
      description: 'What interviewers actually grade — it is not the algorithm.',
      lessons: [
        {
          id: 'lld-mindset',
          title: 'What machine coding rounds actually grade',
          minutes: 10,
          xp: 50,
          steps: [
            { kind: 'read', title: 'The real rubric', markdown: mindsetMd },
            {
              kind: 'quiz',
              title: 'Calibrate your instincts',
              questions: [
                {
                  prompt:
                    'With 90 minutes for “build Splitwise”, candidate A ships all features in one 400-line class. Candidate B ships 70% of features across clean small classes, and the missing 30% has obvious extension points. Who typically scores higher?',
                  options: [
                    'A — completeness is everything',
                    'B — working core + clean seams beats a complete god-class',
                    'They tie',
                    'Neither passes',
                  ],
                  answer: 1,
                  explanation:
                    'The round is graded on design under time pressure. A god class signals that real-world you produces unmaintainable code. B demonstrates judgment: prioritize the core, structure it so the rest slots in. (Shipping only 30% would flip the answer — *working* still matters most.)',
                },
                {
                  prompt: 'Why pass a clock function into a rate limiter or fee calculator instead of calling Date.now() inside?',
                  options: [
                    'Date.now() is too slow for production code',
                    'It makes time controllable in tests — you can simulate hours in microseconds',
                    'Global functions are forbidden in interviews',
                    'It prevents timezone bugs',
                  ],
                  answer: 1,
                  explanation:
                    '“Inject what varies.” With an injected clock, a test can advance time instantly to verify “after 2 seconds, tokens refilled” or “parked 3 days costs ₹900” without sleeping. You will use this trick in the very next lessons — the tests control time.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'lld-m2',
      title: 'Build the Classics',
      description: 'Three machine-coding staples, against real test suites.',
      lessons: [
        {
          id: 'lld-lru',
          title: 'Build an LRU Cache',
          minutes: 25,
          xp: 120,
          steps: [
            { kind: 'read', title: 'Two structures, one cache', markdown: lruMd },
            {
              kind: 'code',
              title: 'Implement it',
              challenge: {
                prompt: `## Implement LRUCache

LeetCode 146 — a top-3 most-asked implementation question (Amazon, Google, Meta, everyone).

Build the class with **O(1)** \`get\` and \`put\`:

- \`get(key)\` → value, or **-1** if absent; marks the key most-recently-used
- \`put(key, value)\` → inserts or updates; marks most-recently-used; evicts the least-recently-used entry when capacity is exceeded

You may use the JS \`Map\` insertion-order trick (delete + re-insert to refresh recency; \`map.keys().next().value\` is the oldest) — or go full doubly-linked-list for glory.`,
                starterCode: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
  }

  get(key) {
    // absent -> -1
    // present -> refresh recency (delete + re-insert), return value

  }

  put(key, value) {
    // updating an existing key must also refresh its recency
    // after inserting: if size exceeds capacity, evict the oldest

  }
}`,
                solution: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
  }

  get(key) {
    if (!this.map.has(key)) return -1;
    const value = this.map.get(key);
    this.map.delete(key);      // refresh recency:
    this.map.set(key, value);  // move to the back (most recent)
    return value;
  }

  put(key, value) {
    if (this.map.has(key)) this.map.delete(key);
    this.map.set(key, value);
    if (this.map.size > this.capacity) {
      const oldest = this.map.keys().next().value;
      this.map.delete(oldest);
    }
  }
}`,
                tests: `test('basic put/get', () => {
  const c = new LRUCache(2);
  c.put(1, 100);
  assertEqual(c.get(1), 100);
});
test('missing key returns -1', () => {
  const c = new LRUCache(2);
  assertEqual(c.get(99), -1);
});
test('evicts the least recently used', () => {
  const c = new LRUCache(2);
  c.put(1, 1); c.put(2, 2); c.put(3, 3); // evicts 1
  assertEqual(c.get(1), -1);
  assertEqual(c.get(2), 2);
  assertEqual(c.get(3), 3);
});
test('get refreshes recency — the classic LeetCode sequence', () => {
  const c = new LRUCache(2);
  c.put(1, 1); c.put(2, 2);
  assertEqual(c.get(1), 1); // 1 is now most recent
  c.put(3, 3);              // evicts 2, NOT 1
  assertEqual(c.get(2), -1);
  assertEqual(c.get(1), 1);
  assertEqual(c.get(3), 3);
});
test('updating an existing key refreshes recency and keeps size', () => {
  const c = new LRUCache(2);
  c.put(1, 1); c.put(2, 2);
  c.put(1, 10);             // update, 1 becomes most recent
  c.put(3, 3);              // evicts 2
  assertEqual(c.get(1), 10);
  assertEqual(c.get(2), -1);
});
test('capacity 1 behaves', () => {
  const c = new LRUCache(1);
  c.put(1, 1); c.put(2, 2);
  assertEqual(c.get(1), -1);
  assertEqual(c.get(2), 2);
});`,
              },
            },
          ],
        },
        {
          id: 'lld-rate-limiter',
          title: 'Build a Rate Limiter (token bucket)',
          minutes: 25,
          xp: 120,
          steps: [
            { kind: 'read', title: 'Bursts allowed, floods denied', markdown: rateLimiterMd },
            {
              kind: 'code',
              title: 'Implement it',
              challenge: {
                prompt: `## Implement TokenBucket

Build the limiter that powers Stripe-style APIs. Constructor receives an options object:

- \`capacity\` — max tokens (burst allowance)
- \`refillRate\` — tokens added per **second**
- \`now\` — injected clock returning milliseconds (the tests control time!)

Method \`allow()\` → \`true\` (consume 1 token) or \`false\` (rejected).

**Use lazy refill:** on each call, credit \`elapsedSeconds * refillRate\` tokens (capped at capacity) before deciding. Keep tokens as a float. The bucket starts **full**.`,
                starterCode: `class TokenBucket {
  constructor({ capacity, refillRate, now }) {
    this.capacity = capacity;
    this.refillRate = refillRate;
    this.now = now;
    this.tokens = capacity;        // starts full
    this.lastRefill = now();
  }

  allow() {
    // 1) lazy refill: credit elapsed time, cap at capacity, update lastRefill
    // 2) if at least 1 token: consume it, return true
    // 3) otherwise return false

  }
}`,
                solution: `class TokenBucket {
  constructor({ capacity, refillRate, now }) {
    this.capacity = capacity;
    this.refillRate = refillRate;
    this.now = now;
    this.tokens = capacity;
    this.lastRefill = now();
  }

  allow() {
    const t = this.now();
    const elapsedSec = (t - this.lastRefill) / 1000;
    this.tokens = Math.min(this.capacity, this.tokens + elapsedSec * this.refillRate);
    this.lastRefill = t;
    if (this.tokens >= 1) {
      this.tokens -= 1;
      return true;
    }
    return false;
  }
}`,
                tests: `function makeClock(start) {
  let t = start;
  return { now: () => t, advance: (ms) => { t += ms; } };
}
test('allows an initial burst up to capacity', () => {
  const clock = makeClock(0);
  const b = new TokenBucket({ capacity: 5, refillRate: 1, now: clock.now });
  const results = [];
  for (let i = 0; i < 6; i++) results.push(b.allow());
  assertEqual(results, [true, true, true, true, true, false]);
});
test('refills over time', () => {
  const clock = makeClock(0);
  const b = new TokenBucket({ capacity: 5, refillRate: 1, now: clock.now });
  for (let i = 0; i < 5; i++) b.allow();      // drain
  assertEqual(b.allow(), false);
  clock.advance(2000);                         // +2 tokens
  assertEqual(b.allow(), true);
  assertEqual(b.allow(), true);
  assertEqual(b.allow(), false);
});
test('never exceeds capacity after a long idle period', () => {
  const clock = makeClock(0);
  const b = new TokenBucket({ capacity: 3, refillRate: 10, now: clock.now });
  clock.advance(60_000);                       // a minute of refill...
  const results = [];
  for (let i = 0; i < 4; i++) results.push(b.allow());
  assertEqual(results, [true, true, true, false]); // ...still capped at 3
});
test('partial tokens accumulate (float math)', () => {
  const clock = makeClock(0);
  const b = new TokenBucket({ capacity: 5, refillRate: 1, now: clock.now });
  for (let i = 0; i < 5; i++) b.allow();
  clock.advance(500);                          // 0.5 tokens — not enough
  assertEqual(b.allow(), false);
  clock.advance(500);                          // now 1.0
  assertEqual(b.allow(), true);
});
test('sustained rate equals refillRate', () => {
  const clock = makeClock(0);
  const b = new TokenBucket({ capacity: 10, refillRate: 2, now: clock.now });
  for (let i = 0; i < 10; i++) b.allow();      // drain burst
  let allowed = 0;
  for (let s = 0; s < 10; s++) {               // 10 seconds, checking each 500ms
    clock.advance(500);
    if (b.allow()) allowed++;
    clock.advance(500);
    if (b.allow()) allowed++;
  }
  assertEqual(allowed, 20);                    // 2/sec * 10 sec
});`,
              },
            },
          ],
        },
        {
          id: 'lld-parking-lot',
          title: 'Design a Parking Lot (OOD walkthrough)',
          minutes: 15,
          xp: 70,
          steps: [
            { kind: 'read', title: 'Entities, seams, and extensions', markdown: parkingLotMd },
            {
              kind: 'quiz',
              title: 'Test the seams',
              questions: [
                {
                  prompt:
                    'The interviewer extends the problem: “weekend parking costs 1.5×.” In a well-designed lot, how many classes change?',
                  options: [
                    'One — FeeCalculator (it owns pricing and receives the time)',
                    'Two — ParkingLot and Slot',
                    'Three — Ticket must store the multiplier, plus the lot and calculator',
                    'Zero — handle it in the database',
                  ],
                  answer: 0,
                  explanation:
                    'Pricing was isolated in FeeCalculator precisely because it changes fastest. The calculator already receives entry time and exit time, so weekend logic is internal to it. If your design needs three classes edited for a pricing rule, the seams were drawn wrong.',
                },
                {
                  prompt:
                    'Two entry gates run concurrently and both try to assign the last free slot at the same moment. Both succeed and two cars get one slot. What is the root cause?',
                  options: [
                    'The SlotAssigner used a bad search policy',
                    'A race condition: check-free-then-mark-occupied is not atomic',
                    'Tickets should have been created before slot assignment',
                    'The lot should keep a free-slot counter instead of flags',
                  ],
                  answer: 1,
                  explanation:
                    'Both gates read “slot is free” before either wrote “occupied” — a textbook time-of-check-to-time-of-use race. The fix is making the claim atomic (a lock, or compare-and-set on the slot state). The Parallelism track turns this exact bug into a build-it-yourself exercise.',
                },
                {
                  prompt: 'Why does parkVehicle() throw a LotFullError instead of returning null when no slot fits?',
                  options: [
                    'Exceptions are faster than null checks',
                    'Null forces every caller to remember a check, and a forgotten one becomes a crash far from the cause; a thrown error fails loudly at the source with a name',
                    'It makes the method signature shorter',
                    'So the error can be logged centrally',
                  ],
                  answer: 1,
                  explanation:
                    'A null return is an invisible contract; the failure surfaces later as a confusing crash in unrelated code. A named error fails at the moment of truth with a reason attached. “Make illegal states loud” is a grading criterion in machine coding rounds.',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
