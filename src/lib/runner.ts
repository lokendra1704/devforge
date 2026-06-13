export interface TestResult {
  name: string
  pass: boolean
  error?: string
}

export interface RunResult {
  ok: boolean
  results: TestResult[]
  logs: string[]
  /** compile/runtime error outside of tests */
  fatal?: string
  timedOut?: boolean
}

// Runs user code + tests inside a Web Worker so infinite loops can be
// terminated and the page never freezes.
const WORKER_SOURCE = `
function fmt(v) {
  if (typeof v === 'string') return v;
  try { return JSON.stringify(v); } catch { return String(v); }
}
function deepEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (typeof a !== typeof b) return false;
  if (typeof a !== 'object' || a === null || b === null) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const ka = Object.keys(a), kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  return ka.every((k) => deepEqual(a[k], b[k]));
}
self.onmessage = async (e) => {
  const { code, tests } = e.data;
  const logs = [];
  const results = [];
  const fakeConsole = {
    log: (...a) => logs.push(a.map(fmt).join(' ')),
    warn: (...a) => logs.push('[warn] ' + a.map(fmt).join(' ')),
    error: (...a) => logs.push('[error] ' + a.map(fmt).join(' ')),
    info: (...a) => logs.push(a.map(fmt).join(' ')),
  };
  const cases = [];
  const test = (name, fn) => cases.push({ name, fn });
  const assertEqual = (actual, expected, msg) => {
    if (!deepEqual(actual, expected)) {
      throw new Error((msg ? msg + ' — ' : '') + 'expected ' + fmt(expected) + ' but got ' + fmt(actual));
    }
  };
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  try {
    const run = new Function('console', 'test', 'assertEqual', 'sleep', '"use strict";\\n' + code + '\\n;\\n' + tests);
    run(fakeConsole, test, assertEqual, sleep);
  } catch (err) {
    self.postMessage({ ok: false, results: [], logs, fatal: String((err && err.message) || err) });
    return;
  }
  for (const c of cases) {
    try {
      await c.fn();
      results.push({ name: c.name, pass: true });
    } catch (err) {
      results.push({ name: c.name, pass: false, error: String((err && err.message) || err) });
    }
  }
  self.postMessage({ ok: results.length > 0 && results.every((r) => r.pass), results, logs });
};
`

export function runCode(code: string, tests: string, timeoutMs = 6000): Promise<RunResult> {
  return new Promise((resolve) => {
    const blob = new Blob([WORKER_SOURCE], { type: 'application/javascript' })
    const url = URL.createObjectURL(blob)
    const worker = new Worker(url)
    let settled = false

    const finish = (result: RunResult) => {
      if (settled) return
      settled = true
      worker.terminate()
      URL.revokeObjectURL(url)
      resolve(result)
    }

    const timer = setTimeout(() => {
      finish({
        ok: false,
        results: [],
        logs: [],
        timedOut: true,
        fatal: `Execution timed out after ${timeoutMs / 1000}s — check for infinite loops.`,
      })
    }, timeoutMs)

    worker.onmessage = (e) => {
      clearTimeout(timer)
      finish(e.data as RunResult)
    }
    worker.onerror = (e) => {
      clearTimeout(timer)
      finish({ ok: false, results: [], logs: [], fatal: e.message || 'Worker error' })
    }
    worker.postMessage({ code, tests })
  })
}
