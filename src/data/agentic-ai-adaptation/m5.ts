import type { Module } from '../../types'
import benchmarksMd from '../md/aaa-e-benchmarks.md?raw'
import signalMetricsMd from '../md/aaa-e-signal-metrics.md?raw'
import dynamicsMd from '../md/aaa-e-dynamics.md?raw'
import systemicMd from '../md/aaa-e-systemic.md?raw'
import discussionMd from '../md/aaa-e-discussion.md?raw'

export const m5: Module = {
  id: 'aaa-m5',
  title: 'Evaluation: Measuring Adaptation Across A1/A2/T1/T2',
  description:
    'How the field measures whether adaptation actually worked — the benchmark landscape mapped to the four paradigms, the two metric families that capture the adaptation signal, dynamics-aware evaluation of efficiency/generalization/stability, systemic concerns (cost, safety, alignment), and where current evaluation practice still falls short.',
  lessons: [
    {
      id: 'aaa-e-benchmarks',
      title: 'The Benchmark Landscape Mapped to A1/A2/T1/T2',
      minutes: 12,
      xp: 60,
      steps: [
        { kind: 'read', title: 'Which benchmarks measure which paradigm', markdown: benchmarksMd },
        {
          kind: 'quiz',
          title: 'Reading the benchmark map',
          questions: [
            {
              prompt:
                'A system scores very high on SWE-Bench pass@k (A1-style execution signal) but low on a holistic code-quality judge (A2-style). What does this pattern most likely indicate?',
              options: [
                'The benchmark is broken and should be discarded',
                'A synthesis bottleneck — the opposite pattern (high A1, low A2)',
                'Test-gaming — the agent is optimizing the execution signal without producing genuinely good code, the A1/A2 gap the survey calls out for code',
                'The model needs more parameters, full stop',
              ],
              answer: 2,
              explanation:
                'Section 7.1 names this exact pattern: high pass@k (A1) with low code quality (A2) indicates test-gaming. The A1-A2 gap is itself a diagnostic — orthogonal metrics expose orthogonal failure modes.',
            },
            {
              prompt:
                'Why does Section 7.1 single out T2 as "the least standardized" benchmark category, and what is the methodological fix it points to?',
              options: [
                'T2 tools are too small to benchmark meaningfully',
                'T2 evaluation requires counterfactual comparison — holding the frozen agent fixed and varying only the tool — and dedicated benchmarks for this remain scarce, with most evaluation happening as one-off per-paper ablations',
                'T2 tools never need evaluation because the agent is frozen',
                'T2 benchmarks are identical to T1 benchmarks, so no separate standard is needed',
              ],
              answer: 1,
              explanation:
                'T2 must isolate a tool\'s marginal contribution to a fixed agent\'s performance — the counterfactual comparison pattern used by S3 and AgentFlow. Dedicated, standardized benchmarks for this remain scarce; most T2 evaluation is an ablation inside an individual paper (Section 7.1).',
            },
            {
              prompt:
                'Integrated benchmarks like WebArena, τ-Bench, and AgencyBench evaluate the full agent-tool system in realistic environments. What key limitation does Section 7.1 attribute to this category?',
              options: [
                'They are too small in scale to be useful',
                'They only support A1 evaluation, never A2',
                'They typically report only endpoint metrics, making it impossible to isolate which adaptation paradigm drove an observed gain',
                'They cannot be run in sandboxed environments',
              ],
              answer: 2,
              explanation:
                'These benchmarks stress-test agent-tool interaction at scale but report a single endpoint number — you can see *that* the system improved but not *which paradigm* (better reasoning, better retrieval, a better adapted subagent...) was responsible (Section 7.1).',
            },
          ],
        },
      ],
    },
    {
      id: 'aaa-e-signal-metrics',
      title: 'Two Metric Families: Verifiable Execution vs. Holistic Utility',
      minutes: 12,
      xp: 60,
      steps: [
        { kind: 'read', title: 'Where the evaluation signal comes from', markdown: signalMetricsMd },
        {
          kind: 'quiz',
          title: 'Signal families and their trade-offs',
          questions: [
            {
              prompt:
                'Search-R1 needs roughly 170k training examples under a sparse holistic reward, while ReTool shows that adding dense execution feedback into RL rollouts accelerates convergence. What general claim does Section 7.2.2 draw from this pattern?',
              options: [
                'Holistic metrics are always more accurate than execution metrics',
                'Dense signals (verifiable execution, A1/T1) accelerate learning relative to sparse signals (holistic utility, A2/T2) — a pattern consistent across domains',
                'Sparse rewards should never be used in agentic RL',
                'Execution feedback eliminates the need for any holistic evaluation',
              ],
              answer: 1,
              explanation:
                'Section 7.2.2 frames this as a general, cross-domain pattern: holistic metrics are sparse (one signal per episode), and sparsity has a concrete training cost — dense execution signals consistently speed convergence wherever they\'re available.',
            },
            {
              prompt:
                'Why is "credit-assignment opacity" described as especially costly for T2 evaluation specifically?',
              options: [
                'T2 tools are never evaluated with holistic metrics',
                'T2\'s entire goal is to isolate one tool\'s marginal contribution to a frozen agent\'s performance — but when the final answer is wrong, a holistic metric alone can\'t tell you whether the tool, the agent\'s reasoning, or the synthesis was at fault',
                'T2 systems do not produce a final answer at all',
                'Credit-assignment opacity only affects A1 systems',
              ],
              answer: 1,
              explanation:
                'Per Section 7.2.2, holistic metrics give one signal per episode without revealing which stage failed. For T2 — whose entire premise is measuring one component\'s marginal value — that opacity is especially damaging, which is why counterfactual comparison (Section 7.1/7.5.2) becomes necessary.',
            },
            {
              prompt:
                'BGM finds a "preference gap" in retrieval-augmented systems. What does it describe, and which metric family does it expose a blind spot in?',
              options: [
                'Users prefer slower retrieval systems — a gap in cost metrics',
                'High retrieval recall (a verifiable execution metric) does not guarantee high downstream utility, because retrievers optimize surface-level relevance while LLMs need contextual coherence and inferential support — a blind spot in execution metrics that only a holistic/downstream measure can reveal',
                'LLM judges always prefer their own outputs — a gap in holistic metrics only',
                'Formal verifiers cannot evaluate retrieval at all',
              ],
              answer: 1,
              explanation:
                'Per Section 7.2.1, BGM shows recall (the verifiable execution metric for retrieval) can be high while downstream usefulness is low — exactly the "local but not sufficient" limitation of execution metrics that holistic evaluation is needed to catch.',
            },
          ],
        },
      ],
    },
    {
      id: 'aaa-e-dynamics',
      title: 'Adaptation Dynamics: Efficiency, Generalization, Stability',
      minutes: 13,
      xp: 65,
      steps: [
        { kind: 'read', title: 'What endpoint metrics erase', markdown: dynamicsMd },
        {
          kind: 'quiz',
          title: 'Dynamics-aware evaluation',
          questions: [
            {
              prompt:
                'S3 (T2) reaches accuracy comparable to Search-R1 (A2) with roughly 70x fewer training examples on retrieval — but for code, RLEF shows A1 is more data-efficient than the equivalent A2 approach. What does Section 7.3.1 conclude from these two cases together?',
              options: [
                'A1 is always more efficient than A2, across every domain',
                'T2 is always more efficient than A1',
                'Efficiency is not a fixed property of a paradigm — it depends on the interaction between paradigm, signal density, and task structure, since the two cases show opposite paradigm rankings',
                'Data efficiency cannot be measured for agentic systems',
              ],
              answer: 2,
              explanation:
                'The retrieval case favors T2 over A2 by 70x, while the code case favors A1 over A2 for the opposite reason (dense per-test rewards). Section 7.3.1 explicitly draws the conclusion that efficiency depends on paradigm x signal density x task structure, not on the paradigm label alone.',
            },
            {
              prompt:
                'The survey describes "co-adaptation stability" as an open problem when both agent and tools adapt simultaneously. Which statement accurately reflects its status per Section 7.3.3?',
              options: [
                'It has been fully solved using entropy-based diagnostics from single-agent RL',
                'It is well-studied in multi-agent RL but has not been formalized for the agent-tool setting; the survey proposes candidate metrics (trajectory variance, sign changes in the performance gradient, convergence rate) as a research agenda, not established practice',
                'It only matters for T1 tools, which are trained independently',
                'Co-adaptation instability cannot occur because agents and tools are always trained separately',
              ],
              answer: 1,
              explanation:
                'Section 7.3.3 is explicit: no existing work has systematically measured co-adaptation stability for agent-tool systems. The candidate metrics it lists are framed as "theoretical propositions that require future empirical validation," delineating the problem rather than claiming it is solved.',
            },
            {
              prompt:
                'Two code-generation agents reach identical pass@k scores. An entropy-dynamics analysis shows one is near "entropy exhaustion" and the other retains exploration capacity. Per Section 7.3.3, what does H(π) and ΔH together let you diagnose that the endpoint score cannot?',
              options: [
                'Which agent used more GPU memory during training',
                'Whether the agent near entropy exhaustion has hit a predictable performance ceiling (rapid entropy depletion signaling premature convergence), versus the other agent whose retained exploration and entropy-change behavior suggest more headroom and/or training instability',
                'Which agent will generalize better to a different programming language, with certainty',
                'The exact number of tool calls each agent will make in deployment',
              ],
              answer: 1,
              explanation:
                'Section 7.3.3 frames H(π) (breadth of exploration) and ΔH (per-update entropy change) as a lightweight diagnostic of adaptation health: rapid entropy depletion implies a predictable ceiling, while large |ΔH| fluctuations signal instability — neither visible from a single pass@k number.',
            },
          ],
        },
      ],
    },
    {
      id: 'aaa-e-systemic',
      title: 'Systemic Evaluation: Cost, Safety, Alignment',
      minutes: 12,
      xp: 60,
      steps: [
        { kind: 'read', title: 'Beyond accuracy: what deployment actually checks', markdown: systemicMd },
        {
          kind: 'quiz',
          title: 'Cost, safety, and alignment trade-offs',
          questions: [
            {
              prompt:
                'Per Section 7.4.1, why is T1 (e.g., fine-tuning a retriever) typically described as the cheapest adaptation paradigm to train?',
              options: [
                'T1 tools never need to be evaluated',
                'It uses standard supervised learning on curated datasets without requiring agent interaction, so cost is dominated by dataset curation rather than compute — unlike A2, which needs large-scale RL on ~170k examples',
                'T1 tools are always smaller than 1B parameters',
                'T1 training happens automatically with no human involvement',
              ],
              answer: 1,
              explanation:
                'Section 7.4.1 contrasts T1\'s standard supervised fine-tuning (cost dominated by data curation) with A2\'s large-scale RL (Search-R1\'s ~170k examples) and T2\'s lightweight-subagent training (e.g., AgentFlow\'s 7B planner) — T1 is positioned as the cheapest and best-understood.',
            },
            {
              prompt:
                'Per the reward-hacking susceptibility table in Section 7.4.2, why are A2 methods described as MORE susceptible to reward hacking than A1?',
              options: [
                'A2 methods are newer and less tested',
                'A2 relies on sparse holistic rewards (final-answer EM, LLM-as-judge), which give the agent more degrees of freedom to satisfy the metric without genuinely solving the task — whereas A1\'s dense execution rewards are grounded in deterministic tool output and harder to game',
                'A2 methods do not use reinforcement learning at all',
                'A1 methods are never susceptible to reward hacking under any conditions',
              ],
              answer: 1,
              explanation:
                'Section 7.4.2\'s table is explicit: A1\'s dense, deterministic execution rewards are harder to game, while A2\'s sparse holistic rewards leave more "degrees of freedom" for the agent to satisfy the metric without real task-solving.',
            },
            {
              prompt:
                'BGM trains a "bridge model" that translates retriever output into a format the frozen LLM finds useful, yielding a 38% relative QA accuracy improvement. Which evaluation dimension from Section 7.4.3 does this result demonstrate, and why does it matter beyond this one system?',
              options: [
                'Human-agent alignment — it shows users prefer shorter answers',
                'Agent-tool alignment — it shows that the format match between a tool\'s output and what the agent can consume is itself a measurable, optimizable quantity, distinct from either the tool\'s intrinsic quality or the agent\'s end-to-end score',
                'Unsafe exploration — it shows bridge models prevent dangerous tool calls',
                'Training cost — it shows bridge models are cheaper to train than retrievers',
              ],
              answer: 1,
              explanation:
                'Section 7.4.3 uses BGM\'s 38% gain as concrete evidence that agent-tool format alignment is a real, separately-measurable quantity in modular (T2) systems — neither captured by the tool\'s own quality metrics (Section 7.2.1) nor by end-to-end task success alone.',
            },
          ],
        },
      ],
    },
    {
      id: 'aaa-e-discussion',
      title: 'Discussion: The Dynamics Gap and Next-Gen Benchmarks',
      minutes: 14,
      xp: 68,
      steps: [
        { kind: 'read', title: 'What evaluation reveals, reshapes, and still misses', markdown: discussionMd },
        {
          kind: 'scenario',
          title: 'Designing an evaluation suite for a new adaptation method',
          scenario: {
            intro:
              'You are designing the evaluation suite for a new T2 method: a small subagent that learns to rerank search results under a frozen, larger reasoning agent. Reviewers will read Section 7 closely. At each stage, pick the choice that best closes a gap the survey explicitly names in Section 7.5 — not the choice that merely produces a high headline number.',
            stages: [
              {
                situation:
                  'Your first draft reports one number: "the frozen agent + our reranker reaches 81% on a multi-hop QA benchmark, vs. 74% for the frozen agent + a default reranker." A reviewer asks how you know the reranker itself is responsible, and how much data it took to get there.',
                question:
                  'What should you add to address the gap Section 7.5.1 calls the "hidden divergence in efficiency" and the attribution problem from 7.5.2?',
                options: [
                  {
                    label:
                      'Report the counterfactual delta (with/without the adapted reranker, agent held fixed — already done) AND a learning curve showing how many training examples the reranker needed to reach 81%, compared to an A2 baseline that fine-tunes the whole agent for the same task',
                    quality: 'best',
                    feedback:
                      'This directly answers both gaps: the counterfactual swap isolates the reranker\'s marginal contribution (Section 7.5.2), and the data-efficiency comparison surfaces exactly the kind of "70x fewer examples" divergence Section 7.5.1 calls invisible to endpoint numbers alone — even if both approaches land near 81%.',
                  },
                  {
                    label:
                      'Re-run the same benchmark five more times and report the average to reduce noise',
                    quality: 'bad',
                    feedback:
                      'Averaging seeds is good statistical hygiene, but it does nothing to address attribution (is the reranker responsible?) or the efficiency dimension Section 7.5.1 flags as hidden by endpoint metrics. The headline number stays a single point either way.',
                  },
                  {
                    label:
                      'Add an LLM-as-judge score on the final answers to make the evaluation feel more holistic',
                    quality: 'ok',
                    feedback:
                      'An additional holistic metric is not wrong, but it does not address the specific gaps raised here — attribution (already partly handled by your counterfactual setup) and the hidden efficiency divergence. It adds a metric without closing either gap, and introduces LLM-judge biases (Section 7.2.2) you\'d now also need to manage.',
                  },
                ],
              },
              {
                situation:
                  'Training logs show the reranker\'s reward curve climbed quickly and then plateaued. A teammate says "great, it converged — ship it." You recall Section 7.3.3\'s point about entropy dynamics and Section 7.4.2\'s point about reward hacking.',
                question:
                  'Before treating the plateau as success, what should you check, consistent with Sections 7.3.3 and 7.4.2?',
                options: [
                  {
                    label:
                      'Check whether the plateau coincides with entropy exhaustion (a predictable ceiling, not necessarily "done") and run a held-out test distribution plus a spot-check of high-reward trajectories to rule out the reranker learning to inflate the frozen agent\'s score without improving real utility (tool-level reward hacking)',
                    quality: 'best',
                    feedback:
                      'This is exactly the pairing the survey draws: Section 7.3.3\'s entropy diagnostic distinguishes "ran out of exploration" from "found the optimum," and Section 7.4.2 names T2-specific reward hacking (the tool inflating the frozen agent\'s training-distribution score without real gains) as a distinct risk that a plateaued reward curve alone cannot rule out.',
                  },
                  {
                    label:
                      'Ship it — a plateaued reward curve is the standard definition of convergence and nothing more needs checking',
                    quality: 'bad',
                    feedback:
                      'Section 7.3.3 explicitly warns that a smooth-looking curve can mask entropy exhaustion (a ceiling, not necessarily a good optimum), and Section 7.4.2 notes T2 tools can learn to inflate a frozen agent\'s training-distribution score without real utility gains. A plateau alone confirms neither is absent.',
                  },
                  {
                    label:
                      'Increase the learning rate to push past the plateau and get a higher reward',
                    quality: 'ok',
                    feedback:
                      'This treats the plateau as a optimization problem to push through, which might be reasonable on its own — but it skips the diagnostic step entirely. If the plateau reflects reward hacking, a higher reward from a higher learning rate makes the problem worse, not better, without the checks from Sections 7.3.3/7.4.2 in place first.',
                  },
                ],
              },
              {
                situation:
                  'Final write-up time. Your suite now has: counterfactual deltas, a learning curve, entropy diagnostics, a held-out reward-hacking check, and the 81% headline number. A co-author suggests this is already more thorough than most papers and asks if anything from Section 7.5.4\'s "next-generation benchmark suites" discussion is worth flagging as a limitation.',
                question:
                  'Which limitation, drawn from Section 7.5.4, is most honest to name given what your suite still does NOT cover?',
                options: [
                  {
                    label:
                      'Your entire suite still evaluates on a static, fixed task set in a single pass — it says nothing about whether the reranker keeps working as the underlying search index, document distribution, or frozen agent\'s needs drift over time, which is the "static tasks vs. dynamic environments" gap Section 7.5.4 identifies as missing from next-generation suites',
                    quality: 'best',
                    feedback:
                      'This is the gap Section 7.5.4 names directly: almost all current benchmarks (including, honestly, the thorough one just built) are fixed-task, single-pass evaluations. They cannot show whether the adapted reranker continues to add value as the environment evolves — exactly the "persistent, evolving environment" capability the survey says next-gen suites need.',
                  },
                  {
                    label:
                      'Nothing — once you have counterfactual deltas, learning curves, entropy diagnostics, and a reward-hacking check, the evaluation is complete and no further limitations need to be named',
                    quality: 'bad',
                    feedback:
                      'This contradicts Section 7.5.4\'s framing directly: it argues current benchmarks "share several systematic limitations" regardless of how many individual dimensions a single paper covers. A thorough single-pass, single-paradigm suite still has the structural gaps the survey names — claiming completeness is the opposite of the survey\'s point.',
                  },
                  {
                    label:
                      'The suite does not include a robot or GUI environment, so it cannot be considered a general agentic benchmark',
                    quality: 'ok',
                    feedback:
                      'True but not the most relevant limitation here — your method is a text-based retrieval reranker, so a GUI/embodied environment isn\'t a natural fit for this specific system. Section 7.5.4\'s sharpest, most applicable points for this case are the static-environment and single-paradigm gaps, not modality coverage.',
                  },
                ],
              },
            ],
            debrief:
              'The throughline across all three stages is Section 7.5\'s core argument: a single headline number — even a good one — hides efficiency divergence, masks reward-hacking and entropy dynamics behind a smooth curve, and says nothing about whether adaptation holds up once the environment starts to change. Counterfactual comparison (7.5.2), dynamics-aware diagnostics (7.3.3/7.4.2), and an honest accounting of what a fixed-task, single-paradigm suite cannot show (7.5.4) are not optional extras — per the survey, they are what separates "this method scored well" from "this method actually adapted well."',
          },
        },
      ],
    },
  ],
}
