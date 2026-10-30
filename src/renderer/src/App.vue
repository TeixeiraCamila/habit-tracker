<script setup lang="ts"></script>

<template>
  <nav>
    <RouterLink to="/">Hoje</RouterLink> | <RouterLink to="/week">Semana</RouterLink> |
    <RouterLink to="/month">Mês</RouterLink> | <RouterLink to="/stats">Estatísticas</RouterLink> |
    <RouterLink to="/settings">Configurações</RouterLink>
  </nav>
  <RouterView />
</template>
