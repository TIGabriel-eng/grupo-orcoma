import { apiUrl } from './api';

export const attendantConfig = {
  name: 'Ana',
  whatsappUrl: 'https://wa.me/557399747460?text=Ol%C3%A1%2C%20gostaria%20de%20conversar%20com%20um%20Consultor(a)%20Orcoma%21',
};

export const buildWhatsAppUrl = (text: string) =>
  `https://wa.me/557399747460?text=${encodeURIComponent(text)}`;

// Lista de unidades/regiões atendidas pela Orcoma
export const unidadesAtendidas = [
  { nome: 'Salvador', estado: 'BA', keywords: ['salvador', 'ssa'] },
  { nome: 'Feira de Santana', estado: 'BA', keywords: ['feira', 'feira de santana', 'fsa'] },
  { nome: 'Jequié', estado: 'BA', keywords: ['jequié', 'jequie'] },
  { nome: 'Seabra', estado: 'BA', keywords: ['seabra'] },
  { nome: 'Jaguaquara', estado: 'BA', keywords: ['jaguaquara'] },
  { nome: 'Várzea Nova', estado: 'BA', keywords: ['várzea nova', 'varzea nova'] },
  { nome: 'Maracás', estado: 'BA', keywords: ['maracás', 'maracas'] },
  { nome: 'Utinga', estado: 'BA', keywords: ['utinga'] },
  { nome: 'Itaberaba', estado: 'BA', keywords: ['itaberaba'] },
  { nome: 'Jiquiriçá', estado: 'BA', keywords: ['jiquiriçá', 'jiquirica'] },
  { nome: 'Campo Formoso', estado: 'BA', keywords: ['campo formoso'] },
  { nome: 'São Paulo', estado: 'SP', keywords: ['são paulo', 'sao paulo', 'sp'] },
];

// Função para encontrar a unidade mais próxima com base na região informada
export function findNearestUnit(region: string): { nome: string; estado: string } | null {
  const normalizedRegion = region.toLowerCase().trim();
  
  // Se mencionar SP (São Paulo), redireciona automaticamente para São Paulo
  if (normalizedRegion.includes('sp') || normalizedRegion.includes('são paulo') || normalizedRegion.includes('sao paulo')) {
    return { nome: 'São Paulo', estado: 'SP' };
  }
  
  for (const unidade of unidadesAtendidas) {
    for (const keyword of unidade.keywords) {
      if (normalizedRegion.includes(keyword) || keyword.includes(normalizedRegion)) {
        return { nome: unidade.nome, estado: unidade.estado };
      }
    }
  }
  
  return null;
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

export function getAttendantStatus(now: Date = new Date()): string {
  const day = now.getDay();
  if (day === 0 || day === 6) return 'Offline no momento';
  const minutes = now.getHours() * 60 + now.getMinutes();
  const isFriday = day === 5;
  const opening = 8 * 60;
  const closing = isFriday ? 17 * 60 : 18 * 60;
  return minutes >= opening && minutes < closing ? 'Online agora' : 'Offline no momento';
}
