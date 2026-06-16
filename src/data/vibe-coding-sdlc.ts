import type { Subject } from '../types'
import { vcM1 } from './vibe-coding-sdlc-m1'
import { vcM2 } from './vibe-coding-sdlc-m2'
import { vcM3 } from './vibe-coding-sdlc-m3'

export const vibeCodingSdlc: Subject = {
  id: 'vibe-coding-sdlc',
  title: 'The New SDLC with Vibe Coding',
  tagline: 'From ad-hoc prompting to agentic engineering — how AI is reshaping the software development life cycle.',
  icon: '🏭',
  accent: '#fb923c',
  modules: [vcM1, vcM2, vcM3],
}
