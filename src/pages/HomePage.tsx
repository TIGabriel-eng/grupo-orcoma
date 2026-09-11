import { useState, useEffect, useRef } from 'react';
import { Headphones, Monitor, UserCheck, Shield } from 'lucide-react';
import Nav from '../components/Nav';
import { useWhatsApp } from '../context/WhatsAppContext';
import { useNav } from '../context/NavContext';
import CurvedCarousel from '../components/CurvedCarousel';
import HeroCarousel from '../components/HeroCarousel';
import ServicesOrbital from '../components/ServicesOrbital';
import SpecialistsSection from '../components/SpecialistsSection';
import ReviewsSection from '../components/ReviewsSection';
import MaterialsSection from '../components/MaterialsSection';
import BlogSection from '../components/BlogSection';
import CalculadoraRiscoFiscal from '../components/CalculadoraRiscoFiscal';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import YouTubePlayer from '../components/YouTubePlayer';

const serviceCards = [
  {
    title: 'Escritório Virtual',
    description: 'Endereço comercial e suporte para sua empresa atuar com mais organização e credibilidade.',
  },
  {
    title: 'Orcoma para Empresas',
    description: 'Contabilidade estratégica para sua empresa crescer com mais organização e segurança.',
  },
  {
    title: 'Orcoma para Gestão',
    description: 'Apoio especializado para uma gestão pública mais eficiente, segura e transparente.',
  },
];

const stats = [
  { target: 15, prefix: '+', suffix: '', label: 'Unidades' },
  { target: 50, prefix: '+', suffix: 'M', label: 'Em impostos\neconomizados' },
  { target: 39, prefix: '+', suffix: ' ANOS', smallSuffix: true, label: 'De experiência' },
  { target: 12, prefix: '+', suffix: 'K', label: 'Vidas atendidas' },
];

function CountUp({ target, prefix, suffix, smallSuffix }: { target: number; prefix: string; suffix: string; smallSuffix?: boolean }) {
  const [count, setCount] = useState(0);
  const keyRef = useRef(0);
  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey((k) => k + 1);
  }, []);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const startTime = performance.now();

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [key, target]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(0);
      setKey((k) => k + 1);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span>{prefix}{count}{smallSuffix ? <span style={{ fontSize: '0.4em' }}>{suffix}</span> : suffix}</span>
  );
}

const diferenciais = [
  {
    icon: Headphones,
    title: 'Suporte e orientação',
    description: 'Nossa equipe está sempre pronta para te orientar, esclarecendo dúvidas e auxiliando em cada etapa da sua gestão com atenção e comprometimento.',
  },
  {
    icon: Monitor,
    title: 'Plataformas de apoio',
    description: 'Tenha acesso às melhores ferramentas digitais para facilitar o controle financeiro, fiscal e contábil da sua organização com mais segurança e agilidade.',
  },
  {
    icon: UserCheck,
    title: 'Atendimento humanizado',
    description: 'Pessoas reais cuidando da sua gestão. Priorizamos o relacionamento próximo e personalizado para entender e resolver cada situação.',
    destaque: true,
  },
  {
    icon: Shield,
    title: 'Tradição e confiança',
    description: 'Desde 1987 a Orcoma tem sido parceira de centenas de gestores em todo o Brasil, consolidando décadas de entrega com resultados sólidos.',
  },
];


export default function HomePage() {
  const { open: openWhatsApp } = useWhatsApp();
  const { navigate } = useNav();
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden min-h-screen flex flex-col" style={{ background: 'linear-gradient(160deg, #0c0ccc 0%, #1a1aff 40%, #0000b3 100%)' }}>
        {/* Vídeo de fundo (YouTube em loop infinito); o gradiente base acima mantém o visual enquanto carrega */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <style>{`
            .hero-video-iframe {
              position: absolute;
              top: 60%;
              left: 55%;
              width: 100vw;
              height: 56.25vw;
              min-height: 100vh;
              min-width: 177.78vh;
              transform: translate(-50%, -50%) scale(1.25);
              border: none;
              pointer-events: none;
            }
            /* Portrait / mobile estreito (ex: 366x690): garante cobertura total da altura */
            @media (max-aspect-ratio: 16/9) {
              .hero-video-iframe {
                width: 177.78vh;
                height: 100vh;
                top: 55%;
                left: 50%;
              }
            }
            /* Ajuste fino para celulares pequenos: um pouco mais de zoom para cortar bordas do player */
            @media (max-width: 480px) {
              .hero-video-iframe {
                width: 200vh;
                min-width: 200vh;
                height: 100vh;
                min-height: 100vh;
                transform: translate(-50%, -50%) scale(1.15);
                top: 55%;
                left: 50%;
              }
            }
          `}</style>
          <YouTubePlayer
            videoId="mdF72LEmGhU"
            autoplay
            loop
            muted
            controls={false}
            rel={false}
            modestBranding
            iframeClassName="hero-video-iframe"
          />
        </div>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, rgba(12,12,204,0.3) 0%, rgba(26,26,255,0.3) 40%, rgba(0,0,179,0.3) 100%)' }}></div>
        <div className="relative z-10">
          <Nav />

          <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 pt-10 sm:pt-16 pb-24 sm:pb-40">
            <HeroCarousel />
          </main>
        </div>
      </div>

      {/* Card Hero Grande - Overlapping com o Hero */}
      <section className="relative z-10 -mt-12 sm:-mt-20 -mb-12 sm:-mb-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-sm p-6 sm:p-10">
          {/* Conheça os núcleos dos nossos serviços */}
          <div className="text-center mb-10 sm:mb-14">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-1000 mb-3 reveal">Conheça os núcleos dos nossos serviços</h1>
            <p className="text-gray-500 text-base sm:text-lg mb-8 sm:mb-10 max-w-2xl mx-auto reveal" style={{ '--reveal-delay': '80ms' } as React.CSSProperties}>
              Somos uma contabilidade "expert" em dar assistência para órgãos das áreas pública e privada. Conheça os eixos dos nossos serviços e tenha detalhes sobre como cada um deles vai facilitar a sua gestão;
            </p>
            <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
              {serviceCards.map((card, index) => (
                <div key={card.title} className={`reveal ${index === 1 ? 'md:-mt-8' : ''}`}>
                  <div
                    className={`rounded-xl p-5 sm:p-6 flex flex-col gap-4 h-full transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl ${index === 1 ? 'bg-[#0c0ccc]' : 'bg-gray-200'}`}
                    style={{
                      '--reveal-delay': `${index * 100}ms`,
                    } as React.CSSProperties}
                  >
                    <h3 className={`font-bold text-base text-center ${index === 1 ? 'text-white' : 'text-gray-900'}`}>{card.title}</h3>
                    <p className={`text-sm leading-relaxed flex-1 ${index === 1 ? 'text-white' : 'text-gray-500'}`}>{card.description}</p>
                    {index === 1 ? (
                      <button
                        onClick={openWhatsApp}
                        className="self-center px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all hover:brightness-110"
                        style={{ background: '#fff', color: '#0c0ccc' }}
                      >
                        Saiba mais
                      </button>
                    ) : (
                      <a href="#" className="self-center px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all hover:brightness-110" style={{ background: '#0c0ccc', color: '#fff' }}>
                        Saiba mais
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sobre Nós */}
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="font-bold text-gray-900 mb-3 reveal" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.8rem)' }}>Sobre Nós</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-xl mx-auto px-2 reveal" style={{ '--reveal-delay': '80ms' } as React.CSSProperties}>
              O Grupo Orcoma Contabilidade Inteligente, atuante em segmentos como fiscal, contábil, pessoal, societário, consultoria e assessoria na gestão pública e privada, tem como princípio prestar serviços que atendam à legislação e previnam riscos de insolvência de negócios, objetivando crescimento e fortalecimento de sua imagem como uma organização confiável.
            </p>
            <button onClick={() => navigate('sobre')} className="inline-block px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all hover:brightness-110 hover:scale-105 mb-8 sm:mb-10 cursor-pointer reveal" style={{ background: '#e8b800', color: '#000' }}>
              Saiba Mais
            </button>
            <div className="reveal">
              <CurvedCarousel />
            </div>
          </div>

          {/* Stats */}
          <div className="py-12 sm:py-14 border-t border-b border-gray-100 mb-10 sm:mb-14">
            <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10 text-center">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col items-center gap-2 reveal" style={{ '--reveal-delay': `${stats.indexOf(stat) * 90}ms` } as React.CSSProperties}>
                  <div className="flex items-baseline gap-1">
                    <span
                      className="italic leading-none"
                      style={{ fontSize: 'clamp(1.8rem, 5vw, 3.2rem)', color: '#3A3A3A', fontFamily: 'Montserrat', fontWeight: 50 }}
                    >
                      <CountUp target={stat.target} prefix={stat.prefix} suffix={stat.suffix} smallSuffix={'smallSuffix' in stat ? stat.smallSuffix : undefined} />
                    </span>
                  </div>
                  <span
                    className="font-semibold whitespace-pre-line leading-snug"
                    style={{ fontSize: '0.85rem', color: '#999' }}
                  >
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Conheça os diferenciais - fora do card, no bg da página */}
      <section className="px-4 sm:px-6" style={{ background: 'linear-gradient(to bottom, #FFFFFF 0%, #FFFFFF 50%, #0F0FD8 50%, #1717F4 100%)' }}>
        <div className="max-w-5xl mx-auto py-14 sm:py-20">
          <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-10">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 sm:mb-8 text-center reveal" style={{ color: '#2b2b2b' }}>
              Conheça os diferenciais<br />que a Orcoma te oferece
            </h2>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {diferenciais.map((item) => (
                <div key={item.title} className={`rounded-2xl p-5 sm:p-6 flex gap-4 items-start reveal ${item.destaque ? 'bg-[#0f0fd8]' : 'bg-gray-100'}`} style={{ '--reveal-delay': `${diferenciais.indexOf(item) * 90}ms` } as React.CSSProperties}>
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#e8b800' }}>
                    <item.icon size={20} color="#000" />
                  </div>
                  <div>
                    <h3 className={`font-bold mb-1 text-sm sm:text-base ${item.destaque ? 'text-[#e8b800]' : 'text-gray-900'}`}>{item.title}</h3>
                    <p className={`text-xs sm:text-sm leading-relaxed ${item.destaque ? 'text-white' : 'text-gray-500'}`}>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Espaçador azul para overlapping inferior */}
      <div style={{ background: 'linear-gradient(160deg, #0c0ccc 0%, #1a1aff 40%, #0000b3 100%)' }} className="h-16 sm:h-24"></div>

      <ServicesOrbital />
      <SpecialistsSection />
      <ReviewsSection />
      <div style={{ background: 'rgb(5, 16, 102)' }}>
        <MaterialsSection />
        <BlogSection />
        <CalculadoraRiscoFiscal />
        <ContactSection />
      </div>
      <Footer />
    </div>
  );
}
