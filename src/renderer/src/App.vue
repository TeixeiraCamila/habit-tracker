<script setup lang="ts">
const isDev = import.meta.env.DEV
</script>

<template>
  <div class="app-shell">
    <nav class="app-nav" aria-label="Navegação principal">
      <RouterLink to="/">Hoje</RouterLink>
      <RouterLink to="/week">Semana</RouterLink>
      <RouterLink to="/month">Mês</RouterLink>
      <RouterLink to="/stats">Estatísticas</RouterLink>
      <RouterLink to="/settings">Configurações</RouterLink>
      <RouterLink v-if="isDev" to="/test" class="app-nav__test">Design system</RouterLink>
    </nav>

    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.app-nav {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  align-items: center;
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-sm);
  background: var(--surface);
  border-bottom: 1px solid var(--surface-border);
}

.app-nav a {
  color: var(--text-muted);
  transition: color var(--motion-fast) var(--ease-out);
}

.app-nav a:hover,
.app-nav a.router-link-exact-active {
  color: var(--text-title);
}

.app-nav a.router-link-exact-active {
  font-weight: 700;
}

.app-nav__test {
  margin-left: auto;
  font-size: var(--text-xs);
}

.app-main {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
</style>
