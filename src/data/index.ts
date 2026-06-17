import type { Subject } from '../types'
import { dsa } from './dsa'
import { sysdesign } from './sysdesign'
import { lld } from './lld'
import { patterns } from './patterns'
import { agentic } from './agentic'
import { gpu } from './gpu'
import { gpuDistributedTraining } from './gpu-distributed-training'
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
import { craftCreativeGeneration } from './craft-creative-generation'
import { skillOpt } from './skill-opt'
import { claudeCodeArchitecture } from './claude-code-architecture'
import { lossLandscapeAnalysis } from './loss-landscape-analysis'
import { mctsOptions } from './mcts-options'
import { monteCarloTreeDiffusion } from './monte-carlo-tree-diffusion'
import { dta } from './deep-transformers-atlas'
import { deepQNetworks } from './deep-q-networks'
import { phoneHarness } from './phone-harness'
import { perceptron } from './perceptron'
import { lenetGtn } from './lenet-gtn'
import { vibeCodingSdlc } from './vibe-coding-sdlc'
import { reinforcementLearning } from './reinforcement-learning'
import { backpropagation } from './backpropagation'

export const SUBJECTS: Subject[] = [
  dsa,
  sysdesign,
  lld,
  patterns,
  agentic,
  gpu,
  gpuDistributedTraining,
  parallelism,
  inferenceEngineering,
  appliedProbability,
  systemDesignInterview,
  reinforcementLearning,
]

/** Research papers, onboarded the same way as books but surfaced in their own section. */
export const PAPERS: Subject[] = [backpropagation, codeAsAgentHarness, clawvm, sira, intrinsicDimension, lora, agenticAiAdaptation, craftCreativeGeneration, skillOpt, claudeCodeArchitecture, lossLandscapeAnalysis, mctsOptions, monteCarloTreeDiffusion, dta, deepQNetworks, phoneHarness, perceptron, lenetGtn]

/** Industry whitepapers, onboarded the same way as books but surfaced in their own section. */
export const WHITEPAPERS: Subject[] = [vibeCodingSdlc]

export const ALL_SUBJECTS: Subject[] = [...SUBJECTS, ...PAPERS, ...WHITEPAPERS]
