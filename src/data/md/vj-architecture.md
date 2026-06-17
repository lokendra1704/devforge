# Mask-Denoising in Representation Space

## The JEPA Training Loop

V-JEPA 2 learns by predicting. A video clip arrives, gets patchified into tokens (tubelets of size 2×16×16). Some patches get dropped—masked out. The encoder processes the *masked* video and produces embeddings. The predictor then takes those embeddings plus learnable "mask tokens" and predicts what the encoder would have produced for those masked patches.

The target? Not pixels, but the representations from an exponential-moving-average (EMA) copy of the encoder. Why EMA? It prevents collapse. Why representations and not pixels? Because pixels encode noise.

```
Video → Patchify → Mask some patches → 
Encoder (masked video) → Predictor → L1 loss vs. EMA-Encoder targets
```

The training objective is: **L = || Predictor(mask_tokens, Encoder(masked_video)) - StopGrad(EMA-Encoder(original_video)) ||₁**

Stop-gradient on the target prevents collapse. The L1 loss (over masked patches only) is forgiving.

## Architecture Components

**Encoder & Predictor**: Both are Vision Transformers. **3D RoPE** instead of sinusoidal embeddings for stability at 1B parameters.

**Masking**: Multiblock masking—random rectangular blocks, not individual patches.

## Why Representation Space Wins

| Approach | Predicts | Pros | Cons |
|----------|----------|------|------|
| Pixel Generation | RGB pixels | Visually interpretable | Wastes capacity on noise; slow planning |
| JEPA (Representation) | Learned features | Efficient; ignores noise; fast planning | Less interpretable |

Planning in representation space is **10× faster** than pixel-space planning.
