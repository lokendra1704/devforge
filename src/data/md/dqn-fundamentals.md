# RL Fundamentals: MDPs and Value Functions

To solve games from raw pixels, we need a clean mathematical framework. The Markov Decision Process (MDP) provides exactly that.

## The Setup

An agent interacts with an environment in a loop:
1. Agent observes the current state s (a video frame)
2. Agent chooses an action a from the legal set A = {1, ..., K}
3. Environment responds with a reward r and the next state s'
4. Repeat

The key insight: because the agent only sees the current frame, which doesn't fully reveal the game state (two different scenes might look identical), we treat the sequence of observations and actions as our true state: s_t = x₁, a₁, x₂, ..., a_{t-1}, x_t.

## Discounted Returns

The agent's goal is to maximize future rewards. We discount future rewards exponentially by a factor γ per timestep to prefer immediate rewards:

R_t = Σ γ^(t'-t) r_t'

This discounting is both practical (let's prioritize immediate gains) and mathematical (it makes the sum converge even in infinite games).

## The Action-Value Function Q

Define Q*(s, a) = the maximum expected return achievable by taking action a in state s, then following the optimal policy forever after. This is the value we want to learn: it tells us "which action is best?" by predicting future reward for each choice.

The key observation: Q satisfies a recursive identity called the **Bellman equation**:

Q*(s, a) = E[r + γ · max_{a'} Q*(s', a') | s, a]

**Why this matters:** We don't need to know the environment's dynamics — we can iteratively improve our estimate of Q by using the Bellman equation as an update rule.

## Q-Learning: Learning Q from Samples

The simplest approach: represent Q using a function approximator (traditionally, a lookup table or linear function). Update it by sampling (state, action, reward, next state) transitions from the environment:

Q_{i+1}(s, a) ← (r + γ · max_{a'} Q_i(s', a'))

This converges to Q* under mild conditions. The algorithm is **model-free** (we don't need to learn the environment's transition dynamics) and **off-policy** (we can learn about the optimal policy while following a different, exploratory behavior policy).

## Why Neural Networks Break This

Applying Q-learning with a neural network function approximator (parameterized by θ) introduces a subtle trap: the targets for training depend on the network's own weights. The loss function becomes:

L(θ) = E[(r + γ · max_{a'} Q(s', a'; θ_{old}) - Q(s, a; θ))²]

When using consecutive samples from the game (highly correlated), and updating θ on the same stream (non-stationary distribution), neural networks can diverge catastrophically. This is why deep RL seemed impossible: Q-learning + deep networks = instability.
