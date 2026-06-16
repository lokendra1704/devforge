import type { Module } from '../../types'
import applicationsMd from '../md/aaa-x-applications.md?raw'
import opportunitiesMd from '../md/aaa-x-opportunities.md?raw'
import capstoneMd from '../md/aaa-x-capstone.md?raw'

export const m6: Module = {
  id: 'aaa-m6',
  title: 'Applications, Opportunities, and Conclusion',
  description:
    'Where the A1/A2/T1/T2 framework plays out across deep research, software development, computer use, and drug discovery (§8); the open problems in co-adaptation, continual adaptation, safe adaptation, and efficient adaptation (§9); and the survey\'s closing synthesis (§10).',
  lessons: [
    {
      id: 'aaa-x-applications',
      title: 'Applications: Paradigm Mapping Across Four Domains',
      minutes: 14,
      xp: 65,
      steps: [
        { kind: 'read', title: 'Where the framework meets the real world', markdown: applicationsMd },
        {
          kind: 'quiz',
          title: 'Domains and dominant paradigms',
          questions: [
            {
              prompt:
                'Deep research systems (§8.1) show "dual adaptation": the core reasoning agent is adapted via A2 while retrieval/search tools are adapted via T1 or T2. Why is the core agent A2 rather than A1?',
              options: [
                'Because A2 is always cheaper to train than A1, regardless of domain',
                'Because deep research has no deterministic execution signal like a compiler or test suite — quality is judged holistically on the final research output, even though retrieval-specific metrics like Recall@K can still give A1-style feedback to the search component itself',
                'Because A1 only applies to multimodal agents, and deep research agents are text-only',
                'Because the agent in deep research never calls any tools',
              ],
              answer: 1,
              explanation:
                'Per §8.1, the absence of deterministic execution signals "makes pure A1 adaptation less natural" for the core research agent — its output is judged holistically. Retrieval metrics (Recall@K) can supply A1-style feedback, but for the search subagent (a T2 candidate), not the overall reasoning agent.',
            },
            {
              prompt:
                'Table 9 lists "long-horizon credit assignment across multi-file edits" as the key bottleneck for Software Development, even though this domain has the densest execution feedback (test pass rates, CI outcomes) of the four. What does this tell you about A1?',
              options: [
                'A1 is useless in software development because tests are unreliable',
                'Dense execution feedback tells you THAT a test failed, but not WHICH of several edited files caused the failure — A1\'s per-action signal doesn\'t automatically solve attribution across a multi-step trajectory, which is part of why A2 (holistic issue resolution) is also needed',
                'A1 only works for single-file repositories',
                'Credit assignment is solved entirely by adding more unit tests',
              ],
              answer: 1,
              explanation:
                'A1 gives a precise pass/fail signal, but a failing test after a multi-file edit doesn\'t by itself attribute blame to a specific edit. §8.2 notes A2-style adaptation is needed for the holistic task (resolving a full issue: what to read, what to edit, how to validate) precisely because the A1 signal doesn\'t cover that.',
            },
            {
              prompt:
                'Computer-use agents (§8.3) are described as the most multimodal of the four domains, with A2 as the dominant paradigm for the core agent. What roles do T1 and T2 play here?',
              options: [
                'T1 and T2 are not used in computer-use systems at all — only A2 applies',
                'T1 supplies pre-trained, plug-and-play perception models (e.g., CLIP, SAM) for grounding actions in screenshots, while T2 supplies persistent memory/context management (e.g., ACE\'s evolving playbooks, CUA-Skill\'s reusable skill base) that accumulates strategy without retraining the agent',
                'T1 trains the agent\'s vision encoder from scratch on every new GUI',
                'T2 replaces the agent entirely with a rule-based GUI automation script',
              ],
              answer: 1,
              explanation:
                'Per §8.3, A1 is least natural here (no "test suite" for clicking the right button). A2 dominates with holistic task-completion rewards. T1 tools (CLIP, SAM) serve as plug-and-play perception modules, and T2 (ACE, CUA-Skill) handles persistent memory and skill accumulation around the frozen-ish agent.',
            },
            {
              prompt:
                'Drug Discovery (§8.4) is the only domain in Table 9 where all four paradigms (A1, A2, T1, T2) appear together, yet its "key bottleneck" is sparse, delayed wet-lab feedback (weeks to months). How do these two facts fit together?',
              options: [
                'They contradict each other — if feedback is slow, no paradigm should be usable',
                'The pipeline spans sub-tasks with very different feedback characteristics (verifiable docking scores → A1; holistic eligibility judgments → A2; pre-trained structure predictors → T1; an evolving tool ecosystem → T2), but the slowest feedback loop — wet-lab validation — bounds how fast the overall system can make verified progress regardless of which paradigm is used for any one sub-task',
                'All four paradigms are identical in drug discovery, so listing them separately is redundant',
                'The wet-lab bottleneck only affects T1 tools, not A1, A2, or T2',
              ],
              answer: 1,
              explanation:
                'Per §8.4, different sub-tasks (computational chemistry calls, trial-design workflows, structure prediction, tool-ecosystem evolution) each map to a different paradigm based on their own feedback characteristics. But the overall pipeline\'s progress is still gated by the slowest loop — wet-lab validation — which no paradigm choice for any individual sub-task can speed up.',
            },
          ],
        },
      ],
    },
    {
      id: 'aaa-x-opportunities',
      title: 'Opportunities: Co-Adaptation, Continual, Safe, and Efficient Adaptation',
      minutes: 14,
      xp: 65,
      steps: [
        { kind: 'read', title: "What's still open", markdown: opportunitiesMd },
        {
          kind: 'quiz',
          title: 'The four open problems',
          questions: [
            {
              prompt:
                'Section 9.1 frames co-adaptation as a bi-level optimization `max_{A,T} O(A,T)` where A\'s optimal policy depends on T and vice versa. Why does this depart from every paradigm covered earlier (A1, A2, T1, T2)?',
              options: [
                'Because co-adaptation requires a completely different objective function unrelated to O(·)',
                'Because every earlier paradigm freezes one side to give the other a stable learning target (T2 freezes the agent, A1/A2 freeze the tool) — co-adaptation removes that stabilizing assumption, so both sides are moving targets for each other simultaneously',
                'Because co-adaptation only applies to single-agent systems',
                'Because A1/A2/T1/T2 never involve both an agent and a tool',
              ],
              answer: 1,
              explanation:
                'Per §9.1, the formulation "departs from current paradigms, which almost universally rely on freezing one component to provide a stable learning target for the other." Co-adaptation\'s bi-level structure means A and T are both changing, each in response to the other.',
            },
            {
              prompt:
                'Section 9.1 warns of a "stability-plasticity dilemma" and a possible "Red Queen" regime. What does the Red Queen regime describe?',
              options: [
                'A scenario where the agent and tool both stop training entirely',
                'A scenario where agent A and tool T continually adjust to each other\'s most recent changes without increasing overall performance — or even collapse into degenerate joint policies — the opposite failure from premature convergence to a brittle interface',
                'A scenario where the tool always wins and the agent is discarded',
                'A scenario that only occurs in single-paradigm (non-co-adaptive) systems',
              ],
              answer: 1,
              explanation:
                'Per §9.1, in a "Red Queen" regime A and T "continually adjust to each other\'s most recent changes without increasing overall performance, or may even collapse into degenerate policies." This is the non-stationarity failure mode; its counterpart is premature convergence to a brittle, suboptimal interface.',
            },
            {
              prompt:
                'Section 9.2 maps continual-learning techniques onto two families: "parameter-update mechanisms" and "external-memory mechanisms." Which paradigms do these correspond to, and what is the proposed synthesis?',
              options: [
                'Parameter-update = T1, external-memory = T2; the synthesis is to use only T1 going forward',
                'Parameter-update mechanisms correspond to "Dynamic A1/A2" (e.g., EWC, LoRA, model merging — adapting via parameter changes while limiting interference), external-memory mechanisms correspond to "Evolving T2" (replay buffers, dual-memory, prompts-as-memory); the synthesis is to use CL-aware parameter updates where most effective while shifting as much long-term adaptation as possible into T2-style modular tools',
                'Both families are identical and the distinction is purely terminological',
                'Parameter-update mechanisms eliminate the need for any tool adaptation',
              ],
              answer: 1,
              explanation:
                'Per §9.2, regularization/orthogonal-update/parameter-efficient methods are "Dynamic A1/A2 Paradigm" techniques, while replay buffers, dual-memory systems, and prompt-as-memory are "Evolving T2 Adaptation." The survey proposes integrating both: CL-aware parameter updates plus T2-style modular tools/external memories for long-term growth.',
            },
            {
              prompt:
                'Section 9.3 identifies "Unsafe Exploration" as the primary risk for A1 and "Parasitic Adaptation" as a risk spanning A2/T2. The "reward-safety gap" is an instance of which failure mode, and why?',
              options: [
                'Parasitic Adaptation Type C (sycophancy loops) — because the agent and a red-teaming tool overfit to each other',
                'Unsafe Exploration — because sparse, binary rewards (e.g., task completion) provide no signal about intermediate actions, so an on-policy agent maximizing the final reward may take collateral-damage actions (e.g., deleting files) with nothing in the reward to discourage it',
                'Parasitic Adaptation Type B (adversarial tooling) — because a compromised tool returns prompt-injected data',
                'It is not a safety issue at all, just an efficiency issue',
              ],
              answer: 1,
              explanation:
                'Per §9.3, "the reward-safety gap" is listed under Unsafe Exploration: "rewards are typically sparse and binary... The result is a feedback vacuum for intermediate actions, encouraging agents to maximize efficacy regardless of collateral damage." This is distinct from Parasitic Adaptation (Types A/B/C), which involves exploitative agent-tool relationships.',
            },
            {
              prompt:
                'Section 9.4 notes that LoRA "Without Regrets" shows LoRA performs equivalently to full fine-tuning even at small ranks specifically in RL settings. Combined with FlashRL (quantized rollouts) and on-device tool modules, what does the survey say about these three efficiency directions?',
              options: [
                'They are mutually exclusive — only one can be applied to a given system',
                'They target orthogonal bottlenecks (parameter count, numerical precision, and deployment location) and compose — e.g., a LoRA adapter quantized to INT8 and updated on-device represents the intersection of all three',
                'Only parameter-efficient adaptation matters; quantization and on-device adaptation are not relevant to agentic systems',
                'These directions only apply to A1; A2, T1, and T2 cannot benefit from efficient adaptation',
              ],
              answer: 1,
              explanation:
                'Per §9.4, "These three directions target orthogonal bottlenecks—parameter count, numerical precision, and deployment location—and can be composed: a LoRA adapter quantized to INT8 and updated on-device represents the intersection of all three."',
            },
          ],
        },
      ],
    },
    {
      id: 'aaa-x-capstone',
      title: 'Capstone: Synthesis and Strategy Design',
      minutes: 17,
      xp: 75,
      steps: [
        { kind: 'read', title: 'Conclusion: the synthesis', markdown: capstoneMd },
        {
          kind: 'scenario',
          title: 'Design an adaptation strategy from scratch',
          scenario: {
            intro:
              'You\'re handed a new agentic system to improve. For each stage, you\'re given a description of the system\'s feedback availability, agent access, compute budget, and constraints. Use the full A1/A2/T1/T2 framework, the comparison axes (cost/flexibility/generalization/modularity), the evaluation framework (verifiable execution vs. holistic utility, sample efficiency, safety/alignment), and the §9 opportunities to recommend an adaptation strategy and an evaluation plan.',
            stages: [
              {
                situation:
                  'System 1: An internal coding agent that resolves GitHub issues in a large monorepo. You have full access to the agent\'s weights, a CI pipeline gives deterministic pass/fail on every proposed patch within minutes, and you have a modest GPU budget (a handful of A100s) for a few weeks. The team\'s main complaint is that the agent\'s patches often pass the visible tests but get rejected in review for violating undocumented conventions.',
                question:
                  'Given dense, fast, deterministic execution feedback AND a holistic "did this patch get accepted" signal that execution alone doesn\'t capture — which adaptation strategy and evaluation plan fits best?',
                options: [
                  {
                    label:
                      'Combine A1-style RL on CI pass/fail (the agent has weight access and feedback is dense and fast, so this is affordable) with an A2-style holistic reward derived from review-acceptance signals for the final patch — and evaluate with BOTH a verifiable-execution metric (test pass rate) and a holistic-utility metric (review acceptance rate), tracking sample efficiency given the limited GPU budget',
                    quality: 'best',
                    feedback:
                      'This matches §8.2\'s pattern exactly: dense execution feedback (CI) is a natural fit for A1, but the team\'s actual complaint — patches passing tests yet getting rejected — is precisely the gap A1\'s execution signal doesn\'t cover, which is what A2\'s holistic signal addresses. Evaluating with both metrics (per the evaluation-framework module) avoids over-indexing on the test-pass signal that already proved insufficient, and tracking sample efficiency respects the modest compute budget.',
                  },
                  {
                    label:
                      'Use only A1-style RL on CI pass/fail, since execution feedback is fast, dense, and the team already has it set up — and evaluate purely on test pass rate, since that is the most objective metric available',
                    quality: 'bad',
                    feedback:
                      'This repeats the exact failure the team is already experiencing: patches pass CI yet get rejected for violating undocumented conventions. Per §8.2, A1\'s execution signal doesn\'t capture this "organicity" gap. Evaluating only on test pass rate would optimize harder for the metric that already failed to predict review acceptance.',
                  },
                  {
                    label:
                      'Freeze the agent entirely and instead train a T1 code-review classifier on a generic open-source dataset, deployed as a pre-filter before patches reach human reviewers',
                    quality: 'ok',
                    feedback:
                      'A T1 reviewer-style filter could help, and is cheap/modular — but it ignores that you HAVE weight access, dense fast feedback, and a compute budget suited to direct agent adaptation. A generic, agent-agnostic classifier trained on someone else\'s conventions is also less likely to capture THIS monorepo\'s undocumented conventions than adapting the agent (or a T2 subagent under its supervision) on this team\'s own review-acceptance signal would.',
                  },
                ],
              },
              {
                situation:
                  'System 2: A customer-support agent built on a closed-source API model (no weight access, no fine-tuning possible). It calls a retrieval tool over your company\'s knowledge base. Users frequently report that the agent retrieves outdated articles. You have engineering time to build a small retrieval model but cannot touch the core agent at all.',
                question:
                  'Given a frozen, inaccessible agent and a retrieval component you CAN train — which paradigm fits, and how should you decide between training it agent-agnostically vs. under the agent\'s supervision?',
                options: [
                  {
                    label:
                      'This is necessarily T1 or T2 (the agent is frozen by construction, so A1/A2 are impossible) — start with T1 if you have a generic relevance-labeled dataset (train the retriever independently, agent-agnostic, likely to generalize well per the comparison framework), or use T2 if what you actually have is signal about which retrieved articles led to good final agent responses (train the retriever using agent-output-derived signal, e.g., quality-weighted or output-consistency training)',
                    quality: 'best',
                    feedback:
                      'Per §3.2.3/§3.2.4 and §8.1\'s deep-research pattern (frozen reasoning agent + adapted retrieval tool), a closed-source agent makes T1/T2 the only options. The T1-vs-T2 choice should be driven by what data you actually have: a standalone relevance dataset → T1 (better generalization per the comparison framework); signal tied to this agent\'s downstream responses → T2 (often more sample-efficient and directly aligned to what helps THIS agent).',
                  },
                  {
                    label:
                      'Since the agent can\'t be fine-tuned, there\'s nothing to be done — recommend waiting until the vendor releases a fine-tunable version of the model',
                    quality: 'bad',
                    feedback:
                      'This ignores the entire tool-adaptation half of the framework. §8.1 explicitly notes that learning-based retrieval modules (T1/T2) "advance tool adaptation... especially atop proprietary models that cannot be fine-tuned" — this is exactly the scenario T1/T2 exist for.',
                  },
                  {
                    label:
                      'Attempt A2-style RL on the agent\'s final responses anyway, treating the closed-source API as if it were a fine-tunable model, since A2 offers the richest parametric flexibility',
                    quality: 'bad',
                    feedback:
                      'A2 (like A1) requires updating the agent\'s parameters or policy — impossible for a closed-source API with "no weight access, no fine-tuning possible." Recommending it ignores the stated constraint entirely; flexibility on paper doesn\'t matter if the access doesn\'t exist.',
                  },
                ],
              },
              {
                situation:
                  'System 3: An autonomous DevOps agent that can execute shell commands and modify cloud infrastructure with minimal human review, currently being adapted via on-policy RL with a sparse, binary "deployment succeeded" reward. Leadership wants to keep the autonomy (for speed) but is worried about the kind of incident where an agent, mid-exploration, runs a destructive command that can\'t be undone.',
                question:
                  'Given on-policy RL (A1-style) with a sparse binary reward over an environment with irreversible actions — what does §9.3 say should change, and what should NOT change?',
                options: [
                  {
                    label:
                      'Add a safety-check layer that intercepts and filters anomalous/high-risk actions before they reach the live infrastructure (a safety governor with tiered permissions), and consider constrained policy optimization that projects exploratory actions onto a verified-safe set — without simply abandoning on-policy RL, since the sparse-reward problem is the reward-safety gap §9.3 describes, not an argument against RL itself',
                    quality: 'best',
                    feedback:
                      'This is exactly §9.3\'s diagnosis and mitigation: "the reward-safety gap" arises because sparse binary rewards create "a feedback vacuum for intermediate actions" in an environment with "irreversible state transitions." The fix is a safety-check layer / constrained policy optimization that bounds exploration to a safe set — addressing the gap without discarding the on-policy RL that delivers the autonomy leadership wants.',
                  },
                  {
                    label:
                      'Switch entirely from RL to supervised fine-tuning on a fixed dataset of safe trajectories, eliminating on-policy exploration altogether',
                    quality: 'ok',
                    feedback:
                      'Removing on-policy exploration does eliminate the unsafe-exploration risk mechanism §9.3 describes — but it also gives up the on-policy adaptation leadership explicitly wants to keep, and per the earlier evaluation/comparison modules, SFT on a fixed dataset forgoes the exploration and correction that made RL attractive in the first place. A safety layer addresses the risk while preserving the capability; a wholesale method switch is a bigger change than the problem requires.',
                  },
                  {
                    label:
                      'Keep the system exactly as-is, but add a natural-language instruction to the agent\'s prompt telling it to "avoid destructive or irreversible actions"',
                    quality: 'bad',
                    feedback:
                      'This is the precise failure mode the broader survey warns against for safety: a natural-language instruction does not enforce anything during on-policy exploration, and §9.3\'s "erosion of guardrails" discussion (DeepSeek-R1) shows aggressive RL can lead a model to reason around exactly this kind of soft instruction. The reward-safety gap and irreversibility risk remain completely unaddressed.',
                  },
                ],
              },
              {
                situation:
                  'System 4: A research lab wants to deploy a personalized writing assistant on users\' laptops. Each user has different writing style preferences, the laptops have no GPU, and the lab cannot afford to fine-tune or deploy a large model per user. The base model must stay shared and frozen across all users.',
                question:
                  'Given zero per-user compute budget for model adaptation, a frozen shared base model, and a need for personalization — which combination of paradigm and efficiency technique fits?',
                options: [
                  {
                    label:
                      'T2-style lightweight tool adaptation: each user\'s device maintains a small, locally-updated tool/context module (e.g., a style-preference store or prompt-level memory) aligned to that user\'s habits, fully decoupled from the frozen shared base model — consistent with §9.4\'s on-device/personalized adaptation direction, and avoiding any need to fine-tune the base model per user',
                    quality: 'best',
                    feedback:
                      'This is §9.4\'s on-device/personalized adaptation direction verbatim in spirit: "each device maintains a small tool module aligned with user-specific habits... fully decoupled from the base model, it can update locally without compromising global capabilities." It is also a T2 pattern from earlier modules — the frozen agent is supervised by/supervises a small adapted tool (here, a personal memory/preference module), which composes well with the no-GPU constraint.',
                  },
                  {
                    label:
                      'Fine-tune a separate full copy of the base model for each user using LoRA, since "LoRA Without Regrets" shows LoRA works well in RL settings',
                    quality: 'ok',
                    feedback:
                      'LoRA genuinely reduces the cost of personalization (per §9.4), but the stage specifies "no GPU" on the laptops and "cannot afford to fine-tune... per user" — even LoRA-based fine-tuning requires some training compute the laptops don\'t have, and maintaining a separate adapter per user at scale reintroduces the per-user cost the lab is trying to avoid. The on-device tool-module approach avoids training entirely.',
                  },
                  {
                    label:
                      'Ignore personalization for now and ship the same frozen base model to every user with no adaptation at all, since the base model is already "good enough" after pretraining',
                    quality: 'bad',
                    feedback:
                      'This abandons the stated goal (personalization) entirely and contradicts the survey\'s opening premise (echoed in §9.4) that "good enough at pretraining time" is not the same as good for a specific user/context. §9.4 explicitly describes a low-cost path (on-device tool modules) that the lab\'s constraints do not actually rule out.',
                  },
                ],
              },
            ],
            debrief:
              'Across all four systems, the same move recurs: identify what signal is actually available (execution feedback? holistic acceptance? sparse binary reward?), what can actually be adapted (agent weights? a tool/retriever? a per-user module?), and what constraints bound the choice (compute, access, safety, irreversibility). The A1/A2/T1/T2 framework is not a label to assign after the fact — it is the question to ask first: "given THIS system\'s feedback, access, and constraints, where should adaptation effort go, and how will we know it worked?" That is the question Section 10 opens with, and it is the question every module in this subject has been building toward answering.',
          },
        },
      ],
    },
  ],
}
