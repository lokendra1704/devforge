import type { Module } from '../../types'
import codeReasoningMd from '../md/cah-code-reasoning.md?raw'
import codeActingMd from '../md/cah-code-acting.md?raw'
import codeEnvironmentMd from '../md/cah-code-environment.md?raw'

export const m2: Module = {
  id: 'cah-m2',
  title: 'Harness Interface: Code for Reasoning, Acting, and Environment',
  description:
    'How code becomes the interface between a model and its task: externalizing reasoning into checkable programs, turning programs into actions, and using repos, traces, and tests to represent environment state.',
  lessons: [
    {
      id: 'cah-code-reasoning',
      title: 'Code for Reasoning',
      minutes: 12,
      xp: 60,
      steps: [
        { kind: 'read', title: 'Reasoning you can execute', markdown: codeReasoningMd },
        {
          kind: 'quiz',
          title: 'Why code-for-reasoning works',
          questions: [
            {
              prompt:
                'The survey says pure chain-of-thought leaves the harness with "little ability to verify intermediate states." What does moving reasoning into program-delegated execution (§2.1.1) actually buy the harness?',
              options: [
                'The model becomes better at proposing high-level reasoning steps',
                'Intermediate reasoning becomes structured, verifiable execution traces an interpreter can check — separating proposing the procedure from computing it',
                'The model no longer needs to decompose the problem at all',
                'It removes the need for any external runtime',
              ],
              answer: 1,
              explanation:
                'The point is the split: the model is good at proposing steps but unreliable at symbolic/arithmetic computation, so delegating execution to an interpreter "moves intermediate reasoning into structured, verifiable execution traces" (§2.1.1). The interpreter is the calculator the model isn\'t.',
            },
            {
              prompt:
                'In the formal-verification paradigm (§2.1.2), why does the survey describe Lean/Isabelle/Coq proof languages as more than just "reasoning tools"?',
              options: [
                'Because they generate natural-language explanations the user can read',
                'Because each derivation step can be checked by a verifier, making them executable contracts that constrain, certify, and audit agent behavior',
                'Because they are faster to run than a Python interpreter',
                'Because they replace the language model entirely during proof search',
              ],
              answer: 1,
              explanation:
                'Proof assistants let "each derivation step [be] checked by a verifier" (§2.1.2). From the harness view that makes a formal language an "executable contract that constrains, certifies, and audits agent behavior" — not just a notation for reasoning, but a machine-checkable guarantee.',
            },
            {
              prompt:
                'Iterative code-grounded reasoning (§2.1.3) is described as "an iterative computational trajectory grounded in executable state transitions," not a single pass. What is the role of a FAILED execution in such a loop?',
              options: [
                'It ends the trajectory — the agent must restart from scratch',
                'It is discarded because only the final textual answer is scored',
                'It becomes an optimization/refinement signal — execution feedback drives the next generate–execute–verify–refine step',
                'It is logged but never read back by the model',
              ],
              answer: 2,
              explanation:
                'These systems add explicit generate–execute–verify–refine loops and "treat execution feedback as an optimization signal over reasoning trajectories" (§2.1.3). A failed run is not a dead end — it is the very signal (often via unit-test rewards) that shapes the next reasoning step.',
            },
          ],
        },
      ],
    },
    {
      id: 'cah-code-acting',
      title: 'Code for Acting',
      minutes: 14,
      xp: 68,
      steps: [
        { kind: 'read', title: 'From intent to grounded action', markdown: codeActingMd },
        {
          kind: 'scenario',
          title: 'Choosing an action interface',
          scenario: {
            intro:
              'You are building the action layer of an embodied/interactive agent. §2.2 gives three ways code can be the action interface — grounded skill selection (§2.2.1), programmatic policy generation (§2.2.2), and lifelong code-based agents (§2.2.3). Each fits a different situation. Pick the approach that matches each task\'s real constraints.',
            stages: [
              {
                situation:
                  'A warehouse robot already ships with a vetted, safety-certified library of primitive skills (pick, place, navigate-to, scan). Your agent must follow natural-language work orders. The hard part is choosing feasible skills under embodiment limits and refusing when an instruction is ambiguous.',
                question: 'Which action interface fits best?',
                options: [
                  {
                    label:
                      'Grounded skill selection — couple language planning to the existing skills, gate choices on embodiment feasibility, and trigger clarification on ambiguity (SayCan + KnowNo style)',
                    quality: 'best',
                    feedback:
                      'Right. The skills already exist and are certified, so the job is selection under constraints. SayCan picks "based not only on semantic relevance but also embodiment feasibility" (§2.2.1) and KnowNo adds conformal prediction "to detect ambiguous states and trigger clarification before unsafe execution" (§2.2.1) — exactly this situation.',
                  },
                  {
                    label:
                      'Programmatic policy generation — have the model write fresh Python control code for every work order',
                    quality: 'bad',
                    feedback:
                      'This throws away a vetted, safety-certified skill library and asks the agent to author new control logic each time — re-introducing the very grounding and safety risks the certified primitives already solved. Policy generation (§2.2.2) shines when no fitting skill exists, not here.',
                  },
                  {
                    label:
                      'Lifelong code-based agent — focus on an ever-growing skill library before handling today\'s orders',
                    quality: 'ok',
                    feedback:
                      'Accumulating skills (§2.2.3) is valuable long-term, but the immediate, certified-library task is feasibility-aware selection and ambiguity handling. Lifelong growth is an enhancement, not the core fit for this stage.',
                  },
                ],
              },
              {
                situation:
                  'Now a research robot faces a novel manipulation task with no matching primitive in any library. The behavior needs custom perception-conditioned branching, a feedback loop, and a couple of API calls stitched together — logic that does not exist as a reusable skill yet.',
                question: 'Which action interface fits best?',
                options: [
                  {
                    label:
                      'Programmatic policy generation — let the harness materialize an executable policy as a program with control logic, branching, and feedback loops (Code-as-Policies style)',
                    quality: 'best',
                    feedback:
                      'Correct. With no fitting skill to select, you need code as the control interface: the harness "directly materializes executable policies as programs that specify control logic, perception-conditioned branching, feedback loops, and API interaction" (§2.2.2). Code-as-Policies frames LLM-generated Python "as executable robot policies."',
                  },
                  {
                    label:
                      'Grounded skill selection — keep composing from the existing primitive library',
                    quality: 'bad',
                    feedback:
                      'Selection is bounded by what the library already contains (§2.2.1). The premise is that no fitting primitive exists, so there is nothing feasible to select — you must generate new control logic instead.',
                  },
                ],
              },
              {
                situation:
                  'Finally, an open-ended Minecraft-style agent runs for days across unbounded tasks. Solutions discovered for early tasks (build a tool, find a resource) should be reusable for later ones, and human corrections during the run should not evaporate.',
                question: 'Which action interface fits best?',
                options: [
                  {
                    label:
                      'Lifelong code-based agent — treat code as a persistent memory substrate: an expanding executable skill library plus corrections converted into reusable skills (Voyager + LYRA style)',
                    quality: 'best',
                    feedback:
                      'Right. Open-ended, long-horizon work needs capabilities to accumulate. Voyager uses "an automatic curriculum and continually expanding executable skill library" (§2.2.3) and LYRA converts human corrections "into reusable executable skills" (§2.2.3) so feedback persists.',
                  },
                  {
                    label:
                      'Programmatic policy generation — regenerate control code from scratch for every new task and discard it afterward',
                    quality: 'ok',
                    feedback:
                      'Generating fresh policies works per-task, but discarding them wastes the reuse that open-ended interaction demands. The lifelong paradigm exists precisely because "interaction feedback and corrections are often transient and difficult to reuse" (§2.2.3) — persistence is the whole point here.',
                  },
                ],
              },
            ],
            debrief:
              'The three approaches are not a quality ranking — they map to constraints. Skill selection (§2.2.1) fits when feasible skills exist and the work is choosing among them safely. Policy generation (§2.2.2) fits when no skill fits and you need custom control logic. Lifelong agents (§2.2.3) fit long-horizon, open-ended settings where capabilities and corrections must persist and accumulate.',
          },
        },
      ],
    },
    {
      id: 'cah-code-environment',
      title: 'Code for Environment',
      minutes: 12,
      xp: 60,
      steps: [
        { kind: 'read', title: 'The world as executable state', markdown: codeEnvironmentMd },
        {
          kind: 'quiz',
          title: 'Why code-for-environment works',
          questions: [
            {
              prompt:
                'The survey says without an explicit representation, environment state "remains implicit, transient, and difficult to verify" (§2.3). Which pair of advantages does representing the environment as executable code provide?',
              options: [
                'Faster inference and smaller model size',
                'Verifiable state transitions (judged by execution, not natural-language guessing) and persistent, modifiable state the agent can query, simulate, edit, and refine',
                'Elimination of the need for any feedback signal',
                'Guaranteed task success on the first attempt',
              ],
              answer: 1,
              explanation:
                'The two payoffs are exactly these (§2.3): executable environments "expose verifiable state transitions," letting outcomes be judged "through execution rather than ambiguous natural-language judgment," and they are "persistent and modifiable" so agents can "query, simulate, edit, and refine" the world during interaction.',
            },
            {
              prompt:
                'Execution-trace world modeling (§2.3.2) and code-grounded evaluation environments (§2.3.3) both use execution. What primarily distinguishes them?',
              options: [
                'Trace-based modeling learns/represents the environment\'s dynamics from runtime traces; evaluation environments use executable systems as the yardstick for measuring agent behavior',
                'Trace-based modeling runs in the cloud; evaluation environments run locally',
                'They are the same paradigm under two names',
                'Evaluation environments never execute code; they only match text',
              ],
              answer: 0,
              explanation:
                'Trace-based modeling treats "runtime transitions themselves as the primary representation of environment behavior" (§2.3.2) — e.g. WorldCoder writes editable Python world models. Evaluation environments instead use "executable systems as the interface for measuring agent behavior" (§2.3.3) — e.g. SWE-bench grades via repository-level unit-test execution. One models the world; one measures the agent.',
            },
            {
              prompt:
                'Verifiable environment construction (§2.3.4) is called "a newer direction." For a long-horizon agent, why isn\'t a task prompt enough — what must a synthesized environment also supply?',
              options: [
                'Only a larger language model and more GPUs',
                'A runnable state, transition dynamics, feedback channels, and verification oracles that determine whether an interaction has succeeded',
                'A human reviewer for every single step',
                'A complete natural-language description of the correct answer',
              ],
              answer: 1,
              explanation:
                'The harness "must provide not only a task prompt, but also a runnable state, transition dynamics, feedback channels, and verification oracles" (§2.3.4). This makes the environment interface itself an object of construction — SWE-smith turns repos into "reproducible program worlds" and EnvScaler synthesizes environments "together with... rule-based trajectory validators."',
            },
          ],
        },
      ],
    },
  ],
}
