import type { Subject } from '../types'
import { rlModule1 } from './rl-module-1'
import { rlModule2 } from './rl-module-2'
import { rlModule3 } from './rl-module-3'
import { rlModule4 } from './rl-module-4'

export const reinforcementLearning: Subject = {
  id: 'reinforcement-learning',
  title: 'Reinforcement Learning: An Introduction',
  tagline: 'Sutton & Barto’s foundational text — bandits, MDPs, and dynamic programming, one chapter at a time.',
  icon: '🎰',
  accent: '#22c55e',
  modules: [rlModule1, rlModule2, rlModule3, rlModule4],
}
