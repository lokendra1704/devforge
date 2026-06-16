import type { Subject } from '../../types'
import { m1 } from './m1'
import { m2 } from './m2'
import { m3 } from './m3'
import { m4 } from './m4'
import { m5 } from './m5'
import { m6 } from './m6'

export const agenticAiAdaptation: Subject = {
  id: 'agentic-ai-adaptation',
  title: 'Adaptation of Agentic AI',
  tagline:
    'arXiv:2512.16301 — a four-paradigm framework (A1/A2/T1/T2) unifying post-training, memory, and skills across agent and tool adaptation.',
  icon: '🔄',
  accent: '#4ade80',
  modules: [m1, m2, m3, m4, m5, m6],
}
