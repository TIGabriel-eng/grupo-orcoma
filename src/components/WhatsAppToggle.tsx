import { useEffect, useState } from 'react';
import { Headset, MessageCircle, X } from 'lucide-react';
import { attendantConfig, getAttendantStatus, trackWhatsAppClick } from '../config/attendant';

export default function WhatsAppToggle() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(getAttendantStatus);

  useEffect(() => {
    const timer = setInterval(() => setStatus(getAttendantStatus()), 60_000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div
          className="w-72 rounded-2xl p-5 shadow-2xl transition-all"
          style={{ background: 'white', border: '1px solid #e5e7eb' }}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#25D366' }}>
                <MessageCircle size={20} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">{attendantConfig.name}</p>
                <p className="text-xs text-gray-400">{status}</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Fechar">
              <X size={18} />
            </button>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            Precisa de ajuda? Nosso time de consultores está aqui para te ajudar!
          </p>

          <a
            href={attendantConfig.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick('toggle_flutuante')}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:brightness-110 hover:scale-[1.02]"
            style={{ background: '#25D366' }}
          >
            <MessageCircle size={18} />
            Iniciar conversa
          </a>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-110"
        style={{ background: '#25D366' }}
        aria-label={open ? 'Fechar' : 'Falar com consultor no WhatsApp'}
      >
        {open ? <X size={26} className="text-white" /> : <Headset size={26} className="text-white" />}
      </button>
    </div>
  );
}
