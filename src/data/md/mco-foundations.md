## Markov Decision Processes

Games are modeled as MDPs: tuples ⟨*S*, *A*, *T*, *R*⟩ where:
- **S**: the set of all game states (player position, enemies, score, etc.)
- **A**: the set of possible actions (up, down, left, right, fire, …)
- **T**: transition function that gives the probability of reaching state *s'* from state *s* via action *a*
- **R**: reward function that assigns a score when a transition occurs

An agent maximizes cumulative reward by choosing good actions. The challenge: the agent doesn't know *T* and *R* in advance—it discovers them by playing.

## Monte Carlo Tree Search (MCTS)

MCTS builds a search tree by playing out *simulations* and learning which actions lead to high scores. Each iteration has four phases:

1. **Selection**: follow the tree downward using UCT (an exploration-exploitation balance formula) until reaching a node with unexplored children
2. **Expansion**: try a new action, creating a new node
3. **Rollout**: play randomly from that node until the game ends
4. **Backup**: save the final reward to all visited nodes

The UCT formula for node selection is:

$$\text{UCT} = \bar{v}_{s'} + C_p \sqrt{\frac{\ln n_s}{n_{s'}}}$$

where $\bar{v}_{s'}$ is the average reward from child *s'*, *n_s* is visits to the current node, *n_{s'}* is visits to child, and *C_p* controls exploration vs. exploitation.

Repeating this thousands of times builds estimates of which actions are valuable in each state.

## Options

An **option** is a predeﬁned policy (sequence of actions) aimed at achieving a specific subgoal. Formally: ⟨*I*, π, β⟩ where:
- **I** (initiation set): the states in which this option can start
- **π** (policy): the rule for choosing actions while the option is active
- **β** (termination condition): when to stop following this option (the subgoal is reached, or it becomes impossible)

Example: in a game with a key and a locked door, you might define:
- **GoToKey option**: π moves the avatar toward the key; β terminates when the key is collected
- **GoToDoor option**: π moves toward the door; β terminates when adjacent to it

Once an option terminates, the agent chooses a new option. This is the *abstraction layer* MCTS lacks.
