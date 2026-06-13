import { useSyncExternalStore } from 'react'

const KEY = 'devforge-progress-v1'

export interface Progress {
  xp: number
  completed: Record<string, string> // lessonId -> ISO date completed
  streak: number
  lastActiveDay: string // YYYY-MM-DD
}

const empty: Progress = { xp: 0, completed: {}, streak: 0, lastActiveDay: '' }

let state: Progress = load()
const listeners = new Set<() => void>()

function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...empty, ...JSON.parse(raw) }
  } catch {
    /* corrupted storage -> start fresh */
  }
  return { ...empty }
}

function save() {
  localStorage.setItem(KEY, JSON.stringify(state))
  listeners.forEach((l) => l())
}

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

function yesterday(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}

export function completeLesson(lessonId: string, xp: number) {
  if (state.completed[lessonId]) return
  const t = today()
  const streak =
    state.lastActiveDay === t
      ? state.streak
      : state.lastActiveDay === yesterday()
        ? state.streak + 1
        : 1
  state = {
    xp: state.xp + xp,
    completed: { ...state.completed, [lessonId]: new Date().toISOString() },
    streak,
    lastActiveDay: t,
  }
  save()
}

export function resetProgress() {
  state = { ...empty }
  save()
}

export function useProgress(): Progress {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => state,
  )
}

/** Level curve: each level needs 300 XP. */
export function levelInfo(xp: number) {
  const PER = 300
  const level = Math.floor(xp / PER) + 1
  const into = xp % PER
  return { level, into, needed: PER, pct: Math.round((into / PER) * 100) }
}

export const LEVEL_TITLES = [
  'Novice',
  'Apprentice',
  'Builder',
  'Engineer',
  'Senior Engineer',
  'Staff Engineer',
  'Systems Wizard',
  'Kernel Hacker',
  'Architect',
  'Hero',
]

export function levelTitle(level: number) {
  return LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)]
}
