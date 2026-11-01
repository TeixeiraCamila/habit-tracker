<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <div class="empty-state">
    <div v-if="$slots.icon" class="empty-state__icon" aria-hidden="true">
      <slot name="icon" />
    </div>

    <p class="empty-state__title">{{ title }}</p>
    <p v-if="description" class="empty-state__description">{{ description }}</p>

    <div v-if="$slots.actions" class="empty-state__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  align-items: center;
  justify-content: center;
  padding: var(--space-6);
  color: var(--text-muted);
  text-align: center;
}

.empty-state__icon {
  color: var(--text-muted);
}

.empty-state__title {
  font-size: var(--text-base);
  font-weight: 700;
  color: var(--text-title);
}

.empty-state__description {
  max-width: 32ch;
  font-size: var(--text-sm);
}

.empty-state__actions {
  display: flex;
  gap: var(--space-2);
  margin-top: var(--space-2);
}
</style>
