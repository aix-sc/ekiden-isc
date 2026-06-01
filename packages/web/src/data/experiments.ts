import type { ExperimentMeta } from '@/types/experiment'
import type { Locale } from '@/i18n'

// Public OSS repository:
export const GITHUB_URL = 'https://github.com/aix-sc/ekiden-isc'

// Local source of truth — also used as a fallback when Firestore is empty/offline.
const EXPERIMENTS_EN: ExperimentMeta[] = [
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

const EXPERIMENTS_JA: ExperimentMeta[] = [
  {
    id: 'A',
    name: '実験A — コストモデルと損益分岐 R*',
    status: 'インタラクティブなハーネス（説明用の定数。測定済みの c 値にも対応）',
    purpose:
      'ISC のコストモデルを具体化し、その「説明用」の定数を実際に触って試せるようにします。R* = (N·c_c + W·c_m)/(c_q − c_r) を検証します。これは、一度コンパイルする（ISC）方が、問い合わせのたびに意味を再導出する（QSR）よりも有利になる読み取り回数です。',
    data:
      '外部データなし — パラメトリックなモデルです。電卓は任意の定数について、累積読み取り R にわたる QSR と ISC の総コストを計算します。測定研究では、実際の QSR/ISC パイプラインをコーパスで走らせて得た本物の c_c/c_m/c_q/c_r を入力します。',
    evaluation:
      '2本のコスト曲線の交点を R* として読み取り、読み取りが増えるにつれての ISC の償却後クエリ単価を確認します（走査コスト c_r に近づく一方、QSR は c_q で一定のままです）。',
  },
  {
    id: 'C',
    name: '実験C — 増分保守 vs. 完全な再SVD（+ 仮想軸更新）',
    status: '完了（合成データによるパイロット）',
    purpose:
      '仮説H2の検証: イベント駆動の増分更新は、低コストで完全再SVDの部分空間を追従し、その保守コストはコーパス規模 N ではなく「変化量」に比例します。第2部では「仮想軸更新」を検証します。モデル世代の変更を、すべてを再埋め込みせずに吸収できるか?',
    data:
      '合成パイロットデータ: 低ランクで時間発展するコーパス、D=256、基盤ランク k=32、50回の更新イベントで 3,000 から 9,000 文書へ成長。表示される数値はすべて実測値です。次のステップは実コーパス実行（埋め込みAPI + Wikipedia の改訂履歴）です。',
    evaluation:
      '更新ごとの実時間（完全再SVD O(nd²) vs. 増分）。最大主角による部分空間の一致度。完全再計算の近傍に対する recall@10 による検索品質。仮想軸更新については、小さなアンカー集合からの直交 Procrustes 写像を、真に再埋め込みしたベクトルとの平均コサインを再埋め込み割合に対して評価します。',
  },
  {
    id: 'NEXT',
    name: '次 — 実コーパス実行',
    status: '計画中（次のステップ）',
    purpose:
      '合成データと説明用の定数を、実際に時間発展するコーパスでの測定に置き換えます — 測定された R* と保守コスト曲線です。これにより予備評価が実証研究となり（拡張版は事前採択なしで arXiv に投稿可能になります）。',
    data:
      'Wikipedia テキスト + 改訂履歴（実際のタイムスタンプ付き挿入/編集/削除ストリーム）。埋め込みは OpenAI text-embedding-3、Google gemini-embedding、Voyage 4。QA は MuSiQue / 2WikiMultiHopQA / HotpotQA、NaturalQuestions / PopQA。',
    evaluation:
      'c_c, c_m, c_q, c_r を測定し、測定された R* を読み取ります。recall@k / nDCG@k、EM/F1、実行間のばらつき、主角ドリフト/陳腐化。実験B（失敗の非対称性）とD（非経済的な利点）が研究を拡張します。',
  },
]

const EXPERIMENTS_BY_LOCALE: Record<Locale, ExperimentMeta[]> = {
  en: EXPERIMENTS_EN,
  ja: EXPERIMENTS_JA,
}

export function getExperiments(locale: Locale): ExperimentMeta[] {
  return EXPERIMENTS_BY_LOCALE[locale] ?? EXPERIMENTS_EN
}

// Back-compat default export (English) for any non-localized consumer.
export const EXPERIMENTS = EXPERIMENTS_EN

interface RoadmapItem { when: string; title: string; detail: string }

const ROADMAP_EN: RoadmapItem[] = [
  { when: 'Weeks 1–2', title: 'Real-corpus Experiment C + Experiment A c-values', detail: 'Embed a Wikipedia subset via an embedding API; run incremental vs full re-SVD on real embeddings against the revision stream; measure c_c/c_m/c_q/c_r.' },
  { when: 'Weeks 3–4', title: 'Breadth: Experiment B and D1', detail: 'Run-to-run variance (B) and provenance/attribution accuracy (D1).' },
  { when: 'Early July', title: 'Empirical research paper → arXiv (cs.DB)', detail: 'With measured A+C (and B/D1) it is a research paper, not a position paper — eligible for arXiv with no prior-acceptance requirement.' },
  { when: 'Aug 4, 2026', title: 'CIDR 2027 position-paper submission', detail: 'The 6-page vision framing, citing the arXiv empirical companion.' },
]

const ROADMAP_JA: RoadmapItem[] = [
  { when: '第1〜2週', title: '実コーパスでの実験C + 実験A の c 値', detail: '埋め込みAPIで Wikipedia の一部を埋め込み、実際の埋め込みに対して改訂ストリームで増分 vs 完全再SVD を実行し、c_c/c_m/c_q/c_r を測定する。' },
  { when: '第3〜4週', title: '広がり: 実験B と D1', detail: '実行間のばらつき（B）と来歴/帰属の精度（D1）。' },
  { when: '7月上旬', title: '実証研究論文 → arXiv (cs.DB)', detail: '測定済みの A+C（および B/D1）があれば、ポジションペーパーではなく研究論文となり、事前採択を要さず arXiv に投稿可能。' },
  { when: '2026年8月4日', title: 'CIDR 2027 ポジションペーパー投稿', detail: 'arXiv の実証版を引用した、6ページのビジョン提示。' },
]

const ROADMAP_BY_LOCALE: Record<Locale, RoadmapItem[]> = {
  en: ROADMAP_EN,
  ja: ROADMAP_JA,
}

export function getRoadmap(locale: Locale): RoadmapItem[] {
  return ROADMAP_BY_LOCALE[locale] ?? ROADMAP_EN
}

// Back-compat default export (English).
export const ROADMAP = ROADMAP_EN
