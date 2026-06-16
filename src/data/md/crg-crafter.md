# Crafter: A Multi-Agent Harness for Scientific Figure Generation

Crafter instantiates the harness pattern for scientific figure generation. Given a context (papers, reference images, sketches) and an instruction, it produces a publication-quality raster figure through five cooperating agents:

- **Intent Reasoner**: Analyzes the input and infers the figure's communicative role and required visual elements
- **Plan Generator (Designer D)**: Proposes candidate visual plans from the specification
- **Image-Generation Backend (Executor E)**: Renders each plan into a raster image
- **Multi-Dimensional Critic (Verifier V)**: Evaluates every candidate against the specification and original input
- **Specification Refiner (Reviser R)**: Writes typed edits into the shared specification
- **Convergence Judge**: Governs the loop, deciding whether to accept, continue refining, or revert

Three mechanisms address the three failure modes identified in figure generation:

## 1. Diversity-Driven Plan Exploration

Modern image generators exhibit high inter-sample variance on complex, structured figures—qualitatively different layouts emerge across random seeds for the same prompt. A single-draw pipeline cannot recover from a structurally unsuitable sample.

Crafter treats this as a search problem: the Plan Generator proposes *K* intent-conditioned candidate plans, each specifying a distinct visual framing (e.g., banner layout vs. multi-column grid). The image backend renders all *K* plans in parallel. The Convergence Judge selects the best candidate as the starting point for subsequent refinement.

This plan-level branching can escape a fundamentally unsuitable compositional choice before any rendering budget is spent on refining it. *K* is set adaptively based on input constraints.

## 2. Structured Corrective Layer

Iterative repair via free-text revision instructions degrades rapidly. Successive natural-language corrections introduce conflicting directives (e.g., "enlarge the title" followed by "reduce white space"); the generator absorbs the contradictions silently, and faithfulness deteriorates.

The Structured Corrective Layer replaces free-text accumulation with **typed edits** on the specification. At each round, the Reviser converts the diagnostic into structured operations: adding a layout constraint, banning an artifact category, resizing a named element. The next round's prompt is assembled from this coherent record rather than a growing stack of amendments, keeping the specification internally consistent.

## 3. Verify-Then-Refine with a Directive Critic

First-generation outputs typically contain localized errors: missing components, duplicated regions, misaligned text. Two sub-mechanisms address this:

**Directive Critic**: Rather than a scalar score, the Critic emits a directive diagnostic containing per-dimension scores along six quality axes, identified defects, suggested corrections, and a revised figure description. The Reviser converts this into edits on the specification.

**Refinement Loop with Early Exit**: An early-exit gate bypasses iteration when the first-round output already satisfies acceptance thresholds on critical dimensions. Otherwise, the loop runs for up to *T*=3 rounds. A best-so-far checkpoint reverts to the best artifact whenever the current round regresses, since language-model-driven iterative editing is empirically non-monotonic.

## Why This Generalizes

Because all task-specific behavior resides in agent prompts (the Designer's planning instructions, the Critic's evaluation criteria, the Reviser's correction rules), the same harness architecture generalizes across figure types and input conditions without structural change. Switching from text-to-image to sketch-conditioned generation only requires different prompts, not a different pipeline.
