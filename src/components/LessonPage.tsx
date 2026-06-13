import { useState } from 'react'
import { ALL_SUBJECTS } from '../data'
import { useProgress, completeLesson } from '../lib/progress'
import { navigate } from '../App'
import { Markdown } from '../lib/Markdown'
import { QuizBlock } from './QuizBlock'
import { CodeBlock } from './CodeBlock'
import { ScenarioBlock } from './ScenarioBlock'
import { VisualizerPlayer } from './VisualizerPlayer'
import type { Lesson, Subject } from '../types'

function locate(lessonId: string): { subject: Subject; lesson: Lesson; next: Lesson | null } | null {
  for (const subject of ALL_SUBJECTS) {
    const flat = subject.modules.flatMap((m) => m.lessons)
    const idx = flat.findIndex((l) => l.id === lessonId)
    if (idx !== -1) return { subject, lesson: flat[idx], next: flat[idx + 1] ?? null }
  }
  return null
}

export function LessonPage({ lessonId }: { lessonId: string }) {
  const progress = useProgress()
  const [stepIdx, setStepIdx] = useState(0)
  // which gated steps have been satisfied this session
  const [cleared, setCleared] = useState<Record<number, boolean>>({})
  const [justFinished, setJustFinished] = useState(false)

  // the component is keyed by lessonId in App, so state resets per lesson
  const loc = locate(lessonId)
  if (!loc) return <div className="p-10 text-zinc-400">Lesson not found.</div>
  const { subject, lesson, next } = loc

  const step = lesson.steps[stepIdx]
  const isLast = stepIdx === lesson.steps.length - 1
  const gated = step.kind === 'quiz' || step.kind === 'code' || step.kind === 'scenario'
  const canContinue = !gated || cleared[stepIdx] || !!progress.completed[lesson.id]

  const clear = () => setCleared((c) => ({ ...c, [stepIdx]: true }))

  const advance = () => {
    if (isLast) {
      const first = !progress.completed[lesson.id]
      completeLesson(lesson.id, lesson.xp)
      if (first) setJustFinished(true)
      else navigate(`/s/${subject.id}`)
    } else {
      setStepIdx((i) => i + 1)
      window.scrollTo(0, 0)
    }
  }

  if (justFinished) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <div className="text-6xl">🏆</div>
        <h1 className="mt-6 text-2xl font-bold text-zinc-50">Lesson complete!</h1>
        <p className="mt-2 text-zinc-400">
          <span className="text-emerald-400 font-bold">+{lesson.xp} XP</span> — {lesson.title}
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={() => navigate(`/s/${subject.id}`)}
            className="px-4 py-2 rounded-lg border border-zinc-700 text-sm text-zinc-300 hover:border-zinc-500"
          >
            Back to {subject.title}
          </button>
          {next && (
            <button
              onClick={() => navigate(`/l/${next.id}`)}
              className="px-4 py-2 rounded-lg bg-emerald-500 text-zinc-950 text-sm font-bold hover:bg-emerald-400"
            >
              Next: {next.title} →
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 pb-24">
      {/* header */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => navigate(`/s/${subject.id}`)}
          className="text-xs text-zinc-500 hover:text-zinc-300 truncate"
        >
          ← {subject.icon} {subject.title}
        </button>
        <span className="text-[11px] font-mono text-zinc-600 shrink-0">+{lesson.xp} XP</span>
      </div>
      <h1 className="mt-3 text-2xl font-bold tracking-tight text-zinc-50">{lesson.title}</h1>

      {/* step progress */}
      <div className="mt-5 flex items-center gap-1.5">
        {lesson.steps.map((s, i) => (
          <button
            key={i}
            onClick={() => i < stepIdx && setStepIdx(i)}
            title={s.title}
            className={`h-1.5 rounded-full flex-1 transition-colors ${
              i < stepIdx
                ? 'bg-emerald-500 cursor-pointer'
                : i === stepIdx
                  ? 'bg-zinc-400'
                  : 'bg-zinc-800'
            }`}
          />
        ))}
      </div>
      <div className="mt-2 text-[11px] font-mono text-zinc-500">
        step {stepIdx + 1}/{lesson.steps.length} — {step.title}
      </div>

      {/* step body */}
      <div className="mt-6">
        {step.kind === 'read' && <Markdown source={step.markdown} />}
        {step.kind === 'quiz' && <QuizBlock key={`${lessonId}-${stepIdx}`} questions={step.questions} onAllAnswered={clear} />}
        {step.kind === 'code' && <CodeBlock key={`${lessonId}-${stepIdx}`} challenge={step.challenge} onPassed={clear} />}
        {step.kind === 'scenario' && (
          <ScenarioBlock key={`${lessonId}-${stepIdx}`} scenario={step.scenario} onFinished={clear} />
        )}
        {step.kind === 'visualizer' && (
          <div className="space-y-5">
            {step.markdown && <Markdown source={step.markdown} />}
            <VisualizerPlayer id={step.visualizer} />
          </div>
        )}
      </div>

      {/* footer nav */}
      <div className="mt-10 flex items-center justify-between">
        <button
          onClick={() => setStepIdx((i) => Math.max(0, i - 1))}
          disabled={stepIdx === 0}
          className="px-4 py-2 rounded-lg border border-zinc-800 text-sm text-zinc-400 hover:border-zinc-600 disabled:opacity-30"
        >
          ← Back
        </button>
        <button
          onClick={advance}
          disabled={!canContinue}
          className="px-5 py-2 rounded-lg bg-emerald-500 text-zinc-950 text-sm font-bold hover:bg-emerald-400 disabled:opacity-30 disabled:cursor-not-allowed"
          title={
            canContinue
              ? ''
              : step.kind === 'quiz'
                ? 'Answer every question to continue'
                : step.kind === 'code'
                  ? 'Make the tests pass (or reveal the solution) to continue'
                  : 'Work through every decision to continue'
          }
        >
          {isLast ? '✓ Finish lesson' : 'Continue →'}
        </button>
      </div>
    </div>
  )
}
