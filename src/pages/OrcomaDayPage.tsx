import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import PageNav from '../components/PageNav';
import Footer from '../components/Footer';
import WhatsAppToggle from '../components/WhatsAppToggle';
import { loadSiteData } from '../config/siteData';
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
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col">
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
      <div style={{ background: '#1e1e1d' }}>
        <PageNav activePage="orcoma-day" showConsultor={false} />

        <section className="flex flex-col items-center text-center px-4 sm:px-6 pt-10 sm:pt-12 pb-16 sm:pb-20">
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
        </section>
      </div>

      {/* ── Próximos eventos (vindos do Django) ── */}
      <section className="bg-white pt-12 sm:pt-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Próximos Eventos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {carregando ? (
              [0, 1, 2].map((i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col">
                  <Skeleton className="h-40 w-full rounded-none" />
                  <div className="p-4 sm:p-5 flex flex-col gap-3 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-9 w-full rounded-xl mt-1" />
                  </div>
                </div>
              ))
            ) : proximos.length === 0 ? (
              <p className="col-span-full text-center text-gray-500 py-8">Nenhum evento agendado no momento.</p>
            ) : (
              proximos.map((ev) => <CardEvento key={ev.titulo} ev={ev} />)
            )}
          </div>
        </div>
      </section>

      {/* ── Eventos passados (saem de "Próximos" quando o horário do evento passa) ── */}
      {!carregando && passados.length > 0 && (
        <section className="bg-white pt-12 sm:pt-16 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Eventos Passados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {passados.map((ev) => (
                <CardEvento key={ev.titulo} ev={ev} passado />
              ))}
            </div>
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

      {/* ── Carrossel de fotos ── */}
      <section className="bg-white py-12 sm:py-16">
        <h2 className="text-center text-[3.75rem] sm:text-[4.875rem] font-bold mb-8" style={{ fontFamily: 'Montserrat', color: '#1e1e1d' }}>Nossa Galeria</h2>
        <div className="mx-4 sm:mx-6 rounded-3xl py-8 sm:py-10 overflow-hidden shadow-lg" style={{ background: 'linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)), radial-gradient(circle farthest-corner at 7% 88%, rgba(137, 99, 64, 0.99) 0%, 25%, rgba(137, 99, 64, 0) 50%), radial-gradient(circle farthest-corner at 45.3125% 0%, #1e1e1d 0%, 42%, rgba(30, 30, 29, 0) 70%), radial-gradient(circle farthest-corner at 100% 73.958%, #d2bf95 0%, 42%, rgba(210, 191, 149, 0) 70%), radial-gradient(circle farthest-corner at 49% 50%, #ffffff 0%, 100%, rgba(255, 255, 255, 0) 100%)' }}>
          <CarrosselFotos fotos={FOTOS} />
        </div>
      </section>

      <Footer />

      <WhatsAppToggle />
    </div>
  );
}
