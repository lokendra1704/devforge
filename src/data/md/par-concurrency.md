# Concurrency ≠ parallelism

These words get used interchangeably. They are not the same thing, and the difference decides what tool you reach for. The kitchen makes it obvious.

## The kitchen model

- **One chef, one dish at a time** — sequential. While the rice simmers for 20 minutes, the chef stares at the pot.
- **One chef juggling four dishes** — *concurrency*. Rice simmering? Start chopping for the curry. Oven busy? Plate the salad. **One worker, many tasks in flight**, progress by switching during waits. Nothing literally happens simultaneously — it just never wastes a wait.
- **Four chefs, four dishes** — *parallelism*. Four pairs of hands, four things **literally happening at the same instant**. Requires more workers (more cores).

> **Concurrency is a way to structure work. Parallelism is a way to execute it.** Rob Pike's version: concurrency is dealing with many things at once; parallelism is *doing* many things at once.

## Why the distinction pays your salary

The right tool depends on **why your code is slow**:

### I/O-bound work → concurrency is enough
A web server waiting 200ms for a database response is the chef staring at rice. You don't need more chefs — you need that one chef to *do something else while waiting*. This is why **Node.js handles 10,000 simultaneous connections on one thread**: nearly all of a request's lifetime is waiting (network, DB, disk), and waits cost nothing if you switch away. async/await, event loops, epoll — all concurrency machinery.

### CPU-bound work → only parallelism helps
Resizing 10,000 images is pure computation: there is no "wait" to exploit. A single chef juggling harder doesn't chop faster — async/await does **nothing** here. You need actual extra hands: more cores via threads/processes (or a GPU, which you now know is 10,000 hands).

Mislabeling the bottleneck produces the two classic facepalms: adding async to a CPU-bound image pipeline (zero speedup, extra complexity) and spinning up a thread pool for an I/O-bound API client (overhead, races, no gain — the threads all just… wait, expensively).

## The cost table

| Mechanism | What it buys | What it costs |
|---|---|---|
| **Async / event loop** | huge I/O concurrency on one thread | no CPU scaling; one blocking call freezes everything |
| **Threads** | true parallelism, shared memory | races, locks, and the hardest bugs of your life (next lesson) |
| **Processes** | parallelism + isolation (a crash stays contained) | heavier; data must be copied/messaged between them |
| **GPU** | parallelism × 10,000 for uniform data | only fits GPU-shaped work; transfer overhead |

## The two questions that pick the tool

1. **Is it I/O-bound or CPU-bound?** (Profile! Waiting → concurrency. Computing → parallelism.)
2. **Does the work share state?** Independent tasks → processes or simple pools, sleep easy. Shared mutable state → threads + locks, welcome to the next lesson.

This track walks the full ladder: races and locks → the event loop and async patterns (you'll build real concurrency primitives) → SIMD and how it all connects back to the GPU track.
