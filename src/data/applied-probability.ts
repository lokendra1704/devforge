import type { Subject } from '../types'
import foundationsMd from './md/apt-foundations.md?raw'
import classicalMd from './md/apt-classical.md?raw'
import combinatoricsMd from './md/apt-combinatorics.md?raw'
import geometricMd from './md/apt-geometric.md?raw'

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
  ],
}
