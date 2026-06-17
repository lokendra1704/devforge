import type { Subject } from '../types'
import whyToolAgentsHardMd from './md/as-why-tool-agents-hard.md?raw'
import twoPipelineArchitectureMd from './md/as-two-pipeline-architecture.md?raw'
import trajectoryPipelineMd from './md/as-trajectory-pipeline.md?raw'
import qaEnvironmentSynthesisMd from './md/as-qa-environment-synthesis.md?raw'
import trainingPipelineMd from './md/as-training-pipeline.md?raw'
import evaluationResultsMd from './md/as-evaluation-results.md?raw'

export const astra: Subject = {
  id: 'astra',
  title: 'ASTRA',
  tagline: 'Automated synthesis of agentic trajectories and reinforcement arenas for tool-using LLM agents.',
  icon: '🛰️',
  accent: '#ef4444',
  modules: [
    {
      id: 'as-m1',
      title: 'Motivation & Architecture',
      description: 'Why training tool-using agents fails today, and how ASTRA splits the fix into two complementary pipelines.',
      lessons: [
        {
          id: 'as-why-tool-agents-hard',
          title: 'The agent that can\'t tell if it actually worked',
          minutes: 8,
          xp: 50,
          steps: [
            { kind: 'read', title: 'Three ways tool-agent training breaks', markdown: whyToolAgentsHardMd },
            {
              kind: 'quiz',
              title: 'Failure modes check',
              questions: [
                {
                  prompt: 'A team trains a tool-using agent entirely against an LLM that improvises tool outputs ("plays the environment"). Training loss looks great, but the agent collapses past two turns in deployment. What is the root cause ASTRA identifies?',
                  options: [
                    'The reward signal had no rule-verifiable ground truth, since tool responses were language-model guesses rather than executed code',
                    'The model was too small to memorize enough trajectories',
                    'The learning rate was too high during the later epochs of training',
                    'The trajectories were too short to teach multi-turn behavior',
                  ],
                  answer: 0,
                  explanation: 'ASTRA calls this the non-verifiable-environment failure mode: when a "tool" is just another LLM improvising a plausible response, there is no deterministic ground truth to check the agent\'s action against. Reward built on a grader\'s vibes does not transfer to real long-horizon tasks.',
                },
                {
                  prompt: 'Why does the paper say "more synthetic data" does not fix the non-verifiable-environment problem?',
                  options: [
                    'Synthetic data is always too small in volume to matter for RL',
                    'The issue is verifiability, not volume — an enormous trajectory dataset is still useless for RL if nothing in it can be checked against ground truth',
                    'Synthetic data causes overfitting regardless of how it is generated',
                    'Synthetic data is fine for RL but breaks SFT specifically',
                  ],
                  answer: 1,
                  explanation: 'ASTRA\'s fix is not "generate more" but "make the environment executable" — actual code that runs and returns a real answer, so the reward has something concrete to check against.',
                },
                {
                  prompt: 'In "single-step decomposition," what specifically breaks when multi-turn trajectories are chopped into isolated single-step training examples?',
                  options: [
                    'The agent runs out of context window during inference',
                    'The agent never learns to plan across turns — long-horizon credit assignment is lost',
                    'The agent overfits to the first tool call in every trajectory',
                    'The tool documentation becomes incompatible with the training format',
                  ],
                  answer: 1,
                  explanation: 'Chopping a trajectory into single steps removes the dependencies between turns, so the model never has to learn how an early decision affects later ones.',
                },
                {
                  prompt: 'According to the third failure mode, what is the specific limitation of an RL-only training regime (no SFT cold start)?',
                  options: [
                    'RL-only agents are capped by how good the starting policy already was',
                    'RL-only agents cannot use any tools at all',
                    'RL-only agents require LLM-simulated environments to function',
                    'RL-only agents train faster but always overfit to one tool',
                  ],
                  answer: 0,
                  explanation: 'RL improves a policy by exploring around its current behavior, so a weak starting policy gives RL a much smaller useful space to explore — precisely why ASTRA uses an SFT cold start first.',
                },
              ],
            },
          ],
        },
        {
          id: 'as-two-pipeline-architecture',
          title: 'Two different kinds of topology',
          minutes: 10,
          xp: 60,
          steps: [
            { kind: 'read', title: 'Static tool topology vs. semantic topology', markdown: twoPipelineArchitectureMd },
            {
              kind: 'quiz',
              title: 'Architecture check',
              questions: [
                {
                  prompt: 'What distinguishes the "static topology of tool-call graphs" from the "compositional topology of human semantic reasoning" as structures ASTRA mines?',
                  options: [
                    'The first is instance-specific per question; the second is fixed and discoverable from documentation alone',
                    'The first is fixed and discoverable from tool documentation before any task exists; the second must be extracted per question from how a human decomposes it',
                    'Both are extracted the same way, just from different data sources',
                    'The first applies only to RL; the second applies only to SFT',
                  ],
                  answer: 1,
                  explanation: 'Tool-call-graph topology is structural and reusable, mined from an API surface. Semantic reasoning topology depends on the specific question and how it decomposes, so it must be derived per instance.',
                },
                {
                  prompt: 'Which training stage does ASTRA pair with the static tool-call-graph topology, and why?',
                  options: [
                    'RL, because tool-call graphs are too sparse for supervised learning',
                    'SFT, because the broad, structurally-grounded coverage of plausible tool-call chains is well suited to teaching general tool-use competence before exploration begins',
                    'RL, because tool-call graphs already encode a reward signal',
                    'Neither — tool-call graphs are only used for evaluation, not training',
                  ],
                  answer: 1,
                  explanation: 'ASTRA uses the static tool-call graph to synthesize diverse trajectories for SFT, broadening the agent\'s competence before the more demanding RL stage begins.',
                },
                {
                  prompt: 'Why does ASTRA convert decomposed question-answer traces into code-executable environments specifically for the RL stage, rather than reusing the tool-call-graph pipeline?',
                  options: [
                    'Because RL requires verifiable, rule-based rewards, and only environments built from semantic decomposition of real questions can capture the rich, instance-specific structure needed to check correctness',
                    'Because code-executable environments are easier to generate than tool-call graphs',
                    'Because RL cannot use any data derived from tool documentation',
                    'Because the tool-call-graph pipeline already produces verifiable rewards, making a second pipeline redundant',
                  ],
                  answer: 0,
                  explanation: 'RL needs a rule-verifiable reward grounded in real outcomes — the semantic-reasoning topology lets ASTRA build environments independently checkable by executable code.',
                },
                {
                  prompt: 'The lesson poses the question "why not just use RL for everything, since RL is better?" What is ASTRA\'s answer?',
                  options: [
                    'RL is strictly worse than SFT for tool-using agents and should be avoided',
                    'RL is only as good as the policy it starts from; SFT first establishes structured tool invocation and interaction conventions so RL can explore a much larger space of valid solutions than starting from scratch',
                    'RL and SFT solve completely unrelated problems and cannot be combined',
                    'RL requires more compute than SFT, so it is used only when budget allows',
                  ],
                  answer: 1,
                  explanation: 'SFT cold-start gives the model structured tool invocation, multi-turn state tracking, and interaction conventions — a foundation that lets subsequent RL explore far more effectively.',
                },
                {
                  prompt: 'In the paper\'s own framing, the two-stage method is described as "broadens... then deepens." Which pipeline corresponds to which verb?',
                  options: [
                    'SFT over the static tool topology broadens; RL within the semantic topology deepens',
                    'RL over the static tool topology broadens; SFT within the semantic topology deepens',
                    'Both broadening and deepening happen in the SFT stage; RL only fine-tunes hyperparameters',
                    'Broadening and deepening both refer to dataset size, not capability',
                  ],
                  answer: 0,
                  explanation: 'The method "first broadens an agent\'s tool-use competence over a static tool topology, then deepens its capability by learning within a complex semantic topology."',
                },
                {
                  prompt: 'If ASTRA\'s SFT stage were removed entirely and only the RL-over-semantic-environments stage were kept, what would the lesson predict?',
                  options: [
                    'No real difference — RL alone discovers the same space of valid solutions just as efficiently',
                    'The non-verifiable-environment failure mode would resurface even though the RL environments are code-executable',
                    'RL would explore a smaller space of valid solutions than the combined approach, since it would be starting from a policy that lacks structured tool invocation and multi-turn conventions',
                    'The model would no longer be able to use tools at all',
                  ],
                  answer: 2,
                  explanation: 'RL on top of an SFT cold start "explores a much larger space of valid solutions than RL alone could discover from scratch." Removing SFT cripples how effectively RL can explore, even though verifiability itself is unaffected.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'as-m2',
      title: 'Trajectory Synthesis for SFT',
      description: 'Mining the static topology of tool-call graphs to generate diverse, auto-scored multi-turn trajectories with no human annotation.',
      lessons: [
        {
          id: 'as-trajectory-pipeline-lesson',
          title: 'From a pile of API docs to a graded trajectory',
          minutes: 12,
          xp: 70,
          steps: [
            { kind: 'read', title: 'The five-stage trajectory pipeline', markdown: trajectoryPipelineMd },
            {
              kind: 'quiz',
              title: 'Pipeline stages check',
              questions: [
                {
                  prompt: 'Why does ASTRA discard MCP servers with fewer than three tools, rather than keeping them and just generating shorter chains?',
                  options: [
                    'Because servers with very few tools rarely support the kind of meaningful multi-turn workflows the pipeline is trying to synthesize',
                    'Because the transition graph cannot be constructed for fewer than three nodes',
                    'Because the reward model requires exactly seven scores and small servers cannot produce them',
                    'Because MCP registries cap the number of tools per server at three',
                  ],
                  answer: 0,
                  explanation: 'A two-tool server simply can\'t produce the kind of multi-step tool-chain task the rest of the pipeline is built to generate.',
                },
                {
                  prompt: 'In Stage 2, what is the relationship between the directed transition graph and the new tool chains ASTRA generates?',
                  options: [
                    'The graph is built once per server from LLM-proposed chains, then reused as a static topology that length-bounded random walks sample from to produce many new candidate chains',
                    'A new transition graph is built fresh for every individual chain that gets sampled',
                    'The transition graph replaces the need for an LLM — chains are generated purely by graph traversal with no LLM involvement anywhere in Stage 2',
                    'The graph is constructed only after task scoring in Stage 3, using which chains passed quality thresholds',
                  ],
                  answer: 0,
                  explanation: 'The graph is discovered once per server and reused repeatedly: random walks over that fixed structure generate new candidate chains, which are then verified for well-formed dependencies.',
                },
                {
                  prompt: 'What distinguishes a "chain-conditioned" task from a "server-only" task in Stage 3, and why does ASTRA use both instead of just one?',
                  options: [
                    'Chain-conditioned tasks are written to fit an already-validated tool chain (biasing toward executability), while server-only tasks are written from the server spec alone (biasing toward topical coverage) — combining both balances executability against breadth',
                    'Chain-conditioned tasks are for deployed servers and server-only tasks are for emulated servers',
                    'Server-only tasks are always harder and chain-conditioned tasks are always easier, so combining them controls task difficulty',
                    'Chain-conditioned tasks skip the scoring step entirely since the chain was already verified in Stage 2',
                  ],
                  answer: 0,
                  explanation: 'Using only chain-conditioned tasks would under-cover the tool space; using only server-only tasks would risk unexecutable tasks. Both still go through the same augmentation and scoring afterward.',
                },
                {
                  prompt: 'A task in Stage 3 scores well on "scenario realism" but fails the "tool-use necessity" threshold. What happens to it?',
                  options: [
                    'It is discarded — failing the threshold on any one of the scoring axes is enough to drop the task, regardless of how well it scores on the others',
                    'It is automatically rewritten by the augmentation step until it passes',
                    'It proceeds to Stage 4 anyway, since two of three axes are implied to be acceptable',
                    'It is downgraded to a server-only task and rescored',
                  ],
                  answer: 0,
                  explanation: 'The filter is an AND, not an average: a task that\'s realistic but doesn\'t actually require tool use defeats the purpose of tool-use training data, so it\'s dropped regardless of its other scores.',
                },
                {
                  prompt: 'What is the functional difference between how Stage 4 handles deployed MCP servers versus doc-only servers?',
                  options: [
                    'Deployed servers are called for real by the Qwen-Agent loop; doc-only servers (which have no live endpoint) are simulated by a stateful emulator that fabricates plausible outputs',
                    'Deployed servers are simulated to avoid hitting production systems, while doc-only servers are called for real since there is no production risk',
                    'Doc-only servers are skipped entirely in Stage 4 and only contribute to Stage 5 reward modeling',
                    'Both are handled identically by the emulator, since the agent framework cannot distinguish them',
                  ],
                  answer: 0,
                  explanation: 'Deployed servers get genuinely invoked, while doc-only servers are routed through a stateful emulator that fabricates realistic-looking responses, including injected failures.',
                },
                {
                  prompt: 'Why does ASTRA deliberately inject a 20% failure rate into emulated tool calls instead of always emulating success?',
                  options: [
                    'An agent trained only on successful tool calls never practices recovery behavior, so injecting failures teaches the model what to do when a call fails, not just if it succeeds',
                    'A 20% failure rate is needed to keep the reward model\'s seven dimensions statistically balanced',
                    'Failures are injected to compensate for the lower quality of doc-only server specifications',
                    'It mirrors the exact failure rate observed when real MCP servers are called',
                  ],
                  answer: 0,
                  explanation: 'The 20% injected rate exists to teach the model failure-handling as a skill the SFT data actually contains — a deliberate training-signal design choice.',
                },
                {
                  prompt: 'Stage 5 produces a single scalar reward per trajectory by combining seven LLM-judged scores. Which of these is NOT one of the seven dimensions?',
                  options: [
                    'Human annotator agreement',
                    'Tool-response-conditioned planning',
                    'Tool-call conciseness',
                    'Query understanding',
                  ],
                  answer: 0,
                  explanation: '"Human annotator agreement" isn\'t a dimension at all — the whole point of Stage 5 is that no human ever looks at a trajectory.',
                },
                {
                  prompt: 'Why does Stage 5 use seven separate scored dimensions and average them, rather than a single end-to-end "was the final answer correct" score?',
                  options: [
                    'Because a single end-to-end score collapses distinct failure modes (e.g., bad planning vs. inefficient tool calls vs. a wrong final answer) into one number, while separate dimensions let the reward credit or penalize each stage of the agent\'s reasoning and tool use',
                    'Because the Qwen-Agent framework requires exactly seven inputs to run its tool-calling loop',
                    'Because seven dimensions is the minimum needed to detect the 20% injected failure rate',
                    'Because human annotators originally scored these seven dimensions and the LLM judge is just replicating their rubric',
                  ],
                  answer: 0,
                  explanation: 'Multi-dimensional, LLM-judged scoring lets the reward distinguish where a trajectory went wrong, which a single pass/fail signal cannot capture.',
                },
              ],
            },
          ],
        },
        {
          id: 'as-trajectory-reward-code',
          title: 'Compute the trajectory-level reward',
          minutes: 12,
          xp: 80,
          steps: [
            {
              kind: 'code',
              title: 'Aggregate the seven reward dimensions',
              challenge: {
                prompt: `ASTRA scores each tool call in a trajectory with a binary success indicator. The **Tool Call Status** score (Eq. 8) is the mean success rate across all tool calls:

\`\`\`
TCS(τ) = (1/n) Σ S_i
\`\`\`

The final trajectory reward is the **arithmetic mean across all seven dimension scores** — the six already-computed dimension scores you're given, plus the Tool Call Status you compute from the raw per-call success indicators.

Implement \`trajectoryReward(toolCallSuccess, dimensionScores)\`:
- \`toolCallSuccess\`: an array of 0/1 indicators, one per tool call in the trajectory.
- \`dimensionScores\`: an array of the other dimension scores (numbers between 0 and 1).
- Return the mean of \`dimensionScores\` together with the computed Tool Call Status.`,
                starterCode: `function trajectoryReward(toolCallSuccess, dimensionScores) {
  // TODO: compute Tool Call Status as the mean of toolCallSuccess,
  // then return the mean of dimensionScores plus that Tool Call Status.
  return 0;
}`,
                solution: `function trajectoryReward(toolCallSuccess, dimensionScores) {
  const tcs = toolCallSuccess.reduce((a, b) => a + b, 0) / toolCallSuccess.length;
  const all = [...dimensionScores, tcs];
  return all.reduce((a, b) => a + b, 0) / all.length;
}`,
                tests: `test('all successes, perfect dims', () => { assertEqual(trajectoryReward([1,1,1,1], [1,1,1,1,1,1]), 1); });
test('mixed success rate', () => { assertEqual(trajectoryReward([1,0,1,0], [1,1,1,1,1,1]), (0.5 + 6) / 7); });
test('single call', () => { assertEqual(trajectoryReward([1], [0.5, 0.5]), (1 + 1) / 3); });
test('all failures drag down the mean', () => { assertEqual(trajectoryReward([0,0], [1,1,1,1,1,1]), 6 / 7); });`,
              },
            },
          ],
        },
        {
          id: 'as-trajectory-scenario',
          title: 'Designing the trajectory pipeline',
          minutes: 8,
          xp: 50,
          steps: [
            {
              kind: 'scenario',
              title: 'Task construction and reward trade-offs',
              scenario: {
                intro: 'You\'re adapting ASTRA\'s trajectory pipeline for a new internal API server.',
                stages: [
                  {
                    situation: 'The server has rich documentation but almost no example usage logs, and your team needs broad topical coverage of what the server can do, fast.',
                    question: 'Which task construction mode should you prioritize first?',
                    options: [
                      { label: 'Server-only construction — generate tasks straight from the server spec, since it promotes topical and linguistic coverage without depending on example chains', quality: 'best', feedback: 'Right — server-only construction is designed exactly for this: broad coverage when validated chains are scarce.' },
                      { label: 'Chain-conditioned construction only — wait until you have validated tool chains before writing any tasks', quality: 'bad', feedback: 'This biases toward executability but caps your coverage at whatever chains you happen to have validated — too narrow for a coverage goal.' },
                      { label: 'Skip task construction and go straight to multi-turn interaction with hand-written tasks', quality: 'bad', feedback: 'This reintroduces the manual-annotation bottleneck ASTRA is explicitly designed to remove.' },
                    ],
                  },
                  {
                    situation: 'Reviewing two completed trajectories that both reach the correct final answer: Trajectory A calls exactly the tools needed; Trajectory B calls three extra, redundant tools along the way before arriving at the same answer.',
                    question: 'Which reward dimension is designed to score this difference?',
                    options: [
                      { label: 'Tool Conciseness — it specifically penalizes unnecessary or redundant tool invocations relative to the task and prior context', quality: 'best', feedback: 'Correct — Tool Conciseness (TC) exists precisely to separate "got there efficiently" from "got there eventually."' },
                      { label: 'Final Answer Quality — since both trajectories reached the same correct answer, this dimension should capture the difference', quality: 'bad', feedback: 'Final Answer Quality only checks semantic alignment and faithfulness of the last message — both trajectories score identically here, since both answers are correct.' },
                      { label: 'Query Understanding — the redundant calls suggest Trajectory B misunderstood the user\'s request', quality: 'bad', feedback: 'Query Understanding scores the initial interpretation of the query, not how efficiently the agent executed afterward.' },
                    ],
                  },
                ],
                debrief: 'ASTRA\'s pipeline pairs each design choice with a specific failure it prevents: task construction mode controls coverage vs. executability, and each of the seven reward dimensions isolates one specific way a trajectory can go wrong, so the auto-generated reward never has to rely on a single coarse pass/fail signal.',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'as-m3',
      title: 'Verifiable Environment Synthesis for RL',
      description: 'Converting decomposed question-answer traces into independent, sandboxed, rule-verifiable Python environments.',
      lessons: [
        {
          id: 'as-qa-environment-synthesis',
          title: 'Verifiable doesn\'t mean one fixed path',
          minutes: 12,
          xp: 70,
          steps: [
            { kind: 'read', title: 'The four-stage environment pipeline', markdown: qaEnvironmentSynthesisMd },
            {
              kind: 'quiz',
              title: 'Environment synthesis check',
              questions: [
                {
                  prompt: 'Why does ASTRA decompose a question into sub-questions with an explicit dependency graph G, rather than just generating one fixed tool-call sequence per question?',
                  options: [
                    'A dependency graph lets the pipeline verify many different valid solution paths instead of only matching one golden tool chain, which is essential for RL rather than imitation learning',
                    'A dependency graph is required because Python tools cannot be invoked without a DAG describing their call order',
                    'It reduces the number of sub-questions needed, making environment synthesis cheaper',
                    'It eliminates the need for quality validation since the graph is already verified at synthesis time',
                  ],
                  answer: 0,
                  explanation: 'Modeling tool use as navigation over a semantic topology lets the environment verify sub-task attainment under many valid orderings/solutions — a single golden path can\'t reward alternative correct strategies.',
                },
                {
                  prompt: 'In Stage 1, what does the aggregation function a0 = Φ({a_i}, G) represent?',
                  options: [
                    'The main answer is reconstructed from the sub-answers according to the structure of the dependency graph',
                    'The main question is rewritten using only the sub-questions, discarding the original a0',
                    'Φ is the sandbox function that executes each sub-task\'s Python tool',
                    'Φ is the quality score combining DC, SA, SR, and TC',
                  ],
                  answer: 0,
                  explanation: 'Φ combines the set of sub-answers, following the dependency structure G, to produce the final answer a0 — a composition function over results, not the sandbox executor or the quality score.',
                },
                {
                  prompt: 'A decomposition instance scores 1 on Dependency Consistency, Sequential Rationality, and Task Completeness, but 0 on Sub-Question Atomicity, because one sub-question actually bundles two reasoning hops together. Why does this matter for RL training even though the other three checks passed?',
                  options: [
                    'Because the agent would be credited for one step that really required two correct decisions, diluting the per-step reward signal used for credit assignment',
                    'Because a non-atomic sub-question always violates Task Completeness too, so TC=1 is actually a scoring error',
                    'Because Sub-Question Atomicity is the only dimension that affects whether the instance gets a Python tool synthesized in Stage 3',
                    'Because dependency graphs cannot represent non-atomic sub-questions at all, so Stage 1 would have failed first',
                  ],
                  answer: 0,
                  explanation: 'A non-atomic sub-question hides two reasoning hops in one node. During RL, the agent gets one reward signal for what was actually two correct decisions, diluting the training signal.',
                },
                {
                  prompt: 'How is the per-instance Quality Score (QS) computed from the four validation dimensions?',
                  options: [
                    'QS is the simple average of DC, SA, SR, and TC, each scored 0 or 1 per sub-question',
                    'QS is the minimum of the four dimension scores, since any single failure should zero out the instance',
                    'QS is a weighted sum where Task Completeness counts twice because it governs the final answer',
                    'QS is computed only from SA and SR, since DC and TC are checked separately at Stage 3',
                  ],
                  answer: 0,
                  explanation: 'QS(τ) = (DC(τ) + SA(τ) + SR(τ) + TC(τ)) / 4 — an unweighted average of four binary judgments.',
                },
                {
                  prompt: 'In Stage 3, why does ASTRA skip generating Python tools for leaf nodes in the dependency graph?',
                  options: [
                    'Leaf nodes represent final linguistic aggregation steps that require no tool, since they just combine already-computed sub-answers',
                    'Leaf nodes always fail Sub-Question Atomicity, so they are discarded rather than tooled',
                    'Leaf nodes are merged away entirely in Stage 4 before tools could be synthesized',
                    'Leaf nodes correspond to the main question q0, which never needs a tool by definition',
                  ],
                  answer: 0,
                  explanation: 'Leaf nodes are the final linguistic aggregation steps — they combine already-obtained sub-answers and need no tool invocation.',
                },
                {
                  prompt: 'What happens in Stage 3 if a sandboxed Python tool\'s output does not contain the target answer a_i for a sub-task?',
                  options: [
                    'That sub-task\'s generation is restarted and retried',
                    'The entire instance is immediately discarded regardless of its QS score',
                    'The sub-task is silently dropped and Task Completeness is recomputed without it',
                    'The sub-task is merged into a homogeneous group in Stage 4 to compensate',
                  ],
                  answer: 0,
                  explanation: 'If the sandbox output doesn\'t contain the target answer, ASTRA restarts that sub-task\'s generation and retries — a local retry loop, not a wholesale discard.',
                },
                {
                  prompt: 'What problem does Stage 4 (sub-environment merging) solve, and how?',
                  options: [
                    'Functionally identical sub-questions with different parameters (e.g., weather in different cities) would otherwise create near-duplicate tools and inflate the action space; ASTRA groups them and extends one base tool\'s data structures to cover all of them',
                    'It solves Sequential Rationality violations by reordering the dependency graph after synthesis',
                    'It solves Task Completeness gaps by generating new sub-questions to fill in missing information',
                    'It reduces sandbox execution time by caching previous tool outputs across unrelated instances',
                  ],
                  answer: 0,
                  explanation: 'ASTRA groups homogeneous sub-questions, picks one base implementation, and extends its data structures to cover the rest — verifying it still answers every original sub-question correctly.',
                },
                {
                  prompt: 'According to the pipeline diagram, what happens to an instance whose QS does not pass the threshold after Stage 2?',
                  options: [
                    'The instance is discarded and never reaches Stage 3 (Python tool synthesis) or Stage 4 (merging)',
                    'It proceeds to Stage 3 anyway but is flagged as low-confidence in the final environment',
                    'It is sent back to Stage 1 for unconditional regeneration using knowledge source K',
                    'Only the sub-questions that failed validation are removed, and the rest of the instance continues',
                  ],
                  answer: 0,
                  explanation: 'If QS fails the threshold, the instance is discarded outright, never reaching tool synthesis or merging.',
                },
              ],
            },
          ],
        },
        {
          id: 'as-quality-score-code',
          title: 'Compute the decomposition quality score',
          minutes: 12,
          xp: 80,
          steps: [
            {
              kind: 'code',
              title: 'Implement QS(τ)',
              challenge: {
                prompt: `ASTRA's quality validation (Section 2.2.2, Eq. 21) scores each decomposed Q–A instance on four dimensions, each itself an average of per-sub-question binary indicators:

\`\`\`
DC(τ) = mean(dependency consistency indicators)
SA(τ) = mean(atomicity indicators)
SR(τ) = mean(sequential rationality indicators)
TC(τ) = a single instance-level binary indicator (0 or 1)
QS(τ) = (DC(τ) + SA(τ) + SR(τ) + TC(τ)) / 4
\`\`\`

Implement \`qualityScore(dependencyConsistency, atomicity, rationality, taskCompleteness)\`, where the first three arguments are arrays of 0/1 indicators (one per sub-question) and \`taskCompleteness\` is a single 0 or 1.`,
                starterCode: `function qualityScore(dependencyConsistency, atomicity, rationality, taskCompleteness) {
  // TODO: average each of dependencyConsistency, atomicity, rationality,
  // then average those three results together with taskCompleteness.
  return 0;
}`,
                solution: `function qualityScore(dependencyConsistency, atomicity, rationality, taskCompleteness) {
  const mean = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
  const dc = mean(dependencyConsistency);
  const sa = mean(atomicity);
  const sr = mean(rationality);
  return (dc + sa + sr + taskCompleteness) / 4;
}`,
                tests: `test('perfect instance', () => { assertEqual(qualityScore([1,1], [1,1], [1,1], 1), 1); });
test('mixed dependency consistency', () => { assertEqual(qualityScore([1,0], [1,1], [1,1], 1), (0.5 + 1 + 1 + 1) / 4); });
test('failing completeness', () => { assertEqual(qualityScore([1,1], [1,1], [1,1], 0), (1 + 1 + 1 + 0) / 4); });
test('all dimensions degraded', () => { assertEqual(qualityScore([0,1], [0,1], [1,0], 0), (0.5 + 0.5 + 0.5 + 0) / 4); });`,
              },
            },
          ],
        },
        {
          id: 'as-environment-scenario',
          title: 'Validating a decomposition',
          minutes: 8,
          xp: 50,
          steps: [
            {
              kind: 'scenario',
              title: 'Quality validation and merging calls',
              scenario: {
                intro: 'You\'re reviewing instances coming out of ASTRA\'s environment synthesis pipeline before they\'re sandboxed.',
                stages: [
                  {
                    situation: 'An instance\'s final sub-question is "summarize the findings from the previous two steps into one sentence" — a leaf node with no tool requirement.',
                    question: 'Should this leaf node be filtered out for not requiring tool invocation?',
                    options: [
                      { label: 'No — sub-questions without tool invocation are allowed at leaf nodes, since they correspond to final linguistic aggregation', quality: 'best', feedback: 'Correct — the rule explicitly carves out an exception for leaf nodes; they don\'t introduce downstream dependencies, so no tool is needed.' },
                      { label: 'Yes — every sub-question in the decomposition must require a tool, no exceptions', quality: 'bad', feedback: 'Too strict — the paper explicitly allows non-tool sub-questions at leaf nodes (summarization, formatting, etc.).' },
                      { label: 'It depends on whether the main question q0 itself requires a tool', quality: 'bad', feedback: 'The leaf-node exception is about position in the dependency graph, not about the main question.' },
                    ],
                  },
                  {
                    situation: 'A different instance has a non-leaf sub-question — "rank these three candidate options by relevance" — that other sub-questions depend on, but it has no associated tool.',
                    question: 'How should this non-leaf, non-tool sub-question be treated?',
                    options: [
                      { label: 'Filtered out — non-tool sub-questions are only allowed at leaf nodes; at non-leaf positions they disrupt the continuity of the tool-use chain', quality: 'best', feedback: 'Right — this is exactly the case the leaf-node restriction is designed to catch.' },
                      { label: 'Kept as-is — ranking is a valid reasoning step regardless of position', quality: 'bad', feedback: 'It may be a valid reasoning step in general, but it breaks the tool-use chain ASTRA needs for verifiable RL if it sits at a non-leaf position.' },
                      { label: 'Automatically converted into a leaf node by removing its dependents', quality: 'bad', feedback: 'This would silently discard real downstream dependencies rather than correctly filtering the instance.' },
                    ],
                  },
                  {
                    situation: 'After Stage 3, you notice three separate sub-environments in the same instance are functionally identical weather-lookup tools, differing only by city name.',
                    question: 'What should Stage 4 do with these three sub-environments?',
                    options: [
                      { label: 'Merge them into one tool implementation, extending its data structures so it still answers all three original sub-questions correctly', quality: 'best', feedback: 'Correct — this is exactly sub-environment merging: avoid action-space inflation from homogeneous, functionally-equivalent tools.' },
                      { label: 'Keep all three as separate tools so the agent has more practice using different tool names', quality: 'bad', feedback: 'This inflates the action space with near-duplicates, which is precisely what merging is designed to prevent.' },
                      { label: 'Discard two of the three and keep only one sub-question', quality: 'bad', feedback: 'This loses correctness — each original sub-question must still be answerable, just via a shared tool implementation.' },
                    ],
                  },
                ],
                debrief: 'Quality validation and merging both protect the same downstream goal: an environment that\'s actually checkable. Leaf-node exceptions keep the tool-use chain intact without over-constraining harmless aggregation steps, and merging keeps the action space lean without losing any sub-question\'s correctness.',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'as-m4',
      title: 'Training, Evaluation & Critique',
      description: 'How ASTRA actually trains SFT + online RL at scale, what the headline results show, and what the ablations reveal about each design choice.',
      lessons: [
        {
          id: 'as-training-pipeline',
          title: 'Two failure modes only RL exposes',
          minutes: 12,
          xp: 70,
          steps: [
            { kind: 'read', title: 'Adaptive batch filling and irrelevant-tool mixing', markdown: trainingPipelineMd },
            {
              kind: 'quiz',
              title: 'Training infrastructure check',
              questions: [
                {
                  prompt: 'In GRPO, the advantage for each rollout in a group is computed relative to the group\'s reward distribution. What happens when every rollout in a group receives the identical reward?',
                  options: [
                    'The advantage estimates collapse to zero, producing no gradient signal for that batch',
                    'The advantage estimates become maximally large, since all samples agree on the outcome',
                    'GRPO falls back to a single-sample REINFORCE estimator for that group',
                    'The reward is automatically rescaled by the group size to restore variance',
                  ],
                  answer: 0,
                  explanation: 'Identical rewards mean every sample is exactly average — the advantage is zero for all of them, so the gradient for that group carries no learning signal.',
                },
                {
                  prompt: 'What does Adaptive Batch Filling actually change about how training batches are constructed?',
                  options: [
                    'It discards zero-variance groups but keeps generating and buffering valid (variance > δ) rollouts across calls until a full batch of n informative samples is assembled',
                    'It increases the group size G for every prompt so variance becomes statistically more likely',
                    'It re-weights zero-variance groups so their gradient contribution is boosted instead of dropped',
                    'It replaces failed rollouts with synthetic rewards sampled from a Gaussian to manufacture variance',
                  ],
                  answer: 0,
                  explanation: 'Adaptive Batch Filling keeps a buffer of valid rollouts, generates more as needed, and carries leftovers forward — guaranteeing every step trains on a full batch of informative signal.',
                },
                {
                  prompt: 'Why does Adaptive Batch Filling carry leftover valid rollouts forward into the buffer instead of discarding them after each batch is filled?',
                  options: [
                    'Those rollouts already satisfied the variance threshold, so reusing them avoids wasting the compute spent generating useful signal that didn\'t fit into the current batch',
                    'Carrying samples forward is required to keep the replay buffer populated for off-policy correction',
                    'Leftover rollouts are used only for evaluation, never for further gradient updates',
                    'It prevents the policy from ever seeing the same prompt twice during training',
                  ],
                  answer: 0,
                  explanation: 'Generating rollouts is expensive; rather than discarding surplus valid rollouts once a batch hits size n, ASTRA banks them for the next step.',
                },
                {
                  prompt: 'What training failure does irrelevant-tool mixing specifically address?',
                  options: [
                    'An agent that is only ever shown the tools it needs never practices rejecting a plausible-but-wrong tool, so it has no negative signal against over-calling',
                    'An agent that sees too many tools per instance runs out of context length before finishing the task',
                    'An agent trained without distractor tools tends to call no tools at all, defaulting to pure language generation',
                    'An agent overfits to the exact tool names seen during SFT and fails to generalize to renamed tools',
                  ],
                  answer: 0,
                  explanation: 'If the tool set always matches exactly what\'s needed, the policy never learns discrimination — irrelevant-tool mixing manufactures that discrimination problem on purpose.',
                },
                {
                  prompt: 'Distractor tools in ASTRA are sampled across three cosine-similarity bands relative to the real tools needed. What does a "high-similarity" distractor (cosine > 0.85) represent, and why is it included?',
                  options: [
                    'A near-duplicate tool that is hardest to reject, forcing the policy to discriminate beyond surface-level similarity',
                    'A tool from a completely unrelated domain, included to test robustness to noise',
                    'The exact correct tool, duplicated to test whether the policy detects redundancy',
                    'A deprecated version of the real tool, included to test backward compatibility handling',
                  ],
                  answer: 0,
                  explanation: 'High-similarity distractors look almost like the real tool in embedding space — the hardest case to reject, forcing genuine discrimination.',
                },
                {
                  prompt: 'If ASTRA only injected low-similarity distractors (cosine < 0.4) rather than sampling across all three bands, what capability would the trained policy most likely fail to develop?',
                  options: [
                    'Robust discrimination against plausible, semantically close tools — it would learn to reject anything unfamiliar but not anything truly tempting',
                    'The ability to call any tools at all, since low-similarity distractors suppress tool use entirely',
                    'The ability to complete tasks within the 32-turn budget',
                    'The ability to generate syntactically valid tool invocation statements',
                  ],
                  answer: 0,
                  explanation: 'Easy, low-similarity distractors are trivial to filter out — only medium- and high-similarity distractors force real discrimination.',
                },
                {
                  prompt: 'Why does ASTRA run strictly online RL with no replay buffer of past rollouts, given that the environments are deterministic and freshly generated per instance?',
                  options: [
                    'Replaying stale rollouts would feed the policy advantage estimates computed against a version of itself it has since outgrown, since the policy continually changes even though the environment doesn\'t',
                    'Replay buffers are computationally infeasible at the 25,600-token max prompt length used in RL',
                    'Deterministic environments make replay buffers redundant because every rollout would be identical anyway',
                    'GRPO mathematically requires on-policy data only, by definition, regardless of environment determinism',
                  ],
                  answer: 0,
                  explanation: 'The policy is not static — replaying an old rollout would compute advantages against outdated behavior, corrupting the update. Strictly online RL keeps every gradient step grounded in current behavior.',
                },
                {
                  prompt: 'The lesson notes RL training uses "long-context settings sized for genuinely long-horizon multi-turn interaction, not toy episodes." Which configuration detail best supports that framing?',
                  options: [
                    'Max response length of 49,152 tokens combined with up to 32 turns per trajectory',
                    'Batch size 32 used during the SFT phase',
                    'Cosine learning rate schedule shared between SFT and RL phases',
                    'Context parallelism CP=2/CP=4 used only during SFT',
                  ],
                  answer: 0,
                  explanation: 'A 49,152-token response budget spread across up to 32 turns reflects trajectories that accumulate substantial interaction history, not single-shot question answering.',
                },
              ],
            },
          ],
        },
        {
          id: 'as-f1-reward-code',
          title: 'Implement the F1-style trajectory reward',
          minutes: 12,
          xp: 80,
          steps: [
            {
              kind: 'code',
              title: 'Balance recall and precision into one reward',
              challenge: {
                prompt: `Section 4.2 (Eq. 30–31) defines ASTRA's RL reward. For a job with \`n\` required sub-tasks, if the agent solves \`nHat\` sub-tasks using \`c\` tool invocations:

\`\`\`
r = nHat / n              (recall — fraction of required sub-tasks solved)
p = nHat / (c + epsilon)   (precision — sub-tasks solved per tool call)
reward = 2 * p * r / (p + r)   (harmonic mean of p and r)
\`\`\`

This jointly rewards task completion (recall) and interaction efficiency (precision) — the paper shows recall-only rewards cause runaway tool calling, while precision-only rewards make the agent too conservative to call tools at all.

Implement \`f1TrajectoryReward(nRequired, nSolved, toolCalls, epsilon = 1e-6)\`. Guard against the case where both precision and recall are zero (avoid a 0/0 division).`,
                starterCode: `function f1TrajectoryReward(nRequired, nSolved, toolCalls, epsilon = 1e-6) {
  // TODO: compute recall r, precision p, then return their harmonic mean.
  // If p + r === 0, return 0 instead of dividing by zero.
  return 0;
}`,
                solution: `function f1TrajectoryReward(nRequired, nSolved, toolCalls, epsilon = 1e-6) {
  const r = nSolved / nRequired;
  const p = nSolved / (toolCalls + epsilon);
  if (p + r === 0) return 0;
  return (2 * p * r) / (p + r);
}`,
                tests: `test('perfect recall and precision', () => { assertEqual(Math.round(f1TrajectoryReward(4, 4, 4) * 1000) / 1000, 1); });
test('zero solved gives zero reward', () => { assertEqual(f1TrajectoryReward(4, 0, 3), 0); });
test('low precision, high recall', () => {
  const r = 1, p = 4 / (20 + 1e-6);
  const expected = Math.round((2 * p * r / (p + r)) * 1000) / 1000;
  assertEqual(Math.round(f1TrajectoryReward(4, 4, 20) * 1000) / 1000, expected);
});
test('partial recall, efficient calls', () => {
  const r = 2 / 4, p = 2 / (2 + 1e-6);
  const expected = Math.round((2 * p * r / (p + r)) * 1000) / 1000;
  assertEqual(Math.round(f1TrajectoryReward(4, 2, 2) * 1000) / 1000, expected);
});`,
              },
            },
          ],
        },
        {
          id: 'as-evaluation-results',
          title: 'Does any of this actually move the needle?',
          minutes: 10,
          xp: 60,
          steps: [
            { kind: 'read', title: 'Benchmarks and headline results', markdown: evaluationResultsMd },
            {
              kind: 'quiz',
              title: 'Results check',
              questions: [
                {
                  prompt: 'ASTRA is evaluated on three agentic multi-turn benchmarks plus two non-agentic math benchmarks. What is the purpose of including the math benchmarks?',
                  options: [
                    'To check that tool-use training didn\'t quietly damage general reasoning ability',
                    'To establish a difficulty baseline before agentic training begins',
                    'To measure how well the model can call a calculator tool',
                    'To compare ASTRA against closed-source models on a non-tool task for marketing purposes',
                  ],
                  answer: 0,
                  explanation: 'AIME 2024/2025 are included as a control for catastrophic forgetting — checking that specializing for tool-use didn\'t cost the model its core math reasoning.',
                },
                {
                  prompt: 'In Table 1, Astra-32B-thinking-v1 scores 64.25 on BFCL-MT versus 49.63 for the untrained Qwen3-32B base model. What does this gap most directly demonstrate?',
                  options: [
                    'That larger models always outperform smaller ones regardless of training',
                    'That the ASTRA training pipeline (SFT + RL) produces a substantial capability gain over the same base model untrained',
                    'That BFCL-MT is an easier benchmark than τ2-Bench',
                    'That closed-source models have an inherent architectural advantage',
                  ],
                  answer: 1,
                  explanation: 'Both rows use the identical Qwen3-32B base — the only difference is ASTRA training, isolating the effect of the pipeline itself.',
                },
                {
                  prompt: 'How does Astra-32B-thinking-v1 compare to the closed-source Claude-Opus-4.5 across the three agentic benchmarks?',
                  options: [
                    'It surpasses Claude-Opus-4.5 on all three benchmarks',
                    'It closes most of the gap to Claude-Opus-4.5 but does not surpass it on any of the three',
                    'It matches Claude-Opus-4.5 exactly on τ2-Bench',
                    'It performs worse than the untrained Qwen3-32B base on ACEBench',
                  ],
                  answer: 1,
                  explanation: 'ASTRA-32B trails Claude-Opus-4.5 on every benchmark shown, but the gap is much smaller than the gap to the untrained base.',
                },
                {
                  prompt: 'At matched parameter scale, how does Astra-32B-thinking-v1 compare to GLM-4.6, an open-source model of similar size?',
                  options: [
                    'Astra-32B underperforms GLM-4.6 on every benchmark',
                    'Astra-32B beats GLM-4.6 only on ACEBench',
                    'Astra-32B beats or is competitive with comparable-scale open-source models on multiple benchmarks',
                    'GLM-4.6 and Astra-32B are not directly comparable because they differ in parameter count',
                  ],
                  answer: 2,
                  explanation: 'ASTRA-trained models achieve state-of-the-art results at matched parameter scales among open-source models, per the headline result.',
                },
                {
                  prompt: 'Table 2 breaks the 32B model\'s gain into SFT and RL stages. What is the key finding from this stage-wise breakdown?',
                  options: [
                    'SFT alone accounts for nearly all of the improvement, with RL adding only a marginal amount',
                    'SFT and RL contribute roughly equal gains',
                    'RL contributes the largest improvement, considerably larger than the gain from SFT alone',
                    'RL actually hurts BFCL-MT performance relative to the SFT-only checkpoint',
                  ],
                  answer: 2,
                  explanation: 'On BFCL-MT, SFT adds +4.25 over base while the total gain after RL reaches +16.38 — RL contributes the largest share of the improvement.',
                },
                {
                  prompt: 'Why does RL contribute a larger gain than SFT in the ASTRA training pipeline, according to the lesson\'s framing?',
                  options: [
                    'RL uses a larger and more diverse dataset than SFT',
                    'SFT teaches fluent tool-use mechanics, while RL teaches the policy to solve hard, multi-hop problems by exploring verifiable environments',
                    'RL is run for many more epochs than SFT, so any gain is purely a function of training time',
                    'SFT is only used as a regularizer to prevent RL from overfitting',
                  ],
                  answer: 1,
                  explanation: 'SFT provides a cold start of fluent mechanics; RL is what actually teaches the policy to solve hard problems through exploration in verifiable environments.',
                },
                {
                  prompt: 'Table 3 shows AIME 2024/2025 scores for Qwen3-32B (74.90 avg) versus ASTRA-32B (74.85 avg). What does this near-identical result imply?',
                  options: [
                    'ASTRA training had no measurable effect on the model at all',
                    'Tool-use specialization via SFT+RL did not trade away the model\'s core mathematical reasoning ability',
                    'AIME is too easy a benchmark to detect any training effect',
                    'The RL reward signal directly optimized for math performance as a side effect',
                  ],
                  answer: 1,
                  explanation: 'Math scores stay essentially flat before and after ASTRA training, even though agentic benchmark scores jump substantially — the specialization was targeted, not a wholesale rewrite.',
                },
                {
                  prompt: 'The lesson poses the question "wouldn\'t heavy RL on tool-use tasks risk catastrophic forgetting of general reasoning?" What is the given explanation for why this risk didn\'t materialize?',
                  options: [
                    'The RL reward is trajectory-level and specific to tool-use behavior, so it never touches the policy\'s general reasoning style, leaving math capability intact',
                    'The model was small enough that catastrophic forgetting doesn\'t apply',
                    'Math reasoning and tool use share no underlying parameters in the model architecture',
                    'The SFT stage was run again after RL to restore any lost reasoning ability',
                  ],
                  answer: 0,
                  explanation: 'The reward is specifically about tool-use behavior, not a wholesale rewrite of reasoning style — capabilities the reward never touches are preserved by default.',
                },
              ],
            },
          ],
        },
        {
          id: 'as-discussion-critique',
          title: 'Diagnosing tool-use failure modes',
          minutes: 10,
          xp: 60,
          steps: [
            {
              kind: 'scenario',
              title: 'Reading the ablations',
              scenario: {
                intro: 'Section 4\'s ablations show what happens when ASTRA\'s design choices are removed one at a time. You\'re debugging a tool-using agent and need to match the symptom to the cause.',
                stages: [
                  {
                    situation: 'Your RL-trained agent frequently calls tools that are obviously unrelated to the task at hand, alongside the correct ones.',
                    question: 'Which training choice most likely explains this?',
                    options: [
                      { label: 'The agent was trained with no irrelevant-tool mixing — it never had to practice rejecting a plausible-but-wrong tool, so it never learned negative tool judgment', quality: 'best', feedback: 'Correct — Section 4.1 shows removing irrelevant tools yields the worst performance: the policy overfits to a narrow tool-selection pattern and lacks discrimination pressure.' },
                      { label: 'The agent was trained with the full F1-style reward, which doesn\'t penalize irrelevant calls', quality: 'bad', feedback: 'The F1 reward does penalize unnecessary tool calls through its precision term — this points away from, not toward, the symptom described.' },
                      { label: 'The agent\'s SFT cold start used too few epochs', quality: 'bad', feedback: 'Epoch count affects general competence, not specifically tool discrimination — the ablations isolate irrelevant-tool mixing as the relevant variable.' },
                    ],
                  },
                  {
                    situation: 'Tracking interaction length across RL training steps, you see the average number of turns per trajectory keep climbing until training eventually destabilizes and collapses.',
                    question: 'Which reward configuration is most likely responsible?',
                    options: [
                      { label: 'Recall-only reward — optimizing only for solving sub-tasks gives no penalty for issuing more tool calls, so the policy prolongs interaction and inflates sequence length until optimization destabilizes', quality: 'best', feedback: 'Correct — Figure 7/8 show recall-only optimization causes turns to explode and training to collapse later on.' },
                      { label: 'Precision-only reward — optimizing only for efficient tool calls causes the same runaway turn growth', quality: 'bad', feedback: 'Precision-only does the opposite: it drives turns down sharply by discouraging tool calls, producing an overly conservative agent.' },
                      { label: 'Irrelevant-tool mixing with too many high-similarity distractors', quality: 'bad', feedback: 'Tool mixing affects discrimination, not the reward shaping that controls turn-length growth over training.' },
                    ],
                  },
                  {
                    situation: 'A different deployment shows the opposite problem: the agent stops calling tools early, leaving many sub-tasks unresolved, and acts overly conservative even when more tool use would clearly help.',
                    question: 'Which reward configuration best explains this?',
                    options: [
                      { label: 'Precision-only reward — discouraging any tool call that doesn\'t immediately pay off pushes the policy toward overly conservative, short-horizon behavior', quality: 'best', feedback: 'Correct — Section 4.2 describes exactly this: precision-only optimization "pushes the policy toward overly conservative, short-horizon behavior that is brittle in multi-step settings."' },
                      { label: 'Recall-only reward — rewarding sub-task completion alone would make the agent call too few tools', quality: 'bad', feedback: 'Recall-only does the opposite — it causes runaway over-calling, not under-calling.' },
                      { label: 'No irrelevant-tool mixing — without distractors, the agent becomes too cautious about calling any tool', quality: 'bad', feedback: 'Removing distractors makes the agent indiscriminate, not conservative — that ablation produces over-calling of plausible tools, not under-calling.' },
                    ],
                  },
                  {
                    situation: 'You\'re designing the RL reward for a new tool-use system from scratch and want to avoid both failure modes above.',
                    question: 'Which reward design should you choose?',
                    options: [
                      { label: 'An F1-style reward that takes the harmonic mean of recall and precision, jointly rewarding task completion and interaction efficiency', quality: 'best', feedback: 'Correct — the F1 reward "yields well-behaved turn distributions and stable training" by coupling both incentives into one objective.' },
                      { label: 'A recall-only reward, since task completion is the primary goal', quality: 'bad', feedback: 'This is exactly the configuration that caused runaway tool calling and training collapse in the ablation.' },
                      { label: 'A precision-only reward, since interaction efficiency is easiest to measure', quality: 'bad', feedback: 'This is the configuration that caused overly conservative under-calling and brittle multi-step behavior.' },
                    ],
                  },
                ],
                debrief: 'Every ablation in Section 4 isolates one variable and shows a specific, predictable failure: no distractors → no discrimination; recall-only → runaway calling; precision-only → under-calling. The F1-style reward and balanced tool mixing aren\'t arbitrary choices — each directly counters one of these observed failure modes.',
              },
            },
          ],
        },
      ],
    },
  ],
}
