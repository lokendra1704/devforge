import type { Subject } from '../types'

export const leJepa: Subject = {
  id: 'le-jepa',
  title: 'LeJEPA: Learning Euclidean Joint-Embedding Predictive Architectures',
  tagline: 'Principled self-supervised learning via isotropic Gaussian embeddings, eliminating collapse heuristics and scaling to billions of parameters.',
  icon: '🧠',
  accent: '#4A90E2',
  modules: [
    {
      id: 'lj-m1',
      title: 'The JEPA Challenge: Collapse and Heuristics',
      description: 'Understanding representation collapse in JEPAs and why current heuristics are insufficient without a principled foundation.',
      lessons: [
        {
          id: 'lj-l1',
          title: 'Why JEPAs Fail: The Representation Collapse Problem',
          minutes: 15,
          xp: 75,
          steps: [
            {
              kind: 'read',
              title: 'The Problem with JEPA Shortcuts',
              markdown: `# The Problem with JEPA Shortcuts

You're training a model to predict embeddings of related image views. It should learn meaningful features—objects, textures, structure. Instead, on day 2, it maps everything to nearly identical vectors. All images collapse to the same point.

Why? Because the prediction task alone doesn't enforce *diversity*. The network found the easiest solution: ignore the input, produce the same embedding for everything. Prediction "succeeds" (collapsed embeddings are trivially predictable), but the embedding is worthless.

## Three Failure Modes

**Complete collapse**: $f_\\theta(x)$ outputs the same constant vector for all inputs. The prediction task is satisfied (nothing to predict), but the representation is useless downstream.

**Dimensional collapse**: Embeddings cluster onto a low-dimensional subspace (e.g., a line in a 1024-dimensional space). The model is picking up *some* variation but has given up on the full embedding space.

**Spectral collapse**: Eigenvalues of the embedding covariance matrix concentrate on a few large values. Dimensionality is preserved, but redundancy is rampant—many embedding dimensions carry identical information.

## Why Current Safeguards Feel Like Hacks

Today's JEPA recipes combine multiple under-specified heuristics:
- **Stop-gradient**: Block gradients through one view's encoder, forcing asymmetry. But tuning the EMA schedule is brittle.
- **Teacher-student networks**: Use a slowly-updated copy of the encoder. Works empirically, but which schedule?
- **Explicit whitening**: Force embeddings to stay orthogonal. Linear complexity per batch, but memory-intensive at scale.
- **Negative samples**: Compare against unrelated images. But how many? How do you sample them?

Each mechanism *sometimes* prevents collapse, but none of them guarantees it. They interact unpredictably across datasets, architectures, and batch sizes. The result: training is finicky, and theoretical understanding is nil.

## The Missing Question

Before asking "how do we prevent collapse?", ask: "What distribution should embeddings follow in the first place?"

If we knew the *optimal* embedding distribution, we could enforce it directly rather than guessing at indirect safeguards.`,
            },
            {
              kind: 'quiz',
              title: 'Check: Understanding Collapse',
              questions: [
                {
                  prompt: 'Which of the following best describes dimensional collapse?',
                  options: [
                    'The model outputs the same vector for all inputs',
                    'Embeddings cluster onto a low-dimensional subspace while preserving some variation',
                    'Eigenvalues of the covariance matrix are all equal',
                    'The encoder learns different weights for each input',
                  ],
                  answer: 1,
                  explanation: 'Dimensional collapse occurs when embeddings concentrate on a low-rank manifold (e.g., rank-10 subspace in 1024D), capturing variation within that subspace but ignoring the rest of the space.',
                },
                {
                  prompt: 'Why do teacher-student networks with EMA schedules represent a brittle design choice?',
                  options: [
                    'They require too much computation at scale',
                    'They introduce an additional hyperparameter (EMA decay) that must be tuned per dataset and architecture',
                    'They only work with convolutional networks',
                    'They cannot prevent dimensional collapse',
                  ],
                  answer: 1,
                  explanation: 'The EMA schedule is not principled—it is an empirical knob that interacts unpredictably with other design choices. A different dataset or architecture often requires retuning.',
                },
              ],
            },
          ],
        },
        {
          id: 'lj-l2',
          title: 'What Makes a Good Embedding Distribution?',
          minutes: 15,
          xp: 75,
          steps: [
            {
              kind: 'read',
              title: 'The Optimal Embedding Distribution',
              markdown: `# The Optimal Embedding Distribution

Here's the core question the paper asks: **If you could design the perfect embedding distribution, what would it look like?**

To answer this, the authors ask a simpler question first: *What distribution minimizes the downstream prediction error when you probe the embeddings?*

A "probe" is a small classifier you train on top of the fixed embeddings to solve a downstream task (e.g., image classification). If the embedding distribution is optimal for all downstream tasks, then any probe you build on top should perform well.

## Linear Probing: The Simplest Baseline

Imagine you have a batch of embeddings $z_1, z_2, \\ldots, z_n$ from your encoder $f_\\theta$, with corresponding labels $y_1, y_2, \\ldots, y_n$.

A **linear probe** fits a linear classifier:
$$\\hat{y} = w^T z + b$$

on the embeddings to predict the label. The question: What distribution of $z$ minimizes the probe's generalization error?

The answer turns out to be: **isotropic Gaussian**.

Why? Because a Gaussian distribution has no preferred direction. An isotropic Gaussian (covariance $\\sigma^2 I$) treats all embedding dimensions equally. This means the linear classifier doesn't favor some dimensions over others—it extracts signal uniformly across the space.

If embeddings were, say, concentrated along a line, a linear classifier would be blind to directions orthogonal to that line. It'd have an advantage in the line-direction but wouldn't use the rest of the space, leading to higher bias or lower effective capacity.

## Nonlinear Probing: A Richer Picture

Beyond linear probes, the paper shows the same result holds for:
- **k-NN classifiers**: Find $k$ nearest neighbors and vote.
- **Kernel classifiers**: Fit a kernel SVM or other kernel method.

The proof uses the Cramér-Wold theorem—if projections of a random variable along all 1D directions match the projections of an isotropic Gaussian, then the variable *is* isotropic Gaussian. This one-dimensional characterization is key: checking all 1D slices is equivalent to checking the full distribution.

So the answer generalizes: across a broad family of downstream tasks, **isotropic Gaussian embeddings minimize risk**.`,
            },
            {
              kind: 'scenario',
              title: 'Scenario: Collapsed Embeddings and Linear Probes',
              scenario: {
                intro: `You train a JEPA and see that embeddings form a line (1D subspace in 1024D). You then train a linear probe on top to evaluate downstream performance.`,
                stages: [
                  {
                    situation: 'Your embeddings lie entirely on a 1-dimensional line through the 1024D space.',
                    question: 'What happens when you train a linear probe on this collapsed representation?',
                    options: [
                      {
                        label: 'The linear probe works perfectly because the embeddings are simpler',
                        quality: 'bad',
                        feedback: 'No. A linear probe can only extract signal along the line and is effectively blind to the other 1023 dimensions. The probe has a low effective capacity despite simplicity.',
                      },
                      {
                        label: 'The linear probe suffers because it cannot leverage the high-dimensional space',
                        quality: 'best',
                        feedback: 'Correct. The probe can only work with 1D information. Even though the classifier can learn to separate classes along that line, it is underutilizing the embedding space and will generalize poorly.',
                      },
                      {
                        label: 'The linear probe automatically learns a 1D classifier, which is optimal',
                        quality: 'ok',
                        feedback: 'The probe will learn along the line, but this is a limitation, not an advantage. The probe is constrained and cannot use the full embedding dimensionality.',
                      },
                    ],
                  },
                ],
                debrief: `This demonstrates why isotropic Gaussian embeddings are crucial: they ensure that all directions in the embedding space carry signal, so downstream probes can extract maximum information regardless of which task they are solving.`,
              },
            },
          ],
        },
      ],
    },
    {
      id: 'lj-m2',
      title: 'SIGReg: Enforcing Isotropic Gaussian Distributions',
      description: 'From theory to practice: enforcing isotropic Gaussian embeddings via characteristic functions and the SIGReg regularization method.',
      lessons: [
        {
          id: 'lj-l3',
          title: 'Testing for Multivariate Normality: Three Approaches',
          minutes: 20,
          xp: 100,
          steps: [
            {
              kind: 'read',
              title: 'How to Enforce an Isotropic Gaussian Distribution?',
              markdown: `# How to Enforce an Isotropic Gaussian Distribution?

We've established that isotropic Gaussian embeddings are theoretically optimal. Now the practical question: **How do we enforce this in training?**

The naive approach: "Check if embeddings are Gaussian, and if not, apply a loss to make them more Gaussian."

But how do you *check* if embeddings are Gaussian? In high dimensions, this is surprisingly tricky.

## Three Statistical Approaches (and Why Two Fail)

### Approach 1: Moments (Mean and Covariance)

Fit a Gaussian to the batch by computing empirical mean $\\hat{\\mu}$ and covariance $\\hat{\\Sigma}$. Then minimize:
$$L = ||\\hat{\\mu}||^2 + ||\\hat{\\Sigma} - I||_F^2$$

**Problem**: A Gaussian is fully characterized by its first two moments, so this seems sensible. But it is unstable in high dimensions.

With only a minibatch (say, 256 samples), estimating a $1024 \\times 1024$ covariance matrix is extremely noisy. A batch-sized fluctuation in one dimension can look like a huge shift. The gradient becomes unreliable, and training oscillates.

### Approach 2: Empirical CDF (Cumulative Distribution Function)

Instead of moments, compare the empirical cumulative distribution. If embeddings follow an isotropic Gaussian, their empirical CDF should match a Gaussian CDF.

**Problem**: Computing an empirical CDF involves sorting, which doesn't differentiate smoothly. Gradients are sparse and uninformative.

### Approach 3: Characteristic Function (The Winning Strategy)

The **characteristic function** is the Fourier transform of a distribution:
$$\\phi(t) = \\mathbb{E}[e^{it^T X}]$$

For an isotropic Gaussian $N(0, I)$:
$$\\phi(t) = e^{-\\frac{1}{2} ||t||^2}$$

Why is this better?

1. **Fully informative**: The characteristic function completely characterizes the distribution.
2. **Stable in high dimensions**: Evaluating $e^{it^T X}$ is numerically stable—complex exponentials are well-behaved.
3. **Easy to differentiate**: Backpropagation through $e^{it^T X}$ produces bounded gradients.
4. **One-dimensional projections suffice**: By the Cramér-Wold theorem, if all 1D projections are Gaussian, the full distribution is Gaussian.

This is the insight behind **SIGReg**: use random projections and characteristic functions.`,
            },
            {
              kind: 'quiz',
              title: 'Check: Characteristic Functions and Cramér-Wold',
              questions: [
                {
                  prompt: 'Which property of the characteristic function makes it preferable to moment-based matching in high dimensions?',
                  options: [
                    'It only depends on the mean and covariance',
                    'It relies on 1D projections via the Cramér-Wold theorem, avoiding direct high-dimensional comparisons',
                    'It is invariant to rotation',
                    'It requires fewer parameters to store than a covariance matrix',
                  ],
                  answer: 1,
                  explanation: 'The Cramér-Wold theorem is the linchpin: verifying that all 1D projections are Gaussian is equivalent to verifying the full distribution is isotropic Gaussian. This reduces complexity.',
                },
                {
                  prompt: 'Why does moment-based matching become unstable with large embedding dimensions?',
                  options: [
                    'Gradients become too large and explode',
                    'Estimating the full covariance matrix from a minibatch is extremely noisy, and batch-sized fluctuations look like distribution shifts',
                    'The computational cost becomes prohibitive',
                    'Moment-based methods cannot distinguish between Gaussian and non-Gaussian distributions',
                  ],
                  answer: 1,
                  explanation: 'With a $d \\times d$ covariance matrix estimated from a minibatch of $n$ samples, the noise scales as $O(1/\\sqrt{n})$ per element. In high dimensions, this noise is significant.',
                },
              ],
            },
            {
              kind: 'code',
              title: 'Implement a Multivariate Normality Test',
              challenge: {
                prompt: 'Write a function to test if embeddings follow a multivariate isotropic Gaussian using random 1D projections and a goodness-of-fit test. Use Shapiro-Wilk test for each 1D projection.',
                starterCode: `import numpy as np

def test_multivariate_normality(embeddings: np.ndarray, num_projections: int = 10) -> dict:
    """
    Test if embeddings follow an isotropic Gaussian using random 1D projections.

    Args:
        embeddings: shape (N, D) - batch of embeddings
        num_projections: how many random 1D projections to check

    Returns:
        dict with 'is_normal', 'p_values', 'mean_p_value'
    """
    pass`,
                solution: `import numpy as np
from scipy.stats import shapiro

def test_multivariate_normality(embeddings: np.ndarray, num_projections: int = 10) -> dict:
    """
    Test if embeddings follow an isotropic Gaussian using random 1D projections.

    Args:
        embeddings: shape (N, D) - batch of embeddings
        num_projections: how many random 1D projections to check

    Returns:
        dict with 'is_normal', 'p_values', 'mean_p_value'
    """
    N, D = embeddings.shape
    p_values = []
    threshold = 0.05

    for _ in range(num_projections):
        direction = np.random.randn(D)
        direction /= np.linalg.norm(direction)
        z_proj = embeddings @ direction
        z_proj = (z_proj - np.mean(z_proj)) / (np.std(z_proj) + 1e-8)
        stat, p_value = shapiro(z_proj)
        p_values.append(p_value)

    is_normal = np.mean(p_values) > threshold
    return {
        'is_normal': is_normal,
        'p_values': p_values,
        'mean_p_value': np.mean(p_values),
    }`,
                tests: `test("Gaussian samples should pass normality test", () => {
  const embeddings = Array.from({length: 100}, () =>
    Array.from({length: 64}, () => Math.random() * 2 - 1)
  );
  const result = test_multivariate_normality(embeddings);
  assertEqual(result.is_normal, true, "Gaussian samples failed the test");
});

test("Collapsed (constant) embeddings should fail", () => {
  const embeddings = Array.from({length: 100}, () =>
    Array.from({length: 64}, () => 1.0)
  );
  const result = test_multivariate_normality(embeddings);
  assertEqual(result.is_normal, false, "Collapsed embeddings passed the test");
});

test("Low-rank embeddings should fail", () => {
  const embeddings = Array.from({length: 100}, () => {
    const val = Math.random();
    return Array.from({length: 64}, () => val);
  });
  const result = test_multivariate_normality(embeddings);
  assertEqual(result.is_normal, false, "Low-rank embeddings passed the test");
});`,
              },
            },
          ],
        },
        {
          id: 'lj-l4',
          title: 'SIGReg: The Complete Algorithm',
          minutes: 18,
          xp: 90,
          steps: [
            {
              kind: 'read',
              title: 'Sketched Isotropic Gaussian Regularization (SIGReg)',
              markdown: `# Sketched Isotropic Gaussian Regularization (SIGReg)

Now that we have a way to test for multivariate Gaussian distributions via characteristic functions, we can design a training objective.

## The Algorithm

**Sketched Isotropic Gaussian Regularization (SIGReg)** works as follows:

1. **Compute embeddings** from a batch: $z_1, z_2, \\ldots, z_n = f_\\theta(x_1), \\ldots, f_\\theta(x_n)$.

2. **Generate random projections**: Sample $k$ random unit vectors $t_1, \\ldots, t_k \\in \\mathbb{R}^d$ (e.g., $k \\ll d$).

3. **Project embeddings**: For each direction $t_i$, compute 1D projections:
   $$s_i^{(j)} = t_i^T z_j, \\quad j = 1, \\ldots, n$$

4. **Evaluate characteristic functions**: For each 1D slice $s_i$, compute its empirical characteristic function at several evaluation points $\\omega_1, \\ldots, \\omega_m$.

5. **Compute the loss**: Sum the squared differences between empirical and target characteristic functions.

6. **Backprop**: The loss is fully differentiable; gradient descent updates $\\theta$.

## Why This Works

- **Full distribution matching**: Captures the entire distribution shape, including tails.
- **Numerical stability**: Complex exponentials have bounded magnitude, so gradients do not explode.
- **Cramér-Wold coverage**: If all 1D projections match an isotropic Gaussian, the full distribution is.
- **Linear memory**: Projecting $n$ embeddings onto $k$ directions costs $O(ndk)$. For small $k$, this is nearly linear.

## Hyperparameter: The Trade-off

LeJEPA combines:
$$L_\\text{LeJEPA} = L_\\text{prediction} + \\lambda \\cdot L_\\text{SIGReg}$$

A *single* $\\lambda$ (e.g., $\\lambda = 1.0$ or $2.0$) works across datasets, architectures, and scales. This unification is remarkable—typical JEPAs require tuning.`,
            },
            {
              kind: 'scenario',
              title: 'Scenario: Balancing Prediction and Regularization',
              scenario: {
                intro: 'You are training LeJEPA with different values of λ. Consider the trade-offs.',
                stages: [
                  {
                    situation: 'With λ=0.1 (weak SIGReg), embeddings remain diverse but begin to collapse on day 5 of training.',
                    question: 'What is happening and what should you do?',
                    options: [
                      {
                        label: 'SIGReg is too weak to prevent collapse; increase λ',
                        quality: 'best',
                        feedback: 'Correct. A low λ means the SIGReg regularization is under-weighted, allowing collapse to slip through. Increase λ to enforce isotropic structure.',
                      },
                      {
                        label: 'The prediction loss is too strong; decrease learning rate',
                        quality: 'ok',
                        feedback: 'Decreasing the learning rate might help stability, but the root cause is insufficient regularization. Better to increase λ.',
                      },
                      {
                        label: 'Use a stop-gradient or teacher-student network instead',
                        quality: 'bad',
                        feedback: 'That reintroduces the heuristics LeJEPA avoids. The principled solution is to increase λ.',
                      },
                    ],
                  },
                  {
                    situation: 'With λ=10.0 (very strong SIGReg), embeddings are perfectly Gaussian but downstream validation accuracy stagnates.',
                    question: 'What is the problem?',
                    options: [
                      {
                        label: 'SIGReg is too strong, forcing embeddings to be so constrained that they lose task-relevant structure',
                        quality: 'best',
                        feedback: 'Correct. Overconstraining to isotropy removes the flexibility for embeddings to capture semantic structure. Decrease λ to balance prediction and isotropy.',
                      },
                      {
                        label: 'The model is underfitting and needs more parameters',
                        quality: 'bad',
                        feedback: 'If embeddings are already perfectly Gaussian, the issue is not capacity but over-regularization.',
                      },
                      {
                        label: 'The dataset is too small for this method',
                        quality: 'bad',
                        feedback: 'LeJEPA works well on small domain-specific datasets. The issue is the λ value, not the data.',
                      },
                    ],
                  },
                ],
                debrief: 'The optimal λ balances isotropy (via SIGReg) and semantic structure (via prediction). Theory provides bounds, but empirical validation helps find the sweet spot.',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'lj-m3',
      title: 'LeJEPA: Implementation and Empirical Validation',
      description: 'Putting theory into practice: the LeJEPA architecture, scaling properties, and empirical results across diverse settings.',
      lessons: [
        {
          id: 'lj-l5',
          title: 'LeJEPA in Practice: Simplicity and Stability',
          minutes: 16,
          xp: 80,
          steps: [
            {
              kind: 'read',
              title: 'The LeJEPA Architecture',
              markdown: `# Putting It Together: LeJEPA

LeJEPA is remarkably simple: it is just a JEPA with SIGReg added.

## The Training Loop

1. **Sample two related views** from the data (e.g., crops/augmentations of an image, consecutive video frames).
2. **Encode both views**: $z = f_\\theta(x_1)$, $z' = f_\\theta(x_2)$.
3. **Compute prediction loss**: Predict $z'$ from $z$ (via MSE or similar).
4. **Compute SIGReg loss**: Test if $z$ is isotropic Gaussian.
5. **Total loss**: $L = L_\\text{pred} + \\lambda L_\\text{SIGReg}$.
6. **Update**: Gradient descent on $\\theta$.

## Why No Heuristics?

Traditional JEPAs use stop-gradient, teacher-student networks, explicit whitening, and negative samples.

LeJEPA needs *none of these*.

Why? Because SIGReg directly enforces the structure we want: embeddings that are both (i) predictable and (ii) isotropically Gaussian. There is no shortcut—you cannot collapse and still pass the SIGReg test.

## Single Hyperparameter, Universal Across Domains

The authors found that a single value of $\\lambda$ works across:
- Different datasets (ImageNet, CIFAR, domain-specific datasets)
- Different architectures (ViT, ResNet, ConvNeXt, Swin, MaxViT)
- Different scales (from millions to billions of parameters)

This is extraordinary. Most other JEPAs require per-dataset or per-architecture tuning. The unification comes from principled theory.

## Scalability

SIGReg has:
- **Time complexity**: $O(ndk)$ where $k$ is fixed or logarithmic. Linear in batch size and dimension.
- **Memory**: $O(nk)$. Linear in batch size.

At billion-parameter scale, SIGReg linear complexity is a game-changer.`,
            },
            {
              kind: 'quiz',
              title: 'Check: Why LeJEPA Eliminates Heuristics',
              questions: [
                {
                  prompt: 'Why can LeJEPA eliminate stop-gradient, teacher-student networks, and whitening?',
                  options: [
                    'It uses larger batch sizes, which naturally prevent collapse',
                    'SIGReg directly enforces isotropic Gaussian embeddings, making collapse structurally impossible',
                    'It uses more augmentations, creating semantic diversity',
                    'It relies on larger models that are naturally more stable',
                  ],
                  answer: 1,
                  explanation: 'Collapsed embeddings cannot pass the characteristic-function test. Collapse is ruled out by design, not by indirect heuristics.',
                },
                {
                  prompt: 'How does LeJEPA achieve hyperparameter stability across datasets and architectures?',
                  options: [
                    'It uses default hyperparameters that happen to work everywhere',
                    'The principled theory ensures that λ is a fundamental trade-off parameter, not an empirical knob',
                    'It automatically adjusts λ during training based on the data',
                    'It does not use hyperparameters at all',
                  ],
                  answer: 1,
                  explanation: 'λ is the fundamental trade-off between prediction and isotropy enforcement. Theory explains why this single parameter generalizes across settings.',
                },
              ],
            },
          ],
        },
        {
          id: 'lj-l6',
          title: 'Empirical Results: Scaling, In-Domain Learning, and Robustness',
          minutes: 18,
          xp: 90,
          steps: [
            {
              kind: 'read',
              title: 'Experimental Validation at Scale',
              markdown: `# Experimental Results: Does Theory Match Practice?

The paper validates LeJEPA across a wide range of settings.

## Key Findings

### 1. In-Domain Pretraining Outperforms Transfer Learning

On small, domain-specific datasets (Galaxy10, Food101), LeJEPA *outperforms* DINOv2 (trained on massive generic ImageNet).

Why this matters:
- Transfer learning is the conventional approach for small datasets.
- In-domain pretraining has been considered impractical.
- LeJEPA's stable design makes in-domain work viable.

The lesson: when you can afford in-domain pretraining, principled methods beat transfer learning.

### 2. Stability Across Hyperparameters and Architectures

With a fixed $\\lambda \\approx 2.0$ across:
- Datasets: ImageNet, CIFAR, Galaxy10, Food101
- Architectures: ViT-B, ViT-L, ResNet-50, ConvNeXt, MaxViT, Swin
- Scales: 86M to 1.3B parameters

Validation accuracy stays within a narrow band. No catastrophic failures, no brittle collapse.

### 3. Training Loss Correlates with Downstream Performance

A sanity check: Does the training loss value predict downstream performance?

For LeJEPA, yes. When $L_\\text{LeJEPA}$ is low, downstream probes are accurate. This suggests the training objective is aligned with downstream goals.

### 4. Emergent Semantic Structure

Without explicit labels, LeJEPA embeddings develop semantic clustering:
- Similar objects cluster together.
- Semantic relationships emerge in the embedding space.

This shows that principled design yields interpretable representations.

### 5. Uniform Scaling

As data, models, or compute increase:
- Other JEPAs become *more* sensitive to hyperparameters (requiring re-tuning).
- LeJEPA scales uniformly. The $\\lambda$ value stays stable.

This suggests the principle (enforce isotropic Gaussian) is fundamental.`,
            },
            {
              kind: 'scenario',
              title: 'Scenario: Choosing a Pretraining Strategy',
              scenario: {
                intro: 'You have a custom domain dataset (500 images, 10 classes) and need to pretrain embeddings for downstream classification.',
                stages: [
                  {
                    situation: 'You are deciding between transfer learning (DINOv2 on ImageNet) and in-domain pretraining (LeJEPA).',
                    question: 'What should you try first?',
                    options: [
                      {
                        label: 'Transfer learning: pretrain DINOv2 on ImageNet, then fine-tune on your data',
                        quality: 'ok',
                        feedback: 'Transfer learning is safe, but the paper shows LeJEPA can outperform it in-domain. You might be leaving performance on the table.',
                      },
                      {
                        label: 'Train LeJEPA in-domain with λ ≈ 2.0 and use it as the backbone',
                        quality: 'best',
                        feedback: 'Correct. LeJEPA is designed for in-domain pretraining. Start with λ ≈ 2.0 (canonical value) and trust the principled design.',
                      },
                      {
                        label: 'Use supervised learning with heavy augmentation',
                        quality: 'ok',
                        feedback: 'Supervised learning is solid, but it cannot leverage unlabeled data. LeJEPA is better if you have both labeled and unlabeled examples.',
                      },
                      {
                        label: 'Train a standard JEPA with multiple heuristics (stop-gradient, teacher-student)',
                        quality: 'bad',
                        feedback: 'This reintroduces the complexity LeJEPA avoids. No reason to use older, less stable methods.',
                      },
                    ],
                  },
                  {
                    situation: 'After training LeJEPA with λ=2.0, validation accuracy plateaus at 75% (below your 85% target).',
                    question: 'What should you investigate?',
                    options: [
                      {
                        label: 'Increase λ to force stronger isotropy',
                        quality: 'bad',
                        feedback: 'Increasing λ would over-constrain embeddings further, making accuracy worse.',
                      },
                      {
                        label: 'Decrease λ slightly (e.g., to 1.0) to allow more semantic flexibility',
                        quality: 'best',
                        feedback: 'If isotropy is over-constraining semantic structure, reducing λ gives embeddings more freedom while maintaining stability.',
                      },
                      {
                        label: 'Switch to a standard supervised classifier',
                        quality: 'ok',
                        feedback: 'This might help, but first try tuning λ—the principled approach before abandoning the method.',
                      },
                      {
                        label: 'Add stop-gradient and teacher-student networks',
                        quality: 'bad',
                        feedback: 'LeJEPA eliminates the need for these heuristics. Adding them defeats the purpose.',
                      },
                    ],
                  },
                ],
                debrief: 'LeJEPA is designed to work out-of-the-box with a canonical λ, but fine-tuning λ based on downstream performance is a principled way to optimize for your specific task.',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'lj-m4',
      title: 'Theoretical Foundations and Future Directions',
      description: 'Deep theoretical understanding: Cramér-Wold theorem, bias-variance decomposition, and the limits of the isotropic Gaussian assumption.',
      lessons: [
        {
          id: 'lj-l7',
          title: 'Mathematical Foundations: Why Isotropic Gaussian is Optimal',
          minutes: 20,
          xp: 100,
          steps: [
            {
              kind: 'read',
              title: 'The Theory Behind Isotropic Gaussian Optimality',
              markdown: `# Why Isotropic Gaussian? The Full Theory

The paper provides detailed proofs for why isotropic Gaussian embeddings are optimal.

## Cramér-Wold Theorem (The Linchpin)

**Theorem**: A $d$-dimensional random variable $X$ is isotropic Gaussian iff all its 1D projections $t^T X$ (for all unit vectors $t$) are 1D Gaussian.

**Why it matters**: Instead of checking a $d$-dimensional distribution directly (hard), check all 1D projections (easier). If all 1D slices are Gaussian, the full distribution is.

SIGReg exploits this: sample random projections, check if each is 1D Gaussian. If all pass, the distribution is approximately isotropic Gaussian.

## Bias and Variance of Linear Probes

For a linear probe $\\hat{y} = w^T z$, generalization error decomposes into bias and variance:

$$\\text{Error} = \\text{Bias}^2 + \\text{Variance}$$

- **Bias**: Misalignment between the true decision boundary and the linear hyperplane.
- **Variance**: Finite-sample noise.

When embeddings are isotropic Gaussian:
- Bias is minimized uniformly across all possible downstream tasks. No direction is preferred.
- Variance is minimized because the Gaussian has well-behaved covariance—no thin or elongated tails.

If embeddings collapse or become low-rank, bias increases: you are solving the task in a subspace and may miss important directions.

## Nonlinear Probes: k-NN and Kernel Methods

For k-NN classifiers:
- Isotropic Gaussian ensures neighbors are sampled uniformly in all directions.
- Collapsed embeddings bias neighbors toward the collapse direction, harming generalization.

For kernel methods (SVM, kernel ridge regression):
- Kernel effectiveness depends on metric structure. Isotropic Gaussians provide a universal metric—no direction is special.
- Low-rank embeddings introduce metric anisotropy, reducing kernel expressiveness.

## Practical Caveats and Limitations

The theory assumes:
1. Embeddings are drawn from a fixed distribution (i.i.d. samples).
2. Downstream tasks are unknown a priori (worst-case analysis).
3. Isotropic Gaussian is the unique global optimum.

In practice:
- Data distributions shift over time or across domains.
- Some downstream tasks may require non-isotropic structure (e.g., if signal lies on a manifold).
- Strict isotropy might over-constrain in specialized domains.

Despite these, experiments show LeJEPA is remarkably robust.`,
            },
            {
              kind: 'quiz',
              title: 'Check: Theory and Its Limits',
              questions: [
                {
                  prompt: 'What does the Cramér-Wold theorem tell us about testing for multivariate normality?',
                  options: [
                    'You must check the full $d$-dimensional distribution',
                    'Checking 1D projections is sufficient because a distribution is Gaussian iff all its 1D projections are',
                    'Characteristic functions cannot test normality',
                    'Only moment-based tests are valid',
                  ],
                  answer: 1,
                  explanation: 'This is the key insight that makes SIGReg practical: you reduce a hard $d$-dimensional problem to many easy 1D problems.',
                },
                {
                  prompt: 'Why does isotropic Gaussian minimize bias for linear probes across all downstream tasks?',
                  options: [
                    'It forces embeddings to lie on a specific manifold',
                    'No embedding dimension is preferred, so the decision boundary has equal access to all directions',
                    'It eliminates variance entirely',
                    'It enforces explicit labels during pretraining',
                  ],
                  answer: 1,
                  explanation: 'Isotropy ensures that any linear hyperplane can extract signal uniformly from all directions, minimizing task-specific bias.',
                },
                {
                  prompt: 'What is a practical limitation of the isotropic Gaussian assumption?',
                  options: [
                    'It is impossible to enforce in practice',
                    'It may over-constrain embeddings for tasks where the signal lies on a non-isotropic manifold',
                    'It only works for image classification',
                    'Isotropic Gaussians cannot represent semantic information',
                  ],
                  answer: 1,
                  explanation: 'The theory provides worst-case guarantees, but in practice some tasks benefit from structure. Tuning λ allows flexibility.',
                },
              ],
            },
            {
              kind: 'code',
              title: 'Verify Cramér-Wold Characterization in Code',
              challenge: {
                prompt: 'Implement a function that verifies whether a distribution is isotropic Gaussian by testing random 1D projections using the Shapiro-Wilk test.',
                starterCode: `import numpy as np

def verify_isotropic_gaussian_cramer_wold(
    samples: np.ndarray,
    num_tests: int = 20,
    alpha: float = 0.05
) -> dict:
    """
    Use Cramér-Wold to verify a distribution is isotropic Gaussian.

    Args:
        samples: shape (N, D) - samples from the distribution
        num_tests: number of random projections to test
        alpha: significance level for hypothesis tests

    Returns:
        dict with 'is_gaussian' (bool), 'p_values' (list), 'summary' (str)
    """
    pass`,
                solution: `import numpy as np
from scipy.stats import shapiro

def verify_isotropic_gaussian_cramer_wold(
    samples: np.ndarray,
    num_tests: int = 20,
    alpha: float = 0.05
) -> dict:
    """
    Use Cramér-Wold to verify a distribution is isotropic Gaussian.
    """
    N, D = samples.shape
    p_values = []

    for _ in range(num_tests):
        # Random unit direction (1D projection)
        direction = np.random.randn(D)
        direction /= np.linalg.norm(direction)

        # Project samples onto this direction
        projection = samples @ direction

        # Standardize to N(0, 1)
        projection = (projection - np.mean(projection)) / (np.std(projection) + 1e-8)

        # Shapiro-Wilk test for 1D normality
        stat, p_value = shapiro(projection)
        p_values.append(p_value)

    # Pass if all projections are approximately normal
    is_gaussian = np.mean(p_values) > alpha

    return {
        'is_gaussian': is_gaussian,
        'p_values': p_values,
        'summary': f"Mean p-value: {np.mean(p_values):.4f}, " +
                   f"Min p-value: {np.min(p_values):.4f}"
    }`,
                tests: `test("Genuine Gaussian samples should pass Cramér-Wold test", () => {
  const samples = Array.from({length: 500}, () =>
    Array.from({length: 64}, () => Math.random() * 2 - 1)
  );
  const result = verify_isotropic_gaussian_cramer_wold(samples);
  assertEqual(result.is_gaussian, true, "Gaussian samples failed");
});

test("Collapsed samples should fail", () => {
  const samples = Array.from({length: 500}, () =>
    Array.from({length: 64}, () => 1.0)
  );
  const result = verify_isotropic_gaussian_cramer_wold(samples);
  assertEqual(result.is_gaussian, false, "Collapsed samples passed");
});

test("Low-rank samples should fail", () => {
  const A = Array.from({length: 10}, () =>
    Array.from({length: 64}, () => Math.random())
  );
  const samples = Array.from({length: 500}, () => {
    const x = Array.from({length: 10}, () => Math.random());
    return x.map((xi, i) => A[i].reduce((sum, aij, j) => sum + xi * aij, 0));
  });
  const result = verify_isotropic_gaussian_cramer_wold(samples);
  assertEqual(result.is_gaussian, false, "Low-rank samples passed");
});`,
              },
            },
          ],
        },
      ],
    },
  ],
}
