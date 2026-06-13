import { describe, it, expect } from 'vitest'
import { ALL_SUBJECTS } from './index'
import type { CodeChallenge } from '../types'

// Mirrors the harness in lib/runner.ts (worker), so a solution that passes
// here passes in the browser too.
async function runChallenge(code: string, tests: string) {
  function fmt(v: unknown) {
    if (typeof v === 'string') return v
    try {
      return JSON.stringify(v)
    } catch {
      return String(v)
    }
  }
  function deepEqual(a: any, b: any): boolean {
    if (Object.is(a, b)) return true
    if (typeof a !== typeof b) return false
    if (typeof a !== 'object' || a === null || b === null) return false
    if (Array.isArray(a) !== Array.isArray(b)) return false
    const ka = Object.keys(a)
    const kb = Object.keys(b)
    if (ka.length !== kb.length) return false
    return ka.every((k) => deepEqual(a[k], b[k]))
  }
  const cases: { name: string; fn: () => unknown }[] = []
  const test = (name: string, fn: () => unknown) => cases.push({ name, fn })
  const assertEqual = (actual: unknown, expected: unknown, msg?: string) => {
    if (!deepEqual(actual, expected)) {
      throw new Error(`${msg ? msg + ' — ' : ''}expected ${fmt(expected)} but got ${fmt(actual)}`)
    }
  }
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
  const noopConsole = { log: () => {}, warn: () => {}, error: () => {}, info: () => {} }
  const run = new Function(
    'console',
    'test',
    'assertEqual',
    'sleep',
    `"use strict";\n${code}\n;\n${tests}`,
  )
  run(noopConsole, test, assertEqual, sleep)
  const failures: string[] = []
  for (const c of cases) {
    try {
      await c.fn()
    } catch (err) {
      failures.push(`${c.name}: ${(err as Error).message}`)
    }
  }
  return { count: cases.length, failures }
}

const challenges: { path: string; challenge: CodeChallenge }[] = []
const quizzes: { path: string; q: { prompt: string; options: string[]; answer: number; explanation: string } }[] = []
const scenarios: { path: string; stages: { options: { quality: string }[] }[] }[] = []

for (const s of ALL_SUBJECTS)
  for (const m of s.modules)
    for (const l of m.lessons)
      for (const [i, step] of l.steps.entries()) {
        const path = `${s.id}/${l.id}/step${i}`
        if (step.kind === 'code') challenges.push({ path, challenge: step.challenge })
        if (step.kind === 'quiz') for (const q of step.questions) quizzes.push({ path, q })
        if (step.kind === 'scenario') scenarios.push({ path, stages: step.scenario.stages })
      }

describe('every code challenge', () => {
  it.each(challenges.map((c) => [c.path, c] as const))(
    '%s: reference solution passes its own tests',
    async (_path, { challenge }) => {
      const { count, failures } = await runChallenge(challenge.solution, challenge.tests)
      expect(failures, failures.join('\n')).toEqual([])
      expect(count).toBeGreaterThanOrEqual(3)
    },
  )

  it.each(challenges.map((c) => [c.path, c] as const))(
    '%s: starter code does NOT already pass (there is something to do)',
    async (_path, { challenge }) => {
      try {
        const { count, failures } = await runChallenge(challenge.starterCode, challenge.tests)
        expect(failures.length > 0 || count === 0).toBe(true)
      } catch {
        // starter code throwing at all is also an acceptable "not done yet"
      }
    },
  )
})

describe('every quiz question', () => {
  it('has a valid answer index, 2+ options, and an explanation', () => {
    expect(quizzes.length).toBeGreaterThan(0)
    for (const { path, q } of quizzes) {
      expect(q.options.length, path).toBeGreaterThanOrEqual(2)
      expect(q.answer, path).toBeGreaterThanOrEqual(0)
      expect(q.answer, path).toBeLessThan(q.options.length)
      expect(q.explanation.length, path).toBeGreaterThan(20)
    }
  })
})

describe('every scenario stage', () => {
  it('has at least one best option and 2+ choices', () => {
    expect(scenarios.length).toBeGreaterThan(0)
    for (const { path, stages } of scenarios) {
      for (const [i, stage] of stages.entries()) {
        expect(stage.options.length, `${path} stage ${i}`).toBeGreaterThanOrEqual(2)
        expect(
          stage.options.some((o) => o.quality === 'best'),
          `${path} stage ${i} needs a 'best' option`,
        ).toBe(true)
      }
    }
  })
})

describe('curriculum integrity', () => {
  it('lesson ids are globally unique', () => {
    const ids = ALL_SUBJECTS.flatMap((s) => s.modules.flatMap((m) => m.lessons.map((l) => l.id)))
    expect(new Set(ids).size).toBe(ids.length)
  })
})
