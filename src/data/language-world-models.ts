import type { Subject } from '../types'
import motivationMd from './md/aw-motivation.md?raw'
import schemaMd from './md/aw-schema.md?raw'
import trainingMd from './md/aw-training.md?raw'
import benchMd from './md/aw-bench.md?raw'
import appsMd from './md/aw-apps.md?raw'
import analysisMd from './md/aw-analysis.md?raw'

export const languageWorldModels: Subject = {
  id: 'language-world-models',
  title: 'Qwen-AgentWorld: Language World Models',
  tagline: 'Teaching a language model to predict environment dynamics — and using "predict before you act" to build better agents.',
  icon: '🌐',
  accent: '#10b981',
  modules: [
    {
      id: 'aw-m1',
      title: 'Language World Models for General Agents',
      description:
        'How Qwen-AgentWorld trains one model to simulate seven agent environments, and the two ways world modeling makes agents stronger: decoupling it as a simulator, and unifying it into the agent itself.',
      lessons: [
        {
          id: 'aw-motivation',
          title: 'Why a World Model for Language Agents?',
          minutes: 11,
          xp: 60,
          steps: [
            { kind: 'read', title: 'The missing half of the agent loop', markdown: motivationMd },
            {
              kind: 'quiz',
              title: 'Policy, world model, decouple, unify',
              questions: [
                {
                  prompt: 'In the paper\'s framing of the agent interaction loop, what distinguishes the "policy" from the "world model"?',
                  options: [
                    'The policy maps states to actions ("what should I do next?"); the world model maps (state, action) to the next state ("what happens if I do this?")',
                    'The policy predicts environment feedback; the world model selects the next action to take',
                    'The policy and world model are two names for the same component trained with different loss functions',
                    'The policy operates only during training, while the world model operates only at inference time',
                  ],
                  answer: 0,
                  explanation: 'The policy answers "what should I do next?" (states → actions); the world model answers "what happens if I do this?" ((states, actions) → next states). The paper\'s core argument is that agent research has focused almost entirely on the policy half.',
                },
                {
                  prompt: 'The lesson explicitly rejects one common explanation for why you\'d want a world model instead of just using the real environment. What is that rejected explanation?',
                  options: [
                    'That it improves the agent\'s policy directly',
                    'That it is purely a cost-saving trick',
                    'That it eliminates the need for chain-of-thought reasoning',
                    'That it removes the need for a policy model entirely',
                  ],
                  answer: 1,
                  explanation: 'The paper states the motivation is "Not for Cost Reduction, but as a Complementary Axis for Pushing the Frontier" — a world model does things a real environment fundamentally cannot, not merely make things cheaper.',
                },
                {
                  prompt: 'What is a concrete example of the "controllability" benefit that a real environment rarely provides on demand?',
                  options: [
                    'Running thousands of environments in parallel on cheap hardware',
                    'Deliberately injecting an API error or returning partial/paginated results to expose agent weaknesses',
                    'Guaranteeing the agent never encounters irreversible operations',
                    'Producing a perfectly deterministic, error-free simulation every time',
                  ],
                  answer: 1,
                  explanation: 'Controllability means instructing the world model to misbehave on purpose — injecting an API error, paginating a response, returning partial results — to expose the agent\'s weak points, which real environments rarely do on command.',
                },
                {
                  prompt: 'What is the "unifying" argument for a world model, as opposed to the scalability and controllability arguments?',
                  options: [
                    'A single model handling both action selection and outcome prediction can mentally simulate consequences before acting, performing no worse than a policy-only agent',
                    'Unifying eliminates the need for any chain-of-thought reasoning',
                    'One model is cheaper to train than two separate models',
                    'Unification is only useful for the Search domain',
                  ],
                  answer: 0,
                  explanation: 'The unifying argument (citing Richens et al., 2025) is that an agent able to predict environment feedback before acting can perform no worse than one lacking that capacity — a capability argument, not a cost argument.',
                },
                {
                  prompt: 'What does the "necessity argument" (from Richens et al., 2025) claim?',
                  options: [
                    'World models are optional add-ons that only help in low-data regimes',
                    'Any agent that generalizes across a sufficiently broad range of tasks must have already learned a world model implicitly, making world models necessary, not just useful',
                    'World models are necessary only for the Terminal and SWE domains',
                    'Policies are unnecessary once a world model exists',
                  ],
                  answer: 1,
                  explanation: 'The necessity argument is that generalization implies an implicit world model already exists inside any sufficiently general agent — so you may as well learn it on purpose and reuse it explicitly.',
                },
              ],
            },
          ],
        },
        {
          id: 'aw-schema',
          title: 'One Schema for Seven Worlds',
          minutes: 12,
          xp: 70,
          steps: [
            { kind: 'read', title: 'The unified trajectory schema', markdown: schemaMd },
            {
              kind: 'quiz',
              title: 'LWM formalism and the five-component prompt',
              questions: [
                {
                  prompt: 'According to ô_(t+1) = f_θ(c, o_(≤t), a_(≤t)), what is the model predicting?',
                  options: [
                    'The next environment observation, given the system prompt, full observation history, and all actions including the current one',
                    'The agent\'s next action, given the system prompt and observation history',
                    'The next system prompt component, given the trajectory so far',
                    'The probability that the current action will succeed',
                  ],
                  answer: 0,
                  explanation: 'The LWM outputs ô_(t+1), the predicted next observation, conditioned on c (system prompt), o_(≤t) (observation history), and a_(≤t) (actions including the current one). It never predicts actions — that is the agent\'s job.',
                },
                {
                  prompt: 'Why does the paper insist on a sharp distinction between an "environment trajectory" and an "agentic trajectory"?',
                  options: [
                    'The LWM only models the environment trajectory — the (action, observation) pairs — after the agent\'s internal reasoning has been stripped out',
                    'Environment trajectories include reasoning while agentic trajectories do not',
                    'Agentic trajectories are only used for the GUI domains',
                    'The two terms describe the same data from different training stages',
                  ],
                  answer: 0,
                  explanation: 'An agentic trajectory includes the agent\'s thinking plus action selection; an environment trajectory keeps only the (action, observation) pairs. The LWM models the latter — it cares what the environment did, not why the agent acted.',
                },
                {
                  prompt: 'Which of the following is NOT one of the five components of the unified system prompt schema?',
                  options: [
                    'reward_signal',
                    'action_space',
                    'initial_state',
                    'simulation_instruction',
                  ],
                  answer: 0,
                  explanation: 'The five components are task_description, action_space, initial_state, demonstrations, and simulation_instruction. There is no reward_signal — the LWM predicts observations, it is not an RL agent being optimized against a reward.',
                },
                {
                  prompt: 'Why does a detailed initial_state matter so much for predicting something like a disk-full error from pip install?',
                  options: [
                    'The LWM has no real machine behind it — it can only predict an effect like a full disk if that fact was explicitly stated in the initial state',
                    'initial_state is the only required component, while all others are optional',
                    'The action_space component encodes disk usage automatically',
                    'Demonstrations always include a disk-full example by convention',
                  ],
                  answer: 0,
                  explanation: 'The LWM is a text predictor with no underlying machine. Its only source of truth is the system prompt. If the initial_state doesn\'t say the disk is nearly full, the model has no way to "know" pip install would fail with an out-of-space error.',
                },
                {
                  prompt: 'Why can a text-only language model "see" an Android screen despite never processing pixels?',
                  options: [
                    'The GUI domains represent screen state as a textual accessibility tree or UI view hierarchy, which the LWM predicts and which can then be rendered',
                    'Android, Web, and OS use JSON tool calls instead of screen state',
                    'The model is given a screenshot but converts it to text internally',
                    'GUI domains do not require an observation at all, only an action',
                  ],
                  answer: 0,
                  explanation: 'For Android, Web, and OS, the observation is a textual accessibility tree or UI view hierarchy (e.g. HTML), not pixels. The LWM predicts the next screen as this text, which can then be rendered — letting one shared schema cover GUI domains.',
                },
              ],
            },
          ],
        },
        {
          id: 'aw-training',
          title: 'CPT Injects, SFT Activates, RL Sharpens',
          minutes: 14,
          xp: 80,
          steps: [
            { kind: 'read', title: 'The three-stage training recipe', markdown: trainingMd },
            {
              kind: 'quiz',
              title: 'Stages, loss masking, and reward design',
              questions: [
                {
                  prompt: 'What is the key distinction between what CPT and SFT each contribute?',
                  options: [
                    'CPT teaches next-state prediction implicitly via the language-modeling loss; SFT makes it an explicit reasoning pattern with thinking trajectories',
                    'CPT trains on tool-use trajectories while SFT trains on domain knowledge corpora',
                    'CPT and SFT both use rejection sampling, but SFT adds rubric-based rewards',
                    'CPT activates explicit reasoning chains, while SFT injects raw factual knowledge',
                  ],
                  answer: 0,
                  explanation: 'CPT bakes next-state prediction in implicitly through next-token training on world-modeling trajectories. SFT makes it explicit by switching to thinking trajectories with reasoning chains, reducing hallucination and improving long-trajectory consistency.',
                },
                {
                  prompt: 'A tool-use turn shows Overlap (OL) ≥ 70% and Novelty (Nov) < 30%. Which category is it, and how much counts toward the loss?',
                  options: [
                    'retrieval — 100% kept, because high overlap implies new content was retrieved',
                    'transform — 50% kept, since the observation differs in length from the action',
                    'echo — only 5% kept, since the observation mostly repeats the action\'s vocabulary with almost nothing new',
                    'other — 100% kept, since it doesn\'t match a defined boilerplate pattern',
                  ],
                  answer: 2,
                  explanation: 'High OL plus very low Nov is the echo signature (e.g. think(x) → {thought:x}), which keeps only 5% of tokens — the lowest keep ratio of all seven categories, since the observation carries almost no new information.',
                },
                {
                  prompt: 'What is "extreme prompt–output asymmetry" in the RL stage, and what does it imply?',
                  options: [
                    'The prompt is a single short instruction while the output is a long trajectory, so compute is dominated by generation',
                    'The prompt (full trajectory history, tens of thousands of tokens) vastly exceeds the output (one short observation), so per-sample compute is dominated by prompt processing rather than generation',
                    'It refers to the 9:1 weighting between rubric and rule rewards',
                    'It refers to the mismatch between the 256k SFT window and the 128k RL prompt cap',
                  ],
                  answer: 1,
                  explanation: 'The prompt is the entire trajectory history — often tens of thousands of tokens — while the output is a single short observation. So compute per sample is dominated by processing the long prompt, unlike typical RL where generation dominates.',
                },
                {
                  prompt: 'Why is the rule-based verifier given only 1/10 the weight of the rubric, yet described as "load-bearing"?',
                  options: [
                    'It is cheap to compute, so its low weight is purely a cost-saving measure',
                    'It covers more failure modes than the rubric, so a small weight dominates training',
                    'Unlike an LLM judge, executable rule-checking code cannot be flattered by self-praise — it acts as an objective anchor against reward hacking even at low weight',
                    'The rubric is unreliable at factuality, so the rule verifier scores only that one dimension',
                  ],
                  answer: 2,
                  explanation: 'The LLM judge can be flattered — the policy learns to insert "operation completed successfully!" to inflate scores. The rule verifier runs code and produces a binary signal that can\'t be gamed, so even at 10% weight it anchors against reward hacking.',
                },
                {
                  prompt: 'The "Echo Trap" caused reward collapse during RL. What was the root cause and the fix?',
                  options: [
                    'The model echoed observations verbatim; fixed by deduplicating the SFT dataset',
                    'Expanding one trajectory into many samples gave them a long shared prefix, collapsing reward variance; fixed by restricting RL expansion to exactly one turn per trajectory',
                    'The judge echoed its own rubric as the reward; fixed by using only the rule verifier',
                    'Multiple trajectories converged to the same state; fixed by raising the prompt cap to 256k',
                  ],
                  answer: 1,
                  explanation: 'Expanding one trajectory into many samples gave them a long common prefix, collapsing reward variance (the Echo Trap). The fix: restrict RL expansion to exactly one turn per trajectory, so every sample predicts a unique target.',
                },
              ],
            },
            {
              kind: 'code',
              title: 'Implement information-theoretic loss masking statistics',
              challenge: {
                prompt: `In CPT, the paper masks low-information "boilerplate" turns out of the loss using four cheap, **domain-agnostic** statistics over an (action, observation) pair (Section 3.2).

Given the lowercased, **deduplicated** word sets \`W_act\` and \`W_obs\` (split on whitespace), implement \`turnStats(action, observation)\` returning four numbers, **each rounded to 2 decimals**:

- **ol**  (Overlap)  = |W_act ∩ W_obs| / |W_act| — how much action vocabulary the observation echoes
- **nov** (Novelty)  = |W_obs \\ W_act| / |W_obs| — fraction of genuinely new info in the observation
- **jac** (Jaccard)  = |W_act ∩ W_obs| / |W_act ∪ W_obs| — symmetric word-set similarity
- **r**   (length ratio) = observation.length / action.length — **character-level**, on the raw strings

Return \`{ ol, nov, jac, r }\`. If a denominator would be 0, return 0 for that field. Tokenize by splitting on whitespace, lowercasing, dropping empty tokens, and deduplicating.`,
                starterCode: `function turnStats(action, observation) {
  // TODO: compute the four statistics
  return { ol: 0, nov: 0, jac: 0, r: 0 }
}`,
                solution: `function turnStats(action, observation) {
  const toks = (s) => Array.from(new Set(s.toLowerCase().split(/\\s+/).filter(Boolean)))
  const Wact = toks(action), Wobs = toks(observation)
  const actSet = new Set(Wact)
  const interN = Wobs.filter((w) => actSet.has(w)).length
  const onlyObs = Wobs.filter((w) => !actSet.has(w)).length
  const unionN = new Set([...Wact, ...Wobs]).size
  const round = (x) => Math.round(x * 100) / 100
  return {
    ol: Wact.length ? round(interN / Wact.length) : 0,
    nov: Wobs.length ? round(onlyObs / Wobs.length) : 0,
    jac: unionN ? round(interN / unionN) : 0,
    r: action.length ? round(observation.length / action.length) : 0,
  }
}`,
                tests: `test('echo turn: high overlap, zero novelty', () => {
  assertEqual(turnStats('echo hello world', 'hello world'), { ol: 0.67, nov: 0, jac: 0.67, r: 0.69 });
});
test('retrieval turn: all-new observation', () => {
  assertEqual(turnStats('cat data', 'alpha beta gamma delta'), { ol: 0, nov: 1, jac: 0, r: 2.75 });
});
test('action turn: short status reply', () => {
  assertEqual(turnStats('status', 'ok'), { ol: 0, nov: 1, jac: 0, r: 0.33 });
});
test('echo-category mirror', () => {
  assertEqual(turnStats('think x', 'thought x'), { ol: 0.5, nov: 0.5, jac: 0.33, r: 1.29 });
});`,
              },
            },
          ],
        },
        {
          id: 'aw-bench',
          title: 'Grading a World Model: AgentWorldBench',
          minutes: 12,
          xp: 70,
          steps: [
            { kind: 'read', title: 'Reference-grounded evaluation and results', markdown: benchMd },
            {
              kind: 'quiz',
              title: 'Benchmark design and headline results',
              questions: [
                {
                  prompt: 'Why does AgentWorldBench partition training data and benchmark queries at the "data-source" level rather than just holding out random tasks?',
                  options: [
                    'To make the benchmark cheaper to construct',
                    'To ensure the benchmark probes generalization rather than memorization, since a model could otherwise have seen similar tasks from the same source',
                    'To guarantee every domain has the same number of samples',
                    'To make frontier-agent trajectories always longer than intermediate ones',
                  ],
                  answer: 1,
                  explanation: 'Partitioning at the source level prevents a model from having implicitly seen near-duplicate tasks during training, so the benchmark tests learned environment dynamics rather than memorized patterns from a particular source.',
                },
                {
                  prompt: 'Which scoring dimension evaluates whether a predicted observation is internally coherent AND coherent with prior turns?',
                  options: ['Realism', 'Format', 'Consistency', 'Quality'],
                  answer: 2,
                  explanation: 'Consistency checks both internal coherence and coherence with the trajectory\'s prior turns. Format checks structure, Realism checks match to real-environment behavior, and Quality checks completeness/conciseness versus the reference.',
                },
                {
                  prompt: 'What problem does "reference-grounded judging" solve that a naive LLM-judge ("is this a good output?") would not?',
                  options: [
                    'It removes the need for any rubric dimensions',
                    'It converts an open-ended quality judgment, which forces the judge to imagine a correct answer and risks hallucination, into a factual comparison against the real observation',
                    'It guarantees all judges give identical absolute scores',
                    'It eliminates the need to evaluate the last turn',
                  ],
                  answer: 1,
                  explanation: 'Without a reference, the judge must imagine a correct output — prone to hallucination. Handing it the real observation turns evaluation into concrete factual comparison, which is why independent judges agree closely on rankings (ρ = 0.92–0.99).',
                },
                {
                  prompt: 'Why does AgentWorldBench require only "format + range" matching (not exact matching) for runtime metadata like a process ID?',
                  options: [
                    'Because runtime metadata is unimportant to simulation quality',
                    'Because exact matching everywhere would falsely penalize a correct simulation for inventing a different-but-valid value, like a plausible PID',
                    'Because runtime metadata always exceeds deterministic content in difficulty',
                    'Because frontier judges cannot parse numeric values',
                  ],
                  answer: 1,
                  explanation: 'A simulated PID of 42731 is as valid as the real 18204 — PIDs are irreproducible noise. Exact-matching would generate false negatives by punishing semantically correct simulations for inventing plausible-but-different values.',
                },
                {
                  prompt: 'Qwen-AgentWorld-397B-A17B wins overall, but Claude Opus 4.8 beats it on Terminal (59.18 vs 57.73). What accounts for the overall edge?',
                  options: [
                    'The overall score is a weighted average that favors Terminal-Bench',
                    'Its advantage concentrates on Terminal and SWE — domains needing accurate code-execution and tool-API modeling — and it leads SWE clearly even though Claude edges it on Terminal',
                    'Claude Opus 4.8 was excluded from the GUI domains',
                    'Qwen-AgentWorld wins purely due to GUI dominance',
                  ],
                  answer: 1,
                  explanation: 'The win is biggest on Terminal and SWE (code-execution state and tool-API behavior). Even though Claude narrowly leads Terminal, Qwen-AgentWorld\'s clear SWE lead (68.49 vs 64.10) plus competitive Terminal gives it the overall edge.',
                },
              ],
            },
          ],
        },
        {
          id: 'aw-apps',
          title: 'Decouple or Unify: Two Ways to Use a World Model',
          minutes: 13,
          xp: 80,
          steps: [
            { kind: 'read', title: 'Environment simulator vs. agent foundation model', markdown: appsMd },
            {
              kind: 'scenario',
              title: 'Choosing how to apply the world model',
              scenario: {
                intro:
                  'You\'re an ML engineer improving a tool-using agent. You have access to Qwen-AgentWorld as a high-fidelity language world model. For each situation, decide how to apply world modeling — and watch for the traps the paper documents.',
                stages: [
                  {
                    situation:
                      'You have only a small pool of real trajectories for a niche OpenClaw-style workflow domain. Many of its operations are irreversible, so running large-scale RL against the live environment is risky and infeasible. You need far more training environments than you have real data for.',
                    question: 'How do you scale up training?',
                    options: [
                      {
                        label: 'Decouple: distill the real traces into seed scenarios and use the LWM as a simulator to synthesize thousands of environments for Sim RL',
                        quality: 'best',
                        feedback: 'Exactly the §6.1.1 recipe. From a small pool of real trajectories, distill seed scenarios (initial state + query), then synthesize ~4k environments for Sim RL — yielding gains (+4.3 Claw-Eval, +7.1 QwenClawBench) on domains absent from world-model training.',
                      },
                      {
                        label: 'Train the policy only on the few real trajectories you already have',
                        quality: 'bad',
                        feedback: 'This is exactly the scarcity the simulator is meant to solve. A handful of real traces can\'t cover the workflow distribution; the whole point of decoupling is turning scarce real evidence into broad interaction coverage.',
                      },
                      {
                        label: 'Run pure policy RL directly against the live environment despite the irreversible operations',
                        quality: 'bad',
                        feedback: 'Irreversible operations are precisely why real execution is infeasible here. The paper motivates the simulator for domains where real execution is unsafe, proprietary, or unavailable.',
                      },
                    ],
                  },
                  {
                    situation:
                      'Your MCP agent is weak at handling intermittent API errors and paginated responses. You tried standard Sim RL with the LWM as a plain simulator, but Tool Decathlon actually dropped from 32.4 to 31.5 — no gain at all.',
                    question: 'What do you change?',
                    options: [
                      {
                        label: 'Use controllable simulation: inject targeted perturbations (API errors, pagination, partial failures) via grounded simulation instructions',
                        quality: 'best',
                        feedback: 'Right — §6.1.2. Controllability is not just a magnitude knob but a prerequisite for Sim RL to work in this domain. Controlled Sim RL lifted MCPMark by +12.3 by deliberately exposing the agent\'s weak points.',
                      },
                      {
                        label: 'Add more uncontrolled Sim RL data and train longer',
                        quality: 'bad',
                        feedback: 'Uncontrolled Sim RL is what just failed (it even dropped Tool Decathlon). Without grounded simulation instructions, the training signal is too noisy to yield any gain — more of it won\'t help.',
                      },
                      {
                        label: 'Switch to a larger base policy model',
                        quality: 'bad',
                        feedback: 'The problem isn\'t capacity — it\'s that the agent never sees the edge cases it\'s weak on. Controllable perturbation creates those conditions; a bigger model trained on the same noisy signal still won\'t learn them.',
                      },
                    ],
                  },
                  {
                    situation:
                      'You want to train a Search agent to actually use the search tool (not answer from parametric memory) and to learn multi-step retrieval — without risking that fabricated training "facts" leak into and corrupt the agent\'s real-world knowledge.',
                    question: 'How do you set up the Search environment?',
                    options: [
                      {
                        label: 'Fictional-world construction: have the LWM simulate a self-consistent invented world where answers exist only within the fiction',
                        quality: 'best',
                        feedback: 'This is the §6.1.2 fictional-world design. Because answers exist only in the fiction, the agent can\'t shortcut from memory and must search; because facts are invented, it can\'t confuse them with real knowledge. It still transfers (+16.29 F1 on WideSearch at 35B).',
                      },
                      {
                        label: 'Simulate a realistic copy of a real search engine returning real-looking facts',
                        quality: 'bad',
                        feedback: 'The paper warns this risks injecting fabricated-but-plausible facts the agent later treats as true. A real-looking simulation also lets the agent answer from parametric memory instead of learning to search.',
                      },
                    ],
                  },
                  {
                    situation:
                      'Separately, you want your agent to be generally better at planning across many tasks, and you\'d rather not maintain a separate simulator and Sim RL pipeline at all. You can afford one extra training stage on the agent model itself.',
                    question: 'Which paradigm fits?',
                    options: [
                      {
                        label: 'Unify: apply LWM RL warm-up (single-turn next-state prediction) to the agent model, internalizing "predict before you act"',
                        quality: 'best',
                        feedback: 'This is Application II (§6.2). Single-turn, non-agentic LWM warm-up — with no tool calls — transfers to multi-turn tool-using tasks across seven benchmarks (e.g. +11.3 Claw-Eval, +9.0 BFCL v4), because the agent learns to mentally simulate outcomes before acting.',
                      },
                      {
                        label: 'Stick with decoupling and build the separate simulator + Sim RL pipeline anyway',
                        quality: 'bad',
                        feedback: 'That works but contradicts your constraint (no separate simulator). The unify paradigm folds world modeling into the agent itself as a warm-up stage — no separate simulator needed.',
                      },
                      {
                        label: 'Do ordinary agentic RL with no world-modeling objective',
                        quality: 'bad',
                        feedback: 'That\'s the policy-only status quo the paper argues against. Without a world-modeling stage, the agent never internalizes next-state prediction, leaving the documented cross-task gains on the table.',
                      },
                    ],
                  },
                ],
                debrief:
                  'Decouple (simulator for Sim RL) and Unify (warm-up inside the agent) are complementary, not competing. Scalability and controllability are the simulator\'s superpowers — but remember the bottleneck: every one of these wins depends on a sufficiently detailed initial state. Without it, simulation fidelity degrades and downstream gains vanish.',
              },
            },
          ],
        },
        {
          id: 'aw-analysis',
          title: 'Inside the Simulation: How an LWM Reasons',
          minutes: 11,
          xp: 70,
          steps: [
            { kind: 'read', title: 'Reasoning patterns and predict-before-acting', markdown: analysisMd },
            {
              kind: 'quiz',
              title: 'Self-correction, causal chains, and the mailman case',
              questions: [
                {
                  prompt: 'How does the paper reframe what "Wait!" interrupts mean for how the model generates predictions?',
                  options: [
                    'Environment prediction shifts from single-pass generation to a constrained satisfiability search — propose, check, and revise until consistent',
                    'The model randomly guesses until one prediction happens to match the ground truth',
                    'The interrupts are a formatting artifact with no effect on accuracy',
                    'The model pauses to retrieve external documentation',
                  ],
                  answer: 0,
                  explanation: '"Wait!" tokens convert prediction from one-shot generation into a constrained satisfiability search: propose an intermediate state, check it against everything known, revise if inconsistent — repeating until the prediction holds up.',
                },
                {
                  prompt: 'A trace where the model catches itself saying "I can\'t actually know what np.random.seed(42) produces without executing it" is which self-correction subtype?',
                  options: ['Factual', 'Perspective-taking', 'Epistemological', 'Procedural'],
                  answer: 2,
                  explanation: 'Epistemological self-corrections catch the limits of in-context computation — recognizing some information genuinely can\'t be derived without execution. Factual fixes wrong content; perspective-taking models another party\'s knowledge; there is no "procedural" subtype.',
                },
                {
                  prompt: 'Why does the paper call the Search-domain information-leakage prevention a "theory of mind" capability?',
                  options: [
                    'The model refuses to answer any query it judges too easy',
                    'The model distinguishes what the agent currently knows/intends from what the environment should reveal, rather than dumping all information it holds',
                    'The model simulates a human user persona rather than a search engine',
                    'The model asks the agent clarifying questions before responding',
                  ],
                  answer: 1,
                  explanation: 'Theory of mind here means modeling another agent\'s knowledge and intent. The world model holds the reference answer but deliberately withholds it when the query is off-topic — separating "what I (the environment) know" from "what the agent should learn now."',
                },
                {
                  prompt: 'Predicting the output of `curl -s localhost:3000 | python3 -m json.tool` requires chaining six causal steps. What does this demonstrate?',
                  options: [
                    'It memorized this exact command sequence from training data',
                    'It composes knowledge across distinct abstraction layers (package management, process lifecycle, curl semantics, Python errors) into a correct causal chain',
                    'It only needs to track whether the server process exists',
                    'It executes the command internally in a sandbox',
                  ],
                  answer: 1,
                  explanation: 'The six-step chain (missing Node.js → server never starts → no listener → curl fails silently → empty piped input → JSONDecodeError) spans several knowledge domains. The model links causes across abstraction layers — it isn\'t running code or tracking a single variable.',
                },
                {
                  prompt: 'In the mailman task, both pre-RL and post-RL models hit the identical Postfix error. What actually distinguished success from failure?',
                  options: [
                    'The post-RL model used a different shell',
                    'The post-RL model predicted the correct ordering of Postfix\'s internal checks (rejection before transport routing), leading it to fix local_recipient_maps instead of transport_maps',
                    'The post-RL model had access to the Postfix source code',
                    'The pre-RL model misread the error message text',
                  ],
                  answer: 1,
                  explanation: 'Both saw the same error. The decisive difference was their internal world model of why: the pre-RL model wrongly thought validation happens after transport routing (kept tweaking transport_maps, timed out); the post-RL model correctly predicted validation happens first and fixed local_recipient_maps.',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
