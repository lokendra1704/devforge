import type { Subject } from '../types'
import motivationMd from './md/fc-motivation.md?raw'
import architectureMd from './md/fc-architecture.md?raw'
import sftMd from './md/fc-sft.md?raw'
import rlMd from './md/fc-rl.md?raw'
import resultsMd from './md/fc-results.md?raw'

export const fastContext: Subject = {
  id: 'fast-context',
  title: 'FastContext: Training an Efficient Repository Explorer for Coding Agents',
  tagline:
    'Zhang, Wang, Shi et al. (Microsoft & SJTU), 2026 — a trained subagent that separates repository exploration from solving, cutting coding-agent tokens up to 60% while improving resolution rates.',
  icon: '🧭',
  accent: '#14b8a6',
  modules: [
    {
      id: 'fc-m1',
      title: 'FastContext: Exploration as a Trainable Subagent',
      description:
        'Why repository exploration is the hidden cost in coding agents, and how a dedicated, SFT+RL-trained explorer that returns compact file-line citations improves task success while slashing the main agent\'s token budget.',
      lessons: [
        {
          id: 'fc-motivation',
          title: 'The exploration bottleneck',
          minutes: 10,
          xp: 50,
          steps: [
            { kind: 'read', title: 'The agent spends most of its budget looking, not fixing', markdown: motivationMd },
            {
              kind: 'quiz',
              title: 'Check: where the budget goes',
              questions: [
                {
                  prompt:
                    'In the preliminary analysis of 300 GPT-5.4 trajectories (Section 2), what share of the main agent\'s tool-use turns went to reading and searching?',
                  options: [
                    'About 10%, a minor cost',
                    'About 56% (9.96 of 17.72 turns) — the majority of tool-use turns',
                    'Exactly 100% — agents never edit',
                    'It was not measurable from the trajectories',
                  ],
                  answer: 1,
                  explanation:
                    'Reading and searching together account for 9.96 of 17.72 tool-use turns (56.2%) and 46.5% of the main agent\'s total tokens — so roughly half the budget is spent navigating before any fix.',
                },
                {
                  prompt:
                    'The paper argues the problem is structural, not just expensive. What is the structural root cause?',
                  options: [
                    'The agents use too few tools to explore efficiently',
                    'The same model both explores and solves, so every exploratory read and search stays in the solver\'s context history',
                    'Repositories are simply too large to fit in any context window',
                    'The tools return too few results per call',
                  ],
                  answer: 1,
                  explanation:
                    '"In most agents, the same model explores the repository and solves the task, leaving exploratory reads and searches in the solver\'s history" — the noise is baked into the solver\'s context because exploration and solving share one trajectory.',
                },
                {
                  prompt: 'Why is accumulating extra repository snippets in context a problem rather than a helpful safety margin?',
                  options: [
                    'It is never a problem — more context strictly improves accuracy',
                    'Irrelevant snippets are noise: the agent may reason from them and spend later turns repairing a mistaken hypothesis instead of fixing the true cause',
                    'It only slows inference but never changes the answer',
                    'Context windows are infinite, so it has no effect',
                  ],
                  answer: 1,
                  explanation:
                    'Per Section 1, when exploration misses key files or accumulates irrelevant snippets, "the main agent must reason from noisy context and may spend later turns repairing a mistaken hypothesis rather than addressing the true cause."',
                },
              ],
            },
          ],
        },
        {
          id: 'fc-architecture',
          title: 'The delegation contract',
          minutes: 12,
          xp: 55,
          steps: [
            { kind: 'read', title: 'Evidence in, not patches out', markdown: architectureMd },
            {
              kind: 'quiz',
              title: 'Check: the subagent contract',
              questions: [
                {
                  prompt: 'Which three tools does FastContext expose, and what can it NOT do?',
                  options: [
                    'READ, EDIT, TEST — it can patch files but not run shell commands',
                    'READ, GLOB, GREP — all read-only; it cannot edit files or submit patches',
                    'SEARCH, PLAN, EXECUTE — it can run arbitrary code',
                    'GLOB, GREP, COMMIT — it can search and commit fixes',
                  ],
                  answer: 1,
                  explanation:
                    'FastContext exposes exactly three read-only, language-agnostic tools — READ (line-numbered contents), GLOB (path discovery), GREP (regex search). It returns evidence, never a patch.',
                },
                {
                  prompt:
                    'What part of FastContext\'s work actually reaches the main agent\'s context, and why does that matter?',
                  options: [
                    'The full exploration trajectory, so the main agent can audit every step',
                    'Only the final <final_answer> block of file-line citations; intermediate observations are logged separately, keeping the solver\'s context clean',
                    'Nothing — the main agent re-explores from scratch',
                    'A summary of the repository\'s entire directory tree',
                  ],
                  answer: 1,
                  explanation:
                    'The interface is deliberately asymmetric: "only the final evidence block is returned to the main-agent trajectory" while the explorer\'s internal observations and reasoning go to separate logs (Appendix B). That is exactly how it avoids polluting the solver.',
                },
                {
                  prompt: 'When does the main-agent prompt say to SKIP invoking FastContext?',
                  options: [
                    'When the repository is large and multilingual',
                    'When the issue already names the relevant file or symbol, so broad exploration is unnecessary',
                    'Never — it should always be invoked first',
                    'Only when the explorer model is unavailable',
                  ],
                  answer: 1,
                  explanation:
                    'Appendix B describes skipping the helper when the issue already names the relevant file or symbol — delegation pays off for cold-start, broad cross-file localization, or a failed direct search, not when the target is already known.',
                },
              ],
            },
          ],
        },
        {
          id: 'fc-sft',
          title: 'Stage 1 — Supervised fine-tuning',
          minutes: 11,
          xp: 55,
          steps: [
            { kind: 'read', title: 'Teach the behaviors by imitation', markdown: sftMd },
            {
              kind: 'quiz',
              title: 'Check: the SFT recipe',
              questions: [
                {
                  prompt:
                    'The SFT corpus is split into three sources (parallel_toolcalls, multiturn_traj, linerange). What is the design idea behind this split?',
                  options: [
                    'To balance the dataset across programming languages',
                    'Each source targets one of the three runtime behaviors the subagent must perform: broad first-turn search, multi-turn evidence gathering, and precise citation generation',
                    'To separate easy examples from hard ones for curriculum learning',
                    'To keep training data from three different reference models distinct',
                  ],
                  answer: 1,
                  explanation:
                    'Rather than training only on final locations, supervision is decomposed to match runtime behaviors: parallel_toolcalls → broad first-turn search, multiturn_traj → multi-turn evidence gathering, linerange → precise citation generation.',
                },
                {
                  prompt:
                    'The SFT loss is "assistant-token-only" — it masks out tool-observation tokens. Why exclude those from the loss?',
                  options: [
                    'Tool observations are too long to fit in the context window',
                    'They are produced by the environment, not the policy; training the model to predict them would waste capacity reproducing content it did not author, instead of learning which tools to call and lines to cite',
                    'They contain proprietary code that cannot be trained on',
                    'Masking them speeds up training but has no effect on quality',
                  ],
                  answer: 1,
                  explanation:
                    'The mask keeps the loss on the assistant\'s own text and structured tool-call arguments — the model\'s actual decisions — and zeros out environment-produced tokens it has no control over.',
                },
              ],
            },
          ],
        },
        {
          id: 'fc-rl',
          title: 'Stage 2 — Reinforcement learning',
          minutes: 14,
          xp: 65,
          steps: [
            { kind: 'read', title: 'Optimize for coverage, not imitation', markdown: rlMd },
            {
              kind: 'code',
              title: 'Implement the FastContext RL reward',
              challenge: {
                prompt: `## Compute the task-grounded reward

The RL stage scores each explorer rollout with a deterministic reward (Section 3.3,
Eq. 2; thresholds from Appendix A.4, Eqs. 3-4):

> R = F1(P_f, G_f) + F1(P_l, G_l) + r_parallel − r_format

Implement four functions:

1. \`f1(predicted, target)\` — **set** F1 over two arrays of citation items.
   precision = |intersection| / |predicted|, recall = |intersection| / |target|,
   F1 = 2·P·R / (P+R). Per the paper, an **empty** predicted OR target set scores **0**
   (and return 0 if precision+recall is 0).

2. \`parallelBonus(pmax)\` — returns **1** when \`3 < pmax <= 6\`, else **0**.

3. \`formatPenalty(nC, bC, pmax)\` — returns **10** when the output is malformed:
   \`nC < 1\` OR \`nC > 20\` OR \`bC > 0\` OR \`pmax > 6\`; otherwise **0**.
   (\`nC\` = citation count, \`bC\` = broken citation lines, \`pmax\` = max parallel calls.)

4. \`reward(fileF1, lineF1, pmax, nC, bC)\` — combine them:
   \`fileF1 + lineF1 + parallelBonus(pmax) − formatPenalty(nC, bC, pmax)\`.`,
                starterCode: `function f1(predicted, target) {
  // set F1; empty predicted OR target => 0

}

function parallelBonus(pmax) {
  // +1 only when 3 < pmax <= 6

}

function formatPenalty(nC, bC, pmax) {
  // 10 if malformed, else 0

}

function reward(fileF1, lineF1, pmax, nC, bC) {
  // fileF1 + lineF1 + parallelBonus - formatPenalty

}`,
                solution: `function f1(predicted, target) {
  if (predicted.length === 0 || target.length === 0) return 0;
  const t = new Set(target);
  let inter = 0;
  for (const p of new Set(predicted)) if (t.has(p)) inter++;
  const precision = inter / new Set(predicted).size;
  const recall = inter / new Set(target).size;
  if (precision + recall === 0) return 0;
  return (2 * precision * recall) / (precision + recall);
}

function parallelBonus(pmax) {
  return pmax > 3 && pmax <= 6 ? 1 : 0;
}

function formatPenalty(nC, bC, pmax) {
  return nC < 1 || nC > 20 || bC > 0 || pmax > 6 ? 10 : 0;
}

function reward(fileF1, lineF1, pmax, nC, bC) {
  return fileF1 + lineF1 + parallelBonus(pmax) - formatPenalty(nC, bC, pmax);
}`,
                tests: `test('f1: partial overlap (2 of 3 match)', () => {
  const v = f1(['a', 'b', 'c'], ['b', 'c', 'd']);
  assertEqual(Math.round(v * 1000) / 1000, 0.667);
});
test('f1: empty predicted scores 0', () => {
  assertEqual(f1([], ['a', 'b']), 0);
});
test('f1: perfect match scores 1', () => {
  assertEqual(f1(['x', 'y'], ['y', 'x']), 1);
});
test('parallelBonus: pmax=5 is in (3,6] => 1', () => {
  assertEqual(parallelBonus(5), 1);
});
test('parallelBonus: pmax=2 too low, pmax=7 too high => 0', () => {
  assertEqual(parallelBonus(2), 0);
  assertEqual(parallelBonus(7), 0);
});
test('formatPenalty: 25 citations is over-long => 10', () => {
  assertEqual(formatPenalty(25, 0, 4), 10);
});
test('formatPenalty: well-formed (10 cites, 0 broken, pmax=4) => 0', () => {
  assertEqual(formatPenalty(10, 0, 4), 0);
});
test('reward: clean well-formed answer = fileF1 + lineF1 + 1', () => {
  // pmax=5 -> bonus 1; nC=10,bC=0,pmax=5 -> penalty 0
  assertEqual(Math.round(reward(0.8, 0.6, 5, 10, 0) * 10) / 10, 2.4);
});
test('reward: excessive fan-out (pmax=8) is penalized and gets no bonus', () => {
  // pmax=8 -> bonus 0, penalty 10
  assertEqual(Math.round(reward(0.8, 0.6, 8, 10, 0) * 10) / 10, -8.6);
});`,
              },
            },
          ],
        },
        {
          id: 'fc-results',
          title: 'Results: what delegation buys',
          minutes: 12,
          xp: 60,
          steps: [
            { kind: 'read', title: 'Higher scores, far fewer tokens — and a surprise about model size', markdown: resultsMd },
            {
              kind: 'quiz',
              title: 'Check: reading the results',
              questions: [
                {
                  prompt:
                    'What is the paper\'s most striking finding about explorer model size (Section 4.3)?',
                  options: [
                    'Only the 30B explorer ever improves over direct solving',
                    'The compact 4B-RL explorer can outperform the larger 30B-SFT explorer (e.g. 22.5 vs 20.0 on GLM-5.1 SWE-bench Pro) while using fewer tokens',
                    'Model size made no measurable difference at all',
                    'The 4B model only works after a separate 30B-RL run',
                  ],
                  answer: 1,
                  explanation:
                    'Task-grounded RL lets a 4B explorer match or beat the 30B-SFT reference without an expensive 30B-RL run — and 4B-RL improves or ties 4B-SFT in all nine end-to-end settings. That is the paper\'s central design payoff.',
                },
                {
                  prompt:
                    'Table 1 reports token reductions on the main-agent trajectory. The subagent also burns tokens — does that erase the savings (Appendix B / Table 3)?',
                  options: [
                    'Yes — the explorer\'s tokens roughly cancel the main-agent savings',
                    'No — even priced through a conservative serverless tier, the explorer is only ~2.1% of the augmented total, leaving a large net saving ($69.03 on the audited run)',
                    'The paper does not measure the subagent\'s cost at all',
                    'The subagent is free because it uses no tokens',
                  ],
                  answer: 1,
                  explanation:
                    'The audit shows the 4B-RL explorer cost an estimated $4.52 against a main-agent cost drop from $282.47 to $208.92 — a net $69.03 saved, with the explorer just 2.1% of the augmented total. And in the intended local deployment that per-token API cost isn\'t even incurred.',
                },
                {
                  prompt: 'On which benchmark did FastContext show the LARGEST main-agent token reduction, and for which agent?',
                  options: [
                    'SWE-bench Pro, for Kimi-K2.6 (~9%)',
                    'SWE-QA, for GPT-5.4 (~60.3%)',
                    'SWE-bench Multilingual, for GLM-5.1 (~12%)',
                    'The reductions were identical across all benchmarks',
                  ],
                  answer: 1,
                  explanation:
                    'The largest savings occur on SWE-QA, reaching 60.3% for GPT-5.4; even trained 4B explorers still cut about 50% on that benchmark. Savings depend on how verbose the direct trajectory was.',
                },
              ],
            },
          ],
        },
        {
          id: 'fc-critique',
          title: 'Adopting FastContext: limits and trade-offs',
          minutes: 12,
          xp: 60,
          steps: [
            {
              kind: 'scenario',
              title: 'Should you delegate exploration — and how?',
              scenario: {
                intro:
                  'You run a coding-agent platform and are deciding whether and how to adopt a FastContext-style explorer. Use what the paper actually demonstrated — and what it explicitly did not — to make each call.',
                stages: [
                  {
                    situation:
                      'Your agent is built on a custom framework with its own tool interface and memory policy — not Mini-SWE-Agent. A teammate wants to drop in FastContext and assume the paper\'s +5.5% / −60% numbers will transfer directly.',
                    question: 'How should you frame the expected outcome?',
                    options: [
                      {
                        label:
                          'The delegation contract (explore in a subagent, return compact file-line citations) is general, but the paper only validated it inside Mini-SWE-Agent — integration must be adapted and re-measured on your framework before claiming those gains',
                        quality: 'best',
                        feedback:
                          'Correct. The Limitations section states end-to-end evaluation integrates FastContext only with Mini-SWE-Agent and that adapting to frameworks with different tool interfaces, memory policies, and orchestration is future work. The idea transfers; the exact numbers must be re-earned.',
                      },
                      {
                        label: 'The numbers are model-level results, so they will transfer unchanged to any framework',
                        quality: 'bad',
                        feedback:
                          'The gains are measured end-to-end inside one specific scaffold. The paper is explicit that broader frameworks are untested — assuming transfer is exactly the over-claim the Limitations section warns against.',
                      },
                      {
                        label: 'FastContext cannot possibly work outside Mini-SWE-Agent, so abandon the idea',
                        quality: 'ok',
                        feedback:
                          'Too pessimistic. The explorer interface is deliberately framework-agnostic (a CLI helper returning citations); it plausibly adapts. The honest position is "promising but unproven on our stack," not "impossible."',
                      },
                    ],
                  },
                  {
                    situation:
                      'For cost reasons you want exploration to be cheap. One option is to keep using your frontier main model to also do the exploring ("same-model exploration"); another is to deploy a trained 4B-RL explorer.',
                    question: 'Which is the better trade-off, per the paper\'s ablations?',
                    options: [
                      {
                        label:
                          'The trained 4B-RL explorer — it often dominates same-model exploration on both score and tokens (e.g. GPT-5.4 SWE-bench Multilingual: 74.7 at 338k tokens vs same-model 73.3 at 379k)',
                        quality: 'best',
                        feedback:
                          'Right. Section 4.3 shows trained FastContext models often beat same-model exploration in both score and tokens — a small specialized explorer is both cheaper and better than spending frontier tokens on browsing.',
                      },
                      {
                        label: 'Same-model exploration, because one model is simpler to operate and always at least as accurate',
                        quality: 'bad',
                        feedback:
                          'The ablation contradicts this: same-model exploration is "not usually the best trade-off," and a trained 4B-RL explorer reaches higher scores at fewer tokens in the reported settings.',
                      },
                      {
                        label: 'Only the 30B-SFT explorer is worth deploying; 4B is too small to help',
                        quality: 'ok',
                        feedback:
                          'The 30B-SFT is a scaling reference, but the paper\'s whole point is that 4B-RL is the deployment target — it matches or beats 30B-SFT in several settings while being far cheaper to serve.',
                      },
                    ],
                  },
                  {
                    situation:
                      'Your eval shows strong gains on SWE-bench Pro. Leadership wants to cite these as a deployment guarantee for your production agent on private customer repos.',
                    question: 'What caveat must you raise?',
                    options: [
                      {
                        label:
                          'Public agent benchmarks may overlap with data seen during frontier-model pretraining or product tuning, so results are controlled benchmark evidence — not a deployment guarantee on unseen private repos',
                        quality: 'best',
                        feedback:
                          'Correct. The Limitations section says some benchmark tasks may overlap with frontier-model pretraining and that results "should be interpreted as controlled benchmark evidence rather than deployment guarantees."',
                      },
                      {
                        label: 'No caveat needed — benchmark scores always predict production performance one-to-one',
                        quality: 'bad',
                        feedback:
                          'This ignores the paper\'s own warning about possible train/eval contamination and the gap between controlled benchmarks and production deployment.',
                      },
                      {
                        label: 'The only caveat is that the explorer was capped at 4B parameters',
                        quality: 'ok',
                        feedback:
                          'The 4B floor is a stated limitation, but it is not the relevant caveat here. The contamination / benchmark-vs-deployment gap is what undercuts a "guarantee" claim on private repos.',
                      },
                    ],
                  },
                ],
                debrief:
                  'FastContext\'s contribution is a modular, trainable view of coding agents: treat repository exploration as a first-class component you can optimize and evaluate on its own. The wins are real and were measured carefully — but they are conditional on the Mini-SWE-Agent integration, on having trained the explorer, and on benchmarks that may not mirror your production repos. Adopt the architecture; re-measure the numbers.',
              },
            },
          ],
        },
      ],
    },
  ],
}
