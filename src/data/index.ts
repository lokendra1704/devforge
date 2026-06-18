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
import { iJepa } from './i-jepa'
import { varJepa } from './var-jepa'
import { vjepa2 } from './v-jepa-2'
import vlJepa from './vl-jepa'
import leWorldModel from './le-world-model'
import { leJepa } from './le-jepa'
import { lejepaiIdentifiability } from './lejepa-identifiability'
import { flashAttention } from './flash-attention'
import { flashAttention2 } from './flash-attention-2'
import { llmJepa } from './llm-jepa'
import { deepResidualLearning } from './deep-residual-learning'
import { alexnet } from './alexnet'
import { fastContext } from './fast-context'
import { metaclaw } from './metaclaw'
import { clawGui } from './claw-gui'
import { astra } from './astra'
import { autonomousMachineIntelligence } from './autonomous-machine-intelligence'
import { transformer } from './transformer'
import { layerNormalization } from './layer-normalization'
import { gruRnnEncoderDecoder } from './gru-rnn-encoder-decoder'
import { bahdanauAttention } from './bahdanau-attention'
import { xception } from './xception'

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
export const PAPERS: Subject[] = [backpropagation, codeAsAgentHarness, clawvm, sira, intrinsicDimension, lora, agenticAiAdaptation, craftCreativeGeneration, skillOpt, claudeCodeArchitecture, lossLandscapeAnalysis, mctsOptions, monteCarloTreeDiffusion, dta, deepQNetworks, phoneHarness, perceptron, lenetGtn, iJepa, varJepa, vjepa2, vlJepa, leWorldModel, leJepa, lejepaiIdentifiability, flashAttention, flashAttention2, llmJepa, deepResidualLearning, alexnet, fastContext, metaclaw, clawGui, astra, autonomousMachineIntelligence, transformer, layerNormalization, gruRnnEncoderDecoder, bahdanauAttention, xception]

export const WHITEPAPERS: Subject[] = [vibeCodingSdlc]

export const ALL_SUBJECTS: Subject[] = [...SUBJECTS, ...PAPERS, ...WHITEPAPERS]
