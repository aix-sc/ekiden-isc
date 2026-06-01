import { describe, it, expect } from 'vitest'
import { buildContext } from '@/services/gemini'
import { EXPERIMENTS } from '@/data/experiments'

describe('buildContext', () => {
  it('includes the ISC/QSR definitions and every experiment', () => {
    const ctx = buildContext(EXPERIMENTS, null)
    expect(ctx).toContain('Ingest-time Semantic Compilation')
    expect(ctx).toContain('R* = (N·c_c + W·c_m)/(c_q − c_r)')
    for (const e of EXPERIMENTS) expect(ctx).toContain(e.name)
  })
})
