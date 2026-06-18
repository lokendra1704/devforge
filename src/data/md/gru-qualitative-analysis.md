## A BLEU number tells you *that* it improved. It doesn't tell you *why*.

Section 4.2 showed the RNN Encoder–Decoder's score helps translation quality.
Section 4.3 asks the more interesting question: **what kind of mistakes does
it fix that the old translation model couldn't?**

The existing translation model scores a phrase pair purely from corpus
statistics — count how often `(source, target)` co-occurred, normalize, done.
That works great for common phrases and badly for rare ones, simply because
rare phrases don't have enough occurrences to estimate a reliable probability
from. The RNN Encoder–Decoder, recall from the last lesson, was deliberately
trained *without* frequency information — so the paper's hypothesis is that it
should be relatively *better* on rare phrases, where it's forced to rely on
linguistic regularities instead of counting.

### Long and rare phrases: where the gap shows up

The paper picks out source phrases that are long (4+ words) and rare, and
compares the top-scoring target phrase from each model:

| Source | Translation model's top pick | RNN Encoder–Decoder's top pick |
|---|---|---|
| "did not comply with the" | *(garbled, agreement errors)* | "n'ont pas respecté les" |
| "parts of the world ." | *(garbled fragment)* | "parties du monde ." |
| "the past few days ." | "le petit texte ." *(wrong meaning)* | "ces derniers jours ." |

*(condensed from Table 2b — see the paper for the full garbled outputs)*

The translation-model column tends to contain disfluent or flatly wrong
phrases — exactly what you'd expect from unreliable counts on rare data. The
RNN Encoder–Decoder column reads as actual French. The paper's summary:

> "In most cases, the choices of the target phrases by the RNN
> Encoder–Decoder are closer to actual or literal translations. We can observe
> that the RNN Encoder–Decoder prefers shorter phrases in general." — Section 4.3

### It can generate, not just score

Because the decoder is a real generative model, the paper doesn't just rescore
existing candidates — it also *samples* novel target phrases directly from the
trained network (Table 3), with no phrase table involved at all. Sampling 50
phrases per source and keeping the top 5 by score, the generated phrases are
well-formed French **and frequently don't match anything already in the phrase
table** — evidence the model learned generalizable structure, not a lookup
table in disguise.

### The representation itself is meaningful

Section 4.4 turns to what's encoded in the 1000-dimensional vector `c` (and the
100-dimensional word embeddings) once training finishes. Projecting those
vectors down to 2D with Barnes-Hut-SNE (a t-SNE variant), the paper finds:

- **Word embeddings** cluster semantically similar words together — the same
  property word2vec-style embeddings show, but emerging here as a *side effect*
  of training for translation phrase-scoring, not as the training objective.
- **Phrase representations** (the 1000-dim `c` vector) cluster along *both*
  axes at once: phrases about durations of time group together (semantic
  clustering) **and**, within that cluster, syntactically similar phrasings
  sit closer to each other (syntactic clustering).

> "From the visualization, it is clear that the RNN Encoder–Decoder captures
> both semantic and syntactic structures of the phrases." — Section 4.4

That's the strongest evidence in the paper that `c` isn't an arbitrary
compressed blob — it's organized along axes a linguist would recognize, which
is exactly the property you'd want if you were going to reuse this
representation for some other NLP task beyond translation (the paper flags
exactly that as future work in its conclusion).
