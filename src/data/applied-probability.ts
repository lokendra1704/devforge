import type { Subject } from '../types'
import foundationsMd from './md/apt-foundations.md?raw'
import classicalMd from './md/apt-classical.md?raw'
import combinatoricsMd from './md/apt-combinatorics.md?raw'
import geometricMd from './md/apt-geometric.md?raw'
import eventsAlgebraMd from './md/apt-events-algebra.md?raw'
import additionMultiplicationMd from './md/apt-addition-multiplication.md?raw'
import repeatedTrialsMd from './md/apt-repeated-trials.md?raw'
import compoundScenariosMd from './md/apt-compound-scenarios.md?raw'
import weightedBranchesMd from './md/apt-weighted-branches.md?raw'
import reliabilitySystemsMd from './md/apt-reliability-systems.md?raw'
import binomialApplicationsMd from './md/apt-binomial-applications.md?raw'

export const appliedProbability: Subject = {
  id: 'applied-probability',
  title: 'Applied Probability Theory',
  tagline: 'Wentzel & Ovcharov’s applied problems — starting from the urn model, one problem at a time.',
  icon: '🎲',
  accent: '#fb923c',
  modules: [
    {
      id: 'apt-m1',
      title: 'Ch.1 — Fundamentals & the Urn Model',
      description:
        'Events, the sample space, the classical formula P = m/n, the combinatorics behind it, and geometric probability — taught through problems 1.1–1.45.',
      lessons: [
        {
          id: 'apt-foundations',
          title: 'Events, sample space & the axioms',
          minutes: 12,
          xp: 60,
          steps: [
            { kind: 'read', title: 'The language of sets', markdown: foundationsMd },
            {
              kind: 'quiz',
              title: 'Classifying events (problems 1.1–1.4)',
              questions: [
                {
                  prompt:
                    'Two coins are tossed. B₁ = {two heads}, B₂ = {two tails}. Do B₁ and B₂ form a COMPLETE GROUP for this experiment?',
                  options: ['Yes', 'No'],
                  answer: 1,
                  explanation:
                    'No. A complete group must cover the whole sample space (its union = Ω). The outcome "one head and one tail" belongs to neither B₁ nor B₂, so their union is not certain — something outside both can happen. (Problem 1.1, part 2.)',
                },
                {
                  prompt:
                    'Throwing two dice: C₁ = {each die comes up 6}, C₂ = {none of the dice comes up 6}, C₃ = {one die is 6 and the other is not}. Do these form a complete group?',
                  options: ['Yes', 'No'],
                  answer: 0,
                  explanation:
                    'Yes. Every outcome of two dice falls into exactly one of the three buckets — both sixes, no sixes, or exactly one six — so their union is the whole sample space Ω. (Problem 1.1, part 3.)',
                },
                {
                  prompt:
                    'Two coins are tossed. B₁ = {the first coin comes up heads}, B₂ = {the second coin comes up heads}. Are B₁ and B₂ INCOMPATIBLE (mutually exclusive)?',
                  options: ['Yes', 'No'],
                  answer: 1,
                  explanation:
                    'No. Incompatible means they cannot occur together (A ∩ B = ∅). But both coins can land heads, so B₁ and B₂ can happen simultaneously — they are compatible. (Problem 1.2, part 2.)',
                },
                {
                  prompt:
                    'An UNFAIR (concave) coin is tossed; A₁ = {heads}, A₂ = {tails}. Are A₁ and A₂ EQUIPOSSIBLE?',
                  options: [
                    'Yes — there are only two outcomes',
                    'No — equipossibility requires symmetry, which an unfair coin breaks',
                  ],
                  answer: 1,
                  explanation:
                    'Equipossible means equal probability *by symmetry of the experiment*. A biased coin destroys that symmetry, so heads and tails are not equipossible — even though there are only two outcomes. Two outcomes ≠ 50/50. (Problem 1.3, part 2.)',
                },
                {
                  prompt:
                    'A fair coin is tossed: A₁ = {heads}, A₂ = {tails}. Which properties does this pair have?',
                  options: [
                    'Complete group, incompatible, AND equipossible — i.e. a set of "cases"',
                    'Complete group only',
                    'Incompatible only',
                    'None of these',
                  ],
                  answer: 0,
                  explanation:
                    'Heads/tails cover everything (complete), cannot co-occur (incompatible), and are equally likely on a fair coin (equipossible). That triple — incompatible + complete + equipossible — is exactly what the book calls a set of "cases" (chances). (Problem 1.4, part 1.)',
                },
                {
                  prompt:
                    'What is the precise combination of properties that lets you use the classical formula P(A) = m/n?',
                  options: [
                    'The events must be incompatible, form a complete group, AND be equipossible (a set of "cases")',
                    'The events must merely be incompatible',
                    'There must be a finite number of events',
                    'The events must be independent',
                  ],
                  answer: 0,
                  explanation:
                    'm/n only works over a set of "cases": disjoint (incompatible), exhaustive (complete group), and equally likely (equipossible). Drop equipossibility and counting no longer reflects probability — the central caution of Chapter 1.',
                },
                {
                  prompt:
                    'Which axiom does the book state for mutually exclusive events A and B?',
                  options: [
                    'P(A ∪ B) = P(A) + P(B)',
                    'P(A ∪ B) = P(A) · P(B)',
                    'P(A ∩ B) = P(A) + P(B)',
                    'P(A) = 1 − P(B)',
                  ],
                  answer: 0,
                  explanation:
                    'The addition rule: if A ∩ B = ∅ then P(A ∪ B) = P(A) + P(B). It generalises to any finite or countable family of pairwise-incompatible events. (Together with 0 ≤ P(A) ≤ 1, this is the axiomatic core.)',
                },
              ],
            },
          ],
        },
        {
          id: 'apt-classical-formula',
          title: 'The classical formula & urn draws',
          minutes: 14,
          xp: 70,
          steps: [
            { kind: 'read', title: 'The urn model and P = m/n', markdown: classicalMd },
            {
              kind: 'quiz',
              title: 'Urn draws & direct counting (problems 1.5–1.16)',
              questions: [
                {
                  prompt:
                    'Three white and four black balls are stirred in an urn; one ball is drawn at random. P(white)?',
                  options: ['3/7', '3/4', '4/7', '1/2'],
                  answer: 0,
                  explanation:
                    'Seven equipossible balls, three favourable (white): P = m/n = 3/7. The book’s anchor example for the classical formula.',
                },
                {
                  prompt:
                    'An urn has a white and b black balls. One ball is drawn at random. P(white)?',
                  options: ['a/(a+b)', 'b/(a+b)', 'a/b', '(a−1)/(a+b−1)'],
                  answer: 0,
                  explanation:
                    'a favourable cases out of a+b equally likely balls: a/(a+b). (Problem 1.8.)',
                },
                {
                  prompt:
                    'An urn has a white and b black balls; all are drawn one by one. P(the SECOND drawn ball is white)?',
                  options: [
                    'a/(a+b) — same as the first ball, by symmetry',
                    '(a−1)/(a+b−1)',
                    'a/(a+b−1)',
                    'It depends on the first ball’s colour',
                  ],
                  answer: 0,
                  explanation:
                    'With no information about the first draw, every ball is equally likely to land in any position. So the second ball is white with the same probability as the first: a/(a+b). (Problem 1.12 — a classic symmetry surprise.)',
                },
                {
                  prompt:
                    'An urn has a white and b black balls. A ball is drawn and set aside; it is WHITE. Now another ball is drawn. P(this one is also white)?',
                  options: ['(a−1)/(a+b−1)', 'a/(a+b)', 'a/(a+b−1)', '(a−1)/(a+b)'],
                  answer: 0,
                  explanation:
                    'Conditioning on the removed white ball updates the counts: a−1 whites remain out of a+b−1 balls, so P = (a−1)/(a+b−1). Contrast with problem 1.12, where you had NO information. (Problem 1.9.)',
                },
                {
                  prompt:
                    'An urn has a white and b black balls. Every ball except one is drawn out. P(the last ball remaining is white)?',
                  options: ['a/(a+b)', '1/(a+b)', '(a−1)/(a+b−1)', 'a/b'],
                  answer: 0,
                  explanation:
                    'The "last remaining" ball is just as likely to be any specific ball as the first drawn — symmetry again gives a/(a+b). (Problem 1.11.)',
                },
                {
                  prompt: 'A fair die is thrown once. Which set of probabilities is correct?',
                  options: [
                    'P(even) = 1/2, P(score ≥ 5) = 1/3, P(score ≤ 5) = 5/6',
                    'P(even) = 1/2, P(score ≥ 5) = 1/6, P(score ≤ 5) = 1/2',
                    'P(even) = 1/3, P(score ≥ 5) = 1/3, P(score ≤ 5) = 2/3',
                    'P(even) = 1/2, P(score ≥ 5) = 1/2, P(score ≤ 5) = 5/6',
                  ],
                  answer: 0,
                  explanation:
                    'Even = {2,4,6} = 3/6 = 1/2. Score ≥ 5 = {5,6} = 2/6 = 1/3. Score ≤ 5 = {1,2,3,4,5} = 5/6. Just count faces. (Problem 1.16.)',
                },
                {
                  prompt:
                    'A coin is tossed until two heads OR two tails appear in succession. The outcomes are {h,h}, {t,h,h}, {h,t,t}, … Can P(A) be found as (favourable outcomes)/(total outcomes)?',
                  options: [
                    'No — the elementary outcomes are not equipossible (each is less probable than the previous)',
                    'Yes — just divide favourable by total',
                    'No — the sample space is uncountable',
                    'Yes, but only after listing all outcomes',
                  ],
                  answer: 0,
                  explanation:
                    'The sample space is infinite but countable; the issue is that each successive outcome requires more tosses and is strictly less probable. Without equipossibility, m/n is invalid. (Problem 1.5 — the chapter’s key cautionary tale.)',
                },
                {
                  prompt:
                    'A REGULAR polyhedron with k faces (labelled 1…k) is thrown; A = {the face shown does not exceed k/2}. P(A)?',
                  options: [
                    '1/2 for every regular polyhedron',
                    'k/2',
                    '1/k',
                    'It depends on k',
                  ],
                  answer: 0,
                  explanation:
                    'A regular polyhedron is symmetric, so each face is equipossible. Since k is even for every regular solid (4, 6, 8, 12, 20), exactly half the faces satisfy "≤ k/2": P(A) = 1/2. (Problem 1.7.)',
                },
              ],
            },
          ],
        },
        {
          id: 'apt-combinatorics',
          title: 'Counting: combinations, arrangements & symmetry',
          minutes: 18,
          xp: 90,
          steps: [
            { kind: 'read', title: 'The combinatorics toolkit', markdown: combinatoricsMd },
            {
              kind: 'quiz',
              title: 'Counting problems (1.13–1.39)',
              questions: [
                {
                  prompt:
                    'An urn has a white and b black balls; two are drawn together. P(both white)?',
                  options: [
                    'a(a−1) / [(a+b)(a+b−1)]',
                    'a² / (a+b)²',
                    '2a / (a+b)',
                    'a(a−1) / (a+b)²',
                  ],
                  answer: 0,
                  explanation:
                    'P = C(a,2)/C(a+b,2) = [a(a−1)/2] / [(a+b)(a+b−1)/2] = a(a−1)/[(a+b)(a+b−1)]. (Problem 1.13.)',
                },
                {
                  prompt:
                    'A batch has k articles, of which l are faulty. Draw r articles. P(exactly s are faulty)?',
                  options: [
                    'C(l,s)·C(k−l, r−s) / C(k,r)',
                    'C(l,s) / C(k,r)',
                    'C(k,r) / [C(l,s)·C(k−l,r−s)]',
                    's·l / (k·r)',
                  ],
                  answer: 0,
                  explanation:
                    'The hypergeometric formula: (ways to choose s faulty) × (ways to choose r−s good) ÷ (ways to choose any r). This single pattern powers most "drawing without replacement" problems. (Problem 1.15.)',
                },
                {
                  prompt:
                    'A child forms the word "table" (5 distinct blocks), scatters them, and lays them in a random order. P(the word "table" appears again)?',
                  options: ['1/120', '1/24', '1/60', '5/120'],
                  answer: 0,
                  explanation:
                    'Five distinct letters → 5! = 120 equally likely orderings, exactly one of which spells "table": P = 1/5! = 1/120. (Problem 1.29.)',
                },
                {
                  prompt:
                    'Same game with "papaya" (6 letters: three "a", two "p", one "y"). P(the word "papaya" appears)?',
                  options: ['1/60', '1/120', '1/720', '12/60'],
                  answer: 0,
                  explanation:
                    'Total orderings = 6! = 720. Because the three a’s and two p’s are interchangeable, favourable orderings = 3!·2! = 12, so P = 12/720 = 1/60. Repeated letters RAISE the probability versus all-distinct. (Problem 1.30.)',
                },
                {
                  prompt:
                    'A box has n enumerated articles, taken out one by one. P(they come out in the natural order 1, 2, …, n)?',
                  options: ['1/n!', '1/nⁿ', '1/n', 'n/n!'],
                  answer: 0,
                  explanation:
                    'There are n! equally likely orderings, exactly one of which is increasing: P = 1/n!. (Problem 1.18.)',
                },
                {
                  prompt:
                    'Same box, but each article is drawn, its number recorded, then REPLACED and re-stirred (n draws). P(the recorded sequence is exactly 1, 2, …, n)?',
                  options: ['1/nⁿ', '1/n!', '1/n', 'n!/nⁿ'],
                  answer: 0,
                  explanation:
                    'With replacement each of the n draws independently has n choices → nⁿ equally likely sequences, one favourable: 1/nⁿ. Compare problem 1.18 (without replacement, 1/n!). (Problem 1.19.)',
                },
                {
                  prompt:
                    'Five cards labelled 1–5; two are drawn one after another. P(the second number is larger than the first)?',
                  options: [
                    '1/2 — by symmetry between "larger" and "smaller"',
                    '2/5',
                    '3/5',
                    'It cannot be found without counting all pairs',
                  ],
                  answer: 0,
                  explanation:
                    'Ties are impossible (distinct cards), and by symmetry P(second > first) = P(second < first). They sum to 1, so each is 1/2 — no counting needed. (Problem 1.23.)',
                },
                {
                  prompt:
                    'N people sit at random around a ROUND table (N > 2). P(two fixed people A and B sit side-by-side)?',
                  options: ['2/(N−1)', '1/N', '2/N', '1/(N−1)'],
                  answer: 0,
                  explanation:
                    'Seat A anywhere; B then has N−1 remaining seats, exactly 2 of which are adjacent to A. P = 2/(N−1). (Problem 1.32.)',
                },
                {
                  prompt:
                    'Same people seated along ONE SIDE of a rectangular table. P(A and B are side-by-side)?',
                  options: ['2/N', '2/(N−1)', '1/N', '1/(N−1)'],
                  answer: 0,
                  explanation:
                    'In a line the end seats have only one neighbour, which changes the count to 2/N (slightly less than the round-table 2/(N−1)). (Problem 1.33.)',
                },
                {
                  prompt:
                    'Articles from factories I, II, III are drawn one after another (a from I, b from II). P(an item from factory I appears before any item from factory II)?',
                  options: [
                    'a/(a+b) — only the relative order of the I and II groups matters',
                    'a/(a+b+c)',
                    '1/2',
                    'a/b',
                  ],
                  answer: 0,
                  explanation:
                    'Factory III items are irrelevant. Among the a+b relevant items, the first one is from factory I with probability a/(a+b). (Problem 1.24.)',
                },
                {
                  prompt:
                    'Box 1 has a sound + b faulty elements; box 2 has c sound + d faulty. One element is drawn from each. P(both sound)?',
                  options: [
                    'ac / [(a+b)(c+d)]',
                    '(a+c) / [(a+b)+(c+d)]',
                    'ac / [(a+b)+(c+d)]',
                    '(ad+bc) / [(a+b)(c+d)]',
                  ],
                  answer: 0,
                  explanation:
                    'Independent draws: multiply the two probabilities, a/(a+b) × c/(c+d) = ac/[(a+b)(c+d)]. Total cases = (a+b)(c+d), favourable = ac. (Problem 1.25.)',
                },
                {
                  prompt:
                    'Same two boxes, one element drawn from each. P(both are faulty)?',
                  options: [
                    'bd / [(a+b)(c+d)]',
                    'ac / [(a+b)(c+d)]',
                    '(ad+bc) / [(a+b)(c+d)]',
                    'bd / [(a+b)+(c+d)]',
                  ],
                  answer: 0,
                  explanation:
                    'Faulty × faulty: b/(a+b) × d/(c+d) = bd/[(a+b)(c+d)]. (The "different in quality" version, problem 1.26, is (ad+bc)/[(a+b)(c+d)].) (Problem 1.27.)',
                },
                {
                  prompt:
                    'Cards are selected one at a time from a 52-card pack. How many must you select to be MORE likely than not (P > 0.50) to hold two cards of the same suit?',
                  options: ['3', '2', '5', '13'],
                  answer: 0,
                  explanation:
                    'For k = 2 the probability of a repeated suit is 0.235 (< 0.50); for k = 3 it jumps to 0.602 (> 0.50). So 3 cards suffice. (With 5 cards a repeat is guaranteed by the pigeonhole principle — 4 suits.) (Problem 1.31.)',
                },
                {
                  prompt:
                    'A box has k labelled articles. l articles are drawn one at a time WITH replacement (number recorded each time). P(all l recorded numbers are different)?',
                  options: [
                    'k(k−1)…(k−l+1) / kˡ',
                    'l! / kˡ',
                    'C(k,l) / kˡ',
                    '1 / kˡ',
                  ],
                  answer: 0,
                  explanation:
                    'Total sequences = kˡ. Favourable = arrangements of k taken l at a time = k(k−1)…(k−l+1). Ratio gives the probability all are distinct. (Problem 1.28 — the "birthday-problem" shape.)',
                },
              ],
            },
          ],
        },
        {
          id: 'apt-geometric',
          title: 'Geometric probability',
          minutes: 12,
          xp: 60,
          steps: [
            { kind: 'read', title: 'Probability as a ratio of measures', markdown: geometricMd },
            {
              kind: 'quiz',
              title: 'Points in regions (problems 1.40–1.45)',
              questions: [
                {
                  prompt:
                    'In geometric probability, when a point is thrown "at random" into a 2-D region Ω, the probability of landing in sub-region A is:',
                  options: [
                    'S_A / S_Ω — the ratio of areas',
                    'S_Ω / S_A',
                    '1 / S_A',
                    'S_A × S_Ω',
                  ],
                  answer: 0,
                  explanation:
                    'Uniform position over the region means probability is proportional to measure: P(A) = S_A/S_Ω (areas in 2-D, lengths in 1-D, volumes in 3-D).',
                },
                {
                  prompt:
                    'Two points are placed at random on the segment [0, 2]. P(the distance between them is less than 1)?',
                  options: ['3/4', '1/2', '1/4', '2/3'],
                  answer: 0,
                  explanation:
                    'The pair (x,y) fills a 2×2 square (area 4). The event |x−y| < 1 excludes two corner triangles of area 1/2 each, leaving area 3. P = 3/4. (Book worked example.)',
                },
                {
                  prompt:
                    'A blip lands at a uniformly random point inside a radar disc of radius r. P(it lies within distance r/2 of the centre)?',
                  options: ['1/4', '1/2', '1/8', '3/4'],
                  answer: 0,
                  explanation:
                    'Ratio of areas: (π(r/2)²)/(πr²) = (r²/4)/r² = 1/4. (Problem 1.40.)',
                },
                {
                  prompt:
                    'A unit stick is broken at two random points into three pieces. P(the three pieces can form a triangle)?',
                  options: ['1/4', '1/2', '1/3', '1/8'],
                  answer: 0,
                  explanation:
                    'A triangle forms only if no piece exceeds 1/2. That condition is a region of area 1/8 inside the sample triangle of area 1/2, so P = (1/8)/(1/2) = 1/4. (Problem 1.44.)',
                },
                {
                  prompt:
                    'Buffon’s needle: a needle of length ℓ ≤ L is dropped on a plane ruled with parallel lines L apart. P(the needle crosses a line)?',
                  options: ['2ℓ / (πL)', 'ℓ / (πL)', 'ℓ / L', 'πℓ / (2L)'],
                  answer: 0,
                  explanation:
                    'Parametrise by the centre’s distance x and angle φ: the sample rectangle has area Lπ/4 and the crossing region has area ℓ/2, giving P = (ℓ/2)/(Lπ/4) = 2ℓ/(πL). Buffon used this to estimate π experimentally. (Problem 1.45.)',
                },
                {
                  prompt:
                    'In Buffon’s needle, why does the experiment let you estimate π?',
                  options: [
                    'Because P(hit) = 2ℓ/(πL) contains π, so measuring the hit frequency over many throws lets you solve for π',
                    'Because the needle traces a circle',
                    'Because π is the needle’s length',
                    'It cannot estimate π',
                  ],
                  answer: 0,
                  explanation:
                    'Rearranging P ≈ hits/N = 2ℓ/(πL) gives π ≈ 2ℓN/(L·hits). Throw the needle many times, count crossings, and π falls out — a famous Monte-Carlo idea two centuries early.',
                },
                {
                  prompt:
                    'What does the phrase "at random" guarantee in these geometric-probability problems?',
                  options: [
                    'A uniform distribution over the region — every position of equal measure is equally likely',
                    'That the answer is always 1/2',
                    'That outcomes are discrete and countable',
                    'That the region must be a circle',
                  ],
                  answer: 0,
                  explanation:
                    '"At random" is shorthand for a uniform distribution over the sample region — the continuous analogue of equipossible cases in the urn model. That is exactly what makes P(A) = S_A/S_Ω valid.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'apt-m2',
      title: 'Ch.2 — Algebra of Events & the Rules of Probability',
      description:
        'Rewriting compound events as sums and products of simple ones, then the addition and multiplication rules, conditional probability, repeated trials, compound scenarios, system reliability, and the binomial distribution — problems 2.1–2.94.',
      lessons: [
        {
          id: 'apt-events-algebra',
          title: 'The algebra of events',
          minutes: 14,
          xp: 70,
          steps: [
            { kind: 'read', title: 'Sums, products & complements', markdown: eventsAlgebraMd },
            {
              kind: 'quiz',
              title: 'Rewriting events (problems 2.1, 2.4–2.8)',
              questions: [
                {
                  prompt: 'Can the sum A + B of two events ever coincide with their product AB?',
                  options: [
                    'Yes — but only if A and B are equivalent (A ⊆ B and B ⊆ A)',
                    'Yes — for any two compatible events',
                    'No, never',
                    'Yes — but only if A and B are mutually exclusive',
                  ],
                  answer: 0,
                  explanation:
                    'A + B = AB exactly when A = B. The book\'s example: A = {a message is distorted}, B = {there is noise on the channel during the message} — if noise always and only distorts the message, A and B describe the same outcomes, so A + B = A = B = AB. (Problem 2.1.)',
                },
                {
                  prompt:
                    'Two coins are tossed. E = {at least one head}, K = {two heads}. Since K is a special case of E (K ⊆ E), what is E + K?',
                  options: ['E', 'K', 'Ω (the certain event)', '∅ (impossible)'],
                  answer: 0,
                  explanation:
                    'K ⊆ E (two heads is a special case of "at least one head"), so the absorption rule gives E + K = E — the bigger event swallows the sum. (Problem 2.4.)',
                },
                {
                  prompt:
                    'Same experiment: B = {first coin tails}, D = {second coin tails}, H = {no heads}. What is B·D?',
                  options: [
                    'B·D = H — "first tails AND second tails" is exactly "no heads occurred"',
                    'B·D = ∅ — the events are incompatible',
                    'B·D = Ω',
                    'B·D has no relation to H',
                  ],
                  answer: 0,
                  explanation:
                    'Both coins landing tails describes precisely the same outcomes as "no heads at all" — B·D and H are equivalent events, even though they\'re phrased differently. (Problem 2.4.)',
                },
                {
                  prompt:
                    'G = {exactly one head and one tail}, E = {at least one head}. Since G ⊆ E, what is G·E?',
                  options: ['G', 'E', '∅', 'Ω'],
                  answer: 0,
                  explanation:
                    'G is a special case of E (one head and one tail certainly includes "at least one head"). By the absorption rule, G·E = G. (Problem 2.4.)',
                },
                {
                  prompt:
                    'Three messages are sent; Aᵢ = {ith message sent correctly}, Āᵢ = {ith message distorted}. Which expression is B = {all three messages were distorted}?',
                  options: ['Ā₁Ā₂Ā₃', 'A₁ + A₂ + A₃', 'Ā₁ + Ā₂ + Ā₃', 'A₁A₂A₃'],
                  answer: 0,
                  explanation:
                    '"All three distorted" means message 1 is distorted AND message 2 is distorted AND message 3 is distorted — a product of the three complementary events. (Problem 2.5.)',
                },
                {
                  prompt:
                    'G = {the first message sent correctly was the third one in the sequence}. Which expression captures G?',
                  options: ['Ā₁Ā₂A₃', 'A₁A₂A₃', 'A₃', 'A₁Ā₂A₃'],
                  answer: 0,
                  explanation:
                    'For message 3 to be the FIRST one sent correctly, messages 1 and 2 must both have been distorted, and message 3 correct: Ā₁Ā₂A₃. (Problem 2.5.)',
                },
                {
                  prompt:
                    'E = {not less than two of the three messages were sent correctly}. As a sum of mutually exclusive products, how many terms does E expand into?',
                  options: [
                    '4 — three ways to get exactly 2 correct, plus one way to get all 3 correct',
                    '3 — the three ways to pick which message is correct',
                    '8 — every possible outcome of three messages',
                    '2 — "exactly two" or "exactly three"',
                  ],
                  answer: 0,
                  explanation:
                    '"≥2 correct" splits into "exactly 2 correct" (C(3,2) = 3 ways to choose which message is the odd one out) plus "exactly 3 correct" (1 way): 3 + 1 = 4 incompatible terms summed together. (Problem 2.5.)',
                },
                {
                  prompt:
                    'A group of four tracked objects: B = {at least one detected}, A = {exactly one detected}. Since A ⊆ B, what is A + B?',
                  options: ['B', 'A', 'Ω', '∅'],
                  answer: 0,
                  explanation:
                    '"Exactly one" is a special case of "at least one" (A ⊆ B), so A + B = B — the larger event absorbs the sum. (Problem 2.6.)',
                },
                {
                  prompt: 'Same setup. What is A·B?',
                  options: ['A', 'B', '∅', 'Ω'],
                  answer: 0,
                  explanation: 'A ⊆ B means the product keeps the smaller event: A·B = A. (Problem 2.6.)',
                },
                {
                  prompt:
                    'C = {not less than two objects detected}, D = {exactly two}, E = {exactly three}, F = {all four}. What is D + E + F?',
                  options: ['C', 'B (at least one detected)', 'A (exactly one)', '∅'],
                  answer: 0,
                  explanation:
                    'D, E and F are precisely the special cases that together make up "not less than two" — their sum recovers C exactly. (Problem 2.6.)',
                },
                {
                  prompt:
                    'Still the same setup: are BF and CF the same event? Are BC and D the same event?',
                  options: [
                    'BF = CF = F (both true); but BC = C, which is broader than D — not the same',
                    'Neither pair is the same event',
                    'BF = CF, but BC = D as well',
                    'BC = D, but BF ≠ CF',
                  ],
                  answer: 0,
                  explanation:
                    'F ⊆ C ⊆ B, so BF = F and CF = F — equal. But BC = C (since C ⊆ B), and C = "≥2 detected" is strictly broader than D = "exactly 2 detected", so BC ≠ D. (Problem 2.6 — a direct test of the containment rules above.)',
                },
                {
                  prompt:
                    'D = {at least one hit is registered among m shots at a target}. What is D̄ (the complement)?',
                  options: [
                    'No hits are registered — all m shots miss',
                    'Exactly one hit is registered',
                    'All m shots hit',
                    'At least one shot misses',
                  ],
                  answer: 0,
                  explanation:
                    'The complement of "at least one" is simply "none". D̄ = {no hits registered}. (Problem 2.7, part 4.)',
                },
                {
                  prompt:
                    'F = {the whites win at chess}. What is F̄ — and why is this a classic trap?',
                  options: [
                    'F̄ = {blacks win OR the game is drawn} — "not winning" has two distinct sub-cases, not one',
                    'F̄ = {blacks win}',
                    'F̄ = {the game is drawn}',
                    'F̄ = {nobody wins}',
                  ],
                  answer: 0,
                  explanation:
                    'The naive complement of "win" is "lose" — but chess has a third outcome, a draw. The complement of any event A is everything in Ω outside A, however many distinct sub-cases that covers. (Problem 2.7, part 6.)',
                },
                {
                  prompt:
                    'B is a special case of A (B ⊆ A). If you observe B̄ (B did not occur), can you conclude Ā (A did not occur)?',
                  options: [
                    'No — B̄ does not imply Ā; only the reverse direction (Ā ⟹ B̄) is valid',
                    'Yes, always — B̄ and Ā are equivalent statements',
                    'Yes, but only when A and B are incompatible',
                    'No — neither implication direction ever holds when B ⊆ A',
                  ],
                  answer: 0,
                  explanation:
                    'B ⊆ A means Ā ⊆ B̄ (if A is impossible, the special case B is too) — that\'s the valid direction. But B̄ is a larger event than Ā: it includes "B didn\'t happen, but A still did". Example: A = {≥1 of two messages distorted}, B = {both distorted}. B̄ (not both distorted) doesn\'t rule out exactly one being distorted, which still makes A true. (Problem 2.8.)',
                },
              ],
            },
          ],
        },
        {
          id: 'apt-addition-multiplication',
          title: 'Addition, multiplication & conditional probability',
          minutes: 18,
          xp: 90,
          steps: [
            { kind: 'read', title: 'Two rules for compound events', markdown: additionMultiplicationMd },
            {
              kind: 'quiz',
              title: 'Applying the rules (problems 2.2, 2.3, 2.9–2.18, 2.55)',
              questions: [
                {
                  prompt: 'If A and B are COMPATIBLE (can occur together), which addition rule is correct?',
                  options: [
                    'P(A + B) = P(A) + P(B) − P(AB)',
                    'P(A + B) = P(A) + P(B)',
                    'P(A + B) = P(A) + P(B) + P(AB)',
                    'P(A + B) = P(AB)',
                  ],
                  answer: 0,
                  explanation:
                    'Split A+B into the three mutually-exclusive pieces AB̄, ĀB, AB. Then P(A)=P(AB̄)+P(AB) and P(B)=P(ĀB)+P(AB), so P(A)+P(B) counts AB twice — subtract it once. (Problem 2.2.)',
                },
                {
                  prompt: 'What is the inclusion–exclusion formula for P(A+B+C), three possibly-overlapping events?',
                  options: [
                    'P(A)+P(B)+P(C) − P(AB) − P(AC) − P(BC) + P(ABC)',
                    'P(A)+P(B)+P(C) − P(AB)·P(AC)·P(BC)',
                    'P(A)+P(B)+P(C) + P(AB)+P(AC)+P(BC) − P(ABC)',
                    'P(A)·P(B)·P(C)',
                  ],
                  answer: 0,
                  explanation:
                    'Add the three singles, subtract every pairwise overlap (each double-counted), then add back the triple overlap (which got subtracted three times by the pairs but should be counted once). (Problem 2.3.)',
                },
                {
                  prompt:
                    'B is a special case of A (B ⊆ A). What is P(A | B), and when are A and B independent?',
                  options: [
                    'P(A | B) = 1 always; independence requires P(A) = 1',
                    'P(A | B) = P(A) always — B ⊆ A events are always independent',
                    'P(A | B) = 0',
                    'P(A | B) cannot be determined from B ⊆ A alone',
                  ],
                  answer: 0,
                  explanation:
                    'If B occurs, the larger event A certainly occurred too — so P(A|B)=1. Independence needs P(A|B)=P(A), which forces P(A)=1. So a "special case" relationship is dependent unless the bigger event is already certain. (Problem 2.9.)',
                },
                {
                  prompt:
                    'Which of these are necessarily DEPENDENT: (1) mutually exclusive events, (2) events forming a complete group, (3) equipossible events?',
                  options: [
                    '(1) and (2) are dependent; (3) may be either dependent or independent',
                    'All three are always independent',
                    'Only (3) is dependent',
                    '(1) is independent, but (2) and (3) are dependent',
                  ],
                  answer: 0,
                  explanation:
                    'Mutually exclusive: if A occurs, P(B|A)=0, generally ≠ P(B) — dependent. Complete group: if all but one fail, the remaining event\'s conditional probability jumps to 1 — dependent. "Equipossible" only says probabilities are equal by symmetry; it says nothing about whether one event\'s occurrence affects another\'s probability. (Problem 2.10.)',
                },
                {
                  prompt:
                    'Two coins tossed: A = {first coin heads}, E = {at least one tail}. Unconditionally P(E) = 3/4. Given A has occurred (outcomes restricted to HH, HT), P(E | A) = 1/2 (only HT has a tail). What does this tell us about A and E?',
                  options: [
                    'Dependent — P(E|A) ≠ P(E)',
                    'Independent — both probabilities are "reasonable"',
                    'Mutually exclusive',
                    'A complete group',
                  ],
                  answer: 0,
                  explanation:
                    '1/2 ≠ 3/4, so knowing the first coin landed heads changes the probability of "at least one tail" — by definition, A and E are dependent. (Problem 2.11, part 1.)',
                },
                {
                  prompt:
                    'Same experiment: A = {first coin heads}, F = {second coin heads}. P(A) = 1/2, and given F has occurred, P(A | F) = 1/2 too. What does this tell us?',
                  options: [
                    'A and F are independent — the second coin\'s outcome doesn\'t change P(first = heads)',
                    'A and F are dependent',
                    'A and F are mutually exclusive',
                    'A and F form a complete group',
                  ],
                  answer: 0,
                  explanation:
                    'P(A|F) = P(A) = 1/2 — knowing the second coin landed heads tells you nothing new about the first coin. Two separate coin tosses are independent, exactly as you\'d expect. (Problem 2.11, part 2 — contrast with part 1, where E mixes information from both coins.)',
                },
                {
                  prompt:
                    'D = {at least one head}, F = {second coin heads}. P(D) = 3/4, but given F has occurred (outcomes HH, TH — both have a head), P(D | F) = 1. What does this show?',
                  options: [
                    'Dependent — knowing F occurred makes D certain, while unconditionally D was only 3/4 likely',
                    'Independent, since both values are probabilities between 0 and 1',
                    'D and F are equivalent events',
                    'D and F are incompatible',
                  ],
                  answer: 0,
                  explanation:
                    '1 ≠ 3/4: conditioning on F collapses D from "likely" to "certain", so the two events are dependent. (Problem 2.11, part 4 — together with parts 1–2, this problem trains you to actually compute P(·|·) rather than guess.)',
                },
                {
                  prompt:
                    'An urn has a white and b black balls. Two balls are drawn one after another WITHOUT replacement. By the multiplication rule, P(both white) = ?',
                  options: [
                    '[a/(a+b)] · [(a−1)/(a+b−1)]',
                    '[a/(a+b)]²',
                    'a(a−1)/(a+b)²',
                    '2a/(a+b)',
                  ],
                  answer: 0,
                  explanation:
                    'P(1st white) = a/(a+b). Given the first was white, a−1 whites remain among a+b−1 balls: P(2nd white | 1st white) = (a−1)/(a+b−1). Chain them with the multiplication rule — same numeric answer as the direct-counting problem 1.13, reached a different way. (Problem 2.12.)',
                },
                {
                  prompt:
                    'Same urn, but the first ball is REPLACED before the second draw. P(both white) = ?',
                  options: [
                    '[a/(a+b)]²',
                    '[a/(a+b)] · [(a−1)/(a+b−1)]',
                    'a² / (a+b−1)²',
                    '2a/(a+b)',
                  ],
                  answer: 0,
                  explanation:
                    'Replacement restores the urn to its original composition, so the two draws are independent — multiply the SAME probability twice: [a/(a+b)]². Compare to 2.12, where the second factor\'s denominator shrinks because nothing was replaced. (Problem 2.13.)',
                },
                {
                  prompt:
                    'Two balls drawn AT ONCE from a + b balls (a white, b black). Using the addition rule for the two orderings {wb}+{bw} and the multiplication rule within each, P(different colours) = ?',
                  options: [
                    '2ab / [(a+b)(a+b−1)]',
                    'ab / (a+b)²',
                    'a/(a+b) + b/(a+b)',
                    'ab / (a+b−1)',
                  ],
                  answer: 0,
                  explanation:
                    '"Different colours" splits into two incompatible variants, {white-then-black} and {black-then-white}, each with probability [a/(a+b)]·[b/(a+b−1)] (or the mirror). Add the two equal terms: 2ab/[(a+b)(a+b−1)]. (Problem 2.14.)',
                },
                {
                  prompt:
                    'Same question, but the balls are drawn one after another and the first is REPLACED. P(different colours) = ?',
                  options: [
                    '2ab / (a+b)²',
                    '2ab / [(a+b)(a+b−1)]',
                    'ab / (a+b)²',
                    'a/(a+b) + b/(a+b)',
                  ],
                  answer: 0,
                  explanation:
                    'With replacement, P(wb) = P(bw) = [a/(a+b)]·[b/(a+b)]; their sum is 2ab/(a+b)². The denominator no longer shrinks on the second factor, unlike problem 2.14. (Problem 2.15.)',
                },
                {
                  prompt:
                    'All a+b balls are drawn one by one. Using the addition AND multiplication rules (instead of the symmetry argument from problem 1.12), P(the SECOND ball drawn is white) works out to...',
                  options: [
                    'a/(a+b) — the same as the first draw',
                    '(a−1)/(a+b−1)',
                    'a/(a+b−1)',
                    'It depends on the colour of the first ball',
                  ],
                  answer: 0,
                  explanation:
                    'P(2nd white) = P(1st white)·P(2nd white|1st white) + P(1st black)·P(2nd white|1st black) = [a/(a+b)]·[(a−1)/(a+b−1)] + [b/(a+b)]·[a/(a+b−1)] = a/(a+b). The two rules confirm the symmetry shortcut from Chapter 1. (Problem 2.16.)',
                },
                {
                  prompt:
                    'An urn has a white, b black, c red balls; three are drawn at random. To find P(at least two share a colour), the book passes to the complementary event Ā = {all three different colours}. P(Ā) is a sum of how many equal terms, and why?',
                  options: [
                    '6 — the 3! orderings (wbr, wrb, bwr, brw, rwb, rbw) in which the draw could produce one of each colour',
                    '3 — one term per colour',
                    '1 — order doesn\'t matter for "all different"',
                    'C(3,3) = 1 term',
                  ],
                  answer: 0,
                  explanation:
                    '"All three different colours" can occur in any of the 3! = 6 orders the colours are drawn in, each with the same probability abc/[(a+b+c)(a+b+c−1)(a+b+c−2)]. Sum the six equal terms, then P(at least two share a colour) = 1 − that sum. (Problem 2.17.)',
                },
                {
                  prompt:
                    'A coin is tossed until two heads OR two tails appear in a row (the setup from problem 1.5). For each length n ≥ 2 there are exactly 2 equally-likely stopping sequences, each with probability (1/2)ⁿ. What is P(no more than 3 tosses are needed)?',
                  options: ['3/4', '1/2', '1/4', '7/8'],
                  answer: 0,
                  explanation:
                    'Length-2 stops (HH, TT): probability 1/4 each, total 1/2. Length-3 stops (HTT, THH): probability 1/8 each, total 1/4. Adding (the events are mutually exclusive): 1/2 + 1/4 = 3/4. (Problem 2.18 — the addition rule applied to the infinite sample space from problem 1.5.)',
                },
                {
                  prompt:
                    'A group of m people each speak some subset of three languages: group I speaks only G (m₁ people), II only A (m₂), III only R (m₃), IV speaks G&A (m₄), V speaks G&R (m₅), VI speaks A&R (m₆), VII speaks all three (m₇). Two people are picked at random. The book finds P(they share a language) via the complement — P(no shared language). Which pairs of groups share NO language?',
                  options: [
                    '(I,II), (I,III), (I,VI), (II,III), (II,V), (III,IV) — six pairs',
                    'Every pair of groups shares at least one language',
                    'Only the three single-language pairs (I,II), (I,III), (II,III)',
                    'The three bilingual pairs (IV,V), (IV,VI), (V,VI)',
                  ],
                  answer: 0,
                  explanation:
                    'Group I (G only) shares nothing with II (A only), III (R only), or VI (A,R — no G). By the same logic, II clashes with III and V, and III clashes with IV. Every other pair shares at least one language (e.g. I and IV both include G). Six "no overlap" pairs in total. (Problem 2.55.)',
                },
                {
                  prompt:
                    'Given those six "no shared language" pairs (i,j), what is P(the two chosen people CANNOT talk to each other)?',
                  options: [
                    'The sum over the six pairs of 2·mᵢ·mⱼ / [m(m−1)]',
                    'The sum over the six pairs of mᵢ/m',
                    'The sum over the six pairs of mᵢ·mⱼ / m²',
                    'The product over all seven groups of mᵢ/m',
                  ],
                  answer: 0,
                  explanation:
                    'For one no-overlap pair (i,j), P(one person from group i, the other from group j) = 2·mᵢ·mⱼ / [m(m−1)] — the multiplication rule for "one from each group", doubled for the two orderings, over m(m−1) ordered pairs total. The six pairs are mutually exclusive, so the addition rule sums them; P(can talk) = 1 minus that sum. (Problem 2.55.)',
                },
              ],
            },
          ],
        },
        {
          id: 'apt-repeated-trials',
          title: 'Repeated independent trials & the binomial formula',
          minutes: 18,
          xp: 90,
          steps: [
            { kind: 'read', title: 'Run it n times, count the successes', markdown: repeatedTrialsMd },
            {
              kind: 'quiz',
              title: 'Detection, reliability & repetition (problems 2.25–2.36)',
              questions: [
                {
                  prompt:
                    'A batch of N articles contains M faulty ones. You inspect n articles; the whole batch is rejected if MORE THAN m of the inspected articles are faulty. Writing Aₓ = {exactly x faulty among the n inspected} (a hypergeometric probability, as in Ch.1), which rule justifies P(rejected) = Σₓ₌ₘ₊₁ⁿ P(Aₓ)?',
                  options: [
                    'The addition rule — the Aₓ for different x are mutually exclusive and their sum is the rejection event',
                    'The multiplication rule — the Aₓ are independent',
                    'Bayes\' theorem',
                    'The binomial formula directly, since draws are with replacement',
                  ],
                  answer: 0,
                  explanation:
                    '"More than m faulty" is the disjoint union of "exactly m+1 faulty", "exactly m+2", ..., "exactly n faulty". Each P(Aₓ) is a hypergeometric probability (Ch.1, problem 1.15); the addition rule lets you sum them because no two Aₓ can both occur. (Problem 2.25.)',
                },
                {
                  prompt:
                    'A box has a "best", b "first-quality", and c "second-quality" articles (all ≥ 4). Four are drawn at once. A = {≥1 best-quality drawn}, B = {≥1 second-quality drawn}. To find P(A+B), the book computes the complement (A+B)‾. What is (A+B)‾?',
                  options: [
                    '{all 4 drawn articles are first-quality} — the only category left once "best" and "second" are excluded',
                    '{all 4 drawn articles are best-quality}',
                    '{none of the 4 articles is drawn}',
                    '{exactly one article of each quality is drawn}',
                  ],
                  answer: 0,
                  explanation:
                    'By De Morgan (Lesson 1), (A+B)‾ = Ā·B̄ = {no best-quality AND no second-quality} = {everything drawn is first-quality} — the only remaining category. Compute that probability directly (four draws without replacement, all from the b first-quality articles) and subtract from 1. (Problem 2.26.)',
                },
                {
                  prompt:
                    'A radar unit detects a target on each surveillance cycle with probability p, independently of other cycles. P(the target is detected within r cycles) = ?',
                  options: ['1 − (1 − p)ʳ', 'r · p', '1 − pʳ', 'pʳ'],
                  answer: 0,
                  explanation:
                    'The complement is "missed on every one of the r cycles" — independent events, so multiply: (1−p)ʳ. Subtract from 1. This is the "1 − qⁿ" pattern from this lesson\'s theory. (Problem 2.27.)',
                },
                {
                  prompt:
                    'm radar units each independently detect a target with probability p per cycle; each unit runs n cycles (so mn independent detection attempts in total). A = {the target is detected by at least one unit}. P(A) = ?',
                  options: [
                    '1 − (1 − p)^(mn)',
                    '[1 − (1 − p)ⁿ]ᵘ, where u = m',
                    '1 − [1 − (1 − p)ⁿ]ᵘ, where u = m',
                    '(1 − p)^(mn)',
                  ],
                  answer: 0,
                  explanation:
                    'P(Ā) = "every one of the mn independent attempts misses" = (1−p)^(mn). The "1 − qⁿ" pattern again, just with n replaced by the total number of attempts mn. (Problem 2.28, event A.)',
                },
                {
                  prompt:
                    'Same setup. B = {the target is detected by ALL m units} (each unit must detect it at least once during its n cycles). P(B) = ?',
                  options: [
                    '[1 − (1 − p)ⁿ]ᵘ, where u = m',
                    '1 − (1 − p)^(mn)',
                    '1 − [1 − (1 − p)ⁿ]ᵘ, where u = m',
                    '[(1 − p)ⁿ]ᵘ, where u = m',
                  ],
                  answer: 0,
                  explanation:
                    'For ONE unit, P(detects ≥1 time in n cycles) = 1−(1−p)ⁿ (the same "1 − qⁿ" pattern, problem 2.27). For ALL m units to do this, multiply that probability by itself m times (the units act independently): [1−(1−p)ⁿ]ᵘ with u = m. (Problem 2.28, event B.)',
                },
                {
                  prompt:
                    'A group of k targets; each is independently detected by a given radar unit with probability p, and m units track independently. P(NOT all k targets get detected) = ?',
                  options: [
                    '1 − [1 − (1 − p)ᵘ]ᵏ, where u = m',
                    '[1 − (1 − p)ᵘ]ᵏ, where u = m',
                    '1 − (1 − p)^(mk)',
                    '(1 − p)^(mk)',
                  ],
                  answer: 0,
                  explanation:
                    'Per target: P(detected by ≥1 of m units) = 1−(1−p)ᵘ with u = m (the "1 − qⁿ" pattern). For ALL k targets to be detected (independent across targets), raise that to the kth power. Subtract from 1 for "not all detected". (Problem 2.29.)',
                },
                {
                  prompt:
                    'k workers manufacture an article in succession, with no quality check between them; worker i independently spoils the article with probability pᵢ (regardless of what earlier workers did). P(the finished article is faulty) = ?',
                  options: [
                    '1 − ∏(1 − pᵢ)',
                    'Σ pᵢ',
                    '∏ pᵢ',
                    '1 − Σ pᵢ',
                  ],
                  answer: 0,
                  explanation:
                    'The complement — "no worker spoils it" — is the product of each worker NOT spoiling it, ∏(1−pᵢ) (independent events, multiplication rule). Subtract from 1. (Problem 2.30.)',
                },
                {
                  prompt:
                    'A lottery sells n tickets, l of which win. Petrov buys k tickets (k ≤ n−l, no replacement). P(he wins at least one prize) = ?',
                  options: [
                    '1 − C(n−l, k) / C(n, k)',
                    'C(l, k) / C(n, k)',
                    '1 − C(l, k) / C(n, k)',
                    'l·k / n',
                  ],
                  answer: 0,
                  explanation:
                    'The complement — "all k of Petrov\'s tickets are losers" — is the hypergeometric probability of choosing k tickets entirely from the n−l losing ones: C(n−l,k)/C(n,k). Subtract from 1. (Problem 2.31.)',
                },
                {
                  prompt:
                    'Two balls are placed independently and at random into 4 cells arranged in a row (each cell has probability 1/4 for each ball, independently). P(the two balls land in ADJACENT cells)?',
                  options: ['3/8', '1/4', '1/2', '3/16'],
                  answer: 0,
                  explanation:
                    'There are 3 adjacent pairs of cells (1-2, 2-3, 3-4). For one specific pair, P(one ball in each cell of the pair, either order) = 2 · (1/4)(1/4) = 1/8. The 3 pairs are mutually exclusive, so add (addition rule): 3 × 1/8 = 3/8. (Problem 2.32.)',
                },
                {
                  prompt:
                    'k balls (k < n) are placed independently and at random into n cells in a row (each cell has probability 1/n per ball). P(the k balls occupy some block of k ADJACENT cells)?',
                  options: [
                    'k! · (n−k+1) / nᵏ',
                    'k! / nᵏ',
                    '(n−k+1) / nᵏ',
                    '1 / nᵏ',
                  ],
                  answer: 0,
                  explanation:
                    'There are (n−k+1) possible blocks of k adjacent cells (mutually exclusive choices). For a fixed block, the k balls can fill its k cells (one ball per cell) in k! distinct ways, each with probability (1/n)ᵏ. Multiply k! × (1/n)ᵏ for one block, then add over the (n−k+1) blocks. (Problem 2.33.)',
                },
                {
                  prompt:
                    '20 telegrams are addressed to 4 destinations, 5 telegrams each; 4 telegrams are chosen at random. A = {all 4 chosen telegrams go to DIFFERENT destinations}. By the multiplication rule — each successive telegram must avoid all previously-used destinations — P(A) = ?',
                  options: [
                    '1 · (15/19) · (10/18) · (5/17) ≈ 0.129',
                    '(5/20)⁴',
                    '4! / 20⁴',
                    'C(4,4) / C(20,4)',
                  ],
                  answer: 0,
                  explanation:
                    'The 1st telegram can go anywhere (probability 1). The 2nd must avoid the 1st\'s destination: 15 of the remaining 19 qualify. The 3rd must avoid both: 10 of 18. The 4th: 5 of 17. Multiply (multiplication rule, each factor conditioned on everything drawn so far). (Problem 2.34.)',
                },
                {
                  prompt:
                    'Same setup. B = {all 4 chosen telegrams go to the SAME destination}. P(B) ≈ ?',
                  options: ['0.00413', '0.129', '0.25', '0.0256'],
                  answer: 0,
                  explanation:
                    'For one fixed destination (5 telegrams out of 20), P(all 4 chosen are from it) = (5/20)(4/19)(3/18)(2/17) ≈ 0.00103 (multiplication rule, shrinking pool). The 4 destinations give 4 mutually-exclusive ways for this to happen — add them (addition rule): 4 × 0.00103 ≈ 0.00413. (Problem 2.34.)',
                },
                {
                  prompt:
                    'A computer has m units; unit i has reliability pᵢ (probability of no failure) over time T and fails independently of the others. The computer fails if ANY unit fails. P(the computer fails during T) = ?',
                  options: ['1 − ∏ pᵢ', 'Σ (1 − pᵢ)', '∏ pᵢ', '∏ (1 − pᵢ)'],
                  answer: 0,
                  explanation:
                    'P(computer survives) = P(every unit survives) = ∏pᵢ (independence, multiplication rule). Subtract from 1. This is the SERIES-system reliability formula — you\'ll see it again, with diagrams, in the reliability lessons later in this chapter. (Problem 2.35.)',
                },
                {
                  prompt:
                    'When the ignition is turned on, the engine starts with probability p on each independent attempt. P(the engine starts EXACTLY on the second attempt)?',
                  options: ['(1 − p)·p', 'p²', '1 − (1 − p)²', 'p'],
                  answer: 0,
                  explanation:
                    'The first attempt must fail (probability 1−p) AND the second must succeed (probability p) — independent attempts, so multiply. (Problem 2.36, part 1.)',
                },
                {
                  prompt:
                    'Same engine. P(no more than 2 attempts are needed to start it)?',
                  options: ['1 − (1 − p)²', '(1 − p)·p', 'p²', '2p'],
                  answer: 0,
                  explanation:
                    'The complement — "fails on both of the first two attempts" — has probability (1−p)². Subtract from 1. Equivalently, p + (1−p)p = p(2−p) = 2p − p², the sum of "succeeds on attempt 1" and "succeeds on attempt 2". (Problem 2.36, part 2.)',
                },
              ],
            },
          ],
        },
        {
          id: 'apt-compound-scenarios',
          title: 'Compound scenarios: radar, battles, games & missiles',
          minutes: 20,
          xp: 100,
          steps: [
            { kind: 'read', title: 'Nesting, logs & recursive games', markdown: compoundScenariosMd },
            {
              kind: 'quiz',
              title: 'Composing the rules (problems 2.37–2.49)',
              questions: [
                {
                  prompt:
                    'Three messages are each independently transmitted as: correct (probability p₁), partially distorted (p₂), or completely distorted (p₃), with p₁+p₂+p₃=1. B = {at least one of the three is COMPLETELY distorted}. P(B) = ?',
                  options: [
                    '1 − (p₁+p₂)³',
                    'p₃³',
                    '3p₃',
                    '(p₁+p₂)³',
                  ],
                  answer: 0,
                  explanation:
                    'The complement of B is "no message is completely distorted" — each message independently lands in {correct, partial} with probability p₁+p₂, and all three must do so: (p₁+p₂)³ (independence ⟹ multiply). Subtract from 1. (Problem 2.37, event B.)',
                },
                {
                  prompt:
                    'Two radar units scan independently for time t: unit 1 makes n₁ cycles (detection probability p₁ per cycle), unit 2 makes n₂ cycles (detection probability p₂ per cycle). A = {the target is detected by at least one unit during t}. P(A) = ?',
                  options: [
                    '1 − (1−p₁)ⁿ¹(1−p₂)ⁿ²',
                    '(1−p₁)ⁿ¹(1−p₂)ⁿ²',
                    '1 − (1−p₁)ⁿ¹ − (1−p₂)ⁿ²',
                    '[1−(1−p₁)ⁿ¹]·[1−(1−p₂)ⁿ²]',
                  ],
                  answer: 0,
                  explanation:
                    'The complement — "NEITHER unit ever detects it" — is the product of each unit\'s "never detects in its own cycles" probability: (1−p₁)ⁿ¹·(1−p₂)ⁿ² (the two units are independent, so multiply). Subtract from 1 for "at least one". (Problem 2.38, event A.)',
                },
                {
                  prompt:
                    'A radar detects the target with probability p on each independent cycle. How many cycles N are needed so that P(detected within N cycles) ≥ β?',
                  options: [
                    'N ≥ log(1−β) / log(1−p)',
                    'N ≥ β / p',
                    'N ≥ log(β) / log(p)',
                    'N ≥ (1−β) / (1−p)',
                  ],
                  answer: 0,
                  explanation:
                    'Solve 1−(1−p)ᴺ ≥ β: (1−p)ᴺ ≤ 1−β, so N·log(1−p) ≤ log(1−β). Since log(1−p) < 0, dividing FLIPS the inequality: N ≥ log(1−β)/log(1−p). This is the only problem in the chapter where you solve for the trial count rather than being given it. (Problem 2.39.)',
                },
                {
                  prompt:
                    'A message of n symbols is sent; each symbol is independently distorted with probability p, so P(one repetition arrives with ≥1 distorted symbol) = 1−(1−p)ⁿ. The whole message is repeated l times. Problem 2.41 then asks: how many repetitions N are needed so that P(at least one of the N repetitions arrives PERFECT) ≥ β?',
                  options: [
                    'N ≥ log(1−β) / log(1−(1−p)ⁿ)',
                    'N ≥ log(1−β) / log(1−p)',
                    'N ≥ β / (1−p)ⁿ',
                    'N ≥ n · log(β)',
                  ],
                  answer: 0,
                  explanation:
                    'Problem 2.40 first nests the "1−qⁿ" pattern: treat q = 1−(1−p)ⁿ as the probability ONE repetition fails entirely, so P(≥1 perfect repetition in l tries) = 1−qˡ. Problem 2.41 then reuses problem 2.39\'s log algebra with this q in place of (1−p): N ≥ log(1−β)/log(q). (Problems 2.40–2.41.)',
                },
                {
                  prompt:
                    'A message is sent simultaneously over κ channels, repeated l times per channel. Each transmission is independently distorted with probability p, and each channel is independently "blocked by noise" (transmits nothing) with probability α. For ONE channel, P(at least one of its l transmissions arrives undistorted AND the channel isn\'t blocked) = (1−α)·[1−(1−p)ˡ]. P(the message gets through correctly on at least one of the κ channels) = ?',
                  options: [
                    '1 − {1 − (1−α)·[1−(1−p)ˡ]}ᵏ',
                    '{(1−α)·[1−(1−p)ˡ]}ᵏ',
                    '1 − (1−α)ᵏ·[1−(1−p)ˡ]ᵏ',
                    '(1−α)·[1−(1−p)ˡ]ᵏ',
                  ],
                  answer: 0,
                  explanation:
                    'Across the κ independent channels, the complement of "at least one channel succeeds" is "all κ channels fail" — raise the single-channel failure probability {1−(1−α)[1−(1−p)ˡ]} to the κth power, then subtract from 1. The "1−qⁿ" pattern applied one level up, on top of the nested pattern from problem 2.40. (Problem 2.42.)',
                },
                {
                  prompt:
                    'An air battle: a fighter fires first and downs the bomber with probability p₁. If the bomber survives, it fires back and downs the fighter with probability p₂. If the fighter survives that, it fires again and downs the bomber with probability p₃. Let A = {bomber downed}, B = {fighter downed}, C = {at least one aircraft downed}. The book gives P(C) = P(A) + P(B). Why is plain addition valid here, with no "−P(AB)" term?',
                  options: [
                    'A and B are mutually exclusive in this scenario — the sequence of shots stops as soon as either aircraft is downed, so both outcomes can\'t happen together',
                    'A and B are independent, so P(AB) happens to be exactly zero by coincidence',
                    'It\'s only an approximation — the book ignores a small correction term',
                    'Because p₁+p₂+p₃ = 1 by construction',
                  ],
                  answer: 0,
                  explanation:
                    'Trace the branches: P(A) = p₁ + (1−p₁)(1−p₂)p₃ (bomber downed on shot 1, OR survives + fighter survives + bomber downed on shot 2) and P(B) = (1−p₁)p₂ (bomber survives shot 1, then hits the fighter). In every branch where the bomber is downed, the fighter is still flying (and vice versa) — the two events partition the "someone is downed" outcomes, so the addition rule applies with no overlap to subtract. (Problem 2.43.)',
                },
                {
                  prompt:
                    'A bomber is attacked by two fighters; the bomber fires once at EACH fighter (hit probability p₁, independently). B = {both fighters are brought down}. P(B) = ?',
                  options: ['p₁²', '2p₁(1−p₁)', '1−(1−p₁)²', 'p₁'],
                  answer: 0,
                  explanation:
                    'Each fighter is independently downed by the bomber\'s shot with probability p₁; "both downed" multiplies the two independent probabilities (multiplication rule): p₁². (Problem 2.44, event B.)',
                },
                {
                  prompt:
                    'Same setup. E = {exactly ONE of the two fighters is brought down}. P(E) = ?',
                  options: ['2p₁(1−p₁)', 'p₁²', '1−(1−p₁)²', 'p₁(1−p₁)'],
                  answer: 0,
                  explanation:
                    '"Exactly one" splits into two mutually-exclusive cases: fighter 1 downed & fighter 2 survives (p₁(1−p₁)), or the reverse ((1−p₁)p₁) — equally likely, so add them (addition rule): 2p₁(1−p₁). (Problem 2.44, event E.)',
                },
                {
                  prompt:
                    'F = {exactly one AIRCRAFT — bomber or either fighter — is brought down}. The solution writes F = F₁ + F₂ + F₃, where F₁ = {only the bomber is downed}, F₂ = {only fighter 1 is downed}, F₃ = {only fighter 2 is downed}. Why does this split make the problem tractable?',
                  options: [
                    'Each Fᵢ names a DIFFERENT single aircraft as "the one downed", so they\'re mutually exclusive — the addition rule lets you sum probabilities computed separately (each itself a product, via the multiplication rule)',
                    'F₁, F₂, F₃ are independent, so you multiply them together',
                    'F₁, F₂, F₃ are equipossible, so each has probability exactly 1/3',
                    'F₁, F₂, F₃ actually overlap, and the formula deliberately double-counts to compensate',
                  ],
                  answer: 0,
                  explanation:
                    '"Exactly one aircraft downed" naturally splits by WHICH aircraft — at most one Fᵢ can be true at once (mutually exclusive), so P(F) = P(F₁)+P(F₂)+P(F₃) (addition rule), and each Fᵢ is itself a product of independent sub-events (multiplication rule). This "split by which one, then multiply within each branch" strategy recurs across this entire lesson. (Problem 2.44, event F.)',
                },
                {
                  prompt:
                    'Problem 2.45 changes ONE rule from 2.44: if one fighter is downed by the bomber\'s initial shots, the SURVIVING fighter now disengages instead of firing back. Which statement correctly identifies the effect?',
                  options: [
                    'P(A) — bomber downed — now requires BOTH fighters to survive the initial shots before either can fire back: P(A) = (1−p₁)²·[1−(1−p₂)²], smaller than in 2.44 where a lone survivor could still fire. P(B), P(C), P(E) — which depend only on the bomber\'s initial shots at the fighters — stay the same.',
                    'Nothing changes — disengaging only affects which fighter "wins", not any probability in the problem',
                    'Only P(B) changes, since a disengaging fighter can never be counted as "downed"',
                    'P(C) and P(E) both change, since disengaging changes which fighters the bomber shoots at first',
                  ],
                  answer: 0,
                  explanation:
                    'In 2.44, even if one fighter is downed, the survivor still fires back at the bomber. In 2.45 it disengages instead — so the bomber is only ever fired upon when BOTH fighters survive the initial volley (probability (1−p₁)²), and then both fire (P(bomber downed) = 1−(1−p₂)²). B, C, E depend only on the bomber\'s OWN initial shots at the fighters — unaffected by what a survivor does afterward — so they\'re unchanged. A "what changes if one rule changes" comparison with 2.44. (Problem 2.45.)',
                },
                {
                  prompt:
                    'An urn has a white and b black balls. Two players alternate drawing one ball (WITH replacement and restirring each time); the first to draw white wins. The book sets up R₁ = P(player 1 wins) as R₁ = a/(a+b) + [b/(a+b)]²·R₁ — because if both players draw black (probability [b/(a+b)]²), the game returns to an identical starting position. Solving this equation gives R₁ = ?',
                  options: [
                    '(a+b) / (a+2b) — always greater than 1/2',
                    'a / (a+b)',
                    'a / (2b)',
                    '1/2, by symmetry between the two players',
                  ],
                  answer: 0,
                  explanation:
                    'R₁·[1 − (b/(a+b))²] = a/(a+b), so R₁ = a(a+b) / [(a+b)²−b²] = a(a+b) / [a(a+2b)] = (a+b)/(a+2b) — which is always > 1/2 (the first-mover advantage). This is the chapter\'s only SELF-REFERENTIAL equation: because "both miss" returns the game to the same state, you solve algebraically rather than summing an infinite series term-by-term. (Problem 2.46.)',
                },
                {
                  prompt:
                    'An urn has 2 white and 3 black balls. Two players draw WITHOUT replacement, alternating turns; the first to draw white wins. P(player 1 — who goes first — wins)?',
                  options: ['3/5', '1/2', '2/5', '3/4'],
                  answer: 0,
                  explanation:
                    'Player 1 wins immediately with probability 2/5 (white on draw 1), or — if draws 1–2 are both black (probability (3/5)(2/4)=3/10) — wins on draw 3 with probability 2/3, contributing (3/10)(2/3)=1/5. Total: 2/5+1/5=3/5. Unlike problem 2.46\'s WITH-replacement version, drawing WITHOUT replacement guarantees the game ends within a bounded number of draws (only 3 black balls exist), so no self-referential equation is needed — direct enumeration works. (Problem 2.47.)',
                },
                {
                  prompt:
                    'An instrument fails on each trial independently with probability p. After the FIRST failure it\'s repaired and continues; after the SECOND failure it\'s rejected. P(it is rejected exactly on the kth trial)?',
                  options: [
                    '(k−1)·p²·(1−p)^(k−2)',
                    'p²·(1−p)ᵏ',
                    '(k−1)·p·(1−p)^(k−1)',
                    'pᵏ',
                  ],
                  answer: 0,
                  explanation:
                    'Rejection on trial k requires trial k itself to be a failure (probability p) AND exactly ONE of the first k−1 trials to have been the "first" failure — a binomial probability (k−1)p(1−p)^(k−2), choosing which of the k−1 prior trials it was. Multiply: (k−1)p²(1−p)^(k−2) — the binomial formula from the last lesson, nested inside a multiplication. (Problem 2.48.)',
                },
                {
                  prompt:
                    'Missiles are fired at a target one at a time until it\'s destroyed or an n-missile reserve is exhausted. Each missile independently reaches the target with probability p, and a missile that reaches it destroys the target with probability p₁ (so one missile\'s overall "kill" probability is p·p₁). P(some missiles remain in reserve when firing stops)?',
                  options: [
                    '1 − (1−p·p₁)^(n−1)',
                    '(1−p·p₁)^(n−1)',
                    '1 − (1−p)ⁿ·p₁',
                    'p·p₁',
                  ],
                  answer: 0,
                  explanation:
                    'The complement — "the WHOLE reserve is exhausted" — requires the first n−1 missiles to ALL fail to destroy the target, each independently with probability 1−p·p₁: giving (1−p·p₁)ⁿ⁻¹. "Some missiles remain" is the complement of that. (Problem 2.49.)',
                },
              ],
            },
          ],
        },
        {
          id: 'apt-weighted-branches',
          title: 'Different probabilities & weighted branches',
          minutes: 18,
          xp: 90,
          steps: [
            { kind: 'read', title: 'When the qᵢ differ, and a preview of Ch.3', markdown: weightedBranchesMd },
            {
              kind: 'quiz',
              title: 'Mixing components, weighting scenarios (problems 2.50–2.62)',
              questions: [
                {
                  prompt:
                    'Recall problem 2.49 (missiles fired until the target is destroyed or an n-missile reserve is exhausted; one missile\'s "kill" probability is p·p₁; P(some missiles remain) = 1−(1−pp₁)^(n−1)). Problem 2.50 asks for P(no less than TWO missiles remain), and problem 2.51 asks for P(no more than TWO missiles are fired). Which pair of formulas correctly generalizes 2.49\'s pattern?',
                  options: [
                    'P(≥2 remain) = 1−(1−pp₁)^(n−2) [the first n−2 missiles must all fail]; P(≤2 fired) = 1−(1−pp₁)² [the target is destroyed within the first 2 shots]',
                    'P(≥2 remain) = 1−(1−pp₁)ⁿ; P(≤2 fired) = (1−pp₁)²',
                    'P(≥2 remain) = (1−pp₁)^(n−2); P(≤2 fired) = 1−(1−pp₁)^(n−2)',
                    'Both equal 1−(1−pp₁)^(n−1), same as 2.49',
                  ],
                  answer: 0,
                  explanation:
                    '"At least 2 remain" ⟺ "the reserve is NOT exhausted even after n−2 missiles" — same complement idea as 2.49, just shrinking the exponent from n−1 to n−2. "No more than 2 fired" ⟺ "the target is destroyed within the first 2 shots" — the "1−qⁿ" pattern with n=2. The exercise is recognizing which COUNT — remaining reserve, or shots fired — belongs in the exponent. (Problems 2.50–2.51.)',
                },
                {
                  prompt:
                    'A radar unit tracks k DIFFERENT targets; target i is independently lost with probability pᵢ (not all equal). A = {none of the k targets is lost}. P(A) = ?',
                  options: [
                    '∏(1−pᵢ)',
                    '1−∏pᵢ',
                    'Σ(1−pᵢ)',
                    '(1−p̄)ᵏ, where p̄ is the average of the pᵢ',
                  ],
                  answer: 0,
                  explanation:
                    'This generalizes the "qⁿ" pattern to NON-identical probabilities: independence still lets you multiply, just with k DIFFERENT factors (1−pᵢ) instead of the same q repeated k times. (Problem 2.52, event A.)',
                },
                {
                  prompt:
                    'Same setup. B = {at least one of the k targets is lost}. P(B) = ?',
                  options: ['1−∏(1−pᵢ)', '∏pᵢ', 'Σpᵢ', '1−Σpᵢ'],
                  answer: 0,
                  explanation:
                    'The complement of B is A = {none lost} = ∏(1−pᵢ) (the previous question). Subtract from 1 — the same complement step from Lesson 1, now applied to a product of k DIFFERENT factors. (Problem 2.52, event B.)',
                },
                {
                  prompt:
                    'Still the same setup. C = {no more than one target is lost}. The book writes P(C) = P(none lost) + Σᵢ [pᵢ · ∏_{j≠i}(1−pⱼ)]. What does the summed term represent, and why sum over i?',
                  options: [
                    'Each term is "target i is the ONE lost one, every other target survives" — these k cases (one per choice of i) are mutually exclusive, so add them — the same "split by which one" strategy as problem 2.44',
                    'Each term double-counts P(none lost), so summing corrects for overcounting',
                    'The terms are independent of each other, so they should be multiplied, not added',
                    'Only the single largest pᵢ term matters; the rest are negligible and dropped',
                  ],
                  answer: 0,
                  explanation:
                    '"Exactly one lost" splits by WHICH target is the lost one — k mutually-exclusive cases, each a product of (that target lost) × (every other target survives). Add the k cases to "none lost" for "no more than one". The "split by which one" strategy from problem 2.44, now with k different probabilities. (Problem 2.52, event C.)',
                },
                {
                  prompt:
                    'An instrument has k units; unit i independently becomes faulty during time t with probability qᵢ. A repairman then inspects each unit and CATCHES an existing fault with probability p (misses it with probability 1−p). "Unit i remains faulty after inspection" requires it to become faulty AND the repairman to miss it. P(unit i remains faulty) = ?',
                  options: ['qᵢ·(1−p)', 'qᵢ·p', 'qᵢ + (1−p)', '1 − qᵢ(1−p)'],
                  answer: 0,
                  explanation:
                    'Two independent events — "unit i becomes faulty" (qᵢ) and "the repairman misses it" (1−p) — multiply (multiplication rule). The composite probability qᵢ(1−p) then plugs into the "1−∏(1−·)" pattern for "at least one unit remains faulty". (Problem 2.53.)',
                },
                {
                  prompt:
                    'Problem 2.54 adds: with probability Q, NO repairman is available, and the instrument is used WITHOUT inspection (so "unit i remains faulty" = qᵢ directly, not qᵢ(1−p)). The final answer combines both scenarios: P(A) = Q·[1−∏(1−qᵢ)] + (1−Q)·[1−∏(1−qᵢ(1−p))]. What justifies simply adding these two weighted terms?',
                  options: [
                    '"Repairman unavailable" (prob Q) and "available" (prob 1−Q) are mutually exclusive and exhaustive — compute P(A) WITHIN each scenario, weight by that scenario\'s probability, and add (a preview of Ch.3\'s Total Probability Formula)',
                    'Because Q + (1−Q) = 1, the weights are irrelevant and can be dropped from the formula',
                    'The two terms are independent of each other, so they should be multiplied, not added',
                    'It\'s an approximation that ignores the case of a partial inspection',
                  ],
                  answer: 0,
                  explanation:
                    '"Repairman unavailable" and "available" are mutually exclusive, exhaustive scenarios. Within EACH, compute P(A | scenario) using the right per-unit probability, weight by P(scenario), and add (addition rule on mutually-exclusive branches). This "weight each scenario, then add" skeleton is exactly the Total Probability Formula, P(A) = ΣP(Hᵢ)P(A|Hᵢ) — formally named in the very next chapter. (Problem 2.54.)',
                },
                {
                  prompt:
                    'A group of people is split into sub-groups by which of 3 languages each person speaks (some speak just one, some several, one sub-group speaks all three). Two people are picked at random; we want P(they share at least one common language). The book computes this via the complement: P(can\'t talk) = Σ P(one from group X, other from group Y), summed over PAIRS of sub-groups (X,Y) that share NO language. Why is this complement approach cleaner than computing "share a language" directly?',
                  options: [
                    '"Share at least one language" has many overlapping ways to happen (any shared language counts, with double-counting for multi-lingual groups), but "share NO language" only requires identifying which PAIRS of sub-groups are mutually incompatible — a short, mutually-exclusive list to sum',
                    'The complement is always easier to compute, regardless of the problem',
                    'With exactly 3 languages, the complement must also reduce to exactly 3 terms',
                    'Direct computation is impossible because "sharing a language" isn\'t expressible as a set operation',
                  ],
                  answer: 0,
                  explanation:
                    'Directly computing "at least one shared language" would need inclusion-exclusion across many overlapping group-pairs. The complement "shares NO language" only requires enumerating which PAIRS of sub-groups are mutually incompatible (share zero languages) — a short, mutually-exclusive list — and summing their pairwise-selection probabilities (addition rule). Subtract from 1. (Problem 2.59.)',
                },
                {
                  prompt:
                    'A factory checks each article (defective with probability p) with k inspectors in sequence; inspector i independently detects an existing defect with probability pᵢ. A = {the article is rejected} (it has a defect AND at least one inspector catches it). P(A) = ?',
                  options: [
                    'p · [1 − ∏(1−pᵢ)]',
                    '1 − ∏(1−pᵢ)',
                    'p · ∏pᵢ',
                    '∏pᵢ',
                  ],
                  answer: 0,
                  explanation:
                    'Rejection requires BOTH "the article actually has a defect" (probability p) AND "at least one of the k inspectors catches it" (the familiar "1−∏(1−pᵢ)" pattern). Multiply the two independent factors. (Problem 2.60, event A.)',
                },
                {
                  prompt:
                    'Problem 2.61: a single inspector checks an article (defective with probability p). If defective, the inspector catches it with probability p₁. If the article is FLAWLESS, the inspector might still reject it "by mistake" with probability α. A = {the article is rejected, for any reason}. P(A) = ?',
                  options: [
                    'p·p₁ + (1−p)·α',
                    'p·p₁·α',
                    'p·p₁ + α',
                    '1 − (1−p)(1−α)',
                  ],
                  answer: 0,
                  explanation:
                    '"Rejected" splits into two mutually-exclusive branches by whether the article is actually defective: "defective AND caught" (p·p₁) or "flawless AND mistakenly rejected" ((1−p)·α). Weight each branch by its probability and add — the same weighted-branches pattern as problem 2.54, now with the article\'s defect-status as the "hypothesis". (Problem 2.61, event A.)',
                },
                {
                  prompt:
                    'Problem 2.62 extends 2.61 to TWO inspectors (detection probabilities p₁,p₂; mistake-probabilities α₁,α₂); "rejected" now means at least one inspector rejects it. Which formula correctly combines the weighted-branches skeleton from 2.61 with the "1−∏qᵢ" pattern for 2 inspectors?',
                  options: [
                    'P(A) = p·[1−(1−p₁)(1−p₂)] + (1−p)·[1−(1−α₁)(1−α₂)]',
                    'P(A) = p·p₁·p₂ + (1−p)·α₁·α₂',
                    'P(A) = [p·p₁+(1−p)α₁] + [p·p₂+(1−p)α₂]',
                    'P(A) = 1 − (1−p)(1−p₁)(1−p₂)(1−α₁)(1−α₂)',
                  ],
                  answer: 0,
                  explanation:
                    'The weighted-branches skeleton from 2.61 is unchanged — "defective" (prob p) vs "flawless" (prob 1−p) — only the WITHIN-branch probability changes, now needing "at least one of 2 inspectors catches it" (1−∏(1−pᵢ)) or "at least one mistakenly rejects" (1−∏(1−αᵢ)), each the familiar "1−qⁿ" pattern. (Problem 2.62.)',
                },
              ],
            },
          ],
        },
        {
          id: 'apt-reliability-systems',
          title: 'Reliability theory: series, parallel & redundancy',
          minutes: 20,
          xp: 100,
          steps: [
            { kind: 'read', title: 'Composing the formulas you already have', markdown: reliabilitySystemsMd },
            {
              kind: 'quiz',
              title: 'Series, parallel & survival functions (problems 2.63–2.73)',
              questions: [
                {
                  prompt:
                    'An instrument consists of m units in SERIES — a failure of ANY unit fails the whole instrument. Each unit has reliability p (probability of failure-free operation over time t), and units fail independently. P(the instrument operates without failure) = ?',
                  options: ['pᵘ, where u = m', '1−(1−p)ᵘ, where u = m', 'm·p', '1−pᵘ, where u = m'],
                  answer: 0,
                  explanation:
                    '"The instrument survives" = "EVERY unit survives" — independent events, multiply (multiplication rule): pᵘ. This is the SERIES reliability formula — its complement form, P(fails)=1−∏pᵢ, is exactly problem 2.35. (Problem 2.63.)',
                },
                {
                  prompt:
                    'To increase reliability, an instrument (reliability p) is backed up by an IDENTICAL second instrument: if the first fails, the second switches on instantly (switching device reliability = 1, i.e. perfect). P(the two-instrument system operates without failure) = ?',
                  options: ['1−(1−p)²', 'p²', '2p−p²', '1−p²'],
                  answer: 0,
                  explanation:
                    '"The system fails" requires BOTH instruments to fail — independent, multiply: (1−p)². Subtract from 1. This is the PARALLEL (redundancy) reliability formula, the mirror image of problem 2.63\'s series formula. (Note: 1−(1−p)² simplifies to 2p−p², so both expressions are equal.) (Problem 2.64.)',
                },
                {
                  prompt:
                    'Same setup as 2.64, but the switching device itself has reliability pₚ (the probability it actually switches over when needed). If the first instrument fails, the backup only saves the system if BOTH the switch works AND the second instrument is failure-free. P(the system operates without failure) = ?',
                  options: ['1−(1−p)(1−pₚ·p)', '1−(1−p)(1−pₚ)', '1−(1−p)²', 'pₚ·[1−(1−p)²]'],
                  answer: 0,
                  explanation:
                    '"The system fails" = "the first instrument fails" AND "the backup path also fails". The backup path needs BOTH the switch to work (pₚ) AND the second instrument to survive (p) — a composite probability pₚ·p (last lesson\'s "multiply two independent factors before plugging in" trick). P(system fails)=(1−p)(1−pₚp); subtract from 1. (Problem 2.65.)',
                },
                {
                  prompt:
                    'To further increase reliability, the instrument is backed up by (n−1) identical standby instruments (n total, all reliability p), with perfect switching (pₚ=1). P(the system operates without failure) = ?',
                  options: ['1−(1−p)ⁿ', '1−(1−p)^(n−1)', 'pⁿ', 'n·p'],
                  answer: 0,
                  explanation:
                    'Extending problem 2.65\'s logic with perfect switching (pₚ=1): "the system fails" = "ALL n instruments fail" = (1−p)ⁿ. Subtract from 1. (Problem 2.66.)',
                },
                {
                  prompt:
                    'Same setup. How many total instruments n are needed so that the system reliability is at least P₁?',
                  options: [
                    'n ≥ log(1−P₁) / log(1−p)',
                    'n ≥ P₁ / p',
                    'n ≥ log(P₁) / log(p)',
                    'n ≥ (1−P₁) / (1−p)',
                  ],
                  answer: 0,
                  explanation:
                    'Solve 1−(1−p)ⁿ ≥ P₁ — exactly problem 2.39\'s log-algebra (the inequality flips because log(1−p)<0), now applied to redundant-system design instead of radar cycles. (Problem 2.66, part 2.)',
                },
                {
                  prompt:
                    'Problem 2.67 extends 2.66: each of the (n−1) standby instruments has its OWN switching device, reliability pₚ. P(the system operates without failure) = ?',
                  options: [
                    '1−(1−p)(1−pₚp)^(n−1)',
                    '1−(1−p)ⁿ',
                    '1−[(1−p)(1−pₚp)]^(n−1)',
                    '(1−p)(1−pₚp)^(n−1)',
                  ],
                  answer: 0,
                  explanation:
                    'The FIRST instrument must fail (1−p), AND EACH of the (n−1) standbys must fail to take over. Each standby\'s "takes over successfully" probability is pₚ·p (problem 2.65\'s composite), so "fails to take over" is (1−pₚp), and ALL (n−1) standbys must fail to take over: (1−pₚp)^(n−1). Multiply these and subtract from 1. (Problem 2.67.)',
                },
                {
                  prompt:
                    'Problem 2.68* compares two ways to add ONE redundant copy to an n-unit SERIES system (each unit reliability p, system fails if ANY unit fails): technique (a) — duplicate EACH UNIT individually (n independent parallel pairs, in series), giving pₐ=[1−(1−p)²]ⁿ; technique (b) — duplicate the WHOLE SYSTEM (two complete n-unit chains, in parallel), giving p_b=1−(1−pⁿ)². The book proves pₐ > p_b for any n>1, 0<p<1. What\'s the intuitive reason?',
                  options: [
                    'Duplicating each unit gives the system many INDEPENDENT extra chances to survive (one per unit); duplicating the whole system gives only ONE extra chance, and that backup must survive ALL n units simultaneously to help',
                    'p_b is actually larger in general, but the book\'s proof contains an error',
                    'They are always exactly equal, since both use 2n total units',
                    'pₐ > p_b only when p is very close to 1; for small p, p_b wins instead',
                  ],
                  answer: 0,
                  explanation:
                    'Technique (b)\'s backup is all-or-nothing: if the primary chain fails because of just ONE weak unit, the ENTIRE backup chain must work perfectly (probability pⁿ, a high bar) to save the system. Technique (a) gives EACH unit its own independent backup — a failure in any one unit is caught locally, without needing every other unit\'s backup to also be ready. More, smaller, independent redundancies beat one big redundant copy — a foundational reliability-engineering result. (Problem 2.68*.)',
                },
                {
                  prompt:
                    'Problem 2.69: in a series system, only the LESS RELIABLE units are duplicated (parallel pairs), while the more reliable ones remain single. If units 1 and 2 (reliability p₁,p₂) are each duplicated and unit 3 (reliability p₃) is not, P(the whole system survives) = ?',
                  options: [
                    '[1−(1−p₁)²]·[1−(1−p₂)²]·p₃',
                    'p₁²·p₂²·p₃',
                    '[1−(1−p₁)²]+[1−(1−p₂)²]+p₃',
                    '1−(1−p₁)²(1−p₂)²(1−p₃)',
                  ],
                  answer: 0,
                  explanation:
                    'Apply problem 2.64\'s parallel formula [1−(1−pᵢ)²] to each duplicated unit, problem 2.63\'s plain pᵢ to the non-duplicated unit, then multiply ALL of them together (series — every block must survive). No new formula — just composing the two you already have, block by block. (Problem 2.69.)',
                },
                {
                  prompt:
                    'An instrument has 3 units: unit I (n₁ elements, all necessary — series) is itself necessary for the whole instrument; units II (n₂ elements) and III (n₃ elements) repeat EACH OTHER. Each element has reliability p, elements fail independently, so P(unit I survives)=p^(n₁), P(unit II survives)=p^(n₂), P(unit III survives)=p^(n₃) (problem 2.63). P(the whole instrument survives) = ?',
                  options: [
                    'p^(n₁) · [1−(1−p^(n₂))(1−p^(n₃))]',
                    'p^(n₁+n₂+n₃)',
                    'p^(n₁) · [p^(n₂)+p^(n₃)]',
                    '1−(1−p^(n₁))(1−p^(n₂))(1−p^(n₃))',
                  ],
                  answer: 0,
                  explanation:
                    'Combine units II and III with problem 2.64\'s parallel formula: 1−(1−p^(n₂))(1−p^(n₃)). Unit I is necessary, so multiply that block by unit I\'s own reliability p^(n₁) (series, problem 2.63). Three formulas you already have, composed in the same order as the system\'s own diagram: series → (the parallel pair) → series. (Problem 2.70.)',
                },
                {
                  prompt:
                    'A device can only fail at the moment it\'s switched on. Given it has survived the first k−1 switch-ons, let Qₖ be the CONDITIONAL probability it burns out on the kth switch-on (Qₖ may be DIFFERENT for every k — e.g. components wear out, so Qₖ tends to grow). A = {the device withstands at least n switch-on operations}. P(A) = ?',
                  options: [
                    '∏ₖ₌₁ⁿ (1−Qₖ)',
                    '1−∏ₖ₌₁ⁿ Qₖ',
                    'Σₖ₌₁ⁿ (1−Qₖ)',
                    '(1−Q̄)ⁿ, where Q̄ is the average of the Qₖ',
                  ],
                  answer: 0,
                  explanation:
                    '"Survives switch-on k" has CONDITIONAL probability (1−Qₖ) given it survived switches 1..k−1. By the chained multiplication rule (Lesson 2), P(survives all n) = ∏(1−Qₖ) — the product of survival probabilities, even though each (1−Qₖ) is DIFFERENT. Every "1−qⁿ"-shaped formula so far has been the SPECIAL CASE where all the Qₖ happen to be equal. (Problem 2.71.)',
                },
                {
                  prompt:
                    'Problem 2.72: a 4-unit instrument (units I, II necessary/series; units III, IV repeat each other/parallel) has per-switch failure probabilities q_I(k), q_II(k) for units I, II and q(k) for both III and IV. The solution "reduces to problem 2.71" by first computing a single combined per-switch failure probability Qₖ for the WHOLE instrument at switch k. Which expression is Qₖ?',
                  options: [
                    '1 − [1−q_I(k)][1−q_II(k)][1−q(k)²]',
                    'q_I(k) + q_II(k) + q(k)²',
                    'q_I(k) · q_II(k) · q(k)²',
                    '1 − q_I(k)·q_II(k)·q(k)²',
                  ],
                  answer: 0,
                  explanation:
                    'Combine the four units at switch k exactly as in problems 2.63–2.64: units I, II survive together with probability [1−q_I(k)][1−q_II(k)] (series — multiply), units III & IV (both per-switch failure q(k)) survive as a pair with probability 1−q(k)² (parallel, problem 2.64). Multiply these two blocks (series) for the instrument\'s survival probability at switch k; Qₖ is 1 minus that — then plug this single Qₖ into 2.71\'s ∏(1−Qₖ). (Problem 2.72.)',
                },
                {
                  prompt:
                    'Problem 2.73: a 3-unit instrument (all 3 necessary — series); on each switch-on, unit i independently develops a "fault" with probability pᵢ, and a unit fails completely only once it has accumulated AT LEAST 2 faults. P(unit i withstands n switch-ons) = P(unit i has 0 OR 1 faults in n switch-ons) = (1−pᵢ)ⁿ + n·pᵢ(1−pᵢ)^(n−1) — the binomial formula (2.0.15) for "at most 1 success". P(the whole instrument withstands n switch-ons) = ?',
                  options: [
                    '∏ᵢ₌₁³ [(1−pᵢ)ⁿ + n·pᵢ(1−pᵢ)^(n−1)]',
                    'Σᵢ₌₁³ [(1−pᵢ)ⁿ + n·pᵢ(1−pᵢ)^(n−1)]',
                    '[(1−p̄)ⁿ + n·p̄(1−p̄)^(n−1)]³, where p̄ is the average of the pᵢ',
                    '1 − ∏ᵢ₌₁³ [(1−pᵢ)ⁿ + n·pᵢ(1−pᵢ)^(n−1)]',
                  ],
                  answer: 0,
                  explanation:
                    'The instrument survives iff ALL 3 units survive — independent, so multiply (series formula, problem 2.63) — but now each "unit survives" probability is itself a BINOMIAL "at most 1 success in n trials" expression (Lesson 3\'s formula 2.0.15, summed for m=0 and m=1). Two formulas you already know, nested rather than side-by-side. (Problem 2.73.)',
                },
              ],
            },
          ],
        },
        {
          id: 'apt-binomial-applications',
          title: 'The binomial formula at work',
          minutes: 22,
          xp: 110,
          steps: [
            { kind: 'read', title: 'Multinomial, products, and nesting the binomial', markdown: binomialApplicationsMd },
            {
              kind: 'quiz',
              title: 'Applying — and generalizing — the binomial formula (problems 2.76–2.94)',
              questions: [
                {
                  prompt:
                    'A device has n units; each unit, after operating for time t, ends up in exactly one of 4 states: good order (p₁), needs adjustment (p₂), needs repair (p₃), or out of order (p₄), with p₁+p₂+p₃+p₄=1, independently across units. C = {exactly ONE unit needs repair, and ALL the other (n−1) units need adjustment}. P(C) = ?',
                  options: ['n · p₃ · p₂ⁿ⁻¹', 'p₃ · p₂ⁿ⁻¹', 'C(n,2) · p₃² · p₂ⁿ⁻²', 'p₃ⁿ'],
                  answer: 0,
                  explanation:
                    'Choose WHICH of the n units is the one needing repair — C(n,1)=n mutually-exclusive ways (addition rule) — then multiply by p₃ (that unit needs repair) and p₂ⁿ⁻¹ (every other unit needs adjustment, independent). A 4-outcome generalization of the binomial "choose which trials succeed" idea. (Problem 2.76, event C.)',
                },
                {
                  prompt:
                    'Same setup. E = {exactly TWO units need adjusting, exactly ONE needs repair, and the remaining (n−3) units are all in good order}. P(E) = ?',
                  options: [
                    '[n! / (2!·1!·(n−3)!)] · p₂² · p₃ · p₁ⁿ⁻³',
                    'n · p₂² · p₃ · p₁ⁿ⁻³',
                    'C(n,2) · p₂² · p₃ⁿ⁻²',
                    'p₂² · p₃ · p₁ⁿ⁻³',
                  ],
                  answer: 0,
                  explanation:
                    'Now there are THREE categories to assign units to (2 adjust, 1 repair, n−3 good) — the count of ways to do this is the MULTINOMIAL coefficient n!/(2!1!(n−3)!), generalizing C(n,k)=n!/(k!(n−k)!) from the binomial formula to more than 2 categories. Multiply by the per-arrangement probability p₂²p₃p₁ⁿ⁻³ (independence). (Problem 2.76, event E.)',
                },
                {
                  prompt:
                    'n messages are sent, each independently distorted with probability p. C = {no more than half of the n messages are distorted}. P(C) = ?',
                  options: [
                    'Σ (k=0 to ⌊n/2⌋) C(n,k) pᵏ(1−p)ⁿ⁻ᵏ',
                    'Σ (k=⌊n/2⌋ to n) C(n,k) pᵏ(1−p)ⁿ⁻ᵏ',
                    'C(n,⌊n/2⌋) p^⌊n/2⌋ (1−p)^⌈n/2⌉',
                    '(1/2)ⁿ',
                  ],
                  answer: 0,
                  explanation:
                    '"No more than half distorted" means the count of distorted messages k ranges from 0 to ⌊n/2⌋ — sum formula 2.0.17\'s "exactly k" terms over exactly that range (mutually-exclusive outcomes, addition rule). (Problem 2.78, event C.)',
                },
                {
                  prompt:
                    'A device has 5 units, each failing independently with probability 0.4. The book computes P(0 fail)≈0.078, P(exactly 1 fails)≈0.259, P(exactly 2 fail)≈0.346, and then P(device functions) = P(0 fail) + P(exactly 1 fails) + P(exactly 2 fail) ≈ 0.683. What rule justifies adding these three numbers?',
                  options: [
                    '"0 fail", "exactly 1 fails", and "exactly 2 fail" are 3 of the (n+1) mutually-exclusive outcomes of the binomial distribution — the addition rule lets you sum them directly for "at most 2 fail"',
                    'The three probabilities are independent, so they should be multiplied, not added',
                    'It\'s only an approximation; the exact value requires a continuous integral',
                    'Because 0.4×5=2, the three terms happen to be equal, and the result is 3×(one term)',
                  ],
                  answer: 0,
                  explanation:
                    'The binomial distribution partitions the sample space into n+1 mutually-exclusive "exactly k failures" outcomes (k=0,...,5); any combined event ("0, 1, or 2 fail") is the sum of the relevant disjoint pieces — the addition rule from Lesson 2, applied to binomial terms instead of arbitrary events. (Problem 2.79.)',
                },
                {
                  prompt:
                    'A factory inspects n articles; each independently has a defect with probability r, and if it has a defect, the inspector detects it with probability p (so "a detectable defect is found" has the composite probability r·p — Lesson 5\'s trick). B = {a defect is detected in EXACTLY 2 of the n articles}. P(B) = ?',
                  options: [
                    'C(n,2) · (rp)² · (1−rp)ⁿ⁻²',
                    'C(n,2) · r² · p²',
                    '(rp)²',
                    'n · rp · (1−rp)ⁿ⁻¹',
                  ],
                  answer: 0,
                  explanation:
                    'Treat "defect detected in this article" as a single binomial trial with composite probability rp ("has a defect" AND "inspector catches it", Lesson 5). Then "exactly 2 of n" is the ordinary binomial formula 2.0.15 with this composite probability in place of a single p. (Problem 2.82, event B.)',
                },
                {
                  prompt:
                    'Two instruments operate independently: instrument 1 has n₁ units, each failing with probability g₁; instrument 2 has n₂ units, each failing with probability g₂. P(exactly m₁ units fail in instrument 1 AND exactly m₂ units fail in instrument 2) = ?',
                  options: [
                    'C(n₁,m₁)g₁^m₁(1−g₁)^(n₁−m₁) · C(n₂,m₂)g₂^m₂(1−g₂)^(n₂−m₂)',
                    'C(n₁,m₁)g₁^m₁(1−g₁)^(n₁−m₁) + C(n₂,m₂)g₂^m₂(1−g₂)^(n₂−m₂)',
                    'C(n₁+n₂, m₁+m₂) · (g₁+g₂)^(m₁+m₂)',
                    'C(n₁,m₁) · C(n₂,m₂) · g₁^m₁ · g₂^m₂',
                  ],
                  answer: 0,
                  explanation:
                    'The two instruments operate independently, so the joint probability is the PRODUCT of each instrument\'s own binomial probability (multiplication rule) — each factor computed with formula 2.0.15 using that instrument\'s own n, m, and failure probability. (Problem 2.84.)',
                },
                {
                  prompt:
                    'Two evenly-matched players (probability 1/2 each game) play a series of games. Is it more likely to win AT LEAST 3 of 4 games, or AT LEAST 5 of 8 games? Both represent "win more than half" of the games played.',
                  options: [
                    'At least 5 of 8 — even though P(exactly 5 of 8) is individually SMALLER than P(exactly 3 of 4), summing the longer tail (5,6,7, or 8 wins out of 8) edges out the shorter tail (3 or 4 wins out of 4)',
                    'At least 3 of 4 — fewer games means less opportunity to fall short of the majority',
                    'They are exactly equal, since both represent "more than half the games"',
                    'It cannot be compared without knowing each player\'s individual skill level',
                  ],
                  answer: 0,
                  explanation:
                    'P(≥3 of 4) = C(4,3)(1/2)⁴+C(4,4)(1/2)⁴ = 5/16 = 80/256. P(≥5 of 8) = [C(8,5)+C(8,6)+C(8,7)+C(8,8)](1/2)⁸ = 93/256. So ≥5 of 8 is MORE likely — "same ratio" does not mean "same probability"; always compute both tail sums rather than assuming scaling. (Problem 2.87.)',
                },
                {
                  prompt:
                    'A person is dark-haired (0.2), brown-haired (0.3), fair-haired (0.4), or red-haired (0.1) — 4 probabilities summing to 1. In a group of 6 people chosen at random, B = {at least one person is red-haired}. P(B) = ?',
                  options: ['1 − (0.9)⁶', '1 − (0.1)⁶', '6 · 0.1 · (0.9)⁵', '(0.9)⁶'],
                  answer: 0,
                  explanation:
                    'Even with 4 hair-color categories, this question only cares about "red" vs "not red" (probability 0.9 of not-red) — the multinomial COLLAPSES to a binomial "1−qⁿ" pattern (Lesson 1/3) whenever you only care about ONE category vs. everything else. (Problem 2.88, event B.)',
                },
                {
                  prompt:
                    'Same group of 6. C = {the group has an EQUAL number of fair-haired (p=0.4) and brown-haired (p=0.3) people} — could be 0-and-0, 1-and-1, 2-and-2, or 3-and-3 (caps at 3 each in a group of 6). The book computes P(C) as a SUM of 4 multinomial terms, one per value of k=0,1,2,3 (k fair, k brown, 6−2k other). What strategy does this illustrate?',
                  options: [
                    '"Equal counts" is a UNION of several mutually-exclusive multinomial outcomes (one per value of k) — sum their probabilities (addition rule), each computed with the multinomial coefficient 6!/(k!k!(6−2k)!)',
                    'Compute only P(3 fair, 3 brown), since that\'s the "most equal" case and dominates the sum',
                    'Multiply the 4 terms together, since all 4 values of k must occur simultaneously',
                    'C is impossible to compute without knowing the exact seating arrangement of the 6 people',
                  ],
                  answer: 0,
                  explanation:
                    '"Equal numbers of fair and brown" is satisfied by 4 different, mutually-exclusive outcomes (k=0,1,2,3 each), so the addition rule lets you sum their multinomial probabilities — each term using the multinomial coefficient from this lesson\'s opening section. (Problem 2.88, event C.)',
                },
                {
                  prompt:
                    'N faulty instruments are tested one at a time; each test independently locates a defect with probability p. Testing continues until all N defects are located, but only n tests are allowed (n>N). A = {all N defects are located within the n tests}. P(A) = ?',
                  options: [
                    'Σ (m=N to n) C(n,m) pᵘ(1−p)ⁿ⁻ᵘ — "at least N successes out of n tests"',
                    'C(n,N) pᴺ(1−p)ⁿ⁻ᴺ — exactly N successes',
                    'Σ (m=0 to N) C(n,m) pᵘ(1−p)ⁿ⁻ᵘ — at most N successes',
                    '(1−p)ⁿ⁻ᴺ',
                  ],
                  answer: 0,
                  explanation:
                    '"All N defects located" requires the number of SUCCESSFUL tests (defect located) to be AT LEAST N, out of the n attempts — the binomial tail, counted in the SUCCESSES direction (formula 2.0.17) rather than the usual "failures ≤ threshold" framing. Problem 2.91 asks the complementary question — "at least k of the N remain unlocated" — the same tail sum, counted from the other end (at most N−k successes). (Problems 2.90–2.91.)',
                },
                {
                  prompt:
                    'An instrument has n units with DIFFERENT failure probabilities p₁,...,pₙ (qᵢ=1−pᵢ). The exact failure probability is R = 1 − ∏qᵢ. Someone approximates by AVERAGING the pᵢ into p̄, computing R̃ = 1 − (1−p̄)ⁿ = 1 − q̄ⁿ. By the AM–GM inequality (geometric mean ≤ arithmetic mean for positive numbers), is R̃ an over- or under-estimate of R?',
                  options: [
                    'R̃ < R — averaging the inputs before plugging into the "1−∏q" formula UNDERESTIMATES the true failure probability',
                    'R̃ > R — averaging the inputs always OVERESTIMATES the failure probability',
                    'R̃ = R always, regardless of how spread out the pᵢ are',
                    'It depends on whether n is even or odd',
                  ],
                  answer: 0,
                  explanation:
                    'AM–GM gives ∏qᵢ ≤ q̄ⁿ (the geometric mean of the qᵢ raised to the nth power is ∏qᵢ; the arithmetic mean raised to the nth power is q̄ⁿ; GM ≤ AM). So R = 1−∏qᵢ ≥ 1−q̄ⁿ = R̃. "Replace the distribution with its mean" before applying a "1−∏q"-shaped formula systematically UNDERESTIMATES the failure probability — a concrete instance of Jensen\'s inequality. (Problem 2.92*.)',
                },
                {
                  prompt:
                    'An article undergoes 4 sequential tests with DIFFERENT pass-probabilities p₁=0.9, p₂=0.95, p₃=0.8, p₄=0.85. B = {the article passes EXACTLY 2 of the 4 tests}. Because the pᵢ are NOT identical, which expression correctly gives P(B)?',
                  options: [
                    'Sum, over all C(4,2)=6 ways to choose WHICH 2 tests are passed, of [the product of those 2 pᵢ\'s] × [the product of the OTHER 2 tests\' (1−pᵢ)\'s]',
                    'C(4,2) · p̄² · (1−p̄)², using the average p̄ of the 4 probabilities',
                    'p₁·p₂·p₃·p₄, since all 4 tests contribute',
                    '(p₁+p₂+p₃+p₄)/4, the average pass probability',
                  ],
                  answer: 0,
                  explanation:
                    'When trial probabilities differ, C(n,k)pᵏqⁿ⁻ᵏ no longer applies directly — it was only a shortcut for when every term in the "choose which k succeed" sum happens to be identical. With different pᵢ, sum each of the C(4,2)=6 distinct terms separately (each a different product of 2 passes and 2 fails) — Lesson 5\'s "1−∏qᵢ" generalization (the k=0 case), now extended to "exactly k" for k=2. (Problem 2.93.)',
                },
                {
                  prompt:
                    'A message has n symbols; each symbol is repeated m times for reliability and is "recognized" at the receiving end only if it arrives correctly at least k of the m times (a binomial-tail probability via formula 2.0.17 — call it P(A)). B = {the WHOLE message is recognized} requires EVERY one of the n symbols to be individually recognized. P(B) = ?',
                  options: ['[P(A)]ⁿ', '1 − [1−P(A)]ⁿ', 'n · P(A)', 'P(A)ⁿ⁻¹ · (1−P(A))'],
                  answer: 0,
                  explanation:
                    '"Every symbol must be recognized" — n independent events, all must occur — is the SERIES "all must survive" pattern (problem 2.63), applied to the per-symbol probability P(A), which is ITSELF a binomial-tail probability (formula 2.0.17, over the m repetitions). Two formulas nested at two different scales: within-symbol (binomial over m repetitions) and across-message (series over n symbols). (Problem 2.94, event B.)',
                },
                {
                  prompt:
                    'Same setup. C = {no more than l of the n symbols are distorted in the message}, where "symbol distorted" (probability 1−P(A), from the previous question) is now treated as a single trial. P(C) = ?',
                  options: [
                    'Σ (i=0 to l) C(n,i) · [1−P(A)]ⁱ · [P(A)]ⁿ⁻ⁱ — formula 2.0.17, applied AGAIN, across the n symbols',
                    '[1−P(A)]ˡ',
                    '1 − [P(A)]ⁿ',
                    'l · [1−P(A)]',
                  ],
                  answer: 0,
                  explanation:
                    'The SAME formula 2.0.17 used "within one symbol" (to compute P(A) itself) is applied again at the OUTER scale — "across the n symbols" — with "success" = "symbol distorted" (probability 1−P(A)) and threshold l. The chapter\'s final problem is a microcosm of its whole arc: the same small set of rules (binomial tail, series-AND, nesting at different scales), applied recursively. (Problem 2.94, event C.)',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
