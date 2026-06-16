import type { Subject } from '../types'
import motivationMd from './md/so-motivation.md?raw'
import loopMd from './md/so-loop.md?raw'
import stabilityMd from './md/so-stability.md?raw'
import resultsMd from './md/so-results.md?raw'

export const skillOpt: Subject = {
  id: 'skill-opt',
  title: 'SkillOpt: Text-Space Skill Training',
  tagline:
    'Microsoft & collaborators, May 2026 — a text-space optimizer that trains agent skill documents like weights (bounded edits, validation gates, rejected-edit buffer), best or tied-best on 52 of 52 cells across 6 benchmarks, 7 models, 3 harnesses.',
  icon: '🎯',
  accent: '#f59e0b',
  modules: [
    {
      id: 'so-m1',
      title: 'SkillOpt: Training Agent Skills',
      description:
        'Yang, Gong, Huang et al. (Microsoft, SJTU, 2026): treating the agent skill document as external trainable state and optimizing it with bounded edits, held-out gating, and epoch-wise slow/meta update — without modifying model weights.',
      lessons: [
        {
          id: 'so-motivation',
          title: 'The Skills Gap',
          minutes: 12,
          xp: 60,
          steps: [
            { kind: 'read', title: 'Why current skill-building strategies fall short', markdown: motivationMd },
            {
              kind: 'quiz',
              title: 'The training analogy',
              questions: [
                {
                  prompt:
                    'SkillOpt treats the skill document as "the external state of a frozen agent." What does "frozen" mean here?',
                  options: [
                    "The target model's weights are not updated during skill optimization",
                    'The skill document cannot be changed once deployed',
                    'The optimizer model is frozen; the target model learns new skills',
                    'The execution harness is locked to one mode throughout training',
                  ],
                  answer: 0,
                  explanation:
                    '"Frozen" means the target model\'s weights remain fixed throughout optimization. SkillOpt adapts only the skill document — a text file — not any model parameters. The optimizer model is a separate, unfrozen LLM that runs only during offline training.',
                },
                {
                  prompt:
                    'One-shot LLM skills and SkillOpt skills both use a language model to generate skill content. What critical ingredient does SkillOpt add that one-shot skills lack?',
                  options: [
                    'A larger language model for skill generation',
                    'Rollout evidence: scored trajectories from the actual target model on actual tasks',
                    'A longer initial skill template as a starting point',
                    'Fine-tuning the target model on the generated skill content',
                  ],
                  answer: 1,
                  explanation:
                    'One-shot LLM skill is "generated from a high-level task description and never updated" (Table 1). SkillOpt uniquely feeds scored rollout trajectories back through a reflection + validation loop. The one-shot skill has no feedback signal at all — it cannot correct failures it has never observed.',
                },
                {
                  prompt:
                    'The DL analogy maps edit budget L_t to "learning rate." What failure mode does too-large an L_t produce?',
                  options: [
                    'The skill converges too slowly and requires more training epochs',
                    'Unbounded rewrites can erase useful rules, introduce incompatible instructions, or overfit to a local failure',
                    'The validation gate will automatically reject large edit budgets',
                    'The optimizer model exceeds its context window and produces truncated edits',
                  ],
                  answer: 1,
                  explanation:
                    'Section 3.4: "Unbounded rewrites can erase useful rules, introduce incompatible instructions, or overfit to a local failure; bounded updates preserve continuity." Too-large L_t in SkillOpt is analogous to too-high a learning rate in weight-space training — the update overshoots and destroys previously learned structure.',
                },
              ],
            },
          ],
        },
        {
          id: 'so-loop',
          title: 'The Optimization Loop',
          minutes: 14,
          xp: 70,
          steps: [
            {
              kind: 'read',
              title: 'Forward pass, backward pass, bounded text updates',
              markdown: loopMd,
            },
            {
              kind: 'quiz',
              title: 'Evidence and edit budget',
              questions: [
                {
                  prompt:
                    'Why does SkillOpt partition trajectories into minibatches for reflection rather than reflecting on each trajectory individually?',
                  options: [
                    'Individual trajectories always succeed, so no reflection is needed for them',
                    'Single trajectories often produce anecdotal fixes, while minibatches expose reusable procedural errors across multiple cases',
                    'The optimizer model has a fixed context window that only fits one trajectory at a time',
                    'Minibatches are needed only for success trajectories, not for failures',
                  ],
                  answer: 1,
                  explanation:
                    'Section 3.3: "Single trajectories often produce anecdotal fixes, while minibatches expose reusable procedural errors: the agent consistently searches the wrong source, writes an answer in the wrong format, or fails to verify a tool result." A single failure might be a fluke; a pattern across many examples is a learnable procedure.',
                },
                {
                  prompt:
                    'When merging edits from failure-minibatch and success-minibatch reflection, which type takes priority?',
                  options: [
                    'Success-driven edits take priority, to preserve behaviors that already work',
                    'Failure-driven corrections take priority; success edits are added after',
                    'Edits are ranked purely by the optimizer model\'s confidence score, regardless of type',
                    'The merge step removes all failure-driven edits when any success-driven edits exist',
                  ],
                  answer: 1,
                  explanation:
                    'Section 3.3: "combining them with priority on failure corrections." Failures drive the corrective edits; success edits preserve what is already working. Both contribute, but fixing failures takes precedence over reinforcing successes when the two conflict.',
                },
              ],
            },
          ],
        },
        {
          id: 'so-stability',
          title: 'Stability Mechanisms',
          minutes: 12,
          xp: 60,
          steps: [
            {
              kind: 'read',
              title: 'Validation gate, rejected-edit buffer, and epoch-wise slow update',
              markdown: stabilityMd,
            },
            {
              kind: 'quiz',
              title: 'Why the gate is strict',
              questions: [
                {
                  prompt:
                    'Why does the validation gate reject tied scores rather than accepting them?',
                  options: [
                    'Ties indicate the optimizer is proposing contradictory edits that cancel out',
                    'Accepting ties would let the skill drift silently — edits accumulate without measurable gain, and rejected edits stop being informative negative feedback',
                    'A tied score means the candidate skill is byte-for-byte identical to the current skill',
                    'Ties are accepted; the gate only rejects score drops, not ties',
                  ],
                  answer: 1,
                  explanation:
                    'Section 3.5: "This conservative criterion makes rejected edits informative negative feedback rather than hidden state." If ties were accepted, the skill could accumulate edits with zero measured value, and the rejected-edit buffer would lose its signal — rejected edits would look identical to neutral ones.',
                },
                {
                  prompt:
                    'The epoch-wise slow/meta update writes into a "protected slow-update field." What makes it protected?',
                  options: [
                    'It can only be updated by the deployed target model, not the optimizer',
                    'Step-level edits cannot overwrite it — only the epoch-wise slow update writes to this region',
                    'It is encrypted so the optimizer model cannot read its current contents',
                    'It is stored in a separate file and merged into best_skill.md only at final export',
                  ],
                  answer: 1,
                  explanation:
                    'Section 3.4: "Step-level edits cannot overwrite the protected slow-update field, so fast local changes and slower epoch-wise consolidation remain separated." This structural separation is what lets the two timescales coexist in one document — fast intra-epoch edits and slower cross-epoch lessons do not interfere with each other.',
                },
                {
                  prompt: 'Where does the optimizer-side meta skill live?',
                  options: [
                    'Inside best_skill.md, in the protected slow-update field',
                    'In a separate file shipped alongside best_skill.md to the deployed agent',
                    "In the optimizer model's context only — it is never shipped with the deployed skill artifact",
                    "In the target model's system prompt, updated after each epoch",
                  ],
                  answer: 2,
                  explanation:
                    'Section 3.6: "The meta skill is optimizer-side only... it is not shipped with the target model." The deployed artifact stays compact; training benefits from a richer editing history. A practitioner reading the final best_skill.md sees only the validated procedural rules — not the optimizer\'s internal deliberations.',
                },
              ],
            },
          ],
        },
        {
          id: 'so-results',
          title: 'Empirical Results',
          minutes: 14,
          xp: 70,
          steps: [
            {
              kind: 'read',
              title: '52/52 cells, edit economy, and transfer',
              markdown: resultsMd,
            },
            {
              kind: 'code',
              title: 'Cosine edit-budget schedule',
              challenge: {
                prompt: `SkillOpt's cosine learning-rate schedule decays the edit budget from a start value down to a floor:

  L_t = L_floor + (L_start - L_floor) × 0.5 × (1 + cos(π × step / totalSteps))

Round to the nearest integer and clamp to at least L_floor.

Implement cosineEditBudget(step, totalSteps, startBudget, floorBudget):
- step 0 → startBudget
- step totalSteps → floorBudget
- midpoint (step = totalSteps/2) → average of start and floor`,
                starterCode: `function cosineEditBudget(step, totalSteps, startBudget, floorBudget) {
  // TODO: implement the cosine decay formula
  return startBudget; // placeholder — does not decay
}`,
                solution: `function cosineEditBudget(step, totalSteps, startBudget, floorBudget) {
  const cosVal = 0.5 * (1 + Math.cos(Math.PI * step / totalSteps));
  return Math.max(floorBudget, Math.round(floorBudget + (startBudget - floorBudget) * cosVal));
}`,
                tests: `test('step 0 returns startBudget', () => {
  assertEqual(cosineEditBudget(0, 8, 8, 2), 8);
});
test('step totalSteps returns floorBudget', () => {
  assertEqual(cosineEditBudget(8, 8, 8, 2), 2);
});
test('midpoint returns average of start and floor', () => {
  // cos(PI/2) = 0 → 0.5*(1+0) = 0.5 → 2 + (8-2)*0.5 = 5
  assertEqual(cosineEditBudget(4, 8, 8, 2), 5);
});
test('constant budget when startBudget equals floorBudget', () => {
  assertEqual(cosineEditBudget(3, 10, 5, 5), 5);
});`,
              },
            },
          ],
        },
        {
          id: 'so-limits',
          title: 'Where SkillOpt Fits',
          minutes: 10,
          xp: 80,
          steps: [
            {
              kind: 'scenario',
              title: 'Three deployment decisions',
              scenario: {
                intro:
                  "You have seen SkillOpt's 52/52 track record. Now three engineering teams ask you whether to apply it. Each situation matches a structural limitation from Appendix B.",
                stages: [
                  {
                    situation:
                      "Team A is building a customer-support agent for a legal firm. Tasks are open-ended: 'draft a response to this complaint.' There is no automatic verifier — evaluating response quality requires human review.",
                    question: 'Should Team A use SkillOpt to optimize the skill?',
                    options: [
                      {
                        label: 'Use SkillOpt with human judges as the validation oracle',
                        quality: 'best',
                        feedback:
                          "SkillOpt's gate needs a reliable signal — Appendix B notes it requires 'stronger human or model-based evaluation' for open-ended domains. This works, but each evaluation round costs more than an automatic verifier. The framework is sound; the oracle is just more expensive.",
                      },
                      {
                        label: 'Use a human-written skill and accept its limitations',
                        quality: 'ok',
                        feedback:
                          "A reasonable fallback when automated evaluation is unavailable and human-oracle costs are prohibitive. The skill won't improve from rollout feedback, but it encodes expert knowledge. SkillOpt's iterative improvement and rejected-edit buffer are simply unreachable without a reliable evaluation signal.",
                      },
                      {
                        label: 'Use SkillOpt with no validation gate — let the optimizer update freely',
                        quality: 'bad',
                        feedback:
                          'Section 3.5: "plausible textual diagnoses can still hurt the actual target model." Removing the gate converts controlled optimization back into ad hoc self-editing — exactly the failure mode SkillOpt was designed to fix. Without a gate, rejected edits also lose their informative negative-feedback signal.',
                      },
                    ],
                  },
                  {
                    situation:
                      'Team B has a coding benchmark with an automatic test-suite scorer — the ideal SkillOpt setup. But the project is a one-off internal tool: the optimized skill will run exactly once before the task is retired.',
                    question: 'Should Team B optimize a skill with SkillOpt?',
                    options: [
                      {
                        label: "Skip SkillOpt — training cost isn't amortized for a single-use task",
                        quality: 'best',
                        feedback:
                          'Appendix B: "this cost is amortized when the same skill is reused, but may be less attractive for one-off tasks." Training tokens, rollout compute, and optimizer calls are only justified when the skill will run many times. A one-off task cannot spread that cost over repeated deployments.',
                      },
                      {
                        label: 'Use a one-shot LLM skill instead',
                        quality: 'ok',
                        feedback:
                          'A one-shot LLM skill costs one generation call and is good enough when you will use it only once. You forego iterative improvement, but you also avoid spending 20M+ training tokens on a disposable artifact.',
                      },
                      {
                        label: 'Run SkillOpt anyway — the performance gain is worth the training cost',
                        quality: 'bad',
                        feedback:
                          "The math doesn't work. SkillOpt's training budget (10M–200M tokens) dwarfs the inference savings from a slightly better skill over a handful of runs. The value proposition is reuse and amortization — not raw performance on the very first use.",
                      },
                    ],
                  },
                  {
                    situation:
                      'Team C wants to deploy a single optimized skill across 12 heterogeneous domains — math, medical records, legal contracts, coding, image captioning, and more. Each domain has different tool sets, answer formats, and failure patterns.',
                    question: 'Can one optimized skill serve all 12 domains?',
                    options: [
                      {
                        label: 'Train a separate skill per domain',
                        quality: 'best',
                        feedback:
                          'Appendix B: "a single skill may be insufficient for highly heterogeneous domains that require many disjoint procedures." The learned rules are domain-specific — workbook forensics for spreadsheets, MCQ ranking for math, search-frontier discipline for ALFWorld. A single skill cannot hold all of these without contradiction.',
                      },
                      {
                        label: 'Optimize one general skill and accept lower per-domain performance',
                        quality: 'ok',
                        feedback:
                          'If the domains share enough procedural structure (e.g. all require careful output formatting or tool verification), a general skill might help across all of them. Performance will be lower than per-domain optimization, but the training cost is paid once. Worth testing as a baseline before committing to 12 separate runs.',
                      },
                      {
                        label: 'Run one SkillOpt pass trained on all 12 domains simultaneously',
                        quality: 'bad',
                        feedback:
                          'Mixing heterogeneous training data blurs the optimization signal — a rule that helps on math problems may conflict with one needed for image captioning. The rejected-edit buffer and validation gate are calibrated per-domain; training on a mixture makes both less informative and can produce a skill that is mediocre everywhere.',
                      },
                    ],
                  },
                ],
                debrief:
                  'Three structural limits from Appendix B: (1) SkillOpt needs reliable evaluation signal — a gate without signal is no gate; (2) training cost amortizes over reuse, not one-shot tasks; (3) one compact skill per domain, not a universal policy. Within those limits, the method is the strongest no-weight-update adaptation strategy across the 52 evaluated cells.',
              },
            },
          ],
        },
      ],
    },
  ],
}
