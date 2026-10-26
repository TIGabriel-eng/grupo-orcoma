import { useEffect, useRef, useState, type FormEvent } from 'react';
import { X } from 'lucide-react';
import { apiUrl } from '../config/api';
import { formatCelular } from '../utils/phone';

// Chave que guarda que o visitante já assinou: nesse caso o pop-up nunca mais aparece
const STORAGE_KEY = 'orcoma_newsletter_popup';
// Chave com a hora em que o visitante fechou sem assinar: o pop-up volta depois de REAPARECER_MS
const FECHADO_KEY = 'orcoma_newsletter_fechado_em';
// Chave do banner de cookies: o pop-up espera a escolha do visitante
const COOKIE_KEY = 'orcoma_cookie_consent';
const TEMPO_ATIVO_MS = 3 * 60 * 1000;
const REAPARECER_MS = 5 * 60 * 60 * 1000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function jaAssinou(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

function podeAbrir(): boolean {
  if (jaAssinou()) return false;
  try {
    const fechadoEm = localStorage.getItem(FECHADO_KEY);
    return fechadoEm === null || Date.now() - Number(fechadoEm) >= REAPARECER_MS;
  } catch {
    return true;
  }
}

function marcarAssinou(): void {
  try {
    localStorage.setItem(STORAGE_KEY, '1');
  } catch {
    // localStorage indisponível — o pop-up pode voltar nesta visita
  }
}

function marcarFechado(): void {
  try {
    localStorage.setItem(FECHADO_KEY, String(Date.now()));
  } catch {
    // localStorage indisponível — o pop-up pode voltar na próxima visita
  }
}

function cookieDecidido(): boolean {
  try {
    return localStorage.getItem(COOKIE_KEY) !== null;
  } catch {
    return false;
  }
}

function formatCnpj(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 14);
  let out = d.slice(0, 2);
  if (d.length > 2) out += `.${d.slice(2, 5)}`;
  if (d.length > 5) out += `.${d.slice(5, 8)}`;
  if (d.length > 8) out += `/${d.slice(8, 12)}`;
  if (d.length > 12) out += `-${d.slice(12, 14)}`;
  return out;
}

const CAMPO =
  'w-full px-3 py-2.5 sm:py-3 rounded-lg border border-gray-200 text-sm sm:text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0c0ccc]';

export default function NewsletterPopup() {
  const [aberto, setAberto] = useState(false);
  const [form, setForm] = useState({ nome: '', celular: '', email: '', cnpj: '' });
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const tempoAtivo = useRef(0);

  // Conta só o tempo com a aba visível e abre quando passar de 3 minutos
  useEffect(() => {
    const timer = setInterval(() => {
      if (!podeAbrir()) return;
      if (document.visibilityState === 'visible') tempoAtivo.current += 1000;
      if (tempoAtivo.current >= TEMPO_ATIVO_MS && cookieDecidido()) {
        setAberto(true);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fechar = () => {
    marcarFechado();
    tempoAtivo.current = 0;
    setAberto(false);
  };

  const atualizar = (campo: keyof typeof form, valor: string) => {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  };

  const enviar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nome = form.nome.trim();
    const email = form.email.trim();
    const celular = form.celular.replace(/\D/g, '');
    const cnpj = form.cnpj.replace(/\D/g, '');

    if (nome.length < 2) {
      setErro('Informe seu nome.');
      return;
    }
    if (!EMAIL_RE.test(email)) {
      setErro('Informe um e-mail válido.');
      return;
    }
    if (celular && (celular.length < 10 || celular.length > 11)) {
      setErro('Informe um celular válido.');
      return;
    }
    if (cnpj && cnpj.length !== 14) {
      setErro('Informe um CNPJ válido.');
      return;
    }

    setErro(null);
    setEnviando(true);
    try {
      const res = await fetch(apiUrl('/api/newsletter/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, celular, cnpj, origem: 'popup' }),
      });
      const data = await res.json();
      if (!res.ok || data.status !== 'ok') {
        setErro(data.message || 'Não foi possível cadastrar. Tente novamente.');
        return;
      }
      marcarAssinou();
      setSucesso(data.message || 'Cadastro realizado!');
      setTimeout(() => setAberto(false), 2500);
    } catch {
      setErro('Não foi possível cadastrar. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  };

  if (!aberto) return null;

  return (
    <div
      role="dialog"
      aria-label="Assinar a newsletter"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
    >
      <div className="relative w-full sm:w-[34rem] bg-white rounded-2xl shadow-2xl border-t-4 p-5 sm:p-8 max-h-[85vh] overflow-y-auto" style={{ borderColor: '#0c0ccc' }}>
        <style>{`
          @keyframes newsletterMarcaFlutuar {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(0.6deg); }
          }
          .newsletter-marca-dagua {
            animation: newsletterMarcaFlutuar 6s ease-in-out infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .newsletter-marca-dagua { animation: none; }
          }
        `}</style>
        <img
          src="/logo-orcoma-marca-dagua.webp"
          alt=""
          aria-hidden="true"
          draggable={false}
          className="newsletter-marca-dagua absolute inset-0 m-auto w-3/4 h-auto opacity-[0.08] pointer-events-none select-none z-0"
        />
        <button
          type="button"
          onClick={fechar}
          aria-label="Fechar"
          className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full flex items-center justify-center hover:bg-yellow-50 transition"
          style={{ color: '#e8b800' }}
        >
          <X size={18} />
        </button>

        <div className="relative z-10">
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed pr-8 mb-5">
          Gostou do nosso conteúdo e quer ficar por dentro das nossas atualizações? Assine nosso formulário e receba por e-mail nossas novidades!
        </p>

        {sucesso ? (
          <p className="text-sm font-medium text-green-600 py-4">{sucesso}</p>
        ) : (
          <form onSubmit={enviar} className="flex flex-col gap-3" noValidate>
            <div>
              <label htmlFor="np-nome" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Nome*</label>
              <input
                id="np-nome"
                type="text"
                value={form.nome}
                onChange={(e) => atualizar('nome', e.target.value)}
                placeholder="João Silva"
                autoComplete="name"
                className={CAMPO}
              />
            </div>
            <div>
              <label htmlFor="np-celular" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Celular (opcional)</label>
              <input
                id="np-celular"
                type="tel"
                value={form.celular}
                onChange={(e) => atualizar('celular', formatCelular(e.target.value))}
                placeholder="(11)91234-5678"
                autoComplete="tel"
                className={CAMPO}
              />
            </div>
            <div>
              <label htmlFor="np-email" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">E-mail*</label>
              <input
                id="np-email"
                type="email"
                value={form.email}
                onChange={(e) => atualizar('email', e.target.value)}
                placeholder="joao.silva@gmail.com"
                autoComplete="email"
                className={CAMPO}
              />
            </div>
            <div>
              <label htmlFor="np-cnpj" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">CNPJ (opcional)</label>
              <input
                id="np-cnpj"
                type="text"
                inputMode="numeric"
                value={form.cnpj}
                onChange={(e) => atualizar('cnpj', formatCnpj(e.target.value))}
                placeholder="00.000.000/0001-00"
                className={CAMPO}
              />
            </div>

            {erro && <p className="text-xs text-red-600">{erro}</p>}

            <button
              type="submit"
              disabled={enviando}
              className="w-full mt-1 py-3 sm:py-3.5 rounded-lg text-sm sm:text-base font-bold transition hover:brightness-110 disabled:opacity-60"
              style={{ background: '#e8b800', color: '#0a0a14' }}
            >
              {enviando ? 'Enviando...' : 'Assinar'}
            </button>
          </form>
        )}
        </div>
      </div>
    </div>
  );
}
