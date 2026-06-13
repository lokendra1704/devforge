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
import { codeAsAgentHarness } from './code-as-agent-harness'

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

/** Research papers, onboarded the same way as books but surfaced in their own section. */
export const PAPERS: Subject[] = [codeAsAgentHarness]

export const ALL_SUBJECTS: Subject[] = [...SUBJECTS, ...PAPERS]
