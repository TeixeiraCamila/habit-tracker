<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    collapsible?: boolean
    expanded?: boolean
  }>(),
  { collapsible: false }
)

defineEmits<{ toggle: [] }>()
</script>

<template>
  <header class="app-header">
    <div class="app-header__heading">
      <button
        v-if="collapsible"
        class="app-header__title app-header__title--button"
        type="button"
        :aria-expanded="expanded"
        @click="$emit('toggle')"
      >
        {{ title }}
        <span class="app-header__chevron" aria-hidden="true">⌄</span>
      </button>
      <h1 v-else class="app-header__title">{{ title }}</h1>

      <p v-if="subtitle" class="app-header__subtitle">{{ subtitle }}</p>
    </div>

    <div v-if="$slots.actions" class="app-header__actions">
      <slot name="actions" />
    </div>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-6) var(--space-6) var(--space-4);
}

.app-header__heading {
  min-width: 0;
}

.app-header__title {
  font-size: var(--text-xl);
  font-weight: 700;
  line-height: 1.2;
  color: var(--text-title);
}

.app-header__title--button {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 0;
  border-radius: var(--radius-md);
}

.app-header__title--button:hover .app-header__chevron {
  color: var(--text-title);
}

.app-header__chevron {
  font-size: var(--text-lg);
  color: var(--text-muted);
  transition: color var(--motion-fast) var(--ease-out);
}

.app-header__subtitle {
  margin-top: var(--space-1);
  font-size: var(--text-sm);
  color: var(--text-muted);
}

.app-header__actions {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: var(--space-2);
}
</style>
