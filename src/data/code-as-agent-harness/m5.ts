import type { Module } from '../../types'
import emergingFields1Md from '../md/cah-emerging-fields-1.md?raw'
import emergingFields2Md from '../md/cah-emerging-fields-2.md?raw'
import openProblemsMd from '../md/cah-open-problems.md?raw'

export const m5: Module = {
  id: 'cah-m5',
  title: 'Emerging Fields and Open Problems',
  description:
    'Where code-as-harness shows up today — coding assistants, GUI/OS automation, embodied agents, scientific discovery, personalization — and the open problems the survey leaves for harness engineering.',
  lessons: [
    {
      id: 'cah-emerging-fields-1',
      title: 'Emerging Fields I: Code Assistants & GUI/OS Agents',
      minutes: 11,
      xp: 60,
      steps: [
        { kind: 'read', title: 'Two production domains', markdown: emergingFields1Md },
        {
          kind: 'quiz',
          title: 'Repositories and program worlds',
          questions: [
            {
              prompt:
                'A coding assistant produces a patch that passes every visible test, but the maintainer rejects it. The survey calls the missing property "organicity." Why does passing tests not guarantee acceptance?',
              options: [
                'The tests were run in the wrong language runtime',
                'Coding is a partially observable program world: design rationale, implicit constraints, and team conventions are latent and must be inferred, so a test-green patch can still violate them',
                'Organicity means the patch was too short to be useful',
                'Visible tests always leak the solution, so passing them is meaningless',
              ],
              answer: 1,
              explanation:
                'Per §5.1.1, files and tool outputs are observable but design rationale, style, and conventions are latent. A patch can be functionally correct (green tests) yet "inorganic" — clashing with architecture or style — which maintainers reject. Verification by tests covers only the observable slice of the program world.',
            },
            {
              prompt:
                'The survey calls GUI/OS environments "a program world in the most literal sense" and notes the transition function "is not learned but executed." What is the practical consequence of an executed (not learned) transition function?',
              options: [
                'The agent must train a world model before it can act',
                'The next observation is produced deterministically by the real browser/OS engine, so an evaluator script can interrogate the actual post-action state as ground-truth feedback',
                'Actions cannot be expressed as code, only as natural language',
                'The environment is too slow to use in production',
              ],
              answer: 1,
              explanation:
                'Per §5.1.2, because the browser engine or OS deterministically computes the next state, success can be checked by "an evaluator [that] is itself a piece of code that interrogates the program world." That closes the loop: code generates the environment, code is the action, and code adjudicates the result — no learned reward model needed.',
            },
            {
              prompt:
                'Claude Computer Use, Operator, and Project Mariner jumped from research sandboxes to production unusually fast. The survey attributes this to which property of the GUI harness?',
              options: [
                'The models were simply much larger than before',
                'The input/output contract — screenshots in, code (or coordinate function calls) out — is identical in simulation and production, so a sim-trained agent transfers directly',
                'Production GUIs are simpler than the WebArena/OSWorld sandboxes',
                'Browsers removed all security boundaries to allow agents in',
              ],
              answer: 1,
              explanation:
                'Per §5.1.2, the same code-as-harness interface "makes simulators tractable" and "enabled an unusually rapid jump to production deployment, because the agent\'s input/output contract ... is identical in both settings." Sandboxes like WebArena/OSWorld are forkable and version-controlled, and the contract they train against is the one production needs.',
            },
          ],
        },
      ],
    },
    {
      id: 'cah-emerging-fields-2',
      title: 'Emerging Fields II: Embodied, Scientific, and Personalization Agents',
      minutes: 13,
      xp: 65,
      steps: [
        { kind: 'read', title: 'Code as the medium to a hidden world', markdown: emergingFields2Md },
        {
          kind: 'quiz',
          title: 'One thread, three worlds',
          questions: [
            {
              prompt:
                'For embodied agents, the survey says correctness shifts "from runtime to action-generation time." Why must an embodied harness verify intent before the actuator, rather than catching errors at runtime?',
              options: [
                'Runtime is computationally too expensive to monitor',
                'Physical constraints may fail silently — e.g. grasping outside the workspace produces no explicit error — so the emitted code must already be expressive enough to compose verified, embodiment-respecting commands',
                'Robots cannot run code, only follow text instructions',
                'Action-generation time is the only moment the model is awake',
              ],
              answer: 1,
              explanation:
                'Per §5.1.3, violated physical constraints "may fail silently," so there is no error signal to react to at runtime. Code therefore acts as both grounding interface and safety boundary, constraining admissible actions at generation/execution time so an infeasible action is never emitted in the first place.',
            },
            {
              prompt:
                'Across embodied skill libraries and scientific pipelines, the survey stresses that the stored artifact is executable. What does "a skill is not merely something the agent reads, but something the agent re-executes" buy the harness?',
              options: [
                'It makes memory smaller because code compresses better than text',
                'The same executable form that makes an action verifiable also makes it storable and directly callable later, so memory and action share one substrate instead of being separate read-only notes',
                'It removes the need for any feedback from the world',
                'It guarantees the skill never needs to be governed or pruned',
              ],
              answer: 1,
              explanation:
                'Per §5.1.3, code\'s dual identity — verifiable and re-executable — collapses the gap between memory and action: a skill library is callable, not just readable. (The survey notes the remaining hard part is governing the library: forgetting, abstraction, grounding alignment.)',
            },
            {
              prompt:
                'Personalization is singled out as having a problem the other domains do not share as acutely. What is it, and why is it harder here?',
              options: [
                'Recommendations are slower to compute than robot actions',
                'There is no reliable oracle for true user satisfaction — unlike tests for code or interface checks for GUI agents — so proxy metrics like clicks can be misleading or harmful when over-optimized',
                'User preferences cannot be stored as code at all',
                'Personalization agents cannot receive any feedback',
              ],
              answer: 1,
              explanation:
                'Per §5.1.5, the world here is a partially observed human user. Code assistants have tests and GUI agents have interface-state checkers, but personalization "lacks a reliable oracle for true user satisfaction," and proxies (clicks, engagement) can be "misleading or even harmful when optimized too aggressively." This is the oracle-adequacy gap that §5.2 generalizes.',
            },
          ],
        },
      ],
    },
    {
      id: 'cah-open-problems',
      title: 'Open Problems in Harness Engineering',
      minutes: 15,
      xp: 70,
      steps: [
        { kind: 'read', title: 'Seven problems, three families', markdown: openProblemsMd },
        {
          kind: 'scenario',
          title: 'Designing against the open problems',
          scenario: {
            intro:
              'You are designing three different code-as-harness systems. In each, you hit one of the survey\'s §5.2 open problems. Pick the mitigation direction the survey actually points toward — not a plausible-sounding patch.',
            stages: [
              {
                situation:
                  'System A is a SWE agent. It passes every visible unit test on a benchmark issue and you ship it — but in production it introduces a security regression the tests never covered. Your team\'s reflex is "add more unit tests." This is the §5.2.2 semantic-verification problem: a green test is not the full specification.',
                question:
                  'Which direction does the survey point toward for verification beyond executable feedback?',
                options: [
                  {
                    label:
                      'Compose a verification stack with explicit scope — tests, fuzzers, static analyzers, security scanners, human review — where each artifact declares what it verifies, what it cannot, and its confidence, and each accepted action carries an evidence bundle',
                    quality: 'best',
                    feedback:
                      'This is exactly §5.2.2: verification becomes "an evolving, inspectable contract," not a single pass/fail gate. The evidence bundle (checks run, assumptions preserved, untested regions, remaining risks) surfaces the security gap the unit tests silently left open.',
                  },
                  {
                    label:
                      'Keep only unit tests but raise the required coverage threshold to 100%',
                    quality: 'bad',
                    feedback:
                      'High coverage still measures one oracle. §5.2.2 warns that execution "can create a false sense of correctness" — more of the same weak signal does not catch what the oracle was never scoped to check (e.g. security). You would still optimize against the wrong signal.',
                  },
                  {
                    label:
                      'Add a metamorphic and differential testing pass alongside the units, but treat the combined result as one terminal pass/fail',
                    quality: 'ok',
                    feedback:
                      'Adding independent verification artifacts is genuinely in the §5.2.2 spirit. But collapsing them back into one terminal pass/fail discards the key idea: each artifact should declare its scope/confidence and feed an evidence bundle, so weak signals are known to be weak.',
                  },
                ],
              },
              {
                situation:
                  'System B is a multi-agent setup: a planner, two coders, a tester, and a human reviewer all working on one live repository. Things break subtly — the planner decomposed tasks from an old snapshot, a coder tested a newer patch, and the human added a constraint nobody else saw. This is the §5.2.4 transactional-shared-state problem: the system synchronizes artifacts but not assumptions.',
                question:
                  'What does the survey say the missing abstraction is?',
                options: [
                  {
                    label:
                      'Transactional shared program state: each action declares its read set, write set, assumptions, version dependencies, verifier obligations, and conflict policy, with conflict detection over plans/tests/beliefs and semantic merge or rollback',
                    quality: 'best',
                    feedback:
                      'Per §5.2.4, appending to a shared log synchronizes artifacts but not assumptions. Declaring read/write sets and assumptions lets the harness detect conflicts "not only at the level of file diffs" but across plans and beliefs, and decide when a conflict resolves automatically vs. needs external judgment.',
                  },
                  {
                    label:
                      'Force every agent through a strict sequential handoff so only one agent ever touches the repo at a time',
                    quality: 'ok',
                    feedback:
                      'Serialization avoids some races, but §5.2.4 explicitly notes many systems "still rely on sequential handoff, shared logs, or file-only state" — and that this is the status quo the open problem is trying to move past. It also throws away the parallelism that motivated multi-agent design.',
                  },
                  {
                    label:
                      'Have each agent re-read the entire repository before every action so everyone always has the latest files',
                    quality: 'bad',
                    feedback:
                      'Re-reading files syncs artifacts, not assumptions — the exact failure §5.2.4 calls out. Stale plans, obsolete invariants, and an unpropagated human constraint are not visible in the file diff, so this does not detect the semantic conflicts that are breaking System B (and it is ruinously expensive).',
                  },
                ],
              },
              {
                situation:
                  'System C is an autonomous agent that can deploy services and access user data. You want it to mostly run unattended but never cause an irreversible production incident. Your first design just appends a natural-language "be careful with production" instruction to the system prompt. This is the §5.2.5 human-in-the-loop safety problem.',
                question:
                  'How does the survey say safety and human oversight should be built into the harness?',
                options: [
                  {
                    label:
                      'Make the harness a safety governor with a context-sensitive multi-tier permission model that vetoes or escalates high-risk actions, and turn each approval/rejection into durable harness state that updates permissions, escalation policy, and audit logs',
                    quality: 'best',
                    feedback:
                      'Per §5.2.5, safety "cannot be delegated to the base model or encoded only as a natural-language instruction." The harness classifies actions by risk, enforces permission tiers (the same command differs in a sandbox vs. production), and records "executable accountability" so human decisions persist as state rather than one-off prompts.',
                  },
                  {
                    label:
                      'Keep the natural-language caution in the prompt but also lower the model temperature so it behaves more conservatively',
                    quality: 'bad',
                    feedback:
                      '§5.2.5 is explicit that safety encoded "only as a natural-language instruction" is insufficient — the model can still be overridden by its own intent. Temperature does not enforce permission boundaries, deny irreversible actions, or create an audit trail of who approved what.',
                  },
                  {
                    label:
                      'Require a human to approve every single action the agent takes, with no tiering by risk',
                    quality: 'ok',
                    feedback:
                      'Human gates on irreversible/externally-consequential actions are exactly right per §5.2.5 — but gating everything ignores the multi-tier, context-sensitive design the survey calls for (read-only and sandboxed actions belong at lower tiers) and destroys the unattended autonomy you wanted.',
                  },
                ],
              },
            ],
            debrief:
              'All three mitigations share one move: turn an implicit property into explicit, inspectable harness state. Verification becomes an evidence-carrying contract (§5.2.2), shared state declares its assumptions and conflict policy (§5.2.4), and safety becomes a tiered governor whose decisions persist (§5.2.5). That is the survey\'s closing thesis (§5.2.7): the systems that last will be executable, inspectable, stateful, and governed.',
          },
        },
      ],
    },
  ],
}
