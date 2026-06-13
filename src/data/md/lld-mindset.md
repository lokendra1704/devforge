# Machine coding: what interviewers actually grade

The machine coding round ("build an LRU cache", "design a parking lot", "build Splitwise in 90 minutes") is **not** an algorithms round. People fail it with perfect algorithms and pass it with average ones. Here's the real rubric.

## What's actually being graded

1. **Working code first.** A complete, running solution with one missing feature beats a beautiful half-finished abstraction. Interviewers consistently rank "did it work?" above everything.
2. **Separation of concerns.** Does your parking lot mix pricing logic into the slot-allocation code? Can the pricing rules change without touching allocation? This is the #1 design signal.
3. **Naming and readability.** `assignSlot(vehicle)` vs `process(v)`. Reviewers read your code cold — they grade what it *says*, not what you meant.
4. **Edge-case instinct.** What happens on capacity 0? Duplicate insert? Removing something absent? Asking these *out loud before coding* is worth more than handling them silently.
5. **Testability.** Even without a test framework: small pure functions, dependencies passed in (clock, ID generator) rather than reached for globally.

## The 90-minute protocol

| Time | Activity |
|---|---|
| 0–10 min | Requirements. Ask questions. Write down entities & operations |
| 10–20 min | Skeleton: classes, method signatures, no bodies |
| 20–70 min | Implement in **dependency order** — innermost entity first |
| 70–85 min | Demo path: a main() that exercises every requirement |
| 85–90 min | Cleanup pass: names, dead code, TODOs for known gaps |

The candidates who fail usually spent minutes 0–40 building an elaborate framework for requirements nobody asked for. **YAGNI is a grading criterion.**

## The two superpowers

**Superpower 1: composition of small classes.** A `ParkingLot` *has* `Floor`s which *have* `Slot`s; a `FeeCalculator` is its own object. When the interviewer says "now add EV charging slots" (they always extend the problem), you add a slot type — not rewrite a god class.

**Superpower 2: inject what varies.** Pass the clock in (`new RateLimiter({ now: () => Date.now() })`). Suddenly your rate limiter is testable without real time, and your fee calculator can be unit-tested for "parked 3 days". Interviewers who see injected clocks know immediately you've written production code.

## What we'll build

Three classics, each chosen because it teaches a transferable internal structure:

- **LRU cache** — combining two data structures to get O(1) where each alone gives O(n)
- **Rate limiter** — time-based state machines + the injected clock trick
- **Parking lot** — entity modeling and separation of concerns (the OOD interview itself)

Build them here against real tests, and the interview version becomes a re-run.
