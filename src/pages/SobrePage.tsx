import { useEffect, useRef, useState, Fragment } from 'react';
import { Shield, Target, Eye, Heart } from 'lucide-react';
import PageNav from '../components/PageNav';
import Footer from '../components/Footer';
import WhatsAppToggle from '../components/WhatsAppToggle';

const BLUE = 'linear-gradient(160deg, #0c0ccc 0%, #1a1aff 50%, #0000b3 100%)';

const KEYWORDS = ['1987', '1989', '1991', 'João Albino Rios Mascarenhas', 'João Albino', 'ORCOMA', 'Orcoma'];

function Highlight({ text }: { text: string }) {
  const escaped = KEYWORDS.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
  return (
    <>
      {parts.map((part, i) =>
        KEYWORDS.some((k) => k.toLowerCase() === part.toLowerCase()) ? (
          <strong key={i}>{part}</strong>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        )
      )}
    </>
  );
}

const diferenciais = [
  {
    title: 'Expansão',
    description: 'Em 2002, com a expansão dos negócios, João Albino abre a sua terceira filial, em Jequié, para melhor atender aos clientes dessa cidade e região.',
  },
  {
    title: 'Nova Logomarca',
    description: 'Em 2003, a Orcoma redesenha a sua logomarca. É incorporada como cor padrão o azul, para melhor representar a honestidade do trabalho e a lealdade aos clientes em promover resultados com responsabilidade. Em 2007, abriu mais uma unidade, em Jaguaquara.',
  },
  {
    title: 'Equipe Capacitada',
    description: 'Passos importantes, a Orcoma veio dando, e a todo vapor, com foco na eficiência e na eficácia em relação aos clientes, o que era sonho se tornou real. João Albino viu a necessidade de avançar e ter pessoas capacitadas em seu time, principalmente na gestão de tributos. Foi quando a sua filha e advogada Jaciane Mascarenhas, especialista em gestão tributária, passou a fazer parte do time para dar melhor atendimento aos clientes.',
  },
];

const diretores = [
  { nome: 'João Albino Mascarenhas', cargo: 'Presidente', local: 'Orcoma Itaberaba', imagem: '/Joao-Albino.jpg' },
  { nome: 'Jacson Mascarenhas', cargo: 'Vice-presidente | Diretor', local: 'Orcoma Maracás', imagem: '/jackson.png' },
  { nome: 'Marcelo Mascarenhas', cargo: 'Diretor', local: 'Orcoma Maracás', imagem: '/marcelo.png' },
  { nome: 'Jaciane', cargo: 'Diretora jurídica', local: 'Geral', imagem: '/jaciane.png' },
  { nome: 'Caio Vivas', cargo: 'Diretor', local: 'Orcoma Feira de Santana', imagem: '/caio.png' },
  { nome: 'Salvador Rios', cargo: 'Diretor', local: 'Orcoma', imagem: '/Salvador.png' },
  { nome: 'Megali', cargo: 'Diretora', local: 'Orcoma', imagem: '/magali.png' },
  { nome: 'Sidnéia', cargo: 'Diretora', local: 'Orcoma', imagem: '/Sidneia.png' },
  { nome: 'Michela', cargo: 'Diretora', local: 'Orcoma Jaguaquara', imagem: '/Michele.png' },
  { nome: 'Edmilson', cargo: 'Diretor', local: 'Orcoma Jequié', imagem: '/edmilson.png' },
  { nome: 'Rodrigo', cargo: 'Diretor', local: 'Orcoma', imagem: '/Rodrigo.png' },
];

function CurtainCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const curtainStyle: React.CSSProperties = {
    backgroundImage:
      'linear-gradient(180deg, #e8b800 0%, #c99a00 100%), repeating-linear-gradient(90deg, rgba(255,255,255,0.18) 0 4px, transparent 4px 18px)',
  };

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-2xl flex"
      style={{ boxShadow: '0 8px 30px rgba(9,36,167,0.3)' }}
    >
      <div
        className="absolute inset-y-0 left-0 w-1/2 transition-transform duration-1000 ease-in-out z-10"
        style={{
          ...curtainStyle,
          transform: visible ? 'translateX(-101%)' : 'translateX(0)',
        }}
      />
      <div
        className="absolute inset-y-0 right-0 w-1/2 transition-transform duration-1000 ease-in-out z-10"
        style={{
          ...curtainStyle,
          transform: visible ? 'translateX(101%)' : 'translateX(0)',
        }}
      />
      <div className="relative flex-1 flex">{children}</div>
    </div>
  );
}

export default function SobrePage() {
  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <div className="relative" style={{ background: BLUE }}>
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1200)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        <div className="relative z-10">
          <PageNav activePage="sobre" showConsultor={false} />

          <section className="px-4 sm:px-8 pt-8 sm:pt-10 pb-16 sm:pb-24 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-start gap-8 sm:gap-10">
              {/* Left */}
              <div className="flex-1">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-4 sm:mb-5"
                  style={{ background: '#e8b800', color: '#000' }}
                >
                  <Shield size={11} /> DESDE <strong>1987</strong>
                </span>
                <h1 className="text-white font-extrabold text-3xl sm:text-4xl leading-tight mb-4">
                  Quem Somos
                </h1>
                <p className="text-white/70 text-sm leading-relaxed mb-6 sm:mb-8 max-w-sm">
                  <Highlight text="O Grupo Orcoma Contabilidade Inteligente tem como princípio transformar burocracia em inteligência estratégica para o seu crescimento." />
                </p>
              </div>

              {/* Right: stat card */}
              <div
                className="w-full md:w-64 rounded-2xl p-6 sm:p-8 text-center flex-shrink-0 reveal"
                style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}
              >
                <p className="font-extrabold leading-none" style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', color: 'white' }}>+39</p>
                <p className="text-white font-bold text-xs tracking-widest uppercase mt-1 mb-3">Anos de Experiência</p>
                <div className="w-8 h-0.5 mx-auto mb-3" style={{ background: '#e8b800' }} />
                <p className="text-white/65 text-xs leading-relaxed">
                  Solidez e confiança construídas ao longo de décadas de consultoria dedicada
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes haloPulse {
          0%, 100% { transform: scale(0.9); opacity: 0.35; }
          50% { transform: scale(1.15); opacity: 0.65; }
        }
      `}</style>
      {/* ── Missão ── */}
      <section className="bg-white py-14 sm:py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 sm:gap-12 items-center">
          <div className="w-full md:w-96 flex-shrink-0 rounded-2xl overflow-hidden shadow-lg relative reveal" style={{ height: '480px', minHeight: '420px' }}>
            <img
              src="/nossa historia.jpg"
              alt="Nossa história"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 relative reveal" style={{ '--reveal-delay': '120ms' } as React.CSSProperties}>
            <h2 className="font-bold text-gray-900 text-xl sm:text-2xl leading-snug mb-4">
              Nossa história
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              <Highlight text="A Orcoma nasceu em 1987, da ideia de João Albino Rios Mascarenhas, contador, com muita vontade de ter o próprio negócio e empreender na geração de renda e emprego. A Orcoma começou em um ambiente da casa de moradia de João Albino, mas as portas foram abertas ao público em 1989, numa sala de 3,5 m por 6 m anexada à sua residência." />
            </p>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              <Highlight text="Vale salientar que naquele período, João Albino cumpria a sua jornada de trabalho na empresa multinacional onde era empregado. Durante a noite e nas demais horas disponíveis, estava cuidando do seu negócio, pois trabalho para ele nunca foi tarefa difícil." />
            </p>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              <Highlight text="Um fato curioso, que merece muita atenção e que demonstra o comprometimento deste grupo quanto à qualidade e à satisfação dos clientes, é que os primeiros três clientes estão na Orcoma até o presente momento." />
            </p>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              <Highlight text="Em 1991, João Albino retornou à sua terra de origem, Itaberaba. A mudança foi motivada pela transferência da empresa onde ele era empregado, todavia, com o sonho de empreender e a vontade grande de gerar emprego e renda, viu a oportunidade de expandir o seu negócio, e na sua própria casa, instalou a sede da Orcoma." />
            </p>
            <div
              className="hidden md:block absolute -top-4 -right-72 w-[16.8rem] h-[16.8rem] z-10"
            >
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(20,60,255,0.5) 0%, rgba(20,60,255,0.2) 40%, transparent 60%)',
                  animation: 'haloPulse 6s ease-in-out infinite',
                }}
              />
              <div
                className="relative w-full h-full"
                style={{
                  background: 'linear-gradient(100deg, #0924a7 0%, #0924a7 42%, #2c4fd0 48%, #9db6ec 50%, #2c4fd0 52%, #0924a7 58%, #0924a7 100%)',
                  WebkitMaskImage: 'url(/ball.png)',
                  maskImage: 'url(/ball.png)',
                  WebkitMaskSize: '100% 100%',
                  maskSize: '100% 100%',
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                  maskPosition: 'center',
                  animation: 'spin 8s linear infinite',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── História 1994 ── */}
      <section className="bg-white py-14 sm:py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 sm:gap-12 items-center">
          <div className="flex-1">
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              <Highlight text="Em 1994, João Albino recebeu proposta da empresa onde trabalhava como empregado para ser transferido para Salvador, contudo, a suas duas unidades estavam indo muito bem, e a sua vontade de empreender falava mais alto do que a permanecer no emprego, e depois de 15 anos, abriu mão e viu a necessidade de &quot;caminhar com as próprias pernas&quot;." />
            </p>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              <Highlight text="Com a jornada não mais dividida, João Albino passou a se dedicar inteiramente à Orcoma. Sua primeira medida depois disso foi a mudança para um local mais espaçoso, com mais visibilidade. Contratou novos colaboradores e adquiriu mais equipamentos e mobiliário para melhor atender aos clientes." />
            </p>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              <Highlight text="Naquele período, foi feita a reestruturação societária: Itaberaba se tornou a matriz e Maracás, filial. João Albino também passou a intensificar os trabalhos e promoveu diversas palestras em várias cidades. Constantemente, capacitava a equipe para melhor prestação dos serviços contábeis. Focado, e pesquisador nato, como sempre, estava presente em todos os eventos, cursos, seminários e outros que pudessem ainda mais aprimorar os conhecimentos, para prestar um melhor serviço aos clientes." />
            </p>
          </div>
          <div className="w-full md:w-96 flex-shrink-0 rounded-2xl overflow-hidden shadow-lg reveal">
            <img
              src="/Joao-Albino.jpg"
              alt="João Albino"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── Diferenciais ── */}
      <section className="bg-gray-50 py-8 sm:py-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {diferenciais.map(({ title, description }, index) => (
              <div
                key={title}
                className="rounded-2xl p-6 sm:p-7 flex flex-col gap-4 transition-all reveal"
                style={{
                  background: '#0924a7',
                  boxShadow: '0 8px 30px rgba(9,36,167,0.3)',
                  '--reveal-delay': `${index * 90}ms`,
                } as React.CSSProperties}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.15)' }}
                >
                  <img src="/background-orcoma.png" alt="Orcoma" className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-base" style={{ color: 'white' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  <Highlight text={description} />
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Logo e texto após diferenciais ── */}
      <section className="bg-white py-14 sm:py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
          <img src="/logo2.png" alt="Orcoma Logo" className="w-72 sm:w-80 md:w-96 h-auto mb-8" />
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-2xl">
            <Highlight text="Neste intervalo, a Orcoma redesenhou sua logomarca. E como era conhecida apenas como Orcoma, passou a ser chamada de Orcoma Contabilidade Inteligente." />
          </p>
        </div>
      </section>

      {/* ── Expansão 2008-2012 ── */}
      <section className="bg-white py-14 sm:py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 sm:gap-12 items-start">
          <div className="w-full md:w-[26rem] lg:w-[31.2rem] flex-shrink-0 rounded-2xl overflow-hidden shadow-lg reveal">
            <img
              src="/2008.jpg"
              alt="Escritório Orcoma"
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="flex-1 reveal" style={{ '--reveal-delay': '120ms' } as React.CSSProperties}>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              Em 2008, abriu as unidades de Utinga e Ruy Barbosa.
            </p>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              Em 2009, abriu a unidade de Jiquiriçá.
            </p>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              Em 2011, em Maracás, foi construída uma nova estrutura: um escritório, moderno e empolgante, com 210 m² de construção, pois aquela sala onde tudo começou não mais comportava o atendimento da demanda atual, que foi muito bem impulsionada quando o seu filho Jacson Souza Mascarenhas, contador, especialista em gestão tributária e em gestão empresarial, em 2001, resolveu mudar para Maracás a fim de somar ao time, pois o projeto não podia parar.
            </p>
            <p className="text-gray-500 text-sm leading-relaxed">
              <Highlight text="Em 2012, em Itaberaba, João Albino, pensando em melhor atender aos clientes e prestar melhores serviços, ingressou em sua equipe o seu filho Marcelo Souza Mascarenhas, contador, administrador e especialista em gestão pública, pois assim estaria mais forte na prestação dos serviços de gestão empresarial, bem como na gestão pública." />
            </p>
          </div>
        </div>
      </section>

      {/* ── Expansão 2014-2021 ── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6" style={{ background: BLUE }}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 sm:gap-12 items-start">
          <div className="flex-1 reveal">
            <p className="text-white/80 text-sm leading-relaxed mb-4">
              <Highlight text="Em 2014, foi aberta uma unidade em Feira de Santana. Os serviços e os esforços do time Orcoma só faziam ainda mais continuar na linha crescente, pois atender e prestar um serviço melhor aos clientes desta cidade era necessário. Hoje, esta unidade é gerenciada pelo diretor Caio Vivas, que veio para o time somar e fazer a marca continuar a ser forte." />
            </p>
            <p className="text-white/80 text-sm leading-relaxed mb-4">
              <Highlight text="Em 2016, em Itaberaba, João Albino identificou que era necessário desvincular os serviços das áreas privada e pública, pois o excelente trabalho e o esforço do diretor Marcelo Mascarenhas fizeram com que esse sonho se tornasse realidade. E aí é dado mais um passo: a Orcoma passou a ser denominada Grupo Orcoma, porque surgia a Orcoma Contabilidade Pública." />
            </p>
            <p className="text-white/80 text-sm leading-relaxed mb-4">
              <Highlight text="Naquele ano também foi inaugurada mais uma unidade em Itaberaba, para a instalação da Orcoma Contabilidade Pública, um espaço moderno para melhor atendimento aos clientes usuários do serviço." />
            </p>
            <p className="text-white/80 text-sm leading-relaxed mb-4">
              Em 2018, foi aberta mais uma unidade, em Várzea Nova.
            </p>
            <p className="text-white/80 text-sm leading-relaxed">
              <Highlight text="Novas unidades foram abertas: 2020, em Seabra e Jequié II; e 2021, em Salvador, tornando assim o Grupo Orcoma consolidado como referência no mercado contábil baiano." />
            </p>
          </div>
          <div className="w-full md:w-[26rem] lg:w-[31.2rem] flex-shrink-0 rounded-2xl overflow-hidden shadow-lg reveal" style={{ '--reveal-delay': '120ms' } as React.CSSProperties}>
            <img
              src="/2014.jpg"
              alt="Unidade Feira de Santana 2014"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── Mascote Bino ── */}
      <section className="bg-white py-14 sm:py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 sm:gap-12 items-center">
          <div className="flex-1 reveal">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4">
              Conheça nosso novo mascote! Seu nome é <span style={{ color: '#e8b800' }}>Bino!</span>
            </h1>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
              <Highlight text="Buscando sempre inovar e otimizar a sua experiência conosco, criamos o BINO, a nova mascote da ORCOMA." />
            </p>
          </div>
          <div className="w-full md:w-80 lg:w-96 flex-shrink-0 rounded-2xl overflow-hidden shadow-lg reveal" style={{ '--reveal-delay': '120ms' } as React.CSSProperties}>
            <img
              src="/bino.png"
              alt="Mascote Bino"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── Atuação e Política de Qualidade ── */}
      <section
        className="py-14 sm:py-20 px-4 sm:px-6 relative overflow-hidden"
        style={{
          backgroundColor: '#0924a7',
          backgroundImage:
            'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.08) 0%, transparent 60%)',
        }}
      >
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
          style={{ opacity: 0.22 }}
        >
          <defs>
            <linearGradient id="sLineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="35%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="70%" stopColor="#ffffff" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>
          {Array.from({ length: 24 }, (_, i) => {
            const x = -180 + i * 24;
            return (
              <path
                key={i}
                d={`M ${x} 100 C ${x + 34} 74, ${x - 34} 26, ${x} 0`}
                fill="none"
                stroke="url(#sLineGrad)"
                strokeWidth="0.7"
                strokeLinecap="round"
              />
            );
          })}
        </svg>
        <div className="relative max-w-5xl mx-auto">
          {/* Texto centralizado */}
          <div className="text-center mb-12">
            <p className="text-white text-lg sm:text-xl leading-relaxed font-medium">
              O <span className="font-extrabold" style={{ color: '#e8b800', textShadow: '0 0 8px rgba(232,184,0,0.4)' }}>Grupo ORCOMA</span> atua nos segmentos fiscal, contábil, pessoal, societário, consultoria e assessoria na gestão pública e privada.
            </p>
          </div>

          {/* Card Política de Qualidade */}
          <div className="flex flex-col md:flex-row gap-8 sm:gap-12 items-center">
            <div className="flex-1 text-white reveal">
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-6">Política de qualidade</h2>
              <p className="text-sm sm:text-base leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.85)' }}>
                Prestar serviços que atendam à legislação e previnam riscos de insolvência de negócios, objetivando crescimento e fortalecimento de sua imagem como uma organização confiável.
              </p>
              <p className="text-sm sm:text-base leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.85)' }}>
                Assumir o compromisso de atender aos requisitos aplicáveis e de melhorar continuamente a eficácia do Sistema de Gestão da Qualidade visando à satisfação dos nossos clientes e de todas as partes interessadas.
              </p>
              <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>
                Fornecer recursos adequados aos colaboradores, para que estes atuem de forma consciente quanto à importância de suas atividades e à contribuição para o atendimento dos objetivos da qualidade.
              </p>
              <a
                href="#"
                className="inline-block mt-6 px-8 py-3.5 rounded-full text-sm sm:text-base font-bold uppercase tracking-wider text-center transition-all hover:brightness-110 hover:scale-105"
                style={{ background: '#e8b800', color: '#000' }}
              >
                Agende sua reunião com um Especialista!
              </a>
            </div>
            <div className="w-full md:w-[26rem] lg:w-[31.2rem] flex-shrink-0 rounded-2xl overflow-hidden shadow-lg reveal" style={{ '--reveal-delay': '120ms' } as React.CSSProperties}>
              <img
                src="/politica.jpg"
                alt="Política de qualidade"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Missão, Visão e Valores ── */}
      <section className="bg-white py-14 sm:py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card MISSÃO */}
            <CurtainCard>
              <div className="rounded-2xl p-10 flex flex-col items-center text-center flex-1" style={{ background: '#0924a7' }}>
                <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-6" style={{ background: 'rgba(255,255,255,0.15)' }}>
                  <Target size={32} color="#e8b800" />
                </div>
                <h3 className="text-2xl font-extrabold text-white mb-5">MISSÃO</h3>
                <p className="text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
                  Ajudar as empresas na gestão contábil para produzir mais renda, emprego e realização de sonhos.
                </p>
              </div>
            </CurtainCard>

            {/* Card VISÃO */}
            <CurtainCard>
              <div className="rounded-2xl p-10 flex flex-col items-center text-center flex-1" style={{ background: '#0924a7' }}>
                <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-6" style={{ background: 'rgba(255,255,255,0.15)' }}>
                  <Eye size={32} color="#e8b800" />
                </div>
                <h3 className="text-2xl font-extrabold text-white mb-5">VISÃO</h3>
                <p className="text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
                  Ser referência nacional na gestão contábil como parceira estratégica e eficaz.
                </p>
              </div>
            </CurtainCard>

            {/* Card VALORES */}
            <CurtainCard>
              <div className="rounded-2xl p-10 flex flex-col items-center flex-1" style={{ background: '#0924a7' }}>
                <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-6" style={{ background: 'rgba(255,255,255,0.15)' }}>
                  <Heart size={32} color="#e8b800" />
                </div>
                <h3 className="text-2xl font-extrabold text-white mb-5 text-center">VALORES</h3>
                <ul className="text-base leading-relaxed space-y-2.5" style={{ color: 'rgba(255,255,255,0.75)' }}>
                  <li className="flex items-start gap-2">
                    <span style={{ color: '#e8b800' }}>✦</span> Encantamento do cliente
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: '#e8b800' }}>✦</span> Respeito e valorização às pessoas
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: '#e8b800' }}>✦</span> Responsabilidade social
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: '#e8b800' }}>✦</span> Inovação
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: '#e8b800' }}>✦</span> Sustentabilidade
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: '#e8b800' }}>✦</span> Transparência e ética
                  </li>
                </ul>
              </div>
            </CurtainCard>
          </div>
        </div>
      </section>

      {/* ── Perguntas Frequentes ── */}
      <section className="bg-white py-14 sm:py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 text-center mb-3 reveal">
            Perguntas frequentes
          </h1>
          <p className="text-gray-500 text-sm sm:text-base text-center mb-10 max-w-xl mx-auto reveal" style={{ '--reveal-delay': '80ms' } as React.CSSProperties}>
            Saiba tudo e muito mais sobre como uma contabilidade deve prestar seus serviços na Bahia.
          </p>

          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-start reveal" style={{ '--reveal-delay': '160ms' } as React.CSSProperties}>
            <div className="hidden md:block">
              <img
                src="/Imagem-6-1-sobre (1).jpg"
                alt="Orcoma"
                className="w-full h-auto rounded-2xl object-cover"
              />
            </div>
            <div className="space-y-4">
            <details className="rounded-2xl overflow-hidden transition-all" style={{ background: '#0924a7', boxShadow: '0 4px 20px rgba(9,36,167,0.25)' }}>
              <summary className="px-6 py-4 cursor-pointer font-bold text-white text-sm sm:text-base flex items-center justify-between gap-4" style={{ listStyle: 'none' }}>
                Como a Orcoma faz contabilidade?
                <span className="text-lg leading-none" style={{ color: '#e8b800' }}>▼</span>
              </summary>
              <div className="px-6 pb-5 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>
                Na Orcoma, fazemos contabilidade consultiva, ficando mais próximos dos clientes, atuando de maneira estratégica e auxiliando na tomada de decisão de forma racional e planejada. Nossos profissionais são aliados do empreendedor.
              </div>
            </details>

            <details className="rounded-2xl overflow-hidden transition-all" style={{ background: '#0924a7', boxShadow: '0 4px 20px rgba(9,36,167,0.25)' }}>
              <summary className="px-6 py-4 cursor-pointer font-bold text-white text-sm sm:text-base flex items-center justify-between gap-4" style={{ listStyle: 'none' }}>
                Como a Orcoma enxerga a contabilidade?
                <span className="text-lg leading-none" style={{ color: '#e8b800' }}>▼</span>
              </summary>
              <div className="px-6 pb-5 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>
                Entendemos que a contabilidade é um fator primordial para as empresas controlarem seus patrimônios, coletando dados para serem transformados estrategicamente em procedimentos e ações que direcionam a tomada de decisão do negócio, além de ser extremamente importante o fator de análise de lucros e prejuízos.
              </div>
            </details>

            <details className="rounded-2xl overflow-hidden transition-all" style={{ background: '#0924a7', boxShadow: '0 4px 20px rgba(9,36,167,0.25)' }}>
              <summary className="px-6 py-4 cursor-pointer font-bold text-white text-sm sm:text-base flex items-center justify-between gap-4" style={{ listStyle: 'none' }}>
                Qual a importância de contar com a Orcoma?
                <span className="text-lg leading-none" style={{ color: '#e8b800' }}>▼</span>
              </summary>
              <div className="px-6 pb-5 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>
                Aqui, oferecemos informações necessárias para que o empreendedor tenha controle sobre o próprio trabalho. No que diz respeito às rotinas diárias, orientamos o empreendedor a tomar as melhores decisões.
              </div>
            </details>

            <details className="rounded-2xl overflow-hidden transition-all" style={{ background: '#0924a7', boxShadow: '0 4px 20px rgba(9,36,167,0.25)' }}>
              <summary className="px-6 py-4 cursor-pointer font-bold text-white text-sm sm:text-base flex items-center justify-between gap-4" style={{ listStyle: 'none' }}>
                Quais serão nossas funções na sua empresa?
                <span className="text-lg leading-none" style={{ color: '#e8b800' }}>▼</span>
              </summary>
              <div className="px-6 pb-5 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>
                As principais funções da nossa contabilidade serão: registrar, organizar, demonstrar, analisar e acompanhar as modificações do patrimônio em virtude da atividade econômica ou social que a sua empresa exerce no contexto econômico.
              </div>
            </details>
            </div>
          </div>
        </div>
      </section>

      {/* ── GRUPO ORCOMA Animado ── */}
      <section className="relative pt-10 sm:pt-14 pb-4 sm:pb-8 px-4 sm:px-6 flex items-center justify-center bg-white overflow-hidden">
        <div
          className="absolute inset-0 flex items-center justify-center select-none pointer-events-none"
          style={{ zIndex: 0 }}
        >
          <span
            className="font-extrabold leading-none"
            style={{
              fontSize: 'clamp(5rem, 20vw, 14rem)',
              color: '#060660',
              opacity: 0.1,
              letterSpacing: '0.15em',
              whiteSpace: 'nowrap',
            }}
          >
            TIME
          </span>
        </div>
        <div className="text-center relative" style={{ zIndex: 1 }}>
          <h2
            className="font-extrabold leading-none tracking-tight mb-6"
            style={{
              fontSize: 'clamp(0.875rem, 2.5vw, 1.5rem)',
              color: '#0924a7',
              animation: 'pulseGlow 2.5s ease-in-out infinite',
              textShadow: '0 0 20px rgba(9,36,167,0.3), 0 0 40px rgba(9,36,167,0.15)',
            }}
          >
            #GRUPO ORCOMA
          </h2>
          <div className="relative inline-block max-w-full">
            <span
              className="shine-text block leading-none"
              style={{ animation: 'shine-sweep 9s cubic-bezier(0.45, 0, 0.55, 1) infinite', fontSize: 'clamp(3.43rem, 10.7vw, 7.15rem)' }}
            >
              Diretoria
            </span>
            <span
              className="absolute left-1/2 top-1/2 select-none pointer-events-none"
              style={{
                fontFamily: "'Great Vibes', cursive",
                background: 'linear-gradient(90deg, #0924a7 0%, #6f87e0 45%, #ffffff 100%)',
                backgroundSize: '100% auto',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: 'transparent',
                fontSize: 'clamp(4.2rem, 11.1vw, 7.6rem)',
                lineHeight: 1,
                transform: 'translate(-50%, -5%)',
                whiteSpace: 'nowrap',
                textShadow: '0 1px 3px rgba(9, 36, 167, 0.35)',
              }}
            >
              Orcoma
            </span>
          </div>
          <style>{`
            .shine-text {
              font-weight: 900;
              background: linear-gradient(
                100deg,
                #0924a7 0%,
                #0924a7 42%,
                #b7c6f2 48%,
                #e6ecff 50%,
                #b7c6f2 52%,
                #0924a7 58%,
                #0924a7 100%
              );
              background-size: 200% auto;
              -webkit-background-clip: text;
              background-clip: text;
              -webkit-text-fill-color: transparent;
              color: transparent;
              text-shadow: 0 2px 18px rgba(9, 36, 167, 0.35);
            }
            @keyframes shine-sweep {
              from { background-position: 200% center; }
              to { background-position: -200% center; }
            }
            @media (prefers-reduced-motion: reduce) {
              .shine-text {
                animation: none;
                background: #0924a7;
                -webkit-text-fill-color: #0924a7;
                color: #0924a7;
              }
            }
          `}</style>
        </div>
      </section>
      
      {/* ── Diretoria Orcoma ── */}
<section className="pt-0 sm:pt-0 pb-14 sm:pb-20 px-4 sm:px-6 bg-white overflow-hidden">
  <div className="max-w-5xl mx-auto">

    <style>{`
      @keyframes marquee-diretoria {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
      }
      .marquee-track {
        display: flex;
        width: max-content;
        animation: marquee-diretoria 45s linear infinite;
      }
      .marquee-track:hover {
        animation-play-state: paused;
      }
    `}</style>

    {/* Carrossel contínuo de diretores */}
    <div className="relative reveal">
      <div className="marquee-track py-4">
        {[...diretores, ...diretores].map((d, i) => (
          <div key={i} className="flex flex-col items-center w-[13rem] sm:w-[17.25rem] md:w-[20.7rem] mx-2 sm:mx-4 flex-shrink-0">
            <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden mb-3 bg-gray-100 shadow-lg">
              <img src={d.imagem} alt={d.nome} className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="w-full rounded-xl p-3 sm:p-[1.15rem] text-center" style={{ background: '#0924a7' }}>
              <p className="font-bold text-white text-[0.95rem] sm:text-[1.15rem]">{d.nome}</p>
              <p className="text-[0.85rem] sm:text-[1.01rem] mt-0.5" style={{ color: 'rgba(255,255,255,0.7)' }}>{d.cargo}</p>
              <p className="text-[0.85rem] sm:text-[1.01rem] mt-0.5 font-semibold" style={{ color: '#e8b800' }}>{d.local}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>

      <Footer />

      <WhatsAppToggle />
    </div>
  );
}
