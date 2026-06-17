# Zero-Shot Robot Control via Planning

## The Test

V-JEPA 2-AC trained on 62 hours of Droid data now faces new environments, novel objects, and no task-specific training.

## Tasks and Results

**Single-goal reaching**, **grasping**, **reach-with-object**, **pick-and-place**.

Tested zero-shot on Franka arms in two different labs with uncalibrated monocular RGB cameras.

| Task | V-JEPA 2-AC | Octo | Cosmos |
|------|---|---|---|
| Reach | 100% | 100% | 80% |
| Grasp Cup | 65% | 15% | 0% |
| Grasp Box | 25% | 0% | 20% |
| Pick-Place Cup | 75% | 15% | 0% |
| Pick-Place Box | 65% | 10% | 0% |

**V-JEPA 2-AC wins on all object-interaction tasks** where the model must reason about physics.

- **Octo**: Behavior-cloning model fine-tuned on Droid. Memorizes demonstrations; struggles with novel object shapes.
- **Cosmos**: Diffusion-based video generation. Takes 4 minutes per action (16× slower).

## Energy Landscape

The energy function learned by V-JEPA 2-AC is *smooth and convex near the true action*. This smoothness makes optimization easier.

## Limitations

**Camera Sensitivity**: Model must infer robot coordinate frame from monocular RGB without calibration.
**Long-Horizon Planning**: Error accumulation limits planning to ~16 frames (~4 seconds).
**Action Constraints**: Actions limited to L1-ball of radius 0.075 (13cm per step).
