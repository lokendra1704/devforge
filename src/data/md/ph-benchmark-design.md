# PhoneHarness Bench: Designing verifiable mobile workflows

## Task composition

PhoneHarness Bench draws 124 annotated evaluation tasks from a larger 181-task candidate pool. The dataset is organized into four overlapping perspectives: task subsets, task types, action affordances, and safety policies.

**Task subsets by construction purpose:**

- **Mock-app tasks (14):** Controlled applications used as diagnostic checks. Verify that the harness, GUI delegation, and verifier logic work under known app states.
- **Real-app tasks (45):** Real mobile applications with messier flows, environmental variation, and realistic phone-use constraints. These expose agents to the fragility of actual apps.
- **Safety tasks (30):** Exploratory tasks testing whether agents refuse, request confirmation, or avoid unintended side effects in sensitive workflows.

**Task types by execution structure:**

Rather than treating difficulty as a single axis, the benchmark groups tasks by *how they must be solved*:

- **Device/system operations (30 tasks):** Phone state and personal-device operations—contacts, notifications, Wi-Fi, volume, camera, files, reminders.
- **Single-app GUI (30 tasks):** Stay within one application, primarily requiring visual navigation and grounded clicking.
- **Tool-assisted workflows (35 tasks):** Combine phone interaction with deterministic tools—web search, email, document generation, calendar creation, file processing.
- **Cross-app workflows (29 tasks):** Require carrying information across two or more mobile applications.

This taxonomy matters: a task hard for a pure GUI agent may become straightforward when the harness can use a deterministic CLI or MCP path. A visually simple single-app task may still be brittle if the app contains permission gates, login screens, or unstable search results.

## Verification: side effects as scoring evidence

Success is not measured by whether the final UI looks plausible. PhoneHarness uses *rule-based, trace-backed verifiers*. Examples include:

- Was a required tool called (and with correct arguments)?
- Was an email sent to the correct recipient?
- Did a device setting reach the expected value?
- Does a generated artifact exist and satisfy size/content constraints?
- Was a calendar event created?
- Does the final answer contain required information?

Composite verifiers combine multiple conditions for workflows whose success cannot be captured by a single signal. The verifier layer treats the trace and the environment as first-class scoring evidence: the correct signal may be a device setting, an app state, a file on disk, a host-tool log, or a GUI trace.

## Safety protocol

Safety tasks are labeled with three execution policies, following the principle that autonomous agents should distinguish safe operations from actions requiring user confirmation or blocking:

- **SAFE_COMPLETE:** May be executed directly without prompting.
- **CONFIRM_FIRST:** Require the agent to warn the user and obtain confirmation before taking a sensitive action.
- **NEVER_AUTO:** Should be refused or deferred to the user.

The benchmark checks whether the agent *acted* before confirmation, accessed unnecessary sensitive data, sent information to unintended recipients, modified state after refusing, or created other side effects that contradict the safety label.
