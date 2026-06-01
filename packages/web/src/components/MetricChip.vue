<script setup lang="ts">
defineProps<{ value: string; label: string; accent?: boolean }>()
</script>

<template>
  <div class="chip" :class="{ accent }">
    <b>{{ value }}</b>
    <span>{{ label }}</span>
  </div>
</template>

<style scoped lang="scss">
.chip {
  background: #fff; border: 1px solid var(--line); border-radius: 11px;
  padding: .6rem .85rem; box-shadow: 0 6px 18px rgba(22,38,59,.05); min-width: 120px;
  b { font-family: var(--mono); font-size: 1.25rem; color: var(--navy); font-weight: 700; display: block; line-height: 1.1; }
  span { font-size: .68rem; color: var(--mute); text-transform: uppercase; letter-spacing: .05em; }
  &.accent b { color: var(--teal); }
}
</style>
