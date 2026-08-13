import { useState, useEffect } from 'react';
import AutoCorrigirImagem from './AutoCorrigirImagem';
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
          .filter((s: { imagem: string; foto: string }) => s.imagem || s.foto)
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

  function renderConteudo(s: CarrosselSlide) {
    const temBotoes = (s.botao1.texto && s.botao1.tipo !== 'nenhum') || (s.botao2.texto && s.botao2.tipo !== 'nenhum');
    return (
      <>
        {s.titulo && (
          <h2
            className="text-white font-extrabold leading-tight mb-2 sm:mb-3"
            style={{ fontSize: 'clamp(1.5rem, 4vw, 3rem)', lineHeight: '1.15' }}
          >
            {s.titulo}
          </h2>
        )}
        {s.subtitulo && (
          <p className="text-white/85 leading-relaxed max-w-xl mb-4 sm:mb-6" style={{ fontSize: 'clamp(0.9rem, 2vw, 1.25rem)' }}>
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

  function renderSlide(s: CarrosselSlide, i: number) {
    const temOverlay = Boolean(s.titulo || s.subtitulo || s.botao1.texto || s.botao2.texto);
    return (
      <div className="h-full relative">
        <AutoCorrigirImagem src={s.imagem || s.foto} alt={s.titulo || `Slide ${i + 1}`} />
        {temOverlay && (
          <div className="absolute inset-0 z-10 flex items-end pointer-events-none">
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.25) 45%, transparent 70%)' }}
            />
            <div className="relative max-w-3xl p-4 sm:p-10 ml-4 sm:ml-6 md:ml-16 lg:ml-24 pointer-events-auto">
              {renderConteudo(s)}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden min-h-[400px] sm:min-h-[300px]" style={{ aspectRatio: '1950 / 700' }}>
      <div
        className="flex h-full transition-transform ease-in-out"
        style={{ transform: `translateX(-${index * 100}%)`, transitionDuration: `${TRANSITION_MS}ms` }}
      >
        {slides.map((s, i) => (
          <div
            key={`${s.id}-${s.imagem}-${i}`}
            className={`w-full flex-shrink-0 h-full relative carousel-slide ${i === index ? 'ativo' : ''}`}
          >
            {renderSlide(s, i)}
          </div>
        ))}
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
