export interface IndiceItem {
  id: string;
  texto: string;
}

export interface ConteudoParseado {
  indice: IndiceItem[];
  html: string;
}

const MAX_TITULO_LEN = 90;

export function slugify(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s-]+/g, '-');
}

function escapeHtml(texto: string): string {
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function conteudoEhHtml(conteudo: string): boolean {
  return /<[a-z][a-z0-9-]*(?:\s[^>]*>|\/>|>)/i.test(conteudo);
}

/**
 * Conteúdo já veio do editor WYSIWYG (HTML): adiciona id de âncora nos
 * títulos (h1-h3) e extrai o índice do artigo a partir deles.
 */
export function prepararHtml(html: string): ConteudoParseado {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const titulos = Array.from(doc.querySelectorAll('h1, h2, h3'));

  const idsUsados = new Map<string, number>();
  const indice: IndiceItem[] = [];

  titulos.forEach((h: Element) => {
    const texto = (h.textContent || '').trim();
    if (!texto) return;
    const base = slugify(texto) || 'secao';
    const contagem = (idsUsados.get(base) ?? 0) + 1;
    idsUsados.set(base, contagem);
    const id = contagem > 1 ? `${base}-${contagem}` : base;
    h.id = id;
    indice.push({ id, texto });
  });

  return { indice, html: doc.body.innerHTML };
}

/**
 * Prepara o conteúdo do post para exibição: se for HTML (gerado pelo editor
 * WYSIWYG) trata os títulos e gera o índice; se for texto puro (posts antigos),
 * usa a detecção heurística de títulos.
 */
export function prepararConteudo(conteudo: string): ConteudoParseado {
  if (conteudoEhHtml(conteudo)) return prepararHtml(conteudo);
  return parseConteudo(conteudo);
}

/**
 * Converte o texto puro do post (parágrafos separados por linhas em branco)
 * em HTML, identificando linhas curtas que funcionam como títulos de seção
 * (h2 com id de âncora) e gerando o índice do artigo a partir delas.
 */
export function parseConteudo(conteudo: string): ConteudoParseado {
  const normalizado = conteudo.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const linhas = normalizado.split('\n');
  const limpas = linhas.map((l) => l.trim());

  const idsUsados = new Map<string, number>();

  function gerarId(texto: string): string {
    const base = slugify(texto) || 'secao';
    const contagem = (idsUsados.get(base) ?? 0) + 1;
    idsUsados.set(base, contagem);
    return contagem > 1 ? `${base}-${contagem}` : base;
  }

  function proximaLinha(i: number): string {
    for (let j = i + 1; j < limpas.length; j++) {
      if (limpas[j]) return limpas[j];
    }
    return '';
  }

  function pareceCorpo(linha: string): boolean {
    if (!linha || /\t/.test(linha)) return false;
    if (/^[*\-•–]/.test(linha)) return false;
    return linha.length > 40 || /^(\d+[.)]\s)/.test(linha);
  }

  function ehTitulo(i: number): boolean {
    const t = limpas[i];
    if (!t || t.length < 2 || t.length > MAX_TITULO_LEN) return false;
    if (/^[*\-•–\t]/.test(t) || /\t/.test(t)) return false;
    if (/[:.]$/.test(t)) return false;
    if (!/[A-Z0-9À-ÚÂÃÊÔÕÇ]/.test(t[0])) return false;

    const numerado = /^\d+[.)]\s/.test(t);
    const linhaAnteriorEmBranco = i === 0 || limpas[i - 1] === '';
    const corpoDepois = pareceCorpo(proximaLinha(i));

    return numerado || linhaAnteriorEmBranco || corpoDepois;
  }

  const indice: IndiceItem[] = [];
  let html = '';

  let i = 0;
  while (i < limpas.length) {
    const linha = limpas[i];
    if (!linha) {
      i++;
      continue;
    }

    if (ehTitulo(i)) {
      const id = gerarId(linha);
      indice.push({ id, texto: linha });
      html += `<h2 id="${id}">${escapeHtml(linha)}</h2>`;
      i++;
      continue;
    }

    const paragrafos: string[] = [];
    while (i < limpas.length && limpas[i] && !ehTitulo(i)) {
      paragrafos.push(escapeHtml(limpas[i]));
      i++;
    }
    html += `<p>${paragrafos.join('<br/>')}</p>`;
  }

  return { indice, html };
}