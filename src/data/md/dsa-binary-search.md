# Binary Search: on arrays — and on answers

Everyone knows the array version: sorted array, check the middle, discard half, repeat. 1,000,000 elements → found in **20 comparisons**. You already use it in real life when you `git bisect` a bad deploy: 200 commits, 8 checkouts, culprit found.

The version that gets people hired is different: **binary search on the answer space**.

## Binary search on answers

Sometimes nothing in the problem is sorted — but the **answers** are. Classic problem (*Koko Eating Bananas*, a real Meta question):

> Koko has piles of bananas `[3, 6, 7, 11]` and `h = 8` hours. Each hour she eats up to `k` bananas from one pile. Find the **minimum k** so she finishes in time.

Check the structure:

- If she can finish at speed `k`, she can finish at any speed faster than `k`. ✅
- If she can't finish at speed `k`, no slower speed works either. ✅

So the answer space looks like: `❌ ❌ ❌ ❌ ✅ ✅ ✅ ✅` — a sorted boolean array! Binary search for the **first ✅**:

```js
let lo = 1, hi = Math.max(...piles);
while (lo < hi) {
  const mid = (lo + hi) >> 1;
  if (canFinish(piles, h, mid)) hi = mid;   // works → try slower
  else lo = mid + 1;                        // too slow → must go faster
}
return lo;
```

`canFinish` is a simple O(n) check. Total: **O(n log maxPile)**.

## The recognition checklist

Binary search on answers applies when:

1. The question asks for **"minimum X such that…"** or **"maximum X such that…"**
2. You can write a `check(x)` function that's **monotonic** — once true, always true (or once false, always false)

Real problems wearing this costume:

- *Split array into m parts minimizing the largest sum* (Google)
- *Minimum days to make m bouquets* (LeetCode 1482)
- *Capacity to ship packages within D days*
- **Real life:** "What's the max requests/sec this service handles?" — load test is your `check(x)`; you binary search the throughput.

## Two bugs that kill candidates

1. **Infinite loop:** with `lo = mid` style updates, `(lo+hi)/2` rounds down and can repeat forever. Rule of thumb: use `lo < hi` with `hi = mid` / `lo = mid + 1` and you're safe.
2. **Off-by-one at the boundary:** always ask "is `mid` still a candidate?" If yes, keep it in the range (`hi = mid`), don't skip it (`hi = mid - 1`).

Next: watch the search space get cut in half, then implement Koko yourself.
