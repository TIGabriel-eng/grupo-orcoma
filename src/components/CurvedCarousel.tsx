import { useEffect, useState } from 'react';
import { apiUrl } from '../config/api';

interface SobreNosFoto {
  id: number;
  titulo: string;
  imagem: string;
  ordem: number;
}

// ─── CONFIG ─────────────────────────────────────────────────────────────────
// Card width in em units (deve bater com o --w usado no .card no CSS)
const CARD_WIDTH_DESKTOP = '38.06em';
const CARD_WIDTH_TABLET = '20.88em';
const CARD_WIDTH_MOBILE = '13.92em';

function getCardWidth(): string {
  const vw = window.innerWidth;
  if (vw <= 480) return CARD_WIDTH_MOBILE;
  if (vw <= 768) return CARD_WIDTH_TABLET;
  return CARD_WIDTH_DESKTOP;
}
// ────────────────────────────────────────────────────────────────────────────

export default function CurvedCarousel() {
  const [fotos, setFotos] = useState<SobreNosFoto[]>([]);
  const [cardWidth, setCardWidth] = useState(CARD_WIDTH_DESKTOP);

  useEffect(() => {
    const update = () => setCardWidth(getCardWidth());
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch(apiUrl('/api/sobre-nos-fotos/'))
      .then((res) => res.json())
      .then((data) => {
        const list: SobreNosFoto[] = (data.fotos || []).filter(
          (f: { imagem: string }) => f.imagem
        );
        if (!cancelled && list.length > 0) {
          setFotos(list);
        }
      })
      .catch((err) => {
        console.error('[CurvedCarousel] Erro ao carregar fotos do Sobre Nós:', err);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (fotos.length === 0) return null;

  return (
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
  );
}
