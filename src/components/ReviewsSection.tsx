import { Star } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { reviews, googleRating } from '../data/reviews';

function GoogleLogo({ size = 28 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-label="Google">
      <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z" />
      <path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z" />
    </svg>
  );
}

function initialsOf(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');
}

const allReviews = [...reviews, ...reviews, ...reviews, ...reviews, ...reviews, ...reviews];

function ReviewCard({ review }: { review: (typeof reviews)[0] }) {
  return (
    <div className="bg-white rounded-2xl p-3 sm:p-5 flex flex-col flex-shrink-0" style={{ width: 'min(340px, 80vw)', height: '220px' }}>
      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
        <div
          className="w-8 h-8 sm:w-11 sm:h-11 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: '#e8f0fe', color: '#4285F4', fontSize: '0.8rem', fontWeight: 700 }}
        >
          {initialsOf(review.name)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-gray-900 font-semibold truncate text-sm sm:text-base">{review.name}</p>
          {review.date && <p className="text-gray-400 text-xs">{review.date}</p>}
        </div>
        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center flex-shrink-0 shadow-sm">
          <span className="font-bold text-xs sm:text-sm" style={{ color: '#4285F4' }}>G</span>
        </div>
      </div>
      <div className="flex gap-0.5 mb-1 sm:mb-2">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star key={s} size={14} fill="#e8b800" color="#e8b800" />
        ))}
        <span className="ml-2 text-blue-600 font-semibold text-xs sm:text-sm">✓</span>
      </div>
      <p className="text-gray-600 leading-snug flex-1 text-xs sm:text-sm overflow-hidden">{review.text}</p>
      <button className="text-blue-600 font-semibold mt-1 sm:mt-2 hover:underline self-start text-xs sm:text-sm">Leia mais</button>
    </div>
  );
}

export default function ReviewsSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const container = containerRef.current;
    if (!track || !container) return;
    let animId: number;
    let pos = 0;
    const speed = 0.5;
    const gap = 16;
    let cardWidth = 464;

    function measure() {
      if (!track) return;
      const firstCard = track.firstElementChild as HTMLElement | null;
      if (firstCard) {
        cardWidth = firstCard.clientWidth + gap;
      }
    }

    measure();
    window.addEventListener('resize', measure);

    function animate() {
      pos -= speed;
      const totalWidth = cardWidth * reviews.length;
      if (Math.abs(pos) >= totalWidth) {
        pos = 0;
      }
      if (track) {
        track.style.transform = `translateX(${pos}px)`;
      }
      animId = requestAnimationFrame(animate);
    }

    animId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', measure);
    };
  }, []);

  return (
    <section
      className="py-16 sm:py-20 overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #2645D9 0%, #3d5fe6 50%, #1e35b3 100%)' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6" ref={containerRef}>
        <div className="text-center mb-8 sm:mb-12 reveal">
          <h2
            className="font-medium tracking-wide text-4xl sm:text-5xl md:text-6xl mb-6"
            style={{ fontFamily: 'Montserrat', letterSpacing: '0.04em' }}
          >
            <span className="reviews-shine">O que nossos clientes dizem</span>
            <span className="reviews-dot">.</span>
          </h2>
          <style>{`
            .reviews-shine {
              background-image:
                linear-gradient(115deg,
                  rgba(255, 255, 255, 0) 0%,
                  rgba(255, 255, 255, 0) 42%,
                  rgba(255, 255, 255, 0.95) 50%,
                  rgba(255, 255, 255, 0) 58%,
                  rgba(255, 255, 255, 0) 100%),
                linear-gradient(160deg, #0a1a6e 0%, #1235b5 45%, #2645D9 100%);
              background-size: 250% 100%, 100% 100%;
              background-position: 100% 0, 0 0;
              background-repeat: no-repeat;
              -webkit-background-clip: text;
              background-clip: text;
              color: transparent;
              animation: reviews-shine-move 9s linear infinite;
            }
            @keyframes reviews-shine-move {
              0% { background-position: 100% 0, 0 0; }
              100% { background-position: -100% 0, 0 0; }
            }
            .reviews-dot {
              color: #e8b800;
              animation: reviews-dot 9s linear infinite;
            }
            @keyframes reviews-dot {
              0%, 86% { color: #e8b800; }
              93%, 100% { color: #2645D9; }
            }
          `}</style>
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
            <span className="text-white font-semibold text-base sm:text-lg">
              Avaliações feitas
              <p>pelos nossos clientes:</p> 
            </span>
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center justify-center gap-3">
                <a
                  href="https://share.google/KJlykXZu3F1HkWLfe"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Ver avaliações no Google"
                  className="flex items-center justify-center rounded-full bg-white shadow-md hover:brightness-95 transition"
                  style={{ width: 56, height: 56 }}
                >
                  <GoogleLogo size={34} />
                </a>
                <span
                  className="font-bold text-white leading-none"
                  style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}
                >
                  {googleRating.score}
                </span>
              </div>
              <div className="flex justify-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={20} fill="#e8b800" color="#e8b800" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="reveal"
        style={{
          overflow: 'hidden',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0, black 40px, black calc(100% - 40px), transparent 100%)',
          maskImage: 'linear-gradient(to right, transparent 0, black 40px, black calc(100% - 40px), transparent 100%)',
        }}
      >
        <div className="flex gap-4" ref={trackRef} style={{ width: 'max-content', willChange: 'transform' }}>
          {allReviews.map((review, i) => (
            <ReviewCard key={`${review.name}-${i}`} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}
