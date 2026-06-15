# Fault model, selection policy, and validated writeback

## Faults are silent

> "Unlike OS page faults, which the kernel resolves transparently from disk,
> agent faults are silent: without instrumentation the harness cannot detect
> missing state, and recovery means regeneration." — Section 3

ClawVM defines two families of **observable** faults — operationalizing the
residency, durability, and observability failures from Lesson 1.

| Family | Fault | What it means |
|---|---|---|
| Working-set (residency) | refetch | an evicted tool result is re-retrieved |
| | duplicate-tool | an equivalent tool call reruns because the result was evicted |
| | pinned-invariant-miss | a hard-pinned page is missing at prompt assembly |
| | post-compaction bootstrap | a required Bootstrap/Policy page is missing after compaction |
| Durability | silent-recall | lookup returns empty when the backend actually denied/errored |
| | flush-miss | dirty pages lost because the runtime destroyed context before commit |

These are **policy-controllable** — a correct policy can prevent them. Physical
insufficiency (budget too small for all pinned pages) and semantic errors (a
factually wrong update) are out of policy's control and evaluated separately.
Repeated tool calls that reuse a *resident* result are logged separately as
**duplicate-signature alerts** — workload signals, not policy failures.

## Quantifying instability: the thrash index

> "thrash = F / (H + 1), where F counts paging events (explicit faults plus
> duplicate-signature alerts) and H counts hits over the entire run; +1 prevents
> division by zero." — Appendix A

A high thrash index signals a working-set/budget mismatch — even a policy with
zero *faults* can have nonzero thrash from inherent tool-signature repetition.

## Phase 1 then Phase 2: a deterministic knapsack

Prompt assembly is "a multi-choice knapsack with hard constraints" (Section 3),
solved in two phases:

```mermaid
flowchart TB
  S["New turn: candidates + budget"] --> P1{"Phase 1: install all<br/>hard-pinned pages at<br/>minimum fidelity"}
  P1 -->|fits| P2["Phase 2: sort upgrades<br/>by delta-Utility / delta-Tokens"]
  P1 -->|doesn't fit| INV["surface invariant pressure<br/>(diagnosable failure)"]
  P2 --> U{"next upgrade fits +<br/>respects invariants?"}
  U -->|yes| APPLY["apply upgrade,<br/>shrink remaining budget"]
  U -->|no| DONE["prompt assembled"]
  APPLY --> U
```

Phase 1 alone guarantees the structural floor: as long as the minimum-fidelity
set fits the budget, every requirement from Lesson 1 holds *regardless* of how
Phase 2 ranks its upgrades.

## Validated writeback: stage, validate, commit

```mermaid
sequenceDiagram
  participant Hk as Lifecycle hook
  participant J as Writeback Journal
  participant St as Scoped store
  Hk->>J: stage update (field, op, value, scope, evidence_ref)
  Note over J: validate: schema, provenance,<br/>scope, non-destructive, policy
  alt all five checks pass
    J->>St: scoped commit (deterministic merge)
    St-->>J: committed
  else any check fails
    J->>J: reject, log reason code (e.g. DESTRUCTIVE_OP)
  end
```

A **set-with-version** update is only valid if the staged version matches the
journal's last committed version for that key — otherwise it's rejected as
`DESTRUCTIVE_OP`. This is what makes writeback non-destructive: the journal keeps
rejected updates with their reason codes rather than silently overwriting.
