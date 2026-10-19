import { apiUrl } from './api';

export const attendantConfig = {
  name: 'Ana',
  whatsappUrl: 'https://wa.me/557399747460?text=Ol%C3%A1%2C%20gostaria%20de%20conversar%20com%20um%20Consultor(a)%20Orcoma%21',
};

export const buildWhatsAppUrl = (text: string) =>
  `https://wa.me/557399747460?text=${encodeURIComponent(text)}`;

// WhatsApp de cada atendente regional, pelo nome da unidade em `unidadesAtendidas`
// (formato: 55 + DDD + número, só dígitos). Unidade sem número cai no atendimento geral.
export const whatsappPorUnidade: Record<string, string> = {
  // 'Salvador': '5571XXXXXXXXX',
};

// Link de WhatsApp do atendente da unidade; sem número cadastrado, usa o geral
export const linkWhatsAppUnidade = (nomeUnidade: string | undefined, texto: string): string => {
  const numero = nomeUnidade ? whatsappPorUnidade[nomeUnidade] : undefined;
  return numero
    ? `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`
    : buildWhatsAppUrl(texto);
};

// Lista de unidades/regiões atendidas pela Orcoma (coordenadas aproximadas da sede de cada cidade)
export const unidadesAtendidas = [
  { nome: 'Salvador', estado: 'BA', keywords: ['salvador', 'ssa'], lat: -12.9714, lng: -38.5014 },
  { nome: 'Feira de Santana', estado: 'BA', keywords: ['feira', 'feira de santana', 'fsa'], lat: -12.2664, lng: -38.9663 },
  { nome: 'Jequié', estado: 'BA', keywords: ['jequié', 'jequie'], lat: -13.8583, lng: -40.0831 },
  { nome: 'Seabra', estado: 'BA', keywords: ['seabra'], lat: -12.4167, lng: -41.7833 },
  { nome: 'Jaguaquara', estado: 'BA', keywords: ['jaguaquara'], lat: -13.5333, lng: -39.9667 },
  { nome: 'Várzea Nova', estado: 'BA', keywords: ['várzea nova', 'varzea nova'], lat: -11.0, lng: -40.5 },
  { nome: 'Maracás', estado: 'BA', keywords: ['maracás', 'maracas'], lat: -13.4333, lng: -40.4167 },
  { nome: 'Utinga', estado: 'BA', keywords: ['utinga'], lat: -12.2, lng: -41.2 },
  { nome: 'Itaberaba', estado: 'BA', keywords: ['itaberaba'], lat: -12.5333, lng: -40.3 },
  { nome: 'Jiquiriçá', estado: 'BA', keywords: ['jiquiriçá', 'jiquirica'], lat: -13.2, lng: -39.5 },
  { nome: 'Campo Formoso', estado: 'BA', keywords: ['campo formoso'], lat: -10.4667, lng: -40.3833 },
  { nome: 'São Paulo', estado: 'SP', keywords: ['são paulo', 'sao paulo'], lat: -23.5505, lng: -46.6333 },
];

// Capitais de todos os estados brasileiros: usadas como ponto de referência
// para indicar a unidade mais próxima quando não há unidade no estado informado
export const estadosBrasil: { uf: string; nome: string; aliases?: string[]; lat: number; lng: number }[] = [
  { uf: 'AC', nome: 'Acre', lat: -9.9747, lng: -67.8076 },
  { uf: 'AL', nome: 'Alagoas', lat: -9.6658, lng: -35.7353 },
  { uf: 'AP', nome: 'Amapá', lat: 0.0355, lng: -51.0705 },
  { uf: 'AM', nome: 'Amazonas', lat: -3.119, lng: -60.0217 },
  { uf: 'BA', nome: 'Bahia', lat: -12.9714, lng: -38.5014 },
  { uf: 'CE', nome: 'Ceará', lat: -3.7319, lng: -38.5267 },
  { uf: 'DF', nome: 'Distrito Federal', lat: -15.7939, lng: -47.8828 },
  { uf: 'ES', nome: 'Espírito Santo', aliases: ['espirito'], lat: -20.3155, lng: -40.3128 },
  { uf: 'GO', nome: 'Goiás', lat: -16.6869, lng: -49.2648 },
  { uf: 'MA', nome: 'Maranhão', lat: -2.5307, lng: -44.3068 },
  { uf: 'MT', nome: 'Mato Grosso', lat: -15.601, lng: -56.0974 },
  { uf: 'MS', nome: 'Mato Grosso do Sul', lat: -20.4697, lng: -54.6201 },
  { uf: 'MG', nome: 'Minas Gerais', lat: -19.9167, lng: -43.9345 },
  { uf: 'PA', nome: 'Pará', lat: -1.4558, lng: -48.4902 },
  { uf: 'PB', nome: 'Paraíba', lat: -7.115, lng: -34.8631 },
  { uf: 'PR', nome: 'Paraná', lat: -25.4284, lng: -49.2733 },
  { uf: 'PE', nome: 'Pernambuco', lat: -8.0476, lng: -34.877 },
  { uf: 'PI', nome: 'Piauí', lat: -5.0892, lng: -42.8016 },
  { uf: 'RJ', nome: 'Rio de Janeiro', lat: -22.9068, lng: -43.1729 },
  { uf: 'RN', nome: 'Rio Grande do Norte', lat: -5.7945, lng: -35.211 },
  { uf: 'RS', nome: 'Rio Grande do Sul', lat: -30.0346, lng: -51.2177 },
  { uf: 'RO', nome: 'Rondônia', lat: -8.7612, lng: -63.9039 },
  { uf: 'RR', nome: 'Roraima', lat: 2.8235, lng: -60.6758 },
  { uf: 'SC', nome: 'Santa Catarina', lat: -27.5954, lng: -48.548 },
  { uf: 'SP', nome: 'São Paulo', lat: -23.5505, lng: -46.6333 },
  { uf: 'SE', nome: 'Sergipe', lat: -10.9472, lng: -37.0731 },
  { uf: 'TO', nome: 'Tocantins', lat: -10.1842, lng: -48.3336 },
];

export interface UnidadeEncontrada {
  nome: string;
  estado: string;
  // true = a cidade informada tem unidade; false = é a unidade mais próxima (atendimento à distância)
  exata: boolean;
}

// Remove acentos e deixa minúsculo, para comparar textos com segurança
const normalizar = (texto: string): string =>
  texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();

// Verifica se o termo aparece como palavra inteira no texto (evita "sp" dentro de "espirito")
const contemPalavra = (texto: string, termo: string): boolean => {
  const termoNorm = normalizar(termo);
  const escapado = termoNorm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^a-z])${escapado}($|[^a-z])`).test(normalizar(texto));
};

// Distância em km entre dois pontos (fórmula de Haversine)
function distanciaKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const raio = 6371;
  const toRad = (graus: number) => (graus * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * raio * Math.asin(Math.sqrt(a));
}

function unidadeMaisProxima(lat: number, lng: number) {
  return unidadesAtendidas.reduce((melhor, unidade) => {
    const distMelhor = distanciaKm(lat, lng, melhor.lat, melhor.lng);
    const distAtual = distanciaKm(lat, lng, unidade.lat, unidade.lng);
    return distAtual < distMelhor ? unidade : melhor;
  });
}

// Identifica o estado citado (pela sigla ou pelo nome)
function encontrarEstado(texto: string) {
  const textoNorm = normalizar(texto);
  for (const estado of estadosBrasil) {
    // Sigla em maiúsculo (ex.: "Jequié - BA") ou sigla sozinha em minúsculo (ex.: "sp")
    const siglaMaiuscula = new RegExp(`(^|[^A-Za-z])${estado.uf}($|[^A-Za-z])`).test(texto);
    const siglaSozinha = textoNorm === estado.uf.toLowerCase();
    const siglaAposSeparador = new RegExp(`[-/,]\\s*${estado.uf.toLowerCase()}($|[^a-z])`).test(textoNorm);
    const nomes = [estado.nome, ...(estado.aliases ?? [])];
    if (siglaMaiuscula || siglaSozinha || siglaAposSeparador || nomes.some((n) => contemPalavra(texto, n))) {
      return estado;
    }
  }
  return null;
}

// Encontra a unidade para a região informada:
// 1) cidade com unidade → essa unidade
// 2) estado com unidade → unidade mais próxima da capital desse estado
// 3) estado sem unidade → unidade mais próxima da capital (atendimento à distância)
// 4) nada reconhecido → null
export function findNearestUnit(region: string): UnidadeEncontrada | null {
  const texto = region.trim();
  if (texto.length < 2) return null;

  for (const unidade of unidadesAtendidas) {
    if (unidade.keywords.some((keyword) => contemPalavra(texto, keyword))) {
      return { nome: unidade.nome, estado: unidade.estado, exata: true };
    }
  }

  const estado = encontrarEstado(texto);
  if (!estado) return null;

  const unidadesDoEstado = unidadesAtendidas.filter((u) => u.estado === estado.uf);
  if (unidadesDoEstado.length > 0) {
    const maisProxima = unidadesDoEstado.reduce((melhor, unidade) =>
      distanciaKm(estado.lat, estado.lng, unidade.lat, unidade.lng) <
      distanciaKm(estado.lat, estado.lng, melhor.lat, melhor.lng)
        ? unidade
        : melhor,
    );
    // Local só se a capital do estado é a própria unidade E o texto é só o estado (ex.: "SP", "Bahia").
    // "Vitória da Conquista - BA" tem outra cidade no texto, então não é atendimento local.
    const sobra = [estado.nome, ...(estado.aliases ?? []), estado.uf]
      .reduce((t, n) => t.replace(new RegExp(normalizar(n), 'g'), ' '), normalizar(texto))
      .replace(/[^a-z]/g, '');
    const exata =
      sobra.length === 0 && distanciaKm(estado.lat, estado.lng, maisProxima.lat, maisProxima.lng) < 1;
    return { nome: maisProxima.nome, estado: maisProxima.estado, exata };
  }

  const unidade = unidadeMaisProxima(estado.lat, estado.lng);
  return { nome: unidade.nome, estado: unidade.estado, exata: false };
}

export type InteresseKey =
  | 'geral'
  | 'abrir_empresa'
  | 'migracao_contabilidade'
  | 'migracao_mei_me'
  | 'declaracao_irpf';

export function trackWhatsAppClick(origemPagina: string, interesse: InteresseKey = 'geral'): void {
  try {
    fetch(apiUrl('/api/whatsapp-click/'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ origem_pagina: origemPagina, interesse }),
      keepalive: true,
    }).catch((err) => {
      console.warn('[attendant] Falha ao registrar clique de WhatsApp:', err);
    });
  } catch (err) {
    // Nunca bloqueia a abertura do WhatsApp
    console.warn('[attendant] Falha ao registrar clique de WhatsApp:', err);
  }
}

// Texto legível do horário, usado nas mensagens do chat (manter alinhado com getAttendantStatus)
export const horarioAtendimento = 'segunda a sexta, das 8h às 18h, sexta até as 17h';

export function isAttendantOnline(now: Date = new Date()): boolean {
  return getAttendantStatus(now) === 'Online agora';
}

export function getAttendantStatus(now: Date = new Date()): string {
  const day = now.getDay();
  if (day === 0 || day === 6) return 'Offline no momento';
  const minutes = now.getHours() * 60 + now.getMinutes();
  const isFriday = day === 5;
  const opening = 8 * 60;
  const closing = isFriday ? 17 * 60 : 18 * 60;
  return minutes >= opening && minutes < closing ? 'Online agora' : 'Offline no momento';
}
