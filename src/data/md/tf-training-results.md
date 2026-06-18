## Did "more parallel" actually mean "cheaper and better," not just "different"?

The architecture lessons in this module made a bet: trade an O(n²) compute term
for full parallelism and O(1) max path length. Section 6 is where that bet gets
graded against the scoreboard.

### Training setup, briefly

> "We trained on the standard WMT 2014 English-German dataset consisting of about
> 4.5 million sentence pairs... We trained our models on one machine with 8 NVIDIA
> P100 GPUs... We trained the base models for a total of 100,000 steps or 12
> hours. For our big models... 300,000 steps (3.5 days)." — *Section 5.1, 5.2*

Two more details worth keeping, because they reappear in the model-variations
table below: the learning rate is *warmed up* linearly for the first 4000 steps
then decayed proportional to the inverse square root of the step number, and the
model uses both dropout (`P_drop = 0.1`) and label smoothing (`ε_ls = 0.1`) — the
latter "hurts perplexity... but improves accuracy and BLEU score," a reminder that
the metric you optimize for in training isn't always the one you report.

### The headline comparison: quality *and* training cost

> "The Transformer achieves better BLEU scores than previous state-of-the-art
> models on the English-to-German and English-to-French newstest2014 tests at a
> fraction of the training cost." — *Table 2 caption*

| Model | EN-DE BLEU | EN-FR BLEU | EN-DE training cost (FLOPs) |
|---|---|---|---|
| GNMT + RL (ensemble) | 26.30 | 41.16 | 1.8 × 10²⁰ |
| ConvS2S (ensemble) | 26.36 | 41.29 | 7.7 × 10¹⁹ |
| Transformer (base) | 27.3 | 38.1 | 3.3 × 10¹⁸ |
| Transformer (big) | 28.4 | 41.8 | 2.3 × 10¹⁹ |

Look at the order of magnitude in that last column, not just the BLEU column. The
base Transformer beats every prior *ensemble* (multiple models combined) at roughly
1/50th the training compute of the best ConvS2S ensemble. That gap — not just the
BLEU win — is the direct payoff of O(1) sequential operations per layer instead of
O(n).

### Which design choices actually mattered? The ablation table

Section 6.2 varies one piece of the base architecture at a time and reports the
change in dev-set BLEU — this is the paper checking its own design decisions
against the alternative it could have shipped instead.

| Variation | What changed | Dev BLEU | Takeaway |
|---|---|---|---|
| (A) heads h=1 | single attention head, total compute held constant | 24.9 (vs. 25.8 base) | one head is measurably worse — multi-head's specialization helps |
| (A) heads h=32 | too many, too-thin heads | 25.4 | more isn't free either — quality drops off both directions |
| (B) smaller dₖ | shrink the attention key dimension | 25.1 | "determining compatibility is not easy" — a cheaper dot product hurts |
| (C) bigger d_model / d_ff | scale the model up | up to 26.2 | bigger models are better, as expected |
| (D) dropout = 0.0 | remove dropout | 24.6 | overfits — dropout is "very helpful in avoiding over-fitting" |
| (E) learned positional embeddings | swap sinusoids for a learned table | 25.7 (vs. 25.8 base) | "nearly identical results" — confirms the choice in the encoding lesson was about extrapolation, not accuracy |

> **Wait — if h=8 is just "the number that scored best in a table," is that
> arbitrary?** Mostly empirical, yes — the paper found it by sweeping h and
> reporting the result, the same way you'd tune any hyperparameter. The principled
> argument (averaging over one head inhibits specialization) explains *why multiple
> heads help at all*, not *why exactly 8*.

### Generalizing past translation

The paper runs one more experiment specifically to test whether the Transformer is
a translation-specific trick or a genuinely general sequence architecture: English
constituency parsing, a task with "strong structural constraints" and outputs
"significantly longer than the input" — a very different shape of problem from
translation.

> "Our results in Table 4 show that despite the lack of task-specific tuning our
> model performs surprisingly well, yielding better results than all previously
> reported models with the exception of the Recurrent Neural Network Grammar." —
> *Section 6.3*

A 4-layer Transformer, trained on just 40K WSJ sentences with no parsing-specific
architecture changes, beat the BerkleyParser — a result the RNN sequence-to-sequence
models of the time hadn't matched in that small-data regime. That's the strongest
evidence in the paper that the gains are coming from the attention-based
architecture itself, not from anything translation-specific.
