import type { Subject } from '../types'
import motivationMd from './md/sira-motivation.md?raw'
import bm25Md from './md/sira-bm25.md?raw'
import methodMd from './md/sira-method.md?raw'
import resultsMd from './md/sira-results.md?raw'
import tradeoffsMd from './md/sira-tradeoffs.md?raw'

export const sira: Subject = {
  id: 'sira',
  title: 'SIRA: Superintelligent Retrieval Agent',
  tagline:
    'Meta Superintelligence Labs, June 2026 — a one-shot, corpus-grounded BM25 retrieval agent that out-retrieves dense, sparse, and multi-round agentic baselines without training, fine-tuning, or relevance labels.',
  icon: '🔍',
  accent: '#2dd4bf',
  modules: [
    {
      id: 'sira-m1',
      title: 'SIRA: Superintelligent Retrieval Agent',
      description:
        'Yang, Ma, Chen & Shrivastava (Meta Superintelligence Labs, 2026): compressing multi-round exploratory search into a single corpus-discriminative BM25 retrieval action — and a new 25.6M-document hard-search benchmark, BrowseComp-Wikipedia.',
      lessons: [
        {
          id: 'sira-motivation',
          title: 'Retrieval agents that search like newcomers',
          minutes: 12,
          xp: 60,
          steps: [
            { kind: 'read', title: 'The black box at the center of agentic retrieval', markdown: motivationMd },
            {
              kind: 'quiz',
              title: 'The gap SIRA targets',
              questions: [
                {
                  prompt:
                    "What is the \"retrieval-context advantage\" that multi-round search agents rely on, and why does the paper call it costly?",
                  options: [
                    "Each search round dumps snippets and discovered entities into the LLM's context, so later queries are written with accumulated evidence — but this relies on long-context retention that's unreliable when evidence is buried in long contexts",
                    'It is a financial advantage — multi-round agents are cheaper per query than one-shot retrieval',
                    "It refers to SIRA's DF filter giving the query extra context about the corpus before retrieval",
                    'It is the advantage dense retrievers get from being pre-trained on a large context window',
                  ],
                  answer: 0,
                  explanation:
                    'Section 1: agents "compensate for weak retrieval control by learning the corpus through interaction. This strategy is expensive and noisy, and it relies increasingly on long-context LLMs to retain and use many intermediate passages — a regime known to be unreliable when relevant evidence is buried in long contexts."',
                },
                {
                  prompt:
                    "SIRA defines \"superintelligence in retrieval\" as a four-step compression of multi-round search into one action. Which sequence matches Section 1's definition?",
                  options: [
                    'Form a domain-informed expectation of relevant evidence → ground it using document-frequency signals → compile into explicit retrieval controls → execute transparently',
                    'Issue a query → read snippets → reformulate → repeat until evidence emerges',
                    'Train a dense retriever → fine-tune on relevance labels → embed the corpus → run nearest-neighbor search',
                    'Generate a hypothetical answer document → embed it → search for similar documents',
                  ],
                  answer: 0,
                  explanation:
                    'Section 1 gives exactly this four-step definition: "(i) form a domain-informed expectation of what relevant evidence looks like, (ii) ground that expectation using lightweight index-aware signals (document frequency), (iii) compile the result into explicit retrieval controls, and (iv) execute retrieval efficiently and transparently."',
                },
                {
                  prompt:
                    "Classical IR theory says a query can be \"plausible\" yet still fail at retrieval. Why, according to Section 1?",
                  options: [
                    'Retrieval is a comparative ranking problem — gold evidence must outrank many non-gold confusers, and a plausible query might also match many distractors or omit the rare terms that would separate gold from confusers',
                    "Because BM25's IDF weighting penalizes any query longer than a few terms",
                    'Because plausible queries always have low document frequency',
                    'Because dense retrievers cannot process plausible queries at all',
                  ],
                  answer: 0,
                  explanation:
                    'Section 1: "Retrieval is not just a question of whether a query is semantically related to the desired document; it is a comparative ranking problem in which the gold evidence must outrank many non-gold confusers." A query about the right topic can still fail this ranking contest.',
                },
              ],
            },
          ],
        },
        {
          id: 'sira-bm25',
          title: 'BM25: the substrate SIRA programs',
          minutes: 10,
          xp: 50,
          steps: [
            { kind: 'read', title: 'What BM25 already gets right', markdown: bm25Md },
            {
              kind: 'quiz',
              title: 'Reading the BM25 formula',
              questions: [
                {
                  prompt:
                    'In BM25, a query term appears in 950,000 of 1,000,000 documents; another appears in only 12. How does IDF treat them?',
                  options: [
                    'The common term gets near-zero IDF weight; the rare term gets a large IDF weight — BM25 already rewards rare, discriminative terms',
                    'Both get the same IDF weight, since IDF depends only on term frequency within a document, not corpus frequency',
                    'The common term gets a larger weight because it is more likely to be relevant',
                    'IDF is undefined for terms appearing in fewer than 100 documents',
                  ],
                  answer: 0,
                  explanation:
                    'Section 1: BM25 "naturally rewards rare, discriminative terms via IDF weighting, so domain-specific jargon... becomes a powerful retrieval signal." A term in nearly every document contributes near-zero IDF; a rare term contributes a large weight.',
                },
                {
                  prompt: "What does the parameter b control in BM25's TF-saturation term?",
                  options: [
                    'How much the score is normalized for document length relative to the corpus average — b=1 fully normalizes, b=0 ignores document length entirely',
                    'The minimum number of query terms required for a match',
                    'The number of documents an agent must inspect before retrieving',
                    'The threshold above which IDF becomes negative',
                  ],
                  answer: 0,
                  explanation:
                    'Section 2: "The parameter b governs length normalization: at b=1 the score fully normalizes for document length, while at b=0 document length is ignored."',
                },
                {
                  prompt:
                    "Why does the paper say BM25's inverted index gives an LLM agent something a dense retriever's vector index doesn't?",
                  options: [
                    'Before retrieving, the agent can check whether a candidate term exists in the corpus, how many documents contain it, and how much IDF weight it would contribute — there is no equivalent "check before you commit" step for an opaque vector index',
                    'Inverted indexes are always faster to query than vector indexes, regardless of corpus size',
                    'BM25 scores are always higher than cosine-similarity scores',
                    'Dense retrievers cannot represent rare terms at all',
                  ],
                  answer: 0,
                  explanation:
                    'Section 2: "Before retrieval, an agent can check whether a candidate term appears in the corpus, how many documents contain it, and how much IDF weight it can contribute. These signals... expose whether LLM-proposed vocabulary is absent, too common, or likely to create retrieval margin."',
                },
              ],
            },
          ],
        },
        {
          id: 'sira-method',
          title: 'The two-stage enrichment pipeline',
          minutes: 15,
          xp: 75,
          steps: [
            { kind: 'read', title: 'Enriching the corpus and the query, one shot each', markdown: methodMd },
            {
              kind: 'quiz',
              title: 'Corpus-side vs. query-side enrichment',
              questions: [
                {
                  prompt:
                    "SIRA's DF filter is shared by both enrichment stages, but query-side enrichment adds an extra condition that corpus-side enrichment doesn't need. What is it, and why?",
                  options: [
                    'Query-side requires DF > 0 — every expansion term must already exist in the (enriched) index to affect BM25 scoring; corpus-side enrichment does not need this because it is the mechanism that introduces new vocabulary into the index in the first place',
                    'Query-side requires DF = 0 — only brand-new terms are allowed as expansions',
                    'Corpus-side requires a lower bound on DF, but query-side does not, since corpus-side terms are injected as n-grams',
                    'Both stages require exactly the same bounds; there is no difference',
                  ],
                  answer: 0,
                  explanation:
                    'Section 3.2: "For query-side enrichment, the filter additionally requires DF > 0, ensuring that every expansion phrase actually exists in the enriched index... Corpus-side enrichment does not require this lower bound, since enrichment itself introduces new vocabulary into the index."',
                },
                {
                  prompt:
                    "On the query side, SIRA's expected-response sketch is explicitly forbidden from \"guessing the answer itself\" for factoid queries. Why?",
                  options: [
                    'If the LLM guessed a specific named entity as the likely answer, it would bias retrieval toward that one candidate instead of broadening coverage of relevant evidence — the sketch is a vocabulary prior, not an answer guess',
                    'Because the LLM is not capable of producing named entities',
                    "Because guessing the answer would violate the DF filter's upper bound",
                    'Because factoid queries never have a single correct answer',
                  ],
                  answer: 0,
                  explanation:
                    'Section 3.2: predicting a named entity "would bias retrieval toward a single candidate rather than broadening coverage of relevant evidence." The sketch predicts vocabulary the answer document would use, not the answer itself.',
                },
                {
                  prompt:
                    'In score(d) = BM25(q_orig, d) + w · BM25(q_exp, d), what role does q_exp play relative to q_orig?',
                  options: [
                    'q_exp adds discriminative signal on top of the original query — q_orig is never discarded; q_exp only supplements it, weighted by w',
                    'q_exp replaces q_orig entirely once expansion terms pass the DF filter',
                    'q_exp is used only to re-rank documents already retrieved by q_orig, never to retrieve new documents',
                    'w is always set to 1, so q_orig and q_exp are weighted equally by construction',
                  ],
                  answer: 0,
                  explanation:
                    'Eq. 2 adds the two BM25 scores together: q_orig always contributes its full score, and q_exp contributes an additional w-weighted score on top — "the original query is never discarded."',
                },
              ],
            },
            {
              kind: 'code',
              title: 'Implement the DF filter',
              challenge: {
                prompt:
                  "Section 3.2 defines the document-frequency (DF) filter shared by both enrichment stages:\n\n> \"The filter enforces an upper bound DF ≤ τ·|C|, pruning terms that are repeated across too much of the corpus... For query-side enrichment, the filter additionally requires DF > 0... Corpus-side enrichment does not require this lower bound.\"\n\nImplement `dfFilter(df, corpusSize, tau, isQuerySide)`, returning `true` if the term passes the filter:\n- Always enforce `df <= tau * corpusSize` (the upper bound, `τ·|C|`).\n- If `isQuerySide` is `true`, additionally require `df > 0`.",
                starterCode:
                  'function dfFilter(df, corpusSize, tau, isQuerySide) {\n  // TODO: enforce df <= tau * corpusSize always,\n  // and df > 0 additionally when isQuerySide is true\n  return true\n}',
                solution:
                  'function dfFilter(df, corpusSize, tau, isQuerySide) {\n  if (isQuerySide && df <= 0) return false\n  return df <= tau * corpusSize\n}',
                tests:
                  "test('corpus-side term within the DF upper bound passes', () => {\n  assertEqual(dfFilter(5, 1000, 0.1, false), true)\n})\n\ntest('corpus-side term exceeding tau*|C| is rejected as too common', () => {\n  assertEqual(dfFilter(500, 1000, 0.1, false), false)\n})\n\ntest('query-side term with DF=0 is rejected even though it is within the upper bound', () => {\n  assertEqual(dfFilter(0, 1000, 0.1, true), false)\n})\n\ntest('query-side term with a valid positive DF within bound passes', () => {\n  assertEqual(dfFilter(5, 1000, 0.1, true), true)\n})",
              },
            },
          ],
        },
        {
          id: 'sira-results',
          title: 'What SIRA buys you: BEIR, QA, and BrowseComp-Wikipedia',
          minutes: 15,
          xp: 75,
          steps: [
            { kind: 'read', title: 'From BEIR averages to a 232-query hard-search benchmark', markdown: resultsMd },
            {
              kind: 'quiz',
              title: 'Reading the evaluation',
              questions: [
                {
                  prompt:
                    "On BEIR, SIRA's largest relative gains over E5 (+36% SciDocs, +23% CQADupStack, +14% ArguAna) cluster in a specific kind of dataset. What do these have in common?",
                  options: [
                    'They are settings where query and document vocabulary diverge most — exactly where LLM-proposed terminology, DF filtering, and IDF-weighted BM25 have the most to add',
                    'They are the datasets with the smallest corpora, where BM25 alone is already near-perfect',
                    'They are the only datasets where SIRA used relevance-label fine-tuning',
                    'They are the datasets where dense retrieval is provably impossible',
                  ],
                  answer: 0,
                  explanation:
                    'Section 4.2: "These are precisely the settings where corpus-grounded enrichment should help: the LLM proposes missing terminology, the DF filter removes absent or overly common terms, and BM25 amplifies the surviving discriminative vocabulary."',
                },
                {
                  prompt:
                    'GrepRAG and ShellAgent share SIRA\'s exact LLM backbone but score far lower on BEIR (Recall@10 of 0.280 and 0.253 vs. SIRA\'s 0.691). What does this isolate?',
                  options: [
                    'The retrieval interface itself — grep-style pattern generation lacks BM25\'s document-frequency and IDF-weighted scoring, while SIRA turns LLM proposals into weighted retrieval signals',
                    'It shows the LLM backbone is the bottleneck, since both agents use the same model',
                    'It shows that grep-based tools are faster than BM25 but less accurate',
                    'It shows that SIRA requires a larger model than GrepRAG and ShellAgent',
                  ],
                  answer: 0,
                  explanation:
                    'Section 4.2: "Because the backbone is shared, the gap isolates the retrieval interface: grep-style agents search with patterns that lack BM25\'s document-frequency and IDF-weighted term scoring, while SIRA turns LLM proposals into weighted retrieval signals."',
                },
                {
                  prompt:
                    "On BrowseComp-Wikipedia, SIRA (Claude 4.6 Opus) reaches 9.70% Recall@1 vs. Perplexity's 2.59% — despite Perplexity browsing up to 100 turns and SIRA committing to one query before reading any page. What's the paper's interpretation?",
                  options: [
                    "Hard search isn't only about having a powerful LLM or search engine — it's about constructing the right corpus-grounded retrieval action; more browsing turns don't substitute for that",
                    'Perplexity\'s search engine is fundamentally broken and returns random results',
                    "SIRA's result only holds because Wikipedia is a small corpus",
                    '100 turns of browsing always outperforms one-shot retrieval on harder benchmarks',
                  ],
                  answer: 0,
                  explanation:
                    'Section 4.4: "Hard search is not only about having a powerful LLM or a strong commercial search engine, but about constructing the right corpus-grounded retrieval action." The Wikipedia index has 25.6M documents — far from small.',
                },
              ],
            },
          ],
        },
        {
          id: 'sira-tradeoffs',
          title: 'When to reach for SIRA',
          minutes: 15,
          xp: 70,
          steps: [
            { kind: 'read', title: 'Three boundaries on the claim', markdown: tradeoffsMd },
            {
              kind: 'scenario',
              title: 'Adopting SIRA: four design calls',
              scenario: {
                intro:
                  "The read above covered three boundaries on SIRA's claim: what \"training-free\" replaces, the one-shot regime as a deliberate scoping (not a hard ceiling), and the two different SIRA configurations (full corpus-side enrichment vs. BrowseComp-Wikipedia's category-grounded variant). Work through four decisions a team adopting SIRA might face.",
                stages: [
                  {
                    situation:
                      'A team is building search for an internal engineering wiki. They have no click logs, no relevance labels, and no budget to fine-tune a retriever — but the wiki is full of internal jargon, acronyms, and project codenames that rarely appear verbatim in user queries.',
                    question: "Based on SIRA's results, which retrieval approach best fits this setting?",
                    options: [
                      {
                        label:
                          'SIRA-style enrichment: corpus-side, an LLM proposes the missing jargon/acronym vocabulary per document (DF-filtered, injected once); query-side, an LLM predicts evidence vocabulary missing from the query — both validated against corpus statistics, no training required',
                        quality: 'best',
                        feedback:
                          'Section 4.2\'s largest gains (SciDocs +36%, CQADupStack +23%) come from exactly this kind of vocabulary gap, and the whole pipeline runs "without relevance labels, without fine-tuning a retriever, and without building an embedding index" — matching this team\'s constraints precisely.',
                      },
                      {
                        label: 'Fine-tune a dense retriever like E5 on whatever relevance signal can be scraped together',
                        quality: 'bad',
                        feedback:
                          'Dense retrievers like E5 need "large-scale relevance labels and interaction logs that calibrate the model to a platform\'s user population" (Section 1) — exactly what this team lacks. Even with such data, SIRA still beat E5 on most BEIR datasets, with the largest gaps on jargon-heavy, vocabulary-divergent corpora like this one.',
                      },
                      {
                        label: 'Use plain BM25 as-is, since it is already transparent and auditable',
                        quality: 'ok',
                        feedback:
                          "Plain BM25 is the lowest-scoring system on BEIR averages (0.530 Recall@10 vs. SIRA's 0.691) — it's transparent and auditable, but Section 1 names exactly this gap: \"the missing ingredient has been a mechanism to surface the right rare terms,\" which is precisely what this jargon-heavy wiki needs.",
                      },
                    ],
                  },
                  {
                    situation:
                      'A teammate proposes replacing SIRA\'s strict one-shot retrieval with a fully agentic, multi-round Perplexity-style loop for ALL queries — arguing that "more search rounds can only help, and the paper itself says multiple queries could improve performance."',
                    question: "How should you respond, given Section 1.1's framing of the one-shot regime?",
                    options: [
                      {
                        label:
                          "The one-query regime is a deliberate experimental scoping to isolate retrieval quality, not a claim that multi-round is useless — but multi-round agents pay for adaptivity via the \"retrieval-context advantage,\" which the paper calls expensive, noisy, and reliant on long-context retention that's unreliable when evidence is buried. Default to a single corpus-grounded query; reserve multi-round for tasks where the information need genuinely evolves mid-search",
                        quality: 'best',
                        feedback:
                          'Section 1.1: the one-query regime "isolates the central question: how far can retrieval go when the agent must formulate the right lexical action without reading retrieved snippets?" Section 1 separately calls multi-round context-accumulation "expensive and noisy."',
                      },
                      {
                        label: 'Agreed — switch everything to multi-round Perplexity-style browsing, since the paper admits more queries could help',
                        quality: 'bad',
                        feedback:
                          'This misreads the scoping. On BrowseComp-Wikipedia, 100 turns of Perplexity browsing still underperformed SIRA\'s single corpus-grounded query at every retrieval budget (Section 4.4) — "more rounds" is not free, and is not guaranteed to help.',
                      },
                      {
                        label: 'Reject multi-round entirely — the paper proves one-shot is always better',
                        quality: 'ok',
                        feedback:
                          'Too strong a reading. The paper explicitly says "multiple queries could improve performance" (Section 1.1) — it isolates the one-shot case to answer a specific research question, not to rule out multi-round forever.',
                      },
                    ],
                  },
                  {
                    situation:
                      'Your corpus is case law from a small jurisdiction, written in regional legal terminology that is underrepresented in most LLM pretraining data. A stakeholder wants to roll out SIRA\'s corpus-side enrichment to the full 2-million-document corpus this week.',
                    question: "What does Section 4.4's stated limitation suggest you do first?",
                    options: [
                      {
                        label:
                          "Pilot corpus-side enrichment on a small sample first and manually check whether the LLM's proposed vocabulary is actually useful and grounded for this domain — Section 4.4 flags that for corpora \"far outside the LLM's pretraining distribution,\" corpus-side adaptation or fine-tuning may be needed before enrichment terms are reliable",
                        quality: 'best',
                        feedback:
                          'This is Section 4.4 directly: "We have not evaluated settings where the corpus is far outside the LLM\'s pretraining distribution; in such domains, corpus-side adaptation or fine-tuning may be needed before the LLM can propose reliable enrichment terms." A small pilot is the proportionate first step.',
                      },
                      {
                        label: 'Roll out to the full corpus immediately — SIRA is training-free, so domain does not matter',
                        quality: 'bad',
                        feedback:
                          '"Training-free" describes the retrieval mechanism (BM25 + DF filter), not a guarantee that the LLM\'s proposed vocabulary is good for any domain. Section 4.4 explicitly flags this exact scenario as untested.',
                      },
                      {
                        label: 'Skip enrichment entirely and use plain BM25 for this corpus, since LLM proposals cannot be trusted here',
                        quality: 'ok',
                        feedback:
                          "Too defeatist. The paper doesn't say enrichment fails outside the pretraining distribution — only that it's untested and may need adaptation. Piloting first (not abandoning enrichment) is the proportionate response to an open question.",
                      },
                    ],
                  },
                  {
                    situation:
                      'Inspired by BrowseComp-Wikipedia\'s result, a team wants to replicate SIRA\'s exact category-grounded setup for a corpus of internal PDF reports that has no taxonomy, tags, or category metadata at all.',
                    question: 'Does the BrowseComp-Wikipedia configuration transfer directly to this corpus?',
                    options: [
                      {
                        label:
                          "No — BrowseComp-Wikipedia's variant deliberately removed LLM-based corpus-side enrichment and substituted Wikipedia's pre-existing category graph as corpus-visible structure (Section 4.4). A corpus with no taxonomy has no equivalent to validate against, so the applicable design is the main pipeline from Section 3.2: LLM-proposed corpus-side enrichment, DF-filtered and injected as index entries — as evaluated on BEIR",
                        quality: 'best',
                        feedback:
                          "This is the distinction the tradeoffs read draws out: the two evaluated SIRA configurations have different prerequisites, and BrowseComp-Wikipedia's prerequisite (an existing category graph) doesn't exist here. The BEIR-evaluated pipeline (Section 3.2) has no such prerequisite.",
                      },
                      {
                        label: 'Yes — just skip the category-grounding step and run the same prompt; SIRA will generate its own categories',
                        quality: 'bad',
                        feedback:
                          'Section 4.4 is explicit that proposed categories "must be grounded through the Wikipedia category graph before it can be used in the final BM25 query" — specifically to prevent hallucination. Without a real graph to validate against, that safeguard has nothing to check against.',
                      },
                      {
                        label: 'Use plain BM25 with no enrichment, since neither SIRA configuration fits as-is',
                        quality: 'ok',
                        feedback:
                          "Too defeatist. The main pipeline (Section 3.2: LLM-proposed corpus-side enrichment + DF filter) doesn't require any pre-existing category structure — it's exactly the configuration evaluated on all ten BEIR corpora, none of which had Wikipedia-style categories either.",
                      },
                    ],
                  },
                ],
                debrief:
                  "SIRA's case rests on three boundaries: (1) \"training-free\" is a comparison against retrievers that need relevance labels and fine-tuning — it doesn't mean domain-agnostic, since the LLM still needs to know the domain well enough to propose useful vocabulary; (2) the one-shot evaluation is a deliberate scoping to isolate retrieval quality, not a claim that multi-round search is never useful; and (3) the paper evaluates two configurations with different prerequisites — full corpus-side LLM enrichment (Section 3.2, used for BEIR/QA) versus a category-grounded, enrichment-free variant that leans on Wikipedia's pre-existing category graph (Section 4.4). Matching the configuration to what your corpus actually has is the adoption decision.",
              },
            },
          ],
        },
      ],
    },
  ],
}
