# Islands, networks, and flood fill

**Real-life version.** Instagram detects communities: users are nodes, follows are edges, and "how many separate communities exist?" is literally *Number of Islands*. Your photo editor's paint-bucket tool? Flood fill — the same DFS. AWS asking "if this region dies, is the network still connected?" — same family.

Graphs sound scary; 80% of interview graph problems are **two traversals**:

## DFS — "go deep, then backtrack"

Explore one path to exhaustion, then back up. Natural with recursion:

```js
function dfs(node, visited) {
  visited.add(node);
  for (const next of neighbors(node))
    if (!visited.has(next)) dfs(next, visited);
}
```

Use for: counting components/islands, detecting cycles, exploring **all** paths, backtracking.

## BFS — "expand in rings"

Explore all nodes 1 step away, then 2 steps, then 3 — using a queue:

```js
const queue = [start]; const visited = new Set([start]);
while (queue.length) {
  const node = queue.shift();
  for (const next of neighbors(node))
    if (!visited.has(next)) { visited.add(next); queue.push(next); }
}
```

**The killer property: BFS visits nodes in order of distance.** The first time you reach the target, you reached it via a shortest path. Any problem saying **"minimum number of steps"** on an unweighted graph = BFS. No exceptions.

## Grids are graphs in disguise

A 2D grid is a graph where each cell has up to 4 neighbors. *Number of Islands*:

> Given a grid of 1s (land) and 0s (water), count islands — groups of 1s connected up/down/left/right.

The strategy:

1. Scan every cell.
2. Found an unvisited `1`? That's a **new island** — count it, then DFS/BFS to *sink* the whole island (mark every connected `1` as visited) so it's never counted again.

Each cell is visited a constant number of times → **O(rows × cols)**.

## The three rules that prevent 90% of graph bugs

1. **Mark visited when you *enqueue/enter*, not when you process** — or BFS adds the same node twice and your queue explodes.
2. **Check bounds before touching a grid neighbor** — `(r-1, c)` when `r = 0` is a crash.
3. **State your traversal choice out loud:** "shortest path → BFS; count/explore everything → DFS." Interviewers grade that sentence.

Now go sink some islands.
