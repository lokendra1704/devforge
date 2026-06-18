# Does the fix actually work? Read the table before the claim

Before looking at numbers, predict: the paper claims its model (**RNNsearch**)
should beat the plain encoder–decoder (**RNNencdec**) by the *most* on long
sentences, and by little or nothing on short ones, since that's exactly where the
fixed-vector bottleneck bites hardest. Keep that prediction in mind while you read
Table 1.

Both models were trained on WMT '14 English-French data (348M words after data
selection), in two size variants — capped at sentences of ≤30 words and ≤50
words — evaluated by BLEU score (higher is better) on a held-out test set:

| Model | All sentences | No unknown words |
|---|---|---|
| RNNencdec-30 | 13.93 | 24.19 |
| RNNsearch-30 | 21.50 | 31.44 |
| RNNencdec-50 | 17.82 | 26.71 |
| RNNsearch-50 | 26.75 | 34.16 |
| RNNsearch-50⋆ (trained longer) | 28.45 | 36.15 |
| Moses (conventional phrase-based) | 33.30 | 35.63 |

*Table 1, Section 5.1*

Three things jump out:

1. **RNNsearch beats RNNencdec at every size.** This isn't close — RNNsearch-30
   (21.50) even *beats* RNNencdec-50 (17.82), despite being trained on shorter
   sentences and having less capacity to memorize long-range structure. The
   architecture change matters more than the extra training-sentence length did.
2. **On sentences with no unknown words, RNNsearch-50⋆ (36.15) edges out Moses
   (35.63)** — a hand-engineered, decades-refined statistical system that also
   uses an extra 418M-word monolingual corpus RNNsearch never sees. "This is a
   significant achievement" in the paper's own words, for a model class that
   "has only been proposed as recently as this year."
3. **The "All sentences" column is uniformly lower than "No unknown words."**
   Both models choke on rare words mapped to the `[UNK]` token — the paper
   flags this directly as a known limitation, not solved by attention.

## The length-robustness curve

> "We see that the performance of RNNencdec dramatically drops as the length of
> the sentences increases. On the other hand, both RNNsearch-30 and RNNsearch-50
> are more robust to the length of the sentences. RNNsearch-50, especially, shows
> no performance deterioration even with sentences of length 50 or more."
> — *Section 5.1*

This confirms the prediction from the top of this lesson: the gap between
RNNsearch and RNNencdec *widens* as sentences get longer, because that's precisely
where forcing everything through one fixed vector hurts the most. Short sentences
don't stress the bottleneck — long ones do, and that's where attention pays off.

> **Wait — if RNNsearch wins everywhere, why even report short-sentence
> numbers?** Because "everywhere" understates the case for the architecture: the
> short-sentence win shows attention isn't a *patch* for a specific failure mode,
> it's a strictly better way to connect encoder and decoder, full stop. The
> long-sentence win shows *why* it's better.
