import { useEffect, useRef, useState } from 'react';
import { apiUrl } from '../config/api';
import { X } from 'lucide-react';
import OrcomaLogo from './OrcomaLogo';

interface Ebook {
  titulo: string;
  slug: string;
  descricao: string;
  downloads: number;
}

export default function MaterialsSection() {
  const [expanded, setExpanded] = useState(false);
  const [showEbooks, setShowEbooks] = useState(false);
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetch(apiUrl('/api/ebooks/'))
      .then((res) => res.json())
      .then((data) => setEbooks(Array.isArray(data.ebooks) ? data.ebooks : []))
      .catch((err) => {
        console.error('[MaterialsSection] Erro ao carregar ebooks:', err);
      });
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setExpanded(entry.isIntersecting);
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-14 sm:py-20 px-4 sm:px-9 relative overflow-visible"
      style={{ background: 'transparent' }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Logo mark */}
        <OrcomaLogo />

        <style>{`
          .card-stack {
            position: relative;
            width: 255px;
            height: 193px;
            transform: scale(1.4);
          }
          .card-stack .stack-card {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
            backface-visibility: hidden;
          }
          .card-stack .stack-card.planilha { z-index: 3; }
          .card-stack .stack-card.ebooks {
            z-index: 2;
            opacity: 0;
            transform: scale(0.85);
            pointer-events: none;
          }
          .card-stack .stack-card.treinamentos {
            z-index: 1;
            opacity: 0;
            transform: scale(0.75);
            pointer-events: none;
          }
          .card-stack.expanded .stack-card.ebooks {
            opacity: 1;
            transform: translateX(-108%) scale(1);
            pointer-events: auto;
          }
          .card-stack.expanded .stack-card.treinamentos {
            opacity: 1;
            transform: translateX(108%) scale(1);
            pointer-events: auto;
          }
          .material-link {
            display: inline-block;
            cursor: pointer;
            transition: all 0.2s ease;
            text-decoration: none;
          }
          .material-link:hover {
            transform: scale(1.05);
            text-decoration: underline;
            text-underline-offset: 4px;
          }

          /* Tablet: reduz a escala e aproxima os cards laterais para caber sem cortar */
          @media (min-width: 641px) and (max-width: 1024px) {
            .card-stack {
              transform: scale(1);
            }
            .card-stack.expanded .stack-card.ebooks {
              transform: translateX(-82%) scale(1);
            }
            .card-stack.expanded .stack-card.treinamentos {
              transform: translateX(82%) scale(1);
            }
          }

          /* Mobile: empilha os 3 cards verticalmente para caber (ex.: 360x600) */
          @media (max-width: 640px) {
            .card-stack {
              width: 100%;
              max-width: 250px;
              height: auto;
              transform: none;
            }
            .card-stack .stack-card {
              position: relative;
              inset: auto;
              width: 100%;
              height: auto;
              opacity: 1 !important;
              transform: none !important;
              pointer-events: auto !important;
              margin-bottom: 12px;
            }
            .card-stack .stack-card:last-child {
              margin-bottom: 0;
            }
          }
        `}</style>

        {/* Heading */}
        <div className="text-center mb-14 sm:mb-16">
          <h2 className="text-white text-[2.1rem] sm:text-[2.625rem] font-bold mb-3">Materiais educativos</h2>
          <p className="text-white/65 text-[1.225rem] max-w-lg mx-auto leading-relaxed">
            A Orcoma Contabilidade Inteligente preparou alguns conteúdos educativos para te ajudar.
          </p>
        </div>

        {/* Material cards - expande ao rolar até a sessão */}
        <div className="flex justify-center overflow-visible my-10 reveal">
          <div className={`card-stack ${expanded ? 'expanded' : ''}`}>
            <div
              className="stack-card ebooks rounded-2xl p-6 sm:p-7 flex flex-col gap-3"
              style={{ background: '#2341d1' }}
            >
              <button onClick={() => setShowEbooks(true)} className="material-link text-left">
                <h3 className="text-2xl font-bold text-white">E-books</h3>
              </button>
              <p className="text-sm leading-relaxed text-white/90">
                Conteúdos exclusivos para informar, orientar e impulsionar a gestão da sua empresa.
              </p>
            </div>
            <div
              className="stack-card planilha rounded-2xl p-6 sm:p-7 flex flex-col gap-3"
              style={{ background: '#ffcc32' }}
            >
              <a href="#planilha" className="material-link">
                <h3 className="text-2xl font-bold text-black">Planilha</h3>
              </a>
              <p className="text-sm leading-relaxed text-black/90">
                Ferramentas práticas para organizar números, processos e tomar melhores decisões.
              </p>
            </div>
            <div
              className="stack-card treinamentos rounded-2xl p-6 sm:p-7 flex flex-col gap-3"
              style={{ background: '#ffffff' }}
            >
              <a href="#treinamentos" className="material-link">
                <h3 className="text-2xl font-bold text-black">Treinamentos</h3>
              </a>
              <p className="text-sm leading-relaxed text-black/90">
                Capacitação e conhecimento para você e sua equipe irem mais longe.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Modal E-books */}
      {showEbooks && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(6,6,96,0.5)' }}
          onClick={() => setShowEbooks(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900">E-books disponíveis</h3>
              <button
                onClick={() => setShowEbooks(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors flex-shrink-0"
                aria-label="Fechar"
              >
                <X size={16} />
              </button>
            </div>

            {ebooks.length === 0 ? (
              <p className="text-sm text-gray-500 py-8 text-center">Nenhum ebook disponível no momento.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {ebooks.map((eb) => (
                  <div key={eb.slug} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{eb.titulo}</p>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{eb.descricao}</p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {eb.downloads} download{eb.downloads === 1 ? '' : 's'}
                      </p>
                    </div>
                    <a
                      href={apiUrl(`/api/ebooks/${eb.slug}/download/`)}
                      className="flex-shrink-0 px-4 py-2 rounded-lg text-xs font-bold text-white transition-all hover:brightness-110"
                      style={{ background: '#16a34a' }}
                    >
                      Baixar
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}