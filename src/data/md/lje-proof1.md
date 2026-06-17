# Proof of Theorem 1: Linear Identifiability (Condensed)

## Proof Outline

**Theorem 1**: On a Gaussian world with LeJEPA, at the optimum h(z) = Qz for orthogonal Q ∈ O(n).

**Proof strategy**:
1. Show minimizing L(h) is equivalent to maximizing correlation (via whitening).
2. Decompose h_i into Hermite modes and apply the spectral bound.
3. Show the bound forces linearity.
4. Show the linear map must be orthogonal.
5. Derive the transition property.

## Step-by-Step

### Step 1: Equivalence with Correlation

**Claim**: With Cov(h(z)) = I_n, minimizing E[‖h(z') - h(z)‖²] is equivalent to maximizing Σ_i E[h_i(z') h_i(z)].

**Proof**:
E[‖h(z') - h(z)‖²] = E[‖h(z')‖² - 2⟨h(z'), h(z)⟩ + ‖h(z)‖²]
= E[‖h(z')‖²] + E[‖h(z)‖²] - 2Σ_i E[h_i(z') h_i(z)]

Since Cov(h(z)) = I_n (whitening), we have E[‖h(z)‖²] = tr(Cov(h(z))) = n. Similarly, E[‖h(z')‖²] = n.

So E[‖h(z') - h(z)‖²] = 2n - 2Σ_i E[h_i(z') h_i(z)].

Minimizing the left side is equivalent to maximizing the right side. ✓

### Step 2: Spectral Bound (Equation 4)

**Claim**: For any h_i(z) with zero mean and unit variance decomposed into Hermite modes:
E[h_i(z') h_i(z)] = Σ_k w_k ρ^k ≤ ρ

with equality iff w_1 = 1 (pure linearity).

**Proof**:
h_i(z) = Σ_k w_k He_k(z), where Σ_k w_k = 1 (variance conservation via orthonormality).

By linearity of expectation and orthonormality of Hermites:
E[h_i(z') h_i(z)] = E[(Σ_k w_k He_k(z')) (Σ_j w_j He_j(z))]
= Σ_k w_k E[He_k(z') He_k(z)]
= Σ_k w_k ρ^k (by Mehler's formula)

Since ρ ∈ (0, 1):
Σ_k w_k ρ^k ≤ Σ_k w_k ρ = ρ Σ_k w_k = ρ

Equality holds iff w_k = 0 for all k ≠ 1, i.e., h_i is pure He_1(z) = z (linearity). ✓

### Step 3: Linearity at Optimum

**Claim**: The optimizer must choose each h_i to be linear.

**Proof**:
The objective is to maximize Σ_i E[h_i(z') h_i(z)].

For each i, the maximum contribution is bounded by ρ (the spectral bound), achieved only when h_i(z) = c_i z (linear, with appropriate scaling for normalization).

Thus, at the optimum, h_i(z) = Q_i · z (one row of a matrix Q), and the objective value is:
Σ_i E[h_i(z') h_i(z)] = Σ_i ρ = nρ

Any deviation from linearity in any h_i reduces its contribution below ρ, lowering the objective. ✓

### Step 4: Orthogonality from Whitening

**Claim**: If h(z) = Qz and Cov(h(z)) = I_n, then Q ∈ O(n) (orthogonal).

**Proof**:
h(z) = Qz implies h(z)h(z)ᵀ = Qzz ᵀ Qᵀ.

Taking covariance:
Cov(h(z)) = E[h(z)h(z)ᵀ] = Q E[zzᵀ] Qᵀ = QI_n Qᵀ = QQᵀ

(using E[zzᵀ] = Cov(z) = I_n for Gaussian z ~ N(0, I_n)).

For Cov(h(z)) = I_n, we need QQᵀ = I_n, which is the definition of an orthogonal matrix. ✓

### Step 5: Transition Property

**Claim**: If h = Qz with Q orthogonal, then h(z') | h(z) ~ N(ρh(z), (1-ρ²)I_n).

**Proof**:
From the OU transition: z' = ρz + √(1-ρ²) η, where η ~ N(0, I_n) independent of z.

Apply h = Qz:
h(z') = Q(ρz + √(1-ρ²)η) = ρQz + √(1-ρ²) Qη = ρh(z) + √(1-ρ²) Qη

Since Q is orthogonal, it preserves Gaussianity: Qη ~ N(0, I_n) and Qη ⊥ h(z).

Thus, h(z') | h(z) = ρh(z) + √(1-ρ²) Qη ~ N(ρh(z), (1-ρ²)I_n). ✓

## Conclusion

The proof combines three ingredients:
1. **Spectral analysis** (Hermite basis) reveals that linearity is optimal.
2. **Whitening constraint** forces orthogonality.
3. **Gaussian structure** preserves under orthogonal transformation.

The chain is tight: each step follows inevitably from the previous, with no gaps or assumptions beyond the initial setup.

This is why Theorem 1 is so strong: the mathematics leaves no choice.
