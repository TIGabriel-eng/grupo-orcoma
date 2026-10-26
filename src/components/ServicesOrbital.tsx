import { useState, useEffect } from 'react';

const CX = 400;
const CY = 380;
const OUTER_R = 350;
const INNER_R = 240;
const CENTER_R = 140;

interface Service {
  label: string[];
  angle: number;
  key: string;
}

// 9 bolinhas espaçadas igualmente (40° cada), para caber a nova "Consultoria Pública"
const services: Service[] = [
  { label: ['Consultoria tributária'], angle: -90, key: 'consultoria-tributaria' },
  { label: ['Serviços financeiros'], angle: -50, key: 'servicos-financeiros' },
  { label: ['Serviço fiscal'], angle: -10, key: 'departamento-fiscal' },
  { label: ['Serviço de', 'departamento', 'pessoal'], angle: 30, key: 'departamento-pessoal' },
  { label: ['Serviço contábil'], angle: 70, key: 'departamento-contabil' },
  { label: ['Consultoria Pública'], angle: 110, key: 'consultoria-publica' },
  { label: ['Consultoria', 'empresarial'], angle: 150, key: 'consultoria-empresarial' },
  { label: ['Planejamento', 'tributário'], angle: 190, key: 'planejamento-tributario' },
  { label: ['Serviço societário'], angle: 230, key: 'consultoria-societaria' },
];

function toXY(angle: number, r: number) {
  const rad = (angle * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

function labelAnchor(angle: number): 'middle' | 'start' | 'end' {
  const a = ((angle % 360) + 360) % 360;
  if (a === 90 || a === 270) return 'middle';
  if (a > 270 || a < 90) return 'start';
  return 'end';
}

function labelOffset(angle: number) {
  const LABEL_R = 405;
  const { x, y } = toXY(angle, LABEL_R);
  const anchor = labelAnchor(angle);
  let textX = x;
  if (anchor === 'start') textX += 12;
  if (anchor === 'end') textX -= 12;
  return { x: textX, y, anchor };
}

interface ServiceInfo {
  title: string;
  text: string;
}

const serviceDescriptions: Record<string, ServiceInfo> = {
  'departamento-contabil': {
    title: 'Departamento Contábil',
    text: 'O departamento contábil é responsável por registrar, organizar, demonstrar e acompanhar as modificações do patrimônio em virtude da atividade econômica ou social que a empresa exerce no contexto econômico.',
  },
  'consultoria-tributaria': {
    title: 'Consultoria Tributária',
    text: 'Assessoria especializada em interpretação e aplicação da legislação tributária, identificando oportunidades de economia fiscal e garantindo conformidade com as obrigações acessórias.',
  },
  'departamento-fiscal': {
    title: 'Departamento Fiscal',
    text: 'Planejamento tributário estratégico e compliance para garantir que sua empresa pague o mínimo legal com segurança.',
  },
  'departamento-pessoal': {
    title: 'Departamento Pessoal',
    text: 'Gestão completa de folha de pagamento e relações trabalhistas, tocando na segurança jurídica e bem-estar.',
  },
  'consultoria-societaria': {
    title: 'Consultoria Societária',
    text: 'Abertura de empresas, alterações contratuais e reestruturação societária com agilidade e inteligência.',
  },
  'servicos-financeiros': {
    title: 'Serviços Financeiros',
    text: 'BPO Financeiro para que você foque no core business enquanto cuidamos do seu fluxo de caixa e pagamentos.',
  },
  'consultoria-empresarial': {
    title: 'Consultoria Empresarial',
    text: 'Consultoria especializada para impulsionar o crescimento e a eficiência da sua empresa com soluções estratégicas personalizadas.',
  },
  'consultoria-publica': {
    title: 'Consultoria Pública',
    text: 'Oferecemos suporte especializado para aprimorar os processos administrativos, fortalecer os controles e garantir maior segurança na gestão dos recursos públicos.',
  },
  'planejamento-tributario': {
    title: 'Planejamento Tributário',
    text: 'Análise estratégica do regime tributário ideal para o seu negócio, com simulações e projeções que reduzem a carga de impostos de forma legal e segura.',
  },
};

const MOBILE_QUERY = '(max-width: 639px)';

/**
 * No celular o SVG é reduzido para ~340 px, então as bolinhas ficam pequenas
 * demais para tocar. Nesse caso usamos bolinhas maiores e área de toque ampliada.
 */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const onChange = () => setIsMobile(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return isMobile;
}

export default function ServicesOrbital() {
  const [activeKey, setActiveKey] = useState('departamento-contabil');
  const [manualReset, setManualReset] = useState(0);
  const isMobile = useIsMobile();
  const DOT_R = isMobile ? 44 : 17;
  const HIT_R = isMobile ? 90 : 17;
  const LABEL_SIZE = isMobile ? 34 : 26;
  const LABEL_LINE = isMobile ? 38 : 30;

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveKey((prev) => {
        const i = services.findIndex((s) => s.key === prev);
        return services[(i + 1) % services.length].key;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [manualReset]);

  return (
    <section style={{ background: 'linear-gradient(160deg, #0c0ccc 0%, #1a1aff 50%, #0000b3 100%)', overflow: 'visible' }} className="pt-24 sm:pt-28 pb-16 sm:pb-20 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto" style={{ overflow: 'visible' }}>
        {/* Heading */}
        <div className="text-center mb-4 reveal">
          <h2 className="font-extrabold text-3xl sm:text-5xl leading-tight">
            <span className="text-white">Conheça os núcleos </span><br />
            <span className="text-white">dos </span>
            <span style={{ color: '#e8b800' }}>nossos serviços</span>
          </h2>
          <p className="text-white/60 text-lg sm:text-xl mt-6 max-w-2xl mx-auto leading-relaxed">
            Somos uma contabilidade "expert" em dar assistência para órgãos das áreas pública e privada. Conheça os eixos dos nossos serviços e tenha detalhes sobre como cada um deles vai facilitar a sua gestão.
          </p>
        </div>

        {/* Orbital SVG */}
        <div className="flex justify-center reveal" style={{ overflow: 'visible', '--reveal-delay': '120ms' } as React.CSSProperties}>
          <svg viewBox="-360 -160 1520 1080" width="100%" style={{ maxWidth: '900px', overflow: 'visible' }}>
            <style>{`
              @keyframes pulse-ring {
                0% { r: ${CENTER_R}; stroke-width: 3; opacity: 0.6; }
                50% { r: ${CENTER_R + 55}; stroke-width: 1; opacity: 0; }
                100% { r: ${CENTER_R}; stroke-width: 3; opacity: 0.6; }
              }
              .pulse-circle {
                animation: pulse-ring 2.5s ease-in-out infinite;
              }
              .service-dot {
                cursor: pointer;
                transition: all 0.3s ease;
              }
              .service-dot:hover {
                filter: brightness(1.3);
              }
              @keyframes dot-blink {
                0%, 100% { opacity: 1; transform: scale(1.15); filter: drop-shadow(0 0 14px #e8b800); }
                50% { opacity: 0.1; transform: scale(0.7); filter: drop-shadow(0 0 0 #e8b800); }
              }
              .service-dot-active {
                transform-box: fill-box;
                transform-origin: center;
                animation: dot-blink 0.9s ease-in-out infinite;
              }
            `}</style>
            {/* Outer ring */}
            <circle cx={CX} cy={CY} r={OUTER_R} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
            {/* Inner ring */}
            <circle cx={CX} cy={CY} r={INNER_R} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
            {/* Center glow pulsing */}
            <circle className="pulse-circle" cx={CX} cy={CY} r={CENTER_R} fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="3" />

            {/* Center logo image clipped to circle */}
            <defs>
              <clipPath id="centerClip">
                <circle cx={CX} cy={CY} r={CENTER_R} />
              </clipPath>
            </defs>
            <image
              href="/3-yellow.png"
              x={CX - CENTER_R * 1.9}
              y={CY - CENTER_R * 1.9}
              width={CENTER_R * 3.8}
              height={CENTER_R * 3.8}
              clipPath="url(#centerClip)"
              preserveAspectRatio="xMidYMid slice"
            />

            {/* Service dots + labels */}
            {services.map((svc) => {
              const dot = toXY(svc.angle, OUTER_R);
              const { x: lx, y: ly, anchor } = labelOffset(svc.angle);
              const isActive = activeKey === svc.key;
              return (
                <g key={svc.label.join()}>
                  {/* Área de toque invisível, maior que a bolinha */}
                  <circle
                    cx={dot.x}
                    cy={dot.y}
                    r={HIT_R}
                    fill="transparent"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setActiveKey(svc.key);
                      setManualReset((n) => n + 1);
                    }}
                  />
                  <circle
                    className={isActive ? 'service-dot service-dot-active' : 'service-dot'}
                    cx={dot.x}
                    cy={dot.y}
                    r={DOT_R}
                    fill={isActive ? '#e8b800' : 'white'}
                    style={{ pointerEvents: 'none' }}
                  />
                  <text
                    x={lx}
                    y={ly + ((svc.label.length - 1) * LABEL_LINE) / 2}
                    textAnchor={anchor}
                    fill="white"
                    fontSize={LABEL_SIZE}
                    fontWeight="700"
                  >
                    {svc.label.map((line, i) => (
                      <tspan key={i} x={lx} dy={i === 0 ? 0 : LABEL_LINE}>
                        {line}
                      </tspan>
                    ))}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Active service description */}
        <div className="text-center mt-2 reveal" style={{ '--reveal-delay': '180ms' } as React.CSSProperties}>
          <span
            className="inline-block px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider mb-4"
            style={{ background: '#e8b800', color: '#000' }}
          >
            Clique nas bolinhas para alterar os setores
          </span>
          {/* Todas as descrições ocupam a mesma célula: a altura fica a do maior texto e a página não "pula" a cada troca. */}
          <div className="grid">
            {Object.entries(serviceDescriptions).map(([key, info]) => (
              <div
                key={key}
                className="col-start-1 row-start-1"
                style={{ visibility: key === activeKey ? 'visible' : 'hidden' }}
                aria-hidden={key !== activeKey}
              >
                <h3 className="text-white text-3xl sm:text-4xl font-bold mb-4">{info.title}</h3>
                <p className="text-white/65 text-xl sm:text-2xl leading-relaxed max-w-2xl mx-auto">
                  {info.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}