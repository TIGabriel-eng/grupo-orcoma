import { useEffect, useState } from 'react';
import { Check, Facebook, Link, Linkedin, Twitter } from 'lucide-react';

interface BlogShareButtonsProps {
  titulo: string;
  slug: string;
}

const GOLD = '#e8b800';

export default function BlogShareButtons({ titulo, slug }: BlogShareButtonsProps) {
  const [copiado, setCopiado] = useState<'link' | 'tiktok' | null>(null);

  useEffect(() => {
    if (!copiado) return;
    const timer = window.setTimeout(() => setCopiado(null), 2500);
    return () => window.clearTimeout(timer);
  }, [copiado]);

  const urlDoPost = () => `${window.location.origin}${window.location.pathname}#/blog-post/${slug}`;

  const abrir = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=500');
  };

  const copiarLink = async (e: React.MouseEvent, origem: 'link' | 'tiktok') => {
    e.stopPropagation();
    const url = urlDoPost();
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(origem);
    } catch {
      window.prompt('Copie o link do artigo:', url);
    }
  };

  const texto = encodeURIComponent(titulo);

  const url = encodeURIComponent(urlDoPost());

  const redes = [
    {
      nome: 'WhatsApp',
      icone: <img src="/whatsapp-icon.png" alt="" className="w-[22px] h-[22px] lg:w-[26px] lg:h-[26px] 2xl:w-[30px] 2xl:h-[30px] object-contain" />,
      cor: '#fff',
      link: `https://wa.me/?text=${encodeURIComponent(`${titulo} ${urlDoPost()}`)}`,
    },
    {
      nome: 'Facebook',
      icone: <Facebook className="w-[13px] h-[13px] lg:w-4 lg:h-4 2xl:w-5 2xl:h-5" />,
      cor: '#1877F2',
      link: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    },
    {
      nome: 'X (Twitter)',
      icone: <Twitter className="w-[13px] h-[13px] lg:w-4 lg:h-4 2xl:w-5 2xl:h-5" />,
      cor: '#000000',
      link: `https://twitter.com/intent/tweet?text=${texto}&url=${url}`,
    },
    {
      nome: 'LinkedIn',
      icone: <Linkedin className="w-[13px] h-[13px] lg:w-4 lg:h-4 2xl:w-5 2xl:h-5" />,
      cor: '#0A66C2',
      link: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    },
  ];

  const botaoClass =
    'inline-flex shrink-0 items-center justify-center w-7 h-7 lg:w-8 lg:h-8 2xl:w-9 2xl:h-9 rounded-full transition-transform duration-200 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8b800]';

  return (
    <div className="flex flex-col gap-2" aria-label={`Compartilhar: ${titulo}`}>
      <div className="flex flex-nowrap items-center gap-1.5">
        {redes.map((rede) => (
          <button
            key={rede.nome}
            type="button"
            title={rede.nome}
            aria-label={`Compartilhar no ${rede.nome}`}
            onClick={(e) => abrir(e, rede.link)}
            className={botaoClass}
            style={{ backgroundColor: rede.cor, color: '#fff' }}
          >
            {rede.icone}
          </button>
        ))}

        {/* TikTok não tem link de compartilhamento na web: copia o link para colar no app */}
        <button
          type="button"
          title="TikTok (copia o link para colar no app)"
          aria-label="Copiar link para compartilhar no TikTok"
          onClick={(e) => copiarLink(e, 'tiktok')}
          className={botaoClass}
          style={{ backgroundColor: '#000', color: '#fff' }}
        >
          <img src="/tiktok-icon.png" alt="" className="w-[13px] h-[13px] lg:w-4 lg:h-4 2xl:w-5 2xl:h-5 object-contain" />
        </button>

        <button
          type="button"
          title="Copiar link"
          aria-label="Copiar link do artigo"
          onClick={(e) => copiarLink(e, 'link')}
          className={botaoClass}
          style={{ backgroundColor: GOLD, color: '#000' }}
        >
          {copiado ? <Check className="w-[13px] h-[13px] lg:w-4 lg:h-4 2xl:w-5 2xl:h-5" /> : <Link className="w-[13px] h-[13px] lg:w-4 lg:h-4 2xl:w-5 2xl:h-5" />}
        </button>
      </div>

      {copiado && (
        <span role="status" className="text-xs font-semibold" style={{ color: '#16a34a' }}>
          {copiado === 'tiktok' ? 'Link copiado! Cole no TikTok.' : 'Link copiado!'}
        </span>
      )}
    </div>
  );
}
