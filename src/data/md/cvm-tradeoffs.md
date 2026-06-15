# Related work, limitations, and where ClawVM fits

## The contribution is enforcement

> "ClawVM's contribution is enforcement: critical state survives lifecycle
> transitions, dirty state is committed before destruction, and paging decisions
> are observable." — Section 6

## Harness-enforced vs. model-driven paging

**MemGPT** is ClawVM's closest predecessor — it also frames context management as
OS-style virtual memory, but with *model-driven* paging: the model itself decides
what to page in or out. **Memory-as-Action** takes a similar model-driven
approach. These systems improve adaptivity, but:

> "...leave residency and writeback to model discretion; ClawVM moves both to the
> harness with replayable enforcement." — Section 6

The two are framed as **composable**, not competing: a MemGPT-style model could
supply the *paging heuristic* (Phase 2's upgrade ordering) while ClawVM's Phase 1
structural guarantees (hard-pinning, lifecycle writeback, pointer resolution)
still hold underneath it.

Other systems — AIOS (multi-agent kernel), MemOS (unified memory representation),
SagaLLM (Saga-style transactions), Text2Mem (typed memory operations), Memory OS
(hierarchical storage) — "share overlapping abstractions but target different
problems"; ClawVM is framed as a runtime layer that can wrap any of them.

## Three limitations that bound the claims

**Semantic correctness is out of scope.** ClawVM validates schema, provenance,
scope, and non-destructiveness — not whether a model-generated update is
*factually true*. A well-formed, properly-scoped, wrong update passes writeback.

**Replay assumes simulatable tools.** The replay engine models tool calls by
canonical signature, not by executing real tools — non-deterministic services
would need real output recording.

**External validity is replay-heavy.** 12 converted real-session traces, 30
synthetic tasks, and 20 *live single-session* tasks all show zero faults — but
live validation only covers single sessions. Cross-session lifecycle edges
(compaction, reset) remain **replay-validated only**; multi-session online
deployment is future work.

> "The live experiment confirms hook correctness but exercises only
> single-session execution... The two policies tie because single-session tasks
> do not trigger the lifecycle boundaries... where Comp-Hybrid's structural gaps
> manifest." — Section 5.3 / Section 7
