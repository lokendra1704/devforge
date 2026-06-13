import { useState } from 'react'
import type { Scenario } from '../types'
import { Markdown } from '../lib/Markdown'

const QUALITY_META = {
  best: { label: 'Strong choice', cls: 'border-emerald-500 bg-emerald-500/10', tag: 'text-emerald-300' },
  ok: { label: 'Workable, with trade-offs', cls: 'border-amber-500 bg-amber-500/10', tag: 'text-amber-300' },
  bad: { label: 'This one bites back', cls: 'border-rose-500 bg-rose-500/10', tag: 'text-rose-300' },
}

export function ScenarioBlock({
  scenario,
  onFinished,
}: {
  scenario: Scenario
  onFinished: () => void
}) {
  // picks[stageIndex] = optionIndex
  const [picks, setPicks] = useState<Record<number, number>>({})
  const stagesDone = Object.keys(picks).length
  const visibleStages = scenario.stages.slice(0, stagesDone + 1)
  const finished = stagesDone === scenario.stages.length

  const pick = (si: number, oi: number) => {
    if (picks[si] !== undefined) return
    const next = { ...picks, [si]: oi }
    setPicks(next)
    if (Object.keys(next).length === scenario.stages.length) onFinished()
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-sky-500/30 bg-sky-500/5 p-5">
        <div className="text-[11px] font-bold uppercase tracking-widest text-sky-400 mb-2">
          📋 Case study briefing
        </div>
        <Markdown source={scenario.intro} />
      </div>

      {visibleStages.map((stage, si) => {
        const picked = picks[si]
        const answered = picked !== undefined
        return (
          <div key={si} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
            <div className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-3">
              Decision {si + 1} of {scenario.stages.length}
            </div>
            <Markdown source={stage.situation} />
            <p className="mt-4 text-sm font-semibold text-zinc-100">{stage.question}</p>
            <div className="mt-3 space-y-2">
              {stage.options.map((opt, oi) => {
                const meta = QUALITY_META[opt.quality]
                let cls = 'border-zinc-700/80 hover:border-zinc-500 text-zinc-300'
                if (answered) {
                  cls = oi === picked ? `${meta.cls} text-zinc-100` : 'border-zinc-800 text-zinc-600'
                }
                return (
                  <button
                    key={oi}
                    onClick={() => pick(si, oi)}
                    disabled={answered}
                    className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ${cls} ${answered ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
            {answered && (
              <div className="mt-4 rounded-lg bg-zinc-950/70 border border-zinc-800 px-4 py-3">
                <div className={`text-xs font-bold mb-1 ${QUALITY_META[stage.options[picked].quality].tag}`}>
                  {QUALITY_META[stage.options[picked].quality].label}
                </div>
                <Markdown source={stage.options[picked].feedback} className="!text-[13px]" />
                {stage.options[picked].quality !== 'best' && (
                  <details className="mt-2">
                    <summary className="text-xs text-zinc-500 cursor-pointer hover:text-zinc-300">
                      What would a senior engineer pick?
                    </summary>
                    <div className="mt-2">
                      {stage.options
                        .map((o, oi) => ({ o, oi }))
                        .filter(({ o }) => o.quality === 'best')
                        .map(({ o, oi }) => (
                          <div key={oi}>
                            <p className="text-xs font-semibold text-emerald-300">→ {o.label}</p>
                            <Markdown source={o.feedback} className="!text-[13px]" />
                          </div>
                        ))}
                    </div>
                  </details>
                )}
              </div>
            )}
          </div>
        )
      })}

      {finished && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/5 p-5">
          <div className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 mb-2">
            🎯 Debrief
          </div>
          <Markdown source={scenario.debrief} />
        </div>
      )}
    </div>
  )
}
