import type { ExperimentMeta } from '@/types/experiment'

// Set this to your public OSS repository after pushing to GitHub:
export const GITHUB_URL = 'https://github.com/YOUR_GH_USERNAME/ekiden-isc-experiments'

// Local source of truth — also used as a fallback when Firestore is empty/offline.
export const EXPERIMENTS: ExperimentMeta[] = [
  {
    id: 'A',
    name: 'Experiment A — cost model & break-even R*',
    status: 'interactive harness (illustrative constants; ready for measured c-values)',
    purpose:
      'Make the ISC cost model concrete and turn its “illustrative” constants into something you can probe. Validates R* = (N·c_c + W·c_m)/(c_q − c_r): the reads after which compiling once (ISC) beats re-deriving meaning on every query (QSR).',
    data:
      'No external data — a parametric model. The calculator computes total cost for QSR and ISC across cumulative reads R for any constants. For a measured study, plug in real c_c/c_m/c_q/c_r from running real QSR and ISC pipelines on a corpus.',
    evaluation:
      'Read off the crossing point of the two cost curves as R*, and ISC’s amortised per-query cost as reads grow (it tends to the traversal cost c_r, while QSR stays fixed at c_q).',
  },
  {
    id: 'C',
    name: 'Experiment C — incremental maintenance vs. full re-SVD (+ virtual axis update)',
    status: 'completed (synthetic pilot)',
    purpose:
      'Test H2: event-driven incremental updates track the full-re-SVD subspace at low cost, with maintenance cost that scales with CHANGE, not corpus size N. A second part tests the “virtual axis update”: can a model-generation change be absorbed without re-embedding everything?',
    data:
      'Synthetic pilot data: a low-rank evolving corpus, D=256, substrate rank k=32, grown from 3,000 to 9,000 documents over 50 update events. All numbers shown are real measurements. Next step: the real-corpus run (embedding APIs + Wikipedia revision history).',
    evaluation:
      'Per-update wall-clock (full re-SVD O(nd²) vs. incremental). Subspace agreement via maximum principal angle. Retrieval quality via recall@10 vs. the full-recompute neighbours. For the virtual axis update, an orthogonal Procrustes map from a small anchor set, scored by mean cosine to truly re-embedded vectors vs. fraction re-embedded.',
  },
  {
    id: 'NEXT',
    name: 'Next — real-corpus run',
    status: 'planned (the next step)',
    purpose:
      'Replace synthetic data and illustrative constants with measurements on a real, evolving corpus — a measured R* and a measured maintenance-cost curve. This turns the preliminary evaluation into an empirical study (and makes the extended version eligible for arXiv without prior acceptance).',
    data:
      'Wikipedia text + revision history (a real, timestamped insert/edit/delete stream). Embeddings from OpenAI text-embedding-3, Google gemini-embedding, Voyage 4. QA: MuSiQue / 2WikiMultiHopQA / HotpotQA, NaturalQuestions / PopQA.',
    evaluation:
      'Measure c_c, c_m, c_q, c_r and read off the measured R*. recall@k / nDCG@k, EM/F1, run-to-run variance, principal-angle drift / staleness. Experiments B (failure asymmetry) and D (non-economic benefits) extend the study.',
  },
]

export const ROADMAP: { when: string; title: string; detail: string }[] = [
  { when: 'Weeks 1–2', title: 'Real-corpus Experiment C + Experiment A c-values', detail: 'Embed a Wikipedia subset via an embedding API; run incremental vs full re-SVD on real embeddings against the revision stream; measure c_c/c_m/c_q/c_r.' },
  { when: 'Weeks 3–4', title: 'Breadth: Experiment B and D1', detail: 'Run-to-run variance (B) and provenance/attribution accuracy (D1).' },
  { when: 'Early July', title: 'Empirical research paper → arXiv (cs.DB)', detail: 'With measured A+C (and B/D1) it is a research paper, not a position paper — eligible for arXiv with no prior-acceptance requirement.' },
  { when: 'Aug 4, 2026', title: 'CIDR 2027 position-paper submission', detail: 'The 6-page vision framing, citing the arXiv empirical companion.' },
]
