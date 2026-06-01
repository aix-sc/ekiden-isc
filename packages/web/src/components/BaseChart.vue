<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { Chart, registerables, type ChartConfiguration } from 'chart.js'

Chart.register(...registerables)

const props = defineProps<{ config: ChartConfiguration; height?: number }>()
const canvas = ref<HTMLCanvasElement | null>(null)
let chart: Chart | null = null

onMounted(() => {
  if (canvas.value) chart = new Chart(canvas.value, props.config)
})
watch(
  () => props.config,
  (c) => {
    if (!chart) return
    chart.data = c.data
    if (c.options) chart.options = c.options
    chart.update('none')
  },
  { deep: true },
)
onBeforeUnmount(() => chart?.destroy())
</script>

<template>
  <div class="chart-holder" :style="{ height: (height ?? 300) + 'px' }">
    <canvas ref="canvas" />
  </div>
</template>

<style scoped lang="scss">
.chart-holder { position: relative; width: 100%; }
</style>
