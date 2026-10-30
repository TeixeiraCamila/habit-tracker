// Entrada do renderer: carrega os estilos globais e monta o app Vue no elemento #app.
import './styles/tokens.css'
import './styles/base.css'

import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
