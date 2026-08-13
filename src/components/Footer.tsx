import { useState } from 'react';
import { Instagram } from 'lucide-react';
import { useNav, type Page } from '../context/NavContext';

const unidades = [
  'São Paulo – SP', 'Salvador – BA', 'Feira de Santana – BA', 'Jequié – Unidade 1 – BA',
  'Jequié – Unidade 2 – BA', 'Seabra – BA', 'Jaguaquara – BA', 'Várzea Nova – BA',
  'Maracás – BA', 'Utinga – BA', 'Itaberaba – BA', 'Itaberaba – Orcoma Pública – BA',
  'Jiquiriçá – BA', 'Campo Formoso – BA',
];

const solucoes = [
  'Abertura de empresa', 'Migração de MEI para ME', 'Migração de contabilidade',
  'Declaração de IRPF', 'Contabilidade para empresas', 'Contabilidade para setor público',
];

const especialidades = [
  'Saúde', 'Setor público', 'Terceiro setor', 'Construção civil',
  'Comércio varejista e atacadista',
];

const links = ['Home', 'Sobre', 'Fale conosco', 'Blog', 'E-books', 'Área do cliente', 'Vídeos', 'Trabalhe Conosco'];

export default function Footer() {
  const { navigate } = useNav();
  const [m7Hover, setM7Hover] = useState(false);
  const [newsEmail, setNewsEmail] = useState('');
  const [newsMsg, setNewsMsg] = useState<string | null>(null);
  const [newsStatus, setNewsStatus] = useState<'ok' | 'error' | null>(null);

  const handleNewsletter = () => {
    if (!newsEmail.trim()) {
      setNewsMsg('Informe seu e-mail');
      setNewsStatus('error');
      return;
    }
    fetch('/api/newsletter/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: newsEmail.trim(), origem: 'footer' }),
    })
      .then((res) => res.json())
      .then((data) => {
        setNewsStatus(data.status === 'ok' ? 'ok' : 'error');
        setNewsMsg(data.message || '');
        if (data.status === 'ok') setNewsEmail('');
      })
      .catch(() => {
        setNewsStatus('error');
        setNewsMsg('Não foi possível cadastrar. Tente novamente.');
      });
  };

  return (
    <footer style={{ background: '#ffffff' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <img src="/logo2.png" alt="Grupo Orcoma" className="h-12 w-auto mb-4" />
            <p className="text-gray-500 text-xs leading-relaxed mb-4">
              Há mais de 39 anos, a Orcoma ajuda empresas, profissionais e instituições a crescerem com mais segurança, organização e estratégia.
            </p>
            <p className="text-gray-500 text-xs leading-relaxed">
              Atuamos com soluções contábeis completas, atendimento próximo e presença em diversas cidades da Bahia e em São Paulo.
            </p>
            <p className="text-gray-400 text-xs mt-4 italic">
              Contabilidade feita para quem quer crescer com inteligência.
            </p>
            {/* Social */}
            <div className="flex items-center gap-3 mt-6">
              <a
                href="https://www.instagram.com/orcomacontabilidade/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:opacity-70"
                style={{ background: 'rgba(6,6,96,0.08)' }}
              >
                <Instagram size={15} color="#060660" />
              </a>
            </div>
          </div>

          {/* Unidades */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#060660' }}>
              Nossas Unidades
            </h4>
            <ul className="flex flex-col gap-2">
              {unidades.map((u) => (
                <li key={u}>
                  <a href="#" className="text-gray-500 text-xs hover:text-gray-900 transition-colors">{u}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Soluções */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#060660' }}>
              Soluções
            </h4>
            <ul className="flex flex-col gap-2 mb-8">
              {solucoes.map((s) => (
                <li key={s}>
                  <a href="#" className="text-gray-500 text-xs hover:text-gray-900 transition-colors">{s}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Especialidades + Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#060660' }}>
              Especialidades
            </h4>
            <ul className="flex flex-col gap-2 mb-8">
              {especialidades.map((e) => (
                <li key={e}>
                  <a href="#" className="text-gray-500 text-xs hover:text-gray-900 transition-colors">{e}</a>
                </li>
              ))}
            </ul>
            <ul className="flex flex-col gap-2">
              {links.map((l) => {
                const pageKey = l.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-');
                return (
                  <li key={l}>
                    <button onClick={() => navigate(pageKey as Page)} className="text-gray-500 text-xs hover:text-gray-900 transition-colors">{l}</button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-10 border-t border-gray-100 pt-8">
          <h4 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#060660' }}>
            Fique por dentro das novidades
          </h4>
          <p className="text-gray-500 text-xs leading-relaxed mb-4">
            Receba conteúdos exclusivos e convites para treinamentos antes de todo mundo.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-md">
            <input
              value={newsEmail}
              onChange={(e) => setNewsEmail(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleNewsletter(); }}
              placeholder="seuemail@empresa.com.br"
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:border-transparent"
              style={{ '--tw-ring-color': '#0c0ccc' } as React.CSSProperties}
            />
            <button
              onClick={handleNewsletter}
              className="px-5 py-2.5 rounded-lg text-white text-sm font-bold flex-shrink-0 transition-all hover:brightness-110"
              style={{ background: '#16a34a' }}
            >
              Cadastrar
            </button>
          </div>
          {newsMsg && (
            <p className={`mt-3 text-xs font-medium ${newsStatus === 'ok' ? 'text-green-600' : 'text-red-600'}`}>
              {newsMsg}
            </p>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex flex-wrap sm:flex-nowrap items-center justify-center gap-x-2 gap-y-1 text-center">
          <span className="text-gray-500 text-xs">© 2026 Orcoma Contabilidade.</span>
          <span className="text-gray-300 hidden sm:inline">|</span>
          <span className="text-gray-500 text-xs">Todos os direitos reservados</span>
          <span className="text-gray-300 hidden sm:inline">|</span>
          <a href="#" className="text-gray-500 text-xs hover:text-gray-800 transition-colors">Política de Privacidade</a>
          <span className="text-gray-300 hidden sm:inline">|</span>
          <span className="text-gray-500 text-xs">Criado com 💙 por</span>
          <span className="relative inline-block">
            <a
              href="https://www.instagram.com/agency.m7?igsh=cXY4bmVndTNuMmhk"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 text-xs hover:text-gray-800 transition-colors underline"
              onMouseEnter={() => setM7Hover(true)}
              onMouseLeave={() => setM7Hover(false)}
            >M7 Soluções de Marketing</a>
            {m7Hover && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-72 rounded-2xl overflow-hidden shadow-2xl border border-gray-200 z-50 pointer-events-none">
                <div className="bg-gradient-to-b from-green-500 via-white to-black p-5 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <img src="/m7.jpg" alt="M7" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-black text-base font-bold">M7 Soluções</p>
                    <p className="text-gray-700 text-sm">@agency.m7</p>
                  </div>
                </div>
                <div className="bg-white p-3 text-center">
                  <p className="text-xs text-gray-500">Clique para visitar o Instagram</p>
                </div>
              </div>
            )}
          </span>
          <span className="text-gray-500 text-xs"> e Desenvolvedores do Grupo Orcoma</span>
        </div>
      </div>
    </footer>
  );
}
