import { ref, onMounted } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db, firebaseEnabled } from '@/services/firebase'
import { EXPERIMENTS } from '@/data/experiments'
import type { ExperimentMeta, ExpCSummary, CostRow } from '@/types/experiment'

const ORDER = ['A', 'C', 'NEXT']

export function useExperiments() {
  const experiments = ref<ExperimentMeta[]>(EXPERIMENTS)
  const summary = ref<ExpCSummary | null>(null)
  const costRows = ref<CostRow[]>([])
  const source = ref<'firestore' | 'local'>('local')

  async function loadMeta() {
    if (!firebaseEnabled || !db) return
    try {
      const snap = await getDocs(collection(db, 'experiments'))
      if (!snap.empty) {
        const docs = snap.docs.map((d) => d.data() as ExperimentMeta)
        docs.sort((a, b) => ORDER.indexOf(a.id) - ORDER.indexOf(b.id))
        experiments.value = docs
        source.value = 'firestore'
      }
    } catch {
      /* keep local fallback */
    }
  }

  async function loadData() {
    try {
      summary.value = (await (await fetch('/data/exp_C_summary.json')).json()) as ExpCSummary
      const csv = await (await fetch('/data/exp_C_results.csv')).text()
      costRows.value = parseCsv(csv)
    } catch {
      /* charts will render empty if data is unavailable */
    }
  }

  onMounted(() => {
    void loadMeta()
    void loadData()
  })

  return { experiments, summary, costRows, source }
}

function parseCsv(text: string): CostRow[] {
  const lines = text.trim().split('\n')
  const head = lines[0].split(',')
  const idx = (k: string) => head.indexOf(k)
  return lines.slice(1).map((line) => {
    const c = line.split(',')
    return {
      n: +c[idx('n')],
      t_full: +c[idx('t_full')],
      t_inc: +c[idx('t_inc')],
      max_angle_deg: +c[idx('max_angle_deg')],
      recall10: +c[idx('recall10')],
    }
  })
}
