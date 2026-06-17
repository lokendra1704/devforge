# What the Authors Themselves Flagged as Unfinished

A paper's Discussion section is where the authors tell you, in their own words, what they're confident about and what they deliberately left on the table. Section 7 is short, but every sentence is a constraint worth taking seriously if you're deciding whether and how to build on this work.

## Depth is load-bearing, not incidental

"Our network's performance degrades if a single convolutional layer is removed" — removing any of the middle layers cost about 2 points of top-1 accuracy. That's a strong claim: it's not "depth helped a little," it's "this specific stack of five conv layers and three FC layers is close to a local optimum for this parameter budget." If you're tempted to trim the network to save compute, the paper's own ablation says that's not free.

## No unsupervised pretraining — by choice, not failure

The authors are explicit that they skipped unsupervised pretraining "to simplify our experiments," even though they "expect that it will help" — especially in a regime with more compute available than labeled data. This matters for reading the result correctly: the 15.3%/17.0% numbers are a purely-supervised result. They're not evidence that unsupervised pretraining doesn't help; they're evidence that you don't strictly need it if you have 1.2 million labels and enough compute.

## The scaling trend hadn't plateaued

"Our results have improved as we have made our network larger and trained it longer but we still have many orders of magnitude to go" before matching the human infero-temporal visual pathway. Combined with the closing remark on wanting to extend to video (where "temporal structure provides very helpful information... missing or far less obvious in static images"), the paper frames itself as a checkpoint on a scaling curve, not an endpoint.

## Judgment call: applying these design choices to a new problem

You're scoping a CNN for a new image-classification task. Use what the paper itself flags as a constraint or an open question to judge each option.
