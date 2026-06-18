import type { Subject } from '../types'
import bottleneckMd from './md/ba-bottleneck.md?raw'
import encoderDecoderMd from './md/ba-encoder-decoder.md?raw'
import attendMd from './md/ba-attend-and-translate.md?raw'
import resultsMd from './md/ba-results.md?raw'
import alignmentLimitsMd from './md/ba-alignment-limits.md?raw'

export const bahdanauAttention: Subject = {
  id: 'bahdanau-attention',
  title: 'Bahdanau Attention',
  tagline: 'The 2014 paper that broke the fixed-length bottleneck and invented attention.',
  icon: '🧭',
  accent: '#c026d3',
  modules: [
    {
      id: 'ba-m1',
      title: 'Learning to Align and Translate',
      description:
        'Bahdanau, Cho & Bengio (2014/2015, ICLR). Why squeezing a sentence into one vector breaks on long sentences, and the per-step weighted-attention fix that became the ancestor of every later attention mechanism.',
      lessons: [
        {
          id: 'ba-bottleneck',
          title: 'The fixed-length bottleneck',
          minutes: 9,
          xp: 60,
          steps: [
            { kind: 'read', title: 'Why long sentences break translation', markdown: bottleneckMd },
            {
              kind: 'quiz',
              title: 'Spot the bottleneck',
              questions: [
                {
                  prompt: 'In the 2014 encoder-decoder architecture this lesson describes, what does the encoder hand off to the decoder?',
                  options: [
                    'A single fixed-length vector summarizing the whole source sentence',
                    'A sequence of per-word vectors, one for each source word',
                    'The raw source sentence text alongside a summary vector',
                    'A variable-length vector that grows with the sentence',
                  ],
                  answer: 0,
                  explanation:
                    'The 2014 design compresses the entire source sentence into one fixed-length vector before the decoder ever starts generating — that single vector is the only thing the decoder has to work with. This is precisely the design the paper identifies as the bottleneck.',
                },
                {
                  prompt: "According to the lesson, what had Cho et al. (2014) already shown empirically about this architecture?",
                  options: [
                    'Translation quality improves steadily as sentence length increases',
                    'Translation quality is unaffected by sentence length',
                    'Translation quality deteriorates rapidly as the length of an input sentence increases',
                    'Translation quality only suffers on sentences longer than 100 words',
                  ],
                  answer: 2,
                  explanation:
                    "Cho et al. (2014) empirically demonstrated rapid quality deterioration with increasing input length — this prior empirical finding is what motivated the paper's structural diagnosis of the fixed-length vector as the bottleneck.",
                },
                {
                  prompt: "What is the core change the paper proposes to fix the bottleneck, in the lesson's own framing?",
                  options: [
                    'Replace the RNN encoder and decoder with a larger fixed-length vector',
                    'Keep a vector per source word, and let the decoder adaptively choose which ones matter at every output step',
                    'Train two separate fixed-length vectors instead of one, and average them',
                    'Have the decoder re-read the raw source sentence text at every step instead of using vectors',
                  ],
                  answer: 1,
                  explanation:
                    'Instead of discarding per-word detail by compressing into one vector, the encoder keeps a sequence of vectors (one per source word), and the decoder adaptively selects a subset of them fresh at each decoding step.',
                },
              ],
            },
          ],
        },
        {
          id: 'ba-encoder-decoder',
          title: 'Background: RNN Encoder-Decoder',
          minutes: 9,
          xp: 60,
          steps: [
            { kind: 'read', title: 'The baseline you need first', markdown: encoderDecoderMd },
            {
              kind: 'quiz',
              title: 'The baseline framework',
              questions: [
                {
                  prompt: 'In the Encoder–Decoder framework, translation is framed probabilistically as finding the target sentence y that maximizes which quantity?',
                  options: [
                    'p(y | x), the probability of y given the source sentence x',
                    'p(x | y), the probability of the source given the target',
                    'p(c | x), the probability of the context vector given the source',
                    'p(y) alone, independent of the source sentence',
                  ],
                  answer: 0,
                  explanation:
                    'Translation is posed as conditional generation: find y that maximizes p(y | x) for a given source x. The encoder, the context vector c, and the decoder all exist to model this one conditional distribution.',
                },
                {
                  prompt: "In the simplest version of this framework, how is the context vector c computed from the encoder's hidden states?",
                  options: [
                    'c is just the last hidden state, c = h_Tx',
                    'c is the average of all hidden states',
                    'c is a weighted sum of hidden states, with weights learned per decoding step',
                    'c is the concatenation of every hidden state h1 through h_Tx',
                  ],
                  answer: 0,
                  explanation:
                    'The lesson states that in the simplest version q just returns the last hidden state, c = h_Tx. That kind of learned weighted combination is what the next lesson\'s mechanism adds.',
                },
                {
                  prompt: 'According to the sequence diagram, how many times is the context vector c computed during one full translation?',
                  options: [
                    'Once, after the encoder finishes reading the source sentence',
                    'Once per decoder step, recomputed from the previous decoder hidden state',
                    'Once per source word, updated incrementally as the encoder reads',
                    'Twice — once before encoding and once after decoding',
                  ],
                  answer: 0,
                  explanation:
                    'The diagram shows "c = q(h1...hTx) — computed ONCE," then the same frozen c is reused for every decoding step. This single computation is exactly the rigidity the next lesson removes.',
                },
              ],
            },
          ],
        },
        {
          id: 'ba-attend-and-translate',
          title: 'Learning to align and translate',
          minutes: 16,
          xp: 90,
          steps: [
            { kind: 'read', title: 'A fresh context vector for every word', markdown: attendMd },
            {
              kind: 'quiz',
              title: 'How attention is computed',
              questions: [
                {
                  prompt: 'In the original encoder-decoder model (no attention), a single context vector c was reused for every decoding step. What specific limitation does this create that Bahdanau attention fixes?',
                  options: [
                    'The decoder cannot generate variable-length outputs',
                    'The decoder is forced to rely on the same fixed summary of the source sentence for every target word, even though different words need different information',
                    'The encoder cannot process sentences longer than a fixed length',
                    'The softmax over alignment scores cannot sum to 1',
                  ],
                  answer: 1,
                  explanation:
                    'A single frozen c forces every decoding step to draw on the same compressed summary. Attention replaces it with a fresh c_i per step, computed as a weighted sum over annotations, so the decoder can look at different source parts per word.',
                },
                {
                  prompt: 'How is annotation h_j constructed from the bidirectional encoder?',
                  options: [
                    'By averaging the forward and backward hidden states at position j',
                    'By taking only the backward hidden state, since it has already seen the forward pass',
                    'By concatenating the forward hidden state h→j and the backward hidden state h←j',
                    'By passing h→j through the alignment model a to produce h_j',
                  ],
                  answer: 2,
                  explanation:
                    'The lesson quotes Section 3.2 directly: the annotation for word x_j is obtained "by concatenating the forward hidden state h→j and the backward one h←j" — giving each annotation context from both directions.',
                },
                {
                  prompt: 'What ensures that the weights α_i1, ..., α_iT for a given decoding step i always sum to 1?',
                  options: [
                    'They are normalized by dividing by the number of source words T',
                    'The alignment model a is constrained to output values between 0 and 1',
                    'They are produced by applying softmax to the raw scores e_i1, ..., e_iT',
                    'The encoder clips each h_j to unit norm before scoring',
                  ],
                  answer: 2,
                  explanation:
                    'Eq. 6 defines α_ij as exp(e_ij) divided by the sum of exp(e_ik) over all k — the softmax function, which guarantees the outputs are non-negative and sum to 1.',
                },
              ],
            },
            {
              kind: 'code',
              title: 'Implement the attention context vector',
              challenge: {
                prompt: `## Reproduce Eq. 5 and Eq. 6

The paper defines the per-step context vector as a softmax-weighted sum over the
encoder's annotations:

\`αᵢⱼ = exp(eᵢⱼ) / Σₖ exp(eᵢₖ)\`  (Eq. 6 — softmax over alignment scores)

\`cᵢ = Σⱼ αᵢⱼ hⱼ\`  (Eq. 5 — weighted sum of annotations)

Implement \`attentionContext(scores, annotations)\` where \`scores\` is the array of
raw alignment scores \`eᵢⱼ\` (one per source word) and \`annotations\` is the array
of annotation vectors \`hⱼ\` (one vector per source word, all the same length).

Return the context vector \`cᵢ\` as a plain number array, with each component
rounded to 4 decimal places.

Steps:
1. Softmax the scores into weights (subtract the max score first for numerical
   stability — standard softmax trick).
2. Compute the weighted sum of the annotation vectors, weight \`j\` applied to
   annotation \`j\`.`,
                starterCode: `function attentionContext(scores, annotations) {
  // TODO: softmax(scores) to get weights, then weighted sum of annotations
  return annotations[0];
}`,
                solution: `function softmax(scores) {
  const m = Math.max(...scores);
  const exps = scores.map((s) => Math.exp(s - m));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

function attentionContext(scores, annotations) {
  const weights = softmax(scores);
  const dim = annotations[0].length;
  const ctx = new Array(dim).fill(0);
  for (let j = 0; j < annotations.length; j++) {
    for (let d = 0; d < dim; d++) {
      ctx[d] += weights[j] * annotations[j][d];
    }
  }
  return ctx.map((x) => Math.round(x * 10000) / 10000);
}`,
                tests: `test('equal scores average the annotations', () => {
  assertEqual(attentionContext([0, 0, 0], [[1, 0], [0, 1], [2, 2]]), [1, 1]);
});
test('dominant score nearly picks one annotation', () => {
  const ctx = attentionContext([0, 10, 0], [[1, 0], [0, 1], [5, 5]]);
  assertEqual(ctx[0] < 0.01 && ctx[1] > 0.99, true);
});
test('weights sum to 1, so uniform annotations pass through unchanged', () => {
  assertEqual(attentionContext([1, 2, 3], [[1, 1], [1, 1], [1, 1]]), [1, 1]);
});
test('single source word returns that annotation unchanged', () => {
  assertEqual(attentionContext([5], [[3, -2, 7]]), [3, -2, 7]);
});`,
              },
            },
          ],
        },
        {
          id: 'ba-results',
          title: 'Quantitative results: does it work?',
          minutes: 10,
          xp: 60,
          steps: [
            { kind: 'read', title: 'BLEU scores and length robustness', markdown: resultsMd },
            {
              kind: 'quiz',
              title: 'Reading the results',
              questions: [
                {
                  prompt: 'Table 1 shows RNNsearch-30 (trained only on sentences ≤30 words) scoring 21.50 BLEU, beating RNNencdec-50 (17.82), which was trained on longer sentences. What does this comparison demonstrate?',
                  options: [
                    'The architecture change (attention) matters more than the extra training-sentence length capacity did',
                    'RNNencdec-50 was undertrained relative to RNNsearch-30',
                    'BLEU score is unreliable for comparing models trained on different sentence-length caps',
                    'RNNsearch-30 was evaluated on an easier test set than RNNencdec-50',
                  ],
                  answer: 0,
                  explanation:
                    'RNNsearch-30 outperforms RNNencdec-50 despite less exposure to long-range structure during training, isolating the win to the architecture itself rather than to training data length.',
                },
                {
                  prompt: "On the 'No unknown words' subset, RNNsearch-50⋆ scores 36.15 versus Moses's 35.63. Why does the lesson call this 'a significant achievement'?",
                  options: [
                    "Moses scored higher on the 'All sentences' column, so this result only applies to a narrow subset",
                    'Moses is a decades-refined phrase-based system with access to an extra 418M-word monolingual corpus that RNNsearch never sees, yet a neural model proposed that same year edges it out',
                    'RNNsearch-50⋆ was trained on more parallel data than Moses',
                    'BLEU scores above 35 are considered a hard ceiling for any statistical machine translation system',
                  ],
                  answer: 1,
                  explanation:
                    'Moses has structural advantages (mature engineering, extra monolingual data) that RNNsearch lacks, yet the much newer neural approach still slightly surpasses it on this subset.',
                },
                {
                  prompt: 'Per the quoted finding in Section 5.1, how does RNNsearch-50 behave on sentences of length 50 or more?',
                  options: [
                    'It also degrades, just less sharply than RNNencdec',
                    'It shows no performance deterioration even at that length',
                    'It outperforms Moses on every sentence length tested',
                    'It fails entirely because it was only trained up to length 50',
                  ],
                  answer: 1,
                  explanation:
                    'The paper explicitly notes RNNsearch-50 shows no performance deterioration even with sentences of length 50 or more — attention lets the decoder pull from any encoder position as needed.',
                },
              ],
            },
          ],
        },
        {
          id: 'ba-alignment-limits',
          title: 'Soft alignment: power and cost',
          minutes: 11,
          xp: 70,
          steps: [
            { kind: 'read', title: 'What the attention weights reveal — and what they cost', markdown: alignmentLimitsMd },
            {
              kind: 'scenario',
              title: 'Choosing an alignment strategy',
              scenario: {
                intro:
                  "You're designing the alignment component of a translation system. Apply what the paper found about soft vs. hard alignment, and about the cost of computing it, to each decision below.",
                stages: [
                  {
                    situation:
                      "You're building a system for a language pair where adjective-noun order frequently flips between source and target — the paper's own example translates '[European Economic Area]' into '[zone économique européenne]', noun-first instead of noun-last. A teammate proposes a strictly monotonic alignment model (source position only ever increases as target position increases), like the handwriting-synthesis alignment in Graves (2013) discussed in Related Work.",
                    question: 'Should you adopt strict monotonic alignment for this language pair?',
                    options: [
                      {
                        label:
                          'No — use unrestricted soft alignment so the model can jump backward and forward across source positions as reordering requires',
                        quality: 'best',
                        feedback:
                          'Right. The paper notes monotonic alignment is "a severe limitation" for translation because "(long-distance) reordering is often needed to generate a grammatically correct translation." RNNsearch\'s unrestricted softmax weights let it "jump over" words exactly as the Area example needs.',
                      },
                      {
                        label: 'Yes — monotonic alignment is simpler, and reordering cases are rare enough to ignore',
                        quality: 'bad',
                        feedback:
                          'Adjective-noun reordering between languages like English and French is systematic, not rare — it happens every time a noun phrase crosses languages with different modifier order. A monotonic constraint would break exactly the cases the paper highlights as evidence soft alignment matters.',
                      },
                      {
                        label: "Yes — soft alignment can't handle reordering either, so monotonic is no worse",
                        quality: 'bad',
                        feedback:
                          'This gets the comparison backwards. Soft alignment is exactly what makes reordering possible — the model assigns weight to any source position regardless of order. Monotonic alignment is the one that structurally cannot reorder.',
                      },
                    ],
                  },
                  {
                    situation:
                      "Your team wants to apply this same attention mechanism to align two multi-thousand-token legal documents (Tx and Ty each ~5,000 tokens). Someone points out that the alignment model has to be evaluated Tx × Ty times per pair — quadratic in length — versus O(Tx + Ty) for the plain encoder-decoder.",
                    question: "What's the right read of this constraint before committing to ship it?",
                    options: [
                      {
                        label:
                          'Flag the quadratic cost as a real scaling risk — it was acceptable for 15-40 word sentences in the paper, but may be prohibitive at thousands of tokens; benchmark before committing',
                        quality: 'best',
                        feedback:
                          'This is exactly the limitation the paper names in Section 6.1: the approach "requires computing the annotation weight of every word in the source sentence for each word in the translation," which "may limit the applicability of the proposed scheme to other tasks" beyond sentence-length sequences.',
                      },
                      {
                        label: 'Ignore it — the paper proves attention always outperforms the baseline regardless of cost',
                        quality: 'bad',
                        feedback:
                          "The paper's accuracy results are measured on 15-40 word sentences. It explicitly flags the Tx×Ty cost as a concern for longer sequences — accuracy gains don't make a quadratic cost free.",
                      },
                      {
                        label: 'Cut Tx and Ty to fit within the original 15-40 word range by truncating the documents',
                        quality: 'bad',
                        feedback:
                          'Truncating multi-thousand-token legal documents to 15-40 words destroys the content you need aligned. The honest answer is to surface the cost trade-off, not to silently throw away most of the input.',
                      },
                    ],
                  },
                ],
                debrief:
                  'Soft alignment buys flexibility (reordering, variable-length phrase mapping) that hard/monotonic alignment structurally cannot offer — but it buys that flexibility at O(Tx × Ty) cost per sentence pair. The paper accepts that trade for translation-length sequences and is explicit that it may not generalize to much longer ones.',
              },
            },
          ],
        },
      ],
    },
  ],
}
