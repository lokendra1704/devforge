# Build an LRU cache

**Where you've already met it:** your phone keeps recent apps in memory and kills the least-recently-used one when RAM runs out. Redis does the same with `maxmemory-policy allkeys-lru`. CPU caches, page caches, CDN nodes — eviction by recency is everywhere, because *recently used* is the best cheap predictor of *about to be used again*.

## The contract

```
LRUCache(capacity)
  get(key)        → value or -1; marks key as most-recently-used
  put(key, value) → insert/update; marks as most-recently-used;
                    if over capacity, evict the least-recently-used key
```

**Both operations must be O(1).** That requirement is the entire puzzle.

## Why one data structure can't do it

- **Hash map alone:** O(1) lookup ✓ — but which key is least recent? You'd scan everything. ✗
- **Array/list alone:** keep items in recency order ✓ — but finding a key is O(n), and moving it to the front means shifting. ✗

Each structure is great at exactly what the other is terrible at. So: **use both, pointing at each other.**

## The classic combination

1. A **doubly linked list** holds entries in recency order — most recent at the head, victim at the tail. Moving a node to the head is O(1) *if you already hold the node* (rewire 4 pointers, no shifting).
2. A **hash map** from key → **list node** (not just the value!). That's what lets you *get* the node in O(1) so the list can move it in O(1).

```
get(key):  node = map.get(key) → unlink node, relink at head → return node.value
put(k, v): exists? update value + move to head
           else: new node at head; if size > capacity:
                 evict tail node AND delete its key from the map
```

The bug everyone writes once: evicting from the list but forgetting `map.delete(tailKey)` — the map grows forever and a `get` of the evicted key resurrects a ghost.

## The JS shortcut (know it, then do it properly)

JavaScript's `Map` remembers insertion order, so you can fake LRU: on `get`, delete + re-insert the key (sends it to the back); on eviction, remove `map.keys().next().value` (the front). Totally valid in production JS — but interviewers ask for the linked-list version *because* wiring it is the test. In the challenge ahead, the `Map`-order trick is acceptable to pass, but write the node version at least once in your life.

## Talking points that score

- "Both structures point at each other: the map gives O(1) *find*, the list gives O(1) *reorder/evict*."
- "`get` is a write in disguise — it mutates recency. So even reads need locking if this were concurrent."
- "Eviction must keep both structures in sync — the map delete is the classic missed line."
