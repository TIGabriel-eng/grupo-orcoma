import { useEffect, useRef, useState } from 'react';
import { Headset, User, X, Loader2 } from 'lucide-react';
import { useWhatsApp } from '../context/WhatsAppContext';
import { attendantConfig, getAttendantStatus } from '../config/attendant';
import { formatCelular } from '../utils/phone';

interface FormErrors {
  nome?: string;
  celular?: string;
  email?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BUBBLE_MESSAGES = [
  'Como podemos te ajudar hoje?',
  'Já procurou nossos especialistas? Eles podem te ajudar!',
];
const INTERACTED_KEY = 'orcoma_chat_interacted';
const BUBBLE_INITIAL_DELAY = 2000;
const BUBBLE_ROTATION_MS = 6000;

function validaCelular(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 13;
}

function alreadyInteracted(): boolean {
  try {
    return localStorage.getItem(INTERACTED_KEY) === '1';
  } catch {
    return false;
  }
}

function markInteracted(): void {
  try {
    localStorage.setItem(INTERACTED_KEY, '1');
  } catch {
    // localStorage indisponível — ignora
  }
}

export default function WhatsAppModal() {
  const { isOpen, open, close } = useWhatsApp();
  const [form, setForm] = useState({ nome: '', celular: '', email: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [serverMsg, setServerMsg] = useState<string | null>(null);
  const [bubbleVisible, setBubbleVisible] = useState(!alreadyInteracted());
  const [bubbleShown, setBubbleShown] = useState(false);
  const [bubbleIndex, setBubbleIndex] = useState(0);
  const [status, setStatus] = useState(getAttendantStatus);
  const prevOpenRef = useRef(isOpen);

  useEffect(() => {
    const timer = setInterval(() => setStatus(getAttendantStatus()), 60_000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!bubbleVisible) return;
    const initial = setTimeout(() => setBubbleShown(true), BUBBLE_INITIAL_DELAY);
    const interval = setInterval(
      () => setBubbleIndex((i) => (i + 1) % BUBBLE_MESSAGES.length),
      BUBBLE_ROTATION_MS,
    );
    return () => {
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, [bubbleVisible]);

  useEffect(() => {
    if (isOpen && !prevOpenRef.current) {
      markInteracted();
      setBubbleVisible(false);
    }
    prevOpenRef.current = isOpen;
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name === 'celular' ? formatCelular(value) : value,
    }));
  };

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    if (!form.nome.trim()) {
      next.nome = 'Informe seu nome.';
    } else if (form.nome.trim().length < 2) {
      next.nome = 'Nome muito curto.';
    }
    if (!form.celular.trim()) {
      next.celular = 'Informe seu celular.';
    } else if (!validaCelular(form.celular)) {
      next.celular = 'Informe um celular válido.';
    }
    if (!form.email.trim()) {
      next.email = 'Informe seu e-mail.';
    } else if (!EMAIL_RE.test(form.email.trim())) {
      next.email = 'Informe um e-mail válido.';
    }
    return next;
  };

  const handleSubmit = async () => {
    const nextErrors = validate();
    setErrors(nextErrors);
    setServerMsg(null);
    if (Object.keys(nextErrors).length > 0) return;

    setEnviando(true);
    try {
      const res = await fetch('/api/contact/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, origem: 'whatsapp_modal', interesse: 'geral' }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setEnviado(true);
        setForm({ nome: '', celular: '', email: '' });
      } else {
        setServerMsg(data.message || 'Não foi possível enviar. Tente novamente.');
      }
    } catch {
      setServerMsg('Não foi possível enviar. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  };

  const handleOpen = () => {
    setEnviado(false);
    setErrors({});
    setServerMsg(null);
    open();
  };

  const handleClose = () => {
    setEnviado(false);
    setErrors({});
    setServerMsg(null);
    close();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end gap-3">
          <div
            className="w-[320px] max-w-[calc(100vw-2rem)] rounded-2xl shadow-2xl overflow-hidden transition-all"
            style={{ background: 'white', border: '1px solid #e5e7eb' }}
          >
            <div className="flex items-center gap-3 px-5 py-4" style={{ background: '#f3f4f6' }}>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}
              >
                <User size={20} style={{ color: '#25D366' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800 truncate">{attendantConfig.name}</p>
                <p className="text-xs text-gray-400">{status}</p>
              </div>
              <button onClick={() => handleClose()} className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Fechar">
                <X size={18} />
              </button>
            </div>

            <div className="px-5 py-5">
              {enviado ? (
                <div className="flex flex-col items-center text-center gap-3 py-6">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: '#22c55e' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Dados enviados com Sucesso!</h3>
                  <p className="text-gray-500 text-sm">Em breve entraremos em contato contigo!</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Nome*</label>
                    <input
                      name="nome"
                      value={form.nome}
                      onChange={handleChange}
                      placeholder="Exemplo: João da Silva"
                      className="w-full px-4 py-2.5 rounded-lg border text-sm text-gray-800 focus:outline-none focus:ring-2 focus:border-transparent"
                      style={{
                        borderColor: errors.nome ? '#ef4444' : '#e5e7eb',
                        '--tw-ring-color': '#25D366' as string,
                      } as React.CSSProperties}
                    />
                    {errors.nome && <p className="mt-1 text-xs text-red-500">{errors.nome}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Celular*</label>
                    <div className="flex gap-2">
                      <select className="px-3 py-2.5 rounded-lg border text-sm text-gray-700 bg-white focus:outline-none" style={{ borderColor: errors.celular ? '#ef4444' : '#e5e7eb' }}>
                        <option>BR +55</option>
                      </select>
                      <input
                        name="celular"
                        type="tel"
                        inputMode="numeric"
                        value={form.celular}
                        onChange={handleChange}
                        placeholder="Exemplo: (11)91234-5678"
                        className="flex-1 min-w-0 px-4 py-2.5 rounded-lg border text-sm text-gray-800 focus:outline-none"
                        style={{ borderColor: errors.celular ? '#ef4444' : '#e5e7eb' }}
                      />
                    </div>
                    {errors.celular && <p className="mt-1 text-xs text-red-500">{errors.celular}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Email*</label>
                    <input
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Exemplo: joao.silva@email.com"
                      className="w-full px-4 py-2.5 rounded-lg border text-sm text-gray-800 focus:outline-none"
                      style={{ borderColor: errors.email ? '#ef4444' : '#e5e7eb' }}
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                  </div>

                  <input
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    style={{ display: 'none' }}
                    aria-hidden="true"
                  />

                  {serverMsg && (
                    <p className="text-xs text-red-500">{serverMsg}</p>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={enviando}
                    className="w-full py-3 rounded-lg text-white text-sm font-bold transition-all hover:brightness-110 hover:scale-[1.02] mt-1 flex items-center justify-center gap-2 disabled:opacity-70 disabled:scale-100"
                    style={{ background: '#25D366' }}
                  >
                    {enviando ? <Loader2 size={18} className="animate-spin" /> : <Headset size={18} />}
                    Iniciar Atendimento
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {bubbleVisible && !isOpen && (
        <div className="fixed bottom-24 right-6 z-50">
          <div
            className="bg-white rounded-2xl px-4 py-2.5 shadow-lg relative max-w-[280px]"
            style={{ border: '1px solid #e5e7eb', animation: bubbleShown ? 'bubbleFadeIn 0.4s ease-out both' : 'none' }}
          >
            <style>{`
              @keyframes bubbleFadeIn {
                from { opacity: 0; transform: translateY(8px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}</style>
            <p className="text-sm text-gray-700 font-medium">{BUBBLE_MESSAGES[bubbleIndex]}</p>
            <div
              className="absolute -bottom-1.5 right-6 w-3 h-3 rotate-45"
              style={{
                background: 'white',
                borderRight: '1px solid #e5e7eb',
                borderBottom: '1px solid #e5e7eb',
              }}
            />
          </div>
        </div>
      )}

      <button
        onClick={() => (isOpen ? handleClose() : handleOpen())}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-110"
        style={{ background: '#25D366' }}
        aria-label={isOpen ? 'Fechar' : 'Falar com consultor'}
      >
        {isOpen ? <X size={26} className="text-white" /> : <Headset size={26} className="text-white" />}
      </button>
    </>
  );
}
