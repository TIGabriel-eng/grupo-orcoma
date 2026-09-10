/**
 * Endereço base da API consumida pelo frontend.
 *
 * Em desenvolvimento, o Vite (vite.config.ts) faz proxy de `/api` e `/media`
 * para o backend em http://localhost:8000 — por isso aqui `API_BASE` fica
 * vazio e usamos caminhos relativos normalmente.
 *
 * Em produção, o frontend (Vercel) depende dos rewrites do `vercel.json`
 * para encaminhar `/api/*` e `/media/*` para o backend no Render. Se esse
 * rewrite não estiver ativo (configuração do projeto, deploy sem o arquivo,
 * etc.), basta definir a env var `VITE_API_BASE` no build — por exemplo
 * `https://dashboard-orcoma.onrender.com` — que todas as chamadas passam a
 * apontar direto para o backend, sem depender do proxy.
 */
const API_BASE: string =
  (import.meta.env.VITE_API_BASE as string | undefined)?.trim().replace(/\/+$/, '') || '';

/**
 * Converte um caminho de API (ex.: /api/posts/) na URL completa
 * quando VITE_API_BASE estiver definida; caso contrário devolve o caminho.
 */
export function apiUrl(path: string): string {
  return API_BASE ? `${API_BASE}${path}` : path;
}