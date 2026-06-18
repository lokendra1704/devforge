import type { Subject } from '../types'
import motivationMd from './md/tf-motivation.md?raw'
import architectureMd from './md/tf-architecture.md?raw'
import attentionMd from './md/tf-attention.md?raw'
import positionalEncodingMd from './md/tf-positional-encoding.md?raw'
import trainingResultsMd from './md/tf-training-results.md?raw'

export const transformer: Subject = {
  id: 'transformer',
  title: 'Attention Is All You Need',
  tagline: 'The paper that replaced recurrence with attention — and gave us the Transformer.',
  icon: '🧠',
  accent: '#f59e0b',
  modules: [
    {
      id: 'tf-m1',
      title: 'Attention Is All You Need',
      description:
        'Vaswani et al. 2017 (NeurIPS / arXiv:1706.03762). The Transformer architecture: scaled dot-product attention, multi-head attention, positional encoding, and the parallelism argument that made it possible to drop recurrence entirely.',
      lessons: [
        {
          id: 'tf-motivation',
          title: 'Why dispense with recurrence?',
          minutes: 8,
          xp: 50,
          steps: [
            { kind: 'read', title: 'The sequential bottleneck', markdown: motivationMd },
            {
              kind: 'quiz',
              title: 'Why drop recurrence?',
              questions: [
                {
                  prompt:
                    'According to the paper, what exactly makes training an RNN on a long sequence slow, even with unlimited GPUs?',
                  options: [
                    'The per-step computation requires too much arithmetic to run on a single GPU',
                    'Each hidden state depends on the previous one, so steps must execute in order rather than in parallel',
                    'RNNs require more parameters than Transformers, increasing memory bandwidth needs',
                    'Attention mechanisms attached to RNNs double the number of required passes over the input',
                  ],
                  answer: 1,
                  explanation:
                    'The bottleneck is sequential dependency, not raw compute or parameter count: step 50 cannot begin until step 49 finishes because each hidden state is computed from the previous one. More GPUs cannot fix this because the steps are not independent work that can be split across devices.',
                },
                {
                  prompt: 'Before the Transformer, how was attention typically used in sequence models?',
                  options: [
                    'As a complete replacement for the encoder and decoder RNNs',
                    'As an add-on letting the decoder reference any encoder position, while the encoder and decoder remained RNNs internally',
                    'Only during inference, never during training',
                    'As a preprocessing step that converted sequences into fixed-length vectors before any recurrence',
                  ],
                  answer: 1,
                  explanation:
                    'Attention was bolted onto a recurrent backbone: it let the decoder skip straight to a relevant encoder position, but the encoder and decoder themselves still processed tokens one state at a time, so the sequential training bottleneck remained.',
                },
                {
                  prompt: 'What is the core architectural bet that Vaswani et al. make in proposing the Transformer?',
                  options: [
                    'Combine recurrence and convolution into a hybrid architecture for the encoder only',
                    'Eschew both recurrence and convolution entirely, building the whole model on attention alone',
                    'Keep recurrence in the decoder but replace the encoder with convolutions',
                    'Add a second attention layer on top of existing RNN-based architectures to speed up convergence',
                  ],
                  answer: 1,
                  explanation:
                    'The Transformer removes recurrence and convolution entirely and relies solely on attention to model dependencies between positions — a more radical move than earlier work, which kept attention as a supplement to a recurrent core.',
                },
                {
                  prompt: 'What is the fundamental trade-off the Transformer accepts by replacing recurrence with self-attention?',
                  options: [
                    'It reduces total arithmetic per layer in exchange for slightly worse translation quality',
                    'It increases the arithmetic cost per layer (scoring every pair of positions) but that cost is fully parallelizable on a GPU',
                    'It eliminates the need for any pairwise comparisons between tokens, reducing cost to linear in sequence length',
                    'It requires sequential processing of attention scores but reduces the number of layers needed',
                  ],
                  answer: 1,
                  explanation:
                    'Self-attention computes a score between every pair of positions, which is more total arithmetic than a single recurrent step — but that arithmetic is independent across pairs, so it can be computed simultaneously on parallel hardware instead of waiting step by step.',
                },
                {
                  prompt: 'What two headline results does the abstract cite as the payoff for dropping recurrence?',
                  options: [
                    'Lower memory usage and smaller model size',
                    'Higher BLEU scores (e.g., 28.4 on En-De, 41.8 on En-Fr) and dramatically lower training cost (3.5 days on eight GPUs)',
                    'Faster inference latency and reduced vocabulary size',
                    'Better handling of out-of-vocabulary words and longer maximum sequence length',
                  ],
                  answer: 1,
                  explanation:
                    'The abstract reports both better translation quality (new state-of-the-art BLEU scores) and a fraction of the training cost of prior best models — the paper frames these as occurring "because of," not "despite," removing recurrence.',
                },
              ],
            },
          ],
        },
        {
          id: 'tf-architecture',
          title: 'Encoder, decoder, and the residual trick',
          minutes: 12,
          xp: 60,
          steps: [
            { kind: 'read', title: 'Two stacks, three sub-layers', markdown: architectureMd },
            {
              kind: 'quiz',
              title: 'Encoder vs decoder',
              questions: [
                {
                  prompt: 'An encoder layer has two sub-layers. What are they, in order?',
                  options: [
                    'Multi-head self-attention, then a position-wise feed-forward network',
                    'Masked self-attention, then encoder-decoder attention',
                    'Position-wise feed-forward network, then multi-head self-attention',
                    'Multi-head self-attention, then encoder-decoder attention',
                  ],
                  answer: 0,
                  explanation:
                    'Each encoder layer is exactly two pieces: multi-head self-attention followed by a position-wise feed-forward network. Masking and encoder-decoder attention are decoder-only additions, not part of the encoder.',
                },
                {
                  prompt:
                    'The paper defines each sub-layer\'s output as LayerNorm(x + Sublayer(x)). What problem does the "x +" (residual) term primarily address?',
                  options: [
                    'It lets each layer learn only a correction to add to its input rather than reconstructing the full representation from scratch, keeping gradients usable through a deep 6-layer stack',
                    'It normalizes the activations to have zero mean and unit variance before the next layer',
                    'It allows the encoder and decoder to share weights across layers',
                    'It substitutes for positional encoding by preserving the original input order',
                  ],
                  answer: 0,
                  explanation:
                    'The residual term lets each sub-layer learn only the correction to add to x, the same trick ResNet uses — this is what keeps the gradient signal from vanishing across the depth of a 6-layer stack, a separate concern from the normalization LayerNorm handles.',
                },
                {
                  prompt:
                    'The decoder inserts a third sub-layer beyond the encoder\'s two. What does this sub-layer do, and why does it matter?',
                  options: [
                    'It performs multi-head attention over the encoder\'s output — the only place where information from the input sequence reaches the output side',
                    'It re-applies masked self-attention a second time to reinforce auto-regressive behavior',
                    'It performs a second feed-forward pass to increase decoder capacity relative to the encoder',
                    'It normalizes encoder and decoder outputs to a shared scale before the final linear layer',
                  ],
                  answer: 0,
                  explanation:
                    'The third sub-layer — encoder-decoder attention — lets each decoder layer attend over the encoder\'s output representations, the bridge that carries input information to the output side.',
                },
                {
                  prompt: 'Why must the decoder\'s self-attention be masked, rather than left unrestricted like the encoder\'s?',
                  options: [
                    'Because at inference time later tokens don\'t exist yet, so letting position i attend to positions > i during training would let it cheat using information unavailable at inference',
                    'Because masking is what gives the decoder its positional encoding',
                    'Because without masking, the encoder-decoder attention sub-layer would not function',
                    'Because masking reduces the computational cost of attention from quadratic to linear',
                  ],
                  answer: 0,
                  explanation:
                    'Predictions for position i must depend only on known outputs at positions less than i, matching what is actually available at inference. Masking enforces that by blocking attention to future positions.',
                },
                {
                  prompt:
                    'The text poses the question: if the decoder can\'t look ahead, how is computation still parallel? What is the resolution?',
                  options: [
                    'Masking itself is parallel — it zeroes out illegal connections in one matrix operation, with every position\'s attention scores still computed simultaneously',
                    'Parallelism is abandoned for the decoder; it must process positions one at a time like an RNN',
                    'The decoder achieves parallelism only at inference time, not during training',
                    'Parallelism comes from running the encoder and decoder stacks simultaneously on separate devices',
                  ],
                  answer: 0,
                  explanation:
                    'Masking is a single matrix operation (setting disallowed scores to −∞ before softmax), not a sequential loop — all positions\' scores are still computed at once, with the mask just discarding the illegal ones.',
                },
              ],
            },
          ],
        },
        {
          id: 'tf-attention',
          title: 'Scaled dot-product and multi-head attention',
          minutes: 15,
          xp: 70,
          steps: [
            { kind: 'read', title: 'What attention actually computes', markdown: attentionMd },
            {
              kind: 'quiz',
              title: 'The attention formula',
              questions: [
                {
                  prompt: 'In scaled dot-product attention, what role does the softmax output play in the final computation?',
                  options: [
                    'It produces the weights used to compute a weighted sum of the value vectors',
                    'It replaces the value vectors entirely, becoming the output directly',
                    'It scales the query vector before the dot product is taken',
                    'It normalizes the key vectors so all keys have unit length',
                  ],
                  answer: 0,
                  explanation:
                    'softmax(QKᵗ/√dk) produces a probability-like weight per key; the output is then a weighted sum of the corresponding value vectors V.',
                },
                {
                  prompt: 'Why does the Transformer divide the dot products QKᵗ by √dk before applying softmax?',
                  options: [
                    'Without scaling, raw dot-product magnitude grows with dk, pushing softmax toward one-hot outputs with vanishing gradients',
                    'It converts the dot product into a cosine similarity so attention is invariant to vector length',
                    'It is required to keep the output dimension equal to dv',
                    'It prevents the keys and values from being projected into different subspaces',
                  ],
                  answer: 0,
                  explanation:
                    'If Q and K have unit-variance components, their dot product has variance proportional to dk. As dk grows, raw scores blow up, softmax saturates, and gradients vanish — dividing by √dk keeps the variance roughly constant.',
                },
                {
                  prompt:
                    'What does multi-head attention let the model do that a single full-dimensional attention head cannot?',
                  options: [
                    'Jointly attend to information from different representation subspaces at different positions, instead of averaging into one view',
                    'Use a larger dk per head, increasing dot-product variance for sharper softmax peaks',
                    'Skip the softmax step entirely for faster computation',
                    'Apply attention only within the encoder, never in the decoder',
                  ],
                  answer: 0,
                  explanation:
                    'A single attention function forces one averaged notion of relevance per position. Splitting into h learned projections lets each head specialize, and concatenating their outputs recovers expressiveness one head\'s averaging would wash out.',
                },
                {
                  prompt: 'In encoder self-attention, where do the queries, keys, and values all come from?',
                  options: [
                    'The previous encoder layer, for all three (Q, K, and V)',
                    'Queries from the decoder, keys and values from the encoder',
                    'Queries and keys from the encoder, values from the final encoder output only',
                    'Queries from the input embeddings only, keys and values from the previous decoder layer',
                  ],
                  answer: 0,
                  explanation:
                    'Encoder self-attention draws Q, K, and V all from the output of the previous encoder layer, letting every input position attend to every other input position.',
                },
                {
                  prompt: 'In encoder-decoder attention, where do the keys and values come from, and what does this enable?',
                  options: [
                    'They come from the encoder\'s final output, allowing every decoder position to attend over the entire input sequence',
                    'They come from the previous decoder layer, allowing the decoder to attend only to its own past outputs',
                    'They come from the input embeddings directly, bypassing the encoder stack entirely',
                    'They come from a separate learned memory bank unrelated to either the encoder or decoder',
                  ],
                  answer: 0,
                  explanation:
                    'Queries come from the previous decoder layer, but keys and values come from the encoder\'s final output — letting every decoder position look across the whole input sequence.',
                },
              ],
            },
            {
              kind: 'code',
              title: 'Implement scaled dot-product attention',
              challenge: {
                prompt:
                  'Implement `scaledDotProductAttention(Q, K, V)` following Section 3.2.1: `Attention(Q, K, V) = softmax(Q·Kᵗ / √dk) · V`.\n\n' +
                  '`Q` is an array of query row-vectors, `K` and `V` are arrays of key/value row-vectors (same length as each other). `dk` is the length of each key vector. For each query, compute its dot product against every key, divide by `√dk`, take a softmax over those scores, then return the weighted sum of the value rows. Round every output number to 4 decimal places.',
                starterCode:
                  'function scaledDotProductAttention(Q, K, V) {\n  // TODO: implement softmax(Q·K^T / sqrt(dk)) · V\n  return Q\n}',
                solution:
                  'function scaledDotProductAttention(Q, K, V) {\n' +
                  '  const dk = K[0].length\n' +
                  '  const scale = Math.sqrt(dk)\n' +
                  '  return Q.map((q) => {\n' +
                  '    const scores = K.map((k) => q.reduce((s, qi, i) => s + qi * k[i], 0) / scale)\n' +
                  '    const max = Math.max(...scores)\n' +
                  '    const exps = scores.map((s) => Math.exp(s - max))\n' +
                  '    const sum = exps.reduce((a, b) => a + b, 0)\n' +
                  '    const weights = exps.map((e) => e / sum)\n' +
                  '    return V[0].map((_, j) => Math.round(weights.reduce((s, w, i) => s + w * V[i][j], 0) * 10000) / 10000)\n' +
                  '  })\n' +
                  '}',
                tests:
                  "test('a query matching key 1 exactly weights key 1 heavily', () => {\n" +
                  '  assertEqual(scaledDotProductAttention([[1, 0]], [[1, 0], [0, 1]], [[1, 2], [3, 4]]), [[1.6605, 2.6605]])\n' +
                  "})\n\n" +
                  "test('a zero query has no preference, so it averages all values equally', () => {\n" +
                  '  assertEqual(scaledDotProductAttention([[0, 0]], [[1, 0], [0, 1]], [[1, 2], [3, 4]]), [[2, 3]])\n' +
                  "})\n\n" +
                  "test('multiple queries are processed independently, one output row per query', () => {\n" +
                  '  assertEqual(\n' +
                  '    scaledDotProductAttention(\n' +
                  '      [[1, 0], [0, 1]],\n' +
                  '      [[1, 0], [0, 1]],\n' +
                  '      [[1, 2], [3, 4]]\n' +
                  '    ),\n' +
                  '    [[1.6605, 2.6605], [2.3395, 3.3395]]\n' +
                  '  )\n' +
                  "})",
              },
            },
          ],
        },
        {
          id: 'tf-positional-encoding',
          title: 'Position-wise FFN, positional encoding, and why self-attention',
          minutes: 14,
          xp: 65,
          steps: [
            { kind: 'read', title: 'Per-position math, and order', markdown: positionalEncodingMd },
            {
              kind: 'quiz',
              title: 'Position and complexity',
              questions: [
                {
                  prompt:
                    'The position-wise feed-forward network is described as equivalent to "two convolutions with kernel size 1." What does that comparison tell you about it?',
                  options: [
                    'It mixes information across neighboring positions like a small sliding window',
                    'It is applied independently and identically at each position, with no mixing across positions',
                    'It uses convolutional weight sharing across layers, not just within a layer',
                    'It replaces the attention sub-layer entirely in later versions of the architecture',
                  ],
                  answer: 1,
                  explanation:
                    'A kernel-size-1 convolution only ever looks at one position at a time. The same two-layer MLP is run separately on each position\'s vector, with zero interaction between positions — that mixing happens only in the attention sub-layer before it.',
                },
                {
                  prompt:
                    'Why does self-attention, on its own, fail to distinguish "the cat sat on the mat" from "the mat sat on the cat"?',
                  options: [
                    'It computes scores between every pair of vectors regardless of which came first, treating the input as an unordered set',
                    'It only attends to the most recent token, like a unidirectional RNN',
                    'The feed-forward sub-layer discards position information before attention runs',
                    'It uses a fixed-size context window that drops tokens beyond a certain index',
                  ],
                  answer: 0,
                  explanation:
                    'Self-attention scores every pair of positions based on content alone; shuffling the input tokens does not change the pairwise scores between any two of them.',
                },
                {
                  prompt:
                    'The paper compared learned positional embeddings against sinusoidal ones. What did they find, and why did they still choose sinusoids?',
                  options: [
                    'Learned embeddings performed much worse, so sinusoids were chosen purely for accuracy',
                    'The two produced nearly identical results on the translation task; sinusoids were kept for their potential to extrapolate to longer sequences than seen during training',
                    'Sinusoids were chosen because they are differentiable, unlike learned embeddings',
                    'Learned embeddings could not be summed with token embeddings due to dimension mismatch',
                  ],
                  answer: 1,
                  explanation:
                    'The two approaches were empirically comparable. The deciding factor was structural: sinusoidal encodings are defined for any position index, including ones longer than any sequence seen in training.',
                },
                {
                  prompt:
                    'In the per-layer complexity table, self-attention is O(n²·d) while a recurrent layer is O(n·d²). For which regime does self-attention end up cheaper, and why does the paper say this typically holds for sentences?',
                  options: [
                    'When n is much larger than d, since the n² term then shrinks relative to n·d²',
                    'When n is much smaller than d, since sentence length is usually shorter than the model\'s representation dimension',
                    'The two are always equal regardless of n and d',
                    'Self-attention is cheaper only when convolutional layers are also used',
                  ],
                  answer: 1,
                  explanation:
                    'Comparing n²·d to n·d² reduces to comparing n to d: self-attention wins when n < d, and the paper notes sequence length is most often smaller than the representation dimension for sentence-level tasks.',
                },
                {
                  prompt:
                    'Restricted self-attention (limited to a neighborhood of size r) changes the complexity/path-length trade-off compared to full self-attention. What is that trade?',
                  options: [
                    'It keeps O(1) max path length while reducing compute to O(r·n·d)',
                    'It increases sequential operations to O(n) in exchange for lower memory use',
                    'It reduces per-layer compute to O(r·n·d) but raises max path length from O(1) back up to O(n/r), since distant positions need multiple hops',
                    'It eliminates the need for positional encodings entirely',
                  ],
                  answer: 2,
                  explanation:
                    'Restricting attention to a local window cuts per-layer cost, but gives up full self-attention\'s key advantage: a signal now needs roughly n/r hops to cross the full sequence, so max path length grows back to O(n/r).',
                },
              ],
            },
          ],
        },
        {
          id: 'tf-training-results',
          title: 'Training setup and results',
          minutes: 13,
          xp: 60,
          steps: [
            { kind: 'read', title: 'Grading the bet against the scoreboard', markdown: trainingResultsMd },
            {
              kind: 'quiz',
              title: 'BLEU, cost, and ablations',
              questions: [
                {
                  prompt:
                    'The base Transformer trained for 100,000 steps (12 hours) on 8 P100 GPUs, while the big model took 300,000 steps (3.5 days). Paired with Table 2\'s FLOPs column, what does this primarily demonstrate?',
                  options: [
                    'The Transformer family reaches state-of-the-art quality at dramatically lower training cost than prior ensemble models',
                    'Bigger Transformer models always train faster than base models despite more steps',
                    'GPU count is the main bottleneck, so 8 GPUs is the minimum needed for any result in the paper',
                    'Training cost scales linearly with BLEU score across all models in the comparison',
                  ],
                  answer: 0,
                  explanation:
                    'The base Transformer beats every prior ensemble at roughly 1/50th the training compute of the best ensemble — Table 2 is about cost and quality moving together favorably.',
                },
                {
                  prompt:
                    'Label smoothing (ε_ls = 0.1) is described as hurting perplexity while improving accuracy and BLEU. What general training lesson does this illustrate?',
                  options: [
                    'The metric you directly optimize during training is not always the metric you ultimately care about reporting',
                    'Perplexity is a flawed metric that should never be used to evaluate translation models',
                    'Label smoothing is only useful when dropout is disabled',
                    'BLEU and perplexity are mathematically equivalent under label smoothing',
                  ],
                  answer: 0,
                  explanation:
                    'Label smoothing softens training targets, making the model less confident (worse perplexity) but improving downstream quality (BLEU) — a concrete example of training objective and evaluation objective diverging.',
                },
                {
                  prompt:
                    'The ablation table shows h=1 scoring 24.9 BLEU and h=32 scoring 25.4, both below the base h=8 score of 25.8. What does this pattern demonstrate?',
                  options: [
                    'Multi-head attention helps via specialization across heads, but splitting attention too thinly across many heads also degrades quality',
                    'More attention heads always strictly improve BLEU',
                    'Single-head attention is mathematically identical to multi-head attention when compute is held constant',
                    'The number of heads has no measurable effect on translation quality',
                  ],
                  answer: 0,
                  explanation:
                    'Because total compute is held fixed, both too few heads (no specialization) and too many heads (each too thin) hurt quality — h=8 sits near an empirical sweet spot rather than "more is better."',
                },
                {
                  prompt:
                    'Variation (D), removing dropout entirely, drops dev BLEU to 24.6 — among the worst results in the table. What does this indicate?',
                  options: [
                    'Dropout is acting as effective regularization; without it the model overfits the training data',
                    'Dropout was unnecessary and only included for ablation completeness',
                    'Removing dropout speeds up training, and the BLEU drop is purely a training-steps artifact',
                    'Dropout primarily affects the learning rate warmup schedule, not generalization',
                  ],
                  answer: 0,
                  explanation:
                    'Without dropout the model fits training data more closely but generalizes worse to held-out data — a textbook regularization effect.',
                },
                {
                  prompt:
                    'Why does the English constituency parsing experiment matter beyond just adding another benchmark result?',
                  options: [
                    'It tests the architecture on a structurally different task with no task-specific tuning, providing evidence the gains come from the architecture itself, not translation-specific tricks',
                    'It shows the Transformer was originally designed for parsing before being adapted to translation',
                    'It demonstrates the Transformer requires far more training data than RNN-based parsers to be competitive',
                    'It proves attention mechanisms only work on tasks where output length equals input length',
                  ],
                  answer: 0,
                  explanation:
                    'Parsing has a very different problem shape than translation (longer outputs, strict structural constraints). Succeeding here without task-specific tuning is the strongest evidence the results generalize beyond translation.',
                },
              ],
            },
          ],
        },
        {
          id: 'tf-critique',
          title: 'Choosing an architecture: trade-offs in practice',
          minutes: 10,
          xp: 55,
          steps: [
            {
              kind: 'scenario',
              title: 'Self-attention vs. recurrence vs. restricted attention',
              scenario: {
                intro:
                  'You\'re architecting sequence models for three different problems. Apply the complexity/parallelism/path-length trade-offs from Section 4 to each one.',
                stages: [
                  {
                    situation:
                      'You\'re building a translation system for sentences of 30-60 tokens, with d_model = 512 (so n is well under d). Training speed and translation quality both matter.',
                    question: 'Which layer type best fits this regime, and why?',
                    options: [
                      {
                        label:
                          'Full self-attention — n < d here, so the O(n²·d) cost stays manageable, and you get O(1) sequential operations plus O(1) max path length',
                        quality: 'best',
                        feedback:
                          'Exactly the regime the paper calls out: "self-attention layers are faster than recurrent layers when the sequence length n is smaller than the representation dimensionality d, which is most often the case with sentence representations." You get full parallelism and the shortest possible path between any two positions, at a cost the paper\'s own results show is still cheaper in practice than the recurrent alternatives it replaced.',
                      },
                      {
                        label:
                          'A stack of recurrent layers — O(n·d²) per layer is cheaper than O(n²·d) when d is large, so this should train faster',
                        quality: 'bad',
                        feedback:
                          'Comparing the formulas alone misses the real bottleneck: recurrence is O(n) *sequential* operations, meaning the steps cannot run in parallel no matter how much compute or how many GPUs you throw at it. That sequential constraint, not the per-layer FLOP count, is what made RNN training slow at this scale.',
                      },
                      {
                        label:
                          'Convolutional layers with a single kernel covering the whole sentence — one layer, full coverage, done',
                        quality: 'bad',
                        feedback:
                          'A single convolutional layer with kernel width k < n does not connect all pairs of positions; covering the full sequence requires either O(n/k) stacked layers or dilated convolutions reaching O(log_k(n)) — and convolutional layers are also more expensive per layer than recurrent ones by a factor of k.',
                      },
                    ],
                  },
                  {
                    situation:
                      'You need to process long genomic or audio sequences where n can reach 100,000+ tokens, with a comparatively small d_model = 256 — now n is far larger than d.',
                    question: 'What does the complexity table suggest you should consider here, and what do you give up?',
                    options: [
                      {
                        label:
                          'Restrict self-attention to a local neighborhood of size r, accepting that max path length rises from O(1) to O(n/r) in exchange for cutting per-layer cost from O(n²·d) to O(r·n·d)',
                        quality: 'best',
                        feedback:
                          'This is exactly the trade-off the paper flags in Section 4 as future work: when n grows past d, full self-attention\'s O(n²·d) cost becomes the dominant problem, so restricting the attention window trades away some of the "any two positions connect in one hop" benefit to keep training tractable.',
                      },
                      {
                        label:
                          'Use full self-attention regardless — the O(1) max path length is too valuable to give up',
                        quality: 'bad',
                        feedback:
                          'At n = 100,000 the O(n²·d) term dominates by orders of magnitude over the O(n·d²) a recurrent or restricted-attention approach would pay; the path-length benefit doesn\'t offset a compute cost that scales quadratically with a sequence this long.',
                      },
                      {
                        label:
                          'Switch to a pure recurrent architecture, since it avoids the n² term entirely',
                        quality: 'ok',
                        feedback:
                          'It\'s true recurrence avoids the n² blowup, and the paper\'s own table shows O(n·d²) compute for recurrent layers — but you\'re reintroducing the O(n) sequential-operations bottleneck this whole architecture was designed to eliminate, trading one problem for the original one.',
                      },
                    ],
                  },
                  {
                    situation:
                      'A teammate proposes: "Since the decoder generates one token at a time at inference anyway, let\'s just train it the same way — process the target sequence sequentially during training too, to keep training and inference consistent."',
                    question: 'How would you respond, using what Section 3.1 says about masked self-attention?',
                    options: [
                      {
                        label:
                          'Keep training parallel: feed the whole target sequence at once and use a mask (set illegal future connections to −∞ before softmax) so every position\'s attention scores are still computed simultaneously, just with future positions discarded',
                        quality: 'best',
                        feedback:
                          'This is precisely how the paper resolves the tension: masking is a single matrix operation, not a sequential loop, so position i\'s output still depends only on positions ≤ i (matching inference-time constraints) while training keeps the full parallelism that motivated the architecture in the first place.',
                      },
                      {
                        label:
                          'Agree — replicate the sequential, one-token-at-a-time generation process during training for consistency',
                        quality: 'bad',
                        feedback:
                          'This throws away the entire benefit of the architecture: it reintroduces an O(n) sequential dependency into training that the masking trick exists specifically to avoid, for a "consistency" that the mask already provides without the cost.',
                      },
                      {
                        label:
                          'Disagree, and skip masking entirely — let every position attend to the full target sequence during training since it converges faster',
                        quality: 'bad',
                        feedback:
                          'Without masking, position i can see positions after it, which it will never have access to at inference time. That\'s direct information leakage — the model would learn to rely on future tokens it cannot use when actually generating output.',
                      },
                    ],
                  },
                ],
                debrief:
                  'Section 4\'s three numbers — per-layer complexity, sequential operations, and max path length — aren\'t academic bookkeeping. They\'re a decision table: pick self-attention when n < d and you want both parallelism and short dependency paths; pick a restricted/local variant when n grows large enough that the n² term dominates; and remember that masking is what lets a model stay auto-regressive at inference while still training with full parallelism, the trick that makes the whole architecture\'s parallelism claim hold up end to end.',
              },
            },
          ],
        },
      ],
    },
  ],
}
