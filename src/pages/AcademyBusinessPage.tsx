import { useState } from 'react';
import { CheckCircle2, GraduationCap, LineChart, ShieldCheck, Target, Users } from 'lucide-react';
import PageNav from '../components/PageNav';
import Footer from '../components/Footer';
import WhatsAppToggle from '../components/WhatsAppToggle';

const BLUE = 'linear-gradient(160deg, #0c0ccc 0%, #1a1aff 50%, #0000b3 100%)';
const WHATSAPP_NUMBER = '557399747460';

const formatPhone = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (!digits) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

const formatCpf = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (!digits) return '';
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
};

const formatCnpj = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 14);
  if (!digits) return '';
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  if (digits.length <= 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
};

const pilares = [
  {
    icon: LineChart,
    title: 'Gestão que gera resultado',
    text: 'Conteúdos práticos para você tomar decisões financeiras e estratégicas com mais segurança no dia a dia do seu negócio.',
  },
  {
    icon: ShieldCheck,
    title: 'Conformidade sem complicação',
    text: 'Entenda as obrigações fiscais, contábeis e trabalhistas da sua empresa em uma linguagem simples e direta.',
  },
  {
    icon: Target,
    title: 'Crescimento planejado',
    text: 'Metodologias e insights para estruturar a sua empresa e expandir com previsibilidade, mesmo em cenários desafiadores.',
  },
  {
    icon: Users,
    title: 'Comunidade de líderes',
    text: 'Aprenda junto com outros empreendedores e tenha acesso a especialistas que vivem a rotina do empresário brasileiro.',
  },
];

const marqueeWords = [
  'Conhecimento',
  'Gestão',
  'Crescimento',
  'Evolução',
  'Progresso',
  'Aprendizado',
  'Amadurecimento',
  'Superação',
  'Aperfeiçoamento',
  'Capacitação',
];

export default function AcademyBusinessPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [cpf, setCpf] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [autorizacao, setAutorizacao] = useState(false);
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !email.trim() || !telefone.trim()) {
      setErro('Preencha seu nome, e-mail e telefone para continuar.');
      return;
    }
    if (!autorizacao) {
      setErro('Para continuar, autorize o recebimento de conteúdos da Orcoma Academy Business.');
      return;
    }
    setErro('');
    setEnviando(true);

    const payload = {
      nome: nome.trim(),
      email: email.trim(),
      celular: telefone.replace(/\D/g, ''),
      cpf: cpf.replace(/\D/g, ''),
      cnpj: cnpj.replace(/\D/g, ''),
      mensagem: empresa.trim() ? `Empresa: ${empresa.trim()}` : '',
      origem: 'academy_business',
      interesse: 'geral',
    };

    try {
      const res = await fetch('/api/contact/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setErro(data?.message || 'Não foi possível registrar seus dados. Tente novamente.');
        setEnviando(false);
        return;
      }
    } catch {
      setErro('Não foi possível registrar seus dados. Tente novamente.');
      setEnviando(false);
      return;
    }

    setEnviando(false);

    const mensagem = [
      'Olá! Vim pela página da Orcoma Academy Business e quero ficar por dentro dos conteúdos.',
      '',
      `Nome: ${nome.trim()}`,
      `E-mail: ${email.trim()}`,
      `Telefone: ${telefone}`,
      cpf.replace(/\D/g, '') ? `CPF: ${cpf}` : '',
      cnpj.replace(/\D/g, '') ? `CNPJ: ${cnpj}` : '',
      empresa.trim() ? `Empresa: ${empresa.trim()}` : '',
      '',
      'Autorizei o recebimento dos conteúdos. Pode continuar o atendimento!',
    ]
      .filter(Boolean)
      .join('\n');

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <div style={{ background: BLUE }}>
        <PageNav activePage="academy-business" showConsultor={false} />

        <section className="px-4 sm:px-6 pt-10 sm:pt-14 pb-16 sm:pb-24">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <h1
                className="text-white font-extrabold leading-tight max-w-4xl mb-5"
                style={{ fontSize: 'clamp(2.24rem, 5.6vw, 3.8rem)', lineHeight: '1.12' }}
              >
                O conhecimento que transforma empresas começa <span style={{ color: '#e8b800' }}>aqui</span>.
              </h1>
              <p className="text-white/70 text-[1.15rem] sm:text-xl leading-relaxed max-w-2xl mb-10 px-2 lg:px-0">
                A Orcoma Academy Business é a escola de negócios da Orcoma: conteúdos, treinamentos e ferramentas para você
                tirar a sua empresa da sobrevivência e colocá-la no caminho do crescimento inteligente.
              </p>
            </div>

            <div className="flex justify-center">
              <video
                src="/video-informativo.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="w-[490px] h-[280px] max-w-full rounded-2xl shadow-2xl"
                style={{ border: 'none' }}
              />
            </div>
          </div>
        </section>
      </div>

      {/* ── Marquee infinito ── */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 overflow-hidden">
        <div className="w-full overflow-hidden">
          <div className="flex items-center whitespace-nowrap marquee-track">
            {[0, 1].map((half) => (
              <div key={half} className="flex items-center gap-10 sm:gap-14 pr-10 sm:pr-14" aria-hidden={half === 1}>
                {marqueeWords.map((word) => (
                  <span
                    key={word}
                    className="flex items-center gap-2.5 sm:gap-3 text-lg sm:text-xl md:text-2xl font-extrabold"
                    style={{ color: '#0c0ccc' }}
                  >
                    <span
                      className="inline-block w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full"
                      style={{
                        background: '#0c0ccc',
                        boxShadow: '0 0 8px rgba(12,12,204,0.9), 0 0 18px rgba(12,12,204,0.5)',
                      }}
                    />
                    {word}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <style>{`
          @keyframes marquee-scroll {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
          .marquee-track {
            width: max-content;
            animation: marquee-scroll 16s linear infinite;
          }
          .marquee-track:hover {
            animation-play-state: paused;
          }
        `}</style>
      </section>

      {/* ── Pilares ── */}
      <section className="bg-gray-50 py-14 sm:py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 reveal">
            <p className="text-sm sm:text-base font-bold tracking-widest uppercase mb-2" style={{ color: '#0c0ccc' }}>
              #VEM PRA ORCOMA
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              O que a Orcoma Academy Business oferece para você
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {pilares.map((p, i) => (
              <div
                key={p.title}
                className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 reveal"
                style={{ '--reveal-delay': `${(i % 2) * 100}ms` } as React.CSSProperties}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: '#0c0ccc' }}
                >
                  <p.icon size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{p.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA intermediário ── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6" style={{ background: BLUE }}>
        <div className="max-w-3xl mx-auto text-center reveal">
          <GraduationCap size={40} color="#e8b800" className="mx-auto mb-5" />
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight mb-4">
            Quem se atualiza, se destaca. Quem aprende com quem entende, <span style={{ color: '#e8b800' }}>lidera.</span>
          </h2>
          <p className="text-white/70 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
            Em um mercado que muda todos os dias, conhecimento é a maior vantagem competitiva. A Orcoma Academy Business
            te acompanha nessa jornada.
          </p>
        </div>
      </section>

      {/* ── Inscrição ── */}
      <section id="inscricao" className="bg-white py-14 sm:py-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10 reveal">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Fique por dentro de tudo
            </h2>
            <p className="text-gray-500 text-base sm:text-lg leading-relaxed">
              Preencha os seus dados e receba os conteúdos, treinamentos e novidades da Orcoma Academy Business.
              Em seguida, seguiremos o atendimento pelo WhatsApp.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-10 reveal" style={{ '--reveal-delay': '100ms' } as React.CSSProperties}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nome completo*</label>
                <input
                  name="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="João da Silva"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': '#0c0ccc' } as React.CSSProperties}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">E-mail*</label>
                <input
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="joao@email.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': '#0c0ccc' } as React.CSSProperties}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Telefone / WhatsApp*</label>
                <input
                  name="telefone"
                  type="tel"
                  value={telefone}
                  onChange={(e) => setTelefone(formatPhone(e.target.value))}
                  placeholder="(71) 91234-5678"
                  maxLength={15}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': '#0c0ccc' } as React.CSSProperties}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Empresa (opcional)</label>
                <input
                  name="empresa"
                  value={empresa}
                  onChange={(e) => setEmpresa(e.target.value)}
                  placeholder="Sua empresa"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': '#0c0ccc' } as React.CSSProperties}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">CPF (opcional)</label>
                <input
                  name="cpf"
                  inputMode="numeric"
                  value={cpf}
                  onChange={(e) => setCpf(formatCpf(e.target.value))}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': '#0c0ccc' } as React.CSSProperties}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">CNPJ (opcional)</label>
                <input
                  name="cnpj"
                  inputMode="numeric"
                  value={cnpj}
                  onChange={(e) => setCnpj(formatCnpj(e.target.value))}
                  placeholder="00.000.000/0000-00"
                  maxLength={18}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': '#0c0ccc' } as React.CSSProperties}
                />
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autorizacao}
                  onChange={(e) => setAutorizacao(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-[#0c0ccc]"
                />
                <span className="text-xs text-gray-600 leading-relaxed">
                  Autorizo o envio de conteúdos e novidades da Orcoma Academy Business por e-mail e WhatsApp, e
                  concordo com o contato para dar continuidade ao meu atendimento.
                </span>
              </label>

              {erro && <p className="text-xs font-semibold" style={{ color: '#dc2626' }}>{erro}</p>}

              <button
                type="submit"
                disabled={enviando}
                className="w-full py-3 rounded-lg text-white text-sm font-bold transition-all hover:brightness-110 hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
                style={{ background: '#0c0ccc' }}
              >
                {enviando ? 'Enviando...' : 'Quero ficar por dentro'}
              </button>

              <p className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
                <CheckCircle2 size={14} style={{ color: '#22c55e' }} />
                Seus dados são usados apenas para este contato.
              </p>
            </form>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppToggle />
    </div>
  );
}
