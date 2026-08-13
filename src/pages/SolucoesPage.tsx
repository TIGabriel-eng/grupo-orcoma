import { useState } from 'react';
import {
  Building2,
  FileText,
  ArrowLeftRight,
  TrendingUp,
  Clock,
  Headphones,
  Shield,
  Monitor,
  ChevronDown,
} from 'lucide-react';
import { useNav } from '../context/NavContext';
import PageNav from '../components/PageNav';
import Footer from '../components/Footer';
import ClienteModal from '../components/ClienteModal';
import { useCliente, type ClienteInfo } from '../context/ClienteContext';
import { buildWhatsAppUrl, type InteresseKey } from '../config/attendant';

const BLUE = 'linear-gradient(160deg, #0c0ccc 0%, #1a1aff 50%, #0000b3 100%)';

interface Area {
  Icon: typeof Building2;
  title: string;
  description: string;
  imagem?: string;
  bullets: string[];
  interesse: InteresseKey;
  mensagemWhats: string;
}

const areas: Area[] = [
  {
    Icon: Building2,
    title: 'Abertura de Empresa',
    description: 'Abrimos sua empresa do zero com agilidade, segurança e o enquadramento tributário ideal para o seu negócio.',
    imagem: '/abertura.jpg',
    bullets: ['Análise de enquadramento tributário', 'Registro e licenciamento'],
    interesse: 'abrir_empresa',
    mensagemWhats: 'Olá! Tenho interesse em abrir uma empresa e gostaria de falar com um consultor da Orcoma.',
  },
  {
    Icon: ArrowLeftRight,
    title: 'Migração de Contabilidade',
    description: 'Troque de contabilidade sem dor de cabeça: recebemos sua empresa, organizamos os documentos e assumimos tudo.',
    imagem: '/migra%C3%A7%C3%A3o-contabilidade.jpg',
    bullets: ['Transferência de responsabilidade', 'Organização documental'],
    interesse: 'migracao_contabilidade',
    mensagemWhats: 'Olá! Tenho interesse em migrar minha contabilidade para a Orcoma e gostaria de falar com um consultor.',
  },
  {
    Icon: TrendingUp,
    title: 'Migração de MEI para ME',
    description: 'Cresceu e passou do limite do MEI? Fazemos a transição para ME de forma planejada e sem perda de benefícios.',
    imagem: '/migracao-mei-me.jpg',
    bullets: ['Planejamento da migração', 'Nova estrutura tributária'],
    interesse: 'migracao_mei_me',
    mensagemWhats: 'Olá! Cresci e preciso migrar de MEI para ME. Gostaria de falar com um consultor da Orcoma.',
  },
  {
    Icon: FileText,
    title: 'Declaração IRPF',
    description: 'Declaração de Imposto de Renda da Pessoa Física feita com cuidado para você declarar certo e pagar o mínimo legal.',
    imagem: '/declara%C3%A7%C3%A3o-irpf.jpg',
    bullets: ['Análise de deduções', 'Declaração sem erros'],
    interesse: 'declaracao_irpf',
    mensagemWhats: 'Olá! Preciso de ajuda com a Declaração de IRPF. Gostaria de falar com um especialista da Orcoma.',
  },
];

const reasons = [
  {
    Icon: Headphones,
    title: 'Atendimento Humanizado',
    description: 'Pessoas reais cuidando do seu negócio. Nosso suporte é próximo, claro e proativo.',
  },
  {
    Icon: Shield,
    title: 'Tradição e Confiança (+39 anos)',
    description: 'Desde 1987, construímos histórias de sucesso baseadas em ética e resultados comprovados.',
  },
  {
    Icon: Monitor,
    title: 'Plataformas de Apoio',
    description: 'Acesso em tempo real às informações da sua empresa através de tecnologias proprietárias e seguras.',
  },
];

export default function SolucoesPage() {
  const { navigate } = useNav();
  const { isAuthenticated, saveSession, registrarAcesso } = useCliente();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [pendingArea, setPendingArea] = useState<Area | null>(null);

  const handleSaibaMais = (area: Area) => {
    if (isAuthenticated) {
      registrarAcesso(area.interesse);
      window.open(buildWhatsAppUrl(area.mensagemWhats), '_blank', 'noopener,noreferrer');
      return;
    }
    setPendingArea(area);
    setLoginModalOpen(true);
  };

  const handleLoginSuccess = (token: string, info: ClienteInfo) => {
    saveSession(token, info);
    setLoginModalOpen(false);
    if (pendingArea) {
      window.open(buildWhatsAppUrl(pendingArea.mensagemWhats), '_blank', 'noopener,noreferrer');
      setPendingArea(null);
    }
  };

  const handleModalClose = () => {
    setLoginModalOpen(false);
    setPendingArea(null);
  };

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <div style={{ background: BLUE }}>
        <PageNav activePage="solucoes" showConsultor={false} />

        <section className="flex flex-col items-center text-center px-4 sm:px-6 pt-10 sm:pt-14 pb-20 sm:pb-28">
          <div className="flex items-center gap-2 mb-6">
            <Clock size={14} className="text-white/70" />
            <span className="text-white/70 text-sm">Mais de 39 anos de excelência</span>
          </div>

          <h1
            className="text-white font-extrabold leading-tight max-w-2xl mb-5"
            style={{ fontSize: 'clamp(1.6rem, 4.5vw, 3rem)', lineHeight: '1.15' }}
          >
            Soluções completas para a evolução do seu negócio
          </h1>

          <p className="text-white/70 text-sm leading-relaxed max-w-md mb-10 px-2">
            Contabilidade inteligente, estratégica e humana para empresas e setor público.{' '}
            Transformamos burocracia em inteligência de gestão.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              className="flex items-center gap-2 px-7 py-3 rounded-full text-sm font-bold transition-all hover:brightness-110"
              style={{ background: '#e8b800', color: '#000' }}
            >
              Nossos Serviços
              <ChevronDown size={15} />
            </button>
          </div>
        </section>
      </div>

      {/* ── Nossas Soluções ── */}
      <section className="bg-white py-14 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 reveal" style={{ color: '#0c0ccc' }}>
              Nossas Soluções
            </h2>
            <div className="w-12 h-1 rounded-full mx-auto" style={{ background: '#e8b800' }} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {areas.map(({ Icon, title, description, imagem, bullets, interesse, mensagemWhats }, index) => (
              <div
                key={title}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow reveal"
                style={{ '--reveal-delay': `${(index % 3) * 90}ms` } as React.CSSProperties}
              >
                {imagem && (
                  <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
                    <img src={imagem} alt={title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-5 sm:p-6 flex flex-col gap-4 flex-1">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(12,12,204,0.08)' }}
                >
                  <Icon size={20} style={{ color: '#0c0ccc' }} />
                </div>

                <h3 className="font-bold text-base" style={{ color: '#0c0ccc' }}>{title}</h3>

                <p className="text-gray-500 text-sm leading-relaxed flex-1">{description}</p>

                <ul className="flex flex-col gap-1.5">
                  {bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-sm text-gray-600">
                      <span
                        className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                        style={{ background: '#e8b800', color: '#000' }}
                      >
                        ✓
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSaibaMais({ Icon, title, description, imagem, bullets, interesse, mensagemWhats })}
                  className="text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all text-left"
                  style={{ color: '#e8b800' }}
                >
                  Saiba mais →
                </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Por que escolher a Orcoma? ── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6" style={{ background: BLUE }}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-10 sm:gap-12 items-start">
          {/* Left */}
          <div className="flex-1 reveal">
            <h2 className="text-white text-xl sm:text-2xl font-bold mb-4 leading-snug">
              Por que escolher a Orcoma?
            </h2>
            <p className="text-white/65 text-sm leading-relaxed mb-8 sm:mb-10 max-w-sm">
              Combinamos a solidez de décadas de mercado com as tecnologias mais modernas de gestão para oferecer uma experiência contábil superior.
            </p>

            <div className="flex flex-col gap-6">
              {reasons.map(({ Icon, title, description }) => (
                <div key={title} className="flex gap-4 items-start">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: '#e8b800' }}
                  >
                    <Icon size={18} color="#000" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm mb-1">{title}</p>
                    <p className="text-white/60 text-xs leading-relaxed">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: stats card */}
          <div
            className="w-full md:w-72 rounded-2xl p-6 sm:p-8 flex flex-col gap-6 flex-shrink-0 reveal"
            style={{ background: 'rgba(0,0,100,0.55)', border: '1px solid rgba(255,255,255,0.1)', '--reveal-delay': '120ms' } as React.CSSProperties}
          >
            <div>
              <p
                className="font-extrabold leading-none mb-1"
                style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', color: '#e8b800' }}
              >
                +50M
              </p>
              <p className="text-white/70 text-sm">em impostos economizados</p>
            </div>

            <div className="border-t border-white/10 pt-6 grid grid-cols-2 gap-4">
              <div>
                <p className="text-white font-extrabold text-xl mb-1">100%</p>
                <p className="text-white/55 text-xs">Segurança Jurídica</p>
              </div>
              <div>
                <p className="text-white font-extrabold text-xl mb-1">24/7</p>
                <p className="text-white/55 text-xs">Acesso Digital</p>
              </div>
            </div>

            <button
              onClick={() => navigate('contato')}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-bold transition-all hover:brightness-110 hover:scale-[1.02]"
              style={{ background: '#e8b800', color: '#000' }}
            >
              Falar com um Consultor
            </button>
          </div>
        </div>
      </section>

      <Footer />

      <ClienteModal
        isOpen={loginModalOpen}
        onClose={handleModalClose}
        interesse={pendingArea?.interesse ?? 'geral'}
        serviceTitle={pendingArea?.title ?? 'Soluções Orcoma'}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}
