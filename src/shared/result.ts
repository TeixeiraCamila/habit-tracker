// Resultado padronizado de uma chamada IPC: sucesso com dados ou falha com mensagem.
export type IpcResult<T> = { ok: true; data: T } | { ok: false; message: string }
