import type { Subject } from '../types'
import motivationMd from './md/ln-motivation.md?raw'
import methodMd from './md/ln-method.md?raw'
import invarianceMd from './md/ln-invariance.md?raw'
import geometryMd from './md/ln-geometry.md?raw'
import resultsMd from './md/ln-results.md?raw'

export const layerNormalization: Subject = {
  id: 'layer-normalization',
  title: 'Layer Normalization',
  tagline: 'Transpose batch normalization across neurons instead of across examples — and get an RNN-friendly normalizer for free.',
  icon: '📏',
  accent: '#f43f5e',
  modules: [
    {
      id: 'ln-m1',
      title: 'Layer Normalization',
      description: 'Ba, Kiros & Hinton (2016): why batch norm struggles with RNNs and small batches, how layer norm fixes it by normalizing across a layer\'s neurons instead of across the batch, what that buys (and costs) in invariance, and where it wins and loses empirically.',
      lessons: [
        {
          id: 'ln-motivation',
          title: 'Why batch normalization breaks down on RNNs',
          minutes: 8,
          xp: 50,
          steps: [
            { kind: 'read', title: 'The problem with batch statistics', markdown: motivationMd },
          ],
        },
        {
          id: 'ln-method',
          title: 'The layer normalization equations',
          minutes: 12,
          xp: 70,
          steps: [
            { kind: 'read', title: 'Normalizing across the layer, not the batch', markdown: methodMd },
            {
              kind: 'quiz',
              title: 'Check your understanding: the method',
              questions: [
                {
                  prompt: 'For a given hidden unit, batch normalization computes its mean and variance by looking across which dimension?',
                  options: [
                    'Across the training examples in the mini-batch, for that one neuron',
                    'Across all neurons in the layer, for one training example',
                    'Across all time-steps of the sequence, for that one neuron',
                    'Across all layers of the network, for one training example',
                  ],
                  answer: 0,
                  explanation: 'Batch normalization estimates µ and σ per neuron by averaging that neuron\'s summed input across the training cases in the batch (Eq. 2). Layer normalization is the 90-degree rotation of this: per training case, across the neurons in a layer.',
                },
                {
                  prompt: 'Layer normalization computes µ and σ by averaging over what?',
                  options: [
                    'All H neurons in a layer, for a single training case',
                    'All training cases in the mini-batch, for a single neuron',
                    'All time-steps seen so far, for a single neuron',
                    'All layers in the network, for a single neuron',
                  ],
                  answer: 0,
                  explanation: 'Layer norm (Eq. 3) computes one mean/variance per training case by averaging the summed inputs across all H neurons in that layer — the opposite axis from batch normalization\'s per-neuron, across-batch statistics.',
                },
                {
                  prompt: 'The paper states: "All the hidden units in a layer share the same normalization terms µ and σ, but different training cases have different normalization terms." What is the corresponding statement for batch normalization?',
                  options: [
                    'All training cases in a batch share the normalization terms for a given neuron, but different neurons have different terms',
                    'All neurons share one global normalization term regardless of training case',
                    'Different training cases and different neurons all share the same single normalization term',
                    'Batch normalization has no shared normalization terms at all — every unit is independent',
                  ],
                  answer: 0,
                  explanation: 'This is the precise mirror image: under batch norm, a fixed neuron\'s statistic is shared across every example in the batch, while different neurons get different statistics. Layer norm flips which axis is "shared" and which is "distinct."',
                },
                {
                  prompt: 'After computing µ and σ by either method, what happens next in the normalization formula hᵢ = f((gᵢ/σᵢ)(aᵢ − µᵢ) + bᵢ)?',
                  options: [
                    'A learned per-neuron gain g and bias b are applied before the non-linearity f',
                    'The non-linearity f is applied first, then g and b rescale the output',
                    'g and b are computed from the batch statistics rather than learned',
                    'No further transformation is applied — normalization alone produces the final activation',
                  ],
                  answer: 0,
                  explanation: 'Both batch norm and layer norm apply the same affine recovery step: normalize, then multiply by a learned gain g and add a learned bias b, and only then apply f.',
                },
                {
                  prompt: 'Why are the gain g and bias b parameters necessary if normalization already centers and rescales the activations?',
                  options: [
                    'Forcibly normalizing wipes out useful per-neuron information, so g and b are learned parameters that let the network restore whatever scale/offset helps, decoupled from the raw exploding/vanishing magnitude',
                    'They are required only to make the formula dimensionally consistent, with no effect on training',
                    'They replace the need for any non-linearity f afterward',
                    'They are only used at test time, never during training',
                  ],
                  answer: 0,
                  explanation: 'Normalization strips out scale and offset information entirely. g and b give the network a controlled, learned way to put back useful scale/offset — decoupled from the raw, potentially exploding magnitude of the unnormalized aᵢ.',
                },
                {
                  prompt: 'Inside an RNN, how does layer normalization at time-step t differ from batch normalization\'s approach to the same problem?',
                  options: [
                    'Layer norm computes µₜ and σₜ from only that time-step\'s own H-dimensional vector, independent of other time-steps, while batch norm would need separate stored statistics per time-step',
                    'Layer norm requires the full sequence to be processed before any statistics can be computed',
                    'Layer norm uses the same running statistics as batch norm but only updates them once per sequence',
                    'Layer norm and batch norm both need one set of stored statistics per time-step, but layer norm computes them faster',
                  ],
                  answer: 0,
                  explanation: 'Layer norm at each time-step only looks at the current aₜ across that layer\'s H units — no history, no stored per-step statistics needed.',
                },
                {
                  prompt: 'A layer-normalized RNN is trained only on sequences up to length 50, then evaluated on a sequence of length 4,000. What happens?',
                  options: [
                    'The exact same normalization rule applies unchanged at every time-step, since µₜ/σₜ depend only on the current step\'s own layer, not on sequence position',
                    'The model fails because there are no stored statistics for time-steps beyond 50',
                    'The gain and bias parameters must be re-learned for the new sequence length',
                    'Layer normalization is skipped for time-steps beyond the training length',
                  ],
                  answer: 0,
                  explanation: 'Because layer norm never depends on sequence position or stores per-time-step running statistics, the same rule applies at step 4,000 exactly as it would at step 5.',
                },
                {
                  prompt: 'According to Section 3.1, what specifically does layer normalization make the hidden-to-hidden dynamics of an RNN invariant to?',
                  options: [
                    'Re-scaling all of the summed inputs to a layer',
                    'The choice of non-linearity f used at each time-step',
                    'The number of layers stacked in the network',
                    'The initial values of the gain and bias parameters',
                  ],
                  answer: 0,
                  explanation: 'The paper states layer norm\'s normalization terms make the network invariant to re-scaling all summed inputs to a layer, which counteracts the source of exploding/vanishing gradients.',
                },
                {
                  prompt: 'In a standard (non-normalized) RNN, what tendency does the paper identify as causing exploding or vanishing gradients?',
                  options: [
                    'The average magnitude of the summed inputs to recurrent units tends to grow or shrink at every time-step',
                    'The gain and bias parameters drift to extreme values over time',
                    'The batch size shrinks as the sequence progresses',
                    'The non-linearity f becomes discontinuous for long sequences',
                  ],
                  answer: 0,
                  explanation: 'The paper explicitly attributes exploding/vanishing gradients in standard RNNs to summed inputs growing or shrinking in magnitude across time-steps.',
                },
                {
                  prompt: 'Why does layer normalization use only one set of gain (g) and bias (b) parameters shared across all time-steps in an RNN, rather than a separate set per time-step?',
                  options: [
                    'Because the normalization itself (µₜ, σₜ) already adapts per time-step from that step\'s own data, so a single shared g/b is sufficient and avoids the per-time-step storage problem batch norm has',
                    'Because g and b have no real effect on the RNN\'s output, so their count is irrelevant',
                    'Because RNN sequences are always padded to the same fixed length, making per-step parameters unnecessary',
                    'Because batch normalization requires per-time-step gain and bias, and layer norm is designed to do the opposite in every respect',
                  ],
                  answer: 0,
                  explanation: 'The per-step adaptivity already comes from recomputing µₜ and σₜ fresh at each time-step. A single shared g and b then suffices, keeping the parameter count independent of sequence length.',
                },
              ],
            },
          ],
        },
        {
          id: 'ln-invariance',
          title: 'Invariance properties: three methods, one formula',
          minutes: 12,
          xp: 70,
          steps: [
            { kind: 'read', title: 'What stays the same under re-scaling and re-centering', markdown: invarianceMd },
            {
              kind: 'quiz',
              title: 'Check your understanding: invariance',
              questions: [
                {
                  prompt: 'Batch norm, weight norm, and layer norm are all described as sharing the same general form hᵢ = f(gᵢ/σᵢ · (aᵢ − µᵢ) + bᵢ). What actually distinguishes the three methods from each other?',
                  options: [
                    'What set of values µ and σ are computed over',
                    'Whether the activation function f is linear or nonlinear',
                    'Whether the gain gᵢ and bias bᵢ are learned or fixed',
                    'The order in which normalization and the affine transform are applied',
                  ],
                  answer: 0,
                  explanation: 'All three plug into the identical formula; they differ only in what µ and σ measure — batch norm averages over the batch, layer norm averages over the H neurons in one case, and weight norm uses 0 and the L2 norm of the weight vector instead.',
                },
                {
                  prompt: 'Weight normalization sets µ = 0 instead of computing a mean. What is the direct consequence for its invariance properties, per the table?',
                  options: [
                    'Weight norm is invariant to weight matrix re-scaling but not weight matrix re-centering, since there is no µ term to absorb a shift',
                    'Weight norm becomes invariant to every transformation in the table because it never depends on data',
                    'Weight norm is invariant to dataset re-centering because µ = 0 already represents a centered statistic',
                    'Weight norm loses invariance to weight vector re-scaling as a result',
                  ],
                  answer: 0,
                  explanation: 'With µ fixed at 0, there is nothing to absorb an additive shift to the weight matrix, so weight norm is marked "No" for weight matrix re-centering — same as batch norm.',
                },
                {
                  prompt: 'Per the invariance table, which transformation is layer norm invariant to but batch norm is NOT?',
                  options: [
                    'Weight matrix re-centering',
                    'Weight matrix re-scaling',
                    'Weight vector re-scaling',
                    'Dataset re-scaling',
                  ],
                  answer: 0,
                  explanation: 'Layer norm is invariant to weight matrix re-centering while batch norm is not — layer norm\'s µ comes from averaging across neurons within a case, which absorbs a constant shift to the weight matrix.',
                },
                {
                  prompt: 'The proof for weight-matrix re-centering uses W′ = δW + 1γᵗ. Why does layer norm produce "effectively the same output" under this transformation while batch norm does not?',
                  options: [
                    "Layer norm's µ is computed across the neurons within a single case, so it absorbs exactly the constant shift γ added to every row of the weight matrix",
                    "Layer norm's gain and bias parameters are retrained after every weight update, canceling the shift",
                    "Batch norm doesn't use a learned bias term, so it has no way to cancel an additive shift",
                    "Layer norm ignores the weight matrix entirely and normalizes only the input vector",
                  ],
                  answer: 0,
                  explanation: "Adding a constant γ to every row of W shifts every neuron's pre-activation by the same amount, which is exactly what layer norm's µ subtracts out. Batch norm's µ comes from variation across training cases, not across neurons, so it has no symmetric structure to cancel a weight-matrix shift.",
                },
                {
                  prompt: 'If you multiply a single training example\'s input vector x by a constant δ (leaving the weights and every other example untouched), what happens under layer norm versus batch norm?',
                  options: [
                    "Layer norm's prediction for that case is unchanged because its µ and σ scale together with x and cancel exactly; batch norm's prediction does change because its statistics come from the rest of the batch, which didn't get rescaled",
                    'Both methods are unaffected because normalization always removes scale regardless of what is being averaged over',
                    "Layer norm's prediction changes because its statistics are also computed only from that one case and thus get rescaled too",
                    "Batch norm's prediction is unaffected because batch statistics are recomputed after every individual example",
                  ],
                  answer: 0,
                  explanation: "Layer norm's µ and σ for a case are derived only from that case's own neuron activations, so scaling the input by δ scales both µ and σ by δ too, and the ratio cancels (Eq. 7).",
                },
                {
                  prompt: 'Layer norm is invariant to rescaling the entire weight matrix but NOT to rescaling a single weight vector (one neuron\'s incoming weights). What is the resolution to this apparent asymmetry?',
                  options: [
                    "It's a genuine trade-off: layer norm gives up single-neuron weight-rescaling invariance (which batch norm and weight norm have) in exchange for per-case, per-time-step independence — neither method strictly dominates the other",
                    'It is a flaw in the paper\'s proof that later work corrected',
                    'Single weight vector invariance is actually unimportant in practice, so the gap doesn\'t matter',
                    'Layer norm regains this invariance once the gain parameter gᵢ is learned rather than fixed',
                  ],
                  answer: 0,
                  explanation: 'Layer norm sacrifices invariance to scaling one neuron\'s individual weight vector — something batch norm and weight norm both provide — in exchange for guarantees that hold per training case and per time step regardless of batch composition.',
                },
                {
                  prompt: "Why does layer normalization underperform batch normalization specifically on convolutional networks, according to the paper's own explanation (Section 6.7)?",
                  options: [
                    'Edge-of-image units have receptive fields that are rarely fully active and have very different statistics than interior units, so averaging them together with interior units in one layer-wide statistic fits neither population well',
                    'Convolutional layers have too few neurons per layer for any per-case mean and variance to be statistically meaningful',
                    'Layer normalization cannot be implemented efficiently for convolutional weight-sharing, so it falls back to a slower approximation',
                    'Batch normalization uses a larger effective batch size in convolutional networks because it pools over spatial positions as well',
                  ],
                  answer: 0,
                  explanation: "Layer norm assumes the H neurons it pools over within a layer are exchangeable enough to share one mean/variance. In conv nets, units near the image boundary see padding and partial receptive fields and have genuinely different statistics, so pooling them together fits neither group well.",
                },
                {
                  prompt: 'How does the convolutional-network result relate to the invariance proofs earlier in the paper — does it contradict them?',
                  options: [
                    "No: the invariance proofs are about whether output stays unchanged under a transformation; they say nothing about whether the underlying statistic is a good summary of the pooled neurons, which is the actual problem in conv nets",
                    'Yes: if layer norm were truly invariant to weight matrix re-centering, it should also outperform batch norm on every architecture, including convolutional ones',
                    'No contradiction, because the convolutional result only applies when batch size is very large, a case the invariance proofs never covered',
                    'Yes: the conv net result shows the invariance proofs only hold for fully-connected layers and are mathematically wrong for convolutional weight sharing',
                  ],
                  answer: 0,
                  explanation: 'The invariance table proves layer norm\'s output is unchanged under certain algebraic transformations — a property of the formula. Whether the mean/variance computed across a layer\'s neurons is a meaningful summary of those neurons is a separate, empirical question, which is what hurts layer norm in conv nets.',
                },
                {
                  prompt: 'The handwriting-generation experiment (sequences of length ~700, batch size 8) is highlighted as the clearest case for layer norm. Why does this setting specifically stress batch normalization?',
                  options: [
                    'A batch size of 8 gives too few samples to estimate a stable batch variance, and a sequence length of ~700 makes storing separate per-time-step batch statistics impractical — both problems layer norm avoids since its statistics are computed per case, independent of batch size or time step',
                    'Long sequences cause batch norm to run out of memory because it must store activations for every time step simultaneously, which layer norm avoids by discarding earlier time steps',
                    'Batch norm requires a fixed sequence length across the batch, and length-700 sequences exceed an architectural limit that layer norm does not have',
                    'Small batches make batch norm unstable purely due to floating point rounding, a problem layer norm avoids via higher-precision arithmetic',
                  ],
                  answer: 0,
                  explanation: 'Batch norm needs enough samples per batch for a reliable variance estimate and a per-time-step statistic for sequence models — small batches undermine the first, long sequences make the second impractical. Layer norm never depended on either.',
                },
                {
                  prompt: 'Across the six tasks reported, what kind of architecture and setting consistently favors layer normalization over batch normalization?',
                  options: [
                    'Recurrent networks operating on long or variable-length sequences',
                    'Convolutional networks with large image inputs',
                    'Feedforward networks with very wide hidden layers and large batch sizes',
                    'Any model trained with a very high learning rate',
                  ],
                  answer: 0,
                  explanation: "All six tasks are dominated by recurrent networks on long or variable-length sequences — exactly the regime where batch norm's per-time-step, per-batch statistics break down and layer norm's per-case statistics hold up.",
                },
              ],
            },
          ],
        },
        {
          id: 'ln-geometry',
          title: 'Why normalization stabilizes learning, not just outputs',
          minutes: 8,
          xp: 50,
          steps: [
            { kind: 'read', title: 'The implicit learning-rate effect', markdown: geometryMd },
          ],
        },
        {
          id: 'ln-code',
          title: 'Implement layer normalization',
          minutes: 15,
          xp: 90,
          steps: [
            {
              kind: 'code',
              title: 'Build the LN(z; g, b) function',
              challenge: {
                prompt: `## Implement layer normalization

The supplementary material (Eq. 15-16) defines layer normalization as a function mapping a vector of summed inputs \`z\` to a normalized output, using two learned parameter vectors: gains \`g\` (called α in the paper) and biases \`b\` (called β):

\`\`\`
LN(z; g, b) = ((z - mean(z)) / std(z)) ⊙ g + b
mean(z) = (1/D) * sum(z)
std(z)  = sqrt((1/D) * sum((z - mean)^2))
\`\`\`

Implement \`layerNorm(z, gain, bias, eps = 1e-5)\`:
- Compute the mean of \`z\` across **all of its own elements** (this is the layer-normalization axis — across neurons in one training case, not across a batch).
- Compute the variance the same way, and take \`sqrt(variance + eps)\` as the standard deviation (the \`eps\` avoids dividing by zero when every element of \`z\` is identical).
- Return a new array where element \`i\` is \`((z[i] - mean) / std) * gain[i] + bias[i]\`.

The tests check the basic computation, the zero-variance edge case (Section 3's normalization on a constant vector should fall back to roughly the bias), and the invariance property from Eq. 7: scaling the *entire* input vector \`z\` by a constant must leave the final output unchanged.`,
                starterCode: `function layerNorm(z, gain, bias, eps = 1e-5) {
  // TODO: normalize z to zero mean / unit variance across its own elements,
  // then apply gain and bias per element
  return z;
}`,
                solution: `function layerNorm(z, gain, bias, eps = 1e-5) {
  const H = z.length;
  const mean = z.reduce((s, v) => s + v, 0) / H;
  const variance = z.reduce((s, v) => s + (v - mean) ** 2, 0) / H;
  const std = Math.sqrt(variance + eps);
  return z.map((v, i) => ((v - mean) / std) * gain[i] + bias[i]);
}`,
                tests: `function round(arr, d = 4) {
  return arr.map(v => Math.round(v * 10 ** d) / 10 ** d);
}

test('basic normalization with unit gain, zero bias', () => {
  const out = round(layerNorm([1, 2, 3, 4], [1, 1, 1, 1], [0, 0, 0, 0]));
  assertEqual(out, [-1.3416, -0.4472, 0.4472, 1.3416], 'normalizes to ~unit variance, zero mean');
});

test('constant input collapses toward the bias', () => {
  const out = round(layerNorm([5, 5, 5], [1, 1, 1], [2, 2, 2]));
  assertEqual(out, [2, 2, 2], 'zero variance input normalizes to ~0, so output is just the bias');
});

test('invariant to uniformly re-scaling the whole input vector', () => {
  const z = [2, 4, 6, 8];
  const scaled = z.map(v => v * 3);
  const gain = [1, 1, 1, 1];
  const bias = [0, 0, 0, 0];
  assertEqual(round(layerNorm(z, gain, bias)), round(layerNorm(scaled, gain, bias)), 'Eq. 7: rescaling a single training case leaves the normalized output unchanged');
});

test('gain and bias are applied per-element after normalization', () => {
  const out = round(layerNorm([1, 2, 3, 4], [2, 2, 2, 2], [10, 10, 10, 10]));
  assertEqual(out, [7.3167, 9.1056, 10.8944, 12.6833], 'gain scales and bias shifts the normalized value per neuron');
});`,
              },
            },
          ],
        },
        {
          id: 'ln-results',
          title: 'Results, limits, and choosing a normalizer',
          minutes: 12,
          xp: 70,
          steps: [
            { kind: 'read', title: 'Where it wins, where it loses', markdown: resultsMd },
            {
              kind: 'scenario',
              title: 'Pick the right normalizer for the job',
              scenario: {
                intro: 'You\'re a researcher choosing a normalization scheme for three different model-training problems. Apply what the paper found about each method\'s invariance properties and empirical behavior — not just "layer norm is the newer one, use it everywhere."',
                stages: [
                  {
                    situation: 'You\'re training an attentive-reader question-answering model. Passages are anonymized and vary in length, and you want the exact same normalization rule to apply at time-step 5 and at time-step 500 without storing per-step statistics.',
                    question: 'Which normalization scheme fits, and why?',
                    options: [
                      {
                        label: 'Layer normalization — statistics come from each time-step\'s own layer, so no per-step storage and no length dependence',
                        quality: 'best',
                        feedback: 'Right. This is exactly the regime the paper built layer norm for: variable-length RNN sequences where batch norm would otherwise need a separate stored statistic per time-step, with no fallback for time-steps longer than anything seen in training.',
                      },
                      {
                        label: 'Batch normalization, with one set of running statistics per time-step',
                        quality: 'bad',
                        feedback: 'This is the approach the paper shows breaks down: it requires storing a statistic for every time-step ever seen, and has no defined behavior for a test sequence longer than any training sequence.',
                      },
                      {
                        label: 'Weight normalization, since it never depends on the data distribution at all',
                        quality: 'bad',
                        feedback: 'Weight norm\'s σ comes from the weight vector\'s L2 norm, not the data — so it sidesteps batch-size issues, but it doesn\'t solve the actual problem here, which is that the per-time-step *activation* statistics still vary with sequence position under the original parameterization.',
                      },
                    ],
                  },
                  {
                    situation: 'You\'re doing online learning: examples arrive one at a time, batch size is permanently 1, and you can never look back at a "batch" of past examples to compute a variance.',
                    question: 'Which normalization scheme is structurally usable here, and why?',
                    options: [
                      {
                        label: 'Layer normalization — its statistics come from a single training case\'s own layer, never from looking across multiple examples',
                        quality: 'best',
                        feedback: 'Correct. The paper states layer norm "does not impose any constraint on the size of a mini-batch and it can be used in the pure online regime with batch size 1" — because µ and σ never depend on anything outside the current example.',
                      },
                      {
                        label: 'Batch normalization, using a batch size of 1 as the special case',
                        quality: 'bad',
                        feedback: 'A batch of 1 gives you a meaningless variance estimate (a single sample\'s deviation from itself is always zero) — batch norm\'s whole estimation procedure assumes a real distribution of examples to summarize.',
                      },
                      {
                        label: 'Whichever method has the lowest computational cost per step, since they\'re otherwise interchangeable here',
                        quality: 'bad',
                        feedback: 'They are not interchangeable in this setting — batch normalization is structurally broken at batch size 1, regardless of computational cost.',
                      },
                    ],
                  },
                  {
                    situation: 'You\'re training a convolutional image classifier with large batches readily available. You recall from this paper that layer norm worked well on every RNN task tested.',
                    question: 'Should you default to layer normalization for the convolutional layers too?',
                    options: [
                      {
                        label: 'No — use batch normalization here. The paper found layer norm underperforms on ConvNets because boundary units have very different statistics than interior units, breaking the "neurons in a layer are exchangeable" assumption layer norm relies on',
                        quality: 'best',
                        feedback: 'Exactly the Section 6.7 finding. Large batches are available here, so batch norm\'s main weakness (small/online batches) doesn\'t apply, while layer norm\'s pooling-across-neurons assumption is specifically violated by convolutional boundary effects.',
                      },
                      {
                        label: 'Yes — layer normalization is strictly newer and outperformed batch normalization on every task in the paper',
                        quality: 'bad',
                        feedback: 'The paper is explicit that this isn\'t universal: "batch normalization outperforms the other methods" on the convolutional experiments specifically, for a stated structural reason.',
                      },
                      {
                        label: 'It doesn\'t matter — invariance properties guarantee identical training behavior regardless of architecture',
                        quality: 'bad',
                        feedback: 'Invariance properties describe what stays unchanged under certain transformations of weights or inputs; they say nothing about whether the pooled statistic is a good summary for a given architecture\'s neurons — which is precisely where conv nets cause trouble.',
                      },
                    ],
                  },
                ],
                debrief: 'No single normalizer dominates: layer norm wins exactly where its core assumption (neurons within a layer are statistically exchangeable, for any one training case) holds — recurrent nets, variable-length sequences, small or online batches. It loses exactly where that assumption breaks — convolutional layers with structurally different boundary and interior units, where batch normalization\'s large-batch statistics are both available and more representative.',
              },
            },
          ],
        },
      ],
    },
  ],
}
