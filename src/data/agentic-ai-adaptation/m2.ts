import type { Module } from '../../types'
import a1EarlyMd from '../md/aaa-a-a1-early.md?raw'
import a1RlvrMd from '../md/aaa-a-a1-rlvr.md?raw'
import a2WoToolsMd from '../md/aaa-a-a2-wo-tools.md?raw'
import a2WithToolsMd from '../md/aaa-a-a2-with-tools.md?raw'

export const m2: Module = {
  id: 'aaa-m2',
  title: 'Agent Adaptation: A1 and A2',
  description:
    'How Section 4 turns the A1/A2 objectives into real systems: A1 trains agents on tool-execution signal — first via SFT/off-policy imitation, then via online RLVR — while A2 trains agents on evaluations of their own output, with and without tools in the loop.',
  lessons: [
    {
      id: 'aaa-a-a1-early',
      title: "A1's earlier playbook: SFT and off-policy imitation",
      minutes: 11,
      xp: 55,
      steps: [
        {
          kind: 'read',
          title: 'Tool execution as ground truth, before RLVR',
          markdown: a1EarlyMd,
        },
        {
          kind: 'quiz',
          title: 'Off-policy A1: what counts as correct?',
          questions: [
            {
              prompt:
                'Section 4 frames the A1/A2 distinction in terms of what each objective is "blind to." What is A1 (O_tool) blind to, according to the survey?',
              options: [
                'Whether the tool executed at all',
                "Whether the agent's overall reasoning strategy is sound — O_tool yields per-action credit but is silent about reasoning quality",
                'The format of the tool call',
                'Whether the model was fine-tuned with SFT or RL',
              ],
              answer: 1,
              explanation:
                'Section 4 states that A1 gives "dense, causally grounded feedback tied to specific actions—but this signal is blind to whether the agent\'s overall reasoning strategy is sound." O_tool scores individual actions, not the trajectory-level strategy that composes them.',
            },
            {
              prompt:
                'The survey traces three progressively stronger notions of "correctness" for off-policy A1 methods: golden-answer, golden-format, and direct-execution alignment. What is the key difference between golden-format and direct-execution alignment?',
              options: [
                'Golden-format checks if the call is syntactically/structurally valid regardless of the final answer; direct-execution alignment actually runs the tool and uses its real output (success, failure, returned values) as the signal',
                'They are the same thing described twice',
                'Golden-format requires running the tool, while direct-execution only checks call syntax',
                'Direct-execution alignment only applies to retrieval tasks',
              ],
              answer: 0,
              explanation:
                'Golden-format alignment (Gorilla, ToolFlow) checks structural/syntactic validity via things like AST subtree matching — "regardless of whether the final answer is right." Direct-execution alignment (CodeAct, NExT, LeReT) closes the loop by actually executing the tool and training on its real outcome, which "eliminates the need for pre-labeled answers or canonical formats."',
            },
            {
              prompt:
                'ToolAlpaca discards failed trajectories and learns only from successes. TP-LLaMA instead mines failed branches as dispreferred examples (y_l) against the expert\'s correct step (y_w) and trains with DPO. What recurring A1 theme does this progression illustrate?',
              options: [
                'Failed trajectories should always be deleted to keep training data clean',
                'The richer the exploitation of negative feedback, the more data-efficient the adaptation becomes',
                'DPO can only be used with retrieval tools',
                'TP-LLaMA replaces SFT entirely with reinforcement learning',
              ],
              answer: 1,
              explanation:
                'The survey explicitly calls this out: "The progression from ToolAlpaca to TP-LLaMA thus illustrates a recurring theme in A1 methods: the richer the exploitation of negative feedback, the more data-efficient the adaptation." TRICE\'s ranking loss is a middle step between ToolAlpaca\'s discard-on-failure and TP-LLaMA\'s full contrastive use of failures.',
            },
            {
              prompt:
                'All the SFT/off-policy A1 methods in §4.1.1 — regardless of which correctness notion they use — share one structural ceiling that motivates the move to RLVR. What is it?',
              options: [
                'They all require a GPU cluster larger than RLVR methods need',
                'They train on pre-collected trajectories the agent did not generate, so they cannot explore tool-use strategies absent from that training distribution',
                'They only work for code-based tools, not retrieval or search',
                'They cannot use DPO, only SFT',
              ],
              answer: 1,
              explanation:
                'The survey is explicit: "all off-policy methods share a fundamental ceiling: because they learn from pre-collected trajectories, they cannot explore novel tool-use strategies that were absent from the training distribution. This limitation motivates the on-policy RLVR methods described next."',
            },
          ],
        },
      ],
    },
    {
      id: 'aaa-a-a1-rlvr',
      title: 'A1 goes online: RLVR from tool-execution feedback',
      minutes: 13,
      xp: 65,
      steps: [
        {
          kind: 'read',
          title: 'Closing the loop: agent, tool, verifiable reward',
          markdown: a1RlvrMd,
        },
        {
          kind: 'quiz',
          title: 'RLVR-based A1: density, composition, and cross-domain patterns',
          questions: [
            {
              prompt:
                'RLVR removes the "off-policy ceiling" of SFT/DPO by letting the agent explore on-line. What two new design axes does Section 4.1.2 say this on-policy setting introduces?',
              options: [
                'Model size and training cost',
                'Reward density (per-step vs. episode-level feedback) and reward composition (how task, format, and regularization terms combine)',
                'The programming language of the tool and the GPU vendor',
                'Whether the agent uses SFT or DPO as a warm-up',
              ],
              answer: 1,
              explanation:
                'Section 4.1.2 names exactly these two: "(i) reward density—whether feedback arrives per step ... or only at episode end ... which governs credit assignment difficulty; and (ii) reward composition—how task-specific, format, and regularization terms are combined."',
            },
            {
              prompt:
                'In DeepRetrieval\'s objective, r(q, q′) = r_retrieval(q, q′) + r_format(q′), optimized via KL-regularized PPO. Why does the survey say theorem proving offers an even denser reward signal than this kind of code/retrieval RLVR?',
              options: [
                'Because Lean proofs are shorter than SQL queries',
                'Because a formal proof checker deterministically verifies each proposed tactic step-by-step, giving step-wise semantic verification with minimal ambiguity — denser than unit tests, which "may be sparse or incomplete"',
                'Because theorem proving does not require any reward function at all',
                'Because theorem-proving agents never need KL regularization',
              ],
              answer: 1,
              explanation:
                'Section 4.1.2 contrasts the two directly: "Compared to code-execution RLVR, where unit tests may be sparse or incomplete, theorem proving offers step-wise semantic verification with minimal ambiguity, enabling denser rewards and substantially easing long-horizon credit assignment." The proof checker verifies every tactic, not just the final result.',
            },
            {
              prompt:
                'Code-R1 and DeepRetrieval are both cited as evidence for one of the four cross-domain principles closing §4.1.2. Which principle, and why does it matter?',
              options: [
                '"Reward quality dominates reward quantity" — investing in clean, verified reward signals (e.g., eliminating false positives from faulty tests) yields larger gains than scaling training data',
                '"Format rewards are sufficient on their own" — a format-compliance reward alone is enough to drive adaptation',
                '"Stabilization mechanisms are domain-specific" — KL regularization only works for code tasks',
                '"Signal density does not affect convergence speed"',
              ],
              answer: 0,
              explanation:
                'The survey states: "Reward quality dominates reward quantity. Code-R1 and DeepRetrieval both show that investing in clean, verified reward signals yields larger gains than scaling training data, a finding consistent across retrieval, code, and SQL domains." (The other options invert or contradict the actual principles — format rewards are explicitly "necessary but not sufficient," and stabilization mechanisms are explicitly described as domain-agnostic.)',
            },
            {
              prompt:
                "Orion trains compact 350M–1.2B models to learn effective multi-hop search strategies via turn-level rewards. What broader point does the survey use this result to make?",
              options: [
                'Small models are always better than large models for retrieval',
                'On-policy RLVR with sufficient reward density can substitute for large-controller scale — a small model with dense, well-shaped feedback can learn strategies that might otherwise seem to require a much bigger model',
                'Multi-turn search is impossible without billions of parameters',
                'Orion only works on theorem-proving tasks',
              ],
              answer: 1,
              explanation:
                'The survey draws this exact conclusion: compact 350M–1.2B models learning effective multi-hop search strategies "demonstrat[es] that on-policy RLVR can substitute for large-controller scale when reward density is sufficient." Reward design, not just parameter count, drives capability here.',
            },
          ],
        },
      ],
    },
    {
      id: 'aaa-a-a2-wo-tools',
      title: 'A2 without tools: optimizing the agent’s own output',
      minutes: 12,
      xp: 60,
      steps: [
        {
          kind: 'read',
          title: 'When the agent grades its own reasoning',
          markdown: a2WoToolsMd,
        },
        {
          kind: 'quiz',
          title: 'A2 without tools: granularity, locus, and the A1/A2 boundary',
          questions: [
            {
              prompt:
                'A1 optimizes against O_tool (tool execution outcomes). A2 optimizes against O_agent (evaluations of the agent’s own output). What two consequences does Section 4.2 say follow from this shift to output-level feedback?',
              options: [
                'The agent trains faster and needs less compute overall',
                'The agent can learn strategic behaviors (when to invoke a tool, how deeply to search, whether to self-correct) that A1 cannot reward, but credit assignment becomes harder because one episode-level reward must be attributed across many decisions',
                'The agent no longer needs any reward signal',
                'Tool calls become mandatory in every A2 system',
              ],
              answer: 1,
              explanation:
                'Section 4.2: "(i) the agent can learn strategic behaviors (when to invoke a tool, how deeply to search, whether to self-correct) that A1 signals cannot reward, and (ii) credit assignment becomes harder because a single episode-level reward must be attributed across many internal decisions."',
            },
            {
              prompt:
                'DeepSeek-R1 established the "R1 paradigm" using RLVR with binary final-answer correctness and no tool calls. Where does this sit on the reward-granularity axis described in §4.2.1, and what is its main limitation along that axis?',
              options: [
                'It is structured linguistic feedback — rich but requires a capable critic model',
                'It is scalar final-answer correctness — broadly applicable, but sparse compared to structured critique',
                'It is inference-time refinement with no reward at all',
                'It has no position on the granularity axis since no tools are involved',
              ],
              answer: 1,
              explanation:
                'The §4.2.1 synthesis places it directly: "scalar final-answer correctness (DeepSeek-R1) is broadly applicable but sparse, while structured linguistic feedback (TextGrad) is information-rich but requires a capable critic model." DeepSeek-R1’s binary correctness reward is the scalar end of the granularity axis.',
            },
            {
              prompt:
                'The survey says Rec-R1 "straddles the A1/A2 boundary." What determines whether a given Rec-R1 run counts as A1 or A2?',
              options: [
                'Whether the model was pretrained on recommendation data',
                'Where in the agent-tool pipeline the evaluation signal is computed: A1 if the reward is read from the tool’s ranking output, A2 if it evaluates the agent’s overall recommendation quality',
                'Whether GRPO or PPO is used for optimization',
                'Rec-R1 is always A1 and never A2',
              ],
              answer: 1,
              explanation:
                'The survey: "Rec-R1 straddles the A1/A2 boundary—A1 when the reward is computed from the tool’s ranking output, A2 when it evaluates the agent’s overall recommendation quality—illustrating that the distinction is not always binary but depends on where in the agent-tool pipeline the evaluation signal is computed."',
            },
            {
              prompt:
                'Self-Refine (generate-critique-revise, no weight updates) and SCoRe (multi-turn on-policy RL for self-correction) are presented as a progression. What does this progression mirror, according to §4.2.1?',
              options: [
                'It mirrors the move from A2 back to A1',
                'It mirrors the SFT-to-RLVR progression seen in A1: an inference-time heuristic (Self-Refine) is replaced by a learned policy (SCoRe) that improves with scale',
                'It mirrors the shift from code tools to retrieval tools',
                'It shows that inference-time methods are strictly obsolete',
              ],
              answer: 1,
              explanation:
                'The survey states: "The progression from Self-Refine to SCoRe mirrors the SFT-to-RLVR progression in A1: inference-time heuristics are replaced by learned policies that improve with scale." Self-Refine is the heuristic loop; SCoRe operationalizes it into a trainable RL policy.',
            },
          ],
        },
      ],
    },
    {
      id: 'aaa-a-a2-with-tools',
      title: 'A2 with tools: rewarding the final answer after tool use',
      minutes: 14,
      xp: 68,
      steps: [
        {
          kind: 'read',
          title: 'Tools in the loop, reward on the output',
          markdown: a2WithToolsMd,
        },
        {
          kind: 'scenario',
          title: 'Choosing A1 vs. A2-with-tools for a system',
          scenario: {
            intro:
              'You are designing the adaptation strategy for agent-tool systems. In each case the agent can call the same external tool — the question is whether to score with O_tool (A1: reward read off the tool’s execution result y) or O_agent (A2-with-tools: reward read off the agent’s final output o after it integrates y). Use the credit-assignment trade-off from this lesson: A1 gives precise per-action signal but is blind to overall strategy; A2-with-tools gives a richer end-to-end signal but is noisier to attribute.',
            stages: [
              {
                situation:
                  'You are training an agent that calls a Lean 4 proof checker. Each proposed tactic is immediately verified as accepted/rejected/proof-advancing by the checker itself. You want the agent to learn which tactics are valid proof steps, with feedback at every step of a long proof.',
                question: 'Which adaptation signal fits best, and why?',
                options: [
                  {
                    label:
                      'A1 (O_tool): reward each tactic directly from the proof checker’s step-wise verification — dense, per-action, minimal ambiguity',
                    quality: 'best',
                    feedback:
                      'Correct. This is the formal theorem proving case from §4.1.2: "the verification outcome ... serves directly as a verifiable reward signal," giving "step-wise semantic verification with minimal ambiguity" and easing long-horizon credit assignment. The signal you need is per-action and the checker provides it at every step — exactly A1’s strength.',
                  },
                  {
                    label:
                      'A2-with-tools (O_agent): wait until the full proof is complete or fails, then reward based on whether the final proof is valid',
                    quality: 'ok',
                    feedback:
                      'This would work eventually, but it throws away the dense, step-wise signal the proof checker already gives you for free. The survey contrasts this exact tradeoff: episode-level A2 reward "makes credit assignment harder" — here you would deliberately sparsify a signal that is naturally dense per Section 4.1.2.',
                  },
                  {
                    label:
                      'Neither — proof checkers cannot produce reward signals for RL',
                    quality: 'bad',
                    feedback:
                      'This is the opposite of what the survey says. Formal theorem proving is called "a canonical domain for RLVR under the A1 paradigm" precisely because the proof checker’s deterministic, step-wise verification is an excellent reward source.',
                  },
                ],
              },
              {
                situation:
                  'You are training a QA agent that may call a search engine zero, one, or many times before answering. You care about whether the final answer is correct AND whether the agent searched effectively (the right number of times, on useful queries) to get there — like Search-R1.',
                question: 'Which adaptation signal fits best, and why?',
                options: [
                  {
                    label:
                      'A2-with-tools (O_agent): reward the final answer o after the agent integrates retrieved evidence y — a joint signal over retrieved evidence and final correctness',
                    quality: 'best',
                    feedback:
                      'Correct. This is exactly Search-R1’s shape per §4.2.2: it "formulates search invocation as a joint reward over retrieved evidence and final correctness" — the A2-with-tools pattern, where O_agent(o) is the signal. The meta-policy question (whether/how much to search) only has an answer once you look at the final output, which is what A2 rewards and A1 cannot.',
                  },
                  {
                    label:
                      'A1 (O_tool): reward each search call purely on retrieval metrics (Recall@K, NDCG) regardless of the final answer',
                    quality: 'ok',
                    feedback:
                      'This is DeepRetrieval’s A1 recipe and it is useful for tuning the retriever itself — but it cannot teach the meta-policy of *when and how much to search* for THIS agent’s reasoning, because O_tool "is silent about reasoning quality" (Section 4). You would optimize retrieval quality in isolation from whether it helps the agent answer correctly.',
                  },
                  {
                    label:
                      'A2-with-tools, but only ever reward based on the number of search calls made, ignoring answer correctness',
                    quality: 'bad',
                    feedback:
                      'This abandons the "final output as signal" idea entirely — it is not O_agent(o) at all, since it never looks at o. The survey is explicit that A2-with-tools still computes "the reward ... on the agent’s final output"; rewarding call-count alone would optimize for a proxy (e.g., fewer/more searches) disconnected from whether the agent actually solved the task.',
                  },
                ],
              },
              {
                situation:
                  'ReTool integrates a code interpreter directly into RL rollouts so the agent learns WHEN to offload computation to the interpreter, with reward depending on the agent’s overall answer. A colleague asks: "Since code execution is verifiable, why not just use A1 here and skip the more expensive A2 setup?"',
                question: 'How should you respond, using the survey’s framing of ReTool?',
                options: [
                  {
                    label:
                      'A1 would verify that each code execution succeeded, but it cannot teach the strategic choice of WHEN to invoke the interpreter — ReTool needs A2 because "the reward depends on whether the agent’s overall answer (not just the tool call) is correct"',
                    quality: 'best',
                    feedback:
                      'Correct — this is the survey’s own framing, quoted almost verbatim from §4.2.2. A1 could certainly verify individual code-execution outcomes, but it has no way to reward the meta-decision of whether invoking the interpreter at all was the right strategic move for this problem. That decision only becomes visible once you score the final answer o, which is the A2-with-tools move.',
                  },
                  {
                    label:
                      'Your colleague is right — since code execution is deterministic, A1 and A2-with-tools would produce identical training signals for ReTool',
                    quality: 'bad',
                    feedback:
                      'This misses the credit-assignment distinction that is the whole point of this lesson. A1’s O_tool(y) can confirm a piece of code ran correctly, but says nothing about whether calling the interpreter at that point in the trajectory was the right strategic choice — that is only visible in O_agent(o), the final answer.',
                  },
                  {
                    label:
                      'Switch to A2-without-tools (§4.2.1 / R1 paradigm) instead — drop the code interpreter and rely on scalar correctness alone, like DeepSeek-R1',
                    quality: 'ok',
                    feedback:
                      'This throws away the tool entirely, which solves the "which paradigm" question by removing the premise. ReTool’s contribution is specifically that A2-WITH-tools "can discover tool-use strategies that A1 training cannot" — dropping tools avoids the question but also gives up the offload-to-interpreter capability that motivated using a code interpreter in the first place.',
                  },
                ],
              },
            ],
            debrief:
              'The pattern across all three stages: A1 (O_tool) is the right choice when the thing you need to learn IS the correctness of the individual action, and the tool already gives you that signal densely and per-step (theorem proving). A2-with-tools (O_agent) is the right choice when the thing you need to learn is a META-POLICY — when/whether/how to use the tool at all — because that strategic choice is only visible once you look at the final output o (Search-R1, ReTool). Neither dominates; they answer different questions, and as Rec-R1 showed in the previous lesson, the same system can sometimes be scored either way depending on where the evaluation is placed.',
          },
        },
      ],
    },
  ],
}
