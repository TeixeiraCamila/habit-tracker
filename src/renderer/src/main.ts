// Entrada do renderer: carrega os estilos globais e monta o app Vue no elemento #app.

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './router'
import './styles/tokens.css'
import './styles/base.css'

createApp(App).use(createPinia()).use(router).mount('#app')
