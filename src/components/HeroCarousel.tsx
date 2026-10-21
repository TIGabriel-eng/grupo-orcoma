import { useState, useEffect } from 'react';
import { useWhatsApp } from '../context/WhatsAppContext';
import { useNav, type Page } from '../context/NavContext';

interface CarrosselBotao {
  texto: string;
  tipo: string;
  link: string;
  // Só para tipo 'regiao': primeira pergunta da Ana no chat
  pergunta?: string;
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

const AUTOPLAY_MS = 18000;
const TRANSITION_MS = 800;

// Slides do site, fixos no código (sem consultar a API)
const SLIDES_SITE: CarrosselSlide[] = [
  {
    id: 1,
    titulo: 'Apoio especializado para uma gestão mais tranquila',
    subtitulo:
      'Nossa parceria vai te ajudar a entender melhor como estão sendo utilizados os recursos da sua gestão, permitindo o uso consciente do dinheiro público e a prestação de contas transparente.',
    imagem: '',
    foto: '',
    ordem: 1,
    botao1: { texto: 'Agende sua Reunião', tipo: 'whatsapp', link: 'https://calendly.com/orcoma/gestao' },
    botao2: { texto: 'Mais Informações', tipo: 'contato', link: '' },
  },
  {
    id: 2,
    titulo: 'Somos especialistas em gerar resultados, em gerar riqueza, usando a contabilidade',
    subtitulo:
      'Utilizamos a contabilidade de forma estratégica para otimizar recursos, identificar oportunidades e impulsionar o crescimento do seu negócio, transformando números em decisões inteligentes e resultados reais.',
    imagem: '',
    foto: 'https://jytqxtsomfdrbhxjtvpz.supabase.co/storage/v1/object/public/data/media/4f19585d64eff72c.png',
    ordem: 2,
    botao1: { texto: 'Solicitar proposta', tipo: 'whatsapp', link: '' },
    botao2: { texto: 'Saiba mais', tipo: 'pagina', link: 'sobre' },
  },
];

// Slides fixos no código: aparecem antes dos slides do site
const SLIDES_CODIGO: CarrosselSlide[] = [
  {
    id: -1,
    titulo: 'Venha abrir a sua empresa agora!',
    subtitulo:
      'Cansado de adiar o sonho de ter o seu CNPJ? Leis, taxas, documentos... a gente sabe que parece um labirinto. Na Orcoma Contabilidade, consultores especialistas te acompanham em cada etapa!',
    imagem: '/abertura.jpg',
    foto: '',
    ordem: -1,
    botao1: {
      texto: 'Abra sua empresa agora!',
      tipo: 'regiao',
      link: '',
      pergunta: 'Você deseja abrir a sua empresa! Antes de seguirmos, me fale de qual localidade você está falando?',
    },
    botao2: { texto: '', tipo: 'nenhum', link: '' },
  },
  {
    id: -2,
    titulo: 'Chega de dor de cabeça: trocar de contabilidade ficou simples',
    subtitulo:
      'Contador que some, resposta que não vem, guia que atrasa... se você já passou por isso, sabe como cansa. Mas muita gente deixa de trocar por achar que dá trabalho. Na Orcoma, nossos consultores cuidam da migração e te acompanham em cada etapa. Você só precisa dar o primeiro passo.',
    imagem: '',
    foto: '',
    ordem: -2,
    botao1: {
      texto: 'Venha conversar com a gente!',
      tipo: 'regiao',
      link: '',
      pergunta: 'Você deseja trocar de contabilidade! Antes de seguirmos, me fale de qual localidade você está falando?',
    },
    botao2: { texto: '', tipo: 'nenhum', link: '' },
  },
];

export default function HeroCarousel() {
  const { open: openWhatsApp, openRegiao } = useWhatsApp();
  const { navigate } = useNav();
  const slides = [...SLIDES_CODIGO, ...SLIDES_SITE];
  const [index, setIndex] = useState(0);

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
      case 'regiao':
        openRegiao(botao.pergunta);
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
