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

  function renderConteudo(s: CarrosselSlide) {
    const temBotoes = (s.botao1.texto && s.botao1.tipo !== 'nenhum') || (s.botao2.texto && s.botao2.tipo !== 'nenhum');
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-center px-4 sm:px-8 py-6 sm:py-8">
        {s.titulo && (
          <h2
            className="text-white font-extrabold leading-tight max-w-3xl sm:mx-auto"
            style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3.5rem)', lineHeight: '1.18', textWrap: 'balance' }}
          >
            {s.titulo}
          </h2>
        )}
        {s.subtitulo && (
          <p className="text-white/85 leading-relaxed max-w-2xl sm:mx-auto mt-4" style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}>
            {s.subtitulo}
          </p>
        )}
        {temBotoes && (
          <div className="flex flex-wrap gap-2.5 sm:gap-3 justify-center mt-6">
            {s.botao1.texto && s.botao1.tipo !== 'nenhum' && (
              <button
                type="button"
                onClick={() => handleBotao(s.botao1)}
                className="px-6 sm:px-9 py-2.5 sm:py-3.5 rounded-full font-bold tracking-widest uppercase transition-all hover:brightness-110 hover:scale-105 active:scale-100 cursor-pointer text-sm sm:text-base"
                style={{ background: '#e8b800', color: '#000' }}
              >
                {s.botao1.texto}
              </button>
            )}
            {s.botao2.texto && s.botao2.tipo !== 'nenhum' && (
              <button
                type="button"
                onClick={() => handleBotao(s.botao2)}
                className="px-6 sm:px-9 py-2.5 sm:py-3.5 rounded-full font-bold tracking-widest uppercase transition-all hover:scale-105 active:scale-100 cursor-pointer text-sm sm:text-base"
                style={{ background: 'rgba(255,255,255,0.9)', color: '#0c0ccc' }}
              >
                {s.botao2.texto}
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full flex items-center justify-center">
      <div className="relative w-full max-w-5xl mx-auto min-h-[300px] sm:min-h-[360px] overflow-hidden">
        <div
          className="slider"
          style={{
            transform: `translateX(-${index * 100}%)`,
            transitionDuration: `${TRANSITION_MS}ms`,
          }}
        >
          {slides.map((s, i) => (
            <div key={`${s.id}-${s.imagem}-${i}`} className="slider__item">
              {renderConteudo(s)}
            </div>
          ))}
        </div>
      </div>

      {slides.length > 0 && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Ir para o slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className="w-2.5 h-2.5 rounded-full transition-all"
              style={{ background: i === index ? '#e8b800' : 'rgba(255,255,255,0.4)' }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
