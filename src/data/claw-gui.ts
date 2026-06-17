import type { Subject } from '../types'
import motivationMd from './md/cg-motivation.md?raw'
import relatedWorkMd from './md/cg-related-work.md?raw'
import rlEnvironmentMd from './md/cg-rl-environment.md?raw'
import rlRewardMd from './md/cg-rl-reward.md?raw'
import evalPipelineMd from './md/cg-eval-pipeline.md?raw'
import agentDeploymentMd from './md/cg-agent-deployment.md?raw'
import agentEvalSkillMd from './md/cg-agent-eval-skill.md?raw'
import resultsMd from './md/cg-results.md?raw'
import critiqueMd from './md/cg-critique.md?raw'

export const clawGui: Subject = {
  id: 'claw-gui',
  title: 'ClawGUI',
  tagline:
    'A unified open-source framework that closes the gaps between training, evaluating, and deploying GUI agents.',
  icon: '📱',
  accent: '#fb923c',
  modules: [
    {
      id: 'cg-m1',
      title: 'Motivation & Landscape',
      description:
        'Tang, Lu, et al. (2026). Why a capable GUI agent is a full-stack engineering problem, not a modeling one — the three gaps in training, evaluation, and deployment that bottleneck the field, and where ClawGUI sits relative to prior grounding, RL, and benchmarking work.',
      lessons: [
        {
          id: 'cg-motivation',
          title: 'Why GUI agents need more than a better model',
          minutes: 10,
          xp: 60,
          steps: [
            { kind: 'read', title: 'GUIs as the universal interface', markdown: motivationMd },
            {
              kind: 'quiz',
              title: 'The three gaps',
              questions: [
                {
                  prompt:
                    'The paper argues that building a capable GUI agent is "not a single modeling problem but a full-stack engineering problem." What is the strongest evidence for this claim in the Introduction?',
                  options: [
                    'Grounding, navigation, and online RL have each improved in isolation, yet assembling them into a working pipeline still exposes cracks between them',
                    'GUI agents cannot use Tensor Cores efficiently',
                    'Vision-language models are too small to ground screen elements accurately',
                    'No GUI agent has ever achieved above 50% success rate on any benchmark',
                  ],
                  answer: 0,
                  explanation:
                    'The paper points out that grounding accuracy, navigation horizons, and RL-based policy quality have each individually improved, but the community still lacks a unified framework connecting training, evaluation, and deployment — and that absence, not a missing technique, is the bottleneck.',
                },
                {
                  prompt:
                    'According to the paper, what is the central engineering difficulty in the "training ecosystem is closed" gap — is it the RL algorithm itself?',
                  options: [
                    'Yes, existing RL algorithms cannot optimize sparse rewards at all',
                    'No — it is environment management: emulators drift unhealthy over long runs, real devices cannot expose system-level verification signals, and rewards are sparse by construction',
                    'Yes, GiGPO and GRPO are both fundamentally broken for GUI tasks',
                    'No — the difficulty is that no GPU can run GUI RL training at scale',
                  ],
                  answer: 1,
                  explanation:
                    'The paper is explicit that the bottleneck is not the RL algorithm but environment management — unstable emulators, real devices that cannot expose verification signals, and inherently sparse long-horizon rewards. This is why ClawGUI-RL is infrastructure, not a new algorithm.',
                },
                {
                  prompt:
                    'Why can a 2% improvement on ScreenSpot-Pro reported in one paper not be trusted as a genuine advance, per the lesson?',
                  options: [
                    'ScreenSpot-Pro does not actually exist as a benchmark',
                    'Prompt formatting, coordinate normalization, image resolution, and sampling configuration are often undocumented and each can shift accuracy by several points',
                    'The benchmark only supports one specific model architecture',
                    'All GUI benchmarks report success rate identically, so 2% is always meaningful',
                  ],
                  answer: 1,
                  explanation:
                    'The evaluation gap is about undocumented configuration choices — prompt format, coordinate normalization, resolution, sampling — each capable of moving the score by several points, with no way for a reader to know which factor produced a reported gain.',
                },
                {
                  prompt:
                    'Why is "the deployment loop is broken" described as a systems problem rather than something a better model would fix?',
                  options: [
                    'Because CLI-based agent harnesses give precise control over a narrow slice of apps, but nothing in the open ecosystem connects a trained policy to real hardware, real chat interfaces, and persistent personalization over time',
                    'Because no GUI agent model has ever exceeded human-level accuracy',
                    'Because mobile devices lack the compute to run any GUI agent',
                    'Because users do not want to use GUI agents under any circumstances',
                  ],
                  answer: 0,
                  explanation:
                    'The gap is about missing plumbing between a trained policy and an end user: device connectivity, interface delivery (chat platforms), and persistent personalization. None of that is solved by improving the underlying model.',
                },
                {
                  prompt:
                    "ClawGUI's headline validation result is that ClawGUI-2B reaches what Success Rate on MobileWorld GUI-Only, and against what same-scale baseline?",
                  options: [
                    '17.1% vs. 11.1% for the same-scale MAI-UI-2B baseline',
                    '95.8% vs. 72% for UI-TARS-2',
                    '50% vs. 30% for SeeClick',
                    '6.0% vs. 2.6% for GiGPO',
                  ],
                  answer: 0,
                  explanation:
                    'ClawGUI-2B, trained end to end inside the ClawGUI-RL pipeline, achieves 17.1% Success Rate on MobileWorld GUI-Only versus 11.1% for the same-scale MAI-UI-2B baseline — a 6.0-point absolute gain attributed to the pipeline, not extra model scale.',
                },
              ],
            },
          ],
        },
        {
          id: 'cg-related-work',
          title: 'Where ClawGUI sits in the GUI-agent landscape',
          minutes: 10,
          xp: 60,
          steps: [
            { kind: 'read', title: 'Models, RL recipes, and the benchmarking crisis', markdown: relatedWorkMd },
            {
              kind: 'quiz',
              title: 'Positioning ClawGUI',
              questions: [
                {
                  prompt:
                    'Why does the lesson describe ClawGUI as "orthogonal" to models like SeeClick, UI-TARS, Aguvis, and UGround, rather than a competitor to them?',
                  options: [
                    'Because ClawGUI does not propose a new grounding or navigation model — it provides the shared harness in which both modular and end-to-end grounding paradigms can be trained, evaluated, and deployed',
                    'Because ClawGUI only works with closed-source planners',
                    'Because those models are all deprecated and no longer used',
                    'Because ClawGUI replaces grounding entirely with rule-based heuristics',
                  ],
                  answer: 0,
                  explanation:
                    'ClawGUI sits on a different axis from the modeling work: rather than improving grounding/navigation accuracy itself, it supplies the infrastructure that lets any grounding paradigm be trained, evaluated, and deployed under consistent conditions.',
                },
                {
                  prompt:
                    'MobileGUI-RL, ComputerRL, MAI-UI, UI-Venus-1.5, and UI-TARS-2 all show that sandbox-based online RL beats supervised fine-tuning. What common limitation across all of them does ClawGUI-RL target?',
                  options: [
                    'None of them open-source their training infrastructure, and all are validated only in virtual sandboxes — real-device training is unexplored',
                    'They all require more than 100 GPUs to reproduce',
                    'They all use the exact same reward function, which is provably suboptimal',
                    'They all report worse results than supervised fine-tuning',
                  ],
                  answer: 0,
                  explanation:
                    'The paper is specific: despite consistent gains from online RL across this whole line of work, none of it is open-sourced and none of it is validated on real physical devices — exactly the two things ClawGUI-RL releases.',
                },
                {
                  prompt:
                    'Why can two papers report different accuracy numbers on the same benchmark (e.g. ScreenSpot-Pro) without either being wrong?',
                  options: [
                    'Because benchmarks are randomly re-scored each time they are run',
                    'Because prompt formatting, coordinate normalization, image resolution, and sampling configuration are often undocumented choices that independently shift the reported score by several points',
                    'Because GUI benchmarks have no ground truth at all',
                    'Because every benchmark uses a different programming language',
                  ],
                  answer: 1,
                  explanation:
                    'The benchmarking crisis is about configuration, not correctness — undocumented choices in prompt format, coordinate normalization, resolution, and sampling can each move the number, so two honestly-reported scores can differ for reasons having nothing to do with model quality.',
                },
                {
                  prompt:
                    'What distinguishes ClawGUI-Eval from prior GUI benchmark standardization efforts, according to the lesson?',
                  options: [
                    'It decouples evaluation into standardized inference, judging, and metric computation, pins all configuration choices per model, and releases inference outputs across 6 benchmarks and 11+ models',
                    'It introduces an entirely new benchmark that no other paper uses',
                    'It only standardizes the training recipe, not evaluation',
                    'It removes the need for any human-defined success criteria',
                  ],
                  answer: 0,
                  explanation:
                    'Prior efforts each had a partial fix — one benchmark only, bundled with one training recipe, or scripts without predictions. ClawGUI-Eval pins configuration per model and releases the actual inference outputs, enabling independent re-judging without re-running inference.',
                },
                {
                  prompt:
                    'What is the single pattern that recurs across all three related-work sections (models, RL, benchmarking) that motivates ClawGUI as a whole?',
                  options: [
                    'In each area, capable techniques exist but the shared infrastructure to train, evaluate, or compare them consistently is missing or unreleased — ClawGUI supplies that missing layer rather than a new point on the modeling axis',
                    'In each area, the existing techniques are fundamentally flawed and need to be replaced',
                    'In each area, GPUs are the limiting resource',
                    'In each area, the solution is to collect more human-labeled data',
                  ],
                  answer: 0,
                  explanation:
                    "This is the throughline: grounding models, RL recipes, and benchmarks are each individually fine — what's missing every time is the open, consistent infrastructure underneath them. ClawGUI's contribution is that shared layer, repeated across all three areas.",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'cg-m2',
      title: 'ClawGUI-RL: Scalable Online RL Training',
      description:
        'Section 3.2. Why environment management — not the RL algorithm — is the hard engineering problem; the binary + dense (PRM) reward formulation; and how GiGPO\'s hierarchical advantage fixes GRPO\'s flat per-trajectory credit assignment.',
      lessons: [
        {
          id: 'cg-rl-environment',
          title: 'Training a GUI agent means managing a fleet of flaky devices',
          minutes: 11,
          xp: 65,
          steps: [
            {
              kind: 'read',
              title: 'The Environment Manager: keeping a fleet of Androids alive',
              markdown: rlEnvironmentMd,
            },
            {
              kind: 'quiz',
              title: 'Why environments are the hard part',
              questions: [
                {
                  prompt:
                    'Why is real-device training fundamentally harder to evaluate than virtual-environment training, according to ClawGUI-RL?',
                  options: [
                    'Real devices run a different operating system entirely',
                    'Real devices have slower screens, making screenshots unreliable',
                    'Real devices expose no root access, so there is no system-level state to inspect — evaluation must rely entirely on an MLLM-as-judge',
                    'Real devices cannot run the agent loop at all',
                  ],
                  answer: 2,
                  explanation:
                    'Virtual environments give you root access, so you can directly inspect app state and database records as a ground-truth check, in addition to an MLLM-as-judge. Real devices have no such access, so the MLLM-as-judge is the entire reward signal — there is no fallback if it is wrong.',
                },
                {
                  prompt: 'What problem does Spare Server Rotation solve?',
                  options: [
                    'It speeds up task resets by caching task definitions',
                    'It swaps an unhealthy/stalled/crashed container for a healthy one from a standby queue, so the affected task can resume without halting the whole training run',
                    'It rotates which GPU runs the RL trainer',
                    'It randomizes which emulator each task is assigned to, for diversity',
                  ],
                  answer: 1,
                  explanation:
                    'Long training runs cause containers to become unhealthy. Rather than let one bad container stall or corrupt the run, ClawGUI-RL keeps a queue of spare healthy containers and rotates one in the moment a problem is detected — the task resumes, training continues uninterrupted.',
                },
                {
                  prompt:
                    'In the four-stage environment lifecycle, what happens during Task Evaluation for a VIRTUAL environment specifically?',
                  options: [
                    'Only an MLLM-as-judge is used, identical to real devices',
                    'System-level inspection of app state/database records is combined with an MLLM-as-judge assessing the final screen against the task instruction',
                    'The container is torn down and rebuilt',
                    'A human reviewer manually checks the result',
                  ],
                  answer: 1,
                  explanation:
                    'Virtual environments have root access, so ClawGUI-RL gets a system-level signal (direct inspection of app state and database records) plus an MLLM-as-judge cross-check — giving a more robust, comprehensive reward than either alone. Real devices only get the MLLM-as-judge half of this.',
                },
                {
                  prompt: 'Why does ClawGUI-RL periodically tear down and restart containers even when nothing appears broken?',
                  options: [
                    'To save on cloud compute costs',
                    'To prevent slow state accumulation from degrading environment fidelity over long training runs',
                    'Because the RL trainer requires a fixed number of containers',
                    'To force task diversity',
                  ],
                  answer: 1,
                  explanation:
                    'Even healthy-looking containers can accumulate subtle state drift over a long run. Periodic teardown resets that drift, keeping the environment fidelity consistent — a maintenance step distinct from the reactive Spare Server Rotation, which only triggers on detected unhealthiness.',
                },
              ],
            },
          ],
        },
        {
          id: 'cg-rl-reward',
          title: 'Sparse rewards starve long-horizon GUI policies — fix the credit, not just the signal',
          minutes: 13,
          xp: 70,
          steps: [
            {
              kind: 'read',
              title: 'Dense rewards and hierarchical credit assignment',
              markdown: rlRewardMd,
            },
            {
              kind: 'code',
              title: 'Implement GiGPO-style hierarchical advantage',
              challenge: {
                prompt: `## Hierarchical (macro + micro) advantage, GiGPO-style

Section 3.2.3 describes GiGPO's two-level advantage: a **macro** (episode-level) relative advantage normalized across a group of rollouts on the same task, and a **micro** (step-level) relative advantage computed within sub-groups of steps that share the same intermediate **state id** across rollouts (anchor-state grouping).

Implement \`gigpoAdvantages(rollouts)\`.

\`rollouts\` is an array of rollouts. Each rollout is an array of steps: \`{ reward: number, stateId: string }\`. Assume a discount factor of 1 (plain sum, no decay) for the "return from here" used at the step level.

Your function must return an array (one entry per rollout) of arrays (one entry per step) of numbers: the **per-step combined advantage** (macro + micro), in the same order as the input.

Steps:

1. **Macro advantage (per rollout).** For each rollout, compute its total return (sum of all step rewards). Normalize across the group: \`(rolloutReturn - groupMean) / groupStd\`. Every step within that rollout gets this same macro value. If \`groupStd\` is 0, macro advantage is 0 for every rollout.
2. **Micro advantage (per step).** For every step, compute its "return-from-here": the sum of rewards from that step to the end of its own rollout (inclusive). Group steps **by stateId** across all rollouts. Within each state-id group, normalize each step's return-from-here against that group's mean/std: \`(returnFromHere - subGroupMean) / subGroupStd\`. If a state-id group has only one step, or its std is 0, that step's micro advantage is 0.
3. **Combined.** Each step's final value is \`macroAdvantage + microAdvantage\` for the rollout/step it belongs to.

Use population standard deviation (divide by N, not N-1).`,
                starterCode: `function gigpoAdvantages(rollouts) {
  // TODO: compute macro (episode-level) advantage per rollout
  // TODO: compute micro (step-level) advantage per state-id group
  // TODO: return macro + micro per step, same shape as input
  return rollouts.map(r => r.map(() => 0));
}`,
                solution: `function stdDev(values) {
  const n = values.length;
  if (n === 0) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / n;
  const variance = values.reduce((a, b) => a + (b - mean) * (b - mean), 0) / n;
  return Math.sqrt(variance);
}

function gigpoAdvantages(rollouts) {
  // 1. Macro advantage per rollout
  const totals = rollouts.map(r => r.reduce((a, s) => a + s.reward, 0));
  const macroMean = totals.reduce((a, b) => a + b, 0) / totals.length;
  const macroStd = stdDev(totals);
  const macroAdv = totals.map(t => (macroStd === 0 ? 0 : (t - macroMean) / macroStd));

  // 2. Return-from-here per step
  const returnsFromHere = rollouts.map(r => {
    const out = new Array(r.length);
    let acc = 0;
    for (let i = r.length - 1; i >= 0; i--) {
      acc += r[i].reward;
      out[i] = acc;
    }
    return out;
  });

  // 3. Group by stateId across rollouts
  const groups = {};
  rollouts.forEach((r, ri) => {
    r.forEach((step, si) => {
      if (!groups[step.stateId]) groups[step.stateId] = [];
      groups[step.stateId].push({ ri, si, value: returnsFromHere[ri][si] });
    });
  });

  const microAdv = rollouts.map(r => r.map(() => 0));
  Object.values(groups).forEach(entries => {
    const values = entries.map(e => e.value);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const std = stdDev(values);
    entries.forEach(e => {
      microAdv[e.ri][e.si] = (entries.length <= 1 || std === 0) ? 0 : (e.value - mean) / std;
    });
  });

  // 4. Combine
  return rollouts.map((r, ri) => r.map((_, si) => macroAdv[ri] + microAdv[ri][si]));
}`,
                tests: `test('two rollouts, same task, different lengths: macro advantage favors the higher-return rollout uniformly', () => {
  const rollouts = [
    [ { reward: 0, stateId: 's0' }, { reward: 0, stateId: 's1' }, { reward: 1, stateId: 's2' } ],
    [ { reward: 0, stateId: 's0' }, { reward: 0, stateId: 's1' }, { reward: 0, stateId: 's3' } ],
  ];
  const result = gigpoAdvantages(rollouts);
  // rollout returns: 1 and 0 -> mean 0.5, std 0.5 -> macro: +1 and -1
  assertEqual(result[0][2] > result[1][2], true, 'rollout A (success) should score higher than rollout B (failure) on its final step');
});

test('anchor-state grouping gives matching states different advantages when their futures differ', () => {
  const rollouts = [
    [ { reward: 0, stateId: 's0' }, { reward: 0, stateId: 's1' }, { reward: 1, stateId: 's2' } ],
    [ { reward: 0, stateId: 's0' }, { reward: 0, stateId: 's1' }, { reward: 0, stateId: 's3' } ],
  ];
  const result = gigpoAdvantages(rollouts);
  // at s0, rollout A's return-from-here (1) > rollout B's (0) -> A's step-0 advantage > B's step-0 advantage
  assertEqual(result[0][0] > result[1][0], true, 'state s0 in the successful rollout should get a higher combined advantage than s0 in the failed rollout');
});

test('a state id that only appears once gets zero micro advantage (only macro contributes)', () => {
  const rollouts = [
    [ { reward: 0, stateId: 's0' }, { reward: 1, stateId: 'unique-a' } ],
    [ { reward: 0, stateId: 's0' }, { reward: 0, stateId: 'unique-b' } ],
  ];
  const result = gigpoAdvantages(rollouts);
  const totals = [1, 0];
  const mean = 0.5, std = 0.5;
  const macroA = (totals[0] - mean) / std; // 1
  const macroB = (totals[1] - mean) / std; // -1
  assertEqual(result[0][1], macroA, 'unique-state step in rollout A should equal macro advantage only');
  assertEqual(result[1][1], macroB, 'unique-state step in rollout B should equal macro advantage only');
});

test('identical-return rollouts produce zero macro advantage (std is 0)', () => {
  const rollouts = [
    [ { reward: 1, stateId: 'a' } ],
    [ { reward: 1, stateId: 'b' } ],
  ];
  const result = gigpoAdvantages(rollouts);
  assertEqual(result[0][0], 0, 'equal totals -> zero std -> zero macro advantage');
  assertEqual(result[1][0], 0, 'equal totals -> zero std -> zero macro advantage');
});

test('three rollouts sharing an anchor state: the one with the best continuation from that state scores highest there', () => {
  const rollouts = [
    [ { reward: 0, stateId: 'shared' }, { reward: 1, stateId: 'x1' } ],
    [ { reward: 0, stateId: 'shared' }, { reward: 0, stateId: 'x2' } ],
    [ { reward: 0, stateId: 'shared' }, { reward: 1, stateId: 'x3' } ],
  ];
  const result = gigpoAdvantages(rollouts);
  // rollout 1 (index 1) has the worst continuation (0) from 'shared' among the three
  assertEqual(result[1][0] <= result[0][0], true, 'rollout with the worse continuation from the shared state should not score higher than a better one');
  assertEqual(result[1][0] <= result[2][0], true, 'rollout with the worse continuation from the shared state should not score higher than a better one');
});`,
              },
            },
            {
              kind: 'quiz',
              title: 'Dense reward and credit assignment',
              questions: [
                {
                  prompt:
                    'Why does a binary outcome reward alone give "little guidance for intermediate steps" in a long-horizon GUI task?',
                  options: [
                    'Binary rewards are mathematically incompatible with RL',
                    'Execution latency and many sequential steps create a long delay between an action and its consequence, so a single end-of-episode signal cannot tell which of the many actions actually mattered',
                    'Binary rewards are too large in magnitude for the optimizer',
                    'GUI tasks never succeed, so the reward is always 0',
                  ],
                  answer: 1,
                  explanation:
                    'With a 1/0 signal arriving only at episode end, every intermediate action shares the same fate regardless of whether it helped or hurt — the paper calls this "an extremely sparse reward signal." The PRM exists specifically to fill that gap with per-step feedback.',
                },
                {
                  prompt:
                    'Two rollouts both succeed on the same task: rollout A in 4 steps, rollout B in 8 steps. Under plain GRPO, what credit does each step receive?',
                  options: [
                    'A’s steps get higher credit than B’s, since A was more efficient',
                    'The same uniform episode-level advantage on every step in both trajectories, since GRPO normalizes only at the episode level — it cannot distinguish efficient steps from redundant ones',
                    'B’s steps get higher credit, since it has more data points',
                    'Neither rollout receives any credit because both succeeded',
                  ],
                  answer: 1,
                  explanation:
                    'GRPO assigns one advantage value per whole trajectory and applies it uniformly to every step in that trajectory. Since both trajectories succeeded, they get the same trajectory-level reward and thus the same per-step advantage — GRPO has no mechanism to penalize B’s 4 redundant steps.',
                },
                {
                  prompt: 'What does the Process Reward Model (PRM) actually look at to score a single action?',
                  options: [
                    'Only the final screenshot of the episode',
                    'The previous screenshot, the current screenshot, and the full history of actions taken so far',
                    'The total training time elapsed',
                    'A hand-written rule list of valid UI actions',
                  ],
                  answer: 1,
                  explanation:
                    'After each action, the PRM receives the before/after screenshots plus the action history so far and judges whether that specific action meaningfully contributed to task completion — producing the dense R_step combined with R_outcome in R = R_outcome + R_step.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'cg-m3',
      title: 'ClawGUI-Eval: Reproducible GUI Evaluation',
      description:
        'Section 3.3. Why GUI benchmark numbers are rarely comparable across papers, and how pinning every evaluation choice plus decoupling Infer → Judge → Metric gets ClawGUI-Eval to a 95.8% reproduction rate.',
      lessons: [
        {
          id: 'cg-eval-pipeline',
          title: 'Why a 2% improvement on a GUI benchmark might mean nothing',
          minutes: 11,
          xp: 60,
          steps: [
            {
              kind: 'read',
              title: 'The reproducibility crisis, and the Infer → Judge → Metric fix',
              markdown: evalPipelineMd,
            },
            {
              kind: 'quiz',
              title: 'Pinning, judging, and decoupling',
              questions: [
                {
                  prompt:
                    'Section 3.3 says prompt ordering, coordinate normalization, image resolution, and sampling temperature can shift reported accuracy by "several points" between implementations. Why does this matter for comparing two papers’ benchmark numbers?',
                  options: [
                    'It doesn’t matter — accuracy differences always reflect real model quality',
                    'A several-point gap could be entirely explained by different formatting/sampling choices rather than a genuine model improvement, making cross-paper comparisons unreliable',
                    'It only affects training speed, not evaluation accuracy',
                    'It means benchmarks should be made harder to compensate',
                  ],
                  answer: 1,
                  explanation:
                    'If formatting and sampling choices alone can move accuracy by several points, then a reported "improvement" of a similar size tells you nothing about whether the model actually got better. That is exactly the gap ClawGUI-Eval is built to close by pinning these choices per model.',
                },
                {
                  prompt:
                    'ClawGUI-Eval’s first fix, before any pipeline restructuring, is to "pin all evaluation choices per model." What does pinning actually buy you?',
                  options: [
                    'Faster inference on GPUs',
                    'A guarantee that the model’s reported score is the highest possible score it could achieve',
                    'A fixed, known configuration (resolution, prompt order, temperature, etc.) so that accuracy differences reflect the model, not silently varying eval settings',
                    'Automatic translation between benchmark formats',
                  ],
                  answer: 2,
                  explanation:
                    'Pinning removes the hidden variable. Once resolution, prompt ordering, normalization, and temperature are fixed per model and documented, a score difference between runs is attributable to the model rather than to an undocumented configuration change.',
                },
                {
                  prompt:
                    'Why does ClawGUI-Eval use a point-in-box judge for standard grounding benchmarks but a polygon + refusal-aware judge for OSWorld-G, instead of one universal judge?',
                  options: [
                    'Because polygon judging is always more accurate than point-in-box, so it should be used everywhere',
                    'Because what counts as "correct" depends on the benchmark’s answer format — irregular target shapes and valid refusals need different logic than a simple point landing in a box',
                    'Because AndroidControl and OSWorld-G use different programming languages',
                    'There is no real difference; the judges are interchangeable',
                  ],
                  answer: 1,
                  explanation:
                    'A point-in-box judge assumes a target is a simple bounding box and a point either lands inside it or not. OSWorld-G allows irregular polygon targets and lets a model legitimately refuse a task, which has to be scored as a distinct outcome rather than as a wrong click. AndroidControl needs a multi-action judge because success can depend on a sequence of actions. One judge cannot capture all three notions of "correct."',
                },
                {
                  prompt:
                    'Suppose a team discovers a bug in the polygon-matching logic used by the OSWorld-G judge, after inference has already been run across 11+ models. Because Infer, Judge, and Metric are decoupled stages, what do they need to redo?',
                  options: [
                    'Everything — Infer, Judge, and Metric must all be rerun from scratch',
                    'Only the Judge stage (re-judge the existing raw predictions with the fixed logic), without rerunning the expensive Infer stage',
                    'Only the Infer stage, since predictions caused the bug',
                    'Nothing — bugs in the Judge stage do not affect final results',
                  ],
                  answer: 1,
                  explanation:
                    'This is exactly the operational benefit of decoupling described in the lesson: raw predictions from Infer are a stable artifact. Re-judging with a fixed parser only requires rerunning the Judge (and then Metric) stage on those existing predictions — the expensive GPU inference never has to be repeated.',
                },
                {
                  prompt:
                    'The Metric stage aggregates per-sample correctness labels into more than a single top-line accuracy number. What does it additionally provide, and why does that matter?',
                  options: [
                    'Only a pass/fail count, because breakdowns add noise',
                    'Breakdowns by platform, UI element type, and task category — revealing where a model is strong or weak instead of hiding that variance in one blended percentage',
                    'A leaderboard ranking models against each other, with no per-sample detail',
                    'A re-run of the Infer stage to double-check predictions',
                  ],
                  answer: 1,
                  explanation:
                    'A single blended accuracy number can hide large differences — a model might be excellent on desktop UI elements but weak on mobile navigation, for instance. The platform/element-type/task-category breakdown surfaces that variance for fine-grained analysis instead of collapsing it into one score.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'cg-m4',
      title: 'ClawGUI-Agent: Personal GUI Assistant',
      description:
        'Section 3.4. Closing the loop from a trained policy to a real user: hybrid CLI-GUI control, persistent personalized memory, remote/local deployment, and exposing ClawGUI-Eval itself as a one-command skill.',
      lessons: [
        {
          id: 'cg-agent-deployment',
          title: 'A trained policy that nobody can use is a paper result, not a product',
          minutes: 11,
          xp: 60,
          steps: [
            { kind: 'read', title: 'Closing the loop to real users', markdown: agentDeploymentMd },
            {
              kind: 'quiz',
              title: 'Hybrid control and personalized memory',
              questions: [
                {
                  prompt:
                    'The paper states "neither paradigm alone is sufficient" when comparing CLI and GUI control. What is the core limitation of CLI-only control?',
                  options: [
                    'CLI is too slow for any real task',
                    'Not all applications expose programmatic interfaces, and CLI actions are opaque to users who cannot observe or intervene',
                    'CLI cannot be combined with an LLM',
                    'CLI control requires more GPU memory than GUI control',
                  ],
                  answer: 1,
                  explanation:
                    'CLI is precise and efficient where it works, but many apps have no programmatic interface, and CLI actions bypass the visual layer that makes agent behavior interpretable to the user. That is why ClawGUI-Agent falls back to GUI rather than relying on CLI alone.',
                },
                {
                  prompt:
                    'ClawGUI-Agent’s personalized memory system stores extracted facts as vector embeddings and retrieves the top-k most similar ones per task. What keeps this store from growing unbounded over time?',
                  options: [
                    'It deletes memories older than 30 days',
                    'It caps the total number of stored facts at a fixed limit',
                    'Duplicate memories are detected and merged rather than accumulated',
                    'It only stores memories for premium users',
                  ],
                  answer: 2,
                  explanation:
                    'The paper specifies that duplicate memories are detected and merged rather than accumulated, which keeps the memory store lean and relevant instead of growing into an ever-expanding log.',
                },
                {
                  prompt:
                    'What distinguishes ClawGUI-Agent’s "remote control" mode from "local control" mode?',
                  options: [
                    'Remote control uses a different LLM than local control',
                    'Remote control issues tasks from a separate device over a chat platform to control a target phone; local control runs the agent directly on the same phone where the chat app lives, with no extra hardware or cloud relay',
                    'Local control only works offline, remote control requires Wi-Fi',
                    'Remote control is for Android, local control is for iOS',
                  ],
                  answer: 1,
                  explanation:
                    'In remote mode, a user on one device (e.g. a laptop in a chat app) controls a separate target phone via 12+ supported chat platforms. In local mode, the agent takes over the very phone the chat app is running on — no extra hardware or cloud relay needed.',
                },
              ],
            },
          ],
        },
        {
          id: 'cg-agent-eval-skill',
          title: 'Closing the loop: evaluation becomes a one-line command',
          minutes: 9,
          xp: 55,
          steps: [
            { kind: 'read', title: 'ClawGUI-Eval as a deployable skill', markdown: agentEvalSkillMd },
            {
              kind: 'scenario',
              title: 'Choosing a control strategy and diagnosing memory',
              scenario: {
                intro:
                  'You are responsible for deploying GUI agents built on ClawGUI-Agent’s architecture for two different real-world situations. Apply what this module taught about hybrid CLI-GUI control and the personalized memory system — don’t reach for the first answer that sounds simplest.',
                stages: [
                  {
                    situation:
                      'You’re deploying a GUI agent for a banking app. The app exposes no public API, and every flow (transfers, balance checks, login) is security-sensitive — the bank’s compliance team wants any agent action to be visually verifiable, the way a human auditor would review it.',
                    question: 'CLI-only, GUI-only, or hybrid — which control strategy fits, and why?',
                    options: [
                      {
                        label:
                          'GUI-first (or hybrid that effectively becomes GUI-only here), since there is no API and behavior must stay visually verifiable',
                        quality: 'best',
                        feedback:
                          'Right. With no programmatic interface to call, CLI is not even an option — there is nothing to invoke. And the compliance requirement (visually verifiable actions) is exactly what GUI preserves and CLI would bypass. The hybrid policy degrades gracefully to "use GUI where CLI cannot apply," which is precisely this case.',
                      },
                      {
                        label: 'CLI-only, since CLI is more precise and efficient for sensitive operations',
                        quality: 'bad',
                        feedback:
                          'CLI requires a programmatic interface to call — the banking app does not expose one, so CLI-only is not just suboptimal, it is impossible. It would also fail the compliance requirement, since CLI actions are opaque to a human reviewer.',
                      },
                      {
                        label:
                          'Hybrid, but default to CLI whenever any internal API can be found, even undocumented ones, to save steps',
                        quality: 'ok',
                        feedback:
                          'Using an undocumented internal API would save steps, but it directly conflicts with the stated compliance need for visually verifiable behavior — an opaque CLI call defeats that purpose even if it technically works. GUI’s interpretability is the more important property here.',
                      },
                    ],
                  },
                  {
                    situation:
                      'A user complains that after about 50 sessions, the agent "forgot" their preferred food delivery app and keeps defaulting to a different one. The team’s first instinct is to wipe the user’s memory store and have them retrain the agent from scratch.',
                    question: 'Given how ClawGUI-Agent’s memory system actually works, what is the more likely fix?',
                    options: [
                      {
                        label:
                          'Check whether duplicate-merging is suppressing or diluting that fact, or whether the top-k retrieval window is too small to surface it',
                        quality: 'best',
                        feedback:
                          'This matches the mechanism: facts are deduplicated/merged over time, and only the top-k most semantically similar memories are retrieved and injected per task. If merging logic is overwriting the preference with a less specific fact, or k is too small to surface it among other competing memories, the fix is tuning retrieval/merge behavior — not discarding the whole store.',
                      },
                      {
                        label: 'Wipe the memory store entirely and have the user start over',
                        quality: 'bad',
                        feedback:
                          'This throws away every other correctly learned fact (contacts, habits, other app preferences) to fix one retrieval issue. The memory system is designed to merge and retrieve selectively — a full wipe is the most destructive possible response to what is likely a top-k or merge-logic tuning problem.',
                      },
                      {
                        label:
                          'Assume it is unfixable — vector-embedding memory inherently cannot hold preferences past a session or two',
                        quality: 'bad',
                        feedback:
                          'Nothing in the design implies a short shelf life — the system is explicitly built to retrieve relevant memories "over time." A forgotten fact after 50 sessions points to a retrieval/merge bug or tuning issue, not an inherent limitation of the approach.',
                      },
                    ],
                  },
                ],
                debrief:
                  'Two design principles carry this module: (1) hybrid control is not "pick CLI or GUI" — it is "use CLI where an interface exists, and GUI everywhere else," which degrades cleanly to GUI-only when no API exists and transparency matters. (2) Personalized memory is structured, deduplicated, and retrieved by top-k semantic similarity — when it seems to "forget," the fix is almost always in the merge/retrieval logic, not a full reset.',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'cg-m5',
      title: 'Experiments, Discussion & Conclusion',
      description:
        'Sections 4-6. What the headline numbers actually show, why dense reward beats binary, why two comparisons that both end at 17.1% SR have different relative gains, and the four open problems the paper admits it hasn\'t solved.',
      lessons: [
        {
          id: 'cg-results',
          title: 'Does the infrastructure buy you anything?',
          minutes: 13,
          xp: 70,
          steps: [
            {
              kind: 'read',
              title: 'Three headline findings, two ablations, one trust check',
              markdown: resultsMd,
            },
            {
              kind: 'code',
              title: "Verify the paper's own gain claims",
              challenge: {
                prompt: `## Implement \`relativeGain(before, after)\`

The paper reports two different improvements as percentages, and you should be able to recompute both from the raw Success Rate numbers in Tables 1 and 2.

Implement a function \`relativeGain(before, after)\` that returns an object \`{ absolute: number, relativePercent: number }\` where:

- \`absolute\` is \`after - before\`, rounded to 1 decimal place.
- \`relativePercent\` is \`(after - before) / before * 100\`, rounded to 1 decimal place.

Then use it to sanity-check the paper:

- The dense-reward ablation (§4.3, Table 2): GRPO 14.5% SR → GiGPO 17.1% SR. The paper states this is "a 2.6% improvement... a relative gain of 17.9%."
- The infrastructure comparison (§4.2, Table 1 / §6 Conclusion): MAI-UI-2B 11.1% SR → ClawGUI-2B 17.1% SR. Section 4.2 oddly calls this a "relative margin of 6.0%" right after stating both numbers — but 6.0 is actually the **absolute** point gap (17.1 - 11.1 = 6.0). The Conclusion correctly states the **relative** margin is "54%". Your function should reproduce both the 2.6 / 17.9% pair and the 6.0 / ~54% pair, confirming the Conclusion's framing is the internally consistent one.

Round \`relativePercent\` to 1 decimal place (e.g. \`17.9\`, not \`17.93103...\`).`,
                starterCode: `function relativeGain(before, after) {
  // TODO: return { absolute, relativePercent }, both rounded to 1 decimal place
  return { absolute: 0, relativePercent: 0 };
}`,
                solution: `function relativeGain(before, after) {
  const absolute = Math.round((after - before) * 10) / 10;
  const relativePercent = Math.round(((after - before) / before) * 100 * 10) / 10;
  return { absolute, relativePercent };
}`,
                tests: `test('GiGPO vs GRPO (14.5 -> 17.1): matches the paper\\'s 2.6 absolute', () => {
  const result = relativeGain(14.5, 17.1);
  assertEqual(result.absolute, 2.6);
});
test('GiGPO vs GRPO (14.5 -> 17.1): matches the paper\\'s 17.9% relative gain', () => {
  const result = relativeGain(14.5, 17.1);
  assertEqual(result.relativePercent, 17.9);
});
test('ClawGUI-2B vs MAI-UI-2B (11.1 -> 17.1): absolute gap is 6.0 points', () => {
  const result = relativeGain(11.1, 17.1);
  assertEqual(result.absolute, 6.0);
});
test('ClawGUI-2B vs MAI-UI-2B (11.1 -> 17.1): relative gain is ~54%, matching the Conclusion (not the mislabeled 6.0% in S4.2)', () => {
  const result = relativeGain(11.1, 17.1);
  assertEqual(result.relativePercent, 54.1);
});
test('the two comparisons are not the same despite both involving 17.1', () => {
  const denseReward = relativeGain(14.5, 17.1);
  const infrastructure = relativeGain(11.1, 17.1);
  assertEqual(denseReward.relativePercent === infrastructure.relativePercent, false);
});`,
              },
            },
          ],
        },
        {
          id: 'cg-critique',
          title: 'Where ClawGUI admits the gaps',
          minutes: 11,
          xp: 60,
          steps: [
            {
              kind: 'read',
              title: "Four open problems, in the paper's own words",
              markdown: critiqueMd,
            },
            {
              kind: 'scenario',
              title: 'Picking the right future direction',
              scenario: {
                intro:
                  "Section 5 lays out four directions ClawGUI says are unsolved. Each scenario below is a situation where exactly one of those directions actually applies — the others sound plausible but don't address the real constraint.",
                stages: [
                  {
                    situation:
                      'You want to RL-train a GUI agent on a banking app. You cannot get real user credentials to drive an emulator, and you cannot risk real-money actions on a physical device.',
                    question: "Which of the paper's future directions fits this constraint, and why?",
                    options: [
                      {
                        label: 'Code-generated mock apps that mirror real interaction flows without real credentials',
                        quality: 'best',
                        feedback:
                          'Right. The paper specifically calls out mock applications reconstructed by code-generation models as offering "an authentication-free distribution that mirrors real interaction flows without real user credentials" — exactly the missing piece here.',
                      },
                      {
                        label: 'On-device RL with privacy-preserving trajectory collection',
                        quality: 'bad',
                        feedback:
                          "On-device RL solves a different problem — tapping the long tail of real user interaction without centralizing data. It still requires a real device running the real banking app with real credentials; it doesn't remove the credential or real-money risk.",
                      },
                      {
                        label: 'Just use a larger emulator fleet and accept the drift from real app behavior',
                        quality: 'bad',
                        feedback:
                          "More emulators don't solve the credential problem — you still can't get real banking credentials into a sandbox, and emulator drift from real app behavior is precisely the limitation the paper is trying to escape.",
                      },
                    ],
                  },
                  {
                    situation:
                      'Your deployed agent is about to tap "Submit" on a money-transfer screen. The action is irreversible once committed, and the agent has no way to know that in advance — it only finds out after the screen changes.',
                    question: "What capability is missing today, per the paper's own discussion?",
                    options: [
                      {
                        label: 'A GUI-specific world model that predicts how the screen will evolve before committing to an action',
                        quality: 'best',
                        feedback:
                          'Exactly the gap §5 names: "Today\'s GUI agents act reactively: observe a screenshot, predict an action, wait for environment feedback." A world model would let the agent simulate the consequence of "Submit" before tapping it — enabling counterfactual rollouts and dead-end detection instead of blind commitment.',
                      },
                      {
                        label: 'A bigger base model with more parameters',
                        quality: 'bad',
                        feedback:
                          "Scale isn't the bottleneck the paper identifies here — §4.2 already showed a small trained model beating much larger untrained ones. The missing piece is an internal model of screen dynamics, not raw capacity.",
                      },
                      {
                        label: 'More training environments to cover this exact scenario',
                        quality: 'ok',
                        feedback:
                          "More coverage might reduce this specific failure in practice, but it doesn't give the agent the general ability to anticipate irreversible consequences before acting — that requires a predictive model of screen dynamics, which is the structural gap the paper names.",
                      },
                    ],
                  },
                ],
                debrief:
                  'Both stages trace back to the same posture: ClawGUI ships a working RL+eval+deploy pipeline today, but frames itself as "an early step" rather than a finished system. Mock apps and on-device RL are proposed, not validated, fixes for the emulator ceiling. A GUI world model is proposed, not built, as the fix for reactive (rather than anticipatory) action selection. The paper is explicit that its dense step-level trajectory logs are merely "a natural substrate" for training such a model — future work, not present capability.',
              },
            },
            {
              kind: 'quiz',
              title: 'Checking what stuck',
              questions: [
                {
                  prompt:
                    "Gemini-3-Pro + UI-Ins-7B reaches 55.6% SR on MobileWorld GUI-Only — over 3x ClawGUI-2B's 17.1%. Why does the paper say these numbers are not directly comparable?",
                  options: [
                    "The agentic framework pairs a closed-source frontier planner with a grounding module, so it can't be retrained or optimized end-to-end like ClawGUI-2B",
                    'The agentic framework was evaluated on a different, easier benchmark',
                    'The agentic framework number is a typo in the paper',
                    'ClawGUI-2B was evaluated on fewer tasks, making the comparison unfair in the other direction',
                  ],
                  answer: 0,
                  explanation:
                    'Both are evaluated on the same MobileWorld GUI-Only split. The incomparability is structural: agentic frameworks rely on closed-source planners unavailable for end-to-end optimization, making them a complementary regime rather than a competing one — not a flaw in either number.',
                },
                {
                  prompt:
                    'The dense-reward ablation (GRPO 14.5% vs GiGPO 17.1%) and the infrastructure comparison (MAI-UI-2B 11.1% vs ClawGUI-2B 17.1%) both end at 17.1% SR. Why are their relative gains (17.9% and ~54%) different numbers?',
                  options: [
                    'Relative gain depends on the starting point: (17.1-14.5)/14.5 and (17.1-11.1)/11.1 have different denominators despite sharing the same numerator-ish gap',
                    'One of the two figures in the paper is simply wrong',
                    'Relative gain is always reported as a flat 17.9% regardless of starting point',
                    'The two comparisons used different evaluation benchmarks',
                  ],
                  answer: 0,
                  explanation:
                    'Relative gain is (after - before) / before, so the starting baseline matters as much as the gap size. The 6.0-point gap (11.1 -> 17.1) sits on a smaller base (11.1), producing the larger relative gain of ~54%. The 2.6-point gap (14.5 -> 17.1) sits on a larger base (14.5), producing the smaller relative gain of 17.9%. Absolute point gaps alone never tell you the relative gain.',
                },
                {
                  prompt:
                    'Per Section 5, what does the paper mean by calling scaling online RL "as much a systems problem as an algorithmic one"?',
                  options: [
                    'Progress is now gated by infrastructure for handling environment instability at scale (e.g. mock apps, on-device RL), not just by better RL algorithms',
                    'The GiGPO algorithm itself has a bug that needs systems-level debugging',
                    'Online RL no longer requires any algorithmic innovation, only more GPUs',
                    'The paper is recommending CLI-based control over GUI-based control for scalability',
                  ],
                  answer: 0,
                  explanation:
                    'The paper frames the bottleneck on covering the "authenticated long tail of commercial applications" as requiring infrastructure (mock-app generation, on-device privacy-preserving collection) that can handle environment instability at scale — a systems challenge layered on top of, not replacing, the algorithmic one.',
                },
                {
                  prompt: 'Why does the paper describe today\'s GUI agents as acting "reactively"?',
                  options: [
                    'They observe a screenshot, predict an action, and only find out the consequence after the environment responds — with no internal model of how the screen will evolve before committing',
                    'They require a human to react to every action before it executes',
                    'They can only operate on apps that have a CLI fallback',
                    'They reactively retrain themselves after every failed task',
                  ],
                  answer: 0,
                  explanation:
                    'Section 5\'s "World Models for GUI Environments" discussion contrasts this reactive observe-act-wait loop with the proposed fix: a GUI-specific world model that would let an agent simulate consequences and plan ahead before acting, rather than discovering outcomes only after the fact.',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
