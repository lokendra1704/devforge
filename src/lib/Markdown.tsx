import { useEffect, useMemo, useRef } from 'react'
import { marked } from 'marked'

marked.setOptions({ gfm: true, breaks: false })

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// Render ```mermaid fences into a placeholder div that we hydrate after mount;
// keep normal fenced code blocks behaving exactly as marked's default would.
marked.use({
  renderer: {
    code({ text, lang }) {
      const language = (lang || '').trim().split(/\s+/)[0]
      if (language === 'mermaid') {
        return `<div class="mermaid-figure"><div class="mermaid">${escapeHtml(text)}</div></div>`
      }
      const cls = language ? ` class="language-${language}"` : ''
      return `<pre><code${cls}>${escapeHtml(text)}</code></pre>\n`
    },
  },
})

let mermaidReady: Promise<typeof import('mermaid').default> | null = null
function loadMermaid() {
  if (!mermaidReady) {
    mermaidReady = import('mermaid').then(({ default: mermaid }) => {
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'loose',
        theme: 'dark',
        themeVariables: {
          fontFamily:
            '"Inter", ui-sans-serif, system-ui, -apple-system, sans-serif',
          background: '#09090b', // zinc-950
          primaryColor: '#18181b', // zinc-900
          primaryBorderColor: '#3f3f46', // zinc-700
          primaryTextColor: '#e4e4e7', // zinc-200
          lineColor: '#52525b', // zinc-600
          secondaryColor: '#064e3b', // emerald-900
          tertiaryColor: '#18181b',
        },
      })
      return mermaid
    })
  }
  return mermaidReady
}

export function Markdown({ source, className = '' }: { source: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const html = useMemo(() => marked.parse(source) as string, [source])

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const nodes = Array.from(root.querySelectorAll<HTMLElement>('.mermaid'))
    if (nodes.length === 0) return
    let cancelled = false
    loadMermaid().then((mermaid) => {
      if (cancelled) return
      nodes.forEach((n) => n.removeAttribute('data-processed'))
      mermaid.run({ nodes }).catch((err) => console.error('mermaid render failed', err))
    })
    return () => {
      cancelled = true
    }
  }, [html])

  return (
    <div
      ref={ref}
      className={`prose-doc ${className}`}
      // content is authored locally in the repo, not user input
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
