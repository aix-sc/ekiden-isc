import { reactive, computed } from 'vue'

export interface CostState { N: number; W: number; cc: number; cm: number; cq: number; cr: number }

export function useCostModel() {
  const state = reactive<CostState>({ N: 1_000_000, W: 10_000, cc: 5e-4, cm: 5e-4, cq: 0.05, cr: 2e-3 })

  const rStar = computed(() =>
    state.cq > state.cr ? (state.N * state.cc + state.W * state.cm) / (state.cq - state.cr) : Infinity,
  )
  const amortisedRatio = computed(() => Math.round(state.cq / state.cr))

  const curves = computed(() => {
    const rMax = Math.max(rStar.value * 2.2, 100)
    const pts = 60
    const labels: number[] = []
    const qsr: number[] = []
    const isc: number[] = []
    for (let i = 0; i <= pts; i++) {
      const R = (rMax / pts) * i
      labels.push(Math.round(R))
      qsr.push(R * state.cq)
      isc.push(state.N * state.cc + state.W * state.cm + R * state.cr)
    }
    return { labels, qsr, isc }
  })

  return { state, rStar, amortisedRatio, curves }
}
