# Geometric probability: when outcomes are points in a region

The urn model needs a *finite* set of equally likely cases. But what if a "point object" is thrown at random into a region, and **every position is equally likely**? There are uncountably many outcomes — yet symmetry still works, if we replace *counting* with *measuring*.

## The geometric formula

Let the sample space `Ω` be a region, and event `A` a sub-region. When all positions are equally likely, probability is a **ratio of measures**:

```
P(A) = S_A / S_Ω      (areas, in 2-D)
```

Use **lengths** in 1-D and **volumes** in 3-D — same idea, different measure. The phrase **"at random"** in these problems is exactly the promise that the distribution is uniform over the region.

## The book's anchor examples

| Problem | Setup | Answer |
|---|---|---|
| Two points on `[0, 2]`, distance `< 1`? | square side 2, hatched band | `3/4` |
| Radar blip within `r/2` of centre | disc area ratio `(π(r/2)²)/(πr²)` | `1/4` |
| Broken stick forms a triangle | triangular region in the `x, y` plane | `1/4` |
| Buffon's needle hits a line | rectangle `Ω`, sine curve bounds `A` | `2ℓ / (πL)` |

## Why these answers fall out

**Distance between two random points on `[0,2]` is `< 1`.** Coordinates `(x, y)` fill a 2×2 square (`S_Ω = 4`). The event `|x − y| < 1` is the band around the diagonal; the *excluded* corners are two triangles of area `1/2` each, so `S_A = 4 − 1 = 3` and `P = 3/4`.

**Broken stick → triangle.** Break a unit stick at two points; pieces `x`, `y`, `1−x−y` form a triangle only if no piece exceeds `1/2` (each side less than the sum of the others). That condition carves a small triangle of area `1/8` out of the sample triangle of area `1/2`, giving `P = (1/8)/(1/2) = 1/4`.

**Buffon's needle** (a needle of length `ℓ ≤ L` dropped on a plane ruled with lines `L` apart). Describe a throw by the centre's distance `x` from the nearest line and the angle `φ`. The sample space is a rectangle of area `L/2 · π/2`; the needle crosses a line when `x < (ℓ/2)·sin φ`, whose area is `ℓ/2`. Hence

```
P(hit) = (ℓ/2) / (Lπ/4) = 2ℓ / (πL)
```

Buffon used this in the 18th century to **estimate π** experimentally: throw the needle many times, and `π ≈ 2ℓN / (L · hits)`. Geometry, probability, and a famous constant in one problem.

*(Wentzel & Ovcharov, Ch. 1, §1.0 and problems 1.40–1.45.)*
