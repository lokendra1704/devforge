import { SUBJECTS, PAPERS, WHITEPAPERS, ALL_SUBJECTS } from '../data'
import { useProgress, levelInfo, levelTitle } from '../lib/progress'
import { navigate } from '../App'

export function Dashboard() {
  const progress = useProgress()
  const lvl = levelInfo(progress.xp)
  const allLessons = ALL_SUBJECTS.flatMap((s) => s.modules.flatMap((m) => m.lessons))
  const totalDone = allLessons.filter((l) => progress.completed[l.id]).length

  // Find tracks with at least one completed lesson, sorted by most recent
  const attemptedTracks = ALL_SUBJECTS.map((subject) => {
    const lessons = subject.modules.flatMap((m) => m.lessons)
    const completedLessons = lessons.filter((l) => progress.completed[l.id])
    if (completedLessons.length === 0) return null
    const mostRecentDate = completedLessons
      .map((l) => new Date(progress.completed[l.id]))
      .sort((a, b) => b.getTime() - a.getTime())[0]
    return { subject, mostRecentDate }
  })
    .filter((x) => x !== null)
    .sort((a, b) => b!.mostRecentDate.getTime() - a!.mostRecentDate.getTime())
    .slice(0, 5)
    .map((x) => x!.subject)

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

      {/* continue from where you left off */}
      {attemptedTracks.length > 0 && (
        <>
          <h2 className="mt-10 mb-4 text-sm font-bold uppercase tracking-widest text-zinc-500">
            Continue from where you left off
          </h2>
          <div className="grid gap-3">
            {attemptedTracks.map((subject) => {
              const lessons = subject.modules.flatMap((m) => m.lessons)
              const done = lessons.filter((l) => progress.completed[l.id]).length
              return (
                <button
                  key={subject.id}
                  onClick={() => navigate(`/s/${subject.id}`)}
                  className="text-left rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 hover:border-zinc-600 hover:bg-zinc-900/80 transition-all group flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-xl">{subject.icon}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-zinc-100 group-hover:text-white text-sm">
                        {subject.title}
                      </div>
                      <div className="text-[11px] text-zinc-500 mt-0.5">
                        {done}/{lessons.length} lessons completed
                      </div>
                    </div>
                  </div>
                  <span className="text-zinc-600 group-hover:text-zinc-300">→</span>
                </button>
              )
            })}
          </div>
        </>
      )}

      {/* subject grid */}
      <h2 className="mt-10 mb-4 text-sm font-bold uppercase tracking-widest text-zinc-500">
        Tracks
      </h2>
      <div className="grid sm:grid-cols-2 gap-4">{SUBJECTS.map((s) => renderSubjectCard(s))}</div>

      {/* research papers grid */}
      {PAPERS.length > 0 && (
        <>
          <h2 className="mt-10 mb-4 text-sm font-bold uppercase tracking-widest text-zinc-500">
            Research Papers
          </h2>
          <p className="mt-[-12px] mb-4 text-[13px] text-zinc-500">
            Curated breakdowns of research papers, broken into bite-sized lessons.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">{PAPERS.map((s) => renderSubjectCard(s))}</div>
        </>
      )}

      {/* whitepapers grid */}
      {WHITEPAPERS.length > 0 && (
        <>
          <h2 className="mt-10 mb-4 text-sm font-bold uppercase tracking-widest text-zinc-500">
            Whitepapers
          </h2>
          <p className="mt-[-12px] mb-4 text-[13px] text-zinc-500">
            Industry whitepapers on how AI is reshaping engineering practice, broken into bite-sized lessons.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">{WHITEPAPERS.map((s) => renderSubjectCard(s))}</div>
        </>
      )}
    </div>
  )

  function renderSubjectCard(s: (typeof ALL_SUBJECTS)[number]) {
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
  }
}
