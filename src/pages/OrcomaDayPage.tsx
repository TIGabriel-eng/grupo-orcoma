import PageNav from '../components/PageNav';
import Footer from '../components/Footer';
import WhatsAppToggle from '../components/WhatsAppToggle';

const BLUE = 'linear-gradient(160deg, #0c0ccc 0%, #1a1aff 50%, #0000b3 100%)';

// Fotos do Orcoma Day, em public/orcoma-day/ (WebP, 3:2)
const FOTOS = [1, 2, 3, 4, 5, 6, 7].map((n) => ({
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
      <div className="orcoma-day-faixa flex w-max">
        {faixa.map((foto, i) => (
          <div key={i} className="flex-shrink-0 w-[80vw] sm:w-[60vw] lg:w-[48rem] px-2 sm:px-3">
            <img
              src={foto.src}
              alt={foto.alt}
              loading="lazy"
              decoding="async"
              className="w-full aspect-[3/2] object-cover rounded-2xl shadow-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OrcomaDayPage() {
  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <div style={{ background: BLUE }}>
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

      {/* ── Carrossel de fotos ── */}
      <section className="bg-white py-12 sm:py-16">
        <CarrosselFotos fotos={FOTOS} />
      </section>

      <Footer />

      <WhatsAppToggle />
    </div>
  );
}
