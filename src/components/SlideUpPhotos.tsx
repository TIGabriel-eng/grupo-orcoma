import { useEffect, useState } from 'react';

interface SlideUpPhotosProps {
  fotos: string[];
  intervaloMs?: number;
}

// Fotos entram de baixo para cima e saem para cima, uma por vez.
export default function SlideUpPhotos({ fotos, intervaloMs = 4000 }: SlideUpPhotosProps) {
  const [atual, setAtual] = useState(0);

  useEffect(() => {
    if (fotos.length < 2) return;
    const timer = setInterval(() => {
      setAtual((i) => (i + 1) % fotos.length);
    }, intervaloMs);
    return () => clearInterval(timer);
  }, [fotos.length, intervaloMs]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {fotos.map((src, i) => {
        // posição relativa à foto atual: 0 = visível, 1 = esperando embaixo, resto = já saiu
        const posicao = (i - atual + fotos.length) % fotos.length;
        const estilo =
          posicao === 0
            ? { transform: 'translateY(0)', opacity: 1 }
            : posicao === 1
              ? { transform: 'translateY(100%)', opacity: 0 }
              : { transform: 'translateY(-100%)', opacity: 0 };

        return (
          <img
            key={src}
            src={src}
            alt=""
            className="absolute inset-0 w-full h-full object-cover transition-all duration-[900ms] ease-in-out"
            style={estilo}
          />
        );
      })}
    </div>
  );
}
