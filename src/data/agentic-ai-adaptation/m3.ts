import type { Module } from '../../types'
import t1FoundationsMd from '../md/aaa-t-t1-foundations.md?raw'
import t1TrainingMd from '../md/aaa-t-t1-training.md?raw'
import t2EarlyMd from '../md/aaa-t-t2-early.md?raw'
import subagentAsToolMd from '../md/aaa-t-subagent-as-tool.md?raw'
import memorySkillsMd from '../md/aaa-t-memory-skills.md?raw'
import skillLibrariesMd from '../md/aaa-t-skill-libraries.md?raw'

export const m3: Module = {
  id: 'aaa-m3',
  title: 'Tool Adaptation: T1 and T2',
  description:
    'How the ecosystem around a frozen agent gets better: agent-agnostic plug-and-play tools (T1) versus tools, subagents, memory, and skill libraries trained under a frozen agent\'s supervision (T2).',
  lessons: [
    {
      id: 'aaa-t-t1-foundations',
      title: 'T1 Foundations: Plug-and-Play Tools',
      minutes: 12,
      xp: 60,
      steps: [
        { kind: 'read', title: "T1: tools that don't know the agent exists", markdown: t1FoundationsMd },
        {
          kind: 'quiz',
          title: 'T1 vs T2, and the orchestration patterns',
          questions: [
            {
              prompt:
                'Section 5 defines T1 as T* = argmax_T O_tool(T) and T2 as T* = argmax_T O_agent(A, T). What is the key difference between O_tool and O_agent?',
              options: [
                'O_tool is always cheaper to compute than O_agent',
                'O_tool measures task-specific or environment-driven improvement independent of any agent, while O_agent incorporates supervision derived from a specific frozen agent\'s outputs',
                'O_tool only applies to vision models, while O_agent only applies to text models',
                'O_agent requires updating the agent\'s own parameters, while O_tool does not',
              ],
              answer: 1,
              explanation:
                'The formal split is about where the optimization signal comes from: O_tool is an objective like retrieval accuracy that exists independent of any agent, while O_agent incorporates "agent-derived supervision, where the agent\'s outputs provide learning signals to refine or align the tool" (Section 5). Neither paradigm updates the agent\'s own parameters — both leave the agent frozen.',
            },
            {
              prompt:
                'ViperGPT has a frozen GPT-3 Codex write Python code that calls find(image, object_name) and compute_depth(image) to compose vision tools. Which orchestration pattern does this exemplify?',
              options: [
                'Prompt-based orchestration, like HuggingGPT',
                'Code-based orchestration: the agent generates executable code that composes tools as functions',
                'Knowledge-graph retrieval, like SciToolAgent',
                'Multimodal bridging, like Visual ChatGPT',
              ],
              answer: 1,
              explanation:
                'ViperGPT "introduced code generation as the orchestration mechanism" (Section 5.1.1) — the frozen Codex writes Python that chains GLIP, SAM, and MiDaS as simple functions, giving more flexible composition than fixed API calls without learning tool-specific interfaces.',
            },
            {
              prompt:
                'The survey says Anthropic\'s "Code Execution with MCP" paradigm is positioned as a bridge from T1 toward T2-style optimization. Why?',
              options: [
                'Because MCP servers must be retrained for every new agent',
                'Because writing code to interact with MCP servers, instead of token-level tool calls, dynamically improves efficiency under a frozen agent — an agent-derived improvement, even though MCP itself is T1 infrastructure',
                'Because MCP eliminates the need for any tool descriptions',
                'Because MCP only works with vision models',
              ],
              answer: 1,
              explanation:
                'MCP itself is described as "a scalable T1-style tool adaptation infrastructure that decouples execution from inference," but the code-execution mode "bridges toward T2-style optimization by dynamically improving efficiency under frozen agents" (Section 5.1.1) — the efficiency gain is tied to how the frozen agent uses it, which is the defining flavor of T2.',
            },
          ],
        },
      ],
    },
    {
      id: 'aaa-t-t1-training',
      title: 'How T1 Tools Get Trained',
      minutes: 11,
      xp: 58,
      steps: [
        { kind: 'read', title: 'Training agent-agnostic tools', markdown: t1TrainingMd },
        {
          kind: 'quiz',
          title: 'Objectives, modalities, and graduation',
          questions: [
            {
              prompt:
                'Section 5.1.2 says models producing "structured, evaluable outputs (code, retrieval results)" are most naturally upgraded to T2, while models producing "perceptual features (vision, speech)" remain predominantly T1 plug-ins. What is the underlying reason for this split?',
              options: [
                'Vision and speech models are too large to ever be retrained',
                'A frozen agent can automatically score structured, evaluable outputs (e.g., did this retrieved document help?), but has no cheap, automatic way to judge whether a vision embedding or speech transcript is "correct"',
                'Code and retrieval tools were invented more recently than vision tools',
                'T2 only applies to text-only systems by definition',
              ],
              answer: 1,
              explanation:
                'The split is about scoreability: outputs like retrieval rankings or generated code can be automatically evaluated by a frozen agent (does this help my answer? does this code pass tests?), supplying the agent-derived signal T2 needs. Perceptual features like a CLIP embedding have no such cheap, automatic agent-side score, so they stay frozen T1 plug-ins.',
            },
            {
              prompt:
                'In the T1 training loop (flowchart), where does the "Agent" box sit relative to the tool\'s training objective?',
              options: [
                'The Agent provides gradient updates to the tool during training',
                'The Agent is purely a downstream consumer — drawn only to show where the trained tool ends up, with no role in shaping the training objective or data',
                'The Agent and the tool are trained jointly in an alternating loop',
                'The Agent selects which training examples the tool sees',
              ],
              answer: 1,
              explanation:
                'The defining property of T1 is that the tool is trained "to convergence against its own objective, using its own data, completely independent of any downstream agent." The Agent box appears only as the eventual caller of the frozen, deployed module — it never appears upstream of the training loop.',
            },
            {
              prompt:
                'DeepRetrieval and Code-R1 were introduced in an earlier module as A2-trained agents. The lesson says that once their training finishes and they are frozen, they "extend the tool ecosystem... exactly like CLIP or DPR do." What does this illustrate about the T1/T2 boundary?',
              options: [
                'A1/A2 and T1/T2 are mutually exclusive categories that a system can never cross',
                'A model that was an agent during its own training becomes a T1 tool the moment it is frozen and handed to a different agent — the "graduation lifecycle" that continually enriches the T1 ecosystem',
                'DeepRetrieval and Code-R1 must be retrained from scratch before any other agent can call them',
                'Only vision models can graduate from A2 to T1',
              ],
              answer: 1,
              explanation:
                'The lesson describes the "graduation lifecycle (A1 -> T1)": once a model finishes its own A1/A2-style training and is frozen, it becomes just another callable T1 tool for someone else\'s agent — reformulating queries or generating code as a fixed module, exactly like CLIP or a dense retriever.',
            },
          ],
        },
      ],
    },
    {
      id: 'aaa-t-t2-early',
      title: 'T2 Origins: Proxy Signals to Structured Preferences',
      minutes: 12,
      xp: 60,
      steps: [
        { kind: 'read', title: "T2's first wave: proxy signals to structured preferences", markdown: t2EarlyMd },
        {
          kind: 'quiz',
          title: 'From perplexity to bridge models',
          questions: [
            {
              prompt:
                'REPLUG trains a retriever using the loss L_REPLUG = D_KL(P_retriever(d|q) || P_LM-perplexity(d|q)). What is P_LM-perplexity(d|q) measuring, and why is it a useful T2 signal?',
              options: [
                'It measures how often document d appears in the LM\'s pretraining data',
                'It measures how much conditioning on document d reduces the frozen LM\'s perplexity for query q — a document that lowers perplexity more is treated as more useful context, giving the retriever a training target derived purely from the frozen LM\'s own computation',
                'It measures the human-annotated relevance score for document d',
                'It measures the retriever\'s own confidence, independent of the LM',
              ],
              answer: 1,
              explanation:
                'P_LM-perplexity(d|q) reflects "how strongly each document reduces the LM\'s perplexity when conditioned on query q." REPLUG trains the retriever to match this distribution, which "enabled retrieval adaptation without parameter access to the LM" — the frozen LM\'s internal computation becomes the supervision signal, the defining T2 move.',
            },
            {
              prompt:
                'RA-DIT defines document utility as Utility(d, q, a) = log P_LM(a|q,d) - log P_LM(a|q). How does this differ from REPLUG\'s perplexity-based signal?',
              options: [
                'It is identical to REPLUG\'s signal, just written differently',
                'It directly measures how much a document increases the probability of the correct answer a, rather than just reducing general perplexity — a more task-aligned, preference-based signal than a proxy metric',
                'It requires access to the LM\'s internal weights, unlike REPLUG',
                'It only works for multiple-choice questions',
              ],
              answer: 1,
              explanation:
                'REPLUG\'s perplexity signal is a proxy: lower perplexity doesn\'t guarantee a correct answer. RA-DIT\'s utility is the log-probability *gain for the correct answer a* — a structured, preference-based signal that "marks a conceptual shift from proxy-based to task-aligned supervision" (Section 5.2.1).',
            },
            {
              prompt:
                'BGM trains a T5-XXL "bridge model" between a frozen retriever and a frozen generator, lifting HotpotQA exact-match from 25.8% to 35.6%. The lesson frames this as "decompose, don\'t overload." What does that mean here?',
              options: [
                'The retriever should be discarded and replaced entirely by the bridge model',
                'Rather than making one retriever simultaneously satisfy IR metrics and LLM reasoning preferences, the retriever handles broad recall while a separately trained bridge model handles preference alignment — each tool optimizes one sub-problem',
                'The bridge model and retriever must always be trained on identical data',
                'BGM eliminates the need for any reinforcement learning stage',
              ],
              answer: 1,
              explanation:
                'BGM addresses the "preference gap" between surface-level retrieval relevance and LLM-useful context by splitting responsibilities: "the retriever handles broad recall, while the bridge model handles preference alignment." This decomposition into a cascaded pipeline (query reformulator -> retriever -> reranker/bridge) recurs across the most successful T2 systems.',
            },
          ],
        },
      ],
    },
    {
      id: 'aaa-t-subagent-as-tool',
      title: 'Subagent-as-Tool',
      minutes: 14,
      xp: 68,
      steps: [
        { kind: 'read', title: 'A trained subagent the main agent calls', markdown: subagentAsToolMd },
        {
          kind: 'code',
          title: 'Quantifying s3\'s data efficiency',
          challenge: {
            prompt: `s3 trains a 7B "searcher" subagent using **Gain Beyond RAG (GBR)**:

\`GBR = Accuracy(G_frozen(q, D_s3), a) - Accuracy(G_frozen(q, D_naive), a)\`

— the accuracy of the frozen generator using the trained searcher's documents,
minus its accuracy using naive top-k retrieval's documents.

The survey also reports a data-efficiency comparison: s3 reaches its results with
**2.4k training samples**, versus Search-R1's **~170k examples** (an A2-style
agent trained end-to-end).

Implement two functions:

1. \`gainBeyondRAG(accS3, accNaive)\` — returns \`accS3 - accNaive\` (the GBR value).
2. \`dataEfficiencyRatio(largeSamples, smallSamples)\` — returns how many times
   more data \`largeSamples\` is than \`smallSamples\`, i.e. \`largeSamples /
   smallSamples\`, rounded to the nearest whole number.

Use these to confirm: (a) on medical QA, s3 (76.6%) beats Search-R1 (71.8%) by
the reported GBR-style margin, and (b) Search-R1's training set is roughly 70x
larger than s3's.`,
            starterCode: `function gainBeyondRAG(accS3, accNaive) {
  // TODO: return accS3 - accNaive
  return 0
}

function dataEfficiencyRatio(largeSamples, smallSamples) {
  // TODO: return largeSamples / smallSamples, rounded to nearest whole number
  return 0
}`,
            solution: `function gainBeyondRAG(accS3, accNaive) {
  return accS3 - accNaive
}

function dataEfficiencyRatio(largeSamples, smallSamples) {
  return Math.round(largeSamples / smallSamples)
}`,
            tests: `test('gainBeyondRAG returns the accuracy difference', () => {
  const gbr = gainBeyondRAG(58.9, 50.0)
  assertEqual(Math.round(gbr * 10) / 10, 8.9)
})

test('gainBeyondRAG on the medical QA numbers from the survey', () => {
  const gbr = gainBeyondRAG(76.6, 71.8)
  assertEqual(Math.round(gbr * 10) / 10, 4.8)
})

test('gainBeyondRAG can be negative when naive retrieval wins', () => {
  assertEqual(gainBeyondRAG(40, 45), -5)
})

test('dataEfficiencyRatio computes the ~70x figure from the survey', () => {
  assertEqual(dataEfficiencyRatio(170000, 2400), 71)
})

test('dataEfficiencyRatio with equal sample counts is 1x', () => {
  assertEqual(dataEfficiencyRatio(5000, 5000), 1)
})`,
          },
        },
        {
          kind: 'quiz',
          title: 'Subagents under frozen supervision',
          questions: [
            {
              prompt:
                'QAgent\'s Stage 1 rewards a 3B search agent based on whether its own generated answer is correct, which causes reward hacking. Stage 2 switches to R_Stage2 = I[G_frozen(q, D_agent) = a_correct]. What problem does this fix?',
              options: [
                'It makes training faster by removing the frozen generator entirely',
                'It prevents the searcher from learning to retrieve shallow, easily-copyable evidence that lets its own answer look correct, by instead rewarding it only when a separate frozen generator can answer correctly using its retrieved documents',
                'It increases the size of the training dataset from 2.4k to 170k examples',
                'It removes the need for any retrieval step',
              ],
              answer: 1,
              explanation:
                'Stage 1\'s self-scored reward "encourages reward hacking, where the agent prefers shallow, easily copyable evidence over genuinely informative documents." Stage 2 decouples evaluation from generation: the searcher is rewarded only when the frozen generator succeeds using its documents, "reinforcing a core T2 principle: the frozen generator should not only consume a tool\'s outputs but also supervise its learning."',
            },
            {
              prompt:
                'AgentFlow decomposes an agent into planner, tool executor, verifier, and solution generator — but only the planner is trained, using Flow-GRPO with a single trajectory-level reward broadcast to all decisions. Why train only the planner?',
              options: [
                'Because the other modules cannot run on the same hardware',
                'Because the other modules are kept as frozen specialists, and learned orchestration of those frozen specialists by a single trained planner is enough to rival or surpass much larger monolithic models',
                'Because Flow-GRPO can only optimize one module at a time for technical reasons unrelated to the design',
                'Because the verifier and solution generator are not needed at inference time',
              ],
              answer: 1,
              explanation:
                'AgentFlow keeps tool executor, verifier, and solution generator as frozen Qwen2.5-7B-Instruct modules and trains only the planner. The result — a 7B planner beating much larger models on several benchmarks — demonstrates "that learned orchestration of frozen specialists can rival or surpass monolithic models," which is the point of training just the orchestration layer.',
            },
            {
              prompt:
                'In the sequence diagram of main-agent <-> subagent-as-tool interaction, what becomes the training signal sent back to the subagent?',
              options: [
                'The raw text of the subagent\'s intermediate reasoning steps',
                'A function of the main agent\'s downstream outcome after using the subagent\'s result — e.g. GBR, an accuracy gain, or a GPT-4o judgment of the final trajectory',
                'The number of tool calls the subagent made',
                'A fixed reward that does not depend on the subagent\'s output at all',
              ],
              answer: 1,
              explanation:
                'Across all four subagent families, the loop closes the same way: the subagent returns a result, the main agent produces a downstream output using it, and that outcome — measured as GBR (s3), accuracy with vs. without a graph (AutoGraph-R1), or a GPT-4o correctness judgment (AgentFlow) — becomes the training signal fed back to the subagent.',
            },
          ],
        },
      ],
    },
    {
      id: 'aaa-t-memory-skills',
      title: 'Agentic Memory as a T2 Tool',
      minutes: 13,
      xp: 65,
      steps: [
        { kind: 'read', title: 'Memory as a T2-trained tool', markdown: memorySkillsMd },
        {
          kind: 'quiz',
          title: 'Memory architectures and the T2 loop',
          questions: [
            {
              prompt:
                'Per Hu et al.\'s framework discussed in the lesson, why is "skill-based memory" described as bridging T1 and T2, while case-based and strategy-based memory are predominantly T2?',
              options: [
                'Skill-based memory is always stored in a database, while the others are stored in files',
                'Case-based and strategy-based memory are retained based on the frozen agent\'s own success/failure signal (T2), while skill-based memory spans both agent-curated skill libraries (T2) and pre-trained, agent-agnostic tool APIs (T1)',
                'Skill-based memory cannot be updated after deployment',
                'Only skill-based memory uses any form of retrieval',
              ],
              answer: 1,
              explanation:
                'The lesson\'s table maps case-based and strategy-based memory to T2 ("the frozen agent\'s success or failure determines what is retained"), while skill-based memory "bridges T2 (skill libraries curated by agent feedback) and T1 (pre-trained tool APIs that are agent-agnostic)" — it can be either, depending on whether the skill was distilled from the agent\'s own experience or shipped as a fixed API.',
            },
            {
              prompt:
                'MemGPT, Generative Agents/A-MEM, and HippoRAG/SHIMI represent three different families of dynamic memory stores. What organizes this three-way split?',
              options: [
                'The programming language each system is implemented in',
                'How each system organizes stored information: hierarchical/OS-inspired (explicit tiers with eviction policies), reflection-based (the agent\'s own outputs decide what to consolidate), and graph/structured (memories indexed by relational or semantic structure rather than recency)',
                'Whether the system is open-source or proprietary',
                'The size of the underlying LLM used by each system',
              ],
              answer: 1,
              explanation:
                'The lesson groups foundational T2 memory architectures by organizational principle: MemGPT/Memory OS impose explicit working-vs-long-term tiers with page-eviction; Generative Agents/A-MEM let the agent\'s own reflections decide what gets consolidated; HippoRAG/SHIMI index memory by relational or semantic structure instead of recency. The choice determines a trade-off between recall speed and associative richness.',
            },
            {
              prompt:
                'In Memento, a frozen GPT-4.1 planner is paired with a trainable episodic case-memory module — specifically a neural Q-function. What exactly does this Q-function learn, and what is the training signal?',
              options: [
                'It learns to generate the planner\'s responses directly, trained on human-written demonstrations',
                'It learns a case-retrieval policy — which past cases to present to the frozen planner for a new problem — trained via soft Q-learning on binary task success/failure broadcast across the trajectory\'s case-selection decisions',
                'It learns to fine-tune GPT-4.1\'s weights using gradient descent on retrieval accuracy',
                'It learns to summarize documents for a separate, unrelated summarization task',
              ],
              answer: 1,
              explanation:
                'Memento trains *only* the memory: the Q-function "learns a case retrieval policy: which past cases to present to the frozen planner when facing a new problem." The signal is "binary task success or failure," with "the sparse, trajectory-level reward... broadcast to all case-selection decisions in that trajectory" via soft Q-learning — the frozen LLM never sees the Q-values, just the retrieved cases.',
            },
            {
              prompt:
                'In the reflective-memory loop diagram (Agent acts -> Outcome -> Memory write -> Memory read -> Agent on a future task), which two components are the trainable T2 surfaces?',
              options: [
                'The frozen agent\'s weights, both times it appears in the loop',
                'The write policy (what to store and how to structure it) and the read/retrieval policy (what to retrieve for a future task) — the agent itself stays frozen throughout',
                'Only the outcome signal itself is trainable',
                'The environment the agent acts in',
              ],
              answer: 1,
              explanation:
                'The loop\'s point is that the agent is frozen on both ends — what changes is the memory store\'s write policy (e.g., Dynamic Cheatsheet\'s Memory Curator deciding what snippets to keep) and its read/retrieval policy (e.g., Memento\'s Q-function deciding which cases to surface). These are the T2-trained components; the agent producing and consuming memory never updates.',
            },
          ],
        },
      ],
    },
    {
      id: 'aaa-t-skill-libraries',
      title: 'Skill Libraries: Discovery, Invocation, Refinement',
      minutes: 13,
      xp: 65,
      steps: [
        { kind: 'read', title: 'Discovery, invocation, refinement', markdown: skillLibrariesMd },
        {
          kind: 'scenario',
          title: 'Choosing T1 vs. T2 tool adaptation under constraints',
          scenario: {
            intro:
              'You are designing the tool ecosystem for a new coding agent that operates inside a customer\'s sandboxed CI environment. The frozen foundation model cannot be retrained (cost, governance). For each constraint below, decide whether a T1 (agent-agnostic, pre-trained) or T2 (agent-supervised) tool-adaptation approach fits best, drawing on the T1/T2 distinctions and examples from this module.',
            stages: [
              {
                situation:
                  'The agent needs a dense retriever over the customer\'s internal documentation to ground its answers. You have no budget to collect preference data or run RL, and the customer wants something working this week.',
                question: 'Which approach should you start with?',
                options: [
                  {
                    label:
                      'Deploy a pre-trained T1 retriever (e.g., a Contriever- or e5-style bi-encoder) as a frozen plug-in, trained on its own contrastive objective independent of this agent',
                    quality: 'best',
                    feedback:
                      "Correct. This is exactly the T1 starting point the module describes: bi-encoder retrievers like DPR, ColBERT, Contriever, and e5 are \"often deployed as frozen components within retrieval-augmented generation pipelines,\" requiring no agent-specific training. It's deployable immediately and gives you a baseline to later upgrade via T2 if needed.",
                  },
                  {
                    label:
                      'Skip retrieval and rely on the frozen agent\'s parametric knowledge of the customer\'s documentation',
                    quality: 'bad',
                    feedback:
                      'The frozen foundation model has no knowledge of this customer\'s private documentation at all — this is exactly the gap T1 retrieval tools exist to fill. Skipping retrieval isn\'t a tool-adaptation choice, it\'s skipping the tool.',
                  },
                  {
                    label:
                      'Start by training a REPLUG-style retriever using the frozen agent\'s perplexity as the signal, before deploying anything',
                    quality: 'ok',
                    feedback:
                      'REPLUG-style T2 training can improve a retriever beyond a generic T1 baseline, but it requires a training loop and data collection before anything ships — at odds with "working this week." Better to deploy a T1 retriever first and consider T2 refinement once the system is live and you have feedback to learn from.',
                  },
                ],
              },
              {
                situation:
                  'Three months in, telemetry shows the T1 retriever often returns documents that are topically relevant but don\'t actually help the frozen agent produce correct fixes — a "preference gap" between IR relevance and what the agent finds useful.',
                question: 'What is the most targeted next step?',
                options: [
                  {
                    label:
                      'Train a T2 bridge/reranking layer (BGM-style) on top of the existing retriever, using the frozen agent\'s task success as the training signal — keep the retriever for recall, let the new component handle preference alignment',
                    quality: 'best',
                    feedback:
                      'Correct. This is the "decompose, don\'t overload" lesson from BGM: rather than retraining the whole retriever, add a cascaded T2 component that handles preference alignment while the existing retriever continues to handle broad recall — composable, and each piece optimizes one sub-problem.',
                  },
                  {
                    label:
                      'Discard the T1 retriever entirely and replace it with a hand-written rule-based filter',
                    quality: 'bad',
                    feedback:
                      'This throws away a working recall mechanism to solve a precision/alignment problem. The module\'s cascaded-ecosystem pattern (query reformulator -> retriever -> reranker/bridge) keeps the retriever and adds a targeted component for the actual gap — a full rebuild is unnecessary churn.',
                  },
                  {
                    label:
                      'Fine-tune the frozen foundation model itself on examples of "good" vs "bad" retrieved documents',
                    quality: 'ok',
                    feedback:
                      'This could work but violates the stated constraint that the foundation model cannot be retrained for cost/governance reasons, and it\'s the expensive, monolithic A1/A2-style fix the T2 paradigm exists to avoid. A peripheral bridge model is orders of magnitude cheaper and directly targets the preference gap.',
                  },
                ],
              },
              {
                situation:
                  'The agent now repeatedly solves similar CI-failure patterns across different repos (e.g., the same dependency-bump fix, the same flaky-test quarantine procedure), but re-derives the fix from scratch every time, burning tokens and sometimes getting it wrong.',
                question: 'What addresses this most directly?',
                options: [
                  {
                    label:
                      'Build a T2 skill library (OS-Copilot/Voyager-style): when the agent successfully resolves a CI-failure pattern, store the executable fix as a skill indexed by description; on future tasks, search the library first and compose/retrieve before re-deriving from scratch',
                    quality: 'best',
                    feedback:
                      'Correct. This is precisely the skill-library pattern: "the agent\'s own execution outcomes (success or failure) determine which skills enter the library," and on a related task the agent "retrieves and composes previously verified skills instead of reasoning from scratch" — directly addressing repeated re-derivation with no retraining of the foundation model.',
                  },
                  {
                    label:
                      'Increase the context window so the agent can see more of its own past trajectories in every prompt',
                    quality: 'ok',
                    feedback:
                      'A bigger context window might let the agent recall a recent fix, but it doesn\'t give a structured, composable, persistently retrievable unit of reuse, and it doesn\'t scale as the number of patterns grows. A skill library is the targeted, durable fix; a larger window is a costly partial workaround.',
                  },
                  {
                    label:
                      'Train the retriever from stage 1 to also retrieve CI logs, leaving everything else unchanged',
                    quality: 'bad',
                    feedback:
                      'Retrieving more logs doesn\'t give the agent a reusable, executable fix — it just gives it more raw text to re-derive a solution from again. The repeated-derivation problem is a missing skill-library, not a retrieval-coverage problem.',
                  },
                ],
              },
            ],
            debrief:
              'A workable T1/T2 progression for a constrained, frozen-agent system: start with T1 plug-and-play components (pre-trained retrievers) for immediate coverage, layer in T2 bridge/reranking components once telemetry reveals a preference gap the base tool can\'t close, and build a T2 skill library once the agent starts re-solving the same problems repeatedly. At every step, the foundation model itself stays frozen — all the adaptation happens in the cheaper, peripheral tool ecosystem.',
          },
        },
      ],
    },
  ],
}
