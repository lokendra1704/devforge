import type { Subject } from '../types'
import patternMapMd from './md/dsa-pattern-map.md?raw'
import twoPointersMd from './md/dsa-two-pointers.md?raw'
import slidingWindowMd from './md/dsa-sliding-window.md?raw'
import binarySearchMd from './md/dsa-binary-search.md?raw'
import graphsMd from './md/dsa-graphs.md?raw'

export const dsa: Subject = {
  id: 'dsa',
  title: 'DSA Patterns',
  tagline: 'The ~15 patterns behind 3,000 LeetCode problems — see them, predict them, build them.',
  icon: '🧩',
  accent: '#34d399',
  modules: [
    {
      id: 'dsa-m1',
      title: 'The Pattern Mindset',
      description: 'Stop memorizing solutions. Start recognizing shapes.',
      lessons: [
        {
          id: 'dsa-pattern-map',
          title: 'Why patterns beat grinding 500 problems',
          minutes: 10,
          xp: 50,
          steps: [
            { kind: 'read', title: 'The pattern map', markdown: patternMapMd },
            {
              kind: 'quiz',
              title: 'Name that pattern',
              questions: [
                {
                  prompt:
                    '“Given a string, find the length of the longest substring that contains at most 2 distinct characters.” Which pattern fires?',
                  options: ['Dynamic Programming', 'Sliding Window', 'Two Pointers on a sorted array', 'Trie'],
                  answer: 1,
                  explanation:
                    '“**Longest substring** such that *a rule holds*” is the signature trigger for a variable-size **sliding window**. The rule here is “at most 2 distinct characters”, tracked with a frequency map.',
                },
                {
                  prompt:
                    '“You are given a 6×6 grid of warehouses. Starting from the depot, what is the minimum number of moves to reach the loading dock?” Which pattern?',
                  options: ['DFS', 'BFS', 'Binary Search', 'Greedy'],
                  answer: 1,
                  explanation:
                    '“**Minimum number of moves/steps**” on an unweighted grid means **BFS**, because BFS explores in rings of increasing distance — the first time you reach the target is guaranteed shortest.',
                },
                {
                  prompt:
                    '“Find the smallest divisor d such that dividing every element by d and summing the results stays under a threshold.” Which pattern?',
                  options: [
                    'Binary search on the answer space',
                    'Sliding window',
                    'Monotonic stack',
                    'Union-Find',
                  ],
                  answer: 0,
                  explanation:
                    '“**Smallest X such that** condition(X) holds”, where the condition is monotonic (a bigger divisor always gives a smaller sum) — that is the exact shape of **binary search on answers**.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'dsa-m2',
      title: 'Two Pointers',
      description: 'One comparison, one element eliminated forever. O(n²) → O(n).',
      lessons: [
        {
          id: 'dsa-two-pointers',
          title: 'Two Pointers: squeeze the search space',
          minutes: 12,
          xp: 60,
          steps: [
            { kind: 'read', title: 'The intuition', markdown: twoPointersMd },
            {
              kind: 'visualizer',
              title: 'Watch it run',
              visualizer: 'two-pointers',
              markdown:
                'Step through the animation below. At each step, ask yourself **before pressing Step**: which pointer will move, and why? Use **🎲 New input** until your prediction is right five times in a row — that is when you own the pattern.',
            },
            {
              kind: 'quiz',
              title: 'Check the invariant',
              questions: [
                {
                  prompt:
                    'Array [2, 4, 7, 11, 15], target 13. L=0 (value 2), R=4 (value 15). Sum is 17 > 13. What does the algorithm do, and what does it prove?',
                  options: [
                    'Move L right — 2 is too small to ever work',
                    'Move R left — 15 can never be in any valid pair, with anyone',
                    'Move both pointers inward to converge faster',
                    'Restart with L=1 because the first element failed',
                  ],
                  answer: 1,
                  explanation:
                    '15 paired with the **smallest remaining element** (2) already overshoots 13. If even the smallest partner is too much, every partner is. So 15 is eliminated **forever** — that permanent elimination is why the algorithm is O(n).',
                },
                {
                  prompt: 'Why does two pointers require the array to be sorted?',
                  options: [
                    'It does not — it works on any array',
                    'Sorting makes the code shorter but is optional',
                    'Sorted order is what lets one comparison eliminate an element against ALL possible partners',
                    'Because binary search is used internally',
                  ],
                  answer: 2,
                  explanation:
                    'The whole trick is the inference “too small with the biggest partner → too small with every partner.” That inference is only valid when order tells you who the biggest/smallest partner is. Unsorted input gives you no such leverage (use a hash map instead).',
                },
              ],
            },
          ],
        },
        {
          id: 'dsa-two-pointers-code',
          title: 'Code it: Pair Sum & Container With Most Water',
          minutes: 20,
          xp: 90,
          steps: [
            {
              kind: 'code',
              title: 'Pair sum in a sorted array',
              challenge: {
                prompt: `## Challenge 1: Pair Sum (sorted)

Implement \`pairSum(arr, target)\`:

- \`arr\` is **sorted ascending**, all values distinct
- Return the **indices** \`[i, j]\` (with \`i < j\`) of the two elements summing to \`target\`
- Return \`null\` if no such pair exists
- Required: **O(n) time, O(1) extra space** — no nested loops, no hash map

This is LeetCode 167 (*Two Sum II*), asked constantly at Amazon and Microsoft.`,
                starterCode: `function pairSum(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  // While the pointers haven't crossed:
  //   - sum too small -> which pointer moves?
  //   - sum too big   -> which pointer moves?
  // Return [left, right] on a hit, null if they cross.

}`,
                solution: `function pairSum(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  while (left < right) {
    const sum = arr[left] + arr[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;   // arr[left] can never work: discard it
    else right--;               // arr[right] can never work: discard it
  }
  return null;
}`,
                tests: `test('finds a pair in the middle', () => {
  assertEqual(pairSum([2, 4, 7, 11, 15], 18), [2, 3]);
});
test('finds a pair at the extremes', () => {
  assertEqual(pairSum([1, 3, 5, 9, 20], 21), [0, 4]);
});
test('returns null when no pair exists', () => {
  assertEqual(pairSum([1, 2, 3, 4], 100), null);
});
test('works on a two-element array', () => {
  assertEqual(pairSum([5, 7], 12), [0, 1]);
});
test('runs in O(n): survives a 200k-element array', () => {
  const big = Array.from({ length: 200000 }, (_, i) => i * 2);
  assertEqual(pairSum(big, 399994), [99996, 99999]);
});`,
              },
            },
            {
              kind: 'code',
              title: 'Container With Most Water',
              challenge: {
                prompt: `## Challenge 2: Container With Most Water

LeetCode 11 — a top-5 most-asked question at Meta and Google.

\`heights[i]\` is the height of a vertical wall at position \`i\`. Pick two walls; together with the x-axis they hold water. The water area is:

**area = min(height[L], height[R]) × (R − L)**

Implement \`maxArea(heights)\` returning the **maximum** possible area, in **O(n)**.

**The key question:** with pointers at both ends, moving either pointer shrinks the width. So which pointer can you afford to move — and why is moving the *taller* one provably pointless?`,
                starterCode: `function maxArea(heights) {
  let left = 0;
  let right = heights.length - 1;
  let best = 0;
  // Compute the area at each step.
  // Then move the pointer at the SHORTER wall inward.
  // (Moving the taller wall can only keep or reduce the area - width
  //  shrinks and the limiting short wall is still the limit.)

  return best;
}`,
                solution: `function maxArea(heights) {
  let left = 0;
  let right = heights.length - 1;
  let best = 0;
  while (left < right) {
    const area = Math.min(heights[left], heights[right]) * (right - left);
    best = Math.max(best, area);
    if (heights[left] < heights[right]) left++;
    else right--;
  }
  return best;
}`,
                tests: `test('classic LeetCode example', () => {
  assertEqual(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]), 49);
});
test('two walls only', () => {
  assertEqual(maxArea([1, 1]), 1);
});
test('best pair is not the two tallest walls', () => {
  assertEqual(maxArea([1, 2, 1]), 2);
});
test('monotonic increasing heights', () => {
  assertEqual(maxArea([1, 2, 3, 4, 5]), 6);
});
test('O(n) check on 150k walls', () => {
  const big = Array.from({ length: 150000 }, () => 1000);
  assertEqual(maxArea(big), 1000 * 149999);
});`,
              },
            },
          ],
        },
      ],
    },
    {
      id: 'dsa-m3',
      title: 'Sliding Window',
      description: 'Update incrementally instead of recomputing. The interview favorite.',
      lessons: [
        {
          id: 'dsa-sliding-window',
          title: 'Sliding Window: stop recomputing',
          minutes: 12,
          xp: 60,
          steps: [
            { kind: 'read', title: 'The intuition', markdown: slidingWindowMd },
            {
              kind: 'visualizer',
              title: 'Watch the window glide',
              visualizer: 'sliding-window',
              markdown:
                'This animation runs *Longest Substring Without Repeating Characters* on real strings. Watch what happens when a duplicate enters the window: **L jumps past the old copy instead of restarting at zero** — that jump is the entire reason this is O(n).',
            },
            {
              kind: 'quiz',
              title: 'Prove you saw it',
              questions: [
                {
                  prompt:
                    'In the variable-size window skeleton there is a for-loop (right) containing a while-loop (left). Why is the total work O(n) and not O(n²)?',
                  options: [
                    'Because the while-loop rarely executes in practice',
                    'Because left only moves forward — across the entire run it advances at most n times total',
                    'It actually is O(n²) in the worst case, O(n) on average',
                    'Because the window has constant maximum size',
                  ],
                  answer: 1,
                  explanation:
                    'This is **amortized analysis**: charge each inner-loop step to the element being evicted. Every element enters the window once and leaves at most once → at most 2n pointer movements overall, regardless of how the work clusters.',
                },
                {
                  prompt:
                    '“Find the longest **subsequence** (not necessarily contiguous) with all unique characters.” Is sliding window the right tool?',
                  options: [
                    'Yes — substring and subsequence are interchangeable here',
                    'No — sliding window requires contiguity; for subsequences you need a different approach',
                    'Yes, but you need two windows',
                    'Only if the string is sorted first',
                  ],
                  answer: 1,
                  explanation:
                    'A window is a **contiguous** range by definition. The moment a problem says *subsequence*, window invariants stop making sense — reach for hash maps / DP. (Here: it is just the count of distinct characters.) Spotting this anti-trigger is a strong interview signal.',
                },
              ],
            },
          ],
        },
        {
          id: 'dsa-sliding-window-code',
          title: 'Code it: Longest Substring Without Repeats',
          minutes: 15,
          xp: 80,
          steps: [
            {
              kind: 'code',
              title: 'The classic',
              challenge: {
                prompt: `## Longest Substring Without Repeating Characters

LeetCode 3 — by many counts the **single most-asked interview question in the world**.

Implement \`lengthOfLongestSubstring(s)\` returning the length of the longest substring of \`s\` with no repeated characters, in **O(n)**.

**Plan:**
1. Keep a \`Map\` from character → its last seen index
2. Walk \`right\` across the string
3. If \`s[right]\` was last seen **inside** the current window (at or after \`left\`), jump \`left\` to one past that old position
4. Track the best window length as you go`,
                starterCode: `function lengthOfLongestSubstring(s) {
  const lastSeen = new Map();
  let left = 0;
  let best = 0;
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    // 1) if ch was seen at index >= left, move left past that index
    // 2) record ch's position
    // 3) update best with the current window size

  }
  return best;
}`,
                solution: `function lengthOfLongestSubstring(s) {
  const lastSeen = new Map();
  let left = 0;
  let best = 0;
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (lastSeen.has(ch) && lastSeen.get(ch) >= left) {
      left = lastSeen.get(ch) + 1; // jump past the duplicate, never restart
    }
    lastSeen.set(ch, right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}`,
                tests: `test('abcabcbb -> 3 (abc)', () => {
  assertEqual(lengthOfLongestSubstring('abcabcbb'), 3);
});
test('bbbbb -> 1', () => {
  assertEqual(lengthOfLongestSubstring('bbbbb'), 1);
});
test('pwwkew -> 3 (wke) — the trap case', () => {
  assertEqual(lengthOfLongestSubstring('pwwkew'), 3);
});
test('empty string -> 0', () => {
  assertEqual(lengthOfLongestSubstring(''), 0);
});
test('abba -> 2 — duplicate BEFORE left must be ignored', () => {
  assertEqual(lengthOfLongestSubstring('abba'), 2);
});
test('O(n) check: 100k characters', () => {
  let s = '';
  const chunk = 'abcdefghij';
  for (let i = 0; i < 10000; i++) s += chunk;
  assertEqual(lengthOfLongestSubstring(s), 10);
});`,
              },
            },
          ],
        },
      ],
    },
    {
      id: 'dsa-m4',
      title: 'Binary Search',
      description: 'Halve the world — on arrays, and on answer spaces.',
      lessons: [
        {
          id: 'dsa-binary-search',
          title: 'Binary Search: on arrays and on answers',
          minutes: 18,
          xp: 90,
          steps: [
            { kind: 'read', title: 'Beyond sorted arrays', markdown: binarySearchMd },
            {
              kind: 'visualizer',
              title: 'Watch the space collapse',
              visualizer: 'binary-search',
              markdown:
                'Watch the dimmed (discarded) region double in size every step. **11 elements → 4 comparisons. A billion elements → 30.** That curve is why binary search shows up everywhere from git bisect to database indexes.',
            },
            {
              kind: 'code',
              title: 'Koko Eating Bananas',
              challenge: {
                prompt: `## Koko Eating Bananas (binary search on answers)

LeetCode 875 — the canonical "binary search the answer" problem.

Implement \`minEatingSpeed(piles, h)\`: Koko eats up to \`k\` bananas per hour from a single pile (a pile of 3 at speed 10 still takes a full hour). Return the **minimum integer speed k** that finishes all piles within \`h\` hours.

**Plan:**
1. Write the helper \`hoursNeeded(piles, k)\` = sum of \`Math.ceil(pile / k)\`
2. Binary search k over \`[1, max(piles)]\` for the first k where \`hoursNeeded <= h\`
3. Use the safe loop shape: \`while (lo < hi)\` with \`hi = mid\` / \`lo = mid + 1\``,
                starterCode: `function minEatingSpeed(piles, h) {
  function hoursNeeded(k) {
    // total hours to eat all piles at speed k
  }

  let lo = 1;
  let hi = Math.max(...piles);
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    // if mid is fast enough, mid might be the answer: keep it (hi = mid)
    // otherwise mid is too slow: discard it (lo = mid + 1)

  }
  return lo;
}`,
                solution: `function minEatingSpeed(piles, h) {
  function hoursNeeded(k) {
    let hours = 0;
    for (const p of piles) hours += Math.ceil(p / k);
    return hours;
  }

  let lo = 1;
  let hi = Math.max(...piles);
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (hoursNeeded(mid) <= h) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`,
                tests: `test('piles [3,6,7,11], h=8 -> 4', () => {
  assertEqual(minEatingSpeed([3, 6, 7, 11], 8), 4);
});
test('piles [30,11,23,4,20], h=5 -> 30 (one pile per hour)', () => {
  assertEqual(minEatingSpeed([30, 11, 23, 4, 20], 5), 30);
});
test('piles [30,11,23,4,20], h=6 -> 23', () => {
  assertEqual(minEatingSpeed([30, 11, 23, 4, 20], 6), 23);
});
test('plenty of time -> speed 1', () => {
  assertEqual(minEatingSpeed([1, 1, 1], 100), 1);
});
test('single huge pile', () => {
  assertEqual(minEatingSpeed([1000000000], 2), 500000000);
});`,
              },
            },
          ],
        },
      ],
    },
    {
      id: 'dsa-m5',
      title: 'Graphs: BFS & DFS',
      description: 'Islands, shortest paths, and the two traversals behind them all.',
      lessons: [
        {
          id: 'dsa-graphs',
          title: 'Islands, networks, and flood fill',
          minutes: 20,
          xp: 100,
          steps: [
            { kind: 'read', title: 'Two traversals to rule them all', markdown: graphsMd },
            {
              kind: 'code',
              title: 'Number of Islands',
              challenge: {
                prompt: `## Number of Islands

LeetCode 200 — Amazon's most-asked question for several years running.

Implement \`numIslands(grid)\` where \`grid\` is a 2D array of \`1\` (land) and \`0\` (water). Count islands: groups of 1s connected **up/down/left/right** (not diagonally).

**Plan:** scan every cell; when you find a \`1\`, increment the count and flood-fill (DFS) to sink the entire island (set every connected \`1\` to \`0\`). You may mutate the grid.

Watch out for: grid bounds, and sinking *before* recursing (or you'll loop forever).`,
                starterCode: `function numIslands(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;

  function sink(r, c) {
    // stop if out of bounds or on water
    // mark this cell as water, then sink all 4 neighbors

  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // found unvisited land? new island: count it and sink it

    }
  }
  return count;
}`,
                solution: `function numIslands(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;

  function sink(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] === 0) return;
    grid[r][c] = 0; // sink before recursing, or infinite loop
    sink(r + 1, c);
    sink(r - 1, c);
    sink(r, c + 1);
    sink(r, c - 1);
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 1) {
        count++;
        sink(r, c);
      }
    }
  }
  return count;
}`,
                tests: `test('one big island', () => {
  assertEqual(numIslands([
    [1, 1, 1, 1, 0],
    [1, 1, 0, 1, 0],
    [1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ]), 1);
});
test('three islands', () => {
  assertEqual(numIslands([
    [1, 1, 0, 0, 0],
    [1, 1, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 1, 1],
  ]), 3);
});
test('diagonals do NOT connect', () => {
  assertEqual(numIslands([
    [1, 0],
    [0, 1],
  ]), 2);
});
test('all water', () => {
  assertEqual(numIslands([[0, 0], [0, 0]]), 0);
});
test('single cell island', () => {
  assertEqual(numIslands([[1]]), 1);
});`,
              },
            },
            {
              kind: 'quiz',
              title: 'Traversal instincts',
              questions: [
                {
                  prompt:
                    '“A virus starts at cell (0,0) of a grid and spreads to adjacent cells each minute. How many minutes until cell (r,c) is infected?” Which traversal, and why?',
                  options: [
                    'DFS — it explores all reachable cells',
                    'BFS — it visits cells in order of distance, so the first arrival time is the answer',
                    'Either works equally well',
                    'Binary search on the number of minutes',
                  ],
                  answer: 1,
                  explanation:
                    '“How many **minutes/steps** until X” on an unweighted grid is shortest-path, and BFS *is* shortest-path for unweighted graphs: it processes everything at distance d before anything at distance d+1. DFS would find *a* path, not the fastest one.',
                },
                {
                  prompt: 'In BFS, when must a node be marked visited to avoid bugs?',
                  options: [
                    'When it is dequeued for processing',
                    'When it is first added to the queue',
                    'After all its neighbors are processed',
                    'Marking visited is optional if the graph has no cycles',
                  ],
                  answer: 1,
                  explanation:
                    'Mark on **enqueue**. If you wait until dequeue, the same node can be pushed onto the queue many times by different neighbors before it is ever processed — on dense graphs that blows the queue up exponentially.',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
