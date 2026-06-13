# The event loop & async patterns

JavaScript runs your code on **one thread**. Yet a Node server juggles 10,000 connections and your browser stays responsive during fetches. The machinery behind that trick is the event loop — and understanding it is what separates people who *use* async/await from people who can debug it.

## The restaurant with one waiter

A single waiter (the **call stack** — one thread) takes your order and hands it to the kitchen (**the runtime's I/O machinery** — network, timers, disk, which run *outside* your thread). The waiter doesn't stand at the kitchen window waiting — he serves other tables. When a dish is ready, the kitchen rings a bell and puts it on the pass (**the task queue**). Whenever the waiter is free, he grabs from the pass (**the event loop**: "is the stack empty? run the next queued callback").

```
call stack (your code, one frame at a time)
     ↑ runs callbacks
event loop  ←  task queues  ←  timers, network, I/O completing
```

One waiter, never idle, nothing "parallel" in your code — and the kitchen does the real waiting. That's `async`/`await`: `await fetch(url)` parks the current function (order sent to kitchen), frees the stack (waiter moves on), and resumes when the response lands in the queue.

## The two laws of the event loop

**Law 1: Don't block the waiter.** A synchronous 5-second loop means *nothing else runs* — every user of your server, frozen. CPU-heavy work belongs in worker threads (a second waiter), not on the event loop.

**Law 2: `await` is a gap, not glue.** Between an `await` and the next line, *any other code may have run*. Single-threaded does **not** mean race-free:

```js
// balance = 100. Two concurrent calls to withdraw(80):
async function withdraw(amount) {
  const balance = await getBalance();   // both calls read 100 here
  if (balance >= amount)
    await setBalance(balance - amount); // both write 20. Bank loses 60.
}
```

No threads, same disaster as the ATM table from last lesson — a **logical race** through the await gaps. The fix is the same shape too: a mutex. You'll build one next lesson, from nothing but promises.

## Sequential vs concurrent awaiting (the everyday win)

```js
// SLOW — sequential: 3 × 200ms = 600ms
const user = await fetchUser();
const orders = await fetchOrders();
const reviews = await fetchReviews();

// FAST — concurrent: all three in flight, total ≈ slowest ≈ 200ms
const [user, orders, reviews] =
  await Promise.all([fetchUser(), fetchOrders(), fetchReviews()]);
```

If request B doesn't need A's result, they should be in flight together. This one habit is the most common 3× latency win in real codebases. (Know the siblings: `allSettled` — wait for all, collect failures too; `race` — first to settle wins, great for timeouts.)

## The pattern you'll build: a concurrency limiter

`Promise.all` on 5,000 URLs fires **all 5,000 at once** — the API rate-limits you, sockets exhaust, things catch fire. What you want is a **pool**: at most N in flight; as each finishes, the next launches (not in fixed batches — *continuous* refill, like a worker pool).

```
promisePool(tasks, limit) →
  start tasks[0..limit-1]
  each completion pulls the next un-started task
  resolve with all results, in original order
```

Every serious codebase has this function (or imports `p-limit`). In the challenge ahead, you'll write it yourself — and the tests will measure that you actually capped the concurrency, not just produced the right answers.
