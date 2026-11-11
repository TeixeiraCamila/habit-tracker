// Mensagem amigável para erros lançados no renderer.
export const errorMessage = (e: unknown): string =>
  e instanceof Error ? e.message : 'Algo deu errado. Tente de novo.'
