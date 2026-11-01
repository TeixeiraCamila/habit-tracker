<script setup lang="ts">
withDefaults(
  defineProps<{
    level?: number
    color?: string
  }>(),
  {
    level: 1,
    color: 'var(--surface-border)'
  }
)
</script>

<template>
  <div
    class="tree-guide"
    :style="{ '--guide-color': color, '--guide-indent': `calc(${level} * 24px)` }"
  >
    <span class="tree-guide__line" aria-hidden="true" />
    <div class="tree-guide__content"><slot /></div>
  </div>
</template>

<style scoped>
.tree-guide {
  display: flex;
  gap: var(--space-2);
  padding-left: var(--guide-indent);
}

.tree-guide__line {
  flex: 0 0 1px;
  width: 1px;
  background: var(--guide-color);
  border-radius: var(--radius-pill);
}

.tree-guide__content {
  flex: 1;
  min-width: 0;
}
</style>
