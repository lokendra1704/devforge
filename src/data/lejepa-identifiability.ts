import type { Subject } from '../types'
import motivationMd from './md/lje-motivation.md?raw'
import worldMd from './md/lje-world.md?raw'
import learnerMd from './md/lje-learner.md?raw'
import spectralMd from './md/lje-spectral.md?raw'
import theorem1Md from './md/lje-theorem1.md?raw'
import nonlinearityMd from './md/lje-nonlinearity.md?raw'
import theorem2Md from './md/lje-theorem2.md?raw'
import theorem3Md from './md/lje-theorem3.md?raw'
import theorem4Md from './md/lje-theorem4.md?raw'
import experimentsMd from './md/lje-experiments.md?raw'
import forwardExpMd from './md/lje-forward-exp.md?raw'
import converseExpMd from './md/lje-converse-exp.md?raw'
import planningExpMd from './md/lje-planning-exp.md?raw'
import proofTechMd from './md/lje-proof-tech.md?raw'
import proof1Md from './md/lje-proof1.md?raw'
import proofs234Md from './md/lje-proofs234.md?raw'
import sfaMd from './md/lje-sfa.md?raw'
import leanMd from './md/lje-lean.md?raw'

export const lejepaiIdentifiability: Subject = {
  id: 'lejepa-identifiability',
  title: 'When LeJEPA Learns a World Model',
  tagline: 'Linear identifiability and the uniqueness of Gaussian latents',
  icon: '🌍',
  accent: '#3b82f6',
  modules: [
    {
      id: 'lje-m1',
      title: 'Foundations',
      description: 'Understanding World Models, Gaussian latents, and the LeJEPA objective.',
      lessons: [
        {
          id: 'lje-motivation',
          title: 'The World Model Problem',
          minutes: 10,
          xp: 50,
          steps: [{ kind: 'read', title: 'What makes a true World Model?', markdown: motivationMd }],
        },
        {
          id: 'lje-world',
          title: 'The Gaussian World Model',
          minutes: 12,
          xp: 60,
          steps: [{ kind: 'read', title: 'Latent variables, transitions, and assumptions', markdown: worldMd }],
        },
        {
          id: 'lje-learner',
          title: 'LeJEPA: Architecture and Objectives',
          minutes: 11,
          xp: 55,
          steps: [{ kind: 'read', title: 'Alignment loss and Gaussian regularization', markdown: learnerMd }],
        },
      ],
    },
    {
      id: 'lje-m2',
      title: 'Spectral Theory and Forward Direction',
      description: 'Understanding why Gaussian worlds force linearity.',
      lessons: [
        {
          id: 'lje-spectral',
          title: 'Spectral Analysis and Hermite Polynomials',
          minutes: 13,
          xp: 65,
          steps: [{ kind: 'read', title: 'Transition operators, eigenfunctions, and the Hermite basis', markdown: spectralMd }],
        },
        {
          id: 'lje-theorem1',
          title: 'Theorem 1: Linear Identifiability in Gaussian Worlds',
          minutes: 12,
          xp: 60,
          steps: [{ kind: 'read', title: 'The forward direction: Gaussian worlds force rotations', markdown: theorem1Md }],
        },
        {
          id: 'lje-nonlinearity',
          title: 'Why Nonlinearity Reduces Correlation',
          minutes: 10,
          xp: 50,
          steps: [{ kind: 'read', title: 'The spectral bound and the cost of each degree of nonlinearity', markdown: nonlinearityMd }],
        },
      ],
    },
    {
      id: 'lje-m3',
      title: 'Converse, Approximations, and Planning',
      description: 'Why Gaussian is unique, what happens with approximate objectives, and how to plan.',
      lessons: [
        {
          id: 'lje-theorem2',
          title: 'Theorem 2: The Gaussian is Unique',
          minutes: 11,
          xp: 55,
          steps: [{ kind: 'read', title: 'Why non-Gaussian latents break linear identifiability', markdown: theorem2Md }],
        },
        {
          id: 'lje-theorem3',
          title: 'Theorem 3: Approximate Identifiability',
          minutes: 10,
          xp: 50,
          steps: [{ kind: 'read', title: 'How the guarantee degrades gracefully under misalignment', markdown: theorem3Md }],
        },
        {
          id: 'lje-theorem4',
          title: 'Theorem 4: Optimal Latent Planning',
          minutes: 11,
          xp: 55,
          steps: [{ kind: 'read', title: 'How linear identifiability enables planning in learned latent space', markdown: theorem4Md }],
        },
      ],
    },
    {
      id: 'lje-m4',
      title: 'Experiments and Validation',
      description: 'Empirical validation across 2D, high-dimensional, and robotic domains.',
      lessons: [
        {
          id: 'lje-experiments',
          title: 'Experimental Design and Setup',
          minutes: 11,
          xp: 55,
          steps: [{ kind: 'read', title: 'Methods, architectures, and evaluation metrics', markdown: experimentsMd }],
        },
        {
          id: 'lje-forward-exp',
          title: 'Forward Experiments: Linear Recovery from Gaussian Latents',
          minutes: 10,
          xp: 50,
          steps: [{ kind: 'read', title: 'Validating Theorem 1 across mixings and dimensions', markdown: forwardExpMd }],
        },
        {
          id: 'lje-converse-exp',
          title: 'Converse Experiments: Non-Gaussian Latents Break Linearity',
          minutes: 10,
          xp: 50,
          steps: [{ kind: 'read', title: 'Sweeping distributions and testing on real RL trajectories', markdown: converseExpMd }],
        },
        {
          id: 'lje-planning-exp',
          title: 'Latent Planning Validation and Practical Implications',
          minutes: 10,
          xp: 50,
          steps: [{ kind: 'read', title: 'Latent-space planning on goal-reaching tasks', markdown: planningExpMd }],
        },
      ],
    },
    {
      id: 'lje-m5',
      title: 'Mathematical Proofs and Extensions',
      description: 'Deep dives into the proofs, Lean formalization, and connections to prior work.',
      lessons: [
        {
          id: 'lje-proof-tech',
          title: 'Proof Techniques: Hermite Polynomials and Spectral Decomposition',
          minutes: 12,
          xp: 60,
          steps: [{ kind: 'read', title: 'Building intuition for the mathematical machinery', markdown: proofTechMd }],
        },
        {
          id: 'lje-proof1',
          title: 'Proof of Theorem 1: Linear Identifiability',
          minutes: 13,
          xp: 65,
          steps: [{ kind: 'read', title: 'Step-by-step proof using Hermite polynomials', markdown: proof1Md }],
        },
        {
          id: 'lje-proofs234',
          title: 'Proofs of Theorems 2, 3, and 4',
          minutes: 14,
          xp: 70,
          steps: [{ kind: 'read', title: 'Converse, approximation, and optimal control proofs', markdown: proofs234Md }],
        },
        {
          id: 'lje-sfa',
          title: 'Connection to Slow Feature Analysis',
          minutes: 11,
          xp: 55,
          steps: [{ kind: 'read', title: 'Relating LeJEPA identifiability to SFA theory', markdown: sfaMd }],
        },
        {
          id: 'lje-lean',
          title: 'Lean Formalization and Verification',
          minutes: 11,
          xp: 55,
          steps: [{ kind: 'read', title: 'What axioms are formalized, and how to read Lean proofs', markdown: leanMd }],
        },
      ],
    },
  ],
}
