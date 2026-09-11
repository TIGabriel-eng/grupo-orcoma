import { useEffect, useState } from 'react';
import { useCookieConsent } from '../hooks/useCookieConsent';
import { useNav } from '../context/NavContext';

export default function CookieConsentBanner() {
  const { consent, accept, decline } = useCookieConsent();
  const { navigate } = useNav();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (consent) return;
    const timer = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(timer);
  }, [consent]);

  if (consent || !visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-center px-4 pb-4 sm:pb-6"
      style={{ animation: 'cookie-slide-up 0.4s ease-out' }}
    >
      <style>{`
        @keyframes cookie-slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div
        className="w-full max-w-4xl rounded-2xl px-5 py-4 sm:px-8 sm:py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-2xl"
        style={{ background: '#0a0a14', borderTop: '3px solid #0c0ccc' }}
      >
        <p className="text-gray-300 text-xs sm:text-sm leading-relaxed flex-1">
          Este site utiliza cookies para melhorar sua experiência e garantir o funcionamento correto dos formulários.
          Saiba mais na nossa{' '}
          <button
            onClick={() => navigate('politica-privacidade')}
            className="underline hover:text-white transition-colors"
            style={{ color: '#e8b800' }}
          >
            Política de Privacidade
          </button>.
        </p>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={decline}
            className="px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors hover:bg-white/10"
            style={{ border: '1px solid rgba(255,255,255,0.25)', color: 'rgba(255,255,255,0.7)' }}
          >
            Recusar
          </button>
          <button
            onClick={accept}
            className="px-5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:brightness-110"
            style={{ background: '#e8b800', color: '#0a0a14' }}
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}
