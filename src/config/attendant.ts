export const attendantConfig = {
  name: 'Gilton Comercial',
  whatsappUrl: 'https://wa.me/557399747460?text=Ol%C3%A1%2C%20gostaria%20de%20falar%20com%20um%20consultor',
};

export const buildWhatsAppUrl = (text: string) =>
  `https://wa.me/557399747460?text=${encodeURIComponent(text)}`;

export type InteresseKey =
  | 'geral'
  | 'abrir_empresa'
  | 'migracao_contabilidade'
  | 'migracao_mei_me'
  | 'declaracao_irpf';

export function trackWhatsAppClick(origemPagina: string, interesse: InteresseKey = 'geral'): void {
  try {
    fetch('/api/whatsapp-click/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ origem_pagina: origemPagina, interesse }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // silencioso — nunca bloqueia a abertura do WhatsApp
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
