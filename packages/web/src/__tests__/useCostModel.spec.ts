import { describe, it, expect } from 'vitest'
import { useCostModel } from '@/composables/useCostModel'

describe('useCostModel', () => {
  it('computes the documented break-even R* for the illustrative constants', () => {
    const { state, rStar } = useCostModel()
    state.N = 1_000_000; state.W = 10_000
    state.cc = 5e-4; state.cm = 5e-4; state.cq = 0.05; state.cr = 2e-3
    // R* = (1e6*5e-4 + 1e4*5e-4) / (0.05 - 0.002) = (500 + 5)/0.048
    expect(Math.round(rStar.value)).toBe(10521)
  })

  it('produces monotonically increasing cost curves of equal length', () => {
    const { curves } = useCostModel()
    const { labels, qsr, isc } = curves.value
    expect(labels.length).toBe(qsr.length)
    expect(qsr.length).toBe(isc.length)
    expect(qsr.at(-1)!).toBeGreaterThan(qsr[0])
    expect(isc.at(-1)!).toBeGreaterThan(isc[0])
  })
})
