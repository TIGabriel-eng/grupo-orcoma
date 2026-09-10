import { useEffect, useRef, useState } from 'react';
import { X, Loader2, Lock } from 'lucide-react';
import { formatCelular } from '../utils/phone';
import type { ClienteInfo } from '../context/ClienteContext';
import { apiUrl } from '../config/api';

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ClienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  interesse: string;
  serviceTitle: string;
  onSuccess: (token: string, cliente: ClienteInfo) => void;
}

interface FormErrors {
  nome?: string;
  email?: string;
  celular?: string;
  cpf?: string;
  cnpj?: string;
  recaptcha?: string;
}

function validaCelular(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 13;
}

function validaCpf(value: string): boolean {
  const cpf = value.replace(/\D/g, '');
  if (cpf.length !== 11 || cpf === cpf[0].repeat(11)) return false;
  for (const tam of [9, 10]) {
    const resto = cpf
      .slice(0, tam)
      .split('')
      .reduce((acc, d, i) => acc + Number(d) * (tam + 1 - i), 0) % 11;
    const dig = resto < 2 ? 0 : 11 - resto;
    if (Number(cpf[tam]) !== dig) return false;
  }
  return true;
}

export default function ClienteModal({
  isOpen,
  onClose,
  interesse,
  serviceTitle,
  onSuccess,
}: ClienteModalProps) {
  const [form, setForm] = useState({ nome: '', email: '', celular: '', cpf: '', cnpj: '' });
  const [website, setWebsite] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverMsg, setServerMsg] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const recaptchaContainerRef = useRef<HTMLDivElement | null>(null);
  const recaptchaWidgetIdRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!isOpen) return;
    setEnviado(false);
    setErrors({});
    setServerMsg(null);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !RECAPTCHA_SITE_KEY) return;
    const renderWidget = () => {
      if (
        recaptchaWidgetIdRef.current !== undefined ||
        !window.grecaptcha?.render ||
        !recaptchaContainerRef.current
      ) {
        return;
      }
      recaptchaWidgetIdRef.current = window.grecaptcha.render(recaptchaContainerRef.current, {
        sitekey: RECAPTCHA_SITE_KEY,
        callback: () => setErrors((e) => ({ ...e, recaptcha: undefined })),
      });
    };
    if (window.grecaptcha?.render) {
      renderWidget();
      return;
    }
    const timer = window.setInterval(() => {
      if (window.grecaptcha?.render) {
        renderWidget();
        window.clearInterval(timer);
      }
    }, 200);
    return () => window.clearInterval(timer);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen && recaptchaWidgetIdRef.current !== undefined) {
      window.grecaptcha?.reset?.(recaptchaWidgetIdRef.current);
      recaptchaWidgetIdRef.current = undefined;
    }
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
    if (!form.nome.trim() || form.nome.trim().length < 2) {
      next.nome = 'Informe seu nome.';
    }
    if (!form.email.trim() || !EMAIL_RE.test(form.email.trim())) {
      next.email = 'Informe um e-mail válido.';
    }
    if (!validaCelular(form.celular)) {
      next.celular = 'Informe um celular válido.';
    }
    if (form.cpf.trim() && !validaCpf(form.cpf)) {
      next.cpf = 'CPF inválido.';
    }
    if (RECAPTCHA_SITE_KEY) {
      const token =
        recaptchaWidgetIdRef.current !== undefined
          ? window.grecaptcha?.getResponse(recaptchaWidgetIdRef.current) || ''
          : '';
      if (!token) next.recaptcha = 'Confirme que você não é um robô.';
    }
    return next;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    setServerMsg(null);
    if (Object.keys(nextErrors).length > 0) return;

    setEnviando(true);
    try {
      const recaptchaToken =
        recaptchaWidgetIdRef.current !== undefined
          ? window.grecaptcha?.getResponse(recaptchaWidgetIdRef.current) || ''
          : '';
      const res = await fetch(apiUrl('/api/cliente/login/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          website,
          interesse,
          'g-recaptcha-response': recaptchaToken,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.token) {
        setEnviado(true);
        window.setTimeout(() => {
          onSuccess(data.token, {
            nome: data.cliente?.nome || form.nome,
            email: data.cliente?.email || form.email,
            celular: data.cliente?.celular || form.celular,
            cpf: data.cliente?.cpf || form.cpf,
            cnpj: data.cliente?.cnpj || form.cnpj,
          });
        }, 600);
      } else {
        setServerMsg(data.message || 'Não foi possível entrar. Tente novamente.');
      }
    } catch {
      setServerMsg('Não foi possível entrar. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.55)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-6 py-5" style={{ background: '#0c0ccc' }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.15)' }}>
            <Lock size={18} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-sm">Área do Cliente</p>
            <p className="text-white/70 text-xs truncate">Acesso seguro aos serviços Orcoma</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors" aria-label="Fechar">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 flex flex-col gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Para acessar <strong style={{ color: '#0c0ccc' }}>{serviceTitle}</strong>, preencha seus dados.
              Se você já é cliente, eles serão reconhecidos automaticamente pelo e-mail ou CPF.
            </p>
          </div>

          {enviado ? (
            <div className="flex flex-col items-center text-center gap-3 py-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: '#22c55e' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Acesso liberado!</h3>
              <p className="text-gray-500 text-sm">Redirecionando para o atendimento...</p>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nome completo*</label>
                <input
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  placeholder="Exemplo: João da Silva"
                  className="w-full px-4 py-2.5 rounded-lg border text-sm text-gray-800 focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{
                    borderColor: errors.nome ? '#ef4444' : '#e5e7eb',
                    '--tw-ring-color': '#0c0ccc' as string,
                  } as React.CSSProperties}
                />
                {errors.nome && <p className="mt-1 text-xs text-red-500">{errors.nome}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">E-mail*</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Exemplo: joao.silva@email.com"
                  className="w-full px-4 py-2.5 rounded-lg border text-sm text-gray-800 focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{
                    borderColor: errors.email ? '#ef4444' : '#e5e7eb',
                    '--tw-ring-color': '#0c0ccc' as string,
                  } as React.CSSProperties}
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Celular*</label>
                <input
                  name="celular"
                  type="tel"
                  inputMode="numeric"
                  value={form.celular}
                  onChange={handleChange}
                  placeholder="(11) 91234-5678"
                  className="w-full px-4 py-2.5 rounded-lg border text-sm text-gray-800 focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{
                    borderColor: errors.celular ? '#ef4444' : '#e5e7eb',
                    '--tw-ring-color': '#0c0ccc' as string,
                  } as React.CSSProperties}
                />
                {errors.celular && <p className="mt-1 text-xs text-red-500">{errors.celular}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">CPF (opcional)</label>
                  <input
                    name="cpf"
                    inputMode="numeric"
                    value={form.cpf}
                    onChange={handleChange}
                    placeholder="000.000.000-00"
                    className="w-full px-4 py-2.5 rounded-lg border text-sm text-gray-800 focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{
                      borderColor: errors.cpf ? '#ef4444' : '#e5e7eb',
                      '--tw-ring-color': '#0c0ccc' as string,
                    } as React.CSSProperties}
                  />
                  {errors.cpf && <p className="mt-1 text-xs text-red-500">{errors.cpf}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">CNPJ (opcional)</label>
                  <input
                    name="cnpj"
                    inputMode="numeric"
                    value={form.cnpj}
                    onChange={handleChange}
                    placeholder="00.000.000/0000-00"
                    className="w-full px-4 py-2.5 rounded-lg border text-sm text-gray-800 focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ borderColor: '#e5e7eb', '--tw-ring-color': '#0c0ccc' as string } as React.CSSProperties}
                  />
                </div>
              </div>

              <div ref={recaptchaContainerRef} className="flex justify-center" />

              {errors.recaptcha && <p className="text-xs text-red-500">{errors.recaptcha}</p>}

              <div className="hidden" aria-hidden="true">
                <label htmlFor="website">Não preencha este campo</label>
                <input
                  id="website"
                  type="text"
                  name="website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {serverMsg && <p className="text-xs text-red-500">{serverMsg}</p>}

              <button
                type="submit"
                disabled={enviando}
                className="w-full py-3 rounded-lg text-white text-sm font-bold transition-all hover:brightness-110 hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-70 disabled:scale-100"
                style={{ background: '#0c0ccc' }}
              >
                {enviando && <Loader2 size={18} className="animate-spin" />}
                Acessar Serviço
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
