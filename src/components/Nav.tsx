import { Menu, X, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNav } from '../context/NavContext';

type NavEntry = { label: string; page: 'contato' | 'solucoes' | 'sobre' | 'login' | 'eventos' | 'blog' } | { label: string; external: string };

import { CLASSIFICADOR_URL, ERP_URL, NFE_URL } from '../config/links';

const navItems: NavEntry[] = [
  { label: 'Contato', page: 'contato' as const },
  { label: 'Soluções', page: 'solucoes' as const },
  { label: 'Sobre', page: 'sobre' as const },
  { label: 'Login', page: 'login' as const },
  { label: 'Eventos', page: 'eventos' as const },
  { label: 'Blog', page: 'blog' as const },
  { label: 'Reforma Tributária', external: 'https://diagnostico.orcomacontabilidade.com.br/' },
];

export default function Nav() {
  const { navigate, page } = useNav();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [contatoOpen, setContatoOpen] = useState(false);
  const [eventosOpen, setEventosOpen] = useState(false);
  const loginDropdownRef = useRef<HTMLDivElement>(null);
  const contatoDropdownRef = useRef<HTMLDivElement>(null);
  // Refs do menu mobile: sem eles, o clique num submenu mobile fecha o submenu
  // no mousedown (o dropdown do desktop, escondido, é o único ref checado) e o click não chega.
  const loginMobileRef = useRef<HTMLDivElement>(null);
  const contatoMobileRef = useRef<HTMLDivElement>(null);
  const eventosDropdownRef = useRef<HTMLDivElement>(null);
  const eventosMobileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function clicouDentro(refs: React.RefObject<HTMLDivElement>[], alvo: Node) {
      return refs.some((r) => r.current?.contains(alvo));
    }
    function handleClickOutside(e: MouseEvent) {
      const alvo = e.target as Node;
      if (!clicouDentro([loginDropdownRef, loginMobileRef], alvo)) {
        setLoginOpen(false);
      }
      if (!clicouDentro([contatoDropdownRef, contatoMobileRef], alvo)) {
        setContatoOpen(false);
      }
      if (!clicouDentro([eventosDropdownRef, eventosMobileRef], alvo)) {
        setEventosOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="relative flex items-center justify-center px-4 sm:px-8 py-4 sm:py-5 min-h-[5.5rem] sm:min-h-[6.5rem]">
      <div className="w-full max-w-[110rem] flex items-center justify-between gap-3 relative">
      <button className="flex-shrink-0 xl:mr-3 2xl:mr-0 ml-2" onClick={() => navigate('home')}>
        <img src="/grupo-orcoma-logo.png" alt="Grupo Orcoma" className="h-12 sm:h-16 w-auto" style={{ transform: 'scale(1.26)' }} />
      </button>

      <nav className="hidden xl:flex items-center rounded-full px-2 2xl:px-6 py-0.5 gap-0 2xl:gap-1 min-w-0" style={{ background: 'rgba(100, 160, 255, 0.3)' }}>
        {navItems.map((item) => {
          if ('external' in item) {
            return (
              <button
                key={item.label}
                onClick={() => { window.open(item.external, '_blank'); }}
                className="px-2.5 2xl:px-4 py-1.5 text-[1rem] 2xl:text-[1.26rem] whitespace-nowrap font-semibold rounded-full transition-colors hover:bg-white/10 relative"
                style={{ color: 'white' }}
              >
                {item.label}
              </button>
            );
          }
          const navPage = item.page;
          if (item.label === 'Contato') {
            const isContatoActive = navPage === page || page === 'trabalhe-conosco';
            return (
              <div key={item.label} className="relative" ref={contatoDropdownRef}>
                <button
                  onClick={() => setContatoOpen(!contatoOpen)}
                  className="px-2.5 2xl:px-4 py-1.5 text-[1rem] 2xl:text-[1.26rem] whitespace-nowrap font-semibold rounded-full transition-colors hover:bg-white/10 relative flex items-center gap-1"
                  style={{ color: 'white' }}
                >
                  {item.label}
                  <ChevronDown size={22} className={`transition-transform ${contatoOpen ? 'rotate-180' : ''}`} />
                  {isContatoActive && (
                    <span
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full"
                      style={{ background: '#e8b800' }}
                    />
                  )}
                </button>
                {contatoOpen && (
                  <div
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 rounded-2xl shadow-2xl py-3 z-50"
                    style={{ background: 'white', border: '1px solid #e5e7eb' }}
                  >
                    <style>{`
                      @keyframes fadeSlideIn {
                        from { opacity: 0; transform: translateY(-8px); }
                        to { opacity: 1; transform: translateY(0); }
                      }
                      .sub-item {
                        animation: fadeSlideIn 0.3s ease-out both;
                      }
                    `}</style>
                    <button
                      onClick={() => { navigate('contato'); setContatoOpen(false); }}
                      className="sub-item w-full text-left px-5 py-2.5 text-lg font-medium transition-colors hover:bg-gray-100"
                      style={{ color: '#1f2937' }}
                    >
                      Contato
                    </button>
                    <button
                      onClick={() => { navigate('trabalhe-conosco'); setContatoOpen(false); }}
                      className="sub-item w-full text-left px-5 py-2.5 text-lg font-medium transition-colors hover:bg-gray-100"
                      style={{ color: '#1f2937', animationDelay: '0.1s' }}
                    >
                      Trabalhe Conosco
                    </button>
                  </div>
                )}
              </div>
            );
          }
          if (item.label === 'Eventos') {
            const isEventosActive = navPage === page || page === 'orcoma-day';
            return (
              <div key={item.label} className="relative" ref={eventosDropdownRef}>
                <button
                  onClick={() => setEventosOpen(!eventosOpen)}
                  className="px-2.5 2xl:px-4 py-1.5 text-[1rem] 2xl:text-[1.26rem] whitespace-nowrap font-semibold rounded-full transition-colors hover:bg-white/10 relative flex items-center gap-1"
                  style={{ color: 'white' }}
                >
                  {item.label}
                  <ChevronDown size={22} className={`transition-transform ${eventosOpen ? 'rotate-180' : ''}`} />
                  {isEventosActive && (
                    <span
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full"
                      style={{ background: '#e8b800' }}
                    />
                  )}
                </button>
                {eventosOpen && (
                  <div
                    className="absolute top-full right-0 mt-2 w-56 rounded-2xl shadow-2xl py-3 z-50"
                    style={{ background: 'white', border: '1px solid #e5e7eb' }}
                  >
                    <style>{`
                      @keyframes fadeSlideIn {
                        from { opacity: 0; transform: translateY(-8px); }
                        to { opacity: 1; transform: translateY(0); }
                      }
                      .sub-item {
                        animation: fadeSlideIn 0.3s ease-out both;
                      }
                    `}</style>
                    <button
                      onClick={() => { navigate('orcoma-day'); setEventosOpen(false); }}
                      className="sub-item w-full text-left px-5 py-2.5 text-sm font-medium transition-colors hover:bg-gray-100"
                      style={{ color: '#1f2937' }}
                    >
                      Orcoma Day
                    </button>
                  </div>
                )}
              </div>
            );
          }
          if (item.label === 'Login') {
            return (
              <div key={item.label} className="relative" ref={loginDropdownRef}>
                <button
                  onClick={() => setLoginOpen(!loginOpen)}
                  className="px-2.5 2xl:px-4 py-1.5 text-[1rem] 2xl:text-[1.26rem] whitespace-nowrap font-semibold rounded-full transition-colors hover:bg-white/10 relative flex items-center gap-1"
                  style={{ color: 'white' }}
                >
                  {item.label}
                  <ChevronDown size={22} className={`transition-transform ${loginOpen ? 'rotate-180' : ''}`} />
                  {item.page === page && (
                    <span
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full"
                      style={{ background: '#e8b800' }}
                    />
                  )}
                </button>
                {loginOpen && (
                  <div
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 rounded-2xl shadow-2xl py-3 z-50"
                    style={{ background: 'white', border: '1px solid #e5e7eb' }}
                  >
                    <style>{`
                      @keyframes fadeSlideIn {
                        from { opacity: 0; transform: translateY(-8px); }
                        to { opacity: 1; transform: translateY(0); }
                      }
                      .sub-item {
                        animation: fadeSlideIn 0.3s ease-out both;
                      }
                    `}</style>
                    <button
                      onClick={() => { navigate('academy-business'); setLoginOpen(false); }}
                      className="sub-item w-full text-left px-5 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors font-medium"
                    >
                      Orcoma Academy Business
                    </button>
                    <button
                      onClick={() => { window.open(ERP_URL, '_blank', 'noopener,noreferrer'); setLoginOpen(false); }}
                      className="sub-item w-full text-left px-5 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors font-medium"
                    >
                      ERP
                    </button>
                    <button
                      onClick={() => { window.open(NFE_URL, '_blank', 'noopener,noreferrer'); setLoginOpen(false); }}
                      className="sub-item w-full text-left px-5 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors font-medium"
                    >
                      NFE
                    </button>
                    <button
                      onClick={() => { window.open(CLASSIFICADOR_URL, '_blank', 'noopener,noreferrer'); setLoginOpen(false); }}
                      className="sub-item w-full text-left px-5 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors font-medium"
                    >
                      Classificador Tributário
                    </button>
                  </div>
                )}
              </div>
            );
          }
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.page)}
              className="px-2.5 2xl:px-4 py-1.5 text-[1rem] 2xl:text-[1.26rem] whitespace-nowrap font-semibold rounded-full transition-colors hover:bg-white/10 relative"
              style={{ color: 'white' }}
            >
              {item.label}
              {item.page === page && (
                <span
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full"
                  style={{ background: '#e8b800' }}
                />
              )}
            </button>
          );
        })}
      </nav>

      <div className="hidden xl:flex items-center gap-1 flex-shrink-0">
        <button
          onClick={() => window.open('https://academy.orcomacontabilidade.com.br/login', '_blank')}
          className="px-4 2xl:px-5 py-2 rounded-full text-[1rem] 2xl:text-[1.26rem] whitespace-nowrap font-semibold transition-all hover:brightness-110 relative"
          style={{ background: 'rgba(100, 160, 255, 0.3)', color: 'white' }}
        >
          Orcoma Academy
        </button>
      </div>

      <button className="xl:hidden text-white p-2 flex-shrink-0 ml-auto" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      </div>

      {mobileOpen && (
        <nav
          className="xl:hidden absolute top-full left-0 right-0 flex flex-col items-center gap-2 pb-4 z-50"
          style={{ background: 'rgba(10,10,180,0.97)' }}
        >
          {navItems.map((item) => {
            if ('external' in item) {
              return (
                <button
                  key={item.label}
                  onClick={() => { window.open(item.external, '_blank'); setMobileOpen(false); }}
                  className="text-white text-[1.4rem] font-medium px-6 py-2 rounded-full hover:bg-white/10 transition-colors w-full text-center"
                >
                  {item.label}
                </button>
              );
            }
            if (item.label === 'Contato') {
              return (
              <div key={item.label} className="w-full flex flex-col items-center" ref={contatoMobileRef}>
                <button
                  onClick={() => setContatoOpen(!contatoOpen)}
                  className="text-white text-[1.4rem] font-medium px-6 py-2 rounded-full hover:bg-white/10 transition-colors w-full text-center flex items-center justify-center gap-1"
                >
                  {item.label}
                  <ChevronDown size={22} className={`transition-transform ${contatoOpen ? 'rotate-180' : ''}`} />
                </button>
                {contatoOpen && (
                  <>
                    <button
                      onClick={() => { navigate('contato'); setMobileOpen(false); setContatoOpen(false); }}
                      className="text-white/80 text-lg font-medium px-6 py-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                      Contato
                    </button>
                    <button
                      onClick={() => { navigate('trabalhe-conosco'); setMobileOpen(false); setContatoOpen(false); }}
                      className="text-white/80 text-lg font-medium px-6 py-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                      Trabalhe Conosco
                    </button>
                  </>
                )}
              </div>
            );
            }
            if (item.label === 'Eventos') {
              return (
              <div key={item.label} className="w-full flex flex-col items-center" ref={eventosMobileRef}>
                <button
                  onClick={() => setEventosOpen(!eventosOpen)}
                  className="text-white text-[1.4rem] font-medium px-6 py-2 rounded-full hover:bg-white/10 transition-colors w-full text-center flex items-center justify-center gap-1"
                >
                  {item.label}
                  <ChevronDown size={22} className={`transition-transform ${eventosOpen ? 'rotate-180' : ''}`} />
                </button>
                {eventosOpen && (
                  <button
                    onClick={() => { navigate('orcoma-day'); setMobileOpen(false); setEventosOpen(false); }}
                    className="text-white/80 text-lg font-medium px-6 py-2 rounded-full hover:bg-white/10 transition-colors"
                  >
                    Orcoma Day
                  </button>
                )}
              </div>
            );
            }
            if (item.label === 'Login') {
              return (
              <div key={item.label} className="w-full flex flex-col items-center" ref={loginMobileRef}>
                <button
                  onClick={() => setLoginOpen(!loginOpen)}
                  className="text-white text-[1.4rem] font-medium px-6 py-2 rounded-full hover:bg-white/10 transition-colors w-full text-center flex items-center justify-center gap-1"
                >
                  {item.label}
                  <ChevronDown size={22} className={`transition-transform ${loginOpen ? 'rotate-180' : ''}`} />
                </button>
                {loginOpen && (
                  <button
                    onClick={() => { navigate('academy-business'); setMobileOpen(false); setLoginOpen(false); }}
                    className="text-white/80 text-lg font-medium px-6 py-2 rounded-full hover:bg-white/10 transition-colors"
                  >
                    Orcoma Academy Business
                  </button>
                )}
                {loginOpen && (
                  <button
                    onClick={() => { window.open(ERP_URL, '_blank', 'noopener,noreferrer'); setMobileOpen(false); setLoginOpen(false); }}
                    className="text-white/80 text-lg font-medium px-6 py-2 rounded-full hover:bg-white/10 transition-colors"
                  >
                    ERP
                  </button>
                )}
                {loginOpen && (
                  <button
                    onClick={() => { window.open(NFE_URL, '_blank', 'noopener,noreferrer'); setMobileOpen(false); setLoginOpen(false); }}
                    className="text-white/80 text-lg font-medium px-6 py-2 rounded-full hover:bg-white/10 transition-colors"
                  >
                    NFE
                  </button>
                )}
              </div>
            );
            }
            return (
              <button
                key={item.label}
                onClick={() => { navigate(item.page); setMobileOpen(false); }}
                className="text-white text-[1.4rem] font-medium px-6 py-2 rounded-full hover:bg-white/10 transition-colors w-full text-center"
              >
                {item.label}
              </button>
            );
          })}
          <button
            onClick={() => { window.open('https://academy.orcomacontabilidade.com.br/login', '_blank'); setMobileOpen(false); }}
            className="mt-2 px-6 py-2 rounded-full text-white text-[1.4rem] font-semibold border border-white/30 hover:bg-white/10 transition-colors"
          >
            Orcoma Academy
          </button>
        </nav>
      )}
    </header>
  );
}
