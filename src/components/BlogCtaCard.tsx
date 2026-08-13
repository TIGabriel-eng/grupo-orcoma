import { useNav } from '../context/NavContext';
import { attendantConfig, trackWhatsAppClick } from '../config/attendant';

interface CtaCardProps {
  title: string;
  pillLabel: string;
  pillColor: string;
  pillTextColor: string;
  animationName: string;
  whatsappUrl?: string;
}

function CtaCard({ title, pillLabel, pillColor, pillTextColor, animationName, whatsappUrl }: CtaCardProps) {
  const { navigate } = useNav();

  const pillClassName =
    'px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all hover:brightness-110 inline-block';
  const pillStyle = { background: pillColor, color: pillTextColor, animation: `${animationName} 2s infinite` } as React.CSSProperties;

  return (
    <div
      className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 flex flex-col lg:aspect-[50/60]"
    >
      <div
        className="h-40 lg:h-auto lg:flex-[45%] flex items-center justify-center p-6"
        style={{ background: 'linear-gradient(160deg, #0c0ccc 0%, #1a1aff 50%, #0000b3 100%)' }}
      >
        <img src="/grupo-orcoma-logo.png" alt="Grupo Orcoma" className="w-4/5 object-contain" />
      </div>

      <div
        className="flex-1 lg:flex-[55%] flex flex-col items-center justify-center gap-5 px-6 py-6 text-center"
        style={{ background: 'white' }}
      >
        <h3 className="text-xl font-extrabold text-gray-900 leading-snug">
          {title}
        </h3>
        {whatsappUrl ? (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick('blog_cta')}
            className={pillClassName}
            style={pillStyle}
          >
            {pillLabel}
          </a>
        ) : (
          <button
            onClick={() => navigate('contato')}
            className={pillClassName}
            style={pillStyle}
          >
            {pillLabel}
          </button>
        )}
      </div>
    </div>
  );
}

export default function BlogCtaCard() {
  return (
    <aside className="w-full max-w-md mx-auto lg:max-w-none lg:w-[280px] lg:shrink-0 lg:sticky lg:top-24">
      <div className="flex flex-col gap-6">
        <CtaCard
          title="Venha abrir a sua empresa agora!"
          pillLabel="Fale Conosco"
          pillColor="#e8b800"
          pillTextColor="#000"
          animationName="ctaPulseGold"
          whatsappUrl={attendantConfig.whatsappUrl}
        />
        <CtaCard
          title="Chega de dor de cabeça: trocar de contabilidade ficou simples"
          pillLabel="Quero ir para a ORCOMA!!"
          pillColor="#22c55e"
          pillTextColor="#fff"
          animationName="ctaPulseGreen"
        />
      </div>

      <style>{`
        @keyframes ctaPulseGold {
          0% { box-shadow: 0 0 0 0 rgba(232,184,0,0.6); }
          70% { box-shadow: 0 0 0 14px rgba(232,184,0,0); }
          100% { box-shadow: 0 0 0 0 rgba(232,184,0,0); }
        }
        @keyframes ctaPulseGreen {
          0% { box-shadow: 0 0 0 0 rgba(34,197,94,0.6); }
          70% { box-shadow: 0 0 0 14px rgba(34,197,94,0); }
          100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); }
        }
      `}</style>
    </aside>
  );
}
