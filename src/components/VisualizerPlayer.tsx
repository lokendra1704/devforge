import { useEffect, useMemo, useRef, useState } from 'react'
import { getVisualizer, type VizFrame } from '../lib/visualizers'

const SPEEDS = [0.5, 1, 1.5, 2.5]

export function VisualizerPlayer({ id }: { id: string }) {
  const config = useMemo(() => getVisualizer(id), [id])
  const [frames, setFrames] = useState<VizFrame[]>(config.frames)
  const [i, setI] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const timer = useRef<number | null>(null)

  const frame = frames[Math.min(i, frames.length - 1)]
  const atEnd = i >= frames.length - 1

  useEffect(() => {
    if (!playing) return
    if (atEnd) {
      setPlaying(false)
      return
    }
    timer.current = window.setTimeout(() => setI((v) => v + 1), 1400 / speed)
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [playing, i, atEnd, speed])

  const restart = (fresh?: VizFrame[]) => {
    setPlaying(false)
    if (fresh) setFrames(fresh)
    setI(0)
  }

  const inWindow = (idx: number) =>
    frame.window && idx >= frame.window[0] && idx <= frame.window[1]

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
      <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between gap-3 flex-wrap">
        <div>
          <div className="font-semibold text-zinc-100 text-sm">{config.title}</div>
          <div className="text-xs text-zinc-500 mt-0.5">{config.legend}</div>
        </div>
        {config.randomize && (
          <button
            onClick={() => restart(config.randomize!())}
            className="text-xs px-3 py-1.5 rounded-md border border-zinc-700 hover:border-zinc-500 text-zinc-300 transition-colors"
          >
            🎲 New input
          </button>
        )}
      </div>

      {/* cells */}
      <div className="px-4 pt-10 pb-4 overflow-x-auto">
        <div className="flex gap-1.5 justify-center min-w-max mx-auto">
          {frame.cells.map((c, idx) => {
            const dim = frame.dimmed?.includes(idx)
            const hit = frame.found?.includes(idx)
            const ptrs = frame.pointers.filter((p) => p.index === idx)
            return (
              <div key={idx} className="relative">
                {ptrs.length > 0 && (
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex gap-0.5">
                    {ptrs.map((p) => (
                      <span
                        key={p.label}
                        className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded"
                        style={{ background: p.color, color: '#09090b' }}
                      >
                        {p.label}
                      </span>
                    ))}
                  </div>
                )}
                <div
                  className={`w-11 h-11 flex items-center justify-center rounded-lg font-mono text-sm font-semibold border transition-all duration-300
                    ${
                      hit
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 scale-110'
                        : dim
                          ? 'bg-zinc-900 border-zinc-800 text-zinc-700'
                          : inWindow(idx)
                            ? 'bg-sky-500/10 border-sky-500/50 text-sky-200'
                            : 'bg-zinc-800/80 border-zinc-700 text-zinc-200'
                    }`}
                >
                  {c}
                </div>
                <div className="text-center text-[10px] text-zinc-600 font-mono mt-1">{idx}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* narration */}
      <div className="mx-4 mb-3 rounded-lg bg-zinc-950/80 border border-zinc-800 px-4 py-3 min-h-[64px]">
        <p className="text-sm text-zinc-200 leading-6">{frame.note}</p>
        {frame.stat && <p className="text-xs font-mono text-amber-300/90 mt-1">{frame.stat}</p>}
      </div>

      {/* controls */}
      <div className="px-4 pb-4 flex items-center gap-2 flex-wrap">
        <button
          onClick={() => restart()}
          className="px-2.5 py-1.5 rounded-md border border-zinc-700 text-zinc-300 text-xs hover:border-zinc-500"
          title="Restart"
        >
          ⏮
        </button>
        <button
          onClick={() => setI((v) => Math.max(0, v - 1))}
          disabled={i === 0}
          className="px-2.5 py-1.5 rounded-md border border-zinc-700 text-zinc-300 text-xs hover:border-zinc-500 disabled:opacity-30"
        >
          ◀ Step
        </button>
        <button
          onClick={() => (atEnd ? restart() : setPlaying((p) => !p))}
          className="px-4 py-1.5 rounded-md bg-emerald-500 text-zinc-950 text-xs font-bold hover:bg-emerald-400"
        >
          {playing ? '⏸ Pause' : atEnd ? '↻ Replay' : '▶ Play'}
        </button>
        <button
          onClick={() => setI((v) => Math.min(frames.length - 1, v + 1))}
          disabled={atEnd}
          className="px-2.5 py-1.5 rounded-md border border-zinc-700 text-zinc-300 text-xs hover:border-zinc-500 disabled:opacity-30"
        >
          Step ▶
        </button>
        <div className="flex items-center gap-1 ml-2">
          {SPEEDS.map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2 py-1 rounded text-[11px] font-mono ${
                speed === s ? 'bg-zinc-700 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
        <span className="ml-auto text-xs font-mono text-zinc-500">
          {i + 1} / {frames.length}
        </span>
      </div>

      {/* scrubber */}
      <input
        type="range"
        min={0}
        max={frames.length - 1}
        value={i}
        onChange={(e) => {
          setPlaying(false)
          setI(Number(e.target.value))
        }}
        className="w-full accent-emerald-400 h-1 cursor-pointer"
      />
    </div>
  )
}
