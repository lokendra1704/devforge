import type { Subject } from '../types'
import { dsa } from './dsa'
import { sysdesign } from './sysdesign'
import { lld } from './lld'
import { patterns } from './patterns'
import { agentic } from './agentic'
import { gpu } from './gpu'
import { parallelism } from './parallelism'
import { inferenceEngineering } from './inference-engineering'
import { appliedProbability } from './applied-probability'
import { systemDesignInterview } from './system-design-interview'

export const SUBJECTS: Subject[] = [
  dsa,
  sysdesign,
  lld,
  patterns,
  agentic,
  gpu,
  parallelism,
  inferenceEngineering,
  appliedProbability,
  systemDesignInterview,
]
