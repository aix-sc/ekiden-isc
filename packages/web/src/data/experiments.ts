import type { ExperimentMeta } from '@/types/experiment'
import type { Locale } from '@/i18n'

// Public OSS repository:
export const GITHUB_URL = 'https://github.com/aix-sc/isc'

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
    id: 'Aprime',
    name: 'Experiment A′ — measured cost model on a real corpus',
    status: 'planned (real-corpus measurement of A)',
    purpose:
      'The measured counterpart of Experiment A: implement both a QSR (query-time reconstruction = RAG) and an ISC (ingest-time compilation) pipeline end-to-end on a single real corpus, then plug the measured c_c/c_m/c_q/c_r back into the model and read off a measured R*. It turns the “illustrative” constants of the interactive calculator into evidence on real data.',
    data:
      'A real corpus (a Wikipedia subset) embedded via an embedding API; both pipelines run end-to-end so the four cost constants are measured rather than assumed.',
    evaluation:
      'Cost vs. cumulative reads with the crossing point as the measured R*; per-item compile/maintenance cost and per-query reconstruct/traverse cost (c_c/c_m/c_q/c_r), plus latency.',
    outcomes:
      'A measured R* on real data validating the closed form R* = (N·c_c + W·c_m)/(c_q − c_r) — promoting the cost claim from “illustrative” to empirically demonstrated.',
  },
  {
    id: 'B',
    name: 'Experiment B — failure asymmetry & run-to-run stability',
    status: 'planned (description only)',
    purpose:
      'Test H3: ISC and QSR fail differently. QSR re-derives meaning per query, so identical questions can drift run-to-run; ISC reads from a fixed compiled substrate, so its answers should be more stable and its failures more systematic (and thus debuggable). Quantify that asymmetry.',
    data:
      'Approach: replay a fixed question set many times against both pipelines on the same corpus snapshot; hold the model/temperature fixed and vary only the seed/run. Compare against the real-corpus run from Experiment C.',
    evaluation:
      'Run-to-run variance of answers (semantic + lexical), contradiction rate across repeats, and a taxonomy of failure modes (random vs. systematic). Stability under small corpus edits.',
    outcomes:
      'A measured stability gap (e.g. ISC variance ≪ QSR variance) and a failure-mode taxonomy showing ISC errors are reproducible and localizable — the empirical basis for the “debuggable retrieval” claim in the paper.',
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
    id: 'D',
    name: 'Experiment D — non-economic benefits (provenance, attribution, governance)',
    status: 'planned (description only)',
    purpose:
      'Test H4: compiling meaning once yields benefits beyond cost. A typed, persistent substrate carries explicit provenance, makes attribution checkable, and supports governance (access control, deletion, audit) that per-query reconstruction cannot easily offer.',
    data:
      'Approach: annotate the compiled substrate with source/edit provenance; run attribution and right-to-be-forgotten / deletion-propagation tasks on the real corpus, comparing ISC against a QSR/RAG baseline.',
    evaluation:
      'D1: provenance/attribution accuracy (can each answer be traced to correct sources?). Deletion-propagation correctness and latency. Auditability of answers over time.',
    outcomes:
      'Evidence that ISC offers materially better attribution accuracy and verifiable deletion/governance than QSR — the “non-economic” column of the value case, supporting adoption arguments where compliance, not just cost, matters.',
  },
  {
    id: 'E',
    name: 'Experiment E — virtual axis update (i): corpus-driven incremental axis adaptation',
    status: 'planned (description only)',
    purpose:
      'Within a single embedding model, build an orthogonalised low-rank geometric substrate by SVD, then on each batch of new documents compare full re-SVD (the rip-and-replace baseline) against Brand-style incremental rank-one updates. The cleanest demonstration that maintenance can track the subspace at low cost.',
    data:
      'A corpus embedded via an embedding API, fed as batches of new documents (an update stream); API access plus numpy/scipy only.',
    evaluation:
      'Principal-angle drift between the incremental and full-re-SVD subspaces, retrieval quality (recall@k, nDCG), and compute cost/latency per update.',
    outcomes:
      'Evidence that incremental rank-one updates stay close to the full-re-SVD subspace while costing far less — lifting the maintenance-term result from “recognised” to “demonstrated”.',
  },
  {
    id: 'F',
    name: 'Experiment F — virtual axis update (ii): virtualising a model-generation change (Procrustes)',
    status: 'planned (description only)',
    purpose:
      'Providers’ real models cannot be updated, but two real spaces over the same corpus exist (e.g. gemini-embedding-001 vs. Gemini Embedding 2, ada-002 vs. text-embedding-3). Embed only a small anchor set in both spaces, learn an orthogonal Procrustes alignment, and map the remaining N items without re-embedding — a “virtual axis update” that avoids the rip-and-replace full re-embed a generation change normally forces.',
    data:
      'A small anchor set embedded in both embedding spaces over the same corpus; the rest of the corpus mapped via the learned alignment rather than re-embedded.',
    evaluation:
      'Quality of mapped vs. freshly embedded vectors, the anchor count k required, and the cost saved. Cross-model alignment is lossy and works best between same-provider generations; a partial success (“re-embed a few % to recover X% of quality”) is still a strong result.',
    outcomes:
      'A quantified trade-off showing how much quality a small-anchor Procrustes map recovers for how little re-embedding — evidence for absorbing a model-generation change without rip-and-replace.',
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
    id: 'Aprime',
    name: '実験A′ — 実コーパスで測定したコストモデル',
    status: '計画中（実験A の実コーパス測定）',
    purpose:
      '実験A の測定版です。QSR（問い合わせ時再構築 = RAG）と ISC（取込時コンパイル）の両パイプラインを、単一の実コーパス上でエンドツーエンドに実装し、測定した c_c/c_m/c_q/c_r をモデルに戻して測定された R* を読み取ります。インタラクティブ電卓の「説明用」定数を、実データ上の証拠へと変えます。',
    data:
      '実コーパス（Wikipedia の一部）を埋め込みAPIで埋め込み、両パイプラインをエンドツーエンドで実行して、4つのコスト定数を仮定ではなく測定します。',
    evaluation:
      '累積読み取りに対するコストと、その交点としての測定された R*。アイテム単位のコンパイル/保守コスト、クエリ単位の再構築/走査コスト（c_c/c_m/c_q/c_r）、およびレイテンシ。',
    outcomes:
      '閉形式 R* = (N·c_c + W·c_m)/(c_q − c_r) を検証する、実データ上の測定された R*。コストの主張を「説明用」から「実証済み」へ引き上げます。',
  },
  {
    id: 'B',
    name: '実験B — 失敗の非対称性と実行間の安定性',
    status: '計画中（説明のみ）',
    purpose:
      '仮説H3の検証: ISC と QSR は失敗の仕方が異なります。QSR はクエリごとに意味を再導出するため、同じ質問でも実行ごとに揺らぎ得ます。ISC は固定済みのコンパイル基盤から読み出すため、回答はより安定し、失敗もより体系的（=デバッグ可能）になるはずです。この非対称性を定量化します。',
    data:
      '方針: 固定した質問セットを、同一のコーパススナップショットに対して両パイプラインで多数回再生します。モデル/温度は固定し、シード/実行のみを変化させます。実験C の実コーパス実行と比較します。',
    evaluation:
      '回答の実行間ばらつき（意味的・字句的）、繰り返し間の矛盾率、失敗モードの分類（ランダム vs. 体系的）。小さなコーパス編集に対する安定性。',
    outcomes:
      '測定された安定性の差（例: ISC の分散 ≪ QSR の分散）と、ISC の誤りが再現可能で局在化できることを示す失敗モード分類。論文の「デバッグ可能な検索」という主張の実証的根拠になります。',
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
    id: 'D',
    name: '実験D — 非経済的な利点（来歴・帰属・ガバナンス）',
    status: '計画中（説明のみ）',
    purpose:
      '仮説H4の検証: 意味を一度コンパイルすることで、コスト以外の利点が得られます。型付きで永続的な基盤は明示的な来歴を持ち、帰属を検証可能にし、クエリごとの再構築では容易に提供できないガバナンス（アクセス制御・削除・監査）を支えます。',
    data:
      '方針: コンパイル基盤に出典/編集の来歴を付与し、実コーパス上で帰属タスクと忘れられる権利/削除伝播タスクを実行して、ISC を QSR/RAG ベースラインと比較します。',
    evaluation:
      'D1: 来歴/帰属の精度（各回答を正しい出典までたどれるか?）。削除伝播の正確さとレイテンシ。時間経過にわたる回答の監査可能性。',
    outcomes:
      'ISC が QSR よりも明確に高い帰属精度と検証可能な削除/ガバナンスを提供するという証拠。価値提案の「非経済的」な側面であり、コストだけでなくコンプライアンスが重要な場面での採用論拠を支えます。',
  },
  {
    id: 'E',
    name: '実験E — 仮想軸更新 (i): コーパス駆動の増分軸適応',
    status: '計画中（説明のみ）',
    purpose:
      '単一の埋め込みモデル内で、SVD により直交化された低ランクの幾何的基盤を構築し、新規文書のバッチごとに完全再SVD（rip-and-replace のベースライン）と Brand 型の増分ランク1更新を比較します。保守が低コストで部分空間を追従できることの最もクリーンな実証です。',
    data:
      '埋め込みAPIで埋め込んだコーパスを、新規文書のバッチ（更新ストリーム）として与えます。必要なのは API アクセスと numpy/scipy のみです。',
    evaluation:
      '増分と完全再SVD の部分空間間の主角ドリフト、検索品質（recall@k, nDCG）、更新ごとの計算コスト/レイテンシ。',
    outcomes:
      '増分ランク1更新が完全再SVD の部分空間に近いまま、はるかに低コストで済むことの証拠。保守項の結果を「認識済み」から「実証済み」へ引き上げます。',
  },
  {
    id: 'F',
    name: '実験F — 仮想軸更新 (ii): モデル世代変更の仮想化（Procrustes）',
    status: '計画中（説明のみ）',
    purpose:
      'プロバイダの実モデルは更新できませんが、同一コーパス上に2つの実空間が存在します（例: gemini-embedding-001 vs. Gemini Embedding 2、ada-002 vs. text-embedding-3）。小さなアンカー集合のみを両空間で埋め込み、直交 Procrustes 整列を学習して、残り N 件を再埋め込みせずに写像します — 世代変更が通常強いる rip-and-replace の全再埋め込みを避ける「仮想軸更新」です。',
    data:
      '同一コーパス上の2つの埋め込み空間に小さなアンカー集合を埋め込み、残りのコーパスは再埋め込みではなく学習した整列で写像します。',
    evaluation:
      '写像ベクトル vs. 新規埋め込みベクトルの品質、必要なアンカー数 k、節約できたコスト。モデル間整列は損失を伴い、同一プロバイダの世代間で最も有効です。部分的成功（「数% を再埋め込みして品質の X% を回復」）でも強い結果です。',
    outcomes:
      '小さなアンカーの Procrustes 写像が、どれだけ少ない再埋め込みでどれだけの品質を回復するかを定量化 — rip-and-replace なしでモデル世代変更を吸収できる証拠です。',
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
