<script setup lang="ts"></script>

<template>
  <section class="test-page">
    <h1 class="test-page__title">Design system</h1>
    <p class="test-page__note">Nenhum componente exibido nesta página.</p>
  </section>
</template>

<style scoped>
.test-page {
  height: 100%;
  padding: var(--space-6);
  overflow-y: auto;
}

.test-page__title {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--text-title);
}

.test-page__note {
  margin-top: var(--space-2);
  font-size: var(--text-sm);
  color: var(--text-muted);
}
</style>
