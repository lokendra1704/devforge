# When to reach for SIRA

SIRA's results are strong, but the paper is also explicit about *where* the
claim applies and where it doesn't. Three boundaries matter for anyone deciding
whether to adopt it.

## 1. What "training-free" actually replaces

SIRA's headline comparison is against **trained** retrievers:

> "SIRA achieves the highest average Recall@10 on BEIR... without relevance
> labels, without fine-tuning a retriever, and without building an embedding
> index." — Section 4.2

A dense retriever like E5 needs "large-scale relevance labels and interaction
logs that calibrate the model to a platform's user population" (Section 1). If
you have those — and a stable user population to collect them from — a
well-tuned dense retriever is a real baseline, not a strawman; SIRA still beat
E5 on 8/10 BEIR datasets, but the *closest* competitor on BEIR averages was E5
(0.648 vs. SIRA's 0.691), not BM25 (0.530). The bigger the query–document
vocabulary gap (SciDocs, CQADupStack, ArguAna), the bigger SIRA's edge over E5.

## 2. The one-shot regime is a deliberate restriction, not a hard ceiling

SIRA is evaluated as "one LLM reasoning step, optional index-statistic checks,
and one BM25 call" — and the paper says so explicitly:

> "Multiple queries could improve performance, but the one-query regime isolates
> the central question: how far can retrieval go when the agent must formulate
> the right lexical action without reading retrieved snippets?" — Section 1.1

That's a scoping choice for the *experiment*, not a claim that multi-round search
is never useful. What the paper *does* argue is that multi-round agents pay for
their adaptivity with the "retrieval-context advantage" — they're "expensive and
noisy" and lean on long-context retention that's "unreliable when relevant
evidence is buried in long contexts" (Section 1). SIRA's one-shot result is
evidence that a large chunk of that multi-round cost was buying back something a
single well-constructed query could have gotten directly.

## 3. Two different SIRA configurations, two different prerequisites

The paper actually evaluates **two** versions of SIRA, and they have different
prerequisites:

| | BEIR / QA experiments | BrowseComp-Wikipedia |
|---|---|---|
| Corpus-side enrichment | LLM proposes new vocabulary per document, DF-filtered, injected as index entries (Section 3.2) | **Removed** — "we remove that expensive LLM-based document enrichment step" (Section 4.4) |
| Corpus-side structure used instead | — | Wikipedia's own category graph, every proposed category validated against it |

> "SIRA assumes that the frozen LLM can understand the query and provide useful
> semantic priors about the target corpus. We have not evaluated settings where
> the corpus is far outside the LLM's pretraining distribution; in such domains,
> corpus-side adaptation or fine-tuning may be needed before the LLM can propose
> reliable enrichment terms." — Section 4.4

The BrowseComp-Wikipedia result — beating a 100-turn Perplexity agent — leans on
Wikipedia's category graph as a *ready-made* source of corpus-visible structure.
A corpus without anything like that (raw PDFs, internal documents with no
taxonomy) would need the full corpus-side enrichment pipeline from Section 3.2,
which in turn depends on the LLM actually knowing the domain well enough to
propose useful vocabulary — the open question Section 4.4 flags.
