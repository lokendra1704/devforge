import type { Subject } from '../types'
import valuesMd from './md/cca-values.md?raw'
import principlesMd from './md/cca-principles.md?raw'
import architectureMd from './md/cca-architecture.md?raw'
import queryLoopMd from './md/cca-query-loop.md?raw'
import permissionsMd from './md/cca-permissions.md?raw'
import extensibilityMd from './md/cca-extensibility.md?raw'
import contextMd from './md/cca-context.md?raw'
import subagentsMd from './md/cca-subagents.md?raw'
import persistenceMd from './md/cca-persistence.md?raw'
import openclawMd from './md/cca-openclaw.md?raw'
import tradeoffsMd from './md/cca-tradeoffs.md?raw'
import futureMd from './md/cca-future.md?raw'

export const claudeCodeArchitecture: Subject = {
  id: 'claude-code-architecture',
  title: 'Inside Claude Code',
  tagline:
    'The design space of agentic coding harnesses — values → query loop → safety → extensibility → context → delegation, from the "Dive into Claude Code" study.',
  icon: '🧭',
  accent: '#d97757',
  modules: [
    {
      id: 'cca-m1',
      title: 'Values & Design Principles',
      description:
        'Why the architecture looks the way it does: five human values, thirteen principles, and the roads not taken.',
      lessons: [
        {
          id: 'cca-values',
          title: 'The five values (and a sixth concern)',
          minutes: 12,
          xp: 60,
          steps: [
            { kind: 'read', title: 'A values document written in TypeScript', markdown: valuesMd },
            {
              kind: 'quiz',
              title: 'Authority vs safety',
              questions: [
                {
                  prompt:
                    'The paper insists Human Decision Authority and Safety are distinct. What is the distinction?',
                  options: [
                    'Authority is about the human’s power to choose; safety is the system’s obligation to protect even when that power lapses',
                    'Authority applies to operators, safety applies to end users',
                    'Authority is enforced in code; safety is only documentation',
                    'They are the same value under two names',
                  ],
                  answer: 0,
                  explanation:
                    'Authority is the human’s power to choose (observe, approve, interrupt, audit). Safety is the system’s obligation to protect the human, their code, and infra even when the human is inattentive or wrong. The agent must stay safe precisely when authority lapses.',
                },
                {
                  prompt:
                    'Anthropic found 93% of permission prompts get approved. What architectural response did this drive?',
                  options: [
                    'Add more detailed warnings to each prompt',
                    'Remove permissions entirely',
                    'Restructure to defined boundaries (sandboxing, classifiers) the agent works freely inside, instead of per-action prompts users rubber-stamp',
                    'Require two human approvals per action',
                  ],
                  answer: 2,
                  explanation:
                    'A 93% approval rate means per-action prompts had become rubber-stamps — habituated users stop reviewing. The fix was to restructure the problem: set safe boundaries the agent can act within freely, reserving human attention for what’s genuinely outside them.',
                },
                {
                  prompt:
                    'Why does the paper treat "long-term human capability" as an evaluative lens rather than a sixth value?',
                  options: [
                    'Because it is impossible to measure',
                    'Because it is not prominently reflected as a design driver in the architecture, despite being a real concern',
                    'Because Anthropic explicitly rejected it',
                    'Because it only matters for non-coding agents',
                  ],
                  answer: 1,
                  explanation:
                    'The "paradox of supervision" and the 17%-lower comprehension finding make it a real concern — but it is not a prominent driver of the actual architecture. So the paper applies it as a cross-cutting lens across all five values rather than claiming it as a co-equal one.',
                },
              ],
            },
          ],
        },
        {
          id: 'cca-principles',
          title: 'Thirteen principles & the roads not taken',
          minutes: 14,
          xp: 70,
          steps: [
            { kind: 'read', title: 'Principles, absences, and rival families', markdown: principlesMd },
            {
              kind: 'quiz',
              title: 'Placing the design',
              questions: [
                {
                  prompt:
                    'LangGraph encodes decision logic as explicit typed state graphs. Which Claude Code principle is the direct contrast?',
                  options: [
                    'Append-only durable state',
                    'Minimal scaffolding, maximal operational harness',
                    'Transparent file-based memory',
                    'Graduated trust spectrum',
                  ],
                  answer: 1,
                  explanation:
                    'Rule-based orchestration (LangGraph) bets on scaffolding-side reasoning — typed state graphs that constrain the path. Claude Code bets the opposite way: minimal scaffolding plus a rich operational harness, letting an increasingly capable model choose its own path.',
                },
                {
                  prompt:
                    'Which of these is explicitly something the architecture does NOT do, per the value→principle mapping?',
                  options: [
                    'Provide a permission system',
                    'Restore all session-scoped trust state across resume',
                    'Manage context as a scarce resource',
                    'Use append-only state',
                  ],
                  answer: 1,
                  explanation:
                    'The paper names three deliberate absences: no imposed planning graphs, no single unified extension mechanism, and not restoring all session-scoped trust state across resume. The last is a safety choice — resumed sessions re-earn trust rather than inheriting it.',
                },
              ],
            },
            {
              kind: 'scenario',
              title: 'You are choosing a safety posture',
              scenario: {
                intro:
                  'You are designing a new coding agent and must pick its primary safety mechanism. Three rival families are on the table.',
                stages: [
                  {
                    situation:
                      'Your agent edits files and runs shell commands on the user’s real machine. You want destructive actions caught BEFORE they run, with config users can version-control.',
                    question: 'Which posture best matches Claude Code’s principles?',
                    options: [
                      {
                        label: 'Deny-first evaluation + externalized programmable policy',
                        quality: 'best',
                        feedback:
                          'Correct — deny-first catches unrecognized/risky actions before execution, and externalized policy (rules, hooks, config files) keeps it user-visible and version-controllable. This is the Claude Code combination.',
                      },
                      {
                        label: 'Run everything in a Docker container and let it do anything inside',
                        quality: 'ok',
                        feedback:
                          'That’s the SWE-Agent / OpenHands family — container isolation as the boundary. It contains blast radius but doesn’t evaluate individual actions or give users programmable, layered policy.',
                      },
                      {
                        label: 'Let it act freely and rely on git rollback to undo mistakes',
                        quality: 'bad',
                        feedback:
                          'That’s the Aider (version-control-as-safety) family. Rollback only helps for git-tracked, reversible changes — it can’t undo a shell command that deletes data or exfiltrates a secret.',
                      },
                    ],
                  },
                  {
                    situation:
                      'A new user and a 750-session veteran use the same agent. The veteran is annoyed by prompts; the newcomer needs guardrails.',
                    question: 'Which principle resolves this?',
                    options: [
                      {
                        label: 'Graduated trust spectrum — trust co-constructed over time',
                        quality: 'best',
                        feedback:
                          'Exactly. Auto-approve rates rising from ~20% to >40% across sessions is the data behind this principle: the system targets trust trajectories, not one fixed trust level for everyone.',
                      },
                      {
                        label: 'Pick one fixed permission level and apply it to all users',
                        quality: 'bad',
                        feedback:
                          'A fixed level either over-prompts veterans (who stop reading) or under-protects newcomers. The graduated spectrum exists precisely to avoid this one-size-fits-all trap.',
                      },
                    ],
                  },
                ],
                debrief:
                  'Claude Code combines minimal scaffolding with LAYERED policy enforcement, and values-based judgment with deny-first defaults. Safety posture is not one mechanism but a stack — and trust is a trajectory, not a constant.',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'cca-m2',
      title: 'Architecture & the Query Loop',
      description:
        'The seven-component spine, the five-layer view, and one agentic turn traced end-to-end through the while-loop.',
      lessons: [
        {
          id: 'cca-architecture',
          title: 'The shape of the system',
          minutes: 14,
          xp: 70,
          steps: [
            { kind: 'read', title: 'Seven components, five layers, four questions', markdown: architectureMd },
            {
              kind: 'quiz',
              title: 'Where reasoning lives',
              questions: [
                {
                  prompt:
                    'Community analysis estimates ~1.6% of the codebase is AI decision logic and 98.4% is operational infrastructure. Which principle does this ratio illustrate?',
                  options: [
                    'Append-only durable state',
                    'Minimal scaffolding, maximal operational harness',
                    'Graduated trust spectrum',
                    'Reversibility-weighted risk',
                  ],
                  answer: 1,
                  explanation:
                    'A thin reasoning layer atop a thick operational harness is exactly "minimal scaffolding, maximal harness" expressed as a number — the bet that a capable model needs a rich environment more than it needs decision scaffolding.',
                },
                {
                  prompt:
                    'Why does separating model reasoning from harness enforcement have a security benefit?',
                  options: [
                    'It makes the model faster',
                    'A compromised or manipulated model still cannot override sandboxing, permission checks, or deny rules — its only interface is the validated tool_use protocol',
                    'It hides the system prompt from the model',
                    'It lets the model edit files without permission checks',
                  ],
                  answer: 1,
                  explanation:
                    'Reasoning and enforcement live on separate code paths. The model can only emit structured tool_use blocks, which the harness validates before execution — so adversarial manipulation of the model cannot bypass the harness-side controls.',
                },
                {
                  prompt:
                    'What does the paper identify as Claude Code’s single binding resource constraint?',
                  options: [
                    'Number of model calls (compute budget)',
                    'Disk space for transcripts',
                    'The context window (200K, or 1M for the 4.6 series)',
                    'Number of MCP servers connected',
                  ],
                  answer: 2,
                  explanation:
                    'The context window is the binding constraint. Lazy CLAUDE.md loading, deferred tool schemas, summary-only subagent returns, per-tool-result budgets, and the five-layer compaction pipeline all exist to conserve it.',
                },
              ],
            },
          ],
        },
        {
          id: 'cca-query-loop',
          title: 'One agentic turn, end to end',
          minutes: 16,
          xp: 80,
          steps: [
            { kind: 'read', title: 'The while-loop and its five shapers', markdown: queryLoopMd },
            {
              kind: 'quiz',
              title: 'Loop mechanics',
              questions: [
                {
                  prompt: 'What is the PRIMARY stop condition for the query loop?',
                  options: [
                    'The maxTurns limit is reached',
                    'The model produces a response with no tool_use blocks (text only)',
                    'The context window overflows',
                    'The user presses Ctrl-C',
                  ],
                  answer: 1,
                  explanation:
                    'A text-only response (no tool_use) is the normal, primary terminator: the model has nothing left to execute, so the turn is done. Max-turns, context overflow, hook intervention, and explicit abort are the other four conditions.',
                },
                {
                  prompt:
                    'The five pre-model shapers run in a fixed order. Why does auto-compact run last?',
                  options: [
                    'It is the cheapest, so it runs first-class',
                    'It is the most expensive (a full model-generated summary), so cheaper reductions run first and it fires only if pressure remains',
                    'It must run before the model call to set the system prompt',
                    'It only applies to subagents',
                  ],
                  answer: 1,
                  explanation:
                    'Cheaper layers (budget reduction, snip, microcompact, context collapse) run first; auto-compact triggers a full model summarization call and is the last resort, firing only when context still exceeds the threshold after the other four.',
                },
                {
                  prompt:
                    'Tools run "concurrent-read, serial-write," yet results are buffered and emitted in request order. Why preserve order?',
                  options: [
                    'To make logs prettier',
                    'Because the model expects tool results in the same order as its tool-use requests',
                    'Because parallel execution is impossible otherwise',
                    'To reduce token usage',
                  ],
                  answer: 1,
                  explanation:
                    'Read-only tools run in parallel for latency, but the model pairs each tool_result with the tool_use it emitted — so results must be returned in the original request order even though they finished out of order.',
                },
              ],
            },
            {
              kind: 'scenario',
              title: 'Tuning the loop under pressure',
              scenario: {
                intro:
                  'You maintain an agent built on this reactive loop. Two incidents land on your desk.',
                stages: [
                  {
                    situation:
                      'A turn issues three Bash commands in parallel. The first errors immediately, but the other two keep running for 40s, wasting work and possibly mutating state.',
                    question: 'What does the loop already do — and what should you NOT change?',
                    options: [
                      {
                        label: 'The sibling abort controller kills the in-flight subprocesses on first Bash error — keep it',
                        quality: 'best',
                        feedback:
                          'Right. The StreamingToolExecutor fires a sibling abort controller when any Bash tool errors, terminating other in-flight subprocesses instead of letting them finish. This is the intended behavior.',
                      },
                      {
                        label: 'Serialize ALL tools so this never happens',
                        quality: 'ok',
                        feedback:
                          'Over-correction. State-modifying tools are already serialized; read-only tools run in parallel for latency. Forcing everything serial throws away the concurrency benefit to solve a case the sibling-abort already handles.',
                      },
                      {
                        label: 'Let the siblings run to completion to avoid partial state',
                        quality: 'bad',
                        feedback:
                          'That maximizes wasted work and risks more state mutation after a known failure. The design deliberately aborts siblings on first Bash error.',
                      },
                    ],
                  },
                  {
                    situation:
                      'A long session keeps hitting prompt_too_long mid-turn and users see hard failures.',
                    question: 'Which response matches the loop’s "graceful recovery" principle?',
                    options: [
                      {
                        label: 'Attempt context-collapse overflow recovery + reactive compaction before terminating',
                        quality: 'best',
                        feedback:
                          'Exactly the documented order: on prompt_too_long the loop tries context-collapse overflow recovery and reactive compaction first, only terminating with reason "prompt_too_long" if those fail.',
                      },
                      {
                        label: 'Immediately end the turn with an error message',
                        quality: 'bad',
                        feedback:
                          'That is fail-hard, the opposite of graceful recovery. The loop reserves hard termination for after recovery attempts are exhausted.',
                      },
                    ],
                  },
                ],
                debrief:
                  'The loop is simple by design, but the harness around it is engineered for resilience: concurrent-read/serial-write execution, sibling aborts, bounded retries, and recovery-before-termination. Reserve human attention (and hard failures) for the genuinely unrecoverable.',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'cca-m3',
      title: 'Safety & Extensibility',
      description:
        'The seven-layer permission gate, deny-first evaluation, the auto-mode classifier, and the four extension mechanisms ordered by context cost.',
      lessons: [
        {
          id: 'cca-permissions',
          title: 'The permission gate',
          minutes: 16,
          xp: 80,
          steps: [
            { kind: 'read', title: 'Deny-first, modes, and the authorization pipeline', markdown: permissionsMd },
            {
              kind: 'quiz',
              title: 'How the gate behaves',
              questions: [
                {
                  prompt:
                    'You set "deny all shell commands" AND "allow `npm test`" (a more specific allow). What happens when the model runs `npm test`?',
                  options: [
                    'Allowed — the more specific allow rule wins',
                    'Denied — a deny rule always takes precedence, even over a more specific allow',
                    'The user is always asked regardless of rules',
                    'It depends on the order the rules were written',
                  ],
                  answer: 1,
                  explanation:
                    'Deny-first means safety wins ties: a broad deny cannot be overridden by a narrow allow. This is the inverse of specificity-based resolution — the system biases toward blocking when rules conflict.',
                },
                {
                  prompt:
                    'When the classifier or a deny rule blocks an action, the agent does NOT halt. What happens instead?',
                  options: [
                    'The session ends and must be restarted',
                    'The denial becomes a routing signal: the model receives the reason, revises, and tries a safer alternative next iteration',
                    'The tool runs anyway in a sandbox',
                    'The user must manually edit the rules before continuing',
                  ],
                  answer: 1,
                  explanation:
                    'Permission enforcement shapes behavior rather than stopping it. The model gets the denial reason and re-plans on the next loop iteration; the PermissionDenied hook lets external code guide the retry.',
                },
                {
                  prompt:
                    'Researchers found commands with >50 subcommands fall back to one generic approval prompt instead of per-subcommand deny checks. What general lesson does this illustrate?',
                  options: [
                    'Deny rules are useless',
                    'Defense-in-depth can degrade when its layers share a failure mode (here, parse-time cost causing UI freezes)',
                    'Sandboxing should always be disabled',
                    'The classifier is more reliable than rules',
                  ],
                  answer: 1,
                  explanation:
                    'Layered safety rests on an independence assumption. When two layers share a performance constraint, an attacker can push past a threshold (50+ subcommands) to degrade them together — independence is an assumption, not a guarantee.',
                },
              ],
            },
            {
              kind: 'quiz',
              title: 'Modes & isolation',
              questions: [
                {
                  prompt: 'In bypassPermissions mode, are deny rules and safety-critical checks disabled?',
                  options: [
                    'Yes — bypassPermissions disables everything',
                    'No — it skips most prompts, but safety-critical and bypass-immune rules still apply',
                    'Only deny rules remain; safety checks are skipped',
                    'It is identical to dontAsk',
                  ],
                  answer: 1,
                  explanation:
                    'Even the loosest modes never fully disarm. bypassPermissions skips most prompts but safety-critical and bypass-immune rules still fire; dontAsk likewise still enforces deny rules. The trust spectrum is graduated, not all-or-nothing.',
                },
                {
                  prompt:
                    'Permissions and shell sandboxing operate on "different axes." What are those two axes?',
                  options: [
                    'Speed versus accuracy',
                    'Authorization (may this run?) versus isolation (how contained is it when it runs?)',
                    'Read versus write',
                    'Local versus remote',
                  ],
                  answer: 1,
                  explanation:
                    'A command can be permission-approved yet still sandboxed, or permission-denied and never reach the sandbox. Authorization governs whether an action is allowed; isolation governs its filesystem/network blast radius if it does run.',
                },
              ],
            },
          ],
        },
        {
          id: 'cca-extensibility',
          title: 'MCP, plugins, skills & hooks',
          minutes: 15,
          xp: 75,
          steps: [
            { kind: 'read', title: 'Four mechanisms, three injection points', markdown: extensibilityMd },
            {
              kind: 'scenario',
              title: 'Choosing an extension mechanism',
              scenario: {
                intro:
                  'You are extending an agent for a team. Context budget is tight. For each need, pick the mechanism that fits Claude Code’s context-cost ordering.',
                stages: [
                  {
                    situation:
                      'You want the agent to follow your team’s code-review checklist and house style when it writes code — guidance, not new tools — with minimal context overhead.',
                    question: 'Which mechanism?',
                    options: [
                      {
                        label: 'A Skill (SKILL.md) — only its frontmatter description stays in the prompt',
                        quality: 'best',
                        feedback:
                          'Right. Skills shape HOW the agent thinks at minimal context cost: only the frontmatter description sits in the prompt; the full body loads when SkillTool invokes it.',
                      },
                      {
                        label: 'An MCP server exposing a "review" tool',
                        quality: 'ok',
                        feedback:
                          'Workable but heavier — MCP tool schemas consume context budget continuously. For pure guidance (no external system to call), a skill is cheaper.',
                      },
                      {
                        label: 'Put the entire checklist in the base CLAUDE.md',
                        quality: 'bad',
                        feedback:
                          'That permanently consumes context every turn, even when irrelevant. Skills exist precisely so instructions load on demand rather than always-on.',
                      },
                    ],
                  },
                  {
                    situation:
                      'You need to block any tool call that would write to /etc and log every tool invocation to your SIEM — cross-cutting, with no context footprint.',
                    question: 'Which mechanism?',
                    options: [
                      {
                        label: 'Hooks (PreToolUse to block, PostToolUse to log) — ~zero context cost',
                        quality: 'best',
                        feedback:
                          'Exactly. Hooks provide lifecycle interception (block/rewrite/annotate) with no context footprint by default — ideal for cross-cutting policy and observability.',
                      },
                      {
                        label: 'A skill that reminds the model not to write to /etc',
                        quality: 'bad',
                        feedback:
                          'A reminder is advisory, not enforcement — a manipulated or overeager model can ignore it. Blocking belongs in the execute() injection point (a PreToolUse hook), not in assemble().',
                      },
                    ],
                  },
                  {
                    situation:
                      'You want to ship the skill, the hooks, AND a database MCP server to other teams as one installable unit.',
                    question: 'Which mechanism packages all of it?',
                    options: [
                      {
                        label: 'A Plugin — one manifest bundles commands, agents, skills, hooks, MCP servers, and more',
                        quality: 'best',
                        feedback:
                          'Correct. Plugins are both packaging format and distribution vehicle: a single manifest carries up to ten component types and the loader routes each to its registry.',
                      },
                      {
                        label: 'Ask each team to copy three files manually',
                        quality: 'bad',
                        feedback:
                          'That defeats the purpose of the distribution layer. Plugins exist so a multi-component extension installs as one unit.',
                      },
                    ],
                  },
                ],
                debrief:
                  'The four mechanisms are ordered by context cost — hooks (~0) → skills (frontmatter only) → MCP (schemas) → plugins (bundles). Match the need to the cheapest mechanism that expresses it, and put enforcement in execute() (hooks), never in advisory text.',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'cca-m4',
      title: 'Context, Memory & Subagents',
      description:
        'How the bounded window is packed, why CLAUDE.md is guidance not enforcement, file-based memory, and delegation that saves context instead of exploding it.',
      lessons: [
        {
          id: 'cca-context',
          title: 'Packing the bounded window',
          minutes: 15,
          xp: 75,
          steps: [
            { kind: 'read', title: 'Assembly, memory, and lazy-degradation compaction', markdown: contextMd },
            {
              kind: 'quiz',
              title: 'Guidance vs enforcement',
              questions: [
                {
                  prompt:
                    'CLAUDE.md is delivered as a user-context message, not as system-prompt content. What is the key consequence?',
                  options: [
                    'It is loaded faster',
                    'Model compliance with CLAUDE.md is probabilistic; only permission rules provide deterministic enforcement',
                    'CLAUDE.md can never be edited by the user',
                    'It overrides all permission rules',
                  ],
                  answer: 1,
                  explanation:
                    'Because it arrives as conversational context, the model MAY ignore it — compliance is probabilistic. Hard safety must live in the deterministic layer (deny-first permission rules or PreToolUse hooks), not in CLAUDE.md guidance.',
                },
                {
                  prompt:
                    'How does Claude Code select relevant memory, and what does it trade off?',
                  options: [
                    'Embedding/vector similarity at entry granularity — most selective, fully inspectable',
                    'An LLM scan of memory-file headers picking up to five files at file granularity — less selective, but inspectable and version-controllable',
                    'It loads every memory file every turn',
                    'A database query the user configures with SQL',
                  ],
                  answer: 1,
                  explanation:
                    'No embeddings or vector index — an LLM-based header scan surfaces up to five files at file (not entry) granularity. It is coarser than RAG but the user can read, edit, and commit exactly what the agent sees.',
                },
                {
                  prompt:
                    'The compaction pipeline "never modifies or deletes previously written transcript lines." Why does this mostly-append design matter?',
                  options: [
                    'It saves disk space',
                    'The full history stays reconstructable (via boundary head/anchor/tail UUIDs) even though the model only sees the summary',
                    'It makes the model respond faster',
                    'It prevents the user from resuming the session',
                  ],
                  answer: 1,
                  explanation:
                    'Append-only compaction means the original messages survive; the boundary marker records headUuid/anchorUuid/tailUuid for read-time chain patching, so resume/fork can rebuild full history while live turns see the compressed view.',
                },
              ],
            },
            {
              kind: 'quiz',
              title: 'Hierarchy & loading',
              questions: [
                {
                  prompt:
                    'In the CLAUDE.md hierarchy, files closer to the current working directory are loaded LATER. Why?',
                  options: [
                    'To save memory',
                    'Files loaded later receive more model attention — so the most local, specific instructions get priority',
                    'Because they are larger',
                    'It is an accident of the file system',
                  ],
                  answer: 1,
                  explanation:
                    'Loading happens in "reverse order of priority": later-loaded files get more attention, so directory-specific instructions outrank global ones. Nested-dir rules even load lazily as the agent explores, so the instruction set evolves mid-session.',
                },
                {
                  prompt:
                    'Which compaction layer is always active (not feature-gated)?',
                  options: [
                    'Auto-compact',
                    'Context collapse',
                    'Budget reduction (per-tool-result size limits)',
                    'Snip',
                  ],
                  answer: 2,
                  explanation:
                    'Budget reduction always runs; snip, microcompact, and context collapse are feature-gated, and auto-compact is default-on but user-disableable. Cheaper layers run first under the lazy-degradation principle.',
                },
              ],
            },
          ],
        },
        {
          id: 'cca-subagents',
          title: 'Delegation without context explosion',
          minutes: 14,
          xp: 70,
          steps: [
            { kind: 'read', title: 'AgentTool, isolation modes, and permission override', markdown: subagentsMd },
            {
              kind: 'quiz',
              title: 'How delegation saves context',
              questions: [
                {
                  prompt:
                    'What is the fundamental difference between SkillTool and AgentTool?',
                  options: [
                    'SkillTool is faster than AgentTool',
                    'SkillTool injects instructions into the current context window; AgentTool spawns a new, isolated one that returns only a summary',
                    'AgentTool cannot run shell commands',
                    'They are identical meta-tools',
                  ],
                  answer: 1,
                  explanation:
                    'SkillTool extends the current conversation; AgentTool creates a separate context window. The subagent returns only summary text, so a 40-file exploration grows the parent window by a paragraph — delegation conserves context.',
                },
                {
                  prompt:
                    'Why does Claude Code use git-worktree isolation for subagents instead of containers?',
                  options: [
                    'Worktrees are slower but more secure',
                    'Worktrees give filesystem-level separation with zero external dependencies, using Git rather than container orchestration',
                    'Containers cannot isolate filesystems',
                    'Worktrees inherit the full parent transcript',
                  ],
                  answer: 1,
                  explanation:
                    'Worktree isolation leverages Git’s built-in mechanism for filesystem-level separation with no extra infrastructure. Containers (SWE-Agent/OpenHands) give stronger boundaries but require orchestration; context-only isolation shares the filesystem.',
                },
              ],
            },
            {
              kind: 'scenario',
              title: 'Delegating the auth-fix exploration',
              scenario: {
                intro:
                  'Your agent must fix a failing test, but first needs to understand a large auth module. You configure the delegation.',
                stages: [
                  {
                    situation:
                      'You want a subagent to read and map the auth module without any risk of it editing files, and without bloating the parent context.',
                    question: 'Best configuration?',
                    options: [
                      {
                        label: 'Explore subagent (write/edit deny-listed), returning a summary to the parent',
                        quality: 'best',
                        feedback:
                          'Exactly. Explore is read/search-oriented with write and edit in its deny-list, and like all subagents it returns only a summary — perfect for safe, context-cheap investigation.',
                      },
                      {
                        label: 'A General-purpose subagent with all tools enabled',
                        quality: 'ok',
                        feedback:
                          'It would work but grants edit/write power you don’t want for pure exploration. Explore’s deny-list enforces read-only investigation by construction.',
                      },
                      {
                        label: 'Inline the whole module into the parent via SkillTool',
                        quality: 'bad',
                        feedback:
                          'SkillTool injects into the CURRENT window — the opposite of what you want. The exploration’s file reads would bloat the parent context instead of staying isolated.',
                      },
                    ],
                  },
                  {
                    situation:
                      'The parent session is running in acceptEdits mode. A custom subagent declares permissionMode: "plan".',
                    question: 'Which mode wins?',
                    options: [
                      {
                        label: 'The parent’s acceptEdits stays in force — it reflects an explicit user decision and takes precedence',
                        quality: 'best',
                        feedback:
                          'Correct. A subagent’s permissionMode override is applied UNLESS the parent is already in bypassPermissions, acceptEdits, or auto — those represent explicit user safety/autonomy decisions and always win.',
                      },
                      {
                        label: 'The subagent’s plan mode always overrides the parent',
                        quality: 'bad',
                        feedback:
                          'Not when the parent is in bypassPermissions, acceptEdits, or auto. Those parent modes take precedence precisely because the user chose them explicitly.',
                      },
                    ],
                  },
                ],
                debrief:
                  'Delegation is an isolation tool: pick the narrowest built-in type (Explore for read-only), rely on summary-only returns to protect context, and remember that explicit parent permission modes override a subagent’s declared mode.',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'cca-m5',
      title: 'Persistence & the OpenClaw Contrast',
      description:
        'Append-only transcripts, why resume re-earns trust, and how a different deployment context (OpenClaw) produces opposite answers to the same questions.',
      lessons: [
        {
          id: 'cca-persistence',
          title: 'State that outlives the window',
          minutes: 13,
          xp: 65,
          steps: [
            { kind: 'read', title: 'Append-only transcripts, resume, and re-earned trust', markdown: persistenceMd },
            {
              kind: 'quiz',
              title: 'Persistence by design',
              questions: [
                {
                  prompt:
                    'Resume and fork restore the conversation but deliberately do NOT restore session-scoped permissions. Why?',
                  options: [
                    'Permissions are too large to serialize',
                    'Sessions are treated as isolated trust domains — re-granting avoids carrying stale trust into a changed context',
                    'It is a bug the team plans to fix',
                    'Permissions are stored in a database that resume cannot read',
                  ],
                  answer: 1,
                  explanation:
                    'Session-scoped permissions live in memory only. On resume the context is rebuilt from CLI args + disk settings, and unrecognized requests fall back to deny-first prompting. Trust is always re-established in the current session — the safety invariant is worth the friction.',
                },
                {
                  prompt:
                    'The transcript format is mostly-append JSONL rather than a database. What is the stated trade-off?',
                  options: [
                    'Richer queries at the cost of transparency',
                    'Auditability and simplicity (human-readable, version-controllable, no special tooling) at the cost of query power',
                    'Faster writes at the cost of durability',
                    'Smaller files at the cost of readability',
                  ],
                  answer: 1,
                  explanation:
                    'Append-only JSONL favors auditability and simplicity over query power: every event is human-readable and reconstructable without tooling. A database would enable richer queries but add deployment dependencies and reduce transparency.',
                },
                {
                  prompt:
                    'In Claude Code, what are "checkpoints"?',
                  options: [
                    'Full conversation snapshots for resuming any past turn',
                    'File-history snapshots for --rewind-files (reverting filesystem changes), not a generic conversation checkpoint store',
                    'Database transaction commits',
                    'The compact boundary markers',
                  ],
                  answer: 1,
                  explanation:
                    'A vocabulary trap: "checkpoints" are file-level snapshots at ~/.claude/file-history/<sessionId>/ used by --rewind-files to revert filesystem changes — not a general checkpoint store for the whole conversation.',
                },
              ],
            },
          ],
        },
        {
          id: 'cca-openclaw',
          title: 'Same questions, opposite answers',
          minutes: 15,
          xp: 75,
          steps: [
            { kind: 'read', title: 'Claude Code vs OpenClaw across six dimensions', markdown: openclawMd },
            {
              kind: 'quiz',
              title: 'Why the answers diverge',
              questions: [
                {
                  prompt:
                    'The paper calls one difference "the most fundamental architectural divergence" that frames every other question. Which is it?',
                  options: [
                    'The programming language each is written in',
                    'System scope: ephemeral CLI coding harness vs persistent multi-channel gateway daemon',
                    'The number of permission modes',
                    'Whether they use file-based memory',
                  ],
                  answer: 1,
                  explanation:
                    'System scope is the root divergence. Once you fix ephemeral-CLI vs persistent-gateway, the trust model, runtime position, extension surface, and multi-agent design all follow from it.',
                },
                {
                  prompt:
                    'Where does each system place its trust boundary?',
                  options: [
                    'Both place it at the network perimeter',
                    'Claude Code: between the model and the execution environment; OpenClaw: at the gateway perimeter (identity + allowlists)',
                    'Claude Code: at the perimeter; OpenClaw: per-action',
                    'Neither has a trust boundary',
                  ],
                  answer: 1,
                  explanation:
                    'Claude Code treats the model as untrusted on a trusted machine, so it evaluates every action. OpenClaw trusts the operator and gates inbound channels by identity. Per-action classification vs perimeter access control is downstream of the threat model.',
                },
                {
                  prompt:
                    'What does the ACP-based composability (OpenClaw can host Claude Code) suggest about the agent design space?',
                  options: [
                    'That one system is strictly better than the other',
                    'That the space is layered, not flat — gateway-level systems and task-level harnesses can compose, not just compete',
                    'That all agents will converge to one architecture',
                    'That coding harnesses are obsolete',
                  ],
                  answer: 1,
                  explanation:
                    'A gateway hosting a harness via ACP shows the two occupy different layers of one stack. The design space is layered: gateway-level control planes and task-level harnesses compose rather than being mutually exclusive alternatives.',
                },
              ],
            },
            {
              kind: 'scenario',
              title: 'Picking an architecture for a new agent',
              scenario: {
                intro:
                  'You are starting a new agent product and must choose a posture. The right answer depends entirely on deployment context.',
                stages: [
                  {
                    situation:
                      'Your agent runs on the developer’s own laptop, editing their repo and running shell commands. The model is the untrusted element; the machine and user are trusted.',
                    question: 'Which trust posture fits?',
                    options: [
                      {
                        label: 'Deny-first per-action evaluation between the model and the execution environment',
                        quality: 'best',
                        feedback:
                          'Right — this is the Claude Code situation. The model is untrusted on a trusted machine, so you evaluate every tool call and place the boundary between model and execution environment.',
                      },
                      {
                        label: 'Perimeter identity control and trust the agent fully once inside',
                        quality: 'bad',
                        feedback:
                          'Perimeter control fits a multi-channel gateway with untrusted inbound senders — not a single-user local coding tool where the risk is the model’s own actions, not who is messaging in.',
                      },
                    ],
                  },
                  {
                    situation:
                      'Your agent is a persistent daemon connecting WhatsApp, Slack, and Telegram for one operator, with many inbound senders of varying trust.',
                    question: 'Which posture fits now?',
                    options: [
                      {
                        label: 'Perimeter-level identity and access control (pairing, allowlists) at the gateway',
                        quality: 'best',
                        feedback:
                          'Correct — this is OpenClaw’s situation. With many inbound channels and one trusted operator, the boundary belongs at the perimeter: gate who can talk to the agent via identity and allowlists.',
                      },
                      {
                        label: 'Classify every individual tool call with an ML classifier and ignore who sent the request',
                        quality: 'ok',
                        feedback:
                          'Per-action classification helps, but it misses the dominant risk here: untrusted inbound senders. Identity/access control at the perimeter is the primary boundary for a multi-channel gateway.',
                      },
                    ],
                  },
                ],
                debrief:
                  'There is no universally "correct" agent architecture. The recurring questions are stable, but the right answers are dictated by deployment context and threat model — which is exactly why two well-designed systems can invert each other and still both be right.',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'cca-m6',
      title: 'Design Tensions & Future Directions',
      description:
        'The architecture as one coherent design point: its value tensions, the four concrete trade-offs (incl. the pre-trust window), and six open questions for the next harness.',
      lessons: [
        {
          id: 'cca-tradeoffs',
          title: 'The tensions and trade-offs',
          minutes: 16,
          xp: 80,
          steps: [
            { kind: 'read', title: 'One design point, read whole', markdown: tradeoffsMd },
            {
              kind: 'quiz',
              title: 'Where the design strains',
              questions: [
                {
                  prompt:
                    'Two CVEs share a root cause that Figure 4 (the spatial permission pipeline) does not capture. What is it?',
                  options: [
                    'Deny rules can be overridden by allow rules',
                    'A pre-trust initialization window: hooks/MCP/settings load BEFORE the trust dialog, outside the deny-first pipeline',
                    'The classifier always approves Bash commands',
                    'Sandboxing is disabled by default',
                  ],
                  answer: 1,
                  explanation:
                    'Figure 4 shows the spatial ordering of checks but not the temporal one. Extension code runs during initialization before the interactive trust dialog, creating a privileged pre-trust window outside permission enforcement — extensibility creates attack surface via initialization ordering, not just complexity.',
                },
                {
                  prompt:
                    'The paper argues the right way to evaluate defense-in-depth is NOT "can a layer be bypassed?" What is the better question?',
                  options: [
                    'Is the classifier accurate?',
                    'How many independent layers must fail simultaneously, and do they share failure modes?',
                    'How fast is each layer?',
                    'How many permission modes exist?',
                  ],
                  answer: 1,
                  explanation:
                    'Layered safety rests on independence. Since Claude Code’s layers share performance/economic constraints (e.g. parsing cost causing the 50-subcommand fallback), the real question is whether layers fail together — shared failure modes break the independence assumption.',
                },
                {
                  prompt:
                    'Sandboxing reduced permission prompts by an estimated 84%. What design lesson does the paper draw?',
                  options: [
                    'Sandboxing is unnecessary',
                    'The architectural answer to unreliable human approval is to reduce the number of decisions humans must make',
                    'Users should approve every prompt carefully',
                    'Prompts should be made longer and more detailed',
                  ],
                  answer: 1,
                  explanation:
                    'Given 93% rubber-stamping and habituation (auto-approve 20%→40% over sessions), more prompts don’t help. Cutting decisions by ~84% via sandboxing treats unreliable approval as a human-factors problem solved by fewer, better-targeted decisions.',
                },
              ],
            },
            {
              kind: 'quiz',
              title: 'Predictions & recurring commitments',
              questions: [
                {
                  prompt:
                    'What falsifiable prediction does the architecture make about agent-generated code, and why?',
                  options: [
                    'It will be bug-free, because the model is capable',
                    'It will show more pattern duplication and convention violations, because bounded context + subagent isolation prevent global codebase awareness',
                    'It will always be faster to write',
                    'It will never need refactoring',
                  ],
                  answer: 1,
                  explanation:
                    'Bounded context, lossy compaction, and isolated subagents mean good LOCAL decisions without global awareness — predicting more duplication and convention drift. Adjacent-tool studies (Cursor: +40.7% complexity; 19% slower in an RCT) are consistent, though not Claude Code itself.',
                },
                {
                  prompt:
                    'Which three cross-cutting commitments recur across ALL of Claude Code’s subsystems?',
                  options: [
                    'Speed, caching, and parallelism',
                    'Graduated layering, append-only auditability, and model judgment within a deterministic harness',
                    'Encryption, authentication, and authorization',
                    'Planning graphs, typed edges, and state machines',
                  ],
                  answer: 1,
                  explanation:
                    'Reading the six subsystems together: (1) graduated stacks over monolithic mechanisms, (2) append-only designs favoring auditability over query power, (3) model judgment within a rich deterministic harness — the 1.6% decision-logic ratio quantifies the last.',
                },
              ],
            },
          ],
        },
        {
          id: 'cca-future',
          title: 'Six open questions',
          minutes: 15,
          xp: 75,
          steps: [
            { kind: 'read', title: 'Where the harness boundary moves next', markdown: futureMd },
            {
              kind: 'quiz',
              title: 'The frontier',
              questions: [
                {
                  prompt:
                    'Industry data suggests "78% of AI failures are invisible." Where does the paper locate the work of closing this gap?',
                  options: [
                    'In bigger models — capability will solve it',
                    'At the harness layer (e.g. generator–evaluator separation, possibly as new hook events) rather than model improvements alone',
                    'In the user interface only',
                    'It is unsolvable',
                  ],
                  answer: 1,
                  explanation:
                    'Silent mistakes, not crashes, are the dominant failure mode. The open question is whether evaluation scaffolding belongs inside the harness (new hooks) or outside it — but the locus is the harness, not the model.',
                },
                {
                  prompt:
                    'KAIROS binds proactivity to two things to resolve the "proactivity vs disruption" tension. What are they?',
                  options: [
                    'Model size and temperature',
                    'User presence (terminal focus awareness) and token economics (SleepTool; cache expires after 5 min)',
                    'Disk space and network speed',
                    'Permission modes and deny rules',
                  ],
                  answer: 1,
                  explanation:
                    'KAIROS uses tick-based heartbeats: it acts more autonomously when the user is away and collaborates when present, and throttles economically since each wake costs an API call and the prompt cache expires after 5 minutes — making sleep/wake an explicit cost optimization.',
                },
                {
                  prompt:
                    'Regarding long-term human capability as a first-class design goal, what concrete gap does the current harness have?',
                  options: [
                    'It cannot run on Windows',
                    'It exposes no per-session signal for comprehension or convention drift, so the effects motivating the lens aren’t measurable at session granularity yet',
                    'It lacks a permission system',
                    'It cannot spawn subagents',
                  ],
                  answer: 1,
                  explanation:
                    'The cited evidence operates at session-to-multi-month scales, but the harness exposes no per-session comprehension/convention-drift signal. Whether architecture can even respond (and whether the harness is the right locus vs the IDE or org) is left open.',
                },
              ],
            },
            {
              kind: 'scenario',
              title: 'Investing in the next harness',
              scenario: {
                intro:
                  'Frontier models are converging in coding ability. You lead an agent platform and must decide where to spend engineering effort.',
                stages: [
                  {
                    situation:
                      'A teammate proposes adding an elaborate planning-graph framework to constrain the model’s reasoning, arguing it will improve reliability.',
                    question: 'What does this paper’s thesis suggest?',
                    options: [
                      {
                        label: 'Invest in deterministic infrastructure (context mgmt, safety layering, recovery) over planning scaffolding',
                        quality: 'best',
                        feedback:
                          'Right. As models converge, the operational harness becomes the principal differentiator. The paper argues deterministic infrastructure yields greater reliability gains than planning scaffolding around already-capable models.',
                      },
                      {
                        label: 'Add the planning graph — more scaffolding always means more reliability',
                        quality: 'bad',
                        feedback:
                          'This is the LangGraph/Devin bet the paper contrasts against. The 1.6%/98.4% ratio embodies the opposite thesis: enable the model’s judgment with a rich harness rather than constrain it with scaffolding.',
                      },
                      {
                        label: 'Do nothing — capable models need no harness',
                        quality: 'bad',
                        feedback:
                          'The opposite lesson. The harness is 98.4% of the code precisely because capable models need rich operational infrastructure (safety, context, recovery) to decide well.',
                      },
                    ],
                  },
                  {
                    situation:
                      'Your agent will soon take physical actions (vision-language-action) and run unattended for days. Which named tensions should worry you most?',
                    question: 'Pick the most relevant pair.',
                    options: [
                      {
                        label: 'Reversibility-weighted risk scaling to non-textual effects, plus horizon scaling beyond the session unit',
                        quality: 'best',
                        feedback:
                          'Exactly. Physical actions hit reversibility-weighted risk at a cost asymmetry the principle names but doesn’t quantify; unattended multi-day runs test whether the turn/session/subagent unit survives horizon scaling.',
                      },
                      {
                        label: 'Only the choice of programming language',
                        quality: 'bad',
                        feedback:
                          'Language is irrelevant to these risks. The "what" axis (physical actions) and "horizon scaling" are the directions the paper flags as stressing reversibility-weighted risk and session-scoped design.',
                      },
                    ],
                  },
                ],
                debrief:
                  'The harness boundary "moves, it doesn’t shrink." As models commoditize, the differentiator is the operational harness — and the next frontiers (silent-failure observability, cross-session memory, proactivity, physical action, governance, human capability) are harness-layer questions, not model-capability ones.',
              },
            },
          ],
        },
      ],
    },
  ],
}
