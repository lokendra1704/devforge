# Test-Time Memorization vs. Test-Time Training

The paper introduces the term **"Test-Time Memorization"** to clarify what happens during inference when a model encounters a new sequence.

## The Distinction

### Test-Time Training (Misleading)
The term "test-time training" might suggest the model is learning new skills or generalizing to new domains. It could imply persistent learning that carries over to future, independent contexts.

### Test-Time Memorization (Precise)
The memory module stores and retrieves information strictly within the global context of the current sequence, **without updating the model's core learned parameters** (outer loop) or initial states from pretraining. Key points:

1. **No outer-loop updates:** The base model weights ($W_Q, W_K, W_V$, projections, etc.) remain fixed.
2. **Only inner-loop adaptation:** The memory module $M(·)$ adjusts its parameters to map the key-value pairs in *this specific sequence*.
3. **No persistent skill transfer:** Once the sequence ends and memory is cleared, no learned patterns carry over to the next, independent sequence.

## Why This Terminology Matters

The distinction prevents confusion:
- Test-time **training** suggests general capability improvement—learning that compounds.
- Test-time **memorization** is honest: we're optimizing a lookup table for this context, nothing more.

Yet it's powerful: by memorizing the current context effectively (via Omega rule, higher capacity, and better optimization), the model can perform complex reasoning over long sequences without changing the outer-loop model at all.

## Example

Processing a 10M-token legal document:
- The outer-loop model (projections, MLP feedforward) stays the same.
- The inner-loop memory $M$ specializes to map the 10M unique fact pairs in *this* document.
- After processing, memory is reset. For a new document, $M$ adapts to that document's facts instead.

---

**Citation:** Atlas paper, Introduction § Memory Perspective, page 2
