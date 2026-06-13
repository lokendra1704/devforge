# ⚡ devforge — zero → hero, interactively

A local-first interactive learning platform. No accounts, no backend — your progress (XP,
levels, streaks, completed lessons) lives in `localStorage`. Every lesson teaches through
**doing**: story-driven reads, gated quizzes, runnable coding challenges with real tests,
algorithm visualizers, and "you are the engineer in the room" decision scenarios.

## Tracks

| Track | What you build / decide | Highlights |
|---|---|---|
| 🧩 DSA & Algorithms | LeetCode patterns, not problem grinding | Two-pointers / sliding-window / binary-search **animated visualizers**, Koko's bananas, Number of Islands |
| 🏗️ System Design | Real case studies as multi-stage scenarios | Design a **URL shortener** and a **WhatsApp-scale chat** decision-by-decision, with senior-engineer feedback on every choice |
| 🔧 Low Level Coding | Machine-coding interview classics | Implement an **LRU cache** and a **token-bucket rate limiter** against real tests |
| 🧱 Design Patterns | Patterns as found in the wild | Build an **EventEmitter** (Observer) and a surge-pricing **Strategy** engine |
| 🤖 Agentic Engineering | LLM agents from first principles | Write the **agent loop** yourself (tools, max-steps, error feedback), then launch a support agent safely |
| ⚡ GPU Engineering | From "why GPUs" to kernel thinking | SIMT, the grid/block/thread model — write a **vector-add kernel** against a simulated launcher, memory hierarchy, path to elite |
| 🧵 Parallelism | Threads, async, CPU & GPU | Race conditions (Knight Capital), build a **promise pool** and an async **Mutex** that stops a double-spend |

34 lessons · 13 runnable code challenges · 3 decision scenarios · 3 visualizers.

## Run it

```bash
npm install
npm run dev      # open the printed localhost URL
```

```bash
npm run build    # type-check + production build
npx vitest run   # content integrity: every reference solution must pass its own tests
```

## How it teaches

- **Read** steps are short, story-driven (a tiffin service that melts at 50k users, a stadium
  full of students doing one addition each) — concepts arrive inside real-life scenarios.
- **Quiz** steps gate progress: every question must be answered, every answer gets an explanation.
- **Code** steps run your code in a sandboxed Web Worker with a tiny test harness
  (`test`, `assertEqual`, `sleep`, async support, 6s timeout for infinite loops). You continue
  when tests pass — or study the revealed solution.
- **Scenario** steps put you in a design review: pick an option, get graded
  (strong / workable / risky) with the reasoning a senior engineer would give.
- **Visualizer** steps animate the algorithm over your data — play, step, scrub, randomize.

## Adding a lesson

Lessons are plain data in `src/data/<subject>.ts`; prose lives in `src/data/md/*.md`
(imported with `?raw`). A lesson is a list of steps:

```ts
{
  id: 'dsa-two-pointers',        // globally unique
  title: 'Two Pointers',
  minutes: 12,
  xp: 80,
  steps: [
    { kind: 'read', title: 'The idea', markdown: twoPointersMd },
    { kind: 'visualizer', title: 'Watch it', visualizer: 'two-pointers' },
    { kind: 'quiz', title: 'Check yourself', questions: [...] },
    { kind: 'code', title: 'Build it', challenge: { prompt, starterCode, solution, tests } },
    { kind: 'scenario', title: 'Design review', scenario: { intro, stages, debrief } },
  ],
}
```

`npx vitest run` keeps the curriculum honest: every challenge's reference solution is executed
against its own tests, starter code must *not* already pass, quiz answer indexes must be valid,
and every scenario stage needs at least one 'best' option.

## Stack

Vite · React 19 · TypeScript · Tailwind v4 · CodeMirror 6 · marked · vitest.
Hash-based routing, no router dependency. Code execution sandboxed in a Blob-built Web Worker.
