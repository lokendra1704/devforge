# Why patterns beat grinding 500 problems

Here's an uncomfortable truth: the people who pass FAANG interviews after solving 150 problems and the people who fail after solving 600 are usually separated by one thing — **the first group learned patterns, the second memorized solutions**.

LeetCode has ~3,000 problems. There are only **~15 underlying patterns**. Interviewers don't invent new algorithms; they re-skin these patterns with new stories.

## The pattern map

| Pattern | Trigger phrase in the problem | Classic example |
|---|---|---|
| **Two Pointers** | "sorted array", "pair/triplet with sum", "remove in-place" | Two Sum II, 3Sum |
| **Sliding Window** | "longest/shortest **substring/subarray** that…" | Longest Substring Without Repeats |
| **Binary Search** | "sorted", "minimum X such that…", "find the threshold" | Koko Eating Bananas |
| **BFS** | "shortest path", "minimum steps", "level by level" | Word Ladder, Rotten Oranges |
| **DFS / Backtracking** | "all combinations", "all paths", "count islands" | Number of Islands, Subsets |
| **Heap / Top-K** | "K largest", "K closest", "merge K…" | Kth Largest, Merge K Lists |
| **Hash Map** | "have you seen this before?", "count frequency" | Two Sum, Group Anagrams |
| **Stack / Monotonic Stack** | "next greater element", "valid parentheses", "previous smaller" | Daily Temperatures |
| **Linked List (fast/slow)** | "cycle", "middle of the list" | Linked List Cycle |
| **Intervals** | "merge", "overlapping", "meeting rooms" | Merge Intervals |
| **Dynamic Programming** | "number of ways", "min/max cost to reach…" | Climbing Stairs, Coin Change |
| **Greedy** | "maximum profit if you choose locally best" | Jump Game |
| **Topological Sort** | "prerequisites", "build order" | Course Schedule |
| **Union-Find** | "connected components", "groups merging over time" | Accounts Merge |
| **Trie** | "prefix", "autocomplete", "dictionary of words" | Word Search II |

## How to actually use this

1. **Read the problem and name the pattern out loud before coding.** "Longest subarray with at most K distinct elements" → the word *longest subarray* fires → Sliding Window. This is exactly how senior engineers think.
2. **Learn each pattern's *invariant*** — the property that stays true while the algorithm runs. Two pointers: "everything outside the pointers is proven useless." Sliding window: "the window is always valid (or one step from valid)."
3. **Solve 5–8 problems per pattern, not 50.** After the 5th sliding-window problem, the 6th feels like a re-skin — because it is.

> **Real-life parallel:** debugging a production memory leak is a binary search (bisect deploys), a news feed is a heap-merge (top-K), and `node_modules` resolution is a trie walk. These patterns are not interview trivia — they're how systems are built.

In this track you'll *watch* each pattern run as an animation, *predict* its behavior in quizzes, then *implement* it against real tests. That trio — see it, predict it, build it — is what makes it stick.
