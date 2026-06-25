import type { Subject } from '../types'
import wmsdMotivation from './md/wmsd-motivation.md?raw'
import wmsdSetup from './md/wmsd-setup.md?raw'
import wmsdDistillation from './md/wmsd-distillation.md?raw'
import wmsdRl from './md/wmsd-rl.md?raw'
import wmsdResults from './md/wmsd-results.md?raw'

export const worldModelSelfDistillation: Subject = {
  id: 'world-model-self-distillation',
  title: 'World Model Self-Distillation',
  tagline: 'Turn caption-conditioned video generators into instruction-following task solvers — no curated task videos, then push past the teacher with RL.',
  icon: '🎬',
  accent: '#10b981',
  modules: [
    {
      id: 'wmsd-m1',
      title: 'World Model Self-Distillation (WMSD)',
      description: 'How a pretrained video world model learns to solve tasks from a short prompt by distilling a richly-conditioned teacher, then surpasses it with VLM-reward RL — following arXiv:2606.12072.',
      lessons: [
        {
          id: 'wmsd-motivation',
          title: 'The world model that needs the answer first',
          minutes: 12,
          xp: 70,
          steps: [
            { kind: 'read', title: 'A world model that won\'t take a hint', markdown: wmsdMotivation },
            {
              kind: 'quiz',
              title: 'Check: the gap and the idea',
              questions: [
                {
                  prompt: 'Why does feeding a state-of-the-art video generator a short instruction like "open the truck door" cause it to stall, even though it can render that exact action when given a detailed caption?',
                  options: [
                    'The model was trained to paint the caption it is given, not to figure out how to perform a task from a goal — the reasoning happens upstream, in a separate model that writes the detailed description',
                    'The model lacks the visual capacity to render door-opening motions at all',
                    'Short prompts are tokenized differently and confuse the model\'s text encoder',
                    'The model was never trained on videos containing trucks or doors',
                  ],
                  answer: 0,
                  explanation: 'The video model is a renderer of whatever description it receives — it never had to infer how to execute a task, because some other model always wrote the detailed description first. Given the goal alone, it has no mechanism to invent the missing plan.',
                },
                {
                  prompt: 'What is the main practical obstacle to fixing this gap with supervised fine-tuning (SFT) on (task instruction, successful execution video) pairs?',
                  options: [
                    'SFT requires a large, diverse set of curated successful demonstrations, which is costly to collect, especially for long-horizon tasks',
                    'SFT cannot be applied to diffusion or flow-based video models',
                    'SFT causes the model to forget how to follow detailed captions',
                    'SFT only works for tasks with no visual variation',
                  ],
                  answer: 0,
                  explanation: 'The data itself is the bottleneck: you need many environments, objects, and abstraction levels of paired (instruction, success video) data, and acquiring that at scale — particularly for long-horizon tasks — is expensive and hard to curate.',
                },
                {
                  prompt: 'Why is naively applying RL directly to a video world model "prohibitively expensive"?',
                  options: [
                    'Diffusion/flow-based video generators require many denoising steps per sample, and RL requires many rollouts per update — multiplying the cost',
                    'RL cannot be combined with VLM-based reward signals',
                    'Video models cannot represent reward signals numerically',
                    'RL requires curated human-labeled videos just like SFT does',
                  ],
                  answer: 0,
                  explanation: 'The expense compounds: each rollout already costs many denoising steps to produce one clip, and RL needs many rollouts for a useful gradient. Multiplying "many steps" by "many rollouts" makes naive RL on a multi-step video generator very costly.',
                },
                {
                  prompt: 'Why does adding RL on top of self-distillation let the Executor potentially surpass the Demonstrator, rather than just matching it?',
                  options: [
                    'Because the reward comes from a VLM judging outputs, and judging a proposed solution is generally easier than producing one — so the VLM gives a useful signal even on outputs better than the teacher\'s',
                    'Because RL always converges to a global optimum regardless of the teacher',
                    'Because the Executor is retrained on the original detailed descriptions during RL',
                    'Because RL removes the need for any teacher model at all',
                  ],
                  answer: 0,
                  explanation: 'The generation-verification asymmetry is the mechanism: for many structured tasks it is far easier to check whether a solution is valid than to generate one, so the VLM verifier can reliably score Executor outputs even when they exceed what the fixed Demonstrator could produce.',
                },
              ],
            },
          ],
        },
        {
          id: 'wmsd-setup',
          title: 'Teacher, student, and a flow from noise',
          minutes: 11,
          xp: 65,
          steps: [
            { kind: 'read', title: 'The teacher and the student see different things', markdown: wmsdSetup },
            {
              kind: 'quiz',
              title: 'Check: the teacher–student setup',
              questions: [
                {
                  prompt: 'In the WMSD setup, what is the key difference in conditioning between the Demonstrator and the Executor?',
                  options: [
                    'The Demonstrator (teacher) sees the image plus a detailed description D; the Executor (student) sees only the image plus a short task prompt T',
                    'The Demonstrator sees only the short task; the Executor sees the full detailed description',
                    'Both see the same description, but the Executor is trained with RL and the Demonstrator is not',
                    'The Demonstrator sees video, the Executor sees only text',
                  ],
                  answer: 0,
                  explanation: 'The teacher is conditioned on cD = (I, D) with the rich description; the student on cE = (I, T) with only the short task. Learning to act well from the bare task — the information the teacher was spared — is exactly what the student must acquire.',
                },
                {
                  prompt: 'In the flow-matching formulation, what does the model predict at each point, and what does integrating it produce?',
                  options: [
                    'A velocity field v(xₜ, t | c); integrating it from Gaussian noise (t=0) to data (t=1) produces a latent video that is decoded into the clip',
                    'A scalar reward; integrating it gives the task score',
                    'The final pixel values directly; integration averages them over time',
                    'A classification label per frame; integration counts the labels',
                  ],
                  answer: 0,
                  explanation: 'Generation is a trip from noise to data: the model predicts a velocity field saying which direction to move at state xₜ and flow time t, and following that field from x₀ (noise) to x₁ (latent video) yields the sample, which is then decoded.',
                },
                {
                  prompt: 'Why does the paper call the frozen teacher "dense guidance" rather than just a target to copy?',
                  options: [
                    'Because it provides a velocity the student can be compared against at every point along its own trajectory, not just a finished video to imitate',
                    'Because it is trained on a denser dataset than the student',
                    'Because it outputs higher-resolution video than the student',
                    'Because it is queried many times per second at inference',
                  ],
                  answer: 0,
                  explanation: 'A finished video gives one endpoint to match; a velocity field gives a comparison signal at every state and flow time. That per-step comparability is what makes on-policy distillation (matching on the student\'s own trajectories) possible.',
                },
              ],
            },
          ],
        },
        {
          id: 'wmsd-distillation',
          title: 'Off-policy vs on-policy: whose road do you practice on?',
          minutes: 14,
          xp: 80,
          steps: [
            { kind: 'read', title: 'Should the student practice on the teacher\'s road, or its own?', markdown: wmsdDistillation },
            {
              kind: 'quiz',
              title: 'Check: distillation and Proposition 1',
              questions: [
                {
                  prompt: 'Why does off-policy distillation (Eq. 3) suffer from compounding errors during student rollouts, even though it is stable to optimize?',
                  options: [
                    'It only trains the student on states the teacher visits, so the student never learns to recover once its own trajectory drifts into states the teacher never visited',
                    'It uses a stop-gradient that prevents the student from learning the velocity field at all',
                    'It conditions the velocity field on the wrong context (cD instead of cE)',
                    'It differentiates through the rollout distribution, making the gradient high-variance',
                  ],
                  answer: 0,
                  explanation: 'Off-policy distillation evaluates the discrepancy only on teacher trajectories. The student gets no signal for states it might wander into after a small mistake — like a learner who only practices on roads the instructor drives and cannot recover from a wrong turn.',
                },
                {
                  prompt: 'In the score-function decomposition of ∇θ Lon (Eq. 7), what does the first term, E[Cθ(τ)·∇θ log pθ(τ|cE)], correspond to?',
                  options: [
                    'A policy gradient with reward −Cθ(τ), reweighting how likely each trajectory is by its accumulated discrepancy',
                    'Ordinary vector-field regression on student states',
                    'A stop-gradient term with no effect on training',
                    'The Lipschitz constant of the teacher\'s velocity field',
                  ],
                  answer: 0,
                  explanation: 'The ∇θ log pθ(τ|cE) factor is the signature of a policy gradient. Reweighting trajectories by their discrepancy is exactly maximizing expected reward −Cθ(τ) — the "unlock" that later lets a task reward slot into the same machinery.',
                },
                {
                  prompt: 'In the distillation reward r_distill (Eq. 9), why is the student\'s velocity wrapped in a stop-gradient sg[·]?',
                  options: [
                    'So the reward acts purely by reweighting trajectory likelihood, rather than also backpropagating directly through the velocity field',
                    'To prevent the student from ever updating its velocity field',
                    'Because the teacher\'s velocity field cannot be differentiated',
                    'To make the reward numerically larger',
                  ],
                  answer: 0,
                  explanation: 'Detaching the student term routes r_distill only through the policy-gradient channel ("make low-discrepancy trajectories more likely"), leaving the direct regression effect to the separate second term of Eq. 7.',
                },
                {
                  prompt: 'What three conditions does Proposition 1 require to guarantee the student and teacher final outputs stay close?',
                  options: [
                    'Same initial noise x₀, a Lipschitz teacher velocity field, and small mean-squared matching error ε² on the student\'s own trajectories',
                    'Same final state x₁, a convex student field, and zero stop-gradient bias',
                    'Off-policy training, bounded reward, and a fixed learning rate',
                    'Identical conditioning (cE = cD), a linear field, and infinite trajectory length',
                  ],
                  answer: 0,
                  explanation: 'Under shared initial noise, a Lipschitz teacher field, and matching error ≤ ε², the bound W₂(student x₁, teacher x₁) ≤ e^L·ε holds — small per-step errors cannot blow up into wildly different videos. It is a standard Grönwall argument.',
                },
              ],
            },
          ],
        },
        {
          id: 'wmsd-rl',
          title: 'Beating the teacher: VLM rewards and the anchor',
          minutes: 15,
          xp: 90,
          steps: [
            { kind: 'read', title: 'How do you beat a teacher you were trained to copy?', markdown: wmsdRl },
            {
              kind: 'quiz',
              title: 'Check: rewards, anchoring, and β_d',
              questions: [
                {
                  prompt: 'The VLM judge reward is R(x) = log p_VLM("yes"|x) − log p_VLM("no"|x). Why use this log-prob difference instead of a hard 0/1 verdict?',
                  options: [
                    'It captures both the verdict and the model\'s confidence, giving a smoother, more optimizable signal than a binary label',
                    'It is computationally cheaper than a binary classification',
                    'It guarantees the reward can never be negative',
                    'It removes the need for a consistency reward entirely',
                  ],
                  answer: 0,
                  explanation: 'A bare yes/no collapses confident and hesitant judgments together. The log-prob difference is continuous: a confident "yes" scores high, a hesitant "yes" low, a confident "no" negative — much easier for RL to climb.',
                },
                {
                  prompt: 'What specific failure mode does the consistency reward exist to counteract?',
                  options: [
                    'The optimizer exploiting the VLM judge with physically implausible video (e.g. objects teleporting in) that still reads as "task solved"',
                    'The student copying the Demonstrator too literally and never improving',
                    'The anchor loss pulling the policy too far from the RL objective',
                    'The group-relative advantage estimator producing biased gradients',
                  ],
                  answer: 0,
                  explanation: 'Optimizing the VLM reward alone is exploitable — the policy can satisfy the judge with unrealistic content. The consistency reward separately penalizes physically/temporally incoherent video, so success has to look real, not just read as "yes."',
                },
                {
                  prompt: 'If the goal of RL is to let the Executor exceed the Demonstrator, why anchor the Executor to the Demonstrator at all?',
                  options: [
                    'The anchor pulls toward the teacher\'s visual plausibility, not its task performance — so RL stays free to find better task outcomes while the anchor prevents physically nonsensical drift',
                    'The anchor forces the Executor\'s task performance to never exceed the teacher\'s',
                    'The anchor is a leftover pretraining term with no real effect once RL begins',
                    'The anchor and RL optimize the exact same objective, so it is redundant but harmless',
                  ],
                  answer: 0,
                  explanation: 'The anchor regresses toward the teacher\'s realism, not its task success. RL can push task score past the teacher\'s ceiling while the anchor stops the policy from "winning" via implausible video.',
                },
                {
                  prompt: 'What does the paper find happens at the extremes of the anchor coefficient β_d in L_final = L_RL + β_d·L_anchor?',
                  options: [
                    'Too small weakens the distillation signal (drift/reward-hacking); too large lets the anchor dominate and suppresses RL learning — best is around β_d ≈ 0.01',
                    'Larger β_d is always better because the teacher signal is reinforced',
                    'β_d has no measurable effect on performance',
                    'Only β_d = 0 produces stable training',
                  ],
                  answer: 0,
                  explanation: 'Section 4.6 reports a Goldilocks curve: too little regularization under-constrains RL, too much drowns out the RL objective, and β_d ≈ 0.01 is the measured sweet spot.',
                },
              ],
            },
            {
              kind: 'code',
              title: 'Compose the reward and group-relative advantage',
              challenge: {
                prompt: `WMSD's RL stage scores each rollout with a **blended reward** and then turns a *group* of rollouts for the same task into **group-relative advantages** (the GRPO/AWM trick).

Implement two functions:

\`\`\`js
compositeReward(item, lambdaTask, lambdaDistill)
\`\`\`
- \`item\` is \`{ logpYes, logpNo, rDistill }\`.
- The VLM task reward is the log-prob difference: \`rTask = logpYes - logpNo\`.
- Return \`lambdaTask * rTask + lambdaDistill * rDistill\`  (this is R(τ), Eq. 10).

\`\`\`js
groupAdvantages(group, lambdaTask, lambdaDistill)
\`\`\`
- \`group\` is an array of such items, all sampled for the *same* task.
- Compute each item's composite reward, then return the array of **group-relative advantages**: \`(reward - mean) / (std + 1e-8)\`, where \`mean\` and \`std\` are taken over the group (use the population standard deviation, dividing by N).

The idea: you never need a rollout's *absolute* value — only whether it beat its siblings on the same task.`,
                starterCode: `function compositeReward(item, lambdaTask, lambdaDistill) {
  // TODO: rTask = logpYes - logpNo; return weighted blend with rDistill
  return 0
}

function groupAdvantages(group, lambdaTask, lambdaDistill) {
  // TODO: composite reward per item, then (r - mean) / (std + 1e-8)
  return group.map(() => 0)
}`,
                solution: `function compositeReward(item, lambdaTask, lambdaDistill) {
  const rTask = item.logpYes - item.logpNo
  return lambdaTask * rTask + lambdaDistill * item.rDistill
}

function groupAdvantages(group, lambdaTask, lambdaDistill) {
  const rewards = group.map(it => compositeReward(it, lambdaTask, lambdaDistill))
  const mean = rewards.reduce((a, b) => a + b, 0) / rewards.length
  const variance = rewards.reduce((a, b) => a + (b - mean) ** 2, 0) / rewards.length
  const std = Math.sqrt(variance)
  const eps = 1e-8
  return rewards.map(r => (r - mean) / (std + eps))
}`,
                tests: `test('task-only reward is the log-prob difference', () => {
  assertEqual(compositeReward({ logpYes: 2, logpNo: -1, rDistill: 5 }, 1, 0), 3);
});
test('blended reward weights both terms', () => {
  // rTask = 4 - 0 = 4; R = 0.5*4 + 0.5*(-2) = 1
  assertEqual(compositeReward({ logpYes: 4, logpNo: 0, rDistill: -2 }, 0.5, 0.5), 1);
});
test('a confident no goes negative', () => {
  assertEqual(compositeReward({ logpYes: -3, logpNo: 1, rDistill: 0 }, 1, 1) < 0, true);
});
test('zero-variance group yields all-zero advantages', () => {
  const g = [{ logpYes: 1, logpNo: 0, rDistill: 0 }, { logpYes: 1, logpNo: 0, rDistill: 0 }];
  assertEqual(groupAdvantages(g, 1, 1), [0, 0]);
});
test('highest-reward rollout has the highest advantage', () => {
  const g = [
    { logpYes: 0, logpNo: 0, rDistill: 0 },
    { logpYes: 3, logpNo: 0, rDistill: 0 },
    { logpYes: 1, logpNo: 0, rDistill: 0 },
  ];
  const adv = groupAdvantages(g, 1, 0);
  assertEqual(adv.indexOf(Math.max(...adv)), 1);
});
test('advantages are mean-centered', () => {
  const g = [
    { logpYes: 0, logpNo: 0, rDistill: 0 },
    { logpYes: 3, logpNo: 0, rDistill: 0 },
    { logpYes: 1, logpNo: 0, rDistill: 0 },
  ];
  const adv = groupAdvantages(g, 1, 0);
  const mean = adv.reduce((a, b) => a + b, 0) / adv.length;
  assertEqual(Math.abs(mean) < 1e-9, true);
});`,
              },
            },
          ],
        },
        {
          id: 'wmsd-results',
          title: 'Did the student actually beat the teacher?',
          minutes: 13,
          xp: 80,
          steps: [
            { kind: 'read', title: 'Reading the experiments', markdown: wmsdResults },
            {
              kind: 'quiz',
              title: 'Check: what the experiments show',
              questions: [
                {
                  prompt: 'What distinct question does each of WorldTasks-Bench\'s three metrics (Task, Agent, Realism) answer?',
                  options: [
                    'Task = was the task completed; Agent = did the intended agent (not a bystander) do it; Realism = is the physics/motion plausible',
                    'Task = is the video high resolution; Agent = is the model fast; Realism = is the prompt grammatical',
                    'Task = training loss; Agent = parameter count; Realism = dataset size',
                    'All three measure the same completion signal from three VLM judges for redundancy',
                  ],
                  answer: 0,
                  explanation: 'The three metrics are deliberately orthogonal: a video could complete a task unrealistically, or realistically but via the wrong agent. Task, Agent, and Realism separate those failure modes.',
                },
                {
                  prompt: 'Section 4.2 reports off-policy self-distillation saturating after ~60 steps while on-policy variants keep improving. What does this demonstrate?',
                  options: [
                    'Matching the teacher on the student\'s own (on-policy) trajectories keeps providing useful signal where matching on fixed teacher trajectories stops helping',
                    'On-policy training is only faster computationally, with no quality effect',
                    'Off-policy training fails because the teacher\'s trajectories are mislabeled',
                    'On-policy training needs more unlabeled images than off-policy',
                  ],
                  answer: 0,
                  explanation: 'The "practice on your own road" argument paying off: on-policy supervision stays relevant to the student\'s current behavior, so it keeps improving; off-policy targets trajectories the student isn\'t producing, so its signal dries up.',
                },
                {
                  prompt: 'In Table 1, why does the SFT baseline sometimes *degrade* performance relative to the base LTX-2 model, per the authors\' hypothesis?',
                  options: [
                    'Limited task diversity in the auto-annotated data — many tasks are overly simple/repetitive (e.g. "walk forward") — so SFT overfits a narrow distribution',
                    'SFT increases inference cost so much that quality metrics suffer',
                    'SFT was trained on too few examples to converge',
                    'SFT used a VLM call at inference time that introduced noise',
                  ],
                  answer: 0,
                  explanation: 'Section 4.4 attributes SFT\'s weak/negative results to limited task diversity in the automatically annotated data; fine-tuning directly on that narrow, repetitive set hurts generalization rather than helping.',
                },
                {
                  prompt: 'On the DreamGen robotics benchmark, WMSD used no robot-specific training data yet matched SFT-trained Cosmos. Why is this significant?',
                  options: [
                    'A model trained data-free, never having seen curated robot demonstrations, can match one fine-tuned on them — transfer without domain-specific data',
                    'It shows WMSD is strictly better than any robot-specific fine-tuning',
                    'It shows DreamGen and WorldTasks-Bench measure identical capabilities',
                    'It shows SFT is unnecessary for all robotics tasks regardless of domain',
                  ],
                  answer: 0,
                  explanation: 'This is the paper\'s headline: operating data-free, WMSD reaches performance comparable to SFT-trained Cosmos on a robotics benchmark despite never training on robot demonstrations — evidence the capability transfers across domains.',
                },
              ],
            },
          ],
        },
        {
          id: 'wmsd-critique',
          title: 'Design clinic: when to reach for WMSD',
          minutes: 12,
          xp: 80,
          steps: [
            {
              kind: 'scenario',
              title: 'Building a task-solving video world model',
              scenario: {
                intro: 'You lead a team that has a strong pretrained text/image-to-video generator. Product wants it to take a short goal ("open the cabinet") plus a starting image and produce a video of the goal being achieved — no detailed prompt-writing by the user. You have lots of unlabeled scene images but no curated (task, success-video) dataset. Use what you learned about WMSD to make four calls.',
                stages: [
                  {
                    situation: 'You have no curated task-execution videos, and collecting them at scale is out of budget.',
                    question: 'Which training strategy best fits these constraints?',
                    options: [
                      { label: 'Self-distillation: have a VLM invent task+detailed-description per image, let the richly-conditioned Demonstrator execute, and distill that into an Executor seeing only the short task', quality: 'best', feedback: 'Exactly WMSD\'s contribution 1 — it converts caption-guided execution knowledge into an instruction-following model without any curated task-video supervision.' },
                      { label: 'Collect a supervised (task, success-video) dataset by auto-labeling random videos and fine-tune on it', quality: 'bad', feedback: 'This is the SFT baseline, which the paper found barely helps and sometimes hurts — auto-annotated tasks are too simple/repetitive ("walk forward") and lack diversity.' },
                      { label: 'Outsource reasoning to a VLM at every inference: have it write the detailed prompt on the fly each time', quality: 'bad', feedback: 'A real baseline, but the world model never learns to plan and you pay an extra VLM call on every single inference. The goal is to internalize the reasoning.' },
                    ],
                  },
                  {
                    situation: 'You add RL with a VLM judge as the reward. After a while the videos score high but show objects popping into existence and physics glitches.',
                    question: 'What is the right fix?',
                    options: [
                      { label: 'Add a consistency reward penalizing implausible/incoherent video, and keep the frozen-teacher anchor loss', quality: 'best', feedback: 'This is reward hacking, and WMSD\'s answer is exactly this: a consistency reward plus the Demonstrator anchor that keeps generations physically plausible while RL chases task success.' },
                      { label: 'Increase λ_task so the model tries even harder to satisfy the judge', quality: 'bad', feedback: 'That amplifies the exact signal being gamed — the model will hack the judge harder, not less.' },
                      { label: 'Trust the raw VLM reward; high scores mean the task is being solved', quality: 'bad', feedback: 'The paper warns raw VLM rewards are noisy and exploitable; high scores can come from implausible generations rather than genuine task success.' },
                    ],
                  },
                  {
                    situation: 'You set the anchor coefficient β_d. A teammate proposes cranking it very high "to be safe and stay close to the trusted teacher."',
                    question: 'How do you set β_d?',
                    options: [
                      { label: 'Keep it small (the paper finds ~0.01 best) — enough to regularize without dominating', quality: 'best', feedback: 'Section 4.6 shows a Goldilocks curve: ~0.01 is the sweet spot. Too small under-constrains RL; too large lets the anchor drown out learning.' },
                      { label: 'Set β_d very large so the anchor dominates the objective', quality: 'bad', feedback: 'Too much regularization dominates the RL objective and limits learning — the student can no longer improve past the teacher.' },
                      { label: 'Set β_d = 0 to give RL full freedom', quality: 'bad', feedback: 'With no anchor, RL drifts and reward-hacks; the distillation signal that keeps generations plausible is gone.' },
                    ],
                  },
                  {
                    situation: 'You want to deploy on a specific robot arm whose exact dynamics matter, and leadership expects zero-shot, data-free perfection from WMSD.',
                    question: 'What do you tell them?',
                    options: [
                      { label: 'WMSD transfers competitively and generates plausible solutions, but data-free training can\'t recover platform-specific appearance/dynamics beyond the first frame — some robot data (or video-continuation/ICL) is needed for that', quality: 'best', feedback: 'This is exactly the paper\'s stated limitation (Section 4.8): impressive data-free transfer, but accurate robot-specific dynamics require corresponding data.' },
                      { label: 'Promise WMSD will match a robot-specific SFT model on exact dynamics with no robot data at all', quality: 'bad', feedback: 'Overclaiming — the paper is explicit that data-free training cannot recover accurate robot-specific dynamics.' },
                      { label: 'Abandon WMSD for robotics entirely since it used no robot data', quality: 'bad', feedback: 'Also wrong: on DreamGen, data-free WMSD was competitive with SFT-trained baselines — it\'s a strong starting point, just not a full substitute for platform data.' },
                    ],
                  },
                ],
                debrief: 'WMSD is a recipe for getting task-solving out of a video world model cheaply: distill a VLM-described teacher into a short-prompt student (no curated videos), then use VLM-reward RL plus a consistency reward and a teacher anchor to surpass the teacher without reward-hacking. Its power and its limits both flow from being data-free — great transfer and flat inference cost, but no platform-specific dynamics it never saw.',
              },
            },
          ],
        },
      ],
    },
  ],
}
