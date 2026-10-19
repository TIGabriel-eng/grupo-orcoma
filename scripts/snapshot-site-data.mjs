// Gera o snapshot estático dos dados públicos (public/data) a partir da API.
//
// Rodado antes do `vite build`. Assim o site já sobe com o conteúdo pronto,
// mesmo quando o backend (Render) está dormindo. Se a API não responder,
// o script avisa e mantém os arquivos que já existem, sem quebrar o build.
//
// Uso manual: node scripts/snapshot-site-data.mjs

import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'public', 'data');
const MEDIA_DIR = path.join(OUT_DIR, 'media');

const API_BASE = (process.env.VITE_API_BASE || 'https://dashboard-orcoma.onrender.com').replace(/\/+$/, '');
const ATTEMPTS = 3;
const TIMEOUT_MS = 90_000; // Render gratuito pode levar ~1 min para acordar

const log = (msg) => console.log(`[snapshot] ${msg}`);
const warn = (msg) => console.warn(`[snapshot] AVISO: ${msg}`);

async function fetchWithRetry(url, { binary = false } = {}) {
  let lastError;
  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
      if (!res.ok) {
        const err = new Error(`HTTP ${res.status}`);
        err.clientError = res.status >= 400 && res.status < 500;
        throw err;
      }
      return binary ? Buffer.from(await res.arrayBuffer()) : await res.json();
    } catch (err) {
      lastError = err;
      // 4xx não melhora com nova tentativa (ex.: mídia que não existe mais no backend)
      if (err.clientError) break;
      if (attempt < ATTEMPTS) await new Promise((r) => setTimeout(r, 5_000 * attempt));
    }
  }
  throw lastError;
}

// Baixa cada mídia do backend e troca a URL pelo caminho local (/data/media/...).
// Assim as imagens também não dependem do backend estar acordado.
const mediaCache = new Map();

async function localizaMidia(url) {
  if (mediaCache.has(url)) return mediaCache.get(url);
  const ext = path.extname(new URL(url).pathname) || '.bin';
  const name = `${createHash('sha1').update(url).digest('hex').slice(0, 16)}${ext}`;
  const local = `/data/media/${name}`;
  mediaCache.set(url, local);
  try {
    const bytes = await fetchWithRetry(url, { binary: true });
    await writeFile(path.join(MEDIA_DIR, name), bytes);
  } catch (err) {
    // Fallback: cópia local em backend/media, quando o backend em produção não tem o arquivo
    const relative = new URL(url).pathname.replace(/^\/media\//, '');
    const localFile = path.join(ROOT, '..', 'backend', 'media', relative);
    if (existsSync(localFile)) {
      await copyFile(localFile, path.join(MEDIA_DIR, name));
      warn(`mídia ausente no backend, usando cópia local: ${relative}`);
      return local;
    }
    warn(`mídia não encontrada (${url}): ${err.message}`);
    mediaCache.set(url, url); // mantém a URL original como último recurso
    return url;
  }
  return local;
}

const MEDIA_RE = new RegExp(`(?:${API_BASE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})?/media/[^\\s"'<>)]+`, 'g');

async function localizaMidiasEm(value) {
  if (typeof value === 'string') {
    const matches = [...new Set(value.match(MEDIA_RE) || [])];
    let out = value;
    for (const m of matches) {
      const absolute = m.startsWith('/') ? `${API_BASE}${m}` : m;
      const local = await localizaMidia(absolute);
      out = out.split(m).join(local);
    }
    return out;
  }
  if (Array.isArray(value)) return Promise.all(value.map(localizaMidiasEm));
  if (value && typeof value === 'object') {
    const entries = await Promise.all(Object.entries(value).map(async ([k, v]) => [k, await localizaMidiasEm(v)]));
    return Object.fromEntries(entries);
  }
  return value;
}

async function salva(relPath, data) {
  const target = path.join(OUT_DIR, relPath);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, JSON.stringify(await localizaMidiasEm(data), null, 2), 'utf8');
  log(`ok ${relPath}`);
}

async function main() {
  await mkdir(MEDIA_DIR, { recursive: true });
  log(`origem da API: ${API_BASE}`);

  const listas = [
    ['posts', '/api/posts/'],
    ['eventos', '/api/eventos/'],
    ['ebooks', '/api/ebooks/'],
    ['especialidades', '/api/especialidades/'],
    ['carrossel', '/api/carrossel/'],
    ['sobre-nos-fotos', '/api/sobre-nos-fotos/'],
  ];

  let falhas = 0;
  const dados = {};
  for (const [nome, endpoint] of listas) {
    try {
      dados[nome] = await fetchWithRetry(`${API_BASE}${endpoint}`);
      await salva(`${nome}.json`, dados[nome]);
    } catch (err) {
      falhas++;
      warn(`${endpoint} falhou (${err.message}); mantendo o snapshot anterior, se existir`);
    }
  }

  // Detalhes de cada post e especialidade. `snapshot=1` evita contar visualização no backend.
  for (const post of dados.posts?.posts ?? []) {
    try {
      await salva(`posts/${post.slug}.json`, await fetchWithRetry(`${API_BASE}/api/posts/${post.slug}/?snapshot=1`));
    } catch (err) {
      falhas++;
      warn(`post ${post.slug} falhou (${err.message})`);
    }
  }
  for (const esp of dados.especialidades?.especialidades ?? []) {
    try {
      await salva(`especialidades/${esp.slug}.json`, await fetchWithRetry(`${API_BASE}/api/especialidades/${esp.slug}/`));
    } catch (err) {
      falhas++;
      warn(`especialidade ${esp.slug} falhou (${err.message})`);
    }
  }

  if (falhas > 0) {
    warn(`${falhas} requisição(ões) falharam. O build continua com os arquivos existentes.`);
  }
  if (!existsSync(path.join(OUT_DIR, 'carrossel.json'))) {
    warn('nenhum snapshot disponível; o site dependerá da API em tempo de execução.');
  }
}

main().catch((err) => {
  // Nunca derruba o build: sem snapshot o site continua funcionando via API
  warn(`erro inesperado: ${err.stack || err}`);
  process.exitCode = 0;
});
