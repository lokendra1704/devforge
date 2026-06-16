import type { Subject } from '../types'
import motivationMd from './md/crg-motivation.md?raw'
import harnessMd from './md/crg-harness.md?raw'
import crafterMd from './md/crg-crafter.md?raw'
import crafteditorMd from './md/crg-crafteditor.md?raw'
import resultsMd from './md/crg-results.md?raw'

export const craftCreativeGeneration: Subject = {
  id: 'craft-creative-generation',
  title: 'Craft: Open-Ended Creative Content Generation',
  tagline: 'A harness-based approach to structurally sound figure generation and editing',
  icon: '🎨',
  accent: '#8B5CF6',
  modules: [
    {
      id: 'crg-m1',
      title: 'Orchestration and Structured Revision',
      description:
        'Learn how orchestration harnesses enable generation of publication-quality scientific figures across diverse inputs through planning, verification, and structured revision.',
      lessons: [
        {
          id: 'crg-l1',
          title: 'Why Scientific Figures Are Hard',
          minutes: 10,
          xp: 50,
          steps: [
            {
              kind: 'read',
              title: 'Why Scientific Figures Are Hard',
              markdown: motivationMd,
            },
            {
              kind: 'quiz',
              title: 'Understanding the core challenges',
              questions: [
                {
                  prompt:
                    'According to the paper, why is "a stronger generator backbone" not the solution to scientific figure generation?',
                  options: [
                    'Generators are too expensive to train',
                    'Scientific figures are structured compositions where generator variance produces different constellations of localized errors across attempts, and free-text corrections introduce contradictions',
                    'Generators cannot produce photorealistic images',
                  ],
                  answer: 1,
                  explanation:
                    'Correct. Scientific figures unlike natural images are structured—each attempt fails differently. Naive retry and accumulating corrections degrade quality silently.',
                },
                {
                  prompt:
                    'What two fundamental shortcomings exist in current scientific figure generation systems?',
                  options: [
                    'They are too slow and too expensive',
                    'They are narrow in scope (single figure type, text-only input) and produce non-editable raster output',
                    'They require human feedback and cannot work autonomously',
                  ],
                  answer: 1,
                  explanation:
                    'Correct. Systems focus on text-to-image for academic diagrams; their raster output cannot be locally revised.',
                },
              ],
            },
          ],
        },
        {
          id: 'crg-l2',
          title: 'The Harness Abstraction',
          minutes: 12,
          xp: 60,
          steps: [
            {
              kind: 'read',
              title: 'The Harness Abstraction',
              markdown: harnessMd,
            },
            {
              kind: 'quiz',
              title: 'Harness design principles',
              questions: [
                {
                  prompt:
                    'What is the key difference between a directive diagnostic and a scalar quality score?',
                  options: [
                    'A directive diagnostic is slower to compute but more accurate',
                    'A directive diagnostic provides per-dimension scores, identified defects, and suggested corrections—actionable targets; a scalar score provides no direction for the next round',
                    'A directive diagnostic only works with language models',
                  ],
                  answer: 1,
                  explanation:
                    'Correct. A directive diagnostic tells the reviser *what* and *where* to fix; "5/10" tells nothing.',
                },
              ],
            },
            {
              kind: 'scenario',
              title: 'Choosing revision strategies',
              scenario: {
                intro:
                  'You are building an iterative figure-refinement loop. After the first generation fails, you collect feedback and start the next round.',
                stages: [
                  {
                    situation: 'The loop needs to apply corrections without introducing contradictions.',
                    question: 'Which approach is safer against accumulating contradictions?',
                    options: [
                      {
                        label:
                          'Append natural-language corrections to the prompt: "enlarge the title, reduce white space, fix the arrow"',
                        quality: 'bad',
                        feedback:
                          'This approach can introduce silent contradictions. Later corrections may conflict with earlier ones, and the generator absorbs the contradictions without signaling them.',
                      },
                      {
                        label:
                          'Record each correction as a structured operation in a shared specification: add constraint(width > 150), ban(oversized_text), resize(title, 20→24)',
                        quality: 'best',
                        feedback:
                          'Correct. Typed edits maintain internal consistency. The next prompt is assembled from this coherent record, not a growing stack of amendments.',
                      },
                    ],
                  },
                ],
                debrief:
                  'The structured corrective layer is central to the harness design—it keeps the specification internally consistent across rounds.',
              },
            },
          ],
        },
        {
          id: 'crg-l3',
          title: 'Crafter: Figure Generation with Three Mechanisms',
          minutes: 15,
          xp: 75,
          steps: [
            {
              kind: 'read',
              title: 'Crafter Design',
              markdown: crafterMd,
            },
            {
              kind: 'quiz',
              title: 'Crafter mechanisms',
              questions: [
                {
                  prompt:
                    'Why does Crafter generate K candidate plans in parallel rather than iteratively refining a single plan?',
                  options: [
                    'Because parallel generation is faster than sequential refinement',
                    'Because a wrong early framing decision (e.g., rendering a comparison as a block diagram) propagates through refinement with no escape; parallel plans explore different framings before rendering budget is spent',
                    'Because it reduces the risk of hallucinations',
                  ],
                  answer: 1,
                  explanation:
                    'Correct. Plan-level branching addresses a fundamental problem: a single compositional choice, once made, cannot be undone in refinement.',
                },
                {
                  prompt: 'What does the "early-exit gate" in the refinement loop accomplish?',
                  options: [
                    'It stops refinement as soon as the generator finishes one round',
                    'It bypasses refinement when the first-round output already meets critical quality thresholds, avoiding unnecessary iterations and non-monotonic regressions',
                    'It ensures the loop never runs more than once',
                  ],
                  answer: 1,
                  explanation:
                    'Correct. If the first output is already good, iteration risk (non-monotonic degradation) outweighs benefit.',
                },
              ],
            },
            {
              kind: 'scenario',
              title: 'Revision strategy selection',
              scenario: {
                intro: 'You are fixing a generated academic diagram. The title is misaligned and the legend is duplicated.',
                stages: [
                  {
                    situation:
                      'You need to correct both issues without introducing new ones.',
                    question: 'Which sequence of edits is more likely to succeed?',
                    options: [
                      {
                        label:
                          'Free-text revision: "Move title left and center it. Remove the duplicate legend."',
                        quality: 'bad',
                        feedback:
                          'Free-text instructions can introduce contradictions if other parts of the image depend on the original positions. Future corrections may conflict with these.',
                      },
                      {
                        label:
                          'Structured edits: {alignment: center, x_offset: -10}, {ban: legend_duplication}',
                        quality: 'best',
                        feedback:
                          'Correct. Typed edits are composable and non-contradictory. The specification accumulates coherent directives.',
                      },
                    ],
                  },
                ],
                debrief:
                  'Structured edits prevent the silent contradictions that plague free-text iterative revision.',
              },
            },
          ],
        },
        {
          id: 'crg-l4',
          title: 'CraftEditor: Raster to Vector Through Three Phases',
          minutes: 13,
          xp: 65,
          steps: [
            {
              kind: 'read',
              title: 'CraftEditor Implementation',
              markdown: crafteditorMd,
            },
            {
              kind: 'quiz',
              title: 'CraftEditor design',
              questions: [
                {
                  prompt:
                    'Why does CraftEditor use instruction-driven extraction instead of off-the-shelf segmentation?',
                  options: [
                    'Instruction-driven extraction is always faster',
                    'Off-the-shelf segmentation struggles with overlapping elements, text, and heterogeneous backgrounds on scientific figures; instruction-driven extraction gives a vision-language agent explicit control via keep/delete plans',
                    'Because it avoids using machine learning',
                  ],
                  answer: 1,
                  explanation:
                    'Correct. Segmentation fails on clutter; explicit instructions allow semantic understanding of which elements matter.',
                },
                {
                  prompt:
                    'What is the "hybrid critic" in CraftEditor\'s composition phase, and why combine two channels?',
                  options: [
                    'A hybrid critic uses two independent evaluators to speed up scoring',
                    'A hybrid critic combines a vision-language model (assessing layout fidelity and semantic correspondence) with programmatic checkers (auditing structural properties like text overflow and arrow-endpoint accuracy), catching both semantic and geometric errors',
                    'A hybrid critic is cheaper to run than a single VLM evaluator',
                  ],
                  answer: 1,
                  explanation:
                    'Correct. VLMs can miss structural problems; programmatic checks catch geometry. Together they cover both types of errors.',
                },
              ],
            },
            {
              kind: 'scenario',
              title: 'Phase selection for extraction problems',
              scenario: {
                intro:
                  'You are converting a conference poster (raster) to an editable SVG. The poster has 40 overlapping elements and text labels.',
                stages: [
                  {
                    situation: 'The overlapping elements are preventing clean separation.',
                    question: 'Which phase would most directly address overlapping elements?',
                    options: [
                      {
                        label:
                          'Processing phase—classify each element as vector or raster',
                        quality: 'bad',
                        feedback:
                          'Processing assumes the elements are already extracted. Classification happens *after* separation.',
                      },
                      {
                        label:
                          'Extraction phase—use vision-language agent to author a keep/delete plan, image editor executes it to clean the canvas, removing overlaps',
                        quality: 'best',
                        feedback:
                          'Correct. Extraction explicitly separates overlapping elements through instruction-driven editing, isolating clean assets.',
                      },
                    ],
                  },
                ],
                debrief:
                  'Each phase of CraftEditor addresses a specific type of problem: extraction handles clutter, processing adds metadata, composition refines structure.',
              },
            },
          ],
        },
        {
          id: 'crg-l5',
          title: 'Evaluation: Results and Ablation',
          minutes: 11,
          xp: 55,
          steps: [
            {
              kind: 'read',
              title: 'Evaluation Results',
              markdown: resultsMd,
            },
            {
              kind: 'quiz',
              title: 'Interpreting results',
              questions: [
                {
                  prompt:
                    'On CraftBench, Crafter scores 50.20 while its backbone (Nano Banana 2) scores 19.90. What does this gap primarily demonstrate?',
                  options: [
                    'That newer image generators are much better than older ones',
                    'That the harness orchestration, not the generator backbone, drives the performance gain',
                    'That CraftBench is an easier benchmark than PaperBanana-Bench',
                  ],
                  answer: 1,
                  explanation:
                    'Correct. Crafter uses the same generator as the baseline but achieves +30.3 points. The ablation further shows that structured revision contributes −8.90 when removed.',
                },
                {
                  prompt:
                    'In the ablation study, removing the "corrective layer" caused an 8.90 point drop (the largest single drop). What does this suggest?',
                  options: [
                    'The image generator is not the bottleneck',
                    'Accumulating free-text corrections introduces silent contradictions that degrade quality more than other failure modes',
                    'Refinement loops are not useful for figure generation',
                  ],
                  answer: 1,
                  explanation:
                    'Correct. The largest drop comes from removing structured edits; this confirms the paper\'s original hypothesis about free-text contradiction.',
                },
              ],
            },
          ],
        },
        {
          id: 'crg-l6',
          title: 'When and Why to Use the Harness Pattern',
          minutes: 12,
          xp: 60,
          steps: [
            {
              kind: 'scenario',
              title: 'Generalization and application',
              scenario: {
                intro:
                  'The harness pattern is not limited to figure generation. Understand where it applies and where it does not.',
                stages: [
                  {
                    situation:
                      'You are designing an automated system for a different task: generating structured SQL queries from natural-language descriptions.',
                    question: 'Would the harness pattern apply?',
                    options: [
                      {
                        label:
                          'No. The harness pattern only works for figure generation.',
                        quality: 'bad',
                        feedback:
                          'The harness is a general orchestration pattern. It applies to any executor that produces structured outputs where localized errors recur and contradicting corrections accumulate.',
                      },
                      {
                        label:
                          'Yes. SQL queries are structured compositions; a one-shot generator exhibits high variance on complex schemas; free-text corrections introduce contradictions. A harness with typed edits (ban this table, require this column) addresses these problems.',
                        quality: 'best',
                        feedback:
                          'Correct. The harness pattern applies wherever: (1) output is structured, (2) generator variance produces different error constellations, (3) free-text revision degrades quality.',
                      },
                    ],
                  },
                  {
                    situation:
                      'Your team is deciding whether to invest in CraftEditor for converting existing raster figures to SVG.',
                    question:
                      'When should you choose CraftEditor over keeping a figure as raster?',
                    options: [
                      {
                        label: 'Always. SVG is always better than raster.',
                        quality: 'bad',
                        feedback:
                          'Raster is appropriate when figures do not require element-level edits. The paper identifies editability as a key requirement unmet by raster.',
                      },
                      {
                        label:
                          'When the workflow demands element-level edits (swapping icons, adjusting labels, recoloring components), a coordinate-faithful SVG is essential; otherwise raster is sufficient',
                        quality: 'best',
                        feedback:
                          'Correct. CraftEditor adds complexity; use it only when local editability is required. For static figures, raster is simpler.',
                      },
                    ],
                  },
                ],
                debrief:
                  'Apply the harness pattern where output is structured, variance is high, and corrections accumulate. Avoid it where the output is unstructured or a single attempt usually succeeds.',
              },
            },
            {
              kind: 'quiz',
              title: 'Core principles',
              questions: [
                {
                  prompt:
                    'What are the three key properties that make the harness pattern effective across diverse figure types?',
                  options: [
                    'Pluggable executor, typed edits, and diversity-driven plan exploration',
                    'Task-specific behavior resides in prompts (not architecture), structured edits prevent contradictions, and verification loops correct localized errors',
                    'Fast iteration, human feedback, and neural network training',
                  ],
                  answer: 1,
                  explanation:
                    'Correct. Because prompts are swappable, the harness generalizes from figures to sketches to editorial layouts without structural change.',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
