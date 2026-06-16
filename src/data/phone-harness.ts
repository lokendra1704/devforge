import type { Subject } from '../types'
import motivationMd from './md/ph-motivation.md?raw'
import architectureMd from './md/ph-architecture.md?raw'
import benchmarkDesignMd from './md/ph-benchmark-design.md?raw'
import resultsMd from './md/ph-results.md?raw'
import safetyTradeoffsMd from './md/ph-safety-tradeoffs.md?raw'

export const phoneHarness: Subject = {
  id: 'phone-harness',
  title: 'PhoneHarness: Mixed-Action Phone Agents',
  tagline: 'Building phone agents that choose between GUI, CLI, and tools—and prove they worked.',
  icon: '📱',
  accent: '#06b6d4',
  modules: [
    {
      id: 'ph-m1',
      title: 'PhoneHarness System & Benchmark',
      description: 'How to route phone agents across multiple action surfaces and verify side effects.',
      lessons: [
        {
          id: 'ph-motivation',
          title: 'Why phone agents need more than screen control',
          minutes: 10,
          xp: 50,
          steps: [
            { kind: 'read', title: 'Beyond GUI-only benchmarks', markdown: motivationMd },
            {
              kind: 'quiz',
              title: 'Routing and verification',
              questions: [
                {
                  prompt:
                    'Current mobile-agent benchmarks like AndroidWorld primarily evaluate agents on their ability to ___ and measure success by ___.',
                  options: [
                    'tap the right button; whether the final UI state looks correct',
                    'call APIs; whether the API response was formatted correctly',
                    'parse natural language; whether the task description was understood',
                    'handle GUI and CLI equally; whether both action types were used',
                  ],
                  answer: 0,
                  explanation:
                    'Most benchmarks frame phone-use as GUI control: the agent observes a screenshot, identifies a target, emits a tap-and-swipe sequence, and success is measured by final UI state. PhoneHarness flips this: it evaluates whether agents can route across CLI, GUI, and tools, and whether the task actually succeeded as an observable side effect (an email was sent, a setting was changed, a file was created).',
                },
                {
                  prompt:
                    'Which action surfaces should an agent prefer when solving "send a message via the email app"?',
                  options: [
                    'Always CLI — it is more deterministic',
                    'Always GUI — the task explicitly mentions the app',
                    'CLI if available and reliable; otherwise GUI delegation with bounded scope',
                    'Host tool (search API) — it is external and trustworthy',
                  ],
                  answer: 2,
                  explanation:
                    'PhoneHarness uses deterministic-first routing: prefer CLI or a structured tool if available, because they are faster and leave evidence in logs. Delegate to GUI only when the task inherently requires visual navigation or app-specific interaction. For email, a CLI tool or MCP-style email service is better than tapping through an app, unless the task requires app-specific features.',
                },
                {
                  prompt:
                    'Why is "the final UI state looks correct" not a reliable measure of task success?',
                  options: [
                    'UIs are too simple to display complex information',
                    'The app may display a success message but silently fail to send or save',
                    'UIs vary across different Android versions',
                    'Screenshots can only show one app at a time',
                  ],
                  answer: 1,
                  explanation:
                    'A screenshot can lie: the app may show a success message (✓ Email sent!) but the email server rejected it, or the message never left the device. Verifiable evidence is observable side effects: a log entry in the tool trace, an email that actually arrived, a file that exists on disk, a calendar event that can be queried. PhoneHarness grades based on traces and device state, not on UI appearance.',
                },
              ],
            },
          ],
        },
        {
          id: 'ph-architecture',
          title: 'Architecture: Host-device design & mixed actions',
          minutes: 11,
          xp: 55,
          steps: [
            { kind: 'read', title: 'Design goals and system layout', markdown: architectureMd },
            {
              kind: 'quiz',
              title: 'Architecture and routing decisions',
              questions: [
                {
                  prompt:
                    'PhoneHarness separates execution into device-side and host-side services. Which of these runs on the device?',
                  options: [
                    'The agent loop, the GUI proxy, and the MCP proxy',
                    'The agent loop and the MCP tool registry; model routing and GUI proxy run on host',
                    'Only the model proxy; the agent loop and GUI delegation run on host',
                    'Everything runs on the device; the host is only for storage',
                  ],
                  answer: 1,
                  explanation:
                    'The device runs the core agent loop and a tool registry. The host provides three proxies: a model proxy (for LLM routing), a GUI proxy (translating high-level actions to ADB commands), and an MCP proxy (exposing tools like search and email). This separation keeps the agent grounded in the phone while avoiding brittle all-on-device dependencies.',
                },
                {
                  prompt:
                    'Why does PhoneHarness expose three affordance modes (GUI or CLI alternative, GUI-primary + optional CLI, GUI-only fallback) instead of a single action space?',
                  options: [
                    'To make the benchmark easier for simple agents',
                    'To match how different tasks naturally decompose: some have deterministic paths, some require visual navigation, some benefit from auxiliary tools',
                    'To avoid biasing the agent toward either visual or textual reasoning',
                    'To reduce computational cost by limiting the action space per task',
                  ],
                  answer: 1,
                  explanation:
                    'Different tasks require different action surfaces. A device-setting task is best solved via CLI. A complex app navigation requires GUI. A document-generation task benefits from a host tool. PhoneHarness exposes these affordances so the benchmark can evaluate routing ability: does the agent choose wisely?',
                },
                {
                  prompt:
                    'PhoneHarness produces nested traces (outer trace for the agent loop, inner trace for GUI delegation). Why is this separation important?',
                  options: [
                    'To reduce the size of the trace file',
                    'To identify at which layer a failure occurred: wrong tool choice, bad arguments, underspecified GUI goal, or failure to verify the side effect',
                    'To simplify the model\'s reasoning by hiding GUI details',
                    'To comply with Android security policies',
                  ],
                  answer: 1,
                  explanation:
                    'Mixed-action failures happen at different layers. An agent may choose the wrong tool (visible in outer trace), pass incorrect arguments (visible in tool result), delegate a vague GUI goal (visible in GUI trace), or complete the GUI task but fail to verify the side effect (visible in the final device state). Nested traces let you pinpoint where the failure occurred, not just infer it from the final outcome.',
                },
              ],
            },
          ],
        },
        {
          id: 'ph-benchmark-design',
          title: 'Benchmark design: Tasks, taxonomy, verification',
          minutes: 10,
          xp: 50,
          steps: [
            { kind: 'read', title: 'Task composition and verifiable success', markdown: benchmarkDesignMd },
            {
              kind: 'quiz',
              title: 'Task taxonomy and verifiability',
              questions: [
                {
                  prompt:
                    'PhoneHarness Bench organizes 124 tasks into four types: Device/system, Single-app GUI, Tool-assisted, and Cross-app. Which type benefits most from mixed-action routing (CLI or tools)?',
                  options: [
                    'Single-app GUI, because apps are visually complex',
                    'Cross-app, because it requires navigating multiple interfaces',
                    'Device/system and Tool-assisted, where deterministic CLI/MCP paths exist',
                    'All equally; the routing principle applies uniformly',
                  ],
                  answer: 2,
                  explanation:
                    'Device/system tasks (Wi-Fi, settings, contacts) and Tool-assisted tasks (search, email, document generation) have reliable deterministic paths. PhoneHarness excels here: 96.7% on device/system, 74.3% on tool-assisted. Single-app GUI and Cross-app tasks remain visually grounded and may favor specialized GUI agents.',
                },
                {
                  prompt:
                    'What makes PhoneHarness verifiers different from traditional RL reward functions?',
                  options: [
                    'They are learned from data instead of hand-crafted',
                    'They use rule-based, trace-backed checks: did the agent call the right tool, send the email to the right person, change the device setting, create the calendar event',
                    'They measure only the final UI state',
                    'They require a human to grade every run',
                  ],
                  answer: 1,
                  explanation:
                    'PhoneHarness verifiers check observable side effects, not just final appearance. Scoring evidence includes tool traces (was the right API called?), device state (does the setting have the expected value?), files (does the artifact exist?), and logs (was the email sent?). This prevents agents from faking success with a good-looking final UI.',
                },
                {
                  prompt:
                    'A task is labeled CONFIRM_FIRST for safety. What does the benchmark check?',
                  options: [
                    'Whether the agent\'s final response text mentions the word "confirmation"',
                    'Whether the agent obtained user confirmation before taking the sensitive action (visible in the execution trace)',
                    'Whether the agent refused the task entirely',
                    'Whether the agent was polite in its response',
                  ],
                  answer: 1,
                  explanation:
                    'Safety is execution-level, not post-hoc. The benchmark reads the trace: did the agent emit the sensitive action before asking for confirmation? Did it access unnecessary sensitive data? Did it create unintended side effects? A well-phrased refusal that nonetheless executed the forbidden action fails.',
                },
              ],
            },
          ],
        },
        {
          id: 'ph-results',
          title: 'Empirical results: Where mixed routing wins',
          minutes: 12,
          xp: 60,
          steps: [
            { kind: 'read', title: 'Pass rates by task type and affordance', markdown: resultsMd },
            {
              kind: 'quiz',
              title: 'Result interpretation',
              questions: [
                {
                  prompt:
                    'PhoneHarness reaches 75% pass rate overall, but only 63.3% on Single-app GUI tasks. Seed2.0-Pro reaches 76.7% on GUI tasks. What does this pattern indicate?',
                  options: [
                    'PhoneHarness is worse than Seed2.0-Pro',
                    'PhoneHarness\'s gains come from mixed execution and side-effect routing, not from being a better pure GUI agent',
                    'The GUI proxy is slower than direct model access',
                    'PhoneHarness is better suited for mock apps than real apps',
                  ],
                  answer: 1,
                  explanation:
                    'This is the key finding: PhoneHarness does not uniformly outperform on GUI tasks, showing the gain is not about GUI skill. Where PhoneHarness excels—device/system (96.7%) and tool-assisted (74.3%)—deterministic paths and verifiable side effects drive the improvement. On pure GUI, a specialized GUI agent may still be stronger.',
                },
                {
                  prompt:
                    'On "GUI or CLI alternative" tasks, PhoneHarness reaches 97.0% pass rate. On "GUI-primary + optional CLI" tasks, it reaches 67.6%. What explains this gap?',
                  options: [
                    'The harness is unreliable',
                    'When deterministic and visual paths are true alternatives, the agent can choose the reliable one. When GUI is primary and CLI is auxiliary (supporting role), the task remains fragile.',
                    'CLI tools are faster than GUI interaction',
                    'Optional CLI support is harder to implement',
                  ],
                  answer: 1,
                  explanation:
                    'The gap is interpretable: when CLI is a full alternative (two independent paths to the same goal), the agent can safely choose the deterministic one, reaching near-perfect pass rate. When CLI is auxiliary (helping a GUI-grounded task), the task still depends on visual navigation, so brittleness remains. Brittleness comes from GUI fragility, not from the harness.',
                },
                {
                  prompt:
                    'PhoneHarness achieves 75% pass rate using a mean of 23 execution steps per task, while Seed2.0-Pro achieves 62% using 24 steps. What does this suggest?',
                  options: [
                    'PhoneHarness is more efficient but less capable',
                    'More steps lead to lower pass rates',
                    'PhoneHarness achieves higher success by making smarter routing decisions, not by exploring longer',
                    'The number of steps is unrelated to pass rate',
                  ],
                  answer: 2,
                  explanation:
                    'PhoneHarness does not win by brute force (longer explorations). It wins by avoiding unnecessary GUI exploration: deterministic CLI commands replace 10-step GUI navigation chains. The efficiency gain (fewer steps to higher pass rate) is evidence that routing works.',
                },
              ],
            },
          ],
        },
        {
          id: 'ph-safety-tradeoffs',
          title: 'Safety, dependencies, and design tradeoffs',
          minutes: 9,
          xp: 45,
          steps: [
            { kind: 'read', title: 'Embedding safety, host dependencies, brittleness', markdown: safetyTradeoffsMd },
            {
              kind: 'scenario',
              title: 'Routing and safety decisions',
              scenario: {
                intro:
                  'You are designing a phone-agent harness and benchmark. You face three architectural decisions. Consider the tradeoffs:',
                stages: [
                  {
                    situation:
                      'Decision 1: Safety evaluation. Should your harness grade safety based on (A) whether the final response text sounds safe, or (B) by reading the execution trace for actual confirmations, data access, and side effects?',
                    question: 'Which approach catches more safety failures?',
                    options: [
                      {
                        label: 'Approach A (response text)',
                        quality: 'bad',
                        feedback:
                          'An agent can produce a well-phrased "I cannot do this" while silently executing the forbidden action. Trace-based evaluation is stricter and more reliable.',
                      },
                      {
                        label: 'Approach B (trace inspection)',
                        quality: 'best',
                        feedback:
                          'By reading the execution trace, you catch whether the agent actually confirmed before acting, accessed unnecessary sensitive data, or created unintended side effects. This is what PhoneHarness does.',
                      },
                    ],
                  },
                  {
                    situation:
                      'Decision 2: Host vs. on-device tools. Should search, email, and document generation run (A) entirely on the mobile device, or (B) as host services that the phone-agent loop calls remotely?',
                    question: 'Which design supports more realistic phone-agent tasks?',
                    options: [
                      {
                        label: 'Approach A (on-device)',
                        quality: 'ok',
                        feedback:
                          'Avoids external dependencies, but reimplementing search, email, and document generation on a mobile device is slow, bloated, and feature-poor. Real phones rely on cloud services.',
                      },
                      {
                        label: 'Approach B (host services)',
                        quality: 'best',
                        feedback:
                          'Host services are robust, feature-rich, and match real phone usage. The tradeoff: not applicable in fully offline scenarios. For realistic connected-phone evaluation, this is the right choice.',
                      },
                    ],
                  },
                  {
                    situation:
                      'Decision 3: Task brittleness. As you scale your benchmark from 14 mock-app tasks to 45 real-app tasks, you notice real apps are unstable: UI layouts change, network varies, login states affect feasibility. Should you (A) focus only on mock apps for stability, or (B) accept some environmental flakiness to maintain realism?',
                    question: 'Which design better supports meaningful agent evaluation?',
                    options: [
                      {
                        label: 'Approach A (mock apps only)',
                        quality: 'ok',
                        feedback:
                          'Mock apps are stable and controllable, making it easy to validate your harness and verifiers. But they do not reflect real mobile challenges.',
                      },
                      {
                        label: 'Approach B (real apps with flakiness)',
                        quality: 'best',
                        feedback:
                          'Real apps expose the actual brittleness agents must handle: app updates, network hiccups, permission gates, advertisements. This is harder to grade consistently, but it measures capability that matters in practice. PhoneHarness uses both, with careful verifier alignment.',
                      },
                    ],
                  },
                ],
                debrief:
                  'PhoneHarness makes clear choices: trace-based safety (not text judgment), host tools (not on-device bloat), and real-app tasks (not purely mock). Each choice accepts a tradeoff: more brittleness, external dependencies, harder verification. The design philosophy: realistic evaluation is worth the complexity.',
              },
            },
          ],
        },
      ],
    },
  ],
}
