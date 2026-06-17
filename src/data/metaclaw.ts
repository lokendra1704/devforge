import type { Subject } from '../types'
import motivationMd from './md/mc-motivation.md?raw'
import metaModelMd from './md/mc-meta-model.md?raw'
import architectureMd from './md/mc-architecture.md?raw'
import versioningSchedulerMd from './md/mc-versioning-scheduler.md?raw'
import resultsMd from './md/mc-results.md?raw'

export const metaclaw: Subject = {
  id: 'metaclaw',
  title: 'MetaClaw: Continual Meta-Learning for Deployed LLM Agents',
  tagline:
    'Xia, Chen, Yang et al. (2026) — a deployed agent that evolves through normal use, by coupling instant gradient-free skill synthesis with policy optimization deferred to idle windows.',
  icon: '🦞',
  accent: '#fb923c',
  modules: [
    {
      id: 'mc-m1',
      title: 'MetaClaw: Skills + RL on Two Timescales',
      description:
        'How a deployed LLM agent improves continuously without downtime: gradient-free skill synthesis in seconds, gradient-based policy optimization deferred to idle windows, and the versioning mechanism that keeps the two from corrupting each other.',
      lessons: [
        {
          id: 'mc-motivation',
          title: 'Why deployed agents go stale',
          minutes: 9,
          xp: 50,
          steps: [
            { kind: 'read', title: 'The agent that never learns from Tuesday', markdown: motivationMd },
            {
              kind: 'quiz',
              title: 'Why prior approaches fall short',
              questions: [
                {
                  prompt:
                    'Skill-based methods like Voyager and ExpeL compress experience into reusable natural-language instructions. According to the paper, what is their core limitation?',
                  options: [
                    'They require too much compute to run at inference time',
                    'The skill library is treated as a static database, never coordinated with weight-level optimization',
                    'They only work for code-generation tasks',
                    'They cannot be injected into a system prompt',
                  ],
                  answer: 1,
                  explanation:
                    'The paper\'s critique is specific: skills get distilled and stored, but nothing connects that library back to improving the underlying policy weights — it sits static while the model around it never changes.',
                },
                {
                  prompt:
                    'RL-based methods update model weights from reward signal, but the paper says they "ignore a critical data validity problem." What is that problem?',
                  options: [
                    'RL training is too slow to ever finish',
                    'Once skills evolve, trajectories collected under the old skill context carry stale rewards that contaminate gradient updates if reused without filtering',
                    'Reward models cannot be trained for agentic tasks',
                    'RL requires a local GPU, which production deployments lack',
                  ],
                  answer: 1,
                  explanation:
                    'This is the support/query problem in miniature: a trajectory\'s reward is only valid relative to the skill library that produced it. Reuse it after skills change and the policy gets optimized against an outdated signal.',
                },
                {
                  prompt:
                    'Why does MetaClaw run skill-driven adaptation and policy optimization as two separate mechanisms instead of merging them into one?',
                  options: [
                    'Because they operate on fundamentally different timescales — skills can be distilled in seconds from one failure, while improving the policy needs gradient steps over many trajectories on a timescale of minutes to hours',
                    'Because policy optimization is deprecated in favor of skill libraries',
                    'Because the two mechanisms produce identical results, so running both is just redundancy for robustness',
                    'Because skills only work on GPT-5.2 and RL only works on Kimi-K2.5',
                  ],
                  answer: 0,
                  explanation:
                    'The two-timescale framing is the paper\'s central observation: gradient-free skill synthesis is near-instant; gradient-based policy updates are inherently slower. Running them separately — but mutually reinforcing — lets each operate at its natural speed.',
                },
              ],
            },
          ],
        },
        {
          id: 'mc-meta-model',
          title: 'The meta-model: policy + skill library',
          minutes: 10,
          xp: 50,
          steps: [
            { kind: 'read', title: 'What does the agent actually consist of?', markdown: metaModelMd },
            {
              kind: 'quiz',
              title: 'Support data vs. query data',
              questions: [
                {
                  prompt: 'What are the two components of MetaClaw\'s meta-model M = (θ, S)?',
                  options: [
                    'A reward model and a value function',
                    'The base LLM policy weights θ, and a library of skill instructions S',
                    'A training buffer and an evaluation buffer',
                    'A retrieval index and a vector database',
                  ],
                  answer: 1,
                  explanation:
                    'θ is the policy weights; S is the evolving library of reusable natural-language skill instructions. Together they fully determine the agent\'s behavior at any point in time.',
                },
                {
                  prompt:
                    'A trajectory fails under skill generation S_g, triggering the evolver to synthesize S_{g+1}. Is that failing trajectory support data or query data?',
                  options: [
                    'Support data — its failure is what drives the skill evolution',
                    'Query data — it gets used directly to train the policy',
                    'Neither — failed trajectories are discarded entirely',
                    'Both — it is duplicated into each buffer',
                  ],
                  answer: 0,
                  explanation:
                    'Support data is defined as the trajectories whose failures drive skill-library adaptation. They reflect pre-adaptation behavior and are consumed by the evolver, not the RL trainer.',
                },
                {
                  prompt: 'Why would mixing support and query data into one RL training buffer be harmful?',
                  options: [
                    'It would simply slow down training, with no effect on correctness',
                    'It would optimize θ against stale reward signals that no longer reflect the agent\'s current (post-adaptation) capabilities',
                    'It would cause the skill evolver to stop running',
                    'It would violate the embedding-retrieval mechanism',
                  ],
                  answer: 1,
                  explanation:
                    'Support-data rewards are conditioned on a skill context that has since changed. Training the policy on them teaches it to react to a problem the skill library already solved — a stale, misleading gradient signal.',
                },
              ],
            },
          ],
        },
        {
          id: 'mc-architecture',
          title: 'Two loops, one virtuous cycle',
          minutes: 12,
          xp: 60,
          steps: [
            { kind: 'read', title: 'Two loops, two clocks, one shared model', markdown: architectureMd },
            {
              kind: 'quiz',
              title: 'Which mechanism does what',
              questions: [
                {
                  prompt: 'Skill-driven fast adaptation (Equation 3, S_{g+1} = S_g ∪ E(S_g, D_sup_g)) updates which part of the meta-model?',
                  options: ['Only θ', 'Only S', 'Both θ and S simultaneously', 'Neither — it only logs failures'],
                  answer: 1,
                  explanation:
                    'It is explicitly gradient-free and touches only the skill library S, leaving θ fixed. That is exactly why it can take effect with zero service downtime — no model weights are swapped.',
                },
                {
                  prompt: 'Opportunistic policy optimization is trained using which data, and judged by what?',
                  options: [
                    'Support data, judged by raw task accuracy before any adaptation',
                    'Query data only, judged by a process reward model (PRM) score on post-adaptation behavior',
                    'A random sample of all trajectories, judged by user satisfaction surveys',
                    'Only failed trajectories, judged by how often they recur',
                  ],
                  answer: 1,
                  explanation:
                    'The RL update in Equation 4 trains exclusively on query-buffer trajectories (post-adaptation) using a PRM reward — it is explicitly optimizing for "how well the agent performs after skill adaptation," not raw task accuracy in isolation.',
                },
                {
                  prompt:
                    'In what sense are the two mechanisms "mutually reinforcing" rather than just two independent features?',
                  options: [
                    'They share the exact same training code, so maintaining one mechanism is cheaper',
                    'A better policy θ produces more informative failures for skill synthesis, and a richer skill library S yields higher-reward trajectories for policy optimization — each one\'s output feeds the other\'s input',
                    'They run on the same GPU, so they reduce hardware cost',
                    'They are not actually mutually reinforcing; the paper just claims this for marketing',
                  ],
                  answer: 1,
                  explanation:
                    'This is the "virtuous cycle" the paper builds the whole framework around: improvements in θ and improvements in S each make the other mechanism\'s next step more effective.',
                },
              ],
            },
          ],
        },
        {
          id: 'mc-versioning-scheduler',
          title: 'Versioning and the opportunistic scheduler',
          minutes: 12,
          xp: 60,
          steps: [
            { kind: 'read', title: 'The bug that would have wrecked the RL loop', markdown: versioningSchedulerMd },
            {
              kind: 'quiz',
              title: 'Versioning and idle-window detection',
              questions: [
                {
                  prompt: 'When the skill generation counter advances from g to g+1, what does the trainer do to its RL buffer?',
                  options: [
                    'Nothing — all buffered samples remain valid indefinitely',
                    'It flushes every sample with version ≤ g, keeping only query data collected under the new generation',
                    'It doubles the learning rate to compensate for stale data',
                    'It retrains the skill evolver from scratch',
                  ],
                  answer: 1,
                  explanation:
                    'This is the skill generation versioning mechanism: every sample is stamped with the generation it was collected under, and advancing the generation flushes everything tagged with an older (now-stale) version.',
                },
                {
                  prompt: 'Which of OMLS\'s three idle signals is described as "anticipatory" — predicting user absence before it happens, rather than just detecting it?',
                  options: ['System inactivity (idle timer)', 'Sleep window', 'Calendar-aware scheduling', 'None of them are anticipatory'],
                  answer: 2,
                  explanation:
                    'Calendar-aware scheduling treats a scheduled meeting as predicted unavailability — it opens a training window in anticipation of absence, rather than reacting to silence the way the inactivity timer does.',
                },
                {
                  prompt: 'A training window opens when any idle signal fires. When does it close?',
                  options: [
                    'Only after a fixed 8-hour training run completes',
                    'When all three signals simultaneously indicate the user is away',
                    'When any signal indicates the user has returned — and the trainer pauses gracefully via mid-batch checkpointing',
                    'It never closes once opened',
                  ],
                  answer: 2,
                  explanation:
                    'The OR logic is symmetric: any signal opens a window, and any signal indicating the user is back closes it, with the trainer checkpointing mid-batch rather than dropping work or blocking the user.',
                },
              ],
            },
          ],
        },
        {
          id: 'mc-results',
          title: 'Results: skills alone vs. the full pipeline',
          minutes: 14,
          xp: 70,
          steps: [
            { kind: 'read', title: 'Does any of this actually move the needle?', markdown: resultsMd },
            {
              kind: 'code',
              title: 'Reproduce the paper\'s headline numbers',
              challenge: {
                prompt: `## Turn baseline/improved metrics into the paper's reported numbers

Table 1 and Table 2 report two kinds of derived statistics from a baseline and an
improved metric: a **relative percentage change**, and (for completion rates) a
**multiplier**. Implement both.

**1.** \`relativeChangePct(baseline, improved)\` — relative change as a percentage,
rounded to 1 decimal place: \`((improved - baseline) / baseline) * 100\`, rounded.

**2.** \`multiplier(baseline, improved)\` — how many times larger the improved value
is, rounded to 2 decimal places: \`improved / baseline\`.

The tests check against the paper's own numbers: Kimi-K2.5's accuracy gain from
skills alone (Table 1, Part I), the Part I completion-rate jump under MetaClaw
(Full) (the paper calls this "8.25×"), and the composite robustness score gain on
AutoResearchClaw (Table 2).`,
                starterCode: `function relativeChangePct(baseline, improved) {
  // ((improved - baseline) / baseline) * 100, rounded to 1 decimal
  return 0;
}

function multiplier(baseline, improved) {
  // improved / baseline, rounded to 2 decimals
  return 0;
}`,
                solution: `function relativeChangePct(baseline, improved) {
  return Math.round(((improved - baseline) / baseline) * 1000) / 10;
}

function multiplier(baseline, improved) {
  return Math.round((improved / baseline) * 100) / 100;
}`,
                tests: `test('Kimi-K2.5 Part I accuracy, skills-only: 21.4 -> 28.3 is +32.2% relative', () => {
  assertEqual(relativeChangePct(21.4, 28.3), 32.2);
});
test('Kimi-K2.5 Part I completion, MetaClaw (Full): 2.0 -> 16.5 is an 8.25x multiplier', () => {
  assertEqual(multiplier(2.0, 16.5), 8.25);
});
test('Part II file-check completion: 18.2 -> 51.9 is roughly +185% relative', () => {
  assertEqual(relativeChangePct(18.2, 51.9), 185.2);
});
test('AutoResearchClaw composite robustness: 0.714 -> 0.845 is +18.3% relative', () => {
  assertEqual(relativeChangePct(0.714, 0.845), 18.3);
});`,
              },
            },
          ],
        },
        {
          id: 'mc-case-studies',
          title: 'When do skills suffice, and when do you need RL?',
          minutes: 11,
          xp: 60,
          steps: [
            {
              kind: 'scenario',
              title: 'Diagnosing a failure: skill fix or RL fix?',
              scenario: {
                intro:
                  'You\'re running MetaClaw in production. A failure comes in from MetaClaw-Bench. Your job is to decide whether skill-driven fast adaptation alone can fix it, or whether it needs the full pipeline (skills + opportunistic RL) — based on the two case studies in the paper\'s Table 3.',
                stages: [
                  {
                    situation:
                      'Case 1 (GPT-5.2): the task is to update sprint8_board.json, setting two tickets to "done". The baseline response reads the file and directly overwrites it — the checker flags a missing sprint8_board.json.bak backup file and scores it 0. After a failure-driven skill is distilled ("Always create .bak before modifying"), the agent writes the backup, applies a targeted patch, and the checker passes.',
                    question: 'What kind of failure was this, and was the fix proportional?',
                    options: [
                      {
                        label: 'A single discrete behavioral rule the model already knows how to execute once told — skill-driven adaptation alone is sufficient, no RL needed',
                        quality: 'best',
                        feedback:
                          'Exactly Case 1\'s point: the model could already write a backup file when instructed — it just didn\'t know the rule. One distilled skill, injected at zero weight-update cost, generalizes across file types and subsequent days.',
                      },
                      {
                        label: 'Trigger a full opportunistic RL fine-tune to teach the model to back up files',
                        quality: 'bad',
                        feedback:
                          'Overkill, and slower than the alternative. The model didn\'t lack the *capability* to write a backup file — it lacked the *instruction*. That\'s precisely the gap skill injection closes immediately, with zero downtime.',
                      },
                      {
                        label: 'Ignore it — a single missing backup file is not worth fixing',
                        quality: 'bad',
                        feedback:
                          'The paper treats this as a representative, generalizable failure: backup-before-modify recurs across many file-editing tasks. Distilling it once pays off on every subsequent day.',
                      },
                    ],
                  },
                  {
                    situation:
                      'Case 2 (Kimi-K2.5): the task is to append a deployment record with fields timestamp (ISO 8601 + timezone), env, status, and changes. The baseline uses field name "date" instead of "timestamp" and omits "changes" — score 0. After skill injection alone ("use ISO 8601 with timezone offset"), the model fixes the timestamp format but still omits the "changes" array — still score 0. Only after the opportunistic RL update does the agent produce all four fields correctly, scoring 1.0.',
                    question: 'Why didn\'t skill injection alone close this gap, and what does that imply about when RL is needed?',
                    options: [
                      {
                        label: 'Skills supplied the declarative format context (ISO 8601), but reliably executing the full, structurally complex output schema needed a weight-level update — skills tell the policy what to do, RL makes it actually do it consistently',
                        quality: 'best',
                        feedback:
                          'This is the paper\'s exact framing: "skills supply declarative format context; weight updates internalize the execution reliability that skill injection alone cannot enforce." Some failures are knowledge gaps (skill-fixable); some are execution-reliability gaps that need the policy itself to change.',
                      },
                      {
                        label: 'Keep injecting more skills about the "changes" field until it eventually works',
                        quality: 'bad',
                        feedback:
                          'The case study shows skills-only already plateaued — the model "knew" the timestamp rule but still dropped a required field. More prompt-level instructions don\'t fix an execution-reliability problem; only the RL update did.',
                      },
                      {
                        label: 'Conclude that MetaClaw doesn\'t work for Kimi-K2.5 and abandon adaptation for this model',
                        quality: 'bad',
                        feedback:
                          'The opposite is true — Kimi-K2.5 is exactly where MetaClaw (Full) showed its largest gains, going from 8.3% to 80.6% day accuracy once RL was added on top of skills.',
                      },
                    ],
                  },
                  {
                    situation:
                      'The paper\'s own stated limitation: "idle-window detection depends on user configuration, which may not generalize to all deployment environments." You\'re deploying MetaClaw for a team that runs agents in a shared cloud environment with no single user\'s sleep schedule, no individual calendar, and no keyboard/mouse to go idle.',
                    question: 'How should this change your rollout plan?',
                    options: [
                      {
                        label: 'Recognize that OMLS\'s three signals are tuned for a single-user personal-agent deployment, and design an equivalent idle proxy for this environment (e.g. request-queue depth, off-peak traffic windows) before relying on opportunistic RL',
                        quality: 'best',
                        feedback:
                          'This follows the paper\'s own caveat directly: OMLS\'s specific signals (sleep, OS inactivity, calendar) assume a personal agent with one user. A shared, headless deployment needs an analogous "is it safe to interrupt service" signal, not a literal port of sleep-hours/calendar logic.',
                      },
                      {
                        label: 'Deploy OMLS unchanged, since "idle" is idle regardless of environment',
                        quality: 'bad',
                        feedback:
                          'There is no individual sleep schedule, calendar, or keyboard to monitor in a shared headless deployment — the three signals as specified simply have no input to read, which is exactly the generalization gap the paper flags as a limitation.',
                      },
                      {
                        label: 'Skip opportunistic policy optimization entirely and run only skill-driven adaptation',
                        quality: 'ok',
                        feedback:
                          'Workable as a fallback — skills alone still deliver real gains per Table 2 — but it gives up the full pipeline\'s much larger improvements (e.g. the 8.25× completion-rate jump) that only weight updates unlock. Better to find a working idle proxy than abandon the RL loop outright.',
                      },
                    ],
                  },
                ],
                debrief:
                  'The two case studies map cleanly onto the paper\'s two mechanisms: failures that are pure missing-instruction gaps (Case 1) are skill-fixable with zero downtime; failures that need consistent, reliable execution of a structurally complex output (Case 2) need the weight-level RL update on top. And OMLS\'s specific idle signals are themselves a design choice tuned for personal-agent deployments — porting MetaClaw to a different deployment shape means re-deriving an equivalent "safe to interrupt" signal, not assuming the same three checks apply everywhere.',
              },
            },
          ],
        },
      ],
    },
  ],
}
