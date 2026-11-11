// Camada do renderer sobre window.api, facilitando mocks em testes.
import type { Api } from '@shared/api'

export const api: Api = window.api
