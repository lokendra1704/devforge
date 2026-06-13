import { SUBJECTS } from '../data'
import { useProgress, levelInfo, levelTitle } from '../lib/progress'
import { navigate } from '../App'

export function Dashboard() {
  const progress = useProgress()
  const lvl = levelInfo(progress.xp)
  const allLessons = SUBJECTS.flatMap((s) => s.modules.flatMap((m) => m.lessons))
  const totalDone = allLessons.filter((l) => progress.completed[l.id]).length

  // first incomplete lesson, in curriculum order
  const nextUp = (() => {
    for (const s of SUBJECTS)
      for (const m of s.modules)
        for (const l of m.lessons)
          if (!progress.completed[l.id]) return { subject: s, lesson: l }
    return null
  })()

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-2 text-xs font-mono text-emerald-400 uppercase tracking-widest">
        // mission: zero → hero
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-zinc-50">
        Welcome back, future {levelTitle(10)}.
      </h1>
      <p className="mt-2 text-zinc-400 max-w-2xl text-[15px] leading-7">
        Seven tracks. Real-world scenarios, animated algorithms, code you actually run, and
        architecture decisions with consequences. No passive reading — everything here fights back.
      </p>

      {/* stats */}
      <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Level', value: `${lvl.level} · ${levelTitle(lvl.level)}` },
          { label: 'Total XP', value: `${progress.xp}` },
          { label: 'Streak', value: `🔥 ${progress.streak} day${progress.streak === 1 ? '' : 's'}` },
          { label: 'Lessons done', value: `${totalDone} / ${allLessons.length}` },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3">
            <div className="text-[11px] uppercase tracking-wider text-zinc-500">{s.label}</div>
            <div className="mt-1 text-lg font-bold text-zinc-100">{s.value}</div>
          </div>
        ))}
      </div>

      {/* continue */}
      {nextUp && (
        <button
          onClick={() => navigate(`/l/${nextUp.lesson.id}`)}
          className="mt-6 w-full text-left rounded-xl border border-emerald-500/40 bg-gradient-to-r from-emerald-500/10 to-transparent px-5 py-4 hover:border-emerald-400 transition-colors group"
        >
          <div className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">
            ▶ Continue learning
          </div>
          <div className="mt-1 font-semibold text-zinc-100 group-hover:text-white">
            {nextUp.subject.icon} {nextUp.lesson.title}
            <span className="text-zinc-500 font-normal text-sm ml-2">
              {nextUp.subject.title} · ~{nextUp.lesson.minutes} min · +{nextUp.lesson.xp} XP
            </span>
          </div>
        </button>
      )}

      {/* subject grid */}
      <h2 className="mt-10 mb-4 text-sm font-bold uppercase tracking-widest text-zinc-500">
        Tracks
      </h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {SUBJECTS.map((s) => {
          const lessons = s.modules.flatMap((m) => m.lessons)
          const done = lessons.filter((l) => progress.completed[l.id]).length
          const pct = Math.round((done / lessons.length) * 100)
          return (
            <button
              key={s.id}
              onClick={() => navigate(`/s/${s.id}`)}
              className="text-left rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-600 hover:bg-zinc-900/80 transition-all group"
            >
              <div className="flex items-start justify-between">
                <span className="text-2xl">{s.icon}</span>
                <span className="text-[11px] font-mono text-zinc-500">
                  {done}/{lessons.length} lessons
                </span>
              </div>
              <div className="mt-3 font-bold text-zinc-100 group-hover:text-white">{s.title}</div>
              <p className="mt-1 text-[13px] text-zinc-400 leading-5">{s.tagline}</p>
              <div className="mt-4 h-1 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, background: s.accent }}
                />
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
