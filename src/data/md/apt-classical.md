# The urn model and the classical formula

When an experiment's outcomes are **symmetric** — no outcome favoured over another — the elementary events are **equipossible**, and probability becomes pure counting. This is the **urn model**, the workhorse of Chapter 1.

## The classical formula

If an experiment reduces to `n` equally likely cases and `m` of them are **favourable** to event `A`, then

```
P(A) = m / n          (favourable cases ÷ total cases)
```

**Worked example (the book's own).** Three white and four black balls are stirred in an urn; one is drawn at random. Label them 1–7 (first three white). Then `Ω = {1,...,7}`, the favourable set is `A = {1, 2, 3}`, and since the draw is symmetric across all balls,

```
P(white) = m / n = 3 / 7
```

## Single-draw urn facts worth memorising

With `a` white and `b` black balls, the symmetry of "draw at random" gives clean answers — and, crucially, they **do not depend on order or on what happened to balls you didn't look at**:

| Question | Answer |
|---|---|
| One ball drawn — is it white? | `a / (a + b)` |
| The *second* ball drawn (first colour unseen) is white? | `a / (a + b)` |
| The *last remaining* ball (all others drawn) is white? | `a / (a + b)` |
| A white was drawn and set aside — next ball white? | `(a − 1) / (a + b − 1)` |

The first, second, and last ball are all white with the *same* probability `a/(a+b)` — a symmetry result that surprises most people. Only once you **condition on information** (a white was removed) does the count change.

## The one trap: "equipossible" is a precondition, not a default

The formula `P(A) = m/n` is valid **only** when the `n` cases are genuinely equally likely. The book hammers this with problem 1.5: a coin is tossed until two heads or two tails appear in a row. The outcomes `{h,h}`, `{t,h,h}`, `{h,t,t}`, ... form an *infinite but countable* sample space — and each is **less probable than the one before**. They are not equipossible, so you **cannot** compute `P(A)` by dividing counts. Always check symmetry before you count.

## Reading the die directly

For a single fair die, count faces:

- `P(even) = {2,4,6} = 3/6 = 1/2`
- `P(score ≥ 5) = {5,6} = 2/6 = 1/3`
- `P(score ≤ 5) = {1,2,3,4,5} = 5/6`

Simple — but only because every face is equipossible.

*(Wentzel & Ovcharov, Ch. 1, §1.0 and problems 1.5–1.16.)*
