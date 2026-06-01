// UI string catalog for vue-i18n. Long-form experiment prose lives in
// @/data/experiments (bilingual), not here.

export const en = {
  nav: {
    overview: 'Overview',
    cost: 'Cost model',
    maintenance: 'Maintenance',
    next: 'Next run',
    github: 'GitHub ↗',
    brandTagline: 'Ingest-time Semantic Compilation · Experiments',
  },
  lang: { label: 'Language', en: 'English', ja: '日本語' },
  hero: {
    kicker: 'Reproducible research · Wild–Takahashi · target venue CIDR 2027',
    titleHtml: 'Pay semantic labour <em>once.</em><br />Then just look it up.',
    lede:
      'An interactive companion to the ISC paper. Re-run the cost model, explore the incremental-maintenance results, inspect the data behind every number, and ask questions in plain language. Everything here is open source.',
    seeResults: 'See the results',
    sourceGithub: 'Source on GitHub',
    chips: {
      cheaperUpdate: 'cheaper / update',
      cheaperCumulative: 'cheaper cumulative',
      subspaceDrift: 'subspace drift',
      recovered: 'recovered @ ~10%',
    },
  },
  overview: {
    kicker: '01 · The idea',
    title: 'QSR re-derives meaning every query. ISC compiles it once.',
    qsrHead: 'QSR — query-time semantic reconstruction',
    qsrBodyHtml:
      "Today's default. Every question makes a frontier model re-read raw passages and rebuild the meaning from scratch. Flexible, but the bill is paid <em>on every read</em>.",
    qsrNote: 'cost ∝ read volume',
    iscHead: 'ISC — ingest-time semantic compilation',
    iscBody:
      'Do the meaning-work once at ingest into a persistent, typed, queryable substrate; maintain it incrementally; traverse it cheaply thereafter.',
    iscNote: 'cost ∝ corpus change, not reads',
    eqLabel: 'break-even read frequency',
    eqNote: 'Above R* reads, compiling pays off.',
  },
  cost: {
    kicker: '02 · Experiment A — interactive',
    title: 'Cost model & break-even R*',
    ctrls: {
      N: 'corpus size N',
      W: 'changes / period W',
      cc: 'compile cost c_c',
      cm: 'maintenance c_m',
      cq: 'reconstruct c_q',
      cr: 'traverse c_r',
    },
    units: { items: 'items', changes: 'changes', perItem: '$/item', perChange: '$/change', perQuery: '$/query' },
    breakEven: 'break-even R*',
    readout:
      "Above R* reads ISC wins. Once amortised, ISC ≈ ${cr}/query — about {ratio}× below QSR's ${cq}/query.",
    caption:
      'Drag the sliders to set your own cost constants — the curves and R* recompute live. This is the cost model from §4 of the paper, runnable in your browser.',
    series: { qsr: 'QSR = R·c_q', isc: 'ISC = N·c_c + W·c_m + R·c_r' },
    axes: { x: 'cumulative reads R', y: 'total cost ($)' },
  },
  maintenance: {
    kicker: '03 · Experiment C — completed (pilot)',
    title: 'Incremental maintenance vs. full re-SVD',
    band: {
      cheaperUpdate: 'cheaper / update (N={n})',
      cheaperCumulative: 'cheaper cumulatively',
      maxDrift: 'max principal-angle drift',
      meanRecall: 'mean recall@10 vs full',
    },
    costHead: 'Maintenance cost vs. corpus size',
    costCaption: 'Incremental stays flat as the corpus grows; full re-SVD rises with N.',
    procHead: 'Virtual axis update (Procrustes)',
    procCaption:
      'Re-embedding ~10% of the corpus recovers most of the alignment to a re-embedded space.',
    series: { full: 'Full re-SVD (O(nd²))', inc: 'Incremental (∝ change)', cosine: 'mean cosine to true' },
    axes: {
      costX: 'corpus size N',
      costY: 'ms / update',
      procX: '% of corpus re-embedded',
      procY: 'cosine to truly re-embedded',
    },
    downloads: { code: 'Experiment code', measurements: 'Per-event measurements', summary: 'Summary', figure: 'Figure' },
  },
  next: {
    kicker: '04 · The next step',
    title: 'Real-corpus run — embedding APIs + Wikipedia revision history',
  },
  meta: { purpose: 'Purpose', data: 'Data source', evaluation: 'Evaluation' },
  chat: {
    kicker: 'Ask the data',
    name: 'Chat with the results',
    greeting:
      'Hi — I can answer questions about these ISC experiments. Try: “Why is incremental maintenance cheaper as the corpus grows?”',
    placeholder: 'Ask about the results…',
    thinking: 'thinking…',
    close: 'Close chat',
    send: 'Send',
    open: 'Open AI chat',
    notConfigured:
      'Configure Firebase (.env) and deploy the geminiChat function — or run firebase emulators:start — to enable the chat.',
    notConfiguredError:
      'Chat needs Firebase configured (set .env and deploy the geminiChat function, or run emulators).',
    suggestions: [
      'What does R* mean and how is it computed?',
      'Why is incremental maintenance cheaper as the corpus grows?',
      'What is the virtual axis update?',
      'How does ISC differ from RAG?',
    ],
  },
  footer: {
    title: 'Ingest-time Semantic Compilation',
    authors: 'Kyle Wild · Yusuke Takahashi · ',
    motto: 'Try not to make it better. Try to make a difference.',
    github: 'GitHub (OSS) ↗',
    cidr: 'CIDR 2027 ↗',
    backToTop: 'Back to top ↑',
    fine:
      'Open source under the MIT license. Experiment figures are synthetic-data pilots of the harness; the real-corpus run is the next step.',
  },
}

export const ja: typeof en = {
  nav: {
    overview: '概要',
    cost: 'コストモデル',
    maintenance: '保守',
    next: '次の実験',
    github: 'GitHub ↗',
    brandTagline: 'Ingest-time Semantic Compilation · 実験',
  },
  lang: { label: '言語', en: 'English', ja: '日本語' },
  hero: {
    kicker: '再現可能な研究 · Wild–Takahashi · 投稿先 CIDR 2027',
    titleHtml: '意味の労働は<em>一度だけ。</em><br />あとは引くだけ。',
    lede:
      'ISC 論文のインタラクティブな副読本です。コストモデルを再実行し、増分保守の結果を探り、すべての数値の裏にあるデータを確認し、平易な言葉で質問できます。すべてオープンソースです。',
    seeResults: '結果を見る',
    sourceGithub: 'GitHub のソース',
    chips: {
      cheaperUpdate: '更新あたりの低コスト化',
      cheaperCumulative: '累積での低コスト化',
      subspaceDrift: '部分空間のドリフト',
      recovered: '約10%で回復',
    },
  },
  overview: {
    kicker: '01 · 着想',
    title: 'QSR は問い合わせのたびに意味を再導出する。ISC は一度だけコンパイルする。',
    qsrHead: 'QSR — 問い合わせ時の意味再構築',
    qsrBodyHtml:
      '今日の標準。質問のたびにフロンティアモデルが生の文章を読み直し、意味をゼロから組み立てます。柔軟ですが、その代償は<em>読み取りのたびに</em>支払われます。',
    qsrNote: 'コスト ∝ 読み取り量',
    iscHead: 'ISC — 取り込み時の意味コンパイル',
    iscBody:
      '意味づけの作業を取り込み時に一度だけ行い、永続的で型付き・問い合わせ可能な基盤に格納する。以降は増分的に保守し、安価に走査する。',
    iscNote: 'コスト ∝ コーパスの変化（読み取りではない）',
    eqLabel: '損益分岐の読み取り頻度',
    eqNote: 'R* を超える読み取りでは、コンパイルが得になる。',
  },
  cost: {
    kicker: '02 · 実験A — インタラクティブ',
    title: 'コストモデルと損益分岐 R*',
    ctrls: {
      N: 'コーパス規模 N',
      W: '期間あたりの変更数 W',
      cc: 'コンパイルコスト c_c',
      cm: '保守コスト c_m',
      cq: '再構築 c_q',
      cr: '走査 c_r',
    },
    units: { items: '件', changes: '変更', perItem: '$/件', perChange: '$/変更', perQuery: '$/クエリ' },
    breakEven: '損益分岐 R*',
    readout:
      'R* を超える読み取りでは ISC が勝ります。償却後、ISC は約 ${cr}/クエリ — QSR の ${cq}/クエリ の約 {ratio} 分の1です。',
    caption:
      'スライダーを動かして自分のコスト定数を設定すると、曲線と R* がその場で再計算されます。これは論文§4のコストモデルで、ブラウザ上で実行できます。',
    series: { qsr: 'QSR = R·c_q', isc: 'ISC = N·c_c + W·c_m + R·c_r' },
    axes: { x: '累積読み取り R', y: '総コスト ($)' },
  },
  maintenance: {
    kicker: '03 · 実験C — 完了（パイロット）',
    title: '増分保守 vs. 完全な再SVD',
    band: {
      cheaperUpdate: '更新あたりの低コスト化 (N={n})',
      cheaperCumulative: '累積での低コスト化',
      maxDrift: '最大主角ドリフト',
      meanRecall: '平均 recall@10（完全版比）',
    },
    costHead: '保守コスト vs. コーパス規模',
    costCaption: '増分はコーパスが成長しても横ばい。完全な再SVDは N とともに増加する。',
    procHead: '仮想軸更新（Procrustes）',
    procCaption:
      'コーパスの約10%を再埋め込みすると、再埋め込み空間への整合の大部分が回復する。',
    series: { full: '完全な再SVD (O(nd²))', inc: '増分 (∝ 変化)', cosine: '真値との平均コサイン' },
    axes: {
      costX: 'コーパス規模 N',
      costY: 'ms / 更新',
      procX: '再埋め込みしたコーパスの割合 (%)',
      procY: '真に再埋め込みした値とのコサイン',
    },
    downloads: { code: '実験コード', measurements: 'イベント別の測定値', summary: 'サマリ', figure: '図' },
  },
  next: {
    kicker: '04 · 次のステップ',
    title: '実コーパス実行 — 埋め込みAPI + Wikipedia の改訂履歴',
  },
  meta: { purpose: '目的', data: 'データソース', evaluation: '評価' },
  chat: {
    kicker: 'データに尋ねる',
    name: '結果についてチャット',
    greeting:
      'こんにちは — これらの ISC 実験について質問にお答えします。例:「コーパスが成長すると、なぜ増分保守の方が安いのですか?」',
    placeholder: '結果について質問する…',
    thinking: '考え中…',
    close: 'チャットを閉じる',
    send: '送信',
    open: 'AIチャットを開く',
    notConfigured:
      'Firebase（.env）を設定し geminiChat 関数をデプロイ — または firebase emulators:start を実行 — するとチャットが有効になります。',
    notConfiguredError:
      'チャットには Firebase の設定が必要です（.env を設定し geminiChat 関数をデプロイ、またはエミュレータを実行）。',
    suggestions: [
      'R* とは何で、どう計算されますか?',
      'コーパスが成長すると、なぜ増分保守の方が安いのですか?',
      '仮想軸更新とは何ですか?',
      'ISC は RAG とどう違いますか?',
    ],
  },
  footer: {
    title: 'Ingest-time Semantic Compilation',
    authors: 'Kyle Wild · Yusuke Takahashi · ',
    motto: 'より良くしようとするな。違いを生み出せ。',
    github: 'GitHub (OSS) ↗',
    cidr: 'CIDR 2027 ↗',
    backToTop: 'トップへ戻る ↑',
    fine:
      'MIT ライセンスのオープンソース。実験の図はハーネスの合成データによるパイロットであり、実コーパス実行が次のステップです。',
  },
}

export type MessageSchema = typeof en
