# Two Pointers: squeeze the search space

**The real-life version first.** You and a friend are looking for two products in a price-sorted catalog that together cost exactly your ₹3,000 gift card. You start at the cheapest item, your friend starts at the most expensive. Too cheap together? You move up. Too expensive? Your friend moves down. You never look at the same pair twice, and you never *need* to.

That's the whole algorithm. Now the engineering version.

## The brute force you must outgrow

To find two numbers in an array that sum to a target, the obvious approach checks every pair:

```js
for (let i = 0; i < n; i++)
  for (let j = i + 1; j < n; j++)
    if (arr[i] + arr[j] === target) return [i, j];
```

That's **O(n²)** — 10,000 elements means ~50 million checks. Interviewers see this and wait for you to do better.

## The insight: sorted order is information

If the array is **sorted**, one comparison tells you about *many* pairs at once:

- Put `L` at the start (smallest) and `R` at the end (largest).
- If `arr[L] + arr[R] < target`: the sum is too small **even with the largest possible partner**. So `arr[L]` can never be part of the answer — discard it forever. `L++`.
- If the sum is too big: `arr[R]` is useless even with the smallest partner. `R--`.

Every step **permanently eliminates one element**. After at most `n` steps, you've either found the pair or proven none exists. **O(n) time, O(1) space.**

## The invariant (say this in interviews)

> "At every moment, any answer must lie between L and R. Everything outside has been *proven* impossible."

That sentence is what separates "I memorized this" from "I understand this."

## Where this pattern re-skins itself

- **3Sum** — fix one element, run two pointers on the rest
- **Container With Most Water** — pointers at both ends, move the *shorter* wall inward
- **Trapping Rain Water** — same skeleton, harder bookkeeping
- **Remove duplicates in-place / move zeroes** — slow & fast pointer variant
- **Valid Palindrome** — pointers race toward the middle

Next: watch it run, step by step.
