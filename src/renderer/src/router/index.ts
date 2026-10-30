import { createRouter, createWebHashHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'today', component: () => import('@renderer/views/TodayView.vue') },
    { path: '/week', name: 'week', component: () => import('@renderer/views/WeekView.vue') },
    { path: '/month', name: 'month', component: () => import('@renderer/views/MonthView.vue') },
    { path: '/stats', name: 'stats', component: () => import('@renderer/views/StatsView.vue') },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@renderer/views/SettingsView.vue')
    },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ]
})
