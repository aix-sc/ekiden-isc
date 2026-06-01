import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MetricChip from '@/components/MetricChip.vue'

describe('MetricChip', () => {
  it('renders value and label and applies the accent modifier', () => {
    const w = mount(MetricChip, { props: { value: '33.7×', label: 'cheaper / update', accent: true } })
    expect(w.text()).toContain('33.7×')
    expect(w.text()).toContain('cheaper / update')
    expect(w.classes()).toContain('accent')
  })
})
