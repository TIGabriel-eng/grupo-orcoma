import { useEffect, useRef, useState } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

const MAX_CURRICULO_BYTES = 5 * 1024 * 1024;
const CURRICULO_EXTS = ['.pdf', '.doc', '.docx'];
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '';

const formataTelefone = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (!digits) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

export default function TrabalheConoscoPage() {
  const [form, setForm] = useState({ nome: '', email: '', telefone: '', mensagem: '' });
  const [curriculo, setCurriculo] = useState<File | null>(null);
  const [website, setWebsite] = useState('');
  const [erro, setErro] = useState('');
  const [enviado, setEnviado] = useState(false);
  const recaptchaContainerRef = useRef<HTMLDivElement | null>(null);
  const recaptchaWidgetIdRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!RECAPTCHA_SITE_KEY) return;
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
        callback: () => setErro(''),
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
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === 'telefone' ? formataTelefone(value) : value }));
  };

  const validaCurriculo = (file: File | null): string => {
    if (!file) return 'Anexe seu currículo.';
    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (!CURRICULO_EXTS.includes(ext)) return 'Formato não permitido. Envie PDF, DOC ou DOCX.';
    if (file.size > MAX_CURRICULO_BYTES) return 'Arquivo muito grande. O limite é 5 MB.';
    return '';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setErro(validaCurriculo(file));
    setCurriculo(file);
  };

  const limparCurriculo = () => {
    setCurriculo(null);
    setErro('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const erroCurriculo = validaCurriculo(curriculo);
    if (erroCurriculo) {
      setErro(erroCurriculo);
      return;
    }
    let recaptchaToken = '';
    if (RECAPTCHA_SITE_KEY) {
      recaptchaToken =
        recaptchaWidgetIdRef.current !== undefined
          ? window.grecaptcha?.getResponse(recaptchaWidgetIdRef.current) || ''
          : '';
      if (!recaptchaToken) {
        setErro('Confirme que você não é um robô.');
        return;
      }
    }
    setErro('');
    try {
      const data = new FormData();
      data.append('nome', form.nome);
      data.append('email', form.email);
      data.append('telefone', form.telefone);
      data.append('mensagem', form.mensagem);
      data.append('website', website);
      if (recaptchaToken) data.append('g-recaptcha-response', recaptchaToken);
      if (curriculo) data.append('curriculo', curriculo);

      const res = await fetch('/api/job-application/', {
        method: 'POST',
        body: data,
      });
      if (res.ok) {
        setEnviado(true);
        setForm({ nome: '', email: '', telefone: '', mensagem: '' });
        setCurriculo(null);
        setWebsite('');
        if (recaptchaWidgetIdRef.current !== undefined && window.grecaptcha?.reset) {
          window.grecaptcha.reset(recaptchaWidgetIdRef.current);
        }
      } else {
        const body = await res.json().catch(() => null);
        setErro(body?.message || 'Não foi possível enviar sua candidatura. Tente novamente.');
      }
    } catch {
      setErro('Não foi possível enviar sua candidatura. Tente novamente.');
    }
  };

  const gradientStyle = {
    background:
      'linear-gradient(160deg, rgba(12,12,204,0.45) 0%, rgba(26,26,255,0.4) 40%, rgba(0,0,179,0.5) 100%), url("/ORCOMA.png") center/cover no-repeat',
  };

  if (enviado) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col" style={gradientStyle}>
          <Nav />
          <main className="flex-1 flex items-center justify-center py-20 px-4">
          <div className="success-card relative max-w-md w-full bg-white rounded-2xl p-8 sm:p-12 shadow-xl text-center overflow-hidden">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <span className="success-ring" aria-hidden="true" />
              <div
                className="success-icon-wrap relative w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: '#22c55e' }}
              >
                <svg
                  className="success-check w-8 h-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>
            <h2 className="success-title text-xl font-bold text-gray-900 mb-2">Candidatura enviada!</h2>
            <p className="success-text text-gray-500 text-sm">Entraremos em contato em breve.</p>
          </div>
        </main>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col" style={gradientStyle}>
        <Nav />
        <main className="flex-1 py-14 sm:py-20 px-4 sm:px-6">
          <div className="max-w-[33.6rem] mx-auto">
            <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">Trabalhe Conosco</h1>
            <p className="text-white/70 text-sm sm:text-base max-w-xl mx-auto">
              Envie seu currículo e faça parte do time Orcoma. Estamos sempre em busca de talentos que queiram crescer conosco.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-xl reveal relative z-10">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nome completo*</label>
                <input
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  placeholder="João da Silva"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': '#0c0ccc' } as React.CSSProperties}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">E-mail*</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="joao@email.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': '#0c0ccc' } as React.CSSProperties}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Telefone</label>
                <input
                  name="telefone"
                  type="tel"
                  value={form.telefone}
                  onChange={handleChange}
                  placeholder="(11) 91234-5678"
                  maxLength={15}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': '#0c0ccc' } as React.CSSProperties}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Mensagem</label>
                <textarea
                  name="mensagem"
                  value={form.mensagem}
                  onChange={handleChange}
                  placeholder="Conte um pouco sobre você..."
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:border-transparent resize-none"
                  style={{ '--tw-ring-color': '#0c0ccc' } as React.CSSProperties}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Currículo* (PDF, DOC ou DOCX — máx. 5 MB)</label>
                {curriculo ? (
                  <div className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800">
                    <span className="truncate">{curriculo.name}</span>
                    <button
                      type="button"
                      onClick={limparCurriculo}
                      className="text-xs font-semibold flex-shrink-0 transition-colors"
                      style={{ color: '#0c0ccc' }}
                    >
                      Remover
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-dashed border-gray-300 text-sm text-gray-500 cursor-pointer hover:border-gray-400 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    Escolher arquivo
                    <input
                      type="file"
                      name="curriculo"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
                {erro && <p className="mt-1 text-xs font-semibold" style={{ color: '#dc2626' }}>{erro}</p>}
              </div>

              <div ref={recaptchaContainerRef} className="flex justify-center" />

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

              <button
                type="submit"
                className="w-full py-3 rounded-lg text-white text-sm font-bold transition-all hover:brightness-110 hover:scale-[1.02]"
                style={{ background: '#0c0ccc' }}
              >
                Enviar Candidatura
              </button>
            </form>
          </div>
        </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}