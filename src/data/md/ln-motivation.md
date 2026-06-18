## The problem: training is slow, and the obvious fix has a blind spot

Picture training a recurrent network on a question-answering dataset where every
passage has a different length. You'd like to normalize each neuron's activity so
gradients don't explode or vanish — that's exactly what **batch normalization**
does for feed-forward nets, and it works great there. So why not just batch-norm
the RNN too?

Try it, and you immediately hit a wall the paper names directly:

> "The summed inputs to the recurrent neurons in a recurrent neural network (RNN)
> often vary with the length of the sequence so applying batch normalization to
> RNNs appears to require different statistics for different time-steps." — *Introduction*

Batch normalization estimates a mean and variance *per neuron, across the
mini-batch*. For a feed-forward net, that's clean: every layer sees a fixed-size
batch of activations regardless of input length. But an RNN reuses the same
weights at every time-step, and a sequence of length 4 and a sequence of length 40
don't have the same number of time-steps to collect statistics from. Batch norm
would need to store separate running statistics for *every* time-step it might
ever see — and what happens at test time, when a sequence is longer than any
sequence seen in training? There's no stored statistic for that time-step at all.

There's a second, quieter problem the paper raises:

> "Despite its simplicity, batch normalization requires running averages of the
> summed input statistics... batch normalization cannot be applied to online
> learning tasks or to extremely large distributed models where the minibatches
> have to be small." — *Introduction*

> **Wait — isn't a small batch just a smaller version of a big batch?** No: batch
> norm's mean and variance are *statistics estimated from samples*, and with too
> few samples (or just one, in online learning) those estimates are noisy or
> undefined. Layer normalization sidesteps this because it never looks across the
> batch at all — more on that next.

### The reframe: normalize across neurons, not across examples

Batch normalization's mean and variance for a given hidden unit are computed by
looking at *that one unit's activation, across many training examples in the
mini-batch*. The paper's move is to rotate that 90 degrees: instead of going
*across examples* for one neuron, go *across neurons* for one example.

> "We transpose batch normalization into layer normalization by computing the mean
> and variance used for normalization from all of the summed inputs to the neurons
> in a layer on a single training case." — *Abstract*

That one sentence is the entire idea. Once the statistics come from a single
training case's own layer, two of batch norm's structural problems disappear at
once: there's no dependency on batch size (works fine with batch size 1), and
there's no dependency on sequence position (every time-step of an RNN just looks
at its own layer, the same way, regardless of how long the sequence is).

| | Batch normalization | Layer normalization |
|---|---|---|
| Statistics computed over | one neuron, across the **batch** | one training case, across the **layer's neurons** |
| Needs minimum batch size? | yes | no — works at batch size 1 |
| Same computation train vs. test? | no (test uses stored running stats) | yes |
| Natural fit for variable-length RNNs? | awkward (per-time-step stats) | yes (one normalization rule, reused every step) |

The rest of this paper works out exactly what you get — and don't get — for that
trade.
