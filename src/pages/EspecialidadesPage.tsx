import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import PageNav from '../components/PageNav';
import Footer from '../components/Footer';
import WhatsAppToggle from '../components/WhatsAppToggle';
import { useNav } from '../context/NavContext';
import { useWhatsApp } from '../context/WhatsAppContext';
import { apiUrl } from '../config/api';
import { Skeleton } from '../components/Skeleton';
import SlowLoadingHint from '../components/SlowLoadingHint';

interface Especialidade {
  id: number;
  titulo: string;
  slug: string;
  descricao: string;
  imagem: string;
  ordem: number;
}

const BLUE = 'linear-gradient(160deg, #0c0ccc 0%, #1a1aff 50%, #0000b3 100%)';
const GOLD = '#e8b800';

function EspecialidadeCard({ esp, onOpen }: { esp: Especialidade; onOpen: (slug: string) => void }) {
  return (
    <article
      className="group flex flex-col bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl reveal"
      style={{ border: '1px solid #E9E9F2', boxShadow: '0 4px 20px rgba(9,36,167,0.08)' }}
      onClick={() => onOpen(esp.slug)}
    >
      <div className="relative overflow-hidden" style={{ aspectRatio: '16/11' }}>
        <img
          src={esp.imagem}
          alt={esp.titulo}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span
          className="absolute bottom-3 left-1/2 -translate-x-1/2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 inline-flex items-center gap-2 text-xs font-bold px-5 py-2.5 rounded-full"
          style={{ backgroundColor: GOLD, color: '#000' }}
        >
          SAIBA MAIS
          <ArrowRight size={14} />
        </span>
      </div>
      <div className="flex flex-col p-5 gap-2 flex-1">
        <h3
          className="font-extrabold leading-snug group-hover:text-[#e8b800] transition-colors"
          style={{ color: '#12122B' }}
        >
          {esp.titulo}
        </h3>
        {esp.descricao && (
          <p className="text-sm line-clamp-3" style={{ color: '#6B6B85' }}>
            {esp.descricao}
          </p>
        )}
      </div>
    </article>
  );
}

export default function EspecialidadesPage() {
  const { activeEspecialidadeSlug, openEspecialidade, navigate, navigateToEspecialidades } = useNav();
  const { open: openWhatsApp } = useWhatsApp();
  const [especialidades, setEspecialidades] = useState<Especialidade[]>([]);
  const [detalhe, setDetalhe] = useState<Especialidade | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setNotFound(false);

    if (activeEspecialidadeSlug) {
      setDetalhe(null);
      fetch(apiUrl(`/api/especialidades/${activeEspecialidadeSlug}/`))
        .then((res) => {
          if (!res.ok) throw new Error('Especialidade não encontrada');
          return res.json();
        })
        .then((data) => {
          if (!active) return;
          if (data.especialidade) {
            setDetalhe(data.especialidade);
          } else {
            setNotFound(true);
          }
        })
        .catch((err) => {
          if (active) {
            console.error('[EspecialidadesPage] Erro ao carregar especialidade:', err);
            setNotFound(true);
          }
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    } else {
      fetch(apiUrl('/api/especialidades/'))
        .then((res) => {
          if (!res.ok) throw new Error('Erro ao carregar especialidades');
          return res.json();
        })
        .then((data) => {
          if (!active) return;
          setEspecialidades(Array.isArray(data.especialidades) ? data.especialidades : []);
        })
        .catch((err) => {
          console.error('[EspecialidadesPage] Erro ao carregar especialidades:', err);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }

    return () => {
      active = false;
    };
  }, [activeEspecialidadeSlug]);

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: BLUE }}>
        <PageNav activePage="especialidades" showConsultor={false} />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex flex-col gap-3">
                <Skeleton className="h-40 w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
          <div className="mt-6">
            <SlowLoadingHint />
          </div>
        </div>
        <Footer />
        <WhatsAppToggle />
      </div>
    );
  }

  if (notFound || (activeEspecialidadeSlug && !detalhe)) {
    return (
      <div className="min-h-screen" style={{ background: BLUE }}>
        <PageNav activePage="especialidades" showConsultor={false} />
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Especialidade não encontrada</h1>
          <p className="text-white/60 mb-8">A especialidade que você procura não está disponível ou foi removida.</p>
          <button
            onClick={() => navigate('especialidades')}
            className="px-8 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all hover:brightness-110"
            style={{ background: GOLD, color: '#000' }}
          >
            Ver todas as especialidades
          </button>
        </div>
        <Footer />
        <WhatsAppToggle />
      </div>
    );
  }

  if (detalhe) {
    return (
      <div className="min-h-screen">
        {/* ── Hero com título da especialidade ── */}
        <div className="relative overflow-hidden" style={{ background: BLUE }}>
          <div
            className="absolute -right-24 -top-24 w-96 h-96 rounded-full opacity-20 pointer-events-none"
            style={{ background: `radial-gradient(circle, ${GOLD}, transparent 70%)` }}
          />
          <div className="relative z-10">
            <PageNav activePage="especialidades" showConsultor={false} />

            <section className="px-4 sm:px-8 pb-14 sm:pb-20 pt-8 sm:pt-12 max-w-4xl mx-auto text-center">
              <button
                onClick={navigateToEspecialidades}
                className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-semibold mb-8 transition-colors"
              >
                <ArrowLeft size={16} />
                Voltar para a Home
              </button>

              <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6">
                {detalhe.titulo}
              </h1>
            </section>
          </div>
        </div>

        {/* ── Imagem, descrição e CTA ── */}
        <section className="bg-white py-14 sm:py-20 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            {detalhe.imagem && (
              <div className="rounded-2xl overflow-hidden shadow-lg mb-12" style={{ aspectRatio: '21/9' }}>
                <img src={detalhe.imagem} alt={detalhe.titulo} className="w-full h-full object-cover" />
              </div>
            )}

            {detalhe.descricao && (
              <p
                className="text-gray-700 leading-relaxed mb-12"
                style={{ fontSize: '1.125rem', lineHeight: '1.8' }}
              >
                {detalhe.descricao}
              </p>
            )}

            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-4" style={{ color: '#12122B' }}>
                Precisa de ajuda com {detalhe.titulo}?
              </h2>
              <p className="text-gray-500 mb-8 max-w-xl mx-auto">
                Nossa equipe de especialistas está pronta para orientar você e o seu negócio.
              </p>
              <button
                onClick={openWhatsApp}
                className="px-8 py-3.5 rounded-full text-sm font-bold uppercase tracking-wider transition-all hover:brightness-110 hover:scale-105"
                style={{ background: GOLD, color: '#000' }}
              >
                Falar com um Consultor(a)
              </button>
            </div>
          </div>
        </section>

        <Footer />
        <WhatsAppToggle />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#F6F6FB', minHeight: '100vh' }}>
      {/* ── Hero ── */}
      <div className="relative overflow-hidden" style={{ background: BLUE }}>
        <div
          className="absolute -right-24 -top-24 w-96 h-96 rounded-full opacity-20 pointer-events-none"
          style={{ background: `radial-gradient(circle, ${GOLD}, transparent 70%)` }}
        />
        <div className="relative z-10">
          <PageNav activePage="especialidades" showConsultor={false} />

          <section className="px-4 sm:px-8 pb-16 sm:pb-24 pt-8 sm:pt-10 max-w-5xl mx-auto text-center">
            <span
              className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5"
              style={{ backgroundColor: 'rgba(232,184,0,0.15)', color: GOLD, border: '1px solid rgba(232,184,0,0.4)' }}
            >
              Especialidades Orcoma
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4">
              Somos especialistas quando o assunto é:
            </h1>
            <p className="text-base md:text-lg text-white/60 max-w-2xl mx-auto">
              Conheça as áreas em que a Orcoma atua com profundidade técnica e uma equipe preparada para o seu segmento.
            </p>
          </section>
        </div>
      </div>

      {/* ── Cards ── */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {especialidades.length === 0 ? (
          <div className="text-center py-24" style={{ color: '#6B6B85' }}>
            <p className="font-semibold mb-1">Nenhuma especialidade cadastrada no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {especialidades.map((esp) => (
              <EspecialidadeCard key={esp.slug} esp={esp} onOpen={openEspecialidade} />
            ))}
          </div>
        )}

        <div className="text-center mt-14">
          <button
            onClick={() => navigate('home')}
            className="px-8 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all hover:brightness-110"
            style={{ background: '#0924a7', color: '#fff' }}
          >
            Voltar para a Home
          </button>
        </div>
      </main>

      <Footer />
      <WhatsAppToggle />
    </div>
  );
}
