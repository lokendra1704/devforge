import type { Subject } from '../types'
import motivationMd from './md/xc-motivation.md?raw'
import spectrumMd from './md/xc-spectrum.md?raw'
import architectureMdRaw from './md/xc-architecture.md?raw'
import resultsMd from './md/xc-results.md?raw'
import ablationsMd from './md/xc-ablations.md?raw'
import fig5Url from './img/xc-fig5.png'

const architectureMd = architectureMdRaw.replace('FIGURE:xc-fig5', fig5Url)

export const xception: Subject = {
  id: 'xception',
  title: 'Xception',
  tagline: 'Pushing the Inception hypothesis to its extreme: depthwise separable convolutions',
  icon: '🧬',
  accent: '#F97316',
  modules: [
    {
      id: 'xc-m1',
      title: 'Xception: Deep Learning with Depthwise Separable Convolutions',
      description:
        'Chollet (2016): the Inception hypothesis, the spectrum from regular to depthwise separable convolutions, the Xception architecture, results vs. Inception V3, and what the ablations reveal',
      lessons: [
        {
          id: 'xc-m1-l1',
          title: 'The Inception Hypothesis',
          minutes: 10,
          xp: 50,
          steps: [
            { kind: 'read', title: 'One kernel, two unrelated jobs', markdown: motivationMd },
            {
              kind: 'quiz',
              title: 'Why decouple channels from space?',
              questions: [
                {
                  prompt:
                    'Why does a single 3×3 convolution kernel face a harder problem than it might need to?',
                  options: [
                    'It must answer two unrelated questions at once: which spatial neighbors matter, and which channels correlate with each other',
                    'It must learn both the forward and backward pass simultaneously',
                    'It has too few parameters to represent spatial patterns',
                    'It can only operate on a single channel at a time',
                  ],
                  answer: 0,
                  explanation:
                    'A standard kernel jointly solves two unrelated tasks — spatial neighbor weighting and cross-channel correlation — in one operation. The Inception hypothesis questions whether these need to be answered together at all (Section 1.1).',
                },
                {
                  prompt:
                    'In a canonical Inception module, what is the purpose of the 1×1 convolutions that run before the 3×3/5×5 convolutions?',
                  options: [
                    'To compress and mix cross-channel information into smaller spaces before spatial convolutions operate on them',
                    'To downsample the spatial resolution of the feature map',
                    'To apply spatial pooling across neighboring pixels',
                    'To increase the number of channels before the final concatenation',
                  ],
                  answer: 0,
                  explanation:
                    'The 1×1 convolutions handle channel-mixing, compressing cross-channel information into a few smaller spaces. The subsequent 3×3/5×5 convolutions then handle spatial mixing within each of those smaller spaces (Section 1.1, Figure 1).',
                },
                {
                  prompt:
                    'What question does the lesson pose as the open setup for the rest of the paper, following from the partial decoupling in Inception?',
                  options: [
                    'What happens if the decoupling is pushed all the way, to one spatial convolution tower per channel?',
                    'What happens if 1×1 convolutions are removed from the Inception module entirely?',
                    'What happens if the AvgPool branch is replaced with a max-pooling branch?',
                    'What happens if spatial convolutions are applied before channel mixing instead of after?',
                  ],
                  answer: 0,
                  explanation:
                    'Inception bundles channels into 3-4 towers, only partially decoupling channels from space. The paper asks what happens at the extreme — one tower per channel — which is exactly the setup for depthwise separable convolutions.',
                },
              ],
            },
          ],
        },
        {
          id: 'xc-m1-l2',
          title: 'The Spectrum: From Inception to Extreme Inception',
          minutes: 12,
          xp: 60,
          steps: [
            { kind: 'read', title: 'One spectrum, three points', markdown: spectrumMd },
            {
              kind: 'quiz',
              title: 'Regular conv, Inception, depthwise separable conv',
              questions: [
                {
                  prompt:
                    'Figure 3 reformulates the simplified Inception module (Figure 2) from three parallel "1x1 then 3x3" branches into one big 1x1 conv followed by three 3x3 convs on channel segments. What is the relationship between Figure 2 and Figure 3?',
                  options: [
                    'They are strictly mathematically equivalent — Figure 3 just regroups the same computation',
                    'Figure 3 is an approximation of Figure 2 that trades a small amount of accuracy for speed',
                    'Figure 3 adds a new non-linearity that Figure 2 lacked',
                    'Figure 3 reduces the number of output channels compared to Figure 2',
                  ],
                  answer: 0,
                  explanation:
                    'Nothing changes mathematically; the three separate 1x1 convs combine into one big 1x1 conv, and grouping channels into segments before applying spatial convs is purely algebraic regrouping (Section 1.1).',
                },
                {
                  prompt:
                    'Extreme Inception and depthwise separable convolution are nearly the same operation. What are the two differences the paper calls out between them?',
                  options: [
                    'Order of the 1x1 vs. spatial step, and whether a non-linearity sits between the two steps',
                    'The number of output channels, and whether batch normalization is applied',
                    'The kernel size used in the spatial convolution, and the stride',
                    'Whether the operation is applied to images or to feature maps',
                  ],
                  answer: 0,
                  explanation:
                    'Extreme Inception does 1x1 (channel mixing) first then spatial, with ReLU after both steps; depthwise separable conv does spatial (depthwise) first then 1x1 (pointwise), usually with no non-linearity in between (Section 1.2).',
                },
                {
                  prompt:
                    'Why is the name "Xception" ("Extreme Inception") an apt name for the architecture the paper proposes, based on this lesson?',
                  options: [
                    'Because the proposal is to build an entire network out of the extreme end of the segment spectrum — i.e., depthwise separable convolutions throughout',
                    'Because the architecture exceeds the size of all prior Inception networks',
                    'Because it combines Inception modules with residual connections for the first time',
                    'Because it uses an extreme number of pooling layers compared to Inception',
                  ],
                  answer: 0,
                  explanation:
                    'Regular convolution and depthwise separable convolution are two ends of one spectrum with Inception in the middle. The proposal is to push all the way to the extreme end — hence "Extreme Inception," or Xception.',
                },
              ],
            },
          ],
        },
        {
          id: 'xc-m1-l3',
          title: 'The Xception Architecture',
          minutes: 12,
          xp: 65,
          steps: [
            { kind: 'read', title: 'Entry, middle, and exit flow', markdown: architectureMd },
            {
              kind: 'quiz',
              title: 'Reading Figure 5',
              questions: [
                {
                  prompt:
                    'The paper claims Xception takes only 30-40 lines of code to define in a high-level library, unlike Inception V2/V3. What property of the architecture makes this possible?',
                  options: [
                    'It is a linear stack of one repeated building block (depthwise separable conv + residual), rather than many hand-tuned multi-branch modules',
                    'It uses fewer total layers than Inception V2/V3',
                    'It avoids residual connections entirely, simplifying the control flow',
                    'It replaces convolutions with fully-connected layers, which are easier to express in code',
                  ],
                  answer: 0,
                  explanation:
                    'Section 3 frames Xception as a linear stack of depthwise separable convolution layers with residual connections — one repeated block instead of Inception\'s hand-tuned multi-branch modules. Repetition, not fewer layers, shrinks the code.',
                },
                {
                  prompt: 'What happens spatially and channel-wise inside the middle flow?',
                  options: [
                    'Channels widen from 728 to 2048 while spatial resolution shrinks',
                    'Spatial resolution is repeatedly halved via MaxPooling while channel count stays fixed',
                    'Neither resolution nor channel count changes — three SeparableConv 728, 3×3 layers in a residual block repeat 8 times purely to refine features',
                    'The image is upsampled back toward its original 299×299 resolution',
                  ],
                  answer: 2,
                  explanation:
                    'The middle flow is the workhorse: three SeparableConv 728, 3×3 layers wrapped in a residual connection, repeated 8 times, with no pooling or resizing — its job is purely to refine features at fixed resolution.',
                },
                {
                  prompt: 'Which modules in Xception do NOT have a residual (shortcut) connection?',
                  options: [
                    'All 14 modules have residual connections, with no exceptions',
                    'Only the middle-flow modules lack residual connections',
                    'Every module except the first and last',
                    'Only modules with MaxPooling lack residual connections',
                  ],
                  answer: 2,
                  explanation:
                    'The architecture has 36 convolutional layers organized into 14 modules; every module except the first and last is wrapped in a residual connection (Section 3).',
                },
              ],
            },
          ],
        },
        {
          id: 'xc-m1-l4',
          title: 'Results: Xception vs Inception V3',
          minutes: 14,
          xp: 75,
          steps: [
            { kind: 'read', title: 'Same capacity, different efficiency', markdown: resultsMd },
            {
              kind: 'quiz',
              title: 'Reading the comparison tables',
              questions: [
                {
                  prompt:
                    'Xception and Inception V3 have nearly identical parameter counts. Given that, what does the paper claim is the source of Xception\'s accuracy improvement?',
                  options: [
                    'More efficient use of the same parameter budget, not increased capacity',
                    'A larger effective receptive field from deeper stacking',
                    'Additional fully-connected layers not present in Inception V3',
                    'Pretraining on JFT before fine-tuning on ImageNet',
                  ],
                  answer: 0,
                  explanation:
                    'The abstract states that since both networks have the same parameter count, gains come from more efficient use of those parameters, not from extra capacity (Abstract, Section 4.5.2).',
                },
                {
                  prompt:
                    'On ImageNet, Xception beats Inception V3 by a modest margin. On JFT, Xception shows a 4.3% relative improvement in MAP@100. What does the paper say explains this difference in gap size?',
                  options: [
                    'JFT has more classes, which mechanically inflates any accuracy metric',
                    'Inception V3 was likely over-fit by design to ImageNet, so removing that home-turf advantage on JFT reveals the larger underlying efficiency gain',
                    'Xception was specifically pretrained on JFT, giving it an unfair advantage there',
                    'The ImageNet result was measured with an older version of Inception V3',
                  ],
                  answer: 1,
                  explanation:
                    'The paper attributes the larger JFT gap to Inception V3 being "by design over-fit" to ImageNet. On JFT, where neither model has a tuning advantage, Xception\'s efficiency gain shows through more clearly (Section 4.5.1).',
                },
                {
                  prompt:
                    'Despite having fewer parameters, Xception trains at 28 steps/second versus Inception V3\'s 31 steps/second. What does the paper attribute this speed gap to?',
                  options: [
                    'Xception\'s deeper overall network depth',
                    'Under-optimized depthwise convolution kernel implementations at the time, not anything fundamental to the operation',
                    'Xception\'s larger memory footprint causing more data transfer overhead',
                    'The use of auxiliary classifiers in Xception\'s training graph',
                  ],
                  answer: 1,
                  explanation:
                    'The paper frames the slowdown as an engineering/implementation gap in depthwise conv kernels at the time, expecting future optimization to close or reverse it (Section 4.5.2).',
                },
              ],
            },
            {
              kind: 'code',
              title: 'Verify the 4.3% relative-improvement claim',
              challenge: {
                prompt:
                  'The paper states: "On JFT, Xception shows a 4.3% relative improvement on the FastEval14k MAP@100 metric." Verify this from the raw table numbers (Table 2, with-FC-layers row: Inception V3 = 6.50, Xception = 6.78).\n\n' +
                  'Implement:\n' +
                  '• `relativeImprovementPercent(newVal, oldVal)` — the relative improvement of `newVal` over `oldVal`, as a percentage, rounded to 1 decimal place: `((newVal - oldVal) / oldVal) * 100`.\n' +
                  '• `paramReductionPercent(bigger, smaller)` — how much smaller `smaller` is than `bigger`, as a percentage, rounded to 1 decimal: `((bigger - smaller) / bigger) * 100`.\n\n' +
                  'Use these to confirm the paper\'s 4.3% JFT claim, and the "within 3.5%" parameter-count claim from Table 3 (Inception V3 = 23,626,728 params, Xception = 22,855,952 params).',
                starterCode:
                  'function relativeImprovementPercent(newVal, oldVal) {\n' +
                  '  // TODO: ((newVal - oldVal) / oldVal) * 100, rounded to 1 decimal place\n' +
                  '  return 0\n' +
                  '}\n\n' +
                  'function paramReductionPercent(bigger, smaller) {\n' +
                  '  // TODO: ((bigger - smaller) / bigger) * 100, rounded to 1 decimal place\n' +
                  '  return 0\n' +
                  '}\n',
                solution:
                  'function relativeImprovementPercent(newVal, oldVal) {\n' +
                  '  return Math.round(((newVal - oldVal) / oldVal) * 1000) / 10\n' +
                  '}\n\n' +
                  'function paramReductionPercent(bigger, smaller) {\n' +
                  '  return Math.round(((bigger - smaller) / bigger) * 1000) / 10\n' +
                  '}\n',
                tests:
                  'test("JFT with-FC relative improvement matches the paper\'s stated 4.3%", () => {\n' +
                  '  assertEqual(relativeImprovementPercent(6.78, 6.50), 4.3)\n' +
                  '})\n' +
                  'test("ImageNet top-1 relative improvement is about 1.0%", () => {\n' +
                  '  assertEqual(relativeImprovementPercent(0.790, 0.782), 1.0)\n' +
                  '})\n' +
                  'test("JFT no-FC relative improvement is about 5.3%", () => {\n' +
                  '  assertEqual(relativeImprovementPercent(6.70, 6.36), 5.3)\n' +
                  '})\n' +
                  'test("Xception has about 3.3% fewer parameters than Inception V3", () => {\n' +
                  '  assertEqual(paramReductionPercent(23626728, 22855952), 3.3)\n' +
                  '})\n',
              },
            },
          ],
        },
        {
          id: 'xc-m1-l5',
          title: 'Ablations: Residuals and Activations',
          minutes: 12,
          xp: 65,
          steps: [
            { kind: 'read', title: 'One essential, one harmful', markdown: ablationsMd },
            {
              kind: 'quiz',
              title: 'What the ablations reveal',
              questions: [
                {
                  prompt: 'In Section 4.7, what activation configuration between the depthwise and pointwise steps of a separable convolution performed best?',
                  options: [
                    'ELU, because it avoids the dead-neuron problem of ReLU',
                    'ReLU, matching standard practice in most CNN blocks',
                    'No non-linearity at all',
                    'A combination of ReLU followed by ELU',
                  ],
                  answer: 2,
                  explanation:
                    'Section 4.7 states the absence of any non-linearity led to both faster convergence and better final performance than either ReLU or ELU — the opposite of typical assumptions about activations between conv steps.',
                },
                {
                  prompt: 'Why does the paper call the Section 4.7 result "remarkable"?',
                  options: [
                    'Because no prior work had ever tested non-linearities inside a convolution block',
                    'Because it contradicts Szegedy et al.\'s finding that non-linearities help inside Inception modules',
                    'Because ELU performed identically to ReLU in their experiments',
                    'Because it shows depthwise separable convolutions cannot use non-linearities anywhere in the network',
                  ],
                  answer: 1,
                  explanation:
                    'The paper flags it as remarkable because Szegedy et al. found the opposite result for Inception modules — an intermediate non-linearity helped there, but hurts Xception\'s depthwise separable convolutions.',
                },
                {
                  prompt:
                    'What structural difference does the paper hypothesize explains why a ReLU between depthwise and pointwise steps helps Inception but hurts Xception?',
                  options: [
                    'Inception modules use larger kernel sizes, which tolerate information loss better',
                    'Xception\'s intermediate feature space is only 1 channel deep, so a ReLU there discards more information than in Inception\'s deeper intermediate spaces',
                    'Xception applies the non-linearity before the spatial convolution instead of after',
                    'Inception modules don\'t use any 1x1 convolutions, so the comparison doesn\'t actually apply',
                  ],
                  answer: 1,
                  explanation:
                    'Non-linearity usefulness depends on the depth of the intermediate feature space: deep spaces (Inception) tolerate the information loss from a ReLU, but the 1-channel-deep intermediate space of a depthwise separable convolution loses too much (Section 4.7).',
                },
              ],
            },
          ],
        },
        {
          id: 'xc-m1-l6',
          title: 'Architecture Trade-offs',
          minutes: 12,
          xp: 70,
          steps: [
            {
              kind: 'scenario',
              title: 'Applying the spectrum and the ablations',
              scenario: {
                intro:
                  'You are designing a convolutional architecture and have to make choices the Xception paper directly informs. Apply what the paper found.',
                stages: [
                  {
                    situation:
                      'You are choosing how to factor a convolutional block: a few wide towers (Inception-style, 3-4 channel segments) or one independent spatial convolution per channel (the extreme/depthwise-separable end of the spectrum).',
                    question: 'Based on the paper\'s comparison at matched parameter count, which is the more defensible default starting point?',
                    options: [
                      {
                        label: 'The extreme/depthwise-separable end — same parameter budget, equal-or-better accuracy in the paper\'s experiments',
                        quality: 'best',
                        feedback:
                          'Right. At matched parameter count, Xception (the extreme end of the spectrum) matched or beat Inception V3 on both ImageNet and JFT — the paper\'s whole argument is that pushing the decoupling further was not just viable but better.',
                      },
                      {
                        label: 'The few-wide-towers Inception design, because it has been validated longer',
                        quality: 'ok',
                        feedback:
                          'Reasonable caution, but the paper\'s entire point is that the extreme end of the spectrum is the more parameter-efficient choice — "longer validated" isn\'t the same as "better," especially once a controlled comparison exists.',
                      },
                      {
                        label: 'A single regular convolution (1 segment) — simplest, fewest design decisions',
                        quality: 'bad',
                        feedback:
                          'That\'s the opposite end of the spectrum from where the paper\'s gains come from. A single joint convolution is exactly the design the Inception hypothesis argues against.',
                      },
                    ],
                  },
                  {
                    situation:
                      'Your new architecture stacks many depthwise-separable-convolution blocks, the same way Xception does. A teammate suggests adding residual connections "since ResNet showed they always help."',
                    question: 'Given Section 4.6\'s ablation, how should you respond?',
                    options: [
                      {
                        label: 'Test it — for Xception specifically, removing residuals clearly hurt both convergence and accuracy, but the paper also got excellent results from a non-residual VGG-style variant of the same operation',
                        quality: 'best',
                        feedback:
                          'Correct. Residuals are not a hard requirement of depthwise separable convolutions in general — they mattered for this specific 14-module design, but a non-residual VGG-style stack of the same operation also performed well. Treat it as something to verify for your specific stack depth, not a fixed law.',
                      },
                      {
                        label: 'Always add them — the paper shows they are essential and the result generalizes to any architecture',
                        quality: 'bad',
                        feedback:
                          'Overgeneralizing. The paper is explicit that this result is scoped to "this specific architecture as benchmarked," and immediately notes a non-residual variant that worked well too.',
                      },
                      {
                        label: 'Skip them — the paper\'s real innovation is the convolution type, not residuals, so residuals are unnecessary overhead',
                        quality: 'bad',
                        feedback:
                          'The measured ablation says the opposite for Xception\'s own design: removing residuals clearly hurt convergence speed and final accuracy (Section 4.6). Don\'t skip them without testing.',
                      },
                    ],
                  },
                  {
                    situation:
                      'You\'re implementing your own separable-convolution block (depthwise, then pointwise) and a colleague asks whether to insert a ReLU between the two steps, "since every other conv block in the codebase has one."',
                    question: 'What does Section 4.7\'s finding suggest you do?',
                    options: [
                      {
                        label: 'Leave it out, and test with/without — the paper found removing the intermediate non-linearity gave faster convergence and better final accuracy for this 1-channel-deep intermediate space',
                        quality: 'best',
                        feedback:
                          'Right. The paper\'s explicit, "remarkable" finding is that no non-linearity beat both ReLU and ELU between the depthwise and pointwise steps — the opposite of the usual convention, attributed to how narrow (1-channel-deep) that intermediate space is.',
                      },
                      {
                        label: 'Add the ReLU, matching the rest of the codebase for consistency',
                        quality: 'bad',
                        feedback:
                          'This copies a convention that the paper specifically tested and found harmful in this exact location — between depthwise and pointwise steps of a separable convolution.',
                      },
                      {
                        label: 'It doesn\'t matter either way, since Szegedy et al. already settled this question for Inception modules',
                        quality: 'bad',
                        feedback:
                          'Szegedy et al.\'s finding was for Inception modules\' deeper intermediate feature spaces — the paper shows the opposite holds for the narrow, 1-channel-deep space inside a depthwise separable convolution. Context (feature-space width) matters.',
                      },
                    ],
                  },
                ],
                debrief:
                  'Push decoupling toward the extreme end of the spectrum at matched parameter count — the paper\'s comparisons consistently favor it. But don\'t treat every supporting design choice (residuals, intermediate activations) as universal: each was independently tested for this specific architecture, and at least one finding (no non-linearity between depthwise/pointwise) directly contradicts the equivalent choice in Inception modules. Verify, don\'t assume.',
              },
            },
          ],
        },
      ],
    },
  ],
}
