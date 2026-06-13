import type { Module } from '../../types'
import multiagentRolesMd from '../md/cah-multiagent-roles.md?raw'
import multiagentInteractionMd from '../md/cah-multiagent-interaction.md?raw'
import executionFeedbackSyncMd from '../md/cah-execution-feedback-sync.md?raw'
import sharedSubstrateMd from '../md/cah-shared-substrate.md?raw'

export const m4: Module = {
  id: 'cah-m4',
  title: 'Scaling the Harness: Multi-Agent Orchestration over Code',
  description:
    "When N agents share a codebase: assigning roles, choosing collaboration modes and workflow topology, synchronizing on execution feedback, and the survey's position on a shared code-centric harness substrate.",
  lessons: [
    {
      id: 'cah-multiagent-roles',
      title: 'Multi-Agent Roles & Human-Guided Planning',
      minutes: 11,
      xp: 58,
      steps: [
        { kind: 'read', title: 'Roles over a shared codebase', markdown: multiagentRolesMd },
        {
          kind: 'quiz',
          title: 'Specialization & verification',
          questions: [
            {
              prompt:
                'AgentCoder’s Test Executor is a deterministic Python script, not an LLM. Why does the survey single this out as a design principle?',
              options: [
                'Python scripts run faster than LLM inference, lowering cost',
                'It cleanly separates reasoning from execution, grounding the feedback signal in objective program behavior rather than a model’s opinion',
                'It lets the executor agent generate its own test cases',
                'Deterministic scripts can hold a larger context window than an LLM',
              ],
              answer: 1,
              explanation:
                'The verdict comes from what the code actually did, not from a model judging itself. Separating reasoning (LLM) from execution (a deterministic runtime) makes the pass/fail signal an objective oracle the synthesis agent can trust (§4.1.1).',
            },
            {
              prompt:
                'AgentCoder’s Test Designer generates test cases independently of the code. What failure does this guard against?',
              options: [
                'Context-window overflow from too many tests',
                'The mode-collapse problem, where an agent’s biased tests pass its own buggy code',
                'Slow convergence due to too many repair iterations',
                'Conflicting writes when two agents edit the same file',
              ],
              answer: 1,
              explanation:
                'If the same reasoning writes both the code and the tests, the tests inherit the code’s blind spots and rubber-stamp bugs. Generating tests independently breaks that circular reasoning — the same logic behind CANDOR’s Panelists auditing the spec, not the implementation (§4.1.1).',
            },
            {
              prompt:
                'EvoMAC adds two meta-roles — a Gradient Agent and an Updating Agent. What makes them different from ordinary planner/coder/tester roles?',
              options: [
                'They generate code faster by running in parallel',
                'They operate on the program directly, editing files like a coder would',
                'They operate at the level of the MAS itself — reading execution logs to attribute failures and then restructuring agent prompts and the workflow DAG',
                'They replace the need for any verification agent',
              ],
              answer: 2,
              explanation:
                'Normal roles act on the program; EvoMAC’s meta-roles act on the harness. The Gradient Agent attributes failures to specific agents from execution logs, and the Updating Agent rewires prompts and the DAG — the harness adapting its own structure in response to feedback (§4.1.1).',
            },
          ],
        },
      ],
    },
    {
      id: 'cah-multiagent-interaction',
      title: 'Interaction Modes & Workflow Topology',
      minutes: 12,
      xp: 60,
      steps: [
        { kind: 'read', title: 'How agents talk and how work flows', markdown: multiagentInteractionMd },
        {
          kind: 'quiz',
          title: 'Modes & topologies',
          questions: [
            {
              prompt:
                'The survey calls code-centric interaction "artifact-mediated" rather than message-passing. What is the practical consequence of that distinction?',
              options: [
                'Agents can only ever communicate through source code, nothing else',
                'Interaction is grounded in the objective state exposed by shared artifacts and their execution results, not just in what agents say to each other',
                'It eliminates the need for any verification agent',
                'It forces every system to use a star topology',
              ],
              answer: 1,
              explanation:
                'Agents observe and modify shared artifacts — files, diffs, tests, logs, schemas — so coordination is anchored in objective program state and execution output, not free-form dialogue. The channels are broader than source code alone (§4.1.2).',
            },
            {
              prompt:
                'Why does the survey say adversarial validation (a fuzzer) has a "fundamentally different character" from critique-and-repair?',
              options: [
                'It is always faster than a code review',
                'The fuzzer does not explain what is wrong — it demonstrates a concrete execution failure, a counterexample the coder must address',
                'It can only be used on security-critical code',
                'It replaces the synthesis agent entirely',
              ],
              answer: 1,
              explanation:
                'Critique-and-repair produces an explanation; a fuzzer produces a crashing input. A concrete counterexample localizes the bug to a specific input category and is harder to argue with than prose feedback (§4.1.2).',
            },
            {
              prompt:
                'A chain (waterfall) topology runs planning → synthesis → verification once. What single change converts it into a cyclic (agile) topology, and why does that matter?',
              options: [
                'Adding more agents of the same type — it increases throughput',
                'Adding a back-edge so verification feedback can trigger revision — it lets the code be repaired in response to test failures rather than shipped as-is',
                'Switching to a deterministic executor — it removes the need for iteration',
                'Centralizing everything on a hub agent — it simplifies routing',
              ],
              answer: 1,
              explanation:
                'The defining move is the back-edge: AgentCoder loops programmer → executor → (if fail) → programmer, bounded at 5 iterations. Without it, a failed test is terminal; with it, verification feedback becomes a repair signal (§4.1.3).',
            },
          ],
        },
      ],
    },
    {
      id: 'cah-execution-feedback-sync',
      title: 'Execution Feedback & Shared-Harness Synchronization',
      minutes: 13,
      xp: 64,
      steps: [
        { kind: 'read', title: 'Feedback signals and keeping state consistent', markdown: executionFeedbackSyncMd },
        {
          kind: 'quiz',
          title: 'Feedback & synchronization',
          questions: [
            {
              prompt:
                'QualityFlow’s Imagined Execution predicts test outcomes with 98%+ precision/recall without running the code. What open question does the survey draw from this?',
              options: [
                'Whether LLMs should ever be allowed to write tests',
                'When actual execution is necessary versus when linguistic simulation of execution can suffice',
                'Whether fuzzing is more accurate than unit testing',
                'Whether blackboards are faster than sequential handoff',
              ],
              answer: 1,
              explanation:
                'If a model can simulate the interpreter that accurately, execution feedback’s value is no longer uniform across all bugs. The survey poses exactly this: when must you run the code, and when does linguistic simulation suffice (§4.2.1)?',
            },
            {
              prompt:
                'Sequential handoff stores program state as "only the most recent artifact in the pipeline." Why does that break down when multiple agents edit in parallel?',
              options: [
                'The artifact becomes too large to fit in a context window',
                'It creates invisible state divergence — there is no shared record of what other agents changed, so an agent reasons against a stale view',
                'Parallel edits are always slower than sequential ones',
                'The compiler can no longer detect syntax errors',
              ],
              answer: 1,
              explanation:
                'A linear pipeline has one current artifact; parallel agents each mutate state with no shared, queryable record. Divergence between an agent’s belief and the true state goes undetected — the motivation for blackboards and explicit synchronization (§4.2.2).',
            },
            {
              prompt:
                'The survey insists code-mediated coordination "does not remove distributed-systems constraints." Which statement reflects that caveat?',
              options: [
                'Executable artifacts give an oracle but channels still have finite bandwidth, summaries lose detail, logs get noisy, and parallel branches raise authority/consistency questions',
                'Once agents share code, all coordination problems disappear',
                'Execution feedback makes context management unnecessary',
                'Shared blackboards guarantee perfect consistency with zero overhead',
              ],
              answer: 0,
              explanation:
                'Code is a richer substrate than dialogue, but it does not repeal information theory: bandwidth, compression loss, stale caches, and merge-authority conflicts persist. The oracle is real; the distributed-systems tax is too (§4.2.2).',
            },
          ],
        },
      ],
    },
    {
      id: 'cah-shared-substrate',
      title: 'Position: A Shared Code-Centric Harness Substrate',
      minutes: 14,
      xp: 68,
      steps: [
        { kind: 'read', title: 'The survey’s position and closing synthesis', markdown: sharedSubstrateMd },
        {
          kind: 'scenario',
          title: 'Designing a multi-agent coding system',
          scenario: {
            intro:
              'You are architecting a multi-agent coding harness. The survey’s §4.3 representation tiers (implicit / repository / execution / blackboard), its six convergence patterns, and the §4.4 trends are your design vocabulary. Each stage names a concrete system; pick the choice the paper’s own trade-offs support — and notice when "more topology" is actually the wrong fix.',
            stages: [
              {
                situation:
                  'A coder and a tester agent collaborate on small, function-level snippets. The whole program fits in one context window each turn, and tasks rarely fragment across files.',
                question:
                  'What shared-harness representation is justified here?',
                options: [
                  {
                    label:
                      'Implicit / file-only — pass the latest artifact in context; the program state is simple and does not fragment.',
                    quality: 'best',
                    feedback:
                      'Correct. §4.4 says the implicit approach "works for function-level tasks where the program state is simple and does not fragment across agents." For this scope, a formal substrate is over-engineering.',
                  },
                  {
                    label:
                      'A full blackboard with a Control Unit governing every read and write, like L2MAC.',
                    quality: 'ok',
                    feedback:
                      'It would work and prevent divergence, but it is heavyweight for single-file snippets that fit in context. The paper reserves formal substrates for state that fragments across agents.',
                  },
                  {
                    label:
                      'An elaborate adaptive DAG that mutates its topology each iteration.',
                    quality: 'bad',
                    feedback:
                      'Adaptive topology is a workaround for missing shared state (§4.4), not a fit for a simple two-agent, single-file task. You would add coordination complexity with no problem to solve.',
                  },
                ],
              },
              {
                situation:
                  'Now you scale to repository-level issue resolution: a Planner, several parallel Editor agents (one per candidate file), and a Verifier all operate on a large codebase across many iterations. Agents keep acting on stale views of files others have changed.',
                question:
                  'Which fix does the survey’s position most directly endorse?',
                options: [
                  {
                    label:
                      'Introduce a formal, persistent, queryable shared substrate (repository memory and/or blackboard) so divergence between an agent’s belief and true state can be detected.',
                    quality: 'best',
                    feedback:
                      'Exactly the §4.3 position: the central gap is the lack of formal, persistent representations agents can query and update across iterations. SyncMind formalizes belief-vs-truth divergence; MAGIS keeps repository evolution memory.',
                  },
                  {
                    label:
                      'Keep state implicit but bolt on a more elaborate adaptive topology to route around the conflicts.',
                    quality: 'bad',
                    feedback:
                      '§4.4’s sharpest finding: topology complexity inversely correlates with harness-state formality. Adaptive topology is a symptom of missing shared state, not a cure for it.',
                  },
                  {
                    label:
                      'Add more context-management machinery (summaries, pub-sub filtering) so each agent sees a curated slice.',
                    quality: 'ok',
                    feedback:
                      'Useful, but §4.4 calls context management "the tax of implicit shared state." It mitigates the symptom; a queryable substrate that agents access on demand addresses the root cause.',
                  },
                ],
              },
              {
                situation:
                  'Finally, convergence. The Verifier is gating on its own LLM-generated tests and declaring success once they pass, but external evaluation later finds the code is wrong. You must choose how the harness decides it is "done."',
                question:
                  'What convergence criterion best fits a correctness-critical task?',
                options: [
                  {
                    label:
                      'Test-gated correctness convergence against tests generated independently of the code (and add dead-end detection to switch plans on repeated failure).',
                    quality: 'best',
                    feedback:
                      'Test-gated is the most principled objective criterion (§4.3.2). Independent tests avoid the mode-collapse trap FlowGen warns about — converging on code that passes its own biased tests — and PairCoder-style dead-end detection prevents fruitless looping.',
                  },
                  {
                    label:
                      'Implicit convergence: stop after a fixed number of iterations regardless of test outcome.',
                    quality: 'bad',
                    feedback:
                      'The survey names implicit convergence the most significant gap in the field — a fixed iteration budget is not a quality signal and is a direct consequence of lacking a formal substrate (§4.3.2).',
                  },
                  {
                    label:
                      'Consensus convergence: have three reviewer agents majority-vote on whether the code looks correct.',
                    quality: 'ok',
                    feedback:
                      'Consensus (CANDOR-style) is legitimate and reduces single-judge bias, but it still aggregates opinions. For correctness-critical work, an executable oracle is stronger than a vote.',
                  },
                ],
              },
            ],
            debrief:
              'The thread across all three stages: match the substrate’s formality to how much state fragments across agents, ground convergence in objective execution signals rather than fixed budgets or opinions, and treat elaborate topology and heavy context management as symptoms of a missing shared substrate — not solutions. That is the survey’s §4.3 position, reinforced by the §4.4 trends.',
          },
        },
      ],
    },
  ],
}
