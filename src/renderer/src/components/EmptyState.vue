<script setup lang="ts">
import AppIcon from './AppIcon.vue'

defineProps<{
  icon: string
  title: string
  description?: string
  actionLabel?: string
}>()

const emit = defineEmits<{ action: [] }>()
</script>

<template>
  <div class="empty-state">
    <span class="empty-state__icon" aria-hidden="true"><AppIcon :name="icon" :size="28" /></span>

    <p class="empty-state__title">{{ title }}</p>
    <p v-if="description" class="empty-state__description">{{ description }}</p>

    <button v-if="actionLabel" class="empty-state__action" type="button" @click="emit('action')">
      {{ actionLabel }}
    </button>
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

.empty-state__action {
  min-height: 36px;
  margin-top: var(--space-2);
  padding: 0 var(--space-4);
  font-size: var(--text-sm);
  color: var(--text-title);
  background: var(--surface);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  transition: border-color var(--motion-fast) var(--ease-out);
}

.empty-state__action:hover {
  border-color: var(--text-muted);
}
</style>
