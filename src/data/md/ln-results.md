## Where layer normalization wins, and where it doesn't

The paper runs layer normalization on six tasks: image-sentence ranking,
question answering, skip-thought sentence representations, generative modeling
(DRAW), handwriting generation, and permutation-invariant MNIST. Every one of
those is dominated by **recurrent networks on long or variable-length
sequences** — exactly the setting the motivation lesson identified as batch
norm's weak spot.

> "Unless otherwise noted, the default initialization of layer normalization is
> to set the adaptive gains to 1 and the biases to 0 in the experiments." — *Section 6*

| Task | Headline result |
|---|---|
| Order embeddings (image-sentence ranking) | Converges to its best validation score in **60% of the time** the baseline needs; also improves final test recall (Table 2) |
| Teaching machines to read & comprehend | Trains faster *and* reaches a better validation result than both the plain LSTM and recurrent batch norm |
| Skip-thought vectors | Better downstream accuracy than the un-normalized baseline across nearly all 7 evaluation tasks, with no extra per-iteration cost (given the right memory allocator) |
| DRAW (binarized MNIST generation) | Converges **almost twice as fast**; final test bound 82.09 nats vs. 82.36 nats for the baseline |
| Handwriting generation (length ~700 sequences, batch size 8) | Comparable final likelihood, reached **much faster** — the paper's clearest small-batch-and-long-sequence case |
| Permutation-invariant MNIST | "Robust to the batch-sizes," beating batch norm's convergence speed when batch norm is applied to *all* layers |

The handwriting result is worth a second look, because it isolates the exact
condition the paper opened with: small mini-batches (size 8) and very long
sequences (~700 steps). That combination is close to a worst case for batch
norm — too few samples per batch to get a stable variance estimate, and far too
many time-steps to store separate per-step statistics for. Layer normalization,
having never depended on batch size or sequence position in the first place,
isn't bothered by either constraint.

### The one place it loses

The paper is candid about a setting where layer normalization is *not* the
better choice:

> "We have also experimented with convolutional neural networks... we observed
> that layer normalization offers a speedup over the baseline model without
> normalization, but batch normalization outperforms the other methods." — *Section 6.7*

The explanation given matters more than the result itself, because it tells you
*when* to expect this:

> "With fully connected layers, all the hidden units in a layer tend to make
> similar contributions to the final prediction and re-centering and re-scaling
> the summed inputs to a layer works well. However, the assumption of similar
> contributions is no longer true for convolutional neural networks. The large
> number of the hidden units whose receptive fields lie near the boundary of the
> image are rarely turned on and thus have very different statistics from the
> rest of the hidden units within the same layer." — *Section 6.7*

Layer normalization's whole premise is that the *H* neurons it averages over,
within one layer, are exchangeable enough that one shared mean/variance makes
sense for all of them. In a fully-connected layer that's roughly true. In a
convolutional layer, edge-of-image units and center-of-image units see
systematically different inputs (border padding, fewer real pixels in their
receptive field) — averaging them together with interior units mixes two
genuinely different populations into one statistic that fits neither well.

> **Wait — doesn't this contradict the earlier invariance argument?** No: the
> invariance proofs in Section 5.1 are about what stays *unchanged under a
> transformation* — they say nothing about whether the underlying statistic is a
> *good summary* of the neurons being pooled. Convolutional layers are a case
> where the statistic itself is the problem, not the invariance property.
