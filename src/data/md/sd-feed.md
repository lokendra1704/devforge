# Case study: the Instagram feed & the celebrity problem

"Design Instagram" is really one hard question wearing sunglasses: **how do you build the home feed?** Photos go in S3, metadata in a DB, serve via CDN — fine. The feed is where candidates live or die.

## The naive feed: fan-out on read

When a user opens the app, query everyone they follow and merge:

```sql
SELECT * FROM posts
WHERE author_id IN (...the 800 people you follow...)
ORDER BY created_at DESC LIMIT 50;
```

At small scale: works. At Instagram scale (500M daily feed opens): you're merging 800 timelines, **per open, at read time**. Feed latency = your slowest shard on your hottest path. It dies.

## The industry answer: fan-out on write

Flip it. When someone posts, **push** the post ID into a precomputed feed list (Redis) for *each of their followers*:

```
alice posts → for each of alice's 950 followers:
                LPUSH feed:<follower_id> <post_id>
```

Opening the app is now one Redis read — **a few milliseconds**. The expensive work happens once at write time, in the background, via a queue.

Why this trade is great: a typical user posts rarely (writes are few) but opens the app many times a day (reads are many). **Move work from the frequent operation to the rare one.**

## Then Virat Kohli signs up

He has **270M followers**. One post = 270M Redis pushes. At a generous 100k pushes/sec, that's **45 minutes of fan-out** — for one photo. Your queue backs up, everyone's feed goes stale, and a flood of celebrity posts can take the pipeline down.

This is the **celebrity problem** (hot key / skewed fan-out), and interviewers ask it *specifically to see if you know real systems are hybrids*.

## The hybrid (what's actually shipped)

- **Normal users** (<~10k followers): fan-out on write. Cheap, instant feeds.
- **Celebrities**: **no fan-out**. Their posts sit in their own timeline. When a follower opens the app: read your precomputed feed + fetch the handful of celebrities you follow + **merge at read time**. Merging 990 precomputed entries with 10 celebrity timelines is cheap; merging 800 full timelines was not.

One sentence to remember: **fan-out on write for the many, fan-out on read for the mighty.**

## Ranking, briefly

Chronological died in 2016. Real feeds: candidate generation (recent posts from your graph) → feature scoring (affinity, recency, predicted engagement, ML model) → re-ranking rules (don't show 5 posts from one author, inject ads). For an interview, naming those three stages is plenty unless they push.

## Transferable lessons

1. **Precompute what's read often; compute lazily what's read rarely.** (Same logic as caching, applied to data shape.)
2. **Skew breaks uniform designs.** Whenever you say "for each follower/user/key…", ask: *what's the max?* Power-law distributions (followers, video views, hashtags) guarantee a long tail that needs a special path.
3. Twitter/X, YouTube subscriptions, LinkedIn, and your notification system all reuse this exact pattern.
