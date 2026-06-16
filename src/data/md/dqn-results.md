# Results: Playing Atari from Pixels

The proof is in the playing. DQN was evaluated on seven Atari 2600 games: Beam Rider, Breakout, Enduro, Pong, Q*bert, Seaquest, and Space Invaders. The same network architecture and hyperparameters were used for all games — no game-specific tuning.

## Training Setup

- **Network** — CNN as described, trained with RMSProp optimizer
- **Minibatch size** — 32 transitions sampled from replay memory
- **Exploration** — ε-greedy: random action with probability ε (annealed from 1.0 to 0.1 over the first 1 million frames, then fixed at 0.1)
- **Replay memory size** — 1 million frames
- **Training duration** — 10 million frames (roughly 38 days of gameplay per game)
- **Reward clipping** — All positive rewards clipped to +1, negative to -1, leaving 0 unchanged. This normalizes reward scale across games with vastly different scoring systems (Pong ranges from -21 to +21, Seaquest from 0 to 28,000+).

## Results

| Game | Random | Sarsa | Contingency | DQN | Human |
|------|--------|-------|-------------|-----|-------|
| **Beam Rider** | 354 | 996 | 1,743 | **4,092** | 7,456 |
| **Breakout** | 1.2 | 5.2 | 6 | **168** | 31 |
| **Enduro** | 0 | 129 | 159 | **470** | 368 |
| **Pong** | −20.4 | −19 | −17 | **20** | −3 |
| **Q\*bert** | 157 | 614 | 960 | **1,952** | 18,900 |
| **Seaquest** | 110 | 665 | 723 | **1,705** | 28,010 |
| **Space Invaders** | 179 | 271 | 268 | **581** | 3,690 |

## Key Observations

**Surpassing human performance:** On Breakout, Enduro, and Pong, DQN exceeds expert human play. This is remarkable because humans developed intuitions about these games over decades; a neural network trained in isolation matches or beats that intuition.

**Scaling with architecture:** DQN substantially outperforms prior methods (Sarsa, Contingency) across all seven games, despite using zero hand-engineered features. The gap is largest on complex games like Q*bert and Seaquest, suggesting deep networks extract richer representations than hand-crafted features.

**Varying difficulty:** Some games remain far from human performance (Q*bert, Seaquest, Space Invaders are harder than others). These require strategies that span long timescales — the agent must plan many steps ahead. The gap suggests room for improvement, but the mere fact that a single architecture works on seven diverse games is itself a breakthrough.

## Generalization Across Games

The same network architecture and hyperparameters succeeded across games with different action sets (4–18 legal actions), different reward scales, and different visual styles. This **robustness** demonstrates that the approach isn't overfitted to one task. The learned visual representations generalize.

The only hyperparameter change: on Space Invaders, frame-skipping was set to k=3 instead of k=4 because k=4 made the enemy lasers invisible (they blink faster than the frame skip period). Every other detail remained constant — a testament to the method's stability and generality.
