// Entrada do renderer: carrega os estilos globais e monta o app Vue no elemento #app.
import './styles/tokens.css'
import './styles/base.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Aguarda o router resolver a rota inicial antes de montar.
router.isReady().then(() => app.mount('#app'))
