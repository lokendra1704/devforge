import type { Subject } from '../types'
import concurrencyMd from './md/par-concurrency.md?raw'
import racesMd from './md/par-races.md?raw'
import asyncMd from './md/par-async.md?raw'
import hardwareMd from './md/par-hardware.md?raw'

export const parallelism: Subject = {
  id: 'parallel',
  title: 'Parallelism',
  tagline: 'Threads, async, races, and locks — from the event loop to SIMD and back to GPUs.',
  icon: '🧵',
  accent: '#22d3ee',
  modules: [
    {
      id: 'par-m1',
      title: 'The Mental Model',
      description: 'Concurrency vs parallelism, and the bug that costs millions.',
      lessons: [
        {
          id: 'par-concurrency',
          title: 'Concurrency ≠ parallelism',
          minutes: 12,
          xp: 60,
          steps: [
            { kind: 'read', title: 'The kitchen model', markdown: concurrencyMd },
            {
              kind: 'quiz',
              title: 'Pick the right tool',
              questions: [
                {
                  prompt:
                    'Your API endpoint takes 800ms: 750ms waiting on three sequential database queries, 50ms of computation. A teammate suggests rewriting it in a multithreaded language for speed. Better idea?',
                  options: [
                    'Agree — threads will parallelize the queries',
                    'It is I/O-bound: make the independent queries concurrent (e.g. fire them together) — no extra threads needed',
                    'Move the computation to a worker pool',
                    'Add more CPU cores to the server',
                  ],
                  answer: 1,
                  explanation:
                    'The endpoint spends 94% of its time WAITING — that is a concurrency problem, not a parallelism problem. If the queries are independent, overlapping them cuts ~750ms to ~250ms on the same single thread. Threads/cores attack the 50ms of compute: the wrong 6%.',
                },
                {
                  prompt:
                    'A Node.js service must generate thumbnails for uploaded videos (heavy CPU work). Users report the whole API freezes during processing. Why?',
                  options: [
                    'Node is too slow for video processing',
                    'CPU-bound work on the event-loop thread blocks EVERYTHING — async/await cannot help because nothing is waiting',
                    'The thumbnails are too large for the V8 heap',
                    'Too many concurrent uploads exhausted the thread pool',
                  ],
                  answer: 1,
                  explanation:
                    'The event loop’s superpower — handling 10k connections on one thread — assumes that thread is never hogged. Transcoding has no I/O waits to switch away during; it just computes, and every other request queues behind it. Fix: worker threads or a separate processing service. Law 1: don’t block the waiter.',
                },
                {
                  prompt: 'Which statement is TRUE?',
                  options: [
                    'Concurrency requires multiple CPU cores',
                    'Parallelism is impossible without concurrency',
                    'A single-core machine can be concurrent but never parallel',
                    'Async/await provides parallelism for CPU work',
                  ],
                  answer: 2,
                  explanation:
                    'One core can interleave many in-flight tasks (concurrency) but can only ever execute one instruction stream at an instant — no parallelism. The juggling chef has one pair of hands. Multiple simultaneous executions require multiple workers: cores, processors, or GPU lanes.',
                },
              ],
            },
          ],
        },
        {
          id: 'par-races',
          title: 'Threads, races, and locks',
          minutes: 14,
          xp: 70,
          steps: [
            { kind: 'read', title: 'The $440M bug class', markdown: racesMd },
            {
              kind: 'quiz',
              title: 'Race detective',
              questions: [
                {
                  prompt:
                    'Two threads each run counter++ 1000 times on a shared counter (counter++ = load, add, store). Which final value is IMPOSSIBLE?',
                  options: ['2000', '1547', '1000', '2100'],
                  answer: 3,
                  explanation:
                    'Interleavings can LOSE increments (both load the same value, both store, one update vanishes) so anything from ~1000 up to 2000 can occur. But a lost update never CREATES increments — exceeding 2000 is impossible. If you said 2000 is impossible: it happens whenever no interleaving collides (e.g. one thread finishes first).',
                },
                {
                  prompt:
                    'Thread 1: lock(A) then lock(B). Thread 2: lock(B) then lock(A). Occasionally the entire app freezes with no error. What happened, and what is the standard fix?',
                  options: [
                    'Livelock; add random sleeps between acquisitions',
                    'Deadlock — each holds what the other needs; fix by making ALL threads acquire locks in one global order',
                    'Starvation; raise thread priorities',
                    'A race condition; add a third lock around both',
                  ],
                  answer: 1,
                  explanation:
                    'T1 holds A waiting for B; T2 holds B waiting for A — a cycle, so both wait forever, silently. With a global lock order (always A before B), a cycle cannot form: whoever gets A first will also get B. Random sleeps merely make the freeze rarer and harder to reproduce; the third lock just moves the problem.',
                },
                {
                  prompt: 'Why do race conditions routinely survive testing and reach production?',
                  options: [
                    'Test frameworks disable threading',
                    'They are timing-dependent: the buggy interleaving may need precise, rare scheduling that test machines almost never produce',
                    'Compilers remove them in debug builds',
                    'They only occur on specific CPU vendors',
                  ],
                  answer: 1,
                  explanation:
                    'The race window can be nanoseconds wide; with light test traffic the schedule rarely lands in it. Production adds load, more cores, and time — millions of dice rolls. Worse, adding logging changes the timing and hides the bug (the heisenbug). Defense: design races out (locks, atomics, immutability, message passing) rather than testing them out.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'par-m2',
      title: 'Async Mastery',
      description: 'The event loop, then build the primitives: a pool and a mutex.',
      lessons: [
        {
          id: 'par-async',
          title: 'The event loop & the concurrency limiter',
          minutes: 25,
          xp: 130,
          steps: [
            { kind: 'read', title: 'One waiter, 10,000 tables', markdown: asyncMd },
            {
              kind: 'code',
              title: 'Build promisePool',
              challenge: {
                prompt: `## Build promisePool(tasks, limit)

The utility every production codebase needs (it is the heart of the p-limit npm package, ~50M downloads/week).

- \`tasks\` — array of **functions**, each returning a promise (not yet started!)
- \`limit\` — max tasks in flight at once
- Returns a promise of **all results in the original task order**

**Required behavior (the tests measure it):**
1. Never more than \`limit\` tasks running simultaneously
2. **Continuous refill** — the moment one task finishes, the next pending one starts (not batch-by-batch)
3. Results keep task order, regardless of completion order

**Hint — the worker pattern:** keep a shared cursor \`next\`. Start \`limit\` async workers; each worker loops: claim index \`next++\`, run \`tasks[i]\`, store \`results[i]\`, repeat until tasks run out. \`await Promise.all(workers)\`, return results. (Claiming the index synchronously before any await is what makes this race-free.)

You have \`sleep(ms)\` available in tests and code.`,
                starterCode: `async function promisePool(tasks, limit) {
  const results = new Array(tasks.length);
  let next = 0;

  async function worker() {
    // loop: claim an index (next++) BEFORE awaiting anything,
    // run that task, store its result, continue until none left

  }

  // start min(limit, tasks.length) workers and wait for all of them

  return results;
}`,
                solution: `async function promisePool(tasks, limit) {
  const results = new Array(tasks.length);
  let next = 0;

  async function worker() {
    while (next < tasks.length) {
      const i = next++; // sync claim: no two workers get the same index
      results[i] = await tasks[i]();
    }
  }

  const workers = [];
  for (let w = 0; w < Math.min(limit, tasks.length); w++) {
    workers.push(worker());
  }
  await Promise.all(workers);
  return results;
}`,
                tests: `test('returns all results in original order', async () => {
  const tasks = [
    async () => { await sleep(30); return 'a'; },
    async () => { await sleep(10); return 'b'; },
    async () => { await sleep(20); return 'c'; },
  ];
  assertEqual(await promisePool(tasks, 2), ['a', 'b', 'c']);
});
test('never exceeds the concurrency limit', async () => {
  let active = 0, maxActive = 0;
  const make = () => async () => {
    active++; maxActive = Math.max(maxActive, active);
    await sleep(15);
    active--;
    return active;
  };
  await promisePool(Array.from({ length: 9 }, make), 3);
  assertEqual(maxActive <= 3, true, 'ran ' + maxActive + ' tasks at once (limit 3)');
});
test('actually runs concurrently, not sequentially', async () => {
  const start = Date.now();
  const tasks = Array.from({ length: 6 }, () => async () => { await sleep(40); });
  await promisePool(tasks, 3);
  const elapsed = Date.now() - start;
  assertEqual(elapsed < 200, true, 'took ' + elapsed + 'ms — 6x40ms tasks at limit 3 should be ~80ms');
});
test('continuous refill: a finished slot starts the next task immediately', async () => {
  const order = [];
  const tasks = [
    async () => { await sleep(60); order.push('slow'); },
    async () => { await sleep(10); order.push('quick1'); },
    async () => { await sleep(10); order.push('quick2'); },
    async () => { await sleep(10); order.push('quick3'); },
  ];
  await promisePool(tasks, 2);
  assertEqual(order, ['quick1', 'quick2', 'quick3', 'slow']);
});
test('limit larger than task count works', async () => {
  const tasks = [async () => 1, async () => 2];
  assertEqual(await promisePool(tasks, 10), [1, 2]);
});
test('handles an empty task list', async () => {
  assertEqual(await promisePool([], 4), []);
});`,
              },
            },
          ],
        },
        {
          id: 'par-mutex',
          title: 'Build a mutex from promises',
          minutes: 25,
          xp: 130,
          steps: [
            {
              kind: 'code',
              title: 'Implement Mutex',
              challenge: {
                prompt: `## Build a Mutex — and fix the double-spend

Last lesson's read showed that single-threaded JS still has **logical races**: between an \`await\` and the next line, other code runs. Two concurrent \`withdraw()\` calls both read the old balance through the await gap, both pass the check — the bank double-spends. Here you build the cure.

Implement a promise-based \`Mutex\`:

- \`acquire()\` → resolves to a \`release\` **function**. If the mutex is free, resolve immediately (and become locked). If locked, wait in a **FIFO queue**.
- Calling \`release()\` hands the lock to the next waiter, or frees the mutex if none.
- \`runExclusive(fn)\` → convenience: acquire, \`await fn()\`, **always release (even if fn throws)**, return fn's result.

**Hint:** keep \`locked\` (boolean) and \`queue\` (array of resolve-functions). \`acquire()\` returns \`new Promise(resolve => ...)\` — if free, lock and resolve now; else push a thunk onto the queue that release() will call later.`,
                starterCode: `class Mutex {
  constructor() {
    this.locked = false;
    this.queue = [];
  }

  acquire() {
    // return a Promise resolving to a release() function
    // free  -> lock, resolve immediately
    // taken -> queue the resolver (FIFO)

  }

  async runExclusive(fn) {
    // acquire, run fn, ALWAYS release (try/finally), return fn's result

  }
}`,
                solution: `class Mutex {
  constructor() {
    this.locked = false;
    this.queue = [];
  }

  acquire() {
    return new Promise((resolve) => {
      const release = () => {
        const nextWaiter = this.queue.shift();
        if (nextWaiter) nextWaiter();      // hand the lock straight over
        else this.locked = false;          // nobody waiting: free it
      };
      if (!this.locked) {
        this.locked = true;
        resolve(release);
      } else {
        this.queue.push(() => resolve(release));
      }
    });
  }

  async runExclusive(fn) {
    const release = await this.acquire();
    try {
      return await fn();
    } finally {
      release();                            // even when fn throws
    }
  }
}`,
                tests: `test('a free mutex acquires immediately', async () => {
  const m = new Mutex();
  const release = await m.acquire();
  assertEqual(typeof release, 'function');
  release();
});
test('second acquire waits until first releases', async () => {
  const m = new Mutex();
  const events = [];
  const r1 = await m.acquire();
  const second = m.acquire().then((r2) => { events.push('got-lock'); r2(); });
  await sleep(20);
  events.push('releasing');
  r1();
  await second;
  assertEqual(events, ['releasing', 'got-lock']);
});
test('waiters are served in FIFO order', async () => {
  const m = new Mutex();
  const order = [];
  const r = await m.acquire();
  const waiters = [1, 2, 3].map((n) =>
    m.acquire().then((rel) => { order.push(n); rel(); })
  );
  r();
  await Promise.all(waiters);
  assertEqual(order, [1, 2, 3]);
});
test('runExclusive releases even when fn throws', async () => {
  const m = new Mutex();
  let threw = false;
  try {
    await m.runExclusive(async () => { throw new Error('boom'); });
  } catch { threw = true; }
  assertEqual(threw, true);
  const release = await m.acquire(); // would hang forever if not released
  release();
});
test('THE PAYOFF: mutex fixes the double-spend race', async () => {
  let balance = 100;
  const getBalance = async () => { await sleep(10); return balance; };
  const setBalance = async (v) => { await sleep(10); balance = v; };

  // racy version loses money: both reads happen before either write
  const racyWithdraw = async (amt) => {
    const b = await getBalance();
    if (b >= amt) { await setBalance(b - amt); return true; }
    return false;
  };
  const racyResults = await Promise.all([racyWithdraw(80), racyWithdraw(80)]);
  assertEqual(racyResults, [true, true], 'both withdrawals "succeeded"');
  assertEqual(balance, 20, 'bank handed out 160 but balance only dropped 80');

  // mutex-protected version: second withdrawal correctly denied
  balance = 100;
  const m = new Mutex();
  const safeWithdraw = (amt) => m.runExclusive(async () => {
    const b = await getBalance();
    if (b >= amt) { await setBalance(b - amt); return true; }
    return false;
  });
  const safeResults = await Promise.all([safeWithdraw(80), safeWithdraw(80)]);
  assertEqual(safeResults, [true, false]);
  assertEqual(balance, 20);
});
test('runExclusive returns the function result', async () => {
  const m = new Mutex();
  assertEqual(await m.runExclusive(async () => 42), 42);
});`,
              },
            },
          ],
        },
      ],
    },
    {
      id: 'par-m3',
      title: 'Down to the Metal',
      description: 'SIMD, multi-core, reduction — the full hardware map.',
      lessons: [
        {
          id: 'par-hardware',
          title: 'CPU & GPU parallelism: the full map',
          minutes: 14,
          xp: 70,
          steps: [
            { kind: 'read', title: 'Five levels of parallel', markdown: hardwareMd },
            {
              kind: 'quiz',
              title: 'The decision tree',
              questions: [
                {
                  prompt:
                    'You must apply the same numeric transform to a 40-million-row column of floats, in-process, on a CPU. Which level of parallelism is the FIRST win?',
                  options: [
                    'Spawn 40 threads',
                    'SIMD — contiguous numeric data with one uniform operation is exactly what vector instructions eat (then add cores on top)',
                    'An async worker queue',
                    'Send it to a cluster',
                  ],
                  answer: 1,
                  explanation:
                    'Uniform op over contiguous numbers is the SIMD shape: ~16 floats per instruction before you spend a single extra thread. Then multiply by cores (levels stack). Async adds nothing (no I/O waits), and a cluster pays network costs to do what one machine does in milliseconds.',
                },
                {
                  prompt: 'Why does summing 1 billion numbers across 100 networked machines often LOSE to one machine with a GPU?',
                  options: [
                    'The machines cannot agree on floating-point rounding',
                    'Shipping the data over the network costs far more than the computation saves — parallelism overhead exceeded the work',
                    '100 machines cannot sum in parallel because addition is sequential',
                    'It never loses; more machines is always faster',
                  ],
                  answer: 1,
                  explanation:
                    'The sum itself is trivial; moving 4–8 GB across a network is not. Distribution only wins when data already lives on those machines or computation per byte is enormous. “Parallelism has overhead, and scaling past the problem makes it slower” — knowing where to stop is part of the skill.',
                },
                {
                  prompt:
                    'Parallel summation uses the split → partial results → combine-in-a-tree shape. Where else does this exact pattern appear?',
                  options: [
                    'Only in CPU SIMD code',
                    'GPU reduction kernels and MapReduce/Spark — the same shape from one chip to a datacenter',
                    'It is unique to summation',
                    'In mutexes and locks',
                  ],
                  answer: 1,
                  explanation:
                    'Reduction is the same algorithm at every scale: SIMD lanes combining registers, GPU blocks reducing in shared memory then across blocks, and MapReduce literally naming the two phases. Learn a pattern once, recognize it everywhere — the thesis of this entire platform, one last time.',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
