import { useEffect, useState } from 'react';
import { SOBRE_NOS_FOTOS_LOCAIS } from '../data/sobreFotos';

interface SobreNosFoto {
  id: number;
  titulo: string;
  imagem: string;
  ordem: number;
}

// ─── CONFIG ─────────────────────────────────────────────────────────────────
// Card width in em units (deve bater com o --w usado no .card no CSS)
const CARD_WIDTH_DESKTOP = '70em';
const CARD_WIDTH_TABLET = '36em';
const CARD_WIDTH_MOBILE = '22em';

function getCardWidth(): string {
  const vw = window.innerWidth;
  if (vw <= 480) return CARD_WIDTH_MOBILE;
  if (vw <= 768) return CARD_WIDTH_TABLET;
  return CARD_WIDTH_DESKTOP;
}
// ────────────────────────────────────────────────────────────────────────────

export default function CurvedCarousel() {
  // Fotos sempre do próprio build (public/carrossel/); a API do admin não é consultada.
  const fotos: SobreNosFoto[] = SOBRE_NOS_FOTOS_LOCAIS;
  const [cardWidth, setCardWidth] = useState(CARD_WIDTH_DESKTOP);

  useEffect(() => {
    const update = () => setCardWidth(getCardWidth());
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  if (fotos.length === 0) return null;

  return (
    <div className="carousel-3d -mt-[2em] sm:-mt-[10em]">
    <div className="scene">
      <div
        className="a3d"
        style={{
          '--n': fotos.length,
        } as React.CSSProperties}
      >
        {fotos.map((foto, i) => (
          <img
            key={foto.id}
            src={foto.imagem}
            alt={foto.titulo || `Foto ${i + 1}`}
            className="card"
            style={{
              '--i': i,
              '--w': cardWidth,
            } as React.CSSProperties}
            draggable={false}
          />
        ))}
      </div>
    </div>
    </div>
  );
}
