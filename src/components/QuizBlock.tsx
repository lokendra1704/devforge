import { useState } from 'react'
import type { QuizQuestion } from '../types'
import { Markdown } from '../lib/Markdown'

export function QuizBlock({
  questions,
  onAllAnswered,
}: {
  questions: QuizQuestion[]
  onAllAnswered: () => void
}) {
  const [picks, setPicks] = useState<Record<number, number>>({})

  const pick = (qi: number, oi: number) => {
    if (picks[qi] !== undefined) return // lock after answering
    const next = { ...picks, [qi]: oi }
    setPicks(next)
    if (Object.keys(next).length === questions.length) onAllAnswered()
  }

  const score = questions.reduce(
    (acc, q, qi) => acc + (picks[qi] === q.answer ? 1 : 0),
    0,
  )
  const done = Object.keys(picks).length === questions.length

  return (
    <div className="space-y-6">
      {questions.map((q, qi) => {
        const picked = picks[qi]
        const answered = picked !== undefined
        return (
          <div key={qi} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
            <div className="flex gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-zinc-800 text-zinc-400 text-xs font-bold flex items-center justify-center">
                {qi + 1}
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium text-zinc-100 leading-6">{q.prompt}</p>
                {q.code && (
                  <pre className="mt-3 bg-zinc-950 border border-zinc-800 rounded-lg p-3 overflow-x-auto">
                    <code className="font-mono text-[13px] leading-6 text-zinc-300">{q.code}</code>
                  </pre>
                )}
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {q.options.map((opt, oi) => {
                const isAnswer = oi === q.answer
                const isPicked = picked === oi
                let cls = 'border-zinc-700/80 hover:border-zinc-500 text-zinc-300'
                if (answered) {
                  if (isAnswer) cls = 'border-emerald-500 bg-emerald-500/10 text-emerald-200'
                  else if (isPicked) cls = 'border-rose-500 bg-rose-500/10 text-rose-200'
                  else cls = 'border-zinc-800 text-zinc-600'
                }
                return (
                  <button
                    key={oi}
                    onClick={() => pick(qi, oi)}
                    disabled={answered}
                    className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-colors ${cls} ${answered ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    <span className="font-mono text-xs mr-2 opacity-60">
                      {String.fromCharCode(65 + oi)}
                    </span>
                    {opt}
                    {answered && isAnswer && <span className="float-right">✓</span>}
                    {answered && isPicked && !isAnswer && <span className="float-right">✗</span>}
                  </button>
                )
              })}
            </div>
            {answered && (
              <div className="mt-3 rounded-lg bg-zinc-950/70 border border-zinc-800 px-4 py-3">
                <span
                  className={`text-xs font-bold ${picked === q.answer ? 'text-emerald-400' : 'text-rose-400'}`}
                >
                  {picked === q.answer ? 'Correct!' : 'Not quite.'}
                </span>
                <Markdown source={q.explanation} className="!text-[13px] [&_p]:my-1 mt-1" />
              </div>
            )}
          </div>
        )
      })}
      {done && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/5 px-5 py-4 text-sm">
          <span className="font-bold text-emerald-300">
            Quiz complete — {score}/{questions.length}
          </span>
          <span className="text-zinc-400 ml-2">
            {score === questions.length
              ? 'Flawless. 🏆'
              : 'Re-read the explanations above — that is where the learning happens.'}
          </span>
        </div>
      )}
    </div>
  )
}
