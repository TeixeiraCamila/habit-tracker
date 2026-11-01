<script setup lang="ts">
withDefaults(defineProps<{ label?: string }>(), { label: 'Ações' })
</script>

<template>
  <footer class="action-bar" role="toolbar" :aria-label="label">
    <div class="action-bar__group">
      <slot />
    </div>

    <div v-if="$slots.end" class="action-bar__group">
      <slot name="end" />
    </div>
  </footer>
</template>

<style scoped>
.action-bar {
  display: flex;
  gap: var(--space-4);
  align-items: center;
  justify-content: space-between;
  padding: var(--space-2) var(--space-4);
  background: var(--bg);
  border-top: 1px solid var(--surface-border);
}

.action-bar__group {
  display: flex;
  gap: var(--space-2);
  align-items: center;
}
</style>
