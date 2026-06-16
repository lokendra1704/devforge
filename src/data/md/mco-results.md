## Test Setup

The algorithms were evaluated on 28 diverse games from the General Video Game AI competition. Each game has 5 levels; each algorithm played each level 20 times. Standard MCTS was allowed 40ms per action (a typical time budget in the competition); O-MCTS and OL-MCTS were given the same time.

The main difference: O-MCTS searches a wider tree with lower branching factor, so it reaches deeper states in the same 40ms.

## O-MCTS vs. MCTS: Subgoal Games

| Game | Type | O-MCTS Win Rate | MCTS Win Rate | O-MCTS Advantage |
|------|------|-----------------|---------------|-----------------|
| Zelda | Sequential subgoals (get key → unlock door → reach exit) | ~0.6 | ~0.0 | **Stark win** |
| Camel Race | Sparse reward, long horizons | 1.0 | ~0.0 | **Complete win** |
| Bait | Multi-step planning | ~0.8 | ~0.4 | **Strong advantage** |
| Lemmings | Subgoal sequencing | ~0.7 | ~0.4 | **Clear advantage** |

**Pattern**: O-MCTS excels on games requiring *sequential planning*. Zelda is the clearest example: "picking up the key and walking towards the door is a difficult action sequence." Standard MCTS times out before assembling this sequence; O-MCTS's GoToKey option directly recognizes the subgoal.

In Camel Race, the avatar must move right for 80 consecutive turns to reach the finish with no intermediate reward. MCTS's 10-step lookahead *cannot* see the finish line; "O-MCTS always wins this game, since it can plan forward a lot further."

## O-MCTS vs. MCTS: Games with Many Sprites

| Game | Sprite Count | O-MCTS Win Rate | MCTS Win Rate | Notes |
|------|--------------|-----------------|---------------|-------|
| Pac-Man | ~10 | ~0.3 | ~0.5 | MCTS better |
| Jaws | ~8 | ~0.4 | ~0.6 | MCTS better |
| Seaquest | ~6 | ~0.4 | ~0.5 | MCTS better (marginal) |

**Pattern**: O-MCTS underperforms when there are many sprites. Why? Each sprite spawns multiple option instances (GoToSprite_1, GoToSprite_2, …). "When the number of options becomes too big, constructing the set of possible options ps for every state s becomes so time-consuming that the algorithm has too little time to build a tree."

**Key insight**: with 120ms instead of 40ms, O-MCTS's win rate on Seaquest and Plaque Attack recovered (to ~0.8 and higher). The issue isn't algorithmic; it's *computational overhead*. More time lets O-MCTS manage the option set.

## Overall Results

Across all 28 games, O-MCTS and OL-MCTS achieved statistically significant improvement over MCTS (*p* < 0.05): "Over all twenty-eight games, O-MCTS wins more games than MCTS."

## OL-MCTS Transfer Learning

When OL-MCTS played the same game twice:
- **Game 1 (OL-MCTS1)**: slight underperformance vs. O-MCTS (due to crazy stone overhead)
- **Game 5 (OL-MCTS5)**: recovery to O-MCTS levels or better

On the game **Bait**, learning led to dramatic improvement: "Figure 5(a) shows the improvement in score and win ratio for this game. There are two likely explanations for this improvement: 1. The algorithm learns to avoid sprites that kill the player. 2. The algorithm learns that it should pick up the key."

## Summary

- **O-MCTS wins on subgoal games** where deeper planning pays off
- **O-MCTS loses on sprite-heavy games** where the option set becomes too large
- **OL-MCTS improves via transfer learning**, especially on repeated games
