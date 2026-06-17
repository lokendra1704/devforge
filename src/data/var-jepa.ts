import type { Subject } from '../types'
import vjMotivationMd from './md/vj-motivation.md?raw'
import vjJepaBackgroundMd from './md/vj-jepa-background.md?raw'
import vjVariationalPerspectiveMd from './md/vj-variational-perspective.md?raw'
import vjElboCollapseMd from './md/vj-elbo-collapse.md?raw'
import vjExperimentsMd from './md/vj-experiments.md?raw'

export const varJepa: Subject = {
  id: 'var-jepa',
  title: 'Var-JEPA: Variational Joint-Embedding Predictive Architecture',
  tagline: 'Bridging predictive and generative self-supervised learning with principled variational inference',
  icon: '🔄',
  accent: '#7c3aed',
  modules: [
    {
      id: 'vj-m1',
      title: 'Understanding Var-JEPA',
      description: 'Learn how JEPA\'s predictive architecture naturally emerges from variational inference, unifying self-supervised learning with probabilistic generative modeling.',
      lessons: [
        {
          id: 'vj-m1-l1',
          title: 'The Collapse Problem in JEPA',
          minutes: 10,
          xp: 120,
          steps: [
            {
              kind: 'read',
              title: 'The Collapse Problem in JEPA',
              markdown: vjMotivationMd
            },
            {
              kind: 'scenario',
              title: 'Fixing Collapse in JEPA',
              scenario: {
                intro: 'You\'re training a JEPA model on unlabeled image data. After a few iterations, all encoder outputs become near-identical constant vectors.',
                stages: [
                  {
                    situation: 'The model has collapsed. What\'s happening, and what\'s one way to fix it?',
                    question: 'Which approach best addresses the underlying issue?',
                    options: [
                      {
                        label: 'Add Exponential Moving Average (EMA) updates to the target encoder',
                        quality: 'ok',
                        feedback: 'This is one common fix used in practice (e.g., I-JEPA, V-JEPA), but it\'s an architectural heuristic rather than a principled solution from the objective itself.'
                      },
                      {
                        label: 'Apply a variance or covariance penalty to regularize the embedding distribution',
                        quality: 'ok',
                        feedback: 'This directly addresses collapse by enforcing feature-wise variance, as proposed in recent work (Drozdov et al., 2024), but still requires a separate regularizer.'
                      },
                      {
                        label: 'Derive the objective from a probabilistic model with an explicit prior on the latents',
                        quality: 'best',
                        feedback: 'This is the Var-JEPA insight: if you frame JEPA as variational inference, an ELBO naturally prevents collapse without ad-hoc fixes—the prior does the regularization.'
                      }
                    ]
                  }
                ],
                debrief: 'The key insight is that collapse can be prevented not through heuristics, but through a principled probabilistic objective. This is where Var-JEPA differs from standard JEPA.'
              }
            }
          ]
        },
        {
          id: 'vj-m1-l2',
          title: 'Why JEPA Works, and Why It\'s Missing Something',
          minutes: 12,
          xp: 140,
          steps: [
            {
              kind: 'read',
              title: 'Why JEPA Works, and Why It\'s Missing Something',
              markdown: vjJepaBackgroundMd
            },
            {
              kind: 'quiz',
              title: 'Understanding JEPA\'s Core Design',
              questions: [
                {
                  prompt: 'What is the main purpose of the stop-gradient operation in JEPA?',
                  options: [
                    'To speed up training by blocking unnecessary backward passes',
                    'To prevent the model from learning trivial solutions by breaking gradient flow into the target encoder',
                    'To enforce orthogonality in the learned representations',
                    'To reduce memory consumption during forward passes'
                  ],
                  answer: 1,
                  explanation: 'Correct. Without stop-gradient, both encoders would trivially minimize loss by outputting identical vectors, making the predictor unnecessary. Stop-gradient forces the predictor to do real work.'
                },
                {
                  prompt: 'JEPA succeeds at learning good representations without generative modeling. So why might a probabilistic interpretation still be valuable?',
                  options: [
                    'It allows us to measure how confident the model is in its predictions (uncertainty quantification)',
                    'It gives us principled regularization and clarity about why JEPA needs extra losses to avoid collapse',
                    'It lets us train JEPA faster by removing the predictor entirely',
                    'All of the above'
                  ],
                  answer: 1,
                  explanation: 'The variational perspective reveals why collapse happens and how to fix it via the ELBO, without ad-hoc regularizers like EMA or variance penalties.'
                }
              ]
            },
            {
              kind: 'scenario',
              title: 'Interpreting JEPA as a Probabilistic Model',
              scenario: {
                intro: 'Your team is adding uncertainty quantification to their JEPA-based model. Someone suggests: "just add a Gaussian prior to the encoder outputs." Your colleague responds: "JEPA is already a VAE if you look at it right."',
                stages: [
                  {
                    situation: 'Which interpretation is more correct, and why does it matter?',
                    question: 'What is JEPA\'s true relationship to probabilistic models?',
                    options: [
                      {
                        label: 'JEPA is fundamentally non-probabilistic; adding a prior is bolting on uncertainty after the fact',
                        quality: 'bad',
                        feedback: 'This misses the key insight. JEPA is actually a deterministic specialization of a VAE-like coupled latent-variable model.'
                      },
                      {
                        label: 'JEPA\'s architecture naturally emerges from variational inference on a coupled VAE; its "non-generative" framing is rhetorical, not structural',
                        quality: 'best',
                        feedback: 'Exactly. The coupled encoders and predictor are not accident—they\'re what you get when you reverse-engineer the generative model from JEPA\'s architecture.'
                      }
                    ]
                  }
                ],
                debrief: 'This reframing is crucial: JEPA was never truly non-generative. Understanding this connection opens the door to Var-JEPA, which makes the generative structure explicit.'
              }
            }
          ]
        },
        {
          id: 'vj-m1-l3',
          title: 'From Deterministic to Probabilistic: The Variational Insight',
          minutes: 14,
          xp: 160,
          steps: [
            {
              kind: 'read',
              title: 'From Deterministic to Probabilistic: The Variational Insight',
              markdown: vjVariationalPerspectiveMd
            },
            {
              kind: 'scenario',
              title: 'Understanding the Auxiliary Variable z',
              scenario: {
                intro: 'In Var-JEPA\'s generative model, the target latent s_y is predicted from context s_x and an auxiliary variable z.',
                stages: [
                  {
                    situation: 'Your domain has stochastic relationships between context and target. For example, given a context view of a video frame, the next frame could move in multiple directions.',
                    question: 'What is z\'s role, and why is it needed?',
                    options: [
                      {
                        label: 'z captures variability in the target that the context alone cannot explain',
                        quality: 'best',
                        feedback: 'Correct. Without z, the model would be deterministic (s_y = g(s_x)), which is too restrictive for real problems where targets vary given the same context.'
                      },
                      {
                        label: 'z is a noise term to regularize training, similar to dropout',
                        quality: 'ok',
                        feedback: 'While z does add stochasticity, its purpose is more fundamental: it models genuine target variability independent of context, not just regularization noise.'
                      },
                      {
                        label: 'z replaces the stop-gradient operation from standard JEPA',
                        quality: 'bad',
                        feedback: 'No. z and stop-gradient serve different purposes. Stop-gradient is an architectural trick; z is a latent random variable in the generative model.'
                      }
                    ]
                  }
                ],
                debrief: 'The auxiliary variable z is key to Var-JEPA\'s flexibility: it allows the model to capture target variability that goes beyond what the context alone determines.'
              }
            }
          ]
        },
        {
          id: 'vj-m1-l4',
          title: 'The ELBO Objective and Why It Prevents Collapse',
          minutes: 16,
          xp: 200,
          steps: [
            {
              kind: 'read',
              title: 'The ELBO Objective and Why It Prevents Collapse',
              markdown: vjElboCollapseMd
            },
            {
              kind: 'code',
              title: 'Implement ELBO Computation',
              challenge: {
                prompt: 'Implement a function to compute the ELBO lower bound for a simplified Var-JEPA model. Given parameterized variational posteriors and generative distributions, compute the ELBO as the reconstruction term minus the KL divergence.\n\nThe ELBO decomposes as:\nELBO = E_q[log p(y | s_y)] - KL(q(s_y | s_x, z, y) || p(s_y | s_x, z))',
                starterCode: `import torch
import torch.nn.functional as F
from torch.distributions import Normal

def compute_elbo(
    y: torch.Tensor,
    q_sy_mu: torch.Tensor, q_sy_sigma: torch.Tensor,
    p_y_mu: torch.Tensor, p_y_sigma: torch.Tensor,
    p_sy_mu: torch.Tensor, p_sy_sigma: torch.Tensor,
) -> torch.Tensor:
    """
    Compute the ELBO for Var-JEPA.

    Args:
        y: target observations (B, D)
        q_sy_mu, q_sy_sigma: parameters of q(s_y | s_x, z, y)
        p_y_mu, p_y_sigma: parameters of p(y | s_y)
        p_sy_mu, p_sy_sigma: parameters of p(s_y | s_x, z)

    Returns:
        ELBO (scalar, average over batch)
    """
    # Sample s_y from the posterior q(s_y | s_x, z, y)
    q_sy = Normal(q_sy_mu, q_sy_sigma)
    s_y = q_sy.rsample()  # reparameterization trick

    # Reconstruction term: E_q[log p(y | s_y)]
    # TODO: compute log probability of y under the predictive distribution

    # KL divergence term: KL(q(s_y | s_x, z, y) || p(s_y | s_x, z))
    # TODO: compute KL divergence between posterior and prior

    # ELBO = reconstruction - KL
    # TODO: return the ELBO
    pass

# Test setup
batch_size, d_obs, d_latent = 8, 10, 4
y = torch.randn(batch_size, d_obs)
q_sy_mu = torch.randn(batch_size, d_latent)
q_sy_sigma = torch.ones(batch_size, d_latent) * 0.1
p_y_mu = torch.randn(batch_size, d_obs)
p_y_sigma = torch.ones(batch_size, d_obs) * 0.1
p_sy_mu = torch.randn(batch_size, d_latent)
p_sy_sigma = torch.ones(batch_size, d_latent) * 0.1

elbo = compute_elbo(y, q_sy_mu, q_sy_sigma, p_y_mu, p_y_sigma, p_sy_mu, p_sy_sigma)
`,
                solution: `import torch
import torch.nn.functional as F
from torch.distributions import Normal

def compute_elbo(
    y: torch.Tensor,
    q_sy_mu: torch.Tensor, q_sy_sigma: torch.Tensor,
    p_y_mu: torch.Tensor, p_y_sigma: torch.Tensor,
    p_sy_mu: torch.Tensor, p_sy_sigma: torch.Tensor,
) -> torch.Tensor:
    """Compute the ELBO for Var-JEPA."""
    # Sample s_y from the posterior
    q_sy = Normal(q_sy_mu, q_sy_sigma)
    s_y = q_sy.rsample()

    # Reconstruction term: E_q[log p(y | s_y)]
    p_y = Normal(p_y_mu, p_y_sigma)
    log_p_y_given_sy = p_y.log_prob(y).sum(dim=-1).mean()

    # KL divergence: KL(q(s_y) || p(s_y))
    p_sy = Normal(p_sy_mu, p_sy_sigma)
    kl_div = torch.distributions.kl_divergence(q_sy, p_sy).sum(dim=-1).mean()

    # ELBO
    elbo = log_p_y_given_sy - kl_div
    return elbo
`,
                tests: `test('ELBO should be a valid number', () => {
  const elbo = compute_elbo(y, q_sy_mu, q_sy_sigma, p_y_mu, p_y_sigma, p_sy_mu, p_sy_sigma);
  assertEqual(!isNaN(elbo), true, 'ELBO should not be NaN');
});

test('ELBO improves when predictions match targets', () => {
  const q_sy_mu_perfect = p_sy_mu;
  const q_sy_sigma_perfect = torch.ones(batch_size, d_latent) * 0.01;
  const p_y_mu_perfect = y;
  const p_y_sigma_perfect = torch.ones(batch_size, d_obs) * 0.01;
  
  const elbo_bad = compute_elbo(y, q_sy_mu, q_sy_sigma, p_y_mu, p_y_sigma, p_sy_mu, p_sy_sigma);
  const elbo_good = compute_elbo(y, q_sy_mu_perfect, q_sy_sigma_perfect, p_y_mu_perfect, p_y_sigma_perfect, p_sy_mu, p_sy_sigma);
  
  assertEqual(elbo_good > elbo_bad, true, 'ELBO should be higher when predictions match targets');
});

test('KL term penalizes divergence from prior', () => {
  const q_sy_sigma_large = torch.ones(batch_size, d_latent) * 10.0;
  
  const elbo_narrow = compute_elbo(y, q_sy_mu, q_sy_sigma, p_y_mu, p_y_sigma, p_sy_mu, p_sy_sigma);
  const elbo_wide = compute_elbo(y, q_sy_mu, q_sy_sigma_large, p_y_mu, p_y_sigma, p_sy_mu, p_sy_sigma);
  
  assertEqual(elbo_wide < elbo_narrow, true, 'ELBO should be lower when posterior diverges from prior');
});
`
              }
            }
          ]
        },
        {
          id: 'vj-m1-l5',
          title: 'Empirical Results: Tabular Data',
          minutes: 11,
          xp: 130,
          steps: [
            {
              kind: 'read',
              title: 'Empirical Results: Tabular Data',
              markdown: vjExperimentsMd
            },
            {
              kind: 'scenario',
              title: 'Why Var-T-JEPA Wins on Tabular Data',
              scenario: {
                intro: 'Var-T-JEPA shows consistent gains over standard T-JEPA on tabular data downstream tasks. You\'re deciding whether to adopt it in your pipeline.',
                stages: [
                  {
                    situation: 'Your domain has complex, heterogeneous tabular features. Collapse has been a practical concern in your JEPA experiments.',
                    question: 'What is the main source of Var-T-JEPA\'s improvement?',
                    options: [
                      {
                        label: 'The ELBO objective provides better regularization, preventing collapse and preserving learned feature diversity',
                        quality: 'best',
                        feedback: 'Correct. Since Var-JEPA avoids collapse without ad-hoc regularizers, the learned representations retain more meaningful structure across iterations.'
                      },
                      {
                        label: 'The reparameterization trick allows the model to sample more diverse representations during training',
                        quality: 'ok',
                        feedback: 'While the reparameterization trick is used, sampling diversity alone doesn\'t explain the gain—the principled regularization from the ELBO is key.'
                      },
                      {
                        label: 'Tabular data has inherent structure that makes EMA updates (used in T-JEPA) ineffective',
                        quality: 'bad',
                        feedback: 'This is not the main reason. The improvement comes from Var-JEPA\'s principled objective, not from limitations of EMA.'
                      }
                    ]
                  },
                  {
                    situation: 'You need to decide between using T-JEPA with careful hyperparameter tuning (EMA decay, variance penalty weights) or Var-T-JEPA with fewer knobs.',
                    question: 'What\'s a key advantage of Var-T-JEPA\'s design?',
                    options: [
                      {
                        label: 'Fewer hyperparameters—the ELBO objective handles regularization without separate penalty terms',
                        quality: 'best',
                        feedback: 'Yes. Var-JEPA inherently prevents collapse through the KL term; you don\'t need to tune EMA schedules or variance penalty weights.'
                      },
                      {
                        label: 'It runs faster because it doesn\'t use the reparameterization trick',
                        quality: 'bad',
                        feedback: 'Var-JEPA does use the reparameterization trick. The trade-off is correctness for some speed, not the other way around.'
                      }
                    ]
                  }
                ],
                debrief: 'Var-JEPA trades a small amount of computational overhead (sampling via reparameterization) for a principled, hyperparameter-light objective that genuinely solves collapse and provides uncertainty estimates.'
              }
            }
          ]
        }
      ]
    }
  ]
}
