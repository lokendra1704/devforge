# Counting: the combinatorics behind the urn model

`P(A) = m/n` is only as easy as your ability to **count** `n` and `m`. Chapter 1's harder problems are really counting problems in disguise. Here are the tools.

## The three counting devices

| Device | Counts | Formula | "Order matters?" / "Repeats?" |
|---|---|---|---|
| **Permutations** | orderings of `n` items | `n!` | order matters, all used |
| **Arrangements** | ordered selections of `k` from `n` | `n!/(n−k)! = n(n−1)...(n−k+1)` | order matters, no repeats |
| **Combinations** | unordered selections of `k` from `n` | `C(n,k) = n! / (k!(n−k)!)` | order ignored, no repeats |

When draws are **with replacement** and order matters, the count is simply `nᵏ` (each of `k` draws has `n` choices).

## The hypergeometric pattern (drawing without replacement)

This single pattern solves a huge fraction of urn problems. From a batch of `k` articles containing `l` faulty ones, draw `r`; the probability that **exactly `s`** are faulty is

```
P = [ C(l, s) · C(k − l, r − s) ] / C(k, r)
```

Read it as: *(ways to pick the faulty ones) × (ways to pick the good ones) ÷ (ways to pick any `r`)*. The two-colour ball version (`a` white, `b` black, draw several, want a given split) is exactly this formula.

- Two balls drawn together, both white: `C(a,2)/C(a+b,2) = a(a−1) / [(a+b)(a+b−1)]`.
- The general "`kᵢ` of type `i`" multi-colour selection multiplies one combination per type, over `C(K, k)`.

## With vs without replacement — the two classic word problems

- **"table"** (5 *distinct* letter blocks): only `1` of `5!` orderings rebuilds the word, so `P = 1/5! = 1/120`.
- **"papaya"** (6 letters, with repeats — two `a`, two `p`... actually three `a`, two `p`): repeated letters are interchangeable, so favourable orderings `= 3!·2!` and `P = 3!·2!/6! = 1/60`. Repetition *raises* the probability because more arrangements count as "the same word."
- **All numbers different**, drawing `l` times from `k` labelled articles **with replacement**: `P = k(k−1)...(k−l+1) / kˡ` — arrangements over `kˡ`.

## Symmetry shortcuts beat brute counting

Many problems collapse if you spot a symmetry instead of grinding combinations:

- Five cards 1–5, draw two: P(second > first) = P(second < first) = **1/2** by symmetry — no counting needed.
- Items from factories I and II: P(an item from I appears before any from II) = `a/(a+b)` — only the relative order of the two relevant groups matters.
- `N` people seated at a round table: P(persons A and B adjacent) = **2/(N−1)** (seat A anywhere; B has `N−1` seats, 2 favourable). At a one-sided rectangular table it becomes **2/N**.

The book's lesson: *set up `n` and `m` by the cleanest counting argument you can find — and look for a symmetry that removes the counting entirely.*

*(Wentzel & Ovcharov, Ch. 1, problems 1.13–1.39.)*
