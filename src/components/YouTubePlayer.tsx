import { useState, useEffect, useRef } from 'react';

interface YouTubePlayerProps {
  videoId: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  rel?: boolean;
  modestBranding?: boolean;
  className?: string;
  iframeClassName?: string;
  style?: React.CSSProperties;
  /** Lazy: injeta o iframe após a thumbnail carregar ou ao entrar no viewport (quando loadOnVisible). */
  lazy?: boolean;
  loadOnVisible?: boolean;
  eager?: boolean;
}

function getThumbnailUrl(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

function buildEmbedUrl(
  videoId: string,
  opts: {
    autoplay?: boolean;
    loop?: boolean;
    muted?: boolean;
    controls?: boolean;
    rel?: boolean;
    modestBranding?: boolean;
  }
): string {
  const params = new URLSearchParams();
  if (opts.autoplay) params.set('autoplay', '1');
  if (opts.loop) {
    params.set('loop', '1');
    params.set('playlist', videoId);
  }
  if (opts.muted) params.set('mute', '1');
  if (opts.controls === false) params.set('controls', '0');
  if (opts.rel === false) params.set('rel', '0');
  if (opts.modestBranding) params.set('modestbranding', '1');
  params.set('playsinline', '1');
  params.set('iv_load_policy', '3');
  params.set('disablekb', '1');
  params.set('fs', '0');
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

export default function YouTubePlayer({
  videoId,
  autoplay = false,
  loop = false,
  muted = true,
  controls = true,
  rel = false,
  modestBranding = true,
  className = '',
  iframeClassName = '',
  style,
  lazy = false,
  loadOnVisible = true,
  eager = false,
}: YouTubePlayerProps) {
  const [loaded, setLoaded] = useState(eager);
  const containerRef = useRef<HTMLDivElement>(null);

  // Carrega o iframe quando a thumbnail termina de carregar (lightweight start)
  const onThumbnailLoad = () => {
    if (!loaded) setLoaded(true);
  };

  useEffect(() => {
    if (eager || loaded) return;

    const node = containerRef.current;
    if (!node) return;

    if (!loadOnVisible && !lazy) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          if (!loaded) setLoaded(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px 0px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [eager, loaded, loadOnVisible, lazy]);

  const embedUrl = buildEmbedUrl(videoId, { autoplay, loop, muted, controls, rel, modestBranding });
  const thumbnailUrl = getThumbnailUrl(videoId);

  return (
    <div ref={containerRef} className={className} style={{ position: 'relative', overflow: 'hidden', width: '100%', height: '100%', ...style }}>
      {/* Thumbnail */}
      {!loaded && (
        <img
          src={thumbnailUrl}
          alt=""
          loading="lazy"
          onLoad={onThumbnailLoad}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0,
            transition: 'opacity 0.3s ease',
            zIndex: 1,
          }}
        />
      )}

      {/* Iframe */}
      {loaded && (
        <iframe
          className={iframeClassName}
          src={embedUrl}
          title=""
          allow="autoplay; encrypted-media"
          tabIndex={-1}
          style={iframeClassName ? { border: 'none', pointerEvents: 'none' } : {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
}
