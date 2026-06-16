# Evaluation: CraftBench and Experimental Results

To evaluate Craft across diverse figure types and input conditions, the authors introduced **CraftBench**, a 279-sample benchmark with human quality annotation, and tested both Crafter and CraftEditor against existing approaches.

## CraftBench: Coverage of Diversity

CraftBench spans three figure types and four input conditions:

| Figure Type | Samples | Input Conditions |
|---|---|---|
| Academic diagrams | 59 | Text-to-image, Mask-completion, Sketch, Key-element |
| Posters | 97 | Text-to-image, Mask-completion |
| Infographics | 23 | Text-to-image |
| **Total** | **279** | **4 input conditions** |

Text-to-image accounts for 64.2% of the benchmark (179 samples), with the three reference-conditioned tasks contributing mask-completion (10.8%), sketch-conditioned generation (14.3%), and key-element composition (10.8%).

### Evaluation Protocol

Rather than side-by-side pairwise comparison (which introduces position bias), the protocol scores candidates and targets independently using Gemini 3.5 Flash as a judge. Scoring uses task- and content-type-specific aspects:
- Text-to-image: content faithfulness, readability, and format (academic/poster/infographic)
- Reference-conditioned tasks: same, but replacing format with input-fidelity (how well the conditioning input was respected)

Each aspect is rated 0–10, combined via weighted mean, and the candidate's margin over the target yields verdicts: Model win, Tie, or Human win (mapped to 100, 50, 0 points).

## Main Results

Crafter substantially outperforms standalone generators and agentic baselines on both benchmarks:

| Method | PaperBanana-Bench | CraftBench |
|---|---|---|
| Nano Banana 2 (open-source baseline) | 11.13 | 19.90 |
| Nano Banana Pro (closed-source baseline) | 22.43 | 22.40 |
| PaperBanana (strongest prior agentic) | 35.96 | 29.00 |
| **Crafter (w/ Nano Banana 2)** | **50.34** | **50.20** |
| **Crafter (w/ Nano Banana Pro)** | **50.00** | **52.30** |

Crafter leads on every quality dimension and every task. Critically, it attains the best score in all four columns of both benchmarks—content faithfulness, readability, and the task-specific aspects. No baseline surpasses Crafter on any dimension.

The gap is largest where generalization matters most: on CraftBench, Crafter improves 30.2 points over its backbone (Nano Banana 2), while the previous best agentic method (PaperBanana) improves only 8.1 points, indicating that Crafter's harness design, not the generator backbone, drives the gains.

## Ablation: Each Mechanism Contributes

Removing each mechanism degrades overall performance:

| Configuration | Overall Score | Drop |
|---|---|---|
| Crafter (full) | 50.34 | — |
| w/o plan exploration | 41.78 | −8.56 |
| w/o corrective layer | 41.44 | −8.90 |
| w/o refinement loop | 44.86 | −5.48 |
| w/o directive critic | 45.30 | −5.04 |

The structured corrective layer contributes the most (−8.90), confirming that avoiding free-text contradiction is essential. Plan exploration's −8.56 drop shows that a wrong framing decision early on propagates through refinement with no escape. The refinement loop and directive critic each contribute ~5 points independently.

## CraftEditor Results

CraftEditor converts generated rasters into editable SVGs, evaluated on seven structural and semantic axes over 80 held-out Crafter outputs:

| Method | Overall Score |
|---|---|
| Edit-Banana | 3.69 |
| AutoFigure-Edit | 6.91 |
| **CraftEditor** | **8.04** |

The margin is widest on structural axes (text and arrows), where precise coordinate reasoning and iterative correction matter most. CraftEditor is the first system to faithfully convert raster outputs into editable SVGs that surpass all baselines.
