## Three normalization schemes, one general shape

Layer normalization isn't the only re-parameterization trick in this space. The
paper also discusses **weight normalization** [Salimans and Kingma, 2016], which
normalizes a neuron's summed input by the L2 norm of its incoming weight vector
instead of a data-derived variance. All three methods — batch norm, weight norm,
layer norm — turn out to share the exact same general form:

> "These methods can be summarized as normalizing the summed inputs aᵢ to a neuron
> through the two scalars µ and σ... hᵢ = f(gᵢ/σᵢ·(aᵢ − µᵢ) + bᵢ)" — *Section 5.1, Eq. 5*

They only differ in **what µ and σ actually measure**:

| Method | µ | σ |
|---|---|---|
| Batch norm | mean of aᵢ across the batch | std of aᵢ across the batch |
| Layer norm | mean of all H neurons' a, this example | std of all H neurons' a, this example |
| Weight norm | 0 | ‖w‖₂ (the L2 norm of the weight vector) |

> **Wait — if they're all "the same formula," why does the paper bother comparing
> them at all?** Because *what you average over* changes which transformations of
> the model the output stays invariant to — and that turns out to predict how
> stable training is. That's the whole point of this lesson.

### Reading the invariance table

The paper works out, case by case, whether each method's output is unchanged
(*invariant*) under six kinds of transformation: rescaling or re-centering the
*weight matrix*, rescaling a single *weight vector*, and rescaling or re-centering
the *dataset* or a single training case.

> "Table 1: Invariance properties under the normalization methods." — *Section 5.1*

| | Weight matrix re-scale | Weight matrix re-center | Weight vector re-scale | Dataset re-scale | Dataset re-center | Single case re-scale |
|---|---|---|---|---|---|---|
| **Batch norm** | Invariant | No | Invariant | Invariant | Invariant | No |
| **Weight norm** | Invariant | No | Invariant | No | No | No |
| **Layer norm** | Invariant | Invariant | No | Invariant | No | Invariant |

Two rows are worth sitting with:

**Weight matrix re-centering.** If you shift every incoming weight in a layer's
weight matrix by the same constant vector, layer normalization's output doesn't
change at all — batch norm and weight norm's outputs *do* change. The paper proves
this directly: if *W′ = δW + 1γᵗ* (the weight matrix scaled by δ and shifted by
γ), then under layer norm the two models "effectively compute the same output"
(*Section 5.1, Eq. 6*) — because layer norm's own µ absorbs exactly that shift.
Batch norm has no equivalent absorption mechanism for a weight shift, because its
µ is about variation *across training cases*, not across the within-layer weight
structure.

**Single training-case re-scaling.** If you multiply one input vector *x* by some
constant δ (and nothing else changes), layer normalization's prediction for that
case is provably unchanged:

> "hᵢ′ = f(gᵢ/σ′·(wᵢᵗx′ − µ′) + bᵢ) = f(gᵢ/δσ·(δwᵢᵗx − δµ) + bᵢ) = hᵢ" — *Section 5.1, Eq. 7*

Batch norm *can't* offer this guarantee, because batch norm's µ and σ are
estimated from the *whole batch* — rescaling one example's input doesn't rescale
the batch statistic that example gets normalized against, so its prediction does
change. Layer norm's statistics are local to that one case, so they scale
*together* with the input and cancel out exactly.

> **Wait — if layer norm is invariant to weight *matrix* re-scaling but not
> *single weight vector* re-scaling, isn't that an asymmetric, half-finished
> guarantee?** Yes, and the paper is explicit about it — layer norm trades away
> invariance to scaling one individual neuron's weights, which batch norm and
> weight norm both have. The trade buys per-case, per-time-step independence
> instead. Neither method dominates the other; they're invariant to different
> things for different reasons, which is exactly why a later lesson frames this as
> a choice rather than a strict upgrade.
