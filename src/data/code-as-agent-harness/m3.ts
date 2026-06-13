import type { Module } from '../../types'
import planningMd from '../md/cah-planning.md?raw'
import memoryMd from '../md/cah-memory.md?raw'
import toolUseMd from '../md/cah-tool-use.md?raw'
import harnessControlMd from '../md/cah-harness-control.md?raw'
import harnessOptimizationMd from '../md/cah-harness-optimization.md?raw'

export const m3: Module = {
  id: 'cah-m3',
  title: 'Harness Mechanisms: Planning, Memory, Tool Use, Control, and Optimization',
  description:
    'What keeps a code-harnessed agent reliable over long horizons: deciding what to do next, what to remember, what to call, and how failures become fixes — plus how the harness itself adapts over time.',
  lessons: [
    {
      id: 'cah-planning',
      title: 'Planning for Agent Harness',
      minutes: 12,
      xp: 60,
      steps: [
        { kind: 'read', title: 'Planning as harness control', markdown: planningMd },
        {
          kind: 'quiz',
          title: 'Four ways to plan',
          questions: [
            {
              prompt:
                'A linear-decomposition agent commits to one ordered plan up front. The survey says search-based planning was developed largely to address which weakness of that approach?',
              options: [
                'Linear plans are too slow to generate',
                'Linear plans commit to a single trajectory, so when the first plan is wrong there is limited exploration beyond it',
                'Linear plans cannot be written to a file',
                'Linear plans require multiple agents to execute',
              ],
              answer: 1,
              explanation:
                'The survey explicitly notes linear decomposition "commit[s] to a single decomposition trajectory" with "limited exploration beyond the chosen path." Search-based planning "allocates inference-time compute to explore… multiple candidate solution paths" precisely so the agent can backtrack from a bad early decision instead of being stuck with it.',
            },
            {
              prompt:
                'Why does the survey describe search-based planning as "a harness-level state management problem," not just a model-side sampling trick?',
              options: [
                'Because the model must be fine-tuned before it can sample',
                'Because the runtime must preserve candidates, expose evidence, run validators, and decide which branch deserves further computation',
                'Because search only works on single-file tasks',
                'Because sampling is done by a human reviewer',
              ],
              answer: 1,
              explanation:
                'Branching over candidate trajectories only helps if the harness can hold the alternatives, surface execution evidence, run validators on each, and route compute to the promising branch. The intelligence is as much in the runtime\'s state management as in the model\'s sampling — that is why it is a harness problem.',
            },
            {
              prompt:
                'A team lifts its plan from an ephemeral prompt into a versioned PLAN.md that records milestones, validation commands, and recovery rules, reloaded across context resets. Why does the survey treat this as a meaningful harness shift rather than cosmetic?',
              options: [
                'Markdown renders faster than plain prompts',
                'The plan becomes a filesystem-backed control object: reviewable by humans, versioned with Git, consumed by subagents, and usable as the source of truth across sessions',
                'It removes the need for any execution feedback',
                'It converts linear planning into search-based planning automatically',
              ],
              answer: 1,
              explanation:
                'The survey frames the move from prompt artifact to persistent harness object as substantive: a PLAN.md survives context resets, can be human-reviewed and Git-versioned, and acts as shared source of truth. The plan stops being a transient reasoning trace and becomes durable, inspectable harness state — even though it still inherits linear planning\'s single-path limitation.',
            },
          ],
        },
      ],
    },
    {
      id: 'cah-memory',
      title: 'Memory and Context Engineering',
      minutes: 14,
      xp: 70,
      steps: [
        { kind: 'read', title: 'Memory as a state-management layer', markdown: memoryMd },
        {
          kind: 'quiz',
          title: 'What to remember, and how',
          questions: [
            {
              prompt:
                'The survey insists memory "is not simply a larger context window or a vector database." What is the operational difference it draws?',
              options: [
                'Memory must always be stored on disk, never in RAM',
                'Memory is a state-management layer that decides what stays in active context, what gets compacted into summaries, and what gets offloaded to durable storage',
                'Memory only matters for multi-agent systems',
                'A vector database is strictly better than any other memory design',
              ],
              answer: 1,
              explanation:
                'The defining claim is that memory is a *decision layer* over where state lives, not a storage size or a single data structure. A bigger window or a vector DB are just substrates; the harness work is choosing what to keep live, what to summarize, and what to push out of context with a retrievable handle.',
            },
            {
              prompt:
                'MemGovern\'s finding is that "the quality of stored experience matters more than its scale." Why does ungoverned experiential memory actively hurt an agent?',
              options: [
                'Larger memory always slows the model down linearly',
                'Ungoverned records introduce semantic noise, error propagation, and false retrievals — so bad past experience gets reused as if it were good',
                'Experiential memory cannot be stored in files',
                'It forces the agent to use search-based planning',
              ],
              answer: 1,
              explanation:
                'Experiential memory enables cross-task transfer, but transfer is only useful if what you transfer is correct. The survey warns that without curation, stored trajectories carry "semantic noise, error propagation, and false retrievals," meaning the agent confidently reuses flawed strategies — which is why long-term memory shifts the focus "from memory capacity to memory governance."',
            },
            {
              prompt:
                'Context compaction reduces a failing-test log to the test name, key stack frames, and suspected files; state offloading keeps the full log in durable storage behind a handle. Why pair these two rather than just compacting?',
              options: [
                'Offloading is only for multi-agent systems',
                'Compaction keeps decision-relevant context small while offloading preserves full-fidelity artifacts for audit and replay — separating what the agent needs to decide from what it needs to prove',
                'Compaction destroys data, so offloading is the only safe option',
                'They are the same mechanism under two names',
              ],
              answer: 1,
              explanation:
                'A summary is enough to choose the next action but loses detail you may need later for debugging, audit, or replay. The survey pairs them so the active context stays lean (compaction) while full evidence survives outside the window with a resource identifier (offloading) — making memory scalable, auditable, and compatible with execution-time verification.',
            },
          ],
        },
      ],
    },
    {
      id: 'cah-tool-use',
      title: 'Tool Use for Agent Harness',
      minutes: 13,
      xp: 65,
      steps: [
        { kind: 'read', title: 'Tools as a governed interface', markdown: toolUseMd },
        {
          kind: 'scenario',
          title: 'Picking the right tool layer',
          scenario: {
            intro:
              'You are hardening a code agent that resolves GitHub issues on a large private monorepo. The survey sorts tool use into four harness functions — function-oriented (API/doc knowledge), environment-interaction (act in repo/shell), verification-driven (deterministic sensors), and workflow-orchestration (coordinate the above with permissions). Each stage is a real bottleneck; pick the tool category the survey says actually fits it.',
            stages: [
              {
                situation:
                  'The agent keeps calling functions from your private SDK that do not exist, or picking the wrong overload. The monorepo uses internal libraries with almost no public training coverage.',
                question: 'Which tool category most directly attacks this failure?',
                options: [
                  {
                    label:
                      'Function-oriented tool use: integrate API/doc search so the agent retrieves and selects real APIs instead of hallucinating them',
                    quality: 'best',
                    feedback:
                      'Correct. The survey introduces ToolCoder for exactly this bottleneck — "code models often hallucinate APIs… or fail on private libraries with sparse training coverage." Function-oriented tools fill gaps in the model\'s programming knowledge by grounding generation in retrieved APIs.',
                  },
                  {
                    label:
                      'Verification-driven tool use: just run the tests and let failures catch the bad API calls',
                    quality: 'ok',
                    feedback:
                      'Tests will eventually surface the error, but verification is a deterministic *sensor* — it tells you something broke after the fact, not which correct API to use. The survey scopes verification-driven tools to checking, not knowledge acquisition; you would burn cycles failing on hallucinated APIs first.',
                  },
                  {
                    label:
                      'Workflow-orchestration tool use: add more agent roles and hope one of them knows the SDK',
                    quality: 'bad',
                    feedback:
                      'Orchestration coordinates tools and roles; it does not inject missing API knowledge. The survey is explicit that the function-oriented bottleneck is "that the model lacks reliable knowledge of which function, API, or library construct should be used" — more roles do not fix that.',
                  },
                ],
              },
              {
                situation:
                  'API knowledge is fixed. Now the agent must actually fix issues: locate files across the monorepo, understand cross-file dependencies, edit, and run the repo\'s test command. Retrieval alone is not cutting it.',
                question: 'Which category does the survey say this work belongs to?',
                options: [
                  {
                    label:
                      'Environment-interaction tool use: give the agent a shell, file editor, repo navigation, and test execution as its primary interaction channel',
                    quality: 'best',
                    feedback:
                      'Correct. The survey notes "retrieval alone is often insufficient when tasks require cross-file understanding… or repository-wide dependency analysis," and points to SWE-agent\'s agent-computer interface where "shell commands, file editing, and test execution become the primary interaction channel."',
                  },
                  {
                    label:
                      'Function-oriented tool use: keep retrieving more documentation snippets until the agent understands the codebase',
                    quality: 'bad',
                    feedback:
                      'This is exactly the limit the survey calls out: retrieval helps with long-tail APIs but is "insufficient when tasks require cross-file understanding and reasoning, runtime debugging, or repository-wide dependency analysis." You need tools that *act* in the environment, not just fetch text.',
                  },
                  {
                    label:
                      'Verification-driven tool use: wrap everything in a verifier and let it drive file edits',
                    quality: 'ok',
                    feedback:
                      'Verification provides the deterministic feedback the loop needs, but it observes state — it does not navigate the repo or apply patches. The acting work (locate, edit, run) is environment-interaction; verification comes after as the sensor.',
                  },
                ],
              },
              {
                situation:
                  'The agent now acts and verifies, but on a private monorepo it can also touch credentials and deploy. You need: when each tool fires, with what permissions, results sanitized, risky commands gated — all coordinated across the long-horizon loop.',
                question: 'Which category captures this control problem?',
                options: [
                  {
                    label:
                      'Workflow-orchestration tool use: typed schemas, session state, guardrails, lifecycle hooks (pre-use permission/validation, post-use sanitize/compact), and human-review gates',
                    quality: 'best',
                    feedback:
                      'Correct. The survey scopes workflow-orchestration to "when each tool should be invoked, with what permissions, under which context, and how its result should update the harness state," and describes lifecycle hooks plus packaged guardrails/handoffs/human-review as the mechanism.',
                  },
                  {
                    label:
                      'Environment-interaction tool use: the shell already has access, so just let the agent run whatever it needs',
                    quality: 'bad',
                    feedback:
                      'Unbounded shell access is precisely the risk the orchestration layer exists to govern. The survey stresses tool use is "a governed interface" — permissions, sanitization, and HITL gates on risky commands are orchestration concerns, not something raw environment access provides.',
                  },
                  {
                    label:
                      'Add more verification-driven sensors so any damage is caught quickly',
                    quality: 'ok',
                    feedback:
                      'Sensors catch failures but do not prevent a credential leak or a destructive deploy from executing. The survey puts pre-execution permission checks and human-in-the-loop gates in the orchestration layer — governance has to come before the risky action, not just observe its aftermath.',
                  },
                ],
              },
            ],
            debrief:
              'The four tool categories map to four distinct harness functions: function-oriented grounds *knowledge*, environment-interaction grounds *action*, verification-driven grounds *feedback*, and workflow-orchestration grounds *governance*. The survey\'s closing point: "the core challenge is no longer whether a model can call a tool, but whether the harness can make tool use safe, auditable, and useful for long-horizon execution."',
          },
        },
      ],
    },
    {
      id: 'cah-harness-control',
      title: 'Harness Control: the Plan, Execute, Verify Loop',
      minutes: 13,
      xp: 65,
      steps: [
        { kind: 'read', title: 'The Plan–Execute–Verify loop', markdown: harnessControlMd },
        {
          kind: 'quiz',
          title: 'Governing the loop',
          questions: [
            {
              prompt:
                'The survey calls the PEV harness "a cybernetic governor" rather than a message forwarder. What is the difference?',
              options: [
                'A governor runs on faster hardware',
                'Instead of merely forwarding error messages to the model, the harness observes effects through deterministic sensors and regulates the next state transition — continue, revise, request context, reduce permissions, or escalate',
                'A governor removes the need for any model at all',
                'A governor only works in multi-agent systems',
              ],
              answer: 1,
              explanation:
                'A message forwarder just pipes a stack trace back to the model and hopes. A cybernetic governor observes the repo/execution state via sensors (linters, tests, type checkers) and actively decides the next transition — accept, revise, route, de-permission, or escalate. Control lives in the harness, not only in the model\'s reaction to text.',
            },
            {
              prompt:
                'Why does the survey insist the full-access tier (network, credentials, deploy, destructive filesystem ops, Git history mutation) be guarded by mandatory human-in-the-loop gates, while read-only and sandbox-edit tiers are not?',
              options: [
                'Full-access actions are slower, so a human has time to review',
                'Their consequences can extend beyond the sandbox, so they cannot be contained or cheaply rolled back like in-sandbox edits',
                'Humans enjoy approving deployments',
                'Read-only actions are actually the most dangerous',
              ],
              answer: 1,
              explanation:
                'Read-only and sandbox-edit actions are contained — a bad patch dies inside the isolated workspace. Full-access actions touch the world outside the sandbox (real deploys, real credentials, irreversible history rewrites), where the harness can no longer guarantee containment or rollback. That irreversibility is exactly why the survey mandates a human gate at that tier.',
            },
            {
              prompt:
                'The survey says termination "should be governed by verification rather than by model confidence." Why is stopping when the model *feels* done a worse policy?',
              options: [
                'Model confidence is always lower than test results',
                'Model confidence is not a deterministic, reproducible signal; required-checks-pass (or no-further-improvement, risk-tier change, or human review) ties stopping to executable evidence instead of a self-report',
                'Verification is faster to compute than confidence',
                'The model has no way to express confidence',
              ],
              answer: 1,
              explanation:
                'A confident model can still be wrong — confidence is a self-report, not a control signal. The survey grounds termination in the same deterministic sensors that drive the rest of the loop: stop when checks pass, when extra attempts stop improving the state, when the risk tier changes, or when a human must review. Verification, not vibes, decides done.',
            },
          ],
        },
      ],
    },
    {
      id: 'cah-harness-optimization',
      title: 'Agentic Harness Engineering: Adaptive Optimization',
      minutes: 14,
      xp: 70,
      steps: [
        { kind: 'read', title: 'Optimizing the harness itself', markdown: harnessOptimizationMd },
        {
          kind: 'scenario',
          title: 'Letting an Evolution Agent mutate the harness',
          scenario: {
            intro:
              'Your team wants an Evolution Agent to improve your code-agent harness automatically — rewriting tool schemas, retrieval policies, validators, retry limits, even permission rules. Agentic Harness Engineering (AHE) makes this possible, but the survey is emphatic that it "should not be confused with unconstrained self-modification." Work through the governance trade-offs the survey itself describes.',
            stages: [
              {
                situation:
                  'A teammate proposes: let the Evolution Agent read only the final pass/fail result of each task run, then guess what to change in the harness. Cheaper than logging everything.',
                question: 'How should you respond, per the survey?',
                options: [
                  {
                    label:
                      'Insist on deep telemetry first — prompts, token cost, tool args, edited files, branch decisions, rejected alternatives, traces — because that is the substrate that turns harness revision into comparative diagnosis',
                    quality: 'best',
                    feedback:
                      'Correct. The survey calls deep telemetry "the central substrate of AHE." A shallow pass/fail log cannot tell you *which* component failed; deep traces let you attribute cost, wasted tool calls, and failure clusters to specific harness parts and replay them across versions.',
                  },
                  {
                    label:
                      'Pass/fail is fine — the Evolution Agent is smart enough to infer the rest',
                    quality: 'bad',
                    feedback:
                      'The survey is explicit that "a shallow log may record only the final answer or pass/fail result," and that this is insufficient. Without deep traces you get anecdotal debugging, not the comparative diagnosis (token-cost traces, decision-tree traces, failure clusters) AHE depends on.',
                  },
                  {
                    label:
                      'Skip telemetry and just A/B two harness versions on live traffic',
                    quality: 'ok',
                    feedback:
                      'A/B on outcomes can show *that* one version is better but not *why* or which component to change next, and running unproven harness mutations on live traffic skips the sandboxed replay the survey requires. Telemetry plus held-out/replay evaluation is the disciplined path.',
                  },
                ],
              },
              {
                situation:
                  'The Evolution Agent proposes a batch of changes: tighten a tool schema, add a linter, raise the retry limit — and also widen a permission rule so the agent can hit the network without approval, "to reduce HITL friction."',
                question: 'How do you let these land?',
                options: [
                  {
                    label:
                      'Evaluate all changes in a sandbox against fixed regression suites; auto-promote only the non-regressing low-risk ones; the permission/network change requires HITL approval before activation',
                    quality: 'best',
                    feedback:
                      'Correct. The survey says promote "only changes that improve reliability, cost, or safety without regressing previously solved cases," and that changes altering "permission boundaries, network access… should require HITL approval before activation." You split by risk: low-risk auto-promotes, boundary changes gate to a human.',
                  },
                  {
                    label:
                      'Promote the whole batch together since they were proposed as one improvement set',
                    quality: 'bad',
                    feedback:
                      'Bundling a permission-boundary change with safe tweaks defeats governance. The survey carves out exactly this class — anything touching permissions, network, credentials, deployment, or human-review requirements — for mandatory HITL approval. It cannot ride along with auto-promoted low-risk edits.',
                  },
                  {
                    label:
                      'Reject the entire batch because one change touches permissions',
                    quality: 'ok',
                    feedback:
                      'Safe, but wasteful. The survey supports promoting verified, non-regressing improvements automatically; only the boundary-altering change needs the human gate. Throwing out the linter and schema fixes too means leaving free reliability gains on the table.',
                  },
                ],
              },
              {
                situation:
                  'Leadership asks: if the Evolution Agent can rewrite the harness that governs task agents, what stops it from quietly weakening the very controls that keep task agents safe?',
                question: 'What is the survey\'s structural answer?',
                options: [
                  {
                    label:
                      'The Evolution Agent is itself subject to the PEV loop — it plans a mutation, executes it in an isolated evaluation environment, verifies via telemetry and regression tests, escalates risky changes to humans, and records auditable rationales',
                    quality: 'best',
                    feedback:
                      'Correct. The survey\'s key move is recursion: "the Evolution Agent is itself subject to the PEV loop." Because it edits the operating conditions of later agents, it needs *stronger* governance than ordinary repair — sandboxed evaluation, fixed regression suites, auditable rationales, and HITL gates on boundary changes.',
                  },
                  {
                    label:
                      'Trust the Evolution Agent\'s judgment since it has access to more telemetry than any human',
                    quality: 'bad',
                    feedback:
                      'This is the unconstrained self-modification the survey explicitly warns against. More telemetry improves diagnosis but does not confer the authority to silently alter safety boundaries; the whole point of governed harness mutation is that authority stays gated and auditable.',
                  },
                  {
                    label:
                      'Freeze the harness permanently once it works, so nothing can change it',
                    quality: 'ok',
                    feedback:
                      'Freezing prevents harm but also forfeits the iterative, measurable improvement AHE is for. The survey\'s answer is not "no change" but "governed change" — the same PEV discipline, plus regression suites and human approval on risky mutations.',
                  },
                ],
              },
            ],
            debrief:
              'AHE extends the code-as-harness view "from operating agents to analyzing the infrastructure that operates them." The governance recipe is consistent: deep telemetry to locate failures, an Evolution Agent to propose and evaluate mutations, and — because it edits the controls themselves — the same Plan–Execute–Verify discipline turned inward, with regression suites and HITL gates keeping it from becoming unconstrained self-modification.',
          },
        },
      ],
    },
  ],
}
