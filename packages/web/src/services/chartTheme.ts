import type { ChartOptions } from 'chart.js'

export const C = { navy: '#1F3A5F', teal: '#117C6F', red: '#C0392B', mute: '#6B7280', line: '#E7E3DA' }

export function baseOptions(xTitle: string, yTitle: string): ChartOptions<'line'> {
  const mono = { family: 'JetBrains Mono', size: 10 }
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { font: { family: 'JetBrains Mono', size: 11 }, color: C.navy, boxWidth: 12 } } },
    scales: {
      x: { title: { display: true, text: xTitle, color: C.mute, font: mono }, grid: { color: C.line }, ticks: { color: C.mute, maxTicksLimit: 7, font: mono } },
      y: { title: { display: true, text: yTitle, color: C.mute, font: mono }, grid: { color: C.line }, ticks: { color: C.mute, font: mono } },
    },
  }
}
