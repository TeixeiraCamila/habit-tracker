<script setup lang="ts">
import { computed } from 'vue'
import type { GroupColor } from '@shared/types'

const props = defineProps<{ color: GroupColor }>()

const style = computed(() => ({ '--guide-color': `var(--group-${props.color})` }))
</script>

<template>
  <div class="tree-guide" :style="style">
    <span class="tree-guide__line" aria-hidden="true" />
    <div class="tree-guide__content"><slot /></div>
  </div>
</template>

<style scoped>
.tree-guide {
  display: flex;
  align-items: stretch;
  gap: var(--space-2);
  padding-left: var(--space-4);
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
