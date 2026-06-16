import { useEffect, useState } from 'react'
import { SUBJECTS, PAPERS, WHITEPAPERS, ALL_SUBJECTS } from './data'
import { useProgress, levelInfo, levelTitle } from './lib/progress'
import { Dashboard } from './components/Dashboard'
import { SubjectPage } from './components/SubjectPage'
import { LessonPage } from './components/LessonPage'

type Route =
  | { view: 'dashboard' }
  | { view: 'subject'; subjectId: string }
  | { view: 'lesson'; lessonId: string }

function parseHash(): Route {
  const h = window.location.hash.replace(/^#\/?/, '')
  const [kind, id] = h.split('/')
  if (kind === 's' && id) return { view: 'subject', subjectId: id }
  if (kind === 'l' && id) return { view: 'lesson', lessonId: id }
  return { view: 'dashboard' }
}

export function navigate(path: string) {
  window.location.hash = path
  window.scrollTo(0, 0)
}

export default function App() {
  const [route, setRoute] = useState<Route>(parseHash)
  const progress = useProgress()
  const lvl = levelInfo(progress.xp)

  useEffect(() => {
    const onHash = () => setRoute(parseHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const subjectLessons = (sid: string) =>
    ALL_SUBJECTS.find((s) => s.id === sid)!.modules.flatMap((m) => m.lessons)

  const activeSubjectId =
    route.view === 'subject'
      ? route.subjectId
      : route.view === 'lesson'
        ? ALL_SUBJECTS.find((s) =>
            s.modules.some((m) => m.lessons.some((l) => l.id === route.lessonId)),
          )?.id
        : undefined

  const renderNavItem = (s: (typeof ALL_SUBJECTS)[number]) => {
    const lessons = subjectLessons(s.id)
    const done = lessons.filter((l) => progress.completed[l.id]).length
    const active = s.id === activeSubjectId
    return (
      <button
        key={s.id}
        onClick={() => navigate(`/s/${s.id}`)}
        className={`w-full text-left px-5 py-2.5 flex items-center gap-3 text-sm transition-colors border-l-2 ${
          active
            ? 'border-emerald-400 bg-zinc-900/80 text-zinc-100'
            : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
        }`}
      >
        <span className="text-base">{s.icon}</span>
        <span className="flex-1 truncate">{s.title}</span>
        <span
          className={`text-[10px] font-mono ${done === lessons.length ? 'text-emerald-400' : 'text-zinc-600'}`}
        >
          {done}/{lessons.length}
        </span>
      </button>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* sidebar */}
      <aside className="w-64 shrink-0 border-r border-zinc-800/80 bg-zinc-950 sticky top-0 h-screen overflow-y-auto hidden md:flex flex-col">
        <button
          onClick={() => navigate('/')}
          className="px-5 py-5 text-left border-b border-zinc-800/80 hover:bg-zinc-900/50"
        >
          <div className="font-mono font-bold text-lg text-zinc-50 tracking-tight">
            dev<span className="text-emerald-400">forge</span>
          </div>
          <div className="text-[11px] text-zinc-500 mt-0.5">zero → hero, interactively</div>
        </button>

        <nav className="flex-1 py-3">
          {SUBJECTS.map((s) => renderNavItem(s))}
          {PAPERS.length > 0 && (
            <div className="px-5 pt-4 pb-1 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
              Research Papers
            </div>
          )}
          {PAPERS.map((s) => renderNavItem(s))}
          {WHITEPAPERS.length > 0 && (
            <div className="px-5 pt-4 pb-1 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
              Whitepapers
            </div>
          )}
          {WHITEPAPERS.map((s) => renderNavItem(s))}
        </nav>

        {/* player card */}
        <div className="p-4 border-t border-zinc-800/80">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-bold text-zinc-200">
              Lv {lvl.level} · {levelTitle(lvl.level)}
            </span>
            <span className="font-mono text-zinc-500">{progress.xp} XP</span>
          </div>
          <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-sky-400 transition-all duration-700"
              style={{ width: `${lvl.pct}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-[11px] text-zinc-500">
            <span>
              {lvl.into}/{lvl.needed} to Lv {lvl.level + 1}
            </span>
            <span>🔥 {progress.streak}-day streak</span>
          </div>
        </div>
      </aside>

      {/* main */}
      <main className="flex-1 min-w-0">
        {route.view === 'dashboard' && <Dashboard />}
        {route.view === 'subject' && <SubjectPage subjectId={route.subjectId} />}
        {route.view === 'lesson' && <LessonPage key={route.lessonId} lessonId={route.lessonId} />}
      </main>
    </div>
  )
}
