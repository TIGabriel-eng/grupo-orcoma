import { useState } from 'react';
import { apiUrl } from '../config/api';

const PRECISA_OPTIONS = ['Quero abrir minha empresa', 'Quero trocar de contador'];

const ATIVIDADE_OPTIONS = [
  'PJ em uma empresa',
  'Serviços de TI',
  'Serviços Administrativos',
  'Comercio',
  'Medicina',
  'Advocacia',
  'Psicologia e outros serviços de saúde',
  'Outros',
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormErrors {
  nome?: string;
  email?: string;
  telefone?: string;
  precisa?: string;
  atividade?: string;
  outros?: string;
  aceito?: string;
}

function validaTelefone(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 13;
}

const inputClass = 'w-full px-4 py-2.5 rounded-lg border text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600/30';
const selectClass = 'w-full px-4 py-2.5 rounded-lg border text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/30';

export default function BlogLeadForm() {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    precisa: '',
    atividade: '',
    outros: '',
  });
  const [aceito, setAceito] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [serverMsg, setServerMsg] = useState<string | null>(null);

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    if (!form.nome.trim()) {
      next.nome = 'Informe seu nome.';
    } else if (form.nome.trim().length < 2) {
      next.nome = 'Nome muito curto.';
    }
    if (!form.email.trim()) {
      next.email = 'Informe seu e-mail.';
    } else if (!EMAIL_RE.test(form.email.trim())) {
      next.email = 'Informe um e-mail válido.';
    }
    if (!form.telefone.trim()) {
      next.telefone = 'Informe seu telefone.';
    } else if (!validaTelefone(form.telefone)) {
      next.telefone = 'Informe um telefone válido.';
    }
    if (!form.precisa) {
      next.precisa = 'Selecione o que você precisa.';
    }
    if (!form.atividade) {
      next.atividade = 'Selecione uma atividade.';
    }
    if (form.atividade === 'Outros' && !form.outros.trim()) {
      next.outros = 'Nos diga qual atividade.';
    }
    if (!aceito) {
      next.aceito = 'Você precisa aceitar a Política de Privacidade.';
    }
    return next;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    setServerMsg(null);
    if (Object.keys(nextErrors).length > 0) return;

    const mensagem = `O que você precisa: ${form.precisa}. Atividade: ${form.atividade}${
      form.outros.trim() ? ` (${form.outros.trim()})` : ''
    }`;

    const interesse = form.precisa === 'Quero abrir minha empresa' ? 'abrir_empresa' : 'migracao_contabilidade';

    setEnviando(true);
    try {
      const res = await fetch(apiUrl('/api/contact/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: form.nome,
          celular: form.telefone,
          email: form.email,
          mensagem,
          origem: 'blog_lead',
          interesse,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setEnviado(true);
      } else {
        setServerMsg(data.message || 'Não foi possível enviar. Tente novamente.');
      }
    } catch {
      setServerMsg('Não foi possível enviar. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div
      className="rounded-2xl p-6 sm:p-10 shadow-xl"
      style={{ background: 'white', border: '1px solid #e5e7eb' }}
    >
      <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-3">
        Quer ajuda para abrir uma empresa ou ter um CNPJ?
      </h2>
      <p className="text-gray-600 text-sm leading-relaxed mb-6">
        O Grupo Orcoma pode ajudar você na abertura de sua empresa, deixe seus dados e nossos
        especialistas entrarão em contato.
      </p>

      {enviado ? (
        <div className="flex flex-col items-center text-center gap-3 py-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: '#22c55e' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900">Dados enviados com Sucesso!</h3>
          <p className="text-gray-500 text-sm">Em breve entraremos em contato contigo!</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Nome*</label>
            <input
              name="nome"
              value={form.nome}
              onChange={set}
              placeholder="Seu nome completo"
              className={inputClass}
              style={{ borderColor: errors.nome ? '#ef4444' : '#e5e7eb' }}
            />
            {errors.nome && <p className="mt-1 text-xs text-red-500">{errors.nome}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">E-mail*</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={set}
              placeholder="seu@email.com.br"
              className={inputClass}
              style={{ borderColor: errors.email ? '#ef4444' : '#e5e7eb' }}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Telefone*</label>
            <input
              name="telefone"
              value={form.telefone}
              onChange={set}
              placeholder="(00) 00000-0000"
              className={inputClass}
              style={{ borderColor: errors.telefone ? '#ef4444' : '#e5e7eb' }}
            />
            {errors.telefone && <p className="mt-1 text-xs text-red-500">{errors.telefone}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">O que você precisa?*</label>
            <select
              name="precisa"
              value={form.precisa}
              onChange={set}
              className={selectClass}
              style={{ borderColor: errors.precisa ? '#ef4444' : '#e5e7eb' }}
            >
              <option value="">Selecione uma opção</option>
              {PRECISA_OPTIONS.map((op) => (
                <option key={op} value={op}>{op}</option>
              ))}
            </select>
            {errors.precisa && <p className="mt-1 text-xs text-red-500">{errors.precisa}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Qual atividade você vai exercer?*</label>
            <select
              name="atividade"
              value={form.atividade}
              onChange={set}
              className={selectClass}
              style={{ borderColor: errors.atividade ? '#ef4444' : '#e5e7eb' }}
            >
              <option value="">Selecione uma atividade</option>
              {ATIVIDADE_OPTIONS.map((op) => (
                <option key={op} value={op}>{op}</option>
              ))}
            </select>
            {errors.atividade && <p className="mt-1 text-xs text-red-500">{errors.atividade}</p>}
          </div>

          {form.atividade === 'Outros' && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Nos diga qual*</label>
              <input
                name="outros"
                value={form.outros}
                onChange={set}
                placeholder="Descreva sua atividade"
                className={inputClass}
                style={{ borderColor: errors.outros ? '#ef4444' : '#e5e7eb' }}
              />
              {errors.outros && <p className="mt-1 text-xs text-red-500">{errors.outros}</p>}
            </div>
          )}

          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={aceito}
              onChange={(e) => setAceito(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded flex-shrink-0"
              style={{ accentColor: '#25D366' }}
            />
            <span className="text-xs text-gray-600">
              Li e concordo com a{' '}
              <a href="#" className="underline text-blue-700 hover:text-blue-500 transition-colors">
                Política de Privacidade
              </a>
              *
            </span>
          </label>
          {errors.aceito && <p className="mt-1 text-xs text-red-500">{errors.aceito}</p>}

          <input
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            style={{ display: 'none' }}
            aria-hidden="true"
          />

          {serverMsg && <p className="text-xs text-red-500">{serverMsg}</p>}

          <button
            type="submit"
            disabled={enviando}
            className="w-full py-3 rounded-lg text-white text-sm font-bold transition-all hover:brightness-110 disabled:opacity-70"
            style={{ background: '#22c55e' }}
          >
            {enviando ? 'Enviando...' : 'Enviar'}
          </button>
        </form>
      )}
    </div>
  );
}
