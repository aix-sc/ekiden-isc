import type { Locale } from '@/i18n'

export interface FaqItem { q: string; a: string }

// Source: ISC strategy doc (v12) §11 “FAQ（やさしい言葉で）”. Japanese is verbatim
// from the doc; English is a faithful translation.
const FAQ_JA: FaqItem[] = [
  {
    q: '一文でいうと、この研究は何の話？',
    a: '誰かが質問するたびに資料の意味を毎回考え直すのではなく、資料が入ってきた時に一度だけその作業をして、きれいに保存しておき、あとは引くだけにしよう、という話。',
  },
  {
    q: 'ChatGPT、Claude、Gemini等のLLMに関して、この研究はどの様に貢献するの？ユーザーである自分にとっては、何が良くなるの？',
    a: 'これらのアシスタントは今、多くが QSR を使う：質問のたびに元資料を読み直し、ゼロから意味を組み立て直す。この研究は、その意味の作業を最初に一度だけ行って保存しておく（ISC）話。あなたにとっての利点は：同じ資料に何度も質問するほど答えが速く安くなる（準備を使い回すため）；『それっぽいが間違い』の答えが減る（意味を毎回当て推量せず、一度準備して確認するため）；出どころが分かる（どの資料から来た事実かを示せる）；長い対話でも脱線しにくい；直しが楽 — 事実を一度直せば直ったまま、モデルが更新されても全部やり直さなくてよい。ChatGPT・Claude・Gemini はこれを補完的なモードとして採り入れ、重く反復的な資料処理を、より安く・確実に・監査可能にできる。',
  },
  {
    q: 'QSR（クエリ時意味再構成）って何？',
    a: '今のふつうのやり方。質問のたびに大きなAIが生の資料を読み直し、意味をゼロから組み立てる。質問1つのたびに全部の本を読み直す司書のようなもの。',
  },
  {
    q: 'ISC（取込時意味コンパイル）って何？',
    a: 'その代わりのやり方。資料が来た時に意味の作業を一度だけ行い、整理した形で保存し、後の質問は準備済みの構造を見るだけにする。一度読んで良い索引を作る司書のようなもの。',
  },
  {
    q: 'コンパイラ vs インタプリタのたとえは？',
    a: 'インタプリタは料理のたびにレシピを訳し直す。コンパイラは一度訳して結果を使い回す。QSRがインタプリタ、ISCがコンパイラ。',
  },
  {
    q: '「今はQSRが標準」って、ChatGPT・Claude・Geminiで本当？',
    a: '本当。GeminiのFile Search、OpenAIのfile_search、Claudeのファイルアップロード／ウェブ検索は、いずれも質問時に文章を取ってきてモデルに答えを組み立て直させる＝QSR。',
  },
  {
    q: 'R*（損益分岐）って何？',
    a: '準備作業（ISC）の方が、毎回やり直す（QSR）より安くなる『質問回数の分かれ目』。R*より少なければQSRが安く、多ければISCが勝つ。式は『準備総コスト÷1問あたりの節約』。',
  },
  {
    q: '転置インデックス／マテリアライズドビューの前例とは？',
    a: '転置インデックスは本の巻末索引のようなもので、一度作れば語を速く探せる。マテリアライズドビューは『質問への答え』を保存し最新に保つ仕組み。どちらも一度払って読みを安くする。ISCは同じことを意味に対して行う。',
  },
  {
    q: 'grep／『第三の極』とは？',
    a: 'grepはCtrl+Fのような完全一致の語検索。クエリ時だが意味の作業はゼロ。だから方式は三つ：grep（語・クエリ時）、QSR（意味・クエリ時）、ISC（意味・事前準備）。',
  },
  {
    q: '二つの『基層形式』（幾何的 vs 記号的）とは？',
    a: '幾何的＝座標のある地図で、近い点は似た意味。記号的＝正確に指させる『事実のラベル付き棚』。ISCはどちらでも動く。',
  },
  {
    q: '『rip-and-replace』とは？再埋め込みはなぜ高い？',
    a: 'AIは文章を数列（埋め込み）に変える。AIモデルが更新されると古い数列が新しいものと噛み合わず、通常は全資料をやり直す必要がある＝高い。この全部捨ててやり直すのが『rip-and-replace』。',
  },
  {
    q: '増分SVD／Brand更新とは？',
    a: '全部を計算し直す代わりに、新しい資料だけを使って準備済みの『意味の軸』を更新する方法。パイロットでは1更新あたり約34倍安く、しかも全再計算と完全に一致した。',
  },
  {
    q: '『軸の仮想更新』／Procrustesのコツとは？',
    a: 'AIモデルが変わったとき、少数の例から旧と新の『なまりの差』を学び、残りはやり直さず変換する。パイロットでは約10%だけやり直して95%の一致を回復した。',
  },
  {
    q: '『陳腐化（staleness）』とは？なぜ許容できる？',
    a: '準備したメモは最新資料から少し遅れることがある。だが『どれだけ遅れたか』が分かり、定期的に更新できる — 上限があり確認可能な問題。対してQSRの誤りは毎回の答えで起こりうる。',
  },
  {
    q: '『非経済的』便益（来歴・遵守・保守性）とは？',
    a: 'コスト以外の利点。来歴＝事実の出どころを正確に示せる。遵守＝長い対話でもルールを守り続ける。保守性＝誤りを一度直せば直ったまま保てる。',
  },
  {
    q: '『ゴールドリフト』とは？Zahnらと競合する？',
    a: 'ゴールドリフト＝長いAI対話が与えられたルールを少しずつ忘れること。Zahnらはこれを測定し『Knowledge Objects』を提案した。私たちは競合でなく相補的：彼らのKnowledge ObjectsはISCの準備済み意味を保存する一つの形（記号的形式）。',
  },
]

const FAQ_EN: FaqItem[] = [
  {
    q: 'In one sentence, what is this paper about?',
    a: "Instead of re-deriving what documents mean every time someone asks a question, do that work once when a document arrives, store it cleanly, and afterward just look it up.",
  },
  {
    q: 'How does this research contribute to LLMs like ChatGPT, Claude, and Gemini? As a user, what gets better for me?',
    a: "These assistants mostly use QSR today: every time you ask, they re-read and re-understand the source documents from scratch. This research is about doing that understanding once, up front, and saving it (ISC). For you that can mean: faster and cheaper answers when you ask many questions about the same documents; fewer sounds-right-but-wrong answers, because the meaning was prepared and checked once instead of re-guessed each time; clearer provenance (you can see which source a fact came from); staying on-task in long chats; and easier fixes — correct a fact once and it stays fixed, and when the model is upgraded you don’t have to redo everything. ChatGPT, Claude, and Gemini could adopt this as a complementary mode to make heavy, repeated document work cheaper, more reliable, and more auditable.",
  },
  {
    q: 'What is QSR (query-time semantic reconstruction)?',
    a: "Today's usual approach. For every question, a large AI re-reads the raw documents and rebuilds the meaning from scratch — like a librarian who re-reads every book for each question.",
  },
  {
    q: 'What is ISC (ingest-time semantic compilation)?',
    a: 'The alternative. Do the meaning-work once when a document arrives, store it in an organized form, and let later questions just consult the prepared structure — like a librarian who reads once and builds a good index.',
  },
  {
    q: 'What about the compiler vs. interpreter analogy?',
    a: 'An interpreter re-translates the recipe every time you cook. A compiler translates once and reuses the result. QSR is the interpreter; ISC is the compiler.',
  },
  {
    q: 'Is "QSR is the default today" really true for ChatGPT, Claude, and Gemini?',
    a: "Yes. Gemini's File Search, OpenAI's file_search, and Claude's file upload / web search all fetch text at question time and have the model rebuild the answer — that's QSR.",
  },
  {
    q: 'What is R* (the break-even point)?',
    a: 'The number of questions at which the preparation work (ISC) becomes cheaper than redoing it each time (QSR). Below R*, QSR is cheaper; above it, ISC wins. The formula is total preparation cost ÷ savings per question.',
  },
  {
    q: 'What are the inverted-index / materialized-view precedents?',
    a: 'An inverted index is like a book\'s back-of-book index: build it once, find words fast. A materialized view stores "answers to a question" and keeps them current. Both pay once to make reads cheap. ISC does the same thing for meaning.',
  },
  {
    q: "What is grep / the 'third pole'?",
    a: 'grep is exact word search like Ctrl+F — query-time, but zero meaning-work. So there are three approaches: grep (words, query-time), QSR (meaning, query-time), and ISC (meaning, prepared in advance).',
  },
  {
    q: "What are the two 'substrate forms' (geometric vs. symbolic)?",
    a: 'Geometric = a map with coordinates, where nearby points mean similar things. Symbolic = a labeled "shelf of facts" you can point to exactly. ISC works with either.',
  },
  {
    q: "What is 'rip-and-replace'? Why is re-embedding expensive?",
    a: 'AI turns text into number sequences (embeddings). When the AI model updates, old sequences no longer match the new ones, and you normally have to redo every document — which is expensive. Throwing it all away and redoing it is "rip-and-replace."',
  },
  {
    q: 'What are incremental SVD / Brand updates?',
    a: 'Instead of recomputing everything, update the prepared "axes of meaning" using only the new documents. In the pilot this was about 34× cheaper per update — and matched the full recomputation exactly.',
  },
  {
    q: "What is the 'virtual axis update' / the Procrustes trick?",
    a: 'When the AI model changes, learn the "accent difference" between old and new from a few examples, then transform the rest instead of redoing them. In the pilot, redoing only ~10% recovered 95% of the agreement.',
  },
  {
    q: "What is 'staleness'? Why is it acceptable?",
    a: 'Prepared notes can lag slightly behind the latest documents. But you know how far behind, and can refresh periodically — a bounded, checkable problem. By contrast, QSR errors can happen on every single answer.',
  },
  {
    q: "What are the 'non-economic' benefits (provenance, compliance, maintainability)?",
    a: 'Benefits beyond cost. Provenance = you can show exactly where a fact came from. Compliance = rules are kept even across long conversations. Maintainability = fix an error once and it stays fixed.',
  },
  {
    q: "What is 'gold drift'? Does it compete with Zahn et al.?",
    a: 'Gold drift = a long AI conversation gradually forgetting the rules it was given. Zahn et al. measured this and proposed "Knowledge Objects." We are complementary, not competing: their Knowledge Objects are one way (a symbolic form) to store ISC\'s prepared meaning.',
  },
]

const FAQ_BY_LOCALE: Record<Locale, FaqItem[]> = { en: FAQ_EN, ja: FAQ_JA }

export function getFaq(locale: Locale): FaqItem[] {
  return FAQ_BY_LOCALE[locale] ?? FAQ_EN
}
