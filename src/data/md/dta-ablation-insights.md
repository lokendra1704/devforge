# Ablation Studies & Scaling Insights

Ablation studies systematically remove or change components to understand which matter most.

## Key Findings

### The Importance of Omega Rule

**Experiment:** Compare Atlas with $c = 1$ (online, no window) vs. $c = 128$ (sliding window).

**Result:** Sliding window drives a **2-5x improvement** on long-context tasks (1M+ tokens).

**Why?** Online updates ($c=1$) process each token in isolation. When fact A at position 100K needs to be retrieved at position 100.1K, the model already updated past it. Omega rule (with $c=128$) keeps fact A in the optimization window through position 100.1K, strengthening the memory association.

### Memory Depth Matters, But Not Unlimited

**Experiment:** Vary MLP depth $L_M = 1, 2, 3, 4$ while keeping total parameters fixed.

**Result:**
- $L_M = 1$ (linear): 50% accuracy on BABILong
- $L_M = 2$: 75% accuracy (+50%)
- $L_M = 3$: 82% accuracy (+20%)
- $L_M = 4$: 83% accuracy (+1.2%, diminishing returns)

**Insight:** Two layers are a sweet spot. More depth helps but faces optimization and overhead tradeoffs.

### Polynomial Features Are Essential for Capacity

**Experiment:** Ablate polynomial feature mapping (use $\phi(x) = x$ instead of $\phi_p(x)$ with degree $p$).

**Result:** Removing polynomial features **halves performance** on recall-intensive tasks.

**Why?** Without polynomials, effective key dimension stays at $d_k$. With polynomials of degree 2–3, it becomes $\binom{d_k+p}{p}$, multiplying capacity 10–100x. When you have thousands of facts to memorize, capacity matters.

### Second-Order Optimization Matters on Noisy Tasks

**Experiment:** Replace Muon with standard gradient descent.

**Result:**
- Clean synthetic data (BABILong): ~5% drop
- Real language modeling (Wikitext-103): ~10% drop
- Common-sense reasoning with ambiguous facts: ~15% drop

**Insight:** First-order methods struggle when facts are ambiguous or noisy. Muon's curvature awareness helps it find robust memorizations that generalize.

### Input-Dependent Gating ($\gamma_i$) Helps Selective Forgetting

**Experiment:** Use fixed decay $\gamma_i = \eta_t$ (uniform) vs. learnable input-dependent gating.

**Result:** Input-dependent gating provides ~3–5% improvement on long-context tasks where irrelevant context must be actively pruned.

**Why?** The model learns to downweight or ignore repetitive filler tokens, dedicating memory capacity to meaningful facts.

## Scaling Laws: What Drives Improvement?

When scaling from 128K to 1M tokens:
- **Omega window size** is the dominant factor (more important than depth)
- **Capacity** (polynomials + depth) is secondary but important

When scaling from 1M to 10M tokens:
- **Context window size** and **Muon optimization quality** dominate
- Polynomial degree has diminishing returns

**Implication:** For very long sequences, the model's ability to maintain stable memory updates (via Omega + second-order) is more important than raw parameter count.

## What's Necessary vs. Nice-to-Have?

| Component | Necessity |
|-----------|-----------|
| Deep memory (2+ layers) | **Essential** — >50% of gains |
| Omega rule (sliding window) | **Essential** — >30% of gains |
| Polynomial features | **Essential** — >20% of gains |
| Muon (second-order) | **Important** — 5–15% of gains depending on noise |
| Input-dependent gating | **Nice** — 3–5% of gains |

For production systems with budget constraints, prioritize: deep memory → Omega → polynomials → second-order.

---

**Citation:** Atlas paper, § 5.4–5.5 "Ablation Study and Scaling Patterns"
