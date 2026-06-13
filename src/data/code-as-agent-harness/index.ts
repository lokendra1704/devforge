import type { Subject } from '../../types'
import { m1 } from './m1'
import { m2 } from './m2'
import { m3 } from './m3'
import { m4 } from './m4'
import { m5 } from './m5'

export const codeAsAgentHarness: Subject = {
  id: 'code-as-agent-harness',
  title: 'Code as Agent Harness',
  tagline:
    'arXiv:2605.18747 — how code becomes the executable, inspectable, stateful medium agents use to reason, act, and verify.',
  icon: '📜',
  accent: '#2dd4bf',
  modules: [m1, m2, m3, m4, m5],
}
