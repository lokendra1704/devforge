import type { Subject } from '../types'
import motivationMd from './md/cvm-motivation.md?raw'
import pagesMd from './md/cvm-pages.md?raw'
import faultsPolicyMd from './md/cvm-faults-policy.md?raw'
import resultsMd from './md/cvm-results.md?raw'
import tradeoffsMd from './md/cvm-tradeoffs.md?raw'

export const clawvm: Subject = {
  id: 'clawvm',
  title: 'ClawVM',
  tagline:
    'EuroMLSys ’26 — the agent harness as an OS-style virtual memory manager: typed pages, multi-resolution fidelity, and validated writeback at every lifecycle boundary.',
  icon: '🗂️',
  accent: '#818cf8',
  modules: [
    {
      id: 'cvm-m1',
      title: 'ClawVM: Virtual Memory for Stateful Agents',
      description:
        'EuroMLSys ’26 (Rafique & Bindschaedler): the agent harness as an OS kernel for context-window memory — typed pages, multi-resolution fidelity, a fault model, and a validated writeback protocol.',
      lessons: [
        {
          id: 'cvm-motivation',
          title: 'Why the harness needs a memory manager',
          minutes: 12,
          xp: 60,
          steps: [
            { kind: 'read', title: 'The page-replacement framing', markdown: motivationMd },
            {
              kind: 'quiz',
              title: 'The page-replacement framing',
              questions: [
                {
                  prompt:
                    "In ClawVM's OS analogy, what plays the role of “physical memory” and what plays “disk”?",
                  options: [
                    'The context window is physical memory; durable stores (files, transcripts, external memory) are disk',
                    'The LLM weights are physical memory; the context window is disk',
                    'Durable stores are physical memory; the context window is disk',
                    "There's no analogy — ClawVM treats both tiers as equally fast and equally scarce",
                  ],
                  answer: 0,
                  explanation:
                    "Section 2 states it directly: the context window is small, fast, and scarce, while durable stores are large and slow — exactly RAM vs. disk. That's why every prompt-assembly decision (what to include, at what fidelity, what to drop) is a page-replacement decision.",
                },
                {
                  prompt:
                    'In the "40 turns into a morning routine" scenario, compaction causes the agent to re-query a calendar it already inspected. Which root cause from Section 2 does this best illustrate?',
                  options: [
                    "Compaction is destructive — the summary dropped the evidence that the calendar had already been checked",
                    'Recall is observable — the harness logged a clear reason code for the miss',
                    'Writeback was validated and non-destructive',
                    'The token budget was too small to fit any pages at all (physical insufficiency)',
                  ],
                  answer: 0,
                  explanation:
                    'The compaction summary kept the high-level goal but discarded the evidence that conflicts were already resolved. That loss — not a missing reason code or a budget problem — is what forces the duplicate calendar query. Section 2 names this root cause "compaction is destructive."',
                },
                {
                  prompt:
                    'Which of the six requirements from Section 2 specifically targets the "empty recall without reason codes" observability failure?',
                  options: [
                    'Recall is observable — the runtime must distinguish "no match," "denied," and "backend error" via reason codes',
                    'Eviction is cost-aware — eviction must account for the cost of re-running tool calls',
                    'Durability is lifecycle-complete — commit dirty state at every destructive boundary',
                    'Invariants survive destruction — restore instructions and constraints after compaction and reset',
                  ],
                  answer: 0,
                  explanation:
                    'The observability failure class ("empty recall without reason codes") maps directly onto the "Recall is observable" requirement: the runtime must distinguish a true miss from a denial or a backend error.',
                },
              ],
            },
          ],
        },
        {
          id: 'cvm-pages',
          title: 'Typed pages and multi-resolution fidelity',
          minutes: 12,
          xp: 60,
          steps: [
            { kind: 'read', title: 'Pages, fidelity, and where ClawVM sits', markdown: pagesMd },
            {
              kind: 'quiz',
              title: 'Pages and fidelity levels',
              questions: [
                {
                  prompt:
                    'Which page type is described as "hard-pinned at structured" — its minimum-fidelity floor is structured, enforced regardless of budget pressure, and it never degrades to a pointer?',
                  options: [
                    'Constraint',
                    'Bootstrap/Policy',
                    'Evidence',
                    'Conversation Segment',
                  ],
                  answer: 0,
                  explanation:
                    'Table 1 lists Constraint with minimum fidelity "Hard-pinned at struct." and degradation path F→St only — it can shrink from full to structured but never further. Bootstrap/Policy also stops at structured, but its invariant is phrased as "Struct. after compact, reset," not "hard-pinned."',
                },
                {
                  prompt:
                    'Why does ClawVM precompute compressed/structured/pointer representations at page-ingestion time rather than computing them on demand once the budget gets tight?',
                  options: [
                    'So budget-pressure decisions become table lookups and token arithmetic — no runtime LLM calls or compression passes mid-turn',
                    'Because the LLM is incapable of running any compression',
                    'Because pointers are cheaper to store, so storage cost is the only concern',
                    'Because the harness only supports one representation per page at a time',
                  ],
                  answer: 0,
                  explanation:
                    'Section 3: representations are generated when a page is first ingested or updated, so "budget-pressure decisions involve only table lookups and token arithmetic, not runtime LLM calls or compression passes." This is what lets the selection policy run in microseconds.',
                },
                {
                  prompt:
                    "A Preference page (degradation path full→compressed→structured→pointer) is currently resident at \"compressed,\" and the budget tightens further. What happens next, and what must still hold?",
                  options: [
                    "It degrades to \"structured\" — typed fields sufficient to satisfy its invariants, preserving enough to reconstruct the full page later",
                    "It's evicted entirely, since Preference pages have no minimum-fidelity floor",
                    'It jumps straight to "pointer," skipping "structured"',
                    'It stays at "compressed" — Preference pages are exempt from further degradation',
                  ],
                  answer: 0,
                  explanation:
                    "The four-level chain (full → compressed → structured → pointer) only moves one step at a time under pressure, and Preference's invariant (\"Scope, prov.\") is satisfied at structured — structured and pointer representations exist precisely so a page can still be reconstructed on demand.",
                },
              ],
            },
          ],
        },
        {
          id: 'cvm-faults-policy',
          title: 'Fault model, selection policy, and writeback',
          minutes: 15,
          xp: 75,
          steps: [
            { kind: 'read', title: 'Faults, the thrash index, and validated writeback', markdown: faultsPolicyMd },
            {
              kind: 'quiz',
              title: 'Faults and the selection policy',
              questions: [
                {
                  prompt:
                    "A tool call's canonicalized signature looks new (so the harness re-issues it), even though an equivalent result is still resident. Section 3 says this repeat is NOT counted as a policy-controllable fault. What is it called, and why does the distinction matter?",
                  options: [
                    'A duplicate-signature alert — a workload signal from inherent tool-signature reuse, not a policy failure, though it still counts toward thrash via F',
                    'A refetch fault — any repeated tool call is, by definition, a refetch',
                    'A pinned-invariant-miss — the signature mismatch violates a pin',
                    "Nothing — Section 3 doesn't define this case at all",
                  ],
                  answer: 0,
                  explanation:
                    'Section 3 explicitly separates duplicate-signature alerts from the policy-controllable fault types: they reflect inherent workload repetition, not a policy bug — but they still feed into F in thrash = F/(H+1), which is why ClawVM’s thrash is nonzero (0.901) even at zero faults.',
                },
                {
                  prompt:
                    "A page's minimum-fidelity set doesn't fit the token budget even after Phase 1 installs all hard-pinned pages. What does ClawVM's selection policy do?",
                  options: [
                    'Phase 1 surfaces invariant pressure as a diagnosable failure — this is physical insufficiency, outside policy control, and evaluated separately from policy-controllable faults',
                    'Phase 2 silently drops the page to a pointer so the prompt still fits',
                    'The harness automatically requests a larger context window from the model provider',
                    'ClawVM logs a flush-miss fault and proceeds to Phase 2 as normal',
                  ],
                  answer: 0,
                  explanation:
                    'Section 3 draws a hard line: if the minimum-required set itself doesn’t fit, that’s physical insufficiency — a diagnosable, surfaced failure, but not one of the policy-controllable faults (refetch, duplicate-tool, bootstrap, flush-miss, silent-recall) that a correct policy can prevent.',
                },
              ],
            },
            {
              kind: 'code',
              title: 'Compute the thrash index',
              challenge: {
                prompt:
                  "Appendix A defines the **thrash index** that quantifies paging instability:\n\n> thrash = F / (H + 1)\n\nwhere `F` is the number of paging events (explicit faults plus duplicate-signature alerts) and `H` is the number of cache/page hits over the run. The `+1` avoids dividing by zero when there are no hits yet.\n\nImplement `thrashIndex(faults, hits)`.",
                starterCode:
                  'function thrashIndex(faults, hits) {\n  // TODO: thrash = faults / (hits + 1)\n  return faults / hits\n}',
                solution:
                  'function thrashIndex(faults, hits) {\n  return faults / (hits + 1)\n}',
                tests:
                  "test('zero faults and zero hits gives zero thrash', () => {\n  assertEqual(thrashIndex(0, 0), 0)\n})\n\ntest('avoids divide-by-zero when there are no hits yet', () => {\n  assertEqual(thrashIndex(5, 0), 5)\n})\n\ntest('matches the +1 smoothing for a mixed run', () => {\n  assertEqual(thrashIndex(10, 99), 0.1)\n})\n\ntest('a ClawVM-style run (0 faults) has lower thrash than a Retrieval-style run at the same hit count', () => {\n  const clawvm = thrashIndex(0, 99)\n  const retrieval = thrashIndex(68, 99)\n  assertEqual(clawvm < retrieval, true)\n})",
              },
            },
          ],
        },
        {
          id: 'cvm-results',
          title: 'What ClawVM buys you, and what it costs',
          minutes: 12,
          xp: 60,
          steps: [
            { kind: 'read', title: 'Results: faults, ablations, generalization, cost', markdown: resultsMd },
            {
              kind: 'quiz',
              title: 'Reading the evaluation',
              questions: [
                {
                  prompt:
                    'In the subtractive ablation (Table 6, budget 180), removing pointer resolution causes 126 faults — by far the largest jump — while removing the Phase 2 upgrade-scoring heuristic causes zero extra faults. What does this tell you about where the safety guarantee comes from?',
                  options: [
                    "Fault elimination comes from Phase 1's structural constraints (pinning, writeback, pointer resolution), not from how Phase 2 ranks upgrades — the upgrade heuristic only affects quality above the fault-free floor",
                    'Pointer resolution is the only feature that matters; the other features are redundant and can be removed',
                    'The Phase 2 heuristic is broken and should be removed from ClawVM entirely',
                    '126 faults means pointer resolution causes faults rather than preventing them',
                  ],
                  answer: 0,
                  explanation:
                    "RQ2's takeaway is exactly this: fault elimination is robust to the choice of upgrade heuristic (an LRU variant matches ClawVM's fault counts), because Phase 1's structural constraints already guarantee the floor. Utility scoring is a quality lever above that floor, not a safety mechanism.",
                },
                {
                  prompt:
                    "At budget 300, Comp-Hybrid's 7 bootstrap-fault failures (seen at budget 180) vanish — \"not because the policy improves.\" Why do they vanish, and what does that imply for production deployments?",
                  options: [
                    "The larger budget avoids triggering compaction at all, so the structural gap (no hard auto-pinning) never gets exercised — but it's still there, and a long enough session at any budget will eventually trigger compaction",
                    'Comp-Hybrid automatically enables auto-pinning once the budget exceeds 256 tokens',
                    "ClawVM's offline oracle retunes Comp-Hybrid's configuration at higher budgets",
                    'Bootstrap pages become unnecessary once the token budget is large enough',
                  ],
                  answer: 0,
                  explanation:
                    "The paper is explicit: \"Comp-Hybrid's success depends on having enough headroom to sidestep its structural gaps, and tighter budgets expose them.\" A bigger budget hides the gap by delaying compaction — it doesn't close it.",
                },
                {
                  prompt:
                    "ClawVM's policy engine adds a median of 18–44 µs per turn. Why does the paper treat this as negligible, and what would make it stop being negligible?",
                  options: [
                    "It's negligible relative to model and tool-call latency, which run in milliseconds to seconds — it would only matter in a setting with sub-millisecond per-turn latency budgets, which agent harnesses don't have",
                    "It's negligible because ClawVM only runs its policy engine once per session, not once per turn",
                    'The 83 KB memory overhead cancels out the time overhead, so the net cost is zero',
                    "The overhead isn't actually negligible — the paper lists it as an open limitation",
                  ],
                  answer: 0,
                  explanation:
                    "18–44 µs is vanishingly small compared to a single LLM call or tool round-trip (milliseconds to seconds). The paper reports it precisely so readers can compare it to their own per-turn latency budget — for almost any real harness, it's noise.",
                },
              ],
            },
          ],
        },
        {
          id: 'cvm-tradeoffs',
          title: 'Choosing a memory-management design',
          minutes: 15,
          xp: 70,
          steps: [
            {
              kind: 'read',
              title: 'Related work and the limits of the claim',
              markdown: tradeoffsMd,
            },
            {
              kind: 'scenario',
              title: 'Adopting ClawVM: four design calls',
              scenario: {
                intro:
                  "ClawVM is explicit about what it claims and what it doesn't. The read above covered its place relative to MemGPT-style model-driven paging and its three stated limitations. Work through four decisions a team adopting (or evaluating) ClawVM might face.",
                stages: [
                  {
                    situation:
                      "A teammate suggests dropping ClawVM's harness-enforced contract in favor of MemGPT's approach: let the model itself decide what stays resident and when state is written back, since the model can \"read situational nuance that fixed rules might miss.\"",
                    question:
                      'For a long-running agent whose memory decisions must be replayable and auditable, how should you respond?',
                    options: [
                      {
                        label:
                          "Keep ClawVM's Phase 1 structural guarantees (hard-pinning, lifecycle writeback, pointer resolution) — they hold independent of any model. A model-driven heuristic can still operate, but only inside Phase 2's upgrade ordering, which doesn't affect fault elimination",
                        quality: 'best',
                        feedback:
                          'This is exactly the composability Section 6 describes: ClawVM and MemGPT-style paging are not mutually exclusive. The enforcement layer (Phase 1) gives you the auditable floor; a model-driven heuristic can still pick *which* pages get upgraded in Phase 2 without weakening that floor.',
                      },
                      {
                        label:
                          'Switch fully to MemGPT-style model-driven paging — it is the more adaptive, model-aware approach',
                        quality: 'bad',
                        feedback:
                          'Section 6 is explicit: MemGPT-style systems "leave residency and writeback to model discretion" — the opposite of the deterministic, replayable contract that auditability requires. Adaptivity is real, but it isn’t a substitute for an enforced contract.',
                      },
                      {
                        label:
                          "Neither approach matters much — once retrieval quality is good enough, residency and durability problems take care of themselves",
                        quality: 'bad',
                        feedback:
                          "Section 2's own data contradicts this: the retrieval-only baseline still incurs 67.8 mean explicit faults per configuration. Better recall doesn't enforce what must stay resident, when state becomes durable, or how paging is audited — that's the whole gap ClawVM closes.",
                      },
                    ],
                  },
                  {
                    situation:
                      "Your team is deciding whether to invest in a sophisticated utility-scoring function for Phase 2 (recency, recompute cost, pin class, scope) before launch, or ship a simple least-recently-used (LRU) ordering first.",
                    question:
                      "Based on RQ2's ablation results, what's the right call for fault elimination vs. prompt quality?",
                    options: [
                      {
                        label:
                          'Ship LRU first — across budgets 120–300 it achieves identical zero-fault counts to utility scoring, because fault elimination comes from Phase 1’s structural constraints. Add utility scoring later as a quality improvement above the fault-free floor',
                        quality: 'best',
                        feedback:
                          "Matches Section 5.2 directly: the LRU variant, keeping all of ClawVM's structural features, achieves zero explicit faults and identical thrash to utility-based ClawVM. Utility scoring is valuable, but it's an upgrade to *quality*, not a prerequisite for *safety*.",
                      },
                      {
                        label:
                          "Don't launch without utility scoring — without it, the policy-controllable faults will come back",
                        quality: 'bad',
                        feedback:
                          "Table 6's additive/subtractive ablations show the opposite: removing upgrade scoring causes zero additional faults. Faults are prevented by Phase 1 (pinning, writeback, pointer resolution), which LRU keeps intact.",
                      },
                      {
                        label:
                          "Skip Phase 2 entirely — only ever install Phase 1's minimum-fidelity set, and leave the rest of the budget unused",
                        quality: 'ok',
                        feedback:
                          "This is fault-safe (Phase 1 alone guarantees zero policy-controllable faults), but it wastes budget headroom: pages that could be upgraded to richer representations for better answers stay at minimum fidelity for no fault benefit. LRU at least uses the spare budget productively.",
                      },
                    ],
                  },
                  {
                    situation:
                      "During a demo, ClawVM accepts a writeback updating a user's \"meeting priorities\" preference page. The update is well-formed, correctly scoped, and doesn't overwrite any previously committed field — but the new priority value is factually wrong, because the model misread the calendar.",
                    question: 'What does ClawVM do here, and what should the team do about it?',
                    options: [
                      {
                        label:
                          "ClawVM commits the update — schema, provenance, scope, and non-destructiveness all passed, and semantic truth is explicitly out of scope. To catch this class of error, layer a domain-specific validation predicate onto the writeback journal",
                        quality: 'best',
                        feedback:
                          'This is Limitation 1 from Section 7, stated plainly: "ClawVM validates schema, provenance, scope, and non-destructiveness, but does not verify the semantic truth of model-generated updates... Semantic verification could be layered on via domain-specific validation predicates on the writeback journal."',
                      },
                      {
                        label:
                          'ClawVM rejects the update with `DESTRUCTIVE_OP`, since the new value is wrong',
                        quality: 'bad',
                        feedback:
                          '`DESTRUCTIVE_OP` is about non-destructiveness — a set-with-version update whose staged version doesn’t match the last committed version. This update doesn’t violate that rule, so it isn’t rejected on those grounds. Factual correctness is a separate axis entirely.',
                      },
                      {
                        label:
                          "This can't happen — ClawVM's fault model already covers semantically wrong updates",
                        quality: 'bad',
                        feedback:
                          'Section 3 explicitly separates "semantic errors (model produces factually wrong updates)" from the policy-controllable fault types — they are "outside policy control and evaluated separately." ClawVM’s fault model does not cover this case.',
                      },
                    ],
                  },
                  {
                    situation:
                      'Live hook validation (20 single-session tasks against a production agent) shows ClawVM and Comp-Hybrid tie: 20/20 success for both, zero faults, 16.6s vs. 16.9s mean time. A stakeholder asks whether ClawVM’s added complexity is worth it, since the simpler baseline performed identically here.',
                    question: 'How should you interpret this tie, given the rest of the evaluation?',
                    options: [
                      {
                        label:
                          "The tie is expected, not evidence against ClawVM: single-session tasks never trigger the lifecycle boundaries (compaction, reset) where Comp-Hybrid's structural gaps actually manifest. In long-running, multi-session agents — where compaction and reset are routine — those same gaps produce the 76.7% vs. 100% task-success gap seen at budget 180",
                        quality: 'best',
                        feedback:
                          'The paper makes this connection itself: "The two policies tie because single-session tasks do not trigger the lifecycle boundaries... where Comp-Hybrid’s structural gaps manifest" (Section 5.3). The task-level replay (Table 8) is where those gaps show up — 76.7% vs. 100% success at budget 180.',
                      },
                      {
                        label:
                          "The tie shows ClawVM's enforcement layer is unnecessary overhead for production use",
                        quality: 'bad',
                        feedback:
                          'This ignores both the median 18–44 µs overhead (negligible) and *why* the tie happens — single-session tasks are precisely the workload that can’t differentiate the two policies. It isn’t evidence the contract is unneeded; it’s evidence this particular test can’t see the difference.',
                      },
                      {
                        label:
                          'The tie is inconclusive — run more single-session tests to be sure',
                        quality: 'ok',
                        feedback:
                          "More single-session tests won't resolve this — the paper already explains *why* single-session tasks tie (no lifecycle boundaries are exercised). The more informative next step, which the paper flags as future work, is multi-session deployment where compaction and reset are routine.",
                      },
                    ],
                  },
                ],
                debrief:
                  "ClawVM's case rests on a narrow, falsifiable claim: given an enforcement contract over typed pages, multi-resolution fidelity, and validated writeback, policy-controllable faults go to zero at negligible cost — and an LRU baseline with the same structural features gets there too, so the guarantee comes from the contract, not from clever scoring. The claim stops at that contract's edges: it says nothing about whether a committed update is *true*, and its strongest evidence (zero faults across budgets, traces, and adversarial stress) is replay-based, with live validation covering only single sessions so far.",
              },
            },
          ],
        },
      ],
    },
  ],
}
