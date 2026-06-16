## The Option Overhead Problem

O-MCTS is fast when there are few options, but real games generate *many*. In Zelda with 3 monsters, a key, and a portal, the algorithm creates:
- GoToMonster options (one per monster)
- AvoidMonster options (one per monster)  
- GoToKey option
- GoToDoor option
- … and more

This grows quickly: "When many options are deﬁned, exploring all the options becomes infeasible."

Why? Because O-MCTS explores *every* option at least once per state. With 15–30 options, spending 40ms exploring just the expansion phase leaves little time for deep rollouts.

## OL-MCTS: Learning Which Options Matter

Option Learning MCTS (OL-MCTS) solves this by *learning* which options work well and *focusing exploration* on the promising ones.

### Learning Option Values

After each option finishes, OL-MCTS records its return (the reward achieved):
- **μ** (mean return): the average score gained by using this option across past games
- **σ** (variance): how much the returns vary

Example: **GoToKey** might have μ=5, σ=2 (usually scores ~5 but varies). **AvoidMonster** might have μ=0.5, σ=3 (not very helpful, inconsistent).

### Progressive Widening: The Crazy Stone Algorithm

Instead of exploring all options equally, OL-MCTS uses the **crazy stone algorithm** to *weight* options by their learned values:

$$u_i = \exp\left(K \frac{\mu_0 - \mu_i}{\sqrt{2(\sigma_0^2 + \sigma_i^2)}}\right) + \varepsilon_i$$

Higher-value options get higher weights. When OL-MCTS expands, it samples options using these weights—high-μ options are tried more often.

This creates a *focus effect*: instead of wasting time exploring poor options, the algorithm quickly converges to the few that matter for the current game.

### Transfer Learning Across Games

Crucially: "The information learned in a game can be transferred if the same game is played again by supplying OL-MCTS with the option values of the previous game."

Why this works: option values are *type-independent*. A "go near movable" option in level 1 is similar to "go near movable" in level 2—they both pursue nearby objects. By remembering μ and σ, the algorithm can apply learned preferences across levels.

### The Trade-off

Learning has a cost: OL-MCTS must compute weights using the crazy stone formula at each node. On the *first* game, OL-MCTS can underperform O-MCTS due to this overhead. But by the *fifth* game, with learned values, OL-MCTS pulls ahead: "OL-MCTS improves its performance on speciﬁc games by learning expected values for options and moving a bias to higher valued options."
