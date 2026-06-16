import type { Module } from '../../types'
import frameworkMd from '../md/aaa-c-framework.md?raw'
import toolsAndSynthesisMd from '../md/aaa-c-tools-and-synthesis.md?raw'
import strategyMd from '../md/aaa-c-strategy.md?raw'

export const m4: Module = {
  id: 'aaa-m4',
  title: 'Comparison of Adaptation Paradigms',
  description:
    "Section 6's cross-paradigm synthesis: a shared framework for comparing A1/A2/T1/T2, the causal-feedback-vs-holistic-reward split that separates A1 from A2, the agent-agnostic-vs-agent-supervised split that separates T1 from T2, the A2-vs-T2 data-efficiency case study, and the survey's strategic recommendations for choosing a paradigm.",
  lessons: [
    {
      id: 'aaa-c-framework',
      title: 'A Framework for Comparison: A1 vs A2',
      minutes: 12,
      xp: 60,
      steps: [
        { kind: 'read', title: 'Four axes, then causal vs. holistic signals', markdown: frameworkMd },
        {
          kind: 'quiz',
          title: 'Framework and A1/A2 check',
          questions: [
            {
              prompt:
                'Section 6.1 says A1/A2 provide high "parametric flexibility" while T1/T2 provide high "system-level flexibility." What is the practical difference between these two kinds of flexibility?',
              options: [
                'Parametric flexibility means the system runs faster; system-level flexibility means it uses less memory',
                'Parametric flexibility means the entire agent policy can change; system-level flexibility means capabilities can be added, swapped, or recomposed via tools, but stays bounded by the frozen agent\'s reasoning',
                'They are two names for the same thing, used interchangeably',
                'Parametric flexibility only applies to T1, and system-level flexibility only applies to A2',
              ],
              answer: 1,
              explanation:
                'Per Section 6.1, A1/A2 can reshape the whole policy (parametric flexibility), while T1/T2 can grow, swap, or rewire the tool ecosystem (system-level flexibility) — but the latter is capped by what the frozen agent can actually use. These are genuinely different axes, not synonyms.',
            },
            {
              prompt:
                'DeepRetrieval (A1) is rewarded with Recall@K on its retrieval queries. ReSearch (A2) is rewarded on final-answer correctness across a multi-hop QA trajectory. What does this difference in signal source mean for what each method actually optimizes?',
              options: [
                'Both optimize the same thing; the reward formula is just a stylistic choice',
                'DeepRetrieval optimizes tool-use mechanics — how to use the retriever correctly; ReSearch optimizes tool-use strategy — when, what, and how to search as part of an overall reasoning process',
                'DeepRetrieval optimizes the final answer; ReSearch optimizes individual tool calls',
                'Recall@K and final-answer correctness are mathematically equivalent metrics',
              ],
              answer: 1,
              explanation:
                'Per Section 6.2.1 and 6.2.2, a per-action signal like Recall@K teaches "how to wield this tool correctly" (mechanics, A1), while a holistic signal like final-answer correctness teaches "when/why/how to orchestrate tools as part of the whole process" (strategy, A2). The signal source determines the scope of what gets optimized.',
            },
            {
              prompt:
                'The survey says A2\'s reliance on holistic, outcome-oriented signals makes it vulnerable to "shortcut learning." What does shortcut learning mean in this context, and why doesn\'t A1 share this exact risk?',
              options: [
                'Shortcut learning means the model trains faster than expected — a desirable property A1 lacks',
                'Shortcut learning means the agent gets the right final answer for the wrong reasons, because the signal only checks the destination, not the path; A1\'s signal is tied to individual actions, so it can\'t reward a wrong path that happens to land on a right answer',
                'Shortcut learning only happens when the agent has no access to tools at all',
                'A1 avoids shortcut learning because it never uses reinforcement learning',
              ],
              answer: 1,
              explanation:
                'Per the "Signal Source as a Reliability Axis" discussion in Section 6.2, agent-output signals (A2) are outcome-oriented — they score the final result, so an agent can stumble onto a correct answer via unsound reasoning and still get full reward. A1\'s tool-execution signals are process-oriented and score individual actions, so they don\'t have this particular failure mode (though they have their own blind spot: no view of overall strategy).',
            },
          ],
        },
      ],
    },
    {
      id: 'aaa-c-tools-and-synthesis',
      title: 'T1 vs T2, and the A2-vs-T2 Data-Efficiency Case Study',
      minutes: 13,
      xp: 65,
      steps: [
        { kind: 'read', title: 'Tool-side paradigms and the sharpest comparison', markdown: toolsAndSynthesisMd },
        {
          kind: 'quiz',
          title: 'T1/T2 and the A2-vs-T2 synthesis',
          questions: [
            {
              prompt:
                'In the "Graduation Lifecycle," DeepRetrieval is first trained as an A1 agent, then frozen and redeployed as a T1 tool. What does this lifecycle illustrate about the relationship between the agent-centric and tool-centric paradigms?',
              options: [
                'A1 and T1 are mutually exclusive — a system can never use both',
                'The paradigms can be sequential phases of one component\'s life: an expensive A1/A2 training run can produce a frozen specialist that then becomes a cheap, plug-and-play T1 tool for other agents',
                'Graduation means the agent is retrained from scratch as a T1 system',
                'T1 tools must always be trained using the T1 paradigm from the start',
              ],
              answer: 1,
              explanation:
                'Per Section 6.3.1, the Graduation Lifecycle is Train (A1/A2) → Freeze → Deploy (T1): a specialist trained at A1/A2 cost reaches expert performance, gets frozen, and is then reused as an agent-agnostic T1 tool by any other agent — encapsulating a learned policy, not just a representation, with zero retraining for the new caller.',
            },
            {
              prompt:
                'T2 is described as "inverting the optimization target" and "decoupling skill from knowledge." What does the T2 subagent need to learn that an A2 agent like Search-R1 does not get for free?',
              options: [
                'T2 subagents must learn domain knowledge, reasoning, and tool-use skill simultaneously, exactly like A2',
                'Nothing — T2 subagents require no training at all',
                'The T2 subagent only needs to learn a narrow procedural skill (e.g., how to search, how to write memory), because the frozen host agent already supplies domain knowledge and task reasoning',
                'T2 subagents replace the frozen host agent\'s reasoning entirely',
              ],
              answer: 2,
              explanation:
                'Per Section 6.3.2, a traditional A2 agent must learn domain knowledge, tool-use skill, and task reasoning all at once — a complex, high-dimensional optimization problem. In T2, the frozen generator already has the knowledge and reasoning; the small subagent only needs to learn the procedural skill, which is what "decoupling skill from knowledge" means.',
            },
            {
              prompt:
                'Search-R1 (A2) used roughly 170k training examples; s3 (T2) reached comparable average accuracy (58.9%) with about 2.4k samples. The survey explicitly flags this comparison with a caveat. What is that caveat?',
              options: [
                'The comparison is invalid and should be ignored entirely',
                'It is a suggestive case study, not a controlled experiment — the two systems differ simultaneously in optimization target, backbone composition, and architecture, so the efficiency gap cannot be attributed to paradigm choice alone',
                's3 actually used more total training data than Search-R1 once you count the frozen generator\'s pretraining',
                'The 2.4k figure refers to test samples, not training samples',
              ],
              answer: 1,
              explanation:
                'Per Section 6.4, the survey is explicit that this is "suggestive... not a controlled experiment": Search-R1 trains a full agent end-to-end while s3 trains only a 7B subagent paired with a separate frozen generator, so optimization target, backbone, and architecture all differ at once. The ~2 orders-of-magnitude data gap is real but can\'t be cleanly attributed to "T2 vs A2" in isolation.',
            },
            {
              prompt:
                'Looking at the four-paradigm comparison table, both A1 and A2 share one column value that neither T1 nor T2 has. Which one, and what is it?',
              options: [
                '"Modularity & Evolution: High (Plug-and-Play)" — both A1 and A2 are highly modular',
                '"Cost & Flexibility: High Cost, High Parametric Flexibility" — both A1 and A2 require expensive training of the core agent policy and offer parametric (not system-level) flexibility',
                '"Supervision Signal: Frozen Agent Output" — both A1 and A2 are supervised by a frozen agent',
                '"Locus of Adaptation: External Tool" — both A1 and A2 adapt an external tool',
              ],
              answer: 1,
              explanation:
                'Per Table 5, A1 and A2 both sit in the "High Cost, High Parametric Flex." cell — they both adapt the core agent policy at high training cost, in exchange for parametric (whole-policy) flexibility. T1 and T2 instead sit in "Low Cost, High System Flex." — the locus moves to an external tool and the cost drops.',
            },
          ],
        },
      ],
    },
    {
      id: 'aaa-c-strategy',
      title: 'Strategic Recommendations: Choosing a Paradigm',
      minutes: 13,
      xp: 65,
      steps: [
        { kind: 'read', title: 'A decision procedure for A1/A2/T1/T2', markdown: strategyMd },
        {
          kind: 'scenario',
          title: 'Pick a paradigm for the constraints you\'re given',
          scenario: {
            intro:
              'You\'re advising three different teams, each with a fixed budget, agent-access situation, and signal type. Use Section 6\'s comparison framework — cost/flexibility, data efficiency, generalization, modularity — to pick the paradigm that fits each team\'s constraints, not just the one with the best headline numbers.',
            stages: [
              {
                situation:
                  'Team A integrates with a closed-source frontier model (no fine-tuning access) via API. They have abundant logs of the agent\'s own multi-step trajectories on their domain, and they\'ve noticed the agent is a strong reasoner but consistently bad at one specific step: deciding what to search for and when to stop searching. They want to fix that one weak link without touching the model itself.',
                question: 'Which paradigm fits Team A\'s constraints best?',
                options: [
                  {
                    label:
                      'T2 — train a small subagent (e.g., a search/"Perception" subagent like s3) using the frozen host agent\'s own output as the supervision signal for that one procedural skill.',
                    quality: 'best',
                    feedback:
                      'Right. The agent is closed-source (no A1/A2 possible), the gap is one narrow procedural skill (search timing/targeting) while the host already reasons well, and they have abundant interaction data to derive a frozen-agent supervision signal from. This is exactly the "decoupling skill from knowledge" case Section 6.3.2 describes — a T2 searcher subagent slots in without retraining the host.',
                  },
                  {
                    label:
                      'A2 — retrain the agent end-to-end with a holistic, final-answer reward so it learns better search strategy as part of its overall policy.',
                    quality: 'bad',
                    feedback:
                      'Team A cannot fine-tune this model at all — it\'s closed-source via API. A2 requires updating the core agent\'s parameters, which is off the table here regardless of how well-suited the signal might otherwise be.',
                  },
                  {
                    label:
                      'T1 — find or train an agent-agnostic search tool and plug it in, without using the frozen host\'s feedback at all.',
                    quality: 'ok',
                    feedback:
                      'A generic plug-and-play search tool could help, but it ignores the asset Team A actually has: abundant logs of *this* agent\'s trajectories, which is exactly the frozen-agent supervision signal T2 is built to exploit for higher compatibility and data efficiency. T1 is the right shape (frozen agent, modular tool) but leaves their best signal unused.',
                  },
                ],
              },
              {
                situation:
                  'Team B has full fine-tuning access to their agent (open weights). Their task is multi-hop research: the agent must decide across a long trajectory when to read documents, when to cross-check claims, and when it has enough evidence to answer. No single tool call\'s correctness reliably predicts whether the overall answer will be right — a "successful" search early on can still lead to a wrong conclusion later.',
                question: 'Which paradigm fits Team B\'s task?',
                options: [
                  {
                    label:
                      'A2 — train the agent end-to-end with a holistic, final-answer reward so it internalizes the whole search-reason-verify strategy.',
                    quality: 'best',
                    feedback:
                      'Correct. Team B can fine-tune (A2 is feasible), and the defining feature of their task — no single action\'s correctness predicts overall success — is precisely what A2\'s holistic, outcome-oriented reward is built for (Section 6.2.2). They should accept the retraining cost and forgetting risk because the thing that needs to improve genuinely spans the whole trajectory.',
                  },
                  {
                    label:
                      'A1 — train the agent with a per-action reward (e.g., Recall@K on each search) so every individual tool call is mechanically correct.',
                    quality: 'bad',
                    feedback:
                      'A1\'s signal is scoped to individual actions and is "blind to whether the agent\'s overall reasoning strategy is sound" (Section 6.2). Team B\'s problem is explicitly that per-action correctness doesn\'t predict trajectory-level success — A1\'s signal can\'t see the thing that\'s actually broken.',
                  },
                  {
                    label:
                      'T1 — assemble a pipeline of pre-trained, agent-agnostic retrieval and verification tools and let the existing agent orchestrate them with better prompting.',
                    quality: 'ok',
                    feedback:
                      'Better tools and prompting can help at the margins, but T1/T2 leave the agent\'s policy fixed and remain "bounded by the frozen agent\'s intrinsic reasoning power" (Section 6.1). If the core problem is the agent\'s own multi-step strategic reasoning, and Team B can fine-tune, A2 addresses the actual bottleneck rather than working around it.',
                  },
                ],
              },
              {
                situation:
                  'Team C maintains a production agent platform used by many different downstream teams, each plugging in their own (mostly closed-source) frontier agents. Team C cannot retrain anyone\'s agent. Their goal is to build a code-context-retrieval capability that any of these agents can call, that can be upgraded independently over time without coordinating a retraining cycle with every downstream team.',
                question: 'Which paradigm should Team C build toward?',
                options: [
                  {
                    label:
                      'T1 — build (or graduate, per the Section 6.3.1 lifecycle) an agent-agnostic, plug-and-play retrieval tool, like the SWE-Grep pattern, that any agent can call via a stable interface.',
                    quality: 'best',
                    feedback:
                      'Right. Team C\'s requirements — no retraining access to any consumer\'s agent, a capability usable across *many different* agents, and independent upgradeability — map directly onto T1\'s "high system-level flexibility... plug-and-play" profile (Table 5, Section 6.3.1). The SWE-Grep example is the template: a specialized retrieval subagent, frozen and exposed as a tool any SWE agent can call.',
                  },
                  {
                    label:
                      'T2 — train a retrieval subagent supervised by feedback from one specific downstream agent\'s outputs.',
                    quality: 'ok',
                    feedback:
                      'T2 gets the "no retraining the host" and "modular" properties right, but it specializes the tool to *one* frozen agent\'s feedback — trading away agent-agnosticity for tighter compatibility (Section 6.3.2). Team C needs the tool to serve *many* different downstream agents, which is T1\'s explicit strength, not T2\'s.',
                  },
                  {
                    label:
                      'A1 — fine-tune each downstream team\'s agent with a retrieval-execution reward so it gets better at code-context search.',
                    quality: 'bad',
                    feedback:
                      'Team C cannot retrain any downstream team\'s agent — most are closed-source, and even where they aren\'t, coordinating N separate retraining cycles defeats the goal of one independently-upgradeable shared capability. A1 also doesn\'t produce anything reusable across agents the way a T1 tool does.',
                  },
                ],
              },
            ],
            debrief:
              'The pattern across all three: start from what you can actually change (can you fine-tune the agent at all?), then match the signal you have (per-action vs. holistic vs. frozen-agent feedback) to the paradigm built for it. Team A had a frozen agent plus rich interaction logs for one weak skill — T2. Team B had fine-tuning access and a problem that lives at the trajectory level — A2. Team C needed one capability reusable across many frozen agents — T1. In every case, the "best" answer wasn\'t the paradigm with the flashiest numbers in Table 6 — it was the one whose locus of adaptation, signal type, and modularity profile actually matched the constraint that couldn\'t be negotiated away.',
          },
        },
      ],
    },
  ],
}
