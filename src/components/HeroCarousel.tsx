import { useState, useEffect } from 'react';
import { useWhatsApp } from '../context/WhatsAppContext';
import { useNav, type Page } from '../context/NavContext';

interface CarrosselBotao {
  texto: string;
  tipo: string;
  link: string;
}

interface CarrosselSlide {
  id: number;
  titulo: string;
  subtitulo: string;
  imagem: string;
  foto: string;
  ordem: number;
  botao1: CarrosselBotao;
  botao2: CarrosselBotao;
}

const PAGE_KEYS: Page[] = ['home', 'contato', 'solucoes', 'sobre', 'login', 'eventos', 'trabalhe-conosco', 'blog', 'blog-post', 'especialidades'];

const AUTOPLAY_MS = 8000;
const TRANSITION_MS = 800;

export default function HeroCarousel() {
  const { open: openWhatsApp } = useWhatsApp();
  const { navigate } = useNav();
  const [slides, setSlides] = useState<CarrosselSlide[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/carrossel/')
      .then((res) => res.json())
      .then((data) => {
        const list: CarrosselSlide[] = (data.slides || [])
          .filter((s: CarrosselSlide) => s.titulo || s.subtitulo || s.botao1?.texto || s.botao2?.texto)
          .map((s: CarrosselSlide) => ({
            id: s.id,
            titulo: s.titulo || '',
            subtitulo: s.subtitulo || '',
            imagem: s.imagem,
            foto: s.foto || '',
            ordem: s.ordem,
            botao1: { texto: s.botao1?.texto || '', tipo: s.botao1?.tipo || 'nenhum', link: s.botao1?.link || '' },
            botao2: { texto: s.botao2?.texto || '', tipo: s.botao2?.tipo || 'nenhum', link: s.botao2?.link || '' },
          }));
        if (!cancelled && list.length > 0) {
          setSlides(list);
          setIndex(0);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(interval);
  }, [slides.length]);

  function handleBotao(botao: CarrosselBotao) {
    switch (botao.tipo) {
      case 'whatsapp':
        openWhatsApp();
        break;
      case 'contato':
        navigate('contato');
        break;
      case 'pagina':
        if (botao.link && (PAGE_KEYS as string[]).includes(botao.link)) {
          navigate(botao.link as Page);
        }
        break;
      case 'externo':
        if (botao.link) window.open(botao.link, '_blank', 'noopener,noreferrer');
        break;
      default:
        break;
    }
  }

  function tamanhoTitulo(titulo: string) {
    const len = Math.max(titulo.length, 1);
    const pxQueCabeEmDuasLinhas = 2600 / len;
    const px = Math.min(67.2, Math.max(33.6, pxQueCabeEmDuasLinhas));
    return `${(px / 16).toFixed(2)}rem`;
  }

  function renderConteudo(s: CarrosselSlide) {
    const temBotoes = (s.botao1.texto && s.botao1.tipo !== 'nenhum') || (s.botao2.texto && s.botao2.tipo !== 'nenhum');
    return (
      <>
        {s.titulo && (
          <h2
            className="text-white font-extrabold leading-tight mb-2 sm:mb-3"
            style={{ fontSize: tamanhoTitulo(s.titulo), lineHeight: '1.15', textWrap: 'balance' }}
          >
            {s.titulo}
          </h2>
        )}
        {s.subtitulo && (
          <p className="text-white/85 leading-relaxed max-w-xl mb-4 sm:mb-6" style={{ fontSize: 'clamp(1.26rem, 2.8vw, 1.75rem)' }}>
            {s.subtitulo}
          </p>
        )}
        {temBotoes && (
          <div className="flex flex-wrap gap-3">
            {s.botao1.texto && s.botao1.tipo !== 'nenhum' && (
              <button
                type="button"
                onClick={() => handleBotao(s.botao1)}
                className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold tracking-widest uppercase transition-all hover:brightness-110 hover:scale-105 active:scale-100 cursor-pointer"
                style={{ background: '#e8b800', color: '#000' }}
              >
                {s.botao1.texto}
              </button>
            )}
            {s.botao2.texto && s.botao2.tipo !== 'nenhum' && (
              <button
                type="button"
                onClick={() => handleBotao(s.botao2)}
                className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold tracking-widest uppercase transition-all hover:scale-105 active:scale-100 cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.9)', color: '#0c0ccc' }}
              >
                {s.botao2.texto}
              </button>
            )}
          </div>
        )}
      </>
    );
  }

  return (
    <div className="relative w-full overflow-hidden min-h-[400px] sm:min-h-[300px]" style={{ aspectRatio: '1950 / 700' }}>
      <div className="flex h-full w-full flex-col">
        {/* Carrossel de texto - largura total */}
        <div className="relative z-10 flex items-center w-full flex-1">
          <div
            className="flex h-full transition-transform ease-in-out"
            style={{ transform: `translateX(-${index * 100}%)`, transitionDuration: `${TRANSITION_MS}ms` }}
          >
            {slides.map((s, i) => (
              <div
                key={`${s.id}-${s.imagem}-${i}`}
                className={`w-full flex-shrink-0 h-full flex items-center carousel-slide ${i === index ? 'ativo' : ''}`}
              >
                <div className="w-full max-w-3xl px-6 py-8 sm:p-10 mx-auto md:translate-x-16 lg:translate-x-28 xl:translate-x-36 text-center flex flex-col items-center">
                  {renderConteudo(s)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {slides.length > 0 && (
        <>
          <button
            type="button"
            aria-label="Anterior"
            onClick={() => setIndex((index - 1 + slides.length) % slides.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 text-white text-lg flex items-center justify-center hover:bg-black/70"
          >
            &#8249;
          </button>
          <button
            type="button"
            aria-label="Próximo"
            onClick={() => setIndex((index + 1) % slides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 text-white text-lg flex items-center justify-center hover:bg-black/70"
          >
            &#8250;
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Ir para o slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className="w-2.5 h-2.5 rounded-full transition-all"
                style={{ background: i === index ? '#fff' : 'rgba(255,255,255,0.4)' }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
