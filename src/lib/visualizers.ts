export interface VizPointer {
  index: number
  label: string
  color: string // css color for the pointer chip
}

export interface VizFrame {
  cells: (number | string)[]
  pointers: VizPointer[]
  /** inclusive range highlighted as the current window */
  window?: [number, number]
  /** indices permanently dimmed (discarded search space) */
  dimmed?: number[]
  /** indices flashed as the answer */
  found?: number[]
  note: string
  stat?: string
}

export interface VizConfig {
  title: string
  legend: string
  frames: VizFrame[]
  /** regenerate with a fresh random input */
  randomize?: () => VizFrame[]
}

const EMERALD = '#34d399'
const SKY = '#38bdf8'
const AMBER = '#fbbf24'

// ---------- Two Pointers: pair sum in a sorted array ----------

function twoPointerFrames(arr: number[], target: number): VizFrame[] {
  const frames: VizFrame[] = []
  let l = 0
  let r = arr.length - 1
  const dimmed: number[] = []
  frames.push({
    cells: arr,
    pointers: [
      { index: l, label: 'L', color: EMERALD },
      { index: r, label: 'R', color: SKY },
    ],
    note: `Find two numbers that sum to ${target}. The array is sorted — start at both ends.`,
    stat: `target = ${target}`,
  })
  while (l < r) {
    const sum = arr[l] + arr[r]
    const base = {
      cells: arr,
      pointers: [
        { index: l, label: 'L', color: EMERALD },
        { index: r, label: 'R', color: SKY },
      ],
      dimmed: [...dimmed],
      stat: `arr[L] + arr[R] = ${arr[l]} + ${arr[r]} = ${sum}  (target ${target})`,
    }
    if (sum === target) {
      frames.push({ ...base, found: [l, r], note: `${arr[l]} + ${arr[r]} = ${target}. Found the pair! 🎯` })
      return frames
    }
    if (sum < target) {
      frames.push({
        ...base,
        note: `${sum} < ${target}. Every pair with arr[L]=${arr[l]} is too small (R is already the biggest partner). Discard L, move it right.`,
      })
      dimmed.push(l)
      l++
    } else {
      frames.push({
        ...base,
        note: `${sum} > ${target}. Every pair with arr[R]=${arr[r]} is too big (L is already the smallest partner). Discard R, move it left.`,
      })
      dimmed.push(r)
      r--
    }
  }
  frames.push({
    cells: arr,
    pointers: [],
    dimmed: [...dimmed],
    note: 'Pointers met — no pair sums to the target. We proved it in a single O(n) pass.',
  })
  return frames
}

function randomSortedArray(): { arr: number[]; target: number } {
  const n = 9
  const set = new Set<number>()
  while (set.size < n) set.add(1 + Math.floor(Math.random() * 30))
  const arr = [...set].sort((a, b) => a - b)
  // pick a real pair ~70% of the time
  if (Math.random() < 0.7) {
    const i = Math.floor(Math.random() * (n - 1))
    const j = i + 1 + Math.floor(Math.random() * (n - 1 - i))
    return { arr, target: arr[i] + arr[j] }
  }
  return { arr, target: arr[n - 1] + arr[n - 2] + 3 }
}

// ---------- Sliding Window: longest substring without repeating chars ----------

function slidingWindowFrames(s: string): VizFrame[] {
  const frames: VizFrame[] = []
  const cells = s.split('')
  const last = new Map<string, number>()
  let left = 0
  let best = 0
  let bestRange: [number, number] = [0, 0]
  frames.push({
    cells,
    pointers: [],
    note: 'Goal: longest substring with no repeating characters. Grow a window with R; shrink with L only when a rule breaks.',
  })
  for (let right = 0; right < cells.length; right++) {
    const ch = cells[right]
    if (last.has(ch) && last.get(ch)! >= left) {
      const dup = last.get(ch)!
      frames.push({
        cells,
        pointers: [
          { index: left, label: 'L', color: EMERALD },
          { index: right, label: 'R', color: SKY },
          { index: dup, label: 'dup', color: AMBER },
        ],
        window: [left, right],
        note: `'${ch}' already lives in the window (index ${dup}). Slide L past it — no restarting from scratch.`,
        stat: `best so far = ${best}`,
      })
      left = dup + 1
    }
    last.set(ch, right)
    const len = right - left + 1
    if (len > best) {
      best = len
      bestRange = [left, right]
    }
    frames.push({
      cells,
      pointers: [
        { index: left, label: 'L', color: EMERALD },
        { index: right, label: 'R', color: SKY },
      ],
      window: [left, right],
      note: `Window "${s.slice(left, right + 1)}" is valid (all unique). Length ${len}.`,
      stat: `best so far = ${best}`,
    })
  }
  frames.push({
    cells,
    pointers: [],
    window: bestRange,
    found: Array.from({ length: bestRange[1] - bestRange[0] + 1 }, (_, i) => bestRange[0] + i),
    note: `Done. Longest unique substring: "${s.slice(bestRange[0], bestRange[1] + 1)}" (length ${best}). Each pointer moved forward only → O(n).`,
    stat: `answer = ${best}`,
  })
  return frames
}

const WINDOW_SAMPLES = ['abcabcbb', 'interview', 'pwwkew', 'developer', 'mississippi', 'abcdefgah']

// ---------- Binary Search ----------

function binarySearchFrames(arr: number[], target: number): VizFrame[] {
  const frames: VizFrame[] = []
  let lo = 0
  let hi = arr.length - 1
  const dimmed: number[] = []
  frames.push({
    cells: arr,
    pointers: [
      { index: lo, label: 'lo', color: EMERALD },
      { index: hi, label: 'hi', color: SKY },
    ],
    note: `Searching for ${target}. Sorted input means one comparison can discard half the world.`,
    stat: `search space = ${hi - lo + 1} elements`,
  })
  while (lo <= hi) {
    const mid = (lo + hi) >> 1
    const base = {
      cells: arr,
      pointers: [
        { index: lo, label: 'lo', color: EMERALD },
        { index: mid, label: 'mid', color: AMBER },
        { index: hi, label: 'hi', color: SKY },
      ],
      dimmed: [...dimmed],
    }
    if (arr[mid] === target) {
      frames.push({
        ...base,
        found: [mid],
        note: `arr[mid] = ${arr[mid]} = target. Found it in ${frames.length} steps instead of up to ${arr.length}.`,
      })
      return frames
    }
    if (arr[mid] < target) {
      frames.push({
        ...base,
        note: `arr[mid] = ${arr[mid]} < ${target}. The answer can't be at mid or left of it — throw away the whole left half.`,
        stat: `search space = ${hi - lo + 1} → ${hi - mid}`,
      })
      for (let i = lo; i <= mid; i++) dimmed.push(i)
      lo = mid + 1
    } else {
      frames.push({
        ...base,
        note: `arr[mid] = ${arr[mid]} > ${target}. Throw away the right half.`,
        stat: `search space = ${hi - lo + 1} → ${mid - lo}`,
      })
      for (let i = mid; i <= hi; i++) dimmed.push(i)
      hi = mid - 1
    }
  }
  frames.push({
    cells: arr,
    pointers: [],
    dimmed: [...dimmed],
    note: `${target} is not in the array — proved in O(log n) comparisons.`,
  })
  return frames
}

function randomBinaryInput(): { arr: number[]; target: number } {
  const set = new Set<number>()
  while (set.size < 11) set.add(1 + Math.floor(Math.random() * 99))
  const arr = [...set].sort((a, b) => a - b)
  const target = Math.random() < 0.8 ? arr[Math.floor(Math.random() * arr.length)] : 100
  return { arr, target }
}

// ---------- registry ----------

export function getVisualizer(id: string): VizConfig {
  switch (id) {
    case 'two-pointers': {
      const make = () => {
        const { arr, target } = randomSortedArray()
        return twoPointerFrames(arr, target)
      }
      return {
        title: 'Two Pointers — Pair Sum (sorted array)',
        legend: 'L starts left, R starts right. Each step discards one element forever.',
        frames: twoPointerFrames([2, 4, 7, 11, 15, 19, 23, 26, 30], 30),
        randomize: make,
      }
    }
    case 'sliding-window': {
      const make = () =>
        slidingWindowFrames(WINDOW_SAMPLES[Math.floor(Math.random() * WINDOW_SAMPLES.length)])
      return {
        title: 'Sliding Window — Longest substring without repeats',
        legend: 'The shaded band is the current window. It only ever slides forward.',
        frames: slidingWindowFrames('abcabcbb'),
        randomize: make,
      }
    }
    case 'binary-search': {
      const make = () => {
        const { arr, target } = randomBinaryInput()
        return binarySearchFrames(arr, target)
      }
      return {
        title: 'Binary Search — halving the world',
        legend: 'Dimmed cells are discarded search space. Watch it shrink exponentially.',
        frames: binarySearchFrames([3, 8, 14, 21, 29, 35, 42, 57, 63, 78, 91], 57),
        randomize: make,
      }
    }
    default:
      throw new Error(`Unknown visualizer: ${id}`)
  }
}
