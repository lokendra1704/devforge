---
module: System
date: 2026-06-12
problem_type: test_failure
component: testing_framework
symptoms:
  - "`npx vitest run` (no path) hangs indefinitely after printing only the `RUN v4.1.8` banner"
  - "A `vitest/dist/workers/forks.js` node process sits at ~99% CPU and never emits results"
  - "Orphaned vitest workers survive `pkill -f vitest` and keep pegging a core (one seen at 40 min elapsed)"
root_cause: config_error
resolution_type: workflow_improvement
severity: medium
tags: [vitest, fork-pool, hang, flaky, test-runner, ci]
---

# Troubleshooting: `npx vitest run` hangs at 100% CPU in a fork worker

## Problem
Running the full test suite with `npx vitest run` (no file argument) hangs forever: it prints the `RUN v4.1.8` banner and then nothing, while a `forks.js` worker spins at ~99% CPU. Invoking the **same single test file by explicit path** completes in ~250 ms. The hang looks like an infinite loop in the code under test, but it is a vitest fork-pool / environment issue, not a content bug.

## Environment
- Module: System-wide (test harness)
- Project: `interview-preparation` (Vite 8 + React + TypeScript, **not** Rails)
- Test runner: vitest v4.1.8, Node v22.20.0 (nvm), macOS (darwin 25.1.0)
- Affected component: test runner invocation; only one test file exists — `src/data/curriculum.test.ts`
- Date: 2026-06-12

## Symptoms
- `npx vitest run` prints `RUN v4.1.8 …` and then produces no further output; never exits.
- `ps` shows the worker `node …/vitest/dist/workers/forks.js` at ~99% CPU.
- `pkill -f vitest` does not always reap the worker; a stale worker was observed still spinning at 40 min `etime`, predating the current run attempts.
- Piping through `| tail -N` makes it look even more dead, because `tail` buffers until EOF and shows nothing until the (never-arriving) exit.

## What Didn't Work

**Attempted Solution 1:** Re-run `npx vitest run` and wait longer.
- **Why it failed:** Two concurrent runs competed and a leftover orphan kept a core pinned; waiting never produced output.

**Attempted Solution 2:** `npx vitest run --no-file-parallelism --pool=forks --poolOptions.forks.singleFork=true …`
- **Why it failed:** `--poolOptions` is not a valid vitest **CLI** flag → `CACError: Unknown option \`--poolOptions\``. (It is a config-file option, not a CLI one.)

## Solution

Invoke vitest with an **explicit test-file path** plus guard flags, and hard-kill stale workers first:

```bash
# 1. Reap any orphaned workers (plain pkill is not always enough)
pkill -9 -f forks.js 2>/dev/null; pkill -9 -f vitest 2>/dev/null

# 2. Run by explicit path with a per-test timeout so a real loop FAILS fast
#    instead of hanging, and bail on first failure:
npx vitest run --testTimeout=8000 --bail=1 src/data/curriculum.test.ts
```

This completes in ~250 ms (31 tests). To confirm a single subject without depending on a full run:

```bash
npx vitest run --testTimeout=8000 -t "inference-engineering" src/data/curriculum.test.ts
```

Do **not** pipe the run through `| tail` while debugging a suspected hang — write to a file and read it (`… > /tmp/vitest.log 2>&1`) so partial progress is visible.

## Why This Works

1. **Root cause:** the no-argument `vitest run` fork-pool worker spins in this Node 22 / vitest 4 / macOS environment and never reports; the single targeted invocation takes a different/fast path. It is an environment + runner-config issue, not an infinite loop in the curriculum data (the only test file completes in 256 ms when addressed directly).
2. **`--testTimeout` converts the failure mode:** if a *real* runaway ever exists (e.g. an O(n²) code-challenge solution on a large input), the test now **times out with a named failure** pointing at the offending challenge, instead of hanging the whole process. That is exactly how the pre-existing `dsa/dsa-two-pointers-code` failure was surfaced.
3. **Explicit path** sidesteps whatever full-suite discovery/worker behavior triggers the spin.

## Prevention

- In `package.json` / CI, prefer `vitest run <path>` (or set `test.fileParallelism`/`pool` in `vitest.config.ts`) rather than bare `vitest run`.
- Always pass `--testTimeout` in automated runs so loops fail loudly rather than hang.
- After any killed/aborted run, verify with `pgrep -fl vitest`; use `pkill -9 -f forks.js` to clear orphans before re-running.
- Validate vitest **CLI** flags against `npx vitest --help` — pool tuning (`poolOptions`) belongs in the config file, not the command line.
- When a run "hangs," check `ps -o %cpu,etime` on the worker: ~99% CPU = a loop or a spinning runner; near-0% = a startup/IO stall. They have different fixes.

## Related Issues

No related issues documented yet. (Separately noted this session: `src/data/curriculum.test.ts` reports a **pre-existing** failure in `dsa/dsa-two-pointers-code` — its reference solution fails its own O(n) 200k-element test — unrelated to the test-runner hang.)
