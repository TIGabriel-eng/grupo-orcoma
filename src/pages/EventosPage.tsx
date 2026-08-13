import { useEffect, useState } from 'react';
import {
  GraduationCap, MapPin, ChevronLeft, ChevronRight,
} from 'lucide-react';
import PageNav from '../components/PageNav';
import Footer from '../components/Footer';
import WhatsAppToggle from '../components/WhatsAppToggle';

const BLUE = 'linear-gradient(160deg, #0c0ccc 0%, #1a1aff 50%, #0000b3 100%)';

interface Evento {
  date: string;
  dateColor: string;
  title: string;
  location: string;
  description: string;
  image: string;
}

export default function EventosPage() {
  const [startIdx, setStartIdx] = useState(0);
  const [email, setEmail] = useState('');
  const [newsletterMsg, setNewsletterMsg] = useState<string | null>(null);
  const [newsletterStatus, setNewsletterStatus] = useState<'ok' | 'error' | null>(null);
  const [events, setEvents] = useState<Evento[]>([]);

  const handleNewsletter = () => {
    if (!email.trim()) {
      setNewsletterMsg('Informe seu e-mail');
      setNewsletterStatus('error');
      return;
    }
    fetch('/api/newsletter/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), origem: 'eventos' }),
    })
      .then((res) => res.json())
      .then((data) => {
        setNewsletterStatus(data.status === 'ok' ? 'ok' : 'error');
        setNewsletterMsg(data.message || '');
        if (data.status === 'ok') setEmail('');
      })
      .catch(() => {
        setNewsletterStatus('error');
        setNewsletterMsg('Não foi possível cadastrar. Tente novamente.');
      });
  };

  useEffect(() => {
    let active = true;
    fetch('/api/eventos/')
      .then((res) => {
        if (!res.ok) throw new Error('Erro ao carregar eventos');
        return res.json();
      })
      .then((data) => {
        if (!active) return;
        const apiEvents: Evento[] = (Array.isArray(data.eventos) ? data.eventos : []).map(
          (ev: { titulo: string; descricao: string; local: string; data: string; imagem: string }) => ({
            title: ev.titulo,
            description: ev.descricao,
            location: ev.local,
            date: ev.data,
            dateColor: '#e8b800',
            image: ev.imagem,
          }),
        );
        if (apiEvents.length > 0) {
          setEvents(apiEvents);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const visibleEvents = events.slice(startIdx, startIdx + 3);
  const canPrev = startIdx > 0;
  const canNext = startIdx + 3 < events.length;

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <div style={{ background: BLUE }}>
        <PageNav activePage="eventos" showConsultor={false} />

        <section className="flex flex-col items-center text-center px-4 sm:px-6 pt-10 sm:pt-12 pb-16 sm:pb-20">
          <h1
            className="text-white font-extrabold leading-tight max-w-xl mb-4"
            style={{ fontSize: 'clamp(2.24rem, 5.6vw, 3.64rem)', lineHeight: '1.2' }}
          >
            Educação e Crescimento para o seu Negócio
          </h1>
          <p className="text-white/65 text-[1.225rem] leading-relaxed max-w-md mb-8 px-2">
            Capacite sua equipe e mantenha sua empresa atualizada com os treinamentos e eventos exclusivos da Orcoma Academy. Conhecimento que impulsiona resultados.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              className="flex items-center justify-center gap-2 px-7 py-3 rounded-full text-sm font-bold transition-all hover:brightness-110"
              style={{ background: '#e8b800', color: '#000' }}
            >
              Ver Eventos Próximos
            </button>
          </div>

          <div
            className="mt-10 w-14 h-14 rounded-full flex items-center justify-center shadow-xl"
            style={{ background: '#e8b800' }}
          >
            <GraduationCap size={26} color="#000" />
          </div>
        </section>
      </div>

      {/* ── Próximos Treinamentos ── */}
      <section className="bg-white py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6 reveal">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Próximos Eventos</h2>
                <p className="text-gray-400 text-sm">Participe das nossas sessões de capacitação técnica e estratégica.</p>
              </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => canPrev && setStartIdx(startIdx - 1)}
                disabled={!canPrev}
                className="w-8 h-8 rounded-full flex items-center justify-center border transition-colors disabled:opacity-30"
                style={{ borderColor: '#0c0ccc', color: '#0c0ccc' }}
              >
                <ChevronLeft size={15} />
              </button>
              <button
                onClick={() => canNext && setStartIdx(startIdx + 1)}
                disabled={!canNext}
                className="w-8 h-8 rounded-full flex items-center justify-center border transition-colors disabled:opacity-30"
                style={{ borderColor: '#0c0ccc', color: '#0c0ccc' }}
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {visibleEvents.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <p className="text-gray-500">Nenhum evento agendado no momento.</p>
              </div>
            ) : (
              visibleEvents.map((ev, index) => (
              <div key={ev.title} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col reveal" style={{ '--reveal-delay': `${index * 90}ms` } as React.CSSProperties}>
                <div className="relative" style={{ height: '160px' }}>
                  {ev.image ? (
                    <img src={ev.image} alt={ev.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-semibold uppercase tracking-wider bg-gray-100">
                      Grupo Orcoma
                    </div>
                  )}
                  <span
                    className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold"
                    style={{ background: ev.dateColor, color: '#000' }}
                  >
                    {ev.date}
                  </span>
                </div>
                <div className="p-4 sm:p-5 flex flex-col gap-2 flex-1">
                  <h3 className="font-bold text-gray-900 text-sm leading-snug">{ev.title}</h3>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <MapPin size={12} />
                    <span className="text-xs">{ev.location}</span>
                  </div>
                  <p className="text-gray-500 text-xs leading-relaxed flex-1">{ev.description}</p>
                  <button
                    className="w-full mt-2 py-2.5 rounded-xl text-white text-xs font-bold transition-all hover:brightness-110"
                    style={{ background: '#0c0ccc' }}
                  >
                    Inscrever-se
                  </button>
                </div>
              </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="py-12 sm:py-16 px-4 sm:px-6" style={{ background: '#eef2ff' }}>
        <div className="max-w-5xl mx-auto">
          <div className="max-w-lg">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Fique por dentro das novidades</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Assine nossa newsletter e receba conteúdos exclusivos e convites para treinamentos antes de todo mundo.
            </p>
            <label className="block text-xs font-semibold text-gray-600 mb-2">E-mail Corporativo</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleNewsletter(); }}
                placeholder="seuemail@empresa.com.br"
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
              <button
                onClick={handleNewsletter}
                className="px-6 py-3 rounded-xl text-white text-sm font-bold flex-shrink-0 transition-all hover:brightness-110"
                style={{ background: '#16a34a' }}
              >
                Cadastrar
              </button>
            </div>
            {newsletterMsg && (
              <p className={`mt-3 text-sm font-medium ${newsletterStatus === 'ok' ? 'text-green-600' : 'text-red-600'}`}>
                {newsletterMsg}
              </p>
            )}
          </div>
        </div>
      </section>

      <Footer />

      <WhatsAppToggle />
    </div>
  );
}