## The benchmark: MNIST

Before you can claim a technique "wins," you need a fair test. LeCun et al. built one by mixing two NIST databases — SD-1 (written by 500 high-school students) and SD-3 (written by Census Bureau employees) — and splitting by **writer identity**, not by example: the first 250 writers' digits go to training, the remaining 250 writers' digits go to test. Why bother? Because if the same writer's handwriting appears in both sets, a classifier can cheat by learning *that writer's* strokes instead of learning digits in general.

> *"Drawing sensible conclusions from learning experiments requires that the result be independent of the choice of training set and test among the complete set of samples."* — Section III-A

The result, called **MNIST**, has 60,000 training and 10,000 test images, each size-normalized into a 20×20 box and centered in a 28×28 field by center of mass. It became the standard benchmark for comparing learning algorithms for the next two decades.

### The leaderboard (Fig. 9, raw error rate on the 10,000-example test set)

| Method | Error rate | Free parameters / notes |
|---|---|---|
| Linear classifier | 12.0% | 7,850 params — included only as a floor |
| Pairwise linear classifier | 7.6% | 45 one-vs-one units |
| K-NN, Euclidean (deslanted) | 2.4% | zero training time, ~24MB of templates |
| 40 PCA + quadratic classifier | 3.3% | hand-built 40-dim feature space |
| 1000-unit RBF network | 3.6% | Gaussian units + linear readout |
| 28×28-1000-150-10 (2-hidden-layer MLP) | 2.95% | fully-connected, no convolution |
| [16×16] LeNet-1 | 1.7% | early CNN, only ~2,600 free parameters |
| LeNet-4 | 1.1% | larger CNN |
| LeNet-5 (with distortions) | 0.8% | the paper's flagship CNN |
| SVM, polynomial degree 4 | 1.4% | ~14 million multiply-adds per digit |
| Reduced-Set SVM (RS-SVM) | 1.1% | 650,000 multiply-adds — ~60% more than LeNet-5 |
| **Boosted LeNet-4** (with distortions) | **0.7%** | three LeNet-4s combined — best raw score |

*(Section III-C / Figure 9. Quoted uncertainty on these rates is about ±0.1%.)*

> **Wait — doesn't a fully-connected network with 1000 hidden units have way more capacity than a small CNN?** Yes, and it still loses to LeNet-1's 2,600 parameters. Raw parameter count isn't what wins here — it's whether the architecture's *prior* (local receptive fields, shared weights, subsampling — see the CNN module) matches the structure of 2D images. A generic MLP has to *learn* shift- and distortion-tolerance from data; a CNN gets it built in.

### One dataset, two database "modes"

Three preprocessing variants are used throughout the comparisons:
- **regular** — 20×20 size-normalized, centered in 28×28 by center of mass
- **deslanted** — sheared so the principal axis of inertia is vertical, then cropped to 20×20
- **[16×16]** — downsampled further, used by the earliest experiments (LeNet-1, Tangent Distance)

`[dist]` in the table means the training set was augmented with artificially distorted copies (translation, scaling, squeezing, shearing) — turning 60,000 originals into 600,000 effective training examples without collecting a single new sample.
