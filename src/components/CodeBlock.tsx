import { useState } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import type { CodeChallenge } from '../types'
import { runCode, type RunResult } from '../lib/runner'
import { Markdown } from '../lib/Markdown'

export function CodeBlock({
  challenge,
  onPassed,
}: {
  challenge: CodeChallenge
  onPassed: () => void
}) {
  const [code, setCode] = useState(challenge.starterCode)
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<RunResult | null>(null)
  const [revealed, setRevealed] = useState(false)

  const run = async () => {
    setRunning(true)
    setResult(null)
    const r = await runCode(code, challenge.tests)
    setResult(r)
    setRunning(false)
    if (r.ok) onPassed()
  }

  const reveal = () => {
    setRevealed(true)
    setCode(challenge.solution)
    setResult(null)
    onPassed() // let the learner continue, but they saw the answer
  }

  return (
    <div className="space-y-4">
      <Markdown source={challenge.prompt} />

      <div className="rounded-xl border border-zinc-800 overflow-hidden">
        <div className="flex items-center justify-between bg-zinc-900 px-4 py-2 border-b border-zinc-800">
          <span className="text-xs font-mono text-zinc-500">solution.js</span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setCode(challenge.starterCode)
                setResult(null)
              }}
              className="text-xs px-3 py-1.5 rounded-md text-zinc-400 hover:text-zinc-200"
            >
              Reset
            </button>
            {!revealed && (
              <button
                onClick={reveal}
                className="text-xs px-3 py-1.5 rounded-md border border-zinc-700 text-zinc-300 hover:border-zinc-500"
              >
                Show solution
              </button>
            )}
            <button
              onClick={run}
              disabled={running}
              className="text-xs px-4 py-1.5 rounded-md bg-emerald-500 text-zinc-950 font-bold hover:bg-emerald-400 disabled:opacity-50"
            >
              {running ? 'Running…' : '▶ Run tests'}
            </button>
          </div>
        </div>
        <CodeMirror
          value={code}
          onChange={setCode}
          theme={oneDark}
          extensions={[javascript()]}
          basicSetup={{ lineNumbers: true, foldGutter: false }}
          style={{ fontSize: 13 }}
        />
      </div>

      {result && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
          <div
            className={`px-4 py-2.5 text-xs font-bold border-b border-zinc-800 ${
              result.ok ? 'text-emerald-300 bg-emerald-500/10' : 'text-rose-300 bg-rose-500/10'
            }`}
          >
            {result.ok
              ? `✓ All ${result.results.length} tests passed — challenge complete!`
              : result.fatal
                ? '✗ Error'
                : `✗ ${result.results.filter((r) => !r.pass).length} of ${result.results.length} tests failing`}
          </div>
          <div className="p-4 space-y-1.5">
            {result.fatal && (
              <p className="font-mono text-xs text-rose-300 whitespace-pre-wrap">{result.fatal}</p>
            )}
            {result.results.map((t, i) => (
              <div key={i} className="flex items-start gap-2 text-xs font-mono">
                <span className={t.pass ? 'text-emerald-400' : 'text-rose-400'}>
                  {t.pass ? '✓' : '✗'}
                </span>
                <span className="text-zinc-300">{t.name}</span>
                {t.error && <span className="text-rose-300/80">— {t.error}</span>}
              </div>
            ))}
            {result.logs.length > 0 && (
              <details className="pt-2" open={!result.ok}>
                <summary className="text-xs text-zinc-500 cursor-pointer">
                  console output ({result.logs.length})
                </summary>
                <pre className="mt-2 bg-zinc-950 rounded-lg p-3 text-[11px] leading-5 text-zinc-400 font-mono overflow-x-auto max-h-48">
                  {result.logs.join('\n')}
                </pre>
              </details>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
