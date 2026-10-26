import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import PageNav from '../components/PageNav';
import Footer from '../components/Footer';
import WhatsAppToggle from '../components/WhatsAppToggle';
import { loadSiteData } from '../config/siteData';
import { apiUrl } from '../config/api';
import { Skeleton } from '../components/Skeleton';


interface EventoOrcomaDay {
  titulo: string;
  descricao: string;
  local: string;
  data: string;
  data_completa?: string;
  data_inicio_iso?: string;
  imagem: string;
  link_inscricao: string;
}

// Fotos do Orcoma Day, em public/orcoma-day/ (WebP): 01.webp até 17.webp
const FOTOS = Array.from({ length: 17 }, (_, i) => i + 1)
  .filter((n) => n !== 14)
  .map((n) => ({
  src: `/orcoma-day/${String(n).padStart(2, '0')}.webp`,
  alt: `Foto ${n} do Orcoma Day`,
}));

// Loop infinito: as fotos aparecem duas vezes e a faixa anda até a metade,
// que é exatamente uma cópia completa, então a volta é invisível.
function CarrosselFotos({ fotos }: { fotos: { src: string; alt: string }[] }) {
  const faixa = [...fotos, ...fotos];

  return (
    <div className="orcoma-day-carrossel overflow-hidden">
      <style>{`
        @keyframes orcomaDayLoop {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .orcoma-day-faixa {
          animation: orcomaDayLoop 50s linear infinite;
        }
        .orcoma-day-carrossel:hover .orcoma-day-faixa {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .orcoma-day-faixa { animation: none; }
        }
      `}</style>
      {/* Duração proporcional ao número de fotos: a velocidade continua a mesma de quando eram 7 */}
      <div className="orcoma-day-faixa flex w-max" style={{ animationDuration: `${fotos.length * 7}s` }}>
        {faixa.map((foto, i) => (
          <div key={i} className="flex-shrink-0 w-[80vw] sm:w-[60vw] lg:w-[48rem] px-2 sm:px-3">
            <img
              src={foto.src}
              alt={foto.alt}
              loading="lazy"
              decoding="async"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              className="w-full aspect-[3/2] object-cover rounded-2xl shadow-lg select-none pointer-events-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function CardEvento({ ev, passado = false }: { ev: EventoOrcomaDay; passado?: boolean }) {
  return (
    <div className="group w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col">
      <div className="relative">
        {ev.imagem ? (
          <img
            src={ev.imagem}
            alt={ev.titulo}
            loading="lazy"
            decoding="async"
            className={`w-full h-auto block transition duration-300 ${passado ? 'grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100' : ''}`}
          />
        ) : (
          <div className="w-full flex items-center justify-center text-gray-400 text-xs font-semibold uppercase tracking-wider bg-gray-100" style={{ height: '260px' }}>
            Grupo Orcoma
          </div>
        )}
        <span
          className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold"
          style={passado ? { background: '#d1d5db', color: '#374151' } : { background: '#e8b800', color: '#000' }}
        >
          {ev.data}
        </span>
        {/* Faixa diagonal "GRATUITO" no canto superior direito, em todos os eventos */}
        <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden pointer-events-none z-10">
          <span
            className="absolute right-[-38px] top-[20px] w-36 rotate-45 bg-green-600 text-white text-[11px] font-bold tracking-wider text-center py-1 shadow-md"
          >
            GRATUITO
          </span>
        </div>
      </div>
      <div className="p-4 sm:p-5 flex flex-col gap-2 flex-1">
        <h3 className="font-bold text-gray-900 text-sm leading-snug">{ev.titulo}</h3>
        <div className="flex items-center gap-1.5 text-gray-400">
          <MapPin size={12} />
          <span className="text-xs">{ev.local}</span>
        </div>
        <p className="text-gray-500 text-xs leading-relaxed flex-1">{ev.descricao}</p>
        {!passado && ev.link_inscricao && (
          <button
            onClick={() => window.open(ev.link_inscricao, '_blank', 'noopener,noreferrer')}
            className="w-full mt-2 py-2.5 rounded-xl text-white text-xs font-bold transition-all hover:brightness-110"
            style={{ background: 'linear-gradient(135deg, #e4d0a8 0%, #906b48 100%)' }}
          >
            Inscrever-se
          </button>
        )}
      </div>
    </div>
  );
}

// Espaço entre os cards do carrossel (igual ao gap-6 do grid)
const GAP_CARDS = 24;

// Carrossel de eventos: 2 cards por vez no desktop, 1 no celular.
// As setas rolam o trilho; o scroll-snap alinha cada card na borda.
function CarrosselEventos({
  titulo,
  eventos,
  carregando = false,
  passado = false,
}: {
  titulo: string;
  eventos: EventoOrcomaDay[];
  carregando?: boolean;
  passado?: boolean;
}) {
  const trilhoRef = useRef<HTMLDivElement>(null);
  const [podeVoltar, setPodeVoltar] = useState(false);
  const [podeAvancar, setPodeAvancar] = useState(false);

  const atualizarSetas = useCallback(() => {
    const trilho = trilhoRef.current;
    if (!trilho) return;
    const maximo = trilho.scrollWidth - trilho.clientWidth;
    setPodeVoltar(trilho.scrollLeft > 2);
    setPodeAvancar(trilho.scrollLeft < maximo - 2);
  }, []);

  useEffect(() => {
    atualizarSetas();
    window.addEventListener('resize', atualizarSetas);
    return () => window.removeEventListener('resize', atualizarSetas);
  }, [atualizarSetas, eventos]);

  const mover = (direcao: 1 | -1) => {
    const trilho = trilhoRef.current;
    if (!trilho) return;
    const primeiro = trilho.firstElementChild as HTMLElement | null;
    const passo = primeiro ? primeiro.offsetWidth + GAP_CARDS : trilho.clientWidth;
    trilho.scrollBy({ left: direcao * passo, behavior: 'smooth' });
  };

  const cabecalho = (
    <div className="flex items-center justify-between gap-4 mb-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{titulo}</h2>
      {(podeVoltar || podeAvancar) && (
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            aria-label="Ver eventos anteriores"
            onClick={() => mover(-1)}
            disabled={!podeVoltar}
            className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-700 transition hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            aria-label="Ver próximos eventos"
            onClick={() => mover(1)}
            disabled={!podeAvancar}
            className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-700 transition hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );

  if (carregando) {
    return (
      <>
        {cabecalho}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[0, 1].map((i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col">
              <Skeleton className="h-40 w-full rounded-none" />
              <div className="p-4 sm:p-5 flex flex-col gap-3 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-9 w-full rounded-xl mt-1" />
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  if (eventos.length === 0) {
    return (
      <>
        {cabecalho}
        <p className="text-center text-gray-500 py-8">Nenhum evento agendado no momento.</p>
      </>
    );
  }

  return (
    <>
      {cabecalho}
      <div
        ref={trilhoRef}
        onScroll={atualizarSetas}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 pt-1 px-1 -mx-1 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none' }}
      >
        {eventos.map((ev) => (
          <div key={ev.titulo} className="snap-start shrink-0 flex w-full md:w-[calc(50%-0.75rem)]">
            <CardEvento ev={ev} passado={passado} />
          </div>
        ))}
      </div>
    </>
  );
}

// Fundo dos cards de números (mesmo degradê da galeria)
const DEGRADE_CARD =
  'radial-gradient(circle at 25% 0%, #1e1e1d 0%, rgba(30, 30, 29, 0) 50%), radial-gradient(circle at 0% 100%, rgba(137, 99, 64, 0.95) 0%, rgba(137, 99, 64, 0) 55%), radial-gradient(circle at 100% 30%, #d2bf95 0%, rgba(210, 191, 149, 0) 60%), radial-gradient(circle at 85% 100%, rgba(230, 230, 230, 0.9) 0%, rgba(230, 230, 230, 0) 45%), linear-gradient(135deg, #8a7a6a 0%, #4a4540 100%)';

// Posição "fechada" do recorte de cada direção: o cartão aparece ao longo dessa direção
const RECORTE_FECHADO = {
  'de-cima': 'inset(0 0 100% 0)',
  'de-baixo': 'inset(100% 0 0 0)',
  esquerda: 'inset(0 100% 0 0)',
} as const;

// Cartão que se revela na direção indicada quando entra na tela
function CartaoRevelar({
  direcao,
  className,
  style,
  children,
}: {
  direcao: keyof typeof RECORTE_FECHADO;
  className: string;
  style: CSSProperties;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const elemento = ref.current;
    if (!elemento) return;
    const observer = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisivel(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(elemento);
    return () => observer.disconnect();
  }, []);

  // O observador fica no wrapper sem recorte, porque o clip-path pode impedir o disparo no próprio cartão
  return (
    <div ref={ref} className="h-full">
      <div
        className={`h-full ${className}`}
        style={{
          ...style,
          clipPath: visivel ? 'inset(0 0 0 0)' : RECORTE_FECHADO[direcao],
          opacity: visivel ? 1 : 0.4,
          transition: 'clip-path 1.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 1.2s ease-out',
        }}
      >
        {children}
      </div>
    </div>
  );
}

const MESES = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
];

// Sem a data/hora da API (snapshot do build), usa o dia de "15 de setembro de 2026":
// o evento só sai de "Próximos" depois desse dia, já que a hora não vem nesse formato.
function inicioDoEvento(ev: EventoOrcomaDay): number | null {
  if (ev.data_inicio_iso) return new Date(ev.data_inicio_iso).getTime();

  const partes = ev.data_completa?.match(/^(\d{1,2}) de (.+) de (\d{4})$/);
  const mes = partes ? MESES.indexOf(partes[2].toLowerCase()) : -1;
  if (!partes || mes < 0) return null;

  return new Date(Number(partes[3]), mes, Number(partes[1]), 23, 59, 59).getTime();
}

export default function OrcomaDayPage() {
  const [eventos, setEventos] = useState<EventoOrcomaDay[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [agora, setAgora] = useState(() => Date.now());
  const [videoFundoSrc, setVideoFundoSrc] = useState<string | undefined>(undefined);

  // Pede ao backend um link temporário para o vídeo de fundo (expira em 1 hora)
  useEffect(() => {
    fetch(apiUrl('/api/video/orcoma-day-bg.mp4/link/'))
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'ok') setVideoFundoSrc(data.url);
      })
      .catch((err) => {
        console.error('[OrcomaDayPage] Erro ao carregar o vídeo de fundo:', err);
      });
  }, []);

  useEffect(() => {
    let ativo = true;
    loadSiteData<{ eventos?: EventoOrcomaDay[] }>('/api/eventos/', 'eventos.json', (data) => {
      if (ativo) setEventos(Array.isArray(data.eventos) ? data.eventos : []);
    })
      .catch((err) => {
        console.error('[OrcomaDayPage] Erro ao carregar eventos:', err);
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });
    return () => {
      ativo = false;
    };
  }, []);

  // Atualiza o "agora" a cada minuto, para o evento mudar de seção sem recarregar a página
  useEffect(() => {
    const timer = setInterval(() => setAgora(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  const proximos = eventos.filter((ev) => {
    const inicio = inicioDoEvento(ev);
    return inicio === null || inicio >= agora;
  });
  // Mais recente primeiro
  const passados = eventos
    .filter((ev) => {
      const inicio = inicioDoEvento(ev);
      return inicio !== null && inicio < agora;
    })
    .reverse();

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <div className="relative overflow-hidden flex flex-col min-h-[85svh] md:min-h-[95svh] xl:min-h-screen" style={{ background: '#1e1e1d' }}>
        {/* Vídeo de fundo: sem áudio, em loop, com véu da cor da página a 70% de opacidade (30% de transparência) */}
        <video
          src={videoFundoSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
        />
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: 'rgba(30, 30, 29, 0.7)' }} />

        <div className="relative z-50">
          <PageNav activePage="orcoma-day" showConsultor={false} />
        </div>

        <section className="relative z-10 flex flex-1 flex-col items-center justify-center text-center px-4 sm:px-6 pt-10 sm:pt-12 pb-16 sm:pb-20">
          <h1
            className="text-white font-extrabold leading-tight w-full mb-4"
            style={{ fontSize: 'clamp(2.24rem, 5.6vw, 3.64rem)', lineHeight: '1.2' }}
          >
            <span className="block max-w-2xl mx-auto">Acompanhe os melhores momentos do nosso</span>
            <img
              src="/orcoma-day.avif"
              alt="Orcoma Day!"
              className="block mx-auto mt-6 w-[88vw] sm:w-[75vw] md:w-[60vw] lg:w-[48rem] xl:w-[52rem] 2xl:w-[60rem] max-w-full h-auto"
            />
          </h1>

          <a
            href="https://inscricoesday.orcomacontabilidade.com.br/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden mt-10 inline-flex items-center gap-5 px-12 py-5 rounded-xl text-white text-base sm:text-lg transition hover:scale-[1.02]"
            style={{ background: 'linear-gradient(135deg, #e4d0a8 0%, #906b48 100%)' }}
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100"
              style={{ background: 'radial-gradient(ellipse at 50% 0%, #1c1b19 0%, #3a3733 55%, #6e6558 100%)' }}
            />
            <span className="relative z-10">Quero participar.</span>
            <ArrowUpRight size={34} className="relative z-10" />
          </a>
        </section>
      </div>

      {/* ── Próximos eventos (vindos do Django) ── */}
      <section className="bg-white pt-12 sm:pt-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <CarrosselEventos titulo="Próximas Edições" eventos={proximos} carregando={carregando} />
        </div>
      </section>

      {/* ── Eventos passados (saem de "Próximos" quando o horário do evento passa) ── */}
      {!carregando && passados.length > 0 && (
        <section className="bg-white pt-12 sm:pt-16 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <CarrosselEventos titulo="Eventos Passados" eventos={passados} passado />
          </div>
        </section>
      )}

      {/* ── Vídeo ── */}
      <section className="bg-white pt-12 sm:pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-8">
          <h1 className="text-center text-[1.5rem] sm:text-[1.75rem] font-normal leading-relaxed" style={{ fontFamily: 'Poppins', color: '#1e1e1d' }}>
              Reviva os melhores momentos do nosso maior evento sobre{' '}
              <em className="not-italic font-bold" style={{ color: '#e8b800' }}>Reforma Tributária</em> e{' '}
              <em className="not-italic font-bold" style={{ color: '#e8b800' }}>Gestão Empresarial</em> e descubra como conhecimento, estratégia e inovação se transformam em oportunidades reais para o sucesso dos negócios.
          </h1>
        </div>
        <div className="w-full bg-black py-4 sm:py-6 px-3 sm:px-6 shadow-lg">
          <video
            src="/videos/after-pocoes.mp4"
            poster="/videos/orcoma-day-capa.webp"
            controls
            controlsList="nodownload noremoteplayback"
            disablePictureInPicture
            onContextMenu={(e) => e.preventDefault()}
            playsInline
            preload="metadata"
            className="w-full max-w-6xl h-auto block mx-auto bg-black rounded-2xl"
          />
        </div>
      </section>

      {/* ── Nossos parceiros ── */}
      <section
        className="relative overflow-hidden flex items-center px-6 sm:px-12 py-24 sm:py-32 lg:py-40 min-h-[50svh] lg:min-h-[60svh]"
        style={{
          background:
            'radial-gradient(circle at 50% 0%, #1e1e1d 0%, rgba(30, 30, 29, 0) 45%), radial-gradient(circle at 0% 100%, rgba(137, 99, 64, 0.95) 0%, rgba(137, 99, 64, 0) 55%), radial-gradient(circle at 100% 70%, #d2bf95 0%, rgba(210, 191, 149, 0) 55%), linear-gradient(135deg, #b9b1a6 0%, #6b6259 60%, #4a4540 100%)',
        }}
      >
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <h2 className="text-white text-5xl sm:text-6xl lg:text-7xl font-normal leading-tight sm:pl-8 lg:pl-16" style={{ fontFamily: 'Montserrat' }}>
            Nossos
            <br />
            parceiros
          </h2>
          <p className="text-white text-base sm:text-lg lg:text-xl leading-relaxed">
            O Orcoma Day é construído com o apoio de marcas que compartilham o mesmo propósito: impulsionar empresas, desenvolver pessoas e promover conexões estratégicas para o futuro dos negócios.
          </p>
        </div>
      </section>

      {/* ── Carrossel de fotos ── */}
      <section className="bg-white py-12 sm:py-16">
        <h2 className="text-center text-[3.75rem] sm:text-[4.875rem] font-bold mb-8" style={{ fontFamily: 'Montserrat', color: '#1e1e1d' }}>Nossa Galeria</h2>
        <div className="mx-4 sm:mx-6 rounded-3xl py-8 sm:py-10 overflow-hidden shadow-lg" style={{ background: 'linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)), radial-gradient(circle farthest-corner at 7% 88%, rgba(137, 99, 64, 0.99) 0%, 25%, rgba(137, 99, 64, 0) 50%), radial-gradient(circle farthest-corner at 45.3125% 0%, #1e1e1d 0%, 42%, rgba(30, 30, 29, 0) 70%), radial-gradient(circle farthest-corner at 100% 73.958%, #d2bf95 0%, 42%, rgba(210, 191, 149, 0) 70%), radial-gradient(circle farthest-corner at 49% 50%, #ffffff 0%, 100%, rgba(255, 255, 255, 0) 100%)' }}>
          <CarrosselFotos fotos={FOTOS} />
        </div>
      </section>

      {/* ── Trajetória ── */}
      <section className="bg-white py-16 sm:py-24 px-6 sm:px-12">
        <div className="max-w-[988px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-[44px] items-start">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-normal leading-tight" style={{ fontFamily: 'Montserrat', color: '#1e1e1d' }}>
            A força de uma
            <br />
            trajetória que
            <br />
            gera confiança
          </h2>
          <p className="text-sm sm:text-base font-semibold leading-relaxed text-justify max-w-[34ch] lg:justify-self-end lg:pt-3" style={{ color: '#1e1e1d' }}>
            A Orcoma Contabilidade carrega uma história construída com experiência, proximidade e compromisso com o crescimento dos seus clientes.
          </p>
        </div>

        <div className="mt-16 origin-top lg:scale-[1.3] lg:mb-40">
        <div className="max-w-[760px] mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
          <CartaoRevelar direcao="de-cima" className="rounded-2xl p-6 sm:p-8 min-h-[200px] flex flex-col justify-between text-white" style={{ background: DEGRADE_CARD }}>
            <h3 className="text-5xl lg:text-6xl font-normal leading-tight" style={{ fontFamily: 'Montserrat' }}>39 Anos</h3>
            <p className="text-xs sm:text-sm font-semibold leading-snug max-w-[30ch]">De experiência no mercado contábil e empresarial.</p>
          </CartaoRevelar>
          <CartaoRevelar direcao="de-baixo" className="rounded-2xl p-6 sm:p-8 min-h-[200px] flex flex-col justify-between text-white" style={{ background: DEGRADE_CARD }}>
            <h3 className="text-5xl lg:text-6xl font-normal leading-tight" style={{ fontFamily: 'Montserrat' }}>+15 Unidades</h3>
            <p className="text-xs sm:text-sm font-semibold leading-snug max-w-[36ch]">Presença regional para atender empresas com proximidade e estratégia. Uma estrutura formada por cerca de 300 colaboradores.</p>
          </CartaoRevelar>
        </div>
        <CartaoRevelar direcao="esquerda" className="max-w-[760px] mx-auto mt-4 lg:mt-5 rounded-2xl p-6 sm:p-8 min-h-[200px] flex flex-col justify-between text-white" style={{ background: DEGRADE_CARD }}>
          <h3 className="text-5xl lg:text-6xl font-normal leading-tight" style={{ fontFamily: 'Montserrat' }}>+50 Milhões</h3>
          <p className="text-xs sm:text-sm font-semibold leading-snug max-w-[48ch]">Em impostos economizados para empresas através de planejamento e orientação estratégica.</p>
        </CartaoRevelar>
        </div>
      </section>

      <Footer />

      <WhatsAppToggle />
    </div>
  );
}
