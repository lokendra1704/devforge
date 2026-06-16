## The Search Depth Problem

When you play a video game, you think hierarchically. Pick up the key, unlock the door, reach the exit—each step is a *subgoal*. But standard Monte Carlo Tree Search (MCTS) doesn't think this way. It plans over individual *actions*.

The problem is computational: "Since many games are too complex to plan far ahead in a limited time frame, many of these algorithms incorporate a maximum search depth." MCTS typically looks only 10 moves ahead before time runs out. This means it can't recognize that picking up a key *now* will unlock a door *later*. It misses the forest for the trees.

## Why Humans Are Better

Humans avoid this trap through *subgoal reasoning*: "When there is a portal on screen, a player is likely to try to find out what the portal does by walking towards it. The player will remember the effect of this and use that information for the rest of the game."

This higher-level planning has two advantages:
1. Longer horizons: you plan in terms of subgoals (key → door → exit) rather than individual button presses
2. Reusable knowledge: once you learn that the portal is the exit, you don't re-explore it each game

Standard MCTS has neither.

## The Gap

Here's the core gap: "The MCTS algorithm always plans over actions and does not incorporate any higher level planning, as one would expect from a human player." 

On games with *sequential subgoals* (you must complete task A before task B becomes possible), MCTS is stuck. The algorithm can't see far enough to recognize the opportunity, and it lacks the conceptual structure to say "I need to achieve this subgoal first."

The solution: extend MCTS to plan over *options*—sequences of actions aimed at achieving a specific subgoal.
