# Is DP actually impractical, or just sometimes?

"Dynamic programming" has a reputation for not scaling — the **curse of dimensionality**, the number of states blowing up exponentially with the number of state variables. That reputation is half-right and half a misunderstanding worth untangling.

> "Large state sets do create difficulties, but these are inherent difficulties of the problem, not of DP as a solution method. In fact, DP is comparatively better suited to handling large state spaces than competing methods such as direct search and linear programming." — Section 4.7

The actual numbers: a DP method finds the optimal policy in time **polynomial** in the number of states `n` and actions `m` — even though the number of *possible deterministic policies* is `m^n`, astronomically larger. A brute-force direct search over policy space would have to examine all `m^n` of them; DP is exponentially faster than that, guaranteed. Linear programming has better worst-case bounds in some regimes but becomes impractical at roughly 100x fewer states than DP can still handle. In practice, DP methods solve MDPs with **millions of states** on ordinary hardware.

| Method | Scales to | Worst-case guarantee |
|---|---|---|
| Direct policy search | tiny `n` | must examine all `m^n` policies |
| Linear programming | up to ~10⁴–10⁵ states | sometimes tighter than DP, but breaks down ~100x sooner |
| DP (policy/value iteration) | millions of states | polynomial in `n, m` |
| DP, asynchronous | even larger, *if* only a few states matter for optimal behavior | same guarantee, much better practical focus |

So where's the real ceiling? Two places: (1) the state space itself can be unrepresentably huge (`10^20` for backgammon — no amount of polynomial-time cleverness fits that in memory), and (2) **DP needs a complete and accurate model** of the environment's transition probabilities `p(s',r|s,a)` — something you simply don't have for most real problems. Those are the two threads the rest of Part I pulls on: Monte Carlo methods (next chapter) drop the model requirement entirely; function approximation (Chapter 9) drops the requirement that the state space fit in a table.

> **What's one case where DP fails even though the math is fine?** A model-free robot with continuous, never-fully-known transition dynamics — DP can't even start, because step one of every DP backup is "sum over `p(s',r|s,a)`," and you don't have that distribution.
