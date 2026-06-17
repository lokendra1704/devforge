# Lean Formalization and Verification

## What Is Lean?

**Lean 4** is a proof assistant — a programming language for writing formal, machine-checked mathematical proofs. Every statement must be precisely formalized, and every claim must be verified by the Lean type checker.

The paper includes Lean 4 formalizations of the main theorems to ensure absolute rigor. This is uncommon for an ML paper but valuable for a highly theoretical contribution.

## Why Formalize?

1. **Catch errors**: Natural-language proofs can contain subtle logical gaps that escape human readers. A Lean proof catches any gap.

2. **Clarity**: Formalizing forces you to state assumptions precisely. Ambiguous definitions become impossible.

3. **Future-proofing**: A Lean proof is machine-verifiable forever. Decades from now, anyone can check that Theorem 1 is correct by running the Lean checker.

4. **Credibility**: For a theory paper, formalization is the gold standard of rigor.

## What Is Axiomatized?

The Lean formalization **does not prove everything from first principles.** Instead, it:

**Formalizes**: 
- The setup (Gaussian latents, OU transition, LeJEPA objective).
- The logical chain (spectral bound → linearity → orthogonality).
- The connection from abstract theorems to the final result.

**Axiomatizes** (assumes as given):
- **Mehler's formula**: E[He_k(z) He_k(z')] = ρ^k. This is a classical result in orthogonal polynomial theory, already proven rigorously in textbooks.
- **Sturm-Liouville theory**: Existence and properties of eigenvalues and eigenfunctions. A deep classical result that would take 100+ pages to formalize from scratch.
- **Basic linear algebra**: Orthogonality, covariance, Procrustes alignment.
- **Probability theory**: Expectations, Gaussians, independence.

These are **standard background lemmas** — foundational results that any mathematics library provides. Formalizing them is out of scope for a research paper.

## The Lean Proof Structure

**Approximate file structure**:

```lean
-- Definitions
def Gaussian (z : ℝ^n) : Prop := ...
def LeJEPA_objective (h : ℝ^n → ℝ^n) : ℝ := ...
def linear_identifiability (h : ℝ^n → ℝ^n) : Prop := ∃ Q : O(n), h = Q ∘ id

-- Main theorem
theorem lejepa_linear_identifiability :
  ∀ (h : ℝ^n → ℝ^n), 
  Gaussian_world → 
  LeJEPA_objective h is minimal → 
  linear_identifiability h :=
  sorry -- Proof here
```

The proof fills in the `sorry`, walking through the spectral analysis, showing how the bound forces linearity, and concluding orthogonality.

## Axiomatization in Action

For example, **Mehler's formula** is stated as:

```lean
axiom mehler (k : ℕ) (ρ : ℝ) (hρ : 0 < ρ ∧ ρ < 1) :
  E[hermite k z * hermite k z'] = ρ^k :=
```

This tells Lean: "Assume this formula holds; the proof is in the orthogonal polynomial literature."

Once axiomatized, the proof of Theorem 1 can **use Mehler** without reproof:

```lean
theorem thm1 : linear_optimum_implies_rotation :=
  by
    apply spectral_bound (mehler k ρ hρ)  -- Use Mehler
    -- ... rest of proof
```

## What Gets Verified?

The Lean checker verifies:
1. **Type correctness**: All function applications, operations, and terms have the right types.
2. **Logical soundness**: Every inference rule is valid.
3. **Completeness**: Every claim is either proven or explicitly axiomatized.

What gets verified in this paper:
- ✅ The spectral bound imples linearity (given Mehler).
- ✅ Linearity + whitening implies orthogonality.
- ✅ Orthogonality preserves Gaussianity under transition.
- ✅ The converse (Gaussian uniqueness) follows from SL theory.
- ✅ The approximation bound (Theorem 3) holds.
- ✅ Rotation-invariant costs transfer optimally (Theorem 4).

What is axiomatized (not verified):
- Mehler's formula itself (classical result).
- SL eigenfunction characterization.
- Procrustes theorem (existence and uniqueness of optimal rotation).

## Interpreting Lean Statements

For a reader unfamiliar with Lean, the paper provides:
- **English translations** of each theorem.
- **Proof sketches** in mathematical notation (as in earlier sections).
- **Commentary** explaining what the Lean code does.

The Lean code is **supplementary verification**, not the primary exposition. But anyone interested in absolute rigor can read the Lean file and verify every step with the type checker.

## Lean Code Availability

The Lean proofs are available at:
https://github.com/klindtlab/lejepa-identifiability

To verify locally:
```bash
lake build  # Checks all proofs in the Lean project
```

If `lake build` succeeds, all theorems are proven (modulo the stated axioms).

## Limitations of Formalization

1. **Axiomatization trade-off**: Formalizing everything from scratch would require 10,000+ lines of Lean. Axiomatizing classical results is the pragmatic choice but reduces the "fully verified" claim.

2. **Model limitations**: Lean formalizes a mathematical model, not real neural networks. The theory assumes exact optimization, perfect Gaussianity, etc. Real systems are approximate.

3. **Readability**: Formal proofs are dense and require learning Lean syntax. Most readers will trust the English proof sketches rather than reading the Lean code.

## Why This Matters

In machine learning, theoretical claims are sometimes stated loosely or contain subtle errors. A paper that formalizes its main results is saying: **"We've checked this to the highest standard of rigor."**

For LeJEPA identifiability, formalization is particularly valuable because:
- The theorems are strong (if true, they're useful; if false, it's a major error).
- The proofs are nontrivial (multiple steps, each dependent on the previous).
- The results are new and not yet vetted by the community.

Lean verification provides confidence that the claims are correct.

## The Future of Formalization in ML

This paper demonstrates that formalization is feasible for modern ML theory:
- Lean libraries now cover probability, optimization, and linear algebra.
- Mixed axiomatization (new results verified, classical results axiomatized) balances rigor and practicality.
- Machine-checkable proofs will likely become standard for high-stakes theoretical claims.

For practitioners: You don't need to read the Lean code to trust the results. The fact that the code exists and passes the type checker is sufficient evidence of rigor.
