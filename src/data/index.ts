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
import { clawvm } from './clawvm'
import { sira } from './sira'
import { intrinsicDimension } from './intrinsic-dimension'
import { lora } from './lora'
import { agenticAiAdaptation } from './agentic-ai-adaptation'

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
export const PAPERS: Subject[] = [codeAsAgentHarness, clawvm, sira, intrinsicDimension, lora, agenticAiAdaptation]

export const ALL_SUBJECTS: Subject[] = [...SUBJECTS, ...PAPERS]
