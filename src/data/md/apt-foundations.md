# Events, the sample space, and the language of sets

Probability theory is the mathematical study of **random phenomena** — experiments whose outcome is not known in advance. An **event** is simply an outcome (or set of outcomes) of a trial: six dots on a die, a device failing within its service life, a message arriving distorted over a channel. Every event carries a number describing how likely it is — its **probability**.

## Two ways people define "probability"

| Approach | Idea | Formula |
|---|---|---|
| **Classical** | Count favourable outcomes, divide by all equally-likely outcomes | `P(A) = m / n` |
| **Frequency / statistical** | The long-run share of trials in which the event occurs | `P(A) ≈ (occurrences) / N`, as `N → ∞` |

The modern, rigorous construction sits on top of **set theory** — so we speak the language of sets.

## Set-theory vocabulary you will use constantly

- **Sample space `Ω`** — the set of *all possible* elementary outcomes of an experiment. Tossing a die: `Ω = {1, 2, 3, 4, 5, 6}`.
- **Elementary event `ω`** — a single outcome, one element of `Ω`.
- **Event `A`** — *any subset* of `Ω`. "An even score" is the event `A = {2, 4, 6} ⊆ Ω`.
- **Union `A ∪ B`** (logical sum) — outcomes in `A` *or* `B` (or both). "At least one of."
- **Intersection `A ∩ B`** (logical product, often written `AB`) — outcomes in `A` *and* `B`. "Both."
- **Empty set `∅`** — no elements; it is a subset of every set.

## Four classifications that decide which formula you may use

These four terms appear in the chapter's very first problems, so pin them down:

- **Certain event** — equals the whole space `Ω`; it must occur. (A die score not exceeding 6.)
- **Impossible event** — the empty set `∅`; it cannot occur. (A score of 7 on one die.)
- **Incompatible / mutually exclusive** — `A ∩ B = ∅`: the occurrence of one *precludes* the other. Several events are (pairwise) incompatible if no two can happen together.
- **Complete group** — events whose union is the whole space: `A₁ ∪ A₂ ∪ ... ∪ Aₙ = Ω`. At least one of them is *certain* to occur.
- **Equipossible** — events with the *same* probability by symmetry of the experiment (each face of a fair die).

A set of events that is **incompatible, complete, *and* equipossible** is called a set of **cases** (or chances). That is the magic combination the next lesson needs.

## The axioms (everything else is built from these)

1. **Bounds:** `0 ≤ P(A) ≤ 1`.
2. **Addition rule (for mutually exclusive events):** if `A ∩ B = ∅`, then `P(A ∪ B) = P(A) + P(B)`. This generalises to any finite — or countable — collection of pairwise-incompatible events.

The certain event has probability 1; the impossible event has probability 0. Everything in this book is, ultimately, careful bookkeeping with these rules.

*(Wentzel & Ovcharov, Ch. 1, §1.0 and problems 1.1–1.4.)*
