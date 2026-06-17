# Scaling Self-Supervised Video Learning

Scaling JEPA pretraining has four key ingredients:

**1. Data Scaling: 2M → 22M videos**

VideoMix22M combines SSv2 (egocentric), Kinetics (exocentric), HowTo100M (tutorials), YT-Temporal-1B (curated YouTube), and ImageNet (static).

Impact: +1.0 point average accuracy.

**2. Model Scaling: 300M → 1B parameters (ViT-L to ViT-g)**

Impact: +1.5 points.

**3. Longer Training: 90K → 252K iterations**

Warmup-constant-decay schedule enables longer training.

Impact: +0.8 points.

**4. Progressive-Resolution Training**

Start at 16-frame, 256×256 (warmup/constant), then increase to 64-frame, 384×384 (cooldown).

Achieves **8.4× speedup** vs. full-resolution training throughout, while gaining +0.7 points.

**Total combined gain: 4.0 points** (84.2 → 88.2 average accuracy).

## Data Curation

Cluster-based retrieval on YT1B: extract scene embeddings, resample to match Kinetics/SSv2 distribution, discard cartoons/clipart.

Result: +1.4 point improvement.
