import { useState } from 'react';

const CONSENT_KEY = 'orcoma_cookie_consent';

interface ConsentData {
  choice: 'accepted' | 'declined';
  date: string;
}

function readConsent(): ConsentData | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentData;
    return parsed?.choice === 'accepted' || parsed?.choice === 'declined' ? parsed : null;
  } catch {
    return null;
  }
}

function writeConsent(choice: 'accepted' | 'declined'): void {
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ choice, date: new Date().toISOString() }));
  } catch {
    // localStorage indisponível — ignora
  }
}

export function useCookieConsent() {
  const [consent, setConsent] = useState<ConsentData | null>(readConsent);

  const accept = () => {
    writeConsent('accepted');
    setConsent({ choice: 'accepted', date: new Date().toISOString() });
  };

  const decline = () => {
    writeConsent('declined');
    setConsent({ choice: 'declined', date: new Date().toISOString() });
  };

  return { consent, accept, decline } as const;
}

/** Helper para futuros scripts de rastreamento. Retorna true só se o usuário aceitou. */
export function hasConsent(): boolean {
  return readConsent()?.choice === 'accepted';
}
