import { SUBJECTS } from '../data'
import { useProgress } from '../lib/progress'
import { navigate } from '../App'

const STEP_ICONS: Record<string, string> = {
  read: '📖',
  quiz: '❓',
  code: '⌨️',
  scenario: '🧭',
  visualizer: '🎬',
}

export function SubjectPage({ subjectId }: { subjectId: string }) {
  const progress = useProgress()
  const subject = SUBJECTS.find((s) => s.id === subjectId)
  if (!subject) return <div className="p-10 text-zinc-400">Track not found.</div>

  const lessons = subject.modules.flatMap((m) => m.lessons)
  const done = lessons.filter((l) => progress.completed[l.id]).length

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <button onClick={() => navigate('/')} className="text-xs text-zinc-500 hover:text-zinc-300">
        ← All tracks
      </button>
      <div className="mt-4 flex items-center gap-4">
        <span className="text-4xl">{subject.icon}</span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-50">{subject.title}</h1>
          <p className="text-zinc-400 text-sm mt-1">{subject.tagline}</p>
        </div>
      </div>
      <div className="mt-5 flex items-center gap-3">
        <div className="flex-1 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
          <div
            className="h-full transition-all duration-700"
            style={{ width: `${(done / lessons.length) * 100}%`, background: subject.accent }}
          />
        </div>
        <span className="text-xs font-mono text-zinc-500">
          {done}/{lessons.length}
        </span>
      </div>

      <div className="mt-10 space-y-10">
        {subject.modules.map((mod, mi) => (
          <div key={mod.id}>
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-xs text-zinc-600">
                {String(mi + 1).padStart(2, '0')}
              </span>
              <div>
                <h2 className="font-bold text-zinc-100">{mod.title}</h2>
                <p className="text-[13px] text-zinc-500 mt-0.5">{mod.description}</p>
              </div>
            </div>
            <div className="mt-4 space-y-2 md:ml-8">
              {mod.lessons.map((lesson) => {
                const isDone = !!progress.completed[lesson.id]
                return (
                  <button
                    key={lesson.id}
                    onClick={() => navigate(`/l/${lesson.id}`)}
                    className={`w-full text-left rounded-xl border px-5 py-4 transition-colors group flex items-center gap-4 ${
                      isDone
                        ? 'border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/60'
                        : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-600'
                    }`}
                  >
                    <span
                      className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border ${
                        isDone
                          ? 'bg-emerald-500 border-emerald-500 text-zinc-950'
                          : 'border-zinc-700 text-zinc-500'
                      }`}
                    >
                      {isDone ? '✓' : ''}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-zinc-100 group-hover:text-white">
                        {lesson.title}
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-[11px] text-zinc-500">
                        <span>~{lesson.minutes} min</span>
                        <span>·</span>
                        <span>+{lesson.xp} XP</span>
                        <span>·</span>
                        <span className="flex gap-1">
                          {lesson.steps.map((st, i) => (
                            <span key={i} title={st.kind}>
                              {STEP_ICONS[st.kind]}
                            </span>
                          ))}
                        </span>
                      </div>
                    </div>
                    <span className="text-zinc-600 group-hover:text-zinc-300">→</span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
