import type { Module } from '../../types'
import whyAdaptMd from '../md/aaa-f-why-adapt.md?raw'
import adaptationSpectrumMd from '../md/aaa-f-adaptation-spectrum.md?raw'
import fourParadigmsMd from '../md/aaa-f-four-paradigms.md?raw'
import memoryPlacementMd from '../md/aaa-f-memory-placement.md?raw'
import illustrativeExamplesMd from '../md/aaa-f-illustrative-examples.md?raw'

export const m1: Module = {
  id: 'aaa-m1',
  title: 'Foundations: A Four-Paradigm Framework for Agent Adaptation',
  description:
    'Why agentic AI needs adaptation beyond pretraining, the anatomy of an agentic system, the prompt-to-fine-tuning spectrum, and the A1/A2/T1/T2 framework that organizes the rest of the survey.',
  lessons: [
    {
      id: 'aaa-f-why-adapt',
      title: 'Why adaptation, and the anatomy of an agentic system',
      minutes: 12,
      xp: 60,
      steps: [
        { kind: 'read', title: 'Why adapt an agent at all?', markdown: whyAdaptMd },
        {
          kind: 'quiz',
          title: 'Adaptation and agent anatomy',
          questions: [
            {
              prompt:
                'The survey names three mechanisms that drive adaptation after pretraining. Which set is it?',
              options: [
                'Pretraining, fine-tuning, and prompting',
                'Post-training, memory, and skills',
                'Planning, tool use, and evaluation',
                'Supervised learning, unsupervised learning, and reinforcement learning',
              ],
              answer: 1,
              explanation:
                'Section 1 names post-training (SFT/RL/preference optimization, which changes parameters), memory (episodic buffers, reflective databases, knowledge graphs, which persist experience without retraining), and skills (reusable procedural knowledge) as the three mechanisms the survey maps.',
            },
            {
              prompt:
                'The four-paradigm framework classifies an adaptation method using two questions. What are they?',
              options: [
                'Is the method supervised or unsupervised, and is it online or offline?',
                'Does the method use SFT or RL, and is the model open- or closed-source?',
                'What is being optimized (agent vs. tool), and how does the adaptation signal arise (tool execution vs. agent output)?',
                'Which benchmark is used, and how large is the training dataset?',
              ],
              answer: 2,
              explanation:
                'These two axes — "what is adapted" (agent vs. tool) and "how the signal is obtained" (execution-grounded vs. output-evaluated) — are exactly how the survey derives A1, A2, T1, and T2 in Section 3.2.',
            },
            {
              prompt:
                'A dynamic planning approach like ReAct or Reflexion differs from a static approach like Chain-of-Thought mainly because it...',
              options: [
                'Uses a larger foundation model',
                'Incorporates feedback from the environment or past actions to iteratively refine the plan',
                'Never calls any external tools',
                'Skips the planning step entirely and acts immediately',
              ],
              answer: 1,
              explanation:
                'Section 2.1 distinguishes static planning (Chain-of-Thought, Tree-of-Thought — structured single- or multi-path decomposition with no feedback loop) from dynamic planning (ReAct, Reflexion — which incorporate environment or action feedback to revise the plan mid-task).',
            },
            {
              prompt:
                'In Section 2.1, what is the relationship between RAG and the Memory Module?',
              options: [
                'RAG replaces the Memory Module entirely',
                'RAG is a mechanism many systems use to retrieve and integrate relevant items from long-term memory into the agent\'s reasoning',
                'RAG is only used for short-term memory, never long-term memory',
                'RAG and memory are unrelated concepts in the survey',
              ],
              answer: 1,
              explanation:
                'Section 2.1 describes long-term memory as persisting reusable knowledge across sessions, and notes that many systems employ retrieval-augmented generation (RAG) to retrieve and integrate stored knowledge into the agent\'s ongoing reasoning.',
            },
          ],
        },
      ],
    },
    {
      id: 'aaa-f-adaptation-spectrum',
      title: 'From prompts to fine-tuning: the adaptation spectrum',
      minutes: 10,
      xp: 55,
      steps: [
        { kind: 'read', title: 'The adaptation spectrum', markdown: adaptationSpectrumMd },
        {
          kind: 'quiz',
          title: 'Prompting vs. fine-tuning',
          questions: [
            {
              prompt:
                'Why is prompt engineering described as the cheapest and most transferable form of adaptation?',
              options: [
                'Because it always produces better results than fine-tuning',
                'Because it requires no parameter updates or training runs — behavior changes purely by changing the input context',
                'Because it only works on closed-source models',
                'Because it permanently changes the model\'s weights in a reversible way',
              ],
              answer: 1,
              explanation:
                'Section 2.2.1 frames prompt engineering as adapting behavior "without modifying model parameters" — by changing instructions, examples, or task descriptions in the input context. No training run means low cost and easy transfer across tasks, but it also can\'t add capabilities the base model lacks.',
            },
            {
              prompt:
                'LoRA is described as typically matching full fine-tuning quality while updating what fraction of parameters?',
              options: [
                'About 50% of parameters',
                'All parameters, just more slowly',
                'Less than 1% of parameters',
                'Exactly 10% of parameters, fixed by the LoRA rank',
              ],
              answer: 2,
              explanation:
                'Section 2.2.2 states that LoRA "typically matches full fine-tuning quality while updating less than 1% of parameters," which is why PEFT methods like LoRA are the practical default for adapting large agentic systems.',
            },
            {
              prompt:
                'Of SFT, DPO, and RL (PPO/GRPO), which one needs only a scalar reward signal — no labeled demonstrations or preference pairs — but is harder to stabilize?',
              options: [
                'SFT',
                'DPO and its extensions',
                'Reinforcement learning (PPO, GRPO)',
                'None of these — all three require labeled demonstrations',
              ],
              answer: 2,
              explanation:
                'Section 2.2.2 says RL methods such as PPO and GRPO "optimize behavior through environment interaction; they require only a reward signal but are harder to stabilize than SFT." SFT needs demonstrations, DPO needs preference pairs, RL needs just a reward.',
            },
          ],
        },
      ],
    },
    {
      id: 'aaa-f-four-paradigms',
      title: 'The four-paradigm framework: A1, A2, T1, T2',
      minutes: 15,
      xp: 70,
      steps: [
        { kind: 'read', title: 'Notation and the classification rule', markdown: fourParadigmsMd },
        {
          kind: 'quiz',
          title: 'Classifying paradigms',
          questions: [
            {
              prompt:
                'In Section 3.1\'s notation, why does the survey treat external, dynamic memory modules as part of T (Tool) rather than as a separate category?',
              options: [
                'Because memory is never important enough to formalize',
                'Because T is defined as every external callable component beyond the agent\'s own parameters, and dynamic memory stores that learn from the agent\'s outputs fit that definition',
                'Because memory always requires updating the agent\'s parameters',
                'Because the agent A is defined to include all memory by default',
              ],
              answer: 1,
              explanation:
                'Section 3.1 defines T as external callable components extending the agent beyond its own parameters, and explicitly says external memory modules count as T when they are dynamic, updatable stores that interact with and learn from the agent\'s outputs.',
            },
            {
              prompt:
                'What is the key difference between A1 and A2 in terms of the optimization objective?',
              options: [
                'A1 uses only SFT, while A2 uses only RL',
                'A1 optimizes the agent so that the tool\'s execution result y is good (O_tool); A2 optimizes the agent so that its own final output o is good (O_agent)',
                'A1 trains the tool; A2 trains the agent',
                'There is no difference — A1 and A2 are two names for the same paradigm',
              ],
              answer: 1,
              explanation:
                'A1\'s objective is arg max_A O_tool(A, T), evaluated on the tool\'s execution result y. A2\'s objective is arg max_A O_agent(A, T), evaluated on the agent\'s final output o = A(x, a, y) — one extra step in the pipeline, and a different thing being scored.',
            },
            {
              prompt:
                'A team trains a retriever on a large, general-purpose relevance benchmark with no specific agent involved in the training loop, intending it as a plug-and-play module any agent can later call. Which paradigm is this?',
              options: [
                'A1, because the retriever\'s execution result is the signal',
                'A2, because the retriever will eventually support an agent\'s final answer',
                'T1, because the tool is trained independently of any agent, as an agent-agnostic reusable module',
                'T2, because the agent supervises the retriever\'s training',
              ],
              answer: 2,
              explanation:
                'Section 3.2.3 defines T1 as tools trained independently of any agent — "agent-agnostic" — that function as plug-and-play modules. Since no agent\'s outputs are involved in this retriever\'s training, it cannot be T2; and since the agent itself isn\'t being optimized, it isn\'t A1 or A2.',
            },
            {
              prompt:
                'For T2 (Agent-Supervised Tool Adaptation), what does "quality-weighted training" do, as described in Section 3.2.4?',
              options: [
                'It discards the agent entirely and trains the tool on random data',
                'It weights each tool-training trajectory by a quality score derived from the frozen agent\'s final output, so the tool learns from examples associated with desirable agent behavior',
                'It always updates the agent\'s parameters alongside the tool\'s',
                'It requires the tool to be trained before the agent is even built',
              ],
              answer: 1,
              explanation:
                'Section 3.2.4 defines quality-weighted training as weighting each trajectory by w = ω(o), a quality score from the agent\'s final output o — in the binary case this reduces to selecting only trajectories tied to desirable agent outputs for tool training.',
            },
          ],
        },
        {
          kind: 'code',
          title: 'Implement the A1/A2/T1/T2 classifier',
          challenge: {
            prompt: `## Implement the paradigm classifier from Section 3.2

Section 3.2 describes a clean two-step decision procedure for classifying any adaptation method:

1. **What is optimized?** If the **agent** is optimized, the paradigm is A1 or A2, distinguished by where the signal comes from. If the **tool** is optimized (agent frozen), the paradigm is T1 or T2, distinguished by whether the tool is trained independently of the agent.

Implement \`classifyParadigm(method)\`, where \`method\` is an object:

\`\`\`
{
  optimizesAgent: boolean,          // true = agent is the thing being trained
  signalFromToolExecution: boolean, // (only meaningful when optimizesAgent is true)
                                     // true = signal comes from the tool's execution result y (A1)
                                     // false = signal comes from the agent's final output o (A2)
  toolTrainedIndependently: boolean // (only meaningful when optimizesAgent is false)
                                     // true = tool trained agent-agnostically (T1)
                                     // false = tool trained under the frozen agent's supervision (T2)
}
\`\`\`

Return one of \`'A1' | 'A2' | 'T1' | 'T2'\`.

**Worked examples from Section 3.3:**
- DeepRetrieval: optimizes the agent using recall/nDCG computed from the retriever's result *y* → **A1**.
- Search-R1: optimizes the agent using exact-match accuracy of its final answer *o* → **A2**.
- A dense retriever pre-trained on a generic benchmark, with no agent in its training loop → **T1**.
- A search subagent trained using a frozen agent's downstream output quality → **T2**.`,
            starterCode: `function classifyParadigm(method) {
  // TODO: implement the two-step decision rule from §3.2:
  // 1. Is the agent or the tool being optimized?
  // 2. Within that branch, where does the signal come from?
  return 'A1' // placeholder — always wrong for the T1/T2 cases
}`,
            solution: `function classifyParadigm(method) {
  if (method.optimizesAgent) {
    return method.signalFromToolExecution ? 'A1' : 'A2'
  }
  return method.toolTrainedIndependently ? 'T1' : 'T2'
}`,
            tests: `test('DeepRetrieval: agent optimized via tool-execution signal -> A1', () => {
  assertEqual(
    classifyParadigm({ optimizesAgent: true, signalFromToolExecution: true, toolTrainedIndependently: false }),
    'A1'
  )
})

test('Search-R1: agent optimized via final-output signal -> A2', () => {
  assertEqual(
    classifyParadigm({ optimizesAgent: true, signalFromToolExecution: false, toolTrainedIndependently: false }),
    'A2'
  )
})

test('pre-trained dense retriever, trained independently of any agent -> T1', () => {
  assertEqual(
    classifyParadigm({ optimizesAgent: false, signalFromToolExecution: false, toolTrainedIndependently: true }),
    'T1'
  )
})

test('search subagent trained under a frozen agent\\'s supervision -> T2', () => {
  assertEqual(
    classifyParadigm({ optimizesAgent: false, signalFromToolExecution: false, toolTrainedIndependently: false }),
    'T2'
  )
})

test('ReTool-style agent: tool result fed back, final-answer signal -> A2', () => {
  assertEqual(
    classifyParadigm({ optimizesAgent: true, signalFromToolExecution: false, toolTrainedIndependently: true }),
    'A2'
  )
})`,
          },
        },
      ],
    },
    {
      id: 'aaa-f-memory-placement',
      title: 'Interaction pipelines and where memory lives',
      minutes: 12,
      xp: 60,
      steps: [
        { kind: 'read', title: 'Pipelines and memory placement', markdown: memoryPlacementMd },
        {
          kind: 'quiz',
          title: 'Pipelines and memory',
          questions: [
            {
              prompt:
                'What is the key structural difference between the A1/T1-style pipeline (x → a → y) and the A2/T2-style pipeline (x → a → y → o)?',
              options: [
                'The A2/T2 pipeline has one extra step where the agent produces a final output o from (x, a, y), and the optimization signal is read off o instead of y',
                'The A1/T1 pipeline never involves a tool at all',
                'The A2/T2 pipeline removes the agent from the loop entirely',
                'There is no structural difference, only a difference in vocabulary',
              ],
              answer: 0,
              explanation:
                'A1/T1 reads the signal R directly off the tool\'s result y. A2/T2 adds one more hop — the agent integrates (x, a, y) into a final output o — and reads the signal off o instead. That single extra hop is the entire structural distinction.',
            },
            {
              prompt:
                'According to Section 3.2\'s discussion of memory, an episodic buffer that a frozen agent writes to via M ← Update(M, o) — using its own outputs — is classified as which paradigm by default?',
              options: [
                'A1, because it involves tool execution',
                'T1, because memory is always agent-agnostic',
                'T2, because the agent stays fixed while the memory (a tool) evolves using a signal derived from the agent\'s own output',
                'A2, because the memory is part of the agent\'s parameters',
              ],
              answer: 2,
              explanation:
                'This is exactly the T2 pattern: the agent A is frozen, the memory module M (a tool) is updated using the agent\'s own output o as the signal. The survey treats this as the default classification for external adaptive memory.',
            },
            {
              prompt:
                'A LoRA adapter is added to an agent\'s weights purely to inject domain knowledge, and updating it requires gradient-based changes to the agent\'s own core parameters. Per Section 3.2, this is best classified as...',
              options: [
                'T1, because LoRA is a parameter-efficient method',
                'T2, because LoRA adapters are technically external files',
                'A1 or A2 (agent adaptation), because the update is a gradient-based change to the agent\'s own parameters',
                'None of the four paradigms apply to parametric memory',
              ],
              answer: 2,
              explanation:
                'Section 3.2 gives the rule of thumb directly: when a memory update requires gradient-based changes to the agent\'s own core parameters, the method is better classified under A1 or A2 (agent adaptation) — even though the mechanism is "memory."',
            },
          ],
        },
      ],
    },
    {
      id: 'aaa-f-illustrative-examples',
      title: 'Worked contrasts: RAG and code execution under A1 vs. A2',
      minutes: 13,
      xp: 65,
      steps: [
        { kind: 'read', title: 'Paired examples from the survey', markdown: illustrativeExamplesMd },
        {
          kind: 'scenario',
          title: 'Classify a new system',
          scenario: {
            intro:
              'You\'ve seen the survey\'s own A1/A2/T1/T2 examples in RAG and code execution. Now apply the same two-question classification (Lesson 3) to three new system descriptions. For each, pick the paradigm that best fits and see why.',
            stages: [
              {
                situation:
                  'A text-to-SQL agent generates a SQL query a from a natural-language question x. A frozen production database executes the query and returns rows y. The team computes whether y exactly matches the gold result set, and uses that score directly as the RL reward to fine-tune the agent that generates SQL.',
                question: 'Which paradigm best fits this system?',
                options: [
                  {
                    label:
                      'A1 — the agent is being fine-tuned, and the reward is computed directly from the tool\'s (database\'s) execution result y, with no further agent step after that',
                    quality: 'best',
                    feedback:
                      'Correct. Two checks from Lesson 3: (1) the agent\'s parameters are what\'s being optimized, so it\'s A1 or A2; (2) the reward is computed from y (the returned rows) with no subsequent "final output o" step — the pipeline is x → a → y, signal read off y. That\'s the A1 pattern, just like DeepRetrieval and DeepSeek-R1 (code).',
                  },
                  {
                    label:
                      'A2 — because SQL execution is similar to code execution, and ReTool was A2',
                    quality: 'bad',
                    feedback:
                      'ReTool was A2 specifically because the sandbox result was fed back to the agent, which then produced a separate final answer o whose correctness was scored. Here, there is no such extra step — the reward is computed straight from the database\'s returned rows y. Surface similarity to "code execution" isn\'t the test; the pipeline shape is.',
                  },
                  {
                    label:
                      'T1 — the database is a pre-trained, agent-agnostic tool',
                    quality: 'bad',
                    feedback:
                      'T1 would apply if the *database* (the tool) were the thing being trained, independent of any agent. Here the database is fixed/frozen and it\'s the *agent* (the SQL-generation model) that is being fine-tuned via RL — that\'s agent adaptation, not tool adaptation.',
                  },
                ],
              },
              {
                situation:
                  'A research assistant is built on a closed-source API model that cannot be fine-tuned. The agent issues search queries to a custom reranking model; the reranker reorders candidate documents before they reach the agent. The team periodically retrains the reranker using a score derived from whether the frozen agent\'s final research reports were rated as useful by reviewers.',
                question: 'Which paradigm best fits the reranker\'s adaptation?',
                options: [
                  {
                    label:
                      'T2 — the agent is frozen (it can\'t be fine-tuned), and the reranker (a tool) is adapted using a signal derived from the frozen agent\'s final output (the usefulness rating of its reports)',
                    quality: 'best',
                    feedback:
                      'Right. Two checks: (1) the agent is explicitly frozen — closed-source, can\'t be fine-tuned — so this is tool adaptation (T1 or T2); (2) the reranker\'s training signal comes from the frozen agent\'s output (report usefulness), not from training the reranker independently. That\'s T2, the same structure as the closed-source-agent RAG example in Lesson 5\'s read step.',
                  },
                  {
                    label:
                      'T1 — any tool paired with a closed-source agent is agent-agnostic by definition',
                    quality: 'bad',
                    feedback:
                      'Being paired with a closed-source agent doesn\'t make a tool agent-agnostic. T1 requires the tool\'s training to be independent of any specific agent\'s outputs. Here, the reranker is explicitly retrained using a signal (report usefulness) that comes from *this* agent\'s output — that dependency is what makes it T2, not T1.',
                  },
                  {
                    label:
                      'A2 — the final reports are being evaluated, so this must be agent adaptation',
                    quality: 'bad',
                    feedback:
                      'The evaluation does look at the agent\'s final output — but the thing being *updated* is the reranker\'s parameters, not the agent\'s. A2 requires the agent itself to be the optimization target; here the agent is explicitly described as frozen/un-fine-tunable. Optimizing a tool using an agent-output signal is T2, by definition (Section 3.2.4).',
                  },
                ],
              },
              {
                situation:
                  'A coding agent writes a script a, a sandbox executes it and returns output y (e.g., stdout and any errors), and the agent then writes a natural-language explanation o summarizing what happened for the user. The agent is fine-tuned with RL where the reward comes from human ratings of whether o is a correct and helpful explanation — the sandbox\'s raw output y is never directly scored.',
                question: 'Which paradigm best fits this system?',
                options: [
                  {
                    label:
                      'A2 — the agent is being optimized, and the reward is computed from its final output o (the explanation), one step after the tool\'s execution result y',
                    quality: 'best',
                    feedback:
                      'Correct. The agent\'s parameters are the optimization target (agent adaptation), and the pipeline runs x → a → y → o with the reward computed from o, not y. That extra hop — and the fact that y itself is never directly scored — is exactly the A1-vs-A2 distinction from Lesson 4: this is A2, structurally identical to ReTool.',
                  },
                  {
                    label:
                      'A1 — code execution was involved, and DeepSeek-R1 (code) was A1',
                    quality: 'bad',
                    feedback:
                      'DeepSeek-R1 (code) was A1 *because* its reward came directly from the sandbox\'s execution result y (test-case pass rate), with no further agent step. Here, the reward explicitly comes from human ratings of the agent\'s final explanation o, computed after y — that extra hop to o is what makes it A2, regardless of the fact that a sandbox is involved.',
                  },
                  {
                    label:
                      'T2 — a tool (the sandbox) is involved, so this must be tool adaptation',
                    quality: 'bad',
                    feedback:
                      'The presence of a tool doesn\'t make something tool adaptation — what matters is *what\'s being optimized*. Here the agent\'s own parameters are updated via RL; the sandbox itself is not being trained or adapted at all. That\'s agent adaptation (A1 or A2), and since the signal comes from the agent\'s final output o, it\'s A2.',
                  },
                ],
              },
            ],
            debrief:
              'In every case, the same two questions from Lesson 3 settle it: (1) is the *agent\'s* parameters or the *tool\'s* parameters being updated, and (2) does the optimization signal come from the tool\'s raw execution result y, or from something downstream of an agent-produced final output o? Surface features — "it involves code," "it involves a database," "a tool is present" — are red herrings. The pipeline shape (x→a→y vs. x→a→y→o) and the locus of optimization (agent vs. tool) are the only two things that matter.',
          },
        },
      ],
    },
  ],
}
