# Threads, races, and locks

In 2012, Knight Capital deployed code with a concurrency bug and lost **$440 million in 45 minutes**. Race conditions are not an academic topic — they're the most expensive class of bug in software. Let's build one, understand it, and learn the tools that kill it.

## The bug that ate the bank

Two ATM withdrawals hit the same account (balance ₹10,000) at the same moment, on two threads:

```
read balance → check ≥ amount → write (balance − amount)
```

| Time | Thread A (withdraw 8,000) | Thread B (withdraw 8,000) |
|---|---|---|
| t1 | reads balance: 10,000 | |
| t2 | | reads balance: 10,000 |
| t3 | 10,000 ≥ 8,000 ✓ | |
| t4 | | 10,000 ≥ 8,000 ✓ |
| t5 | writes 2,000 | |
| t6 | | writes 2,000 |

Both withdrawals succeed. The bank handed out ₹16,000 and recorded a ₹2,000 balance. No crash, no error, no log line — just wrong money.

**The anatomy:** check-then-act (and its cousin read-modify-write, like `count++`) is *not atomic* — a thread can be interleaved mid-sequence. Even `count++` is secretly three machine steps (load, add, store); two threads doing it 1,000 times each can produce anything from 1,001 to 2,000.

**The cruelty:** races are *timing-dependent*. The code passes every test, runs fine for months, then corrupts data on Diwali traffic. Then you add a print statement to debug it — which changes the timing — and the bug vanishes (a "heisenbug").

## The fix: mutual exclusion

A **mutex** (lock) makes the sequence atomic — at most one thread inside the *critical section* at a time:

```
lock.acquire()      // others arriving here WAIT
try:
    read → check → write     // the critical section, now indivisible
finally:
    lock.release()  // ALWAYS release - even on exceptions (hence finally)
```

Thread B now blocks at `acquire()` until A finishes; B then reads 2,000, the check fails, the money is safe.

## The new monsters locks invite

1. **Deadlock.** Thread 1 holds lock A, wants B. Thread 2 holds B, wants A. Both wait forever; the app freezes. Standard cure: **all threads acquire locks in the same global order** (always A before B) — cycles become impossible. (Remember the two-gates parking-slot race from the LLD track? Its naive lock fix can deadlock exactly this way.)
2. **Contention.** One big lock around everything = your 32 cores take turns single-file — parallelism destroyed by the safety mechanism. The art is locking the *smallest thing for the shortest time*.
3. **Forgotten release.** An exception between acquire and release leaves the lock stuck forever. Hence `try/finally`, RAII in C++, `with lock:` in Python.

## The escape hatches (modern practice)

- **Atomic operations** — hardware-level indivisible compare-and-swap / fetch-and-add for counters and flags; lock-free and fast.
- **Don't share at all** — message passing (Go channels, actor model: "share memory by communicating"), or immutable data (can't corrupt what nobody can modify). This is the direction the industry keeps moving.
- **Single-threaded event loops** — JavaScript's answer: only one thread touches state, so data races of this kind *can't happen*… though you'll meet their async cousin (logical races between awaits) two lessons from now, and build a mutex of your own to kill it.
