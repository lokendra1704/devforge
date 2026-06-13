# Subject schema & curriculum contract

The data contract a new subject must satisfy. Source of truth: `src/types.ts` and
`src/data/curriculum.test.ts`. Read those if anything here looks stale.

## File layout (one subject = these files)

- `src/data/<subject-id>.ts` — exports a `Subject` object (the lessons live here as data).
- `src/data/md/<prefix>-*.md` — prose for `read` steps, imported with `?raw`:
  `import introMd from './md/<prefix>-intro.md?raw'`.
- `src/data/index.ts` — register the subject: add an import and append it to the
  `SUBJECTS: Subject[]` array. **If it isn't in `SUBJECTS`, it does not exist to the app.**

Follow `src/data/gpu.ts` as the structural template and `src/data/md/gpu-why.md` for
markdown voice (vivid, concrete, tables welcome, ~30–45 lines per read step).

## Types (from `src/types.ts`)

```
Subject  { id, title, tagline, icon (emoji), accent (hex), modules: Module[] }
Module   { id, title, description, lessons: Lesson[] }
Lesson   { id (globally unique), title, minutes, xp, steps: Step[] }
Step     = read | quiz | code | scenario | visualizer
```

Step shapes:
- `{ kind: 'read', title, markdown }`
- `{ kind: 'quiz', title, questions: QuizQuestion[] }`
  - `QuizQuestion { prompt, code?, options: string[], answer: number, explanation }`
- `{ kind: 'code', title, challenge: CodeChallenge }`
  - `CodeChallenge { prompt, starterCode, solution, tests }` — JS runs in a Web Worker
    sandbox with `test(name, fn)`, `assertEqual(actual, expected, msg?)`, `sleep(ms)`.
- `{ kind: 'scenario', title, scenario: Scenario }`
  - `Scenario { intro, stages: ScenarioStage[], debrief }`
  - `ScenarioStage { situation, question, options: { label, quality, feedback }[] }`
  - `quality` is `'best' | 'ok' | 'bad'`.
- `{ kind: 'visualizer', title, visualizer: VisualizerId, markdown? }`

## Hard constraint: visualizer is a CLOSED union

`VisualizerId = 'two-pointers' | 'sliding-window' | 'binary-search'`. A new subject
**cannot** add a visualizer without changing app code. Do not use `visualizer` steps
for a new subject — build with `read`, `quiz`, `scenario`, and `code` only.

## Validation rules (enforced by `curriculum.test.ts`)

- Every **code** challenge: the `solution` must pass its own `tests`, the suite must
  have **≥ 3** `test(...)` cases, and `starterCode` must **fail or throw** (there must be
  something to do).
- Every **quiz** question: **≥ 2** options, `answer` is a valid in-range index, and
  `explanation` length **> 20** chars.
- Every **scenario** stage: **≥ 2** options including **≥ 1** with `quality: 'best'`.
- All lesson `id`s are **globally unique** across every subject.

### Pedagogy rule (not machine-enforced, but required)

**Teach before you test.** Every quiz question and scenario stage must be answerable from a
`read` step in the same or an earlier lesson. A glossary/"vocabulary check" quiz especially
must only test terms already introduced in prose — it is reinforcement, not the first
exposure. If you want to quiz a concept (e.g. prefill = compute-bound, decode =
memory-bound, KV cache, foundation model), add it to a `read` step first. The test suite
won't catch this — it's a content-quality requirement you must self-check.

## Naming conventions

- `Subject.id`: lowercase-kebab (e.g. `inference-engineering`).
- Module ids: `<prefix>-m1`, `<prefix>-m2`, … (e.g. `ie-m1`).
- Lesson ids: `<prefix>-<topic>` (e.g. `ie-latency-throughput`) — globally unique.
- Markdown files + their import vars: `<prefix>-<topic>.md` → `topicMd`.
- Pick a short, distinct `prefix` per subject (dsa, gpu, ie, …).

## What fits which step (for a conceptual book)

- **read** — the chapter's narrative, rewritten tight and concrete. Markdown supports
  ```mermaid diagrams (auto-themed, lazy-loaded) — use them for the structure the book drew
  as figures: flowchart, sequence, funnel, state. See [diagrams.md](diagrams.md).
- **quiz** — comprehension + "why", with a teaching `explanation` on every question.
- **scenario** — architect/decision case studies (the book's tradeoffs become stages).
- **code** — only where the topic has real numeric work the JS sandbox can run
  (e.g. percentiles, arithmetic intensity / roofline, KV-cache memory, batch-size math).
  Skip forced code on purely conceptual chapters.
