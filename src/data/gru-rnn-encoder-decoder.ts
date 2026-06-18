import type { Subject } from '../types'
import motivationMd from './md/gru-motivation.md?raw'
import encoderDecoderMd from './md/gru-encoder-decoder.md?raw'
import hiddenUnitMd from './md/gru-hidden-unit.md?raw'
import smtApplicationMd from './md/gru-smt-application.md?raw'
import qualitativeAnalysisMd from './md/gru-qualitative-analysis.md?raw'

export const gruRnnEncoderDecoder: Subject = {
  id: 'gru-rnn-encoder-decoder',
  title: 'RNN Encoder–Decoder & the GRU',
  tagline: 'Two RNNs, one bottleneck vector, and the gated hidden unit that made it trainable.',
  icon: '🔁',
  accent: '#c084fc',
  modules: [
    {
      id: 'gru-m1',
      title: 'Learning Phrase Representations using RNN Encoder–Decoder',
      description:
        'Cho et al. 2014 (arXiv:1406.1078). The paper that introduced the encoder–decoder architecture and the gated hidden unit later called the GRU, applied to scoring phrase pairs in statistical machine translation.',
      lessons: [
        {
          id: 'gru-motivation',
          title: 'Why translate sequences with neural networks?',
          minutes: 10,
          xp: 60,
          steps: [
            { kind: 'read', title: 'A sentence has no fixed length', markdown: motivationMd },
            {
              kind: 'quiz',
              title: 'The bottleneck idea',
              questions: [
                {
                  prompt:
                    "Why can't a plain feedforward neural network directly serve as a translation function from English to French?",
                  options: [
                    'It requires a fixed number of input and output slots decided before training, but sentence lengths vary',
                    'It cannot be trained with gradient descent on text data',
                    'It can only process one word at a time, never a sequence',
                    'It lacks enough parameters to represent vocabulary',
                  ],
                  answer: 0,
                  explanation:
                    "A feedforward network's architecture fixes input and output dimensionality at design time. Sentences range from two words to dozens, so no single fixed-size mapping covers them — exactly the problem the RNN Encoder-Decoder solves.",
                },
                {
                  prompt: 'What is the role of the vector `c` in the RNN Encoder-Decoder architecture?',
                  options: [
                    'It is a fixed-size context vector that the encoder compresses the entire variable-length input into, which the decoder then expands back into a variable-length output',
                    'It is a count of how many words are in the input sentence',
                    'It is a lookup table mapping source words directly to target words',
                    'It is the final translated sentence before post-processing',
                  ],
                  answer: 0,
                  explanation:
                    '`c` is the bottleneck: regardless of input length, the encoder squeezes the whole sequence into this single fixed-shape vector before the decoder starts generating.',
                },
                {
                  prompt:
                    'How does the RNN Encoder-Decoder get used within the statistical machine translation (SMT) system described in the paper?',
                  options: [
                    'It scores candidate (source phrase, target phrase) pairs, and that score is added as one extra feature in the existing log-linear scoring model',
                    'It replaces the SMT phrase table entirely, generating translations directly without any existing pipeline',
                    'It is used only to pre-process the source sentence before SMT begins',
                    'It re-ranks entire candidate sentences after the SMT decoder has already chosen a translation',
                  ],
                  answer: 0,
                  explanation:
                    "The encoder-decoder computes a conditional probability for each candidate phrase pair, plugged in as an additional feature alongside the SMT system's existing hand-built features.",
                },
                {
                  prompt:
                    'What empirical claim does the paper make about adding the RNN Encoder-Decoder\'s phrase-pair probabilities to an existing SMT system?',
                  options: [
                    'SMT performance is found to improve when these conditional probabilities are used as an additional feature in the existing log-linear model',
                    'SMT performance is unaffected, but training time is reduced',
                    'SMT performance degrades slightly but inference becomes faster',
                    'The RNN Encoder-Decoder makes the existing log-linear model and its hand-built features unnecessary',
                  ],
                  answer: 0,
                  explanation:
                    'The abstract states SMT performance "is empirically found to improve" when the RNN Encoder-Decoder\'s phrase-pair probabilities are added as an extra feature.',
                },
              ],
            },
          ],
        },
        {
          id: 'gru-encoder-decoder',
          title: 'From RNNs to an Encoder–Decoder',
          minutes: 12,
          xp: 70,
          steps: [
            { kind: 'read', title: 'Two RNNs, one bottleneck vector', markdown: encoderDecoderMd },
            {
              kind: 'quiz',
              title: 'Encoder, decoder, and the context vector',
              questions: [
                {
                  prompt:
                    'A plain RNN computes h⟨t⟩ = f(h⟨t−1⟩, x_t). What does this recurrence make possible that a simple feedforward network cannot do?',
                  options: [
                    'It lets the network condition each prediction on a running summary of everything seen so far in the sequence, without needing a fixed input length',
                    'It lets the network see the entire input sequence at once before producing any output',
                    'It removes the need for a hidden state entirely by predicting directly from x_t',
                    'It guarantees the output sequence will be the same length as the input sequence',
                  ],
                  answer: 0,
                  explanation:
                    'The hidden state carries forward a summary of all prior inputs, letting an RNN process sequences of arbitrary length one step at a time.',
                },
                {
                  prompt: 'What is the context vector c, precisely?',
                  options: [
                    'The final hidden state of the encoder RNN after it has consumed the entire input sequence, frozen as a fixed-length summary',
                    'The average of the encoder\'s hidden states across all timesteps',
                    'The first hidden state the encoder produces, before it has seen most of the input',
                    'A concatenation of every encoder hidden state, with length proportional to input length',
                  ],
                  answer: 0,
                  explanation:
                    'c = h⟨T⟩, the encoder\'s hidden state at the last input timestep — fixed-length regardless of input length.',
                },
                {
                  prompt: 'Why is c re-supplied to every decoder timestep instead of only being injected once at the first step?',
                  options: [
                    'Because RNN hidden states decay over successive updates, so without re-injection the input summary would be diluted by the time later output words are generated',
                    'Because the decoder architecture requires exactly one input per timestep and c happens to fill that slot',
                    'Because re-supplying c lets the decoder ignore its own hidden state and previous outputs',
                    'Because each output symbol y_t corresponds to a different, non-overlapping slice of c',
                  ],
                  answer: 0,
                  explanation:
                    'If c were injected only at step 1, repeated hidden-state updates would gradually wash it out. Re-supplying c keeps the full input summary directly accessible at every step.',
                },
                {
                  prompt: 'What objective are the encoder and decoder trained to jointly maximize?',
                  options: [
                    'The average conditional log-likelihood log p_θ(y_n | x_n) over training pairs',
                    'The reconstruction error between the input sequence and a regenerated copy of itself',
                    'The Euclidean distance between the encoder\'s and decoder\'s hidden states at every timestep',
                    'The entropy of the context vector c across the training set',
                  ],
                  answer: 0,
                  explanation:
                    'Training maximizes (1/N) Σ log p_θ(y_n | x_n) — the likelihood the model assigns to the correct output given each input.',
                },
              ],
            },
          ],
        },
        {
          id: 'gru-hidden-unit',
          title: 'The hidden unit that remembers and forgets',
          minutes: 15,
          xp: 90,
          steps: [
            { kind: 'read', title: 'Two gates, two questions', markdown: hiddenUnitMd },
            {
              kind: 'code',
              title: 'Implement the GRU step',
              challenge: {
                prompt:
                  'Implement one step of the proposed hidden unit (Eqs. 5–8): a reset gate `r`, an update gate `z`, a candidate state `h̃` that uses `r ⊙ h_prev` (not the raw `h_prev`) inside its tanh, and the final blend `h = z·h_prev + (1−z)·h̃`. All quantities here are scalars (one hidden unit, one input feature) so the gate weights are plain numbers, not matrices. Round to 4 decimals when comparing.',
                starterCode: `function sigmoid(v) {
  return 1 / (1 + Math.exp(-v))
}

function gruStep(x, hPrev, w) {
  // w = { Wr, Ur, Wz, Uz, W, U }
  const r = sigmoid(w.Wr * x + w.Ur * hPrev)
  const z = sigmoid(w.Wz * x + w.Uz * hPrev)
  // TODO: the candidate state must use (r * hPrev), not hPrev directly — see Eq. 8
  const hTilde = Math.tanh(w.W * x + w.U * hPrev)
  return z * hPrev + (1 - z) * hTilde
}
`,
                solution: `function sigmoid(v) {
  return 1 / (1 + Math.exp(-v))
}

function gruStep(x, hPrev, w) {
  // w = { Wr, Ur, Wz, Uz, W, U }
  const r = sigmoid(w.Wr * x + w.Ur * hPrev)
  const z = sigmoid(w.Wz * x + w.Uz * hPrev)
  const hTilde = Math.tanh(w.W * x + w.U * (r * hPrev))
  return z * hPrev + (1 - z) * hTilde
}
`,
                tests: `test('reset gate has no effect when hPrev is 0', () => {
  const w = { Wr: 1, Ur: 1, Wz: 1, Uz: 1, W: 1, U: 1 }
  assertEqual(Number(gruStep(1, 0, w).toFixed(4)), 0.2048)
})

test('reset gate scales down the previous state inside the candidate (catches the TODO bug)', () => {
  const w = { Wr: 1, Ur: 1, Wz: 1, Uz: 1, W: 1, U: 1 }
  assertEqual(Number(gruStep(0, 1, w).toFixed(4)), 0.8988)
})

test('zero recurrent weight on the candidate makes reset gate irrelevant', () => {
  const w = { Wr: 0, Ur: 0, Wz: 2, Uz: 0, W: 1, U: 0 }
  assertEqual(Number(gruStep(2, 5, w).toFixed(4)), 4.9274)
})

test('reset gate at 0.5 halves the previous state inside the candidate (catches the TODO bug)', () => {
  const w = { Wr: 0, Ur: 0, Wz: 0, Uz: 0, W: 0, U: 1 }
  assertEqual(Number(gruStep(0, 2, w).toFixed(4)), 1.3808)
})
`,
              },
            },
            {
              kind: 'quiz',
              title: 'Reset gate, update gate, and why two',
              questions: [
                {
                  prompt:
                    'The paper reports that a plain tanh unit "without any gating" failed to produce meaningful results. What is the core reason for this failure?',
                  options: [
                    'Tanh saturates too quickly for sigmoid-based gates to compensate',
                    'Every update overwrites the hidden state wholesale, giving the network no way to protect information across many timesteps',
                    'Tanh units cannot represent negative values, limiting their expressiveness',
                    'Tanh requires more parameters than sigmoid, making training intractable',
                  ],
                  answer: 1,
                  explanation:
                    'A plain tanh unit recomputes the hidden state fully at each step with no mechanism to preserve old information selectively — the same vanishing-information problem LSTM was designed to address.',
                },
                {
                  prompt:
                    'In the candidate state equation h̃⟨t⟩_j = φ([Wx]_j + [U(r ⊙ h⟨t−1⟩)]_j), what happens as r_j → 0?',
                  options: [
                    'The candidate state becomes a copy of the previous hidden state',
                    'The term r ⊙ h⟨t−1⟩ vanishes, so the candidate is computed as if there were no history — driven only by the current input',
                    'The update gate z_j is forced to 1',
                    'The gradient through this unit is clipped to prevent explosion',
                  ],
                  answer: 1,
                  explanation:
                    'Element-wise multiplication by r_j → 0 zeroes out the previous hidden state\'s contribution to the candidate, producing a fresh-start candidate based only on the current input.',
                },
                {
                  prompt:
                    'The final hidden state is h⟨t⟩_j = z_j h⟨t−1⟩_j + (1 − z_j) h̃⟨t⟩_j. What does it mean if z_j is close to 1?',
                  options: [
                    'The unit almost entirely discards its old state in favor of the new candidate',
                    'The unit almost entirely retains its old state, largely ignoring the new candidate',
                    'The reset gate is forced to 0 for that unit',
                    'The unit is malfunctioning, since z and r should always sum to 1',
                  ],
                  answer: 1,
                  explanation:
                    'z_j weights the old state directly, so z_j → 1 means the new hidden state is almost entirely the old state — how a unit "remembers" over long spans.',
                },
                {
                  prompt:
                    'According to the paper, why are reset and update implemented as two separate gates rather than one gate used for both jobs?',
                  options: [
                    'Two gates are computationally cheaper than one shared gate',
                    'Separating them lets different hidden units specialize to different timescales — some reset frequently for short-term dependencies, others keep update gates active for long-term dependencies',
                    'A single shared gate would violate the sigmoid output range requirement',
                    'The original LSTM paper requires exactly two gates for compatibility',
                  ],
                  answer: 1,
                  explanation:
                    'Units capturing short-term dependencies tend to have frequently active reset gates, while units capturing long-term dependencies have update gates that are mostly active — a single gate could not let units tune both behaviors independently.',
                },
              ],
            },
          ],
        },
        {
          id: 'gru-smt-application',
          title: 'Scoring phrase pairs in an SMT system',
          minutes: 12,
          xp: 70,
          steps: [
            { kind: 'read', title: 'Plugging a neural score into a system that already works', markdown: smtApplicationMd },
            {
              kind: 'quiz',
              title: 'Feature, not replacement',
              questions: [
                {
                  prompt: 'How does the RNN Encoder-Decoder score get incorporated into the phrase-based SMT system?',
                  options: [
                    'It replaces the log-linear model with a neural decoder trained end-to-end',
                    'It is added as one more feature f_n in the existing log-linear model, with its weight tuned alongside the others',
                    'It re-ranks the final n-best translation list after decoding is complete, separate from the log-linear model',
                    'It replaces the phrase table itself with neural-generated phrase pairs',
                  ],
                  answer: 1,
                  explanation:
                    'The paper plugs p_θ(target|source) into Eq. 9 as just another feature, with its weight tuned via the same BLEU-maximizing process as every other feature — no architectural change to the decoder.',
                },
                {
                  prompt:
                    'Why did the authors deliberately avoid weighting training examples by how often each phrase pair occurs in the corpus?',
                  options: [
                    'Frequency weighting was computationally impossible to implement at the time',
                    'Frequent phrase pairs were mislabeled in the WMT\'14 corpus',
                    'Without it, the network could minimize loss by memorizing "common pairs score high" rather than learning linguistic plausibility — a signal the frequency-based phrase table already captures',
                    'BLEU scoring requires uniform sampling by definition',
                  ],
                  answer: 2,
                  explanation:
                    'Training on raw frequencies would let the network re-derive the corpus\'s count statistics, something the phrase table already encodes. Deduplicated pairs force the network to spend capacity on linguistic plausibility instead.',
                },
                {
                  prompt:
                    'According to the BLEU results table, what happens to test BLEU when the RNN Encoder-Decoder score is added to the baseline Moses system alone?',
                  options: [
                    'It drops slightly, from 33.30 to 32.9, before recovering with CSLM',
                    'It improves modestly but consistently, from 33.30 to 33.87',
                    'It jumps dramatically, from 33.30 to over 40',
                    'It stays essentially flat, since the phrase table already captures this information',
                  ],
                  answer: 1,
                  explanation:
                    'Table 1 shows baseline test BLEU at 33.30 rising to 33.87 with the RNN Encoder-Decoder feature added — a modest but consistent gain.',
                },
                {
                  prompt:
                    'In the BLEU results, combining CSLM and the RNN Encoder-Decoder together produces a test BLEU of 34.64, beating either neural addition alone. What inference does the paper draw from this?',
                  options: [
                    'CSLM and the RNN Encoder-Decoder model redundant signals, so the gain is mostly diminishing returns',
                    'The gain is purely an artifact of having more total trainable parameters',
                    'The contributions of CSLM and the RNN Encoder-Decoder are not too correlated, implying each can be improved independently for further gains',
                    'Word penalty is the real driver of the improvement, not either neural model',
                  ],
                  answer: 2,
                  explanation:
                    'Section 4.2 states the contributions are "not too correlated" — CSLM models fluency, the RNN Encoder-Decoder models phrase-level faithfulness, so stacking them compounds rather than overlaps.',
                },
              ],
            },
          ],
        },
        {
          id: 'gru-qualitative-analysis',
          title: 'What the model learned',
          minutes: 12,
          xp: 80,
          steps: [
            { kind: 'read', title: 'A BLEU number tells you that it improved — not why', markdown: qualitativeAnalysisMd },
            {
              kind: 'scenario',
              title: 'GRU vs. LSTM, and the limits of a single context vector',
              scenario: {
                intro:
                  "You're advising a small team building NLP components in 2014, right after this paper and the LSTM literature both exist as options. Apply what the paper actually showed — not hype — to each design decision.",
                stages: [
                  {
                    situation:
                      'The team needs a recurrent hidden unit for a sequence model running on a memory- and compute-constrained device. They are choosing between LSTM (a memory cell plus four gates) and the gated unit from this paper (two gates, no separate cell).',
                    question: 'Which is the better starting point, and why?',
                    options: [
                      {
                        label:
                          "The paper's gated unit (later called GRU) — fewer parameters and gates to compute, while the paper's own experiments show it solves the same vanishing-information problem LSTM addresses",
                        quality: 'best',
                        feedback:
                          "Correct reasoning from the source: the paper explicitly motivates its unit as 'much simpler to compute and implement' than LSTM while targeting the same failure mode (a plain tanh unit with no gating produced no meaningful results). For a constrained device, fewer gates and no separate memory cell is a real, paper-justified efficiency win.",
                      },
                      {
                        label: 'LSTM, because it has more gates and more gates always means a more powerful model',
                        quality: 'bad',
                        feedback:
                          "More gates isn't automatically better — it's more computation and parameters. The paper's whole point with the two-gate design was showing you don't need LSTM's full apparatus to fix the no-gating failure mode.",
                      },
                      {
                        label: 'A plain tanh RNN with no gating, since it is the simplest to implement',
                        quality: 'bad',
                        feedback:
                          'The paper directly reports this fails: "We were not able to get meaningful result with an oft-used tanh unit without any gating." Simplicity that doesn\'t train isn\'t a real option.',
                      },
                    ],
                  },
                  {
                    situation:
                      'A teammate proposes training the phrase-pair scorer on examples sampled proportional to how often each phrase pair appears in the corpus, arguing "more data from common cases should make the model more accurate."',
                    question: 'Following this paper\'s reasoning in Section 3.1, what do you tell them?',
                    options: [
                      {
                        label:
                          "Don't — train on unique (deduplicated) phrase pairs instead, since the existing phrase table already encodes frequency, and frequency-weighted training would just let the network memorize counts instead of learning linguistic plausibility",
                        quality: 'best',
                        feedback:
                          'Exactly the paper\'s stated rationale: ignoring frequency "ensures that the RNN Encoder-Decoder does not simply learn to rank the phrase pairs according to their numbers of occurrences," since that information is redundant with what the phrase table already has.',
                      },
                      {
                        label: 'Agree — frequency weighting should always be used to match the true data distribution',
                        quality: 'bad',
                        feedback:
                          "That's the generic ML instinct, but it ignores that this isn't a standalone model — it's a feature meant to add new information to a system that already has frequency-based scores. Duplicating that signal wastes the network's capacity.",
                      },
                      {
                        label: "It doesn't matter either way, since BLEU only depends on the final decoder output",
                        quality: 'bad',
                        feedback:
                          "It matters a lot for what the feature actually contributes. The paper's whole qualitative analysis (Section 4.3) depends on this scorer NOT degenerating into a frequency counter.",
                      },
                    ],
                  },
                  {
                    situation:
                      'The team wants to extend this architecture to encode entire paragraphs (hundreds of words) into a single context vector `c`, then decode a paragraph-length summary from it.',
                    question: "What's the most defensible prediction based on the paper's own framing of the architecture?",
                    options: [
                      {
                        label:
                          'It will likely degrade for very long inputs, since a single fixed-length vector has to represent everything — the same fixed-vector limitation the paper itself flags for long sequences, before later attention mechanisms addressed it',
                        quality: 'best',
                        feedback:
                          "Right call. This paper's own framing acknowledges the bottleneck: squeezing a whole variable-length input into one fixed vector can throw information away, and the experiments here use short phrases, not paragraphs. Scaling to long documents without addressing that bottleneck would predictably degrade quality — exactly the gap attention mechanisms were later built to close.",
                      },
                      {
                        label: 'It will scale perfectly to any input length, since the encoder is recurrent and can process inputs of any length',
                        quality: 'bad',
                        feedback:
                          "Being able to process arbitrary-length inputs (which the RNN can) is different from preserving all the information from those inputs in one fixed vector. The paper's own scope (short phrases) and its acknowledged limitation point against this.",
                      },
                      {
                        label: 'Performance is unrelated to input length, since the GRU gates can remember anything indefinitely',
                        quality: 'bad',
                        feedback:
                          "Gating helps a hidden unit selectively remember within a sequence, but it doesn't remove the fundamental bottleneck of compressing an entire long input into one fixed-size vector by the end of encoding.",
                      },
                    ],
                  },
                ],
                debrief:
                  "The paper's two real contributions — the encoder–decoder split and the gated hidden unit — solve different problems. The gated unit (GRU) fixes a *training* problem (plain RNNs can't preserve information without gating). The encoder–decoder split fixes an *architectural* problem (mapping variable-length input to variable-length output), but introduces its own limitation: one fixed-size vector has to carry the whole input. The paper is explicit that this works for short phrases and flags longer-sequence scaling as open — exactly the gap that motivated later attention-based architectures.",
              },
            },
          ],
        },
      ],
    },
  ],
}
