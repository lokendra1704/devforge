# Sliding Window: stop recomputing what you already know

**Real-life version.** Netflix wants the best 7-day stretch of signups this quarter. The intern computes each 7-day sum from scratch: 90 windows × 7 additions. The senior engineer computes the first window once, then for each slide does **one subtraction (the day that left) and one addition (the day that entered)**. Same answer, 7× less work — and the gap grows with window size.

That's the sliding window: a moving range over an array/string where you **update incrementally instead of recomputing**.

## Two flavors

### 1. Fixed-size window
"Max sum of any subarray of size k."

```js
let sum = 0, best = 0;
for (let i = 0; i < nums.length; i++) {
  sum += nums[i];              // element enters
  if (i >= k) sum -= nums[i - k]; // element leaves
  if (i >= k - 1) best = Math.max(best, sum);
}
```

### 2. Variable-size window (the interview favorite)
"**Longest** substring/subarray such that *some rule holds*."

The skeleton is always the same:

```js
let left = 0;
for (let right = 0; right < n; right++) {
  // 1. add s[right] to the window state
  while (/* window violates the rule */) {
    // 2. remove s[left] from state; left++
  }
  // 3. window [left..right] is valid — record the best
}
```

The rule changes per problem (no repeated chars, at most K distinct, sum ≤ target…). The skeleton never does.

## Why it's O(n), not O(n²)

It *looks* like nested loops. But `left` only ever moves **forward** — across the whole run, `left` advances at most `n` times total. Each element enters the window once and leaves once. **2n operations.** This is called *amortized analysis* — worth saying out loud in an interview.

## The invariant

> "The window is always the **largest valid window ending at `right`**. We never re-shrink what we've already proven."

## Trigger words → this pattern

- "longest substring with…" / "smallest subarray such that…"
- "max sum of subarray of size k"
- "at most K distinct characters"
- anything **contiguous** with a constraint

**Anti-trigger:** if the answer can be *non-contiguous* (subsequence, not substring), sliding window usually breaks — think DP instead.

Next: watch the window glide and slam shut on duplicates.
