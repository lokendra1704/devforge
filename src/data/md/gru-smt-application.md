## Plugging a neural score into a system that already works

A phrase-based SMT decoder doesn't translate word-by-word — it looks up
candidate phrase translations in a giant table, scores every candidate, and
picks a combination that maximizes a log-linear model:

```
log p(f|e) = Σ_n  w_n f_n(f, e) + log Z(e)      (Eq. 9)
```

Each `f_n` is a hand-engineered (or learned) feature, and the `w_n` weights are
tuned to maximize BLEU on a development set. The RNN Encoder–Decoder's role
here is narrow and surgical: train it on phrase pairs from the table, then add
its score `p_θ(target | source)` as **one more feature `f_n`** in that same
equation. No architecture change to the SMT system, no retraining the decoder
from scratch — just a new column in an existing spreadsheet of scores.

### One deliberate choice: ignore how often each phrase pair occurs

Training data comes from a real corpus, where some phrase pairs appear
thousands of times and others appear once. The paper explicitly **does not**
weight training by frequency:

> "This measure was taken in order (1) to reduce the computational expense of
> randomly selecting phrase pairs from a large phrase table according to the
> normalized frequencies and (2) to ensure that the RNN Encoder–Decoder does
> not simply learn to rank the phrase pairs according to their numbers of
> occurrences." — Section 3.1

Think about what happens if you *don't* do this: the network could get a low
training loss just by memorizing "common phrase pairs get high scores,"
without learning anything about whether the translation is actually any good
linguistically. The existing phrase table *already* encodes frequency
statistics — duplicating that signal would waste the network's limited
capacity. By training on (deduplicated) unique pairs, the network is forced to
spend its capacity on something the frequency-based table can't already tell
you: **is this translation linguistically plausible**, independent of how
often it showed up in a particular corpus.

### The setup, in one table

| Component | Detail |
|---|---|
| Task | English → French, WMT'14 |
| Training data (RNN Encoder–Decoder) | 348M words (selected subset of 850M) |
| Vocabulary | 15,000 most frequent words/language (~93% coverage); rest → `[UNK]` |
| Hidden units | 1,000 (encoder), 1,000 (decoder) |
| Word embedding dimension | 100 |
| Training time | ~3 days, Adadelta + SGD, batch size 64 |

### Did it help?

| Model | BLEU (dev) | BLEU (test) |
|---|---|---|
| Baseline (Moses, phrase-based) | 30.64 | 33.30 |
| Baseline + RNN Encoder–Decoder score | 31.20 | 33.87 |
| Baseline + CSLM + RNN | 31.48 | **34.64** |
| Baseline + CSLM + RNN + word penalty | 31.50 | 34.54 |

*(Table 1; CSLM = a separate continuous-space neural language model, trained as
a comparison/complementary feature.)*

Two things to notice in that table. First, adding the RNN Encoder–Decoder
feature alone improves test BLEU by over half a point (33.30 → 33.87) — modest
but consistent. Second, and more interesting: stacking CSLM *and* the RNN
Encoder–Decoder together beats either one alone (34.64 vs. either component's
solo contribution implied by the gaps). The paper's read on this:

> "This suggests that the contributions of the CSLM and the RNN
> Encoder–Decoder are not too correlated and that one can expect better
> results by improving each method independently." — Section 4.2

In other words, the two neural components are catching *different* things —
CSLM models fluency of the output language, the RNN Encoder–Decoder models
faithfulness of the phrase-level translation. Stacking complementary signals
beats relying on one bigger model.

> **Wait — if neural features keep helping, why not throw out the phrase
> table and have the RNN Encoder–Decoder generate translations directly?**
> The paper considered this (citing Schwenk, 2012) but rejected it for this
> experiment: direct generation requires sampling many candidate target
> phrases per source phrase, which is expensive to do at scale. Rescoring an
> existing table sidesteps that cost — generation-from-scratch is flagged as
> future work (Section 5).
